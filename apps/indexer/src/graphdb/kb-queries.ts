import { getGraphdbConfigFromEnv, queryGraphdbWithContext, type GraphdbQueryContext } from './graphdb-http.js';

export type GraphdbBinding = { type: string; value: string; datatype?: string; 'xml:lang'?: string };

export type KbAgentRow = {
  iri: string;
  uaid: string | null;
  agentName: string | null;
  agentImage: string | null;
  agentDescriptorIri: string | null;
  agentDescriptorName: string | null;
  agentDescriptorDescription: string | null;
  agentDescriptorImage: string | null;
  agentTypes: string[];
  feedbackAssertionCount: number | null;
  validationAssertionCount: number | null;
  createdAtBlock: number | null;
  createdAtTime: number | null;
  updatedAtTime: number | null;

  // KB analytics (GraphDB-resident)
  trustLedgerTotalPoints: number | null;
  trustLedgerBadgeCount: number | null;
  trustLedgerComputedAt: number | null;
  atiOverallScore: number | null;
  atiOverallConfidence: number | null;
  atiVersion: string | null;
  atiComputedAt: number | null;

  did8004: string | null;
  agentId8004: number | null;
  identity8004Iri: string | null;
  identity8004DescriptorIri: string | null;
  identity8004DescriptorName: string | null;
  identity8004DescriptorDescription: string | null;
  identity8004DescriptorImage: string | null;
  identity8004RegistrationJson: string | null;
  identity8004NftMetadataJson: string | null;
  identity8004RegisteredBy: string | null;
  identity8004RegistryNamespace: string | null;
  // Skills/domains explicitly materialized on the identity descriptor (from agentURI registration JSON only)
  identity8004DescriptorSkills: string[];
  identity8004DescriptorDomains: string[];
  identityEnsIri: string | null;
  didEns: string | null;
  identityHolIri: string | null;
  identityHolProtocolIdentifier: string | null;
  identityHolUaidHOL: string | null;
  identityHolDescriptorIri: string | null;
  identityHolDescriptorName: string | null;
  identityHolDescriptorDescription: string | null;
  identityHolDescriptorImage: string | null;
  identityHolDescriptorJson: string | null;
  identityOwnerAccountIri: string | null;
  identityWalletAccountIri: string | null;
  identityOperatorAccountIri: string | null;
  identityOwnerEOAAccountIri: string | null;

  agentAccountIri: string | null;

  // ERC-8122 identity
  identity8122Iri: string | null;
  did8122: string | null;
  agentId8122: string | null;
  registry8122: string | null;
  endpointType8122: string | null;
  endpoint8122: string | null;
  identity8122DescriptorIri: string | null;
  identity8122DescriptorName: string | null;
  identity8122DescriptorDescription: string | null;
  identity8122DescriptorImage: string | null;
  identity8122DescriptorJson: string | null;
  identity8122OwnerAccountIri: string | null;
  identity8122AgentAccountIri: string | null;

  a2aServiceEndpointIri: string | null;
  a2aServiceUrl: string | null;
  a2aProtocolIri: string | null;
  a2aServiceEndpointDescriptorIri: string | null;
  a2aServiceEndpointDescriptorName: string | null;
  a2aServiceEndpointDescriptorDescription: string | null;
  a2aServiceEndpointDescriptorImage: string | null;
  a2aProtocolDescriptorIri: string | null;
  a2aDescriptorName: string | null;
  a2aDescriptorDescription: string | null;
  a2aDescriptorImage: string | null;
  a2aProtocolVersion: string | null;
  a2aAgentCardJson: string | null;
  a2aSkills: string[];
  a2aDomains: string[];

  mcpServiceEndpointIri: string | null;
  mcpServiceUrl: string | null;
  mcpProtocolIri: string | null;
  mcpServiceEndpointDescriptorIri: string | null;
  mcpServiceEndpointDescriptorName: string | null;
  mcpServiceEndpointDescriptorDescription: string | null;
  mcpServiceEndpointDescriptorImage: string | null;
  mcpProtocolDescriptorIri: string | null;
  mcpDescriptorName: string | null;
  mcpDescriptorDescription: string | null;
  mcpDescriptorImage: string | null;
  mcpProtocolVersion: string | null;
  mcpAgentCardJson: string | null;
  mcpSkills: string[];
  mcpDomains: string[];
};

function chainContext(chainId: number): string {
  // Special-case HOL: stored under a non-numeric subgraph context.
  // This allows GraphQL callers to use chainId=295 for HOL.
  if (Math.trunc(chainId) === 295) return 'https://www.agentictrust.io/graph/data/subgraph/hol';
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

function analyticsContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/analytics/${chainId}`;
}

function iriEncodeSegment(value: string): string {
  // Must match sync's IRI encoding (encodeURIComponent + '%' => '_').
  return encodeURIComponent(value).replace(/%/g, '_');
}

function accountIriFromAddress(chainId: number, address: string): string {
  const addr = address.trim().toLowerCase();
  // Matches sync: https://www.agentictrust.io/id/account/{chainId}/{address}
  return `https://www.agentictrust.io/id/account/${chainId}/${iriEncodeSegment(addr)}`;
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function asString(b?: any): string | null {
  const v = b?.value;
  return typeof v === 'string' && v.trim() ? v : null;
}

function asNumber(b?: any): number | null {
  const s = asString(b);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function splitConcat(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function runGraphdbQuery(sparql: string, ctx?: GraphdbQueryContext | null, label?: string): Promise<any[]> {
  const debug = Boolean(process.env.DEBUG_GRAPHDB_SPARQL);
  if (debug) {
    // eslint-disable-next-line no-console
    // IMPORTANT: default to printing FULL runnable SPARQL for copy/paste into GraphDB UI.
    // Set DEBUG_GRAPHDB_SPARQL_FULL=0 to print only a short preview.
    const full = process.env.DEBUG_GRAPHDB_SPARQL_FULL !== '0';
    const body = full ? sparql : sparql.split('\n').slice(0, 30).join('\n') + '\n# ... TRUNCATED ...\n';
    const lbl = label ?? ctx?.label ?? 'graphdbQuery';
    console.log(`\n[graphdb] sparql begin (${lbl})\n\n${body}\n\n[graphdb] sparql end (${lbl})\n`);
  }
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const result = await queryGraphdbWithContext(baseUrl, repository, auth, sparql, ctx ? { ...ctx, label: label ?? ctx.label } : ctx);
  const bindings = Array.isArray(result?.results?.bindings) ? result.results.bindings : [];
  if (debug) {
    // eslint-disable-next-line no-console
    console.log('[graphdb] sparql result', { bindings: bindings.length });
  }
  return bindings;
}

function did8004FromParts(chainId: number, agentId8004: number): string {
  return `did:8004:${chainId}:${agentId8004}`;
}

function pickAgentTypesFromRow(typeValues: string[]): string[] {
  // Prefer most-specific types first.
  const preferred = [
    'https://agentictrust.io/ontology/core#AISmartAgent',
    'https://agentictrust.io/ontology/core#AIAgent',
  ];
  const set = new Set(typeValues.filter(Boolean));
  const out: string[] = [];
  for (const iri of preferred) if (set.has(iri)) out.push(iri);
  for (const iri of Array.from(set)) if (!out.includes(iri)) out.push(iri);
  return out;
}

export async function kbAgentsQuery(args: {
  where?: {
    chainId?: number | null;
    agentIdentifierMatch?: string | null;
    did8004?: string | null;
    uaid?: string | null;
    uaid_in?: string[] | null;
    agentName_contains?: string | null;
    isSmartAgent?: boolean | null;
    hasA2a?: boolean | null;
    hasAssertions?: boolean | null;
    hasReviews?: boolean | null;
    hasValidations?: boolean | null;
    minReviewAssertionCount?: number | null;
    minValidationAssertionCount?: number | null;
  } | null;
  first?: number | null;
  skip?: number | null;
  orderBy?:
    | 'agentId8004'
    | 'agentName'
    | 'uaid'
    | 'createdAtTime'
    | 'updatedAtTime'
    | 'trustLedgerTotalPoints'
    | 'atiOverallScore'
    | 'bestRank'
    | null;
  orderDirection?: 'ASC' | 'DESC' | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<{ rows: KbAgentRow[]; total: number; hasMore: boolean }> {
  const where = args.where ?? {};
  const first = clampInt(args.first, 1, 500, 20);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);

  // chainId=295 is reserved for HOL (maps to GRAPH <https://www.agentictrust.io/graph/data/subgraph/hol>)
  const chainId = where.chainId != null ? clampInt(where.chainId, 1, 1_000_000_000, 0) : null;
  const ctxIri = chainId != null ? chainContext(chainId) : null;
  const graphs = ctxIri ? [`<${ctxIri}>`] : null;
  const analyticsCtxIri = chainId != null && Math.trunc(chainId) !== 295 ? analyticsContext(chainId) : null;

  // Filtering: agentIdentifierMatch does a suffix match on identifiers (did8004, didEns, uaid)
  let did8004Filter: string | null = typeof where.did8004 === 'string' && where.did8004.trim() ? where.did8004.trim() : null;
  const agentIdentifierMatch: string | null =
    typeof where.agentIdentifierMatch === 'string' && where.agentIdentifierMatch.trim()
      ? where.agentIdentifierMatch.trim()
      : null;

  const agentNameContains =
    typeof where.agentName_contains === 'string' && where.agentName_contains.trim() ? where.agentName_contains.trim() : null;

  const uaidFilter = typeof where.uaid === 'string' && where.uaid.trim() ? where.uaid.trim() : null;
  const uaidIn =
    Array.isArray(where.uaid_in) && where.uaid_in.length
      ? where.uaid_in.map((u) => String(u ?? '').trim()).filter(Boolean)
      : null;

  const minReview = where.minReviewAssertionCount != null ? clampInt(where.minReviewAssertionCount, 0, 10_000_000_000, 0) : null;
  const minValidation =
    where.minValidationAssertionCount != null ? clampInt(where.minValidationAssertionCount, 0, 10_000_000_000, 0) : null;

  // Default ordering: use createdAtTime so ranking never depends on ERC-8004-only agentId values.
  const orderBy = args.orderBy ?? 'createdAtTime';
  const orderDirection = (args.orderDirection ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const ord = (expr: string) => (orderDirection === 'ASC' ? `ASC(${expr})` : `DESC(${expr})`);

  // NOTE: KB analytics ordering requires chainId (so we know which analytics graph to join).
  // If chainId is missing (analyticsCtxIri null), we fall back to agentId8004 ordering.
  const wantsAnalyticsOrder = orderBy === 'trustLedgerTotalPoints' || orderBy === 'atiOverallScore' || orderBy === 'bestRank';
  const analyticsOrderEnabled = Boolean(analyticsCtxIri);

  const orderExpr = (() => {
    if (wantsAnalyticsOrder && !analyticsOrderEnabled) {
      return `${ord('IF(BOUND(?createdAtTime), xsd:integer(?createdAtTime), 0)')} ASC(STR(?agent))`;
    }
    if (orderBy === 'agentName') return `${ord('LCASE(STR(?agentName))')} ASC(STR(?agent))`;
    if (orderBy === 'uaid') return `${ord('LCASE(STR(?uaid))')} ASC(STR(?agent))`;
    if (orderBy === 'createdAtTime') return `${ord('IF(BOUND(?createdAtTime), xsd:integer(?createdAtTime), 0)')} ASC(STR(?agent))`;
    if (orderBy === 'updatedAtTime') return `${ord('IF(BOUND(?updatedAtTime), xsd:integer(?updatedAtTime), 0)')} ASC(STR(?agent))`;
    if (orderBy === 'trustLedgerTotalPoints') {
      return `${ord('IF(BOUND(?trustLedgerTotalPoints), xsd:integer(?trustLedgerTotalPoints), 0)')} ASC(STR(?agent))`;
    }
    if (orderBy === 'atiOverallScore') {
      return `${ord('IF(BOUND(?atiOverallScore), xsd:integer(?atiOverallScore), 0)')} ASC(STR(?agent))`;
    }
    if (orderBy === 'bestRank') {
      return [
        ord('IF(BOUND(?trustLedgerTotalPoints), xsd:integer(?trustLedgerTotalPoints), 0)'),
        ord('IF(BOUND(?atiOverallScore), xsd:integer(?atiOverallScore), 0)'),
        ord('IF(BOUND(?createdAtTime), xsd:integer(?createdAtTime), 0)'),
        'ASC(STR(?agent))',
      ].join(' ');
    }
    // Default/fallback ordering: createdAtTime (not agentId8004).
    return `${ord('IF(BOUND(?createdAtTime), xsd:integer(?createdAtTime), 0)')} ASC(STR(?agent))`;
  })();

  const graphClause = graphs
    ? `VALUES ?g { ${graphs.join(' ')} }\n  GRAPH ?g {`
    : `GRAPH ?g {\n    FILTER(STRSTARTS(STR(?g), "https://www.agentictrust.io/graph/data/subgraph/"))`;
  const graphClose = graphs ? `  }` : `}`;

  const filters: string[] = [];
  // Identifier/name filters are expressed as EXISTS checks to avoid fanout (and avoid needing SELECT DISTINCT).
  if (did8004Filter) {
    const escaped = did8004Filter.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    filters.push(
      `EXISTS { ?agent core:hasIdentity ?_id8004 . ?_id8004 a erc8004:AgentIdentity8004 ; core:hasIdentifier ?_ident8004 . ?_ident8004 core:protocolIdentifier "${escaped}" }`,
    );
  }
  // agentIdentifierMatch: suffix match on identifiers (did8004, didEns, uaid)
  if (agentIdentifierMatch) {
    const escaped = agentIdentifierMatch.replace(/"/g, '\\"').replace(/\\/g, '\\\\');
    filters.push(
      `(` +
        `EXISTS { ?agent core:hasIdentity ?_id8004m . ?_id8004m a erc8004:AgentIdentity8004 ; core:hasIdentifier ?_ident8004m . ?_ident8004m core:protocolIdentifier ?_did8004m . FILTER(STRENDS(STR(?_did8004m), ":${escaped}")) }` +
        ` || EXISTS { ?agent core:hasIdentity ?_idEnsm . ?_idEnsm a ens:AgentIdentityEns ; core:hasIdentifier ?_identEnsm . ?_identEnsm core:protocolIdentifier ?_didEnsm . FILTER(STRENDS(STR(?_didEnsm), ":${escaped}")) }` +
        ` || EXISTS { ?agent core:uaid ?_uaidm . FILTER(STRENDS(STR(?_uaidm), ":${escaped}")) }` +
        `)`,
    );
  }
  if (uaidFilter) {
    // Allow "base UAID" (no routing params) to match stored UAIDs that include ";k=v" suffixes.
    const escaped = uaidFilter.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    if (uaidFilter.includes(';')) {
      filters.push(`EXISTS { ?agent core:uaid ?_uaid . FILTER(STR(?_uaid) = "${escaped}") }`);
    } else {
      filters.push(
        `EXISTS { ?agent core:uaid ?_uaid . FILTER(STR(?_uaid) = "${escaped}" || STRSTARTS(STR(?_uaid), "${escaped};")) }`,
      );
    }
  }
  if (uaidIn && uaidIn.length) {
    const values = uaidIn.map((u) => `"${String(u).replace(/"/g, '\\"')}"`).join(' ');
    filters.push(`EXISTS { ?agent core:uaid ?_uaidIn . FILTER(STR(?_uaidIn) IN (${values})) }`);
  }
  if (agentNameContains) {
    const escaped = agentNameContains.replace(/"/g, '\\"');
    filters.push(
      `EXISTS { ?agent core:hasDescriptor ?_agentDescName . ?_agentDescName dcterms:title ?_agentNameLit . FILTER(CONTAINS(LCASE(STR(?_agentNameLit)), LCASE("${escaped}"))) }`,
    );
  }
  if (where.isSmartAgent === true) {
    filters.push(`EXISTS { ?agent a core:AISmartAgent }`);
  }
  if (where.isSmartAgent === false) {
    filters.push(`NOT EXISTS { ?agent a core:AISmartAgent }`);
  }
  if (where.hasA2a === true) {
    filters.push(
      `EXISTS { ?agent core:hasIdentity ?_id . ?_id core:hasServiceEndpoint ?_se . ?_se core:hasProtocol ?_p . ?_p a core:A2AProtocol . }`,
    );
  }
  if (where.hasA2a === false) {
    filters.push(
      `NOT EXISTS { ?agent core:hasIdentity ?_id . ?_id core:hasServiceEndpoint ?_se . ?_se core:hasProtocol ?_p . ?_p a core:A2AProtocol . }`,
    );
  }

  // Assertion filters are expressed as EXISTS checks to avoid fanout joins (which force DISTINCT).
  const hasFeedbackExpr = `EXISTS { ?agent core:hasReputationAssertion ?_fb . }`;
  const hasValidationExpr = `EXISTS { ?agent core:hasVerificationAssertion ?_vr . }`;
  const wantReviews = where.hasReviews;
  const wantValidations = where.hasValidations;

  if (wantReviews === true) filters.push(hasFeedbackExpr);
  if (wantValidations === true) filters.push(hasValidationExpr);
  if (where.hasAssertions === true && wantReviews !== true && wantValidations !== true) {
    filters.push(`(${hasFeedbackExpr} || ${hasValidationExpr})`);
  }
  if (where.hasAssertions === false) filters.push(`NOT (${hasFeedbackExpr} || ${hasValidationExpr})`);
  if (wantReviews === false) filters.push(`NOT ${hasFeedbackExpr}`);
  if (wantValidations === false) filters.push(`NOT ${hasValidationExpr}`);

  // Min-count filters use precomputed count properties (materialized during sync ingest).
  const pagePreFilter: string[] = [];
  if (minReview != null) {
    pagePreFilter.push('    OPTIONAL {');
    pagePreFilter.push('      ?agent core:hasFeedbackAssertionSummary ?_fbSummaryFilter .');
    pagePreFilter.push('      ?_fbSummaryFilter core:feedbackAssertionCount ?feedbackAssertionCount .');
    pagePreFilter.push('    }');
    pagePreFilter.push('    BIND(IF(BOUND(?feedbackAssertionCount), xsd:integer(?feedbackAssertionCount), 0) AS ?fbCntFilter)');
    filters.push(`?fbCntFilter >= ${minReview}`);
  }
  if (minValidation != null) {
    pagePreFilter.push('    OPTIONAL {');
    pagePreFilter.push('      ?agent core:hasValidationAssertionSummary ?_vrSummaryFilter .');
    pagePreFilter.push('      ?_vrSummaryFilter core:validationAssertionCount ?validationAssertionCount .');
    pagePreFilter.push('    }');
    pagePreFilter.push('    BIND(IF(BOUND(?validationAssertionCount), xsd:integer(?validationAssertionCount), 0) AS ?vrCntFilter)');
    filters.push(`?vrCntFilter >= ${minValidation}`);
  }

  // Only bind order-by keys in the page query; filters use EXISTS blocks above.
  const needsUaid = orderBy === 'uaid';
  const needsAgentName = orderBy === 'agentName';
  const needsAgentTimes = orderBy === 'createdAtTime' || orderBy === 'updatedAtTime' || orderBy === 'bestRank';
  const needsAnalytics = wantsAnalyticsOrder && analyticsOrderEnabled;
  const needsEnsPrefix = Boolean(agentIdentifierMatch);

  const pageOptional: string[] = [];
  if (needsUaid) pageOptional.push('    OPTIONAL { ?agent core:uaid ?uaid . }');
  if (needsAgentName) {
    pageOptional.push('    OPTIONAL {');
    pageOptional.push('      ?agent core:hasDescriptor ?agentDesc .');
    pageOptional.push('      OPTIONAL { ?agentDesc dcterms:title ?agentName . }');
    pageOptional.push('    }');
  }
  if (needsAgentTimes) {
    // createdAtTime/updatedAtTime must be directly sortable on the agent node (materialized during sync).
    pageOptional.push('    OPTIONAL { ?agent core:createdAtTime ?createdAtTime . }');
    pageOptional.push('    OPTIONAL { ?agent core:updatedAtTime ?updatedAtTime . }');
  }

  if (needsAnalytics && analyticsCtxIri) {
    pageOptional.push('    OPTIONAL {');
    pageOptional.push(`      GRAPH <${analyticsCtxIri}> {`);
    pageOptional.push('        OPTIONAL {');
    pageOptional.push('          ?agent analytics:hasTrustLedgerScore ?_tls .');
    pageOptional.push('          ?_tls a analytics:AgentTrustLedgerScore ; analytics:totalPoints ?trustLedgerTotalPoints .');
    pageOptional.push('          OPTIONAL { ?_tls analytics:badgeCount ?trustLedgerBadgeCount . }');
    pageOptional.push('          OPTIONAL { ?_tls analytics:trustLedgerComputedAt ?trustLedgerComputedAt . }');
    pageOptional.push('        }');
    pageOptional.push('        BIND(IF(BOUND(?agentId8004), STR(?agentId8004), "") AS ?_agentIdStr)');
    pageOptional.push('        OPTIONAL {');
    pageOptional.push('          FILTER(?_agentIdStr != "")');
    pageOptional.push('          ?ati a analytics:AgentTrustIndex ; analytics:agentId ?_agentIdStr ; analytics:overallScore ?atiOverallScore .');
    pageOptional.push('          OPTIONAL { ?ati analytics:overallConfidence ?atiOverallConfidence . }');
    pageOptional.push('          OPTIONAL { ?ati analytics:computedAt ?atiComputedAt . }');
    pageOptional.push('          OPTIONAL { ?ati analytics:version ?atiVersion . }');
    pageOptional.push('        }');
    pageOptional.push('      }');
    pageOptional.push('    }');
  }

  // Only bind agentId8004 when we need it for ATI joins / explicit ordering.
  const needsAgentId8004 =
    orderBy === 'agentId8004' || ((orderBy === 'atiOverallScore' || orderBy === 'bestRank') && needsAnalytics);
  const pageAgentIdPattern = needsAgentId8004 ? ['    OPTIONAL { ?agent erc8004:agentId8004 ?agentId8004 . }'] : [];

  // Phase 1: page query (agent ids + graph context only).
  const pageSelectVars =
    orderBy === 'uaid'
      ? '?agent ?uaid'
      : orderBy === 'agentName'
        ? '?agent ?agentName'
        : orderBy === 'createdAtTime'
          ? '?agent ?createdAtTime'
          : orderBy === 'updatedAtTime'
            ? '?agent ?updatedAtTime'
            : orderBy === 'trustLedgerTotalPoints'
              ? '?agent ?trustLedgerTotalPoints'
              : orderBy === 'atiOverallScore'
                ? '?agent ?atiOverallScore'
                : orderBy === 'bestRank'
                  ? '?agent ?trustLedgerTotalPoints ?atiOverallScore ?createdAtTime'
            : '?agent ?agentId8004';

  const pageGraphClause = ctxIri
    ? `GRAPH <${ctxIri}> {`
    : graphClause;
  const pageGraphClose = ctxIri ? `}` : graphClose;
  // Avoid DISTINCT unless we expect multi-valued order keys (uaid/name).
  const pageDistinct = orderBy === 'uaid' || orderBy === 'agentName';
  const pageSelect = ctxIri
    ? `${pageDistinct ? 'SELECT DISTINCT' : 'SELECT'} ${pageSelectVars} WHERE {`
    : `${pageDistinct ? 'SELECT DISTINCT' : 'SELECT'} ?g ${pageSelectVars} WHERE {`;

  const pageSparql = [
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX dcterms: <http://purl.org/dc/terms/>',
    ...(needsAnalytics ? ['PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>'] : []),
    ...(needsEnsPrefix ? ['PREFIX ens: <https://agentictrust.io/ontology/ens#>'] : []),
    '',
    pageSelect,
    `  ${pageGraphClause}`,
    '    ?agent a core:AIAgent .',
    ...pageOptional,
    ...pageAgentIdPattern,
    ...pagePreFilter,
    filters.length ? `    FILTER(${filters.join(' && ')})` : '',
    `  ${pageGraphClose}`,
    '}',
    `ORDER BY ${orderExpr}`,
    `LIMIT ${first + 1}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const pageBindings = await runGraphdbQuery(pageSparql, graphdbCtx, 'kbAgentsQuery.page');
  const pageAgents: string[] = [];
  if (ctxIri) {
    for (const b of pageBindings) {
      const agent = asString((b as any)?.agent);
      if (agent) pageAgents.push(agent);
    }
  }

  const pagePairs: Array<{ g: string; agent: string }> = [];
  if (!ctxIri) {
    const seenAgents = new Set<string>();
    for (const b of pageBindings) {
      const g = asString((b as any)?.g);
      const agent = asString((b as any)?.agent);
      if (!g || !agent) continue;
      if (seenAgents.has(agent)) continue;
      seenAgents.add(agent);
      pagePairs.push({ g, agent });
    }
  }

  const hasMore = ctxIri ? pageAgents.length > first : pagePairs.length > first;
  const trimmedPairs = ctxIri ? [] : hasMore ? pagePairs.slice(0, first) : pagePairs;
  const trimmedAgents = ctxIri ? (hasMore ? pageAgents.slice(0, first) : pageAgents) : [];

  // Phase 2: hydrate heavy fields for the page only.
  const valuesPairs = trimmedPairs.map((p) => `(<${p.g}> <${p.agent}>)`).join(' ');
  const valuesAgents = trimmedAgents.map((a) => `<${a}>`).join(' ');
  const rowsBindings = (ctxIri ? trimmedAgents.length : trimmedPairs.length)
    ? await runGraphdbQuery(
        [
          'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
          'PREFIX core: <https://agentictrust.io/ontology/core#>',
          'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
          'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
          'PREFIX ens: <https://agentictrust.io/ontology/ens#>',
          'PREFIX hol: <https://agentictrust.io/ontology/hol#>',
          'PREFIX erc8122: <https://agentictrust.io/ontology/erc8122#>',
          'PREFIX oasf: <https://agentictrust.io/ontology/oasf#>',
          'PREFIX dcterms: <http://purl.org/dc/terms/>',
          'PREFIX schema: <http://schema.org/>',
          'PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>',
          '',
          'SELECT',
          '  ?agent',
          '  (SAMPLE(?uaid) AS ?uaid)',
          '  (SAMPLE(?agentName) AS ?agentName)',
          '  (SAMPLE(?agentImage) AS ?agentImage)',
          '  (SAMPLE(?agentDesc) AS ?agentDesc)',
          '  (SAMPLE(?agentDescTitle) AS ?agentDescTitle)',
          '  (SAMPLE(?agentDescDescription) AS ?agentDescDescription)',
          '  (SAMPLE(?agentDescImage) AS ?agentDescImage)',
          '  (SAMPLE(?feedbackAssertionCount) AS ?feedbackAssertionCount)',
          '  (SAMPLE(?validationAssertionCount) AS ?validationAssertionCount)',
          '  (SAMPLE(?createdAtBlock) AS ?createdAtBlock)',
          '  (SAMPLE(?createdAtTime) AS ?createdAtTime)',
          '  (SAMPLE(?updatedAtTime) AS ?updatedAtTime)',
          '  (SAMPLE(?trustLedgerTotalPoints) AS ?trustLedgerTotalPoints)',
          '  (SAMPLE(?trustLedgerBadgeCount) AS ?trustLedgerBadgeCount)',
          '  (SAMPLE(?trustLedgerComputedAt) AS ?trustLedgerComputedAt)',
          '  (SAMPLE(?atiOverallScore) AS ?atiOverallScore)',
          '  (SAMPLE(?atiOverallConfidence) AS ?atiOverallConfidence)',
          '  (SAMPLE(?atiVersion) AS ?atiVersion)',
          '  (SAMPLE(?atiComputedAt) AS ?atiComputedAt)',
          '  (SAMPLE(?identity8004) AS ?identity8004)',
          '  (SAMPLE(?did8004) AS ?did8004)',
          '  (SAMPLE(?agentId8004) AS ?agentId8004)',
          '  (SAMPLE(?identityEns) AS ?identityEns)',
          '  (SAMPLE(?didEns) AS ?didEns)',
          '  (SAMPLE(?identity8122) AS ?identity8122)',
          '  (SAMPLE(?did8122) AS ?did8122)',
          '  (SAMPLE(?agentId8122) AS ?agentId8122)',
          '  (SAMPLE(?registry8122) AS ?registry8122)',
          '  (SAMPLE(?endpointType8122) AS ?endpointType8122)',
          '  (SAMPLE(?endpoint8122) AS ?endpoint8122)',
          '  (SAMPLE(?identity8122Descriptor) AS ?identity8122Descriptor)',
          '  (SAMPLE(?identity8122DescriptorName) AS ?identity8122DescriptorName)',
          '  (SAMPLE(?identity8122DescriptorDescription) AS ?identity8122DescriptorDescription)',
          '  (SAMPLE(?identity8122DescriptorImage) AS ?identity8122DescriptorImage)',
          '  (SAMPLE(?identity8122DescriptorJson) AS ?identity8122DescriptorJson)',
          '  (SAMPLE(?identity8122OwnerAccount) AS ?identity8122OwnerAccount)',
          '  (SAMPLE(?identity8122AgentAccount) AS ?identity8122AgentAccount)',
          '  (SAMPLE(?identityHol) AS ?identityHol)',
          '  (SAMPLE(?holProtocolIdentifier) AS ?holProtocolIdentifier)',
          '  (SAMPLE(?uaidHOL) AS ?uaidHOL)',
          '  (SAMPLE(?identityHolDescriptor) AS ?identityHolDescriptor)',
          '  (SAMPLE(?identityHolDescriptorName) AS ?identityHolDescriptorName)',
          '  (SAMPLE(?identityHolDescriptorDescription) AS ?identityHolDescriptorDescription)',
          '  (SAMPLE(?identityHolDescriptorImage) AS ?identityHolDescriptorImage)',
          '  (SAMPLE(?identityHolDescriptorJson) AS ?identityHolDescriptorJson)',
          '  (SAMPLE(?identityOwnerAccount) AS ?identityOwnerAccount)',
          '  (SAMPLE(?identityWalletAccount) AS ?identityWalletAccount)',
          '  (SAMPLE(?identityOperatorAccount) AS ?identityOperatorAccount)',
          '  (SAMPLE(?identityOwnerEOAAccount) AS ?identityOwnerEOAAccount)',
          '  (SAMPLE(?agentAccount) AS ?agentAccount)',
          '  (SAMPLE(?identity8004Descriptor) AS ?identity8004Descriptor)',
          '  (SAMPLE(?identity8004DescriptorName) AS ?identity8004DescriptorName)',
          '  (SAMPLE(?identity8004DescriptorDescription) AS ?identity8004DescriptorDescription)',
          '  (SAMPLE(?identity8004DescriptorImage) AS ?identity8004DescriptorImage)',
          '  (SAMPLE(?registrationJson) AS ?registrationJson)',
          '  (SAMPLE(?nftMetadataJson) AS ?nftMetadataJson)',
          '  (SAMPLE(?registeredBy) AS ?registeredBy)',
          '  (SAMPLE(?registryNamespace) AS ?registryNamespace)',
          '  (GROUP_CONCAT(DISTINCT STR(?idSkillOut); separator=" ") AS ?identity8004DescriptorSkills)',
          '  (GROUP_CONCAT(DISTINCT STR(?idDomainOut); separator=" ") AS ?identity8004DescriptorDomains)',
          '  (SAMPLE(?seA2a) AS ?seA2a)',
          '  (SAMPLE(?a2aServiceUrl) AS ?a2aServiceUrl)',
          '  (SAMPLE(?pA2a) AS ?pA2a)',
          '  (SAMPLE(?seA2aDesc) AS ?seA2aDesc)',
          '  (SAMPLE(?a2aServiceEndpointDescriptorName) AS ?a2aServiceEndpointDescriptorName)',
          '  (SAMPLE(?a2aServiceEndpointDescriptorDescription) AS ?a2aServiceEndpointDescriptorDescription)',
          '  (SAMPLE(?a2aServiceEndpointDescriptorImage) AS ?a2aServiceEndpointDescriptorImage)',
          '  (SAMPLE(?pA2aDesc) AS ?pA2aDesc)',
          '  (SAMPLE(?a2aDescriptorName) AS ?a2aDescriptorName)',
          '  (SAMPLE(?a2aDescriptorDescription) AS ?a2aDescriptorDescription)',
          '  (SAMPLE(?a2aDescriptorImage) AS ?a2aDescriptorImage)',
          '  (SAMPLE(?a2aProtocolVersion) AS ?a2aProtocolVersion)',
          '  (SAMPLE(?a2aAgentCardJson) AS ?a2aAgentCardJson)',
          '  (GROUP_CONCAT(DISTINCT STR(?a2aSkillOut); separator=" ") AS ?a2aSkills)',
          '  (GROUP_CONCAT(DISTINCT STR(?a2aDomainOut); separator=" ") AS ?a2aDomains)',
          '  (SAMPLE(?seMcp) AS ?seMcp)',
          '  (SAMPLE(?mcpServiceUrl) AS ?mcpServiceUrl)',
          '  (SAMPLE(?pMcp) AS ?pMcp)',
          '  (SAMPLE(?seMcpDesc) AS ?seMcpDesc)',
          '  (SAMPLE(?mcpServiceEndpointDescriptorName) AS ?mcpServiceEndpointDescriptorName)',
          '  (SAMPLE(?mcpServiceEndpointDescriptorDescription) AS ?mcpServiceEndpointDescriptorDescription)',
          '  (SAMPLE(?mcpServiceEndpointDescriptorImage) AS ?mcpServiceEndpointDescriptorImage)',
          '  (SAMPLE(?pMcpDesc) AS ?pMcpDesc)',
          '  (SAMPLE(?mcpDescriptorName) AS ?mcpDescriptorName)',
          '  (SAMPLE(?mcpDescriptorDescription) AS ?mcpDescriptorDescription)',
          '  (SAMPLE(?mcpDescriptorImage) AS ?mcpDescriptorImage)',
          '  (SAMPLE(?mcpProtocolVersion) AS ?mcpProtocolVersion)',
          '  (SAMPLE(?mcpAgentCardJson) AS ?mcpAgentCardJson)',
          '  (GROUP_CONCAT(DISTINCT STR(?mcpSkillOut); separator=" ") AS ?mcpSkills)',
          '  (GROUP_CONCAT(DISTINCT STR(?mcpDomainOut); separator=" ") AS ?mcpDomains)',
          '  (GROUP_CONCAT(DISTINCT STR(?agentType); separator=" ") AS ?agentTypes)',
          'WHERE {',
          ctxIri ? `  VALUES ?agent { ${valuesAgents} }` : `  VALUES (?g ?agent) { ${valuesPairs} }`,
          ctxIri ? `  GRAPH <${ctxIri}> {` : '  GRAPH ?g {',
          '    ?agent a core:AIAgent .',
          '    OPTIONAL { ?agent core:createdAtTime ?createdAtTime . }',
          '    OPTIONAL { ?agent core:updatedAtTime ?updatedAtTime . }',
          '    OPTIONAL { ?agent core:uaid ?uaid . }',
          '    OPTIONAL {',
          '      ?agent core:hasDescriptor ?agentDesc .',
          '      OPTIONAL { ?agentDesc dcterms:title ?agentDescTitle . }',
          '      OPTIONAL { ?agentDesc dcterms:description ?agentDescDescription . }',
          '      OPTIONAL { ?agentDesc schema:image ?agentDescImage . }',
          '    }',
          '    BIND(?agentDescTitle AS ?agentName)',
          '    BIND(?agentDescImage AS ?agentImage)',
          '    OPTIONAL { ?agent a ?agentType . }',
            '    OPTIONAL {',
            '      ?agent core:hasFeedbackAssertionSummary ?fbSummary .',
            '      ?fbSummary core:feedbackAssertionCount ?feedbackAssertionCount .',
            '    }',
            '    OPTIONAL {',
            '      ?agent core:hasValidationAssertionSummary ?vrSummary .',
            '      ?vrSummary core:validationAssertionCount ?validationAssertionCount .',
            '    }',
          '    OPTIONAL {',
          '      ?agent core:hasIdentity ?identity8004 .',
          '      ?identity8004 a erc8004:AgentIdentity8004 ;',
          '                    core:hasIdentifier ?ident8004 ;',
          '                    core:hasDescriptor ?desc8004 .',
          '      ?ident8004 core:protocolIdentifier ?did8004 .',
          '      OPTIONAL { ?identity8004 erc8004:agentId ?agentId8004 . }',
          '      BIND(?desc8004 AS ?identity8004Descriptor)',
          '      OPTIONAL { ?desc8004 erc8004:registrationJson ?registrationJson . }',
          '      OPTIONAL { ?desc8004 dcterms:title ?identity8004DescriptorName . }',
          '      OPTIONAL { ?desc8004 dcterms:description ?identity8004DescriptorDescription . }',
          '      OPTIONAL { ?desc8004 schema:image ?identity8004DescriptorImage . }',
          '      OPTIONAL { ?desc8004 erc8004:nftMetadataJson ?nftMetadataJson . }',
          '      OPTIONAL { ?desc8004 erc8004:registeredBy ?registeredBy . }',
          '      OPTIONAL { ?desc8004 erc8004:registryNamespace ?registryNamespace . }',
          '      OPTIONAL {',
          '        ?desc8004 core:hasSkill ?idSkill .',
          '        OPTIONAL { ?idSkill core:hasSkillClassification ?idSkillClass . OPTIONAL { ?idSkillClass oasf:key ?idSkillKey . } }',
          '        OPTIONAL { ?idSkill core:skillId ?idSkillId . }',
          '        BIND(COALESCE(?idSkillKey, ?idSkillId, STR(?idSkill)) AS ?idSkillOut)',
          '      }',
          '      OPTIONAL {',
          '        ?desc8004 core:hasDomain ?idDomain .',
          '        OPTIONAL { ?idDomain core:hasDomainClassification ?idDomainClass . OPTIONAL { ?idDomainClass oasf:key ?idDomainKey . } }',
          '        BIND(COALESCE(?idDomainKey, STR(?idDomain)) AS ?idDomainOut)',
          '      }',
          '      OPTIONAL {',
          '        ?identity8004 core:hasServiceEndpoint ?seA2a .',
          '        ?seA2a a core:ServiceEndpoint ;',
          '              core:hasProtocol ?pA2a .',
          '        ?pA2a a core:A2AProtocol .',
          '        OPTIONAL {',
          '          ?seA2a core:hasDescriptor ?seA2aDesc .',
          '          OPTIONAL { ?seA2aDesc dcterms:title ?a2aServiceEndpointDescriptorName . }',
          '          OPTIONAL { ?seA2aDesc dcterms:description ?a2aServiceEndpointDescriptorDescription . }',
          '          OPTIONAL { ?seA2aDesc schema:image ?a2aServiceEndpointDescriptorImage . }',
          '        }',
          '        OPTIONAL { ?pA2a core:serviceUrl ?a2aServiceUrl . }',
          '        OPTIONAL { ?pA2a core:protocolVersion ?a2aProtocolVersion . }',
          '        OPTIONAL {',
          '          ?pA2a core:hasDescriptor ?pA2aDesc .',
          '          OPTIONAL { ?pA2aDesc dcterms:title ?a2aDescriptorName . }',
          '          OPTIONAL { ?pA2aDesc dcterms:description ?a2aDescriptorDescription . }',
          '          OPTIONAL { ?pA2aDesc schema:image ?a2aDescriptorImage . }',
          '          OPTIONAL { ?pA2aDesc core:agentCardJson ?a2aAgentCardJson . }',
          '        }',
          '        OPTIONAL {',
          '          ?pA2a core:hasSkill ?a2aSkill .',
          '          OPTIONAL { ?a2aSkill core:hasSkillClassification ?a2aSkillClass . OPTIONAL { ?a2aSkillClass oasf:key ?a2aSkillKey . } }',
          '          OPTIONAL { ?a2aSkill core:skillId ?a2aSkillId . }',
          '          BIND(COALESCE(?a2aSkillKey, ?a2aSkillId, STR(?a2aSkill)) AS ?a2aSkillOut)',
          '        }',
          '        OPTIONAL {',
          '          ?pA2a core:hasDomain ?a2aDomain .',
          '          OPTIONAL { ?a2aDomain core:hasDomainClassification ?a2aDomainClass . OPTIONAL { ?a2aDomainClass oasf:key ?a2aDomainKey . } }',
          '          BIND(COALESCE(?a2aDomainKey, STR(?a2aDomain)) AS ?a2aDomainOut)',
          '        }',
          '      }',
          '      OPTIONAL {',
          '        ?identity8004 core:hasServiceEndpoint ?seMcp .',
          '        ?seMcp a core:ServiceEndpoint ;',
          '              core:hasProtocol ?pMcp .',
          '        ?pMcp a core:MCPProtocol .',
          '        OPTIONAL {',
          '          ?seMcp core:hasDescriptor ?seMcpDesc .',
          '          OPTIONAL { ?seMcpDesc dcterms:title ?mcpServiceEndpointDescriptorName . }',
          '          OPTIONAL { ?seMcpDesc dcterms:description ?mcpServiceEndpointDescriptorDescription . }',
          '          OPTIONAL { ?seMcpDesc schema:image ?mcpServiceEndpointDescriptorImage . }',
          '        }',
          '        OPTIONAL { ?pMcp core:serviceUrl ?mcpServiceUrl . }',
          '        OPTIONAL { ?pMcp core:protocolVersion ?mcpProtocolVersion . }',
          '        OPTIONAL {',
          '          ?pMcp core:hasDescriptor ?pMcpDesc .',
          '          OPTIONAL { ?pMcpDesc dcterms:title ?mcpDescriptorName . }',
          '          OPTIONAL { ?pMcpDesc dcterms:description ?mcpDescriptorDescription . }',
          '          OPTIONAL { ?pMcpDesc schema:image ?mcpDescriptorImage . }',
          '          OPTIONAL { ?pMcpDesc core:agentCardJson ?mcpAgentCardJson . }',
          '        }',
          '        OPTIONAL {',
          '          ?pMcp core:hasSkill ?mcpSkill .',
          '          OPTIONAL { ?mcpSkill core:hasSkillClassification ?mcpSkillClass . OPTIONAL { ?mcpSkillClass oasf:key ?mcpSkillKey . } }',
          '          OPTIONAL { ?mcpSkill core:skillId ?mcpSkillId . }',
          '          BIND(COALESCE(?mcpSkillKey, ?mcpSkillId, STR(?mcpSkill)) AS ?mcpSkillOut)',
          '        }',
          '        OPTIONAL {',
          '          ?pMcp core:hasDomain ?mcpDomain .',
          '          OPTIONAL { ?mcpDomain core:hasDomainClassification ?mcpDomainClass . OPTIONAL { ?mcpDomainClass oasf:key ?mcpDomainKey . } }',
          '          BIND(COALESCE(?mcpDomainKey, STR(?mcpDomain)) AS ?mcpDomainOut)',
          '        }',
          '      }',
          '      OPTIONAL { ?identity8004 erc8004:hasOwnerAccount ?identityOwnerAccount . }',
          '      OPTIONAL { ?identity8004 erc8004:hasWalletAccount ?identityWalletAccount . }',
          '      OPTIONAL { ?identity8004 erc8004:hasOperatorAccount ?identityOperatorAccount . }',
          '      OPTIONAL { ?identity8004 erc8004:hasOwnerEOAAccount ?identityOwnerEOAAccount . }',
          '    }',
          '    OPTIONAL {',
          '      ?agent a core:AISmartAgent ;',
          '             core:hasAgentAccount ?agentAccount .',
          '    }',
          '    OPTIONAL {',
          '      ?agent core:hasIdentity ?identityEns .',
          '      ?identityEns a ens:AgentIdentityEns ;',
          '                  core:hasIdentifier ?ensIdent .',
          '      ?ensIdent core:protocolIdentifier ?didEns .',
          '    }',
          '    OPTIONAL {',
          '      ?agent core:hasIdentity ?identity8122 .',
          '      ?identity8122 a erc8122:AgentIdentity8122 ;',
          '                    core:hasIdentifier ?ident8122 ;',
          '                    core:hasDescriptor ?desc8122 .',
          '      ?ident8122 core:protocolIdentifier ?did8122 .',
          '      OPTIONAL { ?identity8122 erc8122:agentId ?agentId8122 . }',
          '      OPTIONAL { ?identity8122 erc8122:registryAddress ?registry8122 . }',
          '      OPTIONAL { ?identity8122 erc8122:endpointType ?endpointType8122 . }',
          '      OPTIONAL { ?identity8122 erc8122:endpoint ?endpoint8122 . }',
          '      OPTIONAL { ?identity8122 erc8122:hasOwnerAccount ?identity8122OwnerAccount . }',
          '      OPTIONAL { ?identity8122 erc8122:hasAgentAccount ?identity8122AgentAccount . }',
          '      OPTIONAL {',
          '        BIND(?desc8122 AS ?identity8122Descriptor)',
          '        OPTIONAL { ?desc8122 dcterms:title ?identity8122DescriptorName . }',
          '        OPTIONAL { ?desc8122 dcterms:description ?identity8122DescriptorDescription . }',
          '        OPTIONAL { ?desc8122 schema:image ?identity8122DescriptorImage . }',
          '        OPTIONAL { ?desc8122 core:json ?identity8122DescriptorJson . }',
          '      }',
          '    }',
          '    OPTIONAL {',
          '      ?agent core:hasIdentity ?identityHol .',
          '      ?identityHol a hol:AgentIdentityHOL ;',
          '                   core:hasIdentifier ?holIdent ;',
          '                   core:identityRegistry ?holRegistry .',
          '      OPTIONAL { ?identityHol hol:uaidHOL ?uaidHOL . }',
          '      ?holIdent core:protocolIdentifier ?holProtocolIdentifier .',
          '      OPTIONAL {',
          '        ?identityHol core:hasDescriptor ?holDesc .',
          '        BIND(?holDesc AS ?identityHolDescriptor)',
          '        OPTIONAL { ?holDesc dcterms:title ?identityHolDescriptorName . }',
          '        OPTIONAL { ?holDesc dcterms:description ?identityHolDescriptorDescription . }',
          '        OPTIONAL { ?holDesc schema:image ?identityHolDescriptorImage . }',
          '        OPTIONAL { ?holDesc core:json ?identityHolDescriptorJson . }',
          '      }',
          '    }',
          '  }',
          ...(analyticsCtxIri
            ? [
                '  OPTIONAL {',
                `    GRAPH <${analyticsCtxIri}> {`,
                '      OPTIONAL {',
                '        ?agent analytics:hasTrustLedgerScore ?tls .',
                '        ?tls a analytics:AgentTrustLedgerScore ; analytics:totalPoints ?trustLedgerTotalPoints .',
                '        OPTIONAL { ?tls analytics:badgeCount ?trustLedgerBadgeCount . }',
                '        OPTIONAL { ?tls analytics:trustLedgerComputedAt ?trustLedgerComputedAt . }',
                '      }',
                '      BIND(IF(BOUND(?agentId8004), STR(?agentId8004), "") AS ?_agentIdStrHydrate)',
                '      OPTIONAL {',
                '        FILTER(?_agentIdStrHydrate != "")',
                '        ?ati a analytics:AgentTrustIndex ;',
                '             analytics:agentId ?_agentIdStrHydrate ;',
                '             analytics:overallScore ?atiOverallScore .',
                '        OPTIONAL { ?ati analytics:overallConfidence ?atiOverallConfidence . }',
                '        OPTIONAL { ?ati analytics:version ?atiVersion . }',
                '        OPTIONAL { ?ati analytics:computedAt ?atiComputedAt . }',
                '      }',
                '    }',
                '  }',
              ]
            : []),
          '}',
          'GROUP BY ?agent',
          '',
        ].join('\n'),
        graphdbCtx,
        'kbAgentsQuery.hydrate',
      )
    : [];

  const countSparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    ...(did8004Filter || agentIdentifierMatch ? ['PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>'] : []),
    ...(agentIdentifierMatch ? ['PREFIX ens: <https://agentictrust.io/ontology/ens#>'] : []),
    ...(agentNameContains ? ['PREFIX dcterms: <http://purl.org/dc/terms/>'] : []),
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    '',
    'SELECT (COUNT(?agent) AS ?count) WHERE {',
    `  ${graphClause}`,
    '    ?agent a core:AIAgent .',
    ...pagePreFilter,
    filters.length ? `    FILTER(${filters.join(' && ')})` : '',
    `  ${graphClose}`,
    '}',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  const countBindings = await runGraphdbQuery(countSparql, graphdbCtx, 'kbAgentsQuery.count');
  const total = countBindings.length ? Number(asString(countBindings[0]?.count) ?? '0') : 0;

  const rows: KbAgentRow[] = rowsBindings.map((b: any) => {
    const typesConcat = asString(b?.agentTypes) ?? '';
    const typeIris = typesConcat
      .split(/\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      iri: asString(b?.agent) ?? '',
      uaid: asString(b?.uaid),
      agentName: asString(b?.agentName),
      agentImage: asString(b?.agentImage),
      agentDescriptorIri: asString(b?.agentDesc),
      agentDescriptorName: asString(b?.agentDescTitle),
      agentDescriptorDescription: asString(b?.agentDescDescription),
      agentDescriptorImage: asString(b?.agentDescImage),
      agentTypes: pickAgentTypesFromRow(typeIris),
      feedbackAssertionCount: asNumber(b?.feedbackAssertionCount),
      validationAssertionCount: asNumber(b?.validationAssertionCount),
      createdAtBlock: asNumber(b?.createdAtBlock),
      createdAtTime: asNumber(b?.createdAtTime),
      updatedAtTime: asNumber(b?.updatedAtTime),
      trustLedgerTotalPoints: asNumber(b?.trustLedgerTotalPoints),
      trustLedgerBadgeCount: asNumber(b?.trustLedgerBadgeCount),
      trustLedgerComputedAt: asNumber(b?.trustLedgerComputedAt),
      atiOverallScore: asNumber(b?.atiOverallScore),
      atiOverallConfidence: asNumber(b?.atiOverallConfidence),
      atiVersion: asString(b?.atiVersion),
      atiComputedAt: asNumber(b?.atiComputedAt),
      identity8004Iri: asString(b?.identity8004),
      did8004: asString(b?.did8004),
      agentId8004: asNumber(b?.agentId8004),
      identity8004DescriptorIri: asString(b?.identity8004Descriptor),
      identity8004DescriptorName: asString(b?.identity8004DescriptorName),
      identity8004DescriptorDescription: asString(b?.identity8004DescriptorDescription),
      identity8004DescriptorImage: asString(b?.identity8004DescriptorImage),
      identity8004RegistrationJson: asString(b?.registrationJson),
      identity8004NftMetadataJson: asString(b?.nftMetadataJson),
      identity8004RegisteredBy: asString(b?.registeredBy),
      identity8004RegistryNamespace: asString(b?.registryNamespace),
      identity8004DescriptorSkills: splitConcat(asString(b?.identity8004DescriptorSkills)),
      identity8004DescriptorDomains: splitConcat(asString(b?.identity8004DescriptorDomains)),
      identityEnsIri: asString(b?.identityEns),
      didEns: asString(b?.didEns),
      identity8122Iri: asString(b?.identity8122),
      did8122: asString(b?.did8122),
      agentId8122: asString(b?.agentId8122),
      registry8122: asString(b?.registry8122),
      endpointType8122: asString(b?.endpointType8122),
      endpoint8122: asString(b?.endpoint8122),
      identity8122DescriptorIri: asString(b?.identity8122Descriptor),
      identity8122DescriptorName: asString(b?.identity8122DescriptorName),
      identity8122DescriptorDescription: asString(b?.identity8122DescriptorDescription),
      identity8122DescriptorImage: asString(b?.identity8122DescriptorImage),
      identity8122DescriptorJson: asString(b?.identity8122DescriptorJson),
      identity8122OwnerAccountIri: asString(b?.identity8122OwnerAccount),
      identity8122AgentAccountIri: asString(b?.identity8122AgentAccount),
      identityHolIri: asString(b?.identityHol),
      identityHolProtocolIdentifier: asString(b?.holProtocolIdentifier),
      identityHolUaidHOL: asString(b?.uaidHOL),
      identityHolDescriptorIri: asString(b?.identityHolDescriptor),
      identityHolDescriptorName: asString(b?.identityHolDescriptorName),
      identityHolDescriptorDescription: asString(b?.identityHolDescriptorDescription),
      identityHolDescriptorImage: asString(b?.identityHolDescriptorImage),
      identityHolDescriptorJson: asString(b?.identityHolDescriptorJson),
      identityOwnerAccountIri: asString(b?.identityOwnerAccount),
      identityWalletAccountIri: asString(b?.identityWalletAccount),
      identityOperatorAccountIri: asString(b?.identityOperatorAccount),
      identityOwnerEOAAccountIri: asString(b?.identityOwnerEOAAccount),

      agentAccountIri: asString(b?.agentAccount),

      a2aServiceEndpointIri: asString(b?.seA2a),
      a2aServiceUrl: asString(b?.a2aServiceUrl),
      a2aProtocolIri: asString(b?.pA2a),
      a2aServiceEndpointDescriptorIri: asString(b?.seA2aDesc),
      a2aServiceEndpointDescriptorName: asString(b?.a2aServiceEndpointDescriptorName),
      a2aServiceEndpointDescriptorDescription: asString(b?.a2aServiceEndpointDescriptorDescription),
      a2aServiceEndpointDescriptorImage: asString(b?.a2aServiceEndpointDescriptorImage),
      a2aProtocolDescriptorIri: asString(b?.pA2aDesc),
      a2aDescriptorName: asString(b?.a2aDescriptorName),
      a2aDescriptorDescription: asString(b?.a2aDescriptorDescription),
      a2aDescriptorImage: asString(b?.a2aDescriptorImage),
      a2aProtocolVersion: asString(b?.a2aProtocolVersion),
      a2aAgentCardJson: asString(b?.a2aAgentCardJson),
      a2aSkills: splitConcat(asString(b?.a2aSkills)),
      a2aDomains: splitConcat(asString(b?.a2aDomains)),

      mcpServiceEndpointIri: asString(b?.seMcp),
      mcpServiceUrl: asString(b?.mcpServiceUrl),
      mcpProtocolIri: asString(b?.pMcp),
      mcpServiceEndpointDescriptorIri: asString(b?.seMcpDesc),
      mcpServiceEndpointDescriptorName: asString(b?.mcpServiceEndpointDescriptorName),
      mcpServiceEndpointDescriptorDescription: asString(b?.mcpServiceEndpointDescriptorDescription),
      mcpServiceEndpointDescriptorImage: asString(b?.mcpServiceEndpointDescriptorImage),
      mcpProtocolDescriptorIri: asString(b?.pMcpDesc),
      mcpDescriptorName: asString(b?.mcpDescriptorName),
      mcpDescriptorDescription: asString(b?.mcpDescriptorDescription),
      mcpDescriptorImage: asString(b?.mcpDescriptorImage),
      mcpProtocolVersion: asString(b?.mcpProtocolVersion),
      mcpAgentCardJson: asString(b?.mcpAgentCardJson),
      mcpSkills: splitConcat(asString(b?.mcpSkills)),
      mcpDomains: splitConcat(asString(b?.mcpDomains)),
    };
  });

  const byIri = new Map(rows.map((r) => [r.iri, r]));
  // When ctxIri is set, use trimmedAgents; otherwise use trimmedPairs
  const ordered = ctxIri
    ? trimmedAgents.map((iri) => byIri.get(iri)).filter((x): x is KbAgentRow => Boolean(x))
    : trimmedPairs.map((p) => byIri.get(p.agent)).filter((x): x is KbAgentRow => Boolean(x));

  return { rows: ordered, total: Number.isFinite(total) ? total : 0, hasMore };
}

export async function kbOwnedAgentsQuery(args: {
  chainId: number;
  ownerAddress: string;
  first?: number | null;
  skip?: number | null;
  orderBy?:
    | 'agentId8004'
    | 'agentName'
    | 'uaid'
    | 'createdAtTime'
    | 'updatedAtTime'
    | 'trustLedgerTotalPoints'
    | 'atiOverallScore'
    | 'bestRank'
    | null;
  orderDirection?: 'ASC' | 'DESC' | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<{ rows: KbAgentRow[]; total: number; hasMore: boolean }> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const ownerAddress = typeof args.ownerAddress === 'string' ? args.ownerAddress.trim() : '';
  const ownerIri = ownerAddress ? accountIriFromAddress(chainId, ownerAddress) : '';

  const first = clampInt(args.first, 1, 500, 20);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);

  // Default ordering: createdAtTime so we don't depend on ERC-8004 agentId for ordering.
  const orderBy = args.orderBy ?? 'createdAtTime';
  const orderDirection = (args.orderDirection ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const orderBaseExpr =
    orderBy === 'agentName'
      ? 'LCASE(STR(?agentName))'
      : orderBy === 'uaid'
        ? 'LCASE(STR(?uaid))'
        : orderBy === 'createdAtTime'
          ? 'IF(BOUND(?createdAtTime), xsd:integer(?createdAtTime), 0)'
          : orderBy === 'updatedAtTime'
            ? 'IF(BOUND(?updatedAtTime), xsd:integer(?updatedAtTime), 0)'
        : '0';
  const orderExpr =
    (orderDirection === 'ASC' ? `ASC(${orderBaseExpr})` : `DESC(${orderBaseExpr})`) + ` ASC(STR(?agent))`;

  const graphs = [`<${chainContext(chainId)}>`];
  const graphClause = `VALUES ?g { ${graphs.join(' ')} }\n  GRAPH ?g {`;
  const graphClose = `  }`;

  const filters: string[] = [];
  if (!ownerIri) return { rows: [], total: 0, hasMore: false };
  // Registry-agnostic ownership:
  // - identity hasOwnerAccount directly equals the EOA account, OR
  // - identity hasOwnerAccount is a SmartAccount whose eth:hasEOAOwner equals the EOA account.
  filters.push(`(?ownerAccount = <${ownerIri}> || EXISTS { ?ownerAccount eth:hasEOAOwner <${ownerIri}> })`);

  const sparql = [
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX erc8122: <https://agentictrust.io/ontology/erc8122#>',
    'PREFIX ens: <https://agentictrust.io/ontology/ens#>',
    'PREFIX dcterms: <http://purl.org/dc/terms/>',
    'PREFIX schema: <http://schema.org/>',
    '',
    'SELECT',
    '  ?agent',
    '  (SAMPLE(?uaid) AS ?uaid)',
    '  (SAMPLE(?agentName) AS ?agentName)',
    '  (SAMPLE(?feedbackAssertionCount) AS ?feedbackAssertionCount)',
    '  (SAMPLE(?validationAssertionCount) AS ?validationAssertionCount)',
    '  (SAMPLE(?createdAtBlock) AS ?createdAtBlock)',
    '  (SAMPLE(?createdAtTime) AS ?createdAtTime)',
    '  (SAMPLE(?updatedAtTime) AS ?updatedAtTime)',
    '  (SAMPLE(?identity8004) AS ?identity8004)',
    '  (SAMPLE(?did8004) AS ?did8004)',
    '  (SAMPLE(?agentId8004) AS ?agentId8004)',
    '  (SAMPLE(?identityEns) AS ?identityEns)',
    '  (SAMPLE(?didEns) AS ?didEns)',
    '  (SAMPLE(?identityHol) AS ?identityHol)',
    '  (SAMPLE(?holProtocolIdentifier) AS ?holProtocolIdentifier)',
    '  (SAMPLE(?uaidHOL) AS ?uaidHOL)',
    '  (SAMPLE(?identityOwnerAccount) AS ?identityOwnerAccount)',
    '  (SAMPLE(?identityWalletAccount) AS ?identityWalletAccount)',
    '  (SAMPLE(?identityOperatorAccount) AS ?identityOperatorAccount)',
    '  (SAMPLE(?identityOwnerEOAAccount) AS ?identityOwnerEOAAccount)',
    '  (SAMPLE(?agentAccount) AS ?agentAccount)',
    '  (SAMPLE(?identity8004Descriptor) AS ?identity8004Descriptor)',
    '  (SAMPLE(?identity8004DescriptorName) AS ?identity8004DescriptorName)',
    '  (SAMPLE(?identity8004DescriptorDescription) AS ?identity8004DescriptorDescription)',
    '  (SAMPLE(?identity8004DescriptorImage) AS ?identity8004DescriptorImage)',
    '  (SAMPLE(?registrationJson) AS ?registrationJson)',
    '  (SAMPLE(?nftMetadataJson) AS ?nftMetadataJson)',
    '  (SAMPLE(?registeredBy) AS ?registeredBy)',
    '  (SAMPLE(?registryNamespace) AS ?registryNamespace)',
    '  (SAMPLE(?seA2a) AS ?seA2a)',
    '  (SAMPLE(?a2aServiceUrl) AS ?a2aServiceUrl)',
    '  (SAMPLE(?pA2a) AS ?pA2a)',
    '  (SAMPLE(?seA2aDesc) AS ?seA2aDesc)',
    '  (SAMPLE(?a2aServiceEndpointDescriptorName) AS ?a2aServiceEndpointDescriptorName)',
    '  (SAMPLE(?a2aServiceEndpointDescriptorDescription) AS ?a2aServiceEndpointDescriptorDescription)',
    '  (SAMPLE(?a2aServiceEndpointDescriptorImage) AS ?a2aServiceEndpointDescriptorImage)',
    '  (SAMPLE(?pA2aDesc) AS ?pA2aDesc)',
    '  (SAMPLE(?a2aDescriptorName) AS ?a2aDescriptorName)',
    '  (SAMPLE(?a2aDescriptorDescription) AS ?a2aDescriptorDescription)',
    '  (SAMPLE(?a2aDescriptorImage) AS ?a2aDescriptorImage)',
    '  (SAMPLE(?a2aProtocolVersion) AS ?a2aProtocolVersion)',
    '  (SAMPLE(?a2aAgentCardJson) AS ?a2aAgentCardJson)',
    '  (GROUP_CONCAT(DISTINCT STR(?a2aSkill); separator=" ") AS ?a2aSkills)',
    '  (SAMPLE(?seMcp) AS ?seMcp)',
    '  (SAMPLE(?mcpServiceUrl) AS ?mcpServiceUrl)',
    '  (SAMPLE(?pMcp) AS ?pMcp)',
    '  (SAMPLE(?seMcpDesc) AS ?seMcpDesc)',
    '  (SAMPLE(?mcpServiceEndpointDescriptorName) AS ?mcpServiceEndpointDescriptorName)',
    '  (SAMPLE(?mcpServiceEndpointDescriptorDescription) AS ?mcpServiceEndpointDescriptorDescription)',
    '  (SAMPLE(?mcpServiceEndpointDescriptorImage) AS ?mcpServiceEndpointDescriptorImage)',
    '  (SAMPLE(?pMcpDesc) AS ?pMcpDesc)',
    '  (SAMPLE(?mcpDescriptorName) AS ?mcpDescriptorName)',
    '  (SAMPLE(?mcpDescriptorDescription) AS ?mcpDescriptorDescription)',
    '  (SAMPLE(?mcpDescriptorImage) AS ?mcpDescriptorImage)',
    '  (SAMPLE(?mcpProtocolVersion) AS ?mcpProtocolVersion)',
    '  (SAMPLE(?mcpAgentCardJson) AS ?mcpAgentCardJson)',
    '  (GROUP_CONCAT(DISTINCT STR(?mcpSkill); separator=" ") AS ?mcpSkills)',
    '  (GROUP_CONCAT(DISTINCT STR(?agentType); separator=" ") AS ?agentTypes)',
    'WHERE {',
    `  ${graphClause}`,
    '    ?agent a core:AIAgent .',
    '    OPTIONAL { ?agent core:createdAtTime ?createdAtTime . }',
    '    OPTIONAL { ?agent core:updatedAtTime ?updatedAtTime . }',
    '    OPTIONAL { ?agent core:uaid ?uaid . }',
    '    OPTIONAL {',
    '      ?agent core:hasDescriptor ?agentDesc .',
    '      OPTIONAL { ?agentDesc dcterms:title ?agentName . }',
    '    }',
    '    OPTIONAL { ?agent a ?agentType . }',
    '    OPTIONAL {',
    '      ?agent core:hasFeedbackAssertionSummary ?fbSummary .',
    '      ?fbSummary core:feedbackAssertionCount ?feedbackAssertionCount .',
    '    }',
    '    OPTIONAL {',
    '      ?agent core:hasValidationAssertionSummary ?vrSummary .',
    '      ?vrSummary core:validationAssertionCount ?validationAssertionCount .',
    '    }',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identity .',
    '      {',
    '        ?identity a erc8004:AgentIdentity8004 ;',
    '                 erc8004:hasOwnerAccount ?ownerAccount .',
    '      } UNION {',
    '        ?identity a erc8122:AgentIdentity8122 ;',
    '                 erc8122:hasOwnerAccount ?ownerAccount .',
    '      }',
    '    }',
    '',
    '    OPTIONAL {',
    '      ?agent a core:AISmartAgent ;',
    '             core:hasAgentAccount ?agentAccount .',
    '    }',
    '',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identityEns .',
    '      ?identityEns a ens:AgentIdentityEns ;',
    '                  core:hasIdentifier ?ensIdent .',
    '      ?ensIdent core:protocolIdentifier ?didEns .',
    '    }',
    '',
    filters.length ? `    FILTER(${filters.join(' && ')})` : '',
    `  ${graphClose}`,
    '}',
    'GROUP BY ?agent',
    `ORDER BY ${orderExpr}`,
    `LIMIT ${first + 1}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const bindings = await runGraphdbQuery(sparql, graphdbCtx, 'kbOwnedAgentsQuery');
  const rows = bindings.map((b) => ({
    iri: asString(b?.agent) ?? '',
    uaid: asString(b?.uaid),
    agentName: asString(b?.agentName),
    agentImage: null, // Not fetched in this query
    agentDescriptorIri: null, // Not fetched in this query
    agentDescriptorName: null, // Not fetched in this query
    agentDescriptorDescription: null, // Not fetched in this query
    agentDescriptorImage: null, // Not fetched in this query
    feedbackAssertionCount: asNumber(b?.feedbackAssertionCount),
    validationAssertionCount: asNumber(b?.validationAssertionCount),
    createdAtBlock: asNumber(b?.createdAtBlock),
    createdAtTime: asNumber(b?.createdAtTime),
    updatedAtTime: asNumber(b?.updatedAtTime),
    trustLedgerTotalPoints: null, // Not fetched in this query
    trustLedgerBadgeCount: null, // Not fetched in this query
    trustLedgerComputedAt: null, // Not fetched in this query
    atiOverallScore: null, // Not fetched in this query
    atiOverallConfidence: null, // Not fetched in this query
    atiVersion: null, // Not fetched in this query
    atiComputedAt: null, // Not fetched in this query
    identity8004Iri: asString(b?.identity8004),
    did8004: asString(b?.did8004),
    agentId8004: asNumber(b?.agentId8004),
    identityEnsIri: asString(b?.identityEns),
    didEns: asString(b?.didEns),
    identityHolIri: asString(b?.identityHol),
    identityHolProtocolIdentifier: asString(b?.holProtocolIdentifier),
    identityHolUaidHOL: asString(b?.uaidHOL),
    identity8122Iri: null, // Not fetched in this query
    did8122: null, // Not fetched in this query
    agentId8122: null, // Not fetched in this query
    registry8122: null, // Not fetched in this query
    endpointType8122: null, // Not fetched in this query
    endpoint8122: null, // Not fetched in this query
    identity8122DescriptorIri: null, // Not fetched in this query
    identity8122DescriptorName: null, // Not fetched in this query
    identity8122DescriptorDescription: null, // Not fetched in this query
    identity8122DescriptorImage: null, // Not fetched in this query
    identity8122DescriptorJson: null, // Not fetched in this query
    identity8122OwnerAccountIri: null, // Not fetched in this query
    identity8122AgentAccountIri: null, // Not fetched in this query
    identityHolDescriptorIri: null, // Not fetched in this query
    identityHolDescriptorName: null, // Not fetched in this query
    identityHolDescriptorDescription: null, // Not fetched in this query
    identityHolDescriptorImage: null, // Not fetched in this query
    identityHolDescriptorJson: null, // Not fetched in this query
    identityOwnerAccountIri: asString(b?.identityOwnerAccount),
    identityWalletAccountIri: asString(b?.identityWalletAccount),
    identityOperatorAccountIri: asString(b?.identityOperatorAccount),
    identityOwnerEOAAccountIri: asString(b?.identityOwnerEOAAccount),

    agentAccountIri: asString(b?.agentAccount),

    identity8004DescriptorIri: asString(b?.identity8004Descriptor),
    identity8004DescriptorName: asString(b?.identity8004DescriptorName),
    identity8004DescriptorDescription: asString(b?.identity8004DescriptorDescription),
    identity8004DescriptorImage: asString(b?.identity8004DescriptorImage),
    identity8004RegistrationJson: asString(b?.registrationJson),
    identity8004NftMetadataJson: asString(b?.nftMetadataJson),
    identity8004RegisteredBy: asString(b?.registeredBy),
    identity8004RegistryNamespace: asString(b?.registryNamespace),
    identity8004DescriptorSkills: [], // Not fetched in this query
    identity8004DescriptorDomains: [], // Not fetched in this query

    a2aServiceEndpointIri: asString(b?.seA2a),
    a2aServiceUrl: asString(b?.a2aServiceUrl),
    a2aProtocolIri: asString(b?.pA2a),
    a2aServiceEndpointDescriptorIri: asString(b?.seA2aDesc),
    a2aServiceEndpointDescriptorName: asString(b?.a2aServiceEndpointDescriptorName),
    a2aServiceEndpointDescriptorDescription: asString(b?.a2aServiceEndpointDescriptorDescription),
    a2aServiceEndpointDescriptorImage: asString(b?.a2aServiceEndpointDescriptorImage),
    a2aProtocolDescriptorIri: asString(b?.pA2aDesc),
    a2aDescriptorName: asString(b?.a2aDescriptorName),
    a2aDescriptorDescription: asString(b?.a2aDescriptorDescription),
    a2aDescriptorImage: asString(b?.a2aDescriptorImage),
    a2aProtocolVersion: asString(b?.a2aProtocolVersion),
    a2aAgentCardJson: asString(b?.a2aAgentCardJson),
    a2aSkills: splitConcat(asString(b?.a2aSkills)),
    a2aDomains: [], // Not fetched in this query

    mcpServiceEndpointIri: asString(b?.seMcp),
    mcpServiceUrl: asString(b?.mcpServiceUrl),
    mcpProtocolIri: asString(b?.pMcp),
    mcpServiceEndpointDescriptorIri: asString(b?.seMcpDesc),
    mcpServiceEndpointDescriptorName: asString(b?.mcpServiceEndpointDescriptorName),
    mcpServiceEndpointDescriptorDescription: asString(b?.mcpServiceEndpointDescriptorDescription),
    mcpServiceEndpointDescriptorImage: asString(b?.mcpServiceEndpointDescriptorImage),
    mcpProtocolDescriptorIri: asString(b?.pMcpDesc),
    mcpDescriptorName: asString(b?.mcpDescriptorName),
    mcpDescriptorDescription: asString(b?.mcpDescriptorDescription),
    mcpDescriptorImage: asString(b?.mcpDescriptorImage),
    mcpProtocolVersion: asString(b?.mcpProtocolVersion),
    mcpAgentCardJson: asString(b?.mcpAgentCardJson),
    mcpSkills: splitConcat(asString(b?.mcpSkills)),
    mcpDomains: [], // Not fetched in this query

    agentTypes: splitConcat(asString(b?.agentTypes)),
  }));

  const hasMore = rows.length > first;
  const trimmed = hasMore ? rows.slice(0, first) : rows;

  // Total count (distinct agents) with same filter
  const countSparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX erc8122: <https://agentictrust.io/ontology/erc8122#>',
    'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
    '',
    'SELECT (COUNT(DISTINCT ?agent) AS ?count) WHERE {',
    `  ${graphClause}`,
    '    ?agent a core:AIAgent ; core:hasIdentity ?identity .',
    '    {',
    '      ?identity a erc8004:AgentIdentity8004 ; erc8004:hasOwnerAccount ?ownerAccount .',
    '    } UNION {',
    '      ?identity a erc8122:AgentIdentity8122 ; erc8122:hasOwnerAccount ?ownerAccount .',
    '    }',
    `    FILTER(?ownerAccount = <${ownerIri}> || EXISTS { ?ownerAccount eth:hasEOAOwner <${ownerIri}> })`,
    `  ${graphClose}`,
    '}',
    '',
  ].join('\n');

  const countBindings = await runGraphdbQuery(countSparql, graphdbCtx, 'kbOwnedAgentsQuery.count');
  const total = clampInt(asNumber(countBindings?.[0]?.count), 0, 10_000_000_000, 0);

  return { rows: trimmed, total, hasMore };
}

export async function kbOwnedAgentsAllChainsQuery(args: {
  ownerAddress: string;
  first?: number | null;
  skip?: number | null;
  orderBy?:
    | 'agentId8004'
    | 'agentName'
    | 'uaid'
    | 'createdAtTime'
    | 'updatedAtTime'
    | 'trustLedgerTotalPoints'
    | 'atiOverallScore'
    | 'bestRank'
    | null;
  orderDirection?: 'ASC' | 'DESC' | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<{ rows: KbAgentRow[]; total: number; hasMore: boolean }> {
  const ownerAddress = typeof args.ownerAddress === 'string' ? args.ownerAddress.trim().toLowerCase() : '';
  if (!ownerAddress) return { rows: [], total: 0, hasMore: false };

  // For mainnet (chainId=1), use IRI-based lookup (much faster)
  const chainId = 1;
  const ownerIri = accountIriFromAddress(chainId, ownerAddress);

  const first = clampInt(args.first, 1, 500, 20);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);

  // Default ordering: createdAtTime so we don't depend on ERC-8004 agentId for ordering.
  const orderBy = args.orderBy ?? 'createdAtTime';
  const orderDirection = (args.orderDirection ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const orderBaseExpr =
    orderBy === 'agentName'
      ? 'LCASE(STR(?agentName))'
      : orderBy === 'uaid'
        ? 'LCASE(STR(?uaid))'
        : orderBy === 'createdAtTime'
          ? 'IF(BOUND(?createdAtTime), xsd:integer(?createdAtTime), 0)'
          : orderBy === 'updatedAtTime'
            ? 'IF(BOUND(?updatedAtTime), xsd:integer(?updatedAtTime), 0)'
        : '0';
  const orderExpr =
    (orderDirection === 'ASC' ? `ASC(${orderBaseExpr})` : `DESC(${orderBaseExpr})`) + ` ASC(STR(?agent))`;

  // Phase 1: Get agent IRIs only (minimal query for pagination)
  const pageOptionalOrderBinds: string[] = [];
  const pageRequiredOrderBinds: string[] = [];
  const pageSelectVars =
    orderBy === 'uaid'
      ? '?agent ?uaid'
      : orderBy === 'agentName'
        ? '?agent ?agentName'
        : orderBy === 'createdAtTime'
          ? '?agent ?createdAtTime'
          : orderBy === 'updatedAtTime'
            ? '?agent ?updatedAtTime'
            : '?agent';

  if (orderBy === 'uaid') {
    pageOptionalOrderBinds.push('    OPTIONAL { ?agent core:uaid ?uaid . }');
  } else if (orderBy === 'agentName') {
    pageOptionalOrderBinds.push('    OPTIONAL { ?agent core:hasDescriptor ?agentDescOrder . OPTIONAL { ?agentDescOrder dcterms:title ?agentName . } }');
  } else if (orderBy === 'createdAtTime' || orderBy === 'updatedAtTime') {
    // Provenance timestamps are materialized on agent nodes by sync.
    pageOptionalOrderBinds.push('    OPTIONAL { ?agent core:createdAtTime ?createdAtTime . }');
    pageOptionalOrderBinds.push('    OPTIONAL { ?agent core:updatedAtTime ?updatedAtTime . }');
  } else {
    // agentId8004 ordering is deprecated in favor of createdAtTime; fall back to stable IRI ordering.
  }

  const pageSparql = [
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX dcterms: <http://purl.org/dc/terms/>',
    '',
    `SELECT DISTINCT ${pageSelectVars} WHERE {`,
    '  GRAPH <https://www.agentictrust.io/graph/data/subgraph/1> {',
    '    # Identity-scoped effective EOA ownership (materialized during sync:account-types)',
    `    VALUES ?ownerEOA { <${ownerIri}> }`,
    '    ?agent core:hasIdentity ?identity8004 .',
    '    ?identity8004 a erc8004:AgentIdentity8004 .',
    '    { ?identity8004 erc8004:hasOwnerEOAAccount ?ownerEOA . }',
    '    UNION',
    '    # Fallback: ownerAccount is already an EOA (covers older/missing hasOwnerEOAAccount)',
    '    { ?identity8004 erc8004:hasOwnerAccount ?ownerEOA . }',
    ...pageRequiredOrderBinds,
    ...pageOptionalOrderBinds,
    '  }',
    '}',
    `ORDER BY ${orderExpr}`,
    `LIMIT ${first + 1}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const pageBindings = await runGraphdbQuery(pageSparql, graphdbCtx, 'kbOwnedAgentsAllChainsQuery.page');
  const agentIris: string[] = [];
  for (const b of pageBindings) {
    const agent = asString((b as any)?.agent);
    if (agent) agentIris.push(agent);
  }
  const hasMore = agentIris.length > first;
  const trimmedIris = hasMore ? agentIris.slice(0, first) : agentIris;

  if (trimmedIris.length === 0) {
    return { rows: [], total: 0, hasMore: false };
  }

  // Phase 2: Hydrate minimal agent data (only fields requested by GraphQL query)
  const valuesAgents = trimmedIris.map((iri) => `<${iri}>`).join(' ');
  const sparql = trimmedIris.length
    ? [
        'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
        'PREFIX core: <https://agentictrust.io/ontology/core#>',
        'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
        'PREFIX dcterms: <http://purl.org/dc/terms/>',
        '',
        'SELECT',
        '  ?agent',
        '  (SAMPLE(?uaid) AS ?uaid)',
        '  (SAMPLE(?agentName) AS ?agentName)',
        '  (SAMPLE(?createdAtBlock) AS ?createdAtBlock)',
        '  (SAMPLE(?createdAtTime) AS ?createdAtTime)',
        '  (SAMPLE(?updatedAtTime) AS ?updatedAtTime)',
        '  (SAMPLE(?did8004) AS ?did8004)',
        '  (SAMPLE(?agentId8004) AS ?agentId8004)',
        '  (GROUP_CONCAT(DISTINCT STR(?agentType); separator=" ") AS ?agentTypes)',
        'WHERE {',
        `  VALUES ?agent { ${valuesAgents} }`,
        '  GRAPH <https://www.agentictrust.io/graph/data/subgraph/1> {',
        '    ?agent a core:AIAgent .',
        '    OPTIONAL { ?agent core:createdAtTime ?createdAtTime . }',
        '    OPTIONAL { ?agent core:updatedAtTime ?updatedAtTime . }',
        '    OPTIONAL { ?agent core:uaid ?uaid . }',
        '    OPTIONAL { ?agent core:hasDescriptor ?agentDesc . OPTIONAL { ?agentDesc dcterms:title ?agentName . } }',
        '    OPTIONAL {',
        '      ?agent a ?agentType .',
        '      FILTER(STRSTARTS(STR(?agentType), "https://agentictrust.io/ontology/"))',
        '    }',
        '    OPTIONAL {',
        '      ?agent core:hasIdentity ?identity8004 .',
        '      ?identity8004 a erc8004:AgentIdentity8004 ;',
        '                    core:hasIdentifier ?ident8004 .',
    '      ?ident8004 core:protocolIdentifier ?did8004 .',
        '      OPTIONAL { ?identity8004 erc8004:agentId ?agentId8004 . }',
        '    }',
        '  }',
        '}',
        'GROUP BY ?agent',
        '',
      ].join('\n')
    : '';

  const bindings = sparql ? await runGraphdbQuery(sparql, graphdbCtx, 'kbOwnedAgentsAllChainsQuery.hydrate') : [];
  
  // Create a map of agent IRI to binding for quick lookup
  const bindingMap = new Map<string, any>();
  for (const b of bindings) {
    const agent = asString((b as any)?.agent);
    if (agent) bindingMap.set(agent, b);
  }
  
  // Preserve order from page query (only map fields we actually fetch)
  const rows = trimmedIris
    .map((iri) => bindingMap.get(iri))
    .filter(Boolean)
    .map((b) => ({
    iri: asString(b?.agent) ?? '',
    uaid: asString(b?.uaid),
    agentName: asString(b?.agentName),
    agentImage: null, // Not fetched in simplified query
    agentDescriptorIri: null, // Not fetched in simplified query
    agentDescriptorName: null, // Not fetched in simplified query
    agentDescriptorDescription: null, // Not fetched in simplified query
    agentDescriptorImage: null, // Not fetched in simplified query
    feedbackAssertionCount: null, // Not fetched in simplified query
    validationAssertionCount: null, // Not fetched in simplified query
    createdAtBlock: asNumber(b?.createdAtBlock),
    createdAtTime: asNumber(b?.createdAtTime),
    updatedAtTime: asNumber(b?.updatedAtTime),
    trustLedgerTotalPoints: null, // Not fetched in simplified query
    trustLedgerBadgeCount: null, // Not fetched in simplified query
    trustLedgerComputedAt: null, // Not fetched in simplified query
    atiOverallScore: null, // Not fetched in simplified query
    atiOverallConfidence: null, // Not fetched in simplified query
    atiVersion: null, // Not fetched in simplified query
    atiComputedAt: null, // Not fetched in simplified query
    identity8004Iri: null, // Not fetched in simplified query
    did8004: asString(b?.did8004),
    agentId8004: asNumber(b?.agentId8004),
    identityEnsIri: null, // Not fetched in simplified query
    didEns: null, // Not fetched in simplified query
    identityHolIri: null, // Not fetched in simplified query
    identityHolProtocolIdentifier: null, // Not fetched in simplified query
    identityHolUaidHOL: null, // Not fetched in simplified query
    identity8122Iri: null, // Not fetched in simplified query
    did8122: null, // Not fetched in simplified query
    agentId8122: null, // Not fetched in simplified query
    registry8122: null, // Not fetched in simplified query
    endpointType8122: null, // Not fetched in simplified query
    endpoint8122: null, // Not fetched in simplified query
    identity8122DescriptorIri: null, // Not fetched in simplified query
    identity8122DescriptorName: null, // Not fetched in simplified query
    identity8122DescriptorDescription: null, // Not fetched in simplified query
    identity8122DescriptorImage: null, // Not fetched in simplified query
    identity8122DescriptorJson: null, // Not fetched in simplified query
    identity8122OwnerAccountIri: null, // Not fetched in simplified query
    identity8122AgentAccountIri: null, // Not fetched in simplified query
    identityHolDescriptorIri: null, // Not fetched in simplified query
    identityHolDescriptorName: null, // Not fetched in simplified query
    identityHolDescriptorDescription: null, // Not fetched in simplified query
    identityHolDescriptorImage: null, // Not fetched in simplified query
    identityHolDescriptorJson: null, // Not fetched in simplified query
    identityOwnerAccountIri: null, // Not fetched in simplified query
    identityWalletAccountIri: null, // Not fetched in simplified query
    identityOperatorAccountIri: null, // Not fetched in simplified query
    identityOwnerEOAAccountIri: null, // Not fetched in simplified query
    agentAccountIri: null, // Not fetched in simplified query

    identity8004DescriptorIri: null, // Not fetched in simplified query
    identity8004DescriptorName: null, // Not fetched in simplified query
    identity8004DescriptorDescription: null, // Not fetched in simplified query
    identity8004DescriptorImage: null, // Not fetched in simplified query
    identity8004RegistrationJson: null, // Not fetched in simplified query
    identity8004NftMetadataJson: null, // Not fetched in simplified query
    identity8004RegisteredBy: null, // Not fetched in simplified query
    identity8004RegistryNamespace: null, // Not fetched in simplified query
    identity8004DescriptorSkills: [], // Not fetched in simplified query
    identity8004DescriptorDomains: [], // Not fetched in simplified query

    a2aServiceEndpointIri: null, // Not fetched in simplified query
    a2aServiceUrl: null, // Not fetched in simplified query
    a2aProtocolIri: null, // Not fetched in simplified query
    a2aServiceEndpointDescriptorIri: null, // Not fetched in simplified query
    a2aServiceEndpointDescriptorName: null, // Not fetched in simplified query
    a2aServiceEndpointDescriptorDescription: null, // Not fetched in simplified query
    a2aServiceEndpointDescriptorImage: null, // Not fetched in simplified query
    a2aProtocolDescriptorIri: null, // Not fetched in simplified query
    a2aDescriptorName: null, // Not fetched in simplified query
    a2aDescriptorDescription: null, // Not fetched in simplified query
    a2aDescriptorImage: null, // Not fetched in simplified query
    a2aProtocolVersion: null, // Not fetched in simplified query
    a2aAgentCardJson: null, // Not fetched in simplified query
    a2aSkills: [], // Not fetched in simplified query
    a2aDomains: [], // Not fetched in simplified query

    mcpServiceEndpointIri: null, // Not fetched in simplified query
    mcpServiceUrl: null, // Not fetched in simplified query
    mcpProtocolIri: null, // Not fetched in simplified query
    mcpServiceEndpointDescriptorIri: null, // Not fetched in simplified query
    mcpServiceEndpointDescriptorName: null, // Not fetched in simplified query
    mcpServiceEndpointDescriptorDescription: null, // Not fetched in simplified query
    mcpServiceEndpointDescriptorImage: null, // Not fetched in simplified query
    mcpProtocolDescriptorIri: null, // Not fetched in simplified query
    mcpDescriptorName: null, // Not fetched in simplified query
    mcpDescriptorDescription: null, // Not fetched in simplified query
    mcpDescriptorImage: null, // Not fetched in simplified query
    mcpProtocolVersion: null, // Not fetched in simplified query
    mcpAgentCardJson: null, // Not fetched in simplified query
    mcpSkills: [], // Not fetched in simplified query
    mcpDomains: [], // Not fetched in simplified query

    agentTypes: splitConcat(asString(b?.agentTypes)),
  }));

  // Optimized count: anchor on owner account first
  const countSparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT (COUNT(DISTINCT ?agent) AS ?count) WHERE {',
    '  GRAPH <https://www.agentictrust.io/graph/data/subgraph/1> {',
    '    # Match the same ownership logic as page query (identity-scoped)',
    `    VALUES ?ownerEOA { <${ownerIri}> }`,
    '    ?agent a core:AIAgent ; core:hasIdentity ?identity8004 .',
    '    ?identity8004 a erc8004:AgentIdentity8004 .',
    '    { ?identity8004 erc8004:hasOwnerEOAAccount ?ownerEOA . }',
    '    UNION',
    '    { ?identity8004 erc8004:hasOwnerAccount ?ownerEOA . }',
    '  }',
    '}',
    '',
  ].join('\n');

  const countBindings = await runGraphdbQuery(countSparql, graphdbCtx, 'kbOwnedAgentsAllChainsQuery.count');
  const total = clampInt(asNumber(countBindings?.[0]?.count), 0, 10_000_000_000, 0);

  return { rows, total, hasMore };
}

export type KbSubgraphRecord = {
  rawJson: string | null;
  txHash: string | null;
  blockNumber: number | null;
  timestamp: number | null;
};

export async function kbValidationResponseIrisQuery(args: {
  chainId: number;
  first?: number | null;
  skip?: number | null;
}): Promise<string[]> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const first = clampInt(args.first, 1, 5000, 100);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const ctx = chainContext(chainId);
  const sparql = [
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    '',
    'SELECT ?validation WHERE {',
    `  GRAPH <${ctx}> {`,
    '    ?validation a erc8004:ValidationResponse, prov:Entity .',
    '  }',
    '}',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');
  const rows = await runGraphdbQuery(sparql);
  return rows.map((b: any) => asString(b?.validation)).filter((x): x is string => Boolean(x));
}

export type KbValidationResponseRow = {
  iri: string;
  agentDid8004: string | null;
  json: string | null;
  record: KbSubgraphRecord | null;
};

export async function kbValidationResponsesQuery(args: {
  chainId: number;
  first?: number | null;
  skip?: number | null;
}): Promise<KbValidationResponseRow[]> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const first = clampInt(args.first, 1, 2000, 100);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const ctx = chainContext(chainId);

  const sparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT',
    '  ?validation',
    '  (SAMPLE(?did8004) AS ?did8004)',
    '  (SAMPLE(?json) AS ?json)',
    '  (SAMPLE(?rawJson) AS ?rawJson)',
    '  (SAMPLE(?txHash) AS ?txHash)',
    '  (SAMPLE(?blockNumber) AS ?blockNumber)',
    '  (SAMPLE(?timestamp) AS ?timestamp)',
    'WHERE {',
    `  GRAPH <${ctx}> {`,
    '    ?agent core:hasVerificationAssertion ?validation .',
    '    OPTIONAL { ?validation core:json ?json }',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;',
    '              erc8004:recordsEntity ?validation .',
    '      OPTIONAL { ?record erc8004:subgraphRawJson ?rawJson }',
    '      OPTIONAL { ?record erc8004:subgraphTxHash ?txHash }',
    '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?blockNumber }',
    '      OPTIONAL { ?record erc8004:subgraphTimestamp ?timestamp }',
    '    }',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identity8004 .',
    '      ?identity8004 core:hasIdentifier ?ident8004 .',
    '      ?ident8004 core:protocolIdentifier ?did8004 .',
    '      FILTER(STRSTARTS(STR(?did8004), "did:8004:"))',
    '    }',
    '  }',
    '}',
    'GROUP BY ?validation',
    'ORDER BY DESC(STR(?timestamp)) DESC(STR(?validation))',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const rows = await runGraphdbQuery(sparql);
  return rows
    .map((b: any) => {
      const iri = asString(b?.validation);
      if (!iri) return null;
      const rawJson = asString(b?.rawJson);
      const txHash = asString(b?.txHash);
      const blockNumber = asNumber(b?.blockNumber);
      const timestamp = asNumber(b?.timestamp);
      return {
        iri,
        agentDid8004: asString(b?.did8004),
        json: asString(b?.json),
        record:
          rawJson || txHash || blockNumber != null || timestamp != null
            ? { rawJson, txHash, blockNumber: blockNumber == null ? null : Math.trunc(blockNumber), timestamp: timestamp == null ? null : Math.trunc(timestamp) }
            : null,
      } satisfies KbValidationResponseRow;
    })
    .filter((x): x is KbValidationResponseRow => Boolean(x));
}

export async function kbAssociationIrisQuery(args: { chainId: number; first?: number | null; skip?: number | null }): Promise<string[]> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const first = clampInt(args.first, 1, 5000, 100);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const ctx = chainContext(chainId);
  const sparql = [
    'PREFIX erc8092: <https://agentictrust.io/ontology/erc8092#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    '',
    'SELECT ?association WHERE {',
    `  GRAPH <${ctx}> {`,
    '    ?association a erc8092:AssociatedAccounts8092, prov:Entity .',
    '  }',
    '}',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');
  const rows = await runGraphdbQuery(sparql);
  return rows.map((b: any) => asString(b?.association)).filter((x): x is string => Boolean(x));
}

export type KbAssociationRow = {
  iri: string;
  record: KbSubgraphRecord | null;
};

export async function kbAssociationsQuery(args: {
  chainId: number;
  first?: number | null;
  skip?: number | null;
}): Promise<KbAssociationRow[]> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const first = clampInt(args.first, 1, 2000, 100);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const ctx = chainContext(chainId);
  const sparql = [
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX erc8092: <https://agentictrust.io/ontology/erc8092#>',
    '',
    'SELECT',
    '  ?association',
    '  (SAMPLE(?rawJson) AS ?rawJson)',
    '  (SAMPLE(?txHash) AS ?txHash)',
    '  (SAMPLE(?blockNumber) AS ?blockNumber)',
    '  (SAMPLE(?timestamp) AS ?timestamp)',
    'WHERE {',
    `  GRAPH <${ctx}> {`,
    '    ?association a erc8092:AssociatedAccounts8092, prov:Entity .',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;',
    '              erc8004:recordsEntity ?association .',
    '      OPTIONAL { ?record erc8004:subgraphRawJson ?rawJson }',
    '      OPTIONAL { ?record erc8004:subgraphTxHash ?txHash }',
    '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?blockNumber }',
    '      OPTIONAL { ?record erc8004:subgraphTimestamp ?timestamp }',
    '    }',
    '  }',
    '}',
    'GROUP BY ?association',
    'ORDER BY DESC(STR(?timestamp)) DESC(STR(?association))',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');
  const rows = await runGraphdbQuery(sparql);
  return rows
    .map((b: any) => {
      const iri = asString(b?.association);
      if (!iri) return null;
      const rawJson = asString(b?.rawJson);
      const txHash = asString(b?.txHash);
      const blockNumber = asNumber(b?.blockNumber);
      const timestamp = asNumber(b?.timestamp);
      return {
        iri,
        record:
          rawJson || txHash || blockNumber != null || timestamp != null
            ? { rawJson, txHash, blockNumber: blockNumber == null ? null : Math.trunc(blockNumber), timestamp: timestamp == null ? null : Math.trunc(timestamp) }
            : null,
      } satisfies KbAssociationRow;
    })
    .filter((x): x is KbAssociationRow => Boolean(x));
}
