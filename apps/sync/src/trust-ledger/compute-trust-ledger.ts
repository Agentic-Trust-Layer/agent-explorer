import { clearStatements, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, queryGraphdb, uploadTurtleToRepository } from '../graphdb-http.js';
import { escapeTurtleString, iriEncodeSegment } from '../rdf/common.js';
import { DEFAULT_TRUST_LEDGER_BADGES, type TrustLedgerBadgeDefinition } from './badges.js';

function analyticsContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/analytics/${chainId}`;
}

function analyticsSystemContext(): string {
  return `https://www.agentictrust.io/graph/data/analytics/system`;
}

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function ttlPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '@prefix erc8004: <https://agentictrust.io/ontology/erc8004#> .',
    '@prefix erc8092: <https://agentictrust.io/ontology/erc8092#> .',
    '@prefix analytics: <https://agentictrust.io/ontology/core/analytics#> .',
    '',
  ].join('\n');
}

function trustLedgerBadgeDefIri(badgeId: string): string {
  return `<https://www.agentictrust.io/id/trust-ledger-badge-definition/${iriEncodeSegment(badgeId)}>`;
}

function trustLedgerScoreIri(chainId: number, agentId: string): string {
  return `<https://www.agentictrust.io/id/agent-trust-ledger-score/${chainId}/${iriEncodeSegment(agentId)}>`;
}

function trustLedgerBadgeAwardIri(chainId: number, agentId: string, badgeId: string): string {
  return `<https://www.agentictrust.io/id/trust-ledger-badge-award/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(badgeId)}>`;
}

function jsonLiteral(s: string): string {
  return `"${escapeTurtleString(s)}"`;
}

function asNumBinding(b: any): number | null {
  const v = b?.value;
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function asStrBinding(b: any): string | null {
  const v = b?.value;
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

type TrustLedgerSignals = {
  validationCount: number;
  feedbackCount: number;
  feedbackHighRatingCount: number;
  associationApprovedCount: number;
};

function clampInt(n: unknown, min: number, max: number): number {
  const x = Number.isFinite(Number(n)) ? Math.trunc(Number(n)) : 0;
  return Math.max(min, Math.min(max, x));
}

function computeSignalsThreshold(def: TrustLedgerBadgeDefinition): { threshold: number; minRatingPct?: number } {
  const cfg = (def.ruleConfig ?? {}) as any;
  const threshold = clampInt(cfg.threshold ?? 0, 0, 1_000_000_000);
  const minRatingPct = cfg.minRatingPct != null ? clampInt(cfg.minRatingPct, 0, 100) : undefined;
  return { threshold, minRatingPct };
}

function rulePasses(def: TrustLedgerBadgeDefinition, sig: TrustLedgerSignals): boolean {
  const { threshold, minRatingPct } = computeSignalsThreshold(def);
  switch (def.ruleId) {
    case 'validation_count_gte':
      return sig.validationCount >= threshold;
    case 'feedback_count_gte':
      return sig.feedbackCount >= threshold;
    case 'feedback_high_rating_count_gte': {
      // Only defined for minRatingPct=90 in defaults; enforce that for now.
      if (minRatingPct != null && minRatingPct !== 90) return false;
      return sig.feedbackHighRatingCount >= threshold;
    }
    case 'association_approved_count_gte':
      return sig.associationApprovedCount >= threshold;
    default:
      return false;
  }
}

function badgeDefsTurtle(defs: TrustLedgerBadgeDefinition[], now: number): string {
  const lines: string[] = [ttlPrefixes()];
  for (const def of defs) {
    const badgeId = String(def.badgeId ?? '').trim();
    if (!badgeId) continue;
    const iri = trustLedgerBadgeDefIri(badgeId);
    const ruleJson = def.ruleConfig ? JSON.stringify(def.ruleConfig) : null;
    lines.push(`${iri} a analytics:TrustLedgerBadgeDefinition, prov:Entity ;`);
    lines.push(`  analytics:badgeId ${jsonLiteral(badgeId)} ;`);
    lines.push(`  analytics:program ${jsonLiteral(String(def.program ?? ''))} ;`);
    lines.push(`  analytics:name ${jsonLiteral(String(def.name ?? ''))} ;`);
    if (def.description) lines.push(`  analytics:description ${jsonLiteral(String(def.description))} ;`);
    if (def.iconRef) lines.push(`  analytics:iconRef ${jsonLiteral(String(def.iconRef))} ;`);
    lines.push(`  analytics:points ${Math.trunc(Number(def.points ?? 0))} ;`);
    lines.push(`  analytics:ruleId ${jsonLiteral(String(def.ruleId ?? ''))} ;`);
    if (ruleJson) lines.push(`  analytics:ruleJson ${jsonLiteral(ruleJson)} ;`);
    lines.push(`  analytics:active ${def.active ? 'true' : 'false'} ;`);
    lines.push(`  analytics:createdAt ${now} ;`);
    lines.push(`  analytics:updatedAt ${now} .`);
    lines.push('');
  }
  return lines.join('\n');
}

function signalsPageSparql(args: { chainId: number; ctx: string; limit: number; offset: number }): string {
  const { ctx, limit, offset } = args;
  // ERC-8004 only: derive numeric agent id from the ERC-8004 identity (not from the agent node).
  return [
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX erc8092: <https://agentictrust.io/ontology/erc8092#>',
    '',
    'SELECT ?agent ?agentId ?validationCount ?feedbackCount ?feedbackHighRatingCount ?associationApprovedCount WHERE {',
    '  {',
    '    SELECT ?agent ?agentId WHERE {',
    `      GRAPH <${ctx}> {`,
    '        ?agent a core:AIAgent ; core:hasIdentity ?id .',
    '        ?id a erc8004:AgentIdentity8004 ; erc8004:agentId ?agentId .',
    '      }',
    '    }',
    '    ORDER BY xsd:integer(?agentId) ASC(STR(?agent))',
    `    LIMIT ${Math.trunc(limit)}`,
    `    OFFSET ${Math.trunc(offset)}`,
    '  }',
    '',
    `  GRAPH <${ctx}> {`,
    '    OPTIONAL { ?agent core:hasValidationAssertionSummary ?vs . ?vs core:validationAssertionCount ?validationCount . }',
    '    OPTIONAL { ?agent core:hasFeedbackAssertionSummary ?fs . ?fs core:feedbackAssertionCount ?feedbackCount . }',
    '',
    // High-rating feedback count (requires erc8004:feedbackRatingPct materialized on Feedback entities)
    '    OPTIONAL {',
    '      SELECT ?agent (COUNT(?fbHi) AS ?feedbackHighRatingCount) WHERE {',
    '        ?agent core:hasReputationAssertion ?fbHi .',
    '        ?fbHi a erc8004:Feedback ;',
    '              erc8004:feedbackRatingPct ?pct .',
    '        FILTER(xsd:integer(?pct) >= 90)',
    '      } GROUP BY ?agent',
    '    }',
    '',
    // Association count: count non-revoked associations involving the agent account (SmartAgent only)
    '    OPTIONAL {',
    '      SELECT ?agent (COUNT(DISTINCT ?assoc) AS ?associationApprovedCount) WHERE {',
    '        ?agent core:hasAgentAccount ?acct .',
    '        ?acct erc8092:hasAssociatedAccounts ?assoc .',
    '        FILTER NOT EXISTS {',
    '          ?rev a erc8092:AssociatedAccountsRevocation8092 ;',
    '               erc8092:revocationOfAssociatedAccounts ?assoc .',
    '        }',
    '      } GROUP BY ?agent',
    '    }',
    '  }',
    '}',
    '',
  ].join('\n');
}

export async function seedTrustLedgerBadgeDefinitionsToGraphdb(opts?: { resetContext?: boolean }): Promise<{ badgeDefRows: number }> {
  const now = nowSeconds();
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const sysCtx = analyticsSystemContext();
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context: sysCtx });
  }

  const turtle = badgeDefsTurtle(DEFAULT_TRUST_LEDGER_BADGES, now);
  if (turtle.trim()) {
    await uploadTurtleToRepository(baseUrl, repository, auth, { context: sysCtx, turtle });
  }
  return { badgeDefRows: DEFAULT_TRUST_LEDGER_BADGES.length };
}

export async function computeTrustLedgerAwardsToGraphdbForChain(
  chainId: number,
  opts?: { resetContext?: boolean; limitAgents?: number; pageSize?: number },
): Promise<{ processedAgents: number; awardedBadges: number; scoreRows: number }> {
  const cId = Number.isFinite(Number(chainId)) ? Math.trunc(Number(chainId)) : 0;
  if (!cId) throw new Error('chainId required');

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const ctx = chainContext(cId);
  const outCtx = analyticsContext(cId);

  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context: outCtx });
  }

  const maxAgents = typeof opts?.limitAgents === 'number' && Number.isFinite(opts.limitAgents) && opts.limitAgents > 0 ? Math.trunc(opts.limitAgents) : 250_000;
  // NOTE: this GraphDB deployment enforces an effective max of ~200 bindings per SELECT.
  // Use 200 here so pagination works (bindings.length < pageSize is our stop condition).
  const pageSize = typeof opts?.pageSize === 'number' && Number.isFinite(opts.pageSize) && opts.pageSize > 0 ? Math.trunc(opts.pageSize) : 200;
  const now = nowSeconds();

  let processedAgents = 0;
  let awardedBadges = 0;
  let scoreRows = 0;

  for (let offset = 0; processedAgents < maxAgents; offset += pageSize) {
    const sparql = signalsPageSparql({ chainId: cId, ctx, limit: pageSize, offset });
    const res = await queryGraphdb(baseUrl, repository, auth, sparql);
    const bindings: any[] = Array.isArray(res?.results?.bindings) ? res.results.bindings : [];
    if (!bindings.length) break;

    const lines: string[] = [ttlPrefixes()];

    for (const b of bindings) {
      const agentIri = asStrBinding(b?.agent);
      const agentId = asStrBinding(b?.agentId);
      if (!agentIri || !agentId) continue;

      const sig: TrustLedgerSignals = {
        validationCount: Math.max(0, Math.trunc(asNumBinding(b?.validationCount) ?? 0)),
        feedbackCount: Math.max(0, Math.trunc(asNumBinding(b?.feedbackCount) ?? 0)),
        feedbackHighRatingCount: Math.max(0, Math.trunc(asNumBinding(b?.feedbackHighRatingCount) ?? 0)),
        associationApprovedCount: Math.max(0, Math.trunc(asNumBinding(b?.associationApprovedCount) ?? 0)),
      };

      const awarded = DEFAULT_TRUST_LEDGER_BADGES.filter((d) => d.active && rulePasses(d, sig));
      let totalPoints = 0;

      for (const def of awarded) {
        const badgeId = String(def.badgeId ?? '').trim();
        if (!badgeId) continue;
        const awardIri = trustLedgerBadgeAwardIri(cId, agentId, badgeId);
        const defIri = trustLedgerBadgeDefIri(badgeId);
        const evidence = JSON.stringify({ signals: sig, ruleId: def.ruleId, ruleConfig: def.ruleConfig ?? null });

        lines.push(`${awardIri} a analytics:TrustLedgerBadgeAward, prov:Entity ;`);
        lines.push(`  analytics:badgeAwardForAgent <${agentIri}> ;`);
        lines.push(`  analytics:awardedBadgeDefinition ${defIri} ;`);
        lines.push(`  analytics:awardedAt ${now} ;`);
        lines.push(`  analytics:evidenceJson ${jsonLiteral(evidence)} .`);
        lines.push('');

        lines.push(`<${agentIri}> analytics:hasTrustLedgerBadgeAward ${awardIri} .`);
        lines.push('');

        totalPoints += Math.trunc(Number(def.points ?? 0));
        awardedBadges++;
      }

      // Rollup score record
      const scoreIri = trustLedgerScoreIri(cId, agentId);
      const digestJson = JSON.stringify({ badgeIds: awarded.map((d) => d.badgeId), signals: sig });

      lines.push(`${scoreIri} a analytics:AgentTrustLedgerScore, prov:Entity ;`);
      lines.push(`  analytics:trustLedgerForAgent <${agentIri}> ;`);
      lines.push(`  analytics:trustLedgerChainId ${cId} ;`);
      lines.push(`  analytics:trustLedgerAgentId ${jsonLiteral(agentId)} ;`);
      lines.push(`  analytics:totalPoints ${Math.max(0, Math.trunc(totalPoints))} ;`);
      lines.push(`  analytics:badgeCount ${Math.max(0, Math.trunc(awarded.length))} ;`);
      lines.push(`  analytics:trustLedgerComputedAt ${now} ;`);
      lines.push(`  analytics:digestJson ${jsonLiteral(digestJson)} .`);
      lines.push('');

      lines.push(`<${agentIri}> analytics:hasTrustLedgerScore ${scoreIri} .`);
      lines.push('');

      processedAgents++;
      scoreRows++;
      if (processedAgents >= maxAgents) break;
    }

    const turtle = lines.join('\n');
    if (turtle.trim()) {
      await uploadTurtleToRepository(baseUrl, repository, auth, { context: outCtx, turtle });
    }

    if (bindings.length < pageSize) break;
  }

  return { processedAgents, awardedBadges, scoreRows };
}

