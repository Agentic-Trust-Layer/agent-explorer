# ERC-8004 event-driven sync (near real-time)

This repo includes a **WebSocket event watcher** that listens to ERC‑8004 registry events and then runs a **targeted** re-sync pipeline for the impacted agent(s), instead of re-running full-chain jobs.

## Command

- Run watcher (multi-chain in one process):

```bash
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:erc8004-events
```

- Default chains (when `SYNC_CHAIN_ID` is not set): `1,11155111`

## Required configuration

The watcher needs:

- **ERC‑8004 registry address** (per chain)
  - `ETH_MAINNET_IDENTITY_REGISTRY`
  - `ETH_SEPOLIA_IDENTITY_REGISTRY`
  - `BASE_SEPOLIA_IDENTITY_REGISTRY`
  - `OP_SEPOLIA_IDENTITY_REGISTRY`

- **WS RPC URL** (per chain) (**optional**; preferred for near real-time)
  - `ETH_MAINNET_RPC_WS_URL` (or `ETH_MAINNET_RPC_WSS_URL`)
  - `ETH_SEPOLIA_RPC_WS_URL` (or `ETH_SEPOLIA_RPC_WSS_URL`)
  - `BASE_SEPOLIA_RPC_WS_URL` (or `BASE_SEPOLIA_RPC_WSS_URL`)
  - `OP_SEPOLIA_RPC_WS_URL` (or `OP_SEPOLIA_RPC_WSS_URL`)

If WS is not provided, it falls back to **HTTP polling**:
- `ETH_MAINNET_RPC_HTTP_URL` / `ETH_SEPOLIA_RPC_HTTP_URL` / etc.

Fallbacks:
- `IDENTITY_REGISTRY_<chainId>`
- `RPC_WS_URL_<chainId>` / `RPC_WSS_URL_<chainId>`
  - `RPC_HTTP_URL_<chainId>` / `RPC_URL_<chainId>`

## What events it watches

- **ERC‑721** `Transfer(from,to,tokenId)`
  - Treats any transfer as “agent changed” (mint + owner changes).
- **ERC‑4906** `MetadataUpdate(tokenId)` and `BatchMetadataUpdate(fromTokenId,toTokenId)` (best-effort; only if emitted by the registry)

Events are **debounced** (default ~7.5s) and processed in batches to avoid stampedes.

## What it does per impacted agentId

For each impacted ERC‑8004 `agentId` (tokenId) on the chain:

1. **Targeted agent ingest**
   - Fetch that single agent row from the subgraph.
   - Clear old per-agent nodes in the chain subgraph context (best-effort).
   - Emit + ingest Turtle for that agent into:
     - `https://www.agentictrust.io/graph/data/subgraph/<chainId>`

2. **Targeted derived updates**
   - A2A agent card fetch + materialize `agentCardJson`/skills/domains (best-effort clears prior A2A nodes for that didAccount)
   - MCP endpoint health/tools/prompts fetch (best-effort clears prior MCP descriptor fields for that didAccount)
   - Account typing for **owner + wallet** accounts (EOA vs smart account) via RPC
   - Trust Ledger recompute for that agent only (best-effort clears prior awards+score for that agent in analytics graph)

## Recommended operational workflow

### One-time / periodic “baseline” jobs (checkpoint-based)

Run these periodically (or after deploys) to keep the KB consistent with the subgraph:

```bash
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:agents
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:account-types
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:agent-cards
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:mcp
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:feedbacks
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:validations
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:associations
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:assertion-summaries
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:trust-ledger
```

### Long-lived near real-time process

Run the watcher continuously:

```bash
SYNC_CHAIN_ID=11155111 pnpm --filter sync sync:erc8004-events
```

## Notes / limitations

- The watcher’s targeted agent ingest does **not** fetch `agentMetadata_collection` (it is not efficiently filterable on most subgraphs). The baseline `sync:agents` job still handles attaching that dataset when available.
- If a mint/update event lands before the subgraph indexes it, the watcher retries briefly and then skips; a later event or baseline job will catch up.

