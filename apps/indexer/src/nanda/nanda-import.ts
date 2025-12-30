import { createD1Database } from '../db-d1';
import {
  fetchNandaDiscoverySearchPage,
  fetchNandaServerDetail,
  fetchNandaServersPage,
  type NandaDiscoverySearchItem,
  type NandaServerDetail,
  type NandaServerSummary,
} from './nanda-api';
import { upsertAgentCardForAgent } from '../a2a/agent-card-fetch';

type AnyDb = any;

async function ensureNandaSchema(db: AnyDb): Promise<void> {
  // Best-effort schema bootstrap for the target nanda-indexer D1 database.
  // This keeps the tables "the same or very similar" to erc8004-indexer and prevents
  // failing with "no such table: agents" if migrations weren't applied.
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        agentAddress TEXT NOT NULL,
        agentOwner TEXT NOT NULL,
        agentName TEXT NOT NULL,
        tokenUri TEXT,
        createdAtBlock INTEGER NOT NULL,
        createdAtTime INTEGER NOT NULL,
        type TEXT,
        description TEXT,
        image TEXT,
        a2aEndpoint TEXT,
        ensEndpoint TEXT,
        agentAccountEndpoint TEXT,
        agentCardJson TEXT,
        agentCardReadAt INTEGER,
        supportedTrust TEXT,
        rawJson TEXT,
        updatedAtTime INTEGER,
        PRIMARY KEY (chainId, agentId)
      );

      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        agentId TEXT NOT NULL,
        type TEXT NOT NULL,
        blockNumber INTEGER NOT NULL,
        logIndex INTEGER NOT NULL,
        txHash TEXT NOT NULL,
        data TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS checkpoints (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS agent_skills (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        skill TEXT NOT NULL,
        PRIMARY KEY (chainId, agentId, skill)
      );

      CREATE INDEX IF NOT EXISTS idx_agents_chainId ON agents(chainId);
      CREATE INDEX IF NOT EXISTS idx_agents_agentOwner ON agents(agentOwner);
      CREATE INDEX IF NOT EXISTS idx_agents_createdAtTime ON agents(createdAtTime);
      CREATE INDEX IF NOT EXISTS idx_agents_agentName ON agents(agentName);
      CREATE INDEX IF NOT EXISTS idx_agent_skills_skill ON agent_skills(skill);
    `);
  } catch (e) {
    // Best-effort: if we can't create schema, the caller will still fail on insert with a clearer error.
    console.warn('[nanda-import] schema bootstrap failed', e);
  }
}

function parseIsoToUnixSeconds(value: unknown): number | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) return null;
  return Math.floor(ms / 1000);
}

function nonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  return s ? s : null;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((x) => typeof x === 'string')
    .map((x) => x.trim())
    .filter(Boolean);
}

export type NandaImportConfig = {
  nandaBaseUrl?: string; // default: https://nanda-registry.com
  // Target DB (Cloudflare D1 via API) for "nanda-indexer"
  cloudflareAccountId: string;
  cloudflareDatabaseId: string;
  cloudflareApiToken: string;
};

export type NandaImportOptions = {
  pageSize?: number; // default 100
  maxPages?: number; // default unlimited
  // For /api/v1/servers/ list mode
  search?: string;
  tags?: string; // comma-separated (servers mode)
  verified?: boolean; // servers mode
  serverTypes?: string; // optional filter for servers mode (maps to /api/v1/servers/?types=...)
  // For /api/v1/discovery/search/ mode
  query?: string; // default "agent"
  type?: string; // e.g. "agent"
  includeDetails?: boolean; // default false (detail calls add load)
  chainId?: number; // default 0 (non-chain registry)
  nandaBaseUrl?: string; // default https://nanda-registry.com
  mode?: 'servers' | 'discovery_search'; // default discovery_search
};

export function createNandaDbFromEnv(): AnyDb {
  // NANDA import must write to its dedicated D1 database.
  const accountId = process.env.NANDA_CLOUDFLARE_ACCOUNT_ID || '';
  const databaseId = process.env.NANDA_CLOUDFLARE_D1_DATABASE_ID || '';
  const apiToken = process.env.NANDA_CLOUDFLARE_API_TOKEN || '';

  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      'Missing NANDA D1 env. Set NANDA_CLOUDFLARE_ACCOUNT_ID, NANDA_CLOUDFLARE_D1_DATABASE_ID, NANDA_CLOUDFLARE_API_TOKEN',
    );
  }
  return createD1Database({ accountId, databaseId, apiToken });
}

async function upsertAgentFromNanda(db: AnyDb, chainId: number, summary: NandaServerSummary, detail?: NandaServerDetail): Promise<void> {
  const agentId = String(summary.id);
  const agentName = nonEmptyString(summary.name) ?? `nanda:${agentId}`;
  const provider = nonEmptyString(summary.provider) ?? 'nanda';
  const url = nonEmptyString(summary.url) ?? '';
  const docUrl = nonEmptyString(summary.documentation_url) ?? null;
  const image = nonEmptyString(summary.logo_url) ?? null;

  // Keep these non-null to match "erc8004-indexer-like" schema constraints.
  const agentAddress = `nanda:${agentId}`;
  const agentOwner = provider;

  const createdAtTime = parseIsoToUnixSeconds(summary.created_at) ?? Math.floor(Date.now() / 1000);
  const updatedAtTime = parseIsoToUnixSeconds(summary.updated_at) ?? createdAtTime;

  const description = nonEmptyString(summary.description) ?? null;

  // We store everything losslessly in rawJson; this is the easiest way to keep tables similar.
  const rawJson = JSON.stringify(detail ?? summary);

  // Mark this row as a NANDA-sourced record (re-using existing columns where possible).
  const type = 'NANDA';

  // Map to endpoint fields: for MCP Nexus, the server url is effectively the MCP endpoint.
  // We use a2aEndpoint sparingly; instead we store in agentAccountEndpoint.
  const agentAccountEndpoint = url || null;

  // Simple "supportedTrust" signal derived from verified flag (string field in schema).
  const supportedTrust = summary.verified === true ? 'verified' : null;

  await db
    .prepare(
      `
      INSERT INTO agents (
        chainId, agentId,
        agentAddress, agentOwner, agentName,
        tokenUri,
        createdAtBlock, createdAtTime,
        type, description, image,
        a2aEndpoint, ensEndpoint, agentAccountEndpoint,
        supportedTrust, rawJson,
        updatedAtTime
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId) DO UPDATE SET
        agentAddress=excluded.agentAddress,
        agentOwner=excluded.agentOwner,
        agentName=excluded.agentName,
        type=excluded.type,
        description=excluded.description,
        image=excluded.image,
        agentAccountEndpoint=excluded.agentAccountEndpoint,
        supportedTrust=excluded.supportedTrust,
        rawJson=excluded.rawJson,
        updatedAtTime=excluded.updatedAtTime
      `,
    )
    .run(
      chainId,
      agentId,
      agentAddress,
      agentOwner,
      agentName,
      docUrl, // tokenUri: best-effort doc URL
      0, // createdAtBlock: non-chain registry
      createdAtTime,
      type,
      description,
      image,
      null, // a2aEndpoint
      null, // ensEndpoint
      agentAccountEndpoint,
      supportedTrust,
      rawJson,
      updatedAtTime,
    );

  // Optional: populate normalized tables for filtering/search
  try {
    // Tags as agent_skills rows (lightweight discovery labels)
    const tags = normalizeStringArray(summary.tags);
    if (tags.length) {
      // Clear then repopulate tags for determinism
      await db.prepare(`DELETE FROM agent_skills WHERE chainId = ? AND agentId = ?`).run(chainId, agentId);
      for (const t of tags) {
        await db.prepare(`INSERT OR IGNORE INTO agent_skills(chainId, agentId, skill) VALUES(?, ?, ?)`).run(chainId, agentId, `tag:${t}`);
      }
    }
  } catch {
    // best-effort (tables may not exist if schema differs)
  }
}

export async function importNandaAgentsIntoD1(db: AnyDb, opts?: NandaImportOptions): Promise<{ processed: number }> {
  await ensureNandaSchema(db);

  const nandaBaseUrl = (opts?.nandaBaseUrl || process.env.NANDA_BASE_URL || 'https://nanda-registry.com').trim();
  const pageSize = typeof opts?.pageSize === 'number' && opts.pageSize > 0 ? Math.trunc(opts.pageSize) : 100;
  const maxPages = typeof opts?.maxPages === 'number' && opts.maxPages > 0 ? Math.trunc(opts.maxPages) : undefined;
  const chainId = typeof opts?.chainId === 'number' ? Math.trunc(opts.chainId) : 0;
  const includeDetails = opts?.includeDetails === true;
  // Default behavior: just page NANDA servers and upsert them into `agents`.
  // Probing each server URL for an agent card is optional because it adds network load and may time out.
  const probeServers = process.env.NANDA_PROBE === '1';
  const logEach = process.env.NANDA_LOG_EACH === '1';
  const mode = opts?.mode || (process.env.NANDA_IMPORT_MODE === 'servers' ? 'servers' : 'discovery_search');

  console.info('[nanda-import] settings', {
    mode,
    nandaBaseUrl,
    chainId,
    pageSize,
    maxPages: maxPages ?? null,
    includeDetails,
    probeServers,
    logEach,
  });

  let processed = 0;
  for (let page = 1; ; page++) {
    if (maxPages && page > maxPages) break;
    let results: Array<NandaServerSummary | NandaDiscoverySearchItem> = [];
    let nextPage: number | null = null;

    if (mode === 'servers') {
      // Default: import ALL servers. Only apply `types` filter if explicitly provided.
      const typesRaw = (opts?.serverTypes ?? process.env.NANDA_SERVER_TYPES) as unknown;
      const types = typeof typesRaw === 'string' ? typesRaw.trim() : '';
      const resp = await fetchNandaServersPage({
        baseUrl: nandaBaseUrl,
        page,
        limit: pageSize,
        search: opts?.search,
        types: types || undefined,
        tags: opts?.tags || process.env.NANDA_TAGS,
        verified: typeof opts?.verified === 'boolean' ? opts.verified : process.env.NANDA_VERIFIED === '1' ? true : undefined,
      });
      results = Array.isArray(resp?.results) ? resp.results : [];
      if (!results.length) break;
      nextPage = resp.next ? page + 1 : null;
    } else {
      const q = (opts?.query || process.env.NANDA_QUERY || 'agent').trim();
      const type = (opts?.type || process.env.NANDA_TYPE || 'agent').trim();
      const resp = await fetchNandaDiscoverySearchPage({ baseUrl: nandaBaseUrl, q, page, limit: pageSize, type });
      results = resp.results || [];
      if (!results.length) break;
      nextPage = resp.nextPage;
    }

    console.info('[nanda-import] page', { page, results: results.length, nextPage });

    for (const summary of results) {
      let detail: NandaServerDetail | undefined = undefined;
      if (includeDetails) {
        try {
          detail = await fetchNandaServerDetail({ baseUrl: nandaBaseUrl, id: String(summary.id) });
        } catch {
          detail = undefined;
        }
      }

      const agentId = String((summary as any)?.id ?? '');
      const agentName = typeof (summary as any)?.name === 'string' ? String((summary as any).name) : '';
      try {
        await upsertAgentFromNanda(db, chainId, summary as any, detail);
        processed += 1;
        if (logEach) {
          console.info('[nanda-import] upsert ok', { page, chainId, agentId, agentName });
        }
      } catch (e: any) {
        console.warn('[nanda-import] upsert failed', { page, chainId, agentId, agentName, err: e?.message || String(e) });
        // continue
        continue;
      }

      // Best-effort: probe the server url for an A2A agent card and store it in agents.agentCardJson.
      // Many NANDA entries are MCP servers and won't have an A2A card; we just skip quietly.
      if (probeServers) {
        try {
          const endpoint = typeof (summary as any)?.url === 'string' ? String((summary as any).url) : '';
          if (endpoint && endpoint.trim()) {
            await upsertAgentCardForAgent(db, chainId, String((summary as any).id), endpoint);
          }
        } catch {
          // ignore
        }
      }

      // If the card contains a simple directory of sub-agents (agents: []), ingest those too.
      if (probeServers) {
        try {
          const row = await db
            .prepare('SELECT agentCardJson FROM agents WHERE chainId = ? AND agentId = ?')
            .get(chainId, String((summary as any).id));
          const jsonText = (row as any)?.agentCardJson;
          if (typeof jsonText !== 'string' || !jsonText.trim()) continue;
          const card = JSON.parse(jsonText);
          const agentsList = Array.isArray(card?.agents) ? card.agents : [];
          if (!Array.isArray(agentsList) || !agentsList.length) continue;

          const provider = typeof (summary as any)?.provider === 'string' ? String((summary as any).provider) : 'NANDA';
          const parentId = String((summary as any).id);
          for (let i = 0; i < agentsList.length; i++) {
            const a = agentsList[i];
            const subIdRaw =
              (typeof a?.id === 'string' && a.id.trim() ? a.id.trim() : null) ||
              (typeof a?.slug === 'string' && a.slug.trim() ? a.slug.trim() : null) ||
              (typeof a?.name === 'string' && a.name.trim() ? a.name.trim() : null) ||
              String(i);
            const subAgentId = `${parentId}:${subIdRaw}`;
            const subName =
              (typeof a?.name === 'string' && a.name.trim() ? a.name.trim() : null) ||
              (typeof a?.title === 'string' && a.title.trim() ? a.title.trim() : null) ||
              subIdRaw;
            const subUrl =
              (typeof a?.url === 'string' && a.url.trim() ? a.url.trim() : null) ||
              (typeof a?.endpoint === 'string' && a.endpoint.trim() ? a.endpoint.trim() : null) ||
              (typeof a?.agentCardUrl === 'string' && a.agentCardUrl.trim() ? a.agentCardUrl.trim() : null);

            await upsertAgentFromNanda(
              db,
              chainId,
              {
                id: subAgentId,
                name: String(subName),
                slug: '',
                description: typeof a?.description === 'string' ? a.description : '',
                provider,
                types: ['agent'],
                tags: [],
                verified: false,
                created_at: undefined,
                updated_at: undefined,
                logo_url: undefined,
                rating: undefined,
                uptime: undefined,
                url: subUrl || (summary as any).url,
                documentation_url: null,
              },
              undefined,
            );

            if (subUrl && subUrl.trim()) {
              try {
                await upsertAgentCardForAgent(db, chainId, subAgentId, subUrl);
              } catch {
                // ignore
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }

    if (!nextPage) break;
  }

  return { processed };
}

export async function importNandaAgentsFromEnv(opts?: NandaImportOptions): Promise<{ processed: number }> {
  console.log('[nanda-import] importNandaAgentsFromEnv');
  const db = createNandaDbFromEnv();
  return await importNandaAgentsIntoD1(db, opts);
}


