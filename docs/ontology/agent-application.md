# AI Agent Application (Deployment), Provider, and Endpoints

This page explains how to talk about:

- the **discoverable Agent** (the stable node everything else points at: identity, names, trust graph, provenance)
- the **AI Agent Application deployment** (the thing reachable at endpoints that actually executes)
- the **Provider** responsible for that deployment

We’re intentionally not changing the OWL yet; this is a documentation-first reframing.

## Core idea: Agent (discoverable) vs Application deployment (executable at endpoint)

You have two “real things” that matter:

- **Agent (discoverable identity)**: the stable node that Identity/Name/Situations/AttestedAssertions/Descriptors attach to.
  - This is what you mean by “the agent” in the trust graph.
- **Application deployment (executable)**: the hosted service running at a protocol endpoint that accepts intents and produces outcomes.
  - This is what you mean by “the application”.

DnS **Descriptions** still matter (as schemas/metadata), but they are not the *primary* way to explain account/identity/application. Use DnS terms for intent/situation schemas; use PROV terms for actors/artifacts.

### How the pieces connect (conceptual)

```mermaid
graph TB
  Agent["Agent (discoverable)\nprov:SoftwareAgent"]
  Identity["AgentIdentity (registry-scoped)\nprov:Entity"]
  Name["AgentName\nprov:Entity"]
  Desc["Descriptors (AgentDescriptor / ProtocolDescriptor)\nprov:Entity"]
  Sit["TrustSituation\nprov:Entity"]
  Attested["AttestedAssertion\nprov:Entity"]

  Deploy["AI Agent Application deployment\n(reachable executable)\nprov:SoftwareAgent"]
  Endpoint["Protocol endpoint (A2A/MCP)\nprov:Entity"]

  Agent -->|agentictrust:hasIdentity| Identity
  Agent -->|agentictrust:hasName| Name
  Agent -->|agentictrust:hasDescriptor| Desc
  Sit -->|agentictrust:isAboutAgent| Agent
  Attested -->|agentictrust:recordsSituation| Sit

  Deploy -->|reachable at| Endpoint
  Deploy -->|describes / serves| Desc
```

### Ontology terms used on this page

- `agentictrust:AgentDeployment` (the endpoint-reachable executor)
- `agentictrust:deploymentOf` (Deployment → AIAgent)
- `agentictrust:agentProvider` (Deployment → Organization)
- `agentictrust:deploymentVersion` (Deployment → string)

```mermaid
graph TB
  Desc["Description (Descriptor / TrustDescription)\nprov:Entity (Plan-like)"]
  Thing["Deployed agent application (hosted)\nprov:SoftwareAgent"]
  Endpoint["Protocol Endpoint\nprov:Entity"]

  Thing -->|agentictrust:hasDescriptor| Desc
  Thing -->|reachable at| Endpoint
```

## Provider responsibility

The provider is responsible for operating/hosting the **application deployment** (and typically for its policy surface: keys, attestations, SLAs).

- `agentictrust:Organization` ⊑ `prov:Agent`
- `agentictrust:AIAgentProvider` ⊑ `agentictrust:Organization`
- `agentictrust:agentProvider` (Application → Organization)

```mermaid
graph LR
  Provider["AIAgentProvider / Organization (prov:Agent)"]
  App["Application deployment (prov:SoftwareAgent)"]
  Provider -->|responsible for| App
```

## Model and versioning
## Model and versioning

AgenticTrust supports both:

- **Descriptor-level fields** (easy ingestion from tokens/metadata):
  - `agentictrust:modelId` (AgentDescriptor)
  - `agentictrust:modelVersion` (AgentDescriptor)
  - `agentictrust:agentProviderValue` (AgentDescriptor)
- **Entity-level model nodes** (for reuse/graph reasoning):
  - `agentictrust:AgentModel` (prov:Entity) with `agentictrust:modelIdValue`, `agentictrust:modelVersionValue`
  - `agentictrust:usesModel` (Application → AgentModel)

Deployment versioning (distinct from model release when needed):

- `agentictrust:deploymentVersion` (AgentDeployment)

## Protocol endpoint references the application

The application deployment is **reachable** via protocol endpoints (e.g., A2A, MCP). In AgenticTrust:

- Protocol configuration lives on **ProtocolDescriptor** (`agentictrust:A2AProtocolDescriptor`, `agentictrust:MCPProtocolDescriptor`)
- Network addresses are modeled as **Endpoint** (`agentictrust:Endpoint`) linked from descriptors

The **A2A agent card** (agent-card.json / agent.json) is presented by the deployed application at an A2A endpoint. AgenticTrust represents:

- the endpoint URL on an Endpoint node (e.g., `agentictrust:endpointUrl`)
- the fetched A2A card JSON as `agentictrust:json` on a protocol descriptor (or a resolver-produced descriptor entity)

## Verification principles for Agent Applications (deployments)

“Verification” for the **application deployment** is usually about answering:

- **Who controls this endpoint?**
- **What code/service is actually running there (and with what version/model)?**
- **Who is accountable for operating it (provider/operator/authority)?**
- **How does this deployment relate to the discoverable Agent trust graph?**

AgenticTrust keeps these layers distinct:

- **Discoverable agent**: `agentictrust:AIAgent` (stable trust-graph anchor)
- **Executable application**: `agentictrust:AgentDeployment` (what you call / what executes)
- **Delegation and accountability**:
  - `prov:actedOnBehalfOf` (Deployment → Operator → Authority)
  - `agentictrust:agentProvider` (Deployment → Organization)
- **Epistemic evidence**: model verification results as **AttestedAssertions** generated by accountable acts (`agentictrust:Attestation` → `agentictrust:AttestedAssertion`)

### Common verification primitives (composable)

- **Transport integrity**: TLS / cert chains (often automated with ACME), plus request signing where supported.
- **Domain control**: DNS-based proofs (TXT records, CNAME indirection).
- **Web identity binding**: `did:web` (anchored in DNS + HTTPS).
- **Onchain binding**: smart-account ownership, contract metadata, registry membership.
- **Message-consensus registries**: topic-based publication/verification (e.g., Hedera/HCS registry patterns such as HCS-10).
  - Reference: [HCS-10 docs](https://hol.org/docs/standards/hcs-10/)

### HCS-11 / MCP profiles (application verification surface)

HCS-11 is commonly referenced as a **profile/document** pattern for describing/verifying an agent application (especially in the context of MCP-style tool servers), where the “profile” can be anchored via a registry substrate and/or DNS.

This maps cleanly to AgenticTrust:

- treat an HCS-11-style “profile” as a **Descriptor artifact** (a `ProtocolDescriptor` / `Descriptor` node)
- treat any publication/update as a provenance-bearing Activity (registration/fetch)
- treat verification outputs as AttestedAssertions about the Deployment and/or the AgentIdentity

(If you have the canonical HCS-11 spec link you want cited, paste it and we’ll wire it in.)

### AID via DNS TXT (`_agent.`) — a minimal verification + discovery anchor

This is a widely-used bootstrap pattern:

- a domain proves control over an agent/service by publishing a DNS TXT record

Typical pattern:

- `_agent.example.com TXT "did=did:web:example.com"`
- `_agent.example.com TXT "agent-id=ai.example.agent"`

What AID gives you:

- domain-based ownership proof
- web2-compatible verification
- registry-agnostic identity anchor
- easy bootstrap for agent discovery

What AID does not give you:

- runtime protocol semantics (how to call)
- tool invocation semantics
- trust/reputation logic
- capability execution traces

Key takeaway: **AID solves identity + discovery, not interaction.**

### Relationship between MCP and AID (orthogonal layers)

- **DNS/AID**: “who owns this agent/server endpoint?”
- **MCP**: “how do I interact with it (tools, schemas, invocation semantics)?”

Key insight:

- MCP assumes you already know who to talk to.
- AID helps you discover and verify who that is.

### Why TXT records keep showing up

TXT records appear repeatedly across ecosystems (AID patterns, registry discussions, `did:web`, ACME/TLS automation, ENS text records) because TXT is:

- universally deployable
- cheap
- chain-agnostic
- tool-agnostic
- human-verifiable

But: **DNS TXT usage ≠ an interaction protocol standard**. It’s a reusable verification primitive.

## SPARQL queries

### Find deployments and their provider (if modeled)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?app ?provider
WHERE {
  ?app a agentictrust:AgentDeployment .
  OPTIONAL { ?app agentictrust:agentProvider ?provider . }
}
LIMIT 200
```

### Find deployments and their model identifiers (descriptor-level)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?app ?descriptor ?modelId ?modelVersion ?providerValue
WHERE {
  ?app a agentictrust:AgentDeployment ;
       agentictrust:hasDescriptor ?descriptor .
  OPTIONAL { ?descriptor agentictrust:modelId ?modelId . }
  OPTIONAL { ?descriptor agentictrust:modelVersion ?modelVersion . }
  OPTIONAL { ?descriptor agentictrust:agentProviderValue ?providerValue . }
}
LIMIT 200
```

### Find deployments and the discoverable agent they implement

If you don’t want deployment identities, you can skip `AgentDeployment` nodes and attach descriptors/endpoints directly to the discoverable agent node. If you do want operational modeling (operators, provenance, delegation), keep deployments explicit.

```sparql
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?deployment ?agent
WHERE {
  ?deployment a agentictrust:AgentDeployment ;
              agentictrust:deploymentOf ?agent .
}
LIMIT 200
```


