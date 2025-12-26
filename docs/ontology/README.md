# Ontology docs

This folder documents the ontologies used by Agent Explorer:

- `agentictrust.owl`: core trust model (DnS + PROV-O + P-PLAN) + common agent/intent/task/skill vocabulary
- `ERC8004.owl`: ERC-8004 registration + validation + feedback layers
- `ERC8092.owl`: ERC-8092 relationship assertions layer

## Diagrams

- [`core.md`](./core.md): core trust model (TrustDescription/TrustSituation/TrustAssertion) + relationships
- [`skills.md`](./skills.md): skills/tools ↔ intents ↔ task types ↔ invocations
- [`erc8004.md`](./erc8004.md): ERC-8004 registration + validation + feedback
- [`erc8092.md`](./erc8092.md): ERC-8092 relationships and accounts

## Files

Ontology sources live in `apps/badge-admin/public/ontology/`.

## Protégé note

If Protégé can’t resolve imports offline, use the XML catalog:

- `apps/badge-admin/public/ontology/catalog-v001.xml`


