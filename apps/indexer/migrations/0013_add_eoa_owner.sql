ALTER TABLE agents ADD COLUMN IF NOT EXISTS eoaOwner TEXT;

UPDATE agents
SET eoaOwner = agentOwner
WHERE eoaOwner IS NULL OR eoaOwner = '';

CREATE INDEX IF NOT EXISTS idx_agents_eoaOwner ON agents(eoaOwner);

