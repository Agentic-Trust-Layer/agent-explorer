import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb-http.js';

export type AgentA2AEndpointRow = {
  agent: string;
  didIdentity: string | null; // derived from 8004 identity identifier
  didAccount: string | null; // derived from smartAccount OR wallet account identifier
  a2aEndpoint: string;
  registrationJson: string | null;
};

export type AgentMcpEndpointRow = {
  agent: string;
  didIdentity: string | null;
  didAccount: string | null;
  mcpEndpoint: string;
  registrationJson: string | null;
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

/** List agent IDs for a chain (ordered by agentId). Used by agent-pipeline to iterate. */
export async function listAgentIdsForChain(
  chainId: number,
  opts?: { limit?: number },
): Promise<string[]> {
  const limit = typeof opts?.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0
    ? Math.trunc(opts.limit)
    : 200_000;
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?agentId WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent ;
           core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  erc8004:agentId ?agentId .
  }
}
ORDER BY xsd:integer(?agentId) ASC(STR(?agent))
LIMIT ${Math.max(1, Math.min(200_000, limit))}
`;
  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = res?.results?.bindings;
  if (!Array.isArray(bindings)) return [];
  return bindings
    .map((b: any) => (typeof b?.agentId?.value === 'string' ? b.agentId.value.trim() : ''))
    .filter((id): id is string => id !== '' && /^\d+$/.test(id));
}

/** List accounts for multiple agents in one query (batch). Returns map agentId -> account IRIs[]. */
export async function listAccountsForAgentBatch(
  chainId: number,
  agentIds: string[],
): Promise<Map<string, string[]>> {
  const ids = agentIds
    .map((id) => String(id ?? '').trim())
    .filter((id) => /^\d+$/.test(id));
  if (!ids.length) return new Map();
  const chunkSize = 200;
  const result = new Map<string, string[]>();
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const values = chunk.map((id) => `("${id.replace(/"/g, '\\"')}")`).join(' ');
    const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
    const ctx = chainContext(chainId);
    const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?agentId ?account WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent ;
           core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  erc8004:agentId ?agentId .
    {
      ?agent core:hasAgentAccount ?account .
      ?account a eth:Account .
    } UNION {
      ?identity8004 erc8004:hasWalletAccount ?account .
      ?account a eth:Account .
    }
  }
  VALUES (?agentId) { ${values} }
}
`;
    const res = await queryGraphdb(baseUrl, repository, auth, sparql);
    const bindings = res?.results?.bindings;
    if (Array.isArray(bindings)) {
      for (const b of bindings) {
        const aid = typeof b?.agentId?.value === 'string' ? b.agentId.value.trim() : '';
        const acc = typeof b?.account?.value === 'string' ? b.account.value.trim() : '';
        if (aid && acc && acc.startsWith('http')) {
          const arr = result.get(aid) ?? [];
          if (!arr.includes(acc)) arr.push(acc);
          result.set(aid, arr);
        }
      }
    }
  }
  return result;
}

/** List account IRIs linked to an agent (hasAgentAccount and identity hasWalletAccount). */
export async function listAccountsForAgent(chainId: number, agentId: string): Promise<string[]> {
  const aid = String(agentId ?? '').trim();
  if (!aid || !/^\d+$/.test(aid)) return [];
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT DISTINCT ?account WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent ;
           core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  erc8004:agentId "${aid}" .
    {
      ?agent core:hasAgentAccount ?account .
      ?account a eth:Account .
    } UNION {
      ?identity8004 erc8004:hasWalletAccount ?account .
      ?account a eth:Account .
    }
  }
}
`;
  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = res?.results?.bindings;
  if (!Array.isArray(bindings)) return [];
  return bindings
    .map((b: any) => (typeof b?.account?.value === 'string' ? b.account.value.trim() : ''))
    .filter((iri): iri is string => iri !== '' && iri.startsWith('http'));
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
SELECT ?agent ?didIdentity ?didAccount ?a2aEndpoint ?registrationJson WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent .
    ?agent core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  core:hasIdentifier ?ident8004 ;
                  core:hasDescriptor ?desc8004 .
    ?ident8004 core:protocolIdentifier ?didIdentity .

    # Registration JSON lives on the ERC-8004 identity descriptor
    OPTIONAL { ?desc8004 erc8004:registrationJson ?registrationJson . }

    # A2A endpoint comes from identity -> serviceEndpoint -> protocol -> serviceUrl
    ?identity8004 core:hasServiceEndpoint ?se .
    ?se a core:ServiceEndpoint ;
        core:hasProtocol ?p .
    ?p a core:A2AProtocol .
    OPTIONAL { ?p core:serviceUrl ?a2aEndpoint . }

    # didAccount: prefer SmartAgent smartAccount DID, else fall back to wallet account DID
    OPTIONAL {
      ?agent a core:AISmartAgent ;
             core:hasAgentAccount ?sa .
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
    registrationJson: typeof b?.registrationJson?.value === 'string' ? b.registrationJson.value : null,
  }));
}

export async function listAgentsWithA2AEndpointByAgentIds(
  chainId: number,
  agentIds: Array<string | number>,
): Promise<AgentA2AEndpointRow[]> {
  const ids = Array.from(
    new Set(
      (Array.isArray(agentIds) ? agentIds : [])
        .map((x) => (typeof x === 'number' ? x : Number(String(x || '').trim())))
        .filter((n) => Number.isFinite(n) && n >= 0)
        .map((n) => Math.trunc(n)),
    ),
  );
  if (!ids.length) return [];

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const values = ids.map((n) => String(n)).join(' ');

  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?agent ?didIdentity ?didAccount ?a2aEndpoint ?registrationJson WHERE {
  GRAPH <${ctx}> {
    VALUES ?agentId { ${values} }
    ?agent a core:AIAgent .
    ?agent core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  erc8004:agentId ?agentId ;
                  core:hasIdentifier ?ident8004 ;
                  core:hasDescriptor ?desc8004 .
    ?ident8004 core:protocolIdentifier ?didIdentity .

    OPTIONAL { ?desc8004 erc8004:registrationJson ?registrationJson . }

    ?identity8004 core:hasServiceEndpoint ?se .
    ?se a core:ServiceEndpoint ;
        core:hasProtocol ?p .
    ?p a core:A2AProtocol .
    OPTIONAL { ?p core:serviceUrl ?a2aEndpoint . }

    OPTIONAL {
      ?agent a core:AISmartAgent ;
             core:hasAgentAccount ?sa .
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
`;

  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = res?.results?.bindings;
  if (!Array.isArray(bindings)) return [];

  return bindings.map((b: any) => ({
    agent: String(b?.agent?.value || ''),
    didIdentity: typeof b?.didIdentity?.value === 'string' ? b.didIdentity.value : null,
    didAccount: typeof b?.didAccount?.value === 'string' ? b.didAccount.value : null,
    a2aEndpoint: String(b?.a2aEndpoint?.value || ''),
    registrationJson: typeof b?.registrationJson?.value === 'string' ? b.registrationJson.value : null,
  }));
}

export async function listAgentsWithMcpEndpoint(chainId: number, limit: number = 5000): Promise<AgentMcpEndpointRow[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);

  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?agent ?didIdentity ?didAccount ?mcpEndpoint ?registrationJson WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent .
    ?agent core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  core:hasIdentifier ?ident8004 ;
                  core:hasDescriptor ?desc8004 .
    ?ident8004 core:protocolIdentifier ?didIdentity .

    OPTIONAL { ?desc8004 erc8004:registrationJson ?registrationJson . }

    # MCP endpoint comes from identity -> serviceEndpoint -> protocol -> serviceUrl
    ?identity8004 core:hasServiceEndpoint ?se .
    ?se a core:ServiceEndpoint ;
        core:hasProtocol ?p .
    ?p a core:MCPProtocol .
    OPTIONAL { ?p core:serviceUrl ?mcpEndpoint . }

    # didAccount: prefer SmartAgent smartAccount DID, else fall back to wallet account DID
    OPTIONAL {
      ?agent a core:AISmartAgent ;
             core:hasAgentAccount ?sa .
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
    mcpEndpoint: String(b?.mcpEndpoint?.value || ''),
    registrationJson: typeof b?.registrationJson?.value === 'string' ? b.registrationJson.value : null,
  }));
}

export async function listAgentsWithMcpEndpointByAgentIds(
  chainId: number,
  agentIds: Array<string | number>,
): Promise<AgentMcpEndpointRow[]> {
  const ids = Array.from(
    new Set(
      (Array.isArray(agentIds) ? agentIds : [])
        .map((x) => (typeof x === 'number' ? x : Number(String(x || '').trim())))
        .filter((n) => Number.isFinite(n) && n >= 0)
        .map((n) => Math.trunc(n)),
    ),
  );
  if (!ids.length) return [];

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const values = ids.map((n) => String(n)).join(' ');

  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?agent ?didIdentity ?didAccount ?mcpEndpoint ?registrationJson WHERE {
  GRAPH <${ctx}> {
    VALUES ?agentId { ${values} }
    ?agent a core:AIAgent .
    ?agent core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  erc8004:agentId ?agentId ;
                  core:hasIdentifier ?ident8004 ;
                  core:hasDescriptor ?desc8004 .
    ?ident8004 core:protocolIdentifier ?didIdentity .

    OPTIONAL { ?desc8004 erc8004:registrationJson ?registrationJson . }

    ?identity8004 core:hasServiceEndpoint ?se .
    ?se a core:ServiceEndpoint ;
        core:hasProtocol ?p .
    ?p a core:MCPProtocol .
    OPTIONAL { ?p core:serviceUrl ?mcpEndpoint . }

    OPTIONAL {
      ?agent a core:AISmartAgent ;
             core:hasAgentAccount ?sa .
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
`;

  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = res?.results?.bindings;
  if (!Array.isArray(bindings)) return [];

  return bindings.map((b: any) => ({
    agent: String(b?.agent?.value || ''),
    didIdentity: typeof b?.didIdentity?.value === 'string' ? b.didIdentity.value : null,
    didAccount: typeof b?.didAccount?.value === 'string' ? b.didAccount.value : null,
    mcpEndpoint: String(b?.mcpEndpoint?.value || ''),
    registrationJson: typeof b?.registrationJson?.value === 'string' ? b.registrationJson.value : null,
  }));
}

