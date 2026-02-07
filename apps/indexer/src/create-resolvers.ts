/**
 * Shared function to create GraphQL resolvers with environment-specific indexAgent
 */

import { createGraphQLResolvers, type GraphQLResolverOptions } from './graphql-resolvers.js';
import { getGraphdbConfigFromEnv, queryGraphdb } from './graphdb/graphdb-http.js';

type ParsedUaid =
  | { kind: 'did:8004'; chainId: number; agentId: string }
  | { kind: 'did:ethr'; chainId: number; address: string };

function parseUaid(uaid: string): ParsedUaid {
  const raw = typeof uaid === 'string' ? uaid.trim() : '';
  if (!raw.startsWith('uaid:')) {
    throw new Error(`uaid must start with "uaid:"`);
  }
  const did = raw.slice('uaid:'.length);
  const m8004 = /^did:8004:(\d+):(\d+)$/.exec(did);
  if (m8004) {
    const chainId = Number(m8004[1]);
    const agentId = m8004[2];
    if (!Number.isFinite(chainId) || chainId <= 0) throw new Error('invalid chainId in uaid');
    return { kind: 'did:8004', chainId, agentId };
  }
  const methr = /^did:ethr:(\d+):(0x[0-9a-fA-F]{40})$/.exec(did);
  if (methr) {
    const chainId = Number(methr[1]);
    const address = methr[2].toLowerCase();
    if (!Number.isFinite(chainId) || chainId <= 0) throw new Error('invalid chainId in uaid');
    return { kind: 'did:ethr', chainId, address };
  }
  throw new Error(`uaid must be "uaid:did:8004:<chainId>:<agentId>" or "uaid:did:ethr:<chainId>:<address>"`);
}

async function resolveDid8004AgentIdFromAccountDid(args: { chainId: number; address: string }): Promise<string> {
  const chainId = args.chainId;
  const addr = args.address.toLowerCase();
  const ctx = `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?didIdentity WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AISmartAgent ;
           core:hasAgentAccount ?acct ;
           core:hasIdentity ?identity8004 .
    ?acct eth:accountAddress ?addr .
    FILTER(LCASE(STR(?addr)) = "${addr}")
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  core:hasIdentifier ?ident8004 .
    ?ident8004 core:protocolIdentifier ?didIdentity .
  }
}
LIMIT 5
`;
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = Array.isArray(res?.results?.bindings) ? res.results.bindings : [];
  const did = typeof bindings?.[0]?.didIdentity?.value === 'string' ? bindings[0].didIdentity.value : '';
  const m = /^did:8004:\d+:(\d+)$/.exec(did);
  if (!m) throw new Error(`Could not resolve did:8004 identity from did:ethr:${chainId}:${addr} (SmartAgent not found in KB)`);
  return m[1];
}

/**
 * Create GraphQL resolvers with optional custom indexAgent resolver
 * This unifies the resolver creation for both Express (local) and Workers (production)
 */
export function createDBQueries(
  db: any,
  indexAgentResolver?: (args: { agentId: string; chainId?: number }, env?: any) => Promise<any>,
  options?: GraphQLResolverOptions,
) {
  const sharedResolvers = createGraphQLResolvers(db, options);
  
  if (indexAgentResolver) {
    const indexBy8004AgentResolver = (args: { chainId: number; agentId: string }, env?: any) => {
      return indexAgentResolver({ agentId: args.agentId, chainId: args.chainId }, env);
    };

    const indexBySmartAgentResolver = async (args: { chainId: number; address: string }, env?: any) => {
      // SmartAgent UAID (did:ethr) -> resolve to ERC-8004 did:8004 agentId in KB, then index that.
      const agentId = await resolveDid8004AgentIdFromAccountDid({ chainId: args.chainId, address: args.address });
      return indexAgentResolver({ agentId, chainId: args.chainId }, env);
    };

    return {
      ...sharedResolvers,
      indexAgent: indexAgentResolver,
      indexAgentByUaid: async (args: { uaid: string }, env?: any) => {
        const parsed = parseUaid(args?.uaid);
        if (parsed.kind === 'did:8004') {
          return indexBy8004AgentResolver({ chainId: parsed.chainId, agentId: parsed.agentId }, env);
        }
        if (parsed.kind === 'did:ethr') {
          return await indexBySmartAgentResolver({ chainId: parsed.chainId, address: parsed.address }, env);
        }
        // Future-proofing: if parseUaid is extended with new variants, force explicit handling here.
        throw new Error(`Unsupported UAID kind: ${(parsed as any)?.kind ?? 'unknown'}`);
      },
    };
  }
  
  return sharedResolvers;
}

