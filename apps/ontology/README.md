# Agentic Trust Ontology

Canonical ontology package for Agentic Trust. Turtle is the source of truth in
`ontology/core.ttl` (upper ontology). Domain modules are split into additional
`.ttl` files and composed via `owl:imports`.

IRIs are stable and independent of npm package versions.

## Orchestration model

Core includes a minimal intent/task/skill mapping model in the core namespace.

## Exports

- `@agentic-trust/ontology/core` -> Turtle (core)
- `@agentic-trust/ontology/discovery` -> Turtle (intent/task taxonomies + intent→task→skill mappings + generic action types)
- `@agentic-trust/ontology/trust` -> Turtle (DnS-inspired trust model: situations, assertions, delegation, relationships)
- `@agentic-trust/ontology/identifier` -> Turtle (identifiers, DID/VC primitives, routing metadata)
- `@agentic-trust/ontology/identity` -> Turtle (identities, registries, names)
- `@agentic-trust/ontology/descriptors` -> Turtle (descriptor model for agent/identity/protocol metadata)
- `@agentic-trust/ontology/usecase-professional-membership` -> Turtle (WGA example instances)
- `@agentic-trust/ontology/usecase-validator-collection` -> Turtle (validator joins validation collection example instances)
- `@agentic-trust/ontology/usecase-request-validation` -> Turtle (client requests a validator example instances)
- `@agentic-trust/ontology/eth` -> Turtle (eth, imports core)
- `@agentic-trust/ontology/erc8004` -> Turtle (erc8004, imports eth)
- `@agentic-trust/ontology/nanda` -> Turtle (nanda, imports core)
- `@agentic-trust/ontology/dns` -> Turtle (dns, imports core)
- `@agentic-trust/ontology/erc8092` -> Turtle (erc8092, imports eth + core trust)
- `@agentic-trust/ontology/hol` -> Turtle (hol, imports core)
- `@agentic-trust/ontology/oasf` -> Turtle (OASF skills/domains)
- `@agentic-trust/ontology/sparql` -> SPARQL queries/updates
- `@agentic-trust/ontology/shacl` -> SHACL shapes
