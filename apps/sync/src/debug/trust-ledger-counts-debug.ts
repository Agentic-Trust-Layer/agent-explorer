import '../env-load.js';
import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb-http.js';

const chainId = 1;
const ctx = `https://www.agentictrust.io/graph/data/analytics/${chainId}`;

const q = `
PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>
SELECT ?scores ?awards ?maxPoints WHERE {
  {
    SELECT (COUNT(?s) AS ?scores) (MAX(?pts) AS ?maxPoints) WHERE {
      GRAPH <${ctx}> {
        ?s a analytics:AgentTrustLedgerScore ;
           analytics:totalPoints ?pts .
      }
    }
  }
  {
    SELECT (COUNT(?a) AS ?awards) WHERE {
      GRAPH <${ctx}> {
        ?a a analytics:TrustLedgerBadgeAward .
      }
    }
  }
}
`;

async function run() {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const res = await queryGraphdb(baseUrl, repository, auth, q);
  const b = res?.results?.bindings?.[0] ?? {};
  console.log('[debug] trust-ledger', {
    ctx,
    scores: b?.scores?.value ?? null,
    awards: b?.awards?.value ?? null,
    maxPoints: b?.maxPoints?.value ?? null,
  });
}

run().catch((e) => {
  console.error('[debug] failed', e);
  process.exitCode = 1;
});

