## Descriptor layer — resolver-produced metadata

Ontology: `apps/ontology/ontology/core.ttl`

This page is about **Descriptors**: resolver-produced Entities that aggregate and normalize metadata for discovery and interaction.

## Protocol-first discovery: skills and domains

In practice, an agent’s **skills** and **domains** are most reliably defined at the **protocol layer** (e.g., an A2A agent card, MCP server/tool metadata).

The `core:AgentDescriptor` may contain skills/domains for discovery queries, but those values should be treated as **derived from protocol metadata** (and other sources) rather than invented independently.

See: [`protocols-endpoints.md`](./protocols-endpoints.md).

### Descriptor class hierarchy (exclude AgentDescriptor)

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]

class Descriptor["core:Descriptor"]
class IdentifierDescriptor["core:IdentifierDescriptor"]
class IdentityDescriptor["core:IdentityDescriptor"]
class AgentNameDescriptor["core:AgentNameDescriptor"]
class Protocol["core:Protocol"]
class A2AProtocol["core:A2AProtocol"]
class MCPProtocol["core:MCPProtocol"]

Descriptor --|> provEntity
IdentifierDescriptor --|> Descriptor
IdentityDescriptor --|> Descriptor
AgentNameDescriptor --|> Descriptor
Protocol --|> Descriptor
A2AProtocol --|> Protocol
MCPProtocol --|> Protocol
```

**SPARQL: list Descriptor subclasses**

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT ?cls
WHERE {
  ?cls rdfs:subClassOf* core:Descriptor .
}
ORDER BY ?cls
```

### Descriptor relationships (Data Types)

```mermaid
classDiagram
direction LR

class Descriptor["core:Descriptor"]
class Endpoint["core:Endpoint"]
class EndpointType["core:EndpointType"]
class AgentSkill["core:AgentSkill"]
class AgentSkillClassification["core:AgentSkillClassification"]
class AgentDomain["core:AgentDomain"]
class AgentDomainClassification["core:AgentDomainClassification"]
class DID["core:DID"]
class DomainName["core:DomainName"]
class TrustType["core:TrustType"]
class TrustModel["core:TrustModel"]

Descriptor --> Endpoint : hasEndpoint
Endpoint --> EndpointType : endpointType
Descriptor --> AgentSkill : hasSkill
AgentSkill --> AgentSkillClassification : hasSkillClassification
Descriptor --> AgentDomain : hasDomain
AgentDomain --> AgentDomainClassification : hasDomainClassification
Descriptor --> DID : hasDID
Descriptor --> DomainName : hasDomainName
Descriptor --> TrustType : hasTrustType
Descriptor --> TrustModel : hasTrustModel
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
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT ?identifier ?descriptor
WHERE {
  ?identifier a core:Identifier ;
    core:hasDescriptor ?descriptor .
}
LIMIT 200
```

### Agent Identity8004 → Descriptor (8004-specific)

```mermaid
classDiagram
direction LR

class AIAgent["core:AIAgent"]
    class AgentIdentity8004["erc8004:AgentIdentity8004"]
class IdentityDescriptor8004["erc8004:IdentityDescriptor8004"]
class AgentSkill["core:AgentSkill"]
class AgentSkillClassification["core:AgentSkillClassification"]

AIAgent --> AgentIdentity8004 : hasIdentity
AgentIdentity8004 --> IdentityDescriptor8004 : hasDescriptor
IdentityDescriptor8004 --> AgentSkill : hasSkill
AgentSkill --> AgentSkillClassification : hasSkillClassification
```

**SPARQL: 8004 identity and its descriptor**

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>

SELECT ?agent ?identity ?descriptor ?skill ?skillClass
WHERE {
  ?agent a core:AIAgent ;
    core:hasIdentity ?identity .
  ?identity a erc8004:AgentIdentity8004 ;
    core:hasDescriptor ?descriptor .
  OPTIONAL {
    ?descriptor core:hasSkill ?skill .
    OPTIONAL { ?skill core:hasSkillClassification ?skillClass . }
  }
}
LIMIT 200
```

### ServiceEndpoint → Protocol (A2A)

```mermaid
classDiagram
direction LR

class Protocol["core:Protocol"]
class A2AProtocol["core:A2AProtocol"]
class ServiceEndpoint["core:ServiceEndpoint"]
class Descriptor["core:Descriptor"]

ServiceEndpoint --> Protocol : hasProtocol
Protocol --|> Descriptor
Protocol <|-- A2AProtocol
```

**SPARQL: A2A protocols + their endpoints**

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT ?protocol ?serviceEndpoint ?serviceUrl ?protocolVersion ?preferredTransport
WHERE {
  ?serviceEndpoint a core:ServiceEndpoint ;
    core:serviceUrl ?serviceUrl ;
    core:hasProtocol ?protocol .
  ?protocol a core:A2AProtocol .
  OPTIONAL { ?protocol core:protocolVersion ?protocolVersion . }
  OPTIONAL { ?protocol core:preferredTransport ?preferredTransport . }
}
LIMIT 200
```


