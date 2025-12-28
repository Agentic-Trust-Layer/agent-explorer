## Skills ↔ intents ↔ tasks (routing + execution)

Ontology: `agentictrust-core.owl` (core)

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
AgentDescriptor --> Skill : declaresSkill
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

### SPARQL Queries (demonstrating property relationships)

**Query AgentDescriptor with Skills (declared and has):**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?agentDescriptor ?skill ?skillLabel
WHERE {
  ?agentDescriptor a agentictrust:AgentDescriptor .
  
  {
    ?agentDescriptor agentictrust:hasSkill ?skill .
  }
  UNION
  {
    ?agentDescriptor agentictrust:declaresSkill ?skill .
  }
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
}
```

**Query Skill with JsonSchema, Tag, IntentType, and TaskType:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?skill ?skillLabel ?inputSchema ?outputSchema ?tag ?intentType ?taskType
WHERE {
  ?skill a agentictrust:Skill .
  
  OPTIONAL {
    ?skill rdfs:label ?skillLabel .
  }
  OPTIONAL {
    ?skill agentictrust:hasInputSchema ?inputSchema .
  }
  OPTIONAL {
    ?skill agentictrust:hasOutputSchema ?outputSchema .
  }
  OPTIONAL {
    ?skill agentictrust:hasTag ?tag .
  }
  OPTIONAL {
    ?skill agentictrust:supportsIntentType ?intentType .
  }
  OPTIONAL {
    ?skill agentictrust:enablesTaskType ?taskType .
  }
}
```

**Query IntentType to TaskType mapping:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?intentType ?taskType
WHERE {
  ?intentType a agentictrust:IntentType ;
    agentictrust:mapsToTaskType ?taskType .
}
```

**Query Message with Intent and SkillInvocation:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?message ?intent ?skillInvocation ?skill
WHERE {
  ?message a agentictrust:Message ;
    agentictrust:hasIntent ?intent .
  
  OPTIONAL {
    ?intent agentictrust:fulfilledByInvocation ?skillInvocation .
    ?skillInvocation agentictrust:invokesSkill ?skill .
  }
}
```

**Query Task with TaskExecution and SkillInvocation:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT ?task ?taskExecution ?skillInvocation ?skill ?message
WHERE {
  ?task a agentictrust:Task ;
    agentictrust:taskRealizedBy ?taskExecution .
  
  OPTIONAL {
    ?taskExecution agentictrust:hasInvocation ?skillInvocation .
    ?skillInvocation agentictrust:invokesSkill ?skill .
    ?skillInvocation agentictrust:invocationUsedMessage ?message .
  }
}
```

### Diagrams

![Skills declarations](./images/sections/skills-declarations.png)

![Skills routing](./images/sections/skills-routing.png)

![Skills execution trace](./images/sections/skills-execution.png)

### Discovery (cards/metadata)

- `agentictrust:AgentDescriptor` → `agentictrust:Skill`: `agentictrust:hasSkill`
- `agentictrust:AgentDescriptor` → `agentictrust:Skill`: `agentictrust:declaresSkill`

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


