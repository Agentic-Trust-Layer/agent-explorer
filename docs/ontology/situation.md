## Situation layer (DnS) — how trust + work happens

Ontology: `agentictrust.owl`

“Situation” is where things **happen**: a time-scoped event/execution that realizes a description/plan and produces durable outputs (assertions, artifacts).

### Diagrams (how Situation is used)

#### Situation → Trust establishment (verification, reputation, relationships)

![Situation trust context](./images/sections/situation-trust-context.png)

#### Situation → Work execution (intent → discovery → invocation → tasks → outcomes)

![Situation execution context](./images/sections/situation-execution-context.png)

### What a TrustSituation is (in this ontology)

- **Class**: `agentictrust:TrustSituation`
- **Meaning**: a time-scoped realization of a trust description/plan that can use evidence and produce durable outputs.

### Used to establish trust (registry-aligned)

Situations generate assertions that become the durable “ledger” of trust signals:

- **Verification**: ERC-8004 validation (e.g., `erc8004:ValidationRequest` → `erc8004:ValidationResponse`)
- **Reputation**: ERC-8004 feedback (e.g., `erc8004:Feedback`)
- **Relationships**: ERC-8092 relationship assertions (e.g., `erc8092:ERC8092RelationshipAssertion`)

### Used to perform agent work (protocol-aligned)

Situations also cover operational agent work:

- a **message** carries an **intent**
- skills are discovered via **intent type / task type** compatibility
- an agent performs a **SkillInvocation**
- invocations are part of a **TaskExecution**
- tasks produce **Artifacts** (which can include attestations, reports, or trust assertions depending on workflow)

Key links (high level):

- **Message → Intent**: `agentictrust:hasIntent`
- **Skill → IntentType**: `agentictrust:supportsIntentType`
- **IntentType → TaskType**: `agentictrust:mapsToTaskType`
- **Skill → TaskType**: `agentictrust:enablesTaskType`
- **TaskExecution → SkillInvocation**: `agentictrust:hasInvocation`
- **SkillInvocation → Skill**: `agentictrust:invokesSkill`
- **SkillInvocation → Message**: `agentictrust:invocationUsedMessage`
- **TaskExecution → Artifact**: `agentictrust:producedArtifact`


