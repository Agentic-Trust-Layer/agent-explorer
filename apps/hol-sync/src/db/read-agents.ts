import { d1Query } from '../d1/d1-http.js';

export interface HolAgentRow {
  chainId: number;
  agentId: string;
  agentAddress: string; // UAID string in hol-indexer
  agentOwner: string; // identity registry label (e.g. "HOL")
  agentName: string;
  isDuplicate?: number | null;
  tokenUri?: string;
  createdAtBlock?: number;
  createdAtTime?: number;
  description?: string;
  image?: string;
  type?: string;
  rawJson?: string;
  updatedAtTime?: number;
}

function envInt(key: string, defaultValue: number): number {
  const raw = process.env[key];
  const n = raw != null ? Number(String(raw).trim()) : NaN;
  return Number.isFinite(n) ? Math.trunc(n) : defaultValue;
}

/**
 * Read all agents from hol-indexer D1 database
 */
export async function readHolAgentsFromD1(): Promise<HolAgentRow[]> {
  // HOL is queried in KB as chainId=295, but some hol-indexer DBs may still store rows under chainId=0.
  const kbChainId = envInt('HOL_CHAIN_ID', 295);
  const d1ChainId = envInt('HOL_D1_CHAIN_ID', 0);
  const chainIds = Array.from(new Set([d1ChainId, kbChainId])).filter((n) => Number.isFinite(n));
  const where =
    chainIds.length === 1 ? `WHERE chainId = ?` : `WHERE chainId IN (${chainIds.map(() => '?').join(', ')})`;

  const rows = await d1Query<HolAgentRow>(
    `SELECT 
      chainId,
      agentId,
      agentAddress,
      agentOwner,
      agentName,
      isDuplicate,
      tokenUri,
      createdAtBlock,
      createdAtTime,
      description,
      image,
      type,
      rawJson,
      updatedAtTime
    FROM agents
    ${where}
    AND (isDuplicate IS NULL OR isDuplicate = 0)
    ORDER BY createdAtTime ASC, agentId ASC`,
    chainIds,
  );

  // Hard rule: never emit duplicate agentAddress (UAID). Prefer the most recently updated row.
  // This protects GraphDB/GraphQL consumers from duplicate UAIDs even if D1 contains duplicates.
  const byAddress = new Map<string, HolAgentRow>();
  for (const r of rows) {
    const addr = typeof (r as any)?.agentAddress === 'string' ? String((r as any).agentAddress).trim() : '';
    if (!addr) continue;
    const prev = byAddress.get(addr);
    if (!prev) {
      byAddress.set(addr, r);
      continue;
    }
    const prevUpdated = prev.updatedAtTime != null ? Number(prev.updatedAtTime) : -1;
    const nextUpdated = r.updatedAtTime != null ? Number(r.updatedAtTime) : -1;
    if (nextUpdated > prevUpdated) {
      byAddress.set(addr, r);
      continue;
    }
    if (nextUpdated < prevUpdated) continue;
    const prevCreated = prev.createdAtTime != null ? Number(prev.createdAtTime) : -1;
    const nextCreated = r.createdAtTime != null ? Number(r.createdAtTime) : -1;
    if (nextCreated > prevCreated) {
      byAddress.set(addr, r);
    }
  }

  return Array.from(byAddress.values());
}
