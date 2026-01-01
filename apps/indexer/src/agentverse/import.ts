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

function normalizeNameKey(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim().toLowerCase();
  if (!s) return null;
  return s.replace(/\s+/g, ' ');
}

async function backfillInternalIds(db: AnyDb): Promise<void> {
  try {
    const maxRow = await db.prepare('SELECT COALESCE(MAX(internalId), 0) AS maxId FROM agents').get();
    let next = Number((maxRow as any)?.maxId ?? 0) || 0;
    const res = await db
      .prepare('SELECT chainId, agentId FROM agents WHERE internalId IS NULL ORDER BY createdAtTime ASC, agentId ASC')
      .all();
    const rows = (res as any)?.results || (res as any)?.rows || [];
    for (const r of rows) {
      const chainId = Number((r as any)?.chainId ?? 0) || 0;
      const agentId = String((r as any)?.agentId ?? '');
      if (!agentId) continue;
      next += 1;
      await db.prepare('UPDATE agents SET internalId = ? WHERE chainId = ? AND agentId = ? AND internalId IS NULL').run(next, chainId, agentId);
    }
  } catch {
    // ignore
  }
}

export async function ensureAgentverseSchema(db: AnyDb): Promise<void> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        internalId INTEGER,
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        agentAddress TEXT NOT NULL,
        agentOwner TEXT NOT NULL,
        agentName TEXT NOT NULL,
        nameNorm TEXT,
        isDuplicate INTEGER,
        duplicateOfInternalId INTEGER,
        duplicateReason TEXT,
        crossrefHolInternalId INTEGER,
        tokenUri TEXT,
        createdAtBlock INTEGER NOT NULL,
        createdAtTime INTEGER NOT NULL,
        agentCreatedAtTime INTEGER,
        type TEXT,
        description TEXT,
        image TEXT,
        a2aEndpoint TEXT,
        ensEndpoint TEXT,
        agentAccountEndpoint TEXT,
        primaryEndpoint TEXT,
        customEndpoint TEXT,
        prefix TEXT,
        detectedLanguage TEXT,
        version TEXT,
        alias TEXT,
        displayName TEXT,
        bio TEXT,
        rating REAL,
        totalInteractions INTEGER,
        availabilityScore REAL,
        availabilityLatencyMs INTEGER,
        availabilityStatus TEXT,
        availabilityCheckedAt INTEGER,
        availabilityReason TEXT,
        availabilitySource TEXT,
        available INTEGER,
        trustScore REAL,
        aiagentCreator TEXT,
        aiagentModel TEXT,
        oasfSkillsJson TEXT,
        capabilityLabelsJson TEXT,
        protocolsJson TEXT,
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
  await tryExec(db, `ALTER TABLE agents ADD COLUMN internalId INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN agentverseRating REAL;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN agentverseInteractions INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN nameNorm TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN isDuplicate INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN duplicateOfInternalId INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN duplicateReason TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN crossrefHolInternalId INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN agentCreatedAtTime INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN primaryEndpoint TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN customEndpoint TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN prefix TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN detectedLanguage TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN version TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN alias TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN displayName TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN bio TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN rating REAL;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN totalInteractions INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN availabilityScore REAL;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN availabilityLatencyMs INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN availabilityStatus TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN availabilityCheckedAt INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN availabilityReason TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN availabilitySource TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN available INTEGER;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN trustScore REAL;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN aiagentCreator TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN aiagentModel TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN oasfSkillsJson TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN capabilityLabelsJson TEXT;`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN protocolsJson TEXT;`);

  await tryExec(db, `CREATE UNIQUE INDEX IF NOT EXISTS idx_agents_internalId ON agents(internalId);`);
  await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_nameNorm ON agents(nameNorm);`);
  await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_isDuplicate ON agents(isDuplicate);`);
  await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_crossrefHolInternalId ON agents(crossrefHolInternalId);`);
  await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_agentverseRating ON agents(agentverseRating);`);
  await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_agentverseInteractions ON agents(agentverseInteractions);`);

  await backfillInternalIds(db);
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

  const available = a?.available === true ? 1 : a?.available === false ? 0 : null;
  const trustScore = extractNumber(a, ['trust_score', 'trustScore']);
  const prefix = extractString(a, ['prefix']) || extractString(a?.profile, ['prefix']);
  const detectedLanguage = extractString(a, ['language', 'detected_language']) || extractString(a?.profile, ['language']);
  const version = extractString(a, ['version']) || extractString(a?.profile, ['version']);
  const alias = extractString(a, ['alias']) || extractString(a?.profile, ['alias']) || agentId;
  const displayName = extractString(a, ['display_name', 'name']) || extractString(a?.profile, ['display_name', 'name']) || agentName;
  const bio = extractString(a, ['bio', 'description']) || extractString(a?.profile, ['bio', 'description']) || description;
  const rating = extractNumber(a, ['rating']) ?? agentverseRating;
  const totalInteractions = extractNumber(a, ['total_interactions']) ?? agentverseInteractions;
  const availabilityScore = extractNumber(a, ['availability_score']);
  const availabilityLatencyMs = extractNumber(a, ['availability_latency_ms', 'availabilityLatencyMs']);
  const availabilityStatus = extractString(a, ['availability_status', 'availabilityStatus']);
  const availabilityCheckedAt = parseTimeSeconds(extractString(a, ['availability_checked_at', 'availabilityCheckedAt']));
  const availabilityReason = extractString(a, ['availability_reason', 'availabilityReason']);
  const availabilitySource = extractString(a, ['availability_source', 'availabilitySource']);
  const primaryEndpoint =
    extractString(a, ['primary_endpoint', 'endpoint', 'url']) || extractString(a?.profile, ['primary_endpoint', 'endpoint', 'url']);
  const customEndpoint = extractString(a, ['custom_endpoint']) || extractString(a?.profile, ['custom_endpoint']);
  const aiagentCreator = extractString(a, ['creator']) || extractString(a?.profile, ['creator']);
  const aiagentModel = extractString(a, ['model']) || extractString(a?.profile, ['model']);
  const oasfSkillsJson = Array.isArray(a?.oasfSkills || a?.oasf_skills) ? JSON.stringify(a.oasfSkills || a.oasf_skills) : null;
  const capabilityLabelsJson = Array.isArray(a?.capabilityLabels || a?.capability_labels)
    ? JSON.stringify(a.capabilityLabels || a.capability_labels)
    : null;
  const protocolsJson = Array.isArray(a?.protocols) ? JSON.stringify(a.protocols) : null;

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
  const nameNorm = normalizeNameKey(displayName || agentName || agentId);

  await db
    .prepare(
      `
      INSERT INTO agents (
        internalId,
        chainId, agentId,
        nameNorm, isDuplicate, duplicateOfInternalId, duplicateReason,
        crossrefHolInternalId,
        agentAddress, agentOwner, agentName,
        tokenUri,
        createdAtBlock, createdAtTime,
        agentCreatedAtTime,
        type, description, image,
        a2aEndpoint, ensEndpoint, agentAccountEndpoint,
        primaryEndpoint, customEndpoint,
        prefix, detectedLanguage, version,
        alias, displayName, bio,
        rating, totalInteractions,
        availabilityScore, availabilityLatencyMs, availabilityStatus,
        availabilityCheckedAt, availabilityReason, availabilitySource,
        available, trustScore,
        aiagentCreator, aiagentModel,
        oasfSkillsJson, capabilityLabelsJson, protocolsJson,
        supportedTrust, rawJson,
        agentverseRating, agentverseInteractions,
        updatedAtTime
      )
      VALUES (
        (SELECT COALESCE(MAX(internalId), 0) + 1 FROM agents),
        ?, ?,
        ?, 0, NULL, NULL,
        NULL,
        ?, ?, ?,
        ?,
        ?, ?,
        ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?,
        ?
      )
      ON CONFLICT(chainId, agentId) DO UPDATE SET
        nameNorm=excluded.nameNorm,
        agentAddress=excluded.agentAddress,
        agentOwner=excluded.agentOwner,
        agentName=excluded.agentName,
        agentCreatedAtTime=excluded.agentCreatedAtTime,
        type=excluded.type,
        description=excluded.description,
        image=excluded.image,
        primaryEndpoint=excluded.primaryEndpoint,
        customEndpoint=excluded.customEndpoint,
        prefix=excluded.prefix,
        detectedLanguage=excluded.detectedLanguage,
        version=excluded.version,
        alias=excluded.alias,
        displayName=excluded.displayName,
        bio=excluded.bio,
        rating=excluded.rating,
        totalInteractions=excluded.totalInteractions,
        availabilityScore=excluded.availabilityScore,
        availabilityLatencyMs=excluded.availabilityLatencyMs,
        availabilityStatus=excluded.availabilityStatus,
        availabilityCheckedAt=excluded.availabilityCheckedAt,
        availabilityReason=excluded.availabilityReason,
        availabilitySource=excluded.availabilitySource,
        available=excluded.available,
        trustScore=excluded.trustScore,
        aiagentCreator=excluded.aiagentCreator,
        aiagentModel=excluded.aiagentModel,
        oasfSkillsJson=excluded.oasfSkillsJson,
        capabilityLabelsJson=excluded.capabilityLabelsJson,
        protocolsJson=excluded.protocolsJson,
        agentverseRating=excluded.agentverseRating,
        agentverseInteractions=excluded.agentverseInteractions,
        rawJson=excluded.rawJson,
        updatedAtTime=excluded.updatedAtTime
      `,
    )
    .run(
      chainId,
      agentId,
      nameNorm,
      agentId, // agentAddress placeholder
      'agentverse',
      agentName,
      null,
      0,
      createdAtTime,
      createdAtTime,
      'AGENTVERSE',
      description || null,
      image || null,
      null,
      null,
      null,
      primaryEndpoint || null,
      customEndpoint || null,
      prefix || null,
      detectedLanguage || null,
      version || null,
      alias || null,
      displayName || null,
      bio || null,
      rating ?? null,
      totalInteractions ?? null,
      availabilityScore ?? null,
      availabilityLatencyMs ?? null,
      availabilityStatus || null,
      availabilityCheckedAt ?? null,
      availabilityReason || null,
      availabilitySource || null,
      available ?? null,
      trustScore ?? null,
      aiagentCreator || null,
      aiagentModel || null,
      oasfSkillsJson,
      capabilityLabelsJson,
      protocolsJson,
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


