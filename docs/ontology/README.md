# Ontology docs

This folder documents the ontologies used by Agent Explorer:

- `agentictrust-core.owl`: core trust model (DnS + PROV-O + P-PLAN) + common agent/intent/task/skill vocabulary
- `ERC8004.owl`: ERC-8004 registration + validation + feedback layers
- `ERC8092.owl`: ERC-8092 relationship assertions layer

## Visual diagrams (images)

Generated ontology-wide diagrams live in [`./images/`](./images/README.md):

- AgenticTrust core: `./images/agentictrust.png` (also `agentictrust.svg`)
- ERC8004: `./images/ERC8004.png` (also `ERC8004.svg`)
- ERC8092: `./images/ERC8092.png` (also `ERC8092.svg`)

## Documentation structure (smaller sections)

AgenticTrust core (`agentictrust-core.owl`)

- [`agentictrust-overview.md`](./agentictrust-overview.md): navigation + full diagram
- [`description.md`](./description.md): TrustDescription + metadata (DnS “Description”)
- [`situation.md`](./situation.md): TrustSituation + activities (DnS “Situation”)
- [`provenance.md`](./provenance.md): PROV-O grounding + how we use provenance patterns
- [`skills-intents-tasks.md`](./skills-intents-tasks.md): skills/tools ↔ intent types ↔ task types ↔ invocations
- [`discovery.md`](./discovery.md): how intent-driven discovery works (skills, connectivity, trust signals)
- [`trust-graph.md`](./trust-graph.md): trust building overlay + mapping to ERC-8004/8092 registries
- [`oasf.md`](./oasf.md): mapping to OASF skills/domains/modules (AGNTCY)

ERC ontologies

- [`erc8004.md`](./erc8004.md): ERC-8004 registration metadata + validation + feedback (with diagram)
- [`erc8092.md`](./erc8092.md): ERC-8092 relationships/assertions/accounts (with diagram)
- [`relationshipassertion.md`](./relationshipassertion.md): focused pattern: relationship assertion → account → controlling agent
- [`verificationassertion.md`](./verificationassertion.md): VerificationAssertion class hierarchy and property relationships
- [`reputationassertion.md`](./reputationassertion.md): ReputationAssertion class hierarchy and property relationships
- [`identifiers.md`](./identifiers.md): Agent-to-identifier relationships and all identifier types across ontologies
- [`sparql-queries.md`](./sparql-queries.md): SPARQL queries for querying agents and related data
- [`identifier-mapping.md`](./identifier-mapping.md): How Identifier maps to Web2 and Web3 identity systems

## Ontology source files

Ontology sources live in `apps/badge-admin/public/ontology/`.

## Protégé note

If Protégé can’t resolve imports offline, use the XML catalog:

- `apps/badge-admin/public/ontology/catalog-v001.xml`


