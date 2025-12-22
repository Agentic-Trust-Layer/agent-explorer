-- Trust Ledger Rankings
-- Creates ranking tables for overall and per-capability rankings

CREATE TABLE IF NOT EXISTS trust_ledger_rankings (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  overallRank INTEGER,
  capability TEXT,
  capabilityRank INTEGER,
  updatedAt INTEGER NOT NULL,
  PRIMARY KEY (chainId, agentId, capability)
);

CREATE INDEX IF NOT EXISTS idx_trust_ledger_rankings_overall ON trust_ledger_rankings(chainId, overallRank);
CREATE INDEX IF NOT EXISTS idx_trust_ledger_rankings_capability ON trust_ledger_rankings(chainId, capability, capabilityRank);
CREATE INDEX IF NOT EXISTS idx_trust_ledger_rankings_agent ON trust_ledger_rankings(chainId, agentId);

