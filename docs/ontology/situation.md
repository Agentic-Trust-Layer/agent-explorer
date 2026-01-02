## Situation layer (DnS) — how trust + work happens

Ontology: `agentictrust-core.owl`

In this ontology, **Situation is not an event**.

- `agentictrust:TrustSituation` is a **prov:Entity**: “what is being claimed to hold”.
- `agentictrust:TrustAssertion` is a **prov:Entity**: the durable trust claim record (citable).
- `agentictrust:TrustAssertionAct` is a **prov:Activity**: the time-scoped act that generates the record and asserts a situation.

### Situation hierarchy (prov:Entity)

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]
class Situation["agentictrust:Situation"]
class TrustSituation["agentictrust:TrustSituation"]
class ReputationTrustSituation["agentictrust:ReputationTrustSituation"]
class VerificationTrustSituation["agentictrust:VerificationTrustSituation"]
class RelationshipSituation["agentictrust:RelationshipSituation"]
class RelationshipTrustSituation["agentictrust:RelationshipTrustSituation"]

Situation --|> provEntity
TrustSituation --|> Situation
ReputationTrustSituation --|> TrustSituation
VerificationTrustSituation --|> TrustSituation
RelationshipSituation --|> Situation
RelationshipTrustSituation --|> TrustSituation
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

### AssertionAct hierarchy (prov:Activity)

```mermaid
classDiagram
direction LR

class provActivity["prov:Activity"]
class AssertionAct["agentictrust:AssertionAct"]
class TrustAssertionAct["agentictrust:TrustAssertionAct"]
class RelationshipAssertionAct["agentictrust:RelationshipTrustAssertionAct"]
class ReputationAssertionAct["agentictrust:ReputationTrustAssertionAct"]
class VerificationAssertionAct["agentictrust:VerificationTrustAssertionAct"]

AssertionAct --|> provActivity
TrustAssertionAct --|> AssertionAct
RelationshipAssertionAct --|> TrustAssertionAct
ReputationAssertionAct --|> TrustAssertionAct
VerificationAssertionAct --|> TrustAssertionAct
```

### AssertionRecord hierarchy (prov:Entity)

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]
class AssertionRecord["agentictrust:AssertionRecord"]
class TrustAssertion["agentictrust:TrustAssertion"]
class RelationshipAssertion["agentictrust:RelationshipTrustAssertion"]
class ReputationAssertion["agentictrust:ReputationTrustAssertion"]
class VerificationAssertion["agentictrust:VerificationTrustAssertion"]

AssertionRecord --|> provEntity
TrustAssertion --|> AssertionRecord
RelationshipAssertion --|> TrustAssertion
ReputationAssertion --|> TrustAssertion
VerificationAssertion --|> TrustAssertion
```

### SPARQL: TrustAssertion (records) + asserted situations

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
    ?assertion agentictrust:recordsSituation ?situation .
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
class TrustAssertionAct["agentictrust:TrustAssertionAct"]

TrustSituation --> TrustDescription : hasSituationDescription
TrustAssertion --> TrustSituation : recordsSituation
TrustAssertionAct --> TrustSituation : assertsSituation
TrustAssertionAct --> TrustAssertion : generatedAssertionRecord
```

**SPARQL: TrustAssertion + asserted TrustSituation + description**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?trustAssertion ?trustSituation ?trustDescription
WHERE {
  ?trustAssertion a agentictrust:TrustAssertion .
  OPTIONAL { ?trustAssertion agentictrust:recordsSituation ?trustSituation . }
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
class ValidationRequest["agentictrust:VerificationRequestSituation"]
class ValidationResponse["erc8004:ValidationResponse"]
class provAgent["prov:Agent"]

AIAgent --> ValidationResponse : hasValidation
ValidationResponse --> ValidationRequest : validationRespondsToRequest
ValidationResponse --> ValidationRequest : recordsSituation
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
  OPTIONAL { ?response agentictrust:recordsSituation ?request . }
  OPTIONAL { ?response erc8004:validatorAgentForResponse ?validator . }
}
ORDER BY ?agent ?response
LIMIT 200
```

### ERC-8092 relationship flow

Ontology: `ERC8092.owl` (assertion-side only)

```mermaid
classDiagram
direction LR

class Account["agentictrustEth:Account"]
class Relationship["agentictrustEth:AccountRelationship"]
class AssociatedAccounts["erc8092:AssociatedAccounts8092"]
class RelationshipSituation["agentictrust:RelationshipTrustSituation"]
class AssociatedAccountsRevocation["erc8092:AssociatedAccountsRevocation8092"]

Account --> AssociatedAccounts : hasAssociatedAccounts
AssociatedAccounts --> RelationshipSituation : recordsSituation
RelationshipSituation --> Relationship : aboutSubject

AssociatedAccountsRevocation --> AssociatedAccounts : revocationOfAssociatedAccounts
```

Mappings (diagram edge labels → ontology properties):

- **hasAssociatedAccounts** → `erc8092:hasAssociatedAccounts`
- **recordsSituation** → `agentictrust:recordsSituation`
- **aboutSubject** → `agentictrust:aboutSubject`
- **revocationOfAssociatedAccounts** → `erc8092:revocationOfAssociatedAccounts`

**SPARQL: relationship assertions → relationship + participants**

```sparql
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?situation ?assertion ?initiator ?approver
WHERE {
  ?assertion a erc8092:AssociatedAccounts8092 .
  OPTIONAL { ?assertion agentictrust:recordsSituation ?situation . }
  OPTIONAL { ?assertion erc8092:initiator ?initiator . }
  OPTIONAL { ?assertion erc8092:approver ?approver . }
}
ORDER BY ?situation ?assertion
LIMIT 200
```

**SPARQL: relationship revocations**

```sparql
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>

SELECT ?revocation ?ofAssertion ?revokedAt
WHERE {
  ?revocation a erc8092:AssociatedAccountsRevocation8092 .
  OPTIONAL { ?revocation erc8092:revocationOfAssociatedAccounts ?ofAssertion . }
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
class RelationshipTrustSituation["agentictrust:RelationshipTrustSituation"]

provAgent --> TrustAssertion : hasTrustAssertion

TrustAssertion --> provEntity : aboutSubject
TrustAssertion --> Relationship : qualifiesRelationship
TrustAssertion --> RelationshipTrustSituation : recordsSituation
RelationshipTrustSituation --> Relationship : aboutSubject
```

Mappings (diagram edge labels → ontology properties):

- **hasTrustAssertion** → `agentictrust:hasTrustAssertion`
- **aboutSubject** → `agentictrust:aboutSubject`
- **qualifiesRelationship** → `agentictrust:qualifiesRelationship`
- **recordsSituation** → `agentictrust:recordsSituation`

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

**SPARQL: relationship trust situations asserted by trust assertions**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?assertion ?situation ?relationship
WHERE {
  ?assertion a agentictrust:TrustAssertion ;
    agentictrust:recordsSituation ?situation .
  ?situation a agentictrust:RelationshipTrustSituation ;
    agentictrust:aboutSubject ?relationship .
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
