import '../env';
import { db } from '../db';
import { ensureSchemaInitialized } from '../db';
import { runTokenUriBackfill } from './tokenuri-backfill';

function usage(): void {
  console.log('Usage: pnpm --filter erc8004-indexer backfill:tokenuri [chainId] [startAgentId]');
  console.log('Env: TOKENURI_BACKFILL_PAGE_SIZE=250 TOKENURI_BACKFILL_MAX=0 TOKENURI_BACKFILL_RESET=0 TOKENURI_BACKFILL_OVERWRITE=0 TOKENURI_BACKFILL_START_AGENT_ID=');
  console.log('Notes: default behavior updates only rows missing rawJson; set TOKENURI_BACKFILL_OVERWRITE=1 to refetch/rewrite.');
}

(async () => {
  const argChainId = process.argv[2] ? Number(process.argv[2]) : 0;
  const argStartAgentId = process.argv[3] ? String(process.argv[3]) : '';
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    return;
  }
  if (process.argv[2] && !Number.isFinite(argChainId)) {
    usage();
    process.exitCode = 1;
    return;
  }

  await ensureSchemaInitialized();
  if (!db) throw new Error('DB not initialized');

  const overwrite = process.env.TOKENURI_BACKFILL_OVERWRITE === '1';
  const reset = process.env.TOKENURI_BACKFILL_RESET === '1';
  const pageSize = Number(process.env.TOKENURI_BACKFILL_PAGE_SIZE || 250) || 250;
  const max = Number(process.env.TOKENURI_BACKFILL_MAX || 0) || 0;
  const startAgentId = argStartAgentId || (process.env.TOKENURI_BACKFILL_START_AGENT_ID || '').trim();

  await runTokenUriBackfill(db as any, {
    chainId: argChainId || undefined,
    overwrite,
    reset,
    pageSize,
    max,
    startAgentId: startAgentId || undefined,
  });
})().catch((e) => {
  console.error('[tokenuri-backfill] failed', e);
  process.exitCode = 1;
});


