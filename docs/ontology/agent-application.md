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


