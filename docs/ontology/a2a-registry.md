# A2A Registry (Agent-to-Agent Directory & Federation)

This document summarizes the A2A Registry concept as an **agent directory** and how it maps into AgenticTrust.

Primary reference implementation:

- GitHub: `https://github.com/A2ABaseAI/A2ARegistry` ([repo](https://github.com/A2ABaseAI/A2ARegistry))

Live deployments (observed):

- `https://a2aregistry.org/`
- `https://a2a-registry.dev/`

## What A2A Registry is (conceptually)

The A2A Registry is a directory of **operational, hosted agents** that publish A2A-compatible metadata (agent cards) and can be discovered by clients.

Key ideas:

- **Agent card** is the registry’s primary metadata artifact (a structured “what/where/how to call me” document).
- Discovery can be **centralized** (registry search) and/or **decentralized** (agent card hosted at `.well-known` on the agent endpoint).
- Registry may support **federation** (peer registries synchronizing) to form trusted networks.

## Endpoints (from the reference implementation)

The reference implementation documents these patterns ([repo](https://github.com/A2ABaseAI/A2ARegistry)):

- **OAuth2 client credentials token**
  - `POST /oauth/token`

- **Register an agent**
  - `POST /agents`

- **Search agents**
  - `POST /agents/search`

- **Entitled agents**
  - `GET /agents/entitled`

- **Well-known discovery**
  - `GET /.well-known/agents/index.json` (agents index)
  - `GET /agents/<id>/card` (agent card)

- **Federation / peers**
  - `POST /peers` (add peer)
  - `POST /peers/<peer-id>/sync`
  - `POST /peers/sync-all`

## How this maps into AgenticTrust

### Modeling stance

Treat A2A Registry entries primarily as **Descriptors** (directory-provided discovery views), not as “truth” by default.

### Ontology mapping (high-level)

- **Registry listing** → `core:AgentDescriptor` (or a protocol-specific specialization)
- **Agent card** (JSON) → Descriptor evidence/source artifact (`prov:Entity`) used to assemble the Descriptor
- **Discovery results** → a resolver activity (`prov:Activity`) that *used* agent cards and *generated* Descriptor entities
- **Federation** → a relationship situation between registries (trust + synchronization agreements)

### Operational registries (field reality)

In practice you will also see “registry-like directories” run by operators. Example:

- `https://hub.lifie.ai/` (operational directory surface)
- Operator contact surface: `https://www.linkedin.com/in/alanblount/` (treat as an external reference, not an identity claim)

## What we do NOT assume

- A registry entry is not automatically a validation claim.
- Federation does not automatically imply trust equivalence.
- “Agent is live” signals are **situational** (time-scoped) and should be modeled as such (availability situation / verification situation), not as permanent facts.


