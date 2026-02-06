import { clearStatements, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, uploadTurtleToRepository } from '../graphdb-http.js';
import { exportOasfTtlToString } from './oasf-export.js';

export async function ingestOasfToGraphdb(opts?: { resetContext?: boolean; context?: string | null }): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const context = opts?.context ?? 'https://www.agentictrust.io/graph/ontology/core';
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[sync][oasf] cleared oasf context', { context });
  }

  const { ttl, skillCount, domainCount, repo, ref } = await exportOasfTtlToString();
  const { bytes } = await uploadTurtleToRepository(baseUrl, repository, auth, { turtle: ttl, context });
  console.info('[sync][oasf] uploaded oasf ttl', { bytes, skillCount, domainCount, context, repo, ref });
}

