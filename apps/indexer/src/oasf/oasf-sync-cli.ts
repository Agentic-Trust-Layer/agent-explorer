import '../env';
import { db } from '../db';
import { syncOASF } from '../oasf-sync';

(async () => {
  if (!db) throw new Error('DB not initialized');
  const enabled = process.env.OASF_SYNC !== '0';
  if (!enabled) {
    console.info('[oasf-sync] disabled (OASF_SYNC=0)');
    return;
  }
  await syncOASF(db);
})().catch((e) => {
  console.error('[oasf-sync] failed', e);
  process.exitCode = 1;
});


