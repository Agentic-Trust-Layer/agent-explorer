type GraphdbAuth = { username: string; password: string } | null;

function envString(key: string): string | null {
  const v = (globalThis as any)?.process?.env?.[key];
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableNetworkError(err: unknown): boolean {
  const anyErr = err as any;
  const name = String(anyErr?.name || '');
  const code = String(anyErr?.code || '');
  const causeCode = String(anyErr?.cause?.code || '');
  const message = String(anyErr?.message || '');
  const lower = message.toLowerCase();
  if (name === 'AbortError') return true;
  if (code === 'ETIMEDOUT') return true;
  if (code === 'ECONNRESET') return true;
  if (code === 'EAI_AGAIN') return true;
  if (code === 'ENOTFOUND') return true;
  if (code === 'ECONNREFUSED') return true;
  if (causeCode === 'UND_ERR_SOCKET') return true;
  if (causeCode === 'ECONNRESET') return true;
  if (causeCode === 'ETIMEDOUT') return true;
  if (lower.includes('fetch failed')) return true;
  if (lower.includes('connect timeout')) return true;
  if (lower.includes('socket hang up')) return true;
  if (lower.includes('econnreset')) return true;
  if (lower.includes('und_err_socket')) return true;
  if (lower.includes('other side closed')) return true;
  return false;
}

function computeBackoffMs(attempt: number, minBackoffMs: number, maxBackoffMs: number): number {
  const exp = Math.min(maxBackoffMs, minBackoffMs * Math.pow(2, attempt));
  const jitter = Math.floor(Math.random() * Math.min(250, Math.max(50, Math.floor(exp * 0.1))));
  return Math.min(maxBackoffMs, exp + jitter);
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
  init: RequestInit & { timeoutMs?: number; auth?: GraphdbAuth; retries?: number } = {},
): Promise<Response> {
  // Why timeouts?
  // 1. Prevent hanging: Without timeouts, requests can hang indefinitely if GraphDB/Cloudflare is unresponsive
  // 2. Fail fast: Better to retry with backoff than wait forever for a dead connection
  // 3. Resource cleanup: Aborted requests free up connection pools and memory
  // 4. User experience: Long-running syncs should fail visibly rather than hang silently
  // Default: 60s for queries, configurable via GRAPHDB_QUERY_TIMEOUT_MS
  const timeoutMsEnvRaw = envString('GRAPHDB_QUERY_TIMEOUT_MS');
  const timeoutMsEnv = Number.isFinite(Number(timeoutMsEnvRaw)) && Number(timeoutMsEnvRaw) > 0 ? Number(timeoutMsEnvRaw) : null;
  const timeoutMs =
    Number.isFinite(Number(init.timeoutMs)) && Number(init.timeoutMs) > 0
      ? Number(init.timeoutMs)
      : timeoutMsEnv ?? 60_000;

  const retriesRaw = envString('GRAPHDB_HTTP_RETRIES');
  const retriesDefault = Number.isFinite(Number(retriesRaw)) && Number(retriesRaw) >= 0 ? Math.trunc(Number(retriesRaw)) : 3;
  const retries =
    Number.isFinite(Number(init.retries)) && Number(init.retries) >= 0 ? Math.trunc(Number(init.retries)) : retriesDefault;
  const minBackoffMs = 750;
  const maxBackoffMs = 20_000;
  const retryOnStatuses = new Set([429, 500, 502, 503, 504, 522, 524]);

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    let timeoutFired = false;
    const t = setTimeout(() => {
      timeoutFired = true;
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


      const res = await fetch(url, { ...init, headers, signal: controller.signal });
      if (retryOnStatuses.has(res.status) && attempt < retries) {
        try {
          await res.arrayBuffer().catch(() => undefined);
        } catch {}
        const waitMs = computeBackoffMs(attempt, minBackoffMs, maxBackoffMs);
        await sleep(waitMs);
        continue;
      }
      return res;
    } catch (err) {
      // Log timeout specifically
      if (timeoutFired || (err as any)?.name === 'AbortError') {
        const isTimeout = timeoutFired || String((err as any)?.message || '').includes('aborted');
        if (isTimeout) {
          console.warn('[graphdb] request timeout', {
            url: url.slice(0, 100), // Truncate long URLs
            timeoutMs,
            attempt: attempt + 1,
            maxRetries: retries + 1,
            method: init.method || 'GET',
          });
        }
      }
      if (attempt >= retries || !isRetryableNetworkError(err)) throw err;
      const waitMs = computeBackoffMs(attempt, minBackoffMs, maxBackoffMs);
      await sleep(waitMs);
      continue;
    } finally {
      clearTimeout(t);
    }
  }

  throw new Error('graphdbFetch: exhausted retries');
}

export async function updateGraphdb(
  baseUrl: string,
  repository: string,
  auth: GraphdbAuth,
  sparqlUpdate: string,
  opts?: { timeoutMs?: number; retries?: number },
): Promise<void> {
  // Use default timeout from graphdbFetch (60s) - no need for 5-minute timeout
  // SPARQL updates should be fast; if they take longer, something is wrong
  const url = joinUrl(baseUrl, `/repositories/${encodeURIComponent(repository)}/statements`);
  const res = await graphdbFetch(url, {
    method: 'POST',
    auth,
    timeoutMs: opts?.timeoutMs,
    retries: opts?.retries,
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
    // Uploads are the most failure-prone (large bodies, CF proxy). Always retry a few times even
    // if the environment retry count is set to 0.
    retries: 6,
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
  const timeoutMsEnvRaw = envString('GRAPHDB_QUERY_TIMEOUT_MS');
  const timeoutMsEnv = Number.isFinite(Number(timeoutMsEnvRaw)) && Number(timeoutMsEnvRaw) > 0 ? Number(timeoutMsEnvRaw) : null;
  const timeoutMs = timeoutMsEnv ?? 30_000;
  const url = joinUrl(baseUrl, `/repositories/${encodeURIComponent(repository)}`);
  const res = await graphdbFetch(url, {
    method: 'POST',
    auth,
    timeoutMs,
    headers: {
      'Content-Type': 'application/sparql-query',
      Accept: 'application/sparql-results+json',
    },
    body: sparql,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const hint =
      res.status === 524
        ? ' (Cloudflare 524: GraphDB origin timeout; retry/backoff or reduce load)'
        : res.status === 522
          ? ' (Cloudflare 522: connection timed out)'
          : res.status === 429
            ? ' (rate limited; retry with backoff)'
            : '';
    throw new Error(`GraphDB SPARQL query failed: HTTP ${res.status}${hint}${text ? `: ${text.slice(0, 500)}` : ''}`);
  }
  return res.json();
}

