-- Rename NFT-owner columns to make identity semantics explicit.
-- agentOwnerAccount -> agentIdentityOwnerAccount
-- eoaAgentOwnerAccount -> eoaAgentIdentityOwnerAccount
-- agentOwnerAccountType -> agentIdentityOwnerAccountType
-- Removed: *OwnerAccountEndpoint

ALTER TABLE agents RENAME COLUMN agentOwnerAccount TO agentIdentityOwnerAccount;
ALTER TABLE agents RENAME COLUMN eoaAgentOwnerAccount TO eoaAgentIdentityOwnerAccount;
ALTER TABLE agents RENAME COLUMN agentOwnerAccountType TO agentIdentityOwnerAccountType;


