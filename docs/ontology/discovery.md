# Discovery (Overview)

This document is the **overview** of the AgenticTrust discovery model, centered on the **Descriptor pattern** and how discovery queries hang together.

Source: `apps/ontology/ontology/core.ttl`

## The Descriptor Pattern: Foundation of Discovery

**Important Pattern**: AI Agent, Account, Protocol, and Identifier entities need to be described and discoverable. They are described via a **resolver** associated with them. The resolver processes raw metadata from various sources (on-chain registries, agent cards, protocol configurations, identifier bindings) and resolves them to **Descriptors**. These Descriptors hold normalized, aggregated information about the thing and are used in the discovery process.

### How It Works

1. **Entities Need Description**
   - `core:AIAgent` - AI agents that need to be discovered
   - `eth:Account` - Ethereum accounts that need to be discovered
   - `core:Protocol` - Communication protocols (A2A, MCP) that need to be discovered
   - `core:Identifier` - Identifiers (AccountIdentifier, NameIdentifierENS, IdentityIdentifier8004, etc.) that need to be discovered

2. **Resolvers Process Raw Data**
   - Resolvers fetch and aggregate metadata from multiple sources (on-chain registries, IPFS, agent cards, protocol endpoints)
   - They normalize and validate the data
   - They produce Descriptors as first-class entities

3. **Descriptors Hold Discovery Information**
   - `core:AgentDescriptor` - Resolved metadata about an AI Agent (skills, endpoints, capabilities)
   - `core:ProtocolDescriptor` - Resolved metadata about a Protocol (A2A, MCP configurations)
   - `core:IdentifierDescriptor` - Resolved metadata about an Identifier (bindings, verification methods)
   - `core:IdentityDescriptor` - Resolved metadata about an Identity (core, not protocol-specific)
   - `core:NameDescriptor` - Resolved metadata about a Name (core, not protocol-specific)
   - Protocol-specific descriptors: `eth:AccountDescriptor`, `eth:NameDescriptorENS`, `erc8004:IdentityDescriptor8004`

4. **Descriptors Enable Discovery**
   - Descriptors contain the normalized, assembled view used for discovery, validation, and interaction
   - Discovery queries operate on Descriptors, not raw source data
   - Descriptors link to Skills, Domains, Tags, and other discovery metadata

### Relationship Pattern

```
Entity (AIAgent, Account, Protocol, Identifier)
    ↓ (resolved by resolver)
Descriptor (AgentDescriptor, ProtocolDescriptor, IdentifierDescriptor)
    ↓ (contains)
Discovery Metadata (Skills, Domains, Tags, Endpoints, Schemas)
```

### Descriptor Pattern Diagram

```mermaid
classDiagram
direction TB

class AIAgent["core:AIAgent"]
class Account["eth:Account"]
class Protocol["core:Protocol"]
class Identifier["core:Identifier"]
class Identity["core:Identity"]
class Name["core:Name"]
class Identity8004["erc8004:Identity8004"]
class NANDAIdentity["NANDAIdentity"]
class NameENS["eth:NameENS"]
class DNSName["DNSName"]

class AgentDescriptor["core:AgentDescriptor"]
class AccountDescriptor["eth:AccountDescriptor"]
class ProtocolDescriptor["core:ProtocolDescriptor"]
class IdentifierDescriptor["core:IdentifierDescriptor"]
class IdentityDescriptor["core:IdentityDescriptor"]
class NameDescriptor["core:NameDescriptor"]
class Identity8004Descriptor["erc8004:IdentityDescriptor8004"]
class NANDAIdentityDescriptor["NANDAIdentityDescriptor"]
class NameDescriptorENS["eth:NameDescriptorENS"]
class DNSNameDescriptor["DNSNameDescriptor"]

class AgentSkill["core:AgentSkill"]
class AgentSkillClassification["core:AgentSkillClassification"]
class AgentDomain["core:AgentDomain"]
class AgentDomainClassification["core:AgentDomainClassification"]
class Tag["core:Tag"]
class Endpoint["core:Endpoint"]

AIAgent --> AgentDescriptor : hasDescriptor
Account --> AccountDescriptor : hasDescriptor
Protocol --> ProtocolDescriptor : hasDescriptor
Identifier --> IdentifierDescriptor : hasDescriptor
Identity --> IdentityDescriptor : hasDescriptor
Name --> NameDescriptor : hasDescriptor
Identity8004 --> Identity8004Descriptor : hasDescriptor
NANDAIdentity --> NANDAIdentityDescriptor : hasDescriptor
NameENS --> NameDescriptorENS : hasDescriptor
DNSName --> DNSNameDescriptor : hasDescriptor

AgentDescriptor --> AgentSkill : hasSkill
AgentSkill --> AgentSkillClassification : hasSkillClassification
AgentDescriptor --> AgentDomain : hasDomain
AgentDomain --> AgentDomainClassification : hasDomainClassification
AgentSkillClassification --> Tag : hasTag
AgentDescriptor --> Endpoint : hasEndpoint
```

### SPARQL Query: Entity Discovery via Descriptor

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?entity ?entityType ?descriptor ?descriptorType ?skill ?domain
WHERE {
  # Entities that can be described
  {
    ?entity a core:AIAgent .
    BIND("AIAgent" AS ?entityType)
  }
  UNION
  {
    ?entity a eth:Account .
    BIND("Account" AS ?entityType)
  }
  UNION
  {
    ?entity a core:Protocol .
    BIND("Protocol" AS ?entityType)
  }
  UNION
  {
    ?entity a core:Identifier .
    BIND("Identifier" AS ?entityType)
  }

  # Get Descriptor (resolver-produced)
  ?entity core:hasDescriptor ?descriptor .
  ?descriptor a ?descriptorType .

  # For AgentDescriptor, get discovery metadata
  OPTIONAL {
    ?descriptor a core:AgentDescriptor .
    OPTIONAL {
      ?descriptor core:hasSkill ?agentSkill .
      OPTIONAL { ?agentSkill core:hasSkillClassification ?skill . }
    }
    OPTIONAL {
      ?descriptor core:hasDomain ?agentDomain .
      OPTIONAL { ?agentDomain core:hasDomainClassification ?domain . }
    }
  }
}
LIMIT 100
```

## Where the details live now

- **Skills + Domains (SPARQL + diagrams + OASF alignment)**: `docs/ontology/skills-domains.md`
- **Intents / Tasks / routing (SPARQL)**: `docs/ontology/intent.md`
- **Execution trace / provenance**: `docs/ontology/provenance.md`
- **Situations**: `docs/ontology/situation.md`


