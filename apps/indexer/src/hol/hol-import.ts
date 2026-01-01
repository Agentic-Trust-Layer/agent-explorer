import { createD1Database } from '../db-d1';
import { fetchHolSearchPage, type HolSearchHit } from './hol-api';

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

function parseDotenvLine(line: string): { key: string; value: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  const eq = trimmed.indexOf('=');
  if (eq <= 0) return null;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (!key) return null;
  // Strip optional surrounding quotes
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return { key, value };
}

async function hydrateHolEnvFromDotenvFiles(): Promise<void> {
  // Some environments end up with HOL_* set to empty string, and dotenv (override=false)
  // will not overwrite. As a fallback, directly parse the .env files and set HOL_* if missing/empty.
  const needs =
    !process.env.HOL_CLOUDFLARE_ACCOUNT_ID?.trim() ||
    !process.env.HOL_CLOUDFLARE_D1_DATABASE_ID?.trim() ||
    !process.env.HOL_CLOUDFLARE_API_TOKEN?.trim();
  if (!needs) return;

  try {
    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const path = await import('node:path');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const candidates = [
      // apps/indexer/.env
      path.resolve(__dirname, '../../.env'),
      // repo-root .env
      path.resolve(__dirname, '../../../../.env'),
    ];

    for (const p of candidates) {
      let text = '';
      try {
        text = await readFile(p, 'utf8');
      } catch {
        continue;
      }
      for (const rawLine of text.split(/\r?\n/)) {
        const parsed = parseDotenvLine(rawLine);
        if (!parsed) continue;
        if (!parsed.key.startsWith('HOL_')) continue;
        if (!process.env[parsed.key] || !String(process.env[parsed.key]).trim()) {
          process.env[parsed.key] = parsed.value;
        }
      }
    }
  } catch {
    // ignore
  }
}

export async function ensureHolSchema(db: AnyDb): Promise<void> {
  // Best-effort schema bootstrap for the target hol-indexer D1 database.
  // Mirrors the "erc8004-indexer" style enough for shared tooling.
  // 1) Create base tables (do not assume we can alter existing schemas via CREATE TABLE IF NOT EXISTS).
  // Keep this free of indexes referencing newly-added columns to avoid "no such column" errors.
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
        crossrefAgentverseInternalId INTEGER,
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
        holAvailable INTEGER,
        holRating REAL,
        holTrustScore REAL,
        agentCardJson TEXT,
        agentCardReadAt INTEGER,
        supportedTrust TEXT,
        rawJson TEXT,
        updatedAtTime INTEGER,
        PRIMARY KEY (chainId, agentId)
      );

      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        agentId TEXT NOT NULL,
        type TEXT NOT NULL,
        blockNumber INTEGER NOT NULL,
        logIndex INTEGER NOT NULL,
        txHash TEXT NOT NULL,
        data TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS checkpoints (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  } catch (e) {
    console.warn('[hol-import] schema bootstrap failed (base tables)', e);
  }

  // 2) Best-effort forward schema upgrades for existing hol-indexer DBs.
  // Cloudflare D1 doesn't support ADD COLUMN IF NOT EXISTS, so we attempt and ignore duplicates.
  for (const stmt of [
    `ALTER TABLE agents ADD COLUMN internalId INTEGER`,
    `ALTER TABLE agents ADD COLUMN nameNorm TEXT`,
    `ALTER TABLE agents ADD COLUMN isDuplicate INTEGER`,
    `ALTER TABLE agents ADD COLUMN duplicateOfInternalId INTEGER`,
    `ALTER TABLE agents ADD COLUMN duplicateReason TEXT`,
    `ALTER TABLE agents ADD COLUMN crossrefAgentverseInternalId INTEGER`,
    `ALTER TABLE agents ADD COLUMN agentCreatedAtTime INTEGER`,
    `ALTER TABLE agents ADD COLUMN primaryEndpoint TEXT`,
    `ALTER TABLE agents ADD COLUMN customEndpoint TEXT`,
    `ALTER TABLE agents ADD COLUMN prefix TEXT`,
    `ALTER TABLE agents ADD COLUMN detectedLanguage TEXT`,
    `ALTER TABLE agents ADD COLUMN version TEXT`,
    `ALTER TABLE agents ADD COLUMN alias TEXT`,
    `ALTER TABLE agents ADD COLUMN displayName TEXT`,
    `ALTER TABLE agents ADD COLUMN bio TEXT`,
    `ALTER TABLE agents ADD COLUMN rating REAL`,
    `ALTER TABLE agents ADD COLUMN totalInteractions INTEGER`,
    `ALTER TABLE agents ADD COLUMN availabilityScore REAL`,
    `ALTER TABLE agents ADD COLUMN availabilityLatencyMs INTEGER`,
    `ALTER TABLE agents ADD COLUMN availabilityStatus TEXT`,
    `ALTER TABLE agents ADD COLUMN availabilityCheckedAt INTEGER`,
    `ALTER TABLE agents ADD COLUMN availabilityReason TEXT`,
    `ALTER TABLE agents ADD COLUMN availabilitySource TEXT`,
    `ALTER TABLE agents ADD COLUMN available INTEGER`,
    `ALTER TABLE agents ADD COLUMN trustScore REAL`,
    `ALTER TABLE agents ADD COLUMN aiagentCreator TEXT`,
    `ALTER TABLE agents ADD COLUMN aiagentModel TEXT`,
    `ALTER TABLE agents ADD COLUMN oasfSkillsJson TEXT`,
    `ALTER TABLE agents ADD COLUMN capabilityLabelsJson TEXT`,
    `ALTER TABLE agents ADD COLUMN protocolsJson TEXT`,
    `ALTER TABLE agents ADD COLUMN holAvailable INTEGER`,
    `ALTER TABLE agents ADD COLUMN holRating REAL`,
    `ALTER TABLE agents ADD COLUMN holTrustScore REAL`,
  ]) {
    try {
      await db.exec(stmt);
    } catch (e: any) {
      const msg = String(e?.message || e).toLowerCase();
      if (!msg.includes('duplicate') && !msg.includes('already exists')) {
        if (process.env.DEBUG_HOL_SCHEMA === '1') {
          console.warn('[hol-import] schema alter failed', { stmt, err: msg });
        }
      }
    }
  }

  // 3) Best-effort indexes (separate statements so one failure doesn't block others).
  for (const stmt of [
    `CREATE INDEX IF NOT EXISTS idx_agents_chainId ON agents(chainId)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_agentOwner ON agents(agentOwner)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_createdAtTime ON agents(createdAtTime)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_agentName ON agents(agentName)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_agents_internalId ON agents(internalId)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_nameNorm ON agents(nameNorm)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_isDuplicate ON agents(isDuplicate)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_crossrefAgentverseInternalId ON agents(crossrefAgentverseInternalId)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_available ON agents(available)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_rating ON agents(rating)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_holAvailable ON agents(holAvailable)`,
    `CREATE INDEX IF NOT EXISTS idx_agents_holRating ON agents(holRating)`,
  ]) {
    try {
      await db.exec(stmt);
    } catch (e: any) {
      const msg = String(e?.message || e).toLowerCase();
      if (process.env.DEBUG_HOL_SCHEMA === '1') {
        console.warn('[hol-import] schema index failed', { stmt, err: msg });
      }
    }
  }

  await backfillInternalIds(db);
}

function toUnixSeconds(value: unknown): number | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) return null;
  return Math.floor(ms / 1000);
}

function firstStringFromEndpoints(endpoints: unknown): string | null {
  if (!Array.isArray(endpoints)) return null;
  for (const e of endpoints) {
    if (typeof e === 'string' && e.trim()) return e.trim();
    if (e && typeof e === 'object') {
      const obj: any = e;
      const url =
        (typeof obj?.url === 'string' && obj.url.trim() ? obj.url.trim() : null) ||
        (typeof obj?.endpoint === 'string' && obj.endpoint.trim() ? obj.endpoint.trim() : null) ||
        (typeof obj?.href === 'string' && obj.href.trim() ? obj.href.trim() : null);
      if (url) return url;
    }
  }
  return null;
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

function parseHolRating(hit: HolSearchHit): number | null {
  const md: any = hit?.metadata && typeof hit.metadata === 'object' ? hit.metadata : null;
  const mf: any = (hit as any)?.metadataFacet && typeof (hit as any).metadataFacet === 'object' ? (hit as any).metadataFacet : null;

  const raw =
    (md && md.rating != null ? md.rating : null) ??
    (mf && Array.isArray(mf.rating) && mf.rating.length ? mf.rating[0] : null);
  const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : null;
}

async function upsertAgentFromHol(db: AnyDb, chainId: number, hit: HolSearchHit): Promise<void> {
  const agentId = String(hit.id);
  const agentName = typeof hit.name === 'string' && hit.name.trim() ? hit.name.trim() : agentId;

  // These are required by our legacy schema; use stable placeholders.
  const agentAddress = (typeof hit.uaid === 'string' && hit.uaid.trim() ? hit.uaid.trim() : `hol:${agentId}`);
  const agentOwner = (typeof hit.registry === 'string' && hit.registry.trim() ? hit.registry.trim() : 'HOL');

  const holAvailable = hit.available === true ? 1 : 0;
  const holRating = parseHolRating(hit);
  const holTrustScore = typeof hit.trustScore === 'number' && Number.isFinite(hit.trustScore) ? hit.trustScore : null;
  const available = hit.available === true ? 1 : hit.available === false ? 0 : null;

  const createdAtTime = toUnixSeconds(hit.createdAt) ?? Math.floor(Date.now() / 1000);
  const updatedAtTime = toUnixSeconds(hit.updatedAt) ?? createdAtTime;

  const description = typeof hit.description === 'string' && hit.description.trim() ? hit.description.trim() : null;
  const primaryEndpoint = firstStringFromEndpoints(hit.endpoints) ?? null;
  const agentAccountEndpoint = primaryEndpoint;

  const rawJson = JSON.stringify(hit);
  const nameNorm = normalizeNameKey(agentName);

  const md: any = hit?.metadata && typeof hit.metadata === 'object' ? hit.metadata : null;
  const profile: any = hit?.profile && typeof hit.profile === 'object' ? hit.profile : null;

  const prefix =
    (typeof md?.prefix === 'string' && md.prefix.trim() ? md.prefix.trim() : null) ||
    (typeof hit?.registry === 'string' && hit.registry.trim() ? hit.registry.trim() : null);
  const detectedLanguage =
    (typeof md?.language === 'string' && md.language.trim() ? md.language.trim() : null) ||
    (typeof profile?.language === 'string' && profile.language.trim() ? profile.language.trim() : null);
  const version = typeof md?.version === 'string' && md.version.trim() ? md.version.trim() : null;
  const alias =
    (typeof profile?.alias === 'string' && profile.alias.trim() ? profile.alias.trim() : null) ||
    (typeof hit?.uaid === 'string' && hit.uaid.trim() ? hit.uaid.trim() : null) ||
    agentId;
  const displayName =
    (typeof profile?.displayName === 'string' && profile.displayName.trim() ? profile.displayName.trim() : null) ||
    (typeof profile?.display_name === 'string' && profile.display_name.trim() ? profile.display_name.trim() : null) ||
    agentName;
  const bio =
    (typeof profile?.bio === 'string' && profile.bio.trim() ? profile.bio.trim() : null) ||
    (typeof md?.bio === 'string' && md.bio.trim() ? md.bio.trim() : null) ||
    description;
  const rating = holRating;
  const trustScore = holTrustScore;
  const totalInteractions =
    typeof md?.totalInteractions === 'number'
      ? md.totalInteractions
      : typeof md?.total_interactions === 'number'
        ? md.total_interactions
        : null;
  const availabilityScore =
    typeof md?.availabilityScore === 'number'
      ? md.availabilityScore
      : typeof md?.availability_score === 'number'
        ? md.availability_score
        : null;
  const availabilityLatencyMs =
    typeof md?.availabilityLatencyMs === 'number'
      ? md.availabilityLatencyMs
      : typeof md?.availability_latency_ms === 'number'
        ? md.availability_latency_ms
        : null;
  const availabilityStatus =
    typeof md?.availabilityStatus === 'string'
      ? md.availabilityStatus
      : typeof md?.availability_status === 'string'
        ? md.availability_status
        : null;
  const availabilityCheckedAt = toUnixSeconds(md?.availabilityCheckedAt) ?? toUnixSeconds(md?.availability_checked_at);
  const availabilityReason =
    typeof md?.availabilityReason === 'string'
      ? md.availabilityReason
      : typeof md?.availability_reason === 'string'
        ? md.availability_reason
        : null;
  const availabilitySource =
    typeof md?.availabilitySource === 'string'
      ? md.availabilitySource
      : typeof md?.availability_source === 'string'
        ? md.availability_source
        : null;
  const customEndpoint = typeof md?.customEndpoint === 'string' && md.customEndpoint.trim() ? md.customEndpoint.trim() : null;
  const aiagentCreator = typeof md?.creator === 'string' ? md.creator : typeof md?.aiagentCreator === 'string' ? md.aiagentCreator : null;
  const aiagentModel = typeof md?.model === 'string' ? md.model : typeof md?.aiagentModel === 'string' ? md.aiagentModel : null;
  const oasfSkillsJson = Array.isArray(md?.oasfSkills || md?.oasf_skills) ? JSON.stringify(md.oasfSkills || md.oasf_skills) : null;
  const capabilityLabelsJson = Array.isArray(hit?.capabilities) ? JSON.stringify(hit.capabilities) : null;
  const protocolsJson = Array.isArray(hit?.protocols) ? JSON.stringify(hit.protocols) : null;

  await db
    .prepare(
      `
      INSERT INTO agents (
        internalId,
        chainId, agentId,
        nameNorm, isDuplicate, duplicateOfInternalId, duplicateReason,
        crossrefAgentverseInternalId,
        agentAddress, agentOwner, agentName,
        prefix, detectedLanguage, version,
        alias, displayName, bio,
        rating, totalInteractions,
        availabilityScore, availabilityLatencyMs, availabilityStatus,
        availabilityCheckedAt, availabilityReason, availabilitySource,
        available, trustScore,
        primaryEndpoint, customEndpoint,
        aiagentCreator, aiagentModel,
        oasfSkillsJson, capabilityLabelsJson, protocolsJson,
        holAvailable, holRating, holTrustScore,
        tokenUri,
        createdAtBlock, createdAtTime,
        agentCreatedAtTime,
        type, description, image,
        a2aEndpoint, ensEndpoint, agentAccountEndpoint,
        supportedTrust, rawJson,
        updatedAtTime
      )
      VALUES (
        (SELECT COALESCE(MAX(internalId), 0) + 1 FROM agents),
        ?, ?,
        ?, 0, NULL, NULL,
        NULL,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?, ?,
        ?, ?
      )
      ON CONFLICT(chainId, agentId) DO UPDATE SET
        nameNorm=excluded.nameNorm,
        agentAddress=excluded.agentAddress,
        agentOwner=excluded.agentOwner,
        agentName=excluded.agentName,
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
        primaryEndpoint=excluded.primaryEndpoint,
        customEndpoint=excluded.customEndpoint,
        aiagentCreator=excluded.aiagentCreator,
        aiagentModel=excluded.aiagentModel,
        oasfSkillsJson=excluded.oasfSkillsJson,
        capabilityLabelsJson=excluded.capabilityLabelsJson,
        protocolsJson=excluded.protocolsJson,
        holAvailable=excluded.holAvailable,
        holRating=excluded.holRating,
        holTrustScore=excluded.holTrustScore,
        agentCreatedAtTime=excluded.agentCreatedAtTime,
        type=excluded.type,
        description=excluded.description,
        agentAccountEndpoint=excluded.agentAccountEndpoint,
        rawJson=excluded.rawJson,
        updatedAtTime=excluded.updatedAtTime
      `,
    )
    .run(
      chainId,
      agentId,
      nameNorm,
      agentAddress,
      agentOwner,
      agentName,
      prefix,
      detectedLanguage,
      version,
      alias,
      displayName,
      bio,
      rating,
      totalInteractions,
      availabilityScore,
      availabilityLatencyMs,
      availabilityStatus,
      availabilityCheckedAt,
      availabilityReason,
      availabilitySource,
      available,
      trustScore,
      primaryEndpoint,
      customEndpoint,
      aiagentCreator,
      aiagentModel,
      oasfSkillsJson,
      capabilityLabelsJson,
      protocolsJson,
      holAvailable,
      holRating,
      holTrustScore,
      null, // tokenUri
      0, // createdAtBlock (non-chain)
      createdAtTime,
      createdAtTime,
      'HOL', // type
      description,
      null, // image
      null, // a2aEndpoint
      null, // ensEndpoint
      agentAccountEndpoint,
      null, // supportedTrust
      rawJson,
      updatedAtTime,
    );
}

export type HolImportOptions = {
  holBaseUrl?: string;
  pageSize?: number; // default 100
  maxPages?: number; // default unlimited
  chainId?: number; // default 0 (non-chain registry)
  registry?: string; // optional: import only one HOL registry
  registries?: string[]; // optional: import multiple registries sequentially
  capability?: string;
  trust?: string;
  q?: string;
};

export async function createHolDbFromEnv(): Promise<AnyDb> {
  // Ensure we can see HOL_* even if dotenv didn't override empty env vars.
  await hydrateHolEnvFromDotenvFiles();

  const accountId = (process.env.HOL_CLOUDFLARE_ACCOUNT_ID || '').trim();
  const databaseId = (process.env.HOL_CLOUDFLARE_D1_DATABASE_ID || '').trim();
  const apiToken = (process.env.HOL_CLOUDFLARE_API_TOKEN || '').trim();
  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      'Missing HOL D1 env. Expected HOL_CLOUDFLARE_ACCOUNT_ID, HOL_CLOUDFLARE_D1_DATABASE_ID, HOL_CLOUDFLARE_API_TOKEN. ' +
        `Seen: { hasAccountId: ${Boolean(accountId)}, hasDatabaseId: ${Boolean(databaseId)}, hasApiToken: ${Boolean(apiToken)} }`,
    );
  }
  return createD1Database({ accountId, databaseId, apiToken });
}

export async function importHolAgentsIntoD1(db: AnyDb, opts?: HolImportOptions): Promise<{ processed: number }> {
  console.log('[hol-import] starting', { baseUrl: opts?.holBaseUrl || process.env.HOL_BASE_URL || 'https://hol.org' });
  await ensureHolSchema(db);

  const chainId = typeof opts?.chainId === 'number' ? Math.trunc(opts.chainId) : 0;
  const pageSize = typeof opts?.pageSize === 'number' && opts.pageSize > 0 ? Math.trunc(opts.pageSize) : 100;
  const maxPages = typeof opts?.maxPages === 'number' && opts.maxPages > 0 ? Math.trunc(opts.maxPages) : undefined;
  const logEach = process.env.HOL_LOG_EACH === '1';
  const pageDelayMs = Number(process.env.HOL_PAGE_DELAY_MS ?? 200) || 200;
  const resumeEnabled = process.env.HOL_RESUME !== '0';
  const reset = process.env.HOL_RESET === '1';
  const pageRetries = Number(process.env.HOL_PAGE_RETRIES ?? 6) || 6;
  const availableOnly = process.env.HOL_AVAILABLE_ONLY !== '0';

  const capability = opts?.capability || process.env.HOL_CAPABILITY;
  const trust = opts?.trust || process.env.HOL_TRUST;
  const q = opts?.q || process.env.HOL_QUERY;

  const envRegistries = (process.env.HOL_REGISTRIES || '').trim();
  const registriesFromEnv = envRegistries
    ? envRegistries
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

  const registries =
    (opts?.registries && opts.registries.length ? opts.registries : null) ||
    (typeof opts?.registry === 'string' && opts.registry.trim() ? [opts.registry.trim()] : null) ||
    (typeof process.env.HOL_REGISTRY === 'string' && process.env.HOL_REGISTRY.trim() ? [process.env.HOL_REGISTRY.trim()] : null) ||
    (registriesFromEnv.length ? registriesFromEnv : [
      'a2a-registry',
      'agentverse',
      'coinbase-x402-bazaar',
      'erc-8004',
      'erc-8004-solana',
      'hashgraph-online',
      'hol',
    ]);

  let processedTotal = 0;

  for (const registry of registries) {
    const checkpointKey = `holImportCursor:${registry}`;
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

    console.log('[hol-import] registry', { registry, startPage });

    let processedForRegistry = 0;
    for (let page = startPage; ; page++) {
      if (maxPages && page > maxPages) break;
      let resp: any = null;
      let attempt = 0;
      for (;;) {
        attempt += 1;
        try {
          resp = await fetchHolSearchPage({
            baseUrl: opts?.holBaseUrl,
            page,
            limit: pageSize,
            registry,
            capability,
            trust,
            q,
          });
          break;
        } catch (e: any) {
          const msg = e?.message || String(e);
          console.warn('[hol-import] page fetch failed', { registry, page, attempt, err: msg });
          if (attempt >= pageRetries) {
            // Stop gracefully; rerun will resume from this page.
            return { processed: processedTotal };
          }
          await sleep(Math.min(60_000, 1_000 * attempt * attempt));
        }
      }

      const hits = Array.isArray(resp.hits) ? resp.hits : [];
      const filteredHits = availableOnly ? hits.filter((h: any) => h?.available === true) : hits;
      // Sort within the page by rating desc (best-effort). HOL API doesn't currently sort by rating server-side.
      filteredHits.sort((a: any, b: any) => {
        const ra = parseHolRating(a) ?? -Infinity;
        const rb = parseHolRating(b) ?? -Infinity;
        return rb - ra;
      });
      console.log('[hol-import] page', {
        registry,
        page,
        hits: hits.length,
        filtered: filteredHits.length,
        availableOnly,
        total: resp.total,
        limited: resp.limited === true,
      });
      if (!hits.length) break;

      for (const hit of filteredHits) {
        const agentId = String(hit?.id ?? '');
        const agentName = typeof hit?.name === 'string' ? hit.name : '';
        try {
          await upsertAgentFromHol(db, chainId, hit);
          processedForRegistry += 1;
          processedTotal += 1;
          if (logEach) console.log('[hol-import] upsert ok', { registry, page, chainId, agentId, agentName });
        } catch (e: any) {
          console.warn('[hol-import] upsert failed', { registry, page, chainId, agentId, agentName, err: e?.message || String(e) });
        }
      }

      // Save cursor to resume this registry.
      await setCheckpoint(
        db,
        checkpointKey,
        JSON.stringify({ page: page + 1, processed: processedForRegistry, at: Math.floor(Date.now() / 1000) }),
      );

      // Stop when we've reached the total for this registry.
      if (processedForRegistry >= resp.total) break;

      await sleep(pageDelayMs);
    }
  }

  return { processed: processedTotal };
}

export async function importHolAgentsFromEnv(opts?: HolImportOptions): Promise<{ processed: number }> {
  const db = await createHolDbFromEnv();
  return await importHolAgentsIntoD1(db, opts);
}


