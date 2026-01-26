import { accountIri, associationIri, associationRevocationIri, escapeTurtleString, rdfPrefixes } from './common.js';
import { emitRawSubgraphRecord } from './emit-raw-record.js';

function normalizeHexFromAccountId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  const last = s.includes(':') ? s.split(':').pop() ?? '' : s;
  const hex = last.trim().toLowerCase();
  return /^0x[0-9a-f]{40}$/.test(hex) ? hex : null;
}

export function emitAssociationsTurtle(chainId: number, items: any[], minBlockExclusive: bigint): { turtle: string; maxBlock: bigint } {
  const lines: string[] = [rdfPrefixes()];
  let maxBlock = minBlockExclusive;

  for (const a of items) {
    const assocId = String(a?.id ?? '').trim();
    if (!assocId) continue;

    let blockNum = 0n;
    try {
      blockNum = BigInt(a?.lastUpdatedBlockNumber ?? a?.createdBlockNumber ?? 0);
    } catch {
      blockNum = 0n;
    }
    if (blockNum <= minBlockExclusive) continue;
    if (blockNum > maxBlock) maxBlock = blockNum;

    const iri = associationIri(chainId, assocId);
    lines.push(`${iri} a erc8092:AssociatedAccounts8092, prov:Entity ;`);
    if (a?.interfaceId != null) lines.push(`  erc8092:interfaceId "${escapeTurtleString(String(a.interfaceId))}" ;`);
    const initiatorAccountId = String(a?.initiatorAccount?.id ?? '').trim();
    const approverAccountId = String(a?.approverAccount?.id ?? '').trim();
    if (initiatorAccountId) lines.push(`  erc8092:initiatorAccountId "${escapeTurtleString(initiatorAccountId)}" ;`);
    if (approverAccountId) lines.push(`  erc8092:approverAccountId "${escapeTurtleString(approverAccountId)}" ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    const initiatorHex = normalizeHexFromAccountId(initiatorAccountId);
    const approverHex = normalizeHexFromAccountId(approverAccountId);
    if (initiatorHex) {
      const acct = accountIri(chainId, initiatorHex);
      lines.push(`${acct} erc8092:hasAssociatedAccounts ${iri} .`);
      lines.push('');
    }
    if (approverHex) {
      const acct = accountIri(chainId, approverHex);
      lines.push(`${acct} erc8092:hasAssociatedAccounts ${iri} .`);
      lines.push('');
    }

    lines.push(
      emitRawSubgraphRecord({
        chainId,
        kind: 'associations',
        entityId: assocId,
        cursorValue: blockNum.toString(),
        raw: a,
        txHash: typeof a?.lastUpdatedTxHash === 'string' ? a.lastUpdatedTxHash : typeof a?.createdTxHash === 'string' ? a.createdTxHash : null,
        blockNumber: a?.lastUpdatedBlockNumber ?? a?.createdBlockNumber ?? null,
        timestamp: a?.lastUpdatedTimestamp ?? a?.createdTimestamp ?? null,
        recordsEntityIri: iri,
      }),
    );
    lines.push('');
  }

  return { turtle: lines.join('\n'), maxBlock };
}

export function emitAssociationRevocationsTurtle(chainId: number, items: any[], minBlockExclusive: bigint): { turtle: string; maxBlock: bigint } {
  const lines: string[] = [rdfPrefixes()];
  let maxBlock = minBlockExclusive;

  for (const r of items) {
    const id = String(r?.id ?? '').trim();
    const associationId = String(r?.associationId ?? '').trim();
    if (!id || !associationId) continue;

    let blockNum = 0n;
    try {
      blockNum = BigInt(r?.blockNumber ?? 0);
    } catch {
      blockNum = 0n;
    }
    if (blockNum <= minBlockExclusive) continue;
    if (blockNum > maxBlock) maxBlock = blockNum;

    const iri = associationRevocationIri(chainId, id);
    const assocIri = associationIri(chainId, associationId);
    lines.push(`${iri} a erc8092:AssociatedAccountsRevocation8092, prov:Entity ;`);
    lines.push(`  erc8092:revocationOfAssociatedAccounts ${assocIri} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    lines.push(
      emitRawSubgraphRecord({
        chainId,
        kind: 'association-revocations',
        entityId: id,
        cursorValue: blockNum.toString(),
        raw: r,
        txHash: typeof r?.txHash === 'string' ? r.txHash : null,
        blockNumber: r?.blockNumber ?? null,
        timestamp: r?.timestamp ?? null,
        recordsEntityIri: iri,
      }),
    );
    lines.push('');
  }

  return { turtle: lines.join('\n'), maxBlock };
}

