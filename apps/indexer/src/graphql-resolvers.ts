import type { SemanticSearchService } from './semantic/semantic-search-service.js';
import type { VectorQueryMatch } from './semantic/interfaces.js';

/**
 * Shared GraphQL resolvers that work with both D1 adapter and native D1
 * This module abstracts the database interface differences
 */

/**
 * Helper to normalize database results
 * - D1 adapter: returns array directly
 * - Native D1: returns object with .results property
 */
function normalizeResults(result: any): any[] {
  if (Array.isArray(result)) {
    return result;
  }
  if (result?.results && Array.isArray(result.results)) {
    return result.results;
  }
  return [];
}

/**
 * Helper to normalize a single result
 */
function normalizeResult(result: any): any | null {
  if (result && !Array.isArray(result)) {
    return result;
  }
  if (Array.isArray(result) && result.length > 0) {
    return result[0];
  }
  return null;
}

/**
 * Unified database query executor that works with both D1 adapter and native D1
 * - D1 adapter: db.prepare(sql).all(...params) or db.prepare(sql).get(...params)
 * - Native D1: db.prepare(sql).bind(...params).all() or db.prepare(sql).bind(...params).first()
 */
async function executeQuery(db: any, sql: string, params: any[]): Promise<any[]> {
  const stmt = db.prepare(sql);
  
  // Check if it's native D1 (has .bind method)
  if (stmt.bind && typeof stmt.bind === 'function') {
    // Native D1: use .bind().all()
    const result = await stmt.bind(...params).all();
    return normalizeResults(result);
  } else {
    // D1 adapter: use .all(...params)
    const result = await stmt.all(...params);
    return normalizeResults(result);
  }
}

/**
 * Unified database query executor for single row
 */
async function executeQuerySingle(db: any, sql: string, params: any[]): Promise<any | null> {
  const stmt = db.prepare(sql);
  
  // Check if it's native D1 (has .bind method)
  if (stmt.bind && typeof stmt.bind === 'function') {
    // Native D1: use .bind().first()
    const result = await stmt.bind(...params).first();
    return normalizeResult(result);
  } else {
    // D1 adapter: use .get(...params)
    const result = await stmt.get(...params);
    return normalizeResult(result);
  }
}

/**
 * Unified database execute (for INSERT, UPDATE, DELETE)
 */
async function executeUpdate(db: any, sql: string, params: any[]): Promise<void> {
  const stmt = db.prepare(sql);
  
  // Check if it's native D1 (has .bind method)
  if (stmt.bind && typeof stmt.bind === 'function') {
    // Native D1: use .bind().run()
    await stmt.bind(...params).run();
  } else {
    // D1 adapter: use .run(...params)
    await stmt.run(...params);
  }
}

/**
 * Helper function to build WHERE clause dynamically
 */
function buildWhereClause(filters: {
  chainId?: number;
  agentId?: string;
  agentOwner?: string;
  eoaOwner?: string;
  agentName?: string;
}): { where: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.chainId !== undefined) {
    conditions.push(`chainId = ?`);
    params.push(filters.chainId);
  }

  if (filters.agentId) {
    conditions.push(`agentId = ?`);
    params.push(filters.agentId);
  }

  if (filters.agentOwner) {
    conditions.push(`agentOwner = ?`);
    params.push(filters.agentOwner);
  }

  if (filters.eoaOwner) {
    conditions.push(`eoaOwner = ?`);
    params.push(filters.eoaOwner);
  }

  if (filters.agentName) {
    conditions.push(`agentName LIKE ?`);
    params.push(`%${filters.agentName}%`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

/**
 * Helper function to build ORDER BY clause
 */
function buildOrderByClause(orderBy?: string, orderDirection?: string): string {
  // Valid columns for ordering
  const validColumns = ['agentId', 'agentName', 'createdAtTime', 'createdAtBlock', 'agentOwner', 'eoaOwner'];
  
  // Default to agentId ASC if not specified
  const column = orderBy && validColumns.includes(orderBy) ? orderBy : 'agentId';
  const direction = (orderDirection?.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
  
  // Cast agentId to integer for proper numeric sorting
  const orderColumn = column === 'agentId' ? 'CAST(agentId AS INTEGER)' : column;
  
  return `ORDER BY ${orderColumn} ${direction}`;
}

/**
 * Build WHERE clause using The Graph-style where input
 */
function buildGraphWhereClause(where?: {
  chainId?: number;
  chainId_in?: number[];
  agentId?: string;
  agentId_in?: string[];
  agentOwner?: string;
  agentOwner_in?: string[];
  eoaOwner?: string;
  eoaOwner_in?: string[];
  agentName_contains?: string;
  agentName_contains_nocase?: string;
  agentName_starts_with?: string;
  agentName_starts_with_nocase?: string;
  agentName_ends_with?: string;
  agentName_ends_with_nocase?: string;
  description_contains?: string;
  description_contains_nocase?: string;
  ensEndpoint_contains?: string;
  ensEndpoint_contains_nocase?: string;
  agentAccountEndpoint_contains?: string;
  agentAccountEndpoint_contains_nocase?: string;
  did?: string;
  did_contains?: string;
  did_contains_nocase?: string;
  createdAtTime_gt?: number;
  createdAtTime_gte?: number;
  createdAtTime_lt?: number;
  createdAtTime_lte?: number;
  hasA2aEndpoint?: boolean;
  hasEnsEndpoint?: boolean;
  mcp?: boolean;
  x402support?: boolean;
  active?: boolean;
  is8004Agent?: boolean;
  operator_in?: string[];
  supportedTrust_in?: string[];
  a2aSkills_in?: string[];
  mcpTools_in?: string[];
  mcpPrompts_in?: string[];
  mcpResources_in?: string[];
  feedbackCount_gt?: number;
  feedbackCount_gte?: number;
  feedbackCount_lt?: number;
  feedbackCount_lte?: number;
  validationPendingCount_gt?: number;
  validationPendingCount_gte?: number;
  validationPendingCount_lt?: number;
  validationPendingCount_lte?: number;
  validationCompletedCount_gt?: number;
  validationCompletedCount_gte?: number;
  validationCompletedCount_lt?: number;
  validationCompletedCount_lte?: number;
  validationRequestedCount_gt?: number;
  validationRequestedCount_gte?: number;
  validationRequestedCount_lt?: number;
  validationRequestedCount_lte?: number;
  feedbackAverageScore_gt?: number;
  feedbackAverageScore_gte?: number;
  feedbackAverageScore_lt?: number;
  feedbackAverageScore_lte?: number;
}): { where: string; params: any[] } {
  if (!where) return { where: '', params: [] };
  const conditions: string[] = [];
  const params: any[] = [];

  const addAggregateComparison = (expr: string, operator: string, value: any) => {
    if (value !== undefined && value !== null) {
      conditions.push(`${expr} ${operator} ?`);
      params.push(value);
    }
  };

  // Equality / IN filters
  if (where.chainId !== undefined) {
    conditions.push(`chainId = ?`);
    params.push(where.chainId);
  }
  if (Array.isArray(where.chainId_in) && where.chainId_in.length > 0) {
    conditions.push(`chainId IN (${where.chainId_in.map(() => '?').join(',')})`);
    params.push(...where.chainId_in);
  }
  if (where.agentId) {
    conditions.push(`agentId = ?`);
    params.push(where.agentId);
  }
  if (Array.isArray(where.agentId_in) && where.agentId_in.length > 0) {
    conditions.push(`agentId IN (${where.agentId_in.map(() => '?').join(',')})`);
    params.push(...where.agentId_in);
  }
  if (where.agentOwner) {
    conditions.push(`agentOwner = ?`);
    params.push(where.agentOwner);
  }
  if (Array.isArray(where.agentOwner_in) && where.agentOwner_in.length > 0) {
    conditions.push(`agentOwner IN (${where.agentOwner_in.map(() => '?').join(',')})`);
    params.push(...where.agentOwner_in);
  }
  if (where.eoaOwner) {
    conditions.push(`eoaOwner = ?`);
    params.push(where.eoaOwner);
  }
  if (Array.isArray(where.eoaOwner_in) && where.eoaOwner_in.length > 0) {
    conditions.push(`eoaOwner IN (${where.eoaOwner_in.map(() => '?').join(',')})`);
    params.push(...where.eoaOwner_in);
  }

  // Text filters - agentName
  if (where.agentName_contains) {
    conditions.push(`agentName LIKE ?`);
    params.push(`%${where.agentName_contains}%`);
  }
  if (where.agentName_contains_nocase) {
    conditions.push(`LOWER(agentName) LIKE LOWER(?)`);
    params.push(`%${where.agentName_contains_nocase}%`);
  }
  if (where.agentName_starts_with) {
    conditions.push(`agentName LIKE ?`);
    params.push(`${where.agentName_starts_with}%`);
  }
  if (where.agentName_starts_with_nocase) {
    conditions.push(`LOWER(agentName) LIKE LOWER(?)`);
    params.push(`${where.agentName_starts_with_nocase}%`);
  }
  if (where.agentName_ends_with) {
    conditions.push(`agentName LIKE ?`);
    params.push(`%${where.agentName_ends_with}`);
  }
  if (where.agentName_ends_with_nocase) {
    conditions.push(`LOWER(agentName) LIKE LOWER(?)`);
    params.push(`%${where.agentName_ends_with_nocase}`);
  }

  // Text filters - description
  if (where.description_contains) {
    conditions.push(`description LIKE ?`);
    params.push(`%${where.description_contains}%`);
  }
  if (where.description_contains_nocase) {
    conditions.push(`LOWER(description) LIKE LOWER(?)`);
    params.push(`%${where.description_contains_nocase}%`);
  }

  // Endpoints and DID
  if (where.ensEndpoint_contains) {
    conditions.push(`ensEndpoint LIKE ?`);
    params.push(`%${where.ensEndpoint_contains}%`);
  }
  if (where.ensEndpoint_contains_nocase) {
    conditions.push(`LOWER(ensEndpoint) LIKE LOWER(?)`);
    params.push(`%${where.ensEndpoint_contains_nocase}%`);
  }
  if (where.agentAccountEndpoint_contains) {
    conditions.push(`agentAccountEndpoint LIKE ?`);
    params.push(`%${where.agentAccountEndpoint_contains}%`);
  }
  if (where.agentAccountEndpoint_contains_nocase) {
    conditions.push(`LOWER(agentAccountEndpoint) LIKE LOWER(?)`);
    params.push(`%${where.agentAccountEndpoint_contains_nocase}%`);
  }
  if (where.did) {
    conditions.push(`did = ?`);
    params.push(where.did);
  }
  if (where.did_contains) {
    conditions.push(`did LIKE ?`);
    params.push(`%${where.did_contains}%`);
  }
  if (where.did_contains_nocase) {
    conditions.push(`LOWER(did) LIKE LOWER(?)`);
    params.push(`%${where.did_contains_nocase}%`);
  }

  // Numeric ranges
  if (where.createdAtTime_gt !== undefined) {
    conditions.push(`createdAtTime > ?`);
    params.push(where.createdAtTime_gt);
  }
  if (where.createdAtTime_gte !== undefined) {
    conditions.push(`createdAtTime >= ?`);
    params.push(where.createdAtTime_gte);
  }
  if (where.createdAtTime_lt !== undefined) {
    conditions.push(`createdAtTime < ?`);
    params.push(where.createdAtTime_lt);
  }
  if (where.createdAtTime_lte !== undefined) {
    conditions.push(`createdAtTime <= ?`);
    params.push(where.createdAtTime_lte);
  }

  addAggregateComparison(FEEDBACK_COUNT_EXPR, '>', where.feedbackCount_gt);
  addAggregateComparison(FEEDBACK_COUNT_EXPR, '>=', where.feedbackCount_gte);
  addAggregateComparison(FEEDBACK_COUNT_EXPR, '<', where.feedbackCount_lt);
  addAggregateComparison(FEEDBACK_COUNT_EXPR, '<=', where.feedbackCount_lte);

  addAggregateComparison(VALIDATION_PENDING_EXPR, '>', where.validationPendingCount_gt);
  addAggregateComparison(VALIDATION_PENDING_EXPR, '>=', where.validationPendingCount_gte);
  addAggregateComparison(VALIDATION_PENDING_EXPR, '<', where.validationPendingCount_lt);
  addAggregateComparison(VALIDATION_PENDING_EXPR, '<=', where.validationPendingCount_lte);

  addAggregateComparison(VALIDATION_COMPLETED_EXPR, '>', where.validationCompletedCount_gt);
  addAggregateComparison(VALIDATION_COMPLETED_EXPR, '>=', where.validationCompletedCount_gte);
  addAggregateComparison(VALIDATION_COMPLETED_EXPR, '<', where.validationCompletedCount_lt);
  addAggregateComparison(VALIDATION_COMPLETED_EXPR, '<=', where.validationCompletedCount_lte);

  addAggregateComparison(VALIDATION_REQUESTED_EXPR, '>', where.validationRequestedCount_gt);
  addAggregateComparison(VALIDATION_REQUESTED_EXPR, '>=', where.validationRequestedCount_gte);
  addAggregateComparison(VALIDATION_REQUESTED_EXPR, '<', where.validationRequestedCount_lt);
  addAggregateComparison(VALIDATION_REQUESTED_EXPR, '<=', where.validationRequestedCount_lte);

  addAggregateComparison(FEEDBACK_AVG_SCORE_EXPR, '>', where.feedbackAverageScore_gt);
  addAggregateComparison(FEEDBACK_AVG_SCORE_EXPR, '>=', where.feedbackAverageScore_gte);
  addAggregateComparison(FEEDBACK_AVG_SCORE_EXPR, '<', where.feedbackAverageScore_lt);
  addAggregateComparison(FEEDBACK_AVG_SCORE_EXPR, '<=', where.feedbackAverageScore_lte);

  // Presence checks
  if (where.hasA2aEndpoint === true) {
    conditions.push(`a2aEndpoint IS NOT NULL AND a2aEndpoint != ''`);
  } else if (where.hasA2aEndpoint === false) {
    conditions.push(`(a2aEndpoint IS NULL OR a2aEndpoint = '')`);
  }
  if (where.hasEnsEndpoint === true) {
    conditions.push(`ensEndpoint IS NOT NULL AND ensEndpoint != ''`);
  } else if (where.hasEnsEndpoint === false) {
    conditions.push(`(ensEndpoint IS NULL OR ensEndpoint = '')`);
  }

  // Boolean flags
  if (where.mcp === true) {
    conditions.push(`mcp = 1`);
  } else if (where.mcp === false) {
    conditions.push(`(mcp IS NULL OR mcp = 0)`);
  }
  if (where.x402support === true) {
    conditions.push(`x402support = 1`);
  } else if (where.x402support === false) {
    conditions.push(`(x402support IS NULL OR x402support = 0)`);
  }
  if (where.active === true) {
    conditions.push(`active = 1`);
  } else if (where.active === false) {
    conditions.push(`(active IS NULL OR active = 0)`);
  }
  if (where.is8004Agent === true) {
    conditions.push(`(agentName IS NOT NULL AND LOWER(agentName) LIKE '%8004-agent.eth')`);
  } else if (where.is8004Agent === false) {
    conditions.push(`(agentName IS NULL OR LOWER(agentName) NOT LIKE '%8004-agent.eth')`);
  }

  // Membership filters using EXISTS subqueries
  const addExistsFilter = (table: string, column: string, values?: string[]) => {
    if (Array.isArray(values) && values.length > 0) {
      const placeholders = values.map(() => '?').join(',');
      conditions.push(`EXISTS (SELECT 1 FROM ${table} t WHERE t.chainId = agents.chainId AND t.agentId = agents.agentId AND t.${column} IN (${placeholders}))`);
      params.push(...values);
    }
  };
  addExistsFilter('agent_operators', 'operator', where.operator_in);
  addExistsFilter('agent_supported_trust', 'trust', where.supportedTrust_in);
  addExistsFilter('agent_skills', 'skill', where.a2aSkills_in);
  addExistsFilter('agent_mcp_tools', 'tool', where.mcpTools_in);
  addExistsFilter('agent_mcp_prompts', 'prompt', where.mcpPrompts_in);
  addExistsFilter('agent_mcp_resources', 'resource', where.mcpResources_in);

  const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where: whereSql, params };
}

function buildFeedbackOrderByClause(orderBy?: string, orderDirection?: string): string {
  const validColumns = ['blockNumber', 'timestamp', 'score', 'ratingPct', 'feedbackIndex', 'responseCount'];
  const column = orderBy && validColumns.includes(orderBy) ? orderBy : 'blockNumber';
  const direction = (orderDirection?.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
  const numericColumns = new Set(['blockNumber', 'timestamp', 'score', 'ratingPct', 'feedbackIndex', 'responseCount']);
  const orderColumn = numericColumns.has(column) ? `CAST(${column} AS INTEGER)` : column;
  return `ORDER BY ${orderColumn} ${direction}`;
}

function buildFeedbackWhereClause(filters: {
  chainId?: number;
  agentId?: string;
  clientAddress?: string;
  feedbackIndex?: number;
  isRevoked?: boolean;
}): { where: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.chainId !== undefined) {
    conditions.push(`chainId = ?`);
    params.push(filters.chainId);
  }
  if (filters.agentId) {
    conditions.push(`agentId = ?`);
    params.push(filters.agentId);
  }
  if (filters.clientAddress) {
    conditions.push(`clientAddress = ?`);
    params.push(filters.clientAddress.toLowerCase());
  }
  if (filters.feedbackIndex !== undefined) {
    conditions.push(`feedbackIndex = ?`);
    params.push(filters.feedbackIndex);
  }
  if (filters.isRevoked === true) {
    conditions.push(`isRevoked = 1`);
  } else if (filters.isRevoked === false) {
    conditions.push(`(isRevoked IS NULL OR isRevoked = 0)`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

function buildFeedbackGraphWhereClause(where?: any): { where: string; params: any[] } {
  if (!where) return { where: '', params: [] };
  const conditions: string[] = [];
  const params: any[] = [];

  const addArrayCondition = (values: any[] | undefined, column: string) => {
    if (Array.isArray(values) && values.length > 0) {
      conditions.push(`${column} IN (${values.map(() => '?').join(',')})`);
      params.push(...values);
    }
  };

  if (where.chainId !== undefined) {
    conditions.push(`chainId = ?`);
    params.push(where.chainId);
  }
  addArrayCondition(where.chainId_in, 'chainId');

  if (where.agentId) {
    conditions.push(`agentId = ?`);
    params.push(where.agentId);
  }
  addArrayCondition(where.agentId_in, 'agentId');

  if (where.clientAddress) {
    conditions.push(`clientAddress = ?`);
    params.push(where.clientAddress.toLowerCase());
  }
  addArrayCondition(Array.isArray(where.clientAddress_in) ? where.clientAddress_in.map((addr: string) => addr.toLowerCase()) : undefined, 'clientAddress');

  if (where.feedbackIndex !== undefined) {
    conditions.push(`feedbackIndex = ?`);
    params.push(where.feedbackIndex);
  }
  addArrayCondition(where.feedbackIndex_in, 'feedbackIndex');

  const addComparison = (field: string, operator: string, value: any) => {
    if (value !== undefined && value !== null) {
      conditions.push(`${field} ${operator} ?`);
      params.push(value);
    }
  };

  addComparison('score', '>', where.score_gt);
  addComparison('score', '>=', where.score_gte);
  addComparison('score', '<', where.score_lt);
  addComparison('score', '<=', where.score_lte);

  addComparison('ratingPct', '>', where.ratingPct_gt);
  addComparison('ratingPct', '>=', where.ratingPct_gte);
  addComparison('ratingPct', '<', where.ratingPct_lt);
  addComparison('ratingPct', '<=', where.ratingPct_lte);

  addComparison('responseCount', '>', where.responseCount_gt);
  addComparison('responseCount', '>=', where.responseCount_gte);
  addComparison('responseCount', '<', where.responseCount_lt);
  addComparison('responseCount', '<=', where.responseCount_lte);

  addComparison('timestamp', '>', where.timestamp_gt);
  addComparison('timestamp', '>=', where.timestamp_gte);
  addComparison('timestamp', '<', where.timestamp_lt);
  addComparison('timestamp', '<=', where.timestamp_lte);

  if (where.isRevoked === true) {
    conditions.push(`isRevoked = 1`);
  } else if (where.isRevoked === false) {
    conditions.push(`(isRevoked IS NULL OR isRevoked = 0)`);
  }

  const addLikeCondition = (field: string, value?: string, nocase?: boolean) => {
    if (value) {
      if (nocase) {
        conditions.push(`LOWER(${field}) LIKE LOWER(?)`);
      } else {
        conditions.push(`${field} LIKE ?`);
      }
      params.push(`%${value}%`);
    }
  };

  addLikeCondition('domain', where.domain_contains, false);
  addLikeCondition('domain', where.domain_contains_nocase, true);
  addLikeCondition('comment', where.comment_contains, false);
  addLikeCondition('comment', where.comment_contains_nocase, true);
  addLikeCondition('feedbackUri', where.feedbackUri_contains, false);
  addLikeCondition('feedbackUri', where.feedbackUri_contains_nocase, true);

  if (Array.isArray(where.feedbackType_in) && where.feedbackType_in.length > 0) {
    conditions.push(`feedbackType IN (${where.feedbackType_in.map(() => '?').join(',')})`);
    params.push(...where.feedbackType_in);
  }
  addLikeCondition('feedbackType', where.feedbackType_contains, false);
  addLikeCondition('feedbackType', where.feedbackType_contains_nocase, true);

  if (where.feedbackHash) {
    conditions.push(`feedbackHash = ?`);
    params.push(where.feedbackHash.toLowerCase());
  }
  if (Array.isArray(where.feedbackHash_in) && where.feedbackHash_in.length > 0) {
    conditions.push(`feedbackHash IN (${where.feedbackHash_in.map(() => '?').join(',')})`);
    params.push(...where.feedbackHash_in.map((hash: string) => hash.toLowerCase()));
  }

  if (where.tag1) {
    conditions.push(`tag1 = ?`);
    params.push(where.tag1.toLowerCase());
  }
  if (where.tag2) {
    conditions.push(`tag2 = ?`);
    params.push(where.tag2.toLowerCase());
  }

  if (where.txHash) {
    conditions.push(`txHash = ?`);
    params.push(where.txHash.toLowerCase());
  }
  if (Array.isArray(where.txHash_in) && where.txHash_in.length > 0) {
    conditions.push(`txHash IN (${where.txHash_in.map(() => '?').join(',')})`);
    params.push(...where.txHash_in.map((hash: string) => hash.toLowerCase()));
  }

  const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where: whereSql, params };
}

function buildValidationOrderByClause(
  orderBy?: string,
  orderDirection?: string,
  allowedColumns: string[] = ['blockNumber', 'timestamp'],
  defaultColumn: string = 'blockNumber'
): string {
  const column = orderBy && allowedColumns.includes(orderBy) ? orderBy : defaultColumn;
  const direction = (orderDirection?.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
  const numericColumns = new Set(['blockNumber', 'timestamp', 'response']);
  const orderExpr = numericColumns.has(column) ? `CAST(${column} AS INTEGER)` : column;
  return `ORDER BY ${orderExpr} ${direction}`;
}

function buildValidationRequestWhereClause(filters: {
  chainId?: number;
  agentId?: string;
  validatorAddress?: string;
  requestHash?: string;
}): { where: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.chainId !== undefined) {
    conditions.push('chainId = ?');
    params.push(filters.chainId);
  }
  if (filters.agentId) {
    conditions.push('agentId = ?');
    params.push(filters.agentId);
  }
  if (filters.validatorAddress) {
    conditions.push('validatorAddress = ?');
    params.push(filters.validatorAddress.toLowerCase());
  }
  if (filters.requestHash) {
    conditions.push('requestHash = ?');
    params.push(filters.requestHash.toLowerCase());
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

function buildValidationResponseWhereClause(filters: {
  chainId?: number;
  agentId?: string;
  validatorAddress?: string;
  requestHash?: string;
  tag?: string;
  response?: number;
}): { where: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.chainId !== undefined) {
    conditions.push('chainId = ?');
    params.push(filters.chainId);
  }
  if (filters.agentId) {
    conditions.push('agentId = ?');
    params.push(filters.agentId);
  }
  if (filters.validatorAddress) {
    conditions.push('validatorAddress = ?');
    params.push(filters.validatorAddress.toLowerCase());
  }
  if (filters.requestHash) {
    conditions.push('requestHash = ?');
    params.push(filters.requestHash.toLowerCase());
  }
  if (filters.tag) {
    conditions.push('tag = ?');
    params.push(filters.tag.toLowerCase());
  }
  if (filters.response !== undefined && filters.response !== null) {
    conditions.push('response = ?');
    params.push(filters.response);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

function buildTokenMetadataWhereClause(filters?: {
  chainId?: number;
  agentId?: string;
  agentId_in?: string[];
  key?: string;
  key_in?: string[];
  key_contains?: string;
  key_contains_nocase?: string;
  valueText_contains?: string;
  valueText_contains_nocase?: string;
  value_contains?: string;
}): { where: string; params: any[] } {
  if (!filters) return { where: '', params: [] };
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.chainId !== undefined) {
    conditions.push('chainId = ?');
    params.push(filters.chainId);
  }

  if (filters.agentId) {
    conditions.push('agentId = ?');
    params.push(filters.agentId);
  }

  if (Array.isArray(filters.agentId_in) && filters.agentId_in.length > 0) {
    conditions.push(`agentId IN (${filters.agentId_in.map(() => '?').join(',')})`);
    params.push(...filters.agentId_in);
  }

  if (filters.key) {
    conditions.push('metadataKey = ?');
    params.push(filters.key);
  }

  if (Array.isArray(filters.key_in) && filters.key_in.length > 0) {
    conditions.push(`metadataKey IN (${filters.key_in.map(() => '?').join(',')})`);
    params.push(...filters.key_in);
  }

  if (filters.key_contains) {
    conditions.push('metadataKey LIKE ?');
    params.push(`%${filters.key_contains}%`);
  }

  if (filters.key_contains_nocase) {
    conditions.push('LOWER(metadataKey) LIKE LOWER(?)');
    params.push(`%${filters.key_contains_nocase}%`);
  }

  if (filters.valueText_contains) {
    conditions.push('valueText LIKE ?');
    params.push(`%${filters.valueText_contains}%`);
  }

  if (filters.valueText_contains_nocase) {
    conditions.push('LOWER(valueText) LIKE LOWER(?)');
    params.push(`%${filters.valueText_contains_nocase}%`);
  }

  if (filters.value_contains) {
    conditions.push('valueHex LIKE ?');
    params.push(`%${filters.value_contains}%`);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where: whereSql, params };
}

function buildTokenMetadataOrderByClause(orderBy?: string | null, orderDirection?: string | null): string {
  const validColumns = ['agentId', 'key', 'updatedAtTime'];
  const column = orderBy && validColumns.includes(orderBy) ? orderBy : 'agentId';
  const direction = (orderDirection?.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
  const mappedColumn = column === 'key' ? 'metadataKey' : column;
  const orderColumn = mappedColumn === 'agentId' ? 'CAST(agentId AS INTEGER)' : mappedColumn;
  return `ORDER BY ${orderColumn} ${direction}`;
}

function formatTokenMetadataRow(row: any): any {
  if (!row) return row;
  const updatedAt = row.updatedAtTime !== undefined && row.updatedAtTime !== null ? Number(row.updatedAtTime) : null;
  return {
    chainId: Number(row.chainId ?? 0),
    agentId: String(row.agentId ?? ''),
    id: String(row.metadataId ?? row.id ?? ''),
    key: row.metadataKey ?? row.key ?? '',
    value: row.valueHex ?? row.value ?? null,
    valueText: row.valueText ?? null,
    indexedKey: row.indexedKey ?? null,
    updatedAtTime: updatedAt,
  };
}

async function attachTokenMetadataToAgents(db: any, agents: any[]): Promise<void> {
  if (!Array.isArray(agents) || agents.length === 0) {
    return;
  }

  const groups = new Map<number, Set<string>>();
  for (const agent of agents) {
    if (!agent || agent.chainId === undefined || agent.agentId === undefined) continue;
    const chainId = Number(agent.chainId);
    const agentId = String(agent.agentId);
    if (!groups.has(chainId)) {
      groups.set(chainId, new Set());
    }
    groups.get(chainId)!.add(agentId);
  }

  const metadataMap = new Map<string, any[]>();
  const chunkSize = 50;

  for (const [chainId, agentSet] of groups.entries()) {
    const agentIds = Array.from(agentSet);
    for (let i = 0; i < agentIds.length; i += chunkSize) {
      const chunk = agentIds.slice(i, i + chunkSize);
      if (!chunk.length) continue;
      const placeholders = chunk.map(() => '?').join(',');
      const sql = `
        SELECT chainId, metadataId, agentId, metadataKey, valueHex, valueText, indexedKey, updatedAtTime
        FROM token_metadata
        WHERE chainId = ? AND agentId IN (${placeholders})
        ORDER BY metadataKey ASC
      `;
      const rows = await executeQuery(db, sql, [chainId, ...chunk]);
      for (const row of rows) {
        const formatted = formatTokenMetadataRow(row);
        const key = `${formatted.chainId}:${formatted.agentId}`;
        if (!metadataMap.has(key)) {
          metadataMap.set(key, []);
        }
        metadataMap.get(key)!.push(formatted);
      }
    }
  }

  for (const agent of agents) {
    if (!agent) continue;
    const key = `${agent.chainId}:${agent.agentId}`;
    agent.metadata = metadataMap.get(key) || [];
  }
}

function parseChainIdValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseAgentIdValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}

function extractAgentIdentifier(match: VectorQueryMatch): AgentIdentifier | null {
  const metadata = (match.metadata ?? {}) as Record<string, unknown>;
  const chainId = parseChainIdValue(metadata['chainId']);
  const agentId = parseAgentIdValue(metadata['agentId']);

  if (chainId !== null && agentId) {
    return { chainId, agentId };
  }

  if (typeof match.id === 'string' && match.id.includes(':')) {
    const [maybeChainId, maybeAgentId] = match.id.split(':', 2);
    const parsedChainId = parseChainIdValue(maybeChainId);
    const parsedAgentId = parseAgentIdValue(maybeAgentId);
    if (parsedChainId !== null && parsedAgentId) {
      return { chainId: parsedChainId, agentId: parsedAgentId };
    }
  }

  return null;
}

async function hydrateSemanticMatches(db: any, matches: VectorQueryMatch[]) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return [];
  }

  const keyedMatches = matches.map((match) => ({
    match,
    identifier: extractAgentIdentifier(match),
  }));

  const groups = new Map<number, Set<string>>();
  for (const entry of keyedMatches) {
    if (!entry.identifier) continue;
    const { chainId, agentId } = entry.identifier;
    if (!groups.has(chainId)) {
      groups.set(chainId, new Set());
    }
    groups.get(chainId)!.add(agentId);
  }

  const agentRows: any[] = [];
  for (const [chainId, agentIdsSet] of groups.entries()) {
    const agentIds = Array.from(agentIdsSet);
    if (!agentIds.length) continue;
    const placeholders = agentIds.map(() => '?').join(',');
    const sql = `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE chainId = ? AND agentId IN (${placeholders})`;
    const rows = await executeQuery(db, sql, [chainId, ...agentIds]);
    agentRows.push(...rows);
  }

  if (agentRows.length > 0) {
    await attachTokenMetadataToAgents(db, agentRows);
  }

  const agentMap = new Map<string, any>();
  for (const row of agentRows) {
    const key = `${row.chainId}:${row.agentId}`;
    agentMap.set(key, enrichAgentRecord(row));
  }

  return keyedMatches.map(({ match, identifier }) => {
    const agentKey = identifier ? `${identifier.chainId}:${identifier.agentId}` : null;
    const agent = agentKey ? agentMap.get(agentKey) ?? null : null;
    return {
      agent,
      score: typeof match.score === 'number' ? match.score : 0,
      matchReasons: match.matchReasons ?? undefined,
    };
  });
}

const FEEDBACK_COUNT_EXPR = `
(SELECT COUNT(*)
 FROM rep_feedbacks rf
 WHERE rf.chainId = agents.chainId
   AND rf.agentId = agents.agentId)`;

const FEEDBACK_AVG_SCORE_EXPR = `
(SELECT AVG(score)
 FROM rep_feedbacks rf
 WHERE rf.chainId = agents.chainId
   AND rf.agentId = agents.agentId
   AND rf.score IS NOT NULL)`;

const VALIDATION_PENDING_EXPR = `
(SELECT COUNT(*)
 FROM validation_requests vr
 WHERE vr.chainId = agents.chainId
   AND vr.agentId = agents.agentId
   AND NOT EXISTS (
     SELECT 1
     FROM validation_responses vresp
     WHERE vresp.chainId = vr.chainId
       AND vresp.agentId = vr.agentId
       AND COALESCE(vresp.requestHash, '') = COALESCE(vr.requestHash, '')
   ))`;

const VALIDATION_COMPLETED_EXPR = `
(SELECT COUNT(*)
 FROM validation_responses vresp
 WHERE vresp.chainId = agents.chainId
   AND vresp.agentId = agents.agentId)`;

const VALIDATION_REQUESTED_EXPR = `
(SELECT COUNT(*)
 FROM validation_requests vr
 WHERE vr.chainId = agents.chainId
   AND vr.agentId = agents.agentId)`;

const AGENT_SUMMARY_COLUMNS = `
  ${FEEDBACK_COUNT_EXPR} AS feedbackCount,
  ${FEEDBACK_AVG_SCORE_EXPR} AS feedbackAverageScore,
  ${VALIDATION_PENDING_EXPR} AS validationPendingCount,
  ${VALIDATION_COMPLETED_EXPR} AS validationCompletedCount,
  ${VALIDATION_REQUESTED_EXPR} AS validationRequestedCount
`;

const AGENT_BASE_COLUMNS = `
  agents.*,
  COALESCE(agentAccount, agentAddress) as agentAccount,
  ${AGENT_SUMMARY_COLUMNS}
`;

const TOKEN_METADATA_COLUMNS = `
  chainId,
  metadataId,
  agentId,
  metadataKey,
  valueHex,
  valueText,
  indexedKey,
  updatedAtTime
`;

interface AgentIdentifier {
  chainId: number;
  agentId: string;
}

export interface GraphQLResolverOptions {
  env?: any;
  semanticSearchService?: SemanticSearchService | null;
}

/**
 * Create GraphQL resolvers
 * @param db - Database instance (can be D1 adapter or native D1)
 * @param options - Additional options (like env for indexAgent)
 */
export function createGraphQLResolvers(db: any, options?: GraphQLResolverOptions) {

  return {
    agents: async (args: {
      chainId?: number;
      agentId?: string;
      agentOwner?: string;
      eoaOwner?: string;
      agentName?: string;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: string;
    }) => {

      let execOrderBy = args.orderBy;
      let execOrderDirection = args.orderDirection;
      if (execOrderBy === undefined || execOrderBy === null) {
        execOrderBy = 'agentId';
      }
      if (execOrderDirection === undefined || execOrderDirection === null) {
        execOrderDirection = 'DESC';
      }


      try {
        
        const { chainId, agentId, agentOwner, eoaOwner, agentName, limit = 100, offset = 0, orderBy, orderDirection } = args;
        const { where, params } = buildWhereClause({ chainId, agentId, agentOwner, eoaOwner, agentName });
        const orderByClause = buildOrderByClause(execOrderBy, execOrderDirection);
        const query = `SELECT ${AGENT_BASE_COLUMNS} FROM agents ${where} ${orderByClause} LIMIT ? OFFSET ?`;
        const allParams = [...params, limit, offset];
        const results = await executeQuery(db, query, allParams);
        await attachTokenMetadataToAgents(db, results);
        console.log('[agents] rows:', results.length, 'params:', { chainId, agentId, agentOwner, eoaOwner, agentName, limit, offset, execOrderBy, execOrderDirection });
        return enrichAgentRecords(results);
      } catch (error) {
        console.error('❌ Error in agents resolver:', error);
        throw error;
      }
    },

    // Graph-like advanced search (where/first/skip/orderBy/orderDirection)
    searchAgentsGraph: async (args: {
      where?: any;
      first?: number | null;
      skip?: number | null;
      execOrderBy?: string | null;
      execOrderDirection?: string | null;
    }) => {
      try {
        const { where, first, skip, execOrderBy, execOrderDirection } = args || {};
        const pageSize = typeof first === 'number' && Number.isFinite(first) && first > 0 ? first : 20;
        const offset = typeof skip === 'number' && Number.isFinite(skip) && skip >= 0 ? skip : 0;
        const orderByField = typeof execOrderBy === 'string' ? execOrderBy : 'agentId';
        const orderDir = typeof execOrderDirection === 'string' ? execOrderDirection : 'DESC';
        const { where: whereSql, params } = buildGraphWhereClause(where);
        const orderByClause = buildOrderByClause(orderByField, orderDir);

        const agentsQuery = `SELECT ${AGENT_BASE_COLUMNS} FROM agents ${whereSql} ${orderByClause} LIMIT ? OFFSET ?`;
        const agentsParams = [...params, pageSize, offset];
        const agentsRaw = await executeQuery(db, agentsQuery, agentsParams);
        await attachTokenMetadataToAgents(db, agentsRaw);
        const agents = enrichAgentRecords(agentsRaw);

        const countQuery = `SELECT COUNT(*) as count FROM agents ${whereSql}`;
        const countResult = await executeQuerySingle(db, countQuery, params);
        const total = (countResult as any)?.count || 0;
        const hasMore = (offset + pageSize) < total;
        console.log('[searchAgentsGraph] rows:', agents.length, 'total:', total, 'args:', { where, first: pageSize, skip: offset, orderBy: orderByField, orderDirection: orderDir });

        return { agents, total, hasMore };
      } catch (error) {
        console.error('❌ Error in searchAgentsGraph resolver:', error);
        throw error;
      }
    },

    agent: async (args: { chainId: number; agentId: string }) => {
      try {
        const { chainId, agentId } = args;
        const result = await executeQuerySingle(db, `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE chainId = ? AND agentId = ?`, [chainId, agentId]);
        if (result) {
          await attachTokenMetadataToAgents(db, [result]);
        }
        return enrichAgentRecord(result);
      } catch (error) {
        console.error('❌ Error in agent resolver:', error);
        throw error;
      }
    },

    agentByName: async (args: { agentName: string }) => {
      try {
        console.log('🔍 agentByName resolver:', args);
        const normalizedName = args.agentName?.trim();
        if (!normalizedName) {
          return null;
        }
        const lowerName = normalizedName.toLowerCase();
        console.log('🔍 lowerName:', lowerName);
        const result = await executeQuerySingle(db, `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE LOWER(agentName) = ? LIMIT 1`, [lowerName]);
        console.log('🔍 result:', JSON.stringify(result, null, 2)); 
        if (result) {
          await attachTokenMetadataToAgents(db, [result]);
        }
        return enrichAgentRecord(result);
      } catch (error) {
        console.error('❌ Error in agentByName resolver:', error);
        throw error;
      }
    },

    agentsByChain: async (args: { chainId: number; limit?: number; offset?: number; orderBy?: string; orderDirection?: string }) => {
      try {
        const { chainId, limit = 100, offset = 0, orderBy, orderDirection } = args;
        const orderByClause = buildOrderByClause(orderBy, orderDirection);
        const query = `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE chainId = ? ${orderByClause} LIMIT ? OFFSET ?`;
        const results = await executeQuery(db, query, [chainId, limit, offset]);
        await attachTokenMetadataToAgents(db, results);
        console.log('[agentsByChain] rows:', results.length, 'chainId:', chainId, 'limit:', limit, 'offset:', offset);
        return enrichAgentRecords(results);
      } catch (error) {
        console.error('❌ Error in agentsByChain resolver:', error);
        throw error;
      }
    },

    agentsByOwner: async (args: { agentOwner: string; chainId?: number; limit?: number; offset?: number; orderBy?: string; orderDirection?: string }) => {
      try {
        const { agentOwner, chainId, limit = 100, offset = 0, orderBy, orderDirection } = args;
        let query = `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE agentOwner = ?`;
        const params: any[] = [agentOwner];
        
        if (chainId !== undefined) {
          query += ' AND chainId = ?';
          params.push(chainId);
        }
        
        const orderByClause = buildOrderByClause(orderBy, orderDirection);
        query += ` ${orderByClause} LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        
        const results = await executeQuery(db, query, params);
        await attachTokenMetadataToAgents(db, results);
        console.log('[agentsByOwner] rows:', results.length, 'agentOwner:', agentOwner, 'chainId:', chainId, 'limit:', limit, 'offset:', offset);
        return enrichAgentRecords(results);
      } catch (error) {
        console.error('❌ Error in agentsByOwner resolver:', error);
        throw error;
      }
    },

    searchAgents: async (args: { query: string; chainId?: number; limit?: number; offset?: number; orderBy?: string; orderDirection?: string }) => {
      try {
        const { query: searchQuery, chainId, limit = 100, offset = 0, orderBy, orderDirection } = args;
        const searchPattern = `%${searchQuery}%`;

        let sqlQuery = `
          SELECT ${AGENT_BASE_COLUMNS} FROM agents
          WHERE (agentName LIKE ? OR description LIKE ? OR agentId LIKE ? OR COALESCE(agentAccount, agentAddress) LIKE ?)
        `;
        const params: any[] = [searchPattern, searchPattern, searchPattern, searchPattern];

        if (chainId !== undefined) {
          sqlQuery += ' AND chainId = ?';
          params.push(chainId);
        }

        const orderByClause = buildOrderByClause(orderBy, orderDirection);
        sqlQuery += ` ${orderByClause} LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const results = await executeQuery(db, sqlQuery, params);
        await attachTokenMetadataToAgents(db, results);
        console.log('[searchAgents] rows:', results.length, 'query:', searchQuery, 'chainId:', chainId, 'limit:', limit, 'offset:', offset);
        return enrichAgentRecords(results);
      } catch (error) {
        console.error('❌ Error in searchAgents resolver:', error);
        throw error;
      }
    },

    getAccessCode: async (args: { address: string }) => {
      try {
        const { address } = args;
        return await executeQuerySingle(db, 'SELECT * FROM access_codes WHERE address = ?', [address.toLowerCase()]);
      } catch (error) {
        console.error('❌ Error in getAccessCode resolver:', error);
        throw error;
      }
    },

    countAgents: async (args: {
      chainId?: number;
      agentId?: string;
      agentOwner?: string;
      eoaOwner?: string;
      agentName?: string;
    }) => {
      try {
        const { where, params } = buildWhereClause(args);
        const query = `SELECT COUNT(*) as count FROM agents ${where}`;
        const result = await executeQuerySingle(db, query, params);
        return (result as any)?.count || 0;
      } catch (error) {
        console.error('❌ Error in countAgents resolver:', error);
        throw error;
      }
    },

    semanticAgentSearch: async (args: {
      input: {
        text: string;
        topK?: number;
        minScore?: number;
        filters?: any;
      };
    }) => {
      const semanticSearch = options?.semanticSearchService ?? null;
      if (!semanticSearch) {
        console.warn('[semanticAgentSearch] Semantic search not configured');
        return { matches: [], total: 0 };
      }

      const input = args?.input;
      const text = input?.text?.trim();
      if (!input || !text) {
        return { matches: [], total: 0 };
      }

      try {
        const matches = await semanticSearch.search({
          text,
          topK: input.topK,
          minScore: input.minScore,
          filters: input.filters,
        });

        if (!matches.length) {
          return { matches: [], total: 0 };
        }

        const hydrated = await hydrateSemanticMatches(db, matches);
        return { matches: hydrated, total: hydrated.length };
      } catch (error) {
        console.error('❌ Error in semanticAgentSearch resolver:', error);
        throw error;
      }
    },

    tokenMetadata: async (args: {
      where?: any;
      first?: number | null;
      skip?: number | null;
      orderBy?: string | null;
      orderDirection?: string | null;
    }) => {
      try {
        const { where, first, skip, orderBy, orderDirection } = args || {};
        const pageSize = typeof first === 'number' && Number.isFinite(first) && first > 0 ? first : 100;
        const offset = typeof skip === 'number' && Number.isFinite(skip) && skip >= 0 ? skip : 0;
        const { where: whereSql, params } = buildTokenMetadataWhereClause(where);
        const orderClause = buildTokenMetadataOrderByClause(orderBy || undefined, orderDirection || undefined);
        const rows = await executeQuery(
          db,
          `SELECT ${TOKEN_METADATA_COLUMNS} FROM token_metadata ${whereSql} ${orderClause} LIMIT ? OFFSET ?`,
          [...params, pageSize, offset]
        );
        const formatted = rows.map(formatTokenMetadataRow);
        const countRow = await executeQuerySingle(db, `SELECT COUNT(*) as count FROM token_metadata ${whereSql}`, params);
        const total = (countRow as any)?.count || 0;
        const hasMore = (offset + pageSize) < total;
        return { entries: formatted, total, hasMore };
      } catch (error) {
        console.error('❌ Error in tokenMetadata resolver:', error);
        throw error;
      }
    },

    tokenMetadataById: async (args: { chainId: number; id: string }) => {
      try {
        const { chainId, id } = args;
        const row = await executeQuerySingle(
          db,
          `SELECT ${TOKEN_METADATA_COLUMNS} FROM token_metadata WHERE chainId = ? AND metadataId = ?`,
          [chainId, id]
        );
        return row ? formatTokenMetadataRow(row) : null;
      } catch (error) {
        console.error('❌ Error in tokenMetadataById resolver:', error);
        throw error;
      }
    },

    feedbacks: async (args: {
      chainId?: number;
      agentId?: string;
      clientAddress?: string;
      feedbackIndex?: number;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: string;
    }) => {
      try {
        const {
          chainId,
          agentId,
          clientAddress,
          feedbackIndex,
          limit = 100,
          offset = 0,
          orderBy,
          orderDirection,
        } = args || {};
        const { where, params } = buildFeedbackWhereClause({ chainId, agentId, clientAddress, feedbackIndex });
        const orderByClause = buildFeedbackOrderByClause(orderBy, orderDirection);
        const sql = `SELECT * FROM rep_feedbacks ${where} ${orderByClause} LIMIT ? OFFSET ?`;
        const rows = await executeQuery(db, sql, [...params, limit, offset]);
        console.log('[feedbacks] rows:', rows.length, 'params:', args);
        return rows;
      } catch (error) {
        console.error('❌ Error in feedbacks resolver:', error);
        throw error;
      }
    },

    feedback: async (args: { id: string }) => {
      try {
        const row = await executeQuerySingle(db, 'SELECT * FROM rep_feedbacks WHERE id = ?', [args.id]);
        return row;
      } catch (error) {
        console.error('❌ Error in feedback resolver:', error);
        throw error;
      }
    },

    feedbackByReference: async (args: { chainId: number; agentId: string; clientAddress: string; feedbackIndex: number }) => {
      try {
        const { chainId, agentId, clientAddress, feedbackIndex } = args;
        const row = await executeQuerySingle(
          db,
          'SELECT * FROM rep_feedbacks WHERE chainId = ? AND agentId = ? AND clientAddress = ? AND feedbackIndex = ?',
          [chainId, agentId, clientAddress.toLowerCase(), feedbackIndex]
        );
        return row;
      } catch (error) {
        console.error('❌ Error in feedbackByReference resolver:', error);
        throw error;
      }
    },

    searchFeedbacks: async (args: {
      query: string;
      chainId?: number;
      agentId?: string;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: string;
    }) => {
      try {
        const { query: searchQuery, chainId, agentId, limit = 100, offset = 0, orderBy, orderDirection } = args;
        const searchPattern = `%${searchQuery}%`;
        const conditions = [
          '(agentId LIKE ? OR clientAddress LIKE ? OR domain LIKE ? OR comment LIKE ? OR feedbackType LIKE ? OR feedbackUri LIKE ? OR feedbackHash LIKE ?)'
        ];
        const params: any[] = [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern];

        if (chainId !== undefined) {
          conditions.push('chainId = ?');
          params.push(chainId);
        }
        if (agentId) {
          conditions.push('agentId = ?');
          params.push(agentId);
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`;
        const orderByClause = buildFeedbackOrderByClause(orderBy, orderDirection);
        const sql = `SELECT * FROM rep_feedbacks ${whereClause} ${orderByClause} LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const rows = await executeQuery(db, sql, params);
        console.log('[searchFeedbacks] rows:', rows.length, 'query:', searchQuery);
        return rows;
      } catch (error) {
        console.error('❌ Error in searchFeedbacks resolver:', error);
        throw error;
      }
    },

    searchFeedbacksGraph: async (args: {
      where?: any;
      first?: number | null;
      skip?: number | null;
      orderBy?: string | null;
      orderDirection?: string | null;
    }) => {
      try {
        const { where, first, skip, orderBy, orderDirection } = args || {};
        const pageSize = typeof first === 'number' && Number.isFinite(first) && first > 0 ? first : 50;
        const offset = typeof skip === 'number' && Number.isFinite(skip) && skip >= 0 ? skip : 0;
        const { where: whereSql, params } = buildFeedbackGraphWhereClause(where);
        const orderByClause = buildFeedbackOrderByClause(orderBy || undefined, orderDirection || undefined);

        const rows = await executeQuery(
          db,
          `SELECT * FROM rep_feedbacks ${whereSql} ${orderByClause} LIMIT ? OFFSET ?`,
          [...params, pageSize, offset]
        );
        const countRow = await executeQuerySingle(db, `SELECT COUNT(*) as count FROM rep_feedbacks ${whereSql}`, params);
        const total = (countRow as any)?.count || 0;
        const hasMore = (offset + pageSize) < total;
        console.log('[searchFeedbacksGraph] rows:', rows.length, 'total:', total);
        return { feedbacks: rows, total, hasMore };
      } catch (error) {
        console.error('❌ Error in searchFeedbacksGraph resolver:', error);
        throw error;
      }
    },

    countFeedbacks: async (args: {
      chainId?: number;
      agentId?: string;
      clientAddress?: string;
      feedbackIndex?: number;
      isRevoked?: boolean;
    }) => {
      try {
        const { where, params } = buildFeedbackWhereClause(args);
        const row = await executeQuerySingle(db, `SELECT COUNT(*) as count FROM rep_feedbacks ${where}`, params);
        return (row as any)?.count || 0;
      } catch (error) {
        console.error('❌ Error in countFeedbacks resolver:', error);
        throw error;
      }
    },

    feedbackResponses: async (args: {
      chainId?: number;
      agentId?: string;
      clientAddress?: string;
      feedbackIndex?: number;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: string;
    }) => {
      try {
        const { chainId, agentId, clientAddress, feedbackIndex, limit = 100, offset = 0, orderBy, orderDirection } = args || {};
        const conditions: string[] = [];
        const params: any[] = [];

        if (chainId !== undefined) {
          conditions.push('chainId = ?');
          params.push(chainId);
        }
        if (agentId) {
          conditions.push('agentId = ?');
          params.push(agentId);
        }
        if (clientAddress) {
          conditions.push('clientAddress = ?');
          params.push(clientAddress.toLowerCase());
        }
        if (feedbackIndex !== undefined) {
          conditions.push('feedbackIndex = ?');
          params.push(feedbackIndex);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const validResponseOrder = ['blockNumber', 'timestamp', 'feedbackIndex'];
        const orderColumn = orderBy && validResponseOrder.includes(orderBy) ? orderBy : 'blockNumber';
        const direction = (orderDirection?.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
        const orderSql = `ORDER BY CAST(${orderColumn} AS INTEGER) ${direction}`;

        const sql = `SELECT * FROM rep_feedback_responses ${whereClause} ${orderSql} LIMIT ? OFFSET ?`;
        const rows = await executeQuery(db, sql, [...params, limit, offset]);
        console.log('[feedbackResponses] rows:', rows.length, 'params:', args);
        return rows;
      } catch (error) {
        console.error('❌ Error in feedbackResponses resolver:', error);
        throw error;
      }
    },

    feedbackRevocations: async (args: {
      chainId?: number;
      agentId?: string;
      clientAddress?: string;
      feedbackIndex?: number;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: string;
    }) => {
      try {
        const { chainId, agentId, clientAddress, feedbackIndex, limit = 100, offset = 0, orderBy, orderDirection } = args || {};
        const conditions: string[] = [];
        const params: any[] = [];

        if (chainId !== undefined) {
          conditions.push('chainId = ?');
          params.push(chainId);
        }
        if (agentId) {
          conditions.push('agentId = ?');
          params.push(agentId);
        }
        if (clientAddress) {
          conditions.push('clientAddress = ?');
          params.push(clientAddress.toLowerCase());
        }
        if (feedbackIndex !== undefined) {
          conditions.push('feedbackIndex = ?');
          params.push(feedbackIndex);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const validRevocationOrder = ['blockNumber', 'timestamp', 'feedbackIndex'];
        const orderColumn = orderBy && validRevocationOrder.includes(orderBy) ? orderBy : 'blockNumber';
        const direction = (orderDirection?.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
        const orderSql = `ORDER BY CAST(${orderColumn} AS INTEGER) ${direction}`;

        const sql = `SELECT * FROM rep_feedback_revoked ${whereClause} ${orderSql} LIMIT ? OFFSET ?`;
        const rows = await executeQuery(db, sql, [...params, limit, offset]);
        console.log('[feedbackRevocations] rows:', rows.length, 'params:', args);
        return rows;
      } catch (error) {
        console.error('❌ Error in feedbackRevocations resolver:', error);
        throw error;
      }
    },

    validationRequests: async (args: {
      chainId?: number;
      agentId?: string;
      validatorAddress?: string;
      requestHash?: string;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: string;
    }) => {
      try {
        const {
          chainId,
          agentId,
          validatorAddress,
          requestHash,
          limit = 100,
          offset = 0,
          orderBy,
          orderDirection,
        } = args || {};
        const { where, params } = buildValidationRequestWhereClause({ chainId, agentId, validatorAddress, requestHash });
        const orderByClause = buildValidationOrderByClause(orderBy, orderDirection, ['blockNumber', 'timestamp'], 'blockNumber');
        const sql = `SELECT * FROM validation_requests ${where} ${orderByClause} LIMIT ? OFFSET ?`;
        const rows = await executeQuery(db, sql, [...params, limit, offset]);
        console.log('[validationRequests] rows:', rows.length, 'params:', args);
        return rows;
      } catch (error) {
        console.error('❌ Error in validationRequests resolver:', error);
        throw error;
      }
    },

    validationRequest: async (args: { id: string }) => {
      try {
        return await executeQuerySingle(db, 'SELECT * FROM validation_requests WHERE id = ?', [args.id]);
      } catch (error) {
        console.error('❌ Error in validationRequest resolver:', error);
        throw error;
      }
    },

    validationResponses: async (args: {
      chainId?: number;
      agentId?: string;
      validatorAddress?: string;
      requestHash?: string;
      tag?: string;
      response?: number;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: string;
    }) => {
      try {
        const {
          chainId,
          agentId,
          validatorAddress,
          requestHash,
          tag,
          response,
          limit = 100,
          offset = 0,
          orderBy,
          orderDirection,
        } = args || {};
        const { where, params } = buildValidationResponseWhereClause({ chainId, agentId, validatorAddress, requestHash, tag, response });
        const orderByClause = buildValidationOrderByClause(orderBy, orderDirection, ['blockNumber', 'timestamp', 'response'], 'blockNumber');
        const sql = `SELECT * FROM validation_responses ${where} ${orderByClause} LIMIT ? OFFSET ?`;
        const rows = await executeQuery(db, sql, [...params, limit, offset]);
        console.log('[validationResponses] rows:', rows.length, 'params:', args);
        return rows;
      } catch (error) {
        console.error('❌ Error in validationResponses resolver:', error);
        throw error;
      }
    },

    validationResponse: async (args: { id: string }) => {
      try {
        return await executeQuerySingle(db, 'SELECT * FROM validation_responses WHERE id = ?', [args.id]);
      } catch (error) {
        console.error('❌ Error in validationResponse resolver:', error);
        throw error;
      }
    },

    countValidationRequests: async (args: {
      chainId?: number;
      agentId?: string;
      validatorAddress?: string;
      requestHash?: string;
    }) => {
      try {
        const { where, params } = buildValidationRequestWhereClause(args || {});
        const row = await executeQuerySingle(db, `SELECT COUNT(*) as count FROM validation_requests ${where}`, params);
        return (row as any)?.count || 0;
      } catch (error) {
        console.error('❌ Error in countValidationRequests resolver:', error);
        throw error;
      }
    },

    countValidationResponses: async (args: {
      chainId?: number;
      agentId?: string;
      validatorAddress?: string;
      requestHash?: string;
      tag?: string;
    }) => {
      try {
        const { where, params } = buildValidationResponseWhereClause({ ...args });
        const row = await executeQuerySingle(db, `SELECT COUNT(*) as count FROM validation_responses ${where}`, params);
        return (row as any)?.count || 0;
      } catch (error) {
        console.error('❌ Error in countValidationResponses resolver:', error);
        throw error;
      }
    },

    createAccessCode: async (args: { address: string }) => {
      try {
        const { address } = args;
        const normalizedAddress = address.toLowerCase();
        
        // Check if access code already exists
        const existing = await executeQuerySingle(db, 'SELECT * FROM access_codes WHERE address = ?', [normalizedAddress]);
        
        if (existing) {
          return existing;
        }
        
        // Generate new access code (32 bytes = 64 hex characters)
        // Use crypto.randomUUID if available, otherwise fallback
        let accessCode: string;
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          accessCode = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
        } else {
          // Fallback for Node.js crypto module
          const cryptoNode = await import('crypto');
          accessCode = cryptoNode.randomBytes(32).toString('hex');
        }
        const timestamp = Math.floor(Date.now() / 1000);
        
        // Insert new access code
        await executeUpdate(db, 'INSERT INTO access_codes (address, accessCode, createdAt) VALUES (?, ?, ?)', [
          normalizedAddress,
          accessCode,
          timestamp,
        ]);
        
        return {
          address: normalizedAddress,
          accessCode,
          createdAt: timestamp,
        };
      } catch (error) {
        console.error('❌ Error in createAccessCode resolver:', error);
        throw error;
      }
    },

    // indexAgent will be added by the specific implementation (graphql.ts or worker-db.ts)
    // because it needs environment-specific logic
  };
}

/**
 * Compute DID values for an agent record
 */
function computeDIDValues(agent: any): { didIdentity: string; didAccount: string; didName: string | null } {
  const chainId = agent.chainId;
  const agentId = agent.agentId;
  const agentAccount = agent.agentAccount || agent.agentAddress; // Support both during migration
  const agentName = agent.agentName;

  const didIdentity = `did:8004:${chainId}:${agentId}`;
  const didAccount = agentAccount ? `did:ethr:${chainId}:${agentAccount}` : '';
  const didName = agentName && agentName.endsWith('.eth') ? `did:ens:${chainId}:${agentName}` : null;

  return { didIdentity, didAccount, didName };
}

/**
 * Enrich agent records with computed DID values and ensure agentAccount field
 */
function enrichAgentRecord(agent: any): any {
  if (!agent) return agent;

  // Ensure agentAccount exists (use agentAddress as fallback during migration)
  if (!agent.agentAccount && agent.agentAddress) {
    agent.agentAccount = agent.agentAddress;
  }

  // Compute DID values if not already present
  if (!agent.didIdentity || !agent.didAccount) {
    const dids = computeDIDValues(agent);
    agent.didIdentity = agent.didIdentity || dids.didIdentity;
    agent.didAccount = agent.didAccount || dids.didAccount;
    agent.didName = agent.didName || dids.didName;
  }

  const normalizeInt = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
  };

  const normalizeFloat = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  if (Object.prototype.hasOwnProperty.call(agent, 'feedbackCount')) {
    agent.feedbackCount = normalizeInt(agent.feedbackCount);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'validationPendingCount')) {
    agent.validationPendingCount = normalizeInt(agent.validationPendingCount);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'validationCompletedCount')) {
    agent.validationCompletedCount = normalizeInt(agent.validationCompletedCount);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'validationRequestedCount')) {
    agent.validationRequestedCount = normalizeInt(agent.validationRequestedCount);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'feedbackAverageScore')) {
    agent.feedbackAverageScore = normalizeFloat(agent.feedbackAverageScore);
  }

  return agent;
}

/**
 * Enrich an array of agent records
 */
function enrichAgentRecords(agents: any[]): any[] {
  return agents.map(enrichAgentRecord);
}

/**
 * Unified validateAccessCode function that works with both D1 adapter and native D1
 */
export async function validateAccessCode(db: any, accessCode: string | null | undefined): Promise<boolean> {
  if (!accessCode) return false;
  try {
    // Use executeQuerySingle to handle both database interfaces
    const row = await executeQuerySingle(db, 'SELECT accessCode FROM access_codes WHERE accessCode = ?', [accessCode]);
    
    if (row) {
      // Update lastUsedAt
      const timestamp = Math.floor(Date.now() / 1000);
      await executeUpdate(db, 'UPDATE access_codes SET lastUsedAt = ? WHERE accessCode = ?', [timestamp, accessCode]);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error validating access code:', error);
    return false;
  }
}

