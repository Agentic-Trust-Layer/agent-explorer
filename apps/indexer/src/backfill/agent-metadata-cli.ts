import '../env';
import { db } from '../db';
import { ensureSchemaInitialized } from '../db';
import { runAgentMetadataExtract } from './agent-metadata-extract';

function usage(): void {
  console.log('Usage: pnpm --filter erc8004-indexer backfill:agent-meta [chainId] [startAgentId]');
  console.log('Env: AGENT_META_CHUNK_SIZE=250 AGENT_META_RESET=0 AGENT_META_OVERWRITE=0 AGENT_META_CHAIN_ID=0 AGENT_META_START_AGENT_ID=');
}

(async () => {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    return;
  }
  await ensureSchemaInitialized();
  if (!db) throw new Error('DB not initialized');

  const argChainId = process.argv[2] ? Number(process.argv[2]) : 0;
  const argStartAgentId = process.argv[3] ? String(process.argv[3]) : '';
  if (process.argv[2] && !Number.isFinite(argChainId)) {
    usage();
    process.exitCode = 1;
    return;
  }
  if (argStartAgentId && !argChainId && !process.env.AGENT_META_CHAIN_ID) {
    console.error('[agent-meta] startAgentId requires a chainId (pass arg or set AGENT_META_CHAIN_ID)');
    usage();
    process.exitCode = 1;
    return;
  }

  const chunkSize = Number(process.env.AGENT_META_CHUNK_SIZE || 250) || 250;
  const reset = process.env.AGENT_META_RESET === '1';
  const overwrite = process.env.AGENT_META_OVERWRITE === '1';
  const chainId = (argChainId || Number(process.env.AGENT_META_CHAIN_ID || 0) || 0) || 0;
  const startAgentId = (argStartAgentId || (process.env.AGENT_META_START_AGENT_ID || '').trim()) || '';

  await runAgentMetadataExtract(db as any, {
    chunkSize,
    reset,
    overwrite,
    chainId: chainId || undefined,
    startAgentId: startAgentId || undefined,
  });
})().catch((e) => {
  console.error('[agent-meta] failed', e);
  process.exitCode = 1;
});



