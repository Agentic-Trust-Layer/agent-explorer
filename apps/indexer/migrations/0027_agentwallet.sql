-- Jan 2026 naming cleanup:
-- Rename agents.agentAccount -> agents.agentWallet (reserved on-chain metadata key).
-- Note: this assumes the older column existed; new deployments will already have agentWallet via earlier migrations.

ALTER TABLE agents RENAME COLUMN agentAccount TO agentWallet;

-- Recompute didAccount from agentWallet when present.
UPDATE agents
SET didAccount = 'did:ethr:' || chainId || ':' || agentWallet
WHERE agentWallet IS NOT NULL
  AND agentWallet != ''
  AND (didAccount IS NULL OR didAccount = '');


