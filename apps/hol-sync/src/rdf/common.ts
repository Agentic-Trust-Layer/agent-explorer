export function escapeTurtleString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

export function iriEncodeSegment(value: string): string {
  return encodeURIComponent(String(value)).replace(/%/g, '_');
}

export function rdfPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    '@prefix schema: <http://schema.org/> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '',
  ].join('\n');
}
