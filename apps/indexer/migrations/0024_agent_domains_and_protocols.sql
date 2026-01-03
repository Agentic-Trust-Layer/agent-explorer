-- Normalize domains and protocols from registration JSON for efficient filtering/search

CREATE TABLE IF NOT EXISTS agent_domains (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  domain TEXT NOT NULL,
  PRIMARY KEY (chainId, agentId, domain)
);

CREATE INDEX IF NOT EXISTS idx_agent_domains_domain ON agent_domains(domain);

CREATE TABLE IF NOT EXISTS agent_protocols (
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  protocol TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (chainId, agentId, protocol, version)
);

CREATE INDEX IF NOT EXISTS idx_agent_protocols_protocol ON agent_protocols(protocol);
CREATE INDEX IF NOT EXISTS idx_agent_protocols_version ON agent_protocols(version);


