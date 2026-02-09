export type TrustLedgerBadgeDefinition = {
  badgeId: string;
  program: string;
  name: string;
  description?: string;
  iconRef?: string;
  points: number;
  ruleId: string;
  ruleConfig?: Record<string, unknown>;
  active: boolean;
};

// Program namespace for Trust Ledger.
export const TRUST_LEDGER_PROGRAM = 'trust-ledger';

// Source of truth: seeded into GraphDB analytics/system by `sync:trust-ledger`.
export const DEFAULT_TRUST_LEDGER_BADGES: TrustLedgerBadgeDefinition[] = [
  {
    badgeId: 'validation:first_response',
    program: TRUST_LEDGER_PROGRAM,
    name: 'First Validation',
    description: 'Agent received its first validation response.',
    iconRef: 'badge:validation:first',
    points: 10,
    ruleId: 'validation_count_gte',
    ruleConfig: { threshold: 1 },
    active: true,
  },
  {
    badgeId: 'association:first_approved',
    program: TRUST_LEDGER_PROGRAM,
    name: 'First Association',
    description: 'Agent has at least one approved association.',
    iconRef: 'badge:association:first',
    points: 10,
    ruleId: 'association_approved_count_gte',
    ruleConfig: { threshold: 1 },
    active: true,
  },
  {
    badgeId: 'feedback:first',
    program: TRUST_LEDGER_PROGRAM,
    name: 'First Review',
    description: 'Agent received its first feedback entry.',
    iconRef: 'badge:feedback:first',
    points: 10,
    ruleId: 'feedback_count_gte',
    ruleConfig: { threshold: 1 },
    active: true,
  },
  {
    badgeId: 'feedback:five_high',
    program: TRUST_LEDGER_PROGRAM,
    name: 'Five Great Reviews',
    description: 'At least 5 feedback entries with ratingPct >= 90.',
    iconRef: 'badge:feedback:five_high',
    points: 25,
    ruleId: 'feedback_high_rating_count_gte',
    ruleConfig: { threshold: 5, minRatingPct: 90 },
    active: true,
  },
  {
    badgeId: 'feedback:avg_score_good',
    program: TRUST_LEDGER_PROGRAM,
    name: 'Great Average Rating',
    description: 'At least 5 reviews with average feedback score >= 4.5.',
    iconRef: 'badge:feedback:avg_score_good',
    points: 40,
    ruleId: 'feedback_avg_score_gte',
    ruleConfig: { minReviews: 5, threshold: 4.5 },
    active: true,
  },
  {
    badgeId: 'a2a:skills_declared',
    program: TRUST_LEDGER_PROGRAM,
    name: 'A2A Skills Declared',
    description: 'Agent declares at least one A2A skill in registration or agent card.',
    iconRef: 'badge:a2a:skills',
    points: 10,
    ruleId: 'a2a_skill_count_gte',
    ruleConfig: { threshold: 1 },
    active: true,
  },
  {
    badgeId: 'a2a:agent_card_json',
    program: TRUST_LEDGER_PROGRAM,
    name: 'A2A Agent Card Captured',
    description: 'Agent has an A2A agent-card.json stored in the KB.',
    iconRef: 'badge:a2a:agent_card_json',
    points: 20,
    ruleId: 'a2a_agent_card_json_present',
    ruleConfig: { threshold: 1 },
    active: true,
  },
  {
    badgeId: 'mcp:tools_declared',
    program: TRUST_LEDGER_PROGRAM,
    name: 'MCP Tools Declared',
    description: 'Agent declares at least one MCP tool in ERC-8004 registration JSON.',
    iconRef: 'badge:mcp:tools',
    points: 10,
    ruleId: 'mcp_tools_declared_count_gte',
    ruleConfig: { threshold: 1 },
    active: true,
  },
  {
    badgeId: 'mcp:prompts_declared',
    program: TRUST_LEDGER_PROGRAM,
    name: 'MCP Prompts Declared',
    description: 'Agent declares at least one MCP prompt in ERC-8004 registration JSON.',
    iconRef: 'badge:mcp:prompts',
    points: 5,
    ruleId: 'mcp_prompts_declared_count_gte',
    ruleConfig: { threshold: 1 },
    active: true,
  },
  {
    badgeId: 'mcp:active_tools_list',
    program: TRUST_LEDGER_PROGRAM,
    name: 'MCP Tools List Captured',
    description: 'Agent has a live MCP endpoint check with a captured tools list JSON.',
    iconRef: 'badge:mcp:active_tools_list',
    points: 25,
    ruleId: 'mcp_active_tools_list_present',
    ruleConfig: { threshold: 1 },
    active: true,
  },
  {
    badgeId: 'oasf:skills_domains_declared',
    program: TRUST_LEDGER_PROGRAM,
    name: 'OASF Skills + Domains Declared',
    description: 'Agent declares OASF skills and domains in ERC-8004 registration JSON.',
    iconRef: 'badge:oasf:skills_domains',
    points: 15,
    ruleId: 'registration_oasf_skills_domains_present',
    ruleConfig: { threshold: 1 },
    active: true,
  },
  {
    badgeId: 'x402:supported',
    program: TRUST_LEDGER_PROGRAM,
    name: 'x402 Supported',
    description: 'Agent declares x402 support in ERC-8004 registration JSON.',
    iconRef: 'badge:x402:supported',
    points: 15,
    ruleId: 'registration_x402_support_true',
    ruleConfig: { threshold: 1 },
    active: true,
  },
];

