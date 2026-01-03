import '../env';
import { db } from '../db';
import { syncOASF } from '../oasf-sync';

function parseBool(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

(async () => {
  console.log('[oasf-sync] Starting OASF synchronization...');
  const enabled = process.env.OASF_SYNC !== '0';
  
  if (!enabled) {
    console.info('[oasf-sync] disabled (OASF_SYNC=0)');
    return;
  }
  
  try {
    await syncOASF(db);
    console.log('[oasf-sync] OASF synchronization complete');
  } catch (e) {
    console.error('[oasf-sync] failed', e);
    process.exitCode = 1;
  }
})().catch((e) => {
  console.error('[oasf-sync] failed', e);
  process.exitCode = 1;
});

