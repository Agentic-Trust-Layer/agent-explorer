# Amazon Bedrock AgentCore mapped to AgenticTrust (deployment/endpoint-centric)

This page maps **Amazon Bedrock AgentCore** concepts to the AgenticTrust ontology, with emphasis on how AgentCore is centered on the **agent application as an endpoint-deployed runtime**.

Primary reference: [Amazon Bedrock AgentCore overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)

## AgentCore framing vs AgenticTrust framing

- **AgentCore focus**: build/deploy/operate agents *securely at scale* as an application runtime + gateway + identity + policy + observability (an “agent platform”).
- **AgenticTrust focus**: represent agents, identities, registries, deployments, skills, intents, situations, and trust evidence as a **knowledge graph** grounded in PROV-O/DnS patterns.

Key alignment:

- AgentCore’s “agent” is closest to `agentictrust:AgentDeployment` (the reachable executor).
- AgenticTrust insists on a distinct **discoverable Agent** (`agentictrust:AIAgent`) as the stable trust-graph anchor.

See also: [`agent-application.md`](./agent-application.md) (Agent vs Deployment and verification primitives).

## Service mapping table (AgentCore → AgenticTrust)

From the AgentCore overview page, the core services include Runtime, Memory, Gateway, Identity, Observability, Evaluations, Policy, and hosted tools (Browser / Code Interpreter) ([Amazon Bedrock AgentCore overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)).

| AgentCore service | AgentCore intent | AgenticTrust mapping (today) | Notes / gaps |
|---|---|---|---|
| Runtime | secure runtime for agents/tools, sessions, isolation | `agentictrust:AgentDeployment` + PROV Activities (`TaskExecution`, `SkillInvocation`) | session identity can be captured as Activity ids/fields; not modeled as a new Agent identity by default |
| Memory | short/long-term memory, shared stores | Model as `prov:Entity` “MemoryStore/MemorySnapshot” + Activities that `prov:used`/`prov:generated` | not a first-class class today; treat as Artifact/Descriptor-like entities if needed |
| Gateway | convert APIs/services to MCP-compatible tools, connect to MCP servers | `agentictrust:MCPProtocolDescriptor` + `AgentSkillClassification` + `JsonSchema` + `Endpoint` | Gateway creates “tool catalog” semantics; AgenticTrust represents tools as skills + schemas and keeps protocol descriptors as canonical sources |
| Identity | agent identity/access/authN management compatible w/ IdPs | `agentictrust:AgentRegistry` + `agentictrust:AgentIdentity` + `agentictrust:IdentifierDescriptor` | AgenticTrust is registry-plural and graph-native; AgentCore is service-centric |
| Observability | tracing/debug/monitoring agent workflows | PROV traces: `TaskExecution`, `SkillInvocation`, `AgentDescriptorFetch` (+ `prov:generatedAtTime`, etc.) | AgenticTrust can represent “why/what happened” as provenance graph |
| Evaluations | automated evaluation over sessions/traces | model eval results as `agentictrust:AttestedAssertion` about executions/deployments | evaluation-as-attestation is a clean fit; “quality score” is an asserted artifact |
| Policy | deterministic control, tool-call interception | represent policy as `TrustDescription` / Descriptor inputs + attest policy decisions as `AttestedAssertion` | enforcement happens outside the graph; the graph stores what policy was applied and what was allowed/denied |
| Browser / Code Interpreter | managed tool runtimes | represent as skills/tools available via descriptors; invocations as `SkillInvocation` | fits naturally as “tools” within the invocation trace |

## Deep dive 1: Agent identity (inbound identity + authentication)

AgentCore’s “Identity” service is about **secure agent identity, access, and authentication**, compatible with existing IdPs ([Amazon Bedrock AgentCore overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)).

AgenticTrust perspective:

- **Inbound identity** is modeled by separating:
  - the **executor** (`AgentDeployment`) you are calling, from
  - the **discoverable agent** (`AIAgent`) it implements, and
  - the **registry-scoped identity records** (`AgentIdentity`) asserted in some `AgentRegistry`.
- Verification outputs should be represented as **evidence objects** (AttestedAssertions), not as “the agent itself”.

### What AgentCore gives you vs what AgenticTrust adds

- AgentCore: identity enforcement primitives (authN/authZ).
- AgenticTrust: a portable way to **represent** identity assertions and their provenance across registries and ecosystems (onchain, DNS, HCS topics, enterprise registries).

## Deep dive 2: Semantic tool selection + “search available tools in a specific context”

AgentCore positions itself as an agent platform where agents “take actions across tools and data with the right permissions and governance” and includes a Gateway that exposes MCP-compatible tools ([Amazon Bedrock AgentCore overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)).

AgenticTrust splits “semantic tool selection” into 3 explicit graph layers:

1. **Tool inventory** (what tools exist, how to call them)
   - protocol-derived from A2A cards / MCP tool lists
   - represented via `ProtocolDescriptor` + `Endpoint` + `AgentSkillClassification` + `JsonSchema`
2. **Intent mapping** (why a tool/skill should be invoked)
   - `IntentType` + `targetsSkill` (intent → skill)
3. **Contextual execution trace** (what was invoked, under what situation/policy)
   - `TaskExecution` + `SkillInvocation` Activities with provenance links and timestamps

This is the ontology-friendly way to represent “semantic tool selection” without baking model-specific heuristics into the schema.

### Contrast (high-level)

- AgentCore: selection is primarily an operational runtime concern (choose tools at runtime).
- AgenticTrust: selection can be represented as:
  - **descriptions** (intent types target skills)
  - **facts** (what tools a deployment advertises)
  - **traces** (what was actually chosen and invoked)

## Deep dive 3: Task context + intent mapping

AgentCore emphasizes operating agents at scale and monitoring quality ([Amazon Bedrock AgentCore overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)).

AgenticTrust makes “task context” queryable by design:

- **IntentType**: “why” (plan-like schema)
- **TaskExecution**: “how/when” (runtime activity)
- **SkillInvocation**: “what tool was called” (runtime activity)
- **Situation**: “what is happening / what trust context applies” (epistemic object)

This maps directly to “context-aware tool selection”:

- context → a Situation/Descriptor environment
- intent → `IntentType`
- tool selection → invocations over skills that satisfy the intent

See: [`intent.md`](./intent.md).

## Deep dive 4: inbound authN and outbound authZ/authN to tools

AgentCore highlights “the right permissions and governance”, an Identity service, and a Policy capability that can intercept tool calls ([Amazon Bedrock AgentCore overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)).

AgenticTrust represents this as:

- **Inbound** (client → deployment):
  - represent the verifier’s conclusion as a VerificationTrustSituation + AttestedAssertion about the deployment/identity
  - keep raw evidence in `agentictrust:json` on the record nodes when needed
- **Outbound** (deployment → tool):
  - represent the tool-call as a `SkillInvocation` Activity
  - represent the authorization basis as:
    - delegation chain (`prov:actedOnBehalfOf`)
    - provider responsibility (`agentictrust:agentProvider`)
    - policy description (as a Descriptor/Plan-like entity)
  - represent allow/deny decisions as AttestedAssertions (auditable governance)

## Diagram: AgentCore endpoint-centric view vs AgenticTrust split

```mermaid
graph TB
  Client["Client / Caller"]
  Deploy["AgentCore Agent Runtime\n(agentictrust:AgentDeployment)"]
  Tool["Tool / MCP server / API\n(AgentSkillClassification + Endpoint)"]

  Agent["Discoverable Agent\n(agentictrust:AIAgent)"]
  Identity["Registry-scoped Identity\n(agentictrust:AgentIdentity)"]
  Registry["Registry\n(agentictrust:AgentRegistry)"]

  Client -->|inboundAuthN| Deploy
  Deploy -->|outboundToolAuth| Tool

  Deploy -->|agentictrust:deploymentOf| Agent
  Agent -->|agentictrust:hasIdentity| Identity
  Identity -->|agentictrust:identityRegistry| Registry
```

## Suggested alignments (documentation-first)

Based on AgentCore language, AgenticTrust is already well-positioned if we keep the following discipline:

- treat protocol tool catalogs (MCP/A2A) as **canonical sources** via `ProtocolDescriptor`
- represent selection and permissioning outcomes as **prov traces + attested assertions**
- keep identity registry pluralism (`AgentRegistry`) so enterprise/market registries can coexist with onchain/DNS/HCS patterns


