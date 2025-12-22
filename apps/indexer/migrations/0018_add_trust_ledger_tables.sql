-- Trust Ledger
-- Creates trust_ledger_* tables for profiles, badge catalog, awards, ledger transactions, and cached scores.

CREATE TABLE IF NOT EXISTS trust_ledger_profiles (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  profileVersion TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  PRIMARY KEY (chainId, agentId)
);

CREATE TABLE IF NOT EXISTS trust_ledger_badge_definitions (
  badgeId TEXT PRIMARY KEY,
  program TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  iconRef TEXT,
  points INTEGER NOT NULL,
  ruleId TEXT NOT NULL,
  ruleJson TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trust_ledger_badge_definitions_program ON trust_ledger_badge_definitions(program);
CREATE INDEX IF NOT EXISTS idx_trust_ledger_badge_definitions_active ON trust_ledger_badge_definitions(active);

CREATE TABLE IF NOT EXISTS trust_ledger_badge_awards (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  badgeId TEXT NOT NULL,
  awardedAt INTEGER NOT NULL,
  evidenceEventId TEXT,
  evidenceJson TEXT,
  issuer TEXT,
  PRIMARY KEY (chainId, agentId, badgeId)
);

CREATE INDEX IF NOT EXISTS idx_trust_ledger_badge_awards_chain_agent ON trust_ledger_badge_awards(chainId, agentId);
CREATE INDEX IF NOT EXISTS idx_trust_ledger_badge_awards_badgeId ON trust_ledger_badge_awards(badgeId);

CREATE TABLE IF NOT EXISTS trust_ledger_point_transactions (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  txId TEXT NOT NULL,
  badgeId TEXT,
  deltaPoints INTEGER NOT NULL,
  reason TEXT,
  evidenceEventId TEXT,
  createdAt INTEGER NOT NULL,
  PRIMARY KEY (chainId, agentId, txId)
);

CREATE INDEX IF NOT EXISTS idx_trust_ledger_point_tx_chain_agent ON trust_ledger_point_transactions(chainId, agentId);

CREATE TABLE IF NOT EXISTS trust_ledger_scores (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  totalPoints INTEGER NOT NULL,
  badgeCount INTEGER NOT NULL,
  computedAt INTEGER NOT NULL,
  digestJson TEXT,
  PRIMARY KEY (chainId, agentId)
);

CREATE INDEX IF NOT EXISTS idx_trust_ledger_scores_totalPoints ON trust_ledger_scores(totalPoints);

-- Note: This migration no longer copies data from older tables.

