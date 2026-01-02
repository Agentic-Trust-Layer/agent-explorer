## Descriptor layer — resolver-produced metadata

Ontology: `agentictrust-core.owl`

This page is about **Descriptors**: resolver-produced Entities that aggregate and normalize metadata for discovery and interaction.

### Descriptor class hierarchy (exclude AgentDescriptor)

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]

class Descriptor["agentictrust:Descriptor"]
class IdentifierDescriptor["agentictrust:IdentifierDescriptor"]
class IdentityDescriptor["agentictrust:IdentityDescriptor"]
class AgentNameDescriptor["agentictrust:AgentNameDescriptor"]
class ProtocolDescriptor["agentictrust:ProtocolDescriptor"]
class A2AProtocolDescriptor["agentictrust:A2AProtocolDescriptor"]
class MCPProtocolDescriptor["agentictrust:MCPProtocolDescriptor"]

Descriptor --|> provEntity
IdentifierDescriptor --|> Descriptor
IdentityDescriptor --|> Descriptor
AgentNameDescriptor --|> Descriptor
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

### Descriptor relationships (Data Types)

```mermaid
classDiagram
direction LR

class Descriptor["agentictrust:Descriptor"]
class Endpoint["agentictrust:Endpoint"]
class EndpointType["agentictrust:EndpointType"]
class AgentSkillClassification["agentictrust:AgentSkillClassification"]
class AgentDomainClassification["agentictrust:AgentDomainClassification"]
class DID["agentictrust:DID"]
class DomainName["agentictrust:DomainName"]
class TrustType["agentictrust:TrustType"]

Descriptor --> Endpoint : hasEndpoint
Endpoint --> EndpointType : endpointType
Descriptor --> AgentSkillClassification : hasSkill
Descriptor --> AgentDomainClassification : hasDomain
Descriptor --> DID : hasDID
Descriptor --> DomainName : hasDomainName
Descriptor --> TrustType : hasTrustType
Descriptor : +descriptorName (text, UTF-8)
Descriptor : +descriptorDescription (text, UTF-8/Markdown)
Descriptor : +descriptorImage (URI, RFC 3986)

note for Endpoint "URI/URL standards\n(RFC 3986)"
note for AgentSkillClassification "OASF standards\n(Open Agent Skill Format)"
note for AgentDomainClassification "OASF standards\n(Open Agent Skill Format)"
note for DID "W3C DID Core\n(https://www.w3.org/TR/did-core/)"
note for DomainName "IETF DNS standards\n(RFC 1034, RFC 1035)"
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

### Agent → AgentDescriptor (and its data types)

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class Endpoint["agentictrust:Endpoint"]
class EndpointType["agentictrust:EndpointType"]
class AgentSkillClassification["agentictrust:AgentSkillClassification"]
class AgentDomainClassification["agentictrust:AgentDomainClassification"]
class DID["agentictrust:DID"]
class DomainName["agentictrust:DomainName"]
class TrustType["agentictrust:TrustType"]

AIAgent --> AgentDescriptor : hasAgentDescriptor
AgentDescriptor --> Endpoint : hasEndpoint
Endpoint --> EndpointType : endpointType
AgentDescriptor --> AgentSkillClassification : hasSkill
AgentDescriptor --> AgentDomainClassification : declaresDomain
AgentDescriptor --> DID : hasDID
AgentDescriptor --> DomainName : hasDomainName
AgentDescriptor --> TrustType : hasTrustType
AgentDescriptor : +descriptorName (text, UTF-8)
AgentDescriptor : +descriptorDescription (text, UTF-8/Markdown)
AgentDescriptor : +descriptorImage (URI, RFC 3986)

note for Endpoint "URI/URL standards\n(RFC 3986)"
note for AgentSkillClassification "OASF standards\n(Open Agent Skill Format)"
note for AgentDomainClassification "OASF standards\n(Open Agent Skill Format)"
note for DID "W3C DID Core\n(https://www.w3.org/TR/did-core/)"
note for DomainName "IETF DNS standards\n(RFC 1034, RFC 1035)"
```

**SPARQL: agent descriptor, endpoints, and skills**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?agentId ?agentDescriptor ?endpoint ?endpointType ?skill ?domain ?did ?domainName ?trustType ?name ?description ?image
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasAgentDescriptor ?agentDescriptor .

  OPTIONAL {
    ?agentDescriptor agentictrust:hasEndpoint ?endpoint .
    OPTIONAL { ?endpoint agentictrust:endpointType ?endpointType . }
  }
  OPTIONAL { ?agentDescriptor agentictrust:hasSkill ?skill . }
  OPTIONAL { ?agentDescriptor agentictrust:hasDomain ?domain . }
  OPTIONAL { ?agentDescriptor agentictrust:hasDID ?did . }
  OPTIONAL { ?agentDescriptor agentictrust:hasDomainName ?domainName . }
  OPTIONAL { ?agentDescriptor agentictrust:hasTrustType ?trustType . }
  OPTIONAL { ?agentDescriptor agentictrust:descriptorName ?name . }
  OPTIONAL { ?agentDescriptor agentictrust:descriptorDescription ?description . }
  OPTIONAL { ?agentDescriptor agentictrust:descriptorImage ?image . }
}
ORDER BY ?agentId
LIMIT 200
```

### Agent Identity8004 → Descriptor (8004-specific)

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
    class AgentIdentity8004["erc8004:AgentIdentity8004"]
class IdentityDescriptor8004["erc8004:IdentityDescriptor8004"]
class AgentSkillClassification["agentictrust:AgentSkillClassification"]

AIAgent --> AgentIdentity8004 : hasIdentity
AgentIdentity8004 --> IdentityDescriptor8004 : hasDescriptor
IdentityDescriptor8004 --> AgentSkillClassification : hasSkill
```

**SPARQL: 8004 identity and its descriptor**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?identity ?descriptor ?skill
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:hasIdentity ?identity .
  ?identity a erc8004:AgentIdentity8004 ;
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


