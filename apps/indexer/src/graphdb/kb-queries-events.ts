import { getGraphdbConfigFromEnv, queryGraphdbWithContext, type GraphdbQueryContext } from './graphdb-http.js';
import { chainContext, parseUaidToResolvedAgentRef } from './kb-uaid.js';

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function asString(b?: any): string | null {
  const v = b?.value;
  return typeof v === 'string' && v.trim() ? v : null;
}

function asNumber(b?: any): number | null {
  const s = asString(b);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

async function runGraphdbQuery(sparql: string, ctx?: GraphdbQueryContext | null, label?: string): Promise<any[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const result = await queryGraphdbWithContext(baseUrl, repository, auth, sparql, ctx ? { ...ctx, label: label ?? ctx.label } : ctx);
  return Array.isArray(result?.results?.bindings) ? result.results.bindings : [];
}

export type KbSubgraphRecord = {
  rawJson: string | null;
  txHash: string | null;
  blockNumber: number | null;
  timestamp: number | null;
};

export type KbReviewResponseRow = {
  iri: string;
  agentDid8004: string | null;
  json: string | null;
  record: KbSubgraphRecord | null;
};

export type KbConnection<T> = { total: number; items: T[] };

export async function kbReviewItemsForAgentQuery(
  args: {
    uaid: string;
    first?: number | null;
    skip?: number | null;
  },
  graphdbCtx?: GraphdbQueryContext | null,
): Promise<KbReviewResponseRow[]> {
  const first = clampInt(args.first, 1, 2000, 25);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);

  const ref = parseUaidToResolvedAgentRef(args.uaid);
  const ctx = chainContext(ref.chainId);
  const agentIri = ref.agentIri;
  const did8004 = ref.did8004;

  const sparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT',
    '  ?feedback',
    '  (SAMPLE(?json) AS ?json)',
    '  (SAMPLE(?rawJson) AS ?rawJson)',
    '  (SAMPLE(?txHash) AS ?txHash)',
    '  (SAMPLE(?blockNumber) AS ?blockNumber)',
    '  (SAMPLE(?timestamp) AS ?timestamp)',
    'WHERE {',
    `  GRAPH <${ctx}> {`,
    `    <${agentIri}> core:hasReputationAssertion ?feedback .`,
    '    OPTIONAL { ?feedback core:json ?json }',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;',
    '              erc8004:recordsEntity ?feedback .',
    '      OPTIONAL { ?record erc8004:subgraphRawJson ?rawJson }',
    '      OPTIONAL { ?record erc8004:subgraphTxHash ?txHash }',
    '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?blockNumber }',
    '      OPTIONAL { ?record erc8004:subgraphTimestamp ?timestamp }',
    '    }',
    '  }',
    '}',
    'GROUP BY ?feedback',
    'ORDER BY DESC(STR(?timestamp)) DESC(STR(?feedback))',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const rows = await runGraphdbQuery(sparql, graphdbCtx, 'kbReviewItemsForAgentQuery');
  const items = rows
    .map((b: any) => {
      const iri = asString(b?.feedback);
      if (!iri) return null;
      const rawJson = asString(b?.rawJson);
      const txHash = asString(b?.txHash);
      const blockNumber = asNumber(b?.blockNumber);
      const timestamp = asNumber(b?.timestamp);
      return {
        iri,
        agentDid8004: did8004,
        json: asString(b?.json),
        record:
          rawJson || txHash || blockNumber != null || timestamp != null
            ? {
                rawJson,
                txHash,
                blockNumber: blockNumber == null ? null : Math.trunc(blockNumber),
                timestamp: timestamp == null ? null : Math.trunc(timestamp),
              }
            : null,
      } satisfies KbReviewResponseRow;
    })
    .filter((x): x is KbReviewResponseRow => Boolean(x));

  // Keep the agentDid8004 on each row (useful for GraphQL callers).
  if (did8004) {
    for (const it of items) it.agentDid8004 = did8004;
  }
  return items;
}

export async function kbReviewCountForAgentQuery(
  args: { uaid: string },
  graphdbCtx?: GraphdbQueryContext | null,
): Promise<number> {
  const ref = parseUaidToResolvedAgentRef(args.uaid);
  const ctx = chainContext(ref.chainId);
  const agentIri = ref.agentIri;
  const countSparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    '',
    'SELECT (COUNT(DISTINCT ?feedback) AS ?count) WHERE {',
    `  GRAPH <${ctx}> {`,
    `    <${agentIri}> core:hasReputationAssertion ?feedback .`,
    '  }',
    '}',
    '',
  ].join('\n');

  const countRows = await runGraphdbQuery(countSparql, graphdbCtx, 'kbReviewCountForAgentQuery');
  return clampInt(asNumber(countRows?.[0]?.count), 0, 10_000_000_000, 0);
}

export async function kbReviewsForAgentQuery(
  args: {
    uaid: string;
    first?: number | null;
    skip?: number | null;
  },
  graphdbCtx?: GraphdbQueryContext | null,
): Promise<KbConnection<KbReviewResponseRow>> {
  const [items, total] = await Promise.all([
    kbReviewItemsForAgentQuery(args, graphdbCtx),
    kbReviewCountForAgentQuery({ uaid: args.uaid }, graphdbCtx),
  ]);
  return { total, items };
}

export async function kbReviewsQuery(args: {
  chainId: number;
  first?: number | null;
  skip?: number | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<KbReviewResponseRow[]> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const first = clampInt(args.first, 1, 2000, 100);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const ctx = chainContext(chainId);

  const sparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT',
    '  ?feedback',
    '  (SAMPLE(?did8004) AS ?did8004)',
    '  (SAMPLE(?json) AS ?json)',
    '  (SAMPLE(?rawJson) AS ?rawJson)',
    '  (SAMPLE(?txHash) AS ?txHash)',
    '  (SAMPLE(?blockNumber) AS ?blockNumber)',
    '  (SAMPLE(?timestamp) AS ?timestamp)',
    'WHERE {',
    `  GRAPH <${ctx}> {`,
    '    ?agent core:hasReputationAssertion ?feedback .',
    '    OPTIONAL { ?feedback core:json ?json }',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;',
    '              erc8004:recordsEntity ?feedback .',
    '      OPTIONAL { ?record erc8004:subgraphRawJson ?rawJson }',
    '      OPTIONAL { ?record erc8004:subgraphTxHash ?txHash }',
    '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?blockNumber }',
    '      OPTIONAL { ?record erc8004:subgraphTimestamp ?timestamp }',
    '    }',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identity8004 .',
    '      ?identity8004 core:hasIdentifier ?ident8004 .',
    '      ?ident8004 core:protocolIdentifier ?did8004 .',
    '      FILTER(STRSTARTS(STR(?did8004), "did:8004:"))',
    '    }',
    '  }',
    '}',
    'GROUP BY ?feedback',
    'ORDER BY DESC(STR(?timestamp)) DESC(STR(?feedback))',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const rows = await runGraphdbQuery(sparql, graphdbCtx, 'kbReviewsQuery');
  return rows
    .map((b: any) => {
      const iri = asString(b?.feedback);
      if (!iri) return null;
      const rawJson = asString(b?.rawJson);
      const txHash = asString(b?.txHash);
      const blockNumber = asNumber(b?.blockNumber);
      const timestamp = asNumber(b?.timestamp);
      return {
        iri,
        agentDid8004: asString(b?.did8004),
        json: asString(b?.json),
        record:
          rawJson || txHash || blockNumber != null || timestamp != null
            ? {
                rawJson,
                txHash,
                blockNumber: blockNumber == null ? null : Math.trunc(blockNumber),
                timestamp: timestamp == null ? null : Math.trunc(timestamp),
              }
            : null,
      } satisfies KbReviewResponseRow;
    })
    .filter((x): x is KbReviewResponseRow => Boolean(x));
}

export type KbValidationResponseRow = {
  iri: string;
  agentDid8004: string | null;
  json: string | null;
  record: KbSubgraphRecord | null;
};

export async function kbValidationResponsesForAgentQuery(args: {
  uaid: string;
  first?: number | null;
  skip?: number | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<KbConnection<KbValidationResponseRow>> {
  const first = clampInt(args.first, 1, 2000, 25);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);

  const ref = parseUaidToResolvedAgentRef(args.uaid);
  const ctx = chainContext(ref.chainId);
  const agentIri = ref.agentIri;
  const did8004 = ref.did8004;

  const sparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT',
    '  ?validation',
    '  (SAMPLE(?json) AS ?json)',
    '  (SAMPLE(?rawJson) AS ?rawJson)',
    '  (SAMPLE(?txHash) AS ?txHash)',
    '  (SAMPLE(?blockNumber) AS ?blockNumber)',
    '  (SAMPLE(?timestamp) AS ?timestamp)',
    'WHERE {',
    `  GRAPH <${ctx}> {`,
    `    <${agentIri}> core:hasVerificationAssertion ?validation .`,
    '    OPTIONAL { ?validation core:json ?json }',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;',
    '              erc8004:recordsEntity ?validation .',
    '      OPTIONAL { ?record erc8004:subgraphRawJson ?rawJson }',
    '      OPTIONAL { ?record erc8004:subgraphTxHash ?txHash }',
    '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?blockNumber }',
    '      OPTIONAL { ?record erc8004:subgraphTimestamp ?timestamp }',
    '    }',
    '  }',
    '}',
    'GROUP BY ?validation',
    'ORDER BY DESC(STR(?timestamp)) DESC(STR(?validation))',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const countSparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    '',
    'SELECT (COUNT(DISTINCT ?validation) AS ?count) WHERE {',
    `  GRAPH <${ctx}> {`,
    `    <${agentIri}> core:hasVerificationAssertion ?validation .`,
    '  }',
    '}',
    '',
  ].join('\n');

  const [rows, countRows] = await Promise.all([
    runGraphdbQuery(sparql, graphdbCtx, 'kbValidationResponsesForAgentQuery'),
    runGraphdbQuery(countSparql, graphdbCtx, 'kbValidationResponsesForAgentQuery.count'),
  ]);
  const total = clampInt(asNumber(countRows?.[0]?.count), 0, 10_000_000_000, 0);
  const items = rows
    .map((b: any) => {
      const iri = asString(b?.validation);
      if (!iri) return null;
      const rawJson = asString(b?.rawJson);
      const txHash = asString(b?.txHash);
      const blockNumber = asNumber(b?.blockNumber);
      const timestamp = asNumber(b?.timestamp);
      return {
        iri,
        agentDid8004: did8004,
        json: asString(b?.json),
        record:
          rawJson || txHash || blockNumber != null || timestamp != null
            ? {
                rawJson,
                txHash,
                blockNumber: blockNumber == null ? null : Math.trunc(blockNumber),
                timestamp: timestamp == null ? null : Math.trunc(timestamp),
              }
            : null,
      } satisfies KbValidationResponseRow;
    })
    .filter((x): x is KbValidationResponseRow => Boolean(x));

  return { total, items };
}

export async function kbValidationResponsesQuery(args: {
  chainId: number;
  first?: number | null;
  skip?: number | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<KbValidationResponseRow[]> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const first = clampInt(args.first, 1, 2000, 100);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const ctx = chainContext(chainId);

  const sparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    '',
    'SELECT',
    '  ?validation',
    '  (SAMPLE(?did8004) AS ?did8004)',
    '  (SAMPLE(?json) AS ?json)',
    '  (SAMPLE(?rawJson) AS ?rawJson)',
    '  (SAMPLE(?txHash) AS ?txHash)',
    '  (SAMPLE(?blockNumber) AS ?blockNumber)',
    '  (SAMPLE(?timestamp) AS ?timestamp)',
    'WHERE {',
    `  GRAPH <${ctx}> {`,
    // Anchor on the validation node itself so results don't disappear if the agent linkage wasn't emitted/mapped.
    '    ?validation a erc8004:ValidationResponse, prov:Entity .',
    '    OPTIONAL { ?agent core:hasVerificationAssertion ?validation . }',
    '    OPTIONAL { ?validation core:json ?json }',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;',
    '              erc8004:recordsEntity ?validation .',
    '      OPTIONAL { ?record erc8004:subgraphRawJson ?rawJson }',
    '      OPTIONAL { ?record erc8004:subgraphTxHash ?txHash }',
    '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?blockNumber }',
    '      OPTIONAL { ?record erc8004:subgraphTimestamp ?timestamp }',
    '    }',
    '    OPTIONAL {',
    '      ?agent core:hasIdentity ?identity8004 .',
    '      ?identity8004 core:hasIdentifier ?ident8004 .',
    '      ?ident8004 core:protocolIdentifier ?did8004 .',
    '      FILTER(STRSTARTS(STR(?did8004), "did:8004:"))',
    '    }',
    '  }',
    '}',
    'GROUP BY ?validation',
    'ORDER BY DESC(STR(?timestamp)) DESC(STR(?validation))',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const rows = await runGraphdbQuery(sparql, graphdbCtx, 'kbValidationResponsesQuery');
  return rows
    .map((b: any) => {
      const iri = asString(b?.validation);
      if (!iri) return null;
      const rawJson = asString(b?.rawJson);
      const txHash = asString(b?.txHash);
      const blockNumber = asNumber(b?.blockNumber);
      const timestamp = asNumber(b?.timestamp);
      return {
        iri,
        agentDid8004: asString(b?.did8004),
        json: asString(b?.json),
        record:
          rawJson || txHash || blockNumber != null || timestamp != null
            ? {
                rawJson,
                txHash,
                blockNumber: blockNumber == null ? null : Math.trunc(blockNumber),
                timestamp: timestamp == null ? null : Math.trunc(timestamp),
              }
            : null,
      } satisfies KbValidationResponseRow;
    })
    .filter((x): x is KbValidationResponseRow => Boolean(x));
}

export type KbAssociationRow = {
  iri: string;
  record: KbSubgraphRecord | null;
};

export async function kbAssociationsQuery(args: {
  chainId: number;
  first?: number | null;
  skip?: number | null;
}, graphdbCtx?: GraphdbQueryContext | null): Promise<KbAssociationRow[]> {
  const chainId = clampInt(args.chainId, 1, 1_000_000_000, 0);
  const first = clampInt(args.first, 1, 2000, 100);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const ctx = chainContext(chainId);
  const sparql = [
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX erc8092: <https://agentictrust.io/ontology/erc8092#>',
    '',
    'SELECT',
    '  ?association',
    '  (SAMPLE(?rawJson) AS ?rawJson)',
    '  (SAMPLE(?txHash) AS ?txHash)',
    '  (SAMPLE(?blockNumber) AS ?blockNumber)',
    '  (SAMPLE(?timestamp) AS ?timestamp)',
    'WHERE {',
    `  GRAPH <${ctx}> {`,
    '    ?association a erc8092:AssociatedAccounts8092, prov:Entity .',
    '    OPTIONAL {',
    '      ?record a erc8004:SubgraphIngestRecord, prov:Entity ;',
    '              erc8004:recordsEntity ?association .',
    '      OPTIONAL { ?record erc8004:subgraphRawJson ?rawJson }',
    '      OPTIONAL { ?record erc8004:subgraphTxHash ?txHash }',
    '      OPTIONAL { ?record erc8004:subgraphBlockNumber ?blockNumber }',
    '      OPTIONAL { ?record erc8004:subgraphTimestamp ?timestamp }',
    '    }',
    '  }',
    '}',
    'GROUP BY ?association',
    'ORDER BY DESC(STR(?timestamp)) DESC(STR(?association))',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');
  const rows = await runGraphdbQuery(sparql, graphdbCtx, 'kbAssociationsQuery');
  return rows
    .map((b: any) => {
      const iri = asString(b?.association);
      if (!iri) return null;
      const rawJson = asString(b?.rawJson);
      const txHash = asString(b?.txHash);
      const blockNumber = asNumber(b?.blockNumber);
      const timestamp = asNumber(b?.timestamp);
      return {
        iri,
        record:
          rawJson || txHash || blockNumber != null || timestamp != null
            ? {
                rawJson,
                txHash,
                blockNumber: blockNumber == null ? null : Math.trunc(blockNumber),
                timestamp: timestamp == null ? null : Math.trunc(timestamp),
              }
            : null,
      } satisfies KbAssociationRow;
    })
    .filter((x): x is KbAssociationRow => Boolean(x));
}

