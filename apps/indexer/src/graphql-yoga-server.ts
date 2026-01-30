import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import { graphQLSchemaString } from './graphql-schema';
import { graphQLSchemaStringKb } from './graphql-schema-kb';
import { createDBQueries } from './create-resolvers';
import { createGraphQLResolversKb } from './graphql-resolvers-kb';
import { createSemanticSearchServiceFromEnv } from './semantic/factory.js';
import { db, ensureSchemaInitialized } from './db';
import {
  needsAuthentication,
  extractAccessCode,
  validateRequestAccessCode,
} from './graphql-handler';
import { createIndexAgentResolver } from './index-agent';

async function createYogaGraphQLServer(port: number = Number(process.env.GRAPHQL_SERVER_PORT ?? 4000)) {
  await ensureSchemaInitialized();

  const localIndexAgentResolver = await createIndexAgentResolver({
    db,
    chains: [],
  });

  const semanticSearchService = createSemanticSearchServiceFromEnv();

  // Create shared resolvers and adapt to Yoga-style resolvers map
  const shared = createDBQueries(db, localIndexAgentResolver, {
    semanticSearchService,
  }) as any;

  const sharedKb = createGraphQLResolversKb({ semanticSearchService }) as any;
  const resolvers = {
    Query: {
      agents: (_parent: unknown, args: any) => shared.agents(args),
      agent: (_parent: unknown, args: any) => shared.agent(args),
      agentByName: (_parent: unknown, args: any) => shared.agentByName(args),
      agentsByChain: (_parent: unknown, args: any) => shared.agentsByChain(args),
      agentsByOwner: (_parent: unknown, args: any) => shared.agentsByOwner(args),
      searchAgents: (_parent: unknown, args: any) => shared.searchAgents(args),
      searchAgentsGraph: (_parent: unknown, args: any) => shared.searchAgentsGraph(args),
      getAccessCode: (_parent: unknown, args: any) => shared.getAccessCode(args),
      countAgents: (_parent: unknown, args: any) => shared.countAgents(args),
      semanticAgentSearch: (_parent: unknown, args: any) => shared.semanticAgentSearch(args),
      associations: (_parent: unknown, args: any) => shared.associations(args),
      agentAssociations: (_parent: unknown, args: any) => shared.agentAssociations(args),
      graphqlEndpointAssociations: (_parent: unknown, args: any) => shared.graphqlEndpointAssociations(args),
      graphqlEndpointAssociationsBetween: (_parent: unknown, args: any) => shared.graphqlEndpointAssociationsBetween(args),
      trustScore: (_parent: unknown, args: any) => shared.trustScore(args),
      agentTrustIndex: (_parent: unknown, args: any) => shared.agentTrustIndex(args),
      agentTrustComponents: (_parent: unknown, args: any) => shared.agentTrustComponents(args),
      trustLedgerBadgeDefinitions: (_parent: unknown, args: any) => shared.trustLedgerBadgeDefinitions(args),
      fetchAgentCard: (_parent: unknown, args: any) => shared.fetchAgentCard(args),
      callA2A: (_parent: unknown, args: any) => shared.callA2A(args),
    },
    Mutation: {
      createAccessCode: (_parent: unknown, args: any) => shared.createAccessCode(args),
      indexAgent: (_parent: unknown, args: any) => shared.indexAgent(args),
      indexAgentByUaid: (_parent: unknown, args: any) => shared.indexAgentByUaid(args),
      upsertTrustLedgerBadgeDefinition: (_parent: unknown, args: any) => shared.upsertTrustLedgerBadgeDefinition(args),
      setTrustLedgerBadgeActive: (_parent: unknown, args: any) => shared.setTrustLedgerBadgeActive(args),
    },
  };

  const schemaV1 = createSchema({
    typeDefs: graphQLSchemaString,
    resolvers,
  });

  const schemaKb = createSchema({
    typeDefs: graphQLSchemaStringKb,
    resolvers: {
      Query: {
        oasfSkills: (_p: unknown, args: any, ctx: any) => sharedKb.oasfSkills(args, ctx),
        oasfDomains: (_p: unknown, args: any, ctx: any) => sharedKb.oasfDomains(args, ctx),
        intentTypes: (_p: unknown, args: any, ctx: any) => sharedKb.intentTypes(args, ctx),
        taskTypes: (_p: unknown, args: any, ctx: any) => sharedKb.taskTypes(args, ctx),
        intentTaskMappings: (_p: unknown, args: any, ctx: any) => sharedKb.intentTaskMappings(args, ctx),
        kbAgents: (_p: unknown, args: any, ctx: any) => sharedKb.kbAgents(args, ctx),
        kbAgent: (_p: unknown, args: any, ctx: any) => sharedKb.kbAgent(args, ctx),
        kbAgentByDid: (_p: unknown, args: any, ctx: any) => sharedKb.kbAgentByDid(args, ctx),
        kbSemanticAgentSearch: (_p: unknown, args: any, ctx: any) => sharedKb.kbSemanticAgentSearch(args, ctx),
        kbFeedbacks: (_p: unknown, args: any, ctx: any) => sharedKb.kbFeedbacks(args, ctx),
        kbValidations: (_p: unknown, args: any, ctx: any) => sharedKb.kbValidations(args, ctx),
        kbAssociations: (_p: unknown, args: any, ctx: any) => sharedKb.kbAssociations(args, ctx),
        kbAgentTrustIndex: (_p: unknown, args: any, ctx: any) => sharedKb.kbAgentTrustIndex(args, ctx),
        kbTrustLedgerBadgeDefinitions: (_p: unknown, args: any, ctx: any) => sharedKb.kbTrustLedgerBadgeDefinitions(args, ctx),
      },
    },
  });

  const makeYoga = (schema: any, graphqlEndpoint: string) =>
    createYoga({
      schema,
      graphqlEndpoint,
      maskedErrors: false,
      // Auth in Yoga context (mirrors Express middleware behavior)
      context: async ({ request }) => {
        const requestId = request.headers.get('x-request-id') || randomUUID();
        const timings: Array<{ label: string; ms: number; resultBindings?: number | null }> = [];
        try {
          const url = new URL(request.url, 'http://localhost');
          let body: any = null;
          if (request.method === 'POST') {
            try {
              body = await request.clone().json();
            } catch {
              body = null;
            }
          }
          const query = body?.query || url.searchParams.get('query') || '';
          const operationName = body?.operationName || url.searchParams.get('operationName') || undefined;

          if (needsAuthentication(query, operationName)) {
            const authHeader = request.headers.get('authorization') || '';
            const accessCode = extractAccessCode(authHeader);
            const secretAccessCode = process.env.GRAPHQL_SECRET_ACCESS_CODE;
            const validation = await validateRequestAccessCode(accessCode, secretAccessCode, db);
            if (!validation.valid) {
              throw new Error(validation.error || 'Invalid access code');
            }
          }
        } catch {
          // If parsing fails, fall through - GraphQL execution will handle errors
        }
        return {
          graphdb: {
            requestId,
            requestCache: new Map<string, Promise<any>>(),
            timings,
          },
        };
      },
    });

  const yogaV1 = makeYoga(schemaV1, '/graphql');
  const yogaKb = makeYoga(schemaKb, '/graphql-kb');

  const server = createServer((req, res) => {
    const url = req.url || '/';
    if (url.startsWith('/graphql-kb')) {
      return yogaKb(req, res);
    }
    return yogaV1(req, res);
  });
  server.listen(port, () => {
    console.log(`🧘 Yoga GraphQL server running at http://localhost:${port}/graphql`);
    console.log(`🧠 KB GraphQL server running at http://localhost:${port}/graphql-kb`);
  });
}

void createYogaGraphQLServer();


