export type ParsedUaid = {
  uaid: string;
  kind: 'aid' | 'did' | 'other';
  primaryId: string;
  routeRaw: string | null;
  routeParams: Record<string, string>;
  chainId: number | null;
};

function parseRouteParams(routeRaw: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  const raw = typeof routeRaw === 'string' ? routeRaw.trim() : '';
  if (!raw) return out;
  for (const seg of raw.split(';')) {
    const s = seg.trim();
    if (!s) continue;
    const eq = s.indexOf('=');
    if (eq <= 0) continue;
    const k = s.slice(0, eq).trim();
    const v = s.slice(eq + 1).trim();
    if (!k || !v) continue;
    if (!(k in out)) out[k] = v;
  }
  return out;
}

export function parseUaidString(input: unknown, fallbackPrimaryId: string, holChainId = 295): ParsedUaid {
  const raw = typeof input === 'string' ? input.trim() : '';
  const uaid = raw && raw.startsWith('uaid:') ? raw : raw ? `uaid:${raw}` : `uaid:aid:${fallbackPrimaryId}`;

  const afterPrefix = uaid.startsWith('uaid:') ? uaid.slice('uaid:'.length) : uaid;
  const semi = afterPrefix.indexOf(';');
  const head = (semi >= 0 ? afterPrefix.slice(0, semi) : afterPrefix).trim();
  const routeRaw = semi >= 0 ? afterPrefix.slice(semi + 1).trim() : null;
  const routeParams = parseRouteParams(routeRaw);

  if (head.startsWith('aid:')) {
    const primaryId = head.slice('aid:'.length).trim() || fallbackPrimaryId;
    return { uaid, kind: 'aid', primaryId, routeRaw: routeRaw || null, routeParams, chainId: holChainId };
  }

  if (head.startsWith('did:')) {
    const did = head.trim();
    // did:<method>:<chainId>:... (try to read numeric chainId from segment 3)
    const parts = did.split(':');
    const chainIdRaw = parts.length >= 3 ? parts[2] : '';
    const chainIdNum = /^\d+$/.test(chainIdRaw) ? Number(chainIdRaw) : NaN;
    const chainId = Number.isFinite(chainIdNum) ? Math.trunc(chainIdNum) : null;
    return { uaid, kind: 'did', primaryId: did, routeRaw: routeRaw || null, routeParams, chainId };
  }

  return {
    uaid,
    kind: 'other',
    primaryId: head || fallbackPrimaryId,
    routeRaw: routeRaw || null,
    routeParams,
    chainId: null,
  };
}

