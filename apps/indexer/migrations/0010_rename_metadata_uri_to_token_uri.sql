-- Rename metadataURI column to tokenUri to align naming across the stack
ALTER TABLE agents RENAME COLUMN metadataURI TO tokenUri;

