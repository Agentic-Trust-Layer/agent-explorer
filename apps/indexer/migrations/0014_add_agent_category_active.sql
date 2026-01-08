-- Add agentCategory (from NFT metadata "Category")
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agentCategory TEXT;

-- Backfill agentCategory from agent_metadata when present
-- NOTE: agent_metadata.valueText is decoded UTF-8 from valueHex, and is preferred.
UPDATE agents
SET agentCategory = (
  SELECT NULLIF(TRIM(tm.valueText), '')
  FROM agent_metadata tm
  WHERE tm.chainId = agents.chainId
    AND tm.agentId = agents.agentId
    AND LOWER(tm.key) = 'category'
  ORDER BY tm.updatedAtTime DESC
  LIMIT 1
)
WHERE (agents.agentCategory IS NULL OR agents.agentCategory = '')
  AND EXISTS (
    SELECT 1
    FROM agent_metadata tm2
    WHERE tm2.chainId = agents.chainId
      AND tm2.agentId = agents.agentId
      AND LOWER(tm2.key) = 'category'
  );

-- Indexes for filtering/sorting
CREATE INDEX IF NOT EXISTS idx_agents_agentCategory ON agents(agentCategory);
CREATE INDEX IF NOT EXISTS idx_agents_lower_agentCategory ON agents(LOWER(agentCategory));


