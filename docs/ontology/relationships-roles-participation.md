# Relationships, Roles, and Participation

This document describes the relationship model with participant and role support, from the core ontology through Ethereum-specific and ERC-8092 concrete implementations.

## Overview

The relationship model supports:
- **Relationships**: Persistent social relationships between Agents
- **Participants**: Agents that participate in relationships
- **Roles**: Qualifying roles for participation (using p-plan:Role)
- **Qualified Participation**: Reified participation linking Relationship → Agent → Role

## Core Relationship Model (agentictrust-core)

### Class Hierarchy

```mermaid
classDiagram
    class Relationship {
        <<agentictrust>>
    }
    class QualifiedParticipation {
        <<agentictrust>>
    }
    class provAgent["prov:Agent"]
    class provSoftwareAgent["prov:SoftwareAgent"]
    class AIAgent {
        <<agentictrust>>
    }
    class pplanRole["p-plan:Role"]
    
    Relationship --> provAgent : hasParticipant
    Relationship --> QualifiedParticipation : qualifiedParticipation
    Relationship --> pplanRole : hasRole
    QualifiedParticipation --> provAgent : participant
    QualifiedParticipation --> pplanRole : participationRole
    provAgent --> pplanRole : playsRole
    
    provSoftwareAgent --|> provAgent
    AIAgent --|> provSoftwareAgent
    
    note for Relationship "agentictrust:Relationship\nPersistent social relationship\nbetween Agents"
    note for QualifiedParticipation "agentictrust:QualifiedParticipation\nReified participation with role"
    note for pplanRole "p-plan:Role\nQualifying role for participation"
```

### Core Properties

- `agentictrust:hasParticipant`: Links a Relationship to an Agent that participates in it
- `agentictrust:qualifiedParticipation`: Links a Relationship to a QualifiedParticipation instance
- `agentictrust:participant`: Links a QualifiedParticipation to the Agent that participates
- `agentictrust:participationRole`: Links a QualifiedParticipation to the Role (p-plan:Role) that qualifies the participation
- `agentictrust:hasRole`: Links a Relationship to a Role (p-plan:Role) that is used in the relationship
- `agentictrust:playsRole`: Links an Agent to a Role (p-plan:Role) that it plays

### SPARQL Query: Core Relationship with Participants

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?relationship ?participant
WHERE {
  ?relationship a agentictrust:Relationship .
  ?relationship agentictrust:hasParticipant ?participant .
  ?participant a prov:Agent .
}
```

### SPARQL Query: Relationship with Qualified Participation

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX p-plan: <http://purl.org/net/p-plan#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?relationship ?participant ?role
WHERE {
  ?relationship a agentictrust:Relationship .
  ?relationship agentictrust:qualifiedParticipation ?qualifiedParticipation .
  ?qualifiedParticipation agentictrust:participant ?participant .
  ?qualifiedParticipation agentictrust:participationRole ?role .
  ?participant a prov:Agent .
  ?role a p-plan:Role .
}
```

### SPARQL Query: Agent Roles

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX p-plan: <http://purl.org/net/p-plan#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?agent ?role
WHERE {
  ?agent a prov:Agent .
  ?agent agentictrust:playsRole ?role .
  ?role a p-plan:Role .
}
```

## Ethereum Account Relationship Model (agentictrust-eth)

### Class Hierarchy

```mermaid
classDiagram
    class Relationship {
        <<agentictrust>>
    }
    class AccountRelationship {
        <<agentictrustEth>>
    }
    class Account {
        <<agentictrustEth>>
    }
    class AccountIdentifier {
        <<agentictrustEth>>
    }
    class provSoftwareAgent["prov:SoftwareAgent"]
    
    Relationship <|-- AccountRelationship
    provSoftwareAgent <|-- Account
    Account --> AccountIdentifier : hasIdentifier (agentictrust)
    
    AccountRelationship --> Account : hasParticipant (agentictrust)
    
    note for Account "agentictrustEth:Account\nEthereum account (EOA or Smart Account)\nInherits from prov:SoftwareAgent"
    note for AccountRelationship "agentictrustEth:AccountRelationship\nPersistent relationship between Accounts\nInherits from agentictrust:Relationship"
    note for AccountIdentifier "agentictrustEth:AccountIdentifier\nIdentifier for an Ethereum Account"
```

### Key Changes

- **Account** is now a subclass of `prov:SoftwareAgent` (not just `prov:Entity`), enabling it to participate in relationships as an Agent
- **AccountRelationship** inherits from `agentictrust:Relationship`, inheriting all participant and role properties
- **Account** inherits `hasIdentifier` from `prov:Agent`, linking to `AccountIdentifier`

### SPARQL Query: Account Relationship with Participants

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?accountRelationship ?participantAccount ?accountIdentifier
WHERE {
  ?accountRelationship a agentictrustEth:AccountRelationship .
  ?accountRelationship agentictrust:hasParticipant ?participantAccount .
  ?participantAccount a agentictrustEth:Account .
  ?participantAccount agentictrust:hasIdentifier ?accountIdentifier .
  ?accountIdentifier a agentictrustEth:AccountIdentifier .
}
```

### SPARQL Query: Account with Identifier

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX prov: <http://www.w3.org/ns/prov#>

SELECT ?account ?accountAddress ?accountIdentifier ?did
WHERE {
  ?account a agentictrustEth:Account ;
    agentictrustEth:accountAddress ?accountAddress ;
    agentictrust:hasIdentifier ?accountIdentifier .
  ?accountIdentifier a agentictrustEth:AccountIdentifier .
  OPTIONAL {
    ?accountIdentifier agentictrustEth:hasDID ?did .
  }
}
```

## ERC-8092 Association Model (assertion-side only)

ERC-8092 intentionally defines only **assertion-side** terms. The relationship/situation modeling stays in `agentictrust-core.owl` + `agentictrust-eth.owl`.

```mermaid
classDiagram
direction LR

class Account["agentictrustEth:Account"]
class AccountAssociation["erc8092:AccountAssociation8092"]
class RelationshipTrustSituation["agentictrust:RelationshipTrustSituation"]
class AccountRelationship["agentictrustEth:AccountRelationship"]

Account --> AccountAssociation : hasAccountAssociation
AccountAssociation --> RelationshipTrustSituation : assertsSituation
RelationshipTrustSituation --> AccountRelationship : aboutSubject
```

### ERC-8092 association assertions (assertion-side only)

ERC-8092 is modeled as **assertion-side only**:

- `erc8092:AccountAssociation8092` (association record, as an assertion activity)
- `erc8092:AccountAssociationRevocation8092` (revocation)

The association asserts a **Situation** in core:

- `agentictrust:assertsSituation` → `agentictrust:RelationshipTrustSituation`
- `agentictrust:aboutSubject` (on the situation) → `agentictrustEth:AccountRelationship`

### SPARQL Query: ERC-8092 AccountAssociation8092 asserted relationship situation

```sparql
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?association ?situation ?relationship ?initiator ?approver ?initiatorAccountId ?approverAccountId
WHERE {
  ?association a erc8092:AccountAssociation8092 .
  OPTIONAL { ?association agentictrust:assertsSituation ?situation . }
  OPTIONAL {
    ?situation a agentictrust:RelationshipTrustSituation ;
      agentictrust:aboutSubject ?relationship .
    ?relationship a agentictrustEth:AccountRelationship .
  }
  OPTIONAL { ?association erc8092:initiator ?initiator . }
  OPTIONAL { ?association erc8092:approver ?approver . }
  OPTIONAL { ?association erc8092:initiatorAccountId ?initiatorAccountId . }
  OPTIONAL { ?association erc8092:approverAccountId ?approverAccountId . }
}
LIMIT 200
```

### SPARQL Query: Relationship with Qualified Participation (ERC-8092)

```sparql
PREFIX erc8092: <https://www.agentictrust.io/ontology/ERC8092#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX p-plan: <http://purl.org/net/p-plan#>

SELECT ?relationship ?participantAccount ?role
WHERE {
  ?relationship a agentictrustEth:AccountRelationship .
  ?relationship agentictrust:qualifiedParticipation ?qualifiedParticipation .
  ?qualifiedParticipation agentictrust:participant ?participantAccount .
  ?qualifiedParticipation agentictrust:participationRole ?role .
  ?participantAccount a agentictrustEth:Account .
  ?role a p-plan:Role .
}
```

## Summary

The relationship model provides a layered approach:

1. **Core Level** (`agentictrust-core`): Abstract Relationship with participant and role support
2. **Ethereum Level** (`agentictrust-eth`): AccountRelationship for account-to-account relationships, with Account as SoftwareAgent
3. **ERC-8092 Level** (`ERC8092`): Concrete ERC-8092 relationship implementation with assertion and account details

All levels support:
- Direct participant links via `hasParticipant`
- Role-qualified participation via `QualifiedParticipation`
- Role assignment via `hasRole` and `playsRole`

