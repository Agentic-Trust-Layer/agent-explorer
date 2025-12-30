# ERC-8004 Indexer

## Overview

This folder currently includes a subgraph based indexing stack for local and remote development. Please refer to the /subgraph/README.md doc for more info.

## Setup

### Local Development

**Environment Variables Required:**
The indexer now uses Cloudflare D1 for both local and production. You need to set:
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_D1_DATABASE_ID` - Your D1 database ID  
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with D1 permissions

1. Copy env:
  ```bash
  cp .env.example .env
  ```
2. Install deps from repo root:
  ```bash
  pnpm install
  ```
3. Set D1 credentials in `.env` file

## Import NANDA Registry agents (MCP Nexus)

The NANDA Registry API is documented via Swagger at [`https://nanda-registry.com/api/docs/`](https://nanda-registry.com/api/docs/) and exposes an OpenAPI schema at `https://nanda-registry.com/api/schema/` (used by the importer to confirm endpoint shapes). See the docs: [`https://nanda-registry.com/api/docs/`](https://nanda-registry.com/api/docs/).

This repo includes a utility that imports NANDA “servers” (registry entries) into a **separate D1 database** (recommended name: `nanda-indexer`) using tables that are **the same / very similar** to the `erc8004-indexer` schema.

### Create the D1 database and apply migrations

From `apps/indexer/`:

```bash
npx wrangler d1 create nanda-indexer
npx wrangler d1 migrations apply nanda-indexer --remote
```

### Required environment variables

Set these for the *target* `nanda-indexer` D1 database:

- `NANDA_CLOUDFLARE_ACCOUNT_ID`
- `NANDA_CLOUDFLARE_D1_DATABASE_ID`
- `NANDA_CLOUDFLARE_API_TOKEN`

Optional:

- `NANDA_BASE_URL` (default `https://nanda-registry.com`)
- `NANDA_JWT` (optional Bearer token; some endpoints allow anonymous access, but auth can improve reliability/visibility)
- `NANDA_PAGE_SIZE` (default `100`)
- `NANDA_MAX_PAGES` (default unlimited)
- `NANDA_SEARCH` (optional search filter)
- `NANDA_IMPORT_MODE` (`discovery_search` or `servers`; default `discovery_search`)
- `NANDA_QUERY` (default `agent` when using `discovery_search`)
- `NANDA_TYPE` (default `agent` when using `discovery_search`)
- `NANDA_SERVER_TYPES` (optional; only used in `servers` mode; maps to `/api/v1/servers/?types=...`)
- `NANDA_TAGS` (optional filter; comma-separated; works with both list/search modes)
- `NANDA_VERIFIED` (optional; set `1` to filter verified only)
- `NANDA_INCLUDE_DETAILS` (`1` to also call `/api/v1/servers/{id}/` for each record)
- `NANDA_LOG_EACH` (`1` to log every upserted row; useful for debugging partial imports)
- `NANDA_PROBE` (optional; set `1` to probe each NANDA `url` for an A2A agent card and ingest `agents: []` from those cards)
- `NANDA_CHAIN_ID` (default `0`; used as `agents.chainId` for non-chain registry imports)

### Run the import

From repo root:

```bash
pnpm --filter erc8004-indexer import:nanda
```

## Import HOL Registry agents (HOL Universal Registry)

HOL exposes a public registry search API at `https://hol.org/api/v1/search` that returns registry “agents” (entries) in a paginated `hits[]` list.

This repo includes a utility that imports HOL registry hits into a **separate D1 database** (recommended name: `hol-indexer`) using tables that are **the same / very similar** to the `erc8004-indexer` schema.

### Create the D1 database (optional)

From `apps/indexer/`:

```bash
npx wrangler d1 create hol-indexer
```

### Required environment variables

Set these for the *target* `hol-indexer` D1 database:

- `HOL_CLOUDFLARE_ACCOUNT_ID`
- `HOL_CLOUDFLARE_D1_DATABASE_ID`
- `HOL_CLOUDFLARE_API_TOKEN`

Optional:

- `HOL_BASE_URL` (default `https://hol.org`)
- `HOL_PAGE_SIZE` (default `100`)
- `HOL_MAX_PAGES` (default unlimited)
- `HOL_CHAIN_ID` (default `0`)
- `HOL_LOG_EACH` (`1` logs each successful upsert)
- `HOL_REGISTRY` (optional; import only a single HOL registry source, e.g. `agentverse`)
- `HOL_REGISTRIES` (optional; comma-separated list; if unset we default to known sources like `agentverse`, `erc-8004`, etc.)
- `HOL_RESUME` (default enabled; set `0` to disable resuming from the last saved page)
- `HOL_RESET` (`1` to reset the cursor to page 1 before importing)
- `HOL_PAGE_RETRIES` (default `6`; additional page-level retries on transient errors like 503)
- `HOL_PAGE_DELAY_MS` (default `200`; delay between pages to reduce upstream load)
- `HOL_CAPABILITY` (optional filter for `/api/v1/search?capability=...`)
- `HOL_TRUST` (optional filter for `/api/v1/search?trust=...`)
- `HOL_QUERY` (optional filter for `/api/v1/search?q=...`)

### Run the import

From repo root:

```bash
pnpm --filter erc8004-indexer import:hol
```

### Run Local GraphQL Server
```bash
pnpm dev:graphql
# or
pnpm start:graphql
```
GraphiQL UI available at: http://localhost:4000/graphql

## Deployment to Cloudflare

### Prerequisites
1. Install Wrangler CLI (if not already installed):
   ```bash
   pnpm add -D wrangler
   ```
2. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```

### Initial Setup

1. **Configure wrangler.toml**:
   ```bash
   # Copy the example configuration
   cp wrangler.toml.example wrangler.toml
   ```
   Edit `wrangler.toml` with your actual values:
   - Database ID (from D1 database creation)
   - API keys (Alchemy, Pinecone, Venice)
   - Secret access codes
   - Registry contract addresses
   
   **⚠️ IMPORTANT**: `wrangler.toml` contains secrets and is git-ignored. Never commit this file.

2. **Create D1 Database** (if not already created):
   ```bash
   cd apps/indexer
   pnpm d1:create
   ```
   Note the database ID and add it to `wrangler.toml` under `[[d1_databases]]`.

2. **Run Migrations**:
   ```bash
   # Initial schema
   pnpm d1:migrate
   
   # Access codes table (if needed)
   wrangler d1 execute erc8004-indexer --remote --file=./migrations/0002_add_access_codes.sql
   ```

3. **Set Environment Variables**:
   ```bash
   # Secret access code for server-to-server authentication
   wrangler secret put GRAPHQL_SECRET_ACCESS_CODE
   ```
   Enter your secret access code when prompted (this will be used by the web app).

### Deploy

From the `apps/indexer` directory:

**Production:**
```bash
# Using npm script
pnpm deploy

# Or directly with wrangler
npx wrangler deploy

# Or using pnpm
pnpm exec wrangler deploy
```

**Development Environment:**
```bash
# Using npm script
pnpm deploy:dev

# Or directly with wrangler
npx wrangler deploy --env development
```

This will deploy the GraphQL API to Cloudflare Workers. The endpoint URL will be shown in the output after successful deployment (e.g., `https://erc8004-indexer-graphql.your-subdomain.workers.dev`).

### Environment Variables

Set these in Cloudflare Workers dashboard or via Wrangler:

**Secrets (use `wrangler secret put`):**
- `GRAPHQL_SECRET_ACCESS_CODE` - Secret access code for server-to-server auth
- `VENICE_API_KEY` - Venice AI API key for embeddings (required for semantic search)
- `PINECONE_API_KEY` - Pinecone API key (required for semantic search)

**Regular Variables (can be in `wrangler.toml` [vars] or set as secrets):**
- `PINECONE_INDEX` - Pinecone index name (default: "agentictrust")
- `PINECONE_NAMESPACE` - Pinecone namespace (optional)
- `VENICE_MODEL` - Venice embedding model (optional, default: "text-embedding-bge-m3")
- `VENICE_BASE_URL` - Venice API base URL (optional)
- `SEMANTIC_SEARCH_MIN_SCORE` - Minimum similarity score for semantic search (optional)

**To set secrets:**
```bash
# From apps/indexer directory
wrangler secret put VENICE_API_KEY
wrangler secret put PINECONE_API_KEY
wrangler secret put GRAPHQL_SECRET_ACCESS_CODE
```
Enter the values when prompted. These are encrypted and not exposed in logs.

### Local Worker Development
```bash
# Run worker locally with D1
pnpm dev:worker:local

# Run worker connected to remote D1
pnpm dev:worker
```

## Notes
- **Database**: Uses Cloudflare D1 for both local development and production
- **Local Development**: Requires D1 configuration (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN) in `.env`
- **Local D1**: Use `pnpm dev:worker:local` for local D1 (managed by Wrangler), or configure remote D1 credentials
- Reads chain via `RPC_HTTP_URL`; optional `RPC_WS_URL`
- GraphQL API requires access code authentication (except for `getAccessCode` and `createAccessCode` mutations)
- Use `GRAPHQL_SECRET_ACCESS_CODE` environment variable for server-to-server authentication