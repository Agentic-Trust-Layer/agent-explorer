-- Migration: Add agentWallet and DID fields
-- This migration:
-- 1. Adds agentWallet column
-- 2. Adds three new DID fields: didIdentity, didAccount, didName
-- Note: SQLite doesn't support DROP COLUMN, so agentAddress remains for backward compatibility

-- Step 1: Add new columns
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agentWallet TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS didIdentity TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS didAccount TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS didName TEXT;

-- Step 2: Populate agentWallet from agentAddress for existing records (best-effort)
UPDATE agents SET agentWallet = agentAddress WHERE agentWallet IS NULL AND agentAddress IS NOT NULL;

-- Step 3: Compute DID values for existing records
-- didIdentity: did:8004:chainId:agentId
UPDATE agents SET didIdentity = 'did:8004:' || chainId || ':' || agentId WHERE didIdentity IS NULL;

-- didAccount: did:ethr:chainId:agentWallet
UPDATE agents SET didAccount = 'did:ethr:' || chainId || ':' || agentWallet
WHERE didAccount IS NULL AND agentWallet IS NOT NULL;

-- didName: did:ens:chainId:agentName (only if agentName ends with .eth)
UPDATE agents SET didName = 'did:ens:' || chainId || ':' || agentName WHERE didName IS NULL AND agentName LIKE '%.eth';

-- Note: The agentAddress column remains in the database (SQLite can't DROP COLUMN)
-- The application code uses agentWallet going forward

