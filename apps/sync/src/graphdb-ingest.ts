import { clearStatements, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, updateGraphdb, uploadTurtleToRepository } from './graphdb-http.js';

// Hard-coded defaults (no env-based tuning):
// - Larger chunk size reduces HTTP round trips (2-3MB tested as optimal for GraphDB).
// - No artificial inter-chunk delay (let GraphDB/network be the limiting factor).
// - Parallel uploads with concurrency limit to speed up ingestion.
const GRAPHDB_UPLOAD_CHUNK_BYTES = 2_500_000; // 2.5MB (increased from 1MB for fewer HTTP requests)
const GRAPHDB_UPLOAD_CHUNK_DELAY_MS = 0;
// IMPORTANT: Keep uploads sequential so GraphDB remains queryable during sync runs.
const GRAPHDB_UPLOAD_CONCURRENCY = 1;

function splitTurtleIntoChunks(turtle: string, maxBytes: number): string[] {
  const content = String(turtle || '');
  if (!content.trim()) return [];
  if (!maxBytes || maxBytes <= 0) return [content];

  const B = (globalThis as any).Buffer as any;
  const byteLen = (s: string) => (B ? B.byteLength(s, 'utf8') : s.length);

  if (byteLen(content) <= maxBytes) return [content];

  // Heuristic split:
  // - keep prefix block at top of every chunk
  // - split the remaining content on double-newlines (emitters already separate entities with blank lines)
  const lines = content.split('\n');
  let prefixEnd = -1;
  for (let i = 0; i < Math.min(lines.length, 200); i++) {
    if (lines[i].trim() === '') {
      prefixEnd = i;
      break;
    }
  }
  const prefixes = prefixEnd >= 0 ? lines.slice(0, prefixEnd + 1).join('\n') : '';
  const body = prefixEnd >= 0 ? lines.slice(prefixEnd + 1).join('\n') : content;
  const blocks = body
    .split(/\n\s*\n/g)
    .map((b) => b.trim())
    .filter(Boolean);

  const out: string[] = [];
  let cur = prefixes ? `${prefixes}\n` : '';
  let curBytes = byteLen(cur);

  for (const block of blocks) {
    const piece = `${block}\n\n`;
    const pieceBytes = byteLen(piece);
    if (curBytes > 0 && curBytes + pieceBytes > maxBytes) {
      out.push(cur);
      cur = prefixes ? `${prefixes}\n${piece}` : piece;
      curBytes = byteLen(cur);
      continue;
    }
    cur += piece;
    curBytes += pieceBytes;
  }

  if (cur.trim()) out.push(cur);
  return out;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
      case 'erc8122':
        return `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8122: <https://agentictrust.io/ontology/erc8122#>
WITH <${context}>
DELETE { ?agent core:hasIdentity ?id . }
WHERE  { ?agent core:hasIdentity ?id . ?id a erc8122:AgentIdentity8122 . } ;
WITH <${context}>
DELETE { ?id ?p ?o }
WHERE  { ?id a erc8122:AgentIdentity8122 . ?id ?p ?o . } ;
WITH <${context}>
DELETE { ?ident ?p ?o }
WHERE  { ?ident a erc8122:IdentityIdentifier8122 . ?ident ?p ?o . } ;
WITH <${context}>
DELETE { ?desc ?p ?o }
WHERE  { ?desc a erc8122:Descriptor8122Identity . ?desc ?p ?o . } ;
WITH <${context}>
DELETE { ?agent core:hasDescriptor ?ad . }
WHERE  { ?agent core:hasDescriptor ?ad . ?ad a core:AgentDescriptor . FILTER(CONTAINS(STR(?agent), "/id/agent/by-8122-did/")) } ;
WITH <${context}>
DELETE { ?ad ?p ?o }
WHERE  { ?ad a core:AgentDescriptor . ?ad ?p ?o . FILTER(CONTAINS(STR(?ad), "/id/agent-descriptor/")) } ;
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
  upload?: {
    chunkBytes?: number;
    concurrency?: number;
    chunkDelayMs?: number;
  };
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
  } else {
    const chunkBytes =
      Number.isFinite(Number(opts.upload?.chunkBytes)) && Number(opts.upload?.chunkBytes) > 0
        ? Math.trunc(Number(opts.upload?.chunkBytes))
        : GRAPHDB_UPLOAD_CHUNK_BYTES;
    const chunkDelayMs =
      Number.isFinite(Number(opts.upload?.chunkDelayMs)) && Number(opts.upload?.chunkDelayMs) >= 0
        ? Math.trunc(Number(opts.upload?.chunkDelayMs))
        : GRAPHDB_UPLOAD_CHUNK_DELAY_MS;
    const concurrency = GRAPHDB_UPLOAD_CONCURRENCY;
    const chunks = splitTurtleIntoChunks(rdfContent, chunkBytes);
    let totalBytes = 0;

    // Upload chunks in parallel with concurrency limit
    async function uploadChunkWithTiming(chunk: string, index: number): Promise<{ bytes: number; durationMs: number }> {
      const startTime = Date.now();
      try {
        const { bytes } = await uploadTurtleToRepository(baseUrl, repository, auth, { turtle: chunk, context });
        const durationMs = Date.now() - startTime;
        console.info('[sync] uploaded subgraph data chunk', {
          section: opts.section,
          chainId: opts.chainId,
          context,
          chunkIndex: index + 1,
          chunkCount: chunks.length,
          bytes,
          durationMs,
        });
        return { bytes, durationMs };
      } catch (err: any) {
        const durationMs = Date.now() - startTime;
        const errMsg = String(err?.message || err || 'unknown error');
        console.error('[sync] chunk upload failed', {
          section: opts.section,
          chainId: opts.chainId,
          context,
          chunkIndex: index + 1,
          chunkCount: chunks.length,
          durationMs,
          error: errMsg.slice(0, 200),
        });
        throw err;
      }
    }

    // Process chunks in batches with concurrency limit
    const results: Array<{ bytes: number; durationMs: number }> = [];
    for (let i = 0; i < chunks.length; i += concurrency) {
      const batch = chunks.slice(i, i + concurrency);
      const batchPromises = batch.map((chunk, batchIdx) => uploadChunkWithTiming(chunk, i + batchIdx));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      totalBytes += batchResults.reduce((sum, r) => sum + r.bytes, 0);
      if (chunkDelayMs > 0 && i + concurrency < chunks.length) {
        await sleep(chunkDelayMs);
      }
    }

    const totalDurationMs = results.reduce((sum, r) => sum + r.durationMs, 0);
    const avgDurationMs = results.length > 0 ? Math.round(totalDurationMs / results.length) : 0;
    const maxDurationMs = results.length > 0 ? Math.max(...results.map((r) => r.durationMs)) : 0;
    const minDurationMs = results.length > 0 ? Math.min(...results.map((r) => r.durationMs)) : 0;

    console.info('[sync] uploaded subgraph data', {
      section: opts.section,
      chainId: opts.chainId,
      bytes: totalBytes,
      context,
      chunks: chunks.length,
      chunkBytes,
      chunkDelayMs,
      concurrency,
      timing: {
        totalMs: totalDurationMs,
        avgMs: avgDurationMs,
        minMs: minDurationMs,
        maxMs: maxDurationMs,
      },
    });
  }

  // Precompute assertion summaries (materialized aggregates for fast kbAgents queries).
  // We recompute after assertion ingests so queries don't need COUNT() over assertions.
  if (opts.section === 'feedbacks' || opts.section === 'validation-responses') {
    const update = (() => {
      if (opts.section === 'feedbacks') {
        return `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${context}>
DELETE { ?agent erc8004:feedbackAssertionCount8004 ?o }
WHERE  { ?agent erc8004:feedbackAssertionCount8004 ?o } ;
WITH <${context}>
DELETE { ?summary core:feedbackAssertionCount ?oCnt }
WHERE  {
  ?agent core:hasFeedbackAssertionSummary ?summary .
  ?summary core:feedbackAssertionCount ?oCnt .
} ;
WITH <${context}>
INSERT {
  ?agent core:hasFeedbackAssertionSummary ?summary .
  ?summary a core:FeedbackAssertionSummary ;
           core:feedbackAssertionCount ?cnt .
}
WHERE  {
  SELECT
    ?agent
    (IRI(CONCAT(STR(?agent), "/feedback-assertion-summary")) AS ?summary)
    (COUNT(?fb) AS ?cnt)
  WHERE {
    ?agent a core:AIAgent ; core:hasReputationAssertion ?fb .
  }
  GROUP BY ?agent
} ;
`;
      }
      // validation-responses
      return `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${context}>
DELETE { ?agent erc8004:validationAssertionCount8004 ?o }
WHERE  { ?agent erc8004:validationAssertionCount8004 ?o } ;
WITH <${context}>
DELETE { ?summary core:validationAssertionCount ?oCnt }
WHERE  {
  ?agent core:hasValidationAssertionSummary ?summary .
  ?summary core:validationAssertionCount ?oCnt .
} ;
WITH <${context}>
INSERT {
  ?agent core:hasValidationAssertionSummary ?summary .
  ?summary a core:ValidationAssertionSummary ;
           core:validationAssertionCount ?cnt .
}
WHERE  {
  SELECT
    ?agent
    (IRI(CONCAT(STR(?agent), "/validation-assertion-summary")) AS ?summary)
    (COUNT(?vr) AS ?cnt)
  WHERE {
    ?agent a core:AIAgent ; core:hasVerificationAssertion ?vr .
  }
  GROUP BY ?agent
} ;
`;
    })();

    await updateGraphdb(baseUrl, repository, auth, update);
    console.info('[sync] assertion count materialization complete', { chainId: opts.chainId, context, section: opts.section });
  }

  // UAID backfill (always-on): older KB data may predate core:uaid on core:AIAgent.
  // Derivation rules:
  // - AISmartAgent: UAID = did:ethr:<chainId>:<agentAccountAddress> (from core:hasAgentAccount / eth:accountAddress)
  // - AIAgent (8004): UAID = did:8004:<chainId>:<agentId> (from identity protocolIdentifier)
  if (opts.section === 'agents') {
    // Default: skip these expensive GraphDB-wide maintenance updates.
    // - New ingests already emit core:uaid (with uaid: prefix) and erc8004:agentId8004 directly in Turtle.
    // - Normalization/backfill is only needed for legacy data and can be run separately if desired.
    console.info('[sync] skipping post-ingest agent maintenance updates (default)', { chainId: opts.chainId, context });
    return;

    console.info('[sync] uaid backfill starting', { chainId: opts.chainId, context });
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
      ?agent a core:AISmartAgent ;
             core:hasAgentAccount ?acct .
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
    console.info('[sync] uaid normalize starting', { chainId: opts.chainId, context });
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

    // Materialize numeric agentId for fast ORDER BY / filters.
    // - Agent node: erc8004:agentId8004 (legacy + paging/sorting convenience)
    // - Identity node: erc8004:agentId (explicit identity-level token id)
    console.info('[sync] agentId materialization starting', { chainId: opts.chainId, context });
    const agentIdUpdate = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
WITH <${context}>
INSERT {
  ?agent erc8004:agentId8004 ?agentId8004 .
}
WHERE {
  ?agent a core:AIAgent .
  FILTER(!EXISTS { ?agent erc8004:agentId8004 ?_existing })

  ?agent core:hasIdentity ?identity8004 .
  ?identity8004 a erc8004:AgentIdentity8004 ;
                erc8004:agentId ?agentId8004 .
}
;
WITH <${context}>
INSERT {
  ?identity8004 erc8004:agentId ?agentId8004 .
}
WHERE {
  ?identity8004 a erc8004:AgentIdentity8004 ;
                core:hasIdentifier ?ident8004 .
  FILTER(!EXISTS { ?identity8004 erc8004:agentId ?_existing })
  ?ident8004 core:protocolIdentifier ?did8004 .
  BIND(xsd:integer(REPLACE(STR(?did8004), "^did:8004:[0-9]+:", "")) AS ?agentId8004)
}
`;
    await updateGraphdb(baseUrl, repository, auth, agentIdUpdate);
    console.info('[sync] agentId materialization complete', { chainId: opts.chainId, context });

    // Materialize provenance timestamps on the agent node for fast ORDER BY in paging queries.
    // New ingests emit these directly in Turtle, but legacy graphs may be missing them.
    console.info('[sync] agent time materialization starting', { chainId: opts.chainId, context });
    const timeUpdate = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
WITH <${context}>
INSERT {
  ?agent core:createdAtTime ?createdAtTime .
  ?agent core:updatedAtTime ?updatedAtTime .
}
WHERE {
  ?agent a core:AIAgent .
  FILTER(!EXISTS { ?agent core:createdAtTime ?_c } || !EXISTS { ?agent core:updatedAtTime ?_u })

  OPTIONAL {
    ?agent core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 .
    OPTIONAL { ?identity8004 core:createdAtTime ?idCreated . }
    OPTIONAL { ?identity8004 core:updatedAtTime ?idUpdated . }
  }

  OPTIONAL {
    ?record a erc8004:SubgraphIngestRecord ;
            erc8004:subgraphEntityKind "agents" ;
            erc8004:recordsEntity ?agent ;
            erc8004:subgraphCursorValue ?cursorRaw .
  }
  OPTIONAL {
    ?record2 a erc8004:SubgraphIngestRecord ;
             erc8004:subgraphEntityKind "agents" ;
             erc8004:recordsEntity ?identity8004 ;
             erc8004:subgraphCursorValue ?cursorRaw2 .
  }

  BIND(COALESCE(?idCreated, xsd:integer(?cursorRaw), xsd:integer(?cursorRaw2)) AS ?createdAtTime)
  BIND(COALESCE(?idUpdated, ?createdAtTime) AS ?updatedAtTime)
  FILTER(BOUND(?createdAtTime))
  FILTER(BOUND(?updatedAtTime))
}
`;
    await updateGraphdb(baseUrl, repository, auth, timeUpdate);
    console.info('[sync] agent time materialization complete', { chainId: opts.chainId, context });
  }
}
