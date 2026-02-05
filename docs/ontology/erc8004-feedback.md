# ERC-8004 Feedback (KB)

This page documents **ERC-8004 feedback** as it exists in the Knowledge Base (GraphDB): the **GraphQL (KB v2)** query shapes, equivalent **SPARQL** patterns, and the key **ontology classes/properties** involved.

## Endpoints

- **GraphQL (KB v2)**: `http://localhost:4000/graphql-kb` (dev Yoga server)
  - In production, use your deployment base URL with the `/graphql-kb` path.
- **SPARQL (GraphDB)**: `POST ${GRAPHDB_BASE_URL}/repositories/${GRAPHDB_REPOSITORY}`
  - Headers:
    - `Content-Type: application/sparql-query`
    - `Accept: application/sparql-results+json`

## Identifiers used in queries

- **Per-chain named graph**: `https://www.agentictrust.io/graph/data/subgraph/{chainId}`
- **Agent IRI (ERC-8004 agentId)**: `https://www.agentictrust.io/id/agent/{chainId}/{agentId}`
- **ERC-8004 DID**: `did:8004:{chainId}:{agentId}`

## GraphQL queries (KB v2)

### Feedback for a specific agent (count + items)

```graphql
query FeedbackForAgent($chainId: Int!, $agentId8004: Int!, $first: Int, $skip: Int) {
  kbAgents(where: { chainId: $chainId, agentId8004: $agentId8004 }, first: 1) {
    agents {
      uaid
      did8004
      agentName
      reviewAssertions(first: $first, skip: $skip) {
        total
        items {
          iri
          agentDid8004
          json
          record {
            txHash
            blockNumber
            timestamp
            rawJson
          }
        }
      }
    }
  }
}
```

Example variables:

```json
{ "chainId": 11155111, "agentId8004": 614, "first": 200, "skip": 0 }
```

Notes:
- **`KbFeedback.json`** is the raw feedback payload as a string (parse it client-side for structured fields).
- **`KbFeedback.record.*`** is provenance from the ingest record.

### Filter agents with minimum feedback count

```graphql
query AgentsWithMinFeedback($chainId: Int, $min: Int!, $first: Int, $skip: Int) {
  kbAgents(
    where: {
      chainId: $chainId
      hasReviews: true
      minReviewAssertionCount: $min
    }
    first: $first
    skip: $skip
    orderBy: agentId8004
    orderDirection: DESC
  ) {
    total
    hasMore
    agents {
      uaid
      agentId8004
      agentName
      reviewAssertions { total }
    }
  }
}
```

Example variables:

```json
{ "chainId": 11155111, "min": 1, "first": 50, "skip": 0 }
```

## SPARQL queries

Replace:
- `{chainId}` with your chain id (e.g. `11155111`)
- `{agentId}` with the ERC-8004 agent id (e.g. `614`)

### Precomputed feedback count (fast)

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT ?count WHERE {
  GRAPH <https://www.agentictrust.io/graph/data/subgraph/{chainId}> {
    <https://www.agentictrust.io/id/agent/{chainId}/{agentId}>
      core:hasFeedbackAssertionSummary ?summary .
    ?summary core:feedbackAssertionCount ?count .
  }
}
```

### Feedback items for an agent (with provenance)

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>

SELECT
  ?feedback
  (SAMPLE(?json) AS ?json)
  (SAMPLE(?rawJson) AS ?rawJson)
  (SAMPLE(?txHash) AS ?txHash)
  (SAMPLE(?blockNumber) AS ?blockNumber)
  (SAMPLE(?timestamp) AS ?timestamp)
WHERE {
  GRAPH <https://www.agentictrust.io/graph/data/subgraph/{chainId}> {
    <https://www.agentictrust.io/id/agent/{chainId}/{agentId}>
      core:hasReputationAssertion ?feedback .

    OPTIONAL { ?feedback core:json ?json }

    OPTIONAL {
      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;
              erc8004:recordsEntity ?feedback .
      OPTIONAL { ?record erc8004:subgraphRawJson ?rawJson }
      OPTIONAL { ?record erc8004:subgraphTxHash ?txHash }
      OPTIONAL { ?record erc8004:subgraphBlockNumber ?blockNumber }
      OPTIONAL { ?record erc8004:subgraphTimestamp ?timestamp }
    }
  }
}
GROUP BY ?feedback
ORDER BY DESC(STR(?timestamp)) DESC(STR(?feedback))
LIMIT 200
OFFSET 0
```

### Feedback count for an agent (fallback, computed)

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT (COUNT(DISTINCT ?feedback) AS ?count) WHERE {
  GRAPH <https://www.agentictrust.io/graph/data/subgraph/{chainId}> {
    <https://www.agentictrust.io/id/agent/{chainId}/{agentId}>
      core:hasReputationAssertion ?feedback .
  }
}
```

## Ontology mapping (classes + key properties)

### Core classes

- **`core:AIAgent`**: the agent node.
- **`erc8004:Feedback`**: feedback record.
  - Subclass of **`core:ReputationTrustAssertion`**.
- **`erc8004:SubgraphIngestRecord`**: raw subgraph record linked to the typed entity.

### Key properties

- **Agent → feedback assertion**:
  - **`core:hasReputationAssertion`** (range: `core:ReputationTrustAssertion`)
    - Used in the KB to link agents to `erc8004:Feedback`.
- **Materialized summary (agent → summary entity)**:
  - **`core:hasFeedbackAssertionSummary`** (domain: `core:AIAgent`, range: `core:FeedbackAssertionSummary`)
  - **`core:feedbackAssertionCount`** (domain: `core:FeedbackAssertionSummary`, range: `xsd:integer`)
- **Raw/provenance record links**:
  - **`erc8004:recordsEntity`** (SubgraphIngestRecord → the typed entity it represents)
  - **`erc8004:subgraphRawJson`**, **`erc8004:subgraphTxHash`**, **`erc8004:subgraphBlockNumber`**, **`erc8004:subgraphTimestamp`**

See also:
- [`reputationassertion.md`](./reputationassertion.md) (generic reputation assertion hierarchy)
- [`erc8004.md`](./erc8004.md) (ERC-8004 overview)

