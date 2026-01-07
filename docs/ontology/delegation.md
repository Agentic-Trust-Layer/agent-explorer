# Delegation (TrustSituation) — permissions, caveats, and accountable grants

This page documents **delegation** as a first-class trust topic: who is authorized to act on behalf of whom, with what permissions and constraints.

Delegation is modeled as a **Situation** (epistemic object), and may be asserted/attested as a **TrustAssertion**.

## Core classes

- **DelegationSituation** (`agentictrust:DelegationSituation`): delegation state/constraints as a `Situation`
- **DelegationTrustSituation** (`agentictrust:DelegationTrustSituation`): the trust-qualified delegation situation (⊑ TrustSituation and ⊑ DelegationSituation)
- **DelegationTrustAssertion** (`agentictrust:DelegationTrustAssertion`): durable attested record about delegation (⊑ TrustAssertion ⊑ AttestedAssertion)
- **DelegationTrustAssertionAct** (`agentictrust:DelegationTrustAssertionAct`): accountable act generating the delegation trust assertion

## Permissions and caveats (MetaMask-style shape)

Many delegation frameworks represent delegation as:

- delegator → delegatee
- an optional “authority” identifier (linking to a parent grant / chain)
- a set of **caveats** (constraints), often expressed as *(enforcer, terms)*
- implied or explicit **permissions** (action/resource/scope)

AgenticTrust models these pieces explicitly:

- **DelegationPermission** (`agentictrust:DelegationPermission`): action/resource/scope granted
- **DelegationCaveat** (`agentictrust:DelegationCaveat`): constraint attached to delegation
- **CaveatEnforcer** (`agentictrust:CaveatEnforcer`): identifier for the evaluator/enforcer of caveat terms

## Diagram (conceptual)

```mermaid
graph TB
  DelegationSit["DelegationTrustSituation\n(agentictrust:DelegationTrustSituation)"]
  Delegator["Delegator\n(prov:Agent)"]
  Delegatee["Delegatee\n(prov:Agent)"]
  Perm["DelegationPermission\n(agentictrust:DelegationPermission)"]
  Caveat["DelegationCaveat\n(agentictrust:DelegationCaveat)"]
  Enforcer["CaveatEnforcer\n(agentictrust:CaveatEnforcer)"]

  Act["DelegationTrustAssertionAct\n(prov:Activity)"]
  Rec["DelegationTrustAssertion\n(prov:Entity)"]

  DelegationSit -->|delegationDelegator| Delegator
  DelegationSit -->|delegationDelegatee| Delegatee
  DelegationSit -->|delegationGrantsPermission| Perm
  DelegationSit -->|delegationHasCaveat| Caveat
  Caveat -->|caveatEnforcer| Enforcer

  Act -->|assertsSituation| DelegationSit
  Act -->|generatedAssertionRecord| Rec
  Rec -->|recordsSituation| DelegationSit
```

## Key properties (summary)

- `agentictrust:delegationDelegator` (DelegationSituation → prov:Agent)
- `agentictrust:delegationDelegatee` (DelegationSituation → prov:Agent)
- `agentictrust:delegationAuthorityValue` (DelegationSituation → string)
- `agentictrust:delegationExpiresAtTime` (DelegationSituation → xsd:dateTime)
- `agentictrust:delegationGrantsPermission` (DelegationSituation → DelegationPermission)
- `agentictrust:delegationHasCaveat` (DelegationSituation → DelegationCaveat)
- `agentictrust:permissionAction` / `permissionResource` / `permissionScopeJson`
- `agentictrust:caveatEnforcer` / `caveatTermsJson`

## SPARQL: list delegation grants (delegator → delegatee + permissions)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>

SELECT DISTINCT ?delegationSituation ?delegator ?delegatee ?action ?resource ?expires
WHERE {
  ?delegationSituation a agentictrust:DelegationTrustSituation ;
    agentictrust:delegationDelegator ?delegator ;
    agentictrust:delegationDelegatee ?delegatee .

  OPTIONAL {
    ?delegationSituation agentictrust:delegationGrantsPermission ?perm .
    OPTIONAL { ?perm agentictrust:permissionAction ?action . }
    OPTIONAL { ?perm agentictrust:permissionResource ?resource . }
  }

  OPTIONAL { ?delegationSituation agentictrust:delegationExpiresAtTime ?expires . }
}
ORDER BY ?delegationSituation
LIMIT 200
```


