import { createD1Database } from '../db-d1';
import { fetchAgentverseAgentsPage, type AgentverseAgent } from './agentverse-api';

type AnyDb = any;

async function ensureAgentverseSchema(db: AnyDb): Promise<void> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        agentAddress TEXT NOT NULL,
        agentOwner TEXT NOT NULL,
        agentName TEXT NOT NULL,
        tokenUri TEXT,
        createdAtBlock INTEGER NOT NULL,
        createdAtTime INTEGER NOT NULL,
        type TEXT,
        description TEXT,
        image TEXT,
        a2aEndpoint TEXT,
        ensEndpoint TEXT,
        agentAccountEndpoint TEXT,
        agentCardJson TEXT,
        agentCardReadAt INTEGER,
        supportedTrust TEXT,
        rawJson TEXT,
        updatedAtTime INTEGER,
        PRIMARY KEY (chainId, agentId)
      );

      CREATE TABLE IF NOT EXISTS checkpoints (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_agents_chainId ON agents(chainId);
      CREATE INDEX IF NOT EXISTS idx_agents_agentOwner ON agents(agentOwner);
      CREATE INDEX IF NOT EXISTS idx_agents_createdAtTime ON agents(createdAtTime);
      CREATE INDEX IF NOT EXISTS idx_agents_agentName ON agents(agentName);
    `);
  } catch (e) {
    // Fail fast on Cloudflare D1 auth errors (otherwise the import will "succeed" with 0 rows).
    const msg = String((e as any)?.message || e);
    if (msg.includes('Authentication error') || msg.includes('D1 API error: 401')) {
      throw e;
    }
    console.warn('[agentverse-import] schema bootstrap failed', e);
  }
}

async function sleep(ms: number): Promise<void> {
  if (!ms || ms <= 0) return;
  await new Promise((r) => setTimeout(r, ms));
}

async function getCheckpoint(db: AnyDb, key: string): Promise<string | null> {
  try {
    const row = await db.prepare('SELECT value FROM checkpoints WHERE key = ?').get(key);
    const v = (row as any)?.value;
    return typeof v === 'string' ? v : null;
  } catch {
    return null;
  }
}

async function setCheckpoint(db: AnyDb, key: string, value: string): Promise<void> {
  try {
    await db.prepare('INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key, value);
  } catch {
    // ignore
  }
}

function extractString(obj: any, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

function extractNumber(obj: any, keys: string[]): number | null {
  for (const k of keys) {
    const v = obj?.[k];
    const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
    if (Number.isFinite(n)) return n;
  }
  return null;
}

async function upsertAgentFromAgentverse(db: AnyDb, chainId: number, row: AgentverseAgent): Promise<void> {
  const a: any = row;
  const agentId =
    extractString(a, ['address', 'agent_address', 'id', 'agentId', 'agent_id']) ||
    extractString(a?.profile, ['address', 'alias']) ||
    '';
  if (!agentId) return;

  const agentName =
    extractString(a, ['name', 'display_name']) ||
    extractString(a?.profile, ['display_name', 'name']) ||
    agentId;

  const description =
    extractString(a, ['description', 'bio']) || extractString(a?.profile, ['bio', 'description']);

  const image =
    extractString(a, ['image', 'avatar', 'avatar_url']) || extractString(a?.profile, ['avatar']);

  const createdAtTime =
    Math.floor(
      (extractNumber(a, ['created_at', 'createdAt', 'createdAtTime']) ??
        extractNumber(a?.profile, ['created_at', 'createdAt']) ??
        Date.now()) / 1000,
    ) || Math.floor(Date.now() / 1000);

  const updatedAtTime =
    Math.floor(
      (extractNumber(a, ['updated_at', 'updatedAt', 'updatedAtTime']) ??
        extractNumber(a?.profile, ['updated_at', 'updatedAt']) ??
        Date.now()) / 1000,
    ) || createdAtTime;

  const rawJson = JSON.stringify(row);

  await db
    .prepare(
      `
      INSERT INTO agents (
        chainId, agentId,
        agentAddress, agentOwner, agentName,
        tokenUri,
        createdAtBlock, createdAtTime,
        type, description, image,
        a2aEndpoint, ensEndpoint, agentAccountEndpoint,
        supportedTrust, rawJson,
        updatedAtTime
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId) DO UPDATE SET
        agentAddress=excluded.agentAddress,
        agentOwner=excluded.agentOwner,
        agentName=excluded.agentName,
        type=excluded.type,
        description=excluded.description,
        image=excluded.image,
        rawJson=excluded.rawJson,
        updatedAtTime=excluded.updatedAtTime
      `,
    )
    .run(
      chainId,
      agentId,
      agentId, // agentAddress placeholder
      'agentverse',
      agentName,
      null,
      0,
      createdAtTime,
      'AGENTVERSE',
      description || null,
      image || null,
      null,
      null,
      null,
      null,
      rawJson,
      updatedAtTime,
    );
}

export type AgentverseImportOptions = {
  baseUrl?: string; // default https://agentverse.ai
  holBaseUrl?: string; // unused (kept for CLI compat)
  pageSize?: number; // default 100
  maxPages?: number;
  chainId?: number; // default 0
  resume?: boolean; // default true
  reset?: boolean; // default false
  availableOnly?: boolean; // unused (Agentverse API may support later)
  logEach?: boolean; // default false
};

export async function createAgentverseDbFromEnv(): Promise<AnyDb> {
  const accountId = (process.env.AGENTVERSE_CLOUDFLARE_ACCOUNT_ID || '').trim();
  const databaseId = (process.env.AGENTVERSE_CLOUDFLARE_D1_DATABASE_ID || '').trim();
  const apiToken = (process.env.AGENTVERSE_CLOUDFLARE_API_TOKEN || '').trim();
  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      'Missing Agentverse D1 env. Expected AGENTVERSE_CLOUDFLARE_ACCOUNT_ID, AGENTVERSE_CLOUDFLARE_D1_DATABASE_ID, AGENTVERSE_CLOUDFLARE_API_TOKEN. ' +
        `Seen: { hasAccountId: ${Boolean(accountId)}, hasDatabaseId: ${Boolean(databaseId)}, hasApiToken: ${Boolean(apiToken)} }`,
    );
  }
  return createD1Database({ accountId, databaseId, apiToken });
}

export async function importAgentverseAgentsIntoD1(db: AnyDb, opts?: AgentverseImportOptions): Promise<{ processed: number }> {
  await ensureAgentverseSchema(db);

  const baseUrl = (opts?.baseUrl || process.env.AGENTVERSE_BASE_URL || 'https://agentverse.ai').trim();
  const pageSize = typeof opts?.pageSize === 'number' && opts.pageSize > 0 ? Math.trunc(opts.pageSize) : 100;
  const maxPages = typeof opts?.maxPages === 'number' && opts.maxPages > 0 ? Math.trunc(opts.maxPages) : undefined;
  const chainId = typeof opts?.chainId === 'number' ? Math.trunc(opts.chainId) : 0;
  const resumeEnabled = opts?.resume !== false;
  const reset = opts?.reset === true;
  const logEach = opts?.logEach === true || process.env.AGENTVERSE_LOG_EACH === '1';
  const delayMs = Number(process.env.AGENTVERSE_PAGE_DELAY_MS ?? 200) || 200;

  if (!process.env.AGENTVERSE_JWT || !process.env.AGENTVERSE_JWT.trim()) {
    throw new Error('Missing AGENTVERSE_JWT. Agentverse /v1/agents requires authentication.');
  }

  const checkpointKey = 'agentverseImportCursor';
  let startPage = 1;
  if (reset) {
    await setCheckpoint(db, checkpointKey, JSON.stringify({ page: 1, processed: 0, at: Math.floor(Date.now() / 1000) }));
  } else if (resumeEnabled) {
    const raw = await getCheckpoint(db, checkpointKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const p = Number(parsed?.page ?? NaN);
        if (Number.isFinite(p) && p >= 1) startPage = Math.trunc(p);
      } catch {
        // ignore
      }
    }
  }

  let processed = 0;
  for (let page = startPage; ; page++) {
    if (maxPages && page > maxPages) break;
    const resp = await fetchAgentverseAgentsPage({ baseUrl, page, limit: pageSize });
    const items = (resp.results || resp.data || resp.items || resp.agents || []) as AgentverseAgent[];
    console.log('[agentverse-import] page', { page, items: items.length });
    if (!items.length) break;

    for (const a of items) {
      const id: any = (a as any)?.address || (a as any)?.id || (a as any)?.agentId;
      try {
        await upsertAgentFromAgentverse(db, chainId, a);
        processed += 1;
        if (logEach) console.log('[agentverse-import] upsert ok', { page, id });
      } catch (e: any) {
        console.warn('[agentverse-import] upsert failed', { page, id, err: e?.message || String(e) });
      }
    }

    await setCheckpoint(db, checkpointKey, JSON.stringify({ page: page + 1, processed, at: Math.floor(Date.now() / 1000) }));
    await sleep(delayMs);
  }

  return { processed };
}

export async function importAgentverseAgentsFromEnv(opts?: AgentverseImportOptions): Promise<{ processed: number }> {
  const db = await createAgentverseDbFromEnv();
  return await importAgentverseAgentsIntoD1(db, opts);
}


