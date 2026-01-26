import { clearStatements, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, uploadTurtleToRepository } from './graphdb-http.js';

export async function ingestSubgraphTurtleToGraphdb(opts: {
  chainId: number;
  section: string;
  turtle: string;
  resetContext?: boolean;
}): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const context = `https://www.agentictrust.io/graph/data/subgraph/${opts.chainId}`;
  if (opts.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[sync] cleared subgraph context', { context });
  }

  const rdfContent = opts.turtle;
  if (!rdfContent || rdfContent.trim().length === 0) {
    console.info('[sync] no RDF content generated', { section: opts.section, chainId: opts.chainId });
    return;
  }

  const { bytes } = await uploadTurtleToRepository(baseUrl, repository, auth, { turtle: rdfContent, context });
  console.info('[sync] uploaded subgraph data', {
    section: opts.section,
    chainId: opts.chainId,
    bytes,
    context,
  });
}
