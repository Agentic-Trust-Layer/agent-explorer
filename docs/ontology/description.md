## Description layer — Plans (PROV-O + P-PLAN)

Ontology: `agentictrust-core.owl`

This page is about **Descriptions as Plans**:

- **`prov:Plan`** (PROV-O): a plan/specification (an Entity)
- **`p-plan:Plan`** (P-PLAN): a plan vocabulary that complements PROV-O
- **`agentictrust:SituationDescription`**: the PROV-native “Description” (schema/pattern for a Situation)
- **`agentictrust:TrustDescription`**: specialization of SituationDescription for trust workflows

### SituationDescription and TrustDescription hierarchy

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]
class provPlan["prov:Plan"]
class pplanPlan["p-plan:Plan"]

class SituationDescription["agentictrust:SituationDescription"]
class TrustDescription["agentictrust:TrustDescription"]

provPlan --|> provEntity
pplanPlan --|> provEntity
SituationDescription --|> provPlan
SituationDescription --|> pplanPlan
TrustDescription --|> SituationDescription
```

**SPARQL: list SituationDescription subclasses**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?cls
WHERE {
  ?cls rdfs:subClassOf* agentictrust:SituationDescription .
}
ORDER BY ?cls
```

### Situation ↔ SituationDescription (plan applies to situation)

```mermaid
classDiagram
direction LR

class Situation["agentictrust:Situation"]
class SituationDescription["agentictrust:SituationDescription"]

Situation --> SituationDescription : hasSituationDescription
```

**SPARQL: situations with their descriptions**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?situation ?description
WHERE {
  ?situation agentictrust:hasSituationDescription ?description .
}
LIMIT 200
```

### SituationAssertion ↔ SituationDescription (assertion under a plan)

```mermaid
classDiagram
direction LR

class SituationAssertion["agentictrust:SituationAssertion"]
class SituationDescription["agentictrust:SituationDescription"]

SituationAssertion --> SituationDescription : assertsDescription
```

**SPARQL: assertions and the descriptions they assert under**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?assertion ?description
WHERE {
  ?assertion a agentictrust:SituationAssertion ;
    agentictrust:assertsDescription ?description .
}
LIMIT 200
```

### TrustDescription as a trust plan (specialization)

```mermaid
classDiagram
direction LR

class TrustDescription["agentictrust:TrustDescription"]
class SituationDescription["agentictrust:SituationDescription"]
class TrustSituation["agentictrust:TrustSituation"]

TrustDescription --|> SituationDescription
TrustSituation --> TrustDescription : hasSituationDescription
```

**SPARQL: TrustSituations and their TrustDescriptions**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?situation ?desc
WHERE {
  ?situation a agentictrust:TrustSituation ;
    agentictrust:hasSituationDescription ?desc .
  ?desc a agentictrust:TrustDescription .
}
LIMIT 200
```


