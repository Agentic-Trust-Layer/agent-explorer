## AgenticTrust core ontology (`agentictrust.owl`)

Source: `apps/badge-admin/public/ontology/agentictrust.owl`

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
class provAgent["prov:Agent"]

class AIAgent["agentictrust:AIAgent"]
class AgentMetadata["agentictrust:AgentMetadata"]
class AgentEndpoint["agentictrust:AgentEndpoint"]
class Operator["agentictrust:Operator"]
class EndpointType["agentictrust:EndpointType"]

AIAgent --|> provSoftwareAgent
AgentMetadata --|> provEntity
AgentEndpoint --|> provEntity
Operator --|> provAgent
EndpointType --|> provEntity

AIAgent --> AgentMetadata : hasMetadata
AgentMetadata --> AgentEndpoint : hasEndpointEntry
AgentEndpoint --> EndpointType : endpointType
AgentMetadata --> Operator : hasOperator
AgentMetadata --> Skill : declaresSkill
class Skill["agentictrust:Skill"]
```


