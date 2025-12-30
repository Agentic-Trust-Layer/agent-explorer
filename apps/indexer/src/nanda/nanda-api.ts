import { fetchWithRetry } from '../net/fetch-with-retry';

export type NandaServerSummary = {
  id: string; // uuid
  name: string;
  slug: string;
  description: string;
  provider: string;
  types?: string[];
  tags?: string[];
  verified?: boolean;
  created_at?: string; // ISO
  updated_at?: string; // ISO
  logo_url?: string;
  rating?: number;
  uptime?: number;
  url: string;
  documentation_url?: string | null;
};

export type NandaPaginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type NandaServerDetail = NandaServerSummary & {
  usage_count?: number;
  version?: string | null;
  protocols?: string[];
  owner_email?: string;
  is_active?: boolean;
  last_checked?: string;
  status?: string;
  capabilities?: Array<{ name?: string; description?: string; type?: string; examples?: string[] }>;
  usage_requirements?: unknown;
};

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    accept: 'application/json',
  };
  const jwt = process.env.NANDA_JWT;
  if (jwt && jwt.trim()) {
    headers['Authorization'] = `Bearer ${jwt.trim()}`;
  }
  return headers;
}

function joinUrl(baseUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const a = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const b = path.startsWith('/') ? path : `/${path}`;
  return `${a}${b}`;
}

export async function fetchNandaServersPage(opts: {
  baseUrl: string;
  page: number;
  limit: number;
  search?: string;
  types?: string; // comma-separated or single ("agent")
  tags?: string; // comma-separated
  verified?: boolean;
}): Promise<NandaPaginated<NandaServerSummary>> {
  const { baseUrl, page, limit, search, types, tags, verified } = opts;
  const url = new URL(joinUrl(baseUrl, '/api/v1/servers/'));
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));
  if (search && search.trim()) url.searchParams.set('search', search.trim());
  if (types && types.trim()) url.searchParams.set('types', types.trim());
  if (tags && tags.trim()) url.searchParams.set('tags', tags.trim());
  if (typeof verified === 'boolean') url.searchParams.set('verified', verified ? 'true' : 'false');

  const res = await fetchWithRetry(
    url.toString(),
    { method: 'GET', headers: buildHeaders() },
    {
    timeoutMs: Number(process.env.NANDA_HTTP_TIMEOUT_MS ?? 45_000) || 45_000,
    retries: Number(process.env.NANDA_HTTP_RETRIES ?? 6) || 6,
    retryOnStatuses: [429, 500, 502, 503, 504],
    minBackoffMs: 750,
    maxBackoffMs: 30_000,
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`NANDA API error ${res.status}: ${text || res.statusText}`);
  }

  // Observed shapes:
  // 1) OpenAPI claims: { count, next, previous, results }
  // 2) Live response: { data: [...], pagination: { total, per_page, current_page, last_page, next_page_url, prev_page_url } }
  const json: any = await res.json();

  if (Array.isArray(json?.results)) {
    return json as NandaPaginated<NandaServerSummary>;
  }

  const data = Array.isArray(json?.data) ? (json.data as NandaServerSummary[]) : [];
  const pagination = json?.pagination || {};
  const total = Number(pagination?.total ?? NaN);
  const nextUrl = typeof pagination?.next_page_url === 'string' ? pagination.next_page_url : null;
  const prevUrl = typeof pagination?.prev_page_url === 'string' ? pagination.prev_page_url : null;

  // Normalize into the OpenAPI shape our importer expects.
  return {
    count: Number.isFinite(total) ? total : data.length,
    next: nextUrl,
    previous: prevUrl,
    results: data,
  };
}

export async function fetchNandaServerDetail(opts: {
  baseUrl: string;
  id: string;
}): Promise<NandaServerDetail> {
  const { baseUrl, id } = opts;
  const url = joinUrl(baseUrl, `/api/v1/servers/${encodeURIComponent(id)}/`);
  const res = await fetchWithRetry(
    url,
    { method: 'GET', headers: buildHeaders() },
    {
    timeoutMs: Number(process.env.NANDA_HTTP_TIMEOUT_MS ?? 45_000) || 45_000,
    retries: Number(process.env.NANDA_HTTP_RETRIES ?? 6) || 6,
    retryOnStatuses: [429, 500, 502, 503, 504],
    minBackoffMs: 750,
    maxBackoffMs: 30_000,
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`NANDA API error ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as NandaServerDetail;
}

export type NandaDiscoverySearchItem = NandaServerSummary & {
  relevance_score?: number;
  highlight?: unknown;
};

export type NandaDiscoverySearchPage = {
  results: NandaDiscoverySearchItem[];
  nextPage: number | null;
};

export async function fetchNandaDiscoverySearchPage(opts: {
  baseUrl: string;
  q: string;
  page: number;
  limit: number;
  tags?: string;
  type?: string;
  verified?: boolean;
}): Promise<NandaDiscoverySearchPage> {
  const { baseUrl, q, page, limit, tags, type, verified } = opts;
  const url = new URL(joinUrl(baseUrl, '/api/v1/discovery/search/'));
  url.searchParams.set('q', q);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));
  if (tags && tags.trim()) url.searchParams.set('tags', tags.trim());
  if (type && type.trim()) url.searchParams.set('type', type.trim());
  if (typeof verified === 'boolean') url.searchParams.set('verified', verified ? 'true' : 'false');

  const res = await fetchWithRetry(
    url.toString(),
    { method: 'GET', headers: buildHeaders() },
    {
      timeoutMs: Number(process.env.NANDA_HTTP_TIMEOUT_MS ?? 45_000) || 45_000,
      retries: Number(process.env.NANDA_HTTP_RETRIES ?? 6) || 6,
      retryOnStatuses: [429, 500, 502, 503, 504],
      minBackoffMs: 750,
      maxBackoffMs: 30_000,
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`NANDA API error ${res.status}: ${text || res.statusText}`);
  }

  const json: any = await res.json();

  // Observed shapes:
  // 1) OpenAPI claims: array of ServerSearchResult
  // 2) Live response example: { data: [...], pagination: { current_page, last_page, next_page_url } }
  if (Array.isArray(json)) {
    return { results: json as NandaDiscoverySearchItem[], nextPage: (json as any[]).length ? page + 1 : null };
  }

  const data = Array.isArray(json?.data) ? json.data : Array.isArray(json?.results) ? json.results : [];
  const pagination = json?.pagination || {};
  const current = Number(pagination?.current_page ?? NaN);
  const last = Number(pagination?.last_page ?? NaN);
  const nextUrl = typeof pagination?.next_page_url === 'string' ? pagination.next_page_url : null;

  // Prefer explicit pagination numbers; fall back to next_page_url presence.
  let nextPage: number | null = null;
  if (Number.isFinite(current) && Number.isFinite(last)) {
    nextPage = current < last ? current + 1 : null;
  } else if (nextUrl) {
    nextPage = page + 1;
  }

  return { results: data as NandaDiscoverySearchItem[], nextPage };
}


