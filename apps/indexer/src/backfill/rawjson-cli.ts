import '../env';
import { runRawJsonBackfill } from './rawjson-backfill';

function usage(): void {
  console.log('Usage: pnpm --filter erc8004-indexer backfill:rawjson [hol|agentverse|both]');
  console.log('Env: RAWJSON_BACKFILL_PAGE_SIZE=500 RAWJSON_BACKFILL_MAX=0 RAWJSON_BACKFILL_RESET=0 RAWJSON_BACKFILL_OVERWRITE=0');
}

(async () => {
  const mode = (process.argv[2] || 'both').toLowerCase();
  if (!['hol', 'agentverse', 'both'].includes(mode)) {
    usage();
    process.exitCode = 1;
    return;
  }
  await runRawJsonBackfill({ mode: mode as any });
})().catch((e) => {
  console.error('[rawjson-backfill] failed', e);
  process.exitCode = 1;
});


