## Identifier Mapping: Web2 and Web3 Realizations

This document explains how the abstract `Identifier` concept maps to both Web2 and Web3 identity systems, providing a unified model for agent identity across different protocols and platforms.

### Core Principle

**Identifier is protocol-agnostic**: The `Identifier` class represents the abstract concept of an agent's primary identifier. Protocol-specific realizations include:
- **Web3**: Ethereum Account (`agentictrustEth:Account`) - realizes Identifier for blockchain-based agents
- **Web2**: Domain, Email, OAuth, API Key identifiers - realize Identifier for traditional Web2 agents

Each Agent has one primary Identifier, which serves as the stable, verifiable identity anchor for trust assertions and relationships.

### Identifier Hierarchy

```
agentictrust:Identifier (abstract)
  ├─ agentictrustEth:Account (Web3 - Ethereum)
  │   ├─ EOA (Externally Owned Account)
  │   └─ SmartAccount (Contract-based account)
  ├─ DomainIdentifier (Web2 - DNS-based)
  ├─ EmailIdentifier (Web2 - Email-based)
  ├─ OAuthIdentifier (Web2 - OAuth provider-based)
  ├─ APIKeyIdentifier (Web2 - API key-based)
  └─ ServiceEndpointIdentifier (Web2 - Service endpoint-based)
```

### Web3 Identifier Realization: Ethereum Account

#### Model
```
Agent → hasIdentifier → Identifier (realized as Account)
  ├─ agentictrustEth:Account
  ├─ accountChainId: 11155111
  ├─ accountAddress: "0x1234..."
  ├─ accountType: "SmartAccount" | "EOA"
  ├─ hasDID → DID (did:ethr:chainId:address)
  └─ hasEOAOwner → Account (signing authority)
      └─ validatesSignature: ECDSA signature validation
```

#### Properties
- **DID Method**: `did:ethr`
- **Signing Authority**: EOA (ECDSA signatures)
- **Validation**: On-chain signature verification
- **Chain ID**: Blockchain chain ID (e.g., 1 for mainnet, 11155111 for Sepolia)

### Web2 Identifier Realizations

#### 1. **Domain Identifier** (DNS-based)
```
Agent → hasIdentifier → Identifier (realized as DomainIdentifier)
  ├─ accountType: "Domain"
  ├─ accountAddress: "example.com"
  ├─ accountDomain: "example.com"
  ├─ hasDID → DID (did:web:example.com)
  └─ hasSigningAuthority → Identifier (DNS control)
      └─ validatesSignature: DNS proof verification, TLS certificate validation
```

- **DID Method**: `did:web`
- **Signing Authority**: DNS control (proven via DNS TXT records)
- **Validation**: DNS proof verification, TLS certificate validation
- **Use Case**: Agent hosted at `https://agent.example.com` with DNS-based identity

#### 2. **Email Identifier** (Email-based)
```
Agent → hasIdentifier → Identifier (realized as EmailIdentifier)
  ├─ accountType: "Email"
  ├─ accountAddress: "agent@example.com"
  ├─ accountEmail: "agent@example.com"
  ├─ hasDID → DID (did:email:agent@example.com)
  └─ hasSigningAuthority → Identifier (Email control)
      └─ validatesSignature: Email verification link, email signature validation
```

- **DID Method**: `did:email` or custom DID
- **Signing Authority**: Email control (proven via email verification)
- **Validation**: Email verification link, email signature validation
- **Use Case**: Agent identified by email address with email-based authentication

#### 3. **OAuth Identifier** (OAuth provider-based)
```
Agent → hasIdentifier → Identifier (realized as OAuthIdentifier)
  ├─ accountType: "OAuth"
  ├─ accountAddress: "oauth:github:username" or provider-specific identifier
  ├─ hasDID → DID (did:web:oauth-provider.com or custom DID)
  └─ hasSigningAuthority → Identifier (OAuth provider)
      └─ validatesSignature: OAuth token validation, provider API verification
```

- **DID Method**: `did:web` or custom DID
- **Signing Authority**: OAuth provider (GitHub, Google, etc.)
- **Validation**: OAuth token validation, provider API verification
- **Use Case**: Agent authenticated via OAuth provider (GitHub, Google, etc.)

#### 4. **API Key Identifier** (API key-based)
```
Agent → hasIdentifier → Identifier (realized as APIKeyIdentifier)
  ├─ accountType: "APIKey"
  ├─ accountAddress: API key identifier or service account ID
  ├─ hasDID → DID (Custom DID or service-specific identifier)
  └─ hasSigningAuthority → Identifier (API key secret)
      └─ validatesSignature: API key signature validation, HMAC validation
```

- **DID Method**: Custom DID or service-specific identifier
- **Signing Authority**: API key secret (stored securely)
- **Validation**: API key signature validation, HMAC validation
- **Use Case**: Agent authenticated via API keys (e.g., OpenAI API key, custom service API)

#### 5. **Service Endpoint Identifier** (Service endpoint-based)
```
Agent → hasIdentifier → Identifier (realized as ServiceEndpointIdentifier)
  ├─ accountType: "ServiceEndpoint"
  ├─ accountAddress: Service endpoint URL or service identifier
  ├─ hasDID → DID (did:web:service.example.com or service-specific DID)
  └─ hasSigningAuthority → Identifier (Service-specific authentication)
      └─ validatesSignature: Service-specific validation mechanism
```

- **DID Method**: `did:web` or service-specific DID
- **Signing Authority**: Service-specific authentication (API keys, OAuth, mTLS)
- **Validation**: Service-specific validation mechanism
- **Use Case**: Agent hosted as a service with endpoint-based identity

### Trust Models Across Web2 and Web3

#### Unified Trust Model

Both Web2 and Web3 agents use the same trust assertion model:

```
Agent → hasIdentifier → Identifier
  └─ Trust Assertions:
      ├─ VerificationAssertion (validation, verification)
      ├─ ReputationAssertion (feedback, ratings)
      └─ RelationshipAssertion (relationships, associations)
```

#### Web2 Trust Signals

1. **DNS-based Verification**:
   - Identifier validates DNS TXT records for `did:web` DIDs
   - Proves control of domain
   - Similar to on-chain validation in Web3

2. **TLS Certificate Validation**:
   - Identifier validates TLS certificates
   - Proves secure communication channel
   - Maps to transaction signature validation in Web3

3. **OAuth Provider Verification**:
   - Identifier validates OAuth tokens
   - Proves identity via trusted provider
   - Maps to validator attestation in Web3

4. **API Key Authentication**:
   - Identifier validates API key signatures
   - Proves authorized access
   - Maps to EOA signature validation in Web3

#### Web3 Trust Signals

1. **On-chain Signature Verification**:
   - Identifier (Account) validates ECDSA signatures
   - Proves control of private key
   - Immutable on blockchain

2. **Smart Contract Validation**:
   - Identifier (SmartAccount) validates via contract logic
   - Proves authorized operations
   - Programmable trust rules

3. **Validator Attestation**:
   - Identifier receives validation from on-chain validators
   - Proves agent capabilities and trustworthiness
   - Recorded on-chain

### Example: Web2 Agent with Domain Identifier

```turtle
# Web2 Agent with Domain Identifier
<https://www.agentictrust.io/id/agent/web2/example-agent> 
  a agentictrust:AIAgent, prov:SoftwareAgent ;
  agentictrust:hasIdentifier <https://www.agentictrust.io/id/identifier/web2/example.com> .

<https://www.agentictrust.io/id/identifier/web2/example.com>
  a agentictrust:Identifier, prov:Entity ;
  agentictrustEth:accountType "Domain" ;
  agentictrustEth:accountAddress "example.com" ;
  agentictrustEth:accountDomain "example.com" ;
  agentictrust:hasDID <https://www.agentictrust.io/id/did/did:web:example.com> ;
  agentictrustEth:hasSigningAuthority <https://www.agentictrust.io/id/identifier/dns:example.com> .

<https://www.agentictrust.io/id/did/did:web:example.com>
  a agentictrust:DID, agentictrust:DecentralizedIdentifier, prov:Entity ;
  agentictrust:didMethod agentictrust:DIDMethod_web ;
  agentictrust:identifies <https://www.agentictrust.io/id/identifier/web2/example.com> ;
  agentictrust:controlledBy <https://www.agentictrust.io/id/agent/web2/example-agent> .
```

### Example: Web3 Agent with Ethereum Account Identifier

```turtle
# Web3 Agent with Ethereum Account Identifier
<https://www.agentictrust.io/id/agent/11155111/123> 
  a agentictrust:AIAgent, prov:SoftwareAgent ;
  agentictrust:hasIdentifier <https://www.agentictrust.io/id/account/11155111/0x1234...> ;
  agentictrustEth:hasAccount <https://www.agentictrust.io/id/account/11155111/0x1234...> .

<https://www.agentictrust.io/id/account/11155111/0x1234...>
  a agentictrustEth:Account, agentictrust:Identifier, prov:Entity ;
  agentictrustEth:accountChainId 11155111 ;
  agentictrustEth:accountAddress "0x1234..." ;
  agentictrustEth:accountType "SmartAccount" ;
  agentictrustEth:hasDID <https://www.agentictrust.io/id/did/did:ethr:11155111:0x1234...> ;
  agentictrustEth:hasEOAOwner <https://www.agentictrust.io/id/account/11155111/0xeoa...> .

<https://www.agentictrust.io/id/did/did:ethr:11155111:0x1234...>
  a agentictrust:DID, agentictrust:DecentralizedIdentifier, prov:Entity ;
  agentictrust:didMethod agentictrust:DIDMethod_ethr ;
  agentictrust:identifies <https://www.agentictrust.io/id/account/11155111/0x1234...> .
```

### Key Differences: Web2 vs Web3

| Aspect | Web3 | Web2 |
|--------|------|------|
| **Identifier Realization** | `agentictrustEth:Account` (blockchain address) | Domain, Email, OAuth ID, API key |
| **DID Method** | `did:ethr` | `did:web`, `did:email`, `did:pkh` |
| **Signing Authority** | EOA (ECDSA signatures) | API keys, OAuth tokens, DNS control, email verification |
| **Validation** | On-chain signature verification | API key validation, OAuth token validation, DNS proof, TLS cert |
| **Chain ID** | Blockchain chain ID | May be null or represent namespace (DNS, email provider) |
| **Trust Registry** | On-chain smart contract | Centralized or federated service (npm, PyPI, Docker Hub) |
| **Immutability** | Immutable on blockchain | Mutable, depends on provider |

### Unified Model Benefits

1. **Protocol-agnostic identity**: Same `Identifier` abstraction works for Web2 and Web3
2. **DID-first design**: All identifiers have DIDs, regardless of underlying mechanism
3. **Consistent trust model**: Same TrustAssertion classes work for both
4. **Flexible validation**: Different validation mechanisms, same semantic model
5. **Cross-platform discovery**: Agents can be discovered across Web2 and Web3 registries
6. **Future-proof**: Easy to add new identifier types (e.g., DID methods, new protocols)

### SPARQL Query Examples

**Query all identifiers (Web2 and Web3):**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?identifier ?accountType ?did
WHERE {
  ?agent agentictrust:hasIdentifier ?identifier .
  ?identifier agentictrustEth:accountType ?accountType ;
    agentictrust:hasDID ?did .
}
```

**Query Web3 Ethereum Account identifiers:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?account ?chainId ?address ?did
WHERE {
  ?agent agentictrust:hasIdentifier ?account .
  ?account a agentictrustEth:Account ;
    agentictrustEth:accountChainId ?chainId ;
    agentictrustEth:accountAddress ?address ;
    agentictrustEth:hasDID ?did .
  ?did agentictrust:didMethod agentictrust:DIDMethod_ethr .
}
```

**Query Web2 domain identifiers:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?identifier ?domain ?did
WHERE {
  ?agent agentictrust:hasIdentifier ?identifier .
  ?identifier agentictrustEth:accountType "Domain" ;
    agentictrustEth:accountDomain ?domain ;
    agentictrustEth:hasDID ?did .
  ?did agentictrust:didMethod agentictrust:DIDMethod_web .
}
```

**Query agents by identifier type:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT ?agent ?identifier ?accountType
WHERE {
  ?agent agentictrust:hasIdentifier ?identifier .
  ?identifier agentictrustEth:accountType ?accountType .
}
GROUP BY ?accountType
```

### Related Concepts

- **Identifier Class**: See `agentictrust:Identifier` in `agentictrust-core.owl`
- **Account Realization**: See `agentictrustEth:Account` in `agentictrust-eth.owl` for Ethereum-specific details
- **DID Methods**: See DID class hierarchy and `didMethod` property
- **Verification Methods**: See `VerificationMethod` class and `validatesSignature` property
- **Trust Assertions**: See `VerificationAssertion` and `ReputationAssertion` documentation
- **Agent Discovery**: See [discovery.md](./discovery.md) for how identifiers enable agent discovery
- **Name Mapping**: See how `Name` (e.g., ENS Name) complements `Identifier` for human-readable names

