## Description layer (DnS) — TrustDescription + metadata

Ontology: `agentictrust.owl`

### Diagram

![Core agent metadata](./images/sections/core-metadata.png)

### TrustDescription (DnS “Description”)

- **Class**: `agentictrust:TrustDescription`
- **Meaning**: the normative “what/why” — roles, constraints, intended outcomes
- **Grounding**: subclass of `prov:Plan` and `p-plan:Plan`

### Key relation

- **TrustSituation → TrustDescription**: `agentictrust:realizesDescription`

### Agent discovery metadata (core)

These are core, protocol-agnostic metadata concepts:

- **`agentictrust:AgentMetadata`**: generic metadata container (offchain)
- **`agentictrust:AgentEndpoint`**: endpoint entry (name/endpoint/version)
- **`agentictrust:EndpointType`**: endpoint taxonomy value
- **`agentictrust:Operator`**: acting agent/operator identity

### Metadata → skills

- **`agentictrust:declaresSkill`**: `AgentMetadata` → `Skill`

### Where ERC8004 registration fits

ERC8004 registration is a *specialized metadata bundle* defined in `ERC8004.owl`:

- `erc8004:AgentRegistration` + component metadata
- See [`erc8004.md`](./erc8004.md)


