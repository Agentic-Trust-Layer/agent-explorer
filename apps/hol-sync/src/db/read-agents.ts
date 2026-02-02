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
  return rows;
}
