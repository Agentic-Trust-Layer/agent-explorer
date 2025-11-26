CREATE TABLE IF NOT EXISTS validation_requests (
  id TEXT PRIMARY KEY,
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  validatorAddress TEXT NOT NULL,
  requestUri TEXT,
  requestJson TEXT,
  requestHash TEXT,
  txHash TEXT,
  blockNumber INTEGER,
  timestamp INTEGER,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_validation_requests_chain_agent
  ON validation_requests(chainId, agentId);

CREATE INDEX IF NOT EXISTS idx_validation_requests_chain_validator
  ON validation_requests(chainId, validatorAddress);

CREATE INDEX IF NOT EXISTS idx_validation_requests_chain_block
  ON validation_requests(chainId, blockNumber);

CREATE TABLE IF NOT EXISTS validation_responses (
  id TEXT PRIMARY KEY,
  chainId INTEGER NOT NULL,
  agentId TEXT NOT NULL,
  validatorAddress TEXT NOT NULL,
  requestHash TEXT,
  response INTEGER,
  responseUri TEXT,
  responseJson TEXT,
  responseHash TEXT,
  tag TEXT,
  txHash TEXT,
  blockNumber INTEGER,
  timestamp INTEGER,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_validation_responses_chain_agent
  ON validation_responses(chainId, agentId);

CREATE INDEX IF NOT EXISTS idx_validation_responses_chain_validator
  ON validation_responses(chainId, validatorAddress);

CREATE INDEX IF NOT EXISTS idx_validation_responses_chain_block
  ON validation_responses(chainId, blockNumber);

CREATE INDEX IF NOT EXISTS idx_validation_responses_request_hash
  ON validation_responses(chainId, requestHash);

