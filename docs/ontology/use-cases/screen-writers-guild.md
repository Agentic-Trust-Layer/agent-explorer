# Screen Writers Guild (WGA) membership use-case

Outcome: **"I am added to the movie writers guild."**

This use-case is intentionally domain-heavy: joining a guild is a **regulated, evidence-based, long-running** process with third-party adjudication. That makes it ideal for drawing out the differences between **intent**, **task**, **plan**, **action**, and **skill**.

## Domain framing (what makes this hard)

Guild membership (e.g., WGA) is not something an agent can "do" directly. It is an outcome that typically involves:
- **Eligibility rules** that can change over time
- **Evidence** requirements (credits, contracts, attestations, fees)
- **Gatekeepers** (review committee / organization decision)
- **Delays and uncertainty** (pending, rejected, incomplete, accepted)
- **Branching pathways** (not eligible -> gap plan -> reapply)

So the real problem is a workflow:
1) interpret the goal (intent)
2) assess eligibility (tasks + evidence)
3) submit an application (tasks)
4) monitor decision and respond (tasks)

## What we model (and why)

This use-case is meant to demonstrate:
- **Outcome != execution**: membership is a desired state, not an API call
- **Intent != task**: the goal remains stable while tasks vary with evidence gaps
- **Task != action**: tasks are durable work units; actions are atomic tool-bound steps
- **Skills are the discovery surface**: agents advertise skills; planners pick skills; actions implement skills

## Core classes used (from `apps/ontology/ontology/core.ttl`)

- **Intent layer**
  - `core:IntentType` (taxonomy concept)
  - `core:Intent` (goal instance)
- **Work layer**
  - `core:TaskType` (taxonomy concept)
  - `core:Task` (activity instance)
- **Orchestration layer**
  - `core:Plan` (also `prov:Plan` and `p-plan:Plan`)
  - `core:PlanStep` (also `p-plan:Step`)
- **Execution layer**
  - `core:ActionType` (taxonomy concept)
  - `core:Action` (atomic activity instance)
- **Capability layer**
  - `oasf:Skill` (capability instance, used for discovery)
  - `core:SkillType` (taxonomy concept that classifies skills)

Key properties (core):
- `core:hasIntentType`, `core:targetOrganization`, `core:desiredStatus`
- `core:hasTaskType`, `core:usesSkill`
- `core:planForIntent`, `core:hasStep`, `core:stepOrder`, `core:stepTaskType`, `core:stepActionType`
- `core:actionTarget`, `core:actionTool`, `core:actionParametersJson`

## DOLCE-DnS principles (Description vs Situation)

We do not import DOLCE-DnS as a hard dependency, but we apply its key pattern:

- **Descriptions**: reusable templates (what should be true / what should be done)
- **Situations**: concrete occurrences that may satisfy a description (what is happening now)

In this domain:
- The **Description** layer stays stable (taxonomy + plan templates)
- The **Situation** layer evolves over time (tasks/actions + evidence + decisions)

### Mapping table (DnS / PROV-O / p-plan -> our ontology)

DnS "Description":
- `core:IntentType` and `core:TaskType` are controlled descriptions (both are `skos:Concept`s)
- `core:Plan` is a process description (`prov:Plan`, `p-plan:Plan`)
- `core:PlanStep` is a step description (`p-plan:Step`) with ordering and expected work category

DnS "Situation":
- `core:Intent` is a concrete goal instance (modeled as `prov:Entity`)
- `core:Task` and `core:Action` are concrete executions (both are `prov:Activity` subclasses)

PROV-O (imported):
- `prov:used`: connect tasks/actions to inputs (intent, evidence)
- `prov:generated`: connect tasks/actions to outputs (evidence bundles, receipts) (optional extension; PROV provides the predicate)
- `prov:wasAssociatedWith`: connect a task/action to the agent that executed it (optional extension; PROV provides the predicate)

p-plan (imported):
- `p-plan:hasInputVar`, `p-plan:hasOutputVar`: step-level I/O contracts (variables)

Key rule:
> Types and plans are reusable descriptions; intents, tasks, and actions are situation-specific instances with provenance.

## Walkthrough: intent -> plan -> tasks -> skills -> actions

### 1) IntentType (category of goal)

Use-case taxonomy concept:
- `core:intentType.membershipQualification`

This captures the shape of regulated outcomes: "you may succeed, but only after eligibility and review."

### 2) Intent (user goal instance)

Use-case goal instance:
- `core:intent.joinWgaMembership`

It is grounded with:
- `core:targetOrganization "Writers Guild of America"`
- `core:desiredStatus "Active member"`

### 3) TaskTypes (reusable categories of work)

In `discovery.ttl` we model task types that generalize across guilds and licensing boards:
- eligibility assessment
- evidence collection
- application submission
- status monitoring

These are what discovery and orchestration reason about before selecting a specific provider.

### 4) Skills (discoverable capabilities)

Skills are OASF skills (`oasf:Skill`) and are the discovery surface. In this use-case we ship example OASF skill individuals:
- `.../professional_membership/wga/eligibility_evaluate`
- `.../professional_membership/writer/credits_aggregate`
- `.../professional_membership/guild/application_submit`
- `.../professional_membership/guild/application_monitor`
- `.../professional_membership/writer/career_pathway_advice`

Each is also classified via `core:hasSkillType` (a `core:SkillType`), so we can group by capability family.

### 5) Plan + PlanSteps (p-plan)

Use-case plan:
- `core:plan.joinWgaMembership` (`prov:Plan` and `p-plan:Plan`)

Steps:
- `core:planStep.joinWga.1_assessEligibility`
- `core:planStep.joinWga.2_collectEvidence`
- `core:planStep.joinWga.3_submitApplication`
- `core:planStep.joinWga.4_monitorStatus`

Each step provides:
- ordering (`core:stepOrder`)
- task category (`core:stepTaskType`)
- preferred action primitive (`core:stepActionType`)

This is how we encode orchestration intent without hardcoding a single implementation.

### 6) Tasks + Actions (PROV-O)

Tasks (`core:Task`) are long-running activities you track and audit (retries, partial completion, human-in-the-loop).

Actions (`core:Action`) are atomic and tool-bound:
- HTTP GET eligibility rules
- API call credits search
- upload application packet
- poll application status

Both tasks and actions can:
- reference skills via `core:usesSkill`
- reference the goal via `prov:used core:intent.joinWgaMembership`

## Example data (ingested into GraphDB)

This use-case ships as concrete instances in `apps/ontology/ontology/usecase-professional-membership.ttl` (with shared discovery primitives in `apps/ontology/ontology/discovery.ttl`):
- `core:intent.joinWgaMembership`
- `core:plan.joinWgaMembership` + `core:planStep.joinWga.*`
- `core:task.*`
- `core:action.*`
- example OASF skill individuals under `https://core.io/ontology/oasf#skill/professional_membership/...`

Ingest:

```bash
pnpm --filter erc8004-indexer graphdb:ingest ontologies --reset
```

## SPARQL: list the WGA plan (steps + task types)

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?planTitle ?step ?order ?taskType ?actionType
WHERE {
  GRAPH <https://www.core.io/graph/ontology/core> {
    core:plan.joinWgaMembership a core:Plan ;
      dcterms:title ?planTitle ;
      core:hasStep ?step .
    OPTIONAL { ?step core:stepOrder ?order }
    OPTIONAL { ?step core:stepTaskType ?taskType }
    OPTIONAL { ?step core:stepActionType ?actionType }
  }
}
ORDER BY ?order
```

## SPARQL: list the WGA tasks and the skills they use

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX oasf: <https://core.io/ontology/oasf#>

SELECT ?task ?taskType ?skill ?skillKey ?skillCaption
WHERE {
  GRAPH <https://www.core.io/graph/ontology/core> {
    ?task a core:Task ;
      core:hasTaskType ?taskType ;
      core:usesSkill ?skill .
    OPTIONAL { ?skill oasf:key ?skillKey }
    OPTIONAL { ?skill oasf:caption ?skillCaption }
    FILTER(STRSTARTS(STR(?skill), "https://core.io/ontology/oasf#skill/professional_membership/"))
  }
}
ORDER BY ?taskType ?skillKey
```

## SPARQL: pull the whole WGA intent bundle (intent + plan + tasks + actions)

```sparql
PREFIX core: <https://core.io/ontology/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX oasf: <https://core.io/ontology/oasf#>

SELECT ?intent ?org ?status ?plan ?step ?order ?task ?taskType ?action ?actionTool ?skillKey
WHERE {
  GRAPH <https://www.core.io/graph/ontology/core> {
    BIND(core:intent.joinWgaMembership AS ?intent)
    ?intent core:targetOrganization ?org ;
            core:desiredStatus ?status .

    OPTIONAL {
      ?plan a core:Plan ;
        core:planForIntent ?intent ;
        dcterms:title ?planTitle ;
        core:hasStep ?step .
      OPTIONAL { ?step core:stepOrder ?order }
    }

    OPTIONAL {
      ?task a core:Task ;
        prov:used ?intent ;
        core:hasTaskType ?taskType ;
        core:usesSkill ?skill .
      OPTIONAL { ?skill oasf:key ?skillKey }
    }

    OPTIONAL {
      ?action a core:Action ;
        core:actionTool ?actionTool ;
        core:usesSkill ?skill .
    }
  }
}
ORDER BY ?order ?taskType ?skillKey
```

## Next modeling extensions (optional)

If/when we want more domain fidelity, we can add without changing the pattern:
- EvidenceBundle as a `prov:Entity` with `prov:generated` from evidence collection tasks
- Decision/Review as a `prov:Activity` associated with the external organization
- MembershipStatus as an entity with validity intervals (effective date, expiration)
- Branching in the plan (eligibility fail -> advisory strategy skill -> new plan)

