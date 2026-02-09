# Sync analytics jobs (GraphDB): assertion summaries, trust index, trust ledger

This doc explains the three `apps/sync` jobs that **materialize analytics** into GraphDB and how the GraphQL API reads the resulting knowledge graph classes.

## The three commands (typical full rebuild)

```bash
pnpm --filter sync sync:assertion-summaries -- --reset
pnpm --filter sync sync:trust-index -- --reset
pnpm --filter sync sync:trust-ledger -- --reset
```

### Chain selection

These jobs run per chain. Set `SYNC_CHAIN_ID` to target a single chain:

```bash
export SYNC_CHAIN_ID=1
```

If `SYNC_CHAIN_ID` is not set, `apps/sync` defaults to `1,11155111` (mainnet + sepolia).

## Named graph contexts used

- **Subgraph context (chain evidence)**: `https://www.agentictrust.io/graph/data/subgraph/<chainId>`
  - Source-of-truth for ingested protocol entities (agents, identities, feedback, validations, associations, etc.)
  - `sync:assertion-summaries` also writes here.

- **Analytics context (computed outputs)**: `https://www.agentictrust.io/graph/data/analytics/<chainId>`
  - `sync:trust-index` and `sync:trust-ledger` write here.

- **Analytics system context (global catalog)**: `https://www.agentictrust.io/graph/data/analytics/system`
  - `sync:trust-ledger` seeds badge definitions here.

## 1) `sync:assertion-summaries -- --reset`

### Purpose
Materialize fast aggregate rollups for each agent:
- **feedback count + last feedback time**
- **validation count + last validation time**

These summaries are used by both:
- downstream computations (trust ledger + trust index), and
- the GraphQL API (filters/counts).

### Reset behavior
`-- --reset` clears existing `core:hasFeedbackAssertionSummary` / `core:hasValidationAssertionSummary` links and deletes prior summary nodes in the **subgraph context** for that chain, then rebuilds them.

### What it writes (classes + properties)
Context: `.../subgraph/<chainId>`

- **Classes**
  - `core:FeedbackAssertionSummary`
  - `core:ValidationAssertionSummary`

- **Links from the agent**
  - `core:hasFeedbackAssertionSummary` → summary node
  - `core:hasValidationAssertionSummary` → summary node

- **Summary properties**
  - `core:feedbackAssertionCount` (xsd:integer)
  - `core:lastFeedbackAtTime` (xsd:integer, unix epoch seconds; best-effort)
  - `core:validationAssertionCount` (xsd:integer)
  - `core:lastValidationAtTime` (xsd:integer, unix epoch seconds; best-effort)

Ontology definitions live in `apps/ontology/ontology/trust.ttl`.

## 2) `sync:trust-index -- --reset`

### Purpose
Compute and materialize **ATI** (Agent Trust Index) into GraphDB for fast reads and ranking.

### Reset behavior (important)
`-- --reset` clears **the entire analytics named graph** for the target chain:

`https://www.agentictrust.io/graph/data/analytics/<chainId>`

That context is shared with Trust Ledger outputs. So after a trust-index reset, you typically run `sync:trust-ledger -- --reset` again.

### What it writes (classes + properties)
Context: `.../analytics/<chainId>`

- **Classes**
  - `analytics:AgentTrustIndex`
  - `analytics:AgentTrustComponent`

- **`analytics:AgentTrustIndex` properties**
  - `analytics:forAgent` → `core:AIAgent` (IRI)
  - `analytics:chainId` (xsd:integer)
  - `analytics:agentId` (xsd:string) *(legacy numeric ERC-8004 agentId string; used as a join key in some queries)*
  - `analytics:overallScore` (xsd:integer, 0..100)
  - `analytics:overallConfidence` (xsd:decimal, 0..1)
  - `analytics:version` (xsd:string)
  - `analytics:computedAt` (xsd:integer, unix epoch seconds)
  - `analytics:bundleJson` (xsd:string; debug/explain bundle)

- **`analytics:AgentTrustComponent` properties**
  - `analytics:componentOf` → `analytics:AgentTrustIndex`
  - `analytics:component` (xsd:string)
  - `analytics:score` (xsd:decimal)
  - `analytics:weight` (xsd:decimal)
  - `analytics:evidenceCountsJson` (xsd:string; debug/explain payload)

Ontology definitions live in `apps/ontology/ontology/analytics.ttl`.

## 3) `sync:trust-ledger -- --reset`

### Purpose
Compute Trust Ledger badge awards + score rollups from KB evidence and materialize the results for UI/GraphQL ranking.

### Reset behavior
With `-- --reset`, this job will:

1) Clear `https://www.agentictrust.io/graph/data/analytics/system` and reseed badge definitions from code defaults.\n
2) Clear `https://www.agentictrust.io/graph/data/analytics/<chainId>` and recompute awards + rollups.

Because it clears the analytics `<chainId>` context, it can wipe ATI outputs too. That’s why a “full rebuild” usually runs **trust-index first**, then **trust-ledger**.

### What it writes

#### (A) Badge definitions (global catalog)
Context: `.../analytics/system`

- **Class**: `analytics:TrustLedgerBadgeDefinition`
- **Properties**: `analytics:badgeId`, `analytics:program`, `analytics:name`, `analytics:description`, `analytics:iconRef`, `analytics:points`, `analytics:ruleId`, `analytics:ruleJson`, `analytics:active`, `analytics:createdAt`, `analytics:updatedAt`

#### (B) Per-agent awards + rollups
Context: `.../analytics/<chainId>`

- **Badge awards**
  - Class: `analytics:TrustLedgerBadgeAward`
  - Agent link: `analytics:hasTrustLedgerBadgeAward` (from `core:AIAgent` to award node)
  - Back-link: `analytics:badgeAwardForAgent` (award node → agent)
  - Definition link: `analytics:awardedBadgeDefinition` (award node → definition)
  - Evidence: `analytics:awardedAt` (unix seconds), `analytics:evidenceJson` (debug JSON)

- **Score rollup**
  - Class: `analytics:AgentTrustLedgerScore`
  - Agent link: `analytics:hasTrustLedgerScore` (agent → score node)
  - Properties:
    - `analytics:trustLedgerForAgent` (score node → agent)
    - `analytics:trustLedgerChainId` (xsd:integer)
    - `analytics:trustLedgerAgentId` (xsd:string; legacy numeric id string)
    - `analytics:totalPoints` (xsd:integer)
    - `analytics:badgeCount` (xsd:integer)
    - `analytics:trustLedgerComputedAt` (xsd:integer, unix seconds)
    - `analytics:digestJson` (xsd:string; debug digest)

Ontology definitions live in `apps/ontology/ontology/analytics.ttl`.

## How GraphQL uses these classes

The KB GraphQL API is implemented in `apps/indexer` and reads from:
- the **subgraph context** (agents + evidence), and
- the **analytics context** (ATI + Trust Ledger outputs).

### Primary query used by admin leaderboard

GraphQL query:
- `kbAgents(where:{chainId:<chainId>}, orderBy: bestRank, orderDirection: DESC)`\n

Schema fields on `KbAgent` (from `apps/indexer/src/graphql-schema-kb.ts`):
- `trustLedgerTotalPoints`, `trustLedgerBadgeCount`, `trustLedgerComputedAt`
- `atiOverallScore`, `atiOverallConfidence`, `atiVersion`, `atiComputedAt`

### KB → GraphQL mapping (what gets joined)

In `apps/indexer/src/graphdb/kb-queries.ts`, `kbAgents` joins analytics like this (conceptually):

- **Trust Ledger rollups** (analytics graph):
  - `?agent analytics:hasTrustLedgerScore ?tls .`
  - `?tls a analytics:AgentTrustLedgerScore ; analytics:totalPoints ?trustLedgerTotalPoints .`
  - `OPTIONAL { ?tls analytics:badgeCount ?trustLedgerBadgeCount }`
  - `OPTIONAL { ?tls analytics:trustLedgerComputedAt ?trustLedgerComputedAt }`

- **ATI** (analytics graph):
  - `?ati a analytics:AgentTrustIndex ; analytics:agentId <agentIdString> ; analytics:overallScore ?atiOverallScore .`
  - `OPTIONAL { ?ati analytics:overallConfidence ?atiOverallConfidence }`
  - `OPTIONAL { ?ati analytics:computedAt ?atiComputedAt }`
  - `OPTIONAL { ?ati analytics:version ?atiVersion }`

### Why assertion summaries matter for GraphQL

`kbAgents` also uses assertion summary nodes to avoid expensive N+1 counting:
- `?agent core:hasFeedbackAssertionSummary ?fbS . ?fbS core:feedbackAssertionCount ?feedbackAssertionCount .`
- `?agent core:hasValidationAssertionSummary ?vrS . ?vrS core:validationAssertionCount ?validationAssertionCount .`

Those counts are exposed via the `KbAgent.assertions`, `KbAgent.reviewAssertions.total`, and `KbAgent.validationAssertions.total` resolvers.

## Debugging / validation queries

### Trust Ledger leaderboard for mainnet

```sparql
PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>

SELECT ?agent ?totalPoints ?badgeCount ?computedAt
WHERE {
  GRAPH <https://www.agentictrust.io/graph/data/analytics/1> {
    ?s a analytics:AgentTrustLedgerScore ;
       analytics:trustLedgerForAgent ?agent ;
       analytics:totalPoints ?totalPoints ;
       analytics:badgeCount ?badgeCount ;
       analytics:trustLedgerComputedAt ?computedAt .
  }
}
ORDER BY DESC(?totalPoints) DESC(?badgeCount) DESC(?computedAt) STR(?agent)
LIMIT 100
```

### ATI top agents (mainnet)

```sparql
PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>

SELECT ?agent ?overallScore ?computedAt
WHERE {
  GRAPH <https://www.agentictrust.io/graph/data/analytics/1> {
    ?ati a analytics:AgentTrustIndex ;
         analytics:forAgent ?agent ;
         analytics:overallScore ?overallScore ;
         analytics:computedAt ?computedAt .
  }
}
ORDER BY DESC(?overallScore) DESC(?computedAt) STR(?agent)
LIMIT 100
```

