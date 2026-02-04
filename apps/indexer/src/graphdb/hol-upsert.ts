import { updateGraphdb, getGraphdbConfigFromEnv } from './graphdb-http.js';
import { buildHolResolvedAgentUpsertSparql } from '@agentictrust/hcs-core/hol/upsert.js';

export { buildHolResolvedAgentUpsertSparql };

export async function upsertHolResolvedAgentToGraphdb(args: { uaid: string; resolved: any }): Promise<void> {
  const { sparqlUpdate } = buildHolResolvedAgentUpsertSparql(args);
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await updateGraphdb(baseUrl, repository, auth, sparqlUpdate);
}

