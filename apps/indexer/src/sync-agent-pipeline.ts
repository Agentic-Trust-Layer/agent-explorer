export type SyncJobStatus = 'queued' | 'running' | 'completed' | 'failed';

export type SyncJob = {
  id: string;
  kind: 'sync:agent-pipeline';
  chainIds: number[];
  status: SyncJobStatus;
  createdAt: number;
  startedAt: number | null;
  endedAt: number | null;
  exitCode: number | null;
  error: string | null;
  log: string;
};

const syncJobs = new Map<string, SyncJob>();
const runningJobByChainId = new Map<number, string>(); // chainId -> jobId

function isNodeEnv(): boolean {
  // Cloudflare Workers don't support spawning processes.
  // In Node, process.versions.node is defined.
  return typeof process !== 'undefined' && typeof process.versions === 'object' && typeof (process.versions as any).node === 'string';
}

function appendJobLog(job: SyncJob, chunk: string): void {
  const maxChars = 250_000;
  job.log = (job.log + chunk).slice(-maxChars);
}

function uniqInts(xs: number[]): number[] {
  const out: number[] = [];
  const seen = new Set<number>();
  for (const x of xs) {
    const n = Math.trunc(Number(x));
    if (!Number.isFinite(n) || n <= 0) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

export function parseChainIdsFromQueryParam(input: unknown): number[] {
  const raw = typeof input === 'string' ? input.trim().toLowerCase() : '';
  if (!raw || raw === 'all' || raw === 'main' || raw === 'main-chains') return [1, 59144];
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return uniqInts(parts.map((p) => Number(p)));
}

export function getSyncJob(jobId: string): SyncJob | null {
  const id = String(jobId || '').trim();
  return id ? syncJobs.get(id) ?? null : null;
}

export function getRunningJobsForChainIds(chainIds: number[]): Array<{ chainId: number; jobId: string }> {
  const out: Array<{ chainId: number; jobId: string }> = [];
  for (const cid of uniqInts(chainIds)) {
    const jobId = runningJobByChainId.get(cid);
    if (jobId) out.push({ chainId: cid, jobId });
  }
  return out;
}

async function runSyncAgentPipelineJob(
  job: SyncJob,
  opts: { limit?: number | null; agentIdsCsv?: string | null; ensureAgent?: boolean | null },
): Promise<void> {
  if (!isNodeEnv()) {
    job.status = 'failed';
    job.startedAt = Date.now();
    job.endedAt = Date.now();
    job.exitCode = 1;
    job.error = 'sync:agent-pipeline is not supported in this runtime (requires Node.js process spawning).';
    appendJobLog(job, `[job] failed: ${job.error}\n`);
    for (const cid of job.chainIds) {
      const cur = runningJobByChainId.get(cid);
      if (cur === job.id) runningJobByChainId.delete(cid);
    }
    return;
  }

  const { spawn } = await import('node:child_process');

  job.status = 'running';
  job.startedAt = Date.now();
  appendJobLog(job, `[job] start ${new Date(job.startedAt).toISOString()} chainIds=${job.chainIds.join(',')}\n`);

  const here = process.cwd();
  const cwd = here.endsWith('/apps/indexer') ? here.replace(/\/apps\/indexer$/, '') : here;

  const limit = typeof opts.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : null;
  const agentIdsCsv = typeof opts.agentIdsCsv === 'string' && opts.agentIdsCsv.trim() ? opts.agentIdsCsv.trim() : null;
  const ensureAgent = opts.ensureAgent === true;

  const runOne = async (chainId: number): Promise<number> => {
    appendJobLog(job, `\n[job] chainId=${chainId} spawning: pnpm --filter sync sync:agent-pipeline\n`);
    const args: string[] = ['--filter', 'sync', 'sync:agent-pipeline'];
    const extra: string[] = [];
    if (limit != null) extra.push(`--limit=${limit}`);
    if (agentIdsCsv) extra.push(`--agent-ids=${agentIdsCsv}`);
    if (ensureAgent) extra.push(`--ensure-agent`);
    if (extra.length) args.push('--', ...extra);

    const child = spawn('pnpm', args, {
      cwd,
      env: { ...process.env, SYNC_CHAIN_ID: String(chainId) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (d) => appendJobLog(job, String(d)));
    child.stderr.on('data', (d) => appendJobLog(job, String(d)));

    const code: number = await new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('close', (c) => resolve(typeof c === 'number' ? c : 0));
    });

    appendJobLog(job, `\n[job] chainId=${chainId} exitCode=${code}\n`);
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
        appendJobLog(job, `[job] failed ${new Date(job.endedAt).toISOString()} error=${job.error}\n`);
        return;
      }
    }
    job.status = 'completed';
    job.exitCode = 0;
    job.endedAt = Date.now();
    appendJobLog(job, `[job] completed ${new Date(job.endedAt).toISOString()}\n`);
  } catch (e: any) {
    job.status = 'failed';
    job.exitCode = job.exitCode ?? 1;
    job.endedAt = Date.now();
    job.error = String(e?.message || e || 'unknown error');
    appendJobLog(job, `[job] failed ${new Date(job.endedAt).toISOString()} error=${job.error}\n`);
  } finally {
    for (const cid of job.chainIds) {
      const cur = runningJobByChainId.get(cid);
      if (cur === job.id) runningJobByChainId.delete(cid);
    }
  }
}

export async function enqueueSyncAgentPipeline(args: {
  id: string;
  chainIds: number[];
  limit?: number | null;
  agentIdsCsv?: string | null;
  ensureAgent?: boolean | null;
}): Promise<SyncJob> {
  const id = String(args.id || '').trim();
  const chainIds = uniqInts(args.chainIds ?? []);
  if (!id) throw new Error('enqueueSyncAgentPipeline: id is required');
  if (!chainIds.length) throw new Error('enqueueSyncAgentPipeline: chainIds is required');

  const running = getRunningJobsForChainIds(chainIds);
  if (running.length) {
    const msg = `A sync job is already running for chainId(s): ${running.map((r) => r.chainId).join(', ')}`;
    throw new Error(msg);
  }

  const job: SyncJob = {
    id,
    kind: 'sync:agent-pipeline',
    chainIds,
    status: 'queued',
    createdAt: Date.now(),
    startedAt: null,
    endedAt: null,
    exitCode: null,
    error: null,
    log: '',
  };
  syncJobs.set(id, job);
  for (const cid of chainIds) runningJobByChainId.set(cid, id);

  // Fire-and-forget.
  void runSyncAgentPipelineJob(job, {
    limit: args.limit ?? null,
    agentIdsCsv: args.agentIdsCsv ?? null,
    ensureAgent: args.ensureAgent ?? null,
  });

  return job;
}

