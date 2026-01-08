type DB = any;

function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function clamp100(x: number): number {
  if (!Number.isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 100) return 100;
  return x;
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

export type AgentTrustIndexBundle = {
  agentId: string;
  chainId: number;
  agentTrustIndex: {
    overallScore: number; // 0..100
    overallConfidence: number | null; // 0..1
    computedAt: string; // ISO
    version: string; // e.g. ati-v1
    components: Record<
      'reviews' | 'validations' | 'associations' | 'provenance' | 'freshness',
      { score: number; weight: number }
    >;
    badges: string[];
    digestRef: string;
  };
};

/**
 * Compute and persist Agent Trust Index (ATI) for fast retrieval.
 * Notes:
 * - Designed to be cheap (single agent) and deterministic.
 * - Uses existing DB aggregates (feedback/validation/associations) where possible.
 */
export async function computeAndUpsertATI(db: DB, chainId: number, agentId: string): Promise<void> {
  const row = await executeQuerySingle(
    db,
    `
      SELECT
        a.chainId,
        a.agentId,
        LOWER(a.agentAccount) AS agentAccountLower,
        a.createdAtTime,
        a.updatedAtTime,
        a.didIdentity,
        a.didAccount,
        a.didName,
        -- existing aggregates
        (SELECT COUNT(*) FROM rep_feedbacks rf WHERE rf.chainId = a.chainId AND rf.agentId = a.agentId) AS feedbackCount,
        (SELECT AVG(score) FROM rep_feedbacks rf WHERE rf.chainId = a.chainId AND rf.agentId = a.agentId AND rf.score IS NOT NULL) AS feedbackAverageScore,
        (SELECT COUNT(*) FROM validation_responses vr WHERE vr.chainId = a.chainId AND vr.agentId = a.agentId) AS validationCompletedCount,
        (SELECT COUNT(*)
         FROM associations assoc
         WHERE assoc.chainId = a.chainId
           AND (assoc.revokedAt IS NULL OR assoc.revokedAt = 0)
           AND substr(assoc.initiatorAccountId, -40) = substr(LOWER(a.agentAccount), -40)
        ) AS initiatedAssociationCount,
        (SELECT COUNT(*)
         FROM associations assoc
         WHERE assoc.chainId = a.chainId
           AND (assoc.revokedAt IS NULL OR assoc.revokedAt = 0)
           AND substr(assoc.approverAccountId, -40) = substr(LOWER(a.agentAccount), -40)
        ) AS approvedAssociationCount
      FROM agents a
      WHERE a.chainId = ? AND a.agentId = ?
      LIMIT 1
    `,
    [chainId, agentId],
  );

  if (!row) return;

  const now = Math.floor(Date.now() / 1000);
  const updatedAtTime = Number(row.updatedAtTime ?? row.createdAtTime ?? 0) || 0;
  const ageSeconds = Math.max(0, now - updatedAtTime);

  // --- Reviews (0..100) ---
  const feedbackAvg = Number(row.feedbackAverageScore);
  const feedbackCount = Number(row.feedbackCount) || 0;
  const reviewScore01 = Number.isFinite(feedbackAvg) ? clamp01(feedbackAvg / 5) : 0;
  const reviewCountBoost = clamp01(Math.log10(1 + Math.max(0, feedbackCount)) / 2); // saturates slowly
  const reviewsScore = clamp100(100 * (0.7 * reviewScore01 + 0.3 * reviewCountBoost));

  // --- Validations (0..100) ---
  const validations = Number(row.validationCompletedCount) || 0;
  const validationsScore = clamp100(100 * clamp01(Math.log10(1 + Math.max(0, validations)) / 2));

  // --- Associations (0..100) ---
  const initiated = Number(row.initiatedAssociationCount) || 0;
  const approved = Number(row.approvedAssociationCount) || 0;
  const assocTotal = initiated + approved;
  const associationsScore = clamp100(100 * clamp01(Math.log10(1 + Math.max(0, assocTotal)) / 2));

  // --- Provenance (0..100) ---
  // Simple: reward stable identity anchors being present.
  const hasDidName = Boolean(row.didName);
  const hasEnsEndpoint = false;
  const hasAccountEndpoint = false;
  const provenanceScore = clamp100(
    100 *
      clamp01(
        (hasDidName ? 0.4 : 0) +
          (hasEnsEndpoint ? 0.3 : 0) +
          (hasAccountEndpoint ? 0.3 : 0),
      ),
  );

  // --- Freshness (0..100) ---
  // Half-life-ish: 7 days.
  const halfLife = 7 * 24 * 3600;
  const freshness01 = clamp01(Math.exp(-ageSeconds / halfLife));
  const freshnessScore = clamp100(100 * freshness01);

  const weights = {
    validations: 0.30,
    reviews: 0.25,
    associations: 0.20,
    provenance: 0.15,
    freshness: 0.10,
  } as const;

  const overall =
    reviewsScore * weights.reviews +
    validationsScore * weights.validations +
    associationsScore * weights.associations +
    provenanceScore * weights.provenance +
    freshnessScore * weights.freshness;

  // Confidence: heuristic from sample sizes + freshness.
  const sample01 = clamp01(0.5 * clamp01(feedbackCount / 20) + 0.5 * clamp01(validations / 10));
  const conflictPenalty = 0; // placeholder: could incorporate revocations/disputes later
  const overallConfidence = clamp01(0.5 * sample01 + 0.5 * freshness01 - conflictPenalty);

  const badges: string[] = [];
  if (hasDidName) badges.push(`didName:${String(row.didName)}`);
  if (assocTotal > 0) badges.push(`associations:${assocTotal}`);
  if (validations > 0) badges.push(`validations:${validations}`);
  if (feedbackCount > 0) badges.push(`reviews:${feedbackCount}`);

  const version = 'ati-v1';
  const computedAtIso = new Date(now * 1000).toISOString();
  const digestRef = `trustDigest:agent:${chainId}:${agentId}:${now}`;

  const bundle: AgentTrustIndexBundle = {
    agentId: String(agentId),
    chainId: Number(chainId),
    agentTrustIndex: {
      overallScore: Math.round(clamp100(overall)),
      overallConfidence: Number.isFinite(overallConfidence) ? overallConfidence : null,
      computedAt: computedAtIso,
      version,
      components: {
        reviews: { score: Math.round(reviewsScore), weight: weights.reviews },
        validations: { score: Math.round(validationsScore), weight: weights.validations },
        associations: { score: Math.round(associationsScore), weight: weights.associations },
        provenance: { score: Math.round(provenanceScore), weight: weights.provenance },
        freshness: { score: Math.round(freshnessScore), weight: weights.freshness },
      },
      badges,
      digestRef,
    },
  };

  const bundleJson = JSON.stringify(bundle.agentTrustIndex);

  await executeUpdate(
    db,
    `
      INSERT INTO agent_trust_index(chainId, agentId, overallScore, overallConfidence, version, computedAt, bundleJson)
      VALUES(?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId) DO UPDATE SET
        overallScore=excluded.overallScore,
        overallConfidence=excluded.overallConfidence,
        version=excluded.version,
        computedAt=excluded.computedAt,
        bundleJson=excluded.bundleJson
    `,
    [chainId, String(agentId), bundle.agentTrustIndex.overallScore, bundle.agentTrustIndex.overallConfidence, version, now, bundleJson],
  );

  // Components table (redundant but query-friendly)
  const componentRows: Array<[string, number, number, string]> = [
    ['reviews', reviewsScore, weights.reviews, JSON.stringify({ feedbackCount, feedbackAverageScore: Number.isFinite(feedbackAvg) ? feedbackAvg : null })],
    ['validations', validationsScore, weights.validations, JSON.stringify({ validationCompletedCount: validations })],
    ['associations', associationsScore, weights.associations, JSON.stringify({ initiatedAssociationCount: initiated, approvedAssociationCount: approved })],
    ['provenance', provenanceScore, weights.provenance, JSON.stringify({ hasDidName, hasEnsEndpoint, hasAccountEndpoint })],
    ['freshness', freshnessScore, weights.freshness, JSON.stringify({ updatedAtTime, ageSeconds })],
  ];

  for (const [component, score, weight, evidenceCountsJson] of componentRows) {
    await executeUpdate(
      db,
      `
        INSERT INTO agent_trust_components(chainId, agentId, component, score, weight, evidenceCountsJson)
        VALUES(?, ?, ?, ?, ?, ?)
        ON CONFLICT(chainId, agentId, component) DO UPDATE SET
          score=excluded.score,
          weight=excluded.weight,
          evidenceCountsJson=excluded.evidenceCountsJson
      `,
      [chainId, String(agentId), component, score, weight, evidenceCountsJson],
    );
  }
}


