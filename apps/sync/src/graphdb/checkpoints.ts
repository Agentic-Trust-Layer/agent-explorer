import { getGraphdbConfigFromEnv, queryGraphdb, updateGraphdb } from '../graphdb-http.js';

function checkpointContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/system/subgraph-sync/checkpoints/${chainId}`;
}

function checkpointIri(chainId: number, section: string): string {
  const s = encodeURIComponent(section).replace(/%/g, '_');
  return `<https://www.agentictrust.io/id/subgraph-sync-checkpoint/${chainId}/${s}>`;
}

export async function getCheckpoint(chainId: number, section: string): Promise<string | null> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = checkpointContext(chainId);
  const iri = checkpointIri(chainId, section);
  const sparql = `
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?cursor WHERE {
  GRAPH <${ctx}> {
    ${iri} a erc8004:SubgraphIngestCheckpoint ;
      erc8004:checkpointCursor ?cursor .
  }
}
LIMIT 1
`;
  const result = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = result?.results?.bindings;
  if (!Array.isArray(bindings) || bindings.length === 0) return null;
  const v = bindings[0]?.cursor?.value;
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

export async function setCheckpoint(chainId: number, section: string, cursor: string): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = checkpointContext(chainId);
  const iri = checkpointIri(chainId, section);
  const now = Math.floor(Date.now() / 1000);
  const cursorEsc = cursor.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const sectionEsc = section.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const update = `
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
WITH <${ctx}>
DELETE {
  ${iri} erc8004:checkpointCursor ?oldCursor .
  ${iri} erc8004:checkpointUpdatedAt ?oldUpdatedAt .
} WHERE {
  OPTIONAL { ${iri} erc8004:checkpointCursor ?oldCursor . }
  OPTIONAL { ${iri} erc8004:checkpointUpdatedAt ?oldUpdatedAt . }
};
WITH <${ctx}>
INSERT {
  ${iri} a erc8004:SubgraphIngestCheckpoint ;
    erc8004:checkpointChainId ${chainId} ;
    erc8004:checkpointSection "${sectionEsc}"^^xsd:string ;
    erc8004:checkpointCursor "${cursorEsc}"^^xsd:string ;
    erc8004:checkpointUpdatedAt ${now} .
} WHERE {};
`;
  await updateGraphdb(baseUrl, repository, auth, update);
}

