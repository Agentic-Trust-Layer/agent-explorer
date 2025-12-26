## Situation layer (DnS) — TrustSituation + activities

Ontology: `agentictrust.owl`

### Diagram

![Core trust model](./images/sections/core-trust.png)

![Skills execution trace](./images/sections/skills-execution.png)

### TrustSituation (DnS “Situation”)

- **Class**: `agentictrust:TrustSituation`
- **Meaning**: a time-scoped realization of a `TrustDescription`
- **Grounding**: subclass of `prov:Activity`

### Key relations

- **TrustSituation → TrustDescription**: `agentictrust:realizesDescription`
- **TrustSituation → TrustAssertion**: `agentictrust:generatedAssertion` (alias of `prov:generated`)

### Execution activities used in this repo

`agentictrust.owl` also defines execution/activity classes (all subclasses of `prov:Activity`):

- `agentictrust:TaskExecution`
- `agentictrust:SkillInvocation`
- `agentictrust:AgentCardFetch`
- `agentictrust:MessageSend` / `agentictrust:MessageReceive`

### Invocations and trace links

- **TaskExecution → SkillInvocation**: `agentictrust:hasInvocation`
- **SkillInvocation → Skill**: `agentictrust:invokesSkill`
- **SkillInvocation → Message**: `agentictrust:invocationUsedMessage`
- **Intent → SkillInvocation**: `agentictrust:fulfilledByInvocation`


