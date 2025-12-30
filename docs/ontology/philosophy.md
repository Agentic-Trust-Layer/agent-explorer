# AgenticTrust Ontology Philosophy (Principles & Alignments)

This document describes the modeling philosophy behind AgenticTrust: **trust is contextual and epistemic**, not just a stream of events. We model *claims*, *roles*, and *situations* first; provenance and execution follow.

### Upper / Foundational Ontology (Meaning & Situations)

These ground the system in **soft, social, epistemic modeling** (not only events).

- **DOLCE** (Descriptive Ontology for Linguistic and Cognitive Engineering)
- **DnS (Descriptions & Situations)**: roles, contexts, frames, situation-dependent truths
- **Epistemic Situations**: situations about knowledge, belief, claims, and their justification
- **Situation Ontology**: context-dependent facts and assertions
- **Social Ontology**: membership, alliance, delegation, roles
- **Role Ontology**: *agent-in-role* vs *agent-as-entity*

Where this lands in our standards:

- **ERC-8092 associations** belong as **relationship situations** / **relationship assertions** (social/role/situation modeling).
- **ERC-8004 validations** belong as **epistemic claims** with evidence (not “facts”).

### Provenance, Intent, and Planning

This layer captures **what happened**, **what was intended**, and **how steps relate**.

- **PROV-O** (W3C Provenance Ontology): `prov:Activity`, `prov:Entity`, `prov:Agent`
- **p-plan** (W3C Planning Ontology): plans, steps, roles, variables
- **Intent Ontology**: goals, intentions, commitments (often DnS-aligned)
- **Action / Task Ontology**: tasks vs executions
- **Process Ontology**: multi-step workflows

Mapping highlights:

- **ERC-8004 validation** → a **claim** grounded by evidence that can be expressed as `prov:Activity` producing a `prov:Entity` (the assertion artifact) and attributed to a `prov:Agent`.
- **ERC-8092 association** → a **relationship situation** (not merely an event).
- **OASF skills** → treat as **descriptions** and/or **plan steps** (p-plan), not executions.

### Identity, Agents, and Relationships

These standards define **who is acting** and **how identity persists**.

- **DID Core** (W3C): decentralized identifiers
- **Verifiable Credentials** (W3C VC Data Model)
- **DIDComm**: secure agent-to-agent messaging
- **CAIP**: chain-agnostic identifiers
- **Agent Identity**: persistent identifiers across registries
- **Smart Accounts**: ERC-4337 / AA-based identity anchoring

Anchors we explicitly care about:

- `did:ethr`, `did:ens`, `did:web`, plus registry-specific methods (e.g., `did:8004`)

### Trust, Credentials, and Validation

This is the core differentiation layer.

- **ERC-8004**: agent registration, validation, feedback
- **ERC-8092**: associated accounts / relationship assertions
- **Smart Credentials**: onchain + offchain + ZK credentials
- **Trust Graph**: network-derived trust
- **Reputation Ontology**: evidence-based trust scoring
- **Relationship Credentials**: membership, delegation, alliance

Key insight:

- **ERC-8092 ≠ “event”** → it is an **asserted relationship situation**.
- **ERC-8004 ≠ “fact”** → it is an **epistemic claim with evidence**.

### Agent Skills, Tasks, and Capabilities (OASF + A2A/MCP)

This is where **OASF** and **protocol descriptors** intersect with ontology.

- **OASF**: Open Agentic Schema Framework
- **Skill Ontology**: what an agent can do
- **Capability Model**: preconditions, guarantees, constraints
- **Task Ontology**: executable vs declarative tasks
- **Intent Type**: why a task is invoked

Minimal abstraction we aim to preserve:

- **Skill** = a **Description**
- **Task** = a **Plan Step**
- **Execution** = a **PROV Activity**
- **Validation** = an **Epistemic Situation**

### Discovery, Naming, and Resolution

This supports discovery and verification while preserving trust semantics.

- **ENS / DNS interoperability**
- **DNS TXT discovery records** (e.g., `_agent.` patterns)
- **CCIP-Read (ERC-3668)**: offchain resolution under onchain control
- **Metadata resolution**: `agent.json` / `agent-card.json`
- **IPFS**: content-addressed metadata

Enables:

- Trust-preserving offchain metadata
- Deterministic agent resolution

### Governance, Alliances, and Membership

These standards model collective trust and coordination.

- **Membership Ontology**: joining, leaving, status
- **Alliance Ontology**: coordination structures
- **Delegation Ontology**: authority transfer
- **Governance Ontology**: rules, policies, consent
- **Consent Ontology**: mutual agreement (initiator/approver)

ERC-8092 maps naturally here: most associations are **membership/delegation/relationship** constructs.

### Meta framing (hashtags / positioning)

- `#AgenticTrust`
- `#TrustlessAgents`
- `#OnchainOntology`
- `#EpistemicWeb`
- `#SemanticWeb3`
- `#AgentGraph`
- `#RelationshipFirst`
- `#ContextualTrust`


