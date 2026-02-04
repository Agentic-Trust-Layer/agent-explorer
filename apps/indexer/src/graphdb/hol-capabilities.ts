import { getGraphdbConfigFromEnv, queryGraphdbWithContext, updateGraphdb, type GraphdbQueryContext } from './graphdb-http.js';
import { iriEncodeSegment, escapeTurtleString } from '@agentictrust/hcs-core/rdf/common';
import { chainContext } from './kb-uaid.js';

export type KbHolCapabilityRow = {
  iri: string;
  key: string;
  label: string | null;
  json: string | null;
};

const HOL_CONTEXT = chainContext(295); // https://www.agentictrust.io/graph/data/subgraph/hol
const CAP_CATALOG_PREFIX = 'https://www.agentictrust.io/id/hol-capability/catalog/';

function capCatalogIri(key: string): string {
  return `<${CAP_CATALOG_PREFIX}${iriEncodeSegment(key)}>`;
}

function asString(b?: any): string | null {
  const v = b?.value;
  return typeof v === 'string' && v.trim() ? v : null;
}

export async function kbHolCapabilitiesQuery(args: { first?: number | null; skip?: number | null }, graphdbCtx?: GraphdbQueryContext | null) {
  const first = Number.isFinite(Number(args.first)) ? Math.max(1, Math.min(500, Math.trunc(Number(args.first)))) : 200;
  const skip = Number.isFinite(Number(args.skip)) ? Math.max(0, Math.trunc(Number(args.skip))) : 0;

  const sparql = `
PREFIX hol: <https://agentictrust.io/ontology/hol#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX core: <https://agentictrust.io/ontology/core#>
SELECT ?cap ?label ?json
WHERE {
  GRAPH <${HOL_CONTEXT}> {
    ?cap a hol:CapabilityHOL .
    FILTER(STRSTARTS(STR(?cap), "${CAP_CATALOG_PREFIX}"))
    OPTIONAL { ?cap rdfs:label ?label . }
    OPTIONAL { ?cap core:json ?json . }
  }
}
ORDER BY LCASE(STR(?label)) LCASE(STR(?cap))
LIMIT ${first}
OFFSET ${skip}
`;

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const result = await queryGraphdbWithContext(
    baseUrl,
    repository,
    auth,
    sparql,
    graphdbCtx ? { ...graphdbCtx, label: graphdbCtx.label ?? 'kbHolCapabilitiesQuery' } : { label: 'kbHolCapabilitiesQuery' },
  );
  const bindings = Array.isArray(result?.results?.bindings) ? result.results.bindings : [];

  const rows: KbHolCapabilityRow[] = [];
  for (const b of bindings) {
    const iri = asString(b?.cap);
    if (!iri) continue;
    const key = iri.startsWith(CAP_CATALOG_PREFIX) ? decodeURIComponent(iri.slice(CAP_CATALOG_PREFIX.length).replace(/_/g, '%')) : iri;
    rows.push({
      iri,
      key,
      label: asString(b?.label),
      json: asString(b?.json),
    });
  }
  return rows;
}

export async function upsertHolCapabilityCatalogToGraphdb(args: {
  capabilities: Array<{ key: string; label: string; raw: unknown }>;
}): Promise<{ count: number }> {
  const caps = Array.isArray(args.capabilities) ? args.capabilities : [];

  const prefixes = [
    'PREFIX hol: <https://agentictrust.io/ontology/hol#>',
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX dcterms: <http://purl.org/dc/terms/>',
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
  ].join('\n');

  const deleteBlock = `
DELETE { GRAPH <${HOL_CONTEXT}> { ?s ?p ?o } }
WHERE  { GRAPH <${HOL_CONTEXT}> { ?s ?p ?o . FILTER(STRSTARTS(STR(?s), "${CAP_CATALOG_PREFIX}")) } } ;
`;

  const inserts: string[] = [];
  for (const c of caps) {
    const key = typeof c?.key === 'string' ? c.key.trim() : '';
    if (!key) continue;
    const label = typeof c?.label === 'string' && c.label.trim() ? c.label.trim() : null;
    let rawJson = 'null';
    try {
      rawJson = JSON.stringify(c?.raw ?? null);
    } catch {
      rawJson = 'null';
    }
    const node = capCatalogIri(key);
    inserts.push(`${node} a hol:CapabilityHOL, prov:Entity ;`);
    if (label) inserts.push(`  rdfs:label "${escapeTurtleString(label)}" ;`);
    inserts.push(`  dcterms:identifier "${escapeTurtleString(key)}" ;`);
    inserts.push(`  core:json "${escapeTurtleString(rawJson)}" ;`);
    inserts.push(`  .\n`);
  }

  const insertBlock = `
INSERT DATA {
  GRAPH <${HOL_CONTEXT}> {
${inserts.map((l) => '    ' + l).join('\n')}
  }
}
`;

  const sparqlUpdate = `${prefixes}\n\n${deleteBlock}\n${insertBlock}\n`;
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await updateGraphdb(baseUrl, repository, auth, sparqlUpdate);
  return { count: caps.length };
}

