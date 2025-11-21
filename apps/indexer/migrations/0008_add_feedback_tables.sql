CREATE TABLE IF NOT EXISTS rep_feedbacks (
  id TEXT PRIMARY KEY,
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  clientAddress TEXT NOT NULL,
  feedbackIndex INTEGER NOT NULL,
  score INTEGER,
  tag1 TEXT,
  tag2 TEXT,
  feedbackUri TEXT,
  feedbackJson TEXT,
  feedbackType TEXT,
  domain TEXT,
  comment TEXT,
  ratingPct INTEGER,
  feedbackTimestamp TEXT,
  feedbackHash TEXT,
  txHash TEXT,
  blockNumber INTEGER,
  timestamp INTEGER,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  isRevoked INTEGER DEFAULT 0,
  revokedTxHash TEXT,
  revokedBlockNumber INTEGER,
  revokedTimestamp INTEGER,
  responseCount INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rep_feedbacks_agent_client_index
  ON rep_feedbacks(chainId, agentId, clientAddress, feedbackIndex);

CREATE INDEX IF NOT EXISTS idx_rep_feedbacks_chain_agent
  ON rep_feedbacks(chainId, agentId);

CREATE INDEX IF NOT EXISTS idx_rep_feedbacks_chain_client
  ON rep_feedbacks(chainId, clientAddress);

CREATE INDEX IF NOT EXISTS idx_rep_feedbacks_chain_block
  ON rep_feedbacks(chainId, blockNumber);

CREATE INDEX IF NOT EXISTS idx_rep_feedbacks_chain_timestamp
  ON rep_feedbacks(chainId, timestamp);

CREATE TABLE IF NOT EXISTS rep_feedback_revoked (
  id TEXT PRIMARY KEY,
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  clientAddress TEXT NOT NULL,
  feedbackIndex INTEGER NOT NULL,
  txHash TEXT,
  blockNumber INTEGER,
  timestamp INTEGER
);

CREATE INDEX IF NOT EXISTS idx_rep_feedback_revoked_chain_agent
  ON rep_feedback_revoked(chainId, agentId, clientAddress);

CREATE INDEX IF NOT EXISTS idx_rep_feedback_revoked_feedback_index
  ON rep_feedback_revoked(chainId, feedbackIndex);

CREATE TABLE IF NOT EXISTS rep_feedback_responses (
  id TEXT PRIMARY KEY,
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  clientAddress TEXT NOT NULL,
  feedbackIndex INTEGER NOT NULL,
  responder TEXT NOT NULL,
  responseUri TEXT,
  responseJson TEXT,
  responseHash TEXT,
  txHash TEXT,
  blockNumber INTEGER,
  timestamp INTEGER
);

CREATE INDEX IF NOT EXISTS idx_rep_feedback_responses_chain_agent
  ON rep_feedback_responses(chainId, agentId, clientAddress);

CREATE INDEX IF NOT EXISTS idx_rep_feedback_responses_feedback_index
  ON rep_feedback_responses(chainId, feedbackIndex);

CREATE INDEX IF NOT EXISTS idx_rep_feedback_responses_responder
  ON rep_feedback_responses(chainId, responder);

