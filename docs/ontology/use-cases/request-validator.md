# Request a validator (name/account/app) use-case

Outcome: **"A validator agent validates my claim (name/account/app) and returns a result."**

This use-case is different from “join a validator collection”:
- the **client** is requesting a validation *service*
- the **validator** is an agent that performs a specific validation skill
- the result is a **validation response** (accept/reject + evidence), not a membership decision

## Domain framing

Three common validation requests:
- **Name validation**: validate an agent name (e.g., ENS name, DNS name, registry name)
- **Account validation**: validate an agent account address (ownership/control)
- **App endpoint validation**: validate an application endpoint (did:web binding, TLS, reachability, etc.)

These are “regulated outcomes” in the sense that a third party (validator) must produce a result, but it’s a **shorter** workflow than guild/collection membership.

## Ontology model (high level)

- **IntentTypes** (taxonomy concepts):
  - `core:intentType.requestValidation.name`
  - `core:intentType.requestValidation.account`
  - `core:intentType.requestValidation.appEndpoint`
- **TaskTypes** (taxonomy concepts):
  - `core:taskType.validation.requestIntake`
  - `core:taskType.validation.performValidation`
  - `core:taskType.validation.issueResponse`
- **Intent** instances:
  - `core:intent.requestValidation.name`
  - `core:intent.requestValidation.account`
  - `core:intent.requestValidation.appEndpoint`
- **Plan**:
  - `core:plan.requestValidation.*`

Skills (OASF) are the discoverable surface. In our stack, validation skills are expected to be in the executable-style IDs (e.g. `governance_and_trust/...`) and are referenced as OASF skill IRIs.

## A2A alignment (client ↔ validator)

Client must:
- choose a validator agent whose **A2A skills** match the request
- send an intent payload with `intentType` and request parameters (what to validate)
- provide any needed evidence/authorization (signatures, endpoints, identifiers)

Validator agent must:
- accept the request (A2A interaction)
- execute the validation steps (tasks/actions)
- return a structured response (status + reasons + evidence)

## SPARQL: list request-validation intent types

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?intentType ?label
WHERE {
  GRAPH <https://www.agentictrust.io/graph/ontology/core> {
    ?intentType a core:IntentType ;
      rdfs:label ?label .
    FILTER(STRSTARTS(STR(?intentType), "https://agentictrust.io/ontology/core#intentType.requestValidation."))
  }
}
ORDER BY ?intentType
```

