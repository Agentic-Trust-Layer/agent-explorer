import { graphql, GraphQLSchema } from 'graphql';
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
    try {
      const request = parseGraphQLRequestExpress(req);

      const result = await graphql({
        schema: schemaKb as GraphQLSchema,
        source: request.query || '',
        rootValue: rootKb,
        variableValues: request.variables || {},
        operationName: request.operationName,
      });

      if (Array.isArray((result as any)?.errors) && (result as any).errors.length) {
        console.warn(
          `⚠️  GraphQL errors (${req.path})`,
          (result as any).errors.map((e: any) => e?.message || String(e)),
        );
      }

      res.setHeader('Content-Type', 'application/json');
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v as any));
      res.status(200).send(JSON.stringify(result));
    } catch (e: any) {
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

