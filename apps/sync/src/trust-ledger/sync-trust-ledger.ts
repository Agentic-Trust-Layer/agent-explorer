import { d1Query, getD1ConfigFromEnv } from '../d1/d1-http.js';
import { ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, uploadTurtleToRepository, clearStatements } from '../graphdb-http.js';
import { agentIri, escapeTurtleString, iriEncodeSegment } from '../rdf/common.js';

function analyticsContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/analytics/${chainId}`;
}

function analyticsSystemContext(): string {
  return `https://www.agentictrust.io/graph/data/analytics/system`;
}

function analyticsPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '@prefix analytics: <https://agentictrust.io/ontology/core/analytics#> .',
    '',
  ].join('\n');
}

function trustLedgerScoreIri(chainId: number, agentId: string): string {
  return `<https://www.agentictrust.io/id/agent-trust-ledger-score/${chainId}/${iriEncodeSegment(agentId)}>`;
}

function trustLedgerBadgeDefIri(badgeId: string): string {
  return `<https://www.agentictrust.io/id/trust-ledger-badge-definition/${iriEncodeSegment(badgeId)}>`;
}

type TrustLedgerScoreRow = {
  chainId: number;
  agentId: string;
  totalPoints: number;
  badgeCount: number;
  computedAt: number | null;
  digestJson: string | null;
};

type TrustLedgerBadgeDefRow = {
  badgeId: string;
  program: string;
  name: string;
  description: string | null;
  iconRef: string | null;
  points: number;
  ruleId: string;
  ruleJson: string | null;
  active: number;
  createdAt: number | null;
  updatedAt: number | null;
};

async function exportTrustLedgerScoresTurtle(chainId: number, opts?: { limit?: number }): Promise<{ turtle: string; rowCount: number }> {
  const cfg = getD1ConfigFromEnv();
  if (!cfg) throw new Error('D1 not configured (missing CLOUDFLARE_* env vars)');

  const cId = Number.isFinite(Number(chainId)) ? Math.trunc(Number(chainId)) : 0;
  if (!cId) throw new Error('chainId required');

  const pageSize = 2000;
  const maxRows = typeof opts?.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : 250_000;
  let offset = 0;
  let rowsOut = 0;

  const lines: string[] = [analyticsPrefixes()];

  for (;;) {
    if (rowsOut >= maxRows) break;
    const rows = await d1Query<TrustLedgerScoreRow>(
      `SELECT chainId, agentId, totalPoints, badgeCount, computedAt, digestJson
       FROM trust_ledger_scores
       WHERE chainId = ?
       ORDER BY agentId ASC
       LIMIT ? OFFSET ?`,
      [cId, pageSize, offset],
      { timeoutMs: 30_000, retries: 2 },
    );
    if (!rows.length) break;

    for (const row of rows) {
      const agentId = String(row?.agentId ?? '').trim();
      if (!agentId) continue;
      const iri = trustLedgerScoreIri(cId, agentId);
      const aIri = agentIri(cId, agentId);

      const totalPoints = Math.trunc(Number(row?.totalPoints ?? 0));
      const badgeCount = Math.trunc(Number(row?.badgeCount ?? 0));
      const computedAt = row?.computedAt != null ? Math.trunc(Number(row.computedAt)) : null;
      const digestJson = row?.digestJson != null ? String(row.digestJson) : null;

      lines.push(`${iri} a analytics:AgentTrustLedgerScore, prov:Entity ;`);
      lines.push(`  analytics:trustLedgerForAgent ${aIri} ;`);
      lines.push(`  analytics:trustLedgerChainId ${cId} ;`);
      lines.push(`  analytics:trustLedgerAgentId "${escapeTurtleString(agentId)}" ;`);
      lines.push(`  analytics:totalPoints ${Number.isFinite(totalPoints) ? totalPoints : 0} ;`);
      lines.push(`  analytics:badgeCount ${Number.isFinite(badgeCount) ? badgeCount : 0} ;`);
      if (computedAt != null && Number.isFinite(computedAt) && computedAt > 0) {
        lines.push(`  analytics:trustLedgerComputedAt ${computedAt} ;`);
      }
      if (digestJson && digestJson.trim()) {
        lines.push(`  analytics:digestJson "${escapeTurtleString(digestJson)}" ;`);
      }
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      lines.push('');

      // Agent -> score link (stored in analytics graph for easy JOINs with ATI graph)
      lines.push(`${aIri} analytics:hasTrustLedgerScore ${iri} .`);
      lines.push('');

      rowsOut++;
      if (rowsOut >= maxRows) break;
    }

    offset += rows.length;
    if (rows.length < pageSize) break;
  }

  return { turtle: lines.join('\n'), rowCount: rowsOut };
}

async function exportTrustLedgerBadgeDefsTurtle(opts?: { limit?: number }): Promise<{ turtle: string; rowCount: number }> {
  const cfg = getD1ConfigFromEnv();
  if (!cfg) throw new Error('D1 not configured (missing CLOUDFLARE_* env vars)');

  const pageSize = 2000;
  const maxRows = typeof opts?.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : 250_000;
  let offset = 0;
  let rowsOut = 0;

  const lines: string[] = [analyticsPrefixes()];

  for (;;) {
    if (rowsOut >= maxRows) break;
    const rows = await d1Query<TrustLedgerBadgeDefRow>(
      `SELECT badgeId, program, name, description, iconRef, points, ruleId, ruleJson, active, createdAt, updatedAt
       FROM trust_ledger_badge_definitions
       ORDER BY badgeId ASC
       LIMIT ? OFFSET ?`,
      [pageSize, offset],
      { timeoutMs: 30_000, retries: 2 },
    );
    if (!rows.length) break;

    for (const row of rows) {
      const badgeId = String(row?.badgeId ?? '').trim();
      if (!badgeId) continue;
      const iri = trustLedgerBadgeDefIri(badgeId);
      lines.push(`${iri} a analytics:TrustLedgerBadgeDefinition, prov:Entity ;`);
      lines.push(`  analytics:badgeId "${escapeTurtleString(badgeId)}" ;`);
      lines.push(`  analytics:program "${escapeTurtleString(String(row?.program ?? ''))}" ;`);
      lines.push(`  analytics:name "${escapeTurtleString(String(row?.name ?? ''))}" ;`);
      if (row?.description != null) lines.push(`  analytics:description "${escapeTurtleString(String(row.description))}" ;`);
      if (row?.iconRef != null) lines.push(`  analytics:iconRef "${escapeTurtleString(String(row.iconRef))}" ;`);
      lines.push(`  analytics:points ${Math.trunc(Number(row?.points ?? 0))} ;`);
      lines.push(`  analytics:ruleId "${escapeTurtleString(String(row?.ruleId ?? ''))}" ;`);
      if (row?.ruleJson != null) lines.push(`  analytics:ruleJson "${escapeTurtleString(String(row.ruleJson))}" ;`);
      lines.push(`  analytics:active ${(Number(row?.active ?? 0) ? 'true' : 'false')} ;`);
      if (row?.createdAt != null) lines.push(`  analytics:createdAt ${Math.trunc(Number(row.createdAt))} ;`);
      if (row?.updatedAt != null) lines.push(`  analytics:updatedAt ${Math.trunc(Number(row.updatedAt))} ;`);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      lines.push('');

      rowsOut++;
      if (rowsOut >= maxRows) break;
    }

    offset += rows.length;
    if (rows.length < pageSize) break;
  }

  return { turtle: lines.join('\n'), rowCount: rowsOut };
}

export async function syncTrustLedgerToGraphdbForChain(
  chainId: number,
  opts?: { resetContext?: boolean; limitScores?: number; limitBadgeDefs?: number },
): Promise<{ scoreRows: number; badgeDefRows: number }> {
  if (!getD1ConfigFromEnv()) {
    console.warn('[sync] [trust-ledger] skipping: D1 not configured (missing CLOUDFLARE_* env vars)');
    return { scoreRows: 0, badgeDefRows: 0 };
  }

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const ctx = analyticsContext(chainId);
  const sysCtx = analyticsSystemContext();

  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context: ctx });
    await clearStatements(baseUrl, repository, auth, { context: sysCtx });
  }

  const scores = await exportTrustLedgerScoresTurtle(chainId, { limit: opts?.limitScores });
  if (scores.turtle.trim()) {
    await uploadTurtleToRepository(baseUrl, repository, auth, { context: ctx, turtle: scores.turtle });
  }
  console.info('[sync] [trust-ledger] uploaded scores', { chainId, ctx, scoreRows: scores.rowCount });

  const badgeDefs = await exportTrustLedgerBadgeDefsTurtle({ limit: opts?.limitBadgeDefs });
  if (badgeDefs.turtle.trim()) {
    await uploadTurtleToRepository(baseUrl, repository, auth, { context: sysCtx, turtle: badgeDefs.turtle });
  }
  console.info('[sync] [trust-ledger] uploaded badge defs', { chainId, sysCtx, badgeDefRows: badgeDefs.rowCount });

  return { scoreRows: scores.rowCount, badgeDefRows: badgeDefs.rowCount };
}

