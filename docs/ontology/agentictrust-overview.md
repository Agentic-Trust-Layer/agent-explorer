## AgenticTrust ontology overview (`agentictrust.owl`)

Source: `apps/badge-admin/public/ontology/agentictrust.owl`

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
- **TrustSituation**: time-scoped realization (subclass of `prov:Activity`)
- **TrustAssertion**: durable claim (subclass of `prov:Entity`)
- **Relationship**: persistent relationship instance (subclass of `prov:Entity`)
- **RelationshipAssertion**: constitutive assertion about a `Relationship` (subclass of `TrustAssertion`)

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
class VerificationAssertion["agentictrust:VerificationAssertion"]
class ReputationAssertion["agentictrust:ReputationAssertion"]
class Relationship["agentictrust:Relationship"]
class RelationshipAssertion["agentictrust:RelationshipAssertion"]

TrustDescription --|> provPlan
TrustDescription --|> pplanPlan
TrustSituation --|> provActivity
TrustAssertion --|> provEntity
VerificationAssertion --|> TrustAssertion
ReputationAssertion --|> TrustAssertion
Relationship --|> provEntity
RelationshipAssertion --|> TrustAssertion

TrustSituation --> TrustDescription : realizesDescription
TrustSituation --> TrustAssertion : generatedAssertion
TrustAssertion --> provEntity : aboutSubject
RelationshipAssertion --> Relationship : assertsRelationship
TrustAssertion --> Relationship : qualifiesRelationship
provAgent --> TrustAssertion : hasTrustAssertion
```

### Agent identity + metadata (core)

```mermaid
classDiagram
direction LR

class provSoftwareAgent["prov:SoftwareAgent"]
class provEntity["prov:Entity"]

class AIAgent["agentictrust:AIAgent"]
class AgentMetadata["agentictrust:AgentMetadata"]
class AgentEndpoint["agentictrust:AgentEndpoint"]
class OperatorIdentifier["agentictrust:OperatorIdentifier"]
class EndpointType["agentictrust:EndpointType"]

AIAgent --|> provSoftwareAgent
AgentMetadata --|> provEntity
AgentEndpoint --|> provEntity
OperatorIdentifier --|> provEntity
EndpointType --|> provEntity

AIAgent --> AgentMetadata : hasMetadata
AgentMetadata --> AgentEndpoint : hasEndpointEntry
AgentEndpoint --> EndpointType : endpointType
AgentMetadata --> OperatorIdentifier : hasOperatorIdentifier
AgentMetadata --> Skill : declaresSkill
class Skill["agentictrust:Skill"]
```

### Reading guide

- **Description** (DnS): see [`description.md`](./description.md)
- **Situation** (DnS / activities): see [`situation.md`](./situation.md)
- **Provenance** (PROV-O grounding): see [`provenance.md`](./provenance.md)
- **Skills / intents / tasks**: see [`skills-intents-tasks.md`](./skills-intents-tasks.md)
- **Discovery** (intent-driven): see [`discovery.md`](./discovery.md)
- **Trust building** (graph overlay): see [`trust-graph.md`](./trust-graph.md)
- **OASF mapping** (AGNTCY): see [`oasf.md`](./oasf.md)


