# Skills and Domains (OASF-aligned)

This document is the **deep dive** on how Agent Skill Classifications and Agent Domain Classifications are modeled, how they connect to Descriptors for discovery, and how we align with OASF (Open Agent Skill Format) standards.

Source ontology: `apps/badge-admin/public/ontology/agentictrust-core.owl`

## Core model

### Key classes

- **`agentictrust:Descriptor`**: resolver-produced description used for discovery. Base class for all descriptors.
- **`agentictrust:AgentDescriptor`**: agent-level descriptor (inherits from `agentictrust:Descriptor`).
- **`agentictrust:AgentSkill`**: an agent-declared skill instance (part of a Descriptor). Links to its classification.
- **`agentictrust:AgentSkillClassification`**: a capability/tool classification used in discovery and routing. Follows OASF (Open Agent Skill Format) standards for skill classification.
- **`agentictrust:AgentDomain`**: an agent-declared domain instance (part of a Descriptor). Links to its classification.
- **`agentictrust:AgentDomainClassification`**: categorization classification used for discovery filtering. Follows OASF standards for domain classification.
- **`agentictrust:OASFSkill` / `agentictrust:OASFDomain`**: OASF-synced skill/domain classifications (vocabulary instances).

### Key relationships

- **Skill declaration on descriptors**
  - `agentictrust:Descriptor` → `agentictrust:hasSkill` → `agentictrust:AgentSkill`
  - `agentictrust:AgentSkill` → `agentictrust:hasSkillClassification` → `agentictrust:AgentSkillClassification`
  - `agentictrust:AgentDescriptor` inherits `hasSkill` from `agentictrust:Descriptor`

- **Domain declaration on descriptors**
  - `agentictrust:Descriptor` → `agentictrust:hasDomain` → `agentictrust:AgentDomain`
  - `agentictrust:AgentDomain` → `agentictrust:hasDomainClassification` → `agentictrust:AgentDomainClassification`
  - `agentictrust:AgentDescriptor` inherits `hasDomain` from `agentictrust:Descriptor`

### Diagram: Agent Skill Classifications + Agent Domain Classifications inside discovery descriptors

```mermaid
classDiagram
direction TB

class AIAgent["agentictrust:AIAgent"]
class Descriptor["agentictrust:Descriptor"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class AgentSkill["agentictrust:AgentSkill"]
class AgentSkillClassification["agentictrust:AgentSkillClassification"]
class AgentDomain["agentictrust:AgentDomain"]
class AgentDomainClassification["agentictrust:AgentDomainClassification"]
class Tag["agentictrust:Tag"]
class JsonSchema["agentictrust:JsonSchema"]
class IntentType["agentictrust:IntentType"]

AIAgent --> AgentDescriptor : hasAgentDescriptor
AgentDescriptor --|> Descriptor

Descriptor --> AgentSkill : hasSkill
AgentSkill --> AgentSkillClassification : hasSkillClassification
Descriptor --> AgentDomain : hasDomain
AgentDomain --> AgentDomainClassification : hasDomainClassification

AgentSkillClassification --> Tag : hasTag
AgentSkillClassification --> JsonSchema : hasInputSchema / hasOutputSchema
AgentSkillClassification --> IntentType : supportsIntentType
IntentType --> AgentSkillClassification : targetsSkill

note for AgentSkillClassification "OASF standards\n(Open Agent Skill Format)"
note for AgentDomainClassification "OASF standards\n(Open Agent Skill Format)"
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
class Descriptor["agentictrust:Descriptor"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class AgentSkill["agentictrust:AgentSkill"]
class AgentSkillClassification["agentictrust:AgentSkillClassification"]
class AgentDomain["agentictrust:AgentDomain"]
class AgentDomainClassification["agentictrust:AgentDomainClassification"]

AgentDescriptor --|> Descriptor
Descriptor --> AgentSkill : hasSkill (when card lists oasf_skills)
AgentSkill --> OASFSkill : hasSkillClassification
Descriptor --> AgentDomain : hasDomain (when card lists oasf_domains)
AgentDomain --> OASFDomain : hasDomainClassification

OASFSkill --|> AgentSkillClassification
OASFDomain --|> AgentDomainClassification

note for OASFSkill "OASF standards\n(Open Agent Skill Format)"
note for OASFDomain "OASF standards\n(Open Agent Skill Format)"
```

## How we populate `agents.oasfSkillsJson` and `agents.oasfDomainsJson`

We treat skills/domains as **protocol-derived metadata**. When we ingest agent metadata (via indexer/CLIs), we extract **string skill/domain IDs** from both the ERC-8004 registration JSON (`rawJson`) and (when available) the A2A agent card (`agentCardJson`), then store them in:

- `agents.oasfSkillsJson` (JSON array of strings)
- `agents.oasfDomainsJson` (JSON array of strings)

### Registration JSON (ERC-8004 `rawJson`)

We read OASF-ish arrays from:

- `endpoints[].skills` / `endpoints[].domains`
- `endpoints[].a2aSkills` / `endpoints[].a2aDomains` (app-registered format)
- `endpoints[].oasf_skills` / `endpoints[].oasf_domains`
- root `oasf_skills` / `oasf_domains`

### Agent card JSON (`agentCardJson`)

We extract string skill IDs/domains from:

- `skills[]` if strings
- `skills[]` objects via `.id` (fallback `.name`)
- `capabilities.extensions[].params.skills` / `capabilities.extensions[].params.domains`


## SPARQL: Agent Skill Classifications (with related info)

### Query: Agent Skill Classifications declared by AgentDescriptors (with tags/domains/schemas/intents)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT DISTINCT
  ?agent ?agentId
  ?descriptor
  ?agentSkill ?skill ?skillType ?skillId ?skillLabel ?skillDescription
  ?tag
  ?inputSchema ?outputSchema
  ?intentType
WHERE {
  ?agent a agentictrust:AIAgent ;
         agentictrust:agentId ?agentId ;
         agentictrust:hasAgentDescriptor ?descriptor .

  ?descriptor agentictrust:hasSkill ?agentSkill .
  OPTIONAL { ?agentSkill agentictrust:hasSkillClassification ?skill . }

  OPTIONAL { ?skill a ?skillType . }
  OPTIONAL { ?skill agentictrust:oasfSkillId ?skillId . }
  OPTIONAL { ?skill rdfs:label ?skillLabel . }
  OPTIONAL { ?skill agentictrust:skillName ?skillLabel . }
  OPTIONAL { ?skill dcterms:description ?skillDescription . }
  OPTIONAL { ?skill agentictrust:skillDescription ?skillDescription . }


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

### Query: OASF-only Agent Skill Classification view (category + GitHub source)

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

## SPARQL: Agent Domain Classifications (with related info)

### Query: Agent Domain Classifications only (no joins)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT DISTINCT
  ?domain ?domainType ?domainId ?label ?description
  ?extendsKey ?categoryNode
  ?githubPath ?githubSha
WHERE {
  ?domain a agentictrust:AgentDomainClassification .
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

### Query: Agent Domain Classifications declared on AgentDescriptors (and linked skill classifications)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT
  ?agent ?agentId
  ?descriptor
  ?agentDomain ?domain ?domainType ?domainId ?domainLabel
  ?agentSkill ?skill ?skillId
WHERE {
  ?agent a agentictrust:AIAgent ;
         agentictrust:agentId ?agentId ;
         agentictrust:hasAgentDescriptor ?descriptor .

  ?descriptor agentictrust:hasDomain ?agentDomain .
  OPTIONAL { ?agentDomain agentictrust:hasDomainClassification ?domain . }

  OPTIONAL { ?domain a ?domainType . }
  OPTIONAL { ?domain agentictrust:oasfDomainId ?domainId . }
  OPTIONAL { ?domain rdfs:label ?domainLabel . }

  OPTIONAL {
    # Agent Skill Classifications linked to the same domain via descriptor
    {
      ?descriptor agentictrust:hasSkill ?agentSkill .
      OPTIONAL { ?agentSkill agentictrust:hasSkillClassification ?skill . }
    }
    ?skill a agentictrust:AgentSkillClassification .
    OPTIONAL { ?skill agentictrust:oasfSkillId ?skillId . }
  }
}
ORDER BY ?agentId ?domainId ?domain
LIMIT 200
```

### Query: OASF-only Agent Domain Classification view (category + GitHub source)

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


