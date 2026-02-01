# ERC-8004 Validation (KB)

This page documents **ERC-8004 validation responses** as they exist in the Knowledge Base (GraphDB): the **GraphQL (KB v2)** query shapes, equivalent **SPARQL** patterns, and the key **ontology classes/properties** involved.

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

### Validation responses for a specific agent (count + items)

```graphql
query ValidationsForAgent($chainId: Int!, $agentId8004: Int!, $first: Int, $skip: Int) {
  kbAgents(where: { chainId: $chainId, agentId8004: $agentId8004 }, first: 1) {
    agents {
      uaid
      did8004
      agentName
      validationAssertions(first: $first, skip: $skip) {
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
{ "chainId": 11155111, "agentId8004": 277, "first": 200, "skip": 0 }
```

Notes:
- **`KbValidationResponse.json`** is the raw validation response payload as a string (parse it client-side for structured fields).
- **`KbValidationResponse.record.*`** is provenance from the ingest record.

### Filter agents with minimum validation count

```graphql
query AgentsWithMinValidations($chainId: Int, $min: Int!, $first: Int, $skip: Int) {
  kbAgents(
    where: {
      chainId: $chainId
      hasValidations: true
      minValidationAssertionCount: $min
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
      validationAssertions { total }
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
- `{agentId}` with the ERC-8004 agent id (e.g. `277`)

### Precomputed validation count on the agent node (fast)

```sparql
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>

SELECT ?count WHERE {
  GRAPH <https://www.agentictrust.io/graph/data/subgraph/{chainId}> {
    <https://www.agentictrust.io/id/agent/{chainId}/{agentId}>
      erc8004:validationAssertionCount8004 ?count .
  }
}
```

### Validation response items for an agent (with provenance)

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>

SELECT
  ?validation
  (SAMPLE(?json) AS ?json)
  (SAMPLE(?rawJson) AS ?rawJson)
  (SAMPLE(?txHash) AS ?txHash)
  (SAMPLE(?blockNumber) AS ?blockNumber)
  (SAMPLE(?timestamp) AS ?timestamp)
WHERE {
  GRAPH <https://www.agentictrust.io/graph/data/subgraph/{chainId}> {
    <https://www.agentictrust.io/id/agent/{chainId}/{agentId}>
      core:hasVerificationAssertion ?validation .

    OPTIONAL { ?validation core:json ?json }

    OPTIONAL {
      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;
              erc8004:recordsEntity ?validation .
      OPTIONAL { ?record erc8004:subgraphRawJson ?rawJson }
      OPTIONAL { ?record erc8004:subgraphTxHash ?txHash }
      OPTIONAL { ?record erc8004:subgraphBlockNumber ?blockNumber }
      OPTIONAL { ?record erc8004:subgraphTimestamp ?timestamp }
    }
  }
}
GROUP BY ?validation
ORDER BY DESC(STR(?timestamp)) DESC(STR(?validation))
LIMIT 200
OFFSET 0
```

### Validation count for an agent (fallback, computed)

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>

SELECT (COUNT(DISTINCT ?validation) AS ?count) WHERE {
  GRAPH <https://www.agentictrust.io/graph/data/subgraph/{chainId}> {
    <https://www.agentictrust.io/id/agent/{chainId}/{agentId}>
      core:hasVerificationAssertion ?validation .
  }
}
```

## Ontology mapping (classes + key properties)

### Core classes

- **`core:AIAgent`**: the agent node.
- **`erc8004:ValidationResponse`**: validation response record.
  - Subclass of **`core:VerificationTrustAssertion`**.
- **`erc8004:ValidationRequestSituation`**: validation request modeled as a situation.
  - Subclass of **`core:VerificationRequestSituation`**.
- **`erc8004:SubgraphIngestRecord`**: raw subgraph record linked to the typed entity.

### Key properties

- **Agent → validation assertion**:
  - **`core:hasVerificationAssertion`** (range: `core:VerificationTrustAssertion`)
    - Used in the KB to link agents to `erc8004:ValidationResponse`.
- **Materialized count (agent literal)**:
  - **`erc8004:validationAssertionCount8004`** (domain: `core:AIAgent`, range: `xsd:integer`)
- **Raw/provenance record links**:
  - **`erc8004:recordsEntity`** (SubgraphIngestRecord → the typed entity it represents)
  - **`erc8004:subgraphRawJson`**, **`erc8004:subgraphTxHash`**, **`erc8004:subgraphBlockNumber`**, **`erc8004:subgraphTimestamp`**

See also:
- [`verificationassertion.md`](./verificationassertion.md) (generic verification assertion hierarchy)
- [`erc8004.md`](./erc8004.md) (ERC-8004 overview)

