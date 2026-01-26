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

export function iriEncodePath(pathValue: string): string {
  return String(pathValue)
    .split('/')
    .filter((s) => s.length > 0)
    .map((s) => iriEncodeSegment(s))
    .join('/');
}

export function turtleIriOrLiteral(value: string): string | null {
  const v = String(value ?? '').trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return `<${v.replace(/[<>\s]/g, '')}>`;
  if (/^ipfs:\/\//i.test(v)) return `<${v.replace(/[<>\s]/g, '')}>`;
  return `"${escapeTurtleString(v)}"`;
}

export function turtleJsonLiteral(json: string): string {
  // Keep it simple: store JSON as xsd:string literal (GraphDB-friendly)
  return `"${escapeTurtleString(json)}"`;
}

export function rdfPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '@prefix eth: <https://agentictrust.io/ontology/eth#> .',
    '@prefix erc8004: <https://agentictrust.io/ontology/erc8004#> .',
    '@prefix erc8092: <https://agentictrust.io/ontology/erc8092#> .',
    '@prefix oasf: <https://agentictrust.io/ontology/oasf#> .',
    '@prefix ens: <https://agentictrust.io/ontology/ens#> .',
    '',
  ].join('\n');
}

export function accountIri(chainId: number, address: string): string {
  return `<https://www.agentictrust.io/id/account/${chainId}/${iriEncodeSegment(String(address).toLowerCase())}>`;
}

export function agentIri(chainId: number, agentId: string): string {
  return `<https://www.agentictrust.io/id/agent/${chainId}/${iriEncodeSegment(agentId)}>`;
}

export function agentDescriptorIri(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/agent-descriptor/${iriEncodeSegment(didAccountValue)}>`;
}

export function identity8004Iri(didIdentityValue: string): string {
  return `<https://www.agentictrust.io/id/8004-identity/${iriEncodeSegment(didIdentityValue)}>`;
}

export function identityIdentifier8004Iri(didIdentityValue: string): string {
  return `<https://www.agentictrust.io/id/identifier/8004/${iriEncodeSegment(didIdentityValue)}>`;
}

export function identityEnsIri(ensName: string): string {
  return `<https://www.agentictrust.io/id/ens-identity/${iriEncodeSegment(ensName)}>`;
}

export function identityIdentifierEnsIri(ensName: string): string {
  return `<https://www.agentictrust.io/id/identifier/ens/${iriEncodeSegment(ensName)}>`;
}

export function protocolDescriptorIriA2a(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/protocol-descriptor/a2a/${iriEncodeSegment(didAccountValue)}>`;
}

export function protocolIriA2a(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/protocol/a2a/${iriEncodeSegment(didAccountValue)}>`;
}

export function oasfSkillIri(skillId: string): string {
  return `<https://www.agentictrust.io/id/oasf/skill/${iriEncodePath(skillId)}>`;
}

export function agentSkillIri(didAccountValue: string, skillKey: string): string {
  return `<https://www.agentictrust.io/id/agent-skill/${iriEncodeSegment(didAccountValue)}/${iriEncodePath(skillKey)}>`;
}

export function feedbackIri(chainId: number, agentId: string, client: string, feedbackIndex: number): string {
  return `<https://www.agentictrust.io/id/feedback/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(client.toLowerCase())}/${feedbackIndex}>`;
}

export function feedbackResponseIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/feedback-response/${chainId}/${iriEncodeSegment(id)}>`;
}

export function validationRequestIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/validation-request/${chainId}/${iriEncodeSegment(id)}>`;
}

export function validationResponseIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/validation-response/${chainId}/${iriEncodeSegment(id)}>`;
}

export function associationIri(chainId: number, associationId: string): string {
  return `<https://www.agentictrust.io/id/association/${chainId}/${iriEncodeSegment(associationId)}>`;
}

export function associationRevocationIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/association-revocation/${chainId}/${iriEncodeSegment(id)}>`;
}

export function subgraphIngestRecordIri(chainId: number, kind: string, entityId: string): string {
  return `<https://www.agentictrust.io/id/subgraph-ingest-record/${chainId}/${iriEncodeSegment(kind)}/${iriEncodeSegment(entityId)}>`;
}

