## Situation layer (DnS) — how trust + work happens

Ontology: `agentictrust-core.owl`

In this ontology, **Situation is not an event**.

- `agentictrust:TrustSituation` is a **prov:Entity**: “what is being claimed to hold”.
- `agentictrust:TrustAssertion` is a **prov:Activity**: the time-scoped act of asserting that situation.

### TrustSituation hierarchy (prov:Entity)

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]
class Situation["agentictrust:Situation"]
class TrustSituation["agentictrust:TrustSituation"]
class RelationshipSituation["agentictrust:RelationshipSituation"]
class ReputationSituation["agentictrust:ReputationSituation"]
class VerificationSituation["agentictrust:VerificationSituation"]

Situation --|> provEntity
TrustSituation --|> Situation
RelationshipSituation --|> TrustSituation
ReputationSituation --|> TrustSituation
VerificationSituation --|> TrustSituation
```

### SPARQL: TrustSituation hierarchy + instances

**List subclasses of `agentictrust:TrustSituation`:**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?cls
WHERE {
  ?cls rdfs:subClassOf* agentictrust:TrustSituation .
}
ORDER BY ?cls
```

**List instances (any subtype of TrustSituation):**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?situation ?type
WHERE {
  ?situation a ?type .
  ?type rdfs:subClassOf* agentictrust:TrustSituation .
}
ORDER BY ?type ?situation
LIMIT 200
```

### TrustAssertion hierarchy (prov:Activity)

```mermaid
classDiagram
direction LR

class provActivity["prov:Activity"]
class SituationAssertion["agentictrust:SituationAssertion"]
class TrustAssertion["agentictrust:TrustAssertion"]
class RelationshipAssertion["agentictrust:RelationshipAssertion"]
class ReputationAssertion["agentictrust:ReputationAssertion"]
class VerificationAssertion["agentictrust:VerificationAssertion"]

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
    ?assertion agentictrust:generatedSituation ?situation .
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
TrustAssertion --> TrustSituation : generatedSituation
```

**SPARQL: TrustAssertion + asserted TrustSituation + description**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?trustAssertion ?trustSituation ?trustDescription
WHERE {
  ?trustAssertion a agentictrust:TrustAssertion .
  OPTIONAL { ?trustAssertion agentictrust:generatedSituation ?trustSituation . }
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
ValidationResponse --> ValidationRequest : generatedSituation
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
  OPTIONAL { ?response agentictrust:generatedSituation ?request . }
  OPTIONAL { ?response erc8004:validatorAgentForResponse ?validator . }
}
ORDER BY ?agent ?response
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
