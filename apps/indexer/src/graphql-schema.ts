/**
 * Shared GraphQL schema for both local (Express) and Cloudflare Workers implementations
 */

import { buildSchema, GraphQLSchema } from 'graphql';

export const graphQLSchemaString = `
  type Agent {
    chainId: Int!

    agentId: String!
    agentAccount: String!
    agentName: String!

    didIdentity: String!
    didAccount: String!
    didName: String

    agentOwner: String!
    eoaOwner: String
    agentCategory: String
    tokenUri: String
    createdAtBlock: Int!
    createdAtTime: Int!
    type: String
    description: String
    image: String
    a2aEndpoint: String
    ensEndpoint: String
    agentAccountEndpoint: String
    supportedTrust: String
    rawJson: String
    updatedAtTime: Int
    did: String
    mcp: Boolean
    x402support: Boolean
    active: Boolean
    feedbackCount: Int
    feedbackAverageScore: Float
    validationPendingCount: Int
    validationCompletedCount: Int
    validationRequestedCount: Int
    initiatedAssociationCount: Int
    approvedAssociationCount: Int
    atiOverallScore: Int
    atiOverallConfidence: Float
    atiVersion: String
    atiComputedAt: Int
    atiBundleJson: String
    trustLedgerScore: Int
    trustLedgerBadgeCount: Int
    trustLedgerOverallRank: Int
    trustLedgerCapabilityRank: Int
    metadata: [TokenMetadata!]!
  }

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

  input TrustLedgerBadgeDefinitionInput {
    badgeId: String!
    program: String!
    name: String!
    description: String
    iconRef: String
    points: Int!
    ruleId: String!
    ruleJson: String
    active: Boolean!
  }

  type AssociationAccount {
    id: String!
  }

  type Association {
    chainId: Int!
    associationId: String!

    initiatorAccount: AssociationAccount!
    approverAccount: AssociationAccount!

    initiator: String!
    approver: String!
    validAt: Int!
    validUntil: Int!
    interfaceId: String!
    data: String!

    initiatorKeyType: String!
    approverKeyType: String!
    initiatorSignature: String!
    approverSignature: String!

    revokedAt: Int

    createdTxHash: String!
    createdBlockNumber: Int!
    createdTimestamp: Int!
    lastUpdatedTxHash: String!
    lastUpdatedBlockNumber: Int!
    lastUpdatedTimestamp: Int!

    initiatorAgent: Agent
    approverAgent: Agent
  }

  enum AssociationRole {
    INITIATOR
    APPROVER
    ANY
  }

  input AssociationWhereInput {
    chainId: Int
    chainId_in: [Int!]
    associationId: String
    associationId_in: [String!]
    interfaceId: String
    interfaceId_in: [String!]
    initiatorAccountId: String
    approverAccountId: String
    initiatorAccountId_in: [String!]
    approverAccountId_in: [String!]
    revoked: Boolean
  }

  enum AgentOrderBy {
    agentId
    agentName
    createdAtTime
    createdAtBlock
    agentOwner
    eoaOwner
    agentCategory
    trustLedgerScore
    trustLedgerBadgeCount
    trustLedgerOverallRank
    trustLedgerCapabilityRank
  }

  enum OrderDirection {
    ASC
    DESC
  }

  input AgentWhereInput {
    chainId: Int
    chainId_in: [Int!]

    agentId: String
    agentId_in: [String!]

    agentOwner: String
    agentOwner_in: [String!]

    eoaOwner: String
    eoaOwner_in: [String!]

    agentCategory: String
    agentCategory_in: [String!]
    agentCategory_contains: String
    agentCategory_contains_nocase: String

    agentName_contains: String
    agentName_contains_nocase: String
    agentName_starts_with: String
    agentName_starts_with_nocase: String
    agentName_ends_with: String
    agentName_ends_with_nocase: String

    description_contains: String
    description_contains_nocase: String

    ensEndpoint_contains: String
    ensEndpoint_contains_nocase: String
    agentAccountEndpoint_contains: String
    agentAccountEndpoint_contains_nocase: String

    did: String
    did_contains: String
    did_contains_nocase: String

    createdAtTime_gt: Int
    createdAtTime_gte: Int
    createdAtTime_lt: Int
    createdAtTime_lte: Int

    hasA2aEndpoint: Boolean
    hasEnsEndpoint: Boolean

    mcp: Boolean
    x402support: Boolean
    active: Boolean
    is8004Agent: Boolean

    operator_in: [String!]
    supportedTrust_in: [String!]
    a2aSkills_in: [String!]
    mcpTools_in: [String!]
    mcpPrompts_in: [String!]
    mcpResources_in: [String!]

    feedbackCount_gt: Int
    feedbackCount_gte: Int
    feedbackCount_lt: Int
    feedbackCount_lte: Int

    validationPendingCount_gt: Int
    validationPendingCount_gte: Int
    validationPendingCount_lt: Int
    validationPendingCount_lte: Int

    validationCompletedCount_gt: Int
    validationCompletedCount_gte: Int
    validationCompletedCount_lt: Int
    validationCompletedCount_lte: Int

    validationRequestedCount_gt: Int
    validationRequestedCount_gte: Int
    validationRequestedCount_lt: Int
    validationRequestedCount_lte: Int

    feedbackAverageScore_gt: Float
    feedbackAverageScore_gte: Float
    feedbackAverageScore_lt: Float
    feedbackAverageScore_lte: Float

    atiOverallScore_gt: Int
    atiOverallScore_gte: Int
    atiOverallScore_lt: Int
    atiOverallScore_lte: Int

    trustLedgerScore_gt: Int
    trustLedgerScore_gte: Int
    trustLedgerScore_lt: Int
    trustLedgerScore_lte: Int

    trustLedgerBadgeCount_gt: Int
    trustLedgerBadgeCount_gte: Int
    trustLedgerBadgeCount_lt: Int
    trustLedgerBadgeCount_lte: Int

    trustLedgerOverallRank_gt: Int
    trustLedgerOverallRank_gte: Int
    trustLedgerOverallRank_lt: Int
    trustLedgerOverallRank_lte: Int

    trustLedgerCapabilityRank_gt: Int
    trustLedgerCapabilityRank_gte: Int
    trustLedgerCapabilityRank_lt: Int
    trustLedgerCapabilityRank_lte: Int
  }

  type AgentSearchResult {
    agents: [Agent!]!
    total: Int!
    hasMore: Boolean!
  }

  type TokenMetadata {
    chainId: Int!
    agentId: String!
    id: String!
    key: String!
    value: String
    valueText: String
    indexedKey: String
    updatedAtTime: Int
  }

  type TokenMetadataSearchResult {
    entries: [TokenMetadata!]!
    total: Int!
    hasMore: Boolean!
  }

  type SemanticAgentMatch {
    agent: Agent
    score: Float!
    matchReasons: [String!]
  }

  type SemanticAgentSearchResult {
    matches: [SemanticAgentMatch!]!
    total: Int!
  }

  input SemanticAgentSearchInput {
    text: String!
    topK: Int
    minScore: Float
    filters: SemanticSearchFilterInput
  }

  input SemanticSearchFilterInput {
    capabilities: [String!]
    inputMode: String
    outputMode: String
    tags: [String!]
  }

  enum TokenMetadataOrderBy {
    agentId
    key
    updatedAtTime
  }

  input TokenMetadataWhereInput {
    chainId: Int
    agentId: String
    agentId_in: [String!]
    key: String
    key_in: [String!]
    key_contains: String
    key_contains_nocase: String
    valueText_contains: String
    valueText_contains_nocase: String
    value_contains: String
  }

  type AccessCode {
    address: String!
    accessCode: String!
    createdAt: Int!
  }

  type RepFeedback {
    id: ID!
    chainId: Int!
    agentId: String!
    clientAddress: String!
    feedbackIndex: Int!
    score: Int
    tag1: String
    tag2: String
    feedbackUri: String
    feedbackJson: String
    agentRegistry: String
    feedbackCreatedAt: String
    feedbackAuth: String
    skill: String
    capability: String
    contextJson: String
    feedbackType: String
    domain: String
    comment: String
    ratingPct: Int
    feedbackTimestamp: String
    feedbackHash: String
    txHash: String
    blockNumber: Int
    timestamp: Int
    isRevoked: Boolean
    revokedTxHash: String
    revokedBlockNumber: Int
    revokedTimestamp: Int
    responseCount: Int
  }

  type RepFeedbackRevocation {
    id: ID!
    chainId: Int!
    agentId: String!
    clientAddress: String!
    feedbackIndex: Int!
    txHash: String
    blockNumber: Int
    timestamp: Int
  }

  type RepFeedbackResponse {
    id: ID!
    chainId: Int!
    agentId: String!
    clientAddress: String!
    feedbackIndex: Int!
    responder: String
    responseUri: String
    responseJson: String
    responseHash: String
    txHash: String
    blockNumber: Int
    timestamp: Int
  }

  type ValidationRequest {
    id: ID!
    chainId: Int!
    agentId: String!
    validatorAddress: String!
    requestUri: String
    requestJson: String
    requestHash: String
    txHash: String
    blockNumber: Int
    timestamp: Int
    createdAt: Int
    updatedAt: Int
  }

  type ValidationResponse {
    id: ID!
    chainId: Int!
    agentId: String!
    validatorAddress: String!
    requestHash: String
    response: Int
    responseUri: String
    responseJson: String
    responseHash: String
    tag: String
    txHash: String
    blockNumber: Int
    timestamp: Int
    createdAt: Int
    updatedAt: Int
  }

  enum FeedbackOrderBy {
    blockNumber
    timestamp
    score
    ratingPct
    feedbackIndex
    responseCount
  }

  input FeedbackWhereInput {
    chainId: Int
    chainId_in: [Int!]

    agentId: String
    agentId_in: [String!]

    clientAddress: String
    clientAddress_in: [String!]

    feedbackIndex: Int
    feedbackIndex_in: [Int!]

    score_gt: Int
    score_gte: Int
    score_lt: Int
    score_lte: Int

    ratingPct_gt: Int
    ratingPct_gte: Int
    ratingPct_lt: Int
    ratingPct_lte: Int

    isRevoked: Boolean

    domain_contains: String
    domain_contains_nocase: String

    comment_contains: String
    comment_contains_nocase: String

    feedbackUri_contains: String
    feedbackUri_contains_nocase: String

    feedbackType_in: [String!]
    feedbackType_contains: String
    feedbackType_contains_nocase: String

    feedbackHash: String
    feedbackHash_in: [String!]

    tag1: String
    tag2: String

    txHash: String
    txHash_in: [String!]

    responseCount_gt: Int
    responseCount_gte: Int
    responseCount_lt: Int
    responseCount_lte: Int

    timestamp_gt: Int
    timestamp_gte: Int
    timestamp_lt: Int
    timestamp_lte: Int
  }

  type FeedbackSearchResult {
    feedbacks: [RepFeedback!]!
    total: Int!
    hasMore: Boolean!
  }

  type Query {
    agents(
      chainId: Int
      agentId: String
      agentOwner: String
      agentName: String
      limit: Int
      offset: Int
      orderBy: String
      orderDirection: String
    ): [Agent!]!

    agent(chainId: Int!, agentId: String!): Agent

    agentByName(agentName: String!): Agent

    agentsByChain(chainId: Int!, limit: Int, offset: Int, orderBy: String, orderDirection: String): [Agent!]!

    agentsByOwner(agentOwner: String!, chainId: Int, limit: Int, offset: Int, orderBy: String, orderDirection: String): [Agent!]!

    searchAgents(query: String!, chainId: Int, limit: Int, offset: Int, orderBy: String, orderDirection: String): [Agent!]!

    searchAgentsGraph(
      where: AgentWhereInput
      first: Int
      skip: Int
      orderBy: AgentOrderBy
      orderDirection: OrderDirection
    ): AgentSearchResult!

    getAccessCode(address: String!): AccessCode

    countAgents(
      chainId: Int
      agentId: String
      agentOwner: String
      agentName: String
    ): Int!

    semanticAgentSearch(
      input: SemanticAgentSearchInput!
    ): SemanticAgentSearchResult!

    tokenMetadata(
      where: TokenMetadataWhereInput
      first: Int
      skip: Int
      orderBy: TokenMetadataOrderBy
      orderDirection: OrderDirection
    ): TokenMetadataSearchResult!

    tokenMetadataById(
      chainId: Int!
      id: String!
    ): TokenMetadata

    associations(
      where: AssociationWhereInput
      first: Int
      skip: Int
      orderBy: String
      orderDirection: String
    ): [Association!]!

    agentAssociations(
      chainId: Int!
      agentId: String!
      role: AssociationRole
      interfaceId: String
      first: Int
      skip: Int
    ): [Association!]!

    graphqlEndpointAssociations(
      chainId: Int!
      agentId: String!
      role: AssociationRole
      first: Int
      skip: Int
    ): [Association!]!

    graphqlEndpointAssociationsBetween(
      chainId: Int!
      agentIdA: String!
      agentIdB: String!
      first: Int
      skip: Int
    ): [Association!]!

    trustScore(
      chainId: Int!
      agentId: String!
      client: String!
      interfaceId: String
    ): TrustScore!

    agentTrustIndex(chainId: Int!, agentId: String!): AgentTrustIndex
    agentTrustComponents(chainId: Int!, agentId: String!): [AgentTrustComponent!]!

    trustLedgerBadgeDefinitions(
      program: String
      active: Boolean
    ): [TrustLedgerBadgeDefinition!]!

    feedbacks(
      chainId: Int
      agentId: String
      clientAddress: String
      feedbackIndex: Int
      limit: Int
      offset: Int
      orderBy: String
      orderDirection: String
    ): [RepFeedback!]!

    feedback(id: ID!): RepFeedback

    feedbackByReference(
      chainId: Int!
      agentId: String!
      clientAddress: String!
      feedbackIndex: Int!
    ): RepFeedback

    searchFeedbacks(
      query: String!
      chainId: Int
      agentId: String
      limit: Int
      offset: Int
      orderBy: String
      orderDirection: String
    ): [RepFeedback!]!

    searchFeedbacksGraph(
      where: FeedbackWhereInput
      first: Int
      skip: Int
      orderBy: FeedbackOrderBy
      orderDirection: OrderDirection
    ): FeedbackSearchResult!

    countFeedbacks(
      chainId: Int
      agentId: String
      clientAddress: String
      feedbackIndex: Int
      isRevoked: Boolean
    ): Int!

    feedbackResponses(
      chainId: Int
      agentId: String
      clientAddress: String
      feedbackIndex: Int
      limit: Int
      offset: Int
      orderBy: String
      orderDirection: String
    ): [RepFeedbackResponse!]!

    feedbackRevocations(
      chainId: Int
      agentId: String
      clientAddress: String
      feedbackIndex: Int
      limit: Int
      offset: Int
      orderBy: String
      orderDirection: String
    ): [RepFeedbackRevocation!]!

    validationRequests(
      chainId: Int
      agentId: String
      validatorAddress: String
      requestHash: String
      limit: Int
      offset: Int
      orderBy: String
      orderDirection: String
    ): [ValidationRequest!]!

    validationRequest(id: ID!): ValidationRequest

    validationResponses(
      chainId: Int
      agentId: String
      validatorAddress: String
      requestHash: String
      tag: String
      response: Int
      limit: Int
      offset: Int
      orderBy: String
      orderDirection: String
    ): [ValidationResponse!]!

    validationResponse(id: ID!): ValidationResponse

    countValidationRequests(
      chainId: Int
      agentId: String
      validatorAddress: String
      requestHash: String
    ): Int!

    countValidationResponses(
      chainId: Int
      agentId: String
      validatorAddress: String
      requestHash: String
      tag: String
    ): Int!
  }

  type Mutation {
    createAccessCode(address: String!): AccessCode!
    indexAgent(agentId: String!, chainId: Int): IndexAgentResult!

    upsertTrustLedgerBadgeDefinition(
      input: TrustLedgerBadgeDefinitionInput!
    ): TrustLedgerBadgeDefinition!

    setTrustLedgerBadgeActive(
      badgeId: String!
      active: Boolean!
    ): TrustLedgerBadgeDefinition!
  }

  type IndexAgentResult {
    success: Boolean!
    message: String!
    processedChains: [String!]!
  }
`;

/**
 * Build GraphQL schema from shared schema string
 */
export function buildGraphQLSchema(): GraphQLSchema {
  return buildSchema(graphQLSchemaString);
}
