// GraphDB ingestion for HOL
import { getGraphdbConfigFromEnv, uploadTurtleToRepository } from './graphdb-http.js';

const HOL_CONTEXT = `https://www.agentictrust.io/graph/data/subgraph/hol`;
const GRAPHDB_UPLOAD_CHUNK_BYTES = 2_500_000;

function splitTurtleIntoChunks(turtle: string, maxBytes: number): string[] {
  const content = String(turtle || '');
  if (!content.trim()) return [];
  if (!maxBytes || maxBytes <= 0) return [content];

  const B = (globalThis as any).Buffer as any;
  const byteLen = (s: string) => (B ? B.byteLength(s, 'utf8') : s.length);

  if (byteLen(content) <= maxBytes) return [content];

  const lines = content.split('\n');
  let prefixEnd = -1;
  for (let i = 0; i < Math.min(lines.length, 200); i++) {
    if (lines[i].trim() === '') {
      prefixEnd = i;
      break;
    }
  }
  const prefixes = prefixEnd >= 0 ? lines.slice(0, prefixEnd + 1).join('\n') : '';
  const body = prefixEnd >= 0 ? lines.slice(prefixEnd + 1).join('\n') : content;
  const blocks = body
    .split(/\n\s*\n/g)
    .map((b) => b.trim())
    .filter(Boolean);

  const out: string[] = [];
  let cur = prefixes ? `${prefixes}\n` : '';
  let curBytes = byteLen(cur);

  for (const block of blocks) {
    const piece = `${block}\n\n`;
    const pieceBytes = byteLen(piece);
    if (curBytes > 0 && curBytes + pieceBytes > maxBytes) {
      out.push(cur);
      cur = prefixes ? `${prefixes}\n${piece}` : piece;
      curBytes = byteLen(cur);
      continue;
    }
    cur += piece;
    curBytes += pieceBytes;
  }

  if (cur.trim()) out.push(cur);
  return out;
}

export async function ingestHolTurtleToGraphdb(turtle: string): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const chunks = splitTurtleIntoChunks(turtle, GRAPHDB_UPLOAD_CHUNK_BYTES);
  let totalBytes = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const { bytes } = await uploadTurtleToRepository(baseUrl, repository, auth, {
      turtle: chunk,
      context: HOL_CONTEXT,
    });
    totalBytes += bytes;
    console.info('[hol-sync] uploaded chunk', {
      chunkIndex: i + 1,
      chunkCount: chunks.length,
      bytes,
      totalBytes,
    });
  }

  console.info('[hol-sync] uploaded HOL data', {
    context: HOL_CONTEXT,
    chunks: chunks.length,
    totalBytes,
  });
}
