# cheqd Trust Graph (Trust Registry → Trust Graph) and alignment to AgenticTrust

This page summarizes cheqd’s **Trust Graph** framing and maps it into the AgenticTrust ontology: **identity**, **permissions/delegation**, and **reputation** for AI agents.

## Key links (cheqd)

- [Why cheqd is Changing from Trust Registry to Trust Graph](https://cheqd.io/blog/why-cheqd-is-changing-from-trust-registry-to-trust-graph/)
- [2025 in Review: cheqd’s Year of Building Trust, Identity, and Verifiable AI](https://cheqd.io/blog/2025-in-review-cheqds-year-of-building-trust-identity-and-verifiable-ai/)
- [How Organisations Can Create Responsible AI Agents with cheqd](https://cheqd.io/blog/how-organisations-can-create-responsible-ai-agents-with-cheqd/)
- [Trust Registries for AI Agents (docs)](https://docs.cheqd.io/product/getting-started/ai-agents)
- [Introduction to Trust Registries](https://cheqd.io/blog/introduction-to-trust-registries/)
- Trust registries (product docs): [Trust Registries (Studio)](https://docs.cheqd.io/product/studio/trust-registries)

## What cheqd means by “Trust Graph”

cheqd’s “Trust Graph” positions trust as a **dynamic network** of cryptographically anchored relationships (not just a static list of trusted issuers/verifiers).

The core idea is: **trust changes over time** as credentials are issued, verified, updated, or revoked—so the system should represent trust as *relationships with context* rather than only a registry snapshot.

## Trust = Identity + Permissions + Reputation (AI-agent relevant)

- **Identity**
  - Each participant (human, org, AI agent) is represented with a DID anchored on cheqd’s ledger (verifiable, tamper-evident).
  - Identity is not just existence; it is **proof in a trustless environment** and enables attribution/auditability/accountability for autonomous systems.

- **Permissions**
  - Trust relationships include **authorizations**: what an entity is allowed to do, with scope/context constraints (delegation chains, organisational hierarchy).

- **Reputation**
  - Trust signals can accumulate based on historical verifications/interactions; reputation becomes a first-class signal attached to identities/relationships (not an afterthought).

## “Ontology extraction” (cheqd vocabulary → model primitives)

From cheqd’s public materials, the recurring primitives are:

- **DID** (identity anchor)
- **Verifiable Credential (VC)** (tamper-evident statement used to assert accreditations/roles/permissions)
- **Trust Registry / Trust Graph** (authority context / trust scope)
- **Trust chain / decentralized trust chain (DTC)** (hierarchical chain of accreditation / delegation from a root authority)
- **Accreditation / Attestation** (credential types / issuance roles)
- **Verification** (credential checking / validation events)
- **Delegation / authorization relationships** (permissions, scope, constraints)

AgenticTrust doesn’t currently import the W3C VC data model explicitly, but the *roles and relationships* map cleanly onto existing **Situations**, **AttestedAssertions**, and **Delegation** patterns.

## Mapping cheqd → AgenticTrust (recommended alignments)

| cheqd concept | AgenticTrust concept | Notes |
| --- | --- | --- |
| DID for participant (human/org/agent) | `agentictrust:DID` (identifier family) + `agentictrust:UniversalIdentifier` | Use Identifier/Identity split: DID is an Identifier; the registry-scoped representation is an `AgentIdentity`. |
| Trust Registry / Trust Graph scope | `agentictrust:AgentRegistry` (as `prov:Entity`) | A registry is a trust-scoped authority context (what identities/claims are admissible). |
| Trust chain (root → delegations/accreditations) | `prov:actedOnBehalfOf` chains + `agentictrust:DelegationSituation` / `DelegationTrustSituation` | Model the state/constraints as Situation; assert it via trust assertions. |
| Permission / authorization to act | `agentictrust:DelegationPermission`, `agentictrust:delegationGrantsPermission`, caveats | Matches “scope + context constraints” in trust relationships. |
| “Permissioned reputation/verification” | `agentictrust:wasAuthorizedByDelegation` | Links an attested reputation/verification assertion to the delegation assertion that granted authority. |
| Reputation signals | `agentictrust:ReputationTrustSituation` + `ReputationTrustAssertion` | Keep epistemic neutrality: assertions are evidence, not truth. |
| Verification / validation signals | `agentictrust:VerificationTrustSituation` + `VerificationTrustAssertion` | In ERC-8004: `erc8004:ValidationRequestSituation` and `erc8004:ValidationResponse`. |

## Gaps / potential extensions (if you want closer cheqd-VC parity later)

If you want AgenticTrust to represent cheqd’s model more directly (without losing PROV grounding), likely additions are:

- **VC artifacts**: `VerifiableCredential`, `CredentialSchema`, `CredentialIssuer`, `CredentialSubject`, `CredentialPresentation` as `prov:Entity`
- **Credential lifecycle activities**: issuance, presentation, verification as `prov:Activity`
- **DID-linked resources**: typed resources attached to a DID document (as `prov:Entity`)

These can still be kept epistemically neutral by treating credentials/presentations as **attested assertions** about identities.


