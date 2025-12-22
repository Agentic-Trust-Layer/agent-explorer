/**
 * Trust Ledger Rankings
 * Computes and updates rankings for agents based on trust ledger scores and agent trust index
 */

type DB = any;

async function executeQuery(db: DB, sql: string, params: any[]): Promise<any[]> {
  const stmt = db.prepare(sql);
  if (stmt.bind && typeof stmt.bind === 'function') {
    const result = await stmt.bind(...params).all();
    return Array.isArray(result?.results) ? result.results : [];
  }
  const rows = await stmt.all(...params);
  return Array.isArray(rows) ? rows : [];
}

async function executeQuerySingle(db: DB, sql: string, params: any[]): Promise<any | null> {
  const stmt = db.prepare(sql);
  if (stmt.bind && typeof stmt.bind === 'function') {
    const row = await stmt.bind(...params).first();
    return row ?? null;
  }
  const row = await stmt.get(...params);
  return row ?? null;
}

async function executeUpdate(db: DB, sql: string, params: any[]): Promise<void> {
  const stmt = db.prepare(sql);
  if (stmt.bind && typeof stmt.bind === 'function') {
    await stmt.bind(...params).run();
    return;
  }
  await stmt.run(...params);
}

/**
 * Update overall rankings for all agents using pure SQL
 * Ranking is based on:
 * 1. Primary: trust_ledger_scores.totalPoints (DESC)
 * 2. Secondary: agent_trust_index.overallScore (DESC)
 * Uses SQL RANK() window function for efficient calculation
 */
async function updateOverallRankings(db: DB, chainId?: number): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  
  // Check how many agents exist first
  const agentCountResult = await executeQuerySingle(
    db,
    chainId !== undefined 
      ? `SELECT COUNT(*) as count FROM agents WHERE chainId = ?`
      : `SELECT COUNT(*) as count FROM agents`,
    chainId !== undefined ? [chainId] : [],
  );
  const agentCount = Number((agentCountResult as any)?.count ?? 0) || 0;
  console.log(`[trust_ledger_rankings] Found ${agentCount} agents${chainId ? ` on chain ${chainId}` : ''} to rank`);

  if (agentCount === 0) {
    console.log(`[trust_ledger_rankings] No agents found, skipping ranking update`);
    return;
  }

  // Use SQL window function to calculate ranks, then upsert using INSERT OR REPLACE
  // First delete existing overall rankings for this chain
  if (chainId !== undefined) {
    await executeUpdate(
      db,
      `DELETE FROM trust_ledger_rankings WHERE chainId = ? AND capability IS NULL`,
      [chainId],
    );
  } else {
    await executeUpdate(
      db,
      `DELETE FROM trust_ledger_rankings WHERE capability IS NULL`,
      [],
    );
  }

  // Build the query with proper parameter binding
  // Parameter order: WHERE clause params come first, then outer SELECT params
  let insertSql: string;
  let insertParams: any[];
  
  if (chainId !== undefined) {
    insertSql = `
      INSERT INTO trust_ledger_rankings(chainId, agentId, overallRank, capability, capabilityRank, updatedAt)
      SELECT 
        ranked.chainId,
        ranked.agentId,
        ranked.rank AS overallRank,
        NULL AS capability,
        NULL AS capabilityRank,
        ? AS updatedAt
      FROM (
        SELECT 
          a.chainId,
          a.agentId,
          RANK() OVER (
            ORDER BY 
              COALESCE(tls.totalPoints, 0) DESC,
              COALESCE(ati.overallScore, 0) DESC,
              CAST(a.agentId AS INTEGER) ASC
          ) AS rank
        FROM agents a
        LEFT JOIN trust_ledger_scores tls ON tls.chainId = a.chainId AND tls.agentId = a.agentId
        LEFT JOIN agent_trust_index ati ON ati.chainId = a.chainId AND ati.agentId = a.agentId
        WHERE a.chainId = ?
      ) ranked
    `;
    insertParams = [now, chainId]; // updatedAt first, then chainId for WHERE clause
  } else {
    insertSql = `
      INSERT INTO trust_ledger_rankings(chainId, agentId, overallRank, capability, capabilityRank, updatedAt)
      SELECT 
        ranked.chainId,
        ranked.agentId,
        ranked.rank AS overallRank,
        NULL AS capability,
        NULL AS capabilityRank,
        ? AS updatedAt
      FROM (
        SELECT 
          a.chainId,
          a.agentId,
          RANK() OVER (
            ORDER BY 
              COALESCE(tls.totalPoints, 0) DESC,
              COALESCE(ati.overallScore, 0) DESC,
              CAST(a.agentId AS INTEGER) ASC
          ) AS rank
        FROM agents a
        LEFT JOIN trust_ledger_scores tls ON tls.chainId = a.chainId AND tls.agentId = a.agentId
        LEFT JOIN agent_trust_index ati ON ati.chainId = a.chainId AND ati.agentId = a.agentId
      ) ranked
    `;
    insertParams = [now];
  }
  
  console.log(`[trust_ledger_rankings] Executing overall ranking insert with params:`, insertParams);
  const result = await executeUpdate(db, insertSql, insertParams);
  const rowsAffected = (result as any)?.changes ?? (result as any)?.meta?.rows_written ?? 0;
  console.log(`[trust_ledger_rankings] Overall ranking insert completed, rows affected: ${rowsAffected}`);

  const countResult = await executeQuerySingle(
    db,
    `SELECT COUNT(*) as count FROM trust_ledger_rankings WHERE capability IS NULL ${chainId !== undefined ? 'AND chainId = ?' : ''}`,
    chainId !== undefined ? [chainId] : [],
  );
  const count = Number((countResult as any)?.count ?? 0) || 0;
  console.log(`[trust_ledger_rankings] Updated overall rankings for ${count} agents${chainId ? ` on chain ${chainId}` : ''}`);
}

/**
 * Update per-capability rankings using pure SQL
 * Uses agentCategory as the capability
 * Uses SQL RANK() window function with PARTITION BY for efficient calculation
 */
async function updateCapabilityRankings(db: DB, chainId?: number): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  
  // Check how many agents with categories exist
  const categoryCountResult = await executeQuerySingle(
    db,
    chainId !== undefined
      ? `SELECT COUNT(*) as count FROM agents WHERE chainId = ? AND agentCategory IS NOT NULL AND agentCategory != ''`
      : `SELECT COUNT(*) as count FROM agents WHERE agentCategory IS NOT NULL AND agentCategory != ''`,
    chainId !== undefined ? [chainId] : [],
  );
  const categoryCount = Number((categoryCountResult as any)?.count ?? 0) || 0;
  console.log(`[trust_ledger_rankings] Found ${categoryCount} agents with categories${chainId ? ` on chain ${chainId}` : ''} to rank`);

  if (categoryCount === 0) {
    console.log(`[trust_ledger_rankings] No agents with categories found, skipping capability ranking update`);
    return;
  }

  // First delete existing capability rankings for this chain
  if (chainId !== undefined) {
    await executeUpdate(
      db,
      `DELETE FROM trust_ledger_rankings WHERE chainId = ? AND capability IS NOT NULL`,
      [chainId],
    );
  } else {
    await executeUpdate(
      db,
      `DELETE FROM trust_ledger_rankings WHERE capability IS NOT NULL`,
      [],
    );
  }

  // Build the query with proper parameter binding
  // Parameter order: WHERE clause params come first, then outer SELECT params
  let insertSql: string;
  let insertParams: any[];
  
  if (chainId !== undefined) {
    insertSql = `
      INSERT INTO trust_ledger_rankings(chainId, agentId, overallRank, capability, capabilityRank, updatedAt)
      SELECT 
        ranked.chainId,
        ranked.agentId,
        NULL AS overallRank,
        ranked.capability,
        ranked.rank AS capabilityRank,
        ? AS updatedAt
      FROM (
        SELECT 
          a.chainId,
          a.agentId,
          a.agentCategory AS capability,
          RANK() OVER (
            PARTITION BY a.chainId, a.agentCategory
            ORDER BY 
              COALESCE(tls.totalPoints, 0) DESC,
              COALESCE(ati.overallScore, 0) DESC,
              CAST(a.agentId AS INTEGER) ASC
          ) AS rank
        FROM agents a
        LEFT JOIN trust_ledger_scores tls ON tls.chainId = a.chainId AND tls.agentId = a.agentId
        LEFT JOIN agent_trust_index ati ON ati.chainId = a.chainId AND ati.agentId = a.agentId
        WHERE a.agentCategory IS NOT NULL AND a.agentCategory != ''
          AND a.chainId = ?
      ) ranked
    `;
    insertParams = [now, chainId]; // updatedAt first, then chainId for WHERE clause
  } else {
    insertSql = `
      INSERT INTO trust_ledger_rankings(chainId, agentId, overallRank, capability, capabilityRank, updatedAt)
      SELECT 
        ranked.chainId,
        ranked.agentId,
        NULL AS overallRank,
        ranked.capability,
        ranked.rank AS capabilityRank,
        ? AS updatedAt
      FROM (
        SELECT 
          a.chainId,
          a.agentId,
          a.agentCategory AS capability,
          RANK() OVER (
            PARTITION BY a.chainId, a.agentCategory
            ORDER BY 
              COALESCE(tls.totalPoints, 0) DESC,
              COALESCE(ati.overallScore, 0) DESC,
              CAST(a.agentId AS INTEGER) ASC
          ) AS rank
        FROM agents a
        LEFT JOIN trust_ledger_scores tls ON tls.chainId = a.chainId AND tls.agentId = a.agentId
        LEFT JOIN agent_trust_index ati ON ati.chainId = a.chainId AND ati.agentId = a.agentId
        WHERE a.agentCategory IS NOT NULL AND a.agentCategory != ''
      ) ranked
    `;
    insertParams = [now];
  }
  
  console.log(`[trust_ledger_rankings] Executing capability ranking insert with params:`, insertParams);
  const result = await executeUpdate(db, insertSql, insertParams);
  const rowsAffected = (result as any)?.changes ?? (result as any)?.meta?.rows_written ?? 0;
  console.log(`[trust_ledger_rankings] Capability ranking insert completed, rows affected: ${rowsAffected}`);

  const countResult = await executeQuerySingle(
    db,
    `SELECT COUNT(*) as count FROM trust_ledger_rankings WHERE capability IS NOT NULL ${chainId !== undefined ? 'AND chainId = ?' : ''}`,
    chainId !== undefined ? [chainId] : [],
  );
  const count = Number((countResult as any)?.count ?? 0) || 0;
  console.log(`[trust_ledger_rankings] Updated capability rankings for ${count} agent-capability pairs${chainId ? ` on chain ${chainId}` : ''}`);
}

/**
 * Update all rankings (overall and per-capability)
 * @param db - Database instance
 * @param chainId - Optional chain ID to limit to specific chain
 */
export async function updateTrustLedgerRankings(db: DB, chainId?: number): Promise<void> {
  console.log(`[trust_ledger_rankings] Starting ranking update${chainId ? ` for chain ${chainId}` : ''}...`);
  
  try {
    await updateOverallRankings(db, chainId);
    await updateCapabilityRankings(db, chainId);
    console.log(`[trust_ledger_rankings] Ranking update completed${chainId ? ` for chain ${chainId}` : ''}`);
  } catch (error) {
    console.error(`[trust_ledger_rankings] Error updating rankings:`, error);
    throw error;
  }
}

