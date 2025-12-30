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

function joinUrl(baseUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const a = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const b = path.startsWith('/') ? path : `/${path}`;
  return `${a}${b}`;
}

export async function fetchHolSearchPage(opts: {
  baseUrl?: string; // default https://hol.org
  page: number;
  limit: number;
  registry?: string;
  capability?: string;
  trust?: string;
  q?: string;
}): Promise<HolSearchResponse> {
  const baseUrl = (opts.baseUrl || process.env.HOL_BASE_URL || 'https://hol.org').trim();
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


