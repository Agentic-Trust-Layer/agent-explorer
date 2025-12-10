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
    metadata: [TokenMetadata!]!
  }

  enum AgentOrderBy {
    agentId
    agentName
    createdAtTime
    createdAtBlock
    agentOwner
    eoaOwner
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
