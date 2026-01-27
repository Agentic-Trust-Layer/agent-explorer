# SPARQL Queries for Agents

This document provides SPARQL queries for querying agent data from the RDF knowledge base.

## Prefixes

All queries use these prefixes:

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>
PREFIX erc8004: <https://core.io/ontology/erc8004#>
PREFIX erc8092: <https://core.io/ontology/erc8092#>
```

## Basic Agent Queries

### Get All Agents

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId ?agentName
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  OPTIONAL { ?agent core:agentName ?agentName . }
}
ORDER BY ?chainId ?agentId
```

### Get Agent by Chain ID and Agent ID

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId ?agentName
WHERE {
  ?agent a core:AIAgent ;
    core:agentId "4558" ;
    core:hasIdentifier ?identifier .
  ?identifier a eth:Account ;
    eth:accountChainId 11155111 .
  BIND(11155111 AS ?chainId)
  OPTIONAL { ?agent core:agentName ?agentName . }
}
```

## Agents with Identifiers

### Get All Identifiers for an Agent (IdentityIdentifier8004, AccountIdentifier, NameIdentifierENS)

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>
PREFIX erc8004: <https://core.io/ontology/erc8004#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?identifier ?identifierType ?identifierValue ?did
WHERE {
  ?agent a core:AIAgent ;
    core:agentId "4514" .
  
  {
    # Direct identifiers via hasIdentifier
    # This includes: AccountIdentifier, NameIdentifierENS (direct link), IdentityIdentifier8004
    ?agent core:hasIdentifier ?identifier .
  }
  UNION
  {
    # Identifiers via Identity8004 → hasIdentifier → IdentityIdentifier8004
    ?agent core:hasIdentity ?identity .
    ?identity core:hasIdentifier ?identifier .
  }
  
  # Get the type of the identifier
  ?identifier a ?identifierType .
  
  # Extract identifier value based on type (use UNION to avoid conflicts)
  {
    # For NameIdentifierENS, get the label (the ENS name, e.g., "agent.eth")
    ?identifier a eth:NameIdentifierENS ;
      rdfs:label ?identifierValue .
  }
  UNION
  {
    # For AccountIdentifier, get the account address via hasAccount
    ?identifier a eth:AccountIdentifier ;
      .
    ?account eth:hasIdentifier ?identifier .
    ?account eth:accountAddress ?identifierValue .
  }
  UNION
  {
    # For IdentityIdentifier8004, extract the DID value from the DID IRI
    ?identifier a erc8004:IdentityIdentifier8004 ;
      core:hasDID ?didNode .
    # Extract the DID value from the IRI (e.g., from https://www.core.io/id/did/did%3A8004%3A84532%3A1)
    # URL decode %3A to :
    BIND(REPLACE(REPLACE(STR(?didNode), "^.*/([^/]+)$", "$1"), "%3A", ":") AS ?identifierValue)
  }
  
  # Optional: get DID IRI if it exists
  OPTIONAL {
    ?identifier core:hasDID ?did .
  }
}
```

### Get Agents with Their Identifiers (Accounts)

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId ?account ?accountAddress ?accountType
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?account .
  ?account a eth:Account ;
    eth:accountChainId ?chainId ;
    eth:accountAddress ?accountAddress ;
    eth:accountType ?accountType .
  FILTER (?agentId = "4558")
}
ORDER BY ?chainId ?agentId
```

### Get Agents with Account Details (Chain ID, Address, Type)

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId ?accountAddress ?accountType ?eoaOwner
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?accountIdentifier .
  ?accountIdentifier a eth:AccountIdentifier .
  ?account a eth:Account ;
    eth:hasIdentifier ?accountIdentifier ;
    eth:accountChainId ?chainId ;
    eth:accountAddress ?accountAddress ;
    eth:accountType ?accountType .
  OPTIONAL {
    ?account eth:hasEOAOwner ?eoaAccount .
    ?eoaAccount eth:accountAddress ?eoaOwner .
  }
}
ORDER BY ?chainId ?agentId
```

## Agents with Descriptors

### Get Agents with Agent Descriptors

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?chainId ?agentId ?descriptor ?descriptorName
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    core:hasAgentDescriptor ?descriptor .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  ?descriptor a core:AgentDescriptor .
  OPTIONAL { ?descriptor rdfs:label ?descriptorName . }
}
ORDER BY ?chainId ?agentId
```

### Get Agents with A2A Protocol Descriptors

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?chainId ?agentId ?agentDescriptor ?protocolDescriptor ?protocolVersion
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    core:hasAgentDescriptor ?agentDescriptor .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  ?agentDescriptor a core:AgentDescriptor .
  # Protocol descriptors are separate entities, linked by IRI pattern matching agent
  OPTIONAL {
    ?protocolDescriptor a core:A2AProtocolDescriptor, core:ProtocolDescriptor .
    OPTIONAL { ?protocolDescriptor core:protocolVersion ?protocolVersion . }
    # Match protocol descriptor IRI pattern: /protocol-descriptor/a2a/{chainId}/{agentId}
    FILTER (STRSTARTS(STR(?protocolDescriptor), CONCAT("https://www.core.io/id/protocol-descriptor/a2a/", STR(?chainId), "/", STR(?agentId))))
  }
}
ORDER BY ?chainId ?agentId
```

## Agents with Skills

### Get Agents with Their Skills

```sparql
PREFIX core: <https://core.io/ontology/core#>

SELECT ?agent ?chainId ?agentId ?agentSkill ?skill ?skillId ?skillName
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    core:hasAgentDescriptor ?descriptor .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  ?descriptor core:hasSkill ?agentSkill .
  OPTIONAL { ?agentSkill core:hasSkillClassification ?skill . }
  OPTIONAL { ?skill core:oasfSkillId ?skillId . }
  OPTIONAL { ?skill core:skillId ?skillId . }
  OPTIONAL { ?skill core:skillName ?skillName . }
}
ORDER BY ?chainId ?agentId ?skillId
```

### Count Skills per Agent

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId (COUNT(?skill) AS ?skillCount)
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    core:hasAgentDescriptor ?descriptor .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  ?descriptor core:hasSkill ?skill .
}
GROUP BY ?agent ?chainId ?agentId
ORDER BY DESC(?skillCount)
```

### Get Protocol Descriptors

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId ?did ?protocolDescriptor ?protocolVersion ?preferredTransport ?serviceUrl
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    core:hasDID ?did .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  # Protocol descriptor linked by DID in IRI pattern (protocol-agnostic, no chainId needed)
  ?protocolDescriptor a core:A2AProtocolDescriptor, core:ProtocolDescriptor .
  # Match protocol descriptor IRI pattern: /protocol-descriptor/a2a/{did}
  # DID value is URL-encoded in the IRI, extract the encoded segment from DID IRI
  BIND (REPLACE(STR(?did), "^.*/([^/]+)$", "$1") AS ?didEncoded)
  FILTER (STRSTARTS(STR(?protocolDescriptor), CONCAT("https://www.core.io/id/protocol-descriptor/a2a/", ?didEncoded)))
  OPTIONAL { ?protocolDescriptor core:protocolVersion ?protocolVersion . }
  OPTIONAL { ?protocolDescriptor core:preferredTransport ?preferredTransport . }
  OPTIONAL { ?protocolDescriptor core:serviceUrl ?serviceUrl . }
}
ORDER BY ?chainId ?agentId
```

### Get Agent → AgentDescriptor → A2A Protocol Descriptor → Skills

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId ?did ?agentDescriptor ?protocolDescriptor ?protocolVersion ?agentSkill ?skill ?skillId ?skillName
WHERE {
  # Agent
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    core:hasDID ?did ;
    core:hasAgentDescriptor ?agentDescriptor .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  
  # AgentDescriptor
  ?agentDescriptor a core:AgentDescriptor .
  
  # A2A Protocol Descriptor (linked by DID in IRI pattern - protocol-agnostic, no chainId needed)
  ?protocolDescriptor a core:A2AProtocolDescriptor, core:ProtocolDescriptor .
  OPTIONAL { ?protocolDescriptor core:protocolVersion ?protocolVersion . }
  # Match protocol descriptor IRI pattern: /protocol-descriptor/a2a/{did}
  # DID value is URL-encoded in the IRI
  BIND (REPLACE(STR(?did), "^.*/([^/]+)$", "$1") AS ?didEncoded)
  FILTER (STRSTARTS(STR(?protocolDescriptor), CONCAT("https://www.core.io/id/protocol-descriptor/a2a/", ?didEncoded)))
  
  # Skills from AgentDescriptor (skills are declared on AgentDescriptor, not ProtocolDescriptor)
  ?agentDescriptor core:hasSkill ?agentSkill .
  OPTIONAL { ?agentSkill core:hasSkillClassification ?skill . }
  OPTIONAL { ?skill core:oasfSkillId ?skillId . }
  OPTIONAL { ?skill core:skillId ?skillId . }
  OPTIONAL { ?skill core:skillName ?skillName . }
}
ORDER BY ?chainId ?agentId ?skillId
```

## Agents with Trust Assertions

### Get Agents with Verification Assertions (Validations)

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX erc8004: <https://core.io/ontology/erc8004#>

SELECT ?agent ?chainId ?agentId ?validation ?validator
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    erc8004:hasValidation ?validation .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  ?validation a erc8004:ValidationResponse, core:VerificationTrustAssertion .
  OPTIONAL {
    ?validation erc8004:validatorAgent ?validator .
  }
}
ORDER BY ?chainId ?agentId
```

### Get Agents with Reputation Assertions (Feedback)

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>
PREFIX erc8004: <https://core.io/ontology/erc8004#>

SELECT ?agent ?chainId ?agentId ?feedback ?client
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    erc8004:hasFeedback ?feedback .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  ?feedback a erc8004:Feedback, core:ReputationTrustAssertion .
  OPTIONAL {
    ?feedback erc8004:feedbackClient ?clientAccount .
    ?clientAccount eth:accountAddress ?client .
  }
}
ORDER BY ?chainId ?agentId
```

### Count Trust Assertions per Agent

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>
PREFIX erc8004: <https://core.io/ontology/erc8004#>

SELECT ?agent ?chainId ?agentId 
  (COUNT(DISTINCT ?validation) AS ?validationCount)
  (COUNT(DISTINCT ?feedback) AS ?feedbackCount)
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  OPTIONAL { ?agent erc8004:hasValidation ?validation . }
  OPTIONAL { ?agent erc8004:hasFeedback ?feedback . }
}
GROUP BY ?agent ?chainId ?agentId
ORDER BY DESC(?validationCount) DESC(?feedbackCount)
```

## Agents with Relationships

### Get Agents with Agent-to-Agent Relationships

```sparql
PREFIX core: <https://core.io/ontology/core#>

SELECT ?agent ?chainId ?agentId ?relationship ?otherAgent
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    core:hasRelationship ?relationship .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  ?relationship core:participatesInRelationship ?otherAgent .
  FILTER (?otherAgent != ?agent)
}
ORDER BY ?chainId ?agentId
```

### Get Agents with Account Relationships (ERC-8092)

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>
PREFIX erc8092: <https://core.io/ontology/erc8092#>

SELECT ?agent ?chainId ?agentId ?account ?accountRelationship ?relationshipId
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?accountIdentifier .
  ?accountIdentifier a eth:AccountIdentifier .
  ?account a eth:Account ;
    eth:accountChainId ?chainId ;
    eth:hasIdentifier ?accountIdentifier ;
    eth:hasAccountRelationship ?accountRelationship .
  ?accountRelationship a eth:AccountRelationship .
  OPTIONAL {
    ?accountRelationship erc8092:relationshipId ?relationshipId .
  }
}
ORDER BY ?chainId ?agentId
```

## Complex Queries

### Get Complete Agent Profile

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>
PREFIX erc8004: <https://core.io/ontology/erc8004#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?chainId ?agentId ?agentName 
  ?accountAddress ?accountType
  ?descriptorName
  (COUNT(DISTINCT ?skill) AS ?skillCount)
  (COUNT(DISTINCT ?validation) AS ?validationCount)
  (COUNT(DISTINCT ?feedback) AS ?feedbackCount)
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId ;
    eth:accountAddress ?accountAddress ;
    eth:accountType ?accountType .
  OPTIONAL { ?agent core:agentName ?agentName . }
  OPTIONAL {
    ?agent core:hasAgentDescriptor ?descriptor .
    ?descriptor rdfs:label ?descriptorName .
    ?descriptor core:hasSkill ?skill .
  }
  OPTIONAL { ?agent erc8004:hasValidation ?validation . }
  OPTIONAL { ?agent erc8004:hasFeedback ?feedback . }
}
GROUP BY ?agent ?chainId ?agentId ?agentName ?accountAddress ?accountType ?descriptorName
ORDER BY ?chainId ?agentId
```

### Get Agents by Account Address

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId ?accountAddress
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?accountIdentifier .
  ?accountIdentifier a eth:AccountIdentifier .
  ?account a eth:Account ;
    eth:hasIdentifier ?accountIdentifier ;
    eth:accountAddress "0x1234..." ;
    eth:accountChainId ?chainId .
  BIND("0x1234..." AS ?accountAddress)
}
```

### Get Agents with Descriptors and Read Timestamp

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId ?descriptor ?readAt
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    core:hasAgentDescriptor ?descriptor ;
    core:agentDescriptorReadAt ?readAt .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
}
ORDER BY DESC(?readAt)
```

## Filtering and Aggregation

### Get Agents on Specific Chain

```sparql
PREFIX core: <https://core.io/ontology/core#>

SELECT ?agent ?chainId ?agentId ?agentName
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier .
  ?identifier a eth:Account ;
    eth:accountChainId 11155111 .
  BIND(11155111 AS ?chainId)
  OPTIONAL { ?agent core:agentName ?agentName . }
}
ORDER BY ?agentId
```

### Get Agents Created After Timestamp

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>

SELECT ?agent ?chainId ?agentId ?createdAt
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    core:createdAtTime ?createdAt .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  FILTER (?createdAt > 1700000000)
}
ORDER BY DESC(?createdAt)
```

### Get Top Agents by Validation Count

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX eth: <https://core.io/ontology/eth#>
PREFIX erc8004: <https://core.io/ontology/erc8004#>

SELECT ?agent ?chainId ?agentId ?agentName (COUNT(?validation) AS ?validationCount)
WHERE {
  ?agent a core:AIAgent ;
    core:agentId ?agentId ;
    core:hasIdentifier ?identifier ;
    erc8004:hasValidation ?validation .
  ?identifier a eth:Account ;
    eth:accountChainId ?chainId .
  OPTIONAL { ?agent core:agentName ?agentName . }
}
GROUP BY ?agent ?chainId ?agentId ?agentName
ORDER BY DESC(?validationCount)
LIMIT 10
```

