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
];

