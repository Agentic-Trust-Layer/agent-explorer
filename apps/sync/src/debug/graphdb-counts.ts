import '../env-load.js';
import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb-http.js';

function countAgentsInContext(ctx: string): string {
  return [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'SELECT (COUNT(?a) AS ?count) WHERE {',
    `  GRAPH <${ctx}> {`,
    '    ?a a core:AIAgent .',
    '  }',
    '}',
    '',
  ].join('\n');
}

function countAnyTriplesInContext(ctx: string): string {
  return [
    'SELECT (COUNT(*) AS ?count) WHERE {',
    `  GRAPH <${ctx}> { ?s ?p ?o }`,
    '}',
    '',
  ].join('\n');
}

async function run(): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  console.log('[debug][graphdb]', { baseUrl, repository, hasAuth: Boolean(auth) });

  const contexts = [
    'https://www.agentictrust.io/graph/data/subgraph/1',
    'https://www.agentictrust.io/graph/data/subgraph/11155111',
    'https://www.agentictrust.io/graph/data/analytics/1',
    'https://www.agentictrust.io/graph/data/analytics/11155111',
  ];

  for (const ctx of contexts) {
    try {
      const triples = await queryGraphdb(baseUrl, repository, auth, countAnyTriplesInContext(ctx));
      const triplesCount = triples?.results?.bindings?.[0]?.count?.value ?? null;
      const agents = await queryGraphdb(baseUrl, repository, auth, countAgentsInContext(ctx));
      const agentsCount = agents?.results?.bindings?.[0]?.count?.value ?? null;
      console.log('[debug][graphdb][ctx]', { ctx, triplesCount, agentsCount });
    } catch (e: any) {
      console.error('[debug][graphdb][ctx] error', { ctx, error: String(e?.message || e || '') });
    }
  }
}

run().catch((e) => {
  console.error('[debug][graphdb] fatal', e);
  process.exitCode = 1;
});

