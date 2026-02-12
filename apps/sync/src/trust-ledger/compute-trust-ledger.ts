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

function asBoolBinding(b: any): boolean | null {
  const v = b?.value;
  if (v == null) return null;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    if (s === 'true' || s === '1') return true;
    if (s === 'false' || s === '0') return false;
  }
  return null;
}

function valuesForAgents(agentIris: string[]): string {
  return agentIris
    .map((a) => {
      const s = String(a || '').trim();
      if (!s) return null;
      return s.startsWith('<') ? s : `<${s}>`;
    })
    .filter((x): x is string => Boolean(x))
    .join(' ');
}

function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const size = Number.isFinite(Number(chunkSize)) ? Math.max(1, Math.trunc(Number(chunkSize))) : 1;
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

type TrustLedgerSignals = {
  validationCount: number;
  feedbackCount: number;
  feedbackHighRatingCount: number;
  feedbackScoreCount: number;
  feedbackAvgScore: number;
  associationApprovedCount: number;
  a2aSkillCount: number;
  a2aAgentCardJsonPresent: boolean;
  mcpToolsDeclaredCount: number;
  mcpPromptsDeclaredCount: number;
  mcpActiveToolsListPresent: boolean;
  mcpAlivePresent: boolean;
  registrationJsonPresent: boolean;
  walletAccountPresent: boolean;
  registrationOasfSkillCount: number;
  registrationOasfDomainCount: number;
  x402Support: boolean;
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
    case 'feedback_avg_score_gte': {
      const cfg = (def.ruleConfig ?? {}) as any;
      const minReviews = clampInt(cfg.minReviews ?? 0, 0, 1_000_000_000);
      const minAvg = Number.isFinite(Number(cfg.threshold)) ? Number(cfg.threshold) : 0;
      if (sig.feedbackScoreCount < minReviews) return false;
      return sig.feedbackAvgScore >= minAvg;
    }
    case 'association_approved_count_gte':
      return sig.associationApprovedCount >= threshold;
    case 'a2a_skill_count_gte':
      return sig.a2aSkillCount >= threshold;
    case 'a2a_agent_card_json_present':
      return sig.a2aAgentCardJsonPresent;
    case 'mcp_tools_declared_count_gte':
      return sig.mcpToolsDeclaredCount >= threshold;
    case 'mcp_prompts_declared_count_gte':
      return sig.mcpPromptsDeclaredCount >= threshold;
    case 'mcp_active_tools_list_present':
      return sig.mcpActiveToolsListPresent;
    case 'mcp_alive_present':
      return sig.mcpAlivePresent;
    case 'registration_json_present':
      return sig.registrationJsonPresent;
    case 'wallet_account_present':
      return sig.walletAccountPresent;
    case 'registration_oasf_skills_domains_present':
      return sig.registrationOasfSkillCount > 0 && sig.registrationOasfDomainCount > 0;
    case 'registration_x402_support_true':
      return sig.x402Support;
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
    'SELECT ?agent ?agentId ?validationCount ?feedbackCount WHERE {',
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
    '  }',
    '}',
    '',
  ].join('\n');
}

function feedbackHighRatingEdgesSparql(args: {
  ctx: string;
  agentIris: string[];
  minRatingPct?: number;
  limit: number;
  offset: number;
}): string {
  const { ctx, agentIris } = args;
  const minPct = typeof args.minRatingPct === 'number' && Number.isFinite(args.minRatingPct) ? Math.trunc(args.minRatingPct) : 90;
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(1, Math.trunc(Number(args.limit))) : 1000;
  const offset = Number.isFinite(Number(args.offset)) ? Math.max(0, Math.trunc(Number(args.offset))) : 0;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    '',
    'SELECT ?agent ?fbHi WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasReputationAssertion ?fbHi .',
    '    ?fbHi a erc8004:Feedback ;',
    '          erc8004:feedbackRatingPct ?pct .',
    `    FILTER(xsd:integer(?pct) >= ${minPct})`,
    '  }',
    '}',
    'ORDER BY STR(?agent) STR(?fbHi)',
    `LIMIT ${limit}`,
    `OFFSET ${offset}`,
    '',
  ].join('\n');
}

function associationApprovedCountSparql(args: { ctx: string; agentIris: string[] }): string {
  const { ctx, agentIris } = args;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8092: <https://agentictrust.io/ontology/erc8092#>',
    '',
    'SELECT ?agent (COUNT(DISTINCT ?assoc) AS ?associationApprovedCount) WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasAgentAccount ?acct .',
    '    ?acct erc8092:hasAssociatedAccounts ?assoc .',
    '    FILTER NOT EXISTS {',
    '      ?rev a erc8092:AssociatedAccountsRevocation8092 ;',
    '           erc8092:revocationOfAssociatedAccounts ?assoc .',
    '    }',
    '  }',
    '}',
    'GROUP BY ?agent',
    '',
  ].join('\n');
}

function associationApprovedEdgeSparql(args: { ctx: string; agentIris: string[]; limit: number }): string {
  const { ctx, agentIris } = args;
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(1, Math.trunc(Number(args.limit))) : 1000;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8092: <https://agentictrust.io/ontology/erc8092#>',
    '',
    'SELECT ?agent ?assoc WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasAgentAccount ?acct .',
    '    ?acct erc8092:hasAssociatedAccounts ?assoc .',
    '    FILTER NOT EXISTS {',
    '      ?rev a erc8092:AssociatedAccountsRevocation8092 ;',
    '           erc8092:revocationOfAssociatedAccounts ?assoc .',
    '    }',
    '  }',
    '}',
    'ORDER BY STR(?agent) STR(?assoc)',
    `LIMIT ${limit}`,
    '',
  ].join('\n');
}

function feedbackScoreEdgesSparql(args: { ctx: string; agentIris: string[]; limit: number; offset: number }): string {
  const { ctx, agentIris } = args;
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(1, Math.trunc(Number(args.limit))) : 1000;
  const offset = Number.isFinite(Number(args.offset)) ? Math.max(0, Math.trunc(Number(args.offset))) : 0;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT ?agent ?fb ?sc WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasReputationAssertion ?fb .',
    '    ?fb a erc8004:Feedback ;',
    '        erc8004:feedbackScore ?sc .',
    '  }',
    '}',
    'ORDER BY STR(?agent) STR(?fb)',
    `LIMIT ${limit}`,
    `OFFSET ${offset}`,
    '',
  ].join('\n');
}

function a2aSkillEdgeSparql(args: { ctx: string; agentIris: string[]; limit: number }): string {
  const { ctx, agentIris } = args;
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(1, Math.trunc(Number(args.limit))) : 1000;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    '',
    'SELECT ?agent ?sk WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasServiceEndpoint ?se .',
    '    ?se core:hasProtocol ?p .',
    '    ?p a core:A2AProtocol ; core:hasSkill ?sk .',
    '  }',
    '}',
    'ORDER BY STR(?agent) STR(?sk)',
    `LIMIT ${limit}`,
    '',
  ].join('\n');
}

function a2aAgentCardJsonSparql(args: { ctx: string; agentIris: string[] }): string {
  const { ctx, agentIris } = args;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    '',
    'SELECT ?agent (COUNT(?json) AS ?a2aAgentCardJsonCount) WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasServiceEndpoint ?se .',
    '    ?se core:hasProtocol ?p .',
    '    ?p a core:A2AProtocol ; core:hasDescriptor ?d .',
    '    ?d core:agentCardJson ?json .',
    '  }',
    '}',
    'GROUP BY ?agent',
    '',
  ].join('\n');
}

function mcpDeclaredCountsSparql(args: { ctx: string; agentIris: string[]; limit: number }): string {
  const { ctx, agentIris } = args;
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(1, Math.trunc(Number(args.limit))) : 5000;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    '',
    'SELECT ?agent ?tc ?pc WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasServiceEndpoint ?se .',
    '    ?se core:hasProtocol ?p .',
    '    ?p a core:MCPProtocol ; core:hasDescriptor ?d .',
    '    OPTIONAL { ?d core:mcpToolsCount ?tc . }',
    '    OPTIONAL { ?d core:mcpPromptsCount ?pc . }',
    '  }',
    '}',
    'ORDER BY STR(?agent)',
    `LIMIT ${limit}`,
    '',
  ].join('\n');
}

function mcpActiveToolsListEdgeSparql(args: { ctx: string; agentIris: string[]; limit: number }): string {
  const { ctx, agentIris } = args;
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(1, Math.trunc(Number(args.limit))) : 5000;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    '',
    'SELECT ?agent ?j WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasServiceEndpoint ?se .',
    '    ?se core:hasProtocol ?p .',
    '    ?p a core:MCPProtocol ; core:hasDescriptor ?d .',
    '    ?d core:mcpAlive true ; core:mcpToolsListJson ?j .',
    '  }',
    '}',
    'ORDER BY STR(?agent) STR(?j)',
    `LIMIT ${limit}`,
    '',
  ].join('\n');
}

function mcpAliveEdgeSparql(args: { ctx: string; agentIris: string[]; limit: number }): string {
  const { ctx, agentIris } = args;
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(1, Math.trunc(Number(args.limit))) : 5000;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    '',
    'SELECT ?agent ?d WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasServiceEndpoint ?se .',
    '    ?se core:hasProtocol ?p .',
    '    ?p a core:MCPProtocol ; core:hasDescriptor ?d .',
    '    ?d core:mcpAlive true .',
    '  }',
    '}',
    'ORDER BY STR(?agent) STR(?d)',
    `LIMIT ${limit}`,
    '',
  ].join('\n');
}

function registrationJsonEdgeSparql(args: { ctx: string; agentIris: string[]; limit: number }): string {
  const { ctx, agentIris } = args;
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(1, Math.trunc(Number(args.limit))) : 5000;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT ?agent ?j WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasIdentity ?id .',
    '    ?id a erc8004:AgentIdentity8004 ; core:hasDescriptor ?desc .',
    '    ?desc erc8004:registrationJson ?j .',
    '  }',
    '}',
    'ORDER BY STR(?agent)',
    `LIMIT ${limit}`,
    '',
  ].join('\n');
}

function walletAccountEdgeSparql(args: { ctx: string; agentIris: string[]; limit: number }): string {
  const { ctx, agentIris } = args;
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(1, Math.trunc(Number(args.limit))) : 5000;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT ?agent ?acct WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasIdentity ?id .',
    '    ?id a erc8004:AgentIdentity8004 ; erc8004:hasWalletAccount ?acct .',
    '  }',
    '}',
    'ORDER BY STR(?agent) STR(?acct)',
    `LIMIT ${limit}`,
    '',
  ].join('\n');
}

function registrationFlagsSparql(args: { ctx: string; agentIris: string[] }): string {
  const { ctx, agentIris } = args;
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT ?agent ?registrationOasfSkillCount ?registrationOasfDomainCount ?x402Support WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?agent { ${valuesForAgents(agentIris)} }`,
    '    ?agent core:hasIdentity ?id .',
    '    ?id a erc8004:AgentIdentity8004 ; core:hasDescriptor ?desc .',
    '    OPTIONAL { ?desc erc8004:registrationOasfSkillCount ?registrationOasfSkillCount . }',
    '    OPTIONAL { ?desc erc8004:registrationOasfDomainCount ?registrationOasfDomainCount . }',
    '    OPTIONAL { ?desc erc8004:x402Support ?x402Support . }',
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

    const agentIris = bindings.map((b) => asStrBinding(b?.agent)).filter((x): x is string => Boolean(x));
    const feedbackCountByAgent = new Map<string, number>();
    for (const b of bindings) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      feedbackCountByAgent.set(a, Math.max(0, Math.trunc(asNumBinding(b?.feedbackCount) ?? 0)));
    }

    const avgScoreByAgent = new Map<string, { n: number; avg: number }>();
    const a2aSkillCountByAgent = new Map<string, number>();
    const a2aHasCardByAgent = new Map<string, boolean>();
    const mcpDeclaredByAgent = new Map<string, { tools: number; prompts: number }>();
    const mcpLiveByAgent = new Map<string, boolean>();
    const mcpAliveByAgent = new Map<string, boolean>();
    const registrationPresentByAgent = new Map<string, boolean>();
    const walletPresentByAgent = new Map<string, boolean>();
    const regFlagsByAgent = new Map<string, { oasfSkills: number; oasfDomains: number; x402: boolean }>();
    const hiRatingByAgent = new Map<string, number>();
    const assocApprovedByAgent = new Map<string, number>();

    // Average feedback score (requires erc8004:feedbackScore materialized on Feedback)
    // Avoid GROUP BY/AVG: it consistently OOMs on the hosted GraphDB for mainnet.
    // Instead, page through feedback score edges for the current agent page and aggregate in code.
    {
      const avgCandidates = agentIris.filter((a) => (feedbackCountByAgent.get(a) ?? 0) >= 5);
      if (avgCandidates.length) {
        const agg = new Map<string, { sum: number; n: number }>();
        const edgePageSize = 2000;
        let edgeOffset = 0;
        for (;;) {
          const resEdges = await queryGraphdb(
            baseUrl,
            repository,
            auth,
            feedbackScoreEdgesSparql({ ctx, agentIris: avgCandidates, limit: edgePageSize, offset: edgeOffset }),
          );
          const edgeBindings = Array.isArray(resEdges?.results?.bindings) ? resEdges.results.bindings : [];
          if (!edgeBindings.length) break;

          for (const b of edgeBindings) {
            const a = asStrBinding(b?.agent);
            if (!a) continue;
            const sc = asNumBinding(b?.sc);
            if (sc == null || !Number.isFinite(sc)) continue;
            const prev = agg.get(a) ?? { sum: 0, n: 0 };
            prev.sum += Number(sc);
            prev.n += 1;
            agg.set(a, prev);
          }

          if (edgeBindings.length < edgePageSize) break;
          edgeOffset += edgePageSize;
          if (edgeOffset > 200_000) break; // safety valve against runaway paging
        }

        for (const a of avgCandidates) {
          const x = agg.get(a);
          if (!x || x.n <= 0) continue;
          avgScoreByAgent.set(a, { n: x.n, avg: x.sum / x.n });
        }
      }
    }

    // High-rating feedback count (ratingPct >= 90)
    // Avoid GROUP BY here: it consistently OOMs on the hosted GraphDB for mainnet.
    // Instead, for agents with >=5 total feedback, page through matching feedback edges and cap-count to 5.
    const hiCandidates = agentIris.filter((a) => (feedbackCountByAgent.get(a) ?? 0) >= 5);
    if (hiCandidates.length) {
      const target = 5;
      const edgePageSize = 2000;
      const remaining = new Set(hiCandidates);
      let edgeOffset = 0;

      for (; remaining.size > 0; ) {
        const agentsNow = Array.from(remaining);
        const resEdges = await queryGraphdb(
          baseUrl,
          repository,
          auth,
          feedbackHighRatingEdgesSparql({ ctx, agentIris: agentsNow, minRatingPct: 90, limit: edgePageSize, offset: edgeOffset }),
        );
        const edgeBindings = Array.isArray(resEdges?.results?.bindings) ? resEdges.results.bindings : [];
        if (!edgeBindings.length) break;

        for (const b of edgeBindings) {
          const a = asStrBinding(b?.agent);
          if (!a || !remaining.has(a)) continue;
          const prev = hiRatingByAgent.get(a) ?? 0;
          if (prev >= target) continue;
          const next = prev + 1;
          hiRatingByAgent.set(a, next);
          if (next >= target) remaining.delete(a);
        }

        if (edgeBindings.length < edgePageSize) break;
        edgeOffset += edgePageSize;
        if (edgeOffset > 200_000) break; // safety valve against runaway paging
      }
    }

    // Association count (non-revoked associations)
    // Avoid GROUP BY DISTINCT: it OOMs on hosted GraphDB mainnet.
    // We only need threshold>=1 today, so cap to 1 if any association exists.
    {
      const remaining = new Set(agentIris);
      const limit = 2000;
      for (let i = 0; i < 20 && remaining.size > 0; i++) {
        const agentsNow = Array.from(remaining);
        const resAssoc = await queryGraphdb(baseUrl, repository, auth, associationApprovedEdgeSparql({ ctx, agentIris: agentsNow, limit }));
        const assocBindings = Array.isArray(resAssoc?.results?.bindings) ? resAssoc.results.bindings : [];
        if (!assocBindings.length) break;
        for (const b of assocBindings) {
          const a = asStrBinding(b?.agent);
          if (!a || !remaining.has(a)) continue;
          assocApprovedByAgent.set(a, 1);
          remaining.delete(a);
        }
        if (assocBindings.length < limit) break;
      }
    }

    // A2A skills (declared via protocol skill nodes)
    // Avoid COUNT DISTINCT: we only need threshold>=1 today, so cap to 1 if any skill exists.
    {
      const resA2aSk = await queryGraphdb(baseUrl, repository, auth, a2aSkillEdgeSparql({ ctx, agentIris, limit: 5000 }));
      const skBindings = Array.isArray(resA2aSk?.results?.bindings) ? resA2aSk.results.bindings : [];
      for (const b of skBindings) {
        const a = asStrBinding(b?.agent);
        if (!a) continue;
        a2aSkillCountByAgent.set(a, 1);
      }
    }

    // A2A agent-card JSON present (captured by sync:agent-cards)
    const resA2aCard = await queryGraphdb(baseUrl, repository, auth, a2aAgentCardJsonSparql({ ctx, agentIris }));
    for (const b of Array.isArray(resA2aCard?.results?.bindings) ? resA2aCard.results.bindings : []) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      a2aHasCardByAgent.set(a, Math.trunc(asNumBinding(b?.a2aAgentCardJsonCount) ?? 0) > 0);
    }

    // MCP tools/prompts declared in registration (materialized on DescriptorMCPProtocol)
    const resMcpDecl = await queryGraphdb(baseUrl, repository, auth, mcpDeclaredCountsSparql({ ctx, agentIris, limit: 5000 }));
    for (const b of Array.isArray(resMcpDecl?.results?.bindings) ? resMcpDecl.results.bindings : []) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      const tc = Math.max(0, Math.trunc(asNumBinding(b?.tc) ?? 0));
      const pc = Math.max(0, Math.trunc(asNumBinding(b?.pc) ?? 0));
      const prev = mcpDeclaredByAgent.get(a) ?? { tools: 0, prompts: 0 };
      if (tc > prev.tools) prev.tools = tc;
      if (pc > prev.prompts) prev.prompts = pc;
      mcpDeclaredByAgent.set(a, prev);
    }

    // MCP active + tools list JSON captured (sync:mcp)
    const resMcpLive = await queryGraphdb(baseUrl, repository, auth, mcpActiveToolsListEdgeSparql({ ctx, agentIris, limit: 5000 }));
    for (const b of Array.isArray(resMcpLive?.results?.bindings) ? resMcpLive.results.bindings : []) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      mcpLiveByAgent.set(a, true);
    }

    // MCP alive (sync:mcp) - even if tools list is not captured
    const resMcpAlive = await queryGraphdb(baseUrl, repository, auth, mcpAliveEdgeSparql({ ctx, agentIris, limit: 5000 }));
    for (const b of Array.isArray(resMcpAlive?.results?.bindings) ? resMcpAlive.results.bindings : []) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      mcpAliveByAgent.set(a, true);
    }

    // Registration JSON present (erc8004:registrationJson on identity descriptor)
    const resRegJson = await queryGraphdb(baseUrl, repository, auth, registrationJsonEdgeSparql({ ctx, agentIris, limit: 5000 }));
    for (const b of Array.isArray(resRegJson?.results?.bindings) ? resRegJson.results.bindings : []) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      const j = asStrBinding(b?.j);
      if (j && j.trim()) registrationPresentByAgent.set(a, true);
    }

    // Wallet account present (erc8004:hasWalletAccount)
    const resWallet = await queryGraphdb(baseUrl, repository, auth, walletAccountEdgeSparql({ ctx, agentIris, limit: 5000 }));
    for (const b of Array.isArray(resWallet?.results?.bindings) ? resWallet.results.bindings : []) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      walletPresentByAgent.set(a, true);
    }

    // Registration-derived flags (OASF counts + x402)
    const resReg = await queryGraphdb(baseUrl, repository, auth, registrationFlagsSparql({ ctx, agentIris }));
    for (const b of Array.isArray(resReg?.results?.bindings) ? resReg.results.bindings : []) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      const sc = Math.max(0, Math.trunc(asNumBinding(b?.registrationOasfSkillCount) ?? 0));
      const dc = Math.max(0, Math.trunc(asNumBinding(b?.registrationOasfDomainCount) ?? 0));
      const x = asBoolBinding(b?.x402Support) === true;

      const prev = regFlagsByAgent.get(a) ?? { oasfSkills: 0, oasfDomains: 0, x402: false };
      if (sc > prev.oasfSkills) prev.oasfSkills = sc;
      if (dc > prev.oasfDomains) prev.oasfDomains = dc;
      if (x) prev.x402 = true;
      regFlagsByAgent.set(a, prev);
    }

    const lines: string[] = [ttlPrefixes()];

    for (const b of bindings) {
      const agentIri = asStrBinding(b?.agent);
      const agentId = asStrBinding(b?.agentId);
      if (!agentIri || !agentId) continue;

      const avg = avgScoreByAgent.get(agentIri) ?? { n: 0, avg: 0 };
      const mcpDecl = mcpDeclaredByAgent.get(agentIri) ?? { tools: 0, prompts: 0 };
      const reg = regFlagsByAgent.get(agentIri) ?? { oasfSkills: 0, oasfDomains: 0, x402: false };

      const sig: TrustLedgerSignals = {
        validationCount: Math.max(0, Math.trunc(asNumBinding(b?.validationCount) ?? 0)),
        feedbackCount: Math.max(0, Math.trunc(asNumBinding(b?.feedbackCount) ?? 0)),
        feedbackHighRatingCount: Math.max(0, Math.trunc(hiRatingByAgent.get(agentIri) ?? 0)),
        associationApprovedCount: Math.max(0, Math.trunc(assocApprovedByAgent.get(agentIri) ?? 0)),
        feedbackScoreCount: avg.n,
        feedbackAvgScore: avg.avg,
        a2aSkillCount: Math.max(0, Math.trunc(a2aSkillCountByAgent.get(agentIri) ?? 0)),
        a2aAgentCardJsonPresent: Boolean(a2aHasCardByAgent.get(agentIri)),
        mcpToolsDeclaredCount: mcpDecl.tools,
        mcpPromptsDeclaredCount: mcpDecl.prompts,
        mcpActiveToolsListPresent: Boolean(mcpLiveByAgent.get(agentIri)),
        mcpAlivePresent: Boolean(mcpAliveByAgent.get(agentIri)),
        registrationJsonPresent: Boolean(registrationPresentByAgent.get(agentIri)),
        walletAccountPresent: Boolean(walletPresentByAgent.get(agentIri)),
        registrationOasfSkillCount: reg.oasfSkills,
        registrationOasfDomainCount: reg.oasfDomains,
        x402Support: reg.x402,
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

