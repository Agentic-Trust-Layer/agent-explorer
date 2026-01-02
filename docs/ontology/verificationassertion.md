## VerificationTrustAssertion

This page documents the **VerificationTrustAssertion** class hierarchy and property relationships used to represent agent validation and verification claims.

### Class Hierarchy

```mermaid
classDiagram
direction TB

class provActivity["prov:Activity"]
class TrustAssertion["agentictrust:TrustAssertion"]
class VerificationAssertion["agentictrust:VerificationTrustAssertion"]
class ValidationResponse["erc8004:ValidationResponse"]

provActivity <|-- TrustAssertion
TrustAssertion <|-- VerificationAssertion
VerificationAssertion <|-- ValidationResponse
```

**Inheritance chain:**
- `prov:Entity` (base PROV-O class)
  - `agentictrust:TrustAssertion` (durable trust claim)
    - `agentictrust:VerificationTrustAssertion` (verification/validation claim)
      - `erc8004:ValidationResponse` (ERC-8004 validation response)

### Property Relationships

```mermaid
classDiagram
direction LR

class AIAgent["agentictrust:AIAgent"]
class VerificationAssertion["agentictrust:VerificationTrustAssertion"]
class ValidationResponse["erc8004:ValidationResponse"]
class ValidationRequest["agentictrust:VerificationRequestSituation"]
class TrustSituation["agentictrust:TrustSituation"]
class IntentCheck["agentictrust:IntentCheck"]
class provAgent["prov:Agent"]
class TrustAssertionAct["agentictrust:TrustAssertionAct"]

AIAgent --> VerificationAssertion : hasVerificationAssertion (agentictrust)
AIAgent --> ValidationResponse : hasValidation (erc8004)

ValidationResponse --> ValidationRequest : validationRespondsToRequest (erc8004)
ValidationResponse --> provAgent : validatorAgentForResponse (erc8004)
ValidationResponse --> IntentCheck : validationTagCheck (erc8004)

ValidationResponse --> TrustSituation : recordsSituation (agentictrust)
TrustAssertionAct --> TrustSituation : assertsSituation (agentictrust)
TrustAssertionAct --> ValidationResponse : generatedAssertionRecord (agentictrust)
```

### Core Properties

#### Agent → Assertion Links

- **`agentictrust:hasVerificationAssertion`** (domain: `prov:Agent`, range: `agentictrust:VerificationTrustAssertion`)
  - Links an agent to verification assertions about it or produced by it
  - Subproperty of `agentictrust:hasTrustAssertion`

- **`erc8004:hasValidation`** (domain: `agentictrust:AIAgent`, range: `erc8004:ValidationResponse`)
  - ERC-8004 specific property linking agents to validation responses
  - Subproperty of `agentictrust:hasVerificationAssertion`

#### Assertion → Request Links

- **`erc8004:validationRespondsToRequest`** (domain: `erc8004:ValidationResponse`, range: `agentictrust:VerificationRequestSituation`)
  - Links a validation response to the request it responds to

- **`agentictrust:recordsSituation`** (domain: `agentictrust:AssertionRecord`, range: `agentictrust:Situation`)
  - Links a durable assertion record (validation response) to the situation it is a record about

- **`agentictrust:assertsSituation`** (domain: `agentictrust:AssertionAct`, range: `agentictrust:Situation`)
  - Links an asserting act to the situation it asserts/validates

#### Validator Links

- **`erc8004:validatorAgentForResponse`** (domain: `erc8004:ValidationResponse`, range: `agentictrust:AIAgent`)
  - Optional link when validator address maps to a known AIAgent

#### Validation Check Links

- **`erc8004:validationTagCheck`** (domain: `erc8004:ValidationResponse`, range: `agentictrust:IntentCheck`)
  - Links validation response to the intent check/tag being validated

### Datatype Properties

**ValidationResponse properties:**
- `erc8004:validationChainIdForResponse` (xsd:integer) - Chain ID
- `erc8004:requestingAgentIdForResponse` (xsd:string) - Agent ID being validated
- `erc8004:validationResponseValue` (xsd:integer) - Validation score/value
- `erc8004:responseHash` (xsd:string) - Response hash

### Usage Pattern

**Query all verification assertions for an agent:**
```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?agent ?agentId ?verificationAssertion ?validationValue
WHERE {
  ?agent a agentictrust:AIAgent ;
    agentictrust:hasVerificationAssertion ?verificationAssertion .
  
  ?verificationAssertion a agentictrust:VerificationTrustAssertion .
  
  OPTIONAL {
    ?agent agentictrust:agentId ?agentId .
  }
  OPTIONAL {
    ?verificationAssertion erc8004:validationResponseValue ?validationValue .
  }
}
```

**Query validation responses with their requests:**
```sparql
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT ?validationResponse ?validationRequest ?validatorAgent
WHERE {
  ?validationResponse a erc8004:ValidationResponse ;
    erc8004:validationRespondsToRequest ?validationRequest .
  
  OPTIONAL {
    ?validationResponse erc8004:validatorAgentForResponse ?validatorAgent .
  }
}
```

### Related Concepts

- **TrustSituation**: Validation requests are `agentictrust:VerificationRequestSituation` (subclass of `agentictrust:RequestSituation`, and a `agentictrust:VerificationTrustSituation`)
- **TrustAssertion**: VerificationAssertion is a subclass of TrustAssertion
- **IntentCheck**: Validation responses link to intent checks via `validationTagCheck`
- See also: [ERC-8004 documentation](./erc8004.md), [Situation](./situation.md)

