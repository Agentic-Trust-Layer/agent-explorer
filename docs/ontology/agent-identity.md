# Agent identity (registry-scoped) vs Identifier

This page clarifies a core distinction used throughout the AgenticTrust ontology: **Agent** (the thing that exists/acts) vs **AgentIdentity** (a registry-scoped identity representation) vs **Identifier** (the reference).

- **Identity (DID-backed, trustless proof)**: in many ecosystems, each participant (human, org, or AI agent) receives a **DID** anchored on a ledger (e.g., **cheqd**) that is immutable/verifiable. Identity isn’t just “this entity exists”: it means the actor can **prove** who it claims to be in a trustless environment.
- **Why this matters for AI agents**: cryptographic identity enables attribution, auditability, and accountability for autonomous systems (who acted, under what authority, with what evidence).

- **AI Agent (the thing)**: the durable, discoverable trust-graph anchor (`core:AIAgent` / `prov:Agent`)
- **Identity (registry-scoped representation)**: what a registry asserts about that agent (`core:AgentIdentity` / `prov:Entity`)
- **Identifier (reference)**: a string/URI/name used to point at an agent or identity (DID, UAID, ENS, etc.)

## AI Agent (the thing)

- A **real actor** in the graph (`prov:Agent`)
- This is what performs activities, is the subject of situations, and is the stable anchor for trust assertions

In short: **the actual AI agent thing is not a registry identity record**.

## Identity (registry-scoped representation)

- A **conceptual thing**
- **Social / legal / epistemic**
- Has properties, roles, trust, reputation, and history
- Exists even if not referenced

**“The agent’s representation within a particular registry.”**

## Identifier (reference)

- A **symbolic reference**
- A string / URI / name
- Used to refer to an identity
- Can change, be aliased, or be replaced

**“The label we use to point at the Agent or its identity record.”**

## Identity as a `prov:Entity` (registry-scoped agent identity)

Yes — **Identity can be a `prov:Entity`** that describes an agent’s identity as asserted within a specific **Agent Identity Registry**.

This is preferred when you want:

- registry-scoped identity
- multiple coexisting identities
- no hard ontological collapse of “agent = identity”

### Core distinction (key pattern) — keep this intact

1) **The AI Agent** (what exists / acts)

```turtle
:Agent_A
  a prov:Agent .
```

This is the actor: AI agent, org agent, smart-account agent, etc. It is the trust-graph anchor.

2) **The Identity record** (what is said about the agent, by a registry)

```turtle
:Identity_ERC8004_4550
  a prov:Entity ;
  a core:AgentIdentity ;
  prov:wasAttributedTo :Agent_A ;
  prov:wasGeneratedBy :ERC8004_Registration ;
  prov:identifier "erc8004:agent:4550" ;
  core:identityRegistry :ERC8004_Registry .
```

This identity is:

- contextual
- registry-bound
- asserted
- epistemic

Not the agent itself — a **representation** of the agent in a system/registry.

### Why Identity should be an Entity

Because identity information:

| Property | Reason |
| --- | --- |
| Is created | Registration happens |
| Can change | Updates, revocations |
| Can be versioned | New assertions |
| Can be invalidated | Deregistration |
| Can conflict | Multiple registries |
| Is contextual | Registry-specific |

All of that screams **`prov:Entity`**, not `prov:Agent`.

## Smart Credentials (issuer-controlled records “about” an identity)

Smart Credentials are a useful fit for the **registry-scoped identity** pattern because they emphasize credentials as records **about** an entity controlled by issuers (not self-asserted profile fields), and support onchain/offchain/zk proofs.

- Reference implementation/spec: [Smart Credentials](https://github.com/nxt3d/smart-credentials)

In AgenticTrust terms, you can treat a smart-credential instance as:

- an **identity/registry-layer artifact** whose statements are *about* an `core:AgentIdentity` (or about an agent via its identity), and
- a source of **attested assertions** (issuer accountability) rather than “the agent speaking about itself”.

### Registry context (critical)

Instead of baking registry logic into the agent, model it explicitly:

```turtle
:ERC8004_Registry
  a prov:Entity ;
  a core:AgentRegistry .
```

Then:

```turtle
:Identity_ERC8004_4550
  prov:wasAttributedTo :Agent_A ;
  prov:wasGeneratedBy :ERC8004_Registration ;
  core:identityRegistry :ERC8004_Registry ;
  prov:wasGeneratedBy :ERC8004_Registration .
```

Now you have:

- registry-scoped truth
- auditability
- clean separation of concerns

### Multiple identities, same agent

This works naturally:

```turtle
:Identity_ERC8004_4550
  a prov:Entity ;
  prov:wasAttributedTo :Agent_A ;
  prov:identifier "erc8004:agent:4550" .

:Identity_HOL_0xabc
  a prov:Entity ;
  prov:wasAttributedTo :Agent_A ;
  prov:identifier "uaid:did:ethr:0xabc;hol" .
```

No contradictions. No need for `owl:sameAs`. No global identity collapse.

### Relationship to DID and UAID (layering)

Think in layers:

| Layer | What it is |
| --- | --- |
| Agent | The actor / “thing” (`prov:Agent`) |
| Identity Entity | Registry-scoped representation (`prov:Entity`) |
| Identifier | Symbolic reference (DID, UAID, ENS, etc.) |
| DID | One identifier family + resolution rules |
| UAID | Routing / resolution identifier |

Example:

```turtle
:Identity_HOL
  prov:identifier "uaid:did:ethr:0xabc;hol" ;
  core:usesDID "did:ethr:0xabc" .
```

The DID anchors cryptography; the identity entity anchors registry meaning.

### What Identity is not

- Not the Agent
- Not a global identifier
- Not a metaphysical “self”

It is:

**An asserted, registry-scoped description/record of an agent’s identity.**

## Diagram: Agent vs Identity (registry-scoped)

```mermaid
classDiagram
direction LR

class Agent["prov:Agent (Agent)"]
class AgentIdentity["core:AgentIdentity (prov:Entity)"]
class AgentRegistry["core:AgentRegistry (prov:Entity)"]
class Registration["Registration (prov:Activity)"]

AgentIdentity --> Agent : wasAttributedTo
AgentIdentity --> Registration : wasGeneratedBy
AgentIdentity --> AgentRegistry : identityRegistry
```

Mermaid note: edge labels avoid CURIEs like `prov:wasAttributedTo` (Mermaid parser limitation). The intended properties are:

- `wasAttributedTo` → `prov:wasAttributedTo` (or `core:identityOf`)
- `wasGeneratedBy` → `prov:wasGeneratedBy`
- `identityRegistry` → `core:identityRegistry` (subPropertyOf `prov:wasAssociatedWith`)

## Optional refinements (recommended)

These convenience terms keep PROV-O clean while giving you domain semantics:

```turtle
core:AgentIdentity rdfs:subClassOf prov:Entity .
core:AgentRegistry rdfs:subClassOf prov:Entity .

core:identityOf
  rdfs:domain core:AgentIdentity ;
  rdfs:range prov:Agent .

core:identityRegistry
  rdfs:domain core:AgentIdentity ;
  rdfs:range core:AgentRegistry .
```

## SPARQL queries

### List all AgentIdentity entities

```sparql
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX core: <https://core.io/ontology/core#>

SELECT ?identity
WHERE {
  ?identity a core:AgentIdentity .
}
ORDER BY ?identity
LIMIT 200
```

### Agent → identities (with provenance + registry)

```sparql
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX core: <https://core.io/ontology/core#>

SELECT DISTINCT
  ?agent
  ?identity
  ?registry
  ?registrationAct
  ?identifier
WHERE {
  ?agent a prov:Agent .

  OPTIONAL { ?agent core:hasIdentity ?identity . }
  OPTIONAL { ?identity core:identityOf ?agent . }
  OPTIONAL { ?identity prov:wasAttributedTo ?agent . }

  OPTIONAL { ?identity core:identityRegistry ?registry . }
  OPTIONAL { ?identity prov:wasAssociatedWith ?registry . }

  OPTIONAL { ?identity prov:wasGeneratedBy ?registrationAct . }
  OPTIONAL { ?identity prov:identifier ?identifier . }
}
ORDER BY ?agent ?identity
LIMIT 200
```

### Agents with multiple identities (no identity collapse)

```sparql
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX core: <https://core.io/ontology/core#>

SELECT ?agent (COUNT(DISTINCT ?identity) AS ?identityCount)
WHERE {
  ?agent a prov:Agent ;
    core:hasIdentity ?identity .
  ?identity a core:AgentIdentity .
}
GROUP BY ?agent
HAVING (COUNT(DISTINCT ?identity) > 1)
ORDER BY DESC(?identityCount) ?agent
LIMIT 200
```

### Identity → DID (cryptographic anchor)

```sparql
PREFIX core: <https://core.io/ontology/core#>

SELECT ?identity ?did
WHERE {
  ?identity a core:AgentIdentity ;
    core:usesDID ?did .
}
ORDER BY ?identity
LIMIT 200
```

### List all AgentRegistry instances

```sparql
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX core: <https://core.io/ontology/core#>

SELECT ?registry ?type
WHERE {
  ?registry a core:AgentRegistry .
  OPTIONAL { ?registry a ?type . }
}
ORDER BY ?registry ?type
LIMIT 200
```

## Where this shows up in the ontology

- **Agents** (`prov:Agent`) are the *things* we reason about and attach trust assertions to.
- **Identifiers** (`core:Identifier`) are the *references* we attach to agents and other identity-bearing entities for lookup, linking, and interoperability.
- **DIDs** (`core:DID`) are a particular identifier family with resolution rules.

See also:

- [`identifiers.md`](./identifiers.md)
- [`agent.md`](./agent.md)
- [`descriptor.md`](./descriptor.md)
- [`agent-registry.md`](./agent-registry.md)


