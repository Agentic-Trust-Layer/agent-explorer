-- Jan 2026 rule:
-- - Subgraph uses Agent.agentWallet
-- - DB + GraphQL + RDF use agents.agentAccount (canonical "Smart Account")

-- Rename agents.agentWallet -> agents.agentAccount
ALTER TABLE agents RENAME COLUMN agentWallet TO agentAccount;

-- Recompute didAccount from agentAccount when present.
UPDATE agents
SET didAccount = 'did:ethr:' || chainId || ':' || agentAccount
WHERE agentAccount IS NOT NULL
  AND agentAccount != ''
  AND (didAccount IS NULL OR didAccount = '');


