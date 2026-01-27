# Validator agent joins validation collection (membership) use-case

Outcome: **"This validator agent is added to the validation agents collection."**

This use-case is about the **validator agent** (or its operator) applying for membership in a curated validator collection.

## Domain framing

A “validation agents collection” is a curated set of agents allowed to perform validations (or recommended as validators). Membership typically requires:
- agent identity + ownership
- declared validation skills (what the agent can validate)
- endpoints (A2A / MCP) and operational metadata
- optional trust evidence (attestations, prior validations, policy compliance)
- approval process by maintainers (human or automated)

## Ontology model (high level)

- **IntentType**: `core:intentType.joinValidationAgentsCollection`
- **Intent**: `core:intent.joinValidationAgentsCollection`
- **TaskTypes**:
  - `core:taskType.validationCollection.checkRequirements`
  - `core:taskType.validationCollection.prepareEvidence`
  - `core:taskType.validationCollection.submitRequest`
  - `core:taskType.validationCollection.monitorStatus`
- **Plan**: `core:plan.joinValidationAgentsCollection`
- **Skills** (OASF):
  - `oasf:key` under `validation_collection/*` (eligibility, evidence, submit, monitor)

This example data is shipped in `apps/ontology/ontology/usecase-validator-collection.ttl` (with shared discovery primitives in `apps/ontology/ontology/discovery.ttl`) and ingested into GraphDB with `graphdb:ingest ontologies`.

## A2A alignment (terms)

- **A2A agent card** / registration `endpoints[].a2aSkills` -> the validator agent’s declared skills (mapped to `oasf:Skill` by `oasf:key`)
- **Membership application intent** (client payload to a collection maintainer agent) -> `core:Intent` with `core:hasIntentType`
- **Collection workflow** -> `core:Plan` / `core:PlanStep` (`prov:Plan`, `p-plan:Plan`, `p-plan:Step`)

## SPARQL: list the membership plan steps

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?planTitle ?step ?order ?taskType ?actionType
WHERE {
  GRAPH <https://www.agentictrust.io/graph/ontology/core> {
    core:plan.joinValidationAgentsCollection a core:Plan ;
      dcterms:title ?planTitle ;
      core:hasStep ?step .
    OPTIONAL { ?step core:stepOrder ?order }
    OPTIONAL { ?step core:stepTaskType ?taskType }
    OPTIONAL { ?step core:stepActionType ?actionType }
  }
}
ORDER BY ?order
```

