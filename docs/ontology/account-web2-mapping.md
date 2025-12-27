## Account Mapping to Web2 Agent Registries and Trust Models

This document explains how the `Account` concept maps to Web2 Agent Registries and Trust Models, maintaining consistency with the Web3 model while supporting traditional Web2 identity and authentication mechanisms.

### Core Principle

**Account is chain-agnostic**: The same `Account` class represents both Web3 blockchain accounts and Web2 identifiers (domains, emails, OAuth providers, API keys). The key distinction is in the **DID method** and **signing authority mechanism**, not the Account class itself.

### Web3 vs Web2 Account Mapping

#### Web3 Account Model
```
Agent → hasAccount → Account (SmartAccount/EOA)
  ├─ DID: did:ethr:chainId:address
  ├─ accountChainId: 11155111
  ├─ accountAddress: "0x1234..."
  ├─ accountType: "SmartAccount"
  └─ hasEOAOwner → EOA Account (signing authority)
      └─ validatesSignature: ECDSA signature validation
```

#### Web2 Account Model
```
Agent → hasAccount → Account (Domain/Email/OAuth/APIKey)
  ├─ DID: did:web:example.com or did:email:agent@example.com
  ├─ accountDomain: "example.com" (for did:web)
  ├─ accountEmail: "agent@example.com" (for did:email)
  ├─ accountAddress: "example.com" or "agent@example.com"
  ├─ accountType: "Domain" | "Email" | "OAuth" | "APIKey" | "ServiceEndpoint"
  └─ hasSigningAuthority → Identifier (API key, OAuth provider, DNS domain)
      └─ validatesSignature: API key validation, OAuth token validation, DNS proof, TLS cert
```

### Web2 Account Types

#### 1. **Domain Account** (`AccountType_Domain`)
- **DID**: `did:web:example.com`
- **accountAddress**: `"example.com"`
- **accountDomain**: `"example.com"`
- **Signing Authority**: DNS control (proven via DNS TXT records)
- **Validation**: DNS proof verification, TLS certificate validation
- **Use Case**: Agent hosted at `https://agent.example.com` with DNS-based identity

#### 2. **Email Account** (`AccountType_Email`)
- **DID**: `did:email:agent@example.com`
- **accountAddress**: `"agent@example.com"`
- **accountEmail**: `"agent@example.com"`
- **Signing Authority**: Email control (proven via email verification)
- **Validation**: Email verification link, email signature validation
- **Use Case**: Agent identified by email address with email-based authentication

#### 3. **OAuth Account** (`AccountType_OAuth`)
- **DID**: `did:web:oauth-provider.com` or custom DID
- **accountAddress**: `"oauth:github:username"` or provider-specific identifier
- **Signing Authority**: OAuth provider (GitHub, Google, etc.)
- **Validation**: OAuth token validation, provider API verification
- **Use Case**: Agent authenticated via OAuth provider (GitHub, Google, etc.)

#### 4. **API Key Account** (`AccountType_APIKey`)
- **DID**: Custom DID or service-specific identifier
- **accountAddress**: API key identifier or service account ID
- **Signing Authority**: API key secret (stored securely)
- **Validation**: API key signature validation, HMAC validation
- **Use Case**: Agent authenticated via API keys (e.g., OpenAI API key, custom service API)

#### 5. **Service Endpoint Account** (`AccountType_ServiceEndpoint`)
- **DID**: `did:web:service.example.com` or service-specific DID
- **accountAddress**: Service endpoint URL or service identifier
- **Signing Authority**: Service-specific authentication (API keys, OAuth, mTLS)
- **Validation**: Service-specific validation mechanism
- **Use Case**: Agent hosted as a service with endpoint-based identity

### Trust Models in Web2

#### Web2 Agent Registries

**Traditional Web2 registries** (e.g., npm, PyPI, Docker Hub, GitHub) can be modeled as:

```
Agent → hasAccount → Account (Domain/ServiceEndpoint)
  ├─ DID: did:web:registry.example.com
  ├─ accountType: "ServiceEndpoint"
  └─ Trust Assertions:
      ├─ VerificationAssertion (package signing, code signing)
      ├─ ReputationAssertion (download counts, ratings, reviews)
      └─ RelationshipAssertion (dependencies, collaborations)
```

#### Web2 Trust Signals

1. **DNS-based Verification**:
   - Account validates DNS TXT records for `did:web` DIDs
   - Proves control of domain
   - Similar to on-chain validation in Web3

2. **TLS Certificate Validation**:
   - Account validates TLS certificates
   - Proves secure communication channel
   - Maps to transaction signature validation in Web3

3. **OAuth Provider Verification**:
   - Account validates OAuth tokens
   - Proves identity via trusted provider
   - Maps to validator attestation in Web3

4. **API Key Authentication**:
   - Account validates API key signatures
   - Proves authorized access
   - Maps to EOA signature validation in Web3

### Example: Web2 Agent Registry Pattern

```turtle
# Web2 Agent with Domain Account
<https://www.agentictrust.io/id/agent/web2/example-agent> 
  a agentictrust:AIAgent, prov:SoftwareAgent ;
  agentictrust:hasAccount <https://www.agentictrust.io/id/account/web2/example.com> .

<https://www.agentictrust.io/id/account/web2/example.com>
  a agentictrust:Account, prov:Entity ;
  agentictrust:accountType "Domain" ;
  agentictrust:accountAddress "example.com" ;
  agentictrust:accountDomain "example.com" ;
  agentictrust:hasDID <https://www.agentictrust.io/id/did/did:web:example.com> ;
  agentictrust:hasSigningAuthority <https://www.agentictrust.io/id/identifier/dns:example.com> .

<https://www.agentictrust.io/id/did/did:web:example.com>
  a agentictrust:DID, agentictrust:DecentralizedIdentifier, prov:Entity ;
  agentictrust:didMethod agentictrust:DIDMethod_web ;
  agentictrust:identifies <https://www.agentictrust.io/id/account/web2/example.com> ;
  agentictrust:controlledBy <https://www.agentictrust.io/id/agent/web2/example-agent> .
```

### Key Differences: Web2 vs Web3

| Aspect | Web3 | Web2 |
|--------|------|------|
| **Account Identifier** | Blockchain address (0x...) | Domain, email, OAuth ID, API key |
| **DID Method** | `did:ethr` | `did:web`, `did:email`, `did:pkh` |
| **Signing Authority** | EOA (ECDSA signatures) | API keys, OAuth tokens, DNS control, email verification |
| **Validation** | On-chain signature verification | API key validation, OAuth token validation, DNS proof, TLS cert |
| **Chain ID** | Blockchain chain ID | May be null or represent namespace (DNS, email provider) |
| **Trust Registry** | On-chain smart contract | Centralized or federated service (npm, PyPI, Docker Hub) |

### Unified Model Benefits

1. **Chain-agnostic identity**: Same ontology works for Web2 and Web3
2. **DID-first design**: All accounts have DIDs, regardless of underlying mechanism
3. **Consistent trust model**: Same TrustAssertion classes work for both
4. **Flexible validation**: Different validation mechanisms, same semantic model
5. **Cross-platform discovery**: Agents can be discovered across Web2 and Web3 registries

### SPARQL Query Examples

**Query all accounts (Web2 and Web3):**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?account ?accountType ?did
WHERE {
  ?agent agentictrust:hasAccount ?account .
  ?account agentictrust:accountType ?accountType ;
    agentictrust:hasDID ?did .
}
```

**Query Web2 domain accounts:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agent ?account ?domain ?did
WHERE {
  ?agent agentictrust:hasAccount ?account .
  ?account agentictrust:accountType "Domain" ;
    agentictrust:accountDomain ?domain ;
    agentictrust:hasDID ?did .
  ?did agentictrust:didMethod agentictrust:DIDMethod_web .
}
```

### Related Concepts

- **DID Methods**: See DID class hierarchy and `didMethod` property
- **Verification Methods**: See `VerificationMethod` class and `validatesSignature` property
- **Trust Assertions**: See `VerificationAssertion` and `ReputationAssertion` documentation
- **Agent Discovery**: See [discovery.md](./discovery.md) for how accounts enable agent discovery

