## Skills ↔ intents ↔ tasks (routing + execution)

Ontology: `agentictrust.owl` (core)

### Class hierarchy (key)

```mermaid
classDiagram
direction LR

class provEntity["prov:Entity"]
class provActivity["prov:Activity"]
class pplanPlan["p-plan:Plan"]

class Skill["agentictrust:Skill"]
class JsonSchema["agentictrust:JsonSchema"]
class SkillExample["agentictrust:SkillExample"]
class Tag["agentictrust:Tag"]

class Message["agentictrust:Message"]
class Intent["agentictrust:Intent"]
class IntentType["agentictrust:IntentType"]
class TaskType["agentictrust:TaskType"]

class Task["agentictrust:Task"]
class TaskExecution["agentictrust:TaskExecution"]
class SkillInvocation["agentictrust:SkillInvocation"]

Skill --|> provEntity
JsonSchema --|> provEntity
SkillExample --|> provEntity
Tag --|> provEntity

Message --|> provEntity
Intent --|> provEntity
Intent --|> pplanPlan
IntentType --|> provEntity
TaskType --|> provEntity

Task --|> provEntity
Task --|> pplanPlan
TaskExecution --|> provActivity
SkillInvocation --|> provActivity
```

### Relationship diagram (routing + execution)

```mermaid
classDiagram
direction LR

class AgentDescriptor["agentictrust:AgentDescriptor"]
class Skill["agentictrust:Skill"]
class JsonSchema["agentictrust:JsonSchema"]
class Tag["agentictrust:Tag"]
class IntentType["agentictrust:IntentType"]
class TaskType["agentictrust:TaskType"]

class Message["agentictrust:Message"]
class Intent["agentictrust:Intent"]
class Task["agentictrust:Task"]
class TaskExecution["agentictrust:TaskExecution"]
class SkillInvocation["agentictrust:SkillInvocation"]

AgentDescriptor --> Skill : hasSkill
Skill --> JsonSchema : hasInputSchema / hasOutputSchema
Skill --> Tag : hasTag
Skill --> IntentType : supportsIntentType
Skill --> TaskType : enablesTaskType
IntentType --> TaskType : mapsToTaskType

Message --> Intent : hasIntent
Intent --> SkillInvocation : fulfilledByInvocation
Task --> TaskExecution : taskRealizedBy
TaskExecution --> SkillInvocation : hasInvocation
SkillInvocation --> Skill : invokesSkill
SkillInvocation --> Message : invocationUsedMessage
```

### Diagrams

![Skills declarations](./images/sections/skills-declarations.png)

![Skills routing](./images/sections/skills-routing.png)

![Skills execution trace](./images/sections/skills-execution.png)

### Discovery (cards/metadata)

- `agentictrust:AgentDescriptor` → `agentictrust:Skill`: `agentictrust:hasSkill`
- `agentictrust:AgentMetadata` → `agentictrust:Skill`: `agentictrust:declaresSkill`

### Skill modeling (tool/function best-practice hooks)

- `agentictrust:Skill` → `agentictrust:JsonSchema`
  - `agentictrust:hasInputSchema`
  - `agentictrust:hasOutputSchema`
- `agentictrust:Skill` → `agentictrust:SkillExample`: `agentictrust:hasExample`
- `agentictrust:Skill` → `agentictrust:Tag`: `agentictrust:hasTag`

### Routing (intent types and task types)

- `agentictrust:Skill` → `agentictrust:IntentType`: `agentictrust:supportsIntentType`
- `agentictrust:IntentType` → `agentictrust:TaskType`: `agentictrust:mapsToTaskType`
- `agentictrust:Skill` → `agentictrust:TaskType`: `agentictrust:enablesTaskType`
- `agentictrust:TaskType` → `agentictrust:Skill`: `agentictrust:implementedBySkill`

### Execution trace

- `agentictrust:Task` → `agentictrust:TaskExecution`: `agentictrust:taskRealizedBy`
- `agentictrust:TaskExecution` → `agentictrust:SkillInvocation`: `agentictrust:hasInvocation`
- `agentictrust:SkillInvocation` → `agentictrust:Skill`: `agentictrust:invokesSkill`
- `agentictrust:SkillInvocation` → `agentictrust:Message`: `agentictrust:invocationUsedMessage`
- `agentictrust:Intent` → `agentictrust:SkillInvocation`: `agentictrust:fulfilledByInvocation`


