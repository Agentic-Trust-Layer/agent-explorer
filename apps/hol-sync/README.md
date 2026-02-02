# HOL Sync

Syncs HOL (Hashgraph Online) agent data from hol-indexer D1 database to GraphDB Knowledge Base.

## Setup

1. Set environment variables:
   - `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID
   - `HOL_INDEXER_D1_DATABASE_ID` or `CLOUDFLARE_D1_DATABASE_ID` - D1 database ID for hol-indexer
   - `CLOUDFLARE_API_TOKEN` - Cloudflare API token
   - `GRAPHDB_BASE_URL` - GraphDB base URL (default: https://graphdb.agentkg.io)
   - `GRAPHDB_REPOSITORY` - GraphDB repository (default: agentkg)
   - `GRAPHDB_USERNAME` - GraphDB username
   - `GRAPHDB_PASSWORD` - GraphDB password

## Usage

```bash
# Sync all HOL agents
pnpm --filter hol-sync sync:agents

# Sync all data
pnpm --filter hol-sync sync:all
```

## Data Model

HOL agents are stored in GraphDB under the context:
- `https://www.agentictrust.io/graph/data/subgraph/hol`

Agents are associated with:
- `hol:AgentIdentityRegistryHOL` - The HOL identity registry
- `hol:AIAgentHOL` - HOL agent class
- `hol:AgentIdentityHOL` - HOL identity
- `hol:IdentityDescriptorHOL` - Identity descriptor

HOL agents can be queried via GraphQL KB API using `chainId: 295` (HOL uses chainId 295 in KB).

Notes:
- Some hol-indexer D1 databases may still store rows under `chainId=0`.
- `hol-sync` will read both `HOL_D1_CHAIN_ID` (default 0) and `HOL_CHAIN_ID` (default 295) to support migration.
