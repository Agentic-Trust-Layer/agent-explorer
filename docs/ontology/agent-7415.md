# Agent 7415 (ERC-8004) — SPARQL cheatsheet

This page is intentionally narrow: it anchors on the ERC‑8004 DID string.

## Set your anchor

Update chainId if needed:

```sparql
VALUES ?did8004 { "did:8004:11155111:7415" }
```

## 1) Agent + UAID + ERC-8004 identity + accounts (one row)

```sparql
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>

SELECT
  ?agent
  (SAMPLE(?uaid) AS ?uaid)
  (SAMPLE(?identity8004) AS ?identity8004)
  (SAMPLE(?owner) AS ?owner)
  (SAMPLE(?operator) AS ?operator)
  (SAMPLE(?wallet) AS ?wallet)
  (SAMPLE(?smartAccount) AS ?smartAccount)
WHERE {
  VALUES ?did8004 { "did:8004:11155111:7415" }

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
           erc8004:hasAgentAccount ?smartAccount .
  }
}
GROUP BY ?agent
LIMIT 50
```

## 2) Registration JSON + A2A endpoint + agent card JSON

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>

SELECT ?agent ?identityDescriptor ?registrationJson ?a2aEndpoint ?agentCardJson
WHERE {
  VALUES ?did8004 { "did:8004:11155111:7415" }

  ?agent a core:AIAgent ;
         core:hasIdentity ?identity8004 .
  ?identity8004 a erc8004:AgentIdentity8004 ;
                core:hasIdentifier ?ident8004 ;
                core:hasDescriptor ?identityDescriptor .
  ?ident8004 core:protocolIdentifier ?did8004 .

  OPTIONAL { ?identityDescriptor core:json ?registrationJson . }
  OPTIONAL {
    ?identity8004 core:hasServiceEndpoint ?seA2a .
    ?seA2a a core:ServiceEndpoint ;
           core:serviceUrl ?a2aEndpoint ;
           core:hasProtocol ?pA2a .
    ?pA2a a core:A2AProtocol .
    OPTIONAL { ?pA2a core:json ?agentCardJson . }
  }
}
LIMIT 50
```

## 3) Skills on A2A/MCP protocol descriptors

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>

SELECT ?protocol ?serviceUrl ?skill
WHERE {
  VALUES ?did8004 { "did:8004:11155111:7415" }

  ?agent a core:AIAgent ;
         core:hasIdentity ?identity8004 .
  ?identity8004 a erc8004:AgentIdentity8004 ;
                core:hasIdentifier ?ident8004 ;
                core:hasDescriptor ?desc8004 .
  ?ident8004 core:protocolIdentifier ?did8004 .

  ?identity8004 core:hasServiceEndpoint ?serviceEndpoint .
  ?serviceEndpoint a core:ServiceEndpoint ;
                   core:serviceUrl ?serviceUrl ;
                   core:hasProtocol ?protocol .
  ?protocol a core:Protocol ;
            core:hasSkill ?skill .
}
ORDER BY ?serviceUrl ?skill
LIMIT 500
```

