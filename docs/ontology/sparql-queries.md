## SPARQL Queries (current KG model)

These queries match the **current** model emitted by `apps/sync` and the ontologies under `apps/ontology/ontology`:

- Agents do **not** use `core:agentId`, `core:didIdentity`, or `core:didAccount`.
- The ERC‑8004 “agentId” is derived from the **ERC‑8004 DID string**: `did:8004:<chainId>:<id>`, stored as `core:protocolIdentifier` on the ERC‑8004 identity identifier.
- Owner / operator / wallet accounts hang off the **ERC‑8004 identity**.
- A2A/MCP endpoints come from **protocol descriptors** assembled from the ERC‑8004 identity descriptor (`core:assembledFromMetadata`).

### Prefixes

```sparql
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX ens: <https://agentictrust.io/ontology/ens#>
```

### One row per agent (UAID + DID8004 + identities + accounts)

```sparql
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX ens: <https://agentictrust.io/ontology/ens#>

SELECT
  ?agent
  (SAMPLE(?uaid) AS ?uaid)
  (SAMPLE(?did8004) AS ?did8004)
  (SAMPLE(?identity8004) AS ?identity8004)
  (SAMPLE(?ownerAccount) AS ?ownerAccount)
  (SAMPLE(?operatorAccount) AS ?operatorAccount)
  (SAMPLE(?walletAccount) AS ?walletAccount)
  (SAMPLE(?smartAccount) AS ?smartAccount)
  (SAMPLE(?didAccount) AS ?didAccount)
  (SAMPLE(?identityEns) AS ?identityEns)
  (SAMPLE(?didEns) AS ?didEns)
WHERE {
  ?agent a core:AIAgent .
  OPTIONAL { ?agent core:uaid ?uaid . }

  OPTIONAL {
    ?agent core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  core:hasIdentifier ?ident8004 .
    ?ident8004 core:protocolIdentifier ?did8004 .

    OPTIONAL { ?identity8004 erc8004:hasOwnerAccount ?ownerAccount . }
    OPTIONAL { ?identity8004 erc8004:hasOperatorAccount ?operatorAccount . }
    OPTIONAL { ?identity8004 erc8004:hasWalletAccount ?walletAccount . }
  }

  # didAccount: prefer SmartAgent smartAccount DID, else wallet account DID
  OPTIONAL {
    ?agent a erc8004:SmartAgent ;
           erc8004:hasSmartAccount ?smartAccount .
    ?smartAccount eth:hasAccountIdentifier ?saIdent .
    ?saIdent core:protocolIdentifier ?didAccount .
  }
  OPTIONAL {
    FILTER(!BOUND(?didAccount))
    ?agent core:hasIdentity ?identity8004b .
    ?identity8004b a erc8004:AgentIdentity8004 ;
                   erc8004:hasWalletAccount ?wa .
    ?wa eth:hasAccountIdentifier ?waIdent .
    ?waIdent core:protocolIdentifier ?didAccount .
  }

  OPTIONAL {
    ?agent core:hasIdentity ?identityEns .
    ?identityEns a ens:EnsIdentity ;
                 core:hasIdentifier ?ensIdent .
    ?ensIdent core:protocolIdentifier ?didEns .
  }
}
GROUP BY ?agent
ORDER BY DESC(
  xsd:integer(REPLACE(STR(SAMPLE(?did8004)), "^did:8004:[0-9]+:", ""))
)
LIMIT 500
```

### Agents with registration JSON + A2A endpoint + agent card JSON

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>

SELECT ?agent ?did8004 ?registrationJson ?a2aEndpoint ?agentCardJson
WHERE {
  ?agent a core:AIAgent ;
         core:hasIdentity ?identity8004 .
  ?identity8004 a erc8004:AgentIdentity8004 ;
                core:hasIdentifier ?ident8004 ;
                core:hasDescriptor ?desc8004 .
  ?ident8004 core:protocolIdentifier ?did8004 .

  OPTIONAL { ?desc8004 core:json ?registrationJson . }

  OPTIONAL {
    ?desc8004 core:assembledFromMetadata ?pdA2a .
    ?pdA2a a core:A2AProtocolDescriptor ;
           core:serviceUrl ?a2aEndpoint .
    OPTIONAL { ?pdA2a core:json ?agentCardJson . }
  }
}
ORDER BY ?agent
LIMIT 500
```

### Skills on protocol descriptor (A2A/MCP) for an agent

```sparql
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>

SELECT ?agent ?did8004 ?protocolDescriptor ?serviceUrl ?skill
WHERE {
  ?agent a core:AIAgent ;
         core:hasIdentity ?identity8004 .
  ?identity8004 a erc8004:AgentIdentity8004 ;
                core:hasIdentifier ?ident8004 ;
                core:hasDescriptor ?desc8004 .
  ?ident8004 core:protocolIdentifier ?did8004 .

  ?desc8004 core:assembledFromMetadata ?protocolDescriptor .
  ?protocolDescriptor a core:ProtocolDescriptor ;
                      core:serviceUrl ?serviceUrl ;
                      core:hasSkill ?skill .
}
ORDER BY ?agent ?serviceUrl ?skill
LIMIT 1000
```

