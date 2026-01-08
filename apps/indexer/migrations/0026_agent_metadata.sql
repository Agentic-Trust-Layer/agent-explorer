-- Jan 2026 naming cleanup:
-- Replace token_metadata with agent_metadata (AgentMetadata from subgraph).

-- New canonical table
CREATE TABLE IF NOT EXISTS agent_metadata (
  chainId INTEGER NOT NULL,
  id TEXT NOT NULL,           -- subgraph AgentMetadata.id (agentId-key)
  agentId TEXT NOT NULL,      -- agent.id (uint256 string)
  key TEXT NOT NULL,
  valueHex TEXT,              -- bytes as 0x...
  valueText TEXT,             -- best-effort decoded UTF-8
  indexedKey TEXT,
  setAt INTEGER,
  setBy TEXT,
  txHash TEXT,
  blockNumber INTEGER,
  timestamp INTEGER,
  updatedAtTime INTEGER,
  PRIMARY KEY (chainId, id)
);

CREATE INDEX IF NOT EXISTS idx_agent_metadata_chain_agent
  ON agent_metadata(chainId, agentId);
CREATE INDEX IF NOT EXISTS idx_agent_metadata_chain_key
  ON agent_metadata(chainId, key);
CREATE INDEX IF NOT EXISTS idx_agent_metadata_chain_block
  ON agent_metadata(chainId, blockNumber);

DROP TABLE IF EXISTS token_metadata;


