import { createHandler } from 'graphql-http/lib/use/express';
import { GraphQLSchema } from 'graphql';
import { buildGraphQLSchema } from './graphql-schema';
import { buildGraphQLSchemaKb } from './graphql-schema-kb';
import express from 'express';
import { db, formatSQLTimestamp, getCheckpoint, setCheckpoint, ensureSchemaInitialized } from './db';
import crypto from 'crypto';
import { ethers } from 'ethers';
import { ERC8004Client, EthersAdapter } from '@agentic-trust/8004-sdk';
import { processAgentDirectly } from './process-agent';
import { createGraphQLResolvers, validateAccessCode as validateAccessCodeShared } from './graphql-resolvers';
import { createGraphQLResolversKb } from './graphql-resolvers-kb';
import { createDBQueries } from './create-resolvers';
import { createSemanticSearchServiceFromEnv } from './semantic/factory.js';
import {
  needsAuthentication,
  extractAccessCode,
  validateRequestAccessCode,
  executeGraphQL,
  parseGraphQLRequestExpress,
  corsHeaders,
  type GraphQLRequest,
} from './graphql-handler';
import { graphiqlHTML } from './graphiql-template';
import { createIndexAgentResolver, type ChainConfig } from './index-agent';
import { 
  ETH_SEPOLIA_IDENTITY_REGISTRY, 
  BASE_SEPOLIA_IDENTITY_REGISTRY, 
  OP_SEPOLIA_IDENTITY_REGISTRY,
  ETH_SEPOLIA_RPC_HTTP_URL, 
  BASE_SEPOLIA_RPC_HTTP_URL,
  OP_SEPOLIA_RPC_HTTP_URL,
  ETH_SEPOLIA_GRAPHQL_URL,
  BASE_SEPOLIA_GRAPHQL_URL,
  OP_SEPOLIA_GRAPHQL_URL,
  GRAPHQL_API_KEY
} from './env';

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

// Use shared schema
const schema = buildGraphQLSchema();
const schemaKb = buildGraphQLSchemaKb();

// Ensure schema checks have run in local Node mode (no-op in Workers).
await ensureSchemaInitialized();

// Helper function to parse JSON fields (if still needed for indexAgent)
function parseJsonField<T>(value: string | null | undefined): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

// Use shared validateAccessCode function
const validateAccessCode = (accessCode: string | null | undefined) => validateAccessCodeShared(db, accessCode);

// Define local indexAgent resolver using shared function
const chains: ChainConfig[] = [
  {
    rpcUrl: ETH_SEPOLIA_RPC_HTTP_URL,
    registryAddress: ETH_SEPOLIA_IDENTITY_REGISTRY!,
    chainId: 11155111,
    chainName: 'ETH Sepolia',
  },
  {
    rpcUrl: BASE_SEPOLIA_RPC_HTTP_URL,
    registryAddress: BASE_SEPOLIA_IDENTITY_REGISTRY!,
    chainId: 84532,
    chainName: 'Base Sepolia',
  },
];

if (OP_SEPOLIA_RPC_HTTP_URL && OP_SEPOLIA_IDENTITY_REGISTRY) {
  chains.push({
    rpcUrl: OP_SEPOLIA_RPC_HTTP_URL,
    registryAddress: OP_SEPOLIA_IDENTITY_REGISTRY,
    chainId: 11155420,
    chainName: 'Optimism Sepolia',
  });
}

// Create backfill clients for full indexing
const backfillClients: ERC8004Client[] = [
  new ERC8004Client({
    adapter: new EthersAdapter(new ethers.JsonRpcProvider(ETH_SEPOLIA_RPC_HTTP_URL)),
    addresses: {
      identityRegistry: ETH_SEPOLIA_IDENTITY_REGISTRY!,
      reputationRegistry: '0x0000000000000000000000000000000000000000',
      validationRegistry: '0x0000000000000000000000000000000000000000',
      chainId: 11155111,
    }
  }),
  new ERC8004Client({
    adapter: new EthersAdapter(new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC_HTTP_URL)),
    addresses: {
      identityRegistry: BASE_SEPOLIA_IDENTITY_REGISTRY!,
      reputationRegistry: '0x0000000000000000000000000000000000000000',
      validationRegistry: '0x0000000000000000000000000000000000000000',
      chainId: 84532,
    }
  }),
];

if (OP_SEPOLIA_RPC_HTTP_URL && OP_SEPOLIA_IDENTITY_REGISTRY) {
  backfillClients.push(
    new ERC8004Client({
      adapter: new EthersAdapter(new ethers.JsonRpcProvider(OP_SEPOLIA_RPC_HTTP_URL)),
      addresses: {
        identityRegistry: OP_SEPOLIA_IDENTITY_REGISTRY,
        reputationRegistry: '0x0000000000000000000000000000000000000000',
        validationRegistry: '0x0000000000000000000000000000000000000000',
        chainId: 11155420,
      }
    })
  );
}

const localIndexAgentResolver = await createIndexAgentResolver({
  db,
  chains,
  triggerBackfill: true,
  backfillClients,
});

// Create resolvers using shared function
const semanticSearchService = createSemanticSearchServiceFromEnv();
const root = createDBQueries(db, localIndexAgentResolver, {
  semanticSearchService,
});
const rootKb = createGraphQLResolversKb({ semanticSearchService }) as any;

// processAgentDirectly is now imported from './process-agent'

// Create GraphQL handler
// graphql-http's Express handler automatically reads from req.body when it's parsed
// Make sure req.body is parsed before this handler runs (express.json() does this)
const handler = createHandler({
  schema: schema as GraphQLSchema,
  rootValue: root,
  context: () => ({}),
});

const handlerKb = createHandler({
  schema: schemaKb as GraphQLSchema,
  rootValue: rootKb,
  context: () => ({}),
});

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
        (root as any).intentTypes?.({ limit: 5000, offset: 0 }) ?? [],
        (root as any).taskTypes?.({ limit: 5000, offset: 0 }) ?? [],
        (root as any).intentTaskMappings?.({ limit: 5000, offset: 0 }) ?? [],
        (root as any).oasfSkills?.({ limit: 5000, offset: 0 }) ?? [],
        (root as any).oasfDomains?.({ limit: 5000, offset: 0 }) ?? [],
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
      const skills = await (root as any).oasfSkills?.({ limit, offset }) ?? [];
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
      const domains = await (root as any).oasfDomains?.({ limit, offset }) ?? [];
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

  // Access code authentication middleware - using shared handler logic
  app.use('/graphql', async (req, res, next) => {
    // Only apply auth to POST requests (GET requests show GraphiQL UI)
    if (req.method !== 'POST') {
      return next();
    }

    const request = parseGraphQLRequestExpress(req);
    
    // Check if authentication is needed
    if (!needsAuthentication(request.query, request.operationName)) {
      return next();
    }

    // Extract and validate access code
    const authHeader = req.headers.authorization || '';
    const accessCode = extractAccessCode(authHeader);
    const secretAccessCode = process.env.GRAPHQL_SECRET_ACCESS_CODE;
    
    const validation = await validateRequestAccessCode(accessCode, secretAccessCode, db);
    if (!validation.valid) {
      return res.status(401).json({
        errors: [{ message: validation.error || 'Invalid access code' }]
      });
    }

    next();
  });

  // Access code authentication middleware for KB endpoint - same policy as /graphql
  app.use('/graphql-kb', async (req, res, next) => {
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

    const validation = await validateRequestAccessCode(accessCode, secretAccessCode, db);
    if (!validation.valid) {
      return res.status(401).json({
        errors: [{ message: validation.error || 'Invalid access code' }],
      });
    }

    next();
  });

  // GraphQL endpoint - show GraphiQL UI on GET, handle queries on POST

  app.get('/graphql', (req, res) => {
    res.send(graphiqlHTML);
  });

  app.get('/graphql-kb', (req, res) => {
    // NOTE: GraphiQL template may still point at /graphql; keep this for discoverability.
    res.send(graphiqlHTML);
  });

  // Handle POST requests for GraphQL queries
  // graphql-http's createHandler from 'use/express' returns Express middleware
  // It should automatically read from req.body (parsed by express.json())

  app.post('/graphql', handler);
  app.post('/graphql-kb', handlerKb);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Simple GraphiQL endpoint - same as /graphql

  app.get('/graphiql', (req, res) => {
    res.send(graphiqlHTML);
  });

  const server = app.listen(port, () => {
    console.log(`🚀 GraphQL server running at http://localhost:${port}/graphql`);
    console.log(`📊 GraphiQL playground available at:`);
    console.log(`   - http://localhost:${port}/graphql (GET - GraphiQL UI)`);
    console.log(`   - http://localhost:${port}/graphiql (GET - GraphiQL UI, alternative)`);
  });

  return server;
}

