import { accountIri, escapeTurtleString, feedbackIri, rdfPrefixes, turtleJsonLiteral } from './common.js';
import { emitRawSubgraphRecord } from './emit-raw-record.js';

function normalizeHexFromAccountId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  const last = s.includes(':') ? s.split(':').pop() ?? '' : s;
  const hex = last.trim().toLowerCase();
  return /^0x[0-9a-f]{40}$/.test(hex) ? hex : null;
}

export function emitFeedbacksTurtle(chainId: number, items: any[], minBlockExclusive: bigint): { turtle: string; maxBlock: bigint } {
  const lines: string[] = [rdfPrefixes()];
  let maxBlock = minBlockExclusive;

  for (const fb of items) {
    const id = String(fb?.id ?? '').trim();
    const agentId = String(fb?.agent?.id ?? '').trim();
    const client = String(fb?.clientAddress ?? '').trim();
    const feedbackIndex = Number(fb?.feedbackIndex ?? NaN);
    if (!id || !agentId || !client || !Number.isFinite(feedbackIndex)) continue;

    let blockNum = 0n;
    try {
      blockNum = BigInt(fb?.blockNumber ?? 0);
    } catch {
      blockNum = 0n;
    }
    if (blockNum <= minBlockExclusive) continue;
    if (blockNum > maxBlock) maxBlock = blockNum;

    const agentWallet = normalizeHexFromAccountId(fb?.agent?.agentWallet) || null;
    const agentNode = agentWallet ? accountIri(chainId, agentWallet) : `<https://www.agentictrust.io/id/agent/${chainId}/${encodeURIComponent(agentId).replace(/%/g, '_')}>`;

    const fIri = feedbackIri(chainId, agentId, client, feedbackIndex);
    lines.push(`${fIri} a erc8004:Feedback, prov:Entity ;`);
    lines.push(`  core:agentId "${escapeTurtleString(agentId)}" ;`);
    lines.push(`  core:json ${turtleJsonLiteral(String(fb?.feedbackJson ?? ''))} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Link agent -> reputation assertion if we can
    lines.push(`${agentNode} core:hasReputationAssertion ${fIri} .`);
    lines.push('');

    lines.push(
      emitRawSubgraphRecord({
        chainId,
        kind: 'feedbacks',
        entityId: id,
        cursorValue: blockNum.toString(),
        raw: fb,
        txHash: typeof fb?.txHash === 'string' ? fb.txHash : null,
        blockNumber: fb?.blockNumber ?? null,
        timestamp: fb?.timestamp ?? null,
        recordsEntityIri: fIri,
      }),
    );
    lines.push('');
  }

  return { turtle: lines.join('\n'), maxBlock };
}

