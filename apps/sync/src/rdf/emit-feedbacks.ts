import { agentIri, escapeTurtleString, feedbackIri, rdfPrefixes, turtleJsonLiteral } from './common.js';
import { emitRawSubgraphRecord } from './emit-raw-record.js';

function clampInt(n: number, min: number, max: number): number {
  const x = Number.isFinite(n) ? Math.trunc(n) : 0;
  return Math.max(min, Math.min(max, x));
}

function parseFeedbackSignals(feedbackJsonRaw: unknown): { ratingPct: number | null; score: number | null } {
  const raw = typeof feedbackJsonRaw === 'string' ? feedbackJsonRaw.trim() : '';
  if (!raw) return { ratingPct: null, score: null };
  try {
    const obj: any = JSON.parse(raw);

    // Prefer explicit percent fields.
    const rp =
      obj?.ratingPct ?? obj?.rating_pct ?? obj?.ratingPercent ?? obj?.rating_percent ?? obj?.rating_percentage ?? obj?.ratingPercentage;
    if (rp != null) {
      const n = Number(rp);
      if (Number.isFinite(n)) return { ratingPct: clampInt(n, 0, 100), score: null };
    }

    // Fall back to a 0..5 score if present.
    const sc = obj?.score ?? obj?.rating ?? obj?.stars ?? obj?.starsRating ?? obj?.stars_rating;
    if (sc != null) {
      const n = Number(sc);
      if (Number.isFinite(n)) {
        const score = Math.max(0, Math.min(5, n));
        return { ratingPct: clampInt(Math.round((score / 5) * 100), 0, 100), score };
      }
    }
  } catch {
    // ignore parse failures
  }
  return { ratingPct: null, score: null };
}

function turtleIri(value: string): string {
  const v = String(value || '').trim();
  if (!v) return '<https://www.agentictrust.io/id/unknown>';
  if (v.startsWith('<') && v.endsWith('>')) return v;
  if (/^https?:\/\//i.test(v)) return `<${v}>`;
  return v; // assume prefixed name
}

function normalizeHexFromAccountId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  const last = s.includes(':') ? s.split(':').pop() ?? '' : s;
  const hex = last.trim().toLowerCase();
  return /^0x[0-9a-f]{40}$/.test(hex) ? hex : null;
}

export function extractAgentIdFromFeedbackRow(fb: any): string | null {
  // Preferred: agent relation id (when subgraph rows are well-formed)
  const rel = typeof fb?.agent?.id === 'string' ? fb.agent.id.trim() : '';
  if (rel) return rel;

  // Fallback: sepolia subgraph uses "<txOrHash>-<agentId>" ids (agentId is numeric string).
  const id = typeof fb?.id === 'string' ? fb.id.trim() : '';
  if (id) {
    const m = id.match(/-(\d+)$/);
    if (m?.[1]) return m[1];
  }

  // Last resort: sometimes agentId is embedded in JSON payloads.
  const jsonRaw = typeof fb?.feedbackJson === 'string' ? fb.feedbackJson.trim() : '';
  if (jsonRaw) {
    try {
      const obj: any = JSON.parse(jsonRaw);
      const v = obj?.agentId ?? obj?.agent_id ?? obj?.agent ?? null;
      const s = typeof v === 'string' ? v.trim() : typeof v === 'number' && Number.isFinite(v) ? String(Math.trunc(v)) : '';
      if (/^\d+$/.test(s)) return s;
    } catch {
      // ignore
    }
  }

  return null;
}

export function emitFeedbacksTurtle(
  chainId: number,
  items: any[],
  minBlockExclusive: bigint,
  agentIriByDidIdentity?: Map<string, string>,
): { turtle: string; maxBlock: bigint } {
  const lines: string[] = [rdfPrefixes()];
  let maxBlock = minBlockExclusive;

  for (const fb of items) {
    const id = String(fb?.id ?? '').trim();
    const agentId = extractAgentIdFromFeedbackRow(fb);
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

    const didIdentity = `did:8004:${chainId}:${agentId}`;
    const agentNodeRaw = agentIriByDidIdentity?.get(didIdentity) ?? agentIri(chainId, agentId);
    const agentNode = turtleIri(agentNodeRaw);

    const fIri = feedbackIri(chainId, agentId, client, feedbackIndex);
    lines.push(`${fIri} a erc8004:Feedback, prov:Entity ;`);
    lines.push(`  core:agentId "${escapeTurtleString(agentId)}" ;`);
    const feedbackJson = String(fb?.feedbackJson ?? '');
    const signals = parseFeedbackSignals(feedbackJson);
    lines.push(`  core:json ${turtleJsonLiteral(feedbackJson)} ;`);
    if (signals.ratingPct != null) lines.push(`  erc8004:feedbackRatingPct ${signals.ratingPct} ;`);
    if (signals.score != null) lines.push(`  erc8004:feedbackScore "${signals.score}"^^xsd:decimal ;`);
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

