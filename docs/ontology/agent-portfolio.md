# Agent portfolios (fleet governance + orchestration)

This page defines the **AgentPortfolio** concept and why it matters for agent discovery, governance, and orchestration.

## What a portfolio is (and is not)

- **AgentPortfolio**: an **operational grouping** (“portfolio”, “fleet”) of specialized agents used for routing, governance, access control, and reporting.
- **Not** an identity registry and not a replacement for identity registries.

Key distinction:

- **Registry** answers: “*Which identity representations exist, under what rules, and who asserts them?*”
- **Portfolio** answers: “*Which agents are in my governed/orchestrated set for a task/vertical/business domain?*”

## Why portfolios matter

The phrase “govern and orchestrate a fleet of agents” implies:

- **Grouping**: you need a first-class “set of agents” to govern and query.
- **Routing**: intent types / skills can be matched at the portfolio level (“which agent in this portfolio can satisfy this intent?”).
- **Policy**: operators/providers can be authorized to operate *deployments for agents in a portfolio*.
- **Reporting**: portfolio-level rollups (coverage by skill/domain, trust posture, verification status).

## Ontology grounding (AgenticTrust)

`agentictrust:AgentPortfolio` is modeled as:

- `agentictrust:AgentPortfolio ⊑ prov:Collection`
- Membership uses **PROV**: `prov:hadMember` (Portfolio → `agentictrust:AIAgent`)

This choice keeps portfolios:

- composable with provenance and activity reporting
- compatible with existing PROV tooling
- independent from any single registry ecosystem

## Diagram: portfolio + identity registries (plural, market-shaped)

This is the **anti-singleton** pattern: ERC-8004 is *one* registry; vertical/market registries can coexist.

```mermaid
graph TB
  Portfolio["AgentPortfolio\nprov:Collection"]
  Agent1["AIAgent\nprov:Agent"]
  Agent2["AIAgent\nprov:Agent"]

  Reg8004["ERC-8004 registry\nAgentIdentityRegistry"]
  RegFin["Finance registry\nAgentIdentityRegistry"]
  RegHealth["Healthcare registry\nAgentIdentityRegistry"]

  Id8004["Identity (in ERC-8004)\nAgentIdentity (prov:Entity)"]
  IdFin["Identity (in finance registry)\nAgentIdentity (prov:Entity)"]

  Portfolio -->|prov:hadMember| Agent1
  Portfolio -->|prov:hadMember| Agent2

  Agent1 -->|agentictrust:hasIdentity| Id8004
  Agent1 -->|agentictrust:hasIdentity| IdFin

  Id8004 -->|agentictrust:identityRegistry| Reg8004
  IdFin -->|agentictrust:identityRegistry| RegFin
  Agent2 -->|agentictrust:hasIdentity| Id8004
  Id8004 -->|agentictrust:identityRegistry| Reg8004
  IdFin -. "other registries may exist" .-> RegHealth
```

## The “ERC-8004 registry singleton” issue (and how to avoid it)

If ERC-8004 becomes “the” singleton registry in your modeling, you lose:

- market-driven registry competition
- vertical/domain-specific identity standards
- multiple coexisting trust regimes (e.g., finance vs healthcare compliance)
- portability across ecosystems

AgenticTrust avoids that by modeling:

- **Agent** (`agentictrust:AIAgent`) as the durable trust-graph anchor
- **Identity** (`agentictrust:AgentIdentity`, `prov:Entity`) as **registry-scoped** representations
- **Registries** (`agentictrust:AgentIdentityRegistry`) as explicit entities (plural, not assumed singleton)

Portfolios then sit *orthogonally* to registries: a portfolio can include agents with identities in many registries.

## SPARQL patterns

### 1) List portfolios and their members

```sparql
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?portfolio (COUNT(DISTINCT ?agent) AS ?agentCount)
WHERE {
  ?portfolio a agentictrust:AgentPortfolio ;
             prov:hadMember ?agent .
  ?agent a agentictrust:AIAgent .
}
GROUP BY ?portfolio
ORDER BY DESC(?agentCount) ?portfolio
LIMIT 200
```

### 2) Portfolio members with their registries (show plural identity)

```sparql
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT DISTINCT ?agent ?identity ?registry
WHERE {
  VALUES (?portfolio) { (<PORTFOLIO_IRI>) }

  ?portfolio a agentictrust:AgentPortfolio ;
             prov:hadMember ?agent .
  ?agent a agentictrust:AIAgent .

  OPTIONAL {
    ?agent agentictrust:hasIdentity ?identity .
    OPTIONAL { ?identity agentictrust:identityRegistry ?registry . }
  }
}
ORDER BY ?agent ?identity ?registry
LIMIT 500
```

### 3) Portfolio “coverage”: which OASF skills exist across the portfolio

```sparql
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT DISTINCT ?skillId
WHERE {
  VALUES (?portfolio) { (<PORTFOLIO_IRI>) }
  ?portfolio a agentictrust:AgentPortfolio ;
             prov:hadMember ?agent .
  ?agent a agentictrust:AIAgent ;
         agentictrust:hasIdentity ?identity .
  ?identity agentictrust:hasDescriptor ?reg .

  ?reg agentictrust:hasSkill ?agentSkill .
  ?agentSkill agentictrust:hasSkillClassification ?skillNode .
  ?skillNode agentictrust:oasfSkillId ?skillId .
}
ORDER BY ?skillId
LIMIT 500
```

## Why “Google Agentspace” led to AgentPortfolio

Agentspace language (“portfolio of specialized agents”, “fleet of agents”) is explicitly about **governable sets** and **orchestration across multiple agents**.

In graph terms, that requires a first-class:

- **set node** (portfolio)
- **membership edges** (hadMember)

Without that node, you can’t easily express portfolio-level governance, reporting, or routing constraints as data.

See also: [`google-agentspace.md`](./google-agentspace.md).


