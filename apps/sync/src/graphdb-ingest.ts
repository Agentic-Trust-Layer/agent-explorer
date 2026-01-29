import { clearStatements, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, updateGraphdb, uploadTurtleToRepository } from './graphdb-http.js';

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
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[sync] cleared subgraph context', { context });
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
      OPTIONAL {
        ?acct eth:hasAccountIdentifier ?acctIdent .
        ?acctIdent core:protocolIdentifier ?didAccount .
      }
      OPTIONAL { ?acct eth:accountChainId ?cid . }
      OPTIONAL { ?acct eth:accountAddress ?addr . }
      BIND(
        COALESCE(
          ?didAccount,
          IF(BOUND(?cid) && BOUND(?addr), CONCAT("did:ethr:", STR(?cid), ":", LCASE(STR(?addr))), UNDEF)
        )
        AS ?uaidSmart
      )
    }

    OPTIONAL {
      ?agent core:hasIdentity ?identity8004 .
      ?identity8004 a erc8004:AgentIdentity8004 ;
                    core:hasIdentifier ?ident8004 .
      ?ident8004 core:protocolIdentifier ?didIdentity .
      BIND(?didIdentity AS ?uaid8004)
    }

    BIND(COALESCE(?uaidSmart, ?uaid8004) AS ?uaid)
    FILTER(BOUND(?uaid))
  }
}
`;
    await updateGraphdb(baseUrl, repository, auth, sparqlUpdate);
    console.info('[sync] uaid backfill complete', { chainId: opts.chainId, context });
  }
}
