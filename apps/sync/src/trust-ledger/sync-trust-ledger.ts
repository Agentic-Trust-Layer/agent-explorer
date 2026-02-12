import { computeTrustLedgerAwardsToGraphdbForChain, seedTrustLedgerBadgeDefinitionsToGraphdb } from './compute-trust-ledger.js';

export async function syncTrustLedgerToGraphdbForChain(
  chainId: number,
  opts?: { resetContext?: boolean; agentIds?: Array<string | number> },
): Promise<{ scoreRows: number; badgeDefRows: number }> {
  // KB-native trust-ledger:
  // - badge definitions are seeded from code defaults into analytics/system
  // - awards + rollups are computed from KB evidence into analytics/<chainId>
  const badgeDefs = await seedTrustLedgerBadgeDefinitionsToGraphdb({ resetContext: Boolean(opts?.resetContext) });
  const scores = await computeTrustLedgerAwardsToGraphdbForChain(chainId, {
    resetContext: Boolean(opts?.resetContext),
    pageSize: 100,
    agentIds: opts?.agentIds,
  });
  console.info('[sync] [trust-ledger] computed awards+scores', {
    chainId,
    processedAgents: scores.processedAgents,
    awardedBadges: scores.awardedBadges,
    scoreRows: scores.scoreRows,
    badgeDefRows: badgeDefs.badgeDefRows,
  });
  return { scoreRows: scores.scoreRows, badgeDefRows: badgeDefs.badgeDefRows };
}

