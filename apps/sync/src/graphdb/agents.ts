import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb-http.js';

export type AgentA2AEndpointRow = {
  agent: string;
  didIdentity: string | null;
  didAccount: string | null;
  a2aEndpoint: string;
  agentUriJson: string | null;
};

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

export async function listAgentsWithA2AEndpoint(chainId: number, limit: number = 5000): Promise<AgentA2AEndpointRow[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);

  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
SELECT ?agent ?didIdentity ?didAccount ?a2aEndpoint ?agentUriJson WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent .
    ?agent core:a2aEndpoint ?a2aEndpoint .
    OPTIONAL { ?agent core:didIdentity ?didIdentity . }
    OPTIONAL { ?agent core:didAccount ?didAccount . }
    OPTIONAL { ?agent core:json ?agentUriJson . }
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

