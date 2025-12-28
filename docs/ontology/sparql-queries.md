# SPARQL Queries for Agents

This document provides SPARQL queries for querying agent data from the RDF knowledge base.

## Prefixes

All queries use these prefixes:

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
```

## Basic Agent Queries

### Get All Agents

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId ?agentName
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent agentictrust:agentName ?agentName . }
}
ORDER BY ?chainId ?agentId
```

### Get Agent by Chain ID and Agent ID

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId ?agentName
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId "4558" ;
    agentictrust:hasIdentifier ?identifier .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId 11155111 .
  BIND(11155111 AS ?chainId)
  OPTIONAL { ?agent agentictrust:agentName ?agentName . }
}
```

## Agents with Identifiers

### Get All Identifiers for an Agent (8004IdentityIdentifier, AccountIdentifier, ENSNameIdentifier)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?identifier ?identifierType ?identifierValue ?did
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId "4514" .
  
  {
    # Direct identifiers via hasIdentifier
    # This includes: AccountIdentifier, ENSNameIdentifier (direct link), 8004IdentityIdentifier
    ?agent agentictrust:hasIdentifier ?identifier .
  }
  UNION
  {
    # Identifiers via 8004Identity → hasIdentifier → 8004IdentityIdentifier
    ?agent erc8004:has8004Identity ?identity .
    ?identity agentictrust:hasIdentifier ?identifier .
  }
  
  # Get the type of the identifier
  ?identifier a ?identifierType .
  
  # Extract identifier value based on type (use UNION to avoid conflicts)
  {
    # For ENSNameIdentifier, get the label (the ENS name, e.g., "agent.eth")
    ?identifier a agentictrustEth:ENSNameIdentifier ;
      rdfs:label ?identifierValue .
  }
  UNION
  {
    # For AccountIdentifier, get the account address via hasAccount
    ?identifier a agentictrustEth:AccountIdentifier ;
      .
    ?account agentictrustEth:hasIdentifier ?identifier .
    ?account agentictrustEth:accountAddress ?identifierValue .
  }
  UNION
  {
    # For 8004IdentityIdentifier, extract the DID value from the DID IRI
    ?identifier a erc8004:8004IdentityIdentifier ;
      agentictrust:hasDID ?didNode .
    # Extract the DID value from the IRI (e.g., from https://www.agentictrust.io/id/did/did%3A8004%3A84532%3A1)
    # URL decode %3A to :
    BIND(REPLACE(REPLACE(STR(?didNode), "^.*/([^/]+)$", "$1"), "%3A", ":") AS ?identifierValue)
  }
  
  # Optional: get DID IRI if it exists
  OPTIONAL {
    ?identifier agentictrust:hasDID ?did .
  }
}
```

### Get Agents with Their Identifiers (Accounts)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId ?account ?accountAddress ?accountType
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?account .
  ?account a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId ;
    agentictrustEth:accountAddress ?accountAddress ;
    agentictrustEth:accountType ?accountType .
  FILTER (?agentId = "4558")
}
ORDER BY ?chainId ?agentId
```

### Get Agents with Account Details (Chain ID, Address, Type)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId ?accountAddress ?accountType ?eoaOwner
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?accountIdentifier .
  ?accountIdentifier a agentictrustEth:AccountIdentifier .
  ?account a agentictrustEth:Account ;
    agentictrustEth:hasIdentifier ?accountIdentifier ;
    agentictrustEth:accountChainId ?chainId ;
    agentictrustEth:accountAddress ?accountAddress ;
    agentictrustEth:accountType ?accountType .
  OPTIONAL {
    ?account agentictrustEth:hasEOAOwner ?eoaAccount .
    ?eoaAccount agentictrustEth:accountAddress ?eoaOwner .
  }
}
ORDER BY ?chainId ?agentId
```

## Agents with Descriptors

### Get Agents with Agent Descriptors

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?chainId ?agentId ?descriptor ?descriptorName
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    agentictrust:hasAgentDescriptor ?descriptor .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  ?descriptor a agentictrust:AgentDescriptor .
  OPTIONAL { ?descriptor rdfs:label ?descriptorName . }
}
ORDER BY ?chainId ?agentId
```

### Get Agents with A2A Protocol Descriptors

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?chainId ?agentId ?agentDescriptor ?protocolDescriptor ?protocolVersion
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    agentictrust:hasAgentDescriptor ?agentDescriptor .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  ?agentDescriptor a agentictrust:AgentDescriptor .
  # Protocol descriptors are separate entities, linked by IRI pattern matching agent
  OPTIONAL {
    ?protocolDescriptor a agentictrust:A2AProtocolDescriptor, agentictrust:ProtocolDescriptor .
    OPTIONAL { ?protocolDescriptor agentictrust:protocolVersion ?protocolVersion . }
    # Match protocol descriptor IRI pattern: /protocol-descriptor/a2a/{chainId}/{agentId}
    FILTER (STRSTARTS(STR(?protocolDescriptor), CONCAT("https://www.agentictrust.io/id/protocol-descriptor/a2a/", STR(?chainId), "/", STR(?agentId))))
  }
}
ORDER BY ?chainId ?agentId
```

## Agents with Skills

### Get Agents with Their Skills

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?chainId ?agentId ?skill ?skillId ?skillName
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    agentictrust:hasAgentDescriptor ?descriptor .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  ?descriptor agentictrust:hasSkill ?skill .
  ?skill a agentictrust:Skill ;
    agentictrust:skillId ?skillId .
  OPTIONAL { ?skill agentictrust:skillName ?skillName . }
}
ORDER BY ?chainId ?agentId ?skillId
```

### Count Skills per Agent

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId (COUNT(?skill) AS ?skillCount)
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    agentictrust:hasAgentDescriptor ?descriptor .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  ?descriptor agentictrust:hasSkill ?skill .
}
GROUP BY ?agent ?chainId ?agentId
ORDER BY DESC(?skillCount)
```

### Get Protocol Descriptors

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId ?did ?protocolDescriptor ?protocolVersion ?preferredTransport ?serviceUrl
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    agentictrust:hasDID ?did .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  # Protocol descriptor linked by DID in IRI pattern (protocol-agnostic, no chainId needed)
  ?protocolDescriptor a agentictrust:A2AProtocolDescriptor, agentictrust:ProtocolDescriptor .
  # Match protocol descriptor IRI pattern: /protocol-descriptor/a2a/{did}
  # DID value is URL-encoded in the IRI, extract the encoded segment from DID IRI
  BIND (REPLACE(STR(?did), "^.*/([^/]+)$", "$1") AS ?didEncoded)
  FILTER (STRSTARTS(STR(?protocolDescriptor), CONCAT("https://www.agentictrust.io/id/protocol-descriptor/a2a/", ?didEncoded)))
  OPTIONAL { ?protocolDescriptor agentictrust:protocolVersion ?protocolVersion . }
  OPTIONAL { ?protocolDescriptor agentictrust:preferredTransport ?preferredTransport . }
  OPTIONAL { ?protocolDescriptor agentictrust:serviceUrl ?serviceUrl . }
}
ORDER BY ?chainId ?agentId
```

### Get Agent → AgentDescriptor → A2A Protocol Descriptor → Skills

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId ?did ?agentDescriptor ?protocolDescriptor ?protocolVersion ?skill ?skillId ?skillName
WHERE {
  # Agent
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    agentictrust:hasDID ?did ;
    agentictrust:hasAgentDescriptor ?agentDescriptor .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  
  # AgentDescriptor
  ?agentDescriptor a agentictrust:AgentDescriptor .
  
  # A2A Protocol Descriptor (linked by DID in IRI pattern - protocol-agnostic, no chainId needed)
  ?protocolDescriptor a agentictrust:A2AProtocolDescriptor, agentictrust:ProtocolDescriptor .
  OPTIONAL { ?protocolDescriptor agentictrust:protocolVersion ?protocolVersion . }
  # Match protocol descriptor IRI pattern: /protocol-descriptor/a2a/{did}
  # DID value is URL-encoded in the IRI
  BIND (REPLACE(STR(?did), "^.*/([^/]+)$", "$1") AS ?didEncoded)
  FILTER (STRSTARTS(STR(?protocolDescriptor), CONCAT("https://www.agentictrust.io/id/protocol-descriptor/a2a/", ?didEncoded)))
  
  # Skills from AgentDescriptor (skills are declared on AgentDescriptor, not ProtocolDescriptor)
  ?agentDescriptor agentictrust:hasSkill ?skill .
  ?skill a agentictrust:Skill ;
    agentictrust:skillId ?skillId .
  OPTIONAL { ?skill agentictrust:skillName ?skillName . }
}
ORDER BY ?chainId ?agentId ?skillId
```

## Agents with Trust Assertions

### Get Agents with Verification Assertions (Validations)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?chainId ?agentId ?validation ?validator
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    erc8004:hasValidation ?validation .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  ?validation a erc8004:ValidationResponse, agentictrust:VerificationAssertion .
  OPTIONAL {
    ?validation erc8004:validatorAgent ?validator .
  }
}
ORDER BY ?chainId ?agentId
```

### Get Agents with Reputation Assertions (Feedback)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?chainId ?agentId ?feedback ?client
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    erc8004:hasFeedback ?feedback .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  ?feedback a erc8004:Feedback, agentictrust:ReputationAssertion .
  OPTIONAL {
    ?feedback erc8004:feedbackClient ?clientAccount .
    ?clientAccount agentictrustEth:accountAddress ?client .
  }
}
ORDER BY ?chainId ?agentId
```

### Count Trust Assertions per Agent

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?chainId ?agentId 
  (COUNT(DISTINCT ?validation) AS ?validationCount)
  (COUNT(DISTINCT ?feedback) AS ?feedbackCount)
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent erc8004:hasValidation ?validation . }
  OPTIONAL { ?agent erc8004:hasFeedback ?feedback . }
}
GROUP BY ?agent ?chainId ?agentId
ORDER BY DESC(?validationCount) DESC(?feedbackCount)
```

## Agents with Relationships

### Get Agents with Agent-to-Agent Relationships

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?chainId ?agentId ?relationship ?otherAgent
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    agentictrust:hasRelationship ?relationship .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  ?relationship agentictrust:participatesInRelationship ?otherAgent .
  FILTER (?otherAgent != ?agent)
}
ORDER BY ?chainId ?agentId
```

### Get Agents with Account Relationships (ERC-8092)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>

SELECT ?agent ?chainId ?agentId ?account ?accountRelationship ?relationshipId
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?accountIdentifier .
  ?accountIdentifier a agentictrustEth:AccountIdentifier .
  ?account a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId ;
    agentictrustEth:hasIdentifier ?accountIdentifier ;
    agentictrustEth:hasAccountRelationship ?accountRelationship .
  ?accountRelationship a agentictrustEth:AccountRelationship .
  OPTIONAL {
    ?accountRelationship erc8092:relationshipId ?relationshipId .
  }
}
ORDER BY ?chainId ?agentId
```

## Complex Queries

### Get Complete Agent Profile

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?chainId ?agentId ?agentName 
  ?accountAddress ?accountType
  ?descriptorName
  (COUNT(DISTINCT ?skill) AS ?skillCount)
  (COUNT(DISTINCT ?validation) AS ?validationCount)
  (COUNT(DISTINCT ?feedback) AS ?feedbackCount)
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId ;
    agentictrustEth:accountAddress ?accountAddress ;
    agentictrustEth:accountType ?accountType .
  OPTIONAL { ?agent agentictrust:agentName ?agentName . }
  OPTIONAL {
    ?agent agentictrust:hasAgentDescriptor ?descriptor .
    ?descriptor rdfs:label ?descriptorName .
    ?descriptor agentictrust:hasSkill ?skill .
  }
  OPTIONAL { ?agent erc8004:hasValidation ?validation . }
  OPTIONAL { ?agent erc8004:hasFeedback ?feedback . }
}
GROUP BY ?agent ?chainId ?agentId ?agentName ?accountAddress ?accountType ?descriptorName
ORDER BY ?chainId ?agentId
```

### Get Agents by Account Address

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId ?accountAddress
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?accountIdentifier .
  ?accountIdentifier a agentictrustEth:AccountIdentifier .
  ?account a agentictrustEth:Account ;
    agentictrustEth:hasIdentifier ?accountIdentifier ;
    agentictrustEth:accountAddress "0x1234..." ;
    agentictrustEth:accountChainId ?chainId .
  BIND("0x1234..." AS ?accountAddress)
}
```

### Get Agents with Descriptors and Read Timestamp

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId ?descriptor ?readAt
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    agentictrust:hasAgentDescriptor ?descriptor ;
    agentictrust:agentDescriptorReadAt ?readAt .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
}
ORDER BY DESC(?readAt)
```

## Filtering and Aggregation

### Get Agents on Specific Chain

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?chainId ?agentId ?agentName
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId 11155111 .
  BIND(11155111 AS ?chainId)
  OPTIONAL { ?agent agentictrust:agentName ?agentName . }
}
ORDER BY ?agentId
```

### Get Agents Created After Timestamp

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?chainId ?agentId ?createdAt
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    agentictrust:createdAtTime ?createdAt .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  FILTER (?createdAt > 1700000000)
}
ORDER BY DESC(?createdAt)
```

### Get Top Agents by Validation Count

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?chainId ?agentId ?agentName (COUNT(?validation) AS ?validationCount)
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId ;
    agentictrust:hasIdentifier ?identifier ;
    erc8004:hasValidation ?validation .
  ?identifier a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent agentictrust:agentName ?agentName . }
}
GROUP BY ?agent ?chainId ?agentId ?agentName
ORDER BY DESC(?validationCount)
LIMIT 10
```

