/**
 * Debug script: run the trust ledger badge SPARQL for one or more agents.
 * Verifies that badge awards exist in GraphDB for agents that show empty in the API.
 *
 * Usage: cd apps/indexer && pnpm exec tsx src/debug/trust-ledger-badges-debug.ts
 *        pnpm exec tsx src/debug/trust-ledger-badges-debug.ts 20019 20018 20014
 * (Set GRAPHDB_* env vars as needed; indexer loads from apps/indexer or root .env)
 */
import 'dotenv/config';
import { getGraphdbConfigFromEnv, queryGraphdbWithContext } from '../graphdb/graphdb-http.js';

const ANALYTICS_CTX = 'https://www.agentictrust.io/graph/data/analytics/1';

// Default: agents that had badgeCount but empty trustLedgerBadges in the user's response
const DEFAULT_AGENT_IDS = ['20019', '20018', '20014', '20029', '20027'];
const agentIds = process.argv.slice(2).filter(Boolean).length
  ? process.argv.slice(2).filter(Boolean)
  : DEFAULT_AGENT_IDS;
const agentIris = agentIds.map((id) => `https://www.agentictrust.io/id/agent/1/${id}`);

function buildSparql(iris: string[]): string {
  const values = iris.map((iri) => `<${iri}>`).join(' ');
  return `
PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?agent ?award ?awardedAt ?badgeId ?name ?points
WHERE {
  VALUES ?agent { ${values} }
  GRAPH <${ANALYTICS_CTX}> {
    ?agent analytics:hasTrustLedgerBadgeAward ?award .
    ?award a analytics:TrustLedgerBadgeAward, prov:Entity .
    OPTIONAL { ?award analytics:awardedAt ?awardedAt }
    OPTIONAL { ?award analytics:awardedBadgeDefinition ?def }
  }
  OPTIONAL {
    GRAPH <https://www.agentictrust.io/graph/data/analytics/system> {
      ?def analytics:badgeId ?badgeId ; analytics:name ?name ; analytics:points ?points .
    }
  }
}
`;
}

async function run(): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const sparql = buildSparql(agentIris);
  const res = await queryGraphdbWithContext(baseUrl, repository, auth, sparql);
  const bindings = res?.results?.bindings ?? [];

  const byAgent = new Map<string, number>();
  for (const b of bindings) {
    const agent = (b as any)?.agent?.value;
    if (agent) byAgent.set(agent, (byAgent.get(agent) ?? 0) + 1);
  }

  console.log('[trust-ledger-badges-debug]', {
    graphdb: baseUrl,
    repository,
    analyticsCtx: ANALYTICS_CTX,
    agentIris,
    totalBindingCount: bindings.length,
    bindingsPerAgent: Object.fromEntries(byAgent),
    sample: bindings.slice(0, 2).map((b: any) => ({
      agent: b?.agent?.value,
      award: b?.award?.value,
      badgeId: b?.badgeId?.value,
      name: b?.name?.value,
    })),
  });
}

run().catch((e) => {
  console.error('[trust-ledger-badges-debug] failed', e);
  process.exitCode = 1;
});
