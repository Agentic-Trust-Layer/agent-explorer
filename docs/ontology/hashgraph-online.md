# Hashgraph Online (HOL) Registry

HOL (`hol.org`) operates a **universal registry / broker** that aggregates agent entries from multiple underlying registries and protocols into a single searchable index.

In this repo, we treat HOL as:

- A **discovery aggregation layer** (one place to find many agents)
- A **source of registry metadata** (endpoints, protocol support, trust scoring signals, and registry provenance)

### Registry sources HOL includes

HOL’s indexed agent dataset includes entries drawn from these sources:

- `a2a-registry`
- `agentverse`
- `coinbase-x402-bazaar`
- `erc-8004`
- `erc-8004-solana`
- `hashgraph-online`
- `hol`

Note: as of recent HOL queries, the `agentverse` slice is ~14.9k agents (e.g., 14,891–14,892 depending on filters/time).

### How this maps into AgenticTrust

- **HOL entry** → imported/stored as an `agents` row (lossless raw JSON kept in `rawJson`)
- **Source registry** → captured as provenance (e.g., `registry` / `proto` identifiers inside HOL’s UAID-like strings)
- **Protocol support & endpoints** → descriptor material (A2A, MCP, x402, etc.) once resolved/normalized

### HOL ontology module (`agentictrust-hol.owl`)

Source: `apps/badge-admin/public/ontology/agentictrust-hol.owl`

This module **extends** `agentictrust-core.owl` with a concrete Descriptor type for HOL search hits:

- `hol:HOLAgentDescriptor` (subclass of `agentictrust:AgentDescriptor`)

The core idea: treat each HOL `/api/v1/search` hit as a **registry-produced descriptor** that can later be linked to an `agentictrust:AIAgent` via `agentictrust:hasDescriptor` / `hol:hasHOLAgentDescriptor`.

### Field mapping (HOL JSON → ontology terms)

Example HOL record fields map as follows (selected/high-signal fields):

- **Identity / provenance**
  - `id` → `hol:holId`
  - `originalId` → `hol:holOriginalId`
  - `uaid` → `hol:uaidString`
  - `registry` → `hol:sourceRegistry`
  - `protocols[]` → repeated `hol:sourceProtocol`
  - (if present/parsed) UAID components like `nativeId` → `hol:nativeId`

- **Capabilities / comms**
  - `capabilities[]` → repeated `hol:capabilityId`
  - `capabilityLabels[]` → repeated `hol:capabilityLabel`
  - `communicationSupported` → `hol:communicationSupported`
  - `routingSupported` → `hol:routingSupported`

- **Endpoints + raw capture**
  - `endpoints` → `hol:endpointsJson` (lossless JSON string)
  - `metadata` → `hol:metadataJson` (lossless JSON string)
  - `profile` → `hol:profileJson` (lossless JSON string)

- **Availability / probe**
  - `availabilityStatus` → `hol:availabilityStatus`
  - `availabilityCheckedAt` → `hol:availabilityCheckedAt`
  - `availabilityReason` → `hol:availabilityReason`
  - `availabilitySource` → `hol:availabilitySource`
  - `availabilityLatencyMs` → `hol:availabilityLatencyMs`
  - `availabilityScore` → `hol:availabilityScore`
  - `available` → `hol:available`

- **Quality / trust**
  - `trustScore` → `hol:trustScore`
  - `trustScores` → `hol:trustScoresJson` (lossless JSON string)

- **Indexing + language**
  - `lastIndexed` → `hol:lastIndexed`
  - `lastSeen` → `hol:lastSeen`
  - `detectedLanguage` → `hol:detectedLanguage`
  - `detectedLanguageCode` → `hol:detectedLanguageCode`
  - `detectedLanguageConfidence` → `hol:detectedLanguageConfidence`

### HOL API used by this repo

The HOL registry search endpoint:

- `GET https://hol.org/api/v1/search?page=<n>&limit=<n>`

returns paginated `hits[]` with metadata like `registry`, `protocols`, `endpoints`, availability signals, and trust score fields.


