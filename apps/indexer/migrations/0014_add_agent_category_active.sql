-- Add agentCategory (from NFT metadata "Category")
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agentCategory TEXT;

-- Backfill agentCategory from token_metadata when present
-- NOTE: token_metadata.valueText is decoded UTF-8 from valueHex, and is preferred.
UPDATE agents
SET agentCategory = (
  SELECT NULLIF(TRIM(tm.valueText), '')
  FROM token_metadata tm
  WHERE tm.chainId = agents.chainId
    AND tm.agentId = agents.agentId
    AND LOWER(tm.metadataKey) = 'category'
  ORDER BY tm.updatedAtTime DESC
  LIMIT 1
)
WHERE (agents.agentCategory IS NULL OR agents.agentCategory = '')
  AND EXISTS (
    SELECT 1
    FROM token_metadata tm2
    WHERE tm2.chainId = agents.chainId
      AND tm2.agentId = agents.agentId
      AND LOWER(tm2.metadataKey) = 'category'
  );

-- Indexes for filtering/sorting
CREATE INDEX IF NOT EXISTS idx_agents_agentCategory ON agents(agentCategory);
CREATE INDEX IF NOT EXISTS idx_agents_lower_agentCategory ON agents(LOWER(agentCategory));


