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

class "prov:Plan" as provPlan
class "p-plan:Plan" as pplanPlan
class "prov:Activity" as provActivity
class "prov:Entity" as provEntity
class "prov:Agent" as provAgent

class "agentictrust:TrustDescription" as TrustDescription
class "agentictrust:TrustSituation" as TrustSituation
class "agentictrust:TrustAssertion" as TrustAssertion
class "agentictrust:VerificationAssertion" as VerificationAssertion
class "agentictrust:ReputationAssertion" as ReputationAssertion
class "agentictrust:Relationship" as Relationship
class "agentictrust:RelationshipAssertion" as RelationshipAssertion

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

class "prov:SoftwareAgent" as provSoftwareAgent
class "prov:Entity" as provEntity
class "prov:Agent" as provAgent

class "agentictrust:AIAgent" as AIAgent
class "agentictrust:AgentMetadata" as AgentMetadata
class "agentictrust:AgentEndpoint" as AgentEndpoint
class "agentictrust:Operator" as Operator
class "agentictrust:EndpointType" as EndpointType

AIAgent --|> provSoftwareAgent
AgentMetadata --|> provEntity
AgentEndpoint --|> provEntity
Operator --|> provAgent
EndpointType --|> provEntity

AIAgent --> AgentMetadata : hasMetadata
AgentMetadata --> AgentEndpoint : hasEndpointEntry
AgentEndpoint --> EndpointType : endpointType
AgentMetadata --> Operator : hasOperator
AgentMetadata --> "agentictrust:Skill" : declaresSkill
```


