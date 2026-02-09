# Trust scoring, badges, and ranking strategy (ATI + Trust Ledger)

This document explains the overall strategy for **agent trust analytics** in the Knowledge Base (GraphDB): how we compute **scores**, **trust index**, **badges**, and how those outputs drive **ranking** (e.g. admin leaderboard).

If you want the command-level “what gets written where” reference, see [`sync-analytics-jobs.md`](./sync-analytics-jobs.md).

## Terms

- **Evidence**: On-chain / ingested facts in the KB (agents, identities, feedback, validations, associations, revocations, descriptors, agent cards, etc.).
- **Materialized aggregates**: Precomputed rollups written into the KB to make reads fast (avoid expensive `COUNT()` at query-time).
- **Trust Ledger**: A **points + badges** program: it outputs badge awards and a points rollup per agent.
- **ATI (Agent Trust Index)**: A **0..100 index** intended to be explainable (with component breakdown + confidence).
- **Rank**: A deterministic ordering for “top agents” views. In GraphQL we expose this as `orderBy: bestRank`.

## Why we have both Trust Ledger and ATI

They play different roles:

- **Trust Ledger score (points)** answers: *“Has this agent accumulated trust-related achievements?”*
  - Very legible for users and incentives (badges + points).
  - Easy to interpret and debug (each badge has an evidence trail).

- **ATI (trust index)** answers: *“How complete/credible/current is this agent’s presence in the KB?”*
  - More “holistic signal”: identity + descriptors + endpoints + experience + freshness, etc.
  - Designed to be explainable via components and an overall confidence number.

In practice:
- Trust Ledger is great for **achievement-based** ranking.
- ATI is great for **quality/completeness** ranking and tie-breaking.

## Strategy: materialize to GraphDB, query from GraphQL

We compute analytics in `apps/sync` and write them into GraphDB named graphs so GraphQL reads are fast and stable.

```mermaid
flowchart TD
  evidence["KB evidence (subgraph/<chainId>)"]
  summaries["Assertion summaries (counts + last timestamps)"]
  ati["ATI (AgentTrustIndex + components)"]
  badges["Trust Ledger badge awards"]
  tlScore["Trust Ledger score rollup (points + badgeCount)"]
  gql["GraphQL kbAgents(orderBy: bestRank)"]

  evidence --> summaries
  evidence --> ati
  summaries --> ati
  evidence --> badges
  summaries --> badges
  badges --> tlScore
  ati --> gql
  tlScore --> gql
```

## “Score” vs “Index”

### Trust Ledger score (points)

**What it is**: integer points computed from awarded badges.

**What it’s for**:
- Leaderboard ordering (primary “who is most trusted” metric).
- UI display (“this agent earned X points and Y badges”).

**Shape in GraphDB** (analytics graph):
- `analytics:AgentTrustLedgerScore`
  - `analytics:totalPoints` (int)
  - `analytics:badgeCount` (int)
  - `analytics:trustLedgerComputedAt` (unix seconds)

### ATI trust index (0..100)

**What it is**: a computed index (0..100) plus confidence and a component breakdown.

**What it’s for**:
- Sorting/tie-breaker when Trust Ledger points are equal or missing.
- Debug/explain via `bundleJson` + per-component records.

**Shape in GraphDB** (analytics graph):
- `analytics:AgentTrustIndex`
  - `analytics:overallScore` (int 0..100)
  - `analytics:overallConfidence` (decimal 0..1)
  - `analytics:computedAt` (unix seconds)
  - `analytics:version` (string)
- `analytics:AgentTrustComponent`
  - `analytics:component`, `analytics:score`, `analytics:weight`, `analytics:evidenceCountsJson`

**What inputs go into the ATI score** (current `kb-cts-v1` implementation in `apps/sync/src/trust-index/trust-index.ts`):

- **Overall score**
  - **Formula**: weighted sum of component scores, rounded to an integer and clamped to 0..100.
  - **Weights** (sum to 1.0): existence 0.08, identity 0.12, descriptor 0.18, capability 0.22, experience 0.16, freshness 0.12, endpoints 0.06, agentCard 0.06.

- **Overall confidence**
  - Derived from:
    - **sample strength**: \(\log_{10}(1 + feedbackCount + validationCount)\) scaled (more evidence → higher confidence)
    - **freshness factor**: freshnessScore/100 (more recent updates → higher confidence)
  - The confidence is a 0..1 number intended for UI/explain (“how much evidence do we have?”).

- **Component: `existence` (100 or not present)**
  - This run only emits ATI rows for agents with an ERC‑8004 identity/agentId, so existence is currently always 100 for included agents.

- **Component: `identity` (100 or not present)**
  - Same as existence: this job currently targets agents that have an ERC‑8004 identity + numeric agentId, so identity is currently always 100 for included agents.

- **Component: `descriptor` (0..100)**
  - Uses two completeness signals (each 0..1) and blends them:
    - `agentDescriptorCompleteness01` (55% weight): based on the agent’s descriptor having title/description/image.
    - `identityDescriptorCompleteness01` (45% weight): based on the ERC‑8004 identity descriptor having registrationJson + image + registeredBy + registryNamespace.
  - Also captures descriptor-derived evidence in `evidenceCountsJson`, including:
    - whether identity skills/domains exist
    - whether A2A/MCP skills/domains exist
    - registration-derived counts: `registrationSkillCount`, `registrationDomainCount`
    - `x402SupportFromRegistration`

- **Component: `capability` (0..100)**
  - Input: `validationAssertionCount` from `core:ValidationAssertionSummary`.
  - Scoring: log-scaled, capped at 50 validations (\(\approx 50 \rightarrow 100\)).

- **Component: `experience` (0..100)**
  - Input: `feedbackAssertionCount` from `core:FeedbackAssertionSummary`.
  - Scoring: log-scaled, capped at 50 feedback assertions.

- **Component: `freshness` (0..100)**
  - Input: `core:updatedAtTime` on the agent (best-effort materialized during sync).
  - Scoring: exponential decay vs age in days (very recent → near 100; older → approaches 0).

- **Component: `endpoints` (0 or 100)**
  - Inputs:
    - endpoint evidence on the agent (`hasA2A`, `hasMCP`)
    - endpoint evidence parsed from ERC‑8004 registration JSON (`hasA2AFromRegistration`, `hasMCPFromRegistration`, `hasWebFromRegistration`, `hasOASFServiceFromRegistration`)
  - Scoring: 100 if any of (A2A, MCP, Web) is present; else 0.

- **Component: `agentCard` (0..100)**
  - Inputs:
    - direct presence of `core:agentCardJson` for A2A and/or MCP
    - or an agent-card URL pattern in registration services (weaker signal)
  - Scoring ladder (best → worst): A2A agentCardJson (1.0), MCP agentCardJson (0.85), A2A agent-card URL (0.65), MCP agent-card URL (0.55), else 0.

## Badges and awards

Badges exist at two layers:

1) **Badge definitions (catalog)** — global list of what badges exist and how they’re described:
   - Class: `analytics:TrustLedgerBadgeDefinition`
   - Stored in: `.../analytics/system`

2) **Badge awards (per agent)** — what an agent actually earned:
   - Class: `analytics:TrustLedgerBadgeAward`
   - Stored in: `.../analytics/<chainId>`
   - Linked to the agent and to the awarded badge definition.

This separation allows:
- stable, queryable UI catalog of badges, and
- per-agent evidence-bearing awards (with `awardedAt` + `evidenceJson`).

## Ranking (“bestRank”) in GraphQL

GraphQL uses the KB query `kbAgents(orderBy: bestRank, orderDirection: DESC)` for “best ranked agents”.

The ordering logic is implemented in:
- `apps/indexer/src/graphdb/kb-queries.ts`

Specifically, `bestRank` sorts by (descending):
1) **Trust Ledger total points**
2) **ATI overall score**
3) **Agent createdAtTime** (so ranking is stable even for ties)
4) **Agent IRI** as a final stable tie-breaker

This means:
- If Trust Ledger hasn’t been computed yet for an agent, its points are treated as **0** for ordering.
- If ATI hasn’t been computed yet, its score is treated as **0** for ordering.

## Overall operational approach (recommended)

For a clean rebuild of analytics for one chain (e.g. mainnet):

1) Materialize assertion summaries (cheap rollups that downstream jobs and GraphQL depend on)\n
2) Compute ATI into analytics graph\n
3) Compute Trust Ledger awards + score rollups into analytics graph\n

See [`sync-analytics-jobs.md`](./sync-analytics-jobs.md) for the exact commands and reset semantics.

