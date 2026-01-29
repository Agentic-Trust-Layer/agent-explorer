import { getGraphdbConfigFromEnv, queryGraphdb } from './graphdb-http.js';

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

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

async function runGraphdbQuery(sparql: string): Promise<any[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const result = await queryGraphdb(baseUrl, repository, auth, sparql);
  return Array.isArray(result?.results?.bindings) ? result.results.bindings : [];
}

export type KbSubgraphRecord = {
  rawJson: string | null;
  txHash: string | null;
  blockNumber: number | null;
  timestamp: number | null;
};

export type KbFeedbackRow = {
  iri: string;
  agentDid8004: string | null;
  json: string | null;
  record: KbSubgraphRecord | null;
};

export type KbConnection<T> = { total: number; items: T[] };

function graphClauseForChain(chainId?: number | null): { open: string; close: string } {
  if (chainId != null) {
    const ctx = chainContext(chainId);
    return { open: `GRAPH <${ctx}> {`, close: '}' };
  }
  return {
    open: 'GRAPH ?g { FILTER(STRSTARTS(STR(?g), "https://www.agentictrust.io/graph/data/subgraph/"))',
    close: '}',
  };
}

export async function kbFeedbacksForAgentQuery(args: {
  chainId?: number | null;
  agentIri: string;
  agentDid8004?: string | null;
  first?: number | null;
  skip?: number | null;
}): Promise<KbConnection<KbFeedbackRow>> {
  const first = clampInt(args.first, 1, 2000, 25);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const agentIri = String(args.agentIri || '').trim();
  if (!agentIri) return { total: 0, items: [] };

  const chainId = args.chainId != null ? clampInt(args.chainId, 1, 1_000_000_000, 0) : null;
  const graph = graphClauseForChain(chainId);
  const did8004 = typeof args.agentDid8004 === 'string' && args.agentDid8004.trim() ? args.agentDid8004.trim() : null;

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
    `  ${graph.open}`,
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
    `  ${graph.close}`,
    '}',
    'GROUP BY ?feedback',
    'ORDER BY DESC(STR(?timestamp)) DESC(STR(?feedback))',
    `LIMIT ${first}`,
    `OFFSET ${skip}`,
    '',
  ].join('\n');

  const countSparql = [
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    '',
    'SELECT (COUNT(DISTINCT ?feedback) AS ?count) WHERE {',
    `  ${graph.open}`,
    `    <${agentIri}> core:hasReputationAssertion ?feedback .`,
    `  ${graph.close}`,
    '}',
    '',
  ].join('\n');

  const [rows, countRows] = await Promise.all([runGraphdbQuery(sparql), runGraphdbQuery(countSparql)]);
  const total = clampInt(asNumber(countRows?.[0]?.count), 0, 10_000_000_000, 0);
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
      } satisfies KbFeedbackRow;
    })
    .filter((x): x is KbFeedbackRow => Boolean(x));

  return { total, items };
}

export async function kbFeedbacksQuery(args: {
  chainId: number;
  first?: number | null;
  skip?: number | null;
}): Promise<KbFeedbackRow[]> {
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

  const rows = await runGraphdbQuery(sparql);
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
      } satisfies KbFeedbackRow;
    })
    .filter((x): x is KbFeedbackRow => Boolean(x));
}

export type KbValidationResponseRow = {
  iri: string;
  agentDid8004: string | null;
  json: string | null;
  record: KbSubgraphRecord | null;
};

export async function kbValidationResponsesForAgentQuery(args: {
  chainId?: number | null;
  agentIri: string;
  agentDid8004?: string | null;
  first?: number | null;
  skip?: number | null;
}): Promise<KbConnection<KbValidationResponseRow>> {
  const first = clampInt(args.first, 1, 2000, 25);
  const skip = clampInt(args.skip, 0, 1_000_000, 0);
  const agentIri = String(args.agentIri || '').trim();
  if (!agentIri) return { total: 0, items: [] };

  const chainId = args.chainId != null ? clampInt(args.chainId, 1, 1_000_000_000, 0) : null;
  const graph = graphClauseForChain(chainId);
  const did8004 = typeof args.agentDid8004 === 'string' && args.agentDid8004.trim() ? args.agentDid8004.trim() : null;

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
    `  ${graph.open}`,
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
    `  ${graph.close}`,
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
    `  ${graph.open}`,
    `    <${agentIri}> core:hasVerificationAssertion ?validation .`,
    `  ${graph.close}`,
    '}',
    '',
  ].join('\n');

  const [rows, countRows] = await Promise.all([runGraphdbQuery(sparql), runGraphdbQuery(countSparql)]);
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
}): Promise<KbValidationResponseRow[]> {
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

  const rows = await runGraphdbQuery(sparql);
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
}): Promise<KbAssociationRow[]> {
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
  const rows = await runGraphdbQuery(sparql);
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

