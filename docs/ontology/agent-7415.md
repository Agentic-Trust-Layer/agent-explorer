# Agent 7415: A2A endpoint + Skills/Domains (OASF) + Intent SPARQL

This page is intentionally **narrow**: queries return small result sets by anchoring on **agentId=7415** and (once known) **chainId**.

## Prefixes

```sparql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
```

## 0) Resolve the agent anchor (account-anchored AIAgent) + optional ERC-8004 identity

Run this first. If it returns more than one row, pick the `?chainId` you care about and use it in later queries.

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT DISTINCT ?agent ?chainId ?accountAddress ?didAccount ?identity ?didIdentity
WHERE {
  ?agent a agentictrust:AIAgent, agentictrustEth:Account ;
         agentictrust:agentId "7415" ;
         agentictrustEth:accountChainId ?chainId ;
         agentictrustEth:accountAddress ?accountAddress .
  OPTIONAL { ?agent agentictrust:didAccount ?didAccount . }
  OPTIONAL { ?agent agentictrust:hasIdentity ?identity . }
  OPTIONAL { ?agent agentictrust:didIdentity ?didIdentity . }
}
ORDER BY ?chainId ?accountAddress
LIMIT 10
```

## 1) A2A endpoint (registration endpoint + protocol descriptor service URL)

This collects A2A endpoints from:
- ERC-8004 registration endpoints (`agentictrust:endpointUrl` + `endpointType=a2a`)
- A2A protocol descriptor (`agentictrust:serviceUrl`)

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT DISTINCT
  ?agent ?chainId
  ?registrationEndpointUrl
  ?protocolServiceUrl
  ?protocolVersion
  ?preferredTransport
WHERE {
  VALUES (?agentId ?chainId) { ("7415" 11155111) } # change chainId if needed

  ?agent a agentictrust:AIAgent, agentictrustEth:Account ;
         agentictrust:agentId ?agentId ;
         agentictrustEth:accountChainId ?chainId ;
         agentictrust:hasIdentity ?identity .

  ?identity agentictrust:hasDescriptor ?reg .

  # Registration endpoint URL (endpointType=a2a)
  OPTIONAL {
    ?reg agentictrust:hasEndpoint ?ep .
    ?ep agentictrust:endpointType <https://www.agentictrust.io/ontology/agentictrust-core/endpointType/a2a> ;
        agentictrust:endpointUrl ?registrationEndpointUrl .
  }

  # Protocol descriptor (from agent card)
  OPTIONAL {
    ?reg agentictrust:assembledFromMetadata ?pd .
    ?pd a agentictrust:A2AProtocolDescriptor .
    OPTIONAL { ?pd agentictrust:serviceUrl ?protocolServiceUrl . }
    OPTIONAL { ?pd agentictrust:protocolVersion ?protocolVersion . }
    OPTIONAL { ?pd agentictrust:preferredTransport ?preferredTransport . }
  }
}
LIMIT 20
```

## 2) OASF skills & domains advertised for A2A (agent registration)

This pulls normalized ids from the registration descriptor and joins to OASF nodes (if loaded).

Note: endpoint payloads often provide `endpoints[].a2aSkills` / `endpoints[].a2aDomains`. The RDF export treats these as OASF ids and emits them as `agentictrust:oasfSkillId` / `agentictrust:oasfDomainId`.

If you see an “empty row” in results, that’s usually because both Skills and Domains are in `OPTIONAL { ... }` blocks; SPARQL still returns a solution for the bound `?agent/?identity/?reg` but leaves `?skillId/?domainId` unbound. Use the `FILTER(BOUND(...))` below to suppress that.

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT
  ?skillId ?skillLabel
  ?domainId ?domainLabel
WHERE {
  VALUES (?agentId ?chainId) { ("7415" 11155111) } # change chainId if needed

  ?agent a agentictrust:AIAgent, agentictrustEth:Account ;
         agentictrust:agentId ?agentId ;
         agentictrustEth:accountChainId ?chainId ;
         agentictrust:hasIdentity ?identity .

  ?identity agentictrust:hasDescriptor ?reg .

  # Skills (OASF)
  OPTIONAL {
    ?reg agentictrust:hasSkill ?agentSkill .
    ?agentSkill agentictrust:hasSkillClassification ?skillNode .
    OPTIONAL { ?skillNode agentictrust:oasfSkillId ?skillId . }
    OPTIONAL { ?skillNode rdfs:label ?skillLabel . }
  }

  # Domains (OASF)
  OPTIONAL {
    ?reg agentictrust:hasDomain ?agentDomain .
    ?agentDomain agentictrust:hasDomainClassification ?domainNode .
    OPTIONAL { ?domainNode agentictrust:oasfDomainId ?domainId . }
    OPTIONAL { ?domainNode rdfs:label ?domainLabel . }
  }

  FILTER(BOUND(?skillId) || BOUND(?domainId))
}
ORDER BY ?skillId ?domainId
LIMIT 200
```

## 3) Intent mapping from OASF skills (ontology-level targetsSkill)

If `IntentType` mappings are present in your repo, this returns **only the intents that target skills advertised by agent 7415**.

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT DISTINCT
  ?intentType
  ?intentTypeValue
  ?skillId
WHERE {
  VALUES (?agentId ?chainId) { ("7415" 11155111) } # change chainId if needed

  ?agent a agentictrust:AIAgent, agentictrustEth:Account ;
         agentictrust:agentId ?agentId ;
         agentictrustEth:accountChainId ?chainId ;
         agentictrust:hasIdentity ?identity .

  ?identity agentictrust:hasDescriptor ?reg .

  # OASF skills the agent advertises
  ?reg agentictrust:hasSkill ?agentSkill .
  ?agentSkill agentictrust:hasSkillClassification ?skillNode .
  ?skillNode agentictrust:oasfSkillId ?skillId .

  # IntentTypes that target those skills
  ?intentType a agentictrust:IntentType ;
              agentictrust:targetsSkill ?skillNode .
  OPTIONAL { ?intentType agentictrust:intentTypeValue ?intentTypeValue . }
}
ORDER BY ?intentType
LIMIT 200
```

## 4) Intents actually satisfied in trust situations about this agent (via agent OR identity)

This shows what intent types appear in situations for agent 7415 without blowing up into record-level detail.

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>

SELECT DISTINCT ?intentType (COUNT(DISTINCT ?situation) AS ?situationCount)
WHERE {
  VALUES (?agentId ?chainId) { ("7415" 11155111) } # change chainId if needed

  ?agent a agentictrust:AIAgent, agentictrustEth:Account ;
         agentictrust:agentId ?agentId ;
         agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent agentictrust:hasIdentity ?identity . }

  ?situation agentictrust:satisfiesIntent ?intentType .
  FILTER(
    EXISTS { ?situation agentictrust:isAboutAgent ?agent } ||
    EXISTS { ?situation agentictrust:aboutSubject ?identity }
  )
}
GROUP BY ?intentType
ORDER BY DESC(?situationCount)
LIMIT 50
```

## 5) Delegation authorization provenance (assertions authorized by delegation) — scoped to agent 7415

This finds reputation/verification assertions that were authorized by a delegation assertion (via `agentictrust:wasAuthorizedByDelegation`) and scopes results to agent 7415 via the account-anchored agent and optional ERC-8004 identity joins.

```sparql
PREFIX agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#>
PREFIX agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#>
PREFIX erc8004: <https://www.agentictrust.io/ontology/ERC8004#>

SELECT DISTINCT ?assertion ?assertionType ?delegation
WHERE {
  VALUES (?agentId ?chainId) { ("7415" 11155111) } # change chainId if needed

  ?agent a agentictrust:AIAgent, agentictrustEth:Account ;
         agentictrust:agentId ?agentId ;
         agentictrustEth:accountChainId ?chainId .
  OPTIONAL { ?agent agentictrust:hasIdentity ?identity . }

  ?assertion agentictrust:wasAuthorizedByDelegation ?delegation .
  ?delegation a agentictrust:DelegationTrustAssertion .
  OPTIONAL { ?assertion a ?assertionType . }

  # Scope: keep only assertions about this agent (directly, via ERC-8004 links, or via aboutSubject identity)
  FILTER(
    EXISTS { ?agent erc8004:hasFeedback|erc8004:hasValidation ?assertion } ||
    EXISTS { ?identity erc8004:hasFeedback|erc8004:hasValidation ?assertion } ||
    EXISTS { ?assertion agentictrust:aboutSubject ?identity }
  )
}
ORDER BY ?assertion
LIMIT 200
```


