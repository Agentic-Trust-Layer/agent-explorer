import { fetchWithRetry } from '../net/fetch-with-retry';

export type AgentverseAgent = Record<string, unknown>;

export type AgentversePage<T> = {
  results?: T[];
  data?: T[];
  items?: T[];
  agents?: T[];
  count?: number;
  total?: number;
  next?: string | null;
  previous?: string | null;
  page?: number;
  limit?: number;
};

function joinUrl(baseUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const a = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const b = path.startsWith('/') ? path : `/${path}`;
  return `${a}${b}`;
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { accept: 'application/json' };
  const jwt = process.env.AGENTVERSE_JWT;
  if (jwt && jwt.trim()) {
    // Allow user to provide either raw token or full "Bearer ..."
    headers['Authorization'] = jwt.trim().toLowerCase().startsWith('bearer ') ? jwt.trim() : `Bearer ${jwt.trim()}`;
  }
  return headers;
}

export async function fetchAgentverseAgentsPage(opts: {
  baseUrl?: string; // default https://agentverse.ai
  page: number;
  limit: number;
}): Promise<AgentversePage<AgentverseAgent>> {
  const baseUrl = (opts.baseUrl || process.env.AGENTVERSE_BASE_URL || 'https://agentverse.ai').trim();
  const url = new URL(joinUrl(baseUrl, '/v1/agents'));
  url.searchParams.set('page', String(opts.page));
  url.searchParams.set('limit', String(opts.limit));

  const res = await fetchWithRetry(
    url.toString(),
    { method: 'GET', headers: buildHeaders() },
    {
      timeoutMs: Number(process.env.AGENTVERSE_HTTP_TIMEOUT_MS ?? 45_000) || 45_000,
      retries: Number(process.env.AGENTVERSE_HTTP_RETRIES ?? 6) || 6,
      retryOnStatuses: [429, 500, 502, 503, 504],
      minBackoffMs: 750,
      maxBackoffMs: 30_000,
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Agentverse API error ${res.status}: ${text || res.statusText}`);
  }

  const json: any = await res.json();
  if (!json || typeof json !== 'object') {
    throw new Error('Agentverse API returned unexpected shape for /v1/agents');
  }
  if (process.env.DEBUG_AGENTVERSE_API === '1') {
    const keys = Object.keys(json).slice(0, 50);
    console.info('[agentverse-api] /v1/agents keys', { page: opts.page, limit: opts.limit, keys });
  }
  return json as AgentversePage<AgentverseAgent>;
}


