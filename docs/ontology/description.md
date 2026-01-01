## Description layer — Descriptor strategy + TrustDescription

Ontology: `agentictrust-core.owl`

This page is about **Descriptors** (resolver-produced metadata) and **TrustDescription** (plans).

### Descriptor class hierarchy (exclude AgentDescriptor)

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]

class Descriptor["agentictrust:Descriptor"]
class IdentifierDescriptor["agentictrust:IdentifierDescriptor"]
class IdentityDescriptor["agentictrust:IdentityDescriptor"]
class NameDescriptor["agentictrust:NameDescriptor"]
class ProtocolDescriptor["agentictrust:ProtocolDescriptor"]
class A2AProtocolDescriptor["agentictrust:A2AProtocolDescriptor"]
class MCPProtocolDescriptor["agentictrust:MCPProtocolDescriptor"]

Descriptor --|> provEntity
IdentifierDescriptor --|> Descriptor
IdentityDescriptor --|> Descriptor
NameDescriptor --|> Descriptor
ProtocolDescriptor --|> Descriptor
A2AProtocolDescriptor --|> ProtocolDescriptor
MCPProtocolDescriptor --|> ProtocolDescriptor
```

**SPARQL: list Descriptor subclasses**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?cls
WHERE {
  ?cls rdfs:subClassOf* agentictrust:Descriptor .
}
ORDER BY ?cls
```

### Descriptor relationships (Endpoint, Skill, Identifier)

```mermaid
classDiagram
direction LR

class Descriptor["agentictrust:Descriptor"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class AgentEndpoint["agentictrust:AgentEndpoint"]
class EndpointType["agentictrust:EndpointType"]
class Skill["agentictrust:Skill"]
class Endpoint["agentictrust:Endpoint"]

class Identifier["agentictrust:Identifier"]
class IdentifierDescriptor["agentictrust:IdentifierDescriptor"]

Identifier --> Descriptor : hasDescriptor
AgentDescriptor --> AgentEndpoint : hasEndpointEntry
AgentEndpoint --> EndpointType : endpointType
AgentDescriptor --> Skill : declaresSkill
AgentDescriptor --> Skill : hasSkill
AgentDescriptor --> Endpoint : hasEndpoint
```

**SPARQL: identifiers and their descriptor**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?identifier ?descriptor
WHERE {
  ?identifier a agentictrust:Identifier ;
    agentictrust:hasDescriptor ?descriptor .
}
LIMIT 200
```

### Agent → AgentDescriptor (and its metadata graph)

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class AgentEndpoint["agentictrust:AgentEndpoint"]
class EndpointType["agentictrust:EndpointType"]
class Skill["agentictrust:Skill"]
class Endpoint["agentictrust:Endpoint"]

AIAgent --> AgentDescriptor : hasAgentDescriptor
AgentDescriptor --> AgentEndpoint : hasEndpointEntry
AgentEndpoint --> EndpointType : endpointType
AgentDescriptor --> Skill : declaresSkill
AgentDescriptor --> Endpoint : hasEndpoint
```

**SPARQL: agent descriptor, endpoints, and skills**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?agentId ?agentDescriptor ?endpointEntry ?endpointType ?skill
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasAgentDescriptor ?agentDescriptor .

  OPTIONAL {
    ?agentDescriptor agentictrust:hasEndpointEntry ?endpointEntry .
    OPTIONAL { ?endpointEntry agentictrust:endpointType ?endpointType . }
  }
  OPTIONAL { ?agentDescriptor agentictrust:declaresSkill ?skill . }
}
ORDER BY ?agentId
LIMIT 200
```

### Agent Identity8004 → Descriptor (8004-specific)

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
class Identity8004["erc8004:Identity8004"]
class IdentityDescriptor8004["erc8004:IdentityDescriptor8004"]
class Skill["agentictrust:Skill"]

AIAgent --> Identity8004 : hasIdentity
Identity8004 --> IdentityDescriptor8004 : hasDescriptor
IdentityDescriptor8004 --> Skill : hasSkill
```

**SPARQL: 8004 identity and its descriptor**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?identity ?descriptor ?skill
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:hasIdentity ?identity .
  ?identity a erc8004:Identity8004 ;
    agentictrust:hasDescriptor ?descriptor .
  OPTIONAL { ?descriptor agentictrust:hasSkill ?skill . }
}
LIMIT 200
```

### Protocol (A2A) → ProtocolDescriptor (and how AgentDescriptor references it)

```mermaid
classDiagram
direction LR

class Protocol["agentictrust:Protocol"]
class A2AProtocolDescriptor["agentictrust:A2AProtocolDescriptor"]
class AgentDescriptor["agentictrust:AgentDescriptor"]

Protocol --> A2AProtocolDescriptor : hasProtocolDescriptor
AgentDescriptor --> A2AProtocolDescriptor : assembledFromMetadata
```

**SPARQL: A2A protocol descriptors**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?protocol ?descriptor ?serviceUrl ?protocolVersion ?preferredTransport
WHERE {
  ?protocol a agentictrust:Protocol ;
    agentictrust:hasProtocolDescriptor ?descriptor .
  ?descriptor a agentictrust:A2AProtocolDescriptor .
  OPTIONAL { ?descriptor agentictrust:serviceUrl ?serviceUrl . }
  OPTIONAL { ?descriptor agentictrust:protocolVersion ?protocolVersion . }
  OPTIONAL { ?descriptor agentictrust:preferredTransport ?preferredTransport . }
}
LIMIT 200
```

### TrustDescription is a Plan (and where Descriptors fit)

```mermaid
classDiagram
direction LR

class provPlan["prov:Plan"]
class pplanPlan["p-plan:Plan"]
class TrustDescription["agentictrust:TrustDescription"]
class Descriptor["agentictrust:Descriptor"]

TrustDescription --|> provPlan
TrustDescription --|> pplanPlan

note for Descriptor "Descriptors are resolver-produced Entities used for discovery and for selecting which plans/descriptions apply"
```

**SPARQL: show TrustDescription is a Plan (ontology query)**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

ASK {
  agentictrust:TrustDescription rdfs:subClassOf* prov:Plan .
}
```
