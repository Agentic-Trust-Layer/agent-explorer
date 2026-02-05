# Protocol endpoints (A2A, MCP) and protocol-derived discovery metadata

This page documents how we model **service endpoints** and **protocol metadata** (especially **skills** and **domains**) for discovery and interaction.

## Abstract model: ServiceEndpoint vs Protocol

There are two related layers:

- **ServiceEndpoint (`core:ServiceEndpoint`)**: a concrete network/service address you can call (URL/URI). It has:
  - `core:serviceUrl`
  - `core:endpointName` (e.g. `"a2a"`, `"mcp"`, or other)
  - `core:hasProtocol` → the protocol metadata node
- **Protocol (`core:Protocol`)**: protocol-specific configuration and metadata that explains how to talk to a service endpoint and what to expect.
  - A2A: `core:A2AProtocol`
  - MCP: `core:MCPProtocol`

Key point: **Skills and domains are primarily protocol-defined**. The most reliable place to learn what an agent “can do” is its protocol metadata (e.g., A2A agent card, MCP tool list), not ad-hoc strings on an agent row.

## Endpoint types (abstract)

Endpoints are normalized into `core:Endpoint` nodes, typically with an `core:EndpointType` describing what the endpoint is for.

Examples of endpoint “kinds” you’ll see in practice:

- **A2A endpoint**: the agent’s A2A entrypoint (often a `.well-known/agent.json` URL or an API URL depending on convention).
- **MCP endpoint**: an MCP server URL (e.g., HTTP+SSE) or other transport.
- **Web/API endpoint**: generic REST/GraphQL endpoint (protocol-agnostic).

## Protocol metadata (skills/domains are protocol-defined)

Protocols are **not** the same as endpoints:

- A protocol node can exist even if we haven’t validated the service URL.
- A protocol node carries **protocol semantics** (versions, transport, declared skills/domains/tools).

In the ontology, the protocol layer is modeled as subclasses:

- `core:A2AProtocol` (A2A agent card metadata; `core:json` stores the agent card JSON)
- `core:MCPProtocol` (MCP server/tool metadata; `core:json` stores the server/tool metadata when available)

## A2A protocol (agent cards)

**Source metadata**: an A2A agent card JSON (commonly served at a URL like `/.well-known/agent.json`).

Typical fields we care about (names vary by implementation):

- **service URL**: where the A2A service lives (`url` / `serviceUrl` / `endpoint`)
- **protocol version**: A2A protocol revision supported
- **preferred transport**: transport hint (e.g., HTTP)
- **skills/domains/capabilities**: protocol-level discovery metadata
- **operators**: optionally, who operates/controls the agent

**Modeling rule**:

- The A2A agent card populates a `core:A2AProtocol` node (treated as a `core:Descriptor`).
- Skills/domains are attached to the protocol node (`core:hasSkill`, `core:hasDomain`).
- The agent/identity links to the concrete endpoint via `core:hasServiceEndpoint`.

## MCP protocol (Model Context Protocol)

**Source metadata**: MCP server metadata (depending on deployment, this may come from an endpoint description, a tool list, or a server “hello”/capabilities payload).

MCP is especially useful for discovery because it defines **tools** and (sometimes) higher-level groupings that can be mapped to skills/domains.

**Modeling rule**:

- MCP metadata populates a `core:MCPProtocol` node (treated as a `core:Descriptor`).
- Any derived skills/domains should be treated as **protocol-derived** (from MCP tools/capabilities), not free-form labels.

## Descriptor assembly (why protocol-first matters)

When multiple registries/protocols mention an agent, you can see conflicts:

- Two sources may disagree on skills/domains.
- A registry listing may be stale while a live protocol endpoint is current.

For this reason, the intended precedence is:

1. **Protocol metadata** (A2A card, MCP capabilities/tools, etc.) when available
2. Registry-provided summaries (e.g., ERC-8004 registration JSON `endpoints[].skills/domains`)
3. Free-form tags (lowest-confidence)

## Related docs

- [`descriptor.md`](./descriptor.md): Descriptor pattern and metadata assembly
- [`skills-domains.md`](./skills-domains.md): Skills/domains taxonomy + OASF alignment
- [`a2a-registry.md`](./a2a-registry.md): A2A discovery/registry notes


