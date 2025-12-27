## RelationshipAssertion (assertion → account → agent)

This page documents the **RelationshipAssertion → RelationshipAccount → Agent** pattern used to represent ERC‑8092 “associated accounts” data in a graph-friendly way.

### Diagram

```mermaid
classDiagram
direction LR

class provAgent["prov:Agent"]

class AIAgent["agentictrust:AIAgent"]
class Relationship["agentictrust:Relationship"]
class RelationshipAssertion["agentictrust:RelationshipAssertion"]

class ERC8092Relationship["erc8092:ERC8092Relationship"]
class ERC8092RelationshipAssertion["erc8092:ERC8092RelationshipAssertion"]
class RelationshipAccount["erc8092:RelationshipAccount"]

ERC8092Relationship --|> Relationship
ERC8092RelationshipAssertion --|> RelationshipAssertion
AIAgent --|> provAgent

RelationshipAssertion --> Relationship : assertsRelationship (agentictrust)

ERC8092RelationshipAssertion --> provAgent : initiator (erc8092)
ERC8092RelationshipAssertion --> provAgent : approver (erc8092)
ERC8092RelationshipAssertion --> RelationshipAccount : initiatorAccount (erc8092)
ERC8092RelationshipAssertion --> RelationshipAccount : approverAccount (erc8092)

provAgent --> RelationshipAccount : ownsRelationshipAccount (erc8092)
```

### Core idea

- **Relationship assertion** (`erc8092:ERC8092RelationshipAssertion`) is the on-chain record.
- It names the participant **relationship accounts**:
  - `erc8092:initiatorAccount`
  - `erc8092:approverAccount`
- Those accounts are connected to the controlling identity via:
  - `erc8092:ownsRelationshipAccount` (domain `prov:Agent`, typically `agentictrust:AIAgent`)
- The assertion also **asserts** the underlying relationship instance:
  - `agentictrust:assertsRelationship` → `erc8092:ERC8092Relationship`

This gives you a clean query path:

- `RelationshipAssertion → RelationshipAccount ← ownsRelationshipAccount ← AIAgent`


