import type { SemanticSearchService } from './semantic/semantic-search-service.js';
import { intentJsonToSearchText, parseIntentJson } from './semantic/intent-text.js';
import { buildIntentQueryText, resolveIntentRequirements } from './semantic/intent-mapping.js';
import type { VectorQueryMatch } from './semantic/interfaces.js';
import { getGraphdbConfigFromEnv, queryGraphdb } from './graphdb/graphdb-http';

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

function normalizeHexLike(value: any): string | null {
  if (value == null) return null;
  const s = String(value).trim().toLowerCase();
  return s ? s : null;
}

function isAddressHex(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^0x[0-9a-f]{40}$/.test(value);
}

function normalizeAddress40(value: any): string | null {
  const v = normalizeHexLike(value);
  if (!v) return null;
  if (!isAddressHex(v)) return null;
  return v.slice(2);
}

type NormalizedAccountFilter =
  | { kind: 'caipish'; value: string } // "{chainId}:{0x...}" (address normalized)
  | { kind: 'addr40'; value: string } // "abcd..." (40 hex chars, no 0x)
  | { kind: 'string'; value: string }; // unknown format; use exact equality

function normalizeAccountFilterValue(value: any): NormalizedAccountFilter | null {
  if (value == null) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  const colonIdx = raw.indexOf(':');
  if (colonIdx > 0) {
    const prefix = raw.slice(0, colonIdx).trim();
    const rest = raw.slice(colonIdx + 1).trim();
    const addr40 = normalizeAddress40(rest);
    if (addr40) return { kind: 'caipish', value: `${prefix}:0x${addr40}` };
    return { kind: 'string', value: raw };
  }

  const addr40 = normalizeAddress40(raw);
  if (addr40) return { kind: 'addr40', value: addr40 };
  return { kind: 'string', value: raw };
}

function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function normalizeInterfaceId(value: any): string {
  const v = normalizeHexLike(value);
  return v ?? '0x00000000';
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
  agentIdentityOwnerAccount?: string;
  eoaAgentIdentityOwnerAccount?: string;
  agentName?: string;
}): { where: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  const addAccountEq = (column: string, value: any) => {
    const normalized = normalizeAccountFilterValue(value);
    if (!normalized) return;
    if (normalized.kind === 'addr40') {
      conditions.push(`substr(${column}, -40) = ?`);
      params.push(normalized.value);
      return;
    }
    conditions.push(`${column} = ?`);
    params.push(normalized.value);
  };

  if (filters.chainId !== undefined) {
    conditions.push(`chainId = ?`);
    params.push(filters.chainId);
  }

  if (filters.agentId) {
    conditions.push(`agentId = ?`);
    params.push(filters.agentId);
  }

  if (filters.agentIdentityOwnerAccount) {
    addAccountEq('agentIdentityOwnerAccount', filters.agentIdentityOwnerAccount);
  }

  if (filters.eoaAgentIdentityOwnerAccount) {
    addAccountEq('eoaAgentIdentityOwnerAccount', filters.eoaAgentIdentityOwnerAccount);
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
  const validColumns = [
    'agentId',
    'agentName',
    'createdAtTime',
    'createdAtBlock',
    'agentIdentityOwnerAccount',
    'eoaAgentIdentityOwnerAccount',
    'agentCategory',
    'trustLedgerScore',
    'trustLedgerBadgeCount',
    'trustLedgerOverallRank',
    'trustLedgerCapabilityRank',
  ];
  
  // Default to agentId ASC if not specified
  const column = orderBy && validColumns.includes(orderBy) ? orderBy : 'agentId';
  const direction = (orderDirection?.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
  
  // Cast numeric columns to integer for proper sorting
  let orderColumn: string;
  if (column === 'agentId') {
    orderColumn = 'CAST(agentId AS INTEGER)';
  } else if (column === 'trustLedgerScore' || column === 'trustLedgerBadgeCount' || column === 'trustLedgerOverallRank' || column === 'trustLedgerCapabilityRank') {
    // Use COALESCE to handle NULL values (treat as 0)
    orderColumn = `COALESCE(${column}, 0)`;
  } else {
    orderColumn = column;
  }
  
  return `ORDER BY ${orderColumn} ${direction}`;
}

function buildOasfOrderByClause(args: {
  orderBy?: string;
  orderDirection?: string;
  fieldToColumn: Record<string, string>;
  validColumns: string[];
  defaultColumn: string;
}): string {
  const dir = args.orderDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const mapped = args.orderBy ? args.fieldToColumn[args.orderBy] : undefined;
  const column = mapped && args.validColumns.includes(mapped) ? mapped : args.defaultColumn;
  return `ORDER BY ${column} ${dir}`;
}

/**
 * Build WHERE clause using The Graph-style where input
 */
function buildGraphWhereClause(where?: {
  chainId?: number;
  chainId_in?: number[];
  agentId?: string;
  agentId_in?: string[];
  agentIdentityOwnerAccount?: string;
  agentIdentityOwnerAccount_in?: string[];
  eoaAgentIdentityOwnerAccount?: string;
  eoaAgentIdentityOwnerAccount_in?: string[];
  agentAccount?: string;
  agentAccount_in?: string[];
  eoaAgentAccount?: string;
  eoaAgentAccount_in?: string[];
  agentCategory?: string;
  agentCategory_in?: string[];
  agentCategory_contains?: string;
  agentCategory_contains_nocase?: string;
  agentName_contains?: string;
  agentName_contains_nocase?: string;
  agentName_starts_with?: string;
  agentName_starts_with_nocase?: string;
  agentName_ends_with?: string;
  agentName_ends_with_nocase?: string;
  description_contains?: string;
  description_contains_nocase?: string;
  // Removed: agentAccountEndpoint_* filters
  did?: string;
  did_contains?: string;
  did_contains_nocase?: string;
  createdAtTime_gt?: number;
  createdAtTime_gte?: number;
  createdAtTime_lt?: number;
  createdAtTime_lte?: number;
  hasA2aEndpoint?: boolean;
  mcp?: boolean;
  x402support?: boolean;
  active?: boolean;
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
  atiOverallScore_gt?: number;
  atiOverallScore_gte?: number;
  atiOverallScore_lt?: number;
  atiOverallScore_lte?: number;
  trustLedgerScore_gt?: number;
  trustLedgerScore_gte?: number;
  trustLedgerScore_lt?: number;
  trustLedgerScore_lte?: number;
  trustLedgerBadgeCount_gt?: number;
  trustLedgerBadgeCount_gte?: number;
  trustLedgerBadgeCount_lt?: number;
  trustLedgerBadgeCount_lte?: number;

  trustLedgerOverallRank_gt?: number;
  trustLedgerOverallRank_gte?: number;
  trustLedgerOverallRank_lt?: number;
  trustLedgerOverallRank_lte?: number;

  trustLedgerCapabilityRank_gt?: number;
  trustLedgerCapabilityRank_gte?: number;
  trustLedgerCapabilityRank_lt?: number;
  trustLedgerCapabilityRank_lte?: number;
}): { where: string; params: any[] } {
  if (!where) return { where: '', params: [] };
  const conditions: string[] = [];
  const params: any[] = [];

  const addAccountEq = (column: string, value: any) => {
    const normalized = normalizeAccountFilterValue(value);
    if (!normalized) return;
    if (normalized.kind === 'addr40') {
      conditions.push(`substr(${column}, -40) = ?`);
      params.push(normalized.value);
      return;
    }
    conditions.push(`${column} = ?`);
    params.push(normalized.value);
  };

  const addAccountIn = (column: string, values: any[]) => {
    if (!Array.isArray(values) || values.length === 0) return;

    const exact: string[] = [];
    const addr40: string[] = [];
    for (const v of values) {
      const normalized = normalizeAccountFilterValue(v);
      if (!normalized) continue;
      if (normalized.kind === 'addr40') addr40.push(normalized.value);
      else exact.push(normalized.value);
    }

    if (exact.length > 0 && addr40.length > 0) {
      const exactPlaceholders = exact.map(() => '?').join(',');
      const addrPlaceholders = addr40.map(() => '?').join(',');
      conditions.push(`(${column} IN (${exactPlaceholders}) OR substr(${column}, -40) IN (${addrPlaceholders}))`);
      params.push(...exact, ...addr40);
      return;
    }

    if (exact.length > 0) {
      conditions.push(`${column} IN (${exact.map(() => '?').join(',')})`);
      params.push(...exact);
      return;
    }

    if (addr40.length > 0) {
      conditions.push(`substr(${column}, -40) IN (${addr40.map(() => '?').join(',')})`);
      params.push(...addr40);
    }
  };

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
  if (where.agentIdentityOwnerAccount) {
    addAccountEq('agentIdentityOwnerAccount', where.agentIdentityOwnerAccount);
  }
  if (Array.isArray(where.agentIdentityOwnerAccount_in) && where.agentIdentityOwnerAccount_in.length > 0) {
    addAccountIn('agentIdentityOwnerAccount', where.agentIdentityOwnerAccount_in);
  }
  if (where.eoaAgentIdentityOwnerAccount) {
    addAccountEq('eoaAgentIdentityOwnerAccount', where.eoaAgentIdentityOwnerAccount);
  }
  if (Array.isArray(where.eoaAgentIdentityOwnerAccount_in) && where.eoaAgentIdentityOwnerAccount_in.length > 0) {
    addAccountIn('eoaAgentIdentityOwnerAccount', where.eoaAgentIdentityOwnerAccount_in);
  }
  if (where.agentAccount) {
    addAccountEq('agentAccount', where.agentAccount);
  }
  if (Array.isArray(where.agentAccount_in) && where.agentAccount_in.length > 0) {
    addAccountIn('agentAccount', where.agentAccount_in);
  }
  if (where.eoaAgentAccount) {
    addAccountEq('eoaAgentAccount', where.eoaAgentAccount);
  }
  if (Array.isArray(where.eoaAgentAccount_in) && where.eoaAgentAccount_in.length > 0) {
    addAccountIn('eoaAgentAccount', where.eoaAgentAccount_in);
  }

  if (where.agentCategory) {
    conditions.push(`agentCategory = ?`);
    params.push(where.agentCategory);
  }
  if (Array.isArray(where.agentCategory_in) && where.agentCategory_in.length > 0) {
    conditions.push(`agentCategory IN (${where.agentCategory_in.map(() => '?').join(',')})`);
    params.push(...where.agentCategory_in);
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

  // Text filters - agentCategory
  if (where.agentCategory_contains) {
    conditions.push(`agentCategory LIKE ?`);
    params.push(`%${where.agentCategory_contains}%`);
  }
  if (where.agentCategory_contains_nocase) {
    conditions.push(`LOWER(agentCategory) LIKE LOWER(?)`);
    params.push(`%${where.agentCategory_contains_nocase}%`);
  }

  // Endpoints and DID
  // Removed: ensEndpoint (column removed from agents schema)
  // Removed: agentAccountEndpoint (confusing/overloaded)
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

  addAggregateComparison(ATI_OVERALL_SCORE_EXPR, '>', where.atiOverallScore_gt);
  addAggregateComparison(ATI_OVERALL_SCORE_EXPR, '>=', where.atiOverallScore_gte);
  addAggregateComparison(ATI_OVERALL_SCORE_EXPR, '<', where.atiOverallScore_lt);
  addAggregateComparison(ATI_OVERALL_SCORE_EXPR, '<=', where.atiOverallScore_lte);

  addAggregateComparison(TRUST_LEDGER_SCORE_EXPR, '>', where.trustLedgerScore_gt);
  addAggregateComparison(TRUST_LEDGER_SCORE_EXPR, '>=', where.trustLedgerScore_gte);
  addAggregateComparison(TRUST_LEDGER_SCORE_EXPR, '<', where.trustLedgerScore_lt);
  addAggregateComparison(TRUST_LEDGER_SCORE_EXPR, '<=', where.trustLedgerScore_lte);

  addAggregateComparison(TRUST_LEDGER_BADGE_COUNT_EXPR, '>', where.trustLedgerBadgeCount_gt);
  addAggregateComparison(TRUST_LEDGER_BADGE_COUNT_EXPR, '>=', where.trustLedgerBadgeCount_gte);
  addAggregateComparison(TRUST_LEDGER_BADGE_COUNT_EXPR, '<', where.trustLedgerBadgeCount_lt);
  addAggregateComparison(TRUST_LEDGER_BADGE_COUNT_EXPR, '<=', where.trustLedgerBadgeCount_lte);

  addAggregateComparison(TRUST_LEDGER_OVERALL_RANK_EXPR, '>', where.trustLedgerOverallRank_gt);
  addAggregateComparison(TRUST_LEDGER_OVERALL_RANK_EXPR, '>=', where.trustLedgerOverallRank_gte);
  addAggregateComparison(TRUST_LEDGER_OVERALL_RANK_EXPR, '<', where.trustLedgerOverallRank_lt);
  addAggregateComparison(TRUST_LEDGER_OVERALL_RANK_EXPR, '<=', where.trustLedgerOverallRank_lte);

  addAggregateComparison(TRUST_LEDGER_CAPABILITY_RANK_EXPR, '>', where.trustLedgerCapabilityRank_gt);
  addAggregateComparison(TRUST_LEDGER_CAPABILITY_RANK_EXPR, '>=', where.trustLedgerCapabilityRank_gte);
  addAggregateComparison(TRUST_LEDGER_CAPABILITY_RANK_EXPR, '<', where.trustLedgerCapabilityRank_lt);
  addAggregateComparison(TRUST_LEDGER_CAPABILITY_RANK_EXPR, '<=', where.trustLedgerCapabilityRank_lte);

  // Presence checks
  if (where.hasA2aEndpoint === true) {
    conditions.push(`a2aEndpoint IS NOT NULL AND a2aEndpoint != ''`);
  } else if (where.hasA2aEndpoint === false) {
    conditions.push(`(a2aEndpoint IS NULL OR a2aEndpoint = '')`);
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

function buildAgentMetadataWhereClause(filters?: {
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
    conditions.push('key = ?');
    params.push(filters.key);
  }

  if (Array.isArray(filters.key_in) && filters.key_in.length > 0) {
    conditions.push(`key IN (${filters.key_in.map(() => '?').join(',')})`);
    params.push(...filters.key_in);
  }

  if (filters.key_contains) {
    conditions.push('key LIKE ?');
    params.push(`%${filters.key_contains}%`);
  }

  if (filters.key_contains_nocase) {
    conditions.push('LOWER(key) LIKE LOWER(?)');
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

function buildAgentMetadataOrderByClause(orderBy?: string | null, orderDirection?: string | null): string {
  const validColumns = ['agentId', 'key', 'updatedAtTime'];
  const column = orderBy && validColumns.includes(orderBy) ? orderBy : 'agentId';
  const direction = (orderDirection?.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
  const mappedColumn = column === 'key' ? 'key' : column;
  const orderColumn = mappedColumn === 'agentId' ? 'CAST(agentId AS INTEGER)' : mappedColumn;
  return `ORDER BY ${orderColumn} ${direction}`;
}

function formatAgentMetadataRow(row: any): any {
  if (!row) return row;
  const updatedAt = row.updatedAtTime !== undefined && row.updatedAtTime !== null ? Number(row.updatedAtTime) : null;
  return {
    chainId: Number(row.chainId ?? 0),
    agentId: String(row.agentId ?? ''),
    id: String(row.id ?? ''),
    key: row.key ?? '',
    value: row.valueHex ?? row.value ?? null,
    valueText: row.valueText ?? null,
    indexedKey: row.indexedKey ?? null,
    updatedAtTime: updatedAt,
  };
}

async function attachAgentMetadataToAgents(db: any, agents: any[]): Promise<void> {
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
        SELECT chainId, id, agentId, key, valueHex, valueText, indexedKey, updatedAtTime
        FROM agent_metadata
        WHERE chainId = ? AND agentId IN (${placeholders})
        ORDER BY key ASC
      `;
      const rows = await executeQuery(db, sql, [chainId, ...chunk]);
      for (const row of rows) {
        const formatted = formatAgentMetadataRow(row);
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
    await attachAgentMetadataToAgents(db, agentRows);
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

const INITIATED_ASSOCIATION_COUNT_EXPR = `
(SELECT COUNT(*)
 FROM associations assoc
 WHERE assoc.chainId = agents.chainId
   AND substr(assoc.initiatorAccountId, -40) = substr(LOWER(agents.agentAccount), -40)
   AND (assoc.revokedAt IS NULL OR assoc.revokedAt = 0))`;

const APPROVED_ASSOCIATION_COUNT_EXPR = `
(SELECT COUNT(*)
 FROM associations assoc
 WHERE assoc.chainId = agents.chainId
   AND substr(assoc.approverAccountId, -40) = substr(LOWER(agents.agentAccount), -40)
   AND (assoc.revokedAt IS NULL OR assoc.revokedAt = 0))`;

const ATI_OVERALL_SCORE_EXPR = `
(SELECT ati.overallScore
 FROM agent_trust_index ati
 WHERE ati.chainId = agents.chainId AND ati.agentId = agents.agentId)`;

const ATI_OVERALL_CONFIDENCE_EXPR = `
(SELECT ati.overallConfidence
 FROM agent_trust_index ati
 WHERE ati.chainId = agents.chainId AND ati.agentId = agents.agentId)`;

const ATI_VERSION_EXPR = `
(SELECT ati.version
 FROM agent_trust_index ati
 WHERE ati.chainId = agents.chainId AND ati.agentId = agents.agentId)`;

const ATI_COMPUTED_AT_EXPR = `
(SELECT ati.computedAt
 FROM agent_trust_index ati
 WHERE ati.chainId = agents.chainId AND ati.agentId = agents.agentId)`;

const ATI_BUNDLE_JSON_EXPR = `
(SELECT ati.bundleJson
 FROM agent_trust_index ati
 WHERE ati.chainId = agents.chainId AND ati.agentId = agents.agentId)`;

const TRUST_LEDGER_SCORE_EXPR = `
(SELECT tls.totalPoints
 FROM trust_ledger_scores tls
 WHERE tls.chainId = agents.chainId AND tls.agentId = agents.agentId)`;

const TRUST_LEDGER_BADGE_COUNT_EXPR = `
(SELECT tls.badgeCount
 FROM trust_ledger_scores tls
 WHERE tls.chainId = agents.chainId AND tls.agentId = agents.agentId)`;

const TRUST_LEDGER_OVERALL_RANK_EXPR = `
(SELECT tlr.overallRank
 FROM trust_ledger_rankings tlr
 WHERE tlr.chainId = agents.chainId AND tlr.agentId = agents.agentId AND tlr.capability IS NULL)`;

const TRUST_LEDGER_CAPABILITY_RANK_EXPR = `
(SELECT tlr.capabilityRank
 FROM trust_ledger_rankings tlr
 WHERE tlr.chainId = agents.chainId AND tlr.agentId = agents.agentId AND tlr.capability = agents.agentCategory)`;

const AGENT_SUMMARY_COLUMNS = `
  ${FEEDBACK_COUNT_EXPR} AS feedbackCount,
  ${FEEDBACK_AVG_SCORE_EXPR} AS feedbackAverageScore,
  ${VALIDATION_PENDING_EXPR} AS validationPendingCount,
  ${VALIDATION_COMPLETED_EXPR} AS validationCompletedCount,
  ${VALIDATION_REQUESTED_EXPR} AS validationRequestedCount,
  ${INITIATED_ASSOCIATION_COUNT_EXPR} AS initiatedAssociationCount,
  ${APPROVED_ASSOCIATION_COUNT_EXPR} AS approvedAssociationCount,
  ${ATI_OVERALL_SCORE_EXPR} AS atiOverallScore,
  ${ATI_OVERALL_CONFIDENCE_EXPR} AS atiOverallConfidence,
  ${ATI_VERSION_EXPR} AS atiVersion,
  ${ATI_COMPUTED_AT_EXPR} AS atiComputedAt,
  ${ATI_BUNDLE_JSON_EXPR} AS atiBundleJson,
  ${TRUST_LEDGER_SCORE_EXPR} AS trustLedgerScore,
  ${TRUST_LEDGER_BADGE_COUNT_EXPR} AS trustLedgerBadgeCount,
  ${TRUST_LEDGER_OVERALL_RANK_EXPR} AS trustLedgerOverallRank,
  ${TRUST_LEDGER_CAPABILITY_RANK_EXPR} AS trustLedgerCapabilityRank
`;

const AGENT_BASE_COLUMNS = `
  agents.*,
  ${AGENT_SUMMARY_COLUMNS}
`;

const AGENT_METADATA_COLUMNS = `
  chainId,
  id,
  agentId,
  key,
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

async function fetchAgentTrustComponents(db: any, chainId: number, agentId: string): Promise<any[]> {
  const rows = await executeQuery(
    db,
    `
      SELECT component, score, weight, evidenceCountsJson
      FROM agent_trust_components
      WHERE chainId = ? AND agentId = ?
      ORDER BY component ASC
    `,
    [chainId, agentId],
  );
  return rows.map((row) => ({
    component: String((row as any)?.component ?? ''),
    score: Number((row as any)?.score ?? 0),
    weight: Number((row as any)?.weight ?? 0),
    evidenceCountsJson: (row as any)?.evidenceCountsJson != null ? String((row as any).evidenceCountsJson) : null,
  }));
}

// Removed: legacy D1 trust-ledger badge definitions. Badge definitions now live in the KB (GraphDB).

/**
 * Create GraphQL resolvers
 * @param db - Database instance (can be D1 adapter or native D1)
 * @param options - Additional options (like env for indexAgent)
 */
export function createGraphQLResolvers(db: any, options?: GraphQLResolverOptions) {
  const CORE_INTENT_BASE = 'https://agentictrust.io/ontology/core/intent/';
  const CORE_TASK_BASE = 'https://agentictrust.io/ontology/core/task/';
  const OASF_SKILL_BASE = 'https://agentictrust.io/ontology/oasf#skill/';
  const OASF_DOMAIN_BASE = 'https://agentictrust.io/ontology/oasf#domain/';
  const GRAPHDB_ONTOLOGY_CONTEXT = 'https://www.agentictrust.io/graph/ontology/core';

  const decodeKey = (value: string): string => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  const keyFromIri = (iri: string, base: string): string | null => {
    if (!iri.startsWith(base)) return null;
    return decodeKey(iri.slice(base.length));
  };

  const skillKeyFromIri = (iri: string): string | null => keyFromIri(iri, OASF_SKILL_BASE);
  const domainKeyFromIri = (iri: string): string | null => keyFromIri(iri, OASF_DOMAIN_BASE);
  const intentKeyFromIri = (iri: string): string | null => keyFromIri(iri, CORE_INTENT_BASE);
  const taskKeyFromIri = (iri: string): string | null => keyFromIri(iri, CORE_TASK_BASE);

  async function runGraphdbQuery(sparql: string): Promise<any[]> {
    const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
    const result = await queryGraphdb(baseUrl, repository, auth, sparql);
    return Array.isArray(result?.results?.bindings) ? result.results.bindings : [];
  }

  return {
    oasfSkills: async (args: {
      key?: string;
      nameKey?: string;
      category?: string;
      extendsKey?: string;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: string;
    }) => {
      const { key, nameKey, category, extendsKey } = args || {};
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const order = args?.orderDirection === 'desc' ? 'DESC' : 'ASC';
      const orderBy = args?.orderBy === 'caption' ? '?caption' : args?.orderBy === 'uid' ? '?uid' : '?key';
      const orderExpr = order === 'DESC' ? `DESC(${orderBy})` : `ASC(${orderBy})`;

      const filters: string[] = [];
      if (key) filters.push(`?key = "${key}"`);
      if (nameKey) filters.push(`?name = "${nameKey}"`);
      if (category) filters.push(`?category = "${category}"`);
      if (extendsKey) filters.push(`?extendsKey = "${extendsKey}"`);

      const sparql = [
        'PREFIX oasf: <https://agentictrust.io/ontology/oasf#>',
        'SELECT ?skill ?key ?name ?uid ?caption ?extends ?category ?extendsKey WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?skill a oasf:Skill .',
        '    OPTIONAL { ?skill oasf:key ?key }',
        '    OPTIONAL { ?skill oasf:name ?name }',
        '    OPTIONAL { ?skill oasf:uid ?uid }',
        '    OPTIONAL { ?skill oasf:caption ?caption }',
        '    OPTIONAL { ?skill oasf:extends ?extends }',
        '    OPTIONAL { ?skill oasf:category ?category }',
        '  }',
        `  BIND(IF(BOUND(?extends), REPLACE(STR(?extends), "${OASF_SKILL_BASE}", ""), "") AS ?extendsKey)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        `ORDER BY ${orderExpr}`,
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQuery(sparql);
      return rows.map((row: any) => ({
        key: row.key?.value ?? '',
        nameKey: row.name?.value ?? null,
        uid: row.uid?.value != null ? Number(row.uid.value) : null,
        caption: row.caption?.value ?? null,
        extendsKey: row.extendsKey?.value ? decodeKey(row.extendsKey.value) : null,
        category: row.category?.value ?? null,
      }));
    },

    oasfDomains: async (args: {
      key?: string;
      nameKey?: string;
      category?: string;
      extendsKey?: string;
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: string;
    }) => {
      const { key, nameKey, category, extendsKey } = args || {};
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const order = args?.orderDirection === 'desc' ? 'DESC' : 'ASC';
      const orderBy = args?.orderBy === 'caption' ? '?caption' : args?.orderBy === 'uid' ? '?uid' : '?key';
      const orderExpr = order === 'DESC' ? `DESC(${orderBy})` : `ASC(${orderBy})`;

      const filters: string[] = [];
      if (key) filters.push(`?key = "${key}"`);
      if (nameKey) filters.push(`?name = "${nameKey}"`);
      if (category) filters.push(`?category = "${category}"`);
      if (extendsKey) filters.push(`?extendsKey = "${extendsKey}"`);

      const sparql = [
        'PREFIX oasf: <https://agentictrust.io/ontology/oasf#>',
        'SELECT ?domain ?key ?name ?uid ?caption ?extends ?category ?extendsKey WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?domain a oasf:Domain .',
        '    OPTIONAL { ?domain oasf:key ?key }',
        '    OPTIONAL { ?domain oasf:name ?name }',
        '    OPTIONAL { ?domain oasf:uid ?uid }',
        '    OPTIONAL { ?domain oasf:caption ?caption }',
        '    OPTIONAL { ?domain oasf:extends ?extends }',
        '    OPTIONAL { ?domain oasf:category ?category }',
        '  }',
        `  BIND(IF(BOUND(?extends), REPLACE(STR(?extends), "${OASF_DOMAIN_BASE}", ""), "") AS ?extendsKey)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        `ORDER BY ${orderExpr}`,
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQuery(sparql);
      return rows.map((row: any) => ({
        key: row.key?.value ?? '',
        nameKey: row.name?.value ?? null,
        uid: row.uid?.value != null ? Number(row.uid.value) : null,
        caption: row.caption?.value ?? null,
        extendsKey: row.extendsKey?.value ? decodeKey(row.extendsKey.value) : null,
        category: row.category?.value ?? null,
      }));
    },

    intentTypes: async (args: { key?: string; label?: string; limit?: number; offset?: number }) => {
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const filters: string[] = [];
      if (args?.label) filters.push(`?label = "${args.label}"`);
      if (args?.key) filters.push(`?key = "${args.key}"`);

      const sparql = [
        'PREFIX core: <https://agentictrust.io/ontology/core#>',
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
        'SELECT ?intent ?label ?description ?key WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?intent a core:IntentType .',
        '    OPTIONAL { ?intent rdfs:label ?label }',
        '    OPTIONAL { ?intent rdfs:comment ?description }',
        '  }',
        `  BIND(REPLACE(STR(?intent), "${CORE_INTENT_BASE}", "") AS ?key)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        'ORDER BY ?key',
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQuery(sparql);
      return rows.map((row: any) => ({
        key: decodeKey(row.key?.value ?? ''),
        label: row.label?.value ?? null,
        description: row.description?.value ?? null,
      }));
    },

    taskTypes: async (args: { key?: string; label?: string; limit?: number; offset?: number }) => {
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const filters: string[] = [];
      if (args?.label) filters.push(`?label = "${args.label}"`);
      if (args?.key) filters.push(`?key = "${args.key}"`);

      const sparql = [
        'PREFIX core: <https://agentictrust.io/ontology/core#>',
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
        'SELECT ?task ?label ?description ?key WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?task a core:TaskType .',
        '    OPTIONAL { ?task rdfs:label ?label }',
        '    OPTIONAL { ?task rdfs:comment ?description }',
        '  }',
        `  BIND(REPLACE(STR(?task), "${CORE_TASK_BASE}", "") AS ?key)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        'ORDER BY ?key',
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQuery(sparql);
      return rows.map((row: any) => ({
        key: decodeKey(row.key?.value ?? ''),
        label: row.label?.value ?? null,
        description: row.description?.value ?? null,
      }));
    },

    intentTaskMappings: async (args: { intentKey?: string; taskKey?: string; limit?: number; offset?: number }) => {
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const filters: string[] = [];
      if (args?.intentKey) filters.push(`?intentKey = "${args.intentKey}"`);
      if (args?.taskKey) filters.push(`?taskKey = "${args.taskKey}"`);

      const sparql = [
        'PREFIX core: <https://agentictrust.io/ontology/core#>',
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
        'SELECT ?mapping ?intent ?task ?intentKey ?taskKey ?intentLabel ?taskLabel ?intentDesc ?taskDesc ?req ?opt WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?mapping a core:IntentTaskMapping ;',
        '      core:mapsIntentType ?intent ;',
        '      core:mapsTaskType ?task .',
        '    OPTIONAL { ?mapping core:requiresSkill ?req }',
        '    OPTIONAL { ?mapping core:mayUseSkill ?opt }',
        '    OPTIONAL { ?intent rdfs:label ?intentLabel }',
        '    OPTIONAL { ?intent rdfs:comment ?intentDesc }',
        '    OPTIONAL { ?task rdfs:label ?taskLabel }',
        '    OPTIONAL { ?task rdfs:comment ?taskDesc }',
        '  }',
        `  BIND(REPLACE(STR(?intent), "${CORE_INTENT_BASE}", "") AS ?intentKey)`,
        `  BIND(REPLACE(STR(?task), "${CORE_TASK_BASE}", "") AS ?taskKey)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        'ORDER BY ?intentKey ?taskKey',
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQuery(sparql);
      const map = new Map<string, any>();
      for (const row of rows) {
        const intentKey = decodeKey(row.intentKey?.value ?? '');
        const taskKey = decodeKey(row.taskKey?.value ?? '');
        const mapKey = `${intentKey}::${taskKey}`;
        if (!map.has(mapKey)) {
          map.set(mapKey, {
            intent: {
              key: intentKey,
              label: row.intentLabel?.value ?? null,
              description: row.intentDesc?.value ?? null,
            },
            task: {
              key: taskKey,
              label: row.taskLabel?.value ?? null,
              description: row.taskDesc?.value ?? null,
            },
            requiredSkills: new Set<string>(),
            optionalSkills: new Set<string>(),
          });
        }
        const entry = map.get(mapKey);
        if (row.req?.value) {
          const key = skillKeyFromIri(String(row.req.value));
          if (key) entry.requiredSkills.add(key);
        }
        if (row.opt?.value) {
          const key = skillKeyFromIri(String(row.opt.value));
          if (key) entry.optionalSkills.add(key);
        }
      }
      return Array.from(map.values()).map((entry) => ({
        intent: entry.intent,
        task: entry.task,
        requiredSkills: Array.from(entry.requiredSkills),
        optionalSkills: Array.from(entry.optionalSkills),
      }));
    },

    agents: async (args: {
      chainId?: number;
      agentId?: string;
      agentIdentityOwnerAccount?: string;
      eoaAgentIdentityOwnerAccount?: string;
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
        
        const { chainId, agentId, agentIdentityOwnerAccount, eoaAgentIdentityOwnerAccount, agentName, limit = 100, offset = 0, orderBy, orderDirection } = args;
        const { where, params } = buildWhereClause({ chainId, agentId, agentIdentityOwnerAccount, eoaAgentIdentityOwnerAccount, agentName });
        const orderByClause = buildOrderByClause(execOrderBy, execOrderDirection);
        const query = `SELECT ${AGENT_BASE_COLUMNS} FROM agents ${where} ${orderByClause} LIMIT ? OFFSET ?`;
        const allParams = [...params, limit, offset];
        const results = await executeQuery(db, query, allParams);
        await attachAgentMetadataToAgents(db, results);
        console.log('[agents] rows:', results.length, 'params:', { chainId, agentId, agentIdentityOwnerAccount, eoaAgentIdentityOwnerAccount, agentName, limit, offset, execOrderBy, execOrderDirection });
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
        await attachAgentMetadataToAgents(db, agentsRaw);
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
          await attachAgentMetadataToAgents(db, [result]);
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
          await attachAgentMetadataToAgents(db, [result]);
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
        await attachAgentMetadataToAgents(db, results);
        console.log('[agentsByChain] rows:', results.length, 'chainId:', chainId, 'limit:', limit, 'offset:', offset);
        return enrichAgentRecords(results);
      } catch (error) {
        console.error('❌ Error in agentsByChain resolver:', error);
        throw error;
      }
    },

    agentsByOwner: async (args: { agentIdentityOwnerAccount: string; chainId?: number; limit?: number; offset?: number; orderBy?: string; orderDirection?: string }) => {
      try {
        const { agentIdentityOwnerAccount, chainId, limit = 100, offset = 0, orderBy, orderDirection } = args;
        let query = `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE agentIdentityOwnerAccount = ?`;
        const params: any[] = [agentIdentityOwnerAccount];
        
        if (chainId !== undefined) {
          query += ' AND chainId = ?';
          params.push(chainId);
        }
        
        const orderByClause = buildOrderByClause(orderBy, orderDirection);
        query += ` ${orderByClause} LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        
        const results = await executeQuery(db, query, params);
        await attachAgentMetadataToAgents(db, results);
        console.log('[agentsByOwner] rows:', results.length, 'agentIdentityOwnerAccount:', agentIdentityOwnerAccount, 'chainId:', chainId, 'limit:', limit, 'offset:', offset);
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
          WHERE (agentName LIKE ? OR description LIKE ? OR agentId LIKE ? OR agentAccount LIKE ?)
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
        await attachAgentMetadataToAgents(db, results);
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
      agentIdentityOwnerAccount?: string;
      eoaAgentIdentityOwnerAccount?: string;
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
        text?: string | null;
        intentJson?: string | null;
        topK?: number;
        minScore?: number;
        requiredSkills?: string[] | null;
        filters?: any;
      };
    }) => {
      const semanticSearch = options?.semanticSearchService ?? null;
      if (!semanticSearch) {
        console.warn('[semanticAgentSearch] Semantic search not configured');
        return { matches: [], total: 0, intentType: null };
      }

      const input = args?.input;
      const text = typeof input?.text === 'string' ? input.text.trim() : '';
      const intentJson = typeof input?.intentJson === 'string' ? input.intentJson.trim() : '';
      const parsedIntent = intentJson ? parseIntentJson(intentJson) : {};
      const intentType = parsedIntent.intentType;
      const intentQuery = parsedIntent.query;
      const intentDefaults = await resolveIntentRequirements(intentType);
      const intentText = buildIntentQueryText({
        intentType,
        intentQuery,
        label: intentDefaults.label,
        description: intentDefaults.description,
      });
      const intentFallbackText = intentJson ? intentJsonToSearchText(intentJson) : '';
      const combined = [text, intentText || intentFallbackText]
        .filter((s) => typeof s === 'string' && s.trim().length > 0)
        .join('\n\n');

      const normalizeSkillId = (raw: string): string | null => {
        const trimmed = raw.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith('oasf:')) {
          const withoutPrefix = trimmed.slice('oasf:'.length);
          return normalizeSkillId(withoutPrefix);
        }
        if (trimmed.startsWith('trust/')) {
          const tail = trimmed.slice('trust/'.length);
          if (tail.startsWith('trust_validate_')) {
            const suffix = tail.slice('trust_validate_'.length);
            return `governance_and_trust/trust/trust_validate_${suffix}`;
          }
          return trimmed;
        }
        if (trimmed.startsWith('trust_validate_')) {
          const suffix = trimmed.slice('trust_validate_'.length);
          return `governance_and_trust/trust/trust_validate_${suffix}`;
        }
        if (trimmed.startsWith('trust.validate.')) {
          const suffix = trimmed.slice('trust.validate.'.length);
          return `governance_and_trust/trust/trust_validate_${suffix}`;
        }
        if (trimmed === 'trust.feedback.authorization') {
          return 'governance_and_trust/trust/trust_feedback_authorization';
        }
        return trimmed;
      };

      const normalizeSkillList = (list: string[]) =>
        Array.from(
          new Set(
            list
              .map((s) => normalizeSkillId(s))
              .filter((s): s is string => typeof s === 'string' && s.trim().length > 0),
          ),
        );

      const requiredSkillsInput = Array.isArray(input?.requiredSkills)
        ? normalizeSkillList(input.requiredSkills.filter((s) => typeof s === 'string'))
        : [];

      const requiredSkills = normalizeSkillList([
        ...(requiredSkillsInput.length ? requiredSkillsInput : intentDefaults.requiredSkills),
      ]);


      if (!input || !combined.trim()) {
        return { matches: [], total: 0, intentType: intentType ?? null };
      }

      try {
        // Force semantic search to only consider vectors that were embedded with an A2A agent card.
        const enforcedFilters: Record<string, unknown> = { ...(input.filters ?? {}), hasAgentCard: true };
        const skillFilters: Array<Record<string, unknown>> = [];
        if (requiredSkills.length) {
          skillFilters.push({ a2aSkills: { $in: requiredSkills } });
        }
        // OASF skills are normalized into executable skillIds.
        if (skillFilters.length) {
          enforcedFilters.$or = skillFilters;
        }
        const matches = await semanticSearch.search({
          text: combined,
          topK: input.topK,
          minScore: input.minScore,
          filters: enforcedFilters,
        });

        if (!matches.length) {
          return { matches: [], total: 0, intentType: intentType ?? null };
        }

        const normalizeStringArray = (value: unknown): string[] =>
          Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
        const intersection = (a: string[], b: string[]) => a.filter((x) => b.includes(x));

        const withSkillMatches = matches.map((match) => {
          const metadata = (match.metadata ?? {}) as Record<string, unknown>;
          const a2aSkills = normalizeStringArray(metadata.a2aSkills);
          const matchedSkills = requiredSkills.length ? intersection(requiredSkills, a2aSkills) : [];
          return {
            match,
            matchedSkills,
            keep:
              !requiredSkills.length
                ? true
                : matchedSkills.length > 0,
          };
        });

        const filteredMatches = withSkillMatches.filter((entry) => entry.keep);
        if (!filteredMatches.length) {
          return { matches: [], total: 0, intentType: intentType ?? null };
        }

        const hydrated = await hydrateSemanticMatches(db, filteredMatches.map((entry) => entry.match));
        const merged = hydrated.map((entry, index) => ({
          ...entry,
          matchedSkills: filteredMatches[index]?.matchedSkills ?? [],
        }));
        try {
          console.info('[semanticAgentSearch] returned agents', {
            intentType: intentType ?? null,
            intentJson: intentJson || null,
            parsedIntent: parsedIntent || null,
            queryText: combined,
            requiredSkills,
            total: merged.length,
            agents: merged.map((entry, idx) => ({
              idx,
              agentId: entry.agent?.agentId ?? null,
              chainId: entry.agent?.chainId ?? null,
              name: entry.agent?.agentName ?? null,
              score: entry.score,
              matchedSkills: entry.matchedSkills ?? [],
              matchedSkillsList: (entry.matchedSkills ?? []).join(', '),
              a2aSkills: Array.isArray((filteredMatches[idx]?.match.metadata as any)?.a2aSkills)
                ? (filteredMatches[idx]?.match.metadata as any).a2aSkills
                : [],
              a2aSkillsList: Array.isArray((filteredMatches[idx]?.match.metadata as any)?.a2aSkills)
                ? ((filteredMatches[idx]?.match.metadata as any).a2aSkills as string[]).join(', ')
                : '',
            })),
          });
        } catch {
          // logging only
        }
        return { matches: merged, total: merged.length, intentType: intentType ?? null };
      } catch (error) {
        console.error('❌ Error in semanticAgentSearch resolver:', error);
        throw error;
      }
    },

    agentMetadata: async (args: {
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
        const { where: whereSql, params } = buildAgentMetadataWhereClause(where);
        const orderClause = buildAgentMetadataOrderByClause(orderBy || undefined, orderDirection || undefined);
        const rows = await executeQuery(
          db,
          `SELECT ${AGENT_METADATA_COLUMNS} FROM agent_metadata ${whereSql} ${orderClause} LIMIT ? OFFSET ?`,
          [...params, pageSize, offset]
        );
        const formatted = rows.map(formatAgentMetadataRow);
        const countRow = await executeQuerySingle(db, `SELECT COUNT(*) as count FROM agent_metadata ${whereSql}`, params);
        const total = (countRow as any)?.count || 0;
        const hasMore = (offset + pageSize) < total;
        return { entries: formatted, total, hasMore };
      } catch (error) {
        console.error('❌ Error in agentMetadata resolver:', error);
        throw error;
      }
    },

    agentMetadataById: async (args: { chainId: number; id: string }) => {
      try {
        const { chainId, id } = args;
        const row = await executeQuerySingle(
          db,
          `SELECT ${AGENT_METADATA_COLUMNS} FROM agent_metadata WHERE chainId = ? AND id = ?`,
          [chainId, id]
        );
        return row ? formatAgentMetadataRow(row) : null;
      } catch (error) {
        console.error('❌ Error in agentMetadataById resolver:', error);
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

    fetchAgentCard: async (args: { url: string; authHeader?: string }) => {
      // Server-side fetch bypasses browser CORS restrictions
      try {
        const targetUrl = String(args.url ?? '').trim();
        if (!targetUrl) throw new Error('url is required');

        const headers: Record<string, string> = {
          Accept: 'application/json, text/plain, */*',
          // Some upstreams treat unknown UAs differently; keep this, but we'll retry on 401.
          'User-Agent': 'agent-explorer/1.0',
        };

        // Add authentication header if provided
        if (args.authHeader) {
          const authHeader = String(args.authHeader).trim();
          if (authHeader) {
            // Support multiple authentication formats:
            // 1. "Basic base64string" - already formatted Basic auth
            // 2. "Bearer token" - Bearer token format
            // 3. Plain API key - send as Basic auth (apiKey as username, empty password)
            if (authHeader.startsWith('Basic ') || authHeader.startsWith('basic ')) {
              headers.Authorization = authHeader;
            } else if (authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer ')) {
              headers.Authorization = authHeader;
            } else {
              const basicAuth = Buffer.from(`${authHeader}:`).toString('base64');
              headers.Authorization = `Basic ${basicAuth}`;
            }
          }
        }

        const doFetch = async (h: Record<string, string>) => {
          const resp = await fetch(targetUrl, { method: 'GET', headers: h });
          return resp;
        };

        let response = await doFetch(headers);

        // Some providers serve 401 to certain request profiles; retry with a browser-like UA
        // to reduce false negatives (still without any auth).
        if (response.status === 401 && !headers.Authorization) {
          const retryHeaders: Record<string, string> = {
            ...headers,
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          };
          response = await doFetch(retryHeaders);
        }

        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          const wwwAuth = response.headers.get('www-authenticate') || '';
          if (response.status === 401) {
            throw new Error(
              `HTTP 401: Unauthorized. ${wwwAuth ? `WWW-Authenticate: ${wwwAuth}. ` : ''}` +
                `${errorText ? `Server message: ${errorText}` : 'The server requires authentication.'}`,
            );
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
        }

        const agentCard = await response.json();
        return JSON.stringify(agentCard);
      } catch (error: any) {
        throw new Error(`Failed to fetch agent card: ${error.message}`);
      }
    },

    callA2A: async (args: { url: string; method: string; paramsJson?: string | null; authHeader?: string | null }) => {
      // Server-side A2A call bypasses browser CORS restrictions
      try {
        const targetUrl = String(args.url ?? '').trim().replace(/\/+$/, '');
        if (!targetUrl) throw new Error('url is required');
        const method = String(args.method ?? '').trim();
        if (!method) throw new Error('method is required');

        let params: any = {};
        if (args.paramsJson != null && String(args.paramsJson).trim()) {
          try {
            params = JSON.parse(String(args.paramsJson));
          } catch (e: any) {
            throw new Error(`paramsJson must be valid JSON: ${e?.message || String(e)}`);
          }
        }

        const headers: Record<string, string> = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'agent-explorer/1.0',
        };

        // Auth handling mirrors fetchAgentCard
        if (args.authHeader) {
          const authHeader = String(args.authHeader).trim();
          if (authHeader) {
            if (authHeader.startsWith('Basic ') || authHeader.startsWith('basic ')) {
              headers.Authorization = authHeader;
            } else if (authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer ')) {
              headers.Authorization = authHeader;
            } else {
              const basicAuth = Buffer.from(`${authHeader}:`).toString('base64');
              headers.Authorization = `Basic ${basicAuth}`;
            }
          }
        }

        const payload = {
          jsonrpc: '2.0',
          id: Date.now().toString(),
          method,
          params,
        };

        const response = await fetch(targetUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        const text = await response.text().catch(() => '');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
        }

        // Return raw JSON-RPC response (or whatever the server returns)
        return text;
      } catch (error: any) {
        throw new Error(`Failed to call A2A: ${error.message}`);
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

    associations: async (args: {
      where?: any;
      first?: number | null;
      skip?: number | null;
      orderBy?: string | null;
      orderDirection?: string | null;
    }) => {
      const { where, first, skip, orderBy, orderDirection } = args || {};
      const pageSize = typeof first === 'number' && Number.isFinite(first) && first > 0 ? first : 50;
      const offset = typeof skip === 'number' && Number.isFinite(skip) && skip >= 0 ? skip : 0;

      const conditions: string[] = [];
      const params: any[] = [];

      const addEq = (col: string, val: any) => {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          conditions.push(`${col} = ?`);
          params.push(String(val).toLowerCase());
        }
      };
      const addIn = (col: string, values?: any[]) => {
        if (Array.isArray(values) && values.length > 0) {
          conditions.push(`${col} IN (${values.map(() => '?').join(',')})`);
          params.push(...values.map((v) => String(v).toLowerCase()));
        }
      };

      if (where?.chainId !== undefined && where?.chainId !== null) {
        conditions.push(`chainId = ?`);
        params.push(where.chainId);
      }
      if (Array.isArray(where?.chainId_in) && where.chainId_in.length > 0) {
        conditions.push(`chainId IN (${where.chainId_in.map(() => '?').join(',')})`);
        params.push(...where.chainId_in);
      }
      addEq('associationId', where?.associationId);
      addIn('associationId', where?.associationId_in);
      addEq('interfaceId', where?.interfaceId);
      addIn('interfaceId', where?.interfaceId_in);
      addEq('initiatorAccountId', where?.initiatorAccountId);
      addEq('approverAccountId', where?.approverAccountId);
      addIn('initiatorAccountId', where?.initiatorAccountId_in);
      addIn('approverAccountId', where?.approverAccountId_in);
      if (where?.revoked === true) conditions.push(`revokedAt IS NOT NULL`);
      if (where?.revoked === false) conditions.push(`(revokedAt IS NULL OR revokedAt = 0)`);

      const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
      const orderCol = (typeof orderBy === 'string' && ['lastUpdatedBlockNumber', 'createdBlockNumber', 'createdTimestamp', 'lastUpdatedTimestamp'].includes(orderBy))
        ? orderBy
        : 'lastUpdatedBlockNumber';
      const dir = (String(orderDirection || '').toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
      const sql = `
        SELECT *
        FROM associations
        ${whereSql}
        ORDER BY CAST(${orderCol} AS INTEGER) ${dir}
        LIMIT ? OFFSET ?
      `;

      const rows = await executeQuery(db, sql, [...params, pageSize, offset]);
      return await hydrateAssociations(db, rows);
    },

    agentAssociations: async (args: {
      chainId: number;
      agentId: string;
      role?: 'INITIATOR' | 'APPROVER' | 'ANY' | null;
      interfaceId?: string | null;
      first?: number | null;
      skip?: number | null;
    }) => {
      const chainId = Number(args.chainId);
      const agentId = String(args.agentId);
      const role = (args.role ?? 'ANY') as any;
      const interfaceId = args.interfaceId ? String(args.interfaceId).toLowerCase() : null;
      const pageSize = typeof args.first === 'number' && Number.isFinite(args.first) && args.first > 0 ? args.first : 50;
      const offset = typeof args.skip === 'number' && Number.isFinite(args.skip) && args.skip >= 0 ? args.skip : 0;

      const agentRow = await executeQuerySingle(db, `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE chainId = ? AND agentId = ?`, [chainId, agentId]);
      const agentAccount = normalizeHexLike((agentRow as any)?.agentAccount);
      if (!agentAccount || !isAddressHex(agentAccount)) {
        return [];
      }

      const conditions: string[] = ['chainId = ?'];
      const params: any[] = [chainId];
      if (interfaceId) {
        conditions.push('interfaceId = ?');
        params.push(interfaceId);
      }
      if (role === 'INITIATOR') {
        conditions.push('substr(initiatorAccountId, -40) = substr(?, -40)');
        params.push(agentAccount);
      } else if (role === 'APPROVER') {
        conditions.push('substr(approverAccountId, -40) = substr(?, -40)');
        params.push(agentAccount);
      } else {
        conditions.push('(substr(initiatorAccountId, -40) = substr(?, -40) OR substr(approverAccountId, -40) = substr(?, -40))');
        params.push(agentAccount, agentAccount);
      }

      const sql = `
        SELECT *
        FROM associations
        WHERE ${conditions.join(' AND ')}
        ORDER BY CAST(lastUpdatedBlockNumber AS INTEGER) DESC
        LIMIT ? OFFSET ?
      `;
      const rows = await executeQuery(db, sql, [...params, pageSize, offset]);
      return await hydrateAssociations(db, rows);
    },

    graphqlEndpointAssociations: async (args: {
      chainId: number;
      agentId: string;
      role?: 'INITIATOR' | 'APPROVER' | 'ANY' | null;
      first?: number | null;
      skip?: number | null;
    }) => {
      // Fixed interfaceId for "GraphQL endpoint association"
      return await (createGraphQLResolvers(db, options) as any).agentAssociations({
        chainId: args.chainId,
        agentId: args.agentId,
        role: args.role ?? 'ANY',
        interfaceId: '0x00000000',
        first: args.first,
        skip: args.skip,
      });
    },

    graphqlEndpointAssociationsBetween: async (args: {
      chainId: number;
      agentIdA: string;
      agentIdB: string;
      first?: number | null;
      skip?: number | null;
    }) => {
      const chainId = Number(args.chainId);
      const pageSize = typeof args.first === 'number' && Number.isFinite(args.first) && args.first > 0 ? args.first : 50;
      const offset = typeof args.skip === 'number' && Number.isFinite(args.skip) && args.skip >= 0 ? args.skip : 0;

      const getAccountForAgent = async (agentId: string) => {
        const row = await executeQuerySingle(db, `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE chainId = ? AND agentId = ?`, [chainId, String(agentId)]);
        const acct = normalizeHexLike((row as any)?.agentAccount);
        return acct && isAddressHex(acct) ? acct : null;
      };

      const acctA = await getAccountForAgent(args.agentIdA);
      const acctB = await getAccountForAgent(args.agentIdB);
      if (!acctA || !acctB) return [];

      const sql = `
        SELECT *
        FROM associations
        WHERE chainId = ?
          AND interfaceId = ?
          AND (
            (initiatorAccountId = ? AND approverAccountId = ?)
            OR
            (initiatorAccountId = ? AND approverAccountId = ?)
          )
        ORDER BY CAST(lastUpdatedBlockNumber AS INTEGER) DESC
        LIMIT ? OFFSET ?
      `;
      const rows = await executeQuery(db, sql, [chainId, '0x00000000', acctA, acctB, acctB, acctA, pageSize, offset]);
      return await hydrateAssociations(db, rows);
    },

    trustScore: async (args: {
      chainId: number;
      agentId: string;
      client: string;
      interfaceId?: string | null;
    }) => {
      const chainId = Number(args.chainId);
      const agentId = String(args.agentId);
      const client = normalizeHexLike(args.client);
      const interfaceId = normalizeInterfaceId(args.interfaceId);

      const reasons: Array<{ code: string; weight?: number | null; detail?: string | null }> = [];

      if (!client || !isAddressHex(client)) {
        return {
          interfaceId,
          score: 0,
          reputationScore: 0,
          overlapScore: 0,
          clientMembershipCount: 0,
          agentMembershipCount: 0,
          sharedMembershipCount: 0,
          sharedMembershipKeys: [],
          reasons: [{ code: 'INVALID_CLIENT', weight: 1, detail: 'client must be a 0x-prefixed address' }],
        };
      }

      // Load agent (includes feedback/validation aggregates via AGENT_BASE_COLUMNS)
      const agentRow = await executeQuerySingle(
        db,
        `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE chainId = ? AND agentId = ?`,
        [chainId, agentId],
      );
      if (!agentRow) {
        return {
          interfaceId,
          score: 0,
          reputationScore: 0,
          overlapScore: 0,
          clientMembershipCount: 0,
          agentMembershipCount: 0,
          sharedMembershipCount: 0,
          sharedMembershipKeys: [],
          reasons: [{ code: 'AGENT_NOT_FOUND', weight: 1, detail: 'No agent row found' }],
        };
      }

      const agentAccount = normalizeHexLike((agentRow as any)?.agentAccount);
      if (!agentAccount || !isAddressHex(agentAccount)) {
        reasons.push({ code: 'AGENT_ACCOUNT_NOT_ADDRESS', weight: 1, detail: 'Agent account is not an address-like association id; overlap will be 0' });
      }

      // Reputation component (simple + explainable; you can swap later)
      // feedbackAverageScore appears as Float; score scale unknown; assume 0..5 if present.
      const avg = Number((agentRow as any)?.feedbackAverageScore);
      const validationCompleted = Number((agentRow as any)?.validationCompletedCount);
      const feedbackComponent = Number.isFinite(avg) ? clamp01(avg / 5) : 0;
      const validationComponent = Number.isFinite(validationCompleted) ? clamp01(Math.min(10, Math.max(0, validationCompleted)) / 10) : 0;
      const reputationScore = clamp01(0.6 * feedbackComponent + 0.4 * validationComponent);
      reasons.push({ code: 'REPUTATION', weight: reputationScore, detail: `feedback=${feedbackComponent.toFixed(3)}, validation=${validationComponent.toFixed(3)}` });

      // Graph overlap component using associations.data as "membership key"
      const now = Math.floor(Date.now() / 1000);
      const baseWhere = `
        chainId = ?
        AND interfaceId = ?
        AND (revokedAt IS NULL OR revokedAt = 0)
        AND validAt <= ?
        AND (validUntil = 0 OR validUntil >= ?)
      `;

      const fetchMembershipKeys = async (accountId: string): Promise<Set<string>> => {
        const rows = await executeQuery(
          db,
          `
            SELECT data
            FROM associations
            WHERE ${baseWhere}
              AND (substr(initiatorAccountId, -40) = substr(?, -40) OR substr(approverAccountId, -40) = substr(?, -40))
          `,
          [chainId, interfaceId, now, now, accountId, accountId],
        );
        const out = new Set<string>();
        for (const row of rows) {
          const key = normalizeHexLike((row as any)?.data);
          if (key) out.add(key);
        }
        return out;
      };

      const clientKeys = await fetchMembershipKeys(client);
      let agentKeys = new Set<string>();
      if (agentAccount && isAddressHex(agentAccount)) {
        agentKeys = await fetchMembershipKeys(agentAccount);
      }

      const shared: string[] = [];
      for (const k of clientKeys) {
        if (agentKeys.has(k)) shared.push(k);
      }
      shared.sort();

      const unionSize = new Set<string>([...clientKeys, ...agentKeys]).size;
      const overlapScore = unionSize > 0 ? clamp01(shared.length / unionSize) : 0;
      reasons.push({ code: 'OVERLAP', weight: overlapScore, detail: `shared=${shared.length}, union=${unionSize}` });

      // Final score: simple blend (tune later)
      const score = clamp01(0.6 * reputationScore + 0.4 * overlapScore);

      return {
        interfaceId,
        score,
        reputationScore,
        overlapScore,
        clientMembershipCount: clientKeys.size,
        agentMembershipCount: agentKeys.size,
        sharedMembershipCount: shared.length,
        sharedMembershipKeys: shared,
        reasons,
      };
    },

    agentTrustComponents: async (args: { chainId: number; agentId: string }) => {
      const chainId = Number(args.chainId);
      const agentId = String(args.agentId);
      return await fetchAgentTrustComponents(db, chainId, agentId);
    },

    agentTrustIndex: async (args: { chainId: number; agentId: string }) => {
      const chainId = Number(args.chainId);
      const agentId = String(args.agentId);
      const row = await executeQuerySingle(
        db,
        `
          SELECT chainId, agentId, overallScore, overallConfidence, version, computedAt, bundleJson
          FROM agent_trust_index
          WHERE chainId = ? AND agentId = ?
          LIMIT 1
        `,
        [chainId, agentId],
      );
      if (!row) return null;
      const components = await fetchAgentTrustComponents(db, chainId, agentId);
      return {
        chainId: Number((row as any)?.chainId ?? chainId),
        agentId: String((row as any)?.agentId ?? agentId),
        overallScore: Number((row as any)?.overallScore ?? 0),
        overallConfidence:
          (row as any)?.overallConfidence === null || (row as any)?.overallConfidence === undefined
            ? null
            : Number((row as any).overallConfidence),
        version: String((row as any)?.version ?? ''),
        computedAt: Number((row as any)?.computedAt ?? 0),
        bundleJson: (row as any)?.bundleJson != null ? String((row as any).bundleJson) : null,
        components,
      };
    },

    // Removed: legacy D1 trust-ledger badge definitions/mutations. Badge definitions now live in the KB (GraphDB).
  };
}

async function hydrateAssociations(db: any, rows: any[]): Promise<any[]> {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  // Collect address-like account ids to map back to agents.
  const accountIds = new Set<string>();
  for (const row of rows) {
    const i = normalizeHexLike(row?.initiatorAccountId);
    const a = normalizeHexLike(row?.approverAccountId);
    if (isAddressHex(i)) accountIds.add(i!);
    if (isAddressHex(a)) accountIds.add(a!);
  }

  const agentByAccount = new Map<string, any>();
  if (accountIds.size > 0) {
    const accounts = Array.from(accountIds);
    const suffixes = accounts
      .map((acct) => normalizeHexLike(acct))
      .filter((acct): acct is string => Boolean(acct))
      .map((acct) => acct.slice(-40));
    // D1 has a max bind limit; keep it safe.
    const chunkSize = 50;
    for (let i = 0; i < suffixes.length; i += chunkSize) {
      const chunk = suffixes.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => '?').join(',');
      const sql = `SELECT ${AGENT_BASE_COLUMNS} FROM agents WHERE substr(LOWER(agentAccount), -40) IN (${placeholders})`;
      const agentRows = await executeQuery(db, sql, chunk);
      await attachAgentMetadataToAgents(db, agentRows);
      for (const arow of agentRows) {
        const acctId = normalizeHexLike(arow?.agentAccount);
        const acctAddr = acctId && acctId.includes(':') ? acctId.split(':').pop() : acctId;
        if (acctId) agentByAccount.set(acctId, enrichAgentRecord(arow));
        if (acctAddr) agentByAccount.set(acctAddr, enrichAgentRecord(arow));
      }
    }
  }

  return rows.map((row) => {
    const initiatorAccountId = normalizeHexLike(row?.initiatorAccountId) ?? '';
    const approverAccountId = normalizeHexLike(row?.approverAccountId) ?? '';
    const initiatorAgent = agentByAccount.get(initiatorAccountId) ?? null;
    const approverAgent = agentByAccount.get(approverAccountId) ?? null;

    return {
      chainId: Number(row?.chainId ?? 0),
      associationId: String(row?.associationId ?? row?.id ?? ''),
      initiatorAccount: { id: initiatorAccountId },
      approverAccount: { id: approverAccountId },
      initiator: String(row?.initiator ?? ''),
      approver: String(row?.approver ?? ''),
      validAt: Number(row?.validAt ?? 0),
      validUntil: Number(row?.validUntil ?? 0),
      interfaceId: String(row?.interfaceId ?? ''),
      data: String(row?.data ?? ''),
      initiatorKeyType: String(row?.initiatorKeyType ?? ''),
      approverKeyType: String(row?.approverKeyType ?? ''),
      initiatorSignature: String(row?.initiatorSignature ?? ''),
      approverSignature: String(row?.approverSignature ?? ''),
      revokedAt: row?.revokedAt === null || row?.revokedAt === undefined ? null : Number(row.revokedAt),
      createdTxHash: String(row?.createdTxHash ?? ''),
      createdBlockNumber: Number(row?.createdBlockNumber ?? 0),
      createdTimestamp: Number(row?.createdTimestamp ?? 0),
      lastUpdatedTxHash: String(row?.lastUpdatedTxHash ?? ''),
      lastUpdatedBlockNumber: Number(row?.lastUpdatedBlockNumber ?? 0),
      lastUpdatedTimestamp: Number(row?.lastUpdatedTimestamp ?? 0),
      initiatorAgent,
      approverAgent,
    };
  });
}

/**
 * Compute DID values for an agent record
 */
function computeDIDValues(agent: any): { didIdentity: string; didAccount: string; didName: string | null } {
  const chainId = agent.chainId;
  const agentId = agent.agentId;
  const agentAccount = agent.agentAccount;
  const agentName = agent.agentName;

  const didIdentity = `did:8004:${chainId}:${agentId}`;
  const didAccount = agentAccount ? `did:ethr:${chainId}:${agentAccount}` : '';
  const didName = agentName && agentName.endsWith('.eth') ? `did:ens:${chainId}:${agentName}` : null;

  return { didIdentity, didAccount, didName };
}

/**
 * Enrich agent records with computed DID values
 */
function enrichAgentRecord(agent: any): any {
  if (!agent) return agent;

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
  if (Object.prototype.hasOwnProperty.call(agent, 'initiatedAssociationCount')) {
    agent.initiatedAssociationCount = normalizeInt(agent.initiatedAssociationCount);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'approvedAssociationCount')) {
    agent.approvedAssociationCount = normalizeInt(agent.approvedAssociationCount);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'atiOverallScore')) {
    agent.atiOverallScore = normalizeInt(agent.atiOverallScore);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'atiComputedAt')) {
    agent.atiComputedAt = normalizeInt(agent.atiComputedAt);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'atiOverallConfidence')) {
    agent.atiOverallConfidence = normalizeFloat(agent.atiOverallConfidence);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'feedbackAverageScore')) {
    agent.feedbackAverageScore = normalizeFloat(agent.feedbackAverageScore);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'trustLedgerScore')) {
    agent.trustLedgerScore = normalizeInt(agent.trustLedgerScore);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'trustLedgerBadgeCount')) {
    agent.trustLedgerBadgeCount = normalizeInt(agent.trustLedgerBadgeCount);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'trustLedgerOverallRank')) {
    agent.trustLedgerOverallRank = normalizeInt(agent.trustLedgerOverallRank);
  }
  if (Object.prototype.hasOwnProperty.call(agent, 'trustLedgerCapabilityRank')) {
    agent.trustLedgerCapabilityRank = normalizeInt(agent.trustLedgerCapabilityRank);
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

