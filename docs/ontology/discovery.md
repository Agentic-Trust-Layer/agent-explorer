# Discovery: Skills, Intents, Tasks, and OASF Alignment

This document describes the AgenticTrust discovery model, covering skills, intents, tasks, execution traces, and alignment with the Open Agentic Schema Framework (OASF).

Source: `apps/badge-admin/public/ontology/agentictrust-core.owl`

## Overview

The ontology separates three key concerns:

- **Discovery**: metadata/card declarations about skills
- **Routing**: intent types and task types
- **Execution trace**: skill invocations used to realize tasks/fulfill intents

## OASF Alignment

The AgenticTrust ontology aligns with the **Open Agentic Schema Framework (OASF)** ([`agntcy/oasf`](https://github.com/agntcy/oasf)), which provides a standardized schema system for agent capabilities/metadata. OASF emphasizes records annotated with **skills** and **domains**, plus extensibility via **modules**.

### OASF Goals

OASF's published goals emphasize:

- **Interoperability**: a common structure for describing agent capabilities and metadata
- **Discovery**: consistent announcement and searching via **skills** and **domains**
- **Extensibility**: modular extensions without breaking the core
- **Schema validation + versioning**: predictable evolution of the vocabulary

AgenticTrust adopts these same goals, but expressed as an OWL/RDF ontology so the `agentictrust.io` knowledge base can query across registries and protocols using a normalized graph.

### OASF Concept Mapping

- **OASF Record**
  - **Meaning in OASF**: the primary structured data object used for content representation and metadata
  - **AgenticTrust mapping**:
    - `agentictrust:AgentDescriptor` (agent-level descriptor) and `agentictrust:ProtocolDescriptor` (protocol-level descriptor; e.g., `agentictrust:A2AProtocolDescriptor`, `agentictrust:MCPProtocolDescriptor`)

- **OASF Skill**
  - **Meaning in OASF**: taxonomy-anchored skill annotation for discovery
  - **AgenticTrust mapping**:
    - `agentictrust:Skill`
    - Skill compatibility routing via `agentictrust:supportsIntentType`

- **OASF Domain**
  - **Meaning in OASF**: domain annotation for discovery / grouping
  - **AgenticTrust mapping**:
    - `agentictrust:Domain` (explicit OASF Domain class - primary mapping)
    - `agentictrust:Tag` (lightweight discovery labels - can supplement Domain)
    - `agentictrust:IntentType` (routing key - can be domain-aligned)
    - (optional) `agentictrust:TaskType` (work taxonomy - can be domain-specific)
  - **Note**: Distinct from `erc8004:IntegrationMetadata` which describes integration mechanisms, not OASF domains

- **OASF Module**
  - **Meaning in OASF**: modular extensibility mechanism (additional structured data)
  - **AgenticTrust mapping**:
    - `agentictrust:JsonSchema` as a concrete "module-like" payload describing skill I/O
    - Linked via `agentictrust:hasInputSchema` / `agentictrust:hasOutputSchema`

### OASF Domain vs. Integration Capability

**Important Distinction**: OASF Domain is different from "Agent A2A Capability" (integration mechanism).

#### OASF Domain (`agentictrust:Domain`)
- **Purpose**: Categorization and grouping for discovery
- **Examples**: "finance", "healthcare", "education", "e-commerce"
- **Usage**: Filter agents/skills by application area
- **Relationship**: `Skill → hasDomain → Domain`
- **OASF Alignment**: Direct mapping to OASF Domain concept

#### Integration Capability (`erc8004:IntegrationMetadata`)
- **Purpose**: Describes how agents integrate with external systems
- **Examples**: SDKs, tool integrations, external services, auth/payment integration hints
- **Usage**: Technical integration details (not discovery categorization)
- **Relationship**: `AgentDescriptor → hasIntegrationMetadata → IntegrationMetadata`
- **Note**: This is protocol-specific (ERC-8004) and describes integration mechanisms, not OASF domains

#### Overlap with Other Concepts

- **Tag** (`agentictrust:Tag`): Lightweight discovery labels (can overlap with Domain but more flexible)
- **IntentType** (`agentictrust:IntentType`): Routing key for intent-driven discovery (can map to domains)
- **TaskType** (`agentictrust:TaskType`): Work taxonomy (can be domain-specific)

The distinction ensures:
- **Domain**: "What area does this skill/agent serve?" (e.g., "finance")
- **Integration Capability**: "How does this agent integrate?" (e.g., "Stripe SDK", "OAuth2")

### OASF Discovery Flow

```
User Intent
    ↓
IntentType (routing key)
    ↓
TaskType (work taxonomy)
    ↓
Skill (capability match)
    ↓
AgentDescriptor (agent with skill)
    ↓
Agent (executable agent)
```

### OASF Record Structure (in AgenticTrust terms)

An OASF record maps to our ontology as:

```
AgentDescriptor (OASF Record)
  ├─ hasSkill / declaresSkill → Skill (OASF Skill)
  │   ├─ hasInputSchema → JsonSchema (OASF Module)
  │   ├─ hasOutputSchema → JsonSchema (OASF Module)
  │   ├─ hasDomain → Domain (OASF Domain - categorization)
  │   ├─ hasTag → Tag (lightweight labels)
  │   ├─ supportsIntentType → IntentType (routing)
  │   └─ enablesTaskType → TaskType (work taxonomy)
  └─ hasEndpoint → Endpoint (protocol bindings)
```

### OASF Schema Validation

OASF emphasizes schema validation and versioning:

- **Input/Output Schemas**: Each skill has JSON Schema definitions
  - `agentictrust:hasInputSchema` → `agentictrust:JsonSchema`
  - `agentictrust:hasOutputSchema` → `agentictrust:JsonSchema`
- **Versioning**: Endpoints and protocols have version information
  - `agentictrust:AgentEndpoint` has version metadata
- **Extensibility**: Modules can be added without breaking core schema
  - `agentictrust:JsonSchema` acts as module payloads

## Class Hierarchy

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]
class provActivity["prov:Activity"]
class pplanPlan["p-plan:Plan"]

class AgentDescriptor["agentictrust:AgentDescriptor"]
class Skill["agentictrust:Skill"]
class JsonSchema["agentictrust:JsonSchema"]
class SkillExample["agentictrust:SkillExample"]
class Tag["agentictrust:Tag"]
class Domain["agentictrust:Domain"]
class IntentType["agentictrust:IntentType"]
class TaskType["agentictrust:TaskType"]

class Message["agentictrust:Message"]
class Intent["agentictrust:Intent"]
class Task["agentictrust:Task"]
class TaskExecution["agentictrust:TaskExecution"]
class SkillInvocation["agentictrust:SkillInvocation"]

AgentDescriptor --|> provEntity
Skill --|> provEntity
JsonSchema --|> provEntity
SkillExample --|> provEntity
Tag --|> provEntity
Domain --|> provEntity
IntentType --|> provEntity
TaskType --|> provEntity

Message --|> provEntity
Intent --|> provEntity
Intent --|> pplanPlan
Task --|> provEntity
Task --|> pplanPlan
TaskExecution --|> provActivity
SkillInvocation --|> provActivity
```

## Skills and Declarations

### Discovery Model

Agents advertise their capabilities through skills:

- `agentictrust:AgentDescriptor` → `agentictrust:Skill`: `agentictrust:hasSkill`
- `agentictrust:AgentDescriptor` → `agentictrust:Skill`: `agentictrust:declaresSkill`

### Skill Modeling

Skills have rich metadata for discovery and validation:

- `agentictrust:Skill` → `agentictrust:JsonSchema`
  - `agentictrust:hasInputSchema`
  - `agentictrust:hasOutputSchema`
- `agentictrust:Skill` → `agentictrust:SkillExample`: `agentictrust:hasExample`
- `agentictrust:Skill` → `agentictrust:Tag`: `agentictrust:hasTag`
- `agentictrust:Skill` → `agentictrust:Domain`: `agentictrust:hasDomain` (OASF Domain)
- `agentictrust:Skill` → `agentictrust:IntentType`: `agentictrust:supportsIntentType`

```mermaid
classDiagram
direction LR

class AgentDescriptor["agentictrust:AgentDescriptor"]
class Skill["agentictrust:Skill"]
class Tag["agentictrust:Tag"]
class Domain["agentictrust:Domain"]
class SkillExample["agentictrust:SkillExample"]
class JsonSchema["agentictrust:JsonSchema"]
class IntentType["agentictrust:IntentType"]

AgentDescriptor --> Skill : hasSkill
AgentDescriptor --> Skill : declaresSkill

Skill --> Tag : hasTag
Skill --> Domain : hasDomain (OASF)
Skill --> SkillExample : hasExample
Skill --> JsonSchema : hasInputSchema
Skill --> JsonSchema : hasOutputSchema
Skill --> IntentType : supportsIntentType
```

## Routing: Intents, Task Types, and Mappings

### Intent-Driven Discovery

Intent types serve as routing keys for discovery:

- `agentictrust:Skill` → `agentictrust:IntentType`: `agentictrust:supportsIntentType`
- `agentictrust:IntentType` → `agentictrust:TaskType`: `agentictrust:mapsToTaskType`
- `agentictrust:Skill` → `agentictrust:TaskType`: `agentictrust:enablesTaskType`
- `agentictrust:TaskType` → `agentictrust:Skill`: `agentictrust:implementedBySkill`

```mermaid
classDiagram
direction LR

class Intent["agentictrust:Intent"]
class IntentType["agentictrust:IntentType"]
class IntentSubject["agentictrust:IntentSubject"]
class IntentCheck["agentictrust:IntentCheck"]
class TaskType["agentictrust:TaskType"]
class Skill["agentictrust:Skill"]

IntentType --> TaskType : mapsToTaskType
Skill --> TaskType : enablesTaskType
TaskType --> Skill : implementedBySkill

Intent --> IntentSubject : hasSubject
Intent --> IntentCheck : hasCheck
```

## Execution Trace (Activities)

Execution traces link intents to actual skill invocations:

- `agentictrust:Task` → `agentictrust:TaskExecution`: `agentictrust:taskRealizedBy`
- `agentictrust:TaskExecution` → `agentictrust:SkillInvocation`: `agentictrust:hasInvocation`
- `agentictrust:SkillInvocation` → `agentictrust:Skill`: `agentictrust:invokesSkill`
- `agentictrust:SkillInvocation` → `agentictrust:Message`: `agentictrust:invocationUsedMessage`
- `agentictrust:Intent` → `agentictrust:SkillInvocation`: `agentictrust:fulfilledByInvocation`

```mermaid
classDiagram
direction LR

class provActivity["prov:Activity"]
class TaskExecution["agentictrust:TaskExecution"]
class SkillInvocation["agentictrust:SkillInvocation"]
class Task["agentictrust:Task"]
class Intent["agentictrust:Intent"]
class Skill["agentictrust:Skill"]
class Message["agentictrust:Message"]

TaskExecution --|> provActivity
SkillInvocation --|> provActivity

Task --> TaskExecution : taskRealizedBy
TaskExecution --> SkillInvocation : hasInvocation
SkillInvocation --> Skill : invokesSkill
SkillInvocation --> Message : invocationUsedMessage
Intent --> SkillInvocation : fulfilledByInvocation
```

## Complete Relationship Diagram

```mermaid
classDiagram
direction LR

class AgentDescriptor["agentictrust:AgentDescriptor"]
class Skill["agentictrust:Skill"]
class JsonSchema["agentictrust:JsonSchema"]
class Tag["agentictrust:Tag"]
class Domain["agentictrust:Domain"]
class IntentType["agentictrust:IntentType"]
class TaskType["agentictrust:TaskType"]

class Message["agentictrust:Message"]
class Intent["agentictrust:Intent"]
class Task["agentictrust:Task"]
class TaskExecution["agentictrust:TaskExecution"]
class SkillInvocation["agentictrust:SkillInvocation"]
class IntegrationMetadata["erc8004:IntegrationMetadata"]

AgentDescriptor --> Skill : hasSkill
AgentDescriptor --> Skill : declaresSkill
Skill --> JsonSchema : hasInputSchema / hasOutputSchema
Skill --> Tag : hasTag
Skill --> Domain : hasDomain (OASF)
Skill --> IntentType : supportsIntentType
Skill --> TaskType : enablesTaskType
IntentType --> TaskType : mapsToTaskType

Message --> Intent : hasIntent
Intent --> SkillInvocation : fulfilledByInvocation
Task --> TaskExecution : taskRealizedBy
TaskExecution --> SkillInvocation : hasInvocation
SkillInvocation --> Skill : invokesSkill
SkillInvocation --> Message : invocationUsedMessage

AgentDescriptor --> IntegrationMetadata : hasIntegrationMetadata (integration mechanism)

note for Domain "OASF Domain\nCategorization for discovery\n(e.g., finance, healthcare)"
note for IntegrationMetadata "Integration Capability\nTechnical integration details\n(e.g., SDKs, auth mechanisms)"
```

## SPARQL Queries

### Query: AgentDescriptor with Skills

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agentDescriptor ?skill ?skillLabel
WHERE {
  ?agentDescriptor a agentictrust:AgentDescriptor .
  
  {
    ?agentDescriptor agentictrust:hasSkill ?skill .
  }
  UNION
  {
    ?agentDescriptor agentictrust:declaresSkill ?skill .
  }
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
}
ORDER BY ?agentDescriptor ?skill
```

### Query: Skill with JsonSchema, Tag, Domain, and IntentType

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?skill ?skillLabel ?inputSchema ?outputSchema ?tag ?domain ?intentType
WHERE {
  ?skill a agentictrust:Skill .
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
  
  OPTIONAL {
    ?skill agentictrust:hasInputSchema ?inputSchema .
    ?inputSchema a agentictrust:JsonSchema .
  }
  
  OPTIONAL {
    ?skill agentictrust:hasOutputSchema ?outputSchema .
    ?outputSchema a agentictrust:JsonSchema .
  }
  
  OPTIONAL {
    ?skill agentictrust:hasTag ?tag .
    ?tag a agentictrust:Tag .
  }
  
  # OASF Domain
  OPTIONAL {
    ?skill agentictrust:hasDomain ?domain .
    ?domain a agentictrust:Domain .
  }
  
  OPTIONAL {
    ?skill agentictrust:supportsIntentType ?intentType .
    ?intentType a agentictrust:IntentType .
  }
}
LIMIT 100
```

### Query: Skill with TaskType

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?skill ?skillLabel ?taskType ?taskTypeLabel
WHERE {
  ?skill a agentictrust:Skill .
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
  
  OPTIONAL {
    ?skill agentictrust:enablesTaskType ?taskType .
    ?taskType a agentictrust:TaskType .
    
    OPTIONAL {
      ?taskType rdfs:label ?taskTypeLabel .
    }
  }
}
LIMIT 100
```

### Query: IntentType to TaskType Mapping

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?intentType ?intentTypeLabel ?taskType ?taskTypeLabel
WHERE {
  ?intentType a agentictrust:IntentType .
  
  OPTIONAL {
    ?intentType rdfs:label ?intentTypeLabel .
  }
  
  OPTIONAL {
    ?intentType agentictrust:mapsToTaskType ?taskType .
    ?taskType a agentictrust:TaskType .
    
    OPTIONAL {
      ?taskType rdfs:label ?taskTypeLabel .
    }
  }
}
ORDER BY ?intentType
```

### Query: Message with Intent and SkillInvocation

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?message ?intent ?skillInvocation ?skill
WHERE {
  ?message a agentictrust:Message .
  
  OPTIONAL {
    ?message agentictrust:hasIntent ?intent .
    ?intent a agentictrust:Intent .
    
    OPTIONAL {
      ?intent agentictrust:fulfilledByInvocation ?skillInvocation .
      ?skillInvocation a agentictrust:SkillInvocation .
      
      OPTIONAL {
        ?skillInvocation agentictrust:invokesSkill ?skill .
        ?skill a agentictrust:Skill .
      }
    }
  }
}
LIMIT 50
```

### Query: Task with TaskExecution and SkillInvocation

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?task ?taskExecution ?skillInvocation ?skill ?message
WHERE {
  ?task a agentictrust:Task .
  
  OPTIONAL {
    ?task agentictrust:taskRealizedBy ?taskExecution .
    ?taskExecution a agentictrust:TaskExecution .
    
    OPTIONAL {
      ?taskExecution agentictrust:hasInvocation ?skillInvocation .
      ?skillInvocation a agentictrust:SkillInvocation .
      
      OPTIONAL {
        ?skillInvocation agentictrust:invokesSkill ?skill .
        ?skill a agentictrust:Skill .
      }
      
      OPTIONAL {
        ?skillInvocation agentictrust:invocationUsedMessage ?message .
        ?message a agentictrust:Message .
      }
    }
  }
}
LIMIT 50
```

### Query: Complete Skill Discovery Chain

This query shows the complete chain from AgentDescriptor through Skills to their schemas, tags, domains, and intent types:

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?agentId ?agentDescriptor ?skill ?skillLabel 
       ?inputSchema ?outputSchema ?tag ?domain ?intentType ?taskType
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasAgentDescriptor ?agentDescriptor .
  
  ?agentDescriptor a agentictrust:AgentDescriptor .
  
  {
    ?agentDescriptor agentictrust:hasSkill ?skill .
  }
  UNION
  {
    ?agentDescriptor agentictrust:declaresSkill ?skill .
  }
  
  ?skill a agentictrust:Skill .
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
  
  OPTIONAL {
    ?skill agentictrust:hasInputSchema ?inputSchema .
  }
  
  OPTIONAL {
    ?skill agentictrust:hasOutputSchema ?outputSchema .
  }
  
  OPTIONAL {
    ?skill agentictrust:hasTag ?tag .
  }
  
  # OASF Domain
  OPTIONAL {
    ?skill agentictrust:hasDomain ?domain .
    ?domain a agentictrust:Domain .
  }
  
  OPTIONAL {
    ?skill agentictrust:supportsIntentType ?intentType .
    
    OPTIONAL {
      ?intentType agentictrust:mapsToTaskType ?taskType .
    }
  }
}
LIMIT 100
```

### Query: OASF-Aligned Skill Discovery with Domain

This query demonstrates OASF-style discovery: find agents with skills matching a domain:

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?agentId ?agentName ?skill ?skillLabel ?domain ?domainLabel ?intentType ?tag
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasAgentDescriptor ?agentDescriptor .
  
  OPTIONAL {
    ?agent agentictrust:agentName ?agentName .
  }
  
  ?agentDescriptor a agentictrust:AgentDescriptor .
  
  {
    ?agentDescriptor agentictrust:hasSkill ?skill .
  }
  UNION
  {
    ?agentDescriptor agentictrust:declaresSkill ?skill .
  }
  
  ?skill a agentictrust:Skill .
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
  
  # OASF Domain (categorization)
  OPTIONAL {
    ?skill agentictrust:hasDomain ?domain .
    ?domain a agentictrust:Domain .
    
    OPTIONAL {
      ?domain rdfs:label ?domainLabel .
    }
  }
  
  # OASF Domain: IntentType (routing key)
  OPTIONAL {
    ?skill agentictrust:supportsIntentType ?intentType .
    ?intentType a agentictrust:IntentType .
  }
  
  # OASF Domain: Tag (lightweight categorization)
  OPTIONAL {
    ?skill agentictrust:hasTag ?tag .
    ?tag a agentictrust:Tag .
  }
}
ORDER BY ?domain ?agent ?skill
LIMIT 100
```

### Query: OASF Module (JsonSchema) Details

This query shows OASF module information (JSON Schema) for skills:

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?skill ?skillLabel ?inputSchema ?outputSchema
WHERE {
  ?skill a agentictrust:Skill .
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
  
  # OASF Module: Input Schema
  OPTIONAL {
    ?skill agentictrust:hasInputSchema ?inputSchema .
    ?inputSchema a agentictrust:JsonSchema .
  }
  
  # OASF Module: Output Schema
  OPTIONAL {
    ?skill agentictrust:hasOutputSchema ?outputSchema .
    ?outputSchema a agentictrust:JsonSchema .
  }
}
LIMIT 50
```

### Query: OASF Record (AgentDescriptor) with Full Metadata

This query retrieves a complete OASF-style record with all annotations including Domain:

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?agentId ?agentName ?descriptor ?skill ?skillLabel 
       ?domain ?domainLabel ?intentType ?tag ?taskType ?endpoint ?integrationMetadata
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasAgentDescriptor ?descriptor .
  
  OPTIONAL {
    ?agent agentictrust:agentName ?agentName .
  }
  
  ?descriptor a agentictrust:AgentDescriptor .
  
  # OASF Skill
  OPTIONAL {
    {
      ?descriptor agentictrust:hasSkill ?skill .
    }
    UNION
    {
      ?descriptor agentictrust:declaresSkill ?skill .
    }
    
    ?skill a agentictrust:Skill .
    
    OPTIONAL {
      ?skill rdfs:label ?skillLabel .
    }
    
    # OASF Domain (categorization)
    OPTIONAL {
      ?skill agentictrust:hasDomain ?domain .
      ?domain a agentictrust:Domain .
      
      OPTIONAL {
        ?domain rdfs:label ?domainLabel .
      }
    }
    
    # OASF Domain: IntentType (routing)
    OPTIONAL {
      ?skill agentictrust:supportsIntentType ?intentType .
    }
    
    # OASF Domain: Tag (lightweight)
    OPTIONAL {
      ?skill agentictrust:hasTag ?tag .
    }
    
    # Task Type
    OPTIONAL {
      ?skill agentictrust:enablesTaskType ?taskType .
    }
  }
  
  # Endpoint (protocol bindings)
  OPTIONAL {
    ?descriptor agentictrust:hasEndpoint ?endpoint .
    ?endpoint a agentictrust:AgentEndpoint .
  }
  
  # Integration Capability (technical integration - distinct from Domain)
  OPTIONAL {
    ?descriptor erc8004:hasIntegrationMetadata ?integrationMetadata .
    ?integrationMetadata a erc8004:IntegrationMetadata .
  }
}
LIMIT 50
```

## Summary

The discovery model provides:

1. **Discovery Layer**: AgentDescriptor → Skills with rich metadata (schemas, tags, domains, intent types)
2. **Routing Layer**: IntentType → TaskType → Skill mappings for intent-driven discovery
3. **Execution Layer**: Task → TaskExecution → SkillInvocation traces
4. **OASF Alignment**: Direct mapping to OASF Records, Skills, Domains, and Modules

All discovery is queryable via SPARQL, enabling semantic search across agent capabilities, domains, and execution traces.
