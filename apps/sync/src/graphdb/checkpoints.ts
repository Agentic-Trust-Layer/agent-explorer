import { getGraphdbConfigFromEnv, queryGraphdb, updateGraphdb } from '../graphdb-http.js';
import { d1Exec, d1Query, getD1ConfigFromEnv } from '../d1/d1-http.js';

function checkpointContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/system/subgraph-sync/checkpoints/${chainId}`;
}

function checkpointIri(chainId: number, section: string): string {
  const s = encodeURIComponent(section).replace(/%/g, '_');
  return `<https://www.agentictrust.io/id/subgraph-sync-checkpoint/${chainId}/${s}>`;
}

let d1InitAttempted = false;
let d1Enabled = false;

async function ensureD1CheckpointsTable(): Promise<boolean> {
  if (d1InitAttempted) return d1Enabled;
  d1InitAttempted = true;
  const cfg = getD1ConfigFromEnv();
  if (!cfg) {
    d1Enabled = false;
    console.info('[sync] checkpoints: D1 not configured; using GraphDB (set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN to enable)');
    return false;
  }
  try {
    await d1Exec(
      `
CREATE TABLE IF NOT EXISTS sync_checkpoints (
  chainId INTEGER NOT NULL,
  section TEXT NOT NULL,
  cursor TEXT NOT NULL,
  updatedAt INTEGER NOT NULL,
  PRIMARY KEY (chainId, section)
);
      `.trim(),
      [],
      { timeoutMs: 20_000, retries: 2 },
    );
    d1Enabled = true;
    console.info('[sync] checkpoints: using D1 (sync_checkpoints table)');
    return true;
  } catch (e: any) {
    d1Enabled = false;
    console.warn('[sync] checkpoints: D1 init failed; falling back to GraphDB', { err: String(e?.message || e || '') });
    return false;
  }
}

export async function getCheckpoint(chainId: number, section: string): Promise<string | null> {
  if (await ensureD1CheckpointsTable()) {
    try {
      const rows = await d1Query<{ cursor: string }>(
        `SELECT cursor FROM sync_checkpoints WHERE chainId = ? AND section = ? LIMIT 1`,
        [chainId, section],
        { timeoutMs: 10_000, retries: 1 },
      );
      const v = rows?.[0]?.cursor;
      return typeof v === 'string' && v.trim() ? v.trim() : null;
    } catch (e: any) {
      console.warn('[sync] checkpoint read failed (D1); treating as missing', {
        chainId,
        section,
        err: String(e?.message || e || ''),
      });
      return null;
    }
  }

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = checkpointContext(chainId);
  const iri = checkpointIri(chainId, section);
  const sparql = `
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?cursor WHERE {
  GRAPH <${ctx}> {
    ${iri} a erc8004:SubgraphIngestCheckpoint ;
      erc8004:checkpointCursor ?cursor .
  }
}
LIMIT 1
`;
  try {
    const result = await queryGraphdb(baseUrl, repository, auth, sparql);
    const bindings = result?.results?.bindings;
    if (!Array.isArray(bindings) || bindings.length === 0) return null;
    const v = bindings[0]?.cursor?.value;
    return typeof v === 'string' && v.trim() ? v.trim() : null;
  } catch (e: any) {
    // Non-fatal: if GraphDB is overloaded / times out, treat checkpoint as missing.
    // Worst case we reprocess some records, but sync keeps running.
    console.warn('[sync] checkpoint read failed; treating as missing', {
      chainId,
      section,
      err: String(e?.message || e || ''),
    });
    return null;
  }
}

export async function setCheckpoint(chainId: number, section: string, cursor: string): Promise<void> {
  if (await ensureD1CheckpointsTable()) {
    const now = Math.floor(Date.now() / 1000);
    console.info('[sync] setCheckpoint starting (D1)', { chainId, section, cursor: cursor.slice(0, 50) });
    const startTime = Date.now();
    try {
      await d1Exec(
        `
INSERT INTO sync_checkpoints(chainId, section, cursor, updatedAt)
VALUES(?, ?, ?, ?)
ON CONFLICT(chainId, section) DO UPDATE SET
  cursor=excluded.cursor,
  updatedAt=excluded.updatedAt
        `.trim(),
        [chainId, section, cursor, now],
        { timeoutMs: 10_000, retries: 1 },
      );
      const durationMs = Date.now() - startTime;
      console.info('[sync] setCheckpoint complete (D1)', { chainId, section, durationMs });
      return;
    } catch (e: any) {
      const durationMs = Date.now() - startTime;
      console.error('[sync] setCheckpoint failed (D1)', {
        chainId,
        section,
        durationMs,
        error: String(e?.message || e || ''),
      });
      throw e;
    }
  }

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = checkpointContext(chainId);
  const iri = checkpointIri(chainId, section);
  const now = Math.floor(Date.now() / 1000);
  const cursorEsc = cursor.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const sectionEsc = section.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const update = `
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
WITH <${ctx}>
DELETE {
  ${iri} erc8004:checkpointCursor ?oldCursor .
  ${iri} erc8004:checkpointUpdatedAt ?oldUpdatedAt .
} WHERE {
  OPTIONAL { ${iri} erc8004:checkpointCursor ?oldCursor . }
  OPTIONAL { ${iri} erc8004:checkpointUpdatedAt ?oldUpdatedAt . }
};
WITH <${ctx}>
INSERT {
  ${iri} a erc8004:SubgraphIngestCheckpoint ;
    erc8004:checkpointChainId ${chainId} ;
    erc8004:checkpointSection "${sectionEsc}"^^xsd:string ;
    erc8004:checkpointCursor "${cursorEsc}"^^xsd:string ;
    erc8004:checkpointUpdatedAt ${now} .
} WHERE {};
`;
  console.info('[sync] setCheckpoint starting', { chainId, section, cursor: cursor.slice(0, 50) });
  const startTime = Date.now();
  try {
    // Checkpoints should never block sync for minutes. If GraphDB is overloaded right after ingest,
    // fail fast and let a later run/watch attempt set it again.
    await updateGraphdb(baseUrl, repository, auth, update, { timeoutMs: 15_000, retries: 0 });
    const durationMs = Date.now() - startTime;
    console.info('[sync] setCheckpoint complete', { chainId, section, durationMs });
  } catch (e: any) {
    const durationMs = Date.now() - startTime;
    console.error('[sync] setCheckpoint failed', {
      chainId,
      section,
      durationMs,
      error: String(e?.message || e || ''),
    });
    throw e;
  }
}

