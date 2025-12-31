# Agent Registries & Discovery Indexes (Working Inventory)

This is a **working, expanding inventory** of agent registries, discovery indexes, and directories that matter for AgenticTrust ingestion and ontology alignment.

Scope note:

- **Registry**: a system that assigns identifiers and/or publishes canonical agent records (often with verification semantics).
- **Discovery index / directory**: lists agents and metadata, usually without strong identity/validation guarantees.
- **Aggregator**: indexes multiple registries into a single searchable surface.
- **Connectivity gateway**: not a registry itself, but may enable discovery across endpoints (MCP/A2A/etc.).

## Registry sources we actively reference (and their endpoints/code)

These registry keys show up in HOL’s aggregated dataset and/or in our ingestion work:

| Registry key | What it is | GitHub / code | Live endpoints | Notes |
|---|---|---|---|---|
| `a2a-registry` | A2A protocol agent directory (A2A agent cards, live endpoints) | `https://github.com/A2ABaseAI/A2ARegistry` ([repo](https://github.com/A2ABaseAI/A2ARegistry)) | `https://a2aregistry.org/`, `https://a2a-registry.dev/` | API patterns include `/.well-known/agents/index.json`, `/agents/search`, `/oauth/token` (see [`a2a-registry.md`](./a2a-registry.md)) |
| `agentverse` | Fetch.ai Agentverse directory for uAgents | `https://github.com/fetchai/agentverse`, `https://github.com/fetchai/uAgents`, `https://github.com/fetchai/avctl` | (directory) `https://agentverse.ai/` | Typically `protocol=uagent`; see [`fetchai-agentverse.md`](./fetchai-agentverse.md) |
| `coinbase-x402-bazaar` | Coinbase x402 Bazaar-style listings (payment/discovery) | `https://github.com/coinbase/x402` | (varies by deployment; also indexed via HOL) | Treat as discovery/catalog until validation semantics are clear |
| `erc-8004` | ERC-8004 EVM onchain agent registry (identity + validation + feedback) | Spec: `https://eips.ethereum.org/EIPS/eip-8004` | Onchain (EVM RPC + contract addresses) | Strong anchor: identifiers + trust assertions |
| `erc-8004-solana` | ERC-8004-style registry concepts on Solana | (TBD) | Onchain (Solana programs) | Often observed via HOL aggregation; treat as “source registry” provenance |
| `hashgraph-online` | Hashgraph Online DAO registry/broker ecosystem | `https://github.com/hashgraph-online/standards-sdk` | `https://hol.org/registry`, `https://registry.hashgraphonline.com/` | Often paired with Hashnet MCP broker tooling and multi-registry connectivity |
| `hol` | HOL aggregator itself (universal registry index) | (ecosystem) `https://github.com/hashgraph-online/standards-sdk` | Search API: `https://hol.org/api/v1/search` | See [`hashgraph-online.md`](./hashgraph-online.md) |

## Multi-registry aggregators (indexes multiple sources)

- **HOL (Hashgraph Online) Universal Registry**
  - Site: `https://hol.org/registry`
  - API: `https://hol.org/api/v1/search`
  - Notes: multi-source aggregator (see [`hashgraph-online.md`](./hashgraph-online.md)). Supports `registry=<source>` filtering (e.g. `registry=agentverse`).

## On-chain registries (strong identity anchoring)

- **ERC-8004 (EVM)**
  - Concept: onchain agent identity registration + validation/feedback signals.
  - Notes: strongest “anchor” when available; can be mapped into `agentictrust` Identity/Identifier + trust situations/assertions.

- **ERC-8004 Solana**
  - Notes: ecosystem-specific realization of ERC-8004-style registry concepts on Solana (HOL lists `erc-8004-solana` as a source).

## Protocol / ecosystem registries

- **NANDA / MCP Nexus Registry**
  - Docs: `https://nanda-registry.com/api/docs/`
  - API schema: `https://nanda-registry.com/api/schema/`
  - Notes: registry-style listing of servers/agents/resources/tools; used by our NANDA importer.

- **Fetch.ai Agentverse (uAgents directory / platform)**
  - GitHub org: `https://github.com/fetchai`
  - Agentverse repo: `https://github.com/fetchai/agentverse`
  - uAgents repo: `https://github.com/fetchai/uAgents`
  - Notes: execution/runtime-oriented directory; summarized in [`fetchai-agentverse.md`](./fetchai-agentverse.md).

## A2A protocol registries (live endpoint directories)

- **A2A Protocol Agent Registry**
  - `https://a2aregistry.org/`
  - Notes: community-driven directory of A2A-compliant hosted agents (e.g., `.well-known/agent.json` patterns).

- **A2A Registry (production instance)**
  - `https://a2a-registry.dev/`
  - Notes: hosted production instance with search/filter APIs and SDK support.

## Broad discovery indexes / marketplaces

- **AI Agent Marketplace Index (MCP Server)**
  - `https://www.magicslides.app/mcps/ai-agent-marketplace-index`
  - Notes: searchable catalog of AI agents exposed via MCP.

- **AI Agent Marketplace Index (alternate frontend)**
  - `https://dxt.so/dxts/ai-agent-marketplace-index`
  - Notes: alternate browsing surface for the same/related index.

## General directories (curated / mixed)

- **A2A Cards — AI Agents directory**
  - `https://www.a2acards.ai/agents`
  - Notes: general directory of agents & automation tools.

- **Alternates — AI Agent Discovery**
  - `https://www.alternates.ai/discovery`
  - Notes: searchable marketplace/discovery surface.

- **OpenAgentRegistry.ai**
  - `https://www.openagentregistry.ai/`
  - Notes: marketplace/registry with listings and filters.

- **Agent3**
  - `https://agent3.space/`
  - Notes: “broad discovery” claims, often mentioning trust/reputation style concepts (verify semantics before treating as a trust registry).

## Connectivity & gateway tooling (not registries, but discovery-adjacent)

- **agentgateway**
  - `https://agentgateway.dev/`
  - Notes: open-source connectivity between agents/tools/MCP endpoints; may participate in discovery flows even if not itself a canonical registry.

## Curated lists (non-programmatic, but useful hubs)

- **AI Agents Verse — AI agents list**
  - `https://aiagentsverse.com/ai-agents-list/`
  - Notes: broad directory; treat as a discovery seed source, not a registry.

## How we use this list

- **Ingestion planning**: pick sources with stable APIs and clear identifiers first (onchain registries, well-defined APIs like NANDA/HOL).
- **Ontology alignment**: decide whether a source record is a *descriptor* (directory/index) vs a *trust assertion* (validation/relationship/provenance).
- **Deduplication strategy**: most aggregators (e.g., HOL) include a “source registry” field; treat it as provenance and avoid collapsing identities too early.


