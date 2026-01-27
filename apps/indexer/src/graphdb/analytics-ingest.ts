import { clearStatements, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, uploadFileToRepository } from './graphdb-http';
import { exportAnalyticsTtlForChain, exportTrustLedgerBadgeDefinitionsTtl, listAnalyticsChainIds } from './analytics-export';

function analyticsContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/analytics/${chainId}`;
}

function analyticsSystemContext(): string {
  return `https://www.agentictrust.io/graph/data/analytics/system`;
}

export async function ingestAnalyticsToGraphdb(opts?: { resetContext?: boolean }): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const chainIds = await listAnalyticsChainIds();
  for (const chainId of chainIds) {
    const context = analyticsContext(chainId);
    if (opts?.resetContext) {
      await clearStatements(baseUrl, repository, auth, { context });
    }
    const { outPath, bytes, atiCount, componentCount } = await exportAnalyticsTtlForChain(chainId);
    const uploaded = await uploadFileToRepository(baseUrl, repository, auth, { filePath: outPath, context });
    console.info('[graphdb] uploaded analytics ttl', { chainId, bytes: uploaded.bytes ?? bytes, atiCount, componentCount, context });
  }

  const sysContext = analyticsSystemContext();
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context: sysContext });
  }
  const { outPath, bytes, badgeCount } = await exportTrustLedgerBadgeDefinitionsTtl();
  const uploaded = await uploadFileToRepository(baseUrl, repository, auth, { filePath: outPath, context: sysContext });
  console.info('[graphdb] uploaded trust-ledger badge defs', { bytes: uploaded.bytes ?? bytes, badgeCount, context: sysContext });
}

