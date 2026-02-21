import http from 'node:http';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
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
 * @property {Record<string, any>=} kbSummaryByChain
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

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function repoCwd() {
  const repoRoot = envString('REPO_ROOT', '');
  return repoRoot || process.cwd();
}

function tsxBinPaths(cwd) {
  const binName = process.platform === 'win32' ? 'tsx.cmd' : 'tsx';
  return [
    // Common with workspaces (hoisted linker): root bins are reachable from package scripts via PATH.
    path.join(cwd, 'node_modules', '.bin', binName),
    // Common with isolated linker: per-package bins.
    path.join(cwd, 'apps', 'sync', 'node_modules', '.bin', binName),
  ];
}

function spawnAndCapture(cmd, args, opts, onChunk) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { ...opts, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.on('data', (d) => onChunk(String(d)));
    child.stderr.on('data', (d) => onChunk(String(d)));
    child.on('error', reject);
    child.on('close', (c) => resolve(typeof c === 'number' ? c : 0));
  });
}

let _ensureDepsPromise = null;
async function ensureWorkspaceDeps(job) {
  // De-dupe installs across concurrent requests.
  if (_ensureDepsPromise) return _ensureDepsPromise;

  _ensureDepsPromise = (async () => {
    try {
    const cwd = repoCwd();
    const tsxBins = tsxBinPaths(cwd);
    const haveTsx = tsxBins.find((p) => fileExists(p));
    if (haveTsx) return;

    appendLog(job, `[runner] deps missing (tsx not found). Installing workspace deps (incl devDeps)...\n`);

    // Prefer frozen installs (production-safe).
    // Force devDependencies even if NODE_ENV=production (tsx is a devDependency of apps/sync).
    // See: https://pnpm.io/9.x/cli/install#--prod--p
    const installArgs = ['-w', 'install', '--frozen-lockfile', '--prod=false'];
    const code = await spawnAndCapture('pnpm', installArgs, { cwd, env: { ...process.env } }, (chunk) => appendLog(job, chunk));
    if (code === 0) {
      appendLog(job, `[runner] pnpm install completed.\n`);
      const haveAfter = tsxBins.find((p) => fileExists(p));
      if (!haveAfter) {
        appendLog(job, `[runner] tsx not found at: ${tsxBins.join(', ')}\n`);
        // Try a targeted install for the sync workspace (sometimes workspaces are configured not to recurse).
        const codeSync = await spawnAndCapture(
          'pnpm',
          ['--filter', 'sync', 'install', '--frozen-lockfile', '--prod=false'],
          { cwd, env: { ...process.env } },
          (chunk) => appendLog(job, chunk),
        );
        if (codeSync === 0) {
          const haveAfter2 = tsxBins.find((p) => fileExists(p));
          if (haveAfter2) return;
        }
        throw new Error(`pnpm install succeeded but tsx is still missing. Looked in: ${tsxBins.join(', ')}`);
      }
      return;
    }

    // Optional fallback if lockfile mismatch; opt-in only.
    const allowNonFrozen = envString('ALLOW_NON_FROZEN_INSTALL', '').toLowerCase() === '1';
    if (!allowNonFrozen) {
      throw new Error(`pnpm install failed (exitCode=${code}). If this is a lockfile mismatch, rebuild the image or set ALLOW_NON_FROZEN_INSTALL=1.`);
    }

    appendLog(job, `[runner] pnpm install --frozen-lockfile failed; retrying --no-frozen-lockfile (ALLOW_NON_FROZEN_INSTALL=1)\n`);
    const code2 = await spawnAndCapture('pnpm', ['-w', 'install', '--no-frozen-lockfile'], { cwd, env: { ...process.env } }, (chunk) =>
      appendLog(job, chunk),
    );
    if (code2 !== 0) throw new Error(`pnpm install --no-frozen-lockfile failed (exitCode=${code2})`);
    } catch (e) {
      // Allow retry on next job.
      _ensureDepsPromise = null;
      throw e;
    }
  })();

  return _ensureDepsPromise;
}

let _ensureBuildPromise = null;
async function ensureHcsCoreBuilt(job) {
  if (_ensureBuildPromise) return _ensureBuildPromise;

  _ensureBuildPromise = (async () => {
    try {
    const cwd = repoCwd();
    const builtMarker = path.join(cwd, 'packages', 'hcs-core', 'dist', 'rdf', 'common.js');
    if (fileExists(builtMarker)) return;

    appendLog(job, `[runner] building @agentictrust/hcs-core (missing ${builtMarker})...\n`);
    const code = await spawnAndCapture(
      'pnpm',
      ['-w', '-s', '--filter', '@agentictrust/hcs-core', 'build'],
      { cwd, env: { ...process.env } },
      (chunk) => appendLog(job, chunk),
    );
    if (code !== 0) throw new Error(`failed to build @agentictrust/hcs-core (exitCode=${code})`);
    if (!fileExists(builtMarker)) throw new Error(`@agentictrust/hcs-core build completed but ${builtMarker} is still missing`);
    appendLog(job, `[runner] @agentictrust/hcs-core build completed.\n`);
    } catch (e) {
      _ensureBuildPromise = null;
      throw e;
    }
  })();

  return _ensureBuildPromise;
}

function graphdbConfigFromEnv() {
  const baseUrl = envString('GRAPHDB_BASE_URL', '');
  const repository = envString('GRAPHDB_REPOSITORY', '');
  const username = envString('GRAPHDB_USERNAME', '');
  const password = envString('GRAPHDB_PASSWORD', '');
  return { baseUrl, repository, username, password };
}

function basicAuthHeader(username, password) {
  if (!username || !password) return null;
  const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  return `Basic ${token}`;
}

function chainContext(chainId) {
  return `https://www.agentictrust.io/graph/data/subgraph/${Math.trunc(Number(chainId))}`;
}

function envOrEmpty(key) {
  const v = process.env[key];
  return typeof v === 'string' ? v.trim() : '';
}

function ensParentNameForTargetChain(targetChainId) {
  const chainId = Math.trunc(Number(targetChainId));
  const base =
    chainId === 59144 || chainId === 59140
      ? envOrEmpty('NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME_LINEA')
      : chainId === 11155111
        ? envOrEmpty('NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME_SEPOLIA')
        : chainId === 84532
          ? envOrEmpty('NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME_BASE_SEPOLIA')
          : envOrEmpty('NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME');
  const name = (base || '8004-agent').trim();
  if (!name) return '8004-agent.eth';
  return name.endsWith('.eth') ? name : `${name}.eth`;
}

async function sparqlCount({ baseUrl, repository, authHeader, sparql, timeoutMs = 15000 }) {
  const endpoint = `${baseUrl.replace(/\/+$/, '')}/repositories/${encodeURIComponent(repository)}`;
  const controller = new AbortController();
  const t = setTimeout(() => {
    try {
      controller.abort();
    } catch {}
  }, timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        accept: 'application/sparql-results+json',
        'content-type': 'application/sparql-query',
        ...(authHeader ? { authorization: authHeader } : {}),
      },
      body: sparql,
      signal: controller.signal,
    });
    const text = await res.text().catch(() => '');
    if (!res.ok) throw new Error(`GraphDB SPARQL HTTP ${res.status}: ${text.slice(0, 500)}`);
    const json = text ? JSON.parse(text) : null;
    const b0 = json?.results?.bindings?.[0];
    const raw = b0?.count?.value ?? b0?.c?.value ?? null;
    const n = raw != null ? Number(raw) : NaN;
    return Number.isFinite(n) ? Math.trunc(n) : 0;
  } finally {
    clearTimeout(t);
  }
}

async function kbCountsForChain(chainId) {
  const { baseUrl, repository, username, password } = graphdbConfigFromEnv();
  if (!baseUrl || !repository) {
    return { chainId, skipped: true, reason: 'GRAPHDB_BASE_URL/GRAPHDB_REPOSITORY not set' };
  }
  const authHeader = basicAuthHeader(username, password);
  const ctx = chainContext(chainId);
  const prefixes = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
  ].join('\n');

  const totalAgents = await sparqlCount({
    baseUrl,
    repository,
    authHeader,
    sparql: `${prefixes}\nSELECT (COUNT(DISTINCT ?agent) AS ?count) WHERE { GRAPH <${ctx}> { ?agent a core:AIAgent . } }`,
  });
  const smartAgents = await sparqlCount({
    baseUrl,
    repository,
    authHeader,
    sparql: `${prefixes}\nSELECT (COUNT(DISTINCT ?agent) AS ?count) WHERE { GRAPH <${ctx}> { ?agent a core:AISmartAgent . } }`,
  });
  const erc8004Agents = await sparqlCount({
    baseUrl,
    repository,
    authHeader,
    sparql: `${prefixes}\nSELECT (COUNT(DISTINCT ?agent) AS ?count) WHERE { GRAPH <${ctx}> { ?agent a core:AIAgent ; core:hasIdentity ?id . ?id a erc8004:AgentIdentity8004 . } }`,
  });

  const ensParent = ensParentNameForTargetChain(chainId);
  const ensSuffix = `.${ensParent}`.toLowerCase();
  const ensNamesTotal = await sparqlCount({
    baseUrl,
    repository,
    authHeader,
    sparql: `${prefixes}\nSELECT (COUNT(DISTINCT ?ensName) AS ?count) WHERE { GRAPH <${ctx}> { ?n a eth:AgentNameENS ; eth:ensName ?ensName . } }`,
  });
  const ensNamesUnderOrg = await sparqlCount({
    baseUrl,
    repository,
    authHeader,
    sparql:
      `${prefixes}\n` +
      `SELECT (COUNT(DISTINCT ?ensName) AS ?count) WHERE {\n` +
      `  GRAPH <${ctx}> { ?n a eth:AgentNameENS ; eth:ensName ?ensName . }\n` +
      `  FILTER(STRENDS(LCASE(STR(?ensName)), "${ensSuffix.replace(/"/g, '\\"')}"))\n` +
      `}`,
  });
  const smartAgentsWithEnsUnderOrg = await sparqlCount({
    baseUrl,
    repository,
    authHeader,
    sparql:
      `${prefixes}\n` +
      `SELECT (COUNT(DISTINCT ?agent) AS ?count) WHERE {\n` +
      `  GRAPH <${ctx}> {\n` +
      `    ?agent a core:AISmartAgent ; core:hasName ?n .\n` +
      `    ?n a eth:AgentNameENS ; eth:ensName ?ensName .\n` +
      `  }\n` +
      `  FILTER(STRENDS(LCASE(STR(?ensName)), "${ensSuffix.replace(/"/g, '\\"')}"))\n` +
      `}`,
  });

  return {
    chainId: Math.trunc(Number(chainId)),
    ctx,
    totalAgents,
    smartAgents,
    erc8004Agents,
    ensParent,
    ensNamesTotal,
    ensNamesUnderOrg,
    smartAgentsWithEnsUnderOrg,
  };
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

  const cwd = repoCwd();

  const limit = typeof opts?.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : null;
  const agentIdsCsv = typeof opts?.agentIdsCsv === 'string' && opts.agentIdsCsv.trim() ? opts.agentIdsCsv.trim() : null;
  const ensureAgent = opts?.ensureAgent === true;
  const runAssertionSummaries = opts?.runAssertionSummaries !== false;

  const runOne = async (chainId) => {
    await ensureWorkspaceDeps(job);
    await ensureHcsCoreBuilt(job);
    appendLog(job, `\n[job] chainId=${chainId} spawning: pnpm --filter sync sync:agent-pipeline\n`);

    const args = ['--filter', 'sync', 'sync:agent-pipeline'];
    const extra = [];
    if (limit != null) extra.push(`--limit=${limit}`);
    if (agentIdsCsv) extra.push(`--agent-ids=${agentIdsCsv}`);
    if (ensureAgent) extra.push(`--ensure-agent`);
    if (extra.length) args.push('--', ...extra);

    const code = await spawnAndCapture(
      'pnpm',
      args,
      { cwd, env: { ...process.env, SYNC_CHAIN_ID: String(chainId) } },
      (chunk) => appendLog(job, chunk),
    );
    appendLog(job, `\n[job] chainId=${chainId} exitCode=${code}\n`);
    if (code !== 0) return code;

    if (runAssertionSummaries) {
      // Option B: run assertion-summaries after the pipeline so review counts stay fresh.
      // Fast path: if the job was invoked with --agent-ids, only recompute for those.
      // Slow path (default): recompute for the chain (keeps data correct even when no new agents).
      const sumArgs = ['--filter', 'sync', 'sync:assertion-summaries'];
      const sumExtra = [];
      if (agentIdsCsv) sumExtra.push(`--agent-ids=${agentIdsCsv}`);
      if (sumExtra.length) sumArgs.push('--', ...sumExtra);
      appendLog(
        job,
        `\n[job] chainId=${chainId} spawning: pnpm --filter sync sync:assertion-summaries${agentIdsCsv ? ` -- --agent-ids=${agentIdsCsv}` : ''}\n`,
      );
      const sumCode = await spawnAndCapture(
        'pnpm',
        sumArgs,
        { cwd, env: { ...process.env, SYNC_CHAIN_ID: String(chainId) } },
        (chunk) => appendLog(job, chunk),
      );
      appendLog(job, `\n[job] chainId=${chainId} assertion-summaries exitCode=${sumCode}\n`);
      if (sumCode !== 0) return sumCode;
    }
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

      // Best-effort KB summary per chain (never fail the job if this errors).
      try {
        const summary = await kbCountsForChain(chainId);
        if (!job.kbSummaryByChain) job.kbSummaryByChain = {};
        job.kbSummaryByChain[String(chainId)] = summary;
        appendLog(job, `\n[kb-summary] ${JSON.stringify(summary)}\n`);
      } catch (e) {
        appendLog(job, `\n[kb-summary] failed chainId=${chainId} error=${String(e?.message || e || '')}\n`);
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

