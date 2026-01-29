import { clearStatements, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, updateGraphdb, uploadTurtleToRepository } from './graphdb-http.js';

async function clearSectionStatements(args: {
  baseUrl: string;
  repository: string;
  auth: any;
  context: string;
  section: string;
}): Promise<void> {
  const { baseUrl, repository, auth, context, section } = args;

  // IMPORTANT: we use one named graph per chain for all synced data.
  // When running `sync:<section> --reset`, we should NOT wipe the whole chain graph,
  // otherwise we delete agents/accounts and break linkability (SmartAgent IRIs in particular).
  const sparqlUpdate = (() => {
    switch (section) {
      case 'validation-requests':
        return `
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${context}>
DELETE { ?s ?p ?o }
WHERE {
  {
    ?s a erc8004:ValidationRequestSituation .
    ?s ?p ?o .
  }
  UNION
  {
    ?s a erc8004:SubgraphIngestRecord ;
       erc8004:subgraphEntityKind "validation-requests" .
    ?s ?p ?o .
  }
}
`;
      case 'validation-responses':
        return `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${context}>
DELETE { ?s ?p ?o }
WHERE {
  {
    ?s a erc8004:ValidationResponse .
    ?s ?p ?o .
  }
  UNION
  {
    ?agent core:hasVerificationAssertion ?s .
    ?agent core:hasVerificationAssertion ?s .
  }
  UNION
  {
    ?s a erc8004:SubgraphIngestRecord ;
       erc8004:subgraphEntityKind "validation-responses" .
    ?s ?p ?o .
  }
}
`;
      case 'associations':
        return `
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX erc8092: <https://agentictrust.io/ontology/erc8092#>
WITH <${context}>
DELETE { ?s ?p ?o }
WHERE {
  {
    ?s a erc8092:AssociatedAccounts8092 .
    ?s ?p ?o .
  }
  UNION
  {
    ?acct erc8092:hasAssociatedAccounts ?s .
    ?acct erc8092:hasAssociatedAccounts ?s .
  }
  UNION
  {
    ?s a erc8004:SubgraphIngestRecord ;
       erc8004:subgraphEntityKind "associations" .
    ?s ?p ?o .
  }
}
`;
      case 'association-revocations':
        return `
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX erc8092: <https://agentictrust.io/ontology/erc8092#>
WITH <${context}>
DELETE { ?s ?p ?o }
WHERE {
  {
    ?s a erc8092:AssociatedAccountsRevocation8092 .
    ?s ?p ?o .
  }
  UNION
  {
    ?s a erc8004:SubgraphIngestRecord ;
       erc8004:subgraphEntityKind "association-revocations" .
    ?s ?p ?o .
  }
}
`;
      case 'feedbacks':
        return `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${context}>
DELETE { ?s ?p ?o }
WHERE {
  {
    ?s a erc8004:Feedback .
    ?s ?p ?o .
  }
  UNION
  {
    ?agent core:hasReputationAssertion ?s .
    ?agent core:hasReputationAssertion ?s .
  }
  UNION
  {
    ?s a erc8004:SubgraphIngestRecord ;
       erc8004:subgraphEntityKind "feedbacks" .
    ?s ?p ?o .
  }
}
`;
      default:
        return null;
    }
  })();

  if (!sparqlUpdate) {
    // Fallback: clear whole graph only when we don't know how to clear selectively.
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[sync] cleared subgraph context (fallback)', { context, section });
    return;
  }

  await updateGraphdb(baseUrl, repository, auth, sparqlUpdate);
  console.info('[sync] cleared subgraph section', { context, section });
}

export async function ingestSubgraphTurtleToGraphdb(opts: {
  chainId: number;
  section: string;
  turtle: string;
  resetContext?: boolean;
}): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const context = `https://www.agentictrust.io/graph/data/subgraph/${opts.chainId}`;
  if (opts.resetContext) {
    if (opts.section === 'agents') {
      await clearStatements(baseUrl, repository, auth, { context });
      console.info('[sync] cleared subgraph context', { context });
    } else {
      await clearSectionStatements({ baseUrl, repository, auth, context, section: opts.section });
    }
  }

  const rdfContent = opts.turtle;
  if (!rdfContent || rdfContent.trim().length === 0) {
    console.info('[sync] no RDF content generated', { section: opts.section, chainId: opts.chainId });
    return;
  }

  const { bytes } = await uploadTurtleToRepository(baseUrl, repository, auth, { turtle: rdfContent, context });
  console.info('[sync] uploaded subgraph data', {
    section: opts.section,
    chainId: opts.chainId,
    bytes,
    context,
  });

  // UAID backfill (always-on): older KB data may predate core:uaid on core:AIAgent.
  // Derivation rules:
  // - SmartAgent: UAID = did:ethr:<chainId>:<agentAccountAddress> (from hasAgentAccount / eth:accountAddress)
  // - AIAgent8004: UAID = did:8004:<chainId>:<agentId> (from identity protocolIdentifier)
  if (opts.section === 'agents') {
    const sparqlUpdate = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
INSERT {
  GRAPH <${context}> {
    ?agent core:uaid ?uaid .
  }
}
WHERE {
  GRAPH <${context}> {
    ?agent a core:AIAgent .
    FILTER(!EXISTS { ?agent core:uaid ?_existingUaid })

    OPTIONAL {
      ?agent a erc8004:SmartAgent ;
             erc8004:hasAgentAccount ?acct .
      OPTIONAL { ?acct eth:hasAccountIdentifier ?acctIdent . ?acctIdent core:protocolIdentifier ?didAccount . }
      OPTIONAL { ?acct eth:accountChainId ?cid . }
      OPTIONAL { ?acct eth:accountAddress ?addr . }

      # Prefer the canonical DID when present.
      OPTIONAL { FILTER(BOUND(?didAccount)) BIND(CONCAT("uaid:", ?didAccount) AS ?uaidSmartDid) }

      # Fallback: derive UAID from chainId + address.
      OPTIONAL {
        FILTER(!BOUND(?uaidSmartDid))
        FILTER(BOUND(?cid) && BOUND(?addr))
        BIND(CONCAT("uaid:did:ethr:", STR(?cid), ":", LCASE(STR(?addr))) AS ?uaidSmartDerived)
      }

      BIND(COALESCE(?uaidSmartDid, ?uaidSmartDerived) AS ?uaidSmart)
    }

    OPTIONAL {
      ?agent core:hasIdentity ?identity8004 .
      ?identity8004 a erc8004:AgentIdentity8004 ;
                    core:hasIdentifier ?ident8004 .
      ?ident8004 core:protocolIdentifier ?didIdentity .
      BIND(CONCAT("uaid:", ?didIdentity) AS ?uaid8004)
    }

    BIND(COALESCE(?uaidSmart, ?uaid8004) AS ?uaid)
    FILTER(BOUND(?uaid))
  }
}
`;
    await updateGraphdb(baseUrl, repository, auth, sparqlUpdate);
    console.info('[sync] uaid backfill complete', { chainId: opts.chainId, context });

    // Normalize any existing core:uaid literals that were previously stored as did:* (without uaid: prefix).
    const normalizeUpdate = `
PREFIX core: <https://agentictrust.io/ontology/core#>
DELETE {
  GRAPH <${context}> { ?agent core:uaid ?old . }
}
INSERT {
  GRAPH <${context}> { ?agent core:uaid ?new . }
}
WHERE {
  GRAPH <${context}> {
    ?agent a core:AIAgent ; core:uaid ?old .
    FILTER(!STRSTARTS(STR(?old), "uaid:"))
    BIND(CONCAT("uaid:", STR(?old)) AS ?new)
  }
}
`;
    await updateGraphdb(baseUrl, repository, auth, normalizeUpdate);
    console.info('[sync] uaid normalize complete', { chainId: opts.chainId, context });
  }
}
