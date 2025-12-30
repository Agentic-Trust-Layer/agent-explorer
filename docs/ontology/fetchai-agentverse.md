# Fetch.ai Agentverse (Registry Concepts Summary)

Fetch.ai does not publish a formal OWL/RDF ontology for agents. Instead, it provides an **engineering-first agent runtime** (uAgents) plus an **agent directory / developer platform** (Agentverse). This document summarizes the key concepts in that ecosystem and how they map into AgenticTrust.

Primary references:

- Agentverse repo: `https://github.com/fetchai/agentverse`
- uAgents repo: `https://github.com/fetchai/uAgents`
- Agentverse docs: `https://docs.fetch.ai/agentverse/`
- CLI tooling: `https://github.com/fetchai/avctl`

Important disambiguation:

- Fetch.ai “Agentverse” (registry/platform) is **not** the same as OpenBMB “AgentVerse” (multi-agent LLM framework).

## Core products (ecosystem positioning)

Fetch.ai presents a product stack where:

- **uAgents**: runtime framework for building/operating agents (execution substrate)
- **Agentverse**: listing/hosting/management and discovery surface for uAgents-based agents (directory + platform)
- **ASI:One**: agentic LLM surface that can invoke agents/services in the network
- **Flockx**: no-code agent creation/studio, publishing into Agentverse

From an AgenticTrust perspective: Fetch.ai is primarily a **runtime + directory** layer; AgenticTrust is the **semantic + trust** layer that can sit above it.

## Fetch.ai’s implicit agent “data model” (de-facto)

### Agent (central concept)

An Agent in the Fetch.ai world is typically characterized by:

- **Identity**: a wallet/address identity anchored in their ecosystem
- **Runtime**: an executing process (often Python)
- **Mailbox / endpoint**: a network addressable endpoint to receive messages
- **Behaviors**: handlers that react to messages / contexts
- **Protocols**: message schemas and interaction patterns

In ontology terms:

- Fetch “Agent” ≈ `prov:SoftwareAgent` / `agentictrust:AIAgent` (as an operational actor)
- Mailbox/endpoint ≈ `agentictrust:AgentEndpoint`
- Message/interaction artifacts ≈ `prov:Entity` (information artifacts)

### Identity

Fetch.ai tends to be wallet-address centric:

- Little/no explicit distinction between **Account** vs **Agent identity** as separate layers
- No explicit DID abstraction in the core model (though it can be layered on externally)

AgenticTrust framing:

- AgenticTrust treats **Identifier** and **Identity** as first-class abstract concepts (and allows DID forms like `did:web`, `did:ethr`, etc.).
- Fetch.ai identity can be wrapped as a concrete `agentictrust:Identifier` implementation (e.g., “FetchAccountIdentifier”) if/when needed.

### Communication & Protocols

Agents communicate via:

- **Protocol definitions** (schema + interaction contract)
- **Message schemas** (typed payloads)
- **Handlers** (code-level message processing steps)

Ontology mapping:

- Protocol ≈ `agentictrust:Protocol` / `agentictrust:ProtocolDescriptor`
- Message ≈ `prov:Entity` (information artifact)
- Handler/behavior ≈ `p-plan:Step` (plan step) with executions as `prov:Activity`

### Skills / Behaviors (capabilities)

Fetch.ai treats “skills/capabilities” primarily as **code-level** structures:

- Behaviors/handlers define “what the agent can do”
- There is not necessarily a globally standardized skill taxonomy in the same way as OASF

AgenticTrust mapping:

- Skill ≈ **Description** (what can be done)
- Task ≈ **Plan Step**
- Execution ≈ **PROV Activity**

## What Agentverse provides (as a registry)

Agentverse functions like a directory/platform that can provide:

- Agent listing and metadata
- Hosting/deployment workflows
- Discovery entrypoints (search/browse)

Key point: it is primarily a **directory/discovery system**, not a trust registry.

## What Fetch.ai generally does NOT model (where AgenticTrust adds value)

Fetch.ai’s model is typically missing (or not first-class) for:

- **DnS/DOLCE situations** (role/situation grounding)
- **Epistemic claims** (claims vs facts)
- **Trust assertions** (validation, reputation, relationship assertions)
- **Relationship modeling** (membership, delegation, alliance semantics)
- **Provenance graphs** for trust claims (beyond operational logs)

This is exactly where AgenticTrust sits:

- ERC-8004 → epistemic trust claims with evidence
- ERC-8092 → relationship situations/assertions (social/role semantics)
- Discovery via Descriptors → normalized cross-registry indexing

## Recommended interoperability framing

Use this phrasing in docs/pitches:

> Fetch.ai provides an execution-level agent runtime (uAgents) and a directory/platform (Agentverse). AgenticTrust provides the semantic, epistemic, and relational trust model required for cross-platform discovery, validation, and delegation between agents.

Or in layering form:

```
DnS / Epistemic / Social modeling
        ↑
ERC-8004 / ERC-8092 trust layer
        ↑
Identifiers / Names / Descriptors
        ↑
Fetch.ai uAgents runtime + Agentverse directory
```


