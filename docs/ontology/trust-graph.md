## Trust building (trust graph overlay)

This page focuses on **trust building**: how the AgenticTrust ontology expresses the *trust graph* patterns and how ERC registries attach concrete records to those patterns.

### Class hierarchy (key)

```mermaid
classDiagram
direction LR

class provPlan["prov:Plan"]
class provActivity["prov:Activity"]
class provEntity["prov:Entity"]

class TrustDescription["agentictrust:TrustDescription"]
class TrustSituation["agentictrust:TrustSituation"]
class TrustAssertion["agentictrust:TrustAssertion"]
class VerificationAssertion["agentictrust:VerificationAssertion"]
class ReputationAssertion["agentictrust:ReputationAssertion"]
class Relationship["agentictrust:Relationship"]
class RelationshipAssertion["agentictrust:RelationshipAssertion"]

TrustDescription --|> provPlan
TrustSituation --|> provEntity
TrustAssertion --|> provActivity

VerificationAssertion --|> TrustAssertion
ReputationAssertion --|> TrustAssertion
Relationship --|> provEntity
RelationshipAssertion --|> TrustAssertion
```

### Relationship diagram (trust graph overlay)

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]
class provAgent["prov:Agent"]

class TrustDescription["agentictrust:TrustDescription"]
class TrustSituation["agentictrust:TrustSituation"]
class TrustAssertion["agentictrust:TrustAssertion"]
class Relationship["agentictrust:Relationship"]
class RelationshipAssertion["agentictrust:RelationshipAssertion"]

TrustSituation --> TrustDescription : hasSituationDescription
TrustSituation --> TrustDescription : hasSituationDescription
TrustAssertion --> TrustSituation : generatedSituation
TrustAssertion --> provEntity : aboutSubject
RelationshipAssertion --> Relationship : assertsRelationship
TrustAssertion --> Relationship : qualifiesRelationship
provAgent --> TrustAssertion : hasTrustAssertion
```

### Diagram: abstract trust graph overlay

![Trust building (abstract overlay)](./images/sections/trust-building-abstract.png)

Interpretation:

- A **TrustDescription** (“Trust plan”) expresses *what* should be trusted and *why* (roles/constraints/outcomes).
- A **TrustSituation** (“trust event”) is a time-scoped occurrence that **realizes** a description.
- A situation **uses evidence** and is **associated with agents** (who executed/validated).
- The situation **generates** durable **TrustAssertions** (claims you can cite, score, and link).
- Assertions can:
  - be **about** a subject (`aboutSubject`)
  - **qualify** an existing relationship (`qualifiesRelationship`)
  - or **assert**/constitute a relationship (`assertsRelationship`)

### Diagram: mapping to ERC registries (ERC-8004 + ERC-8092)

![Trust building (registry mapping)](./images/sections/trust-building-erc-mapping.png)

How to read this:

- **ERC-8004 validation registry**
  - `erc8004:ValidationRequest` is modeled as a **TrustSituation**
  - `erc8004:ValidationResponse` is modeled as a **VerificationAssertion** (durable claim / on-chain record)
  - the validator is captured via `erc8004:validationValidator` (and optionally links to a known agent identity in data)

- **ERC-8004 reputation registry**
  - `erc8004:Feedback` is modeled as a **ReputationAssertion**
  - links like `erc8004:feedbackClient` and `erc8004:feedbackSkill` express who provided feedback and for which capability

- **ERC-8092 associated accounts storage**
  - `erc8092:RelationshipAssertionERC8092` is modeled as a **RelationshipAssertion** (on-chain relationship record)
  - the relationship instance is `erc8092:RelationshipERC8092`
  - participant accounts are captured via `erc8092:initiatorAccount` / `erc8092:approverAccount`

### Practical “trust building” query patterns

This normalized overlay makes it possible to query trust across registries with a shared shape:

- **Verification**: “show validations about this agent/endpoint”
- **Reputation**: “show feedback and responses for this agent/skill”
- **Relationships**: “show relationship assertions connecting these identities/accounts”


