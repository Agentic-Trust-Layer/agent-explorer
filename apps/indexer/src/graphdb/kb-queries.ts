import { getGraphdbConfigFromEnv, queryGraphdbWithContext, type GraphdbQueryContext } from './graphdb-http.js';

export type GraphdbBinding = { type: string; value: string; datatype?: string; 'xml:lang'?: string };

export type KbAgentRow = {
  iri: string;
  uaid: string | null;
  agentName: string | null;
  agentTypes: string[];
  feedbackAssertionCount8004: number | null;
  validationAssertionCount8004: number | null;
  createdAtBlock: number | null;
  createdAtTime: number | null;
  updatedAtTime: number | null;
  did8004: string | null;
  agentId8004: number | null;
  identity8004Iri: string | null;
  identity8004DescriptorIri: string | null;
  identity8004RegistrationJson: string | null;
  identity8004OnchainMetadataJson: string | null;
  identity8004RegisteredBy: string | null;
  identity8004RegistryNamespace: string | null;
  identityEnsIri: string | null;
  didEns: string | null;
  identityOwnerAccountIri: string | null;
  identityWalletAccountIri: string | null;
  identityOperatorAccountIri: string | null;

  agentOwnerAccountIri: string | null;
  agentOperatorAccountIri: string | null;
  agentWalletAccountIri: string | null;
  agentOwnerEOAAccountIri: string | null;

  agentAccountIri: string | null;

  a2aProtocolDescriptorIri: string | null;
  a2aServiceUrl: string | null;
  a2aProtocolVersion: string | null;
  a2aJson: string | null;
  a2aSkills: string[];

  mcpProtocolDescriptorIri: string | null;
  mcpServiceUrl: string | null;
  mcpProtocolVersion: string | null;
  mcpJson: string | null;
  mcpSkills: string[];
};

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
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
    console.log('[graphdb] sparql (first 30 lines):\n' + sparql.split('\n').slice(0, 30).join('\n'));
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
    'https://agentictrust.io/ontology/erc8004#SmartAgent',
    'https://agentictrust.io/ontology/erc8004#AIAgent8004',
    'https://agentictrust.io/ontology/hol#AIAgentHOL',
    'https://agentictrust.io/ontology/nanda#AIAgentNanda',
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
    agentId8004?: number | null;
    did8004?: string | null;
    uaid?: string | null;
    uaid_in?: string[] | null;
    agentName_contains?: string | null;
    isSmartAgent?: boolean | null;
    hasA2a?: boolean | null;
    hasAssertions?: boolean | null;
    hasFeedback8004?: boolean | null;
    hasValidation8004?: boolean | null;
  } | null;
  first?: number | null;
  skip?: number | null;
  orderBy?: 'agentId8004' | 'agentName' | 'uaid' | null;
  orderDirection?: 'ASC' | 'DESC' | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<{ rows: KbAgentRow[]; total: number; hasMore: boolean }> {
  const where = args.where ?? {};
  const first = clampInt(args.first, 1, 500, 20);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);

  const chainId = where.chainId != null ? clampInt(where.chainId, 1, 1_000_000_000, 0) : null;
  const graphs = chainId ? [`<${chainContext(chainId)}>`] : null;

  // Filtering: if agentId8004 is provided without chainId, require did8004 instead.
  let did8004Filter: string | null = typeof where.did8004 === 'string' && where.did8004.trim() ? where.did8004.trim() : null;
  if (!did8004Filter && chainId && where.agentId8004 != null && Number.isFinite(where.agentId8004)) {
    did8004Filter = did8004FromParts(chainId, clampInt(where.agentId8004, 0, 10_000_000_000, 0));
  }

  const agentNameContains =
    typeof where.agentName_contains === 'string' && where.agentName_contains.trim() ? where.agentName_contains.trim() : null;

  const uaidFilter = typeof where.uaid === 'string' && where.uaid.trim() ? where.uaid.trim() : null;
  const uaidIn =
    Array.isArray(where.uaid_in) && where.uaid_in.length
      ? where.uaid_in.map((u) => String(u ?? '').trim()).filter(Boolean)
      : null;

  const orderBy = args.orderBy ?? 'agentId8004';
  const orderDirection = (args.orderDirection ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const orderBaseExpr =
    orderBy === 'agentName'
      ? 'LCASE(STR(?agentName))'
      : orderBy === 'uaid'
        ? 'LCASE(STR(?uaid))'
        : '?agentId8004';
  const orderExpr = orderDirection === 'ASC' ? `ASC(${orderBaseExpr})` : `DESC(${orderBaseExpr})`;

  const graphClause = graphs
    ? `VALUES ?g { ${graphs.join(' ')} }\n  GRAPH ?g {`
    : `GRAPH ?g {\n    FILTER(STRSTARTS(STR(?g), "https://www.agentictrust.io/graph/data/subgraph/"))`;
  const graphClose = graphs ? `  }` : `}`;

  const filters: string[] = [];
  if (did8004Filter) {
    filters.push(`?did8004 = "${did8004Filter}"`);
  }
  if (uaidFilter) {
    const escaped = uaidFilter.replace(/"/g, '\\"');
    filters.push(`?uaid = "${escaped}"`);
  }
  if (uaidIn && uaidIn.length) {
    const values = uaidIn.map((u) => `"${u.replace(/"/g, '\\"')}"`).join(' ');
    filters.push(`?uaid IN (${values})`);
  }
  if (agentNameContains) {
    const escaped = agentNameContains.replace(/"/g, '\\"');
    filters.push(`CONTAINS(LCASE(STR(?agentName)), LCASE("${escaped}"))`);
  }
  if (where.isSmartAgent === true) {
    filters.push(`EXISTS { ?agent a erc8004:SmartAgent }`);
  }
  if (where.isSmartAgent === false) {
    filters.push(`NOT EXISTS { ?agent a erc8004:SmartAgent }`);
  }
  if (where.hasA2a === true) {
    filters.push(
      `EXISTS { ?agent core:hasIdentity ?_id . ?_id core:hasDescriptor ?_d . ?_d core:assembledFromMetadata ?_pd . ?_pd a core:A2AProtocolDescriptor . }`,
    );
  }
  if (where.hasA2a === false) {
    filters.push(
      `NOT EXISTS { ?agent core:hasIdentity ?_id . ?_id core:hasDescriptor ?_d . ?_d core:assembledFromMetadata ?_pd . ?_pd a core:A2AProtocolDescriptor . }`,
    );
  }

  // If we're filtering to only agents-with-assertions, anchor the query on the assertion edges
  // instead of using EXISTS filters (much faster in GraphDB).
  const requiredPatterns: string[] = [];
  const hasFeedbackExpr = `EXISTS { ?agent core:hasReputationAssertion ?_fb . }`;
  const hasValidationExpr = `EXISTS { ?agent core:hasVerificationAssertion ?_vr . }`;

  if (where.hasFeedback8004 === true && where.hasValidation8004 === true) {
    requiredPatterns.push('    ?agent core:hasReputationAssertion ?_fbReq .');
    requiredPatterns.push('    ?agent core:hasVerificationAssertion ?_vrReq .');
  } else if (where.hasFeedback8004 === true) {
    requiredPatterns.push('    ?agent core:hasReputationAssertion ?_fbReq .');
  } else if (where.hasValidation8004 === true) {
    requiredPatterns.push('    ?agent core:hasVerificationAssertion ?_vrReq .');
  } else if (where.hasAssertions === true) {
    requiredPatterns.push('    { ?agent core:hasReputationAssertion ?_fbReq . } UNION { ?agent core:hasVerificationAssertion ?_vrReq . }');
  }

  // Keep the negative filters as EXISTS; these inherently need a NOT EXISTS check.
  if (where.hasAssertions === false) filters.push(`NOT (${hasFeedbackExpr} || ${hasValidationExpr})`);
  if (where.hasFeedback8004 === false) filters.push(`NOT ${hasFeedbackExpr}`);
  if (where.hasValidation8004 === false) filters.push(`NOT ${hasValidationExpr}`);

  // Phase 1: page query (agent ids + graph context only).
  const pageSparql = [
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT ?g ?agent ?uaid ?agentName ?did8004 ?agentId8004 WHERE {',
    `  ${graphClause}`,
    '    ?agent a core:AIAgent .',
    ...requiredPatterns,
    '    OPTIONAL { ?agent core:uaid ?uaid . }',
    '    OPTIONAL { ?agent core:agentName ?agentName . }',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identity8004 .',
    '      ?identity8004 a erc8004:AgentIdentity8004 ; core:hasIdentifier ?ident8004 .',
    '      ?ident8004 core:protocolIdentifier ?did8004 .',
    '      BIND(xsd:integer(REPLACE(STR(?did8004), "^did:8004:[0-9]+:", "")) AS ?agentId8004)',
    '    }',
    filters.length ? `    FILTER(${filters.join(' && ')})` : '',
    `  ${graphClose}`,
    '}',
    `ORDER BY ${orderExpr}`,
    `LIMIT ${first + 1}`,
    `OFFSET ${skip}`,
    '',
  ]
    .filter(Boolean)
    .join('\n');

  const pageBindings = await runGraphdbQuery(pageSparql, graphdbCtx, 'kbAgentsQuery.page');
  const pagePairs: Array<{ g: string; agent: string }> = [];
  const seenAgents = new Set<string>();
  for (const b of pageBindings) {
    const g = asString((b as any)?.g);
    const agent = asString((b as any)?.agent);
    if (!g || !agent) continue;
    if (seenAgents.has(agent)) continue;
    seenAgents.add(agent);
    pagePairs.push({ g, agent });
  }
  const hasMore = pagePairs.length > first;
  const trimmedPairs = hasMore ? pagePairs.slice(0, first) : pagePairs;

  // Phase 2: hydrate heavy fields for the page only.
  const valuesPairs = trimmedPairs.map((p) => `(<${p.g}> <${p.agent}>)`).join(' ');
  const rowsBindings = trimmedPairs.length
    ? await runGraphdbQuery(
        [
          'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
          'PREFIX core: <https://agentictrust.io/ontology/core#>',
          'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
          'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
          'PREFIX ens: <https://agentictrust.io/ontology/ens#>',
          '',
          'SELECT',
          '  ?agent',
          '  (SAMPLE(?uaid) AS ?uaid)',
          '  (SAMPLE(?agentName) AS ?agentName)',
          '  (SAMPLE(?feedbackAssertionCount8004) AS ?feedbackAssertionCount8004)',
          '  (SAMPLE(?validationAssertionCount8004) AS ?validationAssertionCount8004)',
          '  (SAMPLE(?createdAtBlock) AS ?createdAtBlock)',
          '  (SAMPLE(?createdAtTime) AS ?createdAtTime)',
          '  (SAMPLE(?updatedAtTime) AS ?updatedAtTime)',
          '  (SAMPLE(?identity8004) AS ?identity8004)',
          '  (SAMPLE(?did8004) AS ?did8004)',
          '  (SAMPLE(?agentId8004) AS ?agentId8004)',
          '  (SAMPLE(?identityEns) AS ?identityEns)',
          '  (SAMPLE(?didEns) AS ?didEns)',
          '  (SAMPLE(?identityOwnerAccount) AS ?identityOwnerAccount)',
          '  (SAMPLE(?identityWalletAccount) AS ?identityWalletAccount)',
          '  (SAMPLE(?identityOperatorAccount) AS ?identityOperatorAccount)',
          '  (SAMPLE(?agentOwnerAccount) AS ?agentOwnerAccount)',
          '  (SAMPLE(?agentOperatorAccount) AS ?agentOperatorAccount)',
          '  (SAMPLE(?agentWalletAccount) AS ?agentWalletAccount)',
          '  (SAMPLE(?agentOwnerEOAAccount) AS ?agentOwnerEOAAccount)',
          '  (SAMPLE(?agentAccount) AS ?agentAccount)',
          '  (SAMPLE(?identity8004Descriptor) AS ?identity8004Descriptor)',
          '  (SAMPLE(?registrationJson) AS ?registrationJson)',
          '  (SAMPLE(?onchainMetadataJson) AS ?onchainMetadataJson)',
          '  (SAMPLE(?registeredBy) AS ?registeredBy)',
          '  (SAMPLE(?registryNamespace) AS ?registryNamespace)',
          '  (SAMPLE(?pdA2a) AS ?pdA2a)',
          '  (SAMPLE(?a2aServiceUrl) AS ?a2aServiceUrl)',
          '  (SAMPLE(?a2aProtocolVersion) AS ?a2aProtocolVersion)',
          '  (SAMPLE(?a2aJson) AS ?a2aJson)',
          '  (GROUP_CONCAT(DISTINCT STR(?a2aSkill); separator=" ") AS ?a2aSkills)',
          '  (SAMPLE(?pdMcp) AS ?pdMcp)',
          '  (SAMPLE(?mcpServiceUrl) AS ?mcpServiceUrl)',
          '  (SAMPLE(?mcpProtocolVersion) AS ?mcpProtocolVersion)',
          '  (SAMPLE(?mcpJson) AS ?mcpJson)',
          '  (GROUP_CONCAT(DISTINCT STR(?mcpSkill); separator=" ") AS ?mcpSkills)',
          '  (GROUP_CONCAT(DISTINCT STR(?agentType); separator=" ") AS ?agentTypes)',
          'WHERE {',
          `  VALUES (?g ?agent) { ${valuesPairs} }`,
          '  GRAPH ?g {',
          '    ?agent a core:AIAgent .',
          '    OPTIONAL { ?agent core:uaid ?uaid . }',
          '    OPTIONAL { ?agent core:agentName ?agentName . }',
          '    OPTIONAL { ?agent a ?agentType . }',
            '    OPTIONAL { ?agent erc8004:feedbackAssertionCount8004 ?feedbackAssertionCount8004 . }',
            '    OPTIONAL { ?agent erc8004:validationAssertionCount8004 ?validationAssertionCount8004 . }',
          '    OPTIONAL {',
          '      ?record a erc8004:SubgraphIngestRecord ;',
          '              erc8004:recordsEntity ?agent ;',
          '              erc8004:subgraphEntityKind "agents" .',
          '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?createdAtBlock . }',
          '      OPTIONAL { ?record erc8004:subgraphTimestamp ?updatedAtTime . }',
          '      OPTIONAL { ?record erc8004:subgraphCursorValue ?cursorRaw . }',
          '      BIND(xsd:integer(?cursorRaw) AS ?createdAtTime)',
          '    }',
          '    OPTIONAL {',
          '      ?agent core:hasIdentity ?identity8004 .',
          '      ?identity8004 a erc8004:AgentIdentity8004 ;',
          '                    core:hasIdentifier ?ident8004 ;',
          '                    core:hasDescriptor ?desc8004 .',
          '      ?ident8004 core:protocolIdentifier ?did8004 .',
          '      BIND(xsd:integer(REPLACE(STR(?did8004), "^did:8004:[0-9]+:", "")) AS ?agentId8004)',
          '      BIND(?desc8004 AS ?identity8004Descriptor)',
          '      OPTIONAL { ?desc8004 core:json ?registrationJson . }',
          '      OPTIONAL { ?desc8004 erc8004:onchainMetadataJson ?onchainMetadataJson . }',
          '      OPTIONAL { ?desc8004 erc8004:registeredBy ?registeredBy . }',
          '      OPTIONAL { ?desc8004 erc8004:registryNamespace ?registryNamespace . }',
          '      OPTIONAL {',
          '        ?desc8004 core:assembledFromMetadata ?pdA2a .',
          '        ?pdA2a a core:A2AProtocolDescriptor ;',
          '               core:serviceUrl ?a2aServiceUrl .',
          '        OPTIONAL { ?pdA2a core:protocolVersion ?a2aProtocolVersion . }',
          '        OPTIONAL { ?pdA2a core:json ?a2aJson . }',
          '        OPTIONAL { ?pdA2a core:hasSkill ?a2aSkill . }',
          '      }',
          '      OPTIONAL {',
          '        ?desc8004 core:assembledFromMetadata ?pdMcp .',
          '        ?pdMcp a core:MCPProtocolDescriptor ;',
          '              core:serviceUrl ?mcpServiceUrl .',
          '        OPTIONAL { ?pdMcp core:protocolVersion ?mcpProtocolVersion . }',
          '        OPTIONAL { ?pdMcp core:json ?mcpJson . }',
          '        OPTIONAL { ?pdMcp core:hasSkill ?mcpSkill . }',
          '      }',
          '      OPTIONAL { ?identity8004 erc8004:hasOwnerAccount ?identityOwnerAccount . }',
          '      OPTIONAL { ?identity8004 erc8004:hasWalletAccount ?identityWalletAccount . }',
          '      OPTIONAL { ?identity8004 erc8004:hasOperatorAccount ?identityOperatorAccount . }',
          '    }',
          '    OPTIONAL {',
          '      ?agent a erc8004:SmartAgent ;',
          '             erc8004:hasAgentAccount ?agentAccount .',
          '    }',
          '    OPTIONAL { ?agent erc8004:agentOwnerAccount ?agentOwnerAccount . }',
          '    OPTIONAL { ?agent erc8004:agentOperatorAccount ?agentOperatorAccount . }',
          '    OPTIONAL { ?agent erc8004:agentWalletAccount ?agentWalletAccount . }',
          '    OPTIONAL { ?agent erc8004:agentOwnerEOAAccount ?agentOwnerEOAAccount . }',
          '    OPTIONAL {',
          '      ?agent core:hasIdentity ?identityEns .',
          '      ?identityEns a ens:EnsIdentity ;',
          '                  core:hasIdentifier ?ensIdent .',
          '      ?ensIdent core:protocolIdentifier ?didEns .',
          '    }',
          '  }',
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
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT (COUNT(DISTINCT ?agent) AS ?count) WHERE {',
    `  ${graphClause}`,
    '    ?agent a core:AIAgent .',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identity8004 .',
    '      ?identity8004 a erc8004:AgentIdentity8004 ;',
    '                    core:hasIdentifier ?ident8004 .',
    '      ?ident8004 core:protocolIdentifier ?did8004 .',
    '    }',
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
      agentTypes: pickAgentTypesFromRow(typeIris),
      feedbackAssertionCount8004: asNumber(b?.feedbackAssertionCount8004),
      validationAssertionCount8004: asNumber(b?.validationAssertionCount8004),
      createdAtBlock: asNumber(b?.createdAtBlock),
      createdAtTime: asNumber(b?.createdAtTime),
      updatedAtTime: asNumber(b?.updatedAtTime),
      identity8004Iri: asString(b?.identity8004),
      did8004: asString(b?.did8004),
      agentId8004: asNumber(b?.agentId8004),
      identity8004DescriptorIri: asString(b?.identity8004Descriptor),
      identity8004RegistrationJson: asString(b?.registrationJson),
      identity8004OnchainMetadataJson: asString(b?.onchainMetadataJson),
      identity8004RegisteredBy: asString(b?.registeredBy),
      identity8004RegistryNamespace: asString(b?.registryNamespace),
      identityEnsIri: asString(b?.identityEns),
      didEns: asString(b?.didEns),
      identityOwnerAccountIri: asString(b?.identityOwnerAccount),
      identityWalletAccountIri: asString(b?.identityWalletAccount),
      identityOperatorAccountIri: asString(b?.identityOperatorAccount),

      agentOwnerAccountIri: asString(b?.agentOwnerAccount),
      agentOperatorAccountIri: asString(b?.agentOperatorAccount),
      agentWalletAccountIri: asString(b?.agentWalletAccount),
      agentOwnerEOAAccountIri: asString(b?.agentOwnerEOAAccount),

      agentAccountIri: asString(b?.agentAccount),

      a2aProtocolDescriptorIri: asString(b?.pdA2a),
      a2aServiceUrl: asString(b?.a2aServiceUrl),
      a2aProtocolVersion: asString(b?.a2aProtocolVersion),
      a2aJson: asString(b?.a2aJson),
      a2aSkills: splitConcat(asString(b?.a2aSkills)),

      mcpProtocolDescriptorIri: asString(b?.pdMcp),
      mcpServiceUrl: asString(b?.mcpServiceUrl),
      mcpProtocolVersion: asString(b?.mcpProtocolVersion),
      mcpJson: asString(b?.mcpJson),
      mcpSkills: splitConcat(asString(b?.mcpSkills)),
    };
  });

  const byIri = new Map(rows.map((r) => [r.iri, r]));
  const ordered = trimmedPairs.map((p) => byIri.get(p.agent)).filter((x): x is KbAgentRow => Boolean(x));

  return { rows: ordered, total: Number.isFinite(total) ? total : 0, hasMore };
}

export async function kbOwnedAgentsQuery(args: {
  chainId: number;
  ownerAddress: string;
  first?: number | null;
  skip?: number | null;
  orderBy?: 'agentId8004' | 'agentName' | 'uaid' | null;
  orderDirection?: 'ASC' | 'DESC' | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<{ rows: KbAgentRow[]; total: number; hasMore: boolean }> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const ownerAddress = typeof args.ownerAddress === 'string' ? args.ownerAddress.trim() : '';
  const ownerIri = ownerAddress ? accountIriFromAddress(chainId, ownerAddress) : '';

  const first = clampInt(args.first, 1, 500, 20);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);

  const orderBy = args.orderBy ?? 'agentId8004';
  const orderDirection = (args.orderDirection ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const orderBaseExpr =
    orderBy === 'agentName'
      ? 'LCASE(STR(?agentName))'
      : orderBy === 'uaid'
        ? 'LCASE(STR(?uaid))'
        : '?agentId8004';
  const orderExpr = orderDirection === 'ASC' ? `ASC(${orderBaseExpr})` : `DESC(${orderBaseExpr})`;

  const graphs = [`<${chainContext(chainId)}>`];
  const graphClause = `VALUES ?g { ${graphs.join(' ')} }\n  GRAPH ?g {`;
  const graphClose = `  }`;

  const filters: string[] = [];
  if (!ownerIri) return { rows: [], total: 0, hasMore: false };
  // Match either:
  // - identity hasOwnerAccount directly equals the EOA account, OR
  // - identity hasOwnerAccount is a SmartAccount whose eth:hasEOAOwner equals the EOA account.
  filters.push(`(?ownerAccount = <${ownerIri}> || EXISTS { ?ownerAccount eth:hasEOAOwner <${ownerIri}> })`);

  const sparql = [
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX ens: <https://agentictrust.io/ontology/ens#>',
    '',
    'SELECT',
    '  ?agent',
    '  (SAMPLE(?uaid) AS ?uaid)',
    '  (SAMPLE(?agentName) AS ?agentName)',
    '  (SAMPLE(?feedbackAssertionCount8004) AS ?feedbackAssertionCount8004)',
    '  (SAMPLE(?validationAssertionCount8004) AS ?validationAssertionCount8004)',
    '  (SAMPLE(?createdAtBlock) AS ?createdAtBlock)',
    '  (SAMPLE(?createdAtTime) AS ?createdAtTime)',
    '  (SAMPLE(?updatedAtTime) AS ?updatedAtTime)',
    '  (SAMPLE(?identity8004) AS ?identity8004)',
    '  (SAMPLE(?did8004) AS ?did8004)',
    '  (SAMPLE(?agentId8004) AS ?agentId8004)',
    '  (SAMPLE(?identityEns) AS ?identityEns)',
    '  (SAMPLE(?didEns) AS ?didEns)',
    '  (SAMPLE(?identityOwnerAccount) AS ?identityOwnerAccount)',
    '  (SAMPLE(?identityWalletAccount) AS ?identityWalletAccount)',
    '  (SAMPLE(?identityOperatorAccount) AS ?identityOperatorAccount)',
    '  (SAMPLE(?agentOwnerAccount) AS ?agentOwnerAccount)',
    '  (SAMPLE(?agentOperatorAccount) AS ?agentOperatorAccount)',
    '  (SAMPLE(?agentWalletAccount) AS ?agentWalletAccount)',
    '  (SAMPLE(?agentOwnerEOAAccount) AS ?agentOwnerEOAAccount)',
    '  (SAMPLE(?agentAccount) AS ?agentAccount)',
    '  (SAMPLE(?identity8004Descriptor) AS ?identity8004Descriptor)',
    '  (SAMPLE(?registrationJson) AS ?registrationJson)',
    '  (SAMPLE(?onchainMetadataJson) AS ?onchainMetadataJson)',
    '  (SAMPLE(?registeredBy) AS ?registeredBy)',
    '  (SAMPLE(?registryNamespace) AS ?registryNamespace)',
    '  (SAMPLE(?pdA2a) AS ?pdA2a)',
    '  (SAMPLE(?a2aServiceUrl) AS ?a2aServiceUrl)',
    '  (SAMPLE(?a2aProtocolVersion) AS ?a2aProtocolVersion)',
    '  (SAMPLE(?a2aJson) AS ?a2aJson)',
    '  (GROUP_CONCAT(DISTINCT STR(?a2aSkill); separator=" ") AS ?a2aSkills)',
    '  (SAMPLE(?pdMcp) AS ?pdMcp)',
    '  (SAMPLE(?mcpServiceUrl) AS ?mcpServiceUrl)',
    '  (SAMPLE(?mcpProtocolVersion) AS ?mcpProtocolVersion)',
    '  (SAMPLE(?mcpJson) AS ?mcpJson)',
    '  (GROUP_CONCAT(DISTINCT STR(?mcpSkill); separator=" ") AS ?mcpSkills)',
    '  (GROUP_CONCAT(DISTINCT STR(?agentType); separator=" ") AS ?agentTypes)',
    'WHERE {',
    `  ${graphClause}`,
    '    ?agent a core:AIAgent .',
    '    OPTIONAL { ?agent core:uaid ?uaid . }',
    '    OPTIONAL { ?agent core:agentName ?agentName . }',
    '    OPTIONAL { ?agent a ?agentType . }',
    '    OPTIONAL { ?agent erc8004:feedbackAssertionCount8004 ?feedbackAssertionCount8004 . }',
    '    OPTIONAL { ?agent erc8004:validationAssertionCount8004 ?validationAssertionCount8004 . }',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord ;',
    '              erc8004:recordsEntity ?agent ;',
    '              erc8004:subgraphEntityKind "agents" .',
    '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?createdAtBlock . }',
    '      OPTIONAL { ?record erc8004:subgraphTimestamp ?updatedAtTime . }',
    '      OPTIONAL { ?record erc8004:subgraphCursorValue ?cursorRaw . }',
    '      BIND(xsd:integer(?cursorRaw) AS ?createdAtTime)',
    '    }',
    '',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identity8004 .',
    '      ?identity8004 a erc8004:AgentIdentity8004 ;',
    '                    core:hasIdentifier ?ident8004 ;',
    '                    core:hasDescriptor ?desc8004 .',
    '      ?ident8004 core:protocolIdentifier ?did8004 .',
    '      BIND(xsd:integer(REPLACE(STR(?did8004), "^did:8004:[0-9]+:", "")) AS ?agentId8004)',
    '      BIND(?desc8004 AS ?identity8004Descriptor)',
    '      OPTIONAL { ?desc8004 core:json ?registrationJson . }',
    '      OPTIONAL { ?desc8004 erc8004:onchainMetadataJson ?onchainMetadataJson . }',
    '      OPTIONAL { ?desc8004 erc8004:registeredBy ?registeredBy . }',
    '      OPTIONAL { ?desc8004 erc8004:registryNamespace ?registryNamespace . }',
    '      OPTIONAL {',
    '        ?desc8004 core:assembledFromMetadata ?pdA2a .',
    '        ?pdA2a a core:A2AProtocolDescriptor ;',
    '               core:serviceUrl ?a2aServiceUrl .',
    '        OPTIONAL { ?pdA2a core:protocolVersion ?a2aProtocolVersion . }',
    '        OPTIONAL { ?pdA2a core:json ?a2aJson . }',
    '        OPTIONAL { ?pdA2a core:hasSkill ?a2aSkill . }',
    '      }',
    '      OPTIONAL {',
    '        ?desc8004 core:assembledFromMetadata ?pdMcp .',
    '        ?pdMcp a core:MCPProtocolDescriptor ;',
    '              core:serviceUrl ?mcpServiceUrl .',
    '        OPTIONAL { ?pdMcp core:protocolVersion ?mcpProtocolVersion . }',
    '        OPTIONAL { ?pdMcp core:json ?mcpJson . }',
    '        OPTIONAL { ?pdMcp core:hasSkill ?mcpSkill . }',
    '      }',
    '      OPTIONAL { ?identity8004 erc8004:hasOwnerAccount ?identityOwnerAccount . }',
    '      OPTIONAL { ?identity8004 erc8004:hasWalletAccount ?identityWalletAccount . }',
    '      OPTIONAL { ?identity8004 erc8004:hasOperatorAccount ?identityOperatorAccount . }',
    '    }',
    '',
    '    OPTIONAL {',
    '      ?agent a erc8004:SmartAgent ;',
    '             erc8004:hasAgentAccount ?agentAccount .',
    '    }',
    '',
    '    OPTIONAL { ?agent erc8004:agentOwnerAccount ?agentOwnerAccount . }',
    '    OPTIONAL { ?agent erc8004:agentOperatorAccount ?agentOperatorAccount . }',
    '    OPTIONAL { ?agent erc8004:agentWalletAccount ?agentWalletAccount . }',
    '    OPTIONAL { ?agent erc8004:agentOwnerEOAAccount ?agentOwnerEOAAccount . }',
    '',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identityEns .',
    '      ?identityEns a ens:EnsIdentity ;',
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
    feedbackAssertionCount8004: asNumber(b?.feedbackAssertionCount8004),
    validationAssertionCount8004: asNumber(b?.validationAssertionCount8004),
    createdAtBlock: asNumber(b?.createdAtBlock),
    createdAtTime: asNumber(b?.createdAtTime),
    updatedAtTime: asNumber(b?.updatedAtTime),
    identity8004Iri: asString(b?.identity8004),
    did8004: asString(b?.did8004),
    agentId8004: asNumber(b?.agentId8004),
    identityEnsIri: asString(b?.identityEns),
    didEns: asString(b?.didEns),
    identityOwnerAccountIri: asString(b?.identityOwnerAccount),
    identityWalletAccountIri: asString(b?.identityWalletAccount),
    identityOperatorAccountIri: asString(b?.identityOperatorAccount),

    agentOwnerAccountIri: asString(b?.agentOwnerAccount),
    agentOperatorAccountIri: asString(b?.agentOperatorAccount),
    agentWalletAccountIri: asString(b?.agentWalletAccount),
    agentOwnerEOAAccountIri: asString(b?.agentOwnerEOAAccount),

    agentAccountIri: asString(b?.agentAccount),

    identity8004DescriptorIri: asString(b?.identity8004Descriptor),
    identity8004RegistrationJson: asString(b?.registrationJson),
    identity8004OnchainMetadataJson: asString(b?.onchainMetadataJson),
    identity8004RegisteredBy: asString(b?.registeredBy),
    identity8004RegistryNamespace: asString(b?.registryNamespace),

    a2aProtocolDescriptorIri: asString(b?.pdA2a),
    a2aServiceUrl: asString(b?.a2aServiceUrl),
    a2aProtocolVersion: asString(b?.a2aProtocolVersion),
    a2aJson: asString(b?.a2aJson),
    a2aSkills: splitConcat(asString(b?.a2aSkills)),

    mcpProtocolDescriptorIri: asString(b?.pdMcp),
    mcpServiceUrl: asString(b?.mcpServiceUrl),
    mcpProtocolVersion: asString(b?.mcpProtocolVersion),
    mcpJson: asString(b?.mcpJson),
    mcpSkills: splitConcat(asString(b?.mcpSkills)),

    agentTypes: splitConcat(asString(b?.agentTypes)),
  }));

  const hasMore = rows.length > first;
  const trimmed = hasMore ? rows.slice(0, first) : rows;

  // Total count (distinct agents) with same filter
  const countSparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
    '',
    'SELECT (COUNT(DISTINCT ?agent) AS ?count) WHERE {',
    `  ${graphClause}`,
    '    ?agent a core:AIAgent ; core:hasIdentity ?identity8004 .',
    '    ?identity8004 a erc8004:AgentIdentity8004 ; erc8004:hasOwnerAccount ?ownerAccount .',
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
  orderBy?: 'agentId8004' | 'agentName' | 'uaid' | null;
  orderDirection?: 'ASC' | 'DESC' | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<{ rows: KbAgentRow[]; total: number; hasMore: boolean }> {
  const ownerAddress = typeof args.ownerAddress === 'string' ? args.ownerAddress.trim().toLowerCase() : '';
  if (!ownerAddress) return { rows: [], total: 0, hasMore: false };

  const first = clampInt(args.first, 1, 500, 20);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);

  const orderBy = args.orderBy ?? 'agentId8004';
  const orderDirection = (args.orderDirection ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const orderBaseExpr =
    orderBy === 'agentName'
      ? 'LCASE(STR(?agentName))'
      : orderBy === 'uaid'
        ? 'LCASE(STR(?uaid))'
        : '?agentId8004';
  const orderExpr = orderDirection === 'ASC' ? `ASC(${orderBaseExpr})` : `DESC(${orderBaseExpr})`;

  const sparql = [
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX ens: <https://agentictrust.io/ontology/ens#>',
    '',
    'SELECT',
    '  ?agent',
    '  (SAMPLE(?uaid) AS ?uaid)',
    '  (SAMPLE(?agentName) AS ?agentName)',
    '  (SAMPLE(?feedbackAssertionCount8004) AS ?feedbackAssertionCount8004)',
    '  (SAMPLE(?validationAssertionCount8004) AS ?validationAssertionCount8004)',
    '  (SAMPLE(?createdAtBlock) AS ?createdAtBlock)',
    '  (SAMPLE(?createdAtTime) AS ?createdAtTime)',
    '  (SAMPLE(?updatedAtTime) AS ?updatedAtTime)',
    '  (SAMPLE(?identity8004) AS ?identity8004)',
    '  (SAMPLE(?did8004) AS ?did8004)',
    '  (SAMPLE(?agentId8004) AS ?agentId8004)',
    '  (SAMPLE(?identityEns) AS ?identityEns)',
    '  (SAMPLE(?didEns) AS ?didEns)',
    '  (SAMPLE(?identityOwnerAccount) AS ?identityOwnerAccount)',
    '  (SAMPLE(?identityWalletAccount) AS ?identityWalletAccount)',
    '  (SAMPLE(?identityOperatorAccount) AS ?identityOperatorAccount)',
    '  (SAMPLE(?agentOwnerAccount) AS ?agentOwnerAccount)',
    '  (SAMPLE(?agentOperatorAccount) AS ?agentOperatorAccount)',
    '  (SAMPLE(?agentWalletAccount) AS ?agentWalletAccount)',
    '  (SAMPLE(?agentOwnerEOAAccount) AS ?agentOwnerEOAAccount)',
    '  (SAMPLE(?agentAccount) AS ?agentAccount)',
    '  (SAMPLE(?identity8004Descriptor) AS ?identity8004Descriptor)',
    '  (SAMPLE(?registrationJson) AS ?registrationJson)',
    '  (SAMPLE(?onchainMetadataJson) AS ?onchainMetadataJson)',
    '  (SAMPLE(?registeredBy) AS ?registeredBy)',
    '  (SAMPLE(?registryNamespace) AS ?registryNamespace)',
    '  (SAMPLE(?pdA2a) AS ?pdA2a)',
    '  (SAMPLE(?a2aServiceUrl) AS ?a2aServiceUrl)',
    '  (SAMPLE(?a2aProtocolVersion) AS ?a2aProtocolVersion)',
    '  (SAMPLE(?a2aJson) AS ?a2aJson)',
    '  (GROUP_CONCAT(DISTINCT STR(?a2aSkill); separator=" ") AS ?a2aSkills)',
    '  (SAMPLE(?pdMcp) AS ?pdMcp)',
    '  (SAMPLE(?mcpServiceUrl) AS ?mcpServiceUrl)',
    '  (SAMPLE(?mcpProtocolVersion) AS ?mcpProtocolVersion)',
    '  (SAMPLE(?mcpJson) AS ?mcpJson)',
    '  (GROUP_CONCAT(DISTINCT STR(?mcpSkill); separator=" ") AS ?mcpSkills)',
    '  (GROUP_CONCAT(DISTINCT STR(?agentType); separator=" ") AS ?agentTypes)',
    'WHERE {',
    '  GRAPH ?g {',
    '    FILTER(STRSTARTS(STR(?g), "https://www.agentictrust.io/graph/data/subgraph/"))',
    '    ?agent a core:AIAgent .',
    '    OPTIONAL { ?agent core:uaid ?uaid . }',
    '    OPTIONAL { ?agent core:agentName ?agentName . }',
    '    OPTIONAL { ?agent a ?agentType . }',
    '    OPTIONAL { ?agent erc8004:feedbackAssertionCount8004 ?feedbackAssertionCount8004 . }',
    '    OPTIONAL { ?agent erc8004:validationAssertionCount8004 ?validationAssertionCount8004 . }',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord ;',
    '              erc8004:recordsEntity ?agent ;',
    '              erc8004:subgraphEntityKind "agents" .',
    '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?createdAtBlock . }',
    '      OPTIONAL { ?record erc8004:subgraphTimestamp ?updatedAtTime . }',
    '      OPTIONAL { ?record erc8004:subgraphCursorValue ?cursorRaw . }',
    '      BIND(xsd:integer(?cursorRaw) AS ?createdAtTime)',
    '    }',
    '',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identity8004 .',
    '      ?identity8004 a erc8004:AgentIdentity8004 ;',
    '                    core:hasIdentifier ?ident8004 ;',
    '                    core:hasDescriptor ?desc8004 .',
    '      ?ident8004 core:protocolIdentifier ?did8004 .',
    '      BIND(xsd:integer(REPLACE(STR(?did8004), "^did:8004:[0-9]+:", "")) AS ?agentId8004)',
    '      BIND(?desc8004 AS ?identity8004Descriptor)',
    '      OPTIONAL { ?desc8004 core:json ?registrationJson . }',
    '      OPTIONAL { ?desc8004 erc8004:onchainMetadataJson ?onchainMetadataJson . }',
    '      OPTIONAL { ?desc8004 erc8004:registeredBy ?registeredBy . }',
    '      OPTIONAL { ?desc8004 erc8004:registryNamespace ?registryNamespace . }',
    '      OPTIONAL {',
    '        ?desc8004 core:assembledFromMetadata ?pdA2a .',
    '        ?pdA2a a core:A2AProtocolDescriptor ;',
    '               core:serviceUrl ?a2aServiceUrl .',
    '        OPTIONAL { ?pdA2a core:protocolVersion ?a2aProtocolVersion . }',
    '        OPTIONAL { ?pdA2a core:json ?a2aJson . }',
    '        OPTIONAL { ?pdA2a core:hasSkill ?a2aSkill . }',
    '      }',
    '      OPTIONAL {',
    '        ?desc8004 core:assembledFromMetadata ?pdMcp .',
    '        ?pdMcp a core:MCPProtocolDescriptor ;',
    '              core:serviceUrl ?mcpServiceUrl .',
    '        OPTIONAL { ?pdMcp core:protocolVersion ?mcpProtocolVersion . }',
    '        OPTIONAL { ?pdMcp core:json ?mcpJson . }',
    '        OPTIONAL { ?pdMcp core:hasSkill ?mcpSkill . }',
    '      }',
    '      OPTIONAL { ?identity8004 erc8004:hasOwnerAccount ?identityOwnerAccount . }',
    '      OPTIONAL { ?identity8004 erc8004:hasWalletAccount ?identityWalletAccount . }',
    '      OPTIONAL { ?identity8004 erc8004:hasOperatorAccount ?identityOperatorAccount . }',
    '    }',
    '',
    '    OPTIONAL { ?agent a erc8004:SmartAgent ; erc8004:hasAgentAccount ?agentAccount . }',
    '    OPTIONAL { ?agent erc8004:agentOwnerAccount ?agentOwnerAccount . }',
    '    OPTIONAL { ?agent erc8004:agentOperatorAccount ?agentOperatorAccount . }',
    '    OPTIONAL { ?agent erc8004:agentWalletAccount ?agentWalletAccount . }',
    '    OPTIONAL { ?agent erc8004:agentOwnerEOAAccount ?agentOwnerEOAAccount . }',
    '',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identityEns .',
    '      ?identityEns a ens:EnsIdentity ;',
    '                  core:hasIdentifier ?ensIdent .',
    '      ?ensIdent core:protocolIdentifier ?didEns .',
    '    }',
    '',
    // Ownership filter (address-based, across any chain):
    // - direct: identity owner account address matches
    // - indirect: identity owner account hasEOAOwner whose address matches
    '    FILTER(',
    `      EXISTS { ?identityOwnerAccount eth:accountAddress ?addr . FILTER(LCASE(STR(?addr)) = "${ownerAddress}") }`,
    `      || EXISTS { ?identityOwnerAccount eth:hasEOAOwner ?eoa . ?eoa eth:accountAddress ?addr2 . FILTER(LCASE(STR(?addr2)) = "${ownerAddress}") }`,
    '    )',
    '  }',
    '}',
    'GROUP BY ?agent',
    `ORDER BY ${orderExpr}`,
    `LIMIT ${first + 1}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const bindings = await runGraphdbQuery(sparql, graphdbCtx, 'kbOwnedAgentsAllChainsQuery');
  const rows = bindings.map((b) => ({
    iri: asString(b?.agent) ?? '',
    uaid: asString(b?.uaid),
    agentName: asString(b?.agentName),
    feedbackAssertionCount8004: asNumber(b?.feedbackAssertionCount8004),
    validationAssertionCount8004: asNumber(b?.validationAssertionCount8004),
    createdAtBlock: asNumber(b?.createdAtBlock),
    createdAtTime: asNumber(b?.createdAtTime),
    updatedAtTime: asNumber(b?.updatedAtTime),
    identity8004Iri: asString(b?.identity8004),
    did8004: asString(b?.did8004),
    agentId8004: asNumber(b?.agentId8004),
    identityEnsIri: asString(b?.identityEns),
    didEns: asString(b?.didEns),
    identityOwnerAccountIri: asString(b?.identityOwnerAccount),
    identityWalletAccountIri: asString(b?.identityWalletAccount),
    identityOperatorAccountIri: asString(b?.identityOperatorAccount),
    agentOwnerAccountIri: asString(b?.agentOwnerAccount),
    agentOperatorAccountIri: asString(b?.agentOperatorAccount),
    agentWalletAccountIri: asString(b?.agentWalletAccount),
    agentOwnerEOAAccountIri: asString(b?.agentOwnerEOAAccount),
    agentAccountIri: asString(b?.agentAccount),

    identity8004DescriptorIri: asString(b?.identity8004Descriptor),
    identity8004RegistrationJson: asString(b?.registrationJson),
    identity8004OnchainMetadataJson: asString(b?.onchainMetadataJson),
    identity8004RegisteredBy: asString(b?.registeredBy),
    identity8004RegistryNamespace: asString(b?.registryNamespace),

    a2aProtocolDescriptorIri: asString(b?.pdA2a),
    a2aServiceUrl: asString(b?.a2aServiceUrl),
    a2aProtocolVersion: asString(b?.a2aProtocolVersion),
    a2aJson: asString(b?.a2aJson),
    a2aSkills: splitConcat(asString(b?.a2aSkills)),

    mcpProtocolDescriptorIri: asString(b?.pdMcp),
    mcpServiceUrl: asString(b?.mcpServiceUrl),
    mcpProtocolVersion: asString(b?.mcpProtocolVersion),
    mcpJson: asString(b?.mcpJson),
    mcpSkills: splitConcat(asString(b?.mcpSkills)),

    agentTypes: splitConcat(asString(b?.agentTypes)),
  }));

  const hasMore = rows.length > first;
  const trimmed = hasMore ? rows.slice(0, first) : rows;

  const countSparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX eth: <https://agentictrust.io/ontology/eth#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT (COUNT(DISTINCT ?agent) AS ?count) WHERE {',
    '  GRAPH ?g {',
    '    FILTER(STRSTARTS(STR(?g), "https://www.agentictrust.io/graph/data/subgraph/"))',
    '    ?agent a core:AIAgent ; core:hasIdentity ?identity8004 .',
    '    ?identity8004 a erc8004:AgentIdentity8004 ; erc8004:hasOwnerAccount ?identityOwnerAccount .',
      '    OPTIONAL { ?agent erc8004:feedbackAssertionCount8004 ?feedbackAssertionCount8004 . }',
      '    OPTIONAL { ?agent erc8004:validationAssertionCount8004 ?validationAssertionCount8004 . }',
    '    FILTER(',
    `      EXISTS { ?identityOwnerAccount eth:accountAddress ?addr . FILTER(LCASE(STR(?addr)) = "${ownerAddress}") }`,
    `      || EXISTS { ?identityOwnerAccount eth:hasEOAOwner ?eoa . ?eoa eth:accountAddress ?addr2 . FILTER(LCASE(STR(?addr2)) = "${ownerAddress}") }`,
    '    )',
    '  }',
    '}',
    '',
  ].join('\n');

  const countBindings = await runGraphdbQuery(countSparql, graphdbCtx, 'kbOwnedAgentsAllChainsQuery.count');
  const total = clampInt(asNumber(countBindings?.[0]?.count), 0, 10_000_000_000, 0);

  return { rows: trimmed, total, hasMore };
}

export async function kbFeedbackIrisQuery(args: { chainId: number; first?: number | null; skip?: number | null }): Promise<string[]> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const first = clampInt(args.first, 1, 5000, 100);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const ctx = chainContext(chainId);
  const sparql = [
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    '',
    'SELECT ?feedback WHERE {',
    `  GRAPH <${ctx}> {`,
    '    ?feedback a erc8004:Feedback, prov:Entity .',
    '  }',
    '}',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');
  const rows = await runGraphdbQuery(sparql);
  return rows.map((b: any) => asString(b?.feedback)).filter((x): x is string => Boolean(x));
}

export type KbSubgraphRecord = {
  rawJson: string | null;
  txHash: string | null;
  blockNumber: number | null;
  timestamp: number | null;
};

export type KbFeedbackRow = {
  iri: string;
  agentDid8004: string | null;
  json: string | null;
  record: KbSubgraphRecord | null;
};

export async function kbFeedbacksQuery(args: {
  chainId: number;
  first?: number | null;
  skip?: number | null;
}): Promise<KbFeedbackRow[]> {
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
    '  ?feedback',
    '  (SAMPLE(?did8004) AS ?did8004)',
    '  (SAMPLE(?json) AS ?json)',
    '  (SAMPLE(?rawJson) AS ?rawJson)',
    '  (SAMPLE(?txHash) AS ?txHash)',
    '  (SAMPLE(?blockNumber) AS ?blockNumber)',
    '  (SAMPLE(?timestamp) AS ?timestamp)',
    'WHERE {',
    `  GRAPH <${ctx}> {`,
    '    ?agent core:hasReputationAssertion ?feedback .',
    '    OPTIONAL { ?feedback core:json ?json }',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;',
    '              erc8004:recordsEntity ?feedback .',
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
    'GROUP BY ?feedback',
    'ORDER BY DESC(STR(?timestamp)) DESC(STR(?feedback))',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const rows = await runGraphdbQuery(sparql);
  return rows
    .map((b: any) => {
      const iri = asString(b?.feedback);
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
      } satisfies KbFeedbackRow;
    })
    .filter((x): x is KbFeedbackRow => Boolean(x));
}

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
