import '../env-load.js';
import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb-http.js';

const ctx = 'https://www.agentictrust.io/graph/data/subgraph/1';

const countAgents = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT (COUNT(?agent) AS ?count) WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent ; core:hasIdentity ?id .
    ?id a erc8004:AgentIdentity8004 ; erc8004:agentId ?agentId .
  }
}
`;

const pageAgents = (limit: number) => `
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?agent ?agentId WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent ; core:hasIdentity ?id .
    ?id a erc8004:AgentIdentity8004 ; erc8004:agentId ?agentId .
  }
}
ORDER BY xsd:integer(?agentId) ASC(STR(?agent))
LIMIT ${Math.trunc(limit)}
OFFSET 0
`;

async function run() {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  console.log('[debug] graphdb', { baseUrl, repository, hasAuth: Boolean(auth) });

  const resCount = await queryGraphdb(baseUrl, repository, auth, countAgents);
  console.log('[debug] count', resCount?.results?.bindings?.[0]?.count?.value ?? null);

  for (const lim of [50, 200, 500, 1000]) {
    const res = await queryGraphdb(baseUrl, repository, auth, pageAgents(lim));
    const n = Array.isArray(res?.results?.bindings) ? res.results.bindings.length : 0;
    console.log('[debug] page', { limit: lim, bindings: n });
  }
}

run().catch((e) => {
  console.error('[debug] failed', e);
  process.exitCode = 1;
});

