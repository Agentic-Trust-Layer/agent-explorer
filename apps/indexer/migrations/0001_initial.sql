CREATE TABLE IF NOT EXISTS agents (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  agentAccount TEXT NOT NULL,
  eoaAgentAccount TEXT,
  agentIdentityOwnerAccount TEXT NOT NULL,
  eoaAgentIdentityOwnerAccount TEXT,
  agentName TEXT NOT NULL,
  agentUri TEXT,
  createdAtBlock INTEGER NOT NULL,
  createdAtTime INTEGER NOT NULL,
  didIdentity TEXT NOT NULL,
  didAccount TEXT,
  didName TEXT,
  -- current indexed/enriched fields (kept in baseline schema; not optional)
  agentCategory TEXT,
  did TEXT,
  mcp INTEGER,
  x402support INTEGER,
  active INTEGER,
  agentCardJson TEXT,
  agentCardReadAt INTEGER,
  type TEXT,
  description TEXT,
  image TEXT,
  a2aEndpoint TEXT,
  supportedTrust TEXT,
  rawJson TEXT,
  updatedAtTime INTEGER,
  PRIMARY KEY (chainId, agentId)
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  agentId TEXT NOT NULL,
  type TEXT NOT NULL,
  blockNumber INTEGER NOT NULL,
  logIndex INTEGER NOT NULL,
  txHash TEXT NOT NULL,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkpoints (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agents_chainId ON agents(chainId);
CREATE INDEX IF NOT EXISTS idx_agents_agentAccount ON agents(agentAccount);
CREATE INDEX IF NOT EXISTS idx_agents_agentIdentityOwnerAccount ON agents(agentIdentityOwnerAccount);
CREATE INDEX IF NOT EXISTS idx_agents_createdAtTime ON agents(createdAtTime);
CREATE INDEX IF NOT EXISTS idx_agents_agentName ON agents(agentName);

