import { accountIri, escapeTurtleString, rdfPrefixes, turtleJsonLiteral, validationRequestIri, validationResponseIri } from './common.js';
import { emitRawSubgraphRecord } from './emit-raw-record.js';

function normalizeHexFromAccountId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  const last = s.includes(':') ? s.split(':').pop() ?? '' : s;
  const hex = last.trim().toLowerCase();
  return /^0x[0-9a-f]{40}$/.test(hex) ? hex : null;
}

export function emitValidationRequestsTurtle(chainId: number, items: any[], minBlockExclusive: bigint): { turtle: string; maxBlock: bigint } {
  const lines: string[] = [rdfPrefixes()];
  let maxBlock = minBlockExclusive;

  for (const vr of items) {
    const id = String(vr?.id ?? '').trim();
    const agentId = String(vr?.agent?.id ?? '').trim();
    if (!id || !agentId) continue;
    let blockNum = 0n;
    try {
      blockNum = BigInt(vr?.blockNumber ?? 0);
    } catch {
      blockNum = 0n;
    }
    if (blockNum <= minBlockExclusive) continue;
    if (blockNum > maxBlock) maxBlock = blockNum;

    const iri = validationRequestIri(chainId, id);
    lines.push(`${iri} a erc8004:ValidationRequestSituation, prov:Entity ;`);
    lines.push(`  core:agentId "${escapeTurtleString(agentId)}" ;`);
    if (vr?.requestJson != null) lines.push(`  core:json ${turtleJsonLiteral(String(vr.requestJson))} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    lines.push(
      emitRawSubgraphRecord({
        chainId,
        kind: 'validation-requests',
        entityId: id,
        cursorValue: blockNum.toString(),
        raw: vr,
        txHash: typeof vr?.txHash === 'string' ? vr.txHash : null,
        blockNumber: vr?.blockNumber ?? null,
        timestamp: vr?.timestamp ?? null,
        recordsEntityIri: iri,
      }),
    );
    lines.push('');
  }

  return { turtle: lines.join('\n'), maxBlock };
}

export function emitValidationResponsesTurtle(chainId: number, items: any[], minBlockExclusive: bigint): { turtle: string; maxBlock: bigint } {
  const lines: string[] = [rdfPrefixes()];
  let maxBlock = minBlockExclusive;

  for (const vr of items) {
    const id = String(vr?.id ?? '').trim();
    const agentId = String(vr?.agent?.id ?? '').trim();
    if (!id || !agentId) continue;
    let blockNum = 0n;
    try {
      blockNum = BigInt(vr?.blockNumber ?? 0);
    } catch {
      blockNum = 0n;
    }
    if (blockNum <= minBlockExclusive) continue;
    if (blockNum > maxBlock) maxBlock = blockNum;

    const iri = validationResponseIri(chainId, id);
    lines.push(`${iri} a erc8004:ValidationResponse, prov:Entity ;`);
    lines.push(`  core:agentId "${escapeTurtleString(agentId)}" ;`);
    if (vr?.responseJson != null) lines.push(`  core:json ${turtleJsonLiteral(String(vr.responseJson))} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    const agentWallet = normalizeHexFromAccountId(vr?.agent?.agentWallet);
    if (agentWallet) {
      const agentNode = accountIri(chainId, agentWallet);
      lines.push(`${agentNode} core:hasVerificationAssertion ${iri} .`);
      lines.push('');
    }

    lines.push(
      emitRawSubgraphRecord({
        chainId,
        kind: 'validation-responses',
        entityId: id,
        cursorValue: blockNum.toString(),
        raw: vr,
        txHash: typeof vr?.txHash === 'string' ? vr.txHash : null,
        blockNumber: vr?.blockNumber ?? null,
        timestamp: vr?.timestamp ?? null,
        recordsEntityIri: iri,
      }),
    );
    lines.push('');
  }

  return { turtle: lines.join('\n'), maxBlock };
}

