-- Add decoded ABI string column for ERC-8092 association delegation payloads.
-- Many associations encode a UTF-8 string via ABI encoding inside `associations.data`.

ALTER TABLE association_delegations ADD COLUMN decodedDataText TEXT;

CREATE INDEX IF NOT EXISTS idx_assoc_delegations_decodedText ON association_delegations(decodedDataText);


