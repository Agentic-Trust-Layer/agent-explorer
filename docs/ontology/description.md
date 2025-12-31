## Description layer (DnS) — TrustDescription + metadata

Ontology: `agentictrust-core.owl`

### Class hierarchy (key)

```mermaid
classDiagram
direction LR

class provPlan["prov:Plan"]
class pplanPlan["p-plan:Plan"]
class provEntity["prov:Entity"]

class TrustDescription["agentictrust:TrustDescription"]
class AgentEndpoint["agentictrust:AgentEndpoint"]
class EndpointType["agentictrust:EndpointType"]
class OperatorIdentifier["agentictrust:OperatorIdentifier"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class Protocol["agentictrust:Protocol"]
class ProtocolDescriptor["agentictrust:ProtocolDescriptor"]
class A2AProtocolDescriptor["agentictrust:A2AProtocolDescriptor"]
class MCPProtocolDescriptor["agentictrust:MCPProtocolDescriptor"]
class Skill["agentictrust:Skill"]

TrustDescription --|> provPlan
TrustDescription --|> pplanPlan

AgentEndpoint --|> provEntity
EndpointType --|> provEntity
OperatorIdentifier --|> provEntity
AgentDescriptor --|> provEntity
Protocol --|> provEntity
ProtocolDescriptor --|> provEntity
Skill --|> provEntity

A2AProtocolDescriptor --|> ProtocolDescriptor
MCPProtocolDescriptor --|> ProtocolDescriptor
```

### Relationship diagram (properties)

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
class AgentEndpoint["agentictrust:AgentEndpoint"]
class EndpointType["agentictrust:EndpointType"]
class OperatorIdentifier["agentictrust:OperatorIdentifier"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class Skill["agentictrust:Skill"]
class Endpoint["agentictrust:Endpoint"]

AIAgent --> AgentDescriptor : hasAgentDescriptor

AgentDescriptor --> AgentEndpoint : hasEndpointEntry
AgentEndpoint --> EndpointType : endpointType
AgentDescriptor --> OperatorIdentifier : hasOperatorIdentifier

AgentDescriptor --> Skill : declaresSkill
AgentDescriptor --> Skill : hasSkill
AgentDescriptor --> Endpoint : hasEndpoint
```

### SPARQL Queries (demonstrating property relationships)

**Query Agent with AgentDescriptor and Endpoints:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?agentId ?agentDescriptor ?endpoint ?endpointType
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasAgentDescriptor ?agentDescriptor .
  
  OPTIONAL {
    ?agentDescriptor agentictrust:hasEndpoint ?endpoint .
  }
  OPTIONAL {
    ?agentDescriptor agentictrust:hasEndpointEntry ?endpointEntry .
    ?endpointEntry agentictrust:endpointType ?endpointType .
  }
}
ORDER BY ?agentId
```

**Query AgentDescriptor with Skills:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?agentDescriptor ?skill ?skillLabel
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:hasAgentDescriptor ?agentDescriptor .
  
  ?agentDescriptor agentictrust:hasSkill ?skill .
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
}
```

**Query AgentDescriptor with OperatorIdentifier:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?agentDescriptor ?operatorIdentifier ?operatorValue
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:hasAgentDescriptor ?agentDescriptor .
  
  OPTIONAL {
    ?agentDescriptor agentictrust:hasOperatorIdentifier ?operatorIdentifier .
    ?operatorIdentifier agentictrust:operatorIdentifierValue ?operatorValue .
  }
}
```

### Diagrams (how Description supports other areas)

#### Description → Situation

![Description → Situation](./images/sections/description-to-situation.png)

#### Description → Discovery (agent metadata + skills)

![Description → Discovery](./images/sections/description-to-discovery.png)

#### Description → Execution (tasks + invocations + routing)

![Description → Execution](./images/sections/description-to-execution.png)

### TrustDescription (DnS “Description”)

- **Class**: `agentictrust:TrustDescription`
- **Meaning**: the normative “what/why” — roles, constraints, intended outcomes
- **Grounding**: subclass of `prov:Plan` and `p-plan:Plan`

### Key relation

- **TrustSituation → TrustDescription**: `agentictrust:hasSituationDescription`

### Agent discovery metadata (core)

These are core, protocol-agnostic descriptor concepts:

- **`agentictrust:AgentDescriptor`**: generic descriptor container (offchain)
- **`agentictrust:AgentEndpoint`**: endpoint entry (name/endpoint/version)
- **`agentictrust:EndpointType`**: endpoint taxonomy value
- **`agentictrust:OperatorIdentifier`**: operator identifier artifact (address/DID/CAIP-10)

### Descriptor → skills

- **`agentictrust:declaresSkill`**: `AgentDescriptor` → `Skill`

### Where ERC8004 registration fits

ERC8004 registration is a *specialized metadata bundle* defined in `ERC8004.owl`:

- `erc8004:AgentRegistration` + component metadata
- See [`erc8004.md`](./erc8004.md)


