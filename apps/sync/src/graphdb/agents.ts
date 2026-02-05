import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb-http.js';

export type AgentA2AEndpointRow = {
  agent: string;
  didIdentity: string | null; // derived from 8004 identity identifier
  didAccount: string | null; // derived from smartAccount OR wallet account identifier
  a2aEndpoint: string;
  agentUriJson: string | null;
};

export async function listAgentIriByDidIdentity(chainId: number, limit: number = 50000): Promise<Map<string, string>> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?agent ?didIdentity WHERE {
  GRAPH <${ctx}> {
    ?agent core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  core:hasIdentifier ?ident8004 .
    ?ident8004 core:protocolIdentifier ?didIdentity .
  }
}
LIMIT ${Math.max(1, Math.min(200000, limit))}
`;
  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = res?.results?.bindings;
  const map = new Map<string, string>();
  if (!Array.isArray(bindings)) return map;
  for (const b of bindings) {
    const agent = typeof b?.agent?.value === 'string' ? b.agent.value : '';
    const did = typeof b?.didIdentity?.value === 'string' ? b.didIdentity.value : '';
    if (agent && did) map.set(did, agent);
  }
  return map;
}

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

export async function getMaxAgentId8004(chainId: number): Promise<number | null> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT (MAX(xsd:integer(?id)) AS ?maxId) WHERE {
  GRAPH <${ctx}> {
    ?agent core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  erc8004:agentId ?id .
  }
}
`;
  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const b = res?.results?.bindings?.[0];
  const raw = typeof b?.maxId?.value === 'string' ? b.maxId.value.trim() : '';
  const n = Number(raw);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export async function getMaxDid8004AgentId(chainId: number): Promise<number | null> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const didPrefix = `did:8004:${chainId}:`;
  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT (MAX(?idInt) AS ?maxId) WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent ;
           core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  core:hasIdentifier ?ident8004 .
    ?ident8004 core:protocolIdentifier ?did8004 .
    FILTER(STRSTARTS(STR(?did8004), "${didPrefix}"))
    BIND(xsd:integer(STRAFTER(STR(?did8004), "${didPrefix}")) AS ?idInt)
  }
}
`;
  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const b = res?.results?.bindings?.[0];
  const raw = typeof b?.maxId?.value === 'string' ? b.maxId.value.trim() : '';
  const n = Number(raw);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export async function listAgentsWithA2AEndpoint(chainId: number, limit: number = 5000): Promise<AgentA2AEndpointRow[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);

  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?agent ?didIdentity ?didAccount ?a2aEndpoint ?agentUriJson WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent .
    ?agent core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  core:hasIdentifier ?ident8004 ;
                  core:hasDescriptor ?desc8004 .
    ?ident8004 core:protocolIdentifier ?didIdentity .

    # Registration JSON lives on the ERC-8004 identity descriptor
    OPTIONAL { ?desc8004 core:json ?agentUriJson . }

    # A2A endpoint comes from identity -> serviceEndpoint -> protocol -> serviceUrl
    ?identity8004 core:hasServiceEndpoint ?se .
    ?se a core:ServiceEndpoint ;
        core:hasProtocol ?p .
    ?p a core:A2AProtocol .
    OPTIONAL { ?p core:serviceUrl ?a2aEndpoint . }

    OPTIONAL {
      # no-op: didIdentity already bound above
    }

    # didAccount: prefer SmartAgent smartAccount DID, else fall back to wallet account DID
    OPTIONAL {
      ?agent a erc8004:SmartAgent ;
             erc8004:hasAgentAccount ?sa .
      ?sa eth:hasAccountIdentifier ?saIdent .
      ?saIdent core:protocolIdentifier ?didAccount .
    }
    OPTIONAL {
      FILTER(!BOUND(?didAccount))
      ?identity8004 erc8004:hasWalletAccount ?wa .
      ?wa eth:hasAccountIdentifier ?waIdent .
      ?waIdent core:protocolIdentifier ?didAccount .
    }
  }
}
LIMIT ${Math.max(1, Math.min(50000, limit))}
`;

  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = res?.results?.bindings;
  if (!Array.isArray(bindings)) return [];

  return bindings.map((b: any) => ({
    agent: String(b?.agent?.value || ''),
    didIdentity: typeof b?.didIdentity?.value === 'string' ? b.didIdentity.value : null,
    didAccount: typeof b?.didAccount?.value === 'string' ? b.didAccount.value : null,
    a2aEndpoint: String(b?.a2aEndpoint?.value || ''),
    agentUriJson: typeof b?.agentUriJson?.value === 'string' ? b.agentUriJson.value : null,
  }));
}

