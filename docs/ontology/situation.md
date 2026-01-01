## Situation layer (DnS) — how trust + work happens

Ontology: `agentictrust-core.owl`

In this ontology, **Situation is not an event**.

- `agentictrust:TrustSituation` is a **prov:Entity**: “what is being claimed to hold”.
- `agentictrust:TrustAssertion` is a **prov:Activity**: the time-scoped act of asserting that situation.

### Situation hierarchy (prov:Entity)

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]
class Situation["agentictrust:Situation"]
class TrustSituation["agentictrust:TrustSituation"]
class ReputationSituation["agentictrust:ReputationSituation"]
class VerificationSituation["agentictrust:VerificationSituation"]
class RelationshipSituation["agentictrust:RelationshipSituation"]

Situation --|> provEntity
TrustSituation --|> Situation
ReputationSituation --|> TrustSituation
VerificationSituation --|> TrustSituation
RelationshipSituation --|> Situation
```

### SPARQL: Situation hierarchy + instances

**List subclasses of `agentictrust:Situation`:**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?cls
WHERE {
  ?cls rdfs:subClassOf* agentictrust:Situation .
}
ORDER BY ?cls
```

**List instances (any subtype of Situation):**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?situation ?type
WHERE {
  ?situation a ?type .
  ?type rdfs:subClassOf* agentictrust:Situation .
}
ORDER BY ?type ?situation
LIMIT 200
```

### SituationAssertion hierarchy (prov:Activity)

```mermaid
classDiagram
direction LR

class provActivity["prov:Activity"]
class SituationAssertion["agentictrust:SituationAssertion"]
class TrustAssertion["agentictrust:TrustAssertion"]
class RelationshipAssertion["agentictrust:RelationshipTrustAssertion"]
class ReputationAssertion["agentictrust:ReputationTrustAssertion"]
class VerificationAssertion["agentictrust:VerificationTrustAssertion"]

SituationAssertion --|> provActivity
TrustAssertion --|> SituationAssertion
RelationshipAssertion --|> TrustAssertion
ReputationAssertion --|> TrustAssertion
VerificationAssertion --|> TrustAssertion
```

### SPARQL: TrustAssertion hierarchy + instances

**List subclasses of `agentictrust:TrustAssertion`:**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?cls
WHERE {
  ?cls rdfs:subClassOf* agentictrust:TrustAssertion .
}
ORDER BY ?cls
```

**TrustAssertions and the TrustSituation they generated:**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?assertion ?assertionType ?situation ?situationType
WHERE {
  ?assertion a ?assertionType .
  ?assertionType rdfs:subClassOf* agentictrust:TrustAssertion .
  OPTIONAL {
    ?assertion agentictrust:assertsSituation ?situation .
    OPTIONAL { ?situation a ?situationType . }
  }
}
ORDER BY ?assertionType ?assertion
LIMIT 200
```

### TrustSituation ↔ TrustAssertion (core links)

```mermaid
classDiagram
direction LR

class TrustDescription["agentictrust:TrustDescription"]
class TrustSituation["agentictrust:TrustSituation"]
class TrustAssertion["agentictrust:TrustAssertion"]

TrustSituation --> TrustDescription : hasSituationDescription
TrustAssertion --> TrustSituation : assertsSituation
```

**SPARQL: TrustAssertion + asserted TrustSituation + description**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?trustAssertion ?trustSituation ?trustDescription
WHERE {
  ?trustAssertion a agentictrust:TrustAssertion .
  OPTIONAL { ?trustAssertion agentictrust:assertsSituation ?trustSituation . }
  OPTIONAL { ?trustSituation agentictrust:hasSituationDescription ?trustDescription . }
}
LIMIT 200
```

### ERC-8004 TrustSituation + TrustAssertion flows

Ontology: `ERC8004.owl`

#### Validation (request → response)

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
class ValidationRequest["erc8004:ValidationRequest"]
class ValidationResponse["erc8004:ValidationResponse"]
class provAgent["prov:Agent"]

AIAgent --> ValidationResponse : hasValidation
ValidationResponse --> ValidationRequest : validationRespondsToRequest
ValidationResponse --> ValidationRequest : assertsSituation
ValidationResponse --> provAgent : validatorAgentForResponse
```

**SPARQL: validation responses and their requests**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?response ?request ?validator
WHERE {
  ?agent erc8004:hasValidation ?response .
  OPTIONAL { ?response erc8004:validationRespondsToRequest ?request . }
  OPTIONAL { ?response agentictrust:assertsSituation ?request . }
  OPTIONAL { ?response erc8004:validatorAgentForResponse ?validator . }
}
ORDER BY ?agent ?response
LIMIT 200
```

### ERC-8092 relationship flow

Ontology: `ERC8092.owl`

```mermaid
classDiagram
direction LR

class Account["agentictrustEth:Account"]
class Relationship["erc8092:RelationshipERC8092"]
class RelationshipAssertion["erc8092:RelationshipAssertionERC8092"]
class RelationshipAccount["erc8092:RelationshipAccount"]
class RelationshipSituation["agentictrust:RelationshipSituation"]
class RelationshipRevocation["erc8092:RelationshipRevocationAssertion"]

Account --> RelationshipAssertion : hasRelationshipAssertion
RelationshipAssertion --> Relationship : assertsRelationship
RelationshipAssertion --> RelationshipSituation : assertsSituation
RelationshipSituation --> Relationship : aboutSubject

Relationship --> RelationshipAccount : hasRelationshipAccount
Account --> RelationshipAccount : ownsRelationshipAccount

RelationshipRevocation --> RelationshipAssertion : revocationOfRelationshipAssertion

note for RelationshipAssertion "Edge labels omit CURIE prefixes for Mermaid parsing. Mappings:\n- hasRelationshipAssertion = erc8092:hasRelationshipAssertion\n- assertsRelationship = agentictrust:assertsRelationship\n- assertsSituation = agentictrust:assertsSituation\n- aboutSubject = agentictrust:aboutSubject\n- hasRelationshipAccount = agentictrust:hasRelationshipAccount\n- ownsRelationshipAccount = erc8092:ownsRelationshipAccount\n- revocationOfRelationshipAssertion = erc8092:revocationOfRelationshipAssertion"
```

**SPARQL: relationship assertions → relationship + participants**

```sparql
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?rel ?assertion ?initiator ?approver
WHERE {
  ?assertion a erc8092:RelationshipAssertionERC8092 .
  OPTIONAL { ?assertion agentictrust:assertsRelationship ?rel . }
  OPTIONAL { ?assertion erc8092:initiator ?initiator . }
  OPTIONAL { ?assertion erc8092:approver ?approver . }
}
ORDER BY ?rel ?assertion
LIMIT 200
```

**SPARQL: relationship revocations**

```sparql
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>

SELECT ?revocation ?ofAssertion ?revokedAt
WHERE {
  ?revocation a erc8092:RelationshipRevocationAssertion .
  OPTIONAL { ?revocation erc8092:revocationOfRelationshipAssertion ?ofAssertion . }
  OPTIONAL { ?ofAssertion erc8092:revokedAt ?revokedAt . }
}
ORDER BY DESC(?revokedAt)
LIMIT 200
```

### Trust graph overlay (relationships + subjects)

This section shows the **registry-agnostic overlay** used to connect different trust signals into a single query shape.

```mermaid
classDiagram
direction LR

class provAgent["prov:Agent"]
class provEntity["prov:Entity"]

class TrustAssertion["agentictrust:TrustAssertion"]
class Relationship["agentictrust:Relationship"]
class RelationshipTrustAssertion["agentictrust:RelationshipTrustAssertion"]

provAgent --> TrustAssertion : hasTrustAssertion

TrustAssertion --> provEntity : aboutSubject
TrustAssertion --> Relationship : qualifiesRelationship
RelationshipTrustAssertion --> Relationship : assertsRelationship

note for TrustAssertion "Edge labels omit CURIE prefixes for Mermaid parsing. Mappings:\n- hasTrustAssertion = agentictrust:hasTrustAssertion\n- aboutSubject = agentictrust:aboutSubject\n- qualifiesRelationship = agentictrust:qualifiesRelationship\n- assertsRelationship = agentictrust:assertsRelationship"
```

**SPARQL: assertions about a subject (generic)**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?assertion ?subject
WHERE {
  ?assertion a agentictrust:TrustAssertion .
  ?assertion agentictrust:aboutSubject ?subject .
}
LIMIT 200
```

**SPARQL: relationship-qualified assertions**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?assertion ?relationship
WHERE {
  ?assertion a agentictrust:TrustAssertion ;
    agentictrust:qualifiesRelationship ?relationship .
}
LIMIT 200
```

**SPARQL: relationship-constitutive assertions**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?assertion ?relationship
WHERE {
  ?assertion a agentictrust:RelationshipTrustAssertion ;
    agentictrust:assertsRelationship ?relationship .
}
LIMIT 200
```

#### Reputation / feedback

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
class Feedback["erc8004:Feedback"]
class provAgent["prov:Agent"]
class Skill["agentictrust:Skill"]

AIAgent --> Feedback : hasFeedback
Feedback --> provAgent : feedbackClient
Feedback --> Skill : feedbackSkill
```

**SPARQL: feedback records**

```sparql
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?feedback ?score ?ratingPct
WHERE {
  ?agent erc8004:hasFeedback ?feedback .
  OPTIONAL { ?feedback erc8004:feedbackScore ?score . }
  OPTIONAL { ?feedback erc8004:feedbackRatingPct ?ratingPct . }
}
ORDER BY ?agent ?feedback
LIMIT 200
```
