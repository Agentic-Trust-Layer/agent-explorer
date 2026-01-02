## Provenance (PROV-O grounding)

Ontology: `agentictrust-core.owl`

### Class hierarchy (PROV grounding)

```mermaid
classDiagram
direction LR

class provPlan["prov:Plan"]
class provActivity["prov:Activity"]
class provEntity["prov:Entity"]

class TrustDescription["agentictrust:TrustDescription"]
class TrustSituation["agentictrust:TrustSituation"]
class AssertionAct["agentictrust:AssertionAct"]
class AssertionRecord["agentictrust:AssertionRecord"]

TrustDescription --|> provPlan
TrustSituation --|> provEntity
AssertionAct --|> provActivity
AssertionRecord --|> provEntity
```

### Relationship diagram (alias properties)

```mermaid
classDiagram
direction LR

class provPlan["prov:Plan"]
class provActivity["prov:Activity"]
class provEntity["prov:Entity"]

class TrustDescription["agentictrust:TrustDescription"]
class TrustSituation["agentictrust:TrustSituation"]
class AssertionAct["agentictrust:AssertionAct"]
class AssertionRecord["agentictrust:AssertionRecord"]

TrustSituation --> TrustDescription : hasSituationDescription
AssertionAct --> TrustSituation : assertsSituation
AssertionAct --> AssertionRecord : generatedAssertionRecord
AssertionRecord --> TrustSituation : recordsSituation

note for AssertionAct "AssertionAct (prov:Activity) asserts a Situation and generates an AssertionRecord (prov:Entity)."
```

### Diagram

![Core trust model](./images/sections/core-trust.png)

### What we use PROV-O for

We ground trust and execution in PROV so:

- “plans” and “situations” are compatible with existing provenance tooling
- we can connect agent metadata fetches, invocations, and produced artifacts/assertions

### Core correspondences

- **`agentictrust:TrustDescription`** ⊑ `prov:Plan` and `p-plan:Plan`
- **`agentictrust:TrustSituation`** ⊑ `prov:Entity`
- **`agentictrust:AssertionAct`** ⊑ `prov:Activity` (the act of asserting)
- **`agentictrust:AssertionRecord`** ⊑ `prov:Entity` (the durable record/artifact)

### Common provenance patterns in this repo

- **Agent card fetch**:
  - `agentictrust:AgentDescriptorFetch` (Activity) `prov:generated` → `agentictrust:AgentDescriptor`
  - timestamp via `prov:endedAtTime`

- **Invocation trace**:
  - `agentictrust:SkillInvocation` (Activity) links to the invoked `AgentSkillClassification` and input `Message`

### Where assertions land

Trust claims land as subclasses of `agentictrust:AssertionRecord` (durable entities) and `agentictrust:AssertionAct` (activities):

- **Verification**:
  - `agentictrust:VerificationTrustAssertion` (Record) - used by ERC8004 validation responses
  - `agentictrust:VerificationTrustAssertionAct` (Act) - the act of validating
- **Reputation**:
  - `agentictrust:ReputationTrustAssertion` (Record) - used by ERC8004 feedback
  - `agentictrust:ReputationTrustAssertionAct` (Act) - the act of providing feedback
- **Relationship**:
  - `agentictrust:RelationshipTrustAssertion` (Record) - used by ERC8092
  - `agentictrust:RelationshipTrustAssertionAct` (Act) - the act of asserting relationships


