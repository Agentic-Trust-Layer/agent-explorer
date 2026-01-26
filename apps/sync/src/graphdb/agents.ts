import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb-http.js';

export type AgentA2AEndpointRow = {
  agent: string;
  didAccount: string | null;
  a2aEndpoint: string;
};

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

export async function listAgentsWithA2AEndpoint(chainId: number, limit: number = 5000): Promise<AgentA2AEndpointRow[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);

  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
SELECT ?agent ?didAccount ?a2aEndpoint WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent .
    ?agent core:a2aEndpoint ?a2aEndpoint .
    OPTIONAL { ?agent core:didAccount ?didAccount . }
  }
}
LIMIT ${Math.max(1, Math.min(50000, limit))}
`;

  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = res?.results?.bindings;
  if (!Array.isArray(bindings)) return [];

  return bindings.map((b: any) => ({
    agent: String(b?.agent?.value || ''),
    didAccount: typeof b?.didAccount?.value === 'string' ? b.didAccount.value : null,
    a2aEndpoint: String(b?.a2aEndpoint?.value || ''),
  }));
}

