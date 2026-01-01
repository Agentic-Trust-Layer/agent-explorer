import { ensureAgentverseSchema, createAgentverseDbFromEnv } from '../agentverse/import';
import { ensureHolSchema, createHolDbFromEnv } from '../hol/hol-import';

type AnyDb = any;

function normalizeNameKey(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim().toLowerCase();
  if (!s) return null;
  return s.replace(/\s+/g, ' ');
}

async function tryExec(db: AnyDb, sql: string): Promise<void> {
  try {
    await db.exec(sql);
  } catch {
    // ignore
  }
}

async function ensureCrossrefColumns(db: AnyDb, which: 'hol' | 'agentverse'): Promise<void> {
  // Both schemas already add most columns, but keep this tool resilient.
  await tryExec(db, `ALTER TABLE agents ADD COLUMN internalId INTEGER`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN nameNorm TEXT`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN isDuplicate INTEGER`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN duplicateOfInternalId INTEGER`);
  await tryExec(db, `ALTER TABLE agents ADD COLUMN duplicateReason TEXT`);
  if (which === 'hol') {
    await tryExec(db, `ALTER TABLE agents ADD COLUMN crossrefAgentverseInternalId INTEGER`);
    await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_crossrefAgentverseInternalId ON agents(crossrefAgentverseInternalId)`);
  } else {
    await tryExec(db, `ALTER TABLE agents ADD COLUMN crossrefHolInternalId INTEGER`);
    await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_crossrefHolInternalId ON agents(crossrefHolInternalId)`);
  }
  await tryExec(db, `CREATE UNIQUE INDEX IF NOT EXISTS idx_agents_internalId ON agents(internalId)`);
  await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_nameNorm ON agents(nameNorm)`);
  await tryExec(db, `CREATE INDEX IF NOT EXISTS idx_agents_isDuplicate ON agents(isDuplicate)`);
}

async function fetchAllAgents(db: AnyDb): Promise<Array<{ chainId: number; agentId: string; internalId: number | null; agentName: string; nameNorm: string | null; rating: number | null; totalInteractions: number | null }>> {
  const res = await db
    .prepare(
      `SELECT chainId, agentId, internalId, agentName, nameNorm, rating, totalInteractions
       FROM agents`,
    )
    .all();
  const rows = (res as any)?.results || (res as any)?.rows || [];
  return rows.map((r: any) => ({
    chainId: Number(r?.chainId ?? 0) || 0,
    agentId: String(r?.agentId ?? ''),
    internalId: r?.internalId == null ? null : Number(r.internalId),
    agentName: String(r?.agentName ?? ''),
    nameNorm: typeof r?.nameNorm === 'string' ? r.nameNorm : null,
    rating: r?.rating == null ? null : Number(r.rating),
    totalInteractions: r?.totalInteractions == null ? null : Number(r.totalInteractions),
  }));
}

function pickCanonical(rows: Array<{ internalId: number | null; rating: number | null; totalInteractions: number | null }>): number | null {
  // Prefer higher rating, then higher interactions, then lowest internalId.
  const withId = rows.filter((r) => typeof r.internalId === 'number' && Number.isFinite(r.internalId)) as Array<{ internalId: number; rating: number | null; totalInteractions: number | null }>;
  if (!withId.length) return null;
  withId.sort((a, b) => {
    const ar = a.rating ?? -1;
    const br = b.rating ?? -1;
    if (br !== ar) return br - ar;
    const ai = a.totalInteractions ?? -1;
    const bi = b.totalInteractions ?? -1;
    if (bi !== ai) return bi - ai;
    return a.internalId - b.internalId;
  });
  return withId[0].internalId;
}

async function markDuplicatesWithinDb(db: AnyDb): Promise<void> {
  const agents = await fetchAllAgents(db);
  const groups = new Map<string, typeof agents>();
  for (const a of agents) {
    const key = a.nameNorm || normalizeNameKey(a.agentName) || null;
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  }
  for (const [key, rows] of groups.entries()) {
    if (rows.length < 2) continue;
    const canonical = pickCanonical(rows);
    if (!canonical) continue;
    for (const r of rows) {
      if (r.internalId === canonical) {
        await db.prepare('UPDATE agents SET isDuplicate = 0, duplicateOfInternalId = NULL, duplicateReason = NULL WHERE internalId = ?').run(canonical);
      } else if (r.internalId != null) {
        await db
          .prepare('UPDATE agents SET isDuplicate = 1, duplicateOfInternalId = ?, duplicateReason = ? WHERE internalId = ?')
          .run(canonical, `name-dup:${key}`, r.internalId);
      }
    }
  }
}

async function crossrefByAgentId(holDb: AnyDb, avDb: AnyDb): Promise<number> {
  const hol = await fetchAllAgents(holDb);
  const av = await fetchAllAgents(avDb);
  const avByAgentId = new Map<string, (typeof av)[number]>();
  for (const a of av) avByAgentId.set(a.agentId, a);

  let linked = 0;
  for (const h of hol) {
    const a = avByAgentId.get(h.agentId);
    if (!a) continue;
    if (h.internalId == null || a.internalId == null) continue;
    await holDb.prepare('UPDATE agents SET crossrefAgentverseInternalId = ? WHERE internalId = ?').run(a.internalId, h.internalId);
    await avDb.prepare('UPDATE agents SET crossrefHolInternalId = ? WHERE internalId = ?').run(h.internalId, a.internalId);
    linked += 1;
  }
  return linked;
}

async function crossrefByName(holDb: AnyDb, avDb: AnyDb): Promise<number> {
  const hol = await fetchAllAgents(holDb);
  const av = await fetchAllAgents(avDb);
  const avByName = new Map<string, (typeof av)[number]>();
  for (const a of av) {
    const key = a.nameNorm || normalizeNameKey(a.agentName);
    if (!key) continue;
    // Keep best record as canonical
    const existing = avByName.get(key);
    if (!existing) {
      avByName.set(key, a);
      continue;
    }
    const best = pickCanonical([{ internalId: existing.internalId, rating: existing.rating, totalInteractions: existing.totalInteractions }, { internalId: a.internalId, rating: a.rating, totalInteractions: a.totalInteractions }]);
    if (best === a.internalId) avByName.set(key, a);
  }

  let linked = 0;
  for (const h of hol) {
    const key = h.nameNorm || normalizeNameKey(h.agentName);
    if (!key) continue;
    const a = avByName.get(key);
    if (!a) continue;
    if (h.internalId == null || a.internalId == null) continue;
    // If agentId didn't match, treat HOL record as duplicate of Agentverse record for this name.
    await holDb.prepare('UPDATE agents SET crossrefAgentverseInternalId = ? WHERE internalId = ?').run(a.internalId, h.internalId);
    await avDb.prepare('UPDATE agents SET crossrefHolInternalId = ? WHERE internalId = ?').run(h.internalId, a.internalId);
    await holDb
      .prepare('UPDATE agents SET isDuplicate = 1, duplicateOfInternalId = NULL, duplicateReason = ? WHERE internalId = ?')
      .run(`name-match-agentverse:${key}`, h.internalId);
    linked += 1;
  }
  return linked;
}

export async function runHolAgentverseCrossref(): Promise<{ linkedById: number; linkedByName: number }> {
  const holDb = await createHolDbFromEnv();
  const avDb = await createAgentverseDbFromEnv();

  // Ensure both DBs have the needed schema bits (idempotent best-effort).
  await ensureHolSchema(holDb);
  await ensureAgentverseSchema(avDb);
  await ensureCrossrefColumns(holDb, 'hol');
  await ensureCrossrefColumns(avDb, 'agentverse');

  // Dedupe within each DB by name.
  await markDuplicatesWithinDb(holDb);
  await markDuplicatesWithinDb(avDb);

  // Cross-reference
  const linkedById = await crossrefByAgentId(holDb, avDb);
  const linkedByName = await crossrefByName(holDb, avDb);

  console.log('[crossref] complete', { linkedById, linkedByName });
  return { linkedById, linkedByName };
}


