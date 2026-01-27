## Description layer — Plans (PROV-O + P-PLAN)

Ontology: `apps/ontology/ontology/core.ttl`

This page is about **Descriptions as Plans**:

- **`prov:Plan`** (PROV-O): a plan/specification (an Entity)
- **`p-plan:Plan`** (P-PLAN): a plan vocabulary that complements PROV-O
- **`core:SituationDescription`**: the PROV-native “Description” (schema/pattern for a Situation)
- **`core:TrustDescription`**: specialization of SituationDescription for trust workflows

### SituationDescription and TrustDescription hierarchy

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]
class provPlan["prov:Plan"]
class pplanPlan["p-plan:Plan"]

class SituationDescription["core:SituationDescription"]
class TrustDescription["core:TrustDescription"]

provPlan --|> provEntity
pplanPlan --|> provEntity
SituationDescription --|> provPlan
SituationDescription --|> pplanPlan
TrustDescription --|> SituationDescription
```

**SPARQL: list SituationDescription subclasses**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT ?cls
WHERE {
  ?cls rdfs:subClassOf* core:SituationDescription .
}
ORDER BY ?cls
```

### Situation ↔ SituationDescription (plan applies to situation)

```mermaid
classDiagram
direction LR

class Situation["core:Situation"]
class SituationDescription["core:SituationDescription"]

Situation --> SituationDescription : hasSituationDescription
```

**SPARQL: situations with their descriptions**

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT ?situation ?description
WHERE {
  ?situation core:hasSituationDescription ?description .
}
LIMIT 200
```

### SituationAssertion ↔ SituationDescription (assertion under a plan)

```mermaid
classDiagram
direction LR

class SituationAssertion["core:SituationAssertion"]
class SituationDescription["core:SituationDescription"]

SituationAssertion --> SituationDescription : assertsDescription
```

**SPARQL: assertions and the descriptions they assert under**

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT ?assertion ?description
WHERE {
  ?assertion a core:SituationAssertion ;
    core:assertsDescription ?description .
}
LIMIT 200
```

### TrustDescription as a trust plan (specialization)

```mermaid
classDiagram
direction LR

class TrustDescription["core:TrustDescription"]
class SituationDescription["core:SituationDescription"]
class TrustSituation["core:TrustSituation"]

TrustDescription --|> SituationDescription
TrustSituation --> TrustDescription : hasSituationDescription
```

**SPARQL: TrustSituations and their TrustDescriptions**

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT ?situation ?desc
WHERE {
  ?situation a core:TrustSituation ;
    core:hasSituationDescription ?desc .
  ?desc a core:TrustDescription .
}
LIMIT 200
```


