type GraphdbAuth = { username: string; password: string } | null;

function envString(key: string): string | null {
  const v = (globalThis as any)?.process?.env?.[key];
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function cfAccessHeaders(): Record<string, string> {
  const clientId = envString('GRAPHDB_CF_ACCESS_CLIENT_ID');
  const clientSecret = envString('GRAPHDB_CF_ACCESS_CLIENT_SECRET');
  if (!clientId || !clientSecret) return {};
  return {
    'CF-Access-Client-Id': clientId,
    'CF-Access-Client-Secret': clientSecret,
  };
}

export function getGraphdbConfigFromEnv(): {
  baseUrl: string;
  repository: string;
  auth: GraphdbAuth;
} {
  const baseUrl = envString('GRAPHDB_BASE_URL') ?? 'https://graphdb.agentkg.io';
  const repository = envString('GRAPHDB_REPOSITORY') ?? 'agentkg';
  const user = envString('GRAPHDB_USERNAME');
  const pass = envString('GRAPHDB_PASSWORD');
  const auth = user && pass ? { username: user, password: pass } : null;
  return { baseUrl, repository, auth };
}

function basicAuthHeader(auth: GraphdbAuth): string | null {
  if (!auth) return null;
  // Node runtime: Buffer exists; keep this loosely typed so TS doesn't require @types/node.
  const B = (globalThis as any).Buffer;
  const token = B ? B.from(`${auth.username}:${auth.password}`, 'utf8').toString('base64') : '';
  return token ? `Basic ${token}` : null;
}

function joinUrl(baseUrl: string, path: string): string {
  const b = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

async function graphdbFetch(
  url: string,
  init: RequestInit & { timeoutMs?: number; auth?: GraphdbAuth } = {},
): Promise<Response> {
  const timeoutMs = Number.isFinite(Number(init.timeoutMs)) && Number(init.timeoutMs) > 0 ? Number(init.timeoutMs) : 60_000;
  const controller = new AbortController();
  const t = setTimeout(() => {
    try {
      controller.abort();
    } catch {}
  }, timeoutMs);
  try {
    const headers = new Headers(init.headers || {});
    const authHeader = basicAuthHeader(init.auth ?? null);
    if (authHeader) headers.set('Authorization', authHeader);
    const accessHeaders = cfAccessHeaders();
    if (accessHeaders['CF-Access-Client-Id']) headers.set('CF-Access-Client-Id', accessHeaders['CF-Access-Client-Id']);
    if (accessHeaders['CF-Access-Client-Secret']) headers.set('CF-Access-Client-Secret', accessHeaders['CF-Access-Client-Secret']);
    return await fetch(url, { ...init, headers, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function updateGraphdb(
  baseUrl: string,
  repository: string,
  auth: GraphdbAuth,
  sparqlUpdate: string,
): Promise<void> {
  const url = joinUrl(baseUrl, `/repositories/${encodeURIComponent(repository)}/statements`);
  const res = await graphdbFetch(url, {
    method: 'POST',
    auth,
    timeoutMs: 60_000,
    headers: {
      'Content-Type': 'application/sparql-update',
    },
    body: sparqlUpdate,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GraphDB SPARQL update failed: HTTP ${res.status}${text ? `: ${text.slice(0, 800)}` : ''}`);
  }
}

export async function listRepositories(baseUrl: string, auth: GraphdbAuth): Promise<string[]> {
  const url = joinUrl(baseUrl, '/rest/repositories');
  const res = await graphdbFetch(url, { method: 'GET', auth, timeoutMs: 30_000 });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GraphDB list repositories failed: HTTP ${res.status}${text ? `: ${text.slice(0, 300)}` : ''}`);
  }
  const json = await res.json().catch(() => null);
  if (!Array.isArray(json)) return [];
  return json
    .map((r: any) => (r && typeof r.id === 'string' ? r.id : null))
    .filter((x: any) => typeof x === 'string' && x.trim());
}

export async function ensureRepositoryExistsOrThrow(baseUrl: string, repository: string, auth: GraphdbAuth): Promise<void> {
  const repos = await listRepositories(baseUrl, auth);
  if (repos.includes(repository)) return;
  throw new Error(
    `GraphDB repository not found: ${repository}\n` +
      `Create it in the Workbench: ${joinUrl(baseUrl, '/')} (Setup → Repositories)\n` +
      `Or set GRAPHDB_REPOSITORY to an existing repository id.`,
  );
}

export async function clearStatements(
  baseUrl: string,
  repository: string,
  auth: GraphdbAuth,
  opts?: { context?: string | null },
): Promise<void> {
  const context = opts?.context && opts.context.trim() ? opts.context.trim() : null;
  const qs = context ? `?context=${encodeURIComponent(`<${context}>`)}` : '';
  const url = joinUrl(baseUrl, `/repositories/${encodeURIComponent(repository)}/statements${qs}`);
  const res = await graphdbFetch(url, { method: 'DELETE', auth, timeoutMs: 120_000 });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GraphDB clear failed: HTTP ${res.status}${text ? `: ${text.slice(0, 300)}` : ''}`);
  }
}

export async function uploadTurtleToRepository(
  baseUrl: string,
  repository: string,
  auth: GraphdbAuth,
  params: { turtle: string; context?: string | null },
): Promise<{ bytes: number }> {
  const context = params.context && params.context.trim() ? params.context.trim() : null;
  const qs = context ? `?context=${encodeURIComponent(`<${context}>`)}` : '';
  const url = joinUrl(baseUrl, `/repositories/${encodeURIComponent(repository)}/statements${qs}`);
  const bytes = ((globalThis as any).Buffer ? (globalThis as any).Buffer.byteLength(params.turtle, 'utf8') : params.turtle.length) as number;

  const res = await graphdbFetch(url, {
    method: 'POST',
    auth,
    timeoutMs: 10 * 60_000,
    headers: {
      'Content-Type': 'text/turtle',
      'Content-Length': String(bytes),
    },
    body: params.turtle,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GraphDB upload failed (inline turtle): HTTP ${res.status}${text ? `: ${text.slice(0, 1000)}` : ''}`);
  }
  return { bytes };
}

export async function queryGraphdb(
  baseUrl: string,
  repository: string,
  auth: GraphdbAuth,
  sparql: string,
): Promise<any> {
  const url = joinUrl(baseUrl, `/repositories/${encodeURIComponent(repository)}`);
  const res = await graphdbFetch(url, {
    method: 'POST',
    auth,
    timeoutMs: 30_000,
    headers: {
      'Content-Type': 'application/sparql-query',
      Accept: 'application/sparql-results+json',
    },
    body: sparql,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GraphDB SPARQL query failed: HTTP ${res.status}${text ? `: ${text.slice(0, 500)}` : ''}`);
  }
  return res.json();
}

