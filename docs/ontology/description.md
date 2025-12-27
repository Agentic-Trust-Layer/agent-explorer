## Description layer (DnS) — TrustDescription + metadata

Ontology: `agentictrust.owl`

### Class hierarchy (key)

```mermaid
classDiagram
direction LR

class provPlan["prov:Plan"]
class pplanPlan["p-plan:Plan"]
class provEntity["prov:Entity"]

class TrustDescription["agentictrust:TrustDescription"]
class AgentEndpoint["agentictrust:AgentEndpoint"]
class EndpointType["agentictrust:EndpointType"]
class OperatorIdentifier["agentictrust:OperatorIdentifier"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class A2AAgentCard["agentictrust:A2AAgentCard"]
class MCPManifest["agentictrust:MCPManifest"]
class Skill["agentictrust:Skill"]

TrustDescription --|> provPlan
TrustDescription --|> pplanPlan

AgentEndpoint --|> provEntity
EndpointType --|> provEntity
OperatorIdentifier --|> provEntity
AgentDescriptor --|> provEntity
Skill --|> provEntity

A2AAgentCard --|> AgentDescriptor
MCPManifest --|> AgentDescriptor
```

### Relationship diagram (properties)

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
class AgentEndpoint["agentictrust:AgentEndpoint"]
class EndpointType["agentictrust:EndpointType"]
class OperatorIdentifier["agentictrust:OperatorIdentifier"]
class AgentDescriptor["agentictrust:AgentDescriptor"]
class Skill["agentictrust:Skill"]
class Endpoint["agentictrust:Endpoint"]

AIAgent --> AgentDescriptor : hasAgentDescriptor

AgentDescriptor --> AgentEndpoint : hasEndpointEntry
AgentEndpoint --> EndpointType : endpointType
AgentDescriptor --> OperatorIdentifier : hasOperatorIdentifier

AgentDescriptor --> Skill : declaresSkill
AgentDescriptor --> Skill : hasSkill
AgentDescriptor --> Endpoint : hasEndpoint
```

### Diagrams (how Description supports other areas)

#### Description → Situation

![Description → Situation](./images/sections/description-to-situation.png)

#### Description → Discovery (agent metadata + skills)

![Description → Discovery](./images/sections/description-to-discovery.png)

#### Description → Execution (tasks + invocations + routing)

![Description → Execution](./images/sections/description-to-execution.png)

### TrustDescription (DnS “Description”)

- **Class**: `agentictrust:TrustDescription`
- **Meaning**: the normative “what/why” — roles, constraints, intended outcomes
- **Grounding**: subclass of `prov:Plan` and `p-plan:Plan`

### Key relation

- **TrustSituation → TrustDescription**: `agentictrust:realizesDescription`

### Agent discovery metadata (core)

These are core, protocol-agnostic descriptor concepts:

- **`agentictrust:AgentDescriptor`**: generic descriptor container (offchain)
- **`agentictrust:AgentEndpoint`**: endpoint entry (name/endpoint/version)
- **`agentictrust:EndpointType`**: endpoint taxonomy value
- **`agentictrust:OperatorIdentifier`**: operator identifier artifact (address/DID/CAIP-10)

### Descriptor → skills

- **`agentictrust:declaresSkill`**: `AgentDescriptor` → `Skill`

### Where ERC8004 registration fits

ERC8004 registration is a *specialized metadata bundle* defined in `ERC8004.owl`:

- `erc8004:AgentRegistration` + component metadata
- See [`erc8004.md`](./erc8004.md)


