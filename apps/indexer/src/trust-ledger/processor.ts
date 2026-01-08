import { DEFAULT_TRUST_LEDGER_BADGES, type TrustLedgerBadgeDefinition } from './registry.js';

type DB = any;

async function executeQuerySingle(db: DB, sql: string, params: any[]): Promise<any | null> {
  const stmt = db.prepare(sql);
  if (stmt.bind && typeof stmt.bind === 'function') {
    const row = await stmt.bind(...params).first();
    return row ?? null;
  }
  const row = await stmt.get(...params);
  return row ?? null;
}

async function executeQuery(db: DB, sql: string, params: any[]): Promise<any[]> {
  const stmt = db.prepare(sql);
  if (stmt.bind && typeof stmt.bind === 'function') {
    const result = await stmt.bind(...params).all();
    return Array.isArray(result?.results) ? result.results : [];
  }
  const rows = await stmt.all(...params);
  return Array.isArray(rows) ? rows : [];
}

async function executeUpdate(db: DB, sql: string, params: any[]): Promise<void> {
  const stmt = db.prepare(sql);
  if (stmt.bind && typeof stmt.bind === 'function') {
    await stmt.bind(...params).run();
    return;
  }
  await stmt.run(...params);
}

type AgentSignals = {
  validationCompletedCount: number;
  approvedAssociationCount: number;
  feedbackCount: number;
  highRatingCount: number;
};

async function fetchSignals(db: DB, chainId: number, agentId: string): Promise<AgentSignals> {
  const row = await executeQuerySingle(
    db,
    `
      SELECT
        (SELECT COUNT(*) FROM validation_responses vr WHERE vr.chainId = ? AND vr.agentId = ?) AS validationCompletedCount,
        (SELECT COUNT(*)
         FROM associations a
         WHERE a.chainId = ?
           AND (a.revokedAt IS NULL OR a.revokedAt = 0)
           AND (
             substr(a.initiatorAccountId, -40) = substr(LOWER((SELECT agentAccount FROM agents WHERE chainId = ? AND agentId = ?)), -40)
             OR
             substr(a.approverAccountId, -40) = substr(LOWER((SELECT agentAccount FROM agents WHERE chainId = ? AND agentId = ?)), -40)
           )
        ) AS approvedAssociationCount,
        (SELECT COUNT(*) FROM rep_feedbacks rf WHERE rf.chainId = ? AND rf.agentId = ?) AS feedbackCount,
        (SELECT COUNT(*)
         FROM rep_feedbacks rf
         WHERE rf.chainId = ? AND rf.agentId = ?
           AND rf.ratingPct IS NOT NULL
           AND CAST(rf.ratingPct AS INTEGER) >= 90
        ) AS highRatingCount
    `,
    [chainId, agentId, chainId, chainId, agentId, chainId, agentId, chainId, agentId, chainId, agentId],
  );
  return {
    validationCompletedCount: Number((row as any)?.validationCompletedCount ?? 0) || 0,
    approvedAssociationCount: Number((row as any)?.approvedAssociationCount ?? 0) || 0,
    feedbackCount: Number((row as any)?.feedbackCount ?? 0) || 0,
    highRatingCount: Number((row as any)?.highRatingCount ?? 0) || 0,
  };
}

async function rulePasses(
  db: DB,
  chainId: number,
  agentId: string,
  def: TrustLedgerBadgeDefinition,
  signals: AgentSignals,
): Promise<boolean> {
  const cfg = (def.ruleConfig ?? {}) as any;
  const threshold = Number(cfg.threshold ?? 0) || 0;
  switch (def.ruleId) {
    case 'validation_count_gte':
      return signals.validationCompletedCount >= threshold;
    case 'association_approved_count_gte':
      return signals.approvedAssociationCount >= threshold;
    case 'feedback_count_gte':
      return signals.feedbackCount >= threshold;
    case 'feedback_high_rating_count_gte': {
      const minRatingPct = Number(cfg.minRatingPct ?? 90) || 90;
      if (minRatingPct !== 90) return false;
      return signals.highRatingCount >= threshold;
    }
    case 'validation_response_agent_name': {
      const agentName = String(cfg.agentName ?? '').trim();
      if (!agentName) {
        console.log(`[validation_response_agent_name] Rule config missing agentName for badge ${def.badgeId}`);
        return false;
      }
      // Check if there's a validation response for this agent where the VALIDATOR's agent name matches
      // Join with agents table to find the validator's agent record (matching validatorAddress to agentAccount)
      const row = await executeQuerySingle(
        db,
        `
          SELECT COUNT(*) as count, 
                 GROUP_CONCAT(DISTINCT validator_agent.agentName) as validatorNames,
                 GROUP_CONCAT(DISTINCT validator_agent.agentId) as validatorAgentIds
          FROM validation_responses vr
          INNER JOIN agents validator_agent ON 
            validator_agent.chainId = vr.chainId 
            AND (
              substr(LOWER(validator_agent.agentAccount), -40) = substr(LOWER(vr.validatorAddress), -40)
            )
          WHERE vr.chainId = ? 
            AND vr.agentId = ? 
            AND LOWER(TRIM(validator_agent.agentName)) = LOWER(?)
        `,
        [chainId, agentId, agentName],
      );
      const count = Number((row as any)?.count ?? 0) || 0;
      const validatorNames = String((row as any)?.validatorNames ?? '');
      const validatorAgentIds = String((row as any)?.validatorAgentIds ?? '');
      
      console.log(`[validation_response_agent_name] Checking badge ${def.badgeId} for agent ${chainId}:${agentId}`);
      console.log(`[validation_response_agent_name] Rule agentName: "${agentName}"`);
      console.log(`[validation_response_agent_name] Found ${count} matching validation response(s)`);
      if (count > 0) {
        console.log(`[validation_response_agent_name] Validator agent names: ${validatorNames}`);
        console.log(`[validation_response_agent_name] Validator agent IDs: ${validatorAgentIds}`);
      }
      
      return count > 0;
    }
    case 'association_approved_approver_agent_name': {
      const agentName = String(cfg.agentName ?? '').trim();
      if (!agentName) {
        console.log(`[association_approved_approver_agent_name] Rule config missing agentName for badge ${def.badgeId}`);
        return false;
      }
      // Check if there's an approved association where:
      // - This agent is the initiator (matches initiatorAccountId)
      // - The approver's agent name matches the configured name
      // - The association is not revoked
      const row = await executeQuerySingle(
        db,
        `
          SELECT COUNT(*) as count,
                 GROUP_CONCAT(DISTINCT approver_agent.agentName) as approverNames,
                 GROUP_CONCAT(DISTINCT approver_agent.agentId) as approverAgentIds,
                 GROUP_CONCAT(DISTINCT a.associationId) as associationIds
          FROM associations a
          INNER JOIN agents initiator_agent ON
            initiator_agent.chainId = a.chainId
            AND substr(LOWER(initiator_agent.agentAccount), -40) = substr(LOWER(a.initiatorAccountId), -40)
          INNER JOIN agents approver_agent ON
            approver_agent.chainId = a.chainId
            AND substr(LOWER(approver_agent.agentAccount), -40) = substr(LOWER(a.approverAccountId), -40)
          WHERE a.chainId = ?
            AND initiator_agent.agentId = ?
            AND (a.revokedAt IS NULL OR a.revokedAt = 0)
            AND LOWER(TRIM(approver_agent.agentName)) = LOWER(?)
        `,
        [chainId, agentId, agentName],
      );
      const count = Number((row as any)?.count ?? 0) || 0;
      const approverNames = String((row as any)?.approverNames ?? '');
      const approverAgentIds = String((row as any)?.approverAgentIds ?? '');
      const associationIds = String((row as any)?.associationIds ?? '');
      
      console.log(`[association_approved_approver_agent_name] Checking badge ${def.badgeId} for agent ${chainId}:${agentId}`);
      console.log(`[association_approved_approver_agent_name] Rule agentName: "${agentName}"`);
      console.log(`[association_approved_approver_agent_name] Found ${count} matching approved association(s)`);
      if (count > 0) {
        console.log(`[association_approved_approver_agent_name] Approver agent names: ${approverNames}`);
        console.log(`[association_approved_approver_agent_name] Approver agent IDs: ${approverAgentIds}`);
        console.log(`[association_approved_approver_agent_name] Association IDs: ${associationIds}`);
      }
      
      return count > 0;
    }
    default:
      return false;
  }
}

async function ensureBadgeCatalog(db: DB, now: number): Promise<void> {
  // Seed defaults only if DB has no definitions yet.
  const countRow = await executeQuerySingle(db, 'SELECT COUNT(*) as count FROM trust_ledger_badge_definitions', []);
  const count = Number((countRow as any)?.count ?? 0) || 0;
  if (count > 0) return;

  for (const def of DEFAULT_TRUST_LEDGER_BADGES) {
    const ruleJson = def.ruleConfig ? JSON.stringify(def.ruleConfig) : null;
    await executeUpdate(
      db,
      `
        INSERT INTO trust_ledger_badge_definitions(
          badgeId, program, name, description, iconRef, points, ruleId, ruleJson, active, createdAt, updatedAt
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(badgeId) DO UPDATE SET
          program=excluded.program,
          name=excluded.name,
          description=excluded.description,
          iconRef=excluded.iconRef,
          points=excluded.points,
          ruleId=excluded.ruleId,
          ruleJson=excluded.ruleJson,
          active=excluded.active,
          updatedAt=excluded.updatedAt
      `,
      [
        def.badgeId,
        def.program,
        def.name,
        def.description ?? null,
        def.iconRef ?? null,
        def.points,
        def.ruleId,
        ruleJson,
        def.active ? 1 : 0,
        now,
        now,
      ],
    );
  }
}

async function loadActiveBadgeDefinitions(db: DB): Promise<TrustLedgerBadgeDefinition[]> {
  const rows = await executeQuery(
    db,
    `
      SELECT badgeId, program, name, description, iconRef, points, ruleId, ruleJson, active
      FROM trust_ledger_badge_definitions
      WHERE active = 1
      ORDER BY badgeId ASC
    `,
    [],
  );
  return rows.map((row) => {
    let ruleConfig: Record<string, unknown> | undefined = undefined;
    const raw = (row as any)?.ruleJson;
    if (typeof raw === 'string' && raw.trim()) {
      try {
        ruleConfig = JSON.parse(raw);
      } catch {
        ruleConfig = undefined;
      }
    }
    return {
      badgeId: String((row as any)?.badgeId ?? ''),
      program: String((row as any)?.program ?? ''),
      name: String((row as any)?.name ?? ''),
      description: (row as any)?.description != null ? String((row as any).description) : undefined,
      iconRef: (row as any)?.iconRef != null ? String((row as any).iconRef) : undefined,
      points: Number((row as any)?.points ?? 0) || 0,
      ruleId: String((row as any)?.ruleId ?? ''),
      ruleConfig,
      active: true,
    };
  }).filter((def) => Boolean(def.badgeId && def.ruleId));
}

async function ensureProfile(db: DB, chainId: number, agentId: string, now: number): Promise<void> {
  await executeUpdate(
    db,
    `
      INSERT INTO trust_ledger_profiles(chainId, agentId, profileVersion, createdAt, updatedAt)
      VALUES(?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId) DO UPDATE SET updatedAt=excluded.updatedAt
    `,
    [chainId, agentId, 'trust-ledger-v1', now, now],
  );
}

async function awardBadgeAndPoints(
  db: DB,
  chainId: number,
  agentId: string,
  def: TrustLedgerBadgeDefinition,
  now: number,
  evidenceEventId?: string | null,
  evidenceJson?: any,
) {
  await executeUpdate(
    db,
    `
      INSERT INTO trust_ledger_badge_awards(chainId, agentId, badgeId, awardedAt, evidenceEventId, evidenceJson, issuer)
      VALUES(?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId, badgeId) DO NOTHING
    `,
    [
      chainId,
      agentId,
      def.badgeId,
      now,
      evidenceEventId ?? null,
      evidenceJson ? JSON.stringify(evidenceJson) : null,
      null,
    ],
  );

  const txId = `badge:${def.badgeId}`;
  await executeUpdate(
    db,
    `
      INSERT INTO trust_ledger_point_transactions(chainId, agentId, txId, badgeId, deltaPoints, reason, evidenceEventId, createdAt)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId, txId) DO NOTHING
    `,
    [
      chainId,
      agentId,
      txId,
      def.badgeId,
      def.points,
      `Awarded badge ${def.badgeId}`,
      evidenceEventId ?? null,
      now,
    ],
  );
}

async function recomputeScore(db: DB, chainId: number, agentId: string, now: number): Promise<void> {
  const totals = await executeQuerySingle(
    db,
    `
      SELECT
        (SELECT COALESCE(SUM(deltaPoints), 0) FROM trust_ledger_point_transactions WHERE chainId = ? AND agentId = ?) AS totalPoints,
        (SELECT COUNT(*) FROM trust_ledger_badge_awards WHERE chainId = ? AND agentId = ?) AS badgeCount
    `,
    [chainId, agentId, chainId, agentId],
  );
  const totalPoints = Number((totals as any)?.totalPoints ?? 0) || 0;
  const badgeCount = Number((totals as any)?.badgeCount ?? 0) || 0;
  await executeUpdate(
    db,
    `
      INSERT INTO trust_ledger_scores(chainId, agentId, totalPoints, badgeCount, computedAt, digestJson)
      VALUES(?, ?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId) DO UPDATE SET
        totalPoints=excluded.totalPoints,
        badgeCount=excluded.badgeCount,
        computedAt=excluded.computedAt,
        digestJson=excluded.digestJson
    `,
    [chainId, agentId, totalPoints, badgeCount, now, null],
  );
}

export async function trustLedgerProcessAgent(
  db: DB,
  chainId: number,
  agentId: string,
  opts?: { evidenceEventId?: string | null; evidence?: any },
) {
  const now = Math.floor(Date.now() / 1000);
  await ensureBadgeCatalog(db, now);
  await ensureProfile(db, chainId, agentId, now);

  const signals = await fetchSignals(db, chainId, agentId);
  const defs = await loadActiveBadgeDefinitions(db);
  for (const def of defs) {
    if (!(await rulePasses(db, chainId, agentId, def, signals))) continue;
    await awardBadgeAndPoints(db, chainId, agentId, def, now, opts?.evidenceEventId ?? null, opts?.evidence ?? null);
  }

  await recomputeScore(db, chainId, agentId, now);
  
  // Note: Rankings are updated separately via updateTrustLedgerRankings()
  // to avoid recalculating all rankings on every agent update
}


