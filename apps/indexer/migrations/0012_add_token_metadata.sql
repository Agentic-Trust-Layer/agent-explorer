CREATE TABLE IF NOT EXISTS token_metadata (
  chainId INTEGER NOT NULL,
  metadataId TEXT NOT NULL,
  agentId TEXT NOT NULL,
  metadataKey TEXT NOT NULL,
  valueHex TEXT,
  valueText TEXT,
  indexedKey TEXT,
  updatedAtTime INTEGER,
  PRIMARY KEY (chainId, metadataId)
);

CREATE INDEX IF NOT EXISTS idx_token_metadata_agent
  ON token_metadata(chainId, agentId);

CREATE INDEX IF NOT EXISTS idx_token_metadata_key
  ON token_metadata(chainId, metadataKey);

