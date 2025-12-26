## Skills / tools / intents / tasks (`agentictrust.owl`)

Source: `apps/badge-admin/public/ontology/agentictrust.owl`

### Overview

The ontology separates:

- **Discovery**: metadata/card declarations about skills
- **Routing**: intent types and task types
- **Execution trace**: skill invocations used to realize tasks/fulfill intents

### Skills and declarations

```mermaid
classDiagram
direction LR

class "agentictrust:AgentCard" as AgentCard
class "agentictrust:AgentMetadata" as AgentMetadata
class "agentictrust:Skill" as Skill
class "agentictrust:Tag" as Tag
class "agentictrust:SkillExample" as SkillExample
class "agentictrust:JsonSchema" as JsonSchema
class "agentictrust:IntentType" as IntentType

AgentCard --> Skill : hasSkill
AgentMetadata --> Skill : declaresSkill

Skill --> Tag : hasTag
Skill --> SkillExample : hasExample
Skill --> JsonSchema : hasInputSchema
Skill --> JsonSchema : hasOutputSchema
Skill --> IntentType : supportsIntentType
```

### Intents, task types, and mappings

```mermaid
classDiagram
direction LR

class "agentictrust:Intent" as Intent
class "agentictrust:IntentType" as IntentType
class "agentictrust:IntentSubject" as IntentSubject
class "agentictrust:IntentCheck" as IntentCheck
class "agentictrust:TaskType" as TaskType
class "agentictrust:Skill" as Skill

IntentType --> TaskType : mapsToTaskType
Skill --> TaskType : enablesTaskType
TaskType --> Skill : implementedBySkill

Intent --> IntentSubject : hasSubject
Intent --> IntentCheck : hasCheck
```

### Execution trace (activities)

```mermaid
classDiagram
direction LR

class "prov:Activity" as provActivity
class "agentictrust:TaskExecution" as TaskExecution
class "agentictrust:SkillInvocation" as SkillInvocation
class "agentictrust:Task" as Task
class "agentictrust:Intent" as Intent
class "agentictrust:Skill" as Skill
class "agentictrust:Message" as Message

TaskExecution --|> provActivity
SkillInvocation --|> provActivity

Task --> TaskExecution : taskRealizedBy
TaskExecution --> SkillInvocation : hasInvocation
SkillInvocation --> Skill : invokesSkill
SkillInvocation --> Message : invocationUsedMessage
Intent --> SkillInvocation : fulfilledByInvocation
```


