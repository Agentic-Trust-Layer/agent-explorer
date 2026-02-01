export type KbResolvedAgentRef = {
  uaid: string;
  did: string;
  chainId: number;
  agentIri: string;
  did8004: string | null;
  agentId8004: number | null;
};

function iriEncodeSegment(value: string): string {
  // Must match sync's IRI encoding (encodeURIComponent + '%' => '_').
  return encodeURIComponent(String(value)).replace(/%/g, '_');
}

export function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

export function stripUaidPrefix(uaid: string): string {
  const s = String(uaid || '').trim();
  // UAID is required to start with "uaid:" everywhere in KB codepaths.
  if (!s.startsWith('uaid:')) throw new Error(`Invalid UAID: expected prefix "uaid:". Received "${s}".`);
  return s.slice('uaid:'.length);
}

export function parseUaidToResolvedAgentRef(uaidInput: string): KbResolvedAgentRef {
  const uaid = String(uaidInput || '').trim();
  if (!uaid || !uaid.startsWith('uaid:')) {
    throw new Error(`Invalid UAID: expected "uaid:*" (must start with "uaid:"). Received "${uaid}".`);
  }
  const did = stripUaidPrefix(uaid);
  if (!did.startsWith('did:')) {
    throw new Error(`Invalid UAID: expected "uaid:did:*". Received "${uaid}".`);
  }

  const m8004 = did.match(/^did:8004:(\d+):(\d+)$/);
  if (m8004?.[1] && m8004?.[2]) {
    const chainId = Number(m8004[1]);
    const agentId8004 = Number(m8004[2]);
    if (!Number.isFinite(chainId) || !Number.isFinite(agentId8004)) {
      throw new Error(`Invalid did:8004 in UAID: "${uaid}".`);
    }
    const c = Math.trunc(chainId);
    const a = Math.trunc(agentId8004);
    return {
      uaid,
      did,
      chainId: c,
      agentIri: `https://www.agentictrust.io/id/agent/${c}/${iriEncodeSegment(String(a))}`,
      did8004: did,
      agentId8004: a,
    };
  }

  const mEthr = did.match(/^did:ethr:(\d+):(0x[0-9a-fA-F]{40})$/);
  if (mEthr?.[1] && mEthr?.[2]) {
    const chainId = Number(mEthr[1]);
    if (!Number.isFinite(chainId)) {
      throw new Error(`Invalid did:ethr chainId in UAID: "${uaid}".`);
    }
    const c = Math.trunc(chainId);
    return {
      uaid,
      did,
      chainId: c,
      agentIri: `https://www.agentictrust.io/id/agent/by-account-did/${iriEncodeSegment(did)}`,
      did8004: null,
      agentId8004: null,
    };
  }

  // Support did:ethr without an explicit chainId, but we can't derive the KB graph context.
  if (/^did:ethr:0x[0-9a-fA-F]{40}$/.test(did)) {
    throw new Error(
      `Unsupported UAID for KB queries: "${uaid}". ` +
        'did:ethr must include a numeric chainId, e.g. "uaid:did:ethr:1:0xabc...".',
    );
  }

  throw new Error(`Unsupported UAID DID method for KB queries: "${uaid}".`);
}

