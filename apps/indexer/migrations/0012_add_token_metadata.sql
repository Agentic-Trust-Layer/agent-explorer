CREATE TABLE IF NOT EXISTS agent_metadata (
  chainId INTEGER NOT NULL,
  id TEXT NOT NULL,
  agentId TEXT NOT NULL,
  key TEXT NOT NULL,
  valueHex TEXT,
  valueText TEXT,
  indexedKey TEXT,
  updatedAtTime INTEGER,
  PRIMARY KEY (chainId, id)
);

CREATE INDEX IF NOT EXISTS idx_agent_metadata_agent
  ON agent_metadata(chainId, agentId);

CREATE INDEX IF NOT EXISTS idx_agent_metadata_key
  ON agent_metadata(chainId, key);

