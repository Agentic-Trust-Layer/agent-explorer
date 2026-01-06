# Agent 4476: SPARQL Queries and Data Model

**Agent ID**: 4476  
**Chain ID**: 11155111  
**ERC-8004 identity DID (identity layer)**: `did:8004:11155111:4476`  
**Agent Name**: `movie-reviewer.8004-agent.eth` / `movie-reviewer-v2.8004-agent.eth`

This document provides comprehensive SPARQL queries and diagrams for exploring agent 4476's data in the RDF knowledge base, including identity, identifiers, names, situations, and assertions.

## Prefixes

All queries use these standard prefixes:

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

## Agent Identity, Identifier, and Name

### Complete Identity Model

This query retrieves a **tight** identity slice (no wide UNION fanout): Agent(account-anchored) → Identity8004 → IdentityIdentifier8004, plus ENS.

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT
  ?agent
  ?agentId
  ?chainId
  ?accountAddress
  ?didAccount
  ?agentName
  ?didIdentity
  ?identity
  ?identityIdentifier
  ?ensName
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }

  # Bind the agent node once (account-anchored AIAgent)
  {
    SELECT ?agent ?accountAddress ?didAccount
    WHERE {
      ?agent a agentictrust:AIAgent, agentictrustEth:Account .
      ?agent agentictrust:agentId ?agentId .
      ?agent agentictrustEth:accountChainId ?chainId .
      ?agent agentictrustEth:accountAddress ?accountAddress .
      OPTIONAL { ?agent agentictrust:didAccount ?didAccount . }
    }
    LIMIT 1
  }

  OPTIONAL { ?agent agentictrust:agentName ?agentName . }
  OPTIONAL { ?agent agentictrust:didIdentity ?didIdentity . }

  # ERC-8004 identity (tight)
  OPTIONAL {
    ?agent agentictrust:hasIdentity ?identity .
    ?identity a erc8004:AgentIdentity8004 .
    ?identity agentictrust:hasIdentifier ?identityIdentifier .
    ?identityIdentifier a erc8004:IdentityIdentifier8004 .
  }

  # ENS Name (tight)
  OPTIONAL {
    ?agent agentictrust:hasName ?ensNameIri .
    ?ensNameIri a agentictrustEth:AgentNameENS .
    ?ensNameIri agentictrustEth:ensName ?ensName .
  }
}
LIMIT 50
```

### Agent Basic Information

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT DISTINCT ?agent ?agentId ?chainId ?accountAddress ?agentName ?didIdentity ?didAccount
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .
  ?agent agentictrustEth:accountAddress ?accountAddress .
  
  OPTIONAL { ?agent agentictrust:agentName ?agentName . }
  OPTIONAL { ?agent agentictrust:didIdentity ?didIdentity . }
  OPTIONAL { ?agent agentictrust:didAccount ?didAccount . }
}
LIMIT 1
```

### Agent with Account Identifier

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT DISTINCT ?agent ?agentId ?accountAddress ?chainId ?accountType
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .
  ?agent agentictrustEth:accountAddress ?accountAddress .
  OPTIONAL { ?agent agentictrustEth:accountType ?accountType . }
}
LIMIT 1
```

## ERC-8004 Situations and Assertions

### Situations and assertion counts (small result set)

This query returns **one row per situation type** with counts, instead of exploding into many rows.

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT
  ?bucket
  (COUNT(DISTINCT ?situation) AS ?situationCount)
  (COUNT(DISTINCT ?assertionAct) AS ?assertionActCount)
  (COUNT(DISTINCT ?assertionRecord) AS ?assertionRecordCount)
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent agentictrust:hasIdentity ?identity . }

  # Bucket by record type (avoids depending on ?situation rdf:type, which may vary)
  VALUES ?bucket { "reputation" "verification" "relationship" "delegation" }

  # Reputation: Feedback records
  {
    FILTER(?bucket = "reputation")
    ?assertionRecord a erc8004:Feedback .
    FILTER(
      EXISTS { ?agent erc8004:hasFeedback ?assertionRecord } ||
      EXISTS { ?identity erc8004:hasFeedback ?assertionRecord } ||
      EXISTS { ?assertionRecord agentictrust:aboutSubject ?identity }
    )
    OPTIONAL { ?assertionRecord agentictrust:recordsSituation ?situation . }
    OPTIONAL { ?assertionAct agentictrust:generatedAssertionRecord ?assertionRecord . }
  }
  UNION
  # Verification: ValidationResponse records
  {
    FILTER(?bucket = "verification")
    ?assertionRecord a erc8004:ValidationResponse .
    FILTER(
      EXISTS { ?agent erc8004:hasValidation ?assertionRecord } ||
      EXISTS { ?identity erc8004:hasValidation ?assertionRecord } ||
      EXISTS { ?assertionRecord agentictrust:aboutSubject ?identity }
    )
    OPTIONAL { ?assertionRecord agentictrust:recordsSituation ?situation . }
    OPTIONAL { ?assertionAct agentictrust:generatedAssertionRecord ?assertionRecord . }
  }
  UNION
  # Relationship: ERC-8092 relationship assertions
  {
    FILTER(?bucket = "relationship")
    ?assertionRecord a erc8092:RelationshipAssertion .
    # these are account-centric; keep this join narrow by requiring the asserted situation to be about the agent
    ?assertionRecord agentictrust:recordsSituation ?situation .
    ?situation agentictrust:isAboutAgent ?agent .
    OPTIONAL { ?assertionAct agentictrust:generatedAssertionRecord ?assertionRecord . }
  }
  UNION
  # Delegation: DelegationTrustAssertionRecord (if present)
  {
    FILTER(?bucket = "delegation")
    ?assertionRecord a agentictrust:DelegationTrustAssertionRecord .
    FILTER(
      EXISTS { ?assertionRecord agentictrust:aboutSubject ?identity } ||
      EXISTS { ?assertionRecord agentictrust:aboutSubject ?agent }
    )
    OPTIONAL { ?assertionRecord agentictrust:recordsSituation ?situation . }
    OPTIONAL { ?assertionAct agentictrust:generatedAssertionRecord ?assertionRecord . }
  }
}
GROUP BY ?bucket
ORDER BY ?bucket
```

### Reputation Situations and Feedback Assertions

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT DISTINCT
  ?agent
  ?agentId
  ?repSituation
  ?feedbackRecord
  ?feedbackAct
  ?feedbackIndex
  ?score
  ?ratingPct
  ?clientAddress
  ?isRevoked
  ?skill
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent agentictrust:hasIdentity ?identity . }
  
  # Feedback record (Entity) anchored via agent or identity (or aboutSubject)
  ?feedbackRecord a erc8004:Feedback, agentictrust:ReputationTrustAssertion, agentictrust:TrustAssertion, prov:Entity .
  FILTER(
    EXISTS { ?agent erc8004:hasFeedback ?feedbackRecord } ||
    EXISTS { ?identity erc8004:hasFeedback ?feedbackRecord } ||
    EXISTS { ?feedbackRecord agentictrust:aboutSubject ?identity }
  )
  OPTIONAL { ?feedbackRecord agentictrust:recordsSituation ?repSituation . }
  ?feedbackRecord erc8004:feedbackIndex ?feedbackIndex .
  
  # Feedback act (Activity)
  ?feedbackAct a erc8004:FeedbackAct, agentictrust:ReputationTrustAssertionAct, agentictrust:TrustAssertionAct, agentictrust:Attestation, prov:Activity .
  ?feedbackAct agentictrust:assertsSituation ?repSituation .
  ?feedbackAct agentictrust:generatedAssertionRecord ?feedbackRecord .
  
  OPTIONAL { ?feedbackRecord erc8004:feedbackScore ?score . }
  OPTIONAL { ?feedbackRecord erc8004:feedbackRatingPct ?ratingPct . }
  OPTIONAL { ?feedbackRecord erc8004:isRevoked ?isRevoked . }
  OPTIONAL { 
    ?feedbackRecord erc8004:feedbackClient ?clientAccount .
    ?clientAccount agentictrustEth:accountAddress ?clientAddress .
  }
  OPTIONAL { ?feedbackRecord erc8004:feedbackSkill ?skillIri . ?skillIri rdfs:label ?skill . }
}
ORDER BY ?feedbackIndex
LIMIT 50
```

### Verification Situations and Validation Assertions

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT DISTINCT
  ?agent
  ?agentId
  ?verificationSituation
  ?verificationRequest
  ?validationResponse
  ?validationAct
  ?requestHash
  ?responseHash
  ?responseValue
  ?validatorAddress
  ?tag
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent agentictrust:hasIdentity ?identity . }
  
  # Validation response record (Entity) anchored via agent or identity (or aboutSubject)
  ?validationResponse a erc8004:ValidationResponse, agentictrust:VerificationTrustAssertion, agentictrust:TrustAssertion, prov:Entity .
  FILTER(
    EXISTS { ?agent erc8004:hasValidation ?validationResponse } ||
    EXISTS { ?identity erc8004:hasValidation ?validationResponse } ||
    EXISTS { ?validationResponse agentictrust:aboutSubject ?identity }
  )
  OPTIONAL { ?validationResponse agentictrust:recordsSituation ?verificationSituation . }
  OPTIONAL { ?validationResponse erc8004:validationRespondsToRequest ?verificationRequest . }
  OPTIONAL { ?verificationRequest erc8004:requestHash ?requestHash . }
  OPTIONAL { ?validationResponse erc8004:validationResponseValue ?responseValue . }
  OPTIONAL { ?validationResponse erc8004:responseHash ?responseHash . }
  OPTIONAL { ?validationResponse erc8004:validationTagCheck ?tagCheck . ?tagCheck rdfs:label ?tag . }
  OPTIONAL {
    ?validationResponse erc8004:validatorAddressForResponse ?validatorAddr .
    BIND(STR(?validatorAddr) AS ?validatorAddress)
  }
  
  # Validation response act (Activity)
  OPTIONAL {
    ?validationAct a erc8004:ValidationResponseAct, agentictrust:VerificationTrustAssertionAct, agentictrust:TrustAssertionAct, agentictrust:Attestation, prov:Activity .
    ?validationAct agentictrust:generatedAssertionRecord ?validationResponse .
  }
}
ORDER BY ?requestHash
LIMIT 50
```

### Relationship Situations and Assertions

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT DISTINCT
  ?agent
  ?agentId
  ?relationshipSituation
  ?relationship
  ?relationshipAssertion
  ?assertionAct
  ?associationId
  ?initiator
  ?approver
  ?interfaceId
  ?validAt
  ?validUntil
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .
  
  # Relationship situation
  ?relationshipSituation a agentictrust:RelationshipTrustSituation, agentictrust:RelationshipSituation, agentictrust:TrustSituation, prov:Entity .
  ?relationshipSituation agentictrust:isAboutAgent ?agent .
  
  # Relationship entity
  ?relationship a agentictrust:Relationship, prov:Entity .
  ?relationshipSituation agentictrust:isAboutRelationship ?relationship .
  
  # Relationship assertion record
  ?relationshipAssertion a erc8092:RelationshipAssertion, agentictrust:RelationshipTrustAssertion, agentictrust:TrustAssertion, prov:Entity .
  ?relationshipAssertion agentictrust:recordsSituation ?relationshipSituation .
  ?relationshipAssertion erc8092:assertsRelationship ?relationship .
  
  # Relationship assertion act
  ?assertionAct a erc8092:AssociatedAccountsAct8092, agentictrust:RelationshipTrustAssertionAct, agentictrust:TrustAssertionAct, agentictrust:Attestation, prov:Activity .
  ?assertionAct agentictrust:assertsSituation ?relationshipSituation .
  ?assertionAct agentictrust:generatedAssertionRecord ?relationshipAssertion .
  
  # Relationship details
  ?relationshipAssertion erc8092:associationId ?associationId .
  OPTIONAL { ?relationshipAssertion erc8092:initiatorAccount ?initiatorAccount . ?initiatorAccount agentictrustEth:accountAddress ?initiator . }
  OPTIONAL { ?relationshipAssertion erc8092:approverAccount ?approverAccount . ?approverAccount agentictrustEth:accountAddress ?approver . }
  OPTIONAL { ?relationshipAssertion erc8092:interfaceId ?interfaceId . }
  OPTIONAL { ?relationshipAssertion erc8092:validAt ?validAt . }
  OPTIONAL { ?relationshipAssertion erc8092:validUntil ?validUntil . }
}
ORDER BY ?associationId
LIMIT 50
```

## Agent Descriptor and Metadata

### Agent Descriptor with Endpoints and Skills

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT DISTINCT
  ?agent
  ?agentId
  ?agentRegistration
  ?endpoint
  ?endpointType
  ?endpointUrl
  ?agentSkill
  ?skillId
  ?skillName
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .

  # ERC-8004 registration descriptor (this is where endpoints/skills live for 8004 agents)
  ?agent erc8004:hasAgentRegistration8004 ?agentRegistration .
  ?agentRegistration a erc8004:AgentRegistration8004 .
  
  # Endpoints
  OPTIONAL {
    ?agentRegistration agentictrust:hasEndpoint ?endpoint .
    ?endpoint a agentictrust:Endpoint .
    OPTIONAL { ?endpoint agentictrust:endpointType ?endpointType . }
    OPTIONAL { ?endpoint agentictrust:serviceUrl ?endpointUrl . }
  }
  
  # Skills
  OPTIONAL {
    ?agentRegistration agentictrust:hasSkill ?agentSkill .
    ?agentSkill a agentictrust:AgentSkill .
    OPTIONAL {
      ?agentSkill agentictrust:hasSkillClassification ?skill .
      OPTIONAL { ?skill agentictrust:oasfSkillId ?skillId . }
      OPTIONAL { ?skill rdfs:label ?skillName . }
    }
  }
}
ORDER BY ?endpointType ?skillId
LIMIT 100
```

### ERC-8004 Registration Metadata

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT DISTINCT
  ?agent
  ?agentId
  ?agentRegistration
  ?registrationJson
  ?trustModel
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .
  
  ?agent erc8004:hasAgentRegistration8004 ?agentRegistration .
  ?agentRegistration a erc8004:AgentRegistration8004 .
  
  OPTIONAL { ?agentRegistration agentictrust:json ?registrationJson . }
  OPTIONAL { ?agentRegistration agentictrust:hasTrustModel ?trustModel . }
}
LIMIT 50
```

## Complete Agent Graph

### All Relationships for Agent 4476

This comprehensive query retrieves all relationships: identity, identifiers, names, situations, assertions, descriptors, and metadata.

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?subject ?predicate ?object ?objectType
WHERE {
  # Start with agent 4476
  ?agent a agentictrust:AIAgent .
  ?agent agentictrust:agentId "4476" .
  
  # Get all triples where agent is subject
  {
    ?agent ?predicate ?object .
    BIND(?agent AS ?subject)
    OPTIONAL { ?object a ?objectType . }
  }
  UNION
  # Get all triples where agent's identity/identifier/name is subject
  {
    {
      ?agent agentictrust:hasIdentity|agentictrust:hasIdentifier|agentictrust:hasName|erc8004:hasAgentRegistration8004 ?related .
    }
    UNION
    {
      ?agent agentictrust:hasIdentity ?identity .
      ?identity agentictrust:hasIdentifier ?related .
    }
    ?related ?predicate ?object .
    BIND(?related AS ?subject)
    OPTIONAL { ?object a ?objectType . }
  }
  UNION
  # Get all triples where agent's situations are subject
  {
    ?situation agentictrust:isAboutAgent ?agent .
    ?situation ?predicate ?object .
    BIND(?situation AS ?subject)
    OPTIONAL { ?object a ?objectType . }
  }
  UNION
  # Get all triples where agent's assertions are subject
  {
    ?situation agentictrust:isAboutAgent ?agent .
    ?assertion agentictrust:assertsSituation ?situation .
    ?assertion ?predicate ?object .
    BIND(?assertion AS ?subject)
    OPTIONAL { ?object a ?objectType . }
  }
}
ORDER BY ?subject ?predicate
LIMIT 1000
```

## Data Model Diagrams

### Agent Identity and Identifier Structure

```mermaid
graph TB
    Agent["AIAgent<br/>agentId: 4476<br/>did:8004:11155111:4476"]
    
    Identity["AgentIdentity8004<br/>ERC-8004 Identity"]
    IdentityIdentifier["IdentityIdentifier8004<br/>Identifier"]
    DID["DID<br/>did:8004:11155111:4476"]
    
    AccountIdentifier["AccountIdentifier<br/>Account Identifier"]
    Account["Account<br/>Ethereum Account"]
    AccountDID["DID<br/>did:ethr:..."]
    
    ENSName["AgentNameENS<br/>movie-reviewer.8004-agent.eth"]
    ENSIdentifier["NameIdentifierENS<br/>ENS Identifier"]
    
    AgentDescriptor["AgentRegistration8004<br/>Registration Metadata"]
    
    Agent -->|hasIdentity| Identity
    Identity -->|hasIdentifier| IdentityIdentifier
    IdentityIdentifier -->|hasDID| DID
    
    Agent -->|hasIdentifier| AccountIdentifier
    AccountIdentifier -->|hasDescriptor| Account
    Account -->|hasDID| AccountDID
    
    Agent -->|hasName| ENSName
    ENSName -->|hasIdentifier| ENSIdentifier
    
    Agent -->|hasAgentRegistration8004| AgentDescriptor
```

### Situations and Assertions Model

```mermaid
graph TB
    Agent["AIAgent<br/>agentId: 4476"]
    
    RepSituation["ReputationTrustSituation<br/>Reputation Situation"]
    VerifSituation["VerificationRequestSituation<br/>Verification Situation"]
    RelSituation["RelationshipTrustSituation<br/>Relationship Situation"]
    
    FeedbackRecord["Feedback<br/>Feedback Record Entity"]
    FeedbackAct["FeedbackAct<br/>Feedback Activity"]
    
    ValidationRequest["VerificationRequestSituation<br/>Validation Request"]
    ValidationResponse["ValidationResponse<br/>Validation Response Entity"]
    ValidationAct["ValidationResponseAct<br/>Validation Activity"]
    
    Relationship["Relationship<br/>Relationship Entity"]
    RelAssertion["RelationshipAssertion<br/>Relationship Assertion Entity"]
    RelAct["AssociatedAccountsAct8092<br/>Relationship Activity"]
    
    Agent -->|isAboutAgent| RepSituation
    Agent -->|isAboutAgent| VerifSituation
    Agent -->|isAboutAgent| RelSituation
    
    FeedbackAct -->|assertsSituation| RepSituation
    FeedbackAct -->|generatedAssertionRecord| FeedbackRecord
    FeedbackRecord -->|recordsSituation| RepSituation
    
    ValidationAct -->|assertsSituation| VerifSituation
    ValidationAct -->|generatedAssertionRecord| ValidationResponse
    ValidationResponse -->|recordsSituation| VerifSituation
    ValidationResponse -->|validationRespondsToRequest| ValidationRequest
    
    RelAct -->|assertsSituation| RelSituation
    RelAct -->|generatedAssertionRecord| RelAssertion
    RelAssertion -->|recordsSituation| RelSituation
    RelAssertion -->|assertsRelationship| Relationship
```

### Complete Trust Graph for Agent 4476

```mermaid
graph LR
    Agent["Agent 4476<br/>movie-reviewer.8004-agent.eth"]
    
    subgraph Identity["Identity Layer"]
        DID8004["DID:8004<br/>did:8004:11155111:4476"]
        Account["Account<br/>Ethereum Address"]
        ENS["ENS Name<br/>movie-reviewer.8004-agent.eth"]
    end
    
    subgraph Trust["Trust Assertions"]
        Feedback1["Feedback #1<br/>Score: 100"]
        Feedback2["Feedback #2<br/>Score: 100"]
        Feedback3["Feedback #3<br/>Score: 100"]
        Validation1["Validation #1"]
        Validation2["Validation #2"]
        Relationship1["Relationship #1"]
    end
    
    subgraph Situations["Trust Situations"]
        RepSit1["Reputation Situation 1"]
        RepSit2["Reputation Situation 2"]
        RepSit3["Reputation Situation 3"]
        VerifSit1["Verification Situation 1"]
        VerifSit2["Verification Situation 2"]
        RelSit1["Relationship Situation 1"]
    end
    
    Agent --> Identity
    Agent --> Trust
    Trust --> Situations
    
    Feedback1 --> RepSit1
    Feedback2 --> RepSit2
    Feedback3 --> RepSit3
    Validation1 --> VerifSit1
    Validation2 --> VerifSit2
    Relationship1 --> RelSit1
```

## Summary Statistics

### Count All Assertions by Type

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>

SELECT ?assertionType (COUNT(DISTINCT ?assertion) AS ?count)
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent agentictrust:hasIdentity ?identity . }
  
  {
    ?situation agentictrust:isAboutAgent ?agent .
    ?assertion agentictrust:assertsSituation ?situation .
    ?assertion a ?assertionType .
  }
  UNION
  {
    { ?agent erc8004:hasFeedback|erc8004:hasValidation ?assertion . }
    UNION
    { ?identity erc8004:hasFeedback|erc8004:hasValidation ?assertion . }
    ?assertion a ?assertionType .
  }
  UNION
  {
    ?agent erc8092:hasRelationship ?relationship .
    ?assertion erc8092:assertsRelationship ?relationship .
    ?assertion a ?assertionType .
  }
}
GROUP BY ?assertionType
ORDER BY DESC(?count)
```

### Feedback Statistics

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT 
  (COUNT(DISTINCT ?feedback) AS ?totalFeedbacks)
  (AVG(?score) AS ?avgScore)
  (MIN(?score) AS ?minScore)
  (MAX(?score) AS ?maxScore)
  (COUNT(DISTINCT ?client) AS ?uniqueClients)
WHERE {
  VALUES (?agentId ?chainId) { ("4476" 11155111) }
  ?agent a agentictrust:AIAgent, agentictrustEth:Account .
  ?agent agentictrust:agentId ?agentId .
  ?agent agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent agentictrust:hasIdentity ?identity . }

  {
    ?agent erc8004:hasFeedback ?feedback .
  }
  UNION
  {
    ?identity erc8004:hasFeedback ?feedback .
  }
  ?feedback a erc8004:Feedback .
  ?feedback erc8004:feedbackScore ?score .
  OPTIONAL {
    ?feedback erc8004:feedbackClient ?clientAccount .
    ?clientAccount agentictrustEth:accountAddress ?client .
  }
}
```

## Notes

- Agent 4476 is registered on chain 11155111 (Sepolia testnet)
- The agent has multiple feedback records, validation requests/responses, and relationship assertions
- The agent uses the ERC-8004 identity system with DID `did:8004:11155111:4476`
- The agent has an ENS name: `movie-reviewer.8004-agent.eth`
- All queries filter by `agentId = "4476"` and can be adapted for other agents by changing this value

