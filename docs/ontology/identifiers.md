# Agent Identifiers and Identity Relationships

This document describes the complete agent identity model: how agents relate to identifiers (Account, NameENS, Identity8004), identifiers to DIDs, and how Descriptors provide resolved metadata views.

## Overview

The AgenticTrust ontology uses a layered identity model that separates:
- **Agents** (the software agent entities)
- **Identifiers** (stable identity anchors: Account, NameIdentifierENS, IdentityIdentifier8004)
- **Names** (human-readable names: NameENS)
- **DIDs** (decentralized identifiers for each identifier)
- **Descriptors** (resolver-produced, normalized metadata views)

### Core Identity Path

```
Agent (prov:Agent)
  ├─ hasIdentifier → Identifier (agentictrustEth:AccountIdentifier, agentictrustEth:NameIdentifierENS, erc8004:IdentityIdentifier8004)
  │   └─ hasDID → DID
  ├─ agentictrust:hasIdentity → erc8004:Identity8004
  │   ├─ hasIdentifier → erc8004:IdentityIdentifier8004
  │   └─ hasDescriptor → erc8004:IdentityDescriptor8004
  ├─ agentictrust:hasName → agentictrustEth:NameENS
  │   ├─ hasIdentifier → agentictrustEth:NameIdentifierENS
  │   └─ hasDescriptor → agentictrustEth:NameDescriptorENS
  ├─ agentictrustEth:hasAccountIdentifier → agentictrustEth:AccountIdentifier
  │   └─ agentictrustEth:hasDID → agentictrust:DID
  └─ hasAgentDescriptor → AgentDescriptor
      └─ hasDescriptor → AgentDescriptor

Account (agentictrustEth:Account, subclass of prov:SoftwareAgent)
  ├─ hasIdentifier → AccountIdentifier (inherited from prov:Agent)
  │   └─ hasDID → DID
  └─ accountAddress, accountChainId, accountType
```

**Note**: `hasIdentifier` is now defined at the `prov:Agent` level in `agentictrust-core.owl`, so all Agent subclasses (including `AIAgent` and `Account` as `SoftwareAgent`) inherit this property.

## Class Hierarchy

### Core Identifier Classes

```mermaid
classDiagram
    class Identifier {
        <<abstract>>
    }
    class UniversalIdentifier {
        <<abstract>>
    }
    class DecentralizedIdentifier {
        <<abstract>>
    }
    class DID {
    }
    class OperatorIdentifier {
    }
    class IdentityIdentifier8004 {
        <<erc8004>>
    }
    class NameIdentifierENS {
        <<agentictrustEth>>
    }
    class AccountIdentifier {
        <<agentictrustEth>>
    }
    class Account {
        <<agentictrustEth>>
    }
    class Name {
        <<abstract>>
    }
    class NameENS {
        <<agentictrustEth>>
    }
    class Identity8004 {
    }
    
    Identifier <|-- UniversalIdentifier
    Identifier <|-- NameIdentifierENS
    Identifier <|-- AccountIdentifier
    UniversalIdentifier <|-- IdentityIdentifier8004
    DecentralizedIdentifier <|-- DID
    DecentralizedIdentifier <|-- OperatorIdentifier
    Name <|-- NameENS
    
    note for IdentityIdentifier8004 "erc8004:IdentityIdentifier8004"
    note for Identity8004 "erc8004:Identity8004"
```

## Complete Agent-to-Identifier Relationships

```mermaid
classDiagram
    class AIAgent {
    }
    class Identifier {
        identifierType
    }
    class IdentityIdentifier8004 {
        <<erc8004>>
    }
    class AccountIdentifier {
        <<agentictrustEth>>
    }
    class NameIdentifierENS {
        <<agentictrustEth>>
    }
    class Account {
        <<agentictrustEth>>
    }
    class NameENS {
        <<agentictrustEth>>
    }
    class Identity8004 {
    }
    class DID {
        didMethod
        identifies
    }
    class IdentifierType {
        <<enumeration>>
    }
    
    AIAgent --> Identifier : hasIdentifier
    AIAgent --> Identity8004 : hasIdentity
    AIAgent --> NameENS : hasName
    AIAgent --> AccountIdentifier : hasAccountIdentifier
    AIAgent --> IdentityIdentifier8004 : hasIdentifier
    AIAgent --> NameIdentifierENS : hasIdentifier
    AIAgent --> AccountIdentifier : hasIdentifier
    
    Identity8004 --> IdentityIdentifier8004 : hasIdentifier
    NameENS --> NameIdentifierENS : hasIdentifier
    AccountIdentifier --> Account : hasAccount
    
    Identifier --> DID : hasDID
    Identifier --> IdentifierType : identifierType
    
    note for Identifier "identifierType values:\n- erc8004:IdentifierType_8004\n- agentictrustEth:IdentifierType_account\n- agentictrustEth:IdentifierType_ens"
    note for DID "identifies points to\nIdentifier, not Agent"
    note for Identity8004 "agentictrust:hasIdentity\nerc8004:Identity8004"
    note for IdentityIdentifier8004 "erc8004:IdentityIdentifier8004"
    note for NameENS "agentictrust:hasName"
    note for AccountIdentifier "agentictrustEth:hasAccountIdentifier\n(inverse) ^agentictrustEth:hasIdentifier"
```

## Focused diagrams (Account, NameENS, Identity8004)

### Agent ↔ AccountIdentifier ↔ Account (eth)

```mermaid
classDiagram
    class AIAgent
    class AccountIdentifier
    class Account
    class DID
    
    AIAgent --> AccountIdentifier : hasIdentifier
    Account --> AccountIdentifier : hasIdentifier
    AccountIdentifier --> DID : hasDID
    
    note for AIAgent "Canonical link: agentictrust:hasIdentifier\nConvenience subproperty: agentictrustEth:hasAccountIdentifier"
    note for AccountIdentifier "agentictrustEth:AccountIdentifier\n(inverse) ^agentictrustEth:hasIdentifier\nagentictrustEth:hasDID"
    note for Account "agentictrustEth:Account\nSubclass of prov:SoftwareAgent\nInherits hasIdentifier from prov:Agent\nagentictrustEth:accountChainId\nagentictrustEth:accountAddress\nagentictrustEth:accountType"
```

### Agent ↔ NameIdentifierENS ↔ NameENS (+ DID) (eth)

```mermaid
classDiagram
    class AIAgent
    class NameENS
    class NameIdentifierENS
    class DID
    
    AIAgent --> NameIdentifierENS : hasIdentifier
    NameENS --> NameIdentifierENS : hasIdentifier
    NameIdentifierENS --> DID : hasDID
    
    note for AIAgent "Canonical link: agentictrust:hasIdentifier\nConvenience link to Name: agentictrust:hasName"
    note for NameENS "agentictrustEth:NameENS\nagentictrustEth:ensName\nagentictrustEth:ensChainId"
    note for NameIdentifierENS "agentictrustEth:NameIdentifierENS\nagentictrustEth:IdentifierType_ens"
```

### Agent ↔ IdentityIdentifier8004 ↔ Identity8004 (+ DID) (erc8004)

```mermaid
classDiagram
    class AIAgent
    class Identity8004
    class IdentityIdentifier8004
    class DID
    
    AIAgent --> IdentityIdentifier8004 : hasIdentifier
    Identity8004 --> IdentityIdentifier8004 : hasIdentifier
    IdentityIdentifier8004 --> DID : hasDID
    
    note for AIAgent "Canonical link: agentictrust:hasIdentifier\nERC identity bundle: agentictrust:hasIdentity"
    note for Identity8004 "erc8004:Identity8004"
    note for IdentityIdentifier8004 "erc8004:IdentityIdentifier8004\nerc8004:IdentifierType_8004"
```

## SPARQL script (Account, NameENS, Identity8004 → Agent)

The complete script is in: `docs/ontology/sparql/identifiers-account-ens-8004.sparql`

### Agent → AccountIdentifier → Account (+ DID)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?agentId ?accountIdentifier ?account ?chainId ?address ?accountType ?did
WHERE {
  ?agent a agentictrust:AIAgent .
  OPTIONAL { ?agent agentictrust:agentId ?agentId . }

  ?agent agentictrust:hasIdentifier ?accountIdentifier .
  ?accountIdentifier a agentictrustEth:AccountIdentifier .
  OPTIONAL { ?accountIdentifier agentictrust:hasDID ?did . }

  ?account agentictrust:hasIdentifier ?accountIdentifier .
  OPTIONAL { ?account agentictrustEth:accountChainId ?chainId . }
  OPTIONAL { ?account agentictrustEth:accountAddress ?address . }
  OPTIONAL { ?account agentictrustEth:accountType ?accountType . }
}
ORDER BY ?agentId
```

### Agent → NameIdentifierENS → NameENS (+ DID)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?agentId ?ensName ?ensNameValue ?ensIdentifier ?did
WHERE {
  ?agent a agentictrust:AIAgent .
  OPTIONAL { ?agent agentictrust:agentId ?agentId . }

  ?agent agentictrust:hasIdentifier ?ensIdentifier .
  ?ensIdentifier a agentictrustEth:NameIdentifierENS .
  OPTIONAL { ?ensIdentifier rdfs:label ?ensNameValue . }
  OPTIONAL { ?ensIdentifier agentictrust:hasDID ?did . }

  OPTIONAL {
    ?ensName a agentictrustEth:NameENS ;
      agentictrustEth:hasIdentifier ?ensIdentifier .
    OPTIONAL { ?ensName agentictrustEth:ensName ?ensNameValue . }
  }
}
ORDER BY ?agentId
```

### Agent → IdentityIdentifier8004 → Identity8004 (+ DID)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?agentId ?identity8004 ?identityIdentifier ?did
WHERE {
  ?agent a agentictrust:AIAgent .
  OPTIONAL { ?agent agentictrust:agentId ?agentId . }

  ?agent agentictrust:hasIdentifier ?identityIdentifier .
  ?identityIdentifier a erc8004:IdentityIdentifier8004 .
  OPTIONAL { ?identityIdentifier agentictrust:hasDID ?did . }

  OPTIONAL {
    ?identity8004 a erc8004:Identity8004 ;
      agentictrust:hasIdentifier ?identityIdentifier .
  }
}
ORDER BY ?agentId
```

### One row per agent (Account + ENS + Identity8004)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?agentId
  ?accountIdentifier ?account ?chainId ?address
  ?ensName ?ensNameValue ?ensIdentifier
  ?identity8004 ?identityIdentifier
WHERE {
  ?agent a agentictrust:AIAgent .
  OPTIONAL { ?agent agentictrust:agentId ?agentId . }

  OPTIONAL {
    ?agent agentictrustEth:hasAccountIdentifier ?accountIdentifier .
    ?account agentictrust:hasIdentifier ?accountIdentifier .
    OPTIONAL { ?account agentictrustEth:accountChainId ?chainId . }
    OPTIONAL { ?account agentictrustEth:accountAddress ?address . }
  }

  OPTIONAL {
    ?agent agentictrust:hasName ?ensName .
    OPTIONAL { ?ensName agentictrustEth:ensName ?ensNameValue . }
    OPTIONAL { ?ensName agentictrustEth:hasIdentifier ?ensIdentifier . }
  }

  OPTIONAL {
    ?agent agentictrust:hasIdentity ?identity8004 .
    OPTIONAL { ?identity8004 agentictrust:hasIdentifier ?identityIdentifier . }
  }
}
ORDER BY ?agentId
```

## Descriptor Relationships

Descriptors are resolver-produced, normalized metadata views:

```mermaid
classDiagram
    class AIAgent {
    }
    class Identifier {
    }
    class Identity8004 {
    }
    class NameENS {
        <<agentictrustEth>>
    }
    class Account {
        <<agentictrustEth>>
    }
    class Descriptor {
        <<abstract>>
    }
    class AgentDescriptor {
    }
    class IdentifierDescriptor {
        <<abstract>>
    }
    class IdentityDescriptor8004 {
    }
    class NameDescriptorENS {
    }
    class AccountDescriptor {
    }
    
    AIAgent --> AgentDescriptor : hasAgentDescriptor
    AIAgent --> AgentDescriptor : hasAgentDescriptor
    Identifier --> IdentifierDescriptor : hasDescriptor
    Identity8004 --> IdentityDescriptor8004 : hasDescriptor
    NameENS --> NameDescriptorENS : hasDescriptor
    Account --> AccountDescriptor : hasDescriptor
    
    note for IdentityDescriptor8004 "erc8004:IdentityDescriptor8004"
    note for NameDescriptorENS "agentictrustEth:NameDescriptorENS"
    note for AccountDescriptor "agentictrustEth:AccountDescriptor"
    note for AIAgent "agentictrust:hasAgentDescriptor\nagentictrust:hasDescriptor"
    
    Descriptor <|-- AgentDescriptor
    Descriptor <|-- IdentifierDescriptor
    IdentifierDescriptor <|-- IdentityDescriptor8004
    IdentifierDescriptor <|-- NameDescriptorENS
    IdentifierDescriptor <|-- AccountDescriptor
```

## Identifier Types

### 1. IdentityIdentifier8004 (ERC8004.owl)

**Purpose**: ERC-8004 agent identity identifier representing the agent's on-chain identity in the ERC-8004 registry.

**DID Format**: `did:8004:chainId:agentId`

**Properties**:
- `identifierType`: `IdentifierType_8004`
- `hasDID`: Links to `did:8004:...` DID

**Access Pattern**:
- Direct: `Agent → hasIdentifier → IdentityIdentifier8004`
- Via Identity8004: `Agent → hasIdentity → Identity8004 → hasIdentifier → IdentityIdentifier8004`

**Example**:
```turtle
<https://www.agentictrust.io/id/agent/did%3A8004%3A84532%3A1>
  a agentictrust:AIAgent ;
  agentictrust:hasIdentity <https://www.agentictrust.io/id/8004-identity/84532/1/did%3A8004%3A84532%3A1> ;
  agentictrust:hasIdentifier <https://www.agentictrust.io/id/identifier/8004/did%3A8004%3A84532%3A1> .

<https://www.agentictrust.io/id/8004-identity/84532/1/did%3A8004%3A84532%3A1>
  a erc8004:Identity8004 ;
  agentictrust:hasIdentifier <https://www.agentictrust.io/id/identifier/8004/did%3A8004%3A84532%3A1> .

<https://www.agentictrust.io/id/identifier/8004/did%3A8004%3A84532%3A1>
  a erc8004:IdentityIdentifier8004,
    agentictrust:UniversalIdentifier,
    agentictrust:Identifier,
    prov:Entity ;
  agentictrust:identifierType erc8004:IdentifierType_8004 ;
  agentictrust:hasDID <https://www.agentictrust.io/id/did/did%3A8004%3A84532%3A1> .
```

### 2. NameIdentifierENS (agentictrust-eth.owl)

**Purpose**: ENS (Ethereum Name Service) name identifier. Represents a human-readable ENS name (e.g., `agent.eth`) that resolves to an Ethereum address.

**Validation**: Must end with `.eth` and pass ENS name validation regex.

**DID Format**: `did:ens:chainId:name.eth`

**Properties**:
- `identifierType`: `agentictrustEth:IdentifierType_ens`
- `hasDID`: Links to `did:ens:...` DID
- `rdfs:label`: The ENS name (e.g., `agent.eth`)

**Access Pattern**:
- Direct: `Agent → hasIdentifier → agentictrustEth:NameIdentifierENS`
- Via NameENS: `Agent → hasName → agentictrustEth:NameENS → agentictrustEth:hasIdentifier → agentictrustEth:NameIdentifierENS`

**Example**:
```turtle
<https://www.agentictrust.io/id/agent/did%3A8004%3A84532%3A1811>
  a agentictrust:AIAgent ;
  agentictrust:hasName <https://www.agentictrust.io/id/ens-name/84532/levi.agnt.eth> ;
  agentictrust:hasIdentifier <https://www.agentictrust.io/id/identifier/ens/levi.agnt.eth> .

<https://www.agentictrust.io/id/ens-name/84532/levi.agnt.eth>
  a agentictrustEth:NameENS, agentictrust:Name, prov:Entity ;
  agentictrustEth:ensName "levi.agnt.eth" ;
  agentictrustEth:ensChainId 84532 ;
  agentictrustEth:hasIdentifier <https://www.agentictrust.io/id/identifier/ens/levi.agnt.eth> .

<https://www.agentictrust.io/id/identifier/ens/levi.agnt.eth>
  a agentictrustEth:NameIdentifierENS,
    agentictrust:Identifier,
    prov:Entity ;
  agentictrust:identifierType agentictrustEth:IdentifierType_ens ;
  agentictrust:hasDID <https://www.agentictrust.io/id/did/did%3Aens%3A84532%3Alevi.agnt.eth> ;
  rdfs:label "levi.agnt.eth" .
```

### 3. AccountIdentifier (agentictrust-eth.owl)

**Purpose**: Identifier for an Ethereum Account, linking to the Account entity and its DID.

**Properties**:
- `identifierType`: `agentictrustEth:IdentifierType_account`
- `agentictrustEth:hasDID`: Links to DID (via `agentictrustEth:hasDID`)

**Access Pattern**:
- Direct: `Agent → agentictrust:hasIdentifier → agentictrustEth:AccountIdentifier` (inherited from prov:Agent)
- Via hasAccountIdentifier: `Agent → agentictrustEth:hasAccountIdentifier → agentictrustEth:AccountIdentifier` and `Account → agentictrust:hasIdentifier → agentictrustEth:AccountIdentifier` (inherited from prov:Agent; inverse in SPARQL: `AccountIdentifier → ^agentictrust:hasIdentifier → Account`)

**Example**:
```turtle
<https://www.agentictrust.io/id/agent/did%3A8004%3A84532%3A1811>
  a agentictrust:AIAgent ;
  agentictrust:hasIdentifier <https://www.agentictrust.io/id/account-identifier/84532/0x1234...> ;
  agentictrustEth:hasAccountIdentifier <https://www.agentictrust.io/id/account-identifier/84532/0x1234...> .

<https://www.agentictrust.io/id/account-identifier/84532/0x1234...>
  a agentictrustEth:AccountIdentifier,
    agentictrust:Identifier,
    prov:Entity ;
  agentictrust:identifierType agentictrustEth:IdentifierType_account ;
  agentictrustEth:hasDID <https://www.agentictrust.io/id/did/did%3Aethr%3A84532%3A0x1234...> .

<https://www.agentictrust.io/id/account/84532/0x1234...>
  a agentictrustEth:Account, prov:Entity ;
  agentictrustEth:accountChainId 84532 ;
  agentictrustEth:accountAddress "0x1234..." ;
  agentictrustEth:accountType "SmartAccount" ;
  agentictrust:hasIdentifier <https://www.agentictrust.io/id/account-identifier/84532/0x1234...> .
```

### 4. Account (agentictrust-eth.owl)

**Purpose**: Ethereum account entity (EOA or Smart Account) identified by chainId and address. Represents the actual account on-chain.

**Properties**:
- `accountChainId`: EVM chain ID (e.g., 1 for mainnet, 11155111 for Sepolia)
- `accountAddress`: Ethereum account address (0x-prefixed hex string, 42 characters)
- `accountType`: `"EOA"` or `"SmartAccount"`
- `hasIdentifier`: Links to `AccountIdentifier` (inherited from `prov:Agent`, defined in `agentictrust-core.owl`)
- `hasEOAOwner`: Links to EOA owner (for Smart Accounts)
- `signingAuthority`: Links to signing authority account

**Note**: `Account` is a subclass of `prov:SoftwareAgent` (not just `prov:Entity`), enabling it to participate in relationships as an Agent and inherit `hasIdentifier` from `prov:Agent`. It's NOT a subclass of `Identifier`; it's a separate entity linked via `AccountIdentifier`.

### 5. DID (Decentralized Identifier) (agentictrust-core.owl)

**Purpose**: Decentralized Identifier following W3C DID specification. Linked to identifiers via `hasDID` property.

**Properties**:
- `didMethod`: DID method (e.g., `did:8004`, `did:ens`, `did:ethr`)
- `resolvesToDocument`: Links to DID Document
- `identifies`: Links to the entity it identifies (Identifier, not Agent)

**DID Methods**:
- `did:8004`: ERC-8004 identity DID
- `did:ens`: ENS name DID
- `did:ethr`: Ethereum-based DID
- `did:web`: Web-based DID
- `did:pkh`: Public Key Hash DID

## Identifier Type Enumeration

The `IdentifierType` class provides three enumeration values:

1. **`IdentifierType_8004`**: ERC-8004 identity identifier type
2. **`IdentifierType_account`**: Ethereum account identifier type
3. **`IdentifierType_ens`**: ENS name identifier type

## Web2 and Web3 Identifier Realizations

### Web3: Ethereum Account

The `Account` class in `agentictrust-eth.owl` realizes the `Identifier` concept for Ethereum-based agents:

- **DID Method**: `did:ethr`
- **Signing Authority**: EOA (ECDSA signatures)
- **Validation**: On-chain signature verification
- **Chain ID**: Blockchain chain ID (e.g., 1 for mainnet, 11155111 for Sepolia)

### Web2: Future Extensions

The `Identifier` class is designed to support Web2 identifier types (Domain, Email, OAuth, API Key, Service Endpoint) as subclasses. These would follow the same pattern:

- Domain identifiers: `did:web` method
- Email identifiers: `did:email` method
- OAuth identifiers: Provider-specific DIDs
- API Key identifiers: Service-specific DIDs
- Service Endpoint identifiers: `did:web` or service-specific DIDs

The Web2 mapping would follow the same design principles as the Ethereum Account mapping: Web2 identifiers would subclass `Identifier`, have associated DIDs, and link to their respective entities (Domain, Email, etc.) via identifier classes.

## Descriptors

Descriptors are resolver-produced, normalized metadata views that aggregate all metadata associated with an entity.

### AgentDescriptor

**Purpose**: Agent-level descriptor containing resolver-produced, protocol-agnostic declaration of an agent's identity, capabilities, and constraints.

**Properties**:
- `hasEndpoint`: Agent communication endpoints
- `hasSkill`: Agent skills/tools
- `rdfs:label`: Agent name
- `dcterms:description`: Agent description
- Various metadata properties (image, website, etc.)

**Access**: `Agent → hasAgentDescriptor → AgentDescriptor` (or `Agent → hasDescriptor → AgentDescriptor`)

### IdentifierDescriptor

**Purpose**: Base class for identifier descriptors.

### ProtocolDescriptor

**Purpose**: Protocol-level descriptor (e.g., A2A, MCP) describing protocol-specific configuration and bindings.

**Note**: `ProtocolDescriptor` is distinct from `AgentDescriptor` and belongs to a `Protocol`, not an `Agent`.

## SPARQL Queries

### Get All Identifiers for an Agent

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?agentId ?identifier ?identifierType ?identifierValue ?did
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId .
  
  {
    # Direct identifiers via hasIdentifier (AccountIdentifier, NameIdentifierENS, IdentityIdentifier8004)
    ?agent agentictrust:hasIdentifier ?identifier .
  }
  UNION
  {
    # Identifiers via Identity8004
    ?agent agentictrust:hasIdentity ?identity .
    ?identity agentictrust:hasIdentifier ?identifier .
  }
  
  ?identifier a ?identifierType .
  
  # Extract identifier value based on type
  OPTIONAL {
    # For NameIdentifierENS, get the label (the ENS name)
    ?identifier a agentictrustEth:NameIdentifierENS ;
      rdfs:label ?identifierValue .
  }
  OPTIONAL {
    # For AccountIdentifier, get the account address
    ?account agentictrust:hasIdentifier ?identifier .
    ?account agentictrustEth:accountAddress ?identifierValue .
  }
  OPTIONAL {
    # For IdentityIdentifier8004, get the DID string
    ?identifier agentictrust:hasDID ?didNode .
    BIND(STR(?didNode) AS ?identifierValue)
  }
  
  # Optional: get DID if it exists
  OPTIONAL {
    ?identifier agentictrust:hasDID ?did .
  }
}
ORDER BY ?agentId ?identifierType
```

### Get Agent with Account, NameENS, and Identity8004

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?agentId ?account ?accountAddress ?ensName ?ensNameValue ?identity ?identityIdentifier
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId .
  
  # Account
  OPTIONAL {
    ?agent agentictrustEth:hasAccountIdentifier ?accountIdentifier .
    ?account agentictrust:hasIdentifier ?accountIdentifier .
    ?account agentictrustEth:accountAddress ?accountAddress .
  }
  
  # NameENS
  OPTIONAL {
    ?agent agentictrust:hasName ?ensName .
    ?ensName a agentictrustEth:NameENS ;
      agentictrustEth:ensName ?ensNameValue .
  }
  
  # Identity8004
  OPTIONAL {
    ?agent agentictrust:hasIdentity ?identity .
    ?identity agentictrust:hasIdentifier ?identityIdentifier .
    ?identityIdentifier a erc8004:IdentityIdentifier8004 .
  }
}
```

### Get Agent with Descriptors

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?agent ?agentId ?agentDescriptor ?accountIdentifier ?accountDescriptor ?ensName ?ensNameDescriptor ?identity ?identityDescriptor
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:agentId ?agentId .
  
  # AgentDescriptor
  OPTIONAL {
    ?agent agentictrust:hasAgentDescriptor ?agentDescriptor .
  }
  
  # AccountDescriptor
  OPTIONAL {
    ?agent agentictrustEth:hasAccountIdentifier ?accountIdentifier .
    ?accountIdentifier agentictrust:hasDescriptor ?accountDescriptor .
    ?accountDescriptor a agentictrustEth:AccountDescriptor .
  }
  
  # NameDescriptorENS
  OPTIONAL {
    ?agent agentictrust:hasName ?ensName .
    ?ensName agentictrust:hasDescriptor ?ensNameDescriptor .
    ?ensNameDescriptor a agentictrustEth:NameDescriptorENS .
  }
  
  # IdentityDescriptor8004
  OPTIONAL {
    ?agent agentictrust:hasIdentity ?identity .
    ?identity agentictrust:hasDescriptor ?identityDescriptor .
    ?identityDescriptor a erc8004:IdentityDescriptor8004 .
  }
}
```

### Get Identifier Type Counts

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?identifierType (COUNT(DISTINCT ?identifier) AS ?count)
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:hasIdentifier ?identifier .
  ?identifier agentictrust:identifierType ?identifierType .
}
GROUP BY ?identifierType
ORDER BY DESC(?count)
```

## Design Principles

1. **Protocol-Agnostic Core**: The `Identifier` class in `agentictrust-core.owl` is abstract and protocol-agnostic.

2. **Protocol-Specific Realizations**: Protocol-specific identifier types (e.g., `AccountIdentifier` in `agentictrust-eth.owl`) subclass the core `Identifier`.

3. **DID Separation**: DIDs are separate entities linked to identifiers, not directly to agents. This allows multiple identifiers per agent, each with its own DID.

4. **Type Enumeration**: The `identifierType` property provides a simple way to filter and query identifiers by type.

5. **No Direct Agent-DID Link**: Agents never link directly to DIDs. All DID access goes through the identifier relationship: `Agent → hasIdentifier → Identifier → hasDID → DID`.

6. **Descriptor Pattern**: All entities (Agent, Identifier, Identity8004, Account, NameENS) can have Descriptors that provide normalized, resolver-produced metadata views.

7. **Separation of Identity Layers**: 
   - `Account` is an entity (the actual on-chain account)
   - `AccountIdentifier` is an identifier (the identity anchor)
   - `NameENS` is an entity (the name resource)
   - `NameIdentifierENS` is an identifier (the identity anchor)
   - `Identity8004` is an entity (the ERC-8004 identity)
   - `IdentityIdentifier8004` is an identifier (the identity anchor)

## Related Documentation

- [`agentictrust-overview.md`](./agentictrust-overview.md): Overview of the AgenticTrust ontology
- [`sparql-queries.md`](./sparql-queries.md): Additional SPARQL queries for agent data
- [`description.md`](./description.md): Descriptor pattern and metadata assembly
