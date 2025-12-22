-- Agent Trust Index (ATI)
-- Precomputed overall score + bundle JSON for fast frontend retrieval

CREATE TABLE IF NOT EXISTS agent_trust_index (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  overallScore INTEGER NOT NULL,
  overallConfidence REAL,
  version TEXT NOT NULL,
  computedAt INTEGER NOT NULL,
  bundleJson TEXT,
  PRIMARY KEY (chainId, agentId)
);

CREATE INDEX IF NOT EXISTS idx_agent_trust_index_chainId ON agent_trust_index(chainId);
CREATE INDEX IF NOT EXISTS idx_agent_trust_index_overallScore ON agent_trust_index(overallScore);
CREATE INDEX IF NOT EXISTS idx_agent_trust_index_computedAt ON agent_trust_index(computedAt);

CREATE TABLE IF NOT EXISTS agent_trust_components (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  component TEXT NOT NULL, -- reviews/validations/associations/provenance/freshness
  score REAL NOT NULL,     -- 0..100
  weight REAL NOT NULL,    -- 0..1
  evidenceCountsJson TEXT,
  PRIMARY KEY (chainId, agentId, component)
);

CREATE INDEX IF NOT EXISTS idx_agent_trust_components_chainId ON agent_trust_components(chainId);
CREATE INDEX IF NOT EXISTS idx_agent_trust_components_component ON agent_trust_components(component);


