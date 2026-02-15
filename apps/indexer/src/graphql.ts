import { graphql, GraphQLSchema } from 'graphql';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { buildGraphQLSchemaKb } from './graphql-schema-kb';
import express from 'express';
import { createGraphQLResolversKb } from './graphql-resolvers-kb';
import { createSemanticSearchServiceFromEnv } from './semantic/factory.js';
import {
  needsAuthentication,
  extractAccessCode,
  parseGraphQLRequestExpress,
  corsHeaders,
  type GraphQLRequest,
} from './graphql-handler';
import { graphiqlHTML } from './graphiql-template';

// CORS configuration to allow Authorization header
const cors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
};

// KB-only schema (GraphDB-backed)
const schemaKb = buildGraphQLSchemaKb();

// Create KB resolvers (GraphDB-backed)
const semanticSearchService = createSemanticSearchServiceFromEnv();
const rootKb = createGraphQLResolversKb({ semanticSearchService }) as any;

// processAgentDirectly is now imported from './process-agent'

type SyncJobStatus = 'queued' | 'running' | 'completed' | 'failed';
type SyncJob = {
  id: string;
  kind: 'sync:agent-pipeline';
  chainIds: number[];
  status: SyncJobStatus;
  createdAt: number;
  startedAt: number | null;
  endedAt: number | null;
  exitCode: number | null;
  error: string | null;
  // Keep small (avoid unbounded memory growth).
  log: string;
};

const syncJobs = new Map<string, SyncJob>();
const runningJobByChainId = new Map<number, string>(); // chainId -> jobId

function appendJobLog(job: SyncJob, chunk: string): void {
  const maxChars = 250_000;
  job.log = (job.log + chunk).slice(-maxChars);
}

function parseChainIds(input: unknown): number[] {
  const raw = typeof input === 'string' ? input.trim().toLowerCase() : '';
  if (!raw || raw === 'all' || raw === 'main' || raw === 'main-chains') return [1, 59144];
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const out: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (Number.isFinite(n) && n > 0) out.push(Math.trunc(n));
  }
  return Array.from(new Set(out));
}

async function runSyncAgentPipelineJob(job: SyncJob, opts: { limit?: number | null; agentIdsCsv?: string | null; ensureAgent?: boolean | null }) {
  job.status = 'running';
  job.startedAt = Date.now();
  appendJobLog(job, `[job] start ${new Date(job.startedAt).toISOString()} chainIds=${job.chainIds.join(',')}\n`);

  const repoRoot = process.cwd(); // `pnpm dev:graphql` runs from apps/indexer; cwd is fine if launched there? Use repo root if possible.
  // If started from apps/indexer, jump to repo root so pnpm --filter works reliably.
  const cwd = repoRoot.endsWith('/apps/indexer') ? repoRoot.replace(/\/apps\/indexer$/, '') : repoRoot;

  const limit = typeof opts.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : null;
  const agentIdsCsv = typeof opts.agentIdsCsv === 'string' && opts.agentIdsCsv.trim() ? opts.agentIdsCsv.trim() : null;
  const ensureAgent = opts.ensureAgent === true;

  const runOne = async (chainId: number): Promise<number> => {
    appendJobLog(job, `\n[job] chainId=${chainId} spawning: pnpm --filter sync sync:agent-pipeline\n`);
    const args: string[] = ['--filter', 'sync', 'sync:agent-pipeline'];
    const extra: string[] = [];
    if (limit != null) extra.push(`--limit=${limit}`);
    if (agentIdsCsv) extra.push(`--agent-ids=${agentIdsCsv}`);
    if (ensureAgent) extra.push(`--ensure-agent`);
    if (extra.length) args.push('--', ...extra);

    const child = spawn('pnpm', args, {
      cwd,
      env: { ...process.env, SYNC_CHAIN_ID: String(chainId) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (d) => appendJobLog(job, String(d)));
    child.stderr.on('data', (d) => appendJobLog(job, String(d)));

    const code: number = await new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('close', (c) => resolve(typeof c === 'number' ? c : 0));
    });

    appendJobLog(job, `\n[job] chainId=${chainId} exitCode=${code}\n`);
    return code;
  };

  try {
    for (const chainId of job.chainIds) {
      const code = await runOne(chainId);
      if (code !== 0) {
        job.status = 'failed';
        job.exitCode = code;
        job.endedAt = Date.now();
        job.error = `sync:agent-pipeline failed for chainId=${chainId} (exitCode=${code})`;
        appendJobLog(job, `[job] failed ${new Date(job.endedAt).toISOString()} error=${job.error}\n`);
        return;
      }
    }
    job.status = 'completed';
    job.exitCode = 0;
    job.endedAt = Date.now();
    appendJobLog(job, `[job] completed ${new Date(job.endedAt).toISOString()}\n`);
  } catch (e: any) {
    job.status = 'failed';
    job.exitCode = job.exitCode ?? 1;
    job.endedAt = Date.now();
    job.error = String(e?.message || e || 'unknown error');
    appendJobLog(job, `[job] failed ${new Date(job.endedAt).toISOString()} error=${job.error}\n`);
  } finally {
    for (const cid of job.chainIds) {
      const cur = runningJobByChainId.get(cid);
      if (cur === job.id) runningJobByChainId.delete(cid);
    }
  }
}

export function createGraphQLServer(port: number = 4000) {
  const app = express();

  // Enable CORS to allow Authorization header from GraphiQL
  app.use(cors);
  
  // Parse JSON body - graphql-http's Express handler expects req.body to be parsed
  app.use(express.json());

  // Prevent caching of API responses (skills/taxonomy in particular)
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Request logging middleware (after body parsing)
  // Only log, don't modify req.body - graphql-http needs it intact
  app.use((req, res, next) => {
    if ((req.path === '/graphql' || req.path === '/graphql-kb') && req.method === 'POST') {
      console.log(`📥 GraphQL Request - ${new Date().toISOString()} - Body:`, JSON.stringify(req.body).substring(0, 200));
      console.log(`📥 Request details - URL: ${req.url}, Method: ${req.method}, Headers:`, JSON.stringify(req.headers).substring(0, 100));
    }
    next();
  });

  // Discovery taxonomy endpoint (always fetches from GraphDB; no caching)
  app.get('/api/discovery/taxonomy', async (_req, res) => {
    try {
      const [intentTypes, taskTypes, intentTaskMappings, oasfSkills, oasfDomains] = await Promise.all([
        (rootKb as any).intentTypes?.({ limit: 5000, offset: 0 }) ?? [],
        (rootKb as any).taskTypes?.({ limit: 5000, offset: 0 }) ?? [],
        (rootKb as any).intentTaskMappings?.({ limit: 5000, offset: 0 }) ?? [],
        (rootKb as any).oasfSkills?.({ limit: 5000, offset: 0 }) ?? [],
        (rootKb as any).oasfDomains?.({ limit: 5000, offset: 0 }) ?? [],
      ]);
      res.json({
        intentTypes,
        taskTypes,
        intentTaskMappings,
        oasfSkills,
        oasfDomains,
        fetchedAt: new Date().toISOString(),
        source: 'graphdb',
      });
    } catch (e: any) {
      res.status(500).json({
        error: String(e?.message || e),
        fetchedAt: new Date().toISOString(),
        source: 'graphdb',
      });
    }
  });

  /**
   * UNSAFE BY DESIGN (no auth): trigger `apps/sync` agent pipeline via HTTP.
   *
   * POST /sync/agent-pipeline?chainId=1|59144|all
   * Body (optional JSON): { limit?: number, agentIdsCsv?: string, ensureAgent?: boolean }
   *
   * Returns 202 with a jobId. Poll GET /sync/jobs/:jobId for status + logs.
   *
   * NOTE: This only works in the Node/Express server. It will not work in a Cloudflare Worker deployment.
   */
  app.post('/sync/agent-pipeline', async (req, res) => {
    const chainIds = parseChainIds(req.query?.chainId);
    if (!chainIds.length) return res.status(400).json({ error: 'Missing or invalid chainId (use 1,59144 or all)' });

    // Basic concurrency guard per chain (not security; prevents accidental overlapping runs).
    const running = chainIds.map((cid) => ({ cid, jobId: runningJobByChainId.get(cid) ?? null })).filter((x) => x.jobId);
    if (running.length) {
      return res.status(409).json({
        error: 'A sync job is already running for one or more chainIds',
        running,
      });
    }

    const id = randomUUID();
    const job: SyncJob = {
      id,
      kind: 'sync:agent-pipeline',
      chainIds,
      status: 'queued',
      createdAt: Date.now(),
      startedAt: null,
      endedAt: null,
      exitCode: null,
      error: null,
      log: '',
    };
    syncJobs.set(id, job);
    for (const cid of chainIds) runningJobByChainId.set(cid, id);

    // Fire-and-forget.
    void runSyncAgentPipelineJob(job, {
      limit: req.body?.limit ?? null,
      agentIdsCsv: req.body?.agentIdsCsv ?? null,
      ensureAgent: req.body?.ensureAgent ?? null,
    });

    return res.status(202).json({
      ok: true,
      jobId: id,
      chainIds,
      statusUrl: `/sync/jobs/${id}`,
    });
  });

  app.get('/sync/jobs/:jobId', async (req, res) => {
    const id = String(req.params?.jobId || '').trim();
    const job = id ? syncJobs.get(id) : null;
    if (!job) return res.status(404).json({ error: 'job not found' });
    return res.json({
      id: job.id,
      kind: job.kind,
      chainIds: job.chainIds,
      status: job.status,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      endedAt: job.endedAt,
      exitCode: job.exitCode,
      error: job.error,
      log: job.log,
    });
  });

  // OASF skills endpoint (always fetches from GraphDB; no caching)
  app.get('/api/oasf/skills', async (req, res) => {
    try {
      const limit = req.query?.limit != null ? Number(req.query.limit) : 5000;
      const offset = req.query?.offset != null ? Number(req.query.offset) : 0;
      const skills = await (rootKb as any).oasfSkills?.({ limit, offset }) ?? [];
      res.json({
        skills,
        count: Array.isArray(skills) ? skills.length : 0,
        fetchedAt: new Date().toISOString(),
        source: 'graphdb',
      });
    } catch (e: any) {
      res.status(500).json({
        skills: [],
        count: 0,
        error: String(e?.message || e),
        fetchedAt: new Date().toISOString(),
        source: 'graphdb',
      });
    }
  });

  // OASF domains endpoint (always fetches from GraphDB; no caching)
  app.get('/api/oasf/domains', async (req, res) => {
    try {
      const limit = req.query?.limit != null ? Number(req.query.limit) : 5000;
      const offset = req.query?.offset != null ? Number(req.query.offset) : 0;
      const domains = await (rootKb as any).oasfDomains?.({ limit, offset }) ?? [];
      res.json({
        domains,
        count: Array.isArray(domains) ? domains.length : 0,
        fetchedAt: new Date().toISOString(),
        source: 'graphdb',
      });
    } catch (e: any) {
      res.status(500).json({
        domains: [],
        count: 0,
        error: String(e?.message || e),
        fetchedAt: new Date().toISOString(),
        source: 'graphdb',
      });
    }
  });

  // Auth middleware (KB-only). If GRAPHQL_SECRET_ACCESS_CODE is set, require it.
  const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Disabled by default for now (to unblock KB query iteration).
    // Re-enable later by setting GRAPHQL_REQUIRE_AUTH=1 and GRAPHQL_SECRET_ACCESS_CODE=...
    const requireAuth = process.env.GRAPHQL_REQUIRE_AUTH === '1';
    if (!requireAuth) return next();

    // Only apply auth to POST requests (GET requests show GraphiQL UI)
    if (req.method !== 'POST') {
      return next();
    }

    const request = parseGraphQLRequestExpress(req);

    if (!needsAuthentication(request.query, request.operationName)) {
      return next();
    }

    const authHeader = req.headers.authorization || '';
    const accessCode = extractAccessCode(authHeader);
    const secretAccessCode = process.env.GRAPHQL_SECRET_ACCESS_CODE;

    // If no secret is configured, do not require auth for KB reads (KB-only mode).
    if (!secretAccessCode) {
      return next();
    }

    if (accessCode !== secretAccessCode) {
      console.warn(
        `⚠️  Auth rejected (${req.path})`,
        JSON.stringify({
          hasAuthHeader: Boolean(authHeader),
          accessCodeLen: accessCode.length,
        }),
      );
      return res.status(401).json({
        errors: [{ message: 'Invalid access code' }],
      });
    }

    next();
  };

  app.use('/graphql', authMiddleware);
  app.use('/graphql-kb', authMiddleware);

  // GraphQL endpoint - show GraphiQL UI on GET, handle queries on POST

  app.get('/graphql', (req, res) => {
    res.send(graphiqlHTML);
  });

  app.get('/graphql-kb', (req, res) => {
    res.send(graphiqlHTML);
  });

  // Handle POST requests for GraphQL queries (KB-only).
  // We run graphql() directly so we can log GraphQL execution errors (otherwise they only reach the client).
  const handleGraphqlKbPost = async (req: express.Request, res: express.Response) => {
    const httpT0 = performance.now();
    try {
      const requestId = (req.header('x-request-id') || '').trim() || randomUUID();
      const timings: Array<{ label: string; ms: number; resultBindings?: number | null }> = [];
      const contextValue = {
        graphdb: {
          requestId,
          requestCache: new Map<string, Promise<any>>(),
          timings,
        },
      };

      const request = parseGraphQLRequestExpress(req);

      // Hard fail on legacy v1 queries hitting the KB endpoint, with a targeted message for frontend teams.
      const queryText = String(request.query || '');
      if (/\bagentMetadata\b/.test(queryText) || /\bAgentMetadataWhereInput\b/.test(queryText)) {
        return res.status(400).json({
          errors: [
            {
              message:
                'Legacy agentMetadata query is not supported on the KB GraphQL endpoint (/graphql-kb). ' +
                'Your client is using v1 schema types like AgentMetadataWhereInput / Query.agentMetadata. ' +
                'Fix: update the client to use KB-v2 queries (kbAgents, kbAgent, identity8004.descriptor.json, etc.) or stop requesting token metadata from GraphQL.',
            },
          ],
        });
      }

      // UAID-only enforcement (no raw did:8004 / did:ethr in KB GraphQL requests).
      // - Allow UAIDs like "uaid:did:8004:1:123" (contains did:* but is UAID-prefixed)
      // - Reject any raw "did:8004:..." or "did:ethr:..." passed as variables or embedded literals
      const isBareDidString = (s: string): boolean => {
        const raw = String(s || '').trim();
        if (!raw) return false;
        if (raw.startsWith('uaid:')) return false;
        return raw.startsWith('did:8004:') || raw.startsWith('did:ethr:');
      };
      const containsBareDidInQueryText = (text: string): boolean => {
        const t = String(text || '');
        // Scan for did:8004: / did:ethr: that are NOT immediately preceded by "uaid:"
        const needles = ['did:8004:', 'did:ethr:'] as const;
        for (const needle of needles) {
          let idx = 0;
          while (true) {
            const at = t.indexOf(needle, idx);
            if (at < 0) break;
            const prefix = t.slice(Math.max(0, at - 5), at);
            if (prefix !== 'uaid:') return true;
            idx = at + needle.length;
          }
        }
        return false;
      };
      const containsBareDidInVariables = (v: any): boolean => {
        if (v == null) return false;
        if (typeof v === 'string') return isBareDidString(v);
        if (Array.isArray(v)) return v.some(containsBareDidInVariables);
        if (typeof v === 'object') return Object.values(v).some(containsBareDidInVariables);
        return false;
      };

      const vars = request.variables || {};
      if (containsBareDidInQueryText(queryText) || containsBareDidInVariables(vars)) {
        return res.status(400).json({
          errors: [
            {
              message:
                'KB GraphQL requires UAID-form identifiers. Do not send raw DIDs like "did:8004:..." or "did:ethr:...". ' +
                'Wrap them as "uaid:did:8004:..." / "uaid:did:ethr:..." and use UAID-native fields/filters.',
            },
          ],
        });
      }

      const result = await graphql({
        schema: schemaKb as GraphQLSchema,
        source: request.query || '',
        rootValue: rootKb,
        variableValues: request.variables || {},
        operationName: request.operationName,
        contextValue,
      });

      // Always-on per-request timing log (concise).
      try {
        const totalMs = performance.now() - httpT0;
        const gqlErrors = Array.isArray((result as any)?.errors) ? (result as any).errors : [];
        const graphdbTotalMs = timings.reduce((a, t) => a + (Number.isFinite(t.ms) ? t.ms : 0), 0);
        const top = [...timings].sort((a, b) => (b.ms ?? 0) - (a.ms ?? 0)).slice(0, 5);
        // eslint-disable-next-line no-console
        console.info('[graphql] request', {
          requestId,
          path: req.path,
          operationName: request.operationName ?? null,
          ms: Number.isFinite(totalMs) ? Number(totalMs.toFixed(1)) : null,
          graphdb: {
            queries: timings.length,
            ms: Number.isFinite(graphdbTotalMs) ? Number(graphdbTotalMs.toFixed(1)) : null,
            top,
          },
          errors: gqlErrors.length ? gqlErrors.map((e: any) => e?.message || String(e)).slice(0, 3) : [],
        });
      } catch {
        // ignore logging failures
      }

      if (Array.isArray((result as any)?.errors) && (result as any).errors.length) {
        console.warn(
          `⚠️  GraphQL errors (${req.path})`,
          (result as any).errors.map((e: any) => e?.message || String(e)),
        );
      }

      if (process.env.DEBUG_GRAPHQL_KB_TIMING && timings.length) {
        const totalMs = timings.reduce((a, t) => a + (Number.isFinite(t.ms) ? t.ms : 0), 0);
        const top = [...timings].sort((a, b) => (b.ms ?? 0) - (a.ms ?? 0)).slice(0, 10);
        // eslint-disable-next-line no-console
        console.log(`[graphql-kb] timings ${totalMs.toFixed(1)}ms`, { requestId, top });
      }

      res.setHeader('Content-Type', 'application/json');
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v as any));
      res.status(200).send(JSON.stringify(result));
    } catch (e: any) {
      try {
        const totalMs = performance.now() - httpT0;
        // eslint-disable-next-line no-console
        console.info('[graphql] request failed', {
          path: req.path,
          ms: Number.isFinite(totalMs) ? Number(totalMs.toFixed(1)) : null,
          error: String(e?.message || e || ''),
        });
      } catch {
        // ignore
      }
      console.error(`💥 GraphQL handler threw (${req.path})`, e?.stack || e);
      res.setHeader('Content-Type', 'application/json');
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v as any));
      res.status(500).send(
        JSON.stringify({
          errors: [{ message: String(e?.message || e) }],
        }),
      );
    }
  };

  // KB-only: serve KB schema on both /graphql and /graphql-kb
  app.post('/graphql', handleGraphqlKbPost);
  app.post('/graphql-kb', handleGraphqlKbPost);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Simple GraphiQL endpoint - same as /graphql

  app.get('/graphiql', (req, res) => {
    res.send(graphiqlHTML);
  });

  const server = app.listen(port, () => {
    console.log(`🚀 GraphQL (KB-only) server running at http://localhost:${port}/graphql`);
    console.log(`📊 GraphiQL playground available at:`);
    console.log(`   - http://localhost:${port}/graphql (GET - GraphiQL UI)`);
    console.log(`   - http://localhost:${port}/graphiql (GET - GraphiQL UI, alternative)`);
  });

  return server;
}

