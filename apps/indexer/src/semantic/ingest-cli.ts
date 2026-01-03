import '../env';
import { db } from '../db';
import { createSemanticSearchServiceFromEnv } from './factory.js';
import { ingestAgentsIntoSemanticStore } from './agent-ingest.js';

function parseNum(value: string | undefined): number | undefined {
  if (!value || !value.trim()) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

(async () => {
  if (!db) throw new Error('DB not initialized');

  const svc = createSemanticSearchServiceFromEnv();
  if (!svc) {
    console.log('[semantic-ingest] Semantic search not configured; skipping');
    return;
  }

  const reset = process.env.SEMANTIC_INGEST_RESET === '1';
  if (reset) {
    try {
      await db.prepare("DELETE FROM checkpoints WHERE key = 'semanticIngestCursor'").run();
      console.info('[semantic-ingest] reset: cleared semanticIngestCursor checkpoint');
    } catch (e) {
      console.warn('[semantic-ingest] reset requested but failed to clear semanticIngestCursor checkpoint', e);
    }
  }

  const chunkSize = parseNum(process.env.SEMANTIC_INGEST_CHUNK_SIZE) ?? 100;
  console.info('[semantic-ingest] starting', { chunkSize });
  const ingestResult = await ingestAgentsIntoSemanticStore(db, svc, { chunkSize });
  console.log(JSON.stringify(ingestResult, null, 2));
})().catch((e) => {
  console.error('[semantic-ingest] failed', e);
  process.exitCode = 1;
});


