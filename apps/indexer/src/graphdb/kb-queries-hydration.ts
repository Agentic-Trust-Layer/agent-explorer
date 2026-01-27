import { getGraphdbConfigFromEnv, queryGraphdb } from './graphdb-http.js';

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
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

function splitConcat(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function runGraphdbQuery(sparql: string): Promise<any[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const result = await queryGraphdb(baseUrl, repository, auth, sparql);
  return Array.isArray(result?.results?.bindings) ? result.results.bindings : [];
}

export type KbAgentHydratedRow = {
  did8004: string;
  agentIri: string;
  uaid: string | null;
  agentName: string | null;
  agentTypes: string[];
  identity8004Iri: string | null;
  identity8004DescriptorIri: string | null;
  registrationJson: string | null;
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
  identityEnsIri: string | null;
  didEns: string | null;
  ownerAccountIri: string | null;
  walletAccountIri: string | null;
  operatorAccountIri: string | null;
  smartAccountIri: string | null;
};

export async function kbHydrateAgentsByDid8004(args: { chainId: number; did8004List: string[] }): Promise<KbAgentHydratedRow[]> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const dids = Array.from(new Set((args.did8004List ?? []).map((d) => String(d ?? '').trim()).filter(Boolean)));
  if (!dids.length) return [];

  const values = dids.map((d) => `"${d.replace(/"/g, '\\"')}"`).join(' ');
  const ctx = chainContext(chainId);

  const sparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX ens: <https://agentictrust.io/ontology/ens#>',
    '',
    'SELECT',
    '  ?did8004',
    '  (SAMPLE(?agent) AS ?agent)',
    '  (SAMPLE(?uaid) AS ?uaid)',
    '  (SAMPLE(?agentName) AS ?agentName)',
    '  (GROUP_CONCAT(DISTINCT STR(?agentType); separator=" ") AS ?agentTypes)',
    '  (SAMPLE(?identity8004) AS ?identity8004)',
    '  (SAMPLE(?desc8004) AS ?desc8004)',
    '  (SAMPLE(?registrationJson) AS ?registrationJson)',
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
    '  (SAMPLE(?identityEns) AS ?identityEns)',
    '  (SAMPLE(?didEns) AS ?didEns)',
    '  (SAMPLE(?ownerAccount) AS ?ownerAccount)',
    '  (SAMPLE(?walletAccount) AS ?walletAccount)',
    '  (SAMPLE(?operatorAccount) AS ?operatorAccount)',
    '  (SAMPLE(?smartAccount) AS ?smartAccount)',
    'WHERE {',
    `  GRAPH <${ctx}> {`,
    `    VALUES ?did8004 { ${values} }`,
    '    ?agent a core:AIAgent .',
    '    OPTIONAL { ?agent core:uaid ?uaid }',
    '    OPTIONAL { ?agent core:agentName ?agentName }',
    '    OPTIONAL { ?agent a ?agentType }',
    '    ?agent core:hasIdentity ?identity8004 .',
    '    ?identity8004 a erc8004:AgentIdentity8004 ;',
    '              core:hasIdentifier ?ident8004 .',
    '    ?ident8004 core:protocolIdentifier ?did8004 .',
    '    OPTIONAL {',
    '      ?identity8004 core:hasDescriptor ?desc8004 .',
    '      OPTIONAL { ?desc8004 core:json ?registrationJson }',
    '      OPTIONAL {',
    '        ?desc8004 core:assembledFromMetadata ?pdA2a .',
    '        ?pdA2a a core:A2AProtocolDescriptor ; core:serviceUrl ?a2aServiceUrl .',
    '        OPTIONAL { ?pdA2a core:protocolVersion ?a2aProtocolVersion }',
    '        OPTIONAL { ?pdA2a core:json ?a2aJson }',
    '        OPTIONAL { ?pdA2a core:hasSkill ?a2aSkill }',
    '      }',
    '      OPTIONAL {',
    '        ?desc8004 core:assembledFromMetadata ?pdMcp .',
    '        ?pdMcp a core:MCPProtocolDescriptor ; core:serviceUrl ?mcpServiceUrl .',
    '        OPTIONAL { ?pdMcp core:protocolVersion ?mcpProtocolVersion }',
    '        OPTIONAL { ?pdMcp core:json ?mcpJson }',
    '        OPTIONAL { ?pdMcp core:hasSkill ?mcpSkill }',
    '      }',
    '    }',
    '    OPTIONAL { ?identity8004 erc8004:hasOwnerAccount ?ownerAccount }',
    '    OPTIONAL { ?identity8004 erc8004:hasWalletAccount ?walletAccount }',
    '    OPTIONAL { ?identity8004 erc8004:hasOperatorAccount ?operatorAccount }',
    '    OPTIONAL { ?agent a erc8004:SmartAgent ; erc8004:hasSmartAccount ?smartAccount }',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identityEns .',
    '      ?identityEns a ens:EnsIdentity ; core:hasIdentifier ?ensIdent .',
    '      ?ensIdent core:protocolIdentifier ?didEns .',
    '    }',
    '  }',
    '}',
    'GROUP BY ?did8004',
    '',
  ].join('\n');

  const rows = await runGraphdbQuery(sparql);
  return rows
    .map((b: any) => {
      const did8004 = asString(b?.did8004);
      const agentIri = asString(b?.agent);
      if (!did8004 || !agentIri) return null;
      const types = splitConcat(asString(b?.agentTypes));
      return {
        did8004,
        agentIri,
        uaid: asString(b?.uaid),
        agentName: asString(b?.agentName),
        agentTypes: types,
        identity8004Iri: asString(b?.identity8004),
        identity8004DescriptorIri: asString(b?.desc8004),
        registrationJson: asString(b?.registrationJson),
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
        identityEnsIri: asString(b?.identityEns),
        didEns: asString(b?.didEns),
        ownerAccountIri: asString(b?.ownerAccount),
        walletAccountIri: asString(b?.walletAccount),
        operatorAccountIri: asString(b?.operatorAccount),
        smartAccountIri: asString(b?.smartAccount),
      } satisfies KbAgentHydratedRow;
    })
    .filter((x): x is KbAgentHydratedRow => Boolean(x));
}

