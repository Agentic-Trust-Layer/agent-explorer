-- Jan 2026: reputation feedback adds optional `endpoint`
-- (standalone migration; does not assume legacy agents.tokenUri exists)

ALTER TABLE rep_feedbacks ADD COLUMN endpoint TEXT;

CREATE INDEX IF NOT EXISTS idx_rep_feedbacks_endpoint
  ON rep_feedbacks(endpoint);


