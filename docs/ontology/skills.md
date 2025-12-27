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

class AgentDescriptor["agentictrust:AgentDescriptor"]
class Skill["agentictrust:Skill"]
class Tag["agentictrust:Tag"]
class SkillExample["agentictrust:SkillExample"]
class JsonSchema["agentictrust:JsonSchema"]
class IntentType["agentictrust:IntentType"]

AgentDescriptor --> Skill : hasSkill
AgentDescriptor --> Skill : declaresSkill

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

class Intent["agentictrust:Intent"]
class IntentType["agentictrust:IntentType"]
class IntentSubject["agentictrust:IntentSubject"]
class IntentCheck["agentictrust:IntentCheck"]
class TaskType["agentictrust:TaskType"]
class Skill["agentictrust:Skill"]

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

class provActivity["prov:Activity"]
class TaskExecution["agentictrust:TaskExecution"]
class SkillInvocation["agentictrust:SkillInvocation"]
class Task["agentictrust:Task"]
class Intent["agentictrust:Intent"]
class Skill["agentictrust:Skill"]
class Message["agentictrust:Message"]

TaskExecution --|> provActivity
SkillInvocation --|> provActivity

Task --> TaskExecution : taskRealizedBy
TaskExecution --> SkillInvocation : hasInvocation
SkillInvocation --> Skill : invokesSkill
SkillInvocation --> Message : invocationUsedMessage
Intent --> SkillInvocation : fulfilledByInvocation
```


