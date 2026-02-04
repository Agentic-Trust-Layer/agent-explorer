// Shared RDF/Turtle helpers and canonical AgenticTrust IRI builders.
// Initially extracted from apps/sync/src/rdf/common.ts for reuse across apps.

export function escapeTurtleString(value: string): string {
  return String(value)
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
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    '@prefix schema: <http://schema.org/> .',
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

// For SmartAgent, the agent IRI should be keyed off the smart-account DID (UAID/authority),
// not the ERC-8004 NFT agentId.
export function agentIriFromAccountDid(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/agent/by-account-did/${iriEncodeSegment(didAccountValue)}>`;
}

export function agentDescriptorIriFromAgentIri(agentIriValue: string): string {
  // agentIriValue is already a full IRI string wrapped in <> from our helpers
  const v = String(agentIriValue || '').trim();
  const inner = v.startsWith('<') && v.endsWith('>') ? v.slice(1, -1) : v;
  return `<https://www.agentictrust.io/id/agent-descriptor/${iriEncodeSegment(inner)}>`;
}

// Descriptor keyed off what it describes
export function agentAccountDescriptorIri(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/agent-account-descriptor/${iriEncodeSegment(didAccountValue)}>`;
}

export function identity8004Iri(didIdentityValue: string): string {
  return `<https://www.agentictrust.io/id/8004-identity/${iriEncodeSegment(didIdentityValue)}>`;
}

export function identity8004DescriptorIri(didIdentityValue: string): string {
  return `<https://www.agentictrust.io/id/8004-identity-descriptor/${iriEncodeSegment(didIdentityValue)}>`;
}

export function identityIdentifier8004Iri(didIdentityValue: string): string {
  return `<https://www.agentictrust.io/id/identifier/8004/${iriEncodeSegment(didIdentityValue)}>`;
}

export function identityEnsIri(ensName: string): string {
  return `<https://www.agentictrust.io/id/ens-identity/${iriEncodeSegment(ensName)}>`;
}

export function identityEnsDescriptorIri(ensName: string): string {
  return `<https://www.agentictrust.io/id/ens-identity-descriptor/${iriEncodeSegment(ensName)}>`;
}

export function identityIdentifierEnsIri(ensName: string): string {
  return `<https://www.agentictrust.io/id/identifier/ens/${iriEncodeSegment(ensName)}>`;
}

export function accountIdentifierIri(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/identifier/account/${iriEncodeSegment(didAccountValue)}>`;
}

export function protocolDescriptorIriA2a(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/protocol-descriptor/a2a/${iriEncodeSegment(didAccountValue)}>`;
}

export function protocolIriA2a(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/protocol/a2a/${iriEncodeSegment(didAccountValue)}>`;
}

export function protocolDescriptorIriMcp(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/protocol-descriptor/mcp/${iriEncodeSegment(didAccountValue)}>`;
}

export function protocolIriMcp(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/protocol/mcp/${iriEncodeSegment(didAccountValue)}>`;
}

export function oasfSkillIri(skillId: string): string {
  return `<https://www.agentictrust.io/id/oasf/skill/${iriEncodePath(skillId)}>`;
}

export function oasfDomainIri(domainId: string): string {
  return `<https://www.agentictrust.io/id/oasf/domain/${iriEncodePath(domainId)}>`;
}

export function agentSkillIri(didAccountValue: string, skillKey: string): string {
  return `<https://www.agentictrust.io/id/agent-skill/${iriEncodeSegment(didAccountValue)}/${iriEncodePath(skillKey)}>`;
}

export function agentDomainIri(subjectKey: string, domainKey: string): string {
  return `<https://www.agentictrust.io/id/agent-domain/${iriEncodeSegment(subjectKey)}/${iriEncodePath(domainKey)}>`;
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

