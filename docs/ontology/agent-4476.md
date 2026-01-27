# Agent 4476 (ERC-8004) — SPARQL cheatsheet

This page is intentionally narrow: it anchors on the ERC‑8004 DID string.

## Set your anchor

Update chainId if needed:

```sparql
VALUES ?did8004 { "did:8004:11155111:4476" }
```

## 1) Agent + UAID + identities + accounts (one row)

```sparql
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX ens: <https://agentictrust.io/ontology/ens#>

SELECT
  ?agent
  (SAMPLE(?uaid) AS ?uaid)
  (SAMPLE(?identity8004) AS ?identity8004)
  (SAMPLE(?owner) AS ?owner)
  (SAMPLE(?operator) AS ?operator)
  (SAMPLE(?wallet) AS ?wallet)
  (SAMPLE(?smartAccount) AS ?smartAccount)
  (SAMPLE(?identityEns) AS ?identityEns)
WHERE {
  VALUES ?did8004 { "did:8004:11155111:4476" }

  ?agent a core:AIAgent ;
         core:hasIdentity ?identity8004 .
  OPTIONAL { ?agent core:uaid ?uaid . }

  ?identity8004 a erc8004:AgentIdentity8004 ;
                core:hasIdentifier ?ident8004 .
  ?ident8004 core:protocolIdentifier ?did8004 .

  OPTIONAL { ?identity8004 erc8004:hasOwnerAccount ?owner . }
  OPTIONAL { ?identity8004 erc8004:hasOperatorAccount ?operator . }
  OPTIONAL { ?identity8004 erc8004:hasWalletAccount ?wallet . }

  OPTIONAL {
    ?agent a erc8004:SmartAgent ;
           erc8004:hasSmartAccount ?smartAccount .
  }

  OPTIONAL {
    ?agent core:hasIdentity ?identityEns .
    ?identityEns a ens:EnsIdentity .
  }
}
GROUP BY ?agent
LIMIT 50
```

## 2) Registration JSON + ENS identity + A2A endpoint + agent card JSON

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX ens: <https://agentictrust.io/ontology/ens#>

SELECT ?agent ?identityDescriptor ?registrationJson ?ensDid ?a2aEndpoint ?agentCardJson
WHERE {
  VALUES ?did8004 { "did:8004:11155111:4476" }

  ?agent a core:AIAgent ;
         core:hasIdentity ?identity8004 .
  ?identity8004 a erc8004:AgentIdentity8004 ;
                core:hasIdentifier ?ident8004 ;
                core:hasDescriptor ?identityDescriptor .
  ?ident8004 core:protocolIdentifier ?did8004 .

  OPTIONAL { ?identityDescriptor core:json ?registrationJson . }

  OPTIONAL {
    ?agent core:hasIdentity ?identityEns .
    ?identityEns a ens:EnsIdentity ;
                 core:hasIdentifier ?ensIdent .
    ?ensIdent core:protocolIdentifier ?ensDid .
  }

  OPTIONAL {
    ?identityDescriptor core:assembledFromMetadata ?pdA2a .
    ?pdA2a a core:A2AProtocolDescriptor ;
           core:serviceUrl ?a2aEndpoint .
    OPTIONAL { ?pdA2a core:json ?agentCardJson . }
  }
}
LIMIT 50
```

