# Intent Model: IntentType and IntentSituation

This document describes the IntentType ontology that wraps OASF skills without redefining them, stays compatible with DOLCE-DnS, and plugs naturally into PROV-O / P-PLAN / A2A / MCP.

Source: `apps/ontology/ontology/core.ttl`

## Design Principles

### Intent explains why a skill is invoked, not how it is executed

The core design principle is:

**Intent ≠ Skill**: Intent is about purpose or goal. Skills are capabilities.

**Intent ≠ Task**: Tasks are executions (`core:TaskExecution` ⊑ `prov:Activity`). Intent is epistemic and contextual.

**IntentType is durable, IntentSituation is ephemeral**:

- `core:IntentType` is a stable taxonomy/schema (a SituationDescription)
- `core:IntentSituation` is the concrete, time-scoped epistemic context at request time

## Agent-to-agent request flows (what happened vs what is happening)

This section grounds two complementary views:

- **PROV-O view (what happened)**: a requesting agent performs a request Activity that results in a task Activity executed by another agent.
- **Behavioristic / DnS-aligned view (what is happening / will happen)**: purpose + state frame the intent, and actions are taken toward a goal under context.

### Flow A: PROV-O “what happened” (agent-to-agent request)

Key idea: the request is an Activity by the requesting agent; the remote task is an Activity by the executing agent. The request carries an `Intent` plan, whose template is an `IntentType`.

```mermaid
graph TB
  Plan["p-plan:Plan"]
  IntentPlan["core:Intent (Plan)"]
  IntentType["core:IntentType (template)"]
  ReqAct["core:AgentRequest (prov:Activity)"]
  Msg["core:Message (prov:Entity)"]
  ExecAct["core:TaskExecution (prov:Activity)"]
  ReqAgent["Requesting agent (prov:Agent)"]
  ExecAgent["Executing agent (prov:Agent)"]

  IntentPlan -->|core:intentHasType| IntentType
  IntentPlan -->|isA| Plan

  ReqAct -->|prov:wasAssociatedWith| ReqAgent
  ReqAct -->|prov:generated| Msg
  Msg -->|core:hasIntent| IntentPlan

  ExecAct -->|prov:wasAssociatedWith| ExecAgent
  ExecAct -->|core:inResponseToMessage| Msg
  ExecAct -->|core:hadPlan| IntentPlan
```

Notes:

- The request/response coupling can also be expressed with `prov:wasInformedBy` between Activities; `core:inResponseToMessage` anchors the triggering Message artifact.
- Roles can be qualified using PROV/P-PLAN (e.g., `prov:qualifiedAssociation` with `prov:hadPlan` and `prov:hadRole`), and AgenticTrust already models `core:Role` as a `p-plan:Role`.

### Flow B: behavioristic view (purpose + state → intent → action → activity)

This view adds two epistemic objects used in orchestration and semantic routing:

- **Purpose**: “direction toward an outcome” (goal framing)
- **State**: “context / preconditions / situation framing”

```mermaid
graph TB
  Purpose["core:Purpose (prov:Entity)"]
  State["core:State (prov:Entity)"]
  Intent["core:Intent (prov:Entity, p-plan:Plan)"]
  Action["core:AgentRequest (prov:Activity)"]
  Activity["core:TaskExecution (prov:Activity)"]

  Intent -->|core:hasPurpose| Purpose
  Intent -->|core:hasContextState| State

  Action -->|core:hadPlan| Intent
  Action -->|prov:wasInformedBy| Activity
```

Interpretation:

- Purpose/State do not “execute”; they are descriptive inputs that guide routing and selection.
- The executing Activity is still modeled in PROV as an Activity with provenance and accountability.

### Flow B (expanded): inferred intent on the provider side

The second diagram becomes clearer if we separate:

- **expressed intent**: what the client *sends* (the request plan)
- **inferred intent**: what the provider *derives* (interpretation used to choose an action/workflow)

This avoids conflating “what the client asked” with “what the provider believes the client wants”.

![Agent-to-agent request with intent inference (expressed vs inferred)](./images/intent-flow.png)

```mermaid
graph LR
  Client["Client Agent\n(prov:Agent)"]
  Req["AgentRequest\n(core:AgentRequest)"]
  Msg["Message\n(core:Message)"]
  Exec["Provider Task Execution\n(core:TaskExecution)"]

  Intent["Expressed Intent\n(core:Intent)"]
  Purpose["Purpose\n(core:Purpose)"]
  State["State\n(core:State)"]

  Client -->|wasAssociatedWith| Req
  Req -->|generated| Msg
  Msg -->|hasIntent| Intent
  Intent -->|hasPurpose| Purpose
  Intent -->|hasContextState| State
  Exec -->|inResponseToMessage| Msg
```

## Discovery (intent → candidate providers/tools)

This section captures the “semantic discovery” step that happens *before* execution:

- the client’s **expressed intent** (plus purpose/state) is used to **narrow** the universe of possible provider agents/tools
- this narrowing is classification (search/retrieval), not execution

In practice, discovery often follows:

Intent → IntentType → TaskType → eligible skills/tools → candidate providers → execute

### Conceptual flow (left-to-right)

```mermaid
graph LR
  Expr["Expressed Intent\n(core:Intent)"]
  Type["IntentType\n(core:IntentType)"]
  Task["TaskType\n(core:TaskType)"]
  Skill["Skill/Tool class\n(core:AgentSkillClassification)"]

  Reg["Registry context\n(core:AgentRegistry)"]
  Disc["AgentDiscovery\n(core:AgentDiscovery)"]
  Agents["AgentCandidateSet\n(core:AgentCandidateSet)"]

  Cat["ToolCatalog\n(core:ToolCatalog)"]
  Search["ToolSearch\n(core:ToolSearch)"]
  Tools["ToolCandidateSet\n(core:ToolCandidateSet)"]

  Expr -->|intentHasType| Type
  Type -->|mapsToTaskType| Task
  Task -->|implementedBySkill / enablesTaskType| Skill

  Reg --> Disc
  Expr --> Disc
  Disc -->|generatedAgentCandidateSet| Agents

  Cat --> Search
  Expr --> Search
  Search -->|generatedToolCandidateSet| Tools
  Tools -->|candidateTool| Skill
```

Notes:

- `AgentDiscovery` and `ToolSearch` are Activities because they are provenance-bearing “classification” steps.
- The candidate sets are Entities because they can be audited (“what was considered?”) and reused/cached.

## Intent-first execution planning (plan before selection)

Some modern agent discovery and coordination solutions return a **structured execution plan** *before* choosing which agent/tool will execute. This enables:

- plan negotiation / bidding across candidate agents
- policy checks and safety review before side effects
- clearer separation between intent understanding and execution commitment

### Pattern: intent → plan → selection → execution

```mermaid
graph LR
  NL["User input / implied intent"]
  Intent["Intent (core:Intent)"]
  PlanAct["PlanSynthesis (prov:Activity)"]
  Plan["ExecutionPlan (p-plan:Plan)"]
  Disc["AgentDiscovery / ToolSearch"]
  Select["Tool/agent selection"]
  Exec["TaskExecution / SkillInvocation"]

  NL --> Intent
  Intent --> PlanAct
  PlanAct -->|generatedExecutionPlan| Plan
  Plan --> Disc
  Disc --> Select
  Select --> Exec
```

### How this fits AgenticTrust (new vocabulary)

We model “plan-first” without collapsing it into execution:

- **`core:ExecutionPlan`**: the plan artifact (Entity, `p-plan:Plan`)
- **`core:PlanStep`**: steps within the plan (Entity, `p-plan:Step`)
- **`core:PlanSynthesis`**: Activity that generates the plan from an expressed/inferred Intent
- **`core:PlanNegotiation`**: Activity for plan proposal/counterproposal/acceptance before committing to execution
- **`core:hasPlan`**: attach a plan to a Message (plan proposal/response)

### Where the industry does this (capability overview)

Authoritative sources (patterns/specs):

- **A2A**: plan exchange/negotiation as part of an agent lifecycle: `https://agent2agent.info/docs/concepts/agent-lifecycle`
- **OpenAI**: planning patterns prior to tool selection: `https://platform.openai.com/docs/guides/agent-architectures`
- **Semantic Kernel**: planner produces a plan before invoking skills: `https://learn.microsoft.com/en-us/semantic-kernel/overview/planning`
- **LangChain / LangSmith**: plan generation + tool selection + traces: `https://github.com/langchain-ai/langchain` and `https://www.langchain.com/langsmith/overview`
- **HCS-10** (emerging): intent broadcast / negotiation semantics: `https://hol.org/docs/standards/hcs-10/`
- **BANDAID (IETF draft)**: DNS-based discovery with negotiation framing: `https://datatracker.ietf.org/doc/html/draft-mozleywilliams-dnsop-bandaid-00`

```mermaid
graph TB
  Client["Client agent (prov:Agent)"]
  Provider["Provider agent (prov:Agent)"]

  Purpose["Purpose (prov:Entity)"]
  State["State (prov:Entity)"]

  Msg["Message (prov:Entity)"]
  Expressed["Expressed Intent (core:Intent)"]
  Inferred["Inferred Intent (core:Intent)"]

  Req["Client request action (core:AgentRequest)"]
  Work["Provider work activity (core:TaskExecution)"]
  Infer["Intent inference (core:IntentInference)"]
  Decide["Provider response action (prov:Activity)"]

  Client --> Req
  Req -->|prov:generated| Msg
  Msg -->|core:hasIntent| Expressed
  Expressed -->|core:hasPurpose| Purpose
  Expressed -->|core:hasContextState| State

  Provider --> Work
  Work -->|core:inResponseToMessage| Msg

  Provider --> Infer
  Infer -->|prov:used| Msg
  Infer -->|prov:used| Work
  Infer -->|prov:generated| Inferred

  Provider --> Decide
  Decide -->|core:hadPlan| Inferred
```

Notes:

- We keep **both** intents as `core:Intent` because both are plans/epistemic artifacts; the distinction is provenance:
  - expressed intent is carried by the inbound message
  - inferred intent is generated by an `IntentInference` activity
- The provider’s “response action” can be another `AgentRequest` (handoff) or a `SkillInvocation`/`TaskExecution` depending on how the provider fulfills the request.

### Do Not Duplicate OASF

OASF already defines what can be done (Skills). The IntentType ontology wraps OASF skills without redefining them:

- **OASF**: Defines Skills (capabilities)
- **IntentType**: Defines why skills are invoked (purpose/goal)
- **No subclassing of OASF skills**: Only referencing them
- **No reinterpretation of OASF semantics**: OASF remains exactly as-is

### DOLCE-DnS Alignment

This maps perfectly to DOLCE-DnS (Descriptions & Situations):

- **Skill → Description**: What can be done (OASF)
- **IntentType → Description**: Why it's being done (higher-level, goal-oriented)
- **Task → Activity**: Execution (PROV-O)
- **IntentSituation → Situation**: Concrete realization of intent
- **Intent Satisfaction → Situation**: DnS satisfaction pattern

## Core Ontology Classes

### IntentType

```owl
core:IntentType a owl:Class ;
  rdfs:label "IntentType" ;
  rdfs:comment "A description of why an agent capability is being invoked. Intent explains why a skill is invoked, not how it is executed. Taxonomy value used to scope discovery and select compatible skills." ;
  rdfs:subClassOf core:SituationDescription .
```

**Meaning**: A description of why an agent capability is being invoked.

**Examples**:
- `ValidateCapabilityIntent`
- `RequestDelegationIntent`
- `RetrieveDataIntent`

### IntentSituation

```owl
core:IntentSituation a owl:Class ;
  rdfs:label "IntentSituation" ;
  rdfs:comment "A concrete epistemic situation in which an agent expresses or acts under a given intent. Modeled as a Situation (prov:Entity) and realized by Activities via core:isRealizedBy." ;
  rdfs:subClassOf core:Situation .
```

**Meaning**: A concrete situation in which an agent expresses or acts under a given intent.

**Useful for**:
- Logging intents
- Validating intent fulfillment
- Reasoning over outcomes vs goals

## Key Object Properties

### Intent → Skill Binding

```owl
core:targetsSkill a owl:ObjectProperty ;
  rdfs:label "targetsSkill" ;
  rdfs:comment "Links an IntentType to an OASF Skill that can satisfy this intent. This intent can be satisfied by invoking this skill. Allows many intents to target the same skill, and one intent to target many skills. Keeps OASF skills untouched - only references them." ;
  rdfs:domain core:IntentType ;
  rdfs:range core:AgentSkillClassification .
```

**Meaning**: This intent can be satisfied by invoking this OASF skill.

### Intent → TaskType (routing pivot)

In AgenticTrust orchestration, `TaskType` is the semantic pivot between epistemic intent and executable actions:

- `core:mapsToTaskType` (IntentType → TaskType)
- skills/tools can then be related to task types using `core:enablesTaskType` (Skill → TaskType) and `core:implementedBySkill` (TaskType → Skill)

### Where IntentType fits

Think of it as:

- **IntentType**: the *template / taxonomy value* (durable, shared meaning)
- **Intent**: the *plan instance* carried in a message for a specific request (can include parameters, expected results, purpose/state)
- **TaskExecution**: the *remote activity* executed by the other agent to satisfy the request

**Benefits**:
- Keeps OASF untouched
- Allows many intents → same skill
- Allows one intent → many skills

### Intent → Activity (Runtime)

```owl
core:isRealizedBy a owl:ObjectProperty ;
  rdfs:label "isRealizedBy" ;
  rdfs:comment "Links an IntentSituation to a PROV Activity that realizes it. The intent was realized through this concrete activity." ;
  rdfs:domain core:IntentSituation ;
  rdfs:range prov:Activity .
```

**Meaning**: The intent was realized through this concrete activity.

### Intent → Situation (DnS Satisfaction)

```owl
core:satisfiesIntent a owl:ObjectProperty ;
  rdfs:label "satisfiesIntent" ;
  rdfs:comment "Links a Situation to an IntentType that it fulfills (satisfaction pattern)." ;
  rdfs:domain core:Situation ;
  rdfs:range core:IntentType .
```

**Meaning**: This situation fulfills the intent.

## How OASF Fits (No Collision)

OASF remains exactly as-is:

```
OASF:
  Domain → Skill

IntentType Layer:
  IntentType → targetsSkill → oasf:Skill
```

- **No subclassing of OASF skills**
- **No reinterpretation of OASF semantics**
- **Only referencing them**

## Relationship Diagram

```mermaid
classDiagram
direction LR

class IntentType["core:IntentType"]
class Skill["core:AgentSkillClassification (OASFSkill)"]
class IntentSituation["core:IntentSituation"]
class Activity["prov:Activity"]
class Situation["core:Situation"]

IntentType --> Skill : targetsSkill
Skill --> IntentType : supportsIntentType (inverse)
IntentSituation --> IntentType : satisfiesIntent
IntentSituation --> Activity : isRealizedBy
Situation --> IntentType : satisfiesIntent

note for IntentType "SituationDescription\nWhy a skill is invoked"
note for IntentSituation "Situation (prov:Entity)\nEpistemic context"
note for Skill "OASF Skill\nWhat can be done"
```

## Concrete Example

### OASF Skill (Existing)

```turtle
oasf:validation_attestation a oasf:Skill ;
  rdfs:label "Validation / Attestation" .
```

### IntentType (New)

```turtle
core:ValidateAgentCapabilityIntent a core:IntentType ;
  rdfs:label "Validate Agent Capability" ;
  core:targetsSkill oasf:validation_attestation .
```

### IntentSituation (Runtime)

```turtle
:IntentSituation123 a core:IntentSituation ;
  core:satisfiesIntent core:ValidateAgentCapabilityIntent ;
  prov:wasAssociatedWith :RequestingAgent ;
  prov:generatedAtTime "2025-03-01T10:00:00Z"^^xsd:dateTime .
```

### Activity that Realizes It

```turtle
:ValidationActivity456 a prov:Activity ;
  prov:wasAssociatedWith :ValidatorAgent .

:IntentSituation123 core:isRealizedBy :ValidationActivity456 .
```

## Why This Works

### Clean Separation of Concerns

| Concept | Ontology |
|---------|----------|
| Capability | OASF Skill |
| Purpose | IntentType |
| Execution | prov:Activity |
| Outcome | Situation / Validation |

### Handles Multi-Skill Intents

**Example**: "Establish trusted partnership"

```turtle
core:EstablishAllianceIntent a core:IntentType ;
  core:targetsSkill oasf:identity_verification ,
                            oasf:association_management .
```

### Handles Same Skill, Different Intent

**Same skill**: `get_data`

**Different intents**:
- `RetrievePublicDataIntent`
- `AuditComplianceIntent`
- `TrainModelIntent`

All point to the same OASF skill, but differ in meaning and policy.

## SPARQL Queries

### Query: IntentType with Targeted Skills

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?intentType ?intentTypeLabel ?skill ?skillLabel
WHERE {
  ?intentType a core:IntentType .
  
  OPTIONAL {
    ?intentType rdfs:label ?intentTypeLabel .
  }
  
  OPTIONAL {
    ?intentType core:targetsSkill ?skill .
    ?skill a core:AgentSkillClassification .
    
    OPTIONAL {
      ?skill rdfs:label ?skillLabel .
    }
  }
}
ORDER BY ?intentType
```

### Query: IntentSituation with Realization

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?intentSituation ?intentType ?intentTypeLabel ?activity
WHERE {
  ?intentSituation a core:IntentSituation .
  
  OPTIONAL {
    ?intentSituation core:satisfiesIntent ?intentType .
    ?intentType a core:IntentType .
    
    OPTIONAL {
      ?intentType rdfs:label ?intentTypeLabel .
    }
  }
  
  OPTIONAL {
    ?intentSituation core:isRealizedBy ?activity .
    ?activity a prov:Activity .
  }
}
LIMIT 50
```

### Query: Situation Satisfying Intent

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX dolce: <http://www.loa-cnr.it/ontologies/DOLCE-Lite.owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?situation ?intentType ?intentTypeLabel
WHERE {
  ?situation a core:Situation .
  
  OPTIONAL {
    ?situation core:satisfiesIntent ?intentType .
    ?intentType a core:IntentType .
    
    OPTIONAL {
      ?intentType rdfs:label ?intentTypeLabel .
    }
  }
}
LIMIT 50
```

### Query: Multi-Skill Intent

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?intentType ?intentTypeLabel (COUNT(?skill) AS ?skillCount) (GROUP_CONCAT(?skillLabel; separator=", ") AS ?skillLabels)
WHERE {
  ?intentType a core:IntentType ;
    core:targetsSkill ?skill .
  
  OPTIONAL {
    ?intentType rdfs:label ?intentTypeLabel .
  }
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
}
GROUP BY ?intentType ?intentTypeLabel
HAVING (?skillCount > 1)
ORDER BY ?skillCount DESC
```

### Query: Verification Situation Satisfying Intent

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?verificationSituation ?intentType ?intentTypeLabel ?agentId
WHERE {
  ?verificationSituation a core:VerificationTrustSituation, erc8004:ValidationRequestSituation .
  
  OPTIONAL {
    ?verificationSituation core:satisfiesIntent ?intentType .
    ?intentType a core:IntentType .
    
    OPTIONAL {
      ?intentType rdfs:label ?intentTypeLabel .
    }
  }
  
  OPTIONAL {
    ?verificationSituation erc8004:requestingAgentId ?agentId .
  }
}
LIMIT 50
```

### Query: Reputation Situation Satisfying Intent

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?reputationSituation ?intentType ?intentTypeLabel ?assertion
WHERE {
  ?reputationSituation a core:ReputationTrustSituation .
  
  OPTIONAL {
    ?reputationSituation core:satisfiesIntent ?intentType .
    ?intentType a core:IntentType .
    
    OPTIONAL {
      ?intentType rdfs:label ?intentTypeLabel .
    }
  }
  
  OPTIONAL {
    ?assertion core:generatedSituation ?reputationSituation .
    ?assertion a erc8004:Feedback .
  }
}
LIMIT 50
```

### Query: Relationship Situation Satisfying Intent

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8092: <https://agentictrust.io/ontology/erc8092#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?relationshipSituation ?intentType ?intentTypeLabel ?relationship
WHERE {
  ?relationshipSituation a core:RelationshipSituation .
  
  OPTIONAL {
    ?relationshipSituation core:satisfiesIntent ?intentType .
    ?intentType a core:IntentType .
    
    OPTIONAL {
      ?intentType rdfs:label ?intentTypeLabel .
    }
  }
  
  OPTIONAL {
    ?relationshipSituation core:aboutSubject ?relationship .
    ?relationship a core:Relationship, erc8092:AccountRelationshipERC8092 .
  }
}
LIMIT 50
```

### Query: IntentType to Skill via targetsSkill

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?intentType ?intentTypeLabel ?skill ?skillId ?skillName
WHERE {
  ?intentType a core:IntentType ;
    core:targetsSkill ?skill .
  
  OPTIONAL {
    ?intentType rdfs:label ?intentTypeLabel .
  }
  
  ?skill a core:AgentSkillClassification .
  
  OPTIONAL {
    ?skill core:skillId ?skillId .
  }
  
  OPTIONAL {
    ?skill core:skillName ?skillName .
  }
}
LIMIT 100
```

### Query: Complete Intent Flow: Situation → IntentType → Skill

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX dolce: <http://www.loa-cnr.it/ontologies/DOLCE-Lite.owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?situation ?situationType ?intentType ?intentTypeLabel ?skill ?skillId
WHERE {
  ?situation a core:Situation ;
    core:satisfiesIntent ?intentType .
  
  OPTIONAL {
    ?situation a ?situationType .
    FILTER(?situationType IN (
      core:VerificationTrustSituation,
      core:ReputationTrustSituation,
      core:RelationshipSituation
    ))
  }
  
  ?intentType a core:IntentType ;
    core:targetsSkill ?skill .
  
  OPTIONAL {
    ?intentType rdfs:label ?intentTypeLabel .
  }
  
  ?skill a core:AgentSkillClassification .
  
  OPTIONAL {
    ?skill core:skillId ?skillId .
  }
}
LIMIT 100
```

## Summary

The IntentType ontology provides:

1. **Clean separation**: Intent (why) vs Skill (what) vs Task (how)
2. **OASF compatibility**: Wraps OASF skills without redefining them
3. **DOLCE-DnS alignment**: IntentType → Description, IntentSituation → Situation
4. **Flexibility**: Many intents → same skill, one intent → many skills
5. **Runtime tracking**: IntentSituation links to concrete activities
6. **Satisfaction reasoning**: Situation → IntentType fulfillment

This design keeps OASF untouched while adding a powerful intent layer for purpose-driven discovery and execution.

See also:

- [`agent-orchestration.md`](./agent-orchestration.md): orchestration patterns (intent → task → action) and industry tool-selection concepts
- [`protocols-endpoints.md`](./protocols-endpoints.md): why skills/tools are primarily protocol-derived (A2A/MCP)

