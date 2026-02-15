import http from 'node:http';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { URL } from 'node:url';

/** @typedef {'queued'|'running'|'completed'|'failed'} JobStatus */

/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {number[]} chainIds
 * @property {JobStatus} status
 * @property {number} createdAt
 * @property {number|null} startedAt
 * @property {number|null} endedAt
 * @property {number|null} exitCode
 * @property {string|null} error
 * @property {string} log
 */

/** @type {Map<string, Job>} */
const jobs = new Map();
/** @type {Map<number, string>} */
const runningJobByChainId = new Map(); // chainId -> jobId

function envString(key, fallback = '') {
  const v = process.env[key];
  return typeof v === 'string' && v.trim() ? v.trim() : fallback;
}

function json(res, status, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let buf = '';
    req.on('data', (d) => {
      buf += d;
      if (buf.length > 1_000_000) {
        // 1MB cap
        req.destroy();
      }
    });
    req.on('end', () => resolve(buf));
    req.on('error', () => resolve(''));
  });
}

function appendLog(job, chunk) {
  const maxChars = 250_000;
  job.log = (job.log + chunk).slice(-maxChars);
}

function parseChainIds(input) {
  const xs = Array.isArray(input) ? input : [];
  const out = [];
  const seen = new Set();
  for (const x of xs) {
    const n = Math.trunc(Number(x));
    if (!Number.isFinite(n) || n <= 0) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

async function runJob(job, opts) {
  job.status = 'running';
  job.startedAt = Date.now();
  appendLog(job, `[job] start ${new Date(job.startedAt).toISOString()} chainIds=${job.chainIds.join(',')}\n`);

  const repoRoot = envString('REPO_ROOT', '');
  const cwd = repoRoot || process.cwd();

  const limit = typeof opts?.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : null;
  const agentIdsCsv = typeof opts?.agentIdsCsv === 'string' && opts.agentIdsCsv.trim() ? opts.agentIdsCsv.trim() : null;
  const ensureAgent = opts?.ensureAgent === true;

  const runOne = async (chainId) => {
    appendLog(job, `\n[job] chainId=${chainId} spawning: pnpm --filter sync sync:agent-pipeline\n`);

    const args = ['--filter', 'sync', 'sync:agent-pipeline'];
    const extra = [];
    if (limit != null) extra.push(`--limit=${limit}`);
    if (agentIdsCsv) extra.push(`--agent-ids=${agentIdsCsv}`);
    if (ensureAgent) extra.push(`--ensure-agent`);
    if (extra.length) args.push('--', ...extra);

    const child = spawn('pnpm', args, {
      cwd,
      env: { ...process.env, SYNC_CHAIN_ID: String(chainId) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (d) => appendLog(job, String(d)));
    child.stderr.on('data', (d) => appendLog(job, String(d)));

    const code = await new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('close', (c) => resolve(typeof c === 'number' ? c : 0));
    });
    appendLog(job, `\n[job] chainId=${chainId} exitCode=${code}\n`);
    return code;
  };

  try {
    for (const chainId of job.chainIds) {
      const code = await runOne(chainId);
      if (code !== 0) {
        job.status = 'failed';
        job.exitCode = code;
        job.endedAt = Date.now();
        job.error = `sync:agent-pipeline failed for chainId=${chainId} (exitCode=${code})`;
        appendLog(job, `[job] failed ${new Date(job.endedAt).toISOString()} error=${job.error}\n`);
        return;
      }
    }
    job.status = 'completed';
    job.exitCode = 0;
    job.endedAt = Date.now();
    appendLog(job, `[job] completed ${new Date(job.endedAt).toISOString()}\n`);
  } catch (e) {
    job.status = 'failed';
    job.exitCode = job.exitCode ?? 1;
    job.endedAt = Date.now();
    job.error = String(e?.message || e || '');
    appendLog(job, `[job] failed ${new Date(job.endedAt).toISOString()} error=${job.error}\n`);
  } finally {
    for (const cid of job.chainIds) {
      const cur = runningJobByChainId.get(cid);
      if (cur === job.id) runningJobByChainId.delete(cid);
    }
  }
}

const server = http.createServer(async (req, res) => {
  const method = String(req.method || 'GET').toUpperCase();
  const u = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (u.pathname === '/health' && method === 'GET') {
    return json(res, 200, { ok: true, service: 'sync-runner', ts: new Date().toISOString() });
  }

  if (u.pathname === '/run' && method === 'POST') {
    const raw = await readBody(req);
    /** @type {any} */
    let body = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return json(res, 400, { error: 'invalid json body' });
    }

    const chainIds = parseChainIds(body?.chainIds);
    if (!chainIds.length) return json(res, 400, { error: 'chainIds is required (array of ints)' });

    // Concurrency guard per chain
    const running = chainIds
      .map((cid) => ({ chainId: cid, jobId: runningJobByChainId.get(cid) ?? null }))
      .filter((x) => x.jobId);
    if (running.length) return json(res, 409, { error: 'job already running for chain', running });

    const id = randomUUID();
    /** @type {Job} */
    const job = {
      id,
      chainIds,
      status: 'queued',
      createdAt: Date.now(),
      startedAt: null,
      endedAt: null,
      exitCode: null,
      error: null,
      log: '',
    };
    jobs.set(id, job);
    for (const cid of chainIds) runningJobByChainId.set(cid, id);

    void runJob(job, { limit: body?.limit ?? null, agentIdsCsv: body?.agentIdsCsv ?? null, ensureAgent: body?.ensureAgent ?? null });

    return json(res, 202, { ok: true, jobId: id, chainIds, statusUrl: `/jobs/${id}` });
  }

  const jobMatch = u.pathname.match(/^\/jobs\/([^/]+)$/);
  if (jobMatch && method === 'GET') {
    const id = decodeURIComponent(jobMatch[1] || '').trim();
    const job = id ? jobs.get(id) : null;
    if (!job) return json(res, 404, { error: 'job not found' });
    return json(res, 200, job);
  }

  return json(res, 404, { error: 'not found', path: u.pathname });
});

const port = Number(envString('PORT', '8787'));
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[sync-runner] listening on :${port}`);
});

