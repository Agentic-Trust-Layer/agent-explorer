# Agentic Trust Ontology

Canonical ontology package for Agentic Trust. Turtle is the source of truth in
`ontology/core.ttl`. Higher layers import lower layers via `owl:imports`.

IRIs are stable and independent of npm package versions.

## Orchestration model

Core includes a minimal intent/task/skill mapping model in the core namespace.

## Exports

- `@agentic-trust/ontology/core` -> Turtle (core)
- `@agentic-trust/ontology/eth` -> Turtle (eth, imports core)
- `@agentic-trust/ontology/erc8004` -> Turtle (erc8004, imports eth)
- `@agentic-trust/ontology/oasf` -> Turtle (OASF skills/domains)
- `@agentic-trust/ontology/jsonld` -> JSON-LD (core)
- `@agentic-trust/ontology/sparql` -> SPARQL queries/updates
- `@agentic-trust/ontology/shacl` -> SHACL shapes
