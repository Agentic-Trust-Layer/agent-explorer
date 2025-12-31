import { createD1Database } from '../db-d1';
import { fetchAgentverseSearchAgentsPage, type AgentverseAgent } from './agentverse-api';

type AnyDb = any;

async function tryExec(db: AnyDb, sql: string): Promise<void> {
  try {
    await db.exec(sql);
  } catch {
    // ignore best-effort upgrades
  }
}

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
        agentverseRating REAL,
        agentverseInteractions INTEGER,
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

  // Best-effort schema upgrades for existing DBs.
  await tryExec(db, `ALTER TABLE agents ADD COLUMN agentverseRating REAL;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN agentverseInteractions INTEGER;`);
  await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_agentverseRating ON agents(agentverseRating);`);
  await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_agentverseInteractions ON agents(agentverseInteractions);`);
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

function parseTimeSeconds(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    // Heuristic: treat big numbers as ms.
    const n = value > 2_000_000_000_000 ? Math.floor(value / 1000) : Math.floor(value);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof value === 'string' && value.trim()) {
    const ms = Date.parse(value);
    if (Number.isFinite(ms)) return Math.floor(ms / 1000);
    const asNum = Number(value);
    if (Number.isFinite(asNum)) return parseTimeSeconds(asNum);
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

  const agentverseRating = extractNumber(a, ['rating', 'average_rating', 'avg_rating']);
  const agentverseInteractions = extractNumber(a, ['total_interactions', 'interactions', 'interaction_count']);

  const createdAtTime =
    parseTimeSeconds(a?.created_at) ??
    parseTimeSeconds(a?.createdAt) ??
    parseTimeSeconds(a?.createdAtTime) ??
    parseTimeSeconds(a?.profile?.created_at) ??
    parseTimeSeconds(a?.profile?.createdAt) ??
    Math.floor(Date.now() / 1000);

  const updatedAtTime =
    parseTimeSeconds(a?.updated_at) ??
    parseTimeSeconds(a?.updatedAt) ??
    parseTimeSeconds(a?.updatedAtTime) ??
    parseTimeSeconds(a?.profile?.updated_at) ??
    parseTimeSeconds(a?.profile?.updatedAt) ??
    createdAtTime;

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
        agentverseRating, agentverseInteractions,
        updatedAtTime
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId) DO UPDATE SET
        agentAddress=excluded.agentAddress,
        agentOwner=excluded.agentOwner,
        agentName=excluded.agentName,
        type=excluded.type,
        description=excluded.description,
        image=excluded.image,
        agentverseRating=excluded.agentverseRating,
        agentverseInteractions=excluded.agentverseInteractions,
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
      agentverseRating ?? null,
      agentverseInteractions ?? null,
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
  sort?: string;
  direction?: 'asc' | 'desc';
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

  const rawSort = (opts?.sort || process.env.AGENTVERSE_SORT || 'created-at').trim();
  const sort = rawSort.toLowerCase() === 'rating' ? 'interactions' : rawSort;
  const directionRaw = (opts?.direction || (process.env.AGENTVERSE_DIRECTION as any) || 'desc').toString().trim().toLowerCase();
  const direction: 'asc' | 'desc' = directionRaw === 'asc' ? 'asc' : 'desc';
  if (rawSort.toLowerCase() === 'rating') {
    console.warn('[agentverse-import] sort=rating is not supported by Agentverse search; using sort=interactions instead');
  }

  const checkpointKey = 'agentverseImportCursor';
  let startOffset = 0;
  if (reset) {
    await setCheckpoint(db, checkpointKey, JSON.stringify({ offset: 0, processed: 0, at: Math.floor(Date.now() / 1000) }));
  } else if (resumeEnabled) {
    const raw = await getCheckpoint(db, checkpointKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const o = Number(parsed?.offset ?? NaN);
        if (Number.isFinite(o) && o >= 0) startOffset = Math.trunc(o);
        // Back-compat with older {page}
        const p = Number(parsed?.page ?? NaN);
        if (!Number.isFinite(o) && Number.isFinite(p) && p >= 1) startOffset = (Math.trunc(p) - 1) * pageSize;
      } catch {
        // ignore
      }
    }
  }

  let processed = 0;
  for (let offset = startOffset; ; offset += pageSize) {
    const page = Math.floor(offset / pageSize) + 1;
    if (maxPages && page > maxPages) break;
    const resp = await fetchAgentverseSearchAgentsPage({ baseUrl, offset, limit: pageSize, sort, direction });
    const items = (resp.agents || resp.items || resp.results || resp.data || []) as AgentverseAgent[];
    console.log('[agentverse-import] page', { page, offset, sort, direction, items: items.length });
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

    await setCheckpoint(db, checkpointKey, JSON.stringify({ offset: offset + items.length, processed, at: Math.floor(Date.now() / 1000) }));
    await sleep(delayMs);
  }

  return { processed };
}

export async function importAgentverseAgentsFromEnv(opts?: AgentverseImportOptions): Promise<{ processed: number }> {
  const db = await createAgentverseDbFromEnv();
  return await importAgentverseAgentsIntoD1(db, opts);
}


