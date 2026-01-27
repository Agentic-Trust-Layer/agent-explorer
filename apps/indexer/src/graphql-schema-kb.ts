/**
 * GraphDB-backed (knowledge base) GraphQL schema (v2).
 *
 * This schema is intentionally aligned to the KB model:
 * Agent → Identity → Descriptor → (assembled) ProtocolDescriptor.
 */

import { buildSchema, type GraphQLSchema } from 'graphql';

export const graphQLSchemaStringKb = `
  enum OrderDirection {
    ASC
    DESC
  }

  enum KbAgentOrderBy {
    agentId8004
    agentName
    uaid
  }

  input KbAgentWhereInput {
    chainId: Int
    agentId8004: Int
    did8004: String
    agentName_contains: String
    isSmartAgent: Boolean
    hasA2a: Boolean
  }

  type KbAccount {
    iri: ID!
    chainId: Int
    address: String
    accountType: String # EOAAccount | SmartAccount | Account | (null/unknown)
    didEthr: String
  }

  type KbProtocolDescriptor {
    iri: ID!
    protocol: String! # a2a | mcp
    serviceUrl: String!
    protocolVersion: String
    json: String
    skills: [String!]!
    domains: [String!]!
  }

  type KbIdentityDescriptor {
    iri: ID!
    kind: String! # 8004 | ens | hol | nanda | other
    json: String
    onchainMetadataJson: String
    registeredBy: String
    registryNamespace: String
    skills: [String!]!
    domains: [String!]!
    protocolDescriptors: [KbProtocolDescriptor!]!
  }

  type KbIdentity {
    iri: ID!
    kind: String! # 8004 | ens | hol | nanda | other
    did: String!
    descriptor: KbIdentityDescriptor
  }

  type KbAgent {
    iri: ID!
    uaid: String
    agentName: String
    agentTypes: [String!]!

    did8004: String
    agentId8004: Int

    isSmartAgent: Boolean!

    identity8004: KbIdentity
    identityEns: KbIdentity

    ownerAccount: KbAccount
    walletAccount: KbAccount
    operatorAccount: KbAccount
    smartAccount: KbAccount
  }

  type KbAgentSearchResult {
    agents: [KbAgent!]!
    total: Int!
    hasMore: Boolean!
  }

  type KbSubgraphRecord {
    rawJson: String
    txHash: String
    blockNumber: Int
    timestamp: Int
  }

  type KbFeedback {
    iri: ID!
    agentDid8004: String
    json: String
    record: KbSubgraphRecord
  }

  type KbValidationResponse {
    iri: ID!
    agentDid8004: String
    json: String
    record: KbSubgraphRecord
  }

  type KbAssociation {
    iri: ID!
    record: KbSubgraphRecord
  }

  type KbSemanticAgentMatch {
    agent: KbAgent
    score: Float!
    matchReasons: [String!]
  }

  type KbSemanticAgentSearchResult {
    matches: [KbSemanticAgentMatch!]!
    total: Int!
    intentType: String
  }

  # Reuse input shape from v1 for compatibility with existing clients.
  input SemanticAgentSearchInput {
    text: String
    intentJson: String
    topK: Int
    minScore: Float
    requiredSkills: [String!]
    filters: SemanticSearchFilterInput
  }

  input SemanticSearchFilterInput {
    capabilities: [String!]
    inputMode: String
    outputMode: String
    tags: [String!]
  }

  # ATI / TrustLedger: keep the v1 shapes for now (served from GraphDB in v2 endpoint).
  type TrustReason {
    code: String!
    weight: Float
    detail: String
  }

  type TrustScore {
    interfaceId: String!
    score: Float!
    reputationScore: Float!
    overlapScore: Float!
    clientMembershipCount: Int!
    agentMembershipCount: Int!
    sharedMembershipCount: Int!
    sharedMembershipKeys: [String!]!
    reasons: [TrustReason!]!
  }

  type AgentTrustComponent {
    component: String!
    score: Float!
    weight: Float!
    evidenceCountsJson: String
  }

  type AgentTrustIndex {
    chainId: Int!
    agentId: String!
    overallScore: Int!
    overallConfidence: Float
    version: String!
    computedAt: Int!
    bundleJson: String
    components: [AgentTrustComponent!]!
  }

  type TrustLedgerBadgeDefinition {
    badgeId: String!
    program: String!
    name: String!
    description: String
    iconRef: String
    points: Int!
    ruleId: String!
    ruleJson: String
    active: Boolean!
    createdAt: Int!
    updatedAt: Int!
  }

  type Query {
    kbAgents(
      where: KbAgentWhereInput
      first: Int
      skip: Int
      orderBy: KbAgentOrderBy
      orderDirection: OrderDirection
    ): KbAgentSearchResult!

    kbAgent(chainId: Int!, agentId8004: Int!): KbAgent
    kbAgentByDid(did8004: String!): KbAgent

    kbSemanticAgentSearch(input: SemanticAgentSearchInput!): KbSemanticAgentSearchResult!

    # Minimal trust/event reads from KB (typed nodes + raw JSON where needed)
    kbFeedbacks(chainId: Int!, first: Int, skip: Int): [KbFeedback!]!
    kbValidations(chainId: Int!, first: Int, skip: Int): [KbValidationResponse!]!
    kbAssociations(chainId: Int!, first: Int, skip: Int): [KbAssociation!]!

    # ATI / trust ledger (GraphDB-backed in v2)
    kbAgentTrustIndex(chainId: Int!, agentId: String!): AgentTrustIndex
    kbTrustLedgerBadgeDefinitions(program: String, active: Boolean): [TrustLedgerBadgeDefinition!]!
  }
`;

export function buildGraphQLSchemaKb(): GraphQLSchema {
  return buildSchema(graphQLSchemaStringKb);
}

