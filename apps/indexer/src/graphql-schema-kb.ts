/**
 * GraphDB-backed (knowledge base) GraphQL schema (v2).
 *
 * This schema is intentionally aligned to the KB model:
 * Agent → Identity → Descriptor → (assembled) ProtocolDescriptor.
 */

import { buildSchema, type GraphQLSchema } from 'graphql';

export const graphQLSchemaStringKb = `
  type OasfSkill {
    key: String!
    nameKey: String
    uid: Int
    caption: String
    extendsKey: String
    category: String
  }

  type OasfDomain {
    key: String!
    nameKey: String
    uid: Int
    caption: String
    extendsKey: String
    category: String
  }

  type IntentType {
    key: String!
    label: String
    description: String
  }

  type TaskType {
    key: String!
    label: String
    description: String
  }

  type IntentTaskMapping {
    intent: IntentType!
    task: TaskType!
    requiredSkills: [String!]!
    optionalSkills: [String!]!
  }

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
    uaid: String
    uaid_in: [String!]
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

    # Accounts attached to the ERC-8004 identity (identity-scoped)
    identityOwnerAccount: KbAccount
    identityOperatorAccount: KbAccount
    identityWalletAccount: KbAccount

    # Accounts attached to the agent (agent-scoped)
    agentOwnerAccount: KbAccount
    agentOperatorAccount: KbAccount
    agentWalletAccount: KbAccount
    agentOwnerEOAAccount: KbAccount

    # SmartAgent -> ERC-8004 agent-controlled account (AgentAccount)
    agentAccount: KbAccount
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
    # Discovery taxonomy (GraphDB-backed, same shape as v1 schema)
    oasfSkills(
      key: String
      nameKey: String
      category: String
      extendsKey: String
      limit: Int
      offset: Int
      orderBy: String
      orderDirection: String
    ): [OasfSkill!]!

    oasfDomains(
      key: String
      nameKey: String
      category: String
      extendsKey: String
      limit: Int
      offset: Int
      orderBy: String
      orderDirection: String
    ): [OasfDomain!]!

    intentTypes(
      key: String
      label: String
      limit: Int
      offset: Int
    ): [IntentType!]!

    taskTypes(
      key: String
      label: String
      limit: Int
      offset: Int
    ): [TaskType!]!

    intentTaskMappings(
      intentKey: String
      taskKey: String
      limit: Int
      offset: Int
    ): [IntentTaskMapping!]!

    kbAgents(
      where: KbAgentWhereInput
      first: Int
      skip: Int
      orderBy: KbAgentOrderBy
      orderDirection: OrderDirection
    ): KbAgentSearchResult!

    # Convenience query: agents whose ERC-8004 identity hasOwnerAccount matches ownerAddress
    kbOwnedAgents(
      chainId: Int!
      ownerAddress: String!
      first: Int
      skip: Int
      orderBy: KbAgentOrderBy
      orderDirection: OrderDirection
    ): KbAgentSearchResult!

    # Like kbOwnedAgents, but searches across all subgraph graphs (no chainId required).
    kbOwnedAgentsAllChains(
      ownerAddress: String!
      first: Int
      skip: Int
      orderBy: KbAgentOrderBy
      orderDirection: OrderDirection
    ): KbAgentSearchResult!

    # UAID-native ownership check. Returns true if walletAddress resolves to the same EOA as the agent's owner.
    kbIsOwner(uaid: String!, walletAddress: String!): Boolean!

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

