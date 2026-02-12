import 'dotenv/config';
import { kbAgentsQuery } from '../graphdb/kb-queries.js';

async function run(): Promise<void> {
  // Make sure to set GRAPHDB_* env vars before running.
  const chainId = 1;
  const { rows, total, hasMore } = await kbAgentsQuery(
    {
      where: { chainId },
      first: 5,
      skip: 0,
      orderBy: 'bestRank',
      orderDirection: 'DESC',
    },
    { label: 'debug-kbAgentsQuery', requestId: `debug-${Date.now()}`, timings: [] },
  );

  console.log('[debug][kbAgentsQuery]', { chainId, total, hasMore, rowCount: rows.length });
  console.log(
    '[debug][kbAgentsQuery][sample]',
    rows.slice(0, 3).map((r) => ({
      iri: r.iri,
      uaid: r.uaid,
      agentName: r.agentName,
      createdAtTime: r.createdAtTime,
      trustLedgerTotalPoints: r.trustLedgerTotalPoints,
      trustLedgerBadgeCount: r.trustLedgerBadgeCount,
      trustLedgerBadgesLength: r.trustLedgerBadges?.length ?? 0,
      trustLedgerBadges: r.trustLedgerBadges,
      atiOverallScore: r.atiOverallScore,
    })),
  );
}

run().catch((e) => {
  console.error('[debug][kbAgentsQuery] failed', e);
  process.exitCode = 1;
});

