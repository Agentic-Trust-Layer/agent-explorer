import '../env';
import { db } from '../db';
import { backfillAgentCards } from './agent-card-backfill';

function parseNum(value: string | undefined): number | undefined {
  if (!value || !value.trim()) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

(async () => {
  if (!db) throw new Error('DB not initialized');
  const enabled = process.env.AGENT_CARD_BACKFILL !== '0';
  if (!enabled) {
    console.info('[agent-card-backfill] disabled (AGENT_CARD_BACKFILL=0)');
    return;
  }
  const reset = process.env.AGENT_CARD_BACKFILL_RESET === '1';
  const chunkSize = parseNum(process.env.AGENT_CARD_BACKFILL_CHUNK_SIZE);
  await backfillAgentCards(db, { reset, chunkSize });
})().catch((e) => {
  console.error('[agent-card-backfill] failed', e);
  process.exitCode = 1;
});


