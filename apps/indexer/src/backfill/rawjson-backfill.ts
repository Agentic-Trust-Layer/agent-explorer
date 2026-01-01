import { ensureAgentverseSchema, createAgentverseDbFromEnv } from '../agentverse/import';
import { ensureHolSchema, createHolDbFromEnv } from '../hol/hol-import';

type AnyDb = any;

type Mode = 'hol' | 'agentverse' | 'both';

type BackfillOptions = {
  mode: Mode;
};

function normalizeNameKey(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim().toLowerCase();
  if (!s) return null;
  return s.replace(/\s+/g, ' ');
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

async function tryExec(db: AnyDb, sql: string): Promise<void> {
  try {
    await db.exec(sql);
  } catch {
    // ignore
  }
}

async function ensureRawJsonBackfillColumns(db: AnyDb, which: 'hol' | 'agentverse'): Promise<void> {
  // Importers already try to add these, but keep this CLI resilient for older DBs.
  const base = [
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
    `ALTER TABLE agents ADD COLUMN nameNorm TEXT`,
  ];

  for (const stmt of base) await tryExec(db, stmt);
  if (which === 'hol') {
    for (const stmt of [`ALTER TABLE agents ADD COLUMN holAvailable INTEGER`, `ALTER TABLE agents ADD COLUMN holRating REAL`, `ALTER TABLE agents ADD COLUMN holTrustScore REAL`]) {
      await tryExec(db, stmt);
    }
  } else {
    for (const stmt of [`ALTER TABLE agents ADD COLUMN agentverseRating REAL`, `ALTER TABLE agents ADD COLUMN agentverseInteractions INTEGER`]) {
      await tryExec(db, stmt);
    }
  }
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

function safeJsonParse(s: unknown): any | null {
  if (typeof s !== 'string' || !s.trim()) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
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

function parseHolDerived(hit: any): Partial<Record<string, any>> {
  const md: any = hit?.metadata && typeof hit.metadata === 'object' ? hit.metadata : null;
  const profile: any = hit?.profile && typeof hit.profile === 'object' ? hit.profile : null;

  const agentId = typeof hit?.id === 'string' ? hit.id : hit?.id != null ? String(hit.id) : null;
  const agentName = typeof hit?.name === 'string' && hit.name.trim() ? hit.name.trim() : agentId;
  const description = typeof hit?.description === 'string' && hit.description.trim() ? hit.description.trim() : null;

  const holAvailable = hit?.available === true ? 1 : 0;
  const holTrustScore = typeof hit?.trustScore === 'number' && Number.isFinite(hit.trustScore) ? hit.trustScore : null;
  const holRating = extractNumber(md, ['rating']) ?? (Array.isArray((hit as any)?.metadataFacet?.rating) ? Number((hit as any).metadataFacet.rating[0]) : null);
  const available = hit?.available === true ? 1 : hit?.available === false ? 0 : null;

  const createdAtTime = parseTimeSeconds(hit?.createdAt) ?? Math.floor(Date.now() / 1000);
  const updatedAtTime = parseTimeSeconds(hit?.updatedAt) ?? createdAtTime;

  const primaryEndpoint = firstStringFromEndpoints(hit?.endpoints) ?? null;
  const customEndpoint = typeof md?.customEndpoint === 'string' && md.customEndpoint.trim() ? md.customEndpoint.trim() : null;

  const prefix = (typeof md?.prefix === 'string' && md.prefix.trim() ? md.prefix.trim() : null) || (typeof hit?.registry === 'string' && hit.registry.trim() ? hit.registry.trim() : null);
  const detectedLanguage = (typeof md?.language === 'string' && md.language.trim() ? md.language.trim() : null) || (typeof profile?.language === 'string' && profile.language.trim() ? profile.language.trim() : null);
  const version = typeof md?.version === 'string' && md.version.trim() ? md.version.trim() : null;
  const alias = (typeof profile?.alias === 'string' && profile.alias.trim() ? profile.alias.trim() : null) || (typeof hit?.uaid === 'string' && hit.uaid.trim() ? hit.uaid.trim() : null) || agentId;
  const displayName =
    (typeof profile?.displayName === 'string' && profile.displayName.trim() ? profile.displayName.trim() : null) ||
    (typeof profile?.display_name === 'string' && profile.display_name.trim() ? profile.display_name.trim() : null) ||
    agentName;
  const bio = (typeof profile?.bio === 'string' && profile.bio.trim() ? profile.bio.trim() : null) || (typeof md?.bio === 'string' && md.bio.trim() ? md.bio.trim() : null) || description;

  const rating = holRating != null && Number.isFinite(holRating) ? holRating : null;
  const totalInteractions = extractNumber(md, ['totalInteractions', 'total_interactions']);

  const availabilityScore = extractNumber(md, ['availabilityScore', 'availability_score']);
  const availabilityLatencyMs = extractNumber(md, ['availabilityLatencyMs', 'availability_latency_ms']);
  const availabilityStatus = extractString(md, ['availabilityStatus', 'availability_status']);
  const availabilityCheckedAt = parseTimeSeconds(md?.availabilityCheckedAt) ?? parseTimeSeconds(md?.availability_checked_at);
  const availabilityReason = extractString(md, ['availabilityReason', 'availability_reason']);
  const availabilitySource = extractString(md, ['availabilitySource', 'availability_source']);

  const trustScore = holTrustScore;
  const aiagentCreator = extractString(md, ['creator', 'aiagentCreator']);
  const aiagentModel = extractString(md, ['model', 'aiagentModel']);

  const oasfSkillsJson = Array.isArray(md?.oasfSkills || md?.oasf_skills) ? JSON.stringify(md.oasfSkills || md.oasf_skills) : null;
  const capabilityLabelsJson = Array.isArray(hit?.capabilities) ? JSON.stringify(hit.capabilities) : null;
  const protocolsJson = Array.isArray(hit?.protocols) ? JSON.stringify(hit.protocols) : null;

  const nameNorm = normalizeNameKey(displayName || agentName || agentId);

  return {
    // writeable columns
    agentCreatedAtTime: parseTimeSeconds(hit?.createdAt) ?? null,
    primaryEndpoint,
    customEndpoint,
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
    aiagentCreator,
    aiagentModel,
    oasfSkillsJson,
    capabilityLabelsJson,
    protocolsJson,
    holAvailable,
    holRating: rating,
    holTrustScore: holTrustScore,
    updatedAtTime,
    createdAtTime,
    nameNorm,
  };
}

function parseAgentverseDerived(a: any): Partial<Record<string, any>> {
  const agentName = extractString(a, ['name', 'display_name']) || extractString(a?.profile, ['display_name', 'name']) || null;
  const description = extractString(a, ['description', 'bio']) || extractString(a?.profile, ['bio', 'description']);

  const available = a?.available === true ? 1 : a?.available === false ? 0 : null;
  const trustScore = extractNumber(a, ['trust_score', 'trustScore']);
  const prefix = extractString(a, ['prefix']) || extractString(a?.profile, ['prefix']);
  const detectedLanguage = extractString(a, ['language', 'detected_language']) || extractString(a?.profile, ['language']);
  const version = extractString(a, ['version']) || extractString(a?.profile, ['version']);
  const alias = extractString(a, ['alias']) || extractString(a?.profile, ['alias']);
  const displayName = extractString(a, ['display_name', 'name']) || extractString(a?.profile, ['display_name', 'name']) || agentName;
  const bio = extractString(a, ['bio', 'description']) || extractString(a?.profile, ['bio', 'description']) || description;
  const rating = extractNumber(a, ['rating', 'average_rating', 'avg_rating']);
  const totalInteractions = extractNumber(a, ['total_interactions', 'interactions', 'interaction_count']);

  const availabilityScore = extractNumber(a, ['availability_score']);
  const availabilityLatencyMs = extractNumber(a, ['availability_latency_ms', 'availabilityLatencyMs']);
  const availabilityStatus = extractString(a, ['availability_status', 'availabilityStatus']);
  const availabilityCheckedAt = parseTimeSeconds(extractString(a, ['availability_checked_at', 'availabilityCheckedAt']));
  const availabilityReason = extractString(a, ['availability_reason', 'availabilityReason']);
  const availabilitySource = extractString(a, ['availability_source', 'availabilitySource']);
  const primaryEndpoint = extractString(a, ['primary_endpoint', 'endpoint', 'url']) || extractString(a?.profile, ['primary_endpoint', 'endpoint', 'url']);
  const customEndpoint = extractString(a, ['custom_endpoint']) || extractString(a?.profile, ['custom_endpoint']);
  const aiagentCreator = extractString(a, ['creator']) || extractString(a?.profile, ['creator']);
  const aiagentModel = extractString(a, ['model']) || extractString(a?.profile, ['model']);

  const oasfSkillsJson = Array.isArray(a?.oasfSkills || a?.oasf_skills) ? JSON.stringify(a.oasfSkills || a.oasf_skills) : null;
  const capabilityLabelsJson = Array.isArray(a?.capabilityLabels || a?.capability_labels) ? JSON.stringify(a.capabilityLabels || a.capability_labels) : null;
  const protocolsJson = Array.isArray(a?.protocols) ? JSON.stringify(a.protocols) : null;

  const agentCreatedAtTime =
    parseTimeSeconds(a?.created_at) ??
    parseTimeSeconds(a?.createdAt) ??
    parseTimeSeconds(a?.createdAtTime) ??
    parseTimeSeconds(a?.profile?.created_at) ??
    parseTimeSeconds(a?.profile?.createdAt) ??
    null;
  const nameNorm = normalizeNameKey(displayName || agentName || a?.id || a?.address);

  return {
    agentCreatedAtTime,
    primaryEndpoint,
    customEndpoint,
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
    aiagentCreator,
    aiagentModel,
    oasfSkillsJson,
    capabilityLabelsJson,
    protocolsJson,
    agentverseRating: rating,
    agentverseInteractions: totalInteractions,
    nameNorm,
  };
}

async function backfillDb(db: AnyDb, which: 'hol' | 'agentverse'): Promise<void> {
  const pageSize = Number(process.env.RAWJSON_BACKFILL_PAGE_SIZE || 500) || 500;
  const max = Number(process.env.RAWJSON_BACKFILL_MAX || 0) || 0;
  const reset = process.env.RAWJSON_BACKFILL_RESET === '1';
  const overwrite = process.env.RAWJSON_BACKFILL_OVERWRITE === '1';
  const ckKey = which === 'hol' ? 'rawjsonBackfillCursorHol' : 'rawjsonBackfillCursorAgentverse';

  // Cursor is stored as JSON: { chainId: number, agentId: string }
  let cursorChainId = 0;
  let cursorAgentId = '';
  if (!reset) {
    const saved = await getCheckpoint(db, ckKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        cursorChainId = Number(parsed?.chainId ?? 0) || 0;
        cursorAgentId = typeof parsed?.agentId === 'string' ? parsed.agentId : '';
      } catch {
        // Back-compat: older cursor might be a number (internalId).
        cursorChainId = 0;
        cursorAgentId = '';
      }
    }
  } else {
    await setCheckpoint(db, ckKey, JSON.stringify({ chainId: 0, agentId: '' }));
  }

  // Lightweight diagnostics so it's obvious if we're pointed at an empty / wrong DB.
  try {
    const row = await db.prepare('SELECT COUNT(*) as n, SUM(CASE WHEN rawJson IS NOT NULL THEN 1 ELSE 0 END) as withRawJson FROM agents').get();
    console.log('[rawjson-backfill] counts', { which, total: Number((row as any)?.n ?? 0) || 0, withRawJson: Number((row as any)?.withRawJson ?? 0) || 0 });
  } catch (e) {
    console.warn('[rawjson-backfill] count query failed', { which, err: String((e as any)?.message || e) });
  }

  let processed = 0;
  for (;;) {
    const res = await db
      .prepare(
        `SELECT internalId, chainId, agentId, agentName, rawJson,
                agentCreatedAtTime, primaryEndpoint, customEndpoint, prefix, detectedLanguage, version,
                alias, displayName, bio, rating, totalInteractions,
                availabilityScore, availabilityLatencyMs, availabilityStatus, availabilityCheckedAt, availabilityReason, availabilitySource,
                available, trustScore, aiagentCreator, aiagentModel,
                oasfSkillsJson, capabilityLabelsJson, protocolsJson,
                nameNorm
         FROM agents
         WHERE rawJson IS NOT NULL
           AND (chainId > ? OR (chainId = ? AND agentId > ?))
         ORDER BY chainId ASC, agentId ASC
         LIMIT ?`,
      )
      // Our D1 HTTP adapter supports passing params directly to .all(...params).
      .all(cursorChainId, cursorChainId, cursorAgentId, pageSize);

    const rows = Array.isArray(res) ? res : ((res as any)?.results || (res as any)?.rows || []);
    if (!rows.length) break;

    for (const r of rows) {
      const raw = safeJsonParse(r.rawJson);
      if (!raw) {
        cursorChainId = Number(r.chainId ?? 0) || cursorChainId;
        cursorAgentId = String(r.agentId ?? cursorAgentId);
        await setCheckpoint(db, ckKey, JSON.stringify({ chainId: cursorChainId, agentId: cursorAgentId }));
        continue;
      }

      const derived = which === 'hol' ? parseHolDerived(raw) : parseAgentverseDerived(raw);

      // Merge: only fill nulls unless overwrite=1.
      const merged: any = { ...derived };
      for (const [k, v] of Object.entries(derived)) {
        if (!overwrite) {
          const existing = (r as any)[k];
          if (existing != null) merged[k] = existing;
        }
        if (merged[k] === undefined) merged[k] = null;
      }

      await db
        .prepare(
          `UPDATE agents SET
             agentCreatedAtTime=?,
             primaryEndpoint=?,
             customEndpoint=?,
             prefix=?,
             detectedLanguage=?,
             version=?,
             alias=?,
             displayName=?,
             bio=?,
             rating=?,
             totalInteractions=?,
             availabilityScore=?,
             availabilityLatencyMs=?,
             availabilityStatus=?,
             availabilityCheckedAt=?,
             availabilityReason=?,
             availabilitySource=?,
             available=?,
             trustScore=?,
             aiagentCreator=?,
             aiagentModel=?,
             oasfSkillsJson=?,
             capabilityLabelsJson=?,
             protocolsJson=?,
             nameNorm=?
           WHERE chainId=? AND agentId=?`,
        )
        // Our D1 HTTP adapter supports passing params directly to .run(...params).
        .run(
          merged.agentCreatedAtTime ?? null,
          merged.primaryEndpoint ?? null,
          merged.customEndpoint ?? null,
          merged.prefix ?? null,
          merged.detectedLanguage ?? null,
          merged.version ?? null,
          merged.alias ?? null,
          merged.displayName ?? null,
          merged.bio ?? null,
          merged.rating ?? null,
          merged.totalInteractions ?? null,
          merged.availabilityScore ?? null,
          merged.availabilityLatencyMs ?? null,
          merged.availabilityStatus ?? null,
          merged.availabilityCheckedAt ?? null,
          merged.availabilityReason ?? null,
          merged.availabilitySource ?? null,
          merged.available ?? null,
          merged.trustScore ?? null,
          merged.aiagentCreator ?? null,
          merged.aiagentModel ?? null,
          merged.oasfSkillsJson ?? null,
          merged.capabilityLabelsJson ?? null,
          merged.protocolsJson ?? null,
          merged.nameNorm ?? null,
          r.chainId,
          r.agentId,
        );

      // HOL-specific extras
      if (which === 'hol') {
        await db
          .prepare(`UPDATE agents SET holAvailable=?, holRating=?, holTrustScore=? WHERE chainId=? AND agentId=?`)
          .run(merged.holAvailable ?? null, merged.holRating ?? null, merged.holTrustScore ?? null, r.chainId, r.agentId);
      } else {
        await db
          .prepare(`UPDATE agents SET agentverseRating=?, agentverseInteractions=? WHERE chainId=? AND agentId=?`)
          .run(merged.agentverseRating ?? null, merged.agentverseInteractions ?? null, r.chainId, r.agentId);
      }

      cursorChainId = Number(r.chainId ?? 0) || 0;
      cursorAgentId = String(r.agentId ?? '');
      processed += 1;
      if (processed % 250 === 0) {
        console.log('[rawjson-backfill] progress', { which, processed, cursor: { chainId: cursorChainId, agentId: cursorAgentId } });
      }
      await setCheckpoint(db, ckKey, JSON.stringify({ chainId: cursorChainId, agentId: cursorAgentId }));
      if (max > 0 && processed >= max) {
        console.log('[rawjson-backfill] max reached', { which, processed, cursor: { chainId: cursorChainId, agentId: cursorAgentId } });
        return;
      }
    }
  }

  console.log('[rawjson-backfill] complete', { which, processed, cursor: { chainId: cursorChainId, agentId: cursorAgentId } });
}

export async function runRawJsonBackfill(opts: BackfillOptions): Promise<void> {
  const mode = opts.mode;
  if (mode === 'hol' || mode === 'both') {
    const holDb = await createHolDbFromEnv();
    await ensureHolSchema(holDb);
    await ensureRawJsonBackfillColumns(holDb, 'hol');
    await backfillDb(holDb, 'hol');
  }
  if (mode === 'agentverse' || mode === 'both') {
    const avDb = await createAgentverseDbFromEnv();
    await ensureAgentverseSchema(avDb);
    await ensureRawJsonBackfillColumns(avDb, 'agentverse');
    await backfillDb(avDb, 'agentverse');
  }
}


