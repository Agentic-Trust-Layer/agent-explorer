-- ----------------------------
-- ERC-8092 Associations Store
-- ----------------------------

CREATE TABLE IF NOT EXISTS association_accounts (
  id TEXT PRIMARY KEY -- bytes as 0x-prefixed hex string
);

CREATE TABLE IF NOT EXISTS associations (
  chainId INTEGER NOT NULL,
  associationId TEXT NOT NULL, -- bytes32 as 0x-prefixed hex string

  initiatorAccountId TEXT NOT NULL,
  approverAccountId TEXT NOT NULL,

  initiator TEXT NOT NULL, -- bytes
  approver TEXT NOT NULL,  -- bytes
  validAt INTEGER NOT NULL,
  validUntil INTEGER NOT NULL,
  interfaceId TEXT NOT NULL, -- bytes4
  data TEXT NOT NULL, -- bytes

  initiatorKeyType TEXT NOT NULL,
  approverKeyType TEXT NOT NULL,
  initiatorSignature TEXT NOT NULL,
  approverSignature TEXT NOT NULL,

  revokedAt INTEGER,

  createdTxHash TEXT NOT NULL,
  createdBlockNumber INTEGER NOT NULL,
  createdTimestamp INTEGER NOT NULL,
  lastUpdatedTxHash TEXT NOT NULL,
  lastUpdatedBlockNumber INTEGER NOT NULL,
  lastUpdatedTimestamp INTEGER NOT NULL,

  PRIMARY KEY (chainId, associationId)
);

CREATE INDEX IF NOT EXISTS idx_associations_chainId ON associations(chainId);
CREATE INDEX IF NOT EXISTS idx_associations_interfaceId ON associations(interfaceId);
CREATE INDEX IF NOT EXISTS idx_associations_initiator ON associations(initiator);
CREATE INDEX IF NOT EXISTS idx_associations_approver ON associations(approver);
CREATE INDEX IF NOT EXISTS idx_associations_initiatorAccountId ON associations(initiatorAccountId);
CREATE INDEX IF NOT EXISTS idx_associations_approverAccountId ON associations(approverAccountId);
CREATE INDEX IF NOT EXISTS idx_associations_lastUpdatedBlockNumber ON associations(lastUpdatedBlockNumber);

CREATE TABLE IF NOT EXISTS association_revocations (
  chainId INTEGER NOT NULL,
  id TEXT NOT NULL, -- txHash-logIndex
  associationId TEXT NOT NULL,
  revokedAt INTEGER NOT NULL,
  txHash TEXT NOT NULL,
  blockNumber INTEGER NOT NULL,
  timestamp INTEGER NOT NULL,
  PRIMARY KEY (chainId, id)
);

CREATE INDEX IF NOT EXISTS idx_association_revocations_chainId ON association_revocations(chainId);
CREATE INDEX IF NOT EXISTS idx_association_revocations_associationId ON association_revocations(associationId);
CREATE INDEX IF NOT EXISTS idx_association_revocations_blockNumber ON association_revocations(blockNumber);


