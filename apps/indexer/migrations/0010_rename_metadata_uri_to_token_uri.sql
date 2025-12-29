-- Ensure tokenUri column exists to align naming across the stack.
-- NOTE: Some older DBs had metadataURI; newer DBs already have tokenUri (see 0001_initial.sql).
-- D1 migrations do not support conditional column renames safely across both shapes, so we:
-- 1) Add tokenUri if missing (idempotent)
-- 2) Perform any data backfill from metadataURI -> tokenUri in application code when metadataURI exists.
ALTER TABLE agents ADD COLUMN IF NOT EXISTS tokenUri TEXT;

