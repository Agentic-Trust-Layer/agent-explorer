import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { fetchWithRetry } from '../net/fetch-with-retry.js';

type GraphdbAuth = { username: string; password: string } | null;

type GlobalQueryCacheEntry = { expiresAt: number; promise: Promise<any> };
const globalQueryCache = new Map<string, GlobalQueryCacheEntry>();

function globalQueryCacheTtlMs(): number {
  const raw = process.env.GRAPHDB_RESPONSE_CACHE_TTL_MS;
  const n = raw && String(raw).trim() ? Number(raw) : 2000;
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0;
}

function globalQueryCacheMaxEntries(): number {
  const raw = process.env.GRAPHDB_RESPONSE_CACHE_MAX_ENTRIES;
  const n = raw && String(raw).trim() ? Number(raw) : 300;
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0;
}

function globalCacheGet(sparql: string): Promise<any> | null {
  const ttl = globalQueryCacheTtlMs();
  if (!ttl) return null;
  const e = globalQueryCache.get(sparql);
  if (!e) return null;
  if (Date.now() > e.expiresAt) {
    globalQueryCache.delete(sparql);
    return null;
  }
  return e.promise;
}

function globalCacheSet(sparql: string, promise: Promise<any>): void {
  const ttl = globalQueryCacheTtlMs();
  if (!ttl) return;
  const max = globalQueryCacheMaxEntries();
  if (max && globalQueryCache.size >= max) {
    // Drop oldest entries.
    while (globalQueryCache.size >= max) {
      const oldestKey = globalQueryCache.keys().next().value as string | undefined;
      if (!oldestKey) break;
      globalQueryCache.delete(oldestKey);
    }
  }
  globalQueryCache.set(sparql, { expiresAt: Date.now() + ttl, promise });
}

export type GraphdbQueryContext = {
  /**
   * Per-request cache (dedupes identical SPARQL strings within a single GraphQL request).
   * Keyed by the full SPARQL string.
   */
  requestCache?: Map<string, Promise<any>>;
  /** Optional label for logging/timing (e.g. "kbAgentsQuery"). */
  label?: string;
  /** Optional request id for log correlation. */
  requestId?: string;
  /** Collect timings (if provided). */
  timings?: Array<{ label: string; ms: number; resultBindings?: number | null }>;
};

function envString(key: string): string | null {
  const v = process.env[key];
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

  if (envString('DEBUG_GRAPHDB')) {
    // eslint-disable-next-line no-console
    console.log('[graphdb] config', {
      baseUrl,
      repository,
      auth: auth ? true : false,
      hasCfAccess: Boolean(envString('GRAPHDB_CF_ACCESS_CLIENT_ID')),
    });
  }
  return { baseUrl, repository, auth };
}

function basicAuthHeader(auth: GraphdbAuth): string | null {
  if (!auth) return null;
  const token = Buffer.from(`${auth.username}:${auth.password}`, 'utf8').toString('base64');
  return `Basic ${token}`;
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
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers = new Headers(init.headers || {});
    const authHeader = basicAuthHeader(init.auth ?? null);
    if (authHeader) headers.set('Authorization', authHeader);
    const accessHeaders = cfAccessHeaders();
    if (accessHeaders['CF-Access-Client-Id']) headers.set('CF-Access-Client-Id', accessHeaders['CF-Access-Client-Id']);
    if (accessHeaders['CF-Access-Client-Secret']) headers.set('CF-Access-Client-Secret', accessHeaders['CF-Access-Client-Secret']);

    if (envString('DEBUG_GRAPHDB')) {
      const raw = Object.fromEntries(headers.entries());
      const redacted: Record<string, string> = {};
      for (const [k, v] of Object.entries(raw)) {
        const key = k.toLowerCase();
        if (key === 'authorization') redacted[k] = v ? '***' : '';
        else if (key === 'cf-access-client-id') redacted[k] = v ? '***' : '';
        else if (key === 'cf-access-client-secret') redacted[k] = v ? '***' : '';
        else redacted[k] = v;
      }
      // eslint-disable-next-line no-console
      console.log('[graphdb] request headers', redacted);
    }
    const retriesRaw = envString('GRAPHDB_HTTP_RETRIES');
    const retries = Number.isFinite(Number(retriesRaw)) && Number(retriesRaw) >= 0 ? Math.trunc(Number(retriesRaw)) : 3;
    return await fetchWithRetry(
      url,
      { ...init, headers, signal: controller.signal },
      {
        timeoutMs,
        retries,
        // Cloudflare can intermittently 52x; treat them as transient.
        retryOnStatuses: [429, 500, 502, 503, 504, 522, 524],
        minBackoffMs: 750,
        maxBackoffMs: 20_000,
      },
    );
  } finally {
    clearTimeout(t);
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

function envRuleset(): string {
  const v = process.env.GRAPHDB_RULESET;
  return typeof v === 'string' && v.trim() ? v.trim() : 'owl-horst-optimized';
}

function repoConfigTtl(repositoryId: string): string {
  // Best-effort GraphDB repository config (RDF4J-style).
  // Users can always create via Workbench if their GraphDB distribution differs.
  const ruleset = envRuleset();
  return [
    '@prefix rep: <http://www.openrdf.org/config/repository#> .',
    '@prefix sr: <http://www.openrdf.org/config/repository/sail#> .',
    '@prefix sail: <http://www.openrdf.org/config/sail#> .',
    '@prefix graphdb: <http://www.ontotext.com/config/graphdb#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '',
    '[] a rep:Repository ;',
    `  rep:repositoryID "${repositoryId}" ;`,
    '  rep:repositoryImpl [',
    // For GraphDB 10.x (RDF4J server), the accepted type is graphdb:SailRepository.
    '    rep:repositoryType "graphdb:SailRepository" ;',
    '    sr:sailImpl [',
    '      sail:sailType "graphdb:Sail" ;',
    `      graphdb:ruleset "${ruleset}" ;`,
    '      graphdb:checkForInconsistencies "false"^^xsd:boolean ;',
    '      graphdb:enableContextIndex "true"^^xsd:boolean ;',
    '    ]',
    '  ] .',
    '',
  ].join('\n');
}

async function postCreateRepo(baseUrl: string, auth: GraphdbAuth, formField: string, ttl: string): Promise<Response> {
  const url = joinUrl(baseUrl, '/rest/repositories');
  const fd = new FormData();
  // GraphDB expects multipart with a file part; use application/x-turtle.
  fd.set(formField, new Blob([ttl], { type: 'application/x-turtle' }), 'repository-config.ttl');
  return await graphdbFetch(url, { method: 'POST', auth, timeoutMs: 60_000, body: fd as any });
}

export async function createRepository(
  baseUrl: string,
  repository: string,
  auth: GraphdbAuth,
  opts?: { force?: boolean },
): Promise<void> {
  const repos = await listRepositories(baseUrl, auth);
  const exists = repos.includes(repository);
  if (exists && !opts?.force) return;

  // If force: delete first
  if (exists && opts?.force) {
    const delUrl = joinUrl(baseUrl, `/rest/repositories/${encodeURIComponent(repository)}`);
    const del = await graphdbFetch(delUrl, { method: 'DELETE', auth, timeoutMs: 60_000 });
    if (!del.ok) {
      const text = await del.text().catch(() => '');
      throw new Error(`GraphDB delete repository failed: HTTP ${del.status}${text ? `: ${text.slice(0, 300)}` : ''}`);
    }
  }

  const ttl = repoConfigTtl(repository);

  // Try common form field names used by GraphDB/RDF4J workbench APIs.
  const attempts: Array<{ field: string }> = [{ field: 'config' }, { field: 'repositoryConfig' }];
  const errs: string[] = [];
  for (const a of attempts) {
    const res = await postCreateRepo(baseUrl, auth, a.field, ttl);
    if (res.ok) return;
    const text = await res.text().catch(() => '');
    errs.push(`field=${a.field} HTTP ${res.status}${text ? `: ${text.slice(0, 500)}` : ''}`);
  }

  throw new Error(
    `GraphDB repository creation failed for "${repository}".\n` +
      `Errors:\n- ${errs.length ? errs.join('\n- ') : 'unknown'}\n` +
      `If your GraphDB build expects a different repository config, create the repo in the Workbench instead: ${joinUrl(baseUrl, '/')}`,
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

function contentTypeForPath(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.ttl')) return 'text/turtle';
  if (lower.endsWith('.nq') || lower.endsWith('.nquads')) return 'application/n-quads';
  if (lower.endsWith('.nt')) return 'application/n-triples';
  // In this repo, our ".owl" files are Turtle, not RDF/XML.
  if (lower.endsWith('.owl')) return 'text/turtle';
  if (lower.endsWith('.rdf') || lower.endsWith('.xml')) return 'application/rdf+xml';
  // Safe fallback
  return 'application/octet-stream';
}

export async function uploadFileToRepository(
  baseUrl: string,
  repository: string,
  auth: GraphdbAuth,
  params: { filePath: string; context?: string | null },
): Promise<{ bytes: number }> {
  const filePath = params.filePath;
  const context = params.context && params.context.trim() ? params.context.trim() : null;
  const qs = context ? `?context=${encodeURIComponent(`<${context}>`)}` : '';
  const url = joinUrl(baseUrl, `/repositories/${encodeURIComponent(repository)}/statements${qs}`);
  const stat = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);
  const contentType = contentTypeForPath(filePath);

  const res = await graphdbFetch(url, {
    method: 'POST',
    auth,
    timeoutMs: 10 * 60_000,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(stat.size),
    },
    // Node.js fetch needs duplex for streaming bodies
    duplex: 'half',
    body: stream,
  } as any);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // Try to extract line number or IRI from error message
    const lineMatch = text.match(/line\s+(\d+)/i) || text.match(/\[line\s+(\d+)\]/i) || text.match(/at\s+line\s+(\d+)/i);
    // Look for IRI in angle brackets or after "IRI:" but not from "Invalid IRI value" message
    const iriMatch = text.match(/IRI[:\s]+<([^>]+)>/i) || 
                     text.match(/IRI[:\s]+(https?:\/\/[^\s<>"{}|^`\n]+)/i) ||
                     text.match(/IRI[:\s]+([a-z][a-z0-9+.-]*:[^\s<>"{}|^`\n]+)/i);
    const lineInfo = lineMatch ? ` (line ${lineMatch[1]})` : '';
    const iriInfo = iriMatch ? ` (problematic IRI: ${iriMatch[1].slice(0, 150)})` : '';
    // Show full error for debugging
    const fullError = text ? `\nFull error: ${text}` : '';
    throw new Error(`GraphDB upload failed (${filePath})${lineInfo}${iriInfo}${fullError.slice(0, 2000)}`);
  }
  return { bytes: stat.size };
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
  const bytes = Buffer.byteLength(params.turtle, 'utf8');

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
    const lineMatch = text.match(/line\s+(\d+)/i) || text.match(/\[line\s+(\d+)\]/i) || text.match(/at\s+line\s+(\d+)/i);
    const iriMatch =
      text.match(/IRI[:\s]+<([^>]+)>/i) ||
      text.match(/IRI[:\s]+(https?:\/\/[^\s<>"{}|^`\n]+)/i) ||
      text.match(/IRI[:\s]+([a-z][a-z0-9+.-]*:[^\s<>"{}|^`\n]+)/i);
    const lineInfo = lineMatch ? ` (line ${lineMatch[1]})` : '';
    const iriInfo = iriMatch ? ` (problematic IRI: ${iriMatch[1].slice(0, 150)})` : '';
    const fullError = text ? `\nFull error: ${text}` : '';
    throw new Error(`GraphDB upload failed (inline turtle)${lineInfo}${iriInfo}${fullError.slice(0, 2000)}`);
  }

  return { bytes };
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

export async function queryGraphdb(
  baseUrl: string,
  repository: string,
  auth: GraphdbAuth,
  sparql: string,
): Promise<any> {
  return await queryGraphdbWithContext(baseUrl, repository, auth, sparql);
}

export async function queryGraphdbWithContext(
  baseUrl: string,
  repository: string,
  auth: GraphdbAuth,
  sparql: string,
  ctx?: GraphdbQueryContext | null,
): Promise<any> {
  const globalHit = globalCacheGet(sparql);
  if (globalHit) {
    const t0 = performance.now();
    const json: any = await globalHit;
    const ms = performance.now() - t0;
    const label = ctx?.label ?? 'graphdb';
    const bindings = Array.isArray(json?.results?.bindings) ? json.results.bindings.length : null;
    // Record cache-hit wait time so request-level timing logs stay accurate.
    if (ctx?.timings) ctx.timings.push({ label: `${label}:cache`, ms, resultBindings: bindings });
    return json;
  }

  const cache = ctx?.requestCache ?? null;
  if (cache) {
    const hit = cache.get(sparql);
    if (hit) {
      const t0 = performance.now();
      const json: any = await hit;
      const ms = performance.now() - t0;
      const label = ctx?.label ?? 'graphdb';
      const bindings = Array.isArray(json?.results?.bindings) ? json.results.bindings.length : null;
      if (ctx?.timings) ctx.timings.push({ label: `${label}:reqcache`, ms, resultBindings: bindings });
      return json;
    }
  }

  const t0 = performance.now();
  const url = joinUrl(baseUrl, `/repositories/${encodeURIComponent(repository)}`);

  const run: Promise<any> = (async () => {
    const timeoutMsEnvRaw = envString('GRAPHDB_QUERY_TIMEOUT_MS');
    const timeoutMsEnv = Number.isFinite(Number(timeoutMsEnvRaw)) && Number(timeoutMsEnvRaw) > 0 ? Number(timeoutMsEnvRaw) : null;
    const timeoutMs = timeoutMsEnv ?? 30_000;
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
          ? ' (Cloudflare 524: GraphDB origin timeout; retry/backoff or optimize the SPARQL / reduce load)'
          : res.status === 522
            ? ' (Cloudflare 522: connection timed out)'
            : res.status === 429
              ? ' (rate limited; retry with backoff)'
              : '';
      throw new Error(`GraphDB SPARQL query failed: HTTP ${res.status}${hint}${text ? `: ${text.slice(0, 500)}` : ''}`);
    }
    return await res.json();
  })();

  if (cache) cache.set(sparql, run);
  globalCacheSet(sparql, run);

  try {
    const json: any = await run;
    const ms = performance.now() - t0;
    const label = ctx?.label ?? 'graphdb';
    const bindings = Array.isArray(json?.results?.bindings) ? json.results.bindings.length : null;

    if (ctx?.timings) ctx.timings.push({ label, ms, resultBindings: bindings });
    if (envString('DEBUG_GRAPHDB_TIMING') || ms > 750) {
      // eslint-disable-next-line no-console
      console.log(`[graphdb] ${label} ${ms.toFixed(1)}ms`, {
        bindings,
        requestId: ctx?.requestId ?? null,
      });
    }

    return json;
  } finally {
    // If the promise rejects, don’t poison the request cache.
    if (cache) {
      const p = cache.get(sparql);
      if (p === run) {
        run.catch(() => {
          try {
            cache.delete(sparql);
          } catch {
            // ignore
          }
        });
      }
    }
    // If the promise rejects, don’t poison the global cache.
    run.catch(() => {
      const e = globalQueryCache.get(sparql);
      if (e?.promise === run) globalQueryCache.delete(sparql);
    });
  }
}


