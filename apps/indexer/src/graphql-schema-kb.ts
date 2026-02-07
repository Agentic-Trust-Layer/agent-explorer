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
    createdAtTime
    updatedAtTime
    trustLedgerTotalPoints
    atiOverallScore
    bestRank
  }

  input KbAgentWhereInput {
    chainId: Int
    agentIdentifierMatch: String
    did8004: String
    uaid: String
    uaid_in: [String!]
    agentName_contains: String
    isSmartAgent: Boolean
    hasA2a: Boolean
    hasAssertions: Boolean
    hasReviews: Boolean
    hasValidations: Boolean
    minReviewAssertionCount: Int
    minValidationAssertionCount: Int
  }

  type KbAccount {
    iri: ID!
    chainId: Int
    address: String
    accountType: String # EOAAccount | SmartAccount | Account | (null/unknown)
    didEthr: String
  }

  # Generic descriptor for core entities (protocols, endpoints, etc.)
  type KbDescriptor {
    iri: ID!
    name: String
    description: String
    image: String
  }

  # Protocol descriptor payload (e.g. A2A agent-card.json)
  type KbProtocolDescriptor {
    iri: ID!
    name: String
    description: String
    image: String
    agentCardJson: String
  }

  type KbProtocol {
    iri: ID!
    protocol: String! # a2a | mcp | other
    protocolVersion: String
    serviceUrl: String
    descriptor: KbProtocolDescriptor
    skills: [String!]!
    domains: [String!]!
  }

  type KbServiceEndpoint {
    iri: ID!
    name: String! # a2a | mcp | other
    descriptor: KbDescriptor
    protocol: KbProtocol!
  }

  type KbIdentityDescriptor {
    iri: ID!
    kind: String! # 8004 | ens | hol | nanda | other
    name: String
    description: String
    image: String
    registrationJson: String
    nftMetadataJson: String
    registeredBy: String
    registryNamespace: String
    skills: [String!]!
    domains: [String!]!
  }

  type KbIdentity {
    iri: ID!
    kind: String! # 8004 | ens | hol | nanda | other
    did: String!
    uaidHOL: String
    descriptor: KbIdentityDescriptor
    serviceEndpoints: [KbServiceEndpoint!]!
  }

  # ERC-8004 identity with attached account info
  type KbIdentity8004 {
    iri: ID!
    kind: String! # always "8004"
    did: String!
    # Convenience fields (previously on KbAgent)
    did8004: String!
    agentId8004: Int
    isSmartAgent: Boolean!
    descriptor: KbIdentityDescriptor
    serviceEndpoints: [KbServiceEndpoint!]!

    # Accounts attached to the ERC-8004 identity
    ownerAccount: KbAccount
    operatorAccount: KbAccount
    walletAccount: KbAccount
    ownerEOAAccount: KbAccount

    # SmartAgent -> ERC-8004 agent-controlled account (AgentAccount)
    agentAccount: KbAccount
  }

  # ERC-8122 identity with attached registry/account info
  type KbIdentity8122 {
    iri: ID!
    kind: String! # always "8122"
    did: String!
    did8122: String!
    agentId8122: String!
    registryAddress: String
    endpointType: String
    endpoint: String
    descriptor: KbIdentityDescriptor
    serviceEndpoints: [KbServiceEndpoint!]!

    ownerAccount: KbAccount
    agentAccount: KbAccount
  }

  type KbHolAgentProfile {
    uaid: String!
    displayName: String
    alias: String
    bio: String
    profileImage: String
    profileJson: String
  }

  type KbHolCapability {
    iri: ID!
    key: String!
    label: String
    json: String
  }

  type KbHolSyncResult {
    success: Boolean!
    count: Int!
    message: String
  }

  type KbHolRegistryCount {
    registry: String!
    agentCount: Int!
  }

  type KbHolCapabilityCount {
    capability: String!
    agentCount: Int!
  }

  type KbHolStats {
    totalAgents: Int!
    lastUpdate: String
    status: String
    registries: [KbHolRegistryCount!]!
    capabilities: [KbHolCapabilityCount!]!
  }

  type KbHolRegistrySearchHit {
    uaid: String
    id: String
    registry: String
    name: String
    description: String
    originalId: String
    protocols: [String!]
    json: String
  }

  type KbHolRegistrySearchResult {
    total: Int!
    page: Int
    limit: Int
    hits: [KbHolRegistrySearchHit!]!
  }

  input KbHolVectorSearchFilterInput {
    registry: String
    capabilities: [String!]
  }

  input KbHolVectorSearchInput {
    query: String!
    limit: Int
    filter: KbHolVectorSearchFilterInput
  }

  input KbHolResolveIncludeInput {
    capabilities: Boolean
    endpoints: Boolean
    relationships: Boolean
    validations: Boolean
  }

  type KbAgentDescriptor {
    iri: ID!
    name: String
    description: String
    image: String
  }

  type KbAgent {
    iri: ID!
    uaid: String
    agentName: String
    agentDescription: String
    agentImage: String
    agentDescriptor: KbAgentDescriptor
    agentTypes: [String!]!

    # Provenance (best-effort; may be null for older/missing records)
    createdAtBlock: Int
    createdAtTime: Int
    updatedAtTime: Int

    # KB analytics (GraphDB-resident) scoring signals
    trustLedgerTotalPoints: Int
    trustLedgerBadgeCount: Int
    trustLedgerComputedAt: Int
    atiOverallScore: Int
    atiOverallConfidence: Float
    atiVersion: String
    atiComputedAt: Int

    # Convenience: primary identity (prefer identity8004, else identity8122, else identityHol, else identityEns)
    identity: KbIdentity
    identity8004: KbIdentity8004
    identity8122: KbIdentity8122
    identityHol: KbIdentity
    identityEns: KbIdentity

    serviceEndpoints: [KbServiceEndpoint!]!

    # Counts are always available; items are only fetched when you request a specific agent.
    assertions: KbAgentAssertions
    reviewAssertions(first: Int, skip: Int): KbReviewResponseConnection
    validationAssertions(first: Int, skip: Int): KbValidationResponseConnection

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

  type KbReviewResponse {
    iri: ID!
    agentDid8004: String
    json: String
    record: KbSubgraphRecord
  }

  type KbReviewResponseConnection {
    total: Int!
    items: [KbReviewResponse!]!
  }

  type KbValidationResponse {
    iri: ID!
    agentDid8004: String
    json: String
    record: KbSubgraphRecord
  }

  type KbValidationResponseConnection {
    total: Int!
    items: [KbValidationResponse!]!
  }

  type KbAgentAssertions {
    total: Int!
    reviewResponses: KbReviewResponseConnection!
    validationResponses: KbValidationResponseConnection!
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

    kbAgentByUaid(uaid: String!): KbAgent
    kbHolAgentProfileByUaid(uaid: String!, include: KbHolResolveIncludeInput): KbHolAgentProfile
    kbHolCapabilities(first: Int, skip: Int): [KbHolCapability!]!
    kbHolRegistries: [String!]!
    kbHolRegistriesForProtocol(protocol: String!): [String!]!
    kbHolStats: KbHolStats!
    kbHolRegistrySearch(registry: String!, q: String, originalId: String): KbHolRegistrySearchResult!
    kbHolVectorSearch(input: KbHolVectorSearchInput!): KbHolRegistrySearchResult!

    kbSemanticAgentSearch(input: SemanticAgentSearchInput!): KbSemanticAgentSearchResult!

    # Minimal trust/event reads from KB (typed nodes + raw JSON where needed)
    kbReviews(chainId: Int!, first: Int, skip: Int): [KbReviewResponse!]!
    kbValidations(chainId: Int!, first: Int, skip: Int): [KbValidationResponse!]!
    kbAssociations(chainId: Int!, first: Int, skip: Int): [KbAssociation!]!

    # ATI / trust ledger (GraphDB-backed in v2)
    kbAgentTrustIndex(chainId: Int!, agentId: String!): AgentTrustIndex
    kbTrustLedgerBadgeDefinitions(program: String, active: Boolean): [TrustLedgerBadgeDefinition!]!
  }

  type Mutation {
    kbHolSyncCapabilities: KbHolSyncResult!
  }
`;

export function buildGraphQLSchemaKb(): GraphQLSchema {
  return buildSchema(graphQLSchemaStringKb);
}

