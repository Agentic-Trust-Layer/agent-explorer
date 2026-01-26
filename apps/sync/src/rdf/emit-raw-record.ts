import { escapeTurtleString, subgraphIngestRecordIri, turtleJsonLiteral } from './common.js';

export function emitRawSubgraphRecord(opts: {
  chainId: number;
  kind: string;
  entityId: string;
  cursorValue: string;
  raw: unknown;
  txHash?: string | null;
  blockNumber?: number | string | null;
  timestamp?: number | string | null;
  recordsEntityIri: string;
}): string {
  const {
    chainId,
    kind,
    entityId,
    cursorValue,
    raw,
    txHash,
    blockNumber,
    timestamp,
    recordsEntityIri,
  } = opts;

  const iri = subgraphIngestRecordIri(chainId, kind, entityId);
  const lines: string[] = [];
  lines.push(`${iri} a erc8004:SubgraphIngestRecord, prov:Entity ;`);
  lines.push(`  erc8004:subgraphChainId ${chainId} ;`);
  lines.push(`  erc8004:subgraphSource "thegraph" ;`);
  lines.push(`  erc8004:subgraphEntityKind "${escapeTurtleString(kind)}" ;`);
  lines.push(`  erc8004:subgraphEntityId "${escapeTurtleString(entityId)}" ;`);
  lines.push(`  erc8004:subgraphCursorValue "${escapeTurtleString(cursorValue)}" ;`);
  lines.push(`  erc8004:recordsEntity ${recordsEntityIri} ;`);

  try {
    const json = JSON.stringify(raw ?? null);
    lines.push(`  erc8004:subgraphRawJson ${turtleJsonLiteral(json)} ;`);
  } catch {}

  const tx = typeof txHash === 'string' ? txHash.trim() : '';
  if (tx) lines.push(`  erc8004:subgraphTxHash "${escapeTurtleString(tx)}" ;`);

  const bn = blockNumber != null ? Number(blockNumber) : NaN;
  if (Number.isFinite(bn) && bn > 0) lines.push(`  erc8004:subgraphBlockNumber ${Math.trunc(bn)} ;`);

  const ts = timestamp != null ? Number(timestamp) : NaN;
  if (Number.isFinite(ts) && ts > 0) lines.push(`  erc8004:subgraphTimestamp ${Math.trunc(ts)} ;`);

  // Replace trailing ';' with '.'
  const last = lines[lines.length - 1];
  lines[lines.length - 1] = last.replace(/ ;$/, ' .');
  return lines.join('\n') + '\n';
}

