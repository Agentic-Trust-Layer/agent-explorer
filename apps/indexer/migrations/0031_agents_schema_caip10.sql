-- Rebuild `agents` table to normalize account fields as "{chainId}:{0x...}" strings.
-- NOTE: This migration is intentionally DESTRUCTIVE for `agents` (drops and recreates without copying),
-- because the codebase no longer supports legacy schemas and backfill will repopulate from the subgraph.
--
-- New canonical fields:
-- - agentAccount: "{chainId}:{agent account address}"
-- - eoaAgentAccount: "{chainId}:{eoa owner of agent account}"
-- - agentIdentityOwnerAccount: "{chainId}:{nft/identity owner account}"
-- - eoaAgentIdentityOwnerAccount: "{chainId}:{eoa owner of identity owner account}"
-- - didIdentity: "did:8004:{chainId}:{agentId}"
-- - didAccount: "did:ethr:{chainId}:{agent account address}"
-- - didName: "did:ens:{chainId}:{agentName}" when agentName ends with .eth

PRAGMA foreign_keys=off;

CREATE TABLE IF NOT EXISTS agents_new (
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

  did TEXT,
  mcp INTEGER,
  x402support INTEGER,
  active INTEGER,
  agentCategory TEXT,
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

DROP TABLE IF EXISTS agents;
ALTER TABLE agents_new RENAME TO agents;

CREATE INDEX IF NOT EXISTS idx_agents_chainId ON agents(chainId);
CREATE INDEX IF NOT EXISTS idx_agents_agentIdentityOwnerAccount ON agents(agentIdentityOwnerAccount);
CREATE INDEX IF NOT EXISTS idx_agents_createdAtTime ON agents(createdAtTime);
CREATE INDEX IF NOT EXISTS idx_agents_agentName ON agents(agentName);
CREATE INDEX IF NOT EXISTS idx_agents_agentAccount ON agents(agentAccount);

PRAGMA foreign_keys=on;


