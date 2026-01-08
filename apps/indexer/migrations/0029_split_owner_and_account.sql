-- Split NFT owner vs agent execution/signing account.
-- - agentOwnerAccount: ERC-721 owner (Account.id from subgraph) (renamed later to agentIdentityOwnerAccount)
-- - agentAccount: agent's configured wallet address (Agent.agentWallet from subgraph)
-- - eoaAgentOwnerAccount: resolved EOA/controller of agentOwnerAccount (renamed later to eoaAgentIdentityOwnerAccount)
-- - eoaAgentAccount: resolved EOA/controller of agentAccount
-- - agentOwnerAccountType / agentAccountType: 'EOA' | 'SmartAccount' | NULL (renamed later to agentIdentityOwnerAccountType)

ALTER TABLE agents RENAME COLUMN agentOwner TO agentOwnerAccount;

-- Old column name was eoaOwner; keep it but rename to make semantics explicit.
ALTER TABLE agents RENAME COLUMN eoaOwner TO eoaAgentOwnerAccount;

ALTER TABLE agents ADD COLUMN IF NOT EXISTS eoaAgentAccount TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agentOwnerAccountType TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agentAccountType TEXT;
-- Removed: agentOwnerAccountEndpoint (confusing, redundant with chainId + agentOwnerAccount)

-- Backfill owner-account type when we have eoaAgentOwnerAccount
UPDATE agents
SET agentOwnerAccountType = CASE
  WHEN eoaAgentOwnerAccount IS NULL OR eoaAgentOwnerAccount = '' THEN agentOwnerAccountType
  WHEN LOWER(eoaAgentOwnerAccount) = LOWER(agentOwnerAccount) THEN 'EOA'
  ELSE 'SmartAccount'
END
WHERE agentOwnerAccount IS NOT NULL AND agentOwnerAccount != '';

-- Backfill agent-account type when we have eoaAgentAccount
UPDATE agents
SET agentAccountType = CASE
  WHEN eoaAgentAccount IS NULL OR eoaAgentAccount = '' THEN agentAccountType
  WHEN LOWER(eoaAgentAccount) = LOWER(agentAccount) THEN 'EOA'
  ELSE 'SmartAccount'
END
WHERE agentAccount IS NOT NULL AND agentAccount != '';


