/**
 * Cloudflare Workers entry point for ERC8004 Indexer GraphQL API (with Yoga)
 */

import { createYoga, createSchema } from 'graphql-yoga';
import { graphQLSchemaString } from './graphql-schema.js';
import { graphQLSchemaStringKb } from './graphql-schema-kb.js';

// Import shared functions
import { validateAccessCode } from './graphql-resolvers.js';
import { processAgentDirectly } from './process-agent.js';
import { createDBQueries } from './create-resolvers.js';
import { createGraphQLResolversKb } from './graphql-resolvers-kb.js';
import { createIndexAgentResolver } from './index-agent.js';
import {
  needsAuthentication,
  extractAccessCode,
  validateRequestAccessCode,
  corsHeaders as sharedCorsHeaders,
} from './graphql-handler.js';
import { graphiqlHTML } from './graphiql-template.js';
import { createSemanticSearchServiceFromEnv } from './semantic/factory.js';
export { SyncAgentPipelineDO } from './sync-agent-pipeline-do.js';

function shouldBridgeEnvKeyToProcessEnv(key: string): boolean {
  return (
    key === 'NODE_ENV' ||
    key.startsWith('GRAPHDB_') ||
    key.startsWith('DEBUG_GRAPHDB') ||
    key === 'GRAPHQL_API_KEY' ||
    key === 'ETH_MAINNET_GRAPHQL_URL' ||
    key === 'LINEA_MAINNET_GRAPHQL_URL'
  );
}

/**
 * In Workers, bindings arrive via the `env` parameter.
 * Much of this codebase (GraphDB, KB queries) reads from `process.env` (Node-style).
 * Bridge selected Worker bindings into `process.env` so production uses the same config
 * as local Node runs.
 */
function bridgeEnvToProcessEnv(env: Record<string, unknown> | undefined): void {
  try {
    const p = (globalThis as any).process as { env?: Record<string, string | undefined> } | undefined;
    if (!p?.env || !env) return;
    for (const [k, v] of Object.entries(env)) {
      if (!shouldBridgeEnvKeyToProcessEnv(k)) continue;
      if (typeof v === 'string') p.env[k] = v;
      else if (typeof v === 'number' || typeof v === 'boolean') p.env[k] = String(v);
    }
  } catch {
    // best-effort
  }
}

/**
 * Workers-specific indexAgent resolver factory
 */
async function createWorkersIndexAgentResolver(db: any, env?: any) {
  return createIndexAgentResolver({
    db,
    chains: [],
  });
}

// Create a function that returns createDBQueries with Workers indexAgent
// Note: This is async and must be awaited when called
let semanticSearchCache: ReturnType<typeof createSemanticSearchServiceFromEnv> | undefined;
const createWorkersDBQueries = async (db: any, env?: any) => {
  const indexAgentResolver = await createWorkersIndexAgentResolver(db, env);
  if (semanticSearchCache === undefined) {
    semanticSearchCache = createSemanticSearchServiceFromEnv(env) ?? null;
  }
  return createDBQueries(db, indexAgentResolver, {
    semanticSearchService: semanticSearchCache ?? null,
  });
};


// GraphiQL HTML template is imported from shared module

// Use shared CORS headers
const corsHeaders = sharedCorsHeaders;

interface Env {
  DB: any; // D1Database type will be available at runtime
  GRAPHQL_SECRET_ACCESS_CODE?: string; // Secret access code for server-to-server authentication
  // Chain configuration - RPC URLs
  ETH_SEPOLIA_RPC_URL?: string;
  ETH_SEPOLIA_RPC_HTTP_URL?: string;
  BASE_SEPOLIA_RPC_URL?: string;
  BASE_SEPOLIA_RPC_HTTP_URL?: string;
  OP_SEPOLIA_RPC_URL?: string;
  OP_SEPOLIA_RPC_HTTP_URL?: string;
  LINEA_MAINNET_RPC_URL?: string;
  LINEA_MAINNET_RPC_HTTP_URL?: string;
  // Chain configuration - Registry addresses
  ETH_SEPOLIA_IDENTITY_REGISTRY?: string;
  BASE_SEPOLIA_IDENTITY_REGISTRY?: string;
  OP_SEPOLIA_IDENTITY_REGISTRY?: string;
  LINEA_MAINNET_IDENTITY_REGISTRY?: string;
  // Additional bindings are present (GraphDB, debug flags, etc.)
  [key: string]: any;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: { waitUntil?: (promise: Promise<any>) => void }
  ): Promise<Response> {
    bridgeEnvToProcessEnv(env as any);
    const url = new URL(request.url);

    // Handle CORS preflight early
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health check stays as a lightweight endpoint
    if (url.pathname === '/health' && request.method === 'GET') {
      return Response.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: 'cloudflare-workers'
      }, { headers: corsHeaders });
    }

    // Discovery taxonomy endpoint (always fetches from GraphDB; no caching)
    if (url.pathname === '/api/discovery/taxonomy' && request.method === 'GET') {
      const dbQueries = await createWorkersDBQueries(env.DB, env);
      const [intentTypes, taskTypes, intentTaskMappings, oasfSkills, oasfDomains] = await Promise.all([
        (dbQueries as any).intentTypes?.({ limit: 5000, offset: 0 }) ?? [],
        (dbQueries as any).taskTypes?.({ limit: 5000, offset: 0 }) ?? [],
        (dbQueries as any).intentTaskMappings?.({ limit: 5000, offset: 0 }) ?? [],
        (dbQueries as any).oasfSkills?.({ limit: 5000, offset: 0 }) ?? [],
        (dbQueries as any).oasfDomains?.({ limit: 5000, offset: 0 }) ?? [],
      ]);

      return Response.json(
        {
          intentTypes,
          taskTypes,
          intentTaskMappings,
          oasfSkills,
          oasfDomains,
          fetchedAt: new Date().toISOString(),
          source: 'graphdb',
        },
        {
          headers: {
            ...corsHeaders,
            // Prevent any caching (browser, proxies, CF)
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            Pragma: 'no-cache',
            Expires: '0',
          },
        },
      );
    }

    // OASF skills endpoint (always fetches from GraphDB; no caching)
    if (url.pathname === '/api/oasf/skills' && request.method === 'GET') {
      const dbQueries = await createWorkersDBQueries(env.DB, env);
      const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 5000;
      const offset = url.searchParams.get('offset') ? Number(url.searchParams.get('offset')) : 0;
      const skills = await (dbQueries as any).oasfSkills?.({ limit, offset }) ?? [];
      return Response.json(
        { skills, count: Array.isArray(skills) ? skills.length : 0, fetchedAt: new Date().toISOString(), source: 'graphdb' },
        {
          headers: {
            ...corsHeaders,
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            Pragma: 'no-cache',
            Expires: '0',
          },
        },
      );
    }

    // OASF domains endpoint (always fetches from GraphDB; no caching)
    if (url.pathname === '/api/oasf/domains' && request.method === 'GET') {
      const dbQueries = await createWorkersDBQueries(env.DB, env);
      const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 5000;
      const offset = url.searchParams.get('offset') ? Number(url.searchParams.get('offset')) : 0;
      const domains = await (dbQueries as any).oasfDomains?.({ limit, offset }) ?? [];
      return Response.json(
        { domains, count: Array.isArray(domains) ? domains.length : 0, fetchedAt: new Date().toISOString(), source: 'graphdb' },
        {
          headers: {
            ...corsHeaders,
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            Pragma: 'no-cache',
            Expires: '0',
          },
        },
      );
    }

    // Serve custom GraphiQL (with default headers/query) like before
    if (
      (url.pathname === '/graphiql' && request.method === 'GET') ||
      (url.pathname === '/graphql' && request.method === 'GET' && !url.searchParams.get('query')) ||
      (url.pathname === '/graphql-kb' && request.method === 'GET' && !url.searchParams.get('query'))
    ) {
      return new Response(graphiqlHTML, {
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders,
        },
      });
    }

    // Build Yoga schemas on first request (schema/resolvers are static)
    if (!(globalThis as any).__schemaV1) {
      (globalThis as any).__schemaV1 = createSchema({
        typeDefs: graphQLSchemaString,
        resolvers: {
          Query: {
            oasfSkills: (_p: any, args: any, ctx: any) => ctx.dbQueries.oasfSkills(args),
            oasfDomains: (_p: any, args: any, ctx: any) => ctx.dbQueries.oasfDomains(args),
            intentTypes: (_p: any, args: any, ctx: any) => ctx.dbQueries.intentTypes(args),
            taskTypes: (_p: any, args: any, ctx: any) => ctx.dbQueries.taskTypes(args),
            intentTaskMappings: (_p: any, args: any, ctx: any) => ctx.dbQueries.intentTaskMappings(args),
            agents: (_p: any, args: any, ctx: any) => ctx.dbQueries.agents(args),
            agent: (_p: any, args: any, ctx: any) => ctx.dbQueries.agent(args),
            agentByName: (_p: any, args: any, ctx: any) => ctx.dbQueries.agentByName(args),
            agentsByChain: (_p: any, args: any, ctx: any) => ctx.dbQueries.agentsByChain(args),
            agentsByOwner: (_p: any, args: any, ctx: any) => ctx.dbQueries.agentsByOwner(args),
            searchAgents: (_p: any, args: any, ctx: any) => ctx.dbQueries.searchAgents(args),
            searchAgentsGraph: (_p: any, args: any, ctx: any) => ctx.dbQueries.searchAgentsGraph(args),
            getAccessCode: (_p: any, args: any, ctx: any) => ctx.dbQueries.getAccessCode(args),
            countAgents: (_p: any, args: any, ctx: any) => ctx.dbQueries.countAgents(args),
            semanticAgentSearch: (_p: any, args: any, ctx: any) => ctx.dbQueries.semanticAgentSearch(args),
            agentMetadata: (_p: any, args: any, ctx: any) => ctx.dbQueries.agentMetadata(args),
            agentMetadataById: (_p: any, args: any, ctx: any) => ctx.dbQueries.agentMetadataById(args),
            associations: (_p: any, args: any, ctx: any) => ctx.dbQueries.associations(args),
            agentAssociations: (_p: any, args: any, ctx: any) => ctx.dbQueries.agentAssociations(args),
            graphqlEndpointAssociations: (_p: any, args: any, ctx: any) => ctx.dbQueries.graphqlEndpointAssociations(args),
            graphqlEndpointAssociationsBetween: (_p: any, args: any, ctx: any) => ctx.dbQueries.graphqlEndpointAssociationsBetween(args),
            trustScore: (_p: any, args: any, ctx: any) => ctx.dbQueries.trustScore(args),
            agentTrustIndex: (_p: any, args: any, ctx: any) => ctx.dbQueries.agentTrustIndex(args),
            agentTrustComponents: (_p: any, args: any, ctx: any) => ctx.dbQueries.agentTrustComponents(args),
            feedbacks: (_p: any, args: any, ctx: any) => ctx.dbQueries.feedbacks(args),
            feedback: (_p: any, args: any, ctx: any) => ctx.dbQueries.feedback(args),
            feedbackByReference: (_p: any, args: any, ctx: any) => ctx.dbQueries.feedbackByReference(args),
            searchFeedbacks: (_p: any, args: any, ctx: any) => ctx.dbQueries.searchFeedbacks(args),
            searchFeedbacksGraph: (_p: any, args: any, ctx: any) => ctx.dbQueries.searchFeedbacksGraph(args),
            countFeedbacks: (_p: any, args: any, ctx: any) => ctx.dbQueries.countFeedbacks(args),
            feedbackResponses: (_p: any, args: any, ctx: any) => ctx.dbQueries.feedbackResponses(args),
            feedbackRevocations: (_p: any, args: any, ctx: any) => ctx.dbQueries.feedbackRevocations(args),
            validationRequests: (_p: any, args: any, ctx: any) => ctx.dbQueries.validationRequests(args),
            validationRequest: (_p: any, args: any, ctx: any) => ctx.dbQueries.validationRequest(args),
            validationResponses: (_p: any, args: any, ctx: any) => ctx.dbQueries.validationResponses(args),
            validationResponse: (_p: any, args: any, ctx: any) => ctx.dbQueries.validationResponse(args),
            countValidationRequests: (_p: any, args: any, ctx: any) => ctx.dbQueries.countValidationRequests(args),
            countValidationResponses: (_p: any, args: any, ctx: any) => ctx.dbQueries.countValidationResponses(args),
          },
          Mutation: {
            createAccessCode: (_p: any, args: any, ctx: any) => ctx.dbQueries.createAccessCode(args),
            indexAgent: (_p: any, args: any, ctx: any) => ctx.dbQueries.indexAgent(args),
            indexAgentByUaid: (_p: any, args: any, ctx: any) => ctx.dbQueries.indexAgentByUaid(args),
          },
        },
      });
    }

    if (!(globalThis as any).__schemaKb) {
      // KB resolvers are GraphDB-backed; they do not depend on D1 tables.
      const semanticSearchService = createSemanticSearchServiceFromEnv(env) ?? null;
      const sharedKb = createGraphQLResolversKb({ semanticSearchService }) as any;
      const extraSyncTypeDefs = `
        type KbSyncJob {
          id: ID!
          status: String!
          chainIds: [Int!]!
          createdAt: Float!
          startedAt: Float
          endedAt: Float
          processedAgents: Int!
          limitAgents: Int!
          batchSize: Int!
          chainIndex: Int!
          error: String
          logTail: String
        }

        extend type Query {
          kbSyncJob(id: ID!): KbSyncJob
        }

        extend type Mutation {
          # Worker-compatible, incremental agent sync (agents only) into GraphDB.
          # Runs in background via Durable Object alarms.
          kbSyncAgentPipeline(chainIds: [Int!]!, limitAgents: Int, batchSize: Int): KbSyncJob!
        }
      `;
      (globalThis as any).__schemaKb = createSchema({
        typeDefs: graphQLSchemaStringKb + extraSyncTypeDefs,
        resolvers: {
          Query: {
            oasfSkills: (_p: any, args: any) => sharedKb.oasfSkills(args),
            oasfDomains: (_p: any, args: any) => sharedKb.oasfDomains(args),
            intentTypes: (_p: any, args: any) => sharedKb.intentTypes(args),
            taskTypes: (_p: any, args: any) => sharedKb.taskTypes(args),
            intentTaskMappings: (_p: any, args: any) => sharedKb.intentTaskMappings(args),
            kbAgents: (_p: any, args: any) => sharedKb.kbAgents(args),
                kbOwnedAgents: (_p: any, args: any) => sharedKb.kbOwnedAgents(args),
                kbOwnedAgentsAllChains: (_p: any, args: any) => sharedKb.kbOwnedAgentsAllChains(args),
                kbIsOwner: (_p: any, args: any) => sharedKb.kbIsOwner(args),
                kbAgentByUaid: (_p: any, args: any) => sharedKb.kbAgentByUaid(args),
            kbHolAgentProfileByUaid: (_p: any, args: any) => sharedKb.kbHolAgentProfileByUaid(args),
            kbHolCapabilities: (_p: any, args: any) => sharedKb.kbHolCapabilities(args),
            kbHolRegistries: (_p: any, args: any) => sharedKb.kbHolRegistries(args),
            kbHolRegistriesForProtocol: (_p: any, args: any) => sharedKb.kbHolRegistriesForProtocol(args),
            kbHolStats: (_p: any, args: any) => sharedKb.kbHolStats(args),
            kbHolRegistrySearch: (_p: any, args: any) => sharedKb.kbHolRegistrySearch(args),
            kbHolVectorSearch: (_p: any, args: any) => sharedKb.kbHolVectorSearch(args),
            kbSemanticAgentSearch: (_p: any, args: any) => sharedKb.kbSemanticAgentSearch(args),
            kbErc8122Registries: (_p: any, args: any) => sharedKb.kbErc8122Registries(args),
                kbReviews: (_p: any, args: any) => sharedKb.kbReviews(args),
            kbValidations: (_p: any, args: any) => sharedKb.kbValidations(args),
            kbAssociations: (_p: any, args: any) => sharedKb.kbAssociations(args),
            kbAgentTrustIndex: (_p: any, args: any) => sharedKb.kbAgentTrustIndex(args),
            kbTrustLedgerBadgeDefinitions: (_p: any, args: any) => sharedKb.kbTrustLedgerBadgeDefinitions(args),
            kbSyncJob: async (_p: any, args: any) => {
              const id = typeof args?.id === 'string' ? args.id.trim() : '';
              if (!id) return null;
              const stub = (env as any).SYNC_AGENT_PIPELINE?.get?.((env as any).SYNC_AGENT_PIPELINE.idFromName(id));
              if (!stub) throw new Error('SYNC_AGENT_PIPELINE Durable Object binding is not configured');
              const resp = await stub.fetch('https://do/status');
              const json: any = await resp.json().catch(() => null);
              if (!resp.ok) return null;
              return {
                id: json.id,
                status: json.status,
                chainIds: json.chainIds,
                createdAt: json.createdAt,
                startedAt: json.startedAt,
                endedAt: json.endedAt,
                processedAgents: json.processedAgents ?? 0,
                limitAgents: json.limitAgents ?? 0,
                batchSize: json.batchSize ?? 0,
                chainIndex: json.chainIndex ?? 0,
                error: json.error ?? null,
                logTail: json.logTail ?? null,
              };
            },
          },
          Mutation: {
            kbHolSyncCapabilities: (_p: any, args: any) => sharedKb.kbHolSyncCapabilities(args),
            kbSyncAgentPipeline: async (_p: any, args: any) => {
              const chainIds = Array.isArray(args?.chainIds) ? args.chainIds : [];
              const id = crypto.randomUUID();
              const stub = (env as any).SYNC_AGENT_PIPELINE?.get?.((env as any).SYNC_AGENT_PIPELINE.idFromName(id));
              if (!stub) throw new Error('SYNC_AGENT_PIPELINE Durable Object binding is not configured');
              const resp = await stub.fetch(`https://do/start?id=${encodeURIComponent(id)}`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                  id,
                  chainIds,
                  limitAgents: typeof args?.limitAgents === 'number' ? args.limitAgents : undefined,
                  batchSize: typeof args?.batchSize === 'number' ? args.batchSize : undefined,
                }),
              });
              const json: any = await resp.json().catch(() => null);
              if (!resp.ok) throw new Error(json?.error || 'Failed to start sync job');
              // Return initial status (queued)
              const st = await stub.fetch('https://do/status');
              const sj: any = await st.json().catch(() => null);
              return {
                id: sj?.id ?? id,
                status: sj?.status ?? 'queued',
                chainIds: sj?.chainIds ?? chainIds,
                createdAt: sj?.createdAt ?? Date.now(),
                startedAt: sj?.startedAt ?? null,
                endedAt: sj?.endedAt ?? null,
                processedAgents: sj?.processedAgents ?? 0,
                limitAgents: sj?.limitAgents ?? 0,
                batchSize: sj?.batchSize ?? 0,
                chainIndex: sj?.chainIndex ?? 0,
                error: sj?.error ?? null,
                logTail: sj?.logTail ?? null,
              };
            },
          },
        },
      });
    }

    const isKb = url.pathname.startsWith('/graphql-kb');

    // Create Yoga per request so we can close over env/DB in context
    const yoga = createYoga({
      schema: isKb ? (globalThis as any).__schemaKb : (globalThis as any).__schemaV1,
      graphqlEndpoint: isKb ? '/graphql-kb' : '/graphql',
      maskedErrors: false,
      context: async ({ request }) => {
        // Parse minimal GraphQL details to decide auth
        let query = '';
        let operationName: string | undefined = undefined;
        try {
          const url2 = new URL(request.url);
          if (request.method === 'POST') {
            const body = await request.clone().json().catch(() => null) as any;
            query = body?.query ?? '';
            operationName = body?.operationName ?? undefined;
          } else if (request.method === 'GET') {
            query = url2.searchParams.get('query') ?? '';
            operationName = url2.searchParams.get('operationName') ?? undefined;
          }
        } catch {}

        // Auth (skip for access-code / indexAgent)
        if (needsAuthentication(query, operationName)) {
          const authHeader = request.headers.get('authorization') || '';
          const accessCode = extractAccessCode(authHeader);
          const secretAccessCode = env.GRAPHQL_SECRET_ACCESS_CODE;
          const validation = await validateRequestAccessCode(accessCode, secretAccessCode, env.DB);
          if (!validation.valid) {
            throw new Error(validation.error || 'Invalid access code');
          }
        }

        if (isKb) {
          // KB schema doesn't use ctx.dbQueries
          return {};
        }

        // v1 schema: Build per-request DB resolvers (with Workers-aware indexAgent)
        const dbQueries = await createWorkersDBQueries(env.DB, env);
        return { dbQueries };
      },
    });

    // Route all non-health requests through Yoga (including /graphql and /)
    const resp = await yoga.fetch(request);
    // Ensure CORS headers present
    Object.entries(corsHeaders).forEach(([k, v]) => resp.headers.set(k, v));
    return resp;
  },
};

