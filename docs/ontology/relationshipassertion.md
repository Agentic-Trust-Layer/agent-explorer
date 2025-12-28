## RelationshipAssertion (assertion → account → agent)

This page documents the **RelationshipAssertion → RelationshipAccount → Agent** pattern used to represent ERC‑8092 “associated accounts” data in a graph-friendly way.

### Diagram

```mermaid
classDiagram
direction LR

class provAgent["prov:Agent"]

class AIAgent["agentictrust:AIAgent"]
class Relationship["agentictrust:Relationship"]
class RelationshipAssertion["agentictrust:RelationshipAssertion"]

class ERC8092Relationship["erc8092:ERC8092Relationship"]
class ERC8092RelationshipAssertion["erc8092:ERC8092RelationshipAssertion"]
class RelationshipAccount["erc8092:RelationshipAccount"]

ERC8092Relationship --|> Relationship
ERC8092RelationshipAssertion --|> RelationshipAssertion
AIAgent --|> provAgent

RelationshipAssertion --> Relationship : assertsRelationship (agentictrust)

ERC8092RelationshipAssertion --> provAgent : initiator (erc8092)
ERC8092RelationshipAssertion --> provAgent : approver (erc8092)
ERC8092RelationshipAssertion --> RelationshipAccount : initiatorAccount (erc8092)
ERC8092RelationshipAssertion --> RelationshipAccount : approverAccount (erc8092)

provAgent --> RelationshipAccount : ownsRelationshipAccount (erc8092)
```

### SPARQL Queries (demonstrating property relationships)

**Query RelationshipAssertion with Relationship and Accounts:**
```sparql
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?relationshipAssertion ?relationship ?initiatorAccount ?approverAccount ?initiator ?approver
WHERE {
  ?relationshipAssertion a erc8092:ERC8092RelationshipAssertion .
  
  OPTIONAL {
    ?relationshipAssertion agentictrust:assertsRelationship ?relationship .
  }
  OPTIONAL {
    ?relationshipAssertion erc8092:initiatorAccount ?initiatorAccount .
  }
  OPTIONAL {
    ?relationshipAssertion erc8092:approverAccount ?approverAccount .
  }
  OPTIONAL {
    ?relationshipAssertion erc8092:initiator ?initiator .
  }
  OPTIONAL {
    ?relationshipAssertion erc8092:approver ?approver .
  }
}
```

**Query Agent with RelationshipAccounts via ownsRelationshipAccount:**
```sparql
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?agentId ?relationshipAccount ?relationshipAssertion
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    erc8092:ownsRelationshipAccount ?relationshipAccount .
  
  OPTIONAL {
    {
      ?relationshipAssertion erc8092:initiatorAccount ?relationshipAccount .
    }
    UNION
    {
      ?relationshipAssertion erc8092:approverAccount ?relationshipAccount .
    }
  }
}
ORDER BY ?agentId
```

### Core idea

- **Relationship assertion** (`erc8092:ERC8092RelationshipAssertion`) is the on-chain record.
- It names the participant **relationship accounts**:
  - `erc8092:initiatorAccount`
  - `erc8092:approverAccount`
- Those accounts are connected to the controlling identity via:
  - `erc8092:ownsRelationshipAccount` (domain `prov:Agent`, typically `agentictrust:AIAgent`)
- The assertion also **asserts** the underlying relationship instance:
  - `agentictrust:assertsRelationship` → `erc8092:ERC8092Relationship`

This gives you a clean query path:

- `RelationshipAssertion → RelationshipAccount ← ownsRelationshipAccount ← AIAgent`


