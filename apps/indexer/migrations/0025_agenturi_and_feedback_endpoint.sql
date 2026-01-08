-- Jan 2026 ERC-8004 naming update:
-- - tokenURI -> agentURI (we store as agents.agentUri)
-- - reputation feedback adds optional `endpoint`

-- 1) Rename agents.tokenUri -> agents.agentUri
ALTER TABLE agents RENAME COLUMN tokenUri TO agentUri;

-- 2) Add endpoint column to rep_feedbacks (optional)
ALTER TABLE rep_feedbacks ADD COLUMN endpoint TEXT;

CREATE INDEX IF NOT EXISTS idx_rep_feedbacks_endpoint
  ON rep_feedbacks(endpoint);


