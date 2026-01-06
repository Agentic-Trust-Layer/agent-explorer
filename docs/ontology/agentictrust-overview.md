## AgenticTrust ontology overview (`agentictrust-core.owl`)

**Source**: `apps/badge-admin/public/ontology/agentictrust-core.owl`

> **Quick Navigation**: See [`README.md`](./README.md) for the full information architecture overview, ontology hierarchy, and complete documentation index.

This document provides a focused overview of the AgenticTrust core ontology design patterns, key classes, and relationships. For detailed documentation on specific concepts, see the [reading guide](#reading-guide) below.

AgenticTrust ontology uses **design patterns** inspired by well-known foundations:

- **PROV-O (`prov-o`)**: a W3C provenance model for describing **Agents**, **Activities**, and **Entities**, plus relations like “used”, “generated”, and timestamps. We use it to make trust events and artifacts queryable in a standard way across tools.
- **P-PLAN (`p-plan`)**: a lightweight planning/workflow vocabulary that complements PROV-O for describing **plans** and their realizations. We use it to align “descriptions/plans” with “situations/executions”.
- **DnS / DOLCE principles** (DOLCE+DnS): foundational ontology ideas that distinguish:
  - **Descriptions** (normative specifications: roles, constraints, intended outcomes)
  - **Situations** (time-scoped realizations of a description)
  - and the **information objects** generated/used by situations

We treat these as **guiding principles** for modeling trust, rather than importing a full DOLCE/DnS upper-ontology module.

### Layering diagram (principles → core → registries)

![Ontology layering: patterns → AgenticTrust → registry layers](./images/sections/overview-stack.png)

### Full diagram (generated)

- PNG: `docs/ontology/images/agentictrust.png`
- SVG: `docs/ontology/images/agentictrust.svg`

![AgenticTrust ontology diagram](./images/agentictrust.png)

### Why a common “AgenticTrust” core matters

ERC registries and protocols encode related trust facts (identity/metadata, validation, feedback, relationships, protocol capabilities) but expose them in **different event shapes and storage locations**.

By mapping these into a shared AgenticTrust core (TrustDescription / TrustSituation / TrustAssertion, plus Skills/Intents/Tasks), we get a **normalized, cross-registry view** that the `agentictrust.io` application can use for:

- **Agent discovery**: consistent filtering/search across sources (skills, endpoints, intent/task types, validations, feedback, relationships)
- **Community development**: shared vocabulary to build “communities” around task types, skills, validators, relationship networks, and contribution/reputation signals
- **Composable analytics**: one SPARQL/graph model for ranking, clustering, and trend analysis across multiple registries

## AgenticTrust core ontology (key classes + relationships)

### Core trust model (DnS + PROV-O + P-PLAN)

- **TrustDescription**: normative “what/why” (subclass of `prov:Plan` and `p-plan:Plan`)
- **TrustSituation**: epistemic/social object (“what is being claimed to hold”) (subclass of `prov:Entity`)
- **TrustAssertion**: durable assertion record (subclass of `agentictrust:AttestedAssertion` ⊑ `prov:Entity`)
- **TrustAssertionAct**: asserting act (“who asserted what, when”) (subclass of `prov:Activity`)
- **Relationship**: persistent relationship instance (subclass of `prov:Entity`)
- **RelationshipTrustAssertion**: constitutive assertion about a `Relationship` (subclass of `TrustAssertion`)

```mermaid
classDiagram
direction LR

class provPlan["prov:Plan"]
class pplanPlan["p-plan:Plan"]
class provActivity["prov:Activity"]
class provEntity["prov:Entity"]
class provAgent["prov:Agent"]

class TrustDescription["agentictrust:TrustDescription"]
class TrustSituation["agentictrust:TrustSituation"]
class TrustAssertion["agentictrust:TrustAssertion"]
class TrustAssertionAct["agentictrust:TrustAssertionAct"]
class VerificationAssertion["agentictrust:VerificationTrustAssertion"]
class ReputationAssertion["agentictrust:ReputationTrustAssertion"]
class Relationship["agentictrust:Relationship"]
class RelationshipAssertion["agentictrust:RelationshipTrustAssertion"]

TrustDescription --|> provPlan
TrustDescription --|> pplanPlan
TrustSituation --|> provEntity
TrustAssertion --|> provEntity
TrustAssertionAct --|> provActivity
VerificationAssertion --|> TrustAssertion
ReputationAssertion --|> TrustAssertion
Relationship --|> provEntity
RelationshipAssertion --|> TrustAssertion

TrustSituation --> TrustDescription : hasSituationDescription
TrustAssertionAct --> TrustSituation : assertsSituation
TrustAssertionAct --> provEntity : aboutSubject
RelationshipAssertion --> Relationship : assertsRelationship
TrustAssertionAct --> Relationship : qualifiesRelationship
provAgent --> TrustAssertionAct : hasTrustAssertion
```

### Agent identity + metadata (core)

```mermaid
classDiagram
direction LR

class provSoftwareAgent["prov:SoftwareAgent"]
class provEntity["prov:Entity"]

class AIAgent["agentictrust:AIAgent"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class EndpointType["agentictrust:EndpointType"]
class Endpoint["agentictrust:Endpoint"]
class AgentSkill["agentictrust:AgentSkill"]
class AgentSkillClassification["agentictrust:AgentSkillClassification"]

AIAgent --|> provSoftwareAgent
AgentDescriptor --|> provEntity
Endpoint --|> provEntity
EndpointType --|> provEntity

AIAgent --> AgentDescriptor : hasAgentDescriptor
AgentDescriptor --> Endpoint : hasEndpoint
Endpoint --> EndpointType : endpointType
AgentDescriptor --> AgentSkill : hasSkill
AgentSkill --> AgentSkillClassification : hasSkillClassification
```

### Reading guide

- **Agent** (class hierarchy and relationships): see [`agent.md`](./agent.md)
- **Agent identity vs Identifier**: see [`agent-identity.md`](./agent-identity.md)
- **Descriptor** (resolver-produced metadata): see [`descriptor.md`](./descriptor.md)
- **OIDC-A mapping** (OpenID Connect for Agents): see [`oidc-a.md`](./oidc-a.md)
- **Protocols and Endpoints** (A2A, MCP): see [`protocols-endpoints.md`](./protocols-endpoints.md)
- **Description / Plan** (PROV-O + P-PLAN): see [`description.md`](./description.md)
- **Situation** (DnS / activities): see [`situation.md`](./situation.md)
- **Provenance** (PROV-O grounding): see [`provenance.md`](./provenance.md)
- **Discovery** (skills, intents, tasks, OASF alignment): see [`discovery.md`](./discovery.md)
- **Intent** (IntentType and IntentSituation): see [`intent.md`](./intent.md)
- **Trust building** (graph overlay): see the **Trust graph overlay** section in [`situation.md`](./situation.md)
- **Trust graph** (PROV grounding): see [`trust-graph.md`](./trust-graph.md)
- **Protocol-specific** (ERC-8004, ERC-8092, HOL): see [`erc8004.md`](./erc8004.md), [`erc8092.md`](./erc8092.md), [`hol.md`](./hol.md)


