import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN } from "./env";
import { createD1Database } from "./db-d1";

// Check if we're in Node.js environment (for local development)
const isNodeEnvironment = typeof process !== 'undefined' && 
                          typeof process.env === 'object' &&
                          typeof import.meta !== 'undefined' && 
                          import.meta.url &&
                          import.meta.url.startsWith('file:');

// In Workers, D1 is provided via env.DB binding, not via these env vars
// Only create D1 connection in Node.js (local development)
let db: any;

if (isNodeEnvironment) {
  // Always use Cloudflare D1 database (for local development)
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_D1_DATABASE_ID || !CLOUDFLARE_API_TOKEN) {
    throw new Error('D1 configuration incomplete. Please set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, and CLOUDFLARE_API_TOKEN');
  }

  console.log('📡 Using Cloudflare D1 database (local Node.js)');
  db = createD1Database({
    accountId: CLOUDFLARE_ACCOUNT_ID,
    databaseId: CLOUDFLARE_D1_DATABASE_ID,
    apiToken: CLOUDFLARE_API_TOKEN,
  });
} else {
  // In Workers, db will be provided via env.DB - this is just a placeholder
  // The actual db instance should be passed from the Worker's env parameter
  console.log('📡 D1 database will be provided via env.DB (Workers environment)');
  // Create a dummy db object to prevent import errors, but it shouldn't be used
  db = null;
}

export { db };

// Helper function to get current timestamp (Unix epoch seconds)
// D1 doesn't support strftime, so we use JavaScript Date.now()
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000); // Unix timestamp in seconds
}

export function formatSQLTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

// Initialize schema - D1 schema should be managed via migrations
// This is just a safety check for development
async function initializeSchema() {
  // D1 schema should already exist from migrations
  // Skip initialization - tables should be created via wrangler d1 execute
  console.log('📡 D1 database - assuming schema already exists from migrations');
  
  // In Workers, db will be null - skip initialization
  if (!db) {
    console.log('📡 Skipping schema initialization in Workers (db provided via env.DB)');
    return;
  }
  
  // Safety check: Try to create access_codes table if it doesn't exist (for development)
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS access_codes (
        address TEXT PRIMARY KEY,
        accessCode TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        lastUsedAt INTEGER
      );
    `);
    console.log('✅ access_codes table verified/created in D1');
  } catch (error: any) {
    // If table already exists, that's fine. Otherwise log warning.
    if (!error?.message?.includes('already exists') && !error?.message?.includes('duplicate')) {
      console.warn('⚠️  Could not create access_codes table in D1. Run migration manually:');
      console.warn('   wrangler d1 execute erc8004-indexer --file=./migrations/0002_add_access_codes.sql');
      console.warn('   Error:', error?.message || error);
    } else {
      console.log('✅ access_codes table already exists in D1');
    }
  }

  // Safety check: best-effort schema upgrades for development (migrations should do this in prod).
  // Add columns used by newer code paths if they don't exist yet.
  const tryAddColumn = async (table: string, column: string, type: string) => {
    try {
      await db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`);
      console.log(`✅ ${table}.${column} column added`);
    } catch (error: any) {
      const msg = String(error?.message || '');
      // D1/SQLite error messages vary; treat "duplicate column" / "already exists" as success.
      if (/duplicate column|already exists|duplicate/i.test(msg)) {
        console.log(`✅ ${table}.${column} column already exists`);
        return;
      }
      // Some D1 API errors wrap SQLITE_ERROR in JSON; still just warn.
      console.warn(
        `⚠️  Could not add column ${table}.${column} (run migration manually if needed). ` +
          `Expected migration: apps/indexer/migrations/0020_add_agent_card_fields.sql. ` +
          `Error: ${msg}`,
      );
    }
  };

  await tryAddColumn('agents', 'agentCardJson', 'TEXT');
  await tryAddColumn('agents', 'agentCardReadAt', 'INTEGER');

  // Jan 2026 naming only (no legacy column backfills).

  // OASF: tables/columns used by sync + RDF export (best-effort for dev; migrations should handle prod)
  // Create auxiliary tables if missing
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS oasf_domain_categories (
        key TEXT PRIMARY KEY,
        uid INTEGER,
        caption TEXT,
        description TEXT,
        schemaJson TEXT,
        githubPath TEXT,
        githubSha TEXT,
        lastFetchedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS oasf_skill_categories (
        key TEXT PRIMARY KEY,
        uid INTEGER,
        caption TEXT,
        description TEXT,
        schemaJson TEXT,
        githubPath TEXT,
        githubSha TEXT,
        lastFetchedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS oasf_dictionary_entries (
        key TEXT PRIMARY KEY,
        type TEXT,
        caption TEXT,
        description TEXT,
        referencesJson TEXT,
        schemaJson TEXT,
        githubPath TEXT,
        githubSha TEXT,
        lastFetchedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS oasf_dictionary_types (
        key TEXT PRIMARY KEY,
        schemaJson TEXT,
        githubPath TEXT,
        githubSha TEXT,
        lastFetchedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_oasf_domain_categories_uid ON oasf_domain_categories(uid);
      CREATE INDEX IF NOT EXISTS idx_oasf_skill_categories_uid ON oasf_skill_categories(uid);
    `);
  } catch (e: any) {
    console.warn('⚠️  Could not create OASF auxiliary tables (run migrations manually if needed).', String(e?.message || e));
  }

  // Add new columns to existing oasf tables (if they already exist from older migration)
  // NOTE: "category" is retained for backwards compatibility with earlier schema and for easier ad-hoc inspection.
  await tryAddColumn('oasf_domains', 'nameKey', 'TEXT');
  await tryAddColumn('oasf_domains', 'uid', 'INTEGER');
  await tryAddColumn('oasf_domains', 'caption', 'TEXT');
  await tryAddColumn('oasf_domains', 'extendsKey', 'TEXT');
  await tryAddColumn('oasf_domains', 'category', 'TEXT');

  await tryAddColumn('oasf_skills', 'nameKey', 'TEXT');
  await tryAddColumn('oasf_skills', 'uid', 'INTEGER');
  await tryAddColumn('oasf_skills', 'caption', 'TEXT');
  await tryAddColumn('oasf_skills', 'extendsKey', 'TEXT');
  await tryAddColumn('oasf_skills', 'category', 'TEXT');

  // Agent domains/protocols normalization (best-effort for dev; migrations should handle prod)
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS agent_domains (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        domain TEXT NOT NULL,
        PRIMARY KEY (chainId, agentId, domain)
      );
      CREATE INDEX IF NOT EXISTS idx_agent_domains_domain ON agent_domains(domain);
      CREATE TABLE IF NOT EXISTS agent_protocols (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        protocol TEXT NOT NULL,
        version TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (chainId, agentId, protocol, version)
      );
      CREATE INDEX IF NOT EXISTS idx_agent_protocols_protocol ON agent_protocols(protocol);
      CREATE INDEX IF NOT EXISTS idx_agent_protocols_version ON agent_protocols(version);
    `);
  } catch (e: any) {
    console.warn('⚠️  Could not create agent_domains/agent_protocols tables (run migrations manually if needed).', String(e?.message || e));
  }

  // ERC-8092 delegation metadata (best-effort for dev; migrations should handle prod)
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS association_delegations (
        chainId INTEGER NOT NULL,
        associationId TEXT NOT NULL,
        ipfsUri TEXT,
        ipfsCid TEXT,
        delegationJson TEXT,
        decodedDataText TEXT,
        extractedKind TEXT,
        extractedFeedbackAuth TEXT,
        extractedRequestHash TEXT,
        fetchedAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        PRIMARY KEY (chainId, associationId)
      );
      CREATE INDEX IF NOT EXISTS idx_assoc_delegations_chain ON association_delegations(chainId);
      CREATE INDEX IF NOT EXISTS idx_assoc_delegations_cid ON association_delegations(ipfsCid);
      CREATE INDEX IF NOT EXISTS idx_assoc_delegations_feedbackAuth ON association_delegations(extractedFeedbackAuth);
      CREATE INDEX IF NOT EXISTS idx_assoc_delegations_requestHash ON association_delegations(extractedRequestHash);
      CREATE INDEX IF NOT EXISTS idx_assoc_delegations_decodedText ON association_delegations(decodedDataText);
    `);
  } catch (e: any) {
    console.warn('⚠️  Could not create association_delegations table (run migrations manually if needed).', String(e?.message || e));
  }
}

let schemaInitialized = false;
export async function ensureSchemaInitialized(): Promise<void> {
  if (schemaInitialized) return;
  schemaInitialized = true;
  await initializeSchema();
}

export async function getCheckpoint(chainId?: number): Promise<bigint> {
  await ensureSchemaInitialized();
  const key = chainId ? `lastProcessed_${chainId}` : 'lastProcessed';
  const row = await db.prepare("SELECT value FROM checkpoints WHERE key=?").get(key) as { value?: string } | undefined;
  return row?.value ? BigInt(row.value) : 0n;
}

export async function setCheckpoint(bn: bigint, chainId?: number): Promise<void> {
  await ensureSchemaInitialized();
  const key = chainId ? `lastProcessed_${chainId}` : 'lastProcessed';
  await db.prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(key, String(bn));
}
