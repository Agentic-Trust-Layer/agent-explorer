# Skills and Domains (OASF-aligned)

This document is the **deep dive** on how Skills and Domains are modeled, how they connect to Descriptors for discovery, and how we align with OASF.

Source ontology: `apps/badge-admin/public/ontology/agentictrust-core.owl`

## Core model

### Key classes

- **`agentictrust:AgentDescriptor`**: resolver-produced description used for discovery.
- **`agentictrust:Skill`**: a capability/tool surface used in discovery and routing.
- **`agentictrust:Domain`**: categorization used for discovery filtering.
- **`agentictrust:OASFSkill` / `agentictrust:OASFDomain`**: OASF-synced skills/domains (vocabulary instances).

### Key relationships

- **Skill declaration on descriptors**
  - `agentictrust:AgentDescriptor` → `agentictrust:declaresSkill` → `agentictrust:Skill`
  - `agentictrust:AgentDescriptor` → `agentictrust:hasSkill` → `agentictrust:Skill`

- **Domain association**
  - `agentictrust:Skill` → `agentictrust:hasDomain` → `agentictrust:Domain`
  - `agentictrust:AgentDescriptor` → `agentictrust:declaresDomain` → `agentictrust:Domain` *(direct domain tagging)*

### Diagram: Skills + Domains inside discovery descriptors

```mermaid
classDiagram
direction TB

class AIAgent["agentictrust:AIAgent"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class Skill["agentictrust:Skill"]
class Domain["agentictrust:Domain"]
class Tag["agentictrust:Tag"]
class JsonSchema["agentictrust:JsonSchema"]
class IntentType["agentictrust:IntentType"]

AIAgent --> AgentDescriptor : hasAgentDescriptor

AgentDescriptor --> Skill : declaresSkill / hasSkill
AgentDescriptor --> Domain : declaresDomain

Skill --> Domain : hasDomain
Skill --> Tag : hasTag
Skill --> JsonSchema : hasInputSchema / hasOutputSchema
Skill --> IntentType : supportsIntentType
IntentType --> Skill : targetsSkill
```

## OASF alignment

OASF provides a standardized, GitHub-hosted vocabulary for **domains** and **skills** (and other “dictionary” concepts).

- **Domains**: [`agntcy/oasf/schema/domains`](https://github.com/agntcy/oasf/tree/main/schema/domains)
- **Skills**: [`agntcy/oasf/schema/skills`](https://github.com/agntcy/oasf/tree/main/schema/skills)
- **Domain categories**: [`agntcy/oasf/schema/domain_categories.json`](https://raw.githubusercontent.com/agntcy/oasf/main/schema/domain_categories.json)

### How we key OASF records

- **Hierarchical IDs** are the **path** under:
  - `schema/domains/<category>/<domain>.json` → domain id: `<category>/<domain>`
  - `schema/skills/<category>/.../<skill>.json` → skill id: `<category>/.../<skill>`

### How we set “category”

For both domains and skills, the DB “category” (and `extendsKey`) is derived from `githubPath`:

- `schema/domains/energy/energy_management.json` → category `energy`
- `schema/skills/agent_orchestration/agent_orchestration.json` → category `agent_orchestration`

### Diagram: OASF vocabulary → AgenticTrust discovery nodes

```mermaid
classDiagram
direction TB

class OASFSkill["agentictrust:OASFSkill"]
class OASFDomain["agentictrust:OASFDomain"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class Skill["agentictrust:Skill"]
class Domain["agentictrust:Domain"]

AgentDescriptor --> OASFSkill : declaresSkill (when card lists oasf_skills)
AgentDescriptor --> OASFDomain : declaresDomain (when card lists oasf_domains)

OASFSkill --|> Skill
OASFDomain --|> Domain
```

## SPARQL: Skills (with related info)

### Query: Skills declared by AgentDescriptors (with tags/domains/schemas/intents)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT DISTINCT
  ?agent ?agentId
  ?descriptor
  ?skill ?skillType ?skillId ?skillLabel ?skillDescription
  ?domain ?domainLabel
  ?tag
  ?inputSchema ?outputSchema
  ?intentType
WHERE {
  ?agent a agentictrust:AIAgent ;
         agentictrust:agentId ?agentId ;
         agentictrust:hasAgentDescriptor ?descriptor .

  {
    ?descriptor agentictrust:declaresSkill ?skill .
  }
  UNION
  {
    ?descriptor agentictrust:hasSkill ?skill .
  }

  OPTIONAL { ?skill a ?skillType . }
  OPTIONAL { ?skill agentictrust:oasfSkillId ?skillId . }
  OPTIONAL { ?skill rdfs:label ?skillLabel . }
  OPTIONAL { ?skill agentictrust:skillName ?skillLabel . }
  OPTIONAL { ?skill dcterms:description ?skillDescription . }
  OPTIONAL { ?skill agentictrust:skillDescription ?skillDescription . }

  OPTIONAL {
    ?skill agentictrust:hasDomain ?domain .
    OPTIONAL { ?domain rdfs:label ?domainLabel . }
  }

  OPTIONAL { ?skill agentictrust:hasTag ?tag . }
  OPTIONAL { ?skill agentictrust:hasInputSchema ?inputSchema . }
  OPTIONAL { ?skill agentictrust:hasOutputSchema ?outputSchema . }

  OPTIONAL {
    { ?skill agentictrust:supportsIntentType ?intentType . }
    UNION
    { ?intentType agentictrust:targetsSkill ?skill . }
  }
}
ORDER BY ?agentId ?skillId ?skill
LIMIT 200
```

### Query: OASF-only skill view (category + GitHub source)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT
  ?oasfSkill ?oasfSkillId ?label
  ?extendsKey ?categoryNode
  ?githubPath ?githubSha
WHERE {
  ?oasfSkill a agentictrust:OASFSkill ;
             agentictrust:oasfSkillId ?oasfSkillId .

  OPTIONAL { ?oasfSkill rdfs:label ?label . }
  OPTIONAL { ?oasfSkill agentictrust:oasfExtendsKey ?extendsKey . }
  OPTIONAL { ?oasfSkill agentictrust:oasfCategory ?categoryNode . }
  OPTIONAL { ?oasfSkill agentictrust:githubPath ?githubPath . }
  OPTIONAL { ?oasfSkill agentictrust:githubSha ?githubSha . }
}
ORDER BY ?oasfSkillId
LIMIT 200
```

## SPARQL: Domains (with related info)

### Query: Domains only (no joins)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT DISTINCT
  ?domain ?domainType ?domainId ?label ?description
  ?extendsKey ?categoryNode
  ?githubPath ?githubSha
WHERE {
  ?domain a agentictrust:Domain .
  OPTIONAL { ?domain a ?domainType . }
  OPTIONAL { ?domain agentictrust:oasfDomainId ?domainId . }
  OPTIONAL { ?domain rdfs:label ?label . }
  OPTIONAL { ?domain dcterms:description ?description . }
  OPTIONAL { ?domain rdfs:comment ?description . }
  OPTIONAL { ?domain agentictrust:oasfExtendsKey ?extendsKey . }
  OPTIONAL { ?domain agentictrust:oasfCategory ?categoryNode . }
  OPTIONAL { ?domain agentictrust:githubPath ?githubPath . }
  OPTIONAL { ?domain agentictrust:githubSha ?githubSha . }
}
ORDER BY ?domainId ?domain
LIMIT 200
```

### Query: Domains declared on AgentDescriptors (and linked skills)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT
  ?agent ?agentId
  ?descriptor
  ?domain ?domainType ?domainId ?domainLabel
  ?skill ?skillId
WHERE {
  ?agent a agentictrust:AIAgent ;
         agentictrust:agentId ?agentId ;
         agentictrust:hasAgentDescriptor ?descriptor .

  ?descriptor agentictrust:declaresDomain ?domain .

  OPTIONAL { ?domain a ?domainType . }
  OPTIONAL { ?domain agentictrust:oasfDomainId ?domainId . }
  OPTIONAL { ?domain rdfs:label ?domainLabel . }

  OPTIONAL {
    # Skills that are connected via hasDomain
    {
      ?descriptor agentictrust:declaresSkill ?skill .
    } UNION {
      ?descriptor agentictrust:hasSkill ?skill .
    }
    ?skill agentictrust:hasDomain ?domain .
    OPTIONAL { ?skill agentictrust:oasfSkillId ?skillId . }
  }
}
ORDER BY ?agentId ?domainId ?domain
LIMIT 200
```

### Query: OASF-only domain view (category + GitHub source)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT
  ?oasfDomain ?oasfDomainId ?label
  ?extendsKey ?categoryNode
  ?githubPath ?githubSha
WHERE {
  ?oasfDomain a agentictrust:OASFDomain ;
              agentictrust:oasfDomainId ?oasfDomainId .

  OPTIONAL { ?oasfDomain rdfs:label ?label . }
  OPTIONAL { ?oasfDomain agentictrust:oasfExtendsKey ?extendsKey . }
  OPTIONAL { ?oasfDomain agentictrust:oasfCategory ?categoryNode . }
  OPTIONAL { ?oasfDomain agentictrust:githubPath ?githubPath . }
  OPTIONAL { ?oasfDomain agentictrust:githubSha ?githubSha . }
}
ORDER BY ?oasfDomainId
LIMIT 200
```

## Related diagrams in-repo

If you render diagrams from the Turtle sources, these are directly relevant:

- `docs/ontology/diagrams-src/skills-declarations.ttl`
- `docs/ontology/diagrams-src/oasf-mapping.ttl`


