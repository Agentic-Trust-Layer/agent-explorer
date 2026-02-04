import { fetchWithRetry } from '../net/fetch-with-retry';

export type HolSearchHit = {
  id: string;
  originalId?: string;
  uaid?: string;
  registry?: string;
  name?: string;
  description?: string;
  capabilities?: unknown[];
  protocols?: unknown[];
  endpoints?: unknown[];
  metadata?: unknown;
  profile?: unknown;
  createdAt?: string;
  updatedAt?: string;
  adapter?: unknown;
  lastIndexed?: string;
  lastSeen?: string;
  available?: boolean;
  trustScore?: number;
  trustScores?: unknown;
};

export type HolSearchResponse = {
  hits: HolSearchHit[];
  total: number;
  page: number;
  limit: number;
  totalBeforeFilters?: number;
  totalAvailable?: number;
  limited?: boolean;
  visible?: number;
  facets?: unknown;
  filterAggregations?: unknown;
};

export type HolCapability = {
  key: string;
  label: string;
  raw: unknown;
};

function joinUrl(baseUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const a = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const b = path.startsWith('/') ? path : `/${path}`;
  return `${a}${b}`;
}

function normalizeCapabilityKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function fetchHolCapabilities(opts?: { baseUrl?: string }): Promise<HolCapability[]> {
  // Hard-coded HOL site base URL (do not use env overrides by default)
  const baseUrl = opts?.baseUrl && opts.baseUrl.trim() ? opts.baseUrl.trim() : 'https://hol.org';
  const url = new URL(joinUrl(baseUrl, '/api/v1/capabilities'));

  const res = await fetchWithRetry(
    url.toString(),
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    },
    {
      timeoutMs: Number(process.env.HOL_HTTP_TIMEOUT_MS ?? 45_000) || 45_000,
      retries: Number(process.env.HOL_HTTP_RETRIES ?? 12) || 12,
      retryOnStatuses: [429, 500, 502, 503, 504],
      minBackoffMs: 750,
      maxBackoffMs: 60_000,
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HOL API error ${res.status}: ${text || res.statusText}`);
  }

  const json: any = await res.json();
  const items: any[] = Array.isArray(json)
    ? json
    : Array.isArray(json?.capabilities)
      ? json.capabilities
      : Array.isArray(json?.items)
        ? json.items
        : [];

  const out: HolCapability[] = [];
  for (const it of items) {
    if (typeof it === 'string') {
      const label = it.trim();
      if (!label) continue;
      out.push({ key: normalizeCapabilityKey(label) || label, label, raw: it });
      continue;
    }
    if (!it || typeof it !== 'object') continue;
    const label =
      (typeof it.label === 'string' && it.label.trim() ? it.label.trim() : null) ||
      (typeof it.name === 'string' && it.name.trim() ? it.name.trim() : null) ||
      (typeof it.capability === 'string' && it.capability.trim() ? it.capability.trim() : null) ||
      null;
    const keyRaw =
      (typeof it.key === 'string' && it.key.trim() ? it.key.trim() : null) ||
      (typeof it.id === 'string' && it.id.trim() ? it.id.trim() : null) ||
      label ||
      null;
    if (!keyRaw) continue;
    const key = normalizeCapabilityKey(keyRaw) || keyRaw;
    out.push({ key, label: label || keyRaw, raw: it });
  }

  // De-dup by key, prefer first
  const seen = new Set<string>();
  return out.filter((c) => {
    if (!c.key) return false;
    if (seen.has(c.key)) return false;
    seen.add(c.key);
    return true;
  });
}

export async function fetchHolSearchPage(opts: {
  baseUrl?: string; // ignored (hard-coded to https://hol.org)
  page: number;
  limit: number;
  registry?: string;
  capability?: string;
  trust?: string;
  q?: string;
}): Promise<HolSearchResponse> {
  // Hard-coded HOL site base URL (do not use env overrides)
  const baseUrl = 'https://hol.org';
  const url = new URL(joinUrl(baseUrl, '/api/v1/search'));
  url.searchParams.set('page', String(opts.page));
  url.searchParams.set('limit', String(opts.limit));
  if (opts.registry && opts.registry.trim()) url.searchParams.set('registry', opts.registry.trim());
  if (opts.capability && opts.capability.trim()) url.searchParams.set('capability', opts.capability.trim());
  if (opts.trust && opts.trust.trim()) url.searchParams.set('trust', opts.trust.trim());
  if (opts.q && opts.q.trim()) url.searchParams.set('q', opts.q.trim());

  const res = await fetchWithRetry(
    url.toString(),
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    },
    {
      timeoutMs: Number(process.env.HOL_HTTP_TIMEOUT_MS ?? 45_000) || 45_000,
      retries: Number(process.env.HOL_HTTP_RETRIES ?? 12) || 12,
      retryOnStatuses: [429, 500, 502, 503, 504],
      minBackoffMs: 750,
      maxBackoffMs: 60_000,
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HOL API error ${res.status}: ${text || res.statusText}`);
  }

  const json: any = await res.json();
  if (!json || typeof json !== 'object' || !Array.isArray(json.hits)) {
    throw new Error('HOL API returned unexpected shape for /api/v1/search');
  }
  return json as HolSearchResponse;
}


