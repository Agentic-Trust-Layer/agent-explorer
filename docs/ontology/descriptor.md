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
class AgentSkill["agentictrust:AgentSkill"]
class AgentSkillClassification["agentictrust:AgentSkillClassification"]
class AgentDomain["agentictrust:AgentDomain"]
class AgentDomainClassification["agentictrust:AgentDomainClassification"]
class DID["agentictrust:DID"]
class DomainName["agentictrust:DomainName"]
class TrustType["agentictrust:TrustType"]

Descriptor --> Endpoint : hasEndpoint
Endpoint --> EndpointType : endpointType
Descriptor --> AgentSkill : hasSkill
AgentSkill --> AgentSkillClassification : hasSkillClassification
Descriptor --> AgentDomain : hasDomain
AgentDomain --> AgentDomainClassification : hasDomainClassification
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

### Agent Identity8004 → Descriptor (8004-specific)

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
    class AgentIdentity8004["erc8004:AgentIdentity8004"]
class IdentityDescriptor8004["erc8004:IdentityDescriptor8004"]
class AgentSkill["agentictrust:AgentSkill"]
class AgentSkillClassification["agentictrust:AgentSkillClassification"]

AIAgent --> AgentIdentity8004 : hasIdentity
AgentIdentity8004 --> IdentityDescriptor8004 : hasDescriptor
IdentityDescriptor8004 --> AgentSkill : hasSkill
AgentSkill --> AgentSkillClassification : hasSkillClassification
```

**SPARQL: 8004 identity and its descriptor**

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?identity ?descriptor ?skill ?skillClass
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:hasIdentity ?identity .
  ?identity a erc8004:AgentIdentity8004 ;
    agentictrust:hasDescriptor ?descriptor .
  OPTIONAL {
    ?descriptor agentictrust:hasSkill ?skill .
    OPTIONAL { ?skill agentictrust:hasSkillClassification ?skillClass . }
  }
}
LIMIT 200
```

### Protocol (A2A) → ProtocolDescriptor

```mermaid
classDiagram
direction LR

class Protocol["agentictrust:Protocol"]
class A2AProtocolDescriptor["agentictrust:A2AProtocolDescriptor"]
class Descriptor["agentictrust:Descriptor"]

Protocol --> A2AProtocolDescriptor : hasProtocolDescriptor
A2AProtocolDescriptor --|> Descriptor
Descriptor --> A2AProtocolDescriptor : assembledFromMetadata
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


