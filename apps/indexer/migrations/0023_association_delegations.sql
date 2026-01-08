-- ---------------------------------------------
-- ERC-8092 Association Delegations (IPFS-backed)
-- ---------------------------------------------
--
-- Some ERC-8092 associations store delegation/authorization metadata in IPFS.
-- We persist the resolved JSON (best-effort) so RDF export can emit Delegation situations/assertions
-- without re-fetching IPFS at export time.

CREATE TABLE IF NOT EXISTS association_delegations (
  chainId INTEGER NOT NULL,
  associationId TEXT NOT NULL, -- bytes32 as 0x-prefixed hex string

  ipfsUri TEXT,
  ipfsCid TEXT,
  delegationJson TEXT,

  extractedKind TEXT,          -- e.g., 'feedbackAuth', 'validationRequest', 'unknown'
  extractedFeedbackAuth TEXT,  -- feedbackAuth token string (if present)
  extractedRequestHash TEXT,   -- validation request hash (if present)

  fetchedAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,

  PRIMARY KEY (chainId, associationId)
);

CREATE INDEX IF NOT EXISTS idx_assoc_delegations_chain ON association_delegations(chainId);
CREATE INDEX IF NOT EXISTS idx_assoc_delegations_cid ON association_delegations(ipfsCid);
CREATE INDEX IF NOT EXISTS idx_assoc_delegations_feedbackAuth ON association_delegations(extractedFeedbackAuth);
CREATE INDEX IF NOT EXISTS idx_assoc_delegations_requestHash ON association_delegations(extractedRequestHash);


