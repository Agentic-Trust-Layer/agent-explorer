import { extractAllSkills, isOasfSkillId } from '../a2a/skill-extraction';

type AnyDb = any;

function isNode(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof process !== 'undefined' && Boolean((process as any).versions?.node);
}

function rdfPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix p-plan: <http://purl.org/net/p-plan#> .',
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    '@prefix schema: <http://schema.org/> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '@prefix eth: <https://agentictrust.io/ontology/eth#> .',
    '@prefix erc8004: <https://agentictrust.io/ontology/erc8004#> .',
    '@prefix erc8092: <https://agentictrust.io/ontology/erc8092#> .',
    '@prefix oasf: <https://agentictrust.io/ontology/oasf#> .',
    '',
    // Provide an ontology header so Protégé auto-loads imports instead of requiring manual import.
    '<https://www.agentictrust.io/data/agents> a owl:Ontology ;',
    '  owl:imports <https://agentictrust.io/ontology/core> ;',
    '  owl:imports <https://agentictrust.io/ontology/core/descriptors> ;',
    '  owl:imports <https://agentictrust.io/ontology/core/identifier> ;',
    '  owl:imports <https://agentictrust.io/ontology/core/identity> ;',
    '  owl:imports <https://agentictrust.io/ontology/core/trust> ;',
    '  owl:imports <https://agentictrust.io/ontology/oasf> ;',
    '  owl:imports <https://agentictrust.io/ontology/eth> ;',
    '  owl:imports <https://agentictrust.io/ontology/erc8004> ;',
    '  owl:imports <https://agentictrust.io/ontology/erc8092> ;',
    '  .',
    '',
  ].join('\n');
}

type ExportOneAgent = { chainId: number; agentId: string };

function rdfPrefixesForAgent(agent?: ExportOneAgent): string {
  if (!agent) return rdfPrefixes();
  const ontologyIri = `<https://www.agentictrust.io/data/agent/${agent.chainId}/${iriEncodeSegment(agent.agentId)}>`;
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix p-plan: <http://purl.org/net/p-plan#> .',
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    '@prefix schema: <http://schema.org/> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '@prefix eth: <https://agentictrust.io/ontology/eth#> .',
    '@prefix erc8004: <https://agentictrust.io/ontology/erc8004#> .',
    '@prefix erc8092: <https://agentictrust.io/ontology/erc8092#> .',
    '@prefix oasf: <https://agentictrust.io/ontology/oasf#> .',
    '',
    // Provide an ontology header so Protégé auto-loads imports instead of requiring manual import.
    `${ontologyIri} a owl:Ontology ;`,
    '  owl:imports <https://agentictrust.io/ontology/core> ;',
    '  owl:imports <https://agentictrust.io/ontology/core/descriptors> ;',
    '  owl:imports <https://agentictrust.io/ontology/core/identifier> ;',
    '  owl:imports <https://agentictrust.io/ontology/core/identity> ;',
    '  owl:imports <https://agentictrust.io/ontology/core/trust> ;',
    '  owl:imports <https://agentictrust.io/ontology/oasf> ;',
    '  owl:imports <https://agentictrust.io/ontology/eth> ;',
    '  owl:imports <https://agentictrust.io/ontology/erc8004> ;',
    '  owl:imports <https://agentictrust.io/ontology/erc8092> ;',
    '  .',
    '',
  ].join('\n');
}

function parseCursor(value: unknown): { chainId: number; agentId: string } {
  if (typeof value !== 'string' || !value.trim()) return { chainId: 0, agentId: '' };
  const parts = value.split('|');
  if (parts.length < 2) return { chainId: 0, agentId: '' };
  const chainId = Number(parts[0]);
  const agentId = parts.slice(1).join('|');
  return {
    chainId: Number.isFinite(chainId) && chainId >= 0 ? Math.trunc(chainId) : 0,
    agentId: typeof agentId === 'string' ? agentId : '',
  };
}

function formatCursor(cursor: { chainId: number; agentId: string }): string {
  const chainId = Number.isFinite(cursor.chainId) && cursor.chainId >= 0 ? Math.trunc(cursor.chainId) : 0;
  const agentId = typeof cursor.agentId === 'string' ? cursor.agentId : '';
  return `${chainId}|${agentId}`;
}

function escapeTurtleString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function canonicalTrustModel(value: string): string | null {
  const v = value.trim().toLowerCase();
  if (!v) return null;
  // Canonical values
  const canon = new Set([
    'execution-integrity',
    'reputation',
    'crypto-economic',
    'social-graph',
    'authority-institutional',
    'identity-assurance',
    'process-conformance',
    'data-provenance',
    'consensus-quorum',
    'contextual-situational',
  ]);
  if (canon.has(v)) return v;

  // Common aliases from ERC-8004 registration metadata
  if (v === 'tee' || v === 'tee-attestation' || v === 'attestation') return 'execution-integrity';
  if (v.includes('zk') || v.includes('zkvm') || v.includes('zk-vm') || v.includes('zk-wasm') || v.includes('zkwasm') || v.includes('cairo') || v.includes('sp1') || v.includes('risc0') || v.includes('risc-zero')) {
    return 'execution-integrity';
  }
  if (v === 'reputation' || v === 'feedback' || v === 'validation') return 'reputation';
  if (v === 'crypto-economic' || v === 'crypto' || v === 'staking' || v === 'stake' || v === 'bond' || v === 'bonded' || v === 'slashing') return 'crypto-economic';
  if (v === 'social' || v === 'social-graph' || v === 'association' || v === 'associations' || v === 'erc8092') return 'social-graph';
  if (v === 'authority' || v === 'institutional' || v === 'authority/institutional' || v === 'pki' || v === 'auditor' || v === 'certifier') return 'authority-institutional';
  if (v === 'identity' || v === 'identity-assurance' || v === 'kyc' || v === 'kyb' || v === 'did' || v === 'proofing') return 'identity-assurance';
  if (v === 'process' || v === 'process-conformance' || v === 'prov' || v === 'provo' || v === 'p-plan' || v === 'audit-trail') return 'process-conformance';
  if (v === 'provenance' || v === 'data-provenance' || v === 'oracle' || v === 'signed-data' || v === 'dataset' || v === 'hash') return 'data-provenance';
  if (v === 'consensus' || v === 'quorum' || v === 'consensus/quorum' || v === 'threshold' || v === 'multisig' || v === 'dao-vote') return 'consensus-quorum';
  if (v === 'contextual' || v === 'situational' || v === 'contextual/situational') return 'contextual-situational';

  return null;
}

function trustModelLocalName(model: string): string {
  // Convert canonical kebab-case to ontology individual local name suffix.
  // e.g. "execution-integrity" -> "execution_integrity"
  return model.trim().toLowerCase().replace(/-/g, '_');
}

function isSafeAbsoluteIri(value: string): boolean {
  // Pragmatic Turtle/RDF4J-safe IRI check:
  // - must have scheme
  // - no whitespace or characters that commonly break Turtle/IRI parsing
  if (!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)) return false;
  if (/[<>"\s\\{}|^`]/.test(value)) return false;
  return true;
}

function turtleIriOrLiteral(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const s = value.trim();
  if (isSafeAbsoluteIri(s)) return `<${s}>`;
  return `"${escapeTurtleString(s)}"`;
}

function turtleJsonLiteral(jsonText: string): string {
  // Use xsd:string datatype for JSON content (rdf:JSON is not widely supported by parsers).
  // Use triple-quoted literal, but still escape backslashes/quotes to keep it robust.
  const escaped = escapeTurtleString(jsonText);
  return `"""${escaped}"""^^xsd:string`;
}

function iriEncodeSegment(seg: string): string {
  return encodeURIComponent(seg).replace(/%2F/g, '%252F');
}

function isValidENSName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  // Must end with .eth
  if (!name.toLowerCase().endsWith('.eth')) return false;
  // Basic validation: alphanumeric, hyphens, dots only, not starting/ending with hyphen
  const namePart = name.slice(0, -4); // Remove .eth
  if (namePart.length === 0) return false;
  // ENS names can contain: a-z, 0-9, hyphens (but not at start/end), and can have subdomains
  const ensNameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  return ensNameRegex.test(namePart);
}

function identifierIri(chainId: number, agentId: string, type: '8004' | 'ens', didIdentity?: string | null, ensName?: string | null): string {
  if (type === '8004' && didIdentity) {
    return `<https://www.agentictrust.io/id/identifier/8004/${iriEncodeSegment(didIdentity)}>`;
  } else if (type === 'ens' && ensName) {
    return `<https://www.agentictrust.io/id/identifier/ens/${iriEncodeSegment(ensName)}>`;
  } else {
    // Fallback
    const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
    return `<https://www.agentictrust.io/id/identifier/${type}/${identifier}>`;
  }
}

function normalizeHex(x: unknown): string | null {
  if (typeof x !== 'string') return null;
  const s = x.trim();
  if (!s) return null;
  return s.startsWith('0x') ? s.toLowerCase() : s;
}

function normalizeHexFromAccountId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  const last = s.includes(':') ? s.split(':').pop() ?? '' : s;
  const hex = normalizeHex(last);
  if (!hex) return null;
  return /^0x[0-9a-f]{40}$/.test(hex) ? hex : null;
}

function agentIri(chainId: number, agentId: string, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/agent/${identifier}>`;
}

function identity8004DescriptorIri(chainId: number, agentId: string, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/8004-identity-descriptor/${identifier}>`;
}

function agentDescriptorIri(chainId: number, agentId: string, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/agent-descriptor/${identifier}>`;
}

function situationIri(chainId: number, agentId: string, situationType: string, situationId: string, didIdentity?: string | null): string {
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/situation/${situationType}/${identifier}/${iriEncodeSegment(situationId)}>`;
}

function intentTypeIri(intentTypeName: string): string {
  return `https://agentictrust.io/ontology/core/intentType/${iriEncodeSegment(intentTypeName)}`;
}

function domainIri(domainName: string): string {
  return `<https://www.agentictrust.io/id/domain/${iriEncodeSegment(domainName)}>`;
}

function iriEncodePath(pathValue: string): string {
  return String(pathValue)
    .split('/')
    .filter((s) => s.length > 0)
    .map((s) => iriEncodeSegment(s))
    .join('/');
}

function oasfDomainIri(domainId: string): string {
  return `<https://www.agentictrust.io/id/oasf/domain/${iriEncodePath(domainId)}>`;
}

function oasfSkillIri(skillId: string): string {
  return `<https://www.agentictrust.io/id/oasf/skill/${iriEncodePath(skillId)}>`;
}

function agentSkillIri(chainId: number, agentId: string, skillKey: string, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/agent-skill/${identifier}/${iriEncodePath(skillKey)}>`;
}

function agentDomainIri(chainId: number, agentId: string, domainKey: string, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/agent-domain/${identifier}/${iriEncodePath(domainKey)}>`;
}

function oasfCategoryIri(kind: 'domain' | 'skill', key: string): string {
  return `<https://www.agentictrust.io/id/oasf/${kind}-category/${iriEncodeSegment(key)}>`;
}

function oasfDictionaryEntryIri(key: string): string {
  return `<https://www.agentictrust.io/id/oasf/dictionary/${iriEncodeSegment(key)}>`;
}

function skillIri(chainId: number, agentId: string, skillId: string, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/skill/${identifier}/${iriEncodeSegment(skillId)}>`;
}

function skillSchemaIri(chainId: number, agentId: string, skillId: string, kind: 'input' | 'output', didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/schema/skill/${identifier}/${iriEncodeSegment(skillId)}/${kind}>`;
}

function fetchActivityIri(chainId: number, agentId: string, readAt: number, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/activity/agent-descriptor-fetch/${identifier}/${readAt}>`;
}

function accountIri(chainId: number, address: string): string {
  return `<https://www.agentictrust.io/id/account/${chainId}/${iriEncodeSegment(address.toLowerCase())}>`;
}

function accountIdentifierIri(chainId: number, address: string): string {
  const addr = normalizeHex(address);
  if (!addr) throw new Error(`Invalid account address: ${address}`);
  return `<https://www.agentictrust.io/id/account-identifier/${chainId}/${iriEncodeSegment(addr)}>`;
}

function identifierDescriptorIri(identifierIri: string, type: '8004' | 'ens' | 'account'): string {
  // Extract identifier from IRI and create descriptor IRI
  const match = identifierIri.match(/\/id\/identifier\/([^>]+)>/) || identifierIri.match(/\/id\/account-identifier\/([^>]+)>/);
  if (match) {
    return `<https://www.agentictrust.io/id/identifier-descriptor/${type}/${match[1]}>`;
  }
  // Fallback: use identifier IRI with descriptor suffix
  return identifierIri.replace('/identifier/', '/identifier-descriptor/').replace('/account-identifier/', '/identifier-descriptor/account/');
}

function ensNameIri(chainId: number, ensName: string): string {
  return `<https://www.agentictrust.io/id/ens-name/${chainId}/${iriEncodeSegment(ensName)}>`;
}

function identity8004Iri(chainId: number, agentId: string, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/8004-identity/${identifier}>`;
}

// Track emitted accounts to avoid duplicates
const emittedAccounts = new Set<string>();

function ensureAccountNode(
  chunks: string[],
  chainId: number,
  address: string,
  accountType: 'EOA' | 'SmartAccount' = 'SmartAccount',
): void {
  const addr = normalizeHex(address);
  if (!addr) return;
  const key = `${chainId}|${addr}`;
  if (emittedAccounts.has(key)) return;
  emittedAccounts.add(key);
  const acctIri = accountIri(chainId, addr);
  // Account is prov:SoftwareAgent (enabling participation in relationships), inherits from prov:Agent
  // Account is Ethereum-specific, uses agentictrustEth prefix
  chunks.push(
    `${acctIri} a eth:Account, prov:SoftwareAgent, prov:Agent, prov:Entity ;\n` +
      `  eth:accountChainId ${chainId} ;\n` +
      `  eth:accountAddress "${escapeTurtleString(addr.toLowerCase())}" ;\n` +
      `  eth:accountType "${accountType}" .\n\n`,
  );
}

function feedbackIri(chainId: number, agentId: string, client: string, feedbackIndex: number): string {
  return `<https://www.agentictrust.io/id/feedback/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(client.toLowerCase())}/${feedbackIndex}>`;
}

function feedbackResponseIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/feedback-response/${chainId}/${iriEncodeSegment(id)}>`;
}

function feedbackAuthRequestIri(chainId: number, agentId: string, client: string, feedbackIndex: number): string {
  return `<https://www.agentictrust.io/id/feedback-auth-request/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(client.toLowerCase())}/${feedbackIndex}>`;
}

function validationRequestIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/validation-request/${chainId}/${iriEncodeSegment(id)}>`;
}

function validationResponseIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/validation-response/${chainId}/${iriEncodeSegment(id)}>`;
}

function delegationTrustAssertionIri(chainId: number, kind: 'feedback-auth' | 'validation-request', id: string): string {
  return `<https://www.agentictrust.io/id/delegation-trust-assertion/${kind}/${chainId}/${iriEncodeSegment(id)}>`;
}

function delegationPermissionIri(chainId: number, kind: 'feedback-auth' | 'validation-request', id: string): string {
  return `<https://www.agentictrust.io/id/delegation-permission/${kind}/${chainId}/${iriEncodeSegment(id)}>`;
}

function erc8092DelegationSituationIri(chainId: number, associationId: string): string {
  return `<https://www.agentictrust.io/id/situation/delegation/erc8092/${chainId}/${iriEncodeSegment(associationId)}>`;
}

function erc8092DelegationTrustAssertionIri(chainId: number, associationId: string): string {
  return `<https://www.agentictrust.io/id/delegation-trust-assertion/erc8092/${chainId}/${iriEncodeSegment(associationId)}>`;
}

function erc8092DelegationPermissionIri(chainId: number, associationId: string, index: number): string {
  return `<https://www.agentictrust.io/id/delegation-permission/erc8092/${chainId}/${iriEncodeSegment(associationId)}/${index}>`;
}

function associationIri(chainId: number, associationId: string): string {
  return `<https://www.agentictrust.io/id/association/${chainId}/${iriEncodeSegment(associationId)}>`;
}

function associationAccountIri(chainId: number, accountId: string): string {
  return `<https://www.agentictrust.io/id/association-account/${chainId}/${iriEncodeSegment(accountId)}>`;
}

function associationRevocationIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/association-revocation/${chainId}/${iriEncodeSegment(id)}>`;
}

function relationshipIri(chainId: number, relationshipId: string): string {
  return `<https://www.agentictrust.io/id/relationship/${chainId}/${iriEncodeSegment(relationshipId)}>`;
}

function relationshipAssertionIri(chainId: number, relationshipAssertionId: string): string {
  return `<https://www.agentictrust.io/id/relationship-assertion/${chainId}/${iriEncodeSegment(relationshipAssertionId)}>`;
}

function relationshipAccountIri(chainId: number, accountId: string): string {
  return `<https://www.agentictrust.io/id/relationship-account/${chainId}/${iriEncodeSegment(accountId)}>`;
}

function actIriFromRecordIri(recordIri: string): string {
  // recordIri is expected to be a Turtle IRI token like `<https://...>`
  if (!recordIri.startsWith('<') || !recordIri.endsWith('>')) return `<${recordIri}/act>`;
  return `${recordIri.slice(0, -1)}/act>`;
}

function relationshipRevocationAssertionIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/relationship-revocation-assertion/${chainId}/${iriEncodeSegment(id)}>`;
}

function validationOffchainIri(chainId: number, kind: 'request' | 'response', id: string): string {
  return `<https://www.agentictrust.io/id/validation-offchain/${chainId}/${kind}/${iriEncodeSegment(id)}>`;
}

function validationAttachmentIri(chainId: number, kind: 'request' | 'response', id: string, index: number): string {
  return `<https://www.agentictrust.io/id/validation-attachment/${chainId}/${kind}/${iriEncodeSegment(id)}/${index}>`;
}

function feedbackOffchainIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/feedback-offchain/${chainId}/${iriEncodeSegment(id)}>`;
}

function feedbackAttachmentIri(chainId: number, id: string, index: number): string {
  return `<https://www.agentictrust.io/id/feedback-attachment/${chainId}/${iriEncodeSegment(id)}/${index}>`;
}

function feedbackPaymentProofIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/feedback-payment-proof/${chainId}/${iriEncodeSegment(id)}>`;
}

function safeJsonObject(value: unknown): Record<string, any> | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as any;
    return null;
  } catch {
    return null;
  }
}

function normalizeDateTimeLiteral(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `"${d.toISOString()}"^^xsd:dateTime`;
}

function turtleIriOrStringLiteral(value: unknown): string | null {
  // Backward-compatible alias
  return turtleIriOrLiteral(value);
}

function normalizeSymbol(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function checkIri(tag: string): string {
  return `https://www.agentictrust.io/id/check/${iriEncodeSegment(tag)}`;
}

async function writeFileAtomically(targetPath: string, contents: string): Promise<void> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const dir = path.dirname(targetPath);
  await fs.mkdir(dir, { recursive: true });
  const tmp = `${targetPath}.tmp`;
  await fs.writeFile(tmp, contents, 'utf8');
  await fs.rename(tmp, targetPath);
}

async function setCheckpointValue(db: AnyDb, key: string, value: string): Promise<void> {
  try {
    await db.prepare('INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key, value);
  } catch {
    // best-effort
  }
}

async function getCheckpointValue(db: AnyDb, key: string): Promise<string | null> {
  try {
    const row = await db.prepare('SELECT value FROM checkpoints WHERE key = ?').get(key);
    return row?.value ? String((row as any).value) : null;
  } catch {
    return null;
  }
}

function renderAgentSection(
  row: any,
  agentCard: any,
  agentCardJsonText: string,
  accountChunks: string[],
): string {
  const chainId = Number(row?.chainId ?? 0) || 0;
  const agentId = String(row?.agentId ?? '');
  const readAt = Number(row?.agentCardReadAt ?? 0) || Math.floor(Date.now() / 1000);

  // Parse rawJson (agentURI registration JSON) early so we can infer ERC-8004 identity even when didIdentity
  // isn't present in the DB.
  let tokenUriData: any = null;
  if (row?.rawJson) {
    try {
      tokenUriData = JSON.parse(String(row.rawJson));
    } catch {
      tokenUriData = null;
    }
  }

  // Identity principle (new way only):
  // - Anchor the discoverable AIAgent node to the on-chain agentAccount (SmartAccount).
  // - If no agentAccount exists, we skip emitting this agent entirely.
  const acctNorm = normalizeHex(row?.agentAccount) ?? null;
  if (!acctNorm) return '';
  const acctIri = accountIri(chainId, acctNorm);
  const aIri = acctIri;

  // Prefer DID-account for per-agent IRIs (descriptors/skills/domains/situations/protocol IRIs).
  // Do not use did:8004 for these IRIs.
  const didAccountValue =
    typeof row?.didAccount === 'string' && row.didAccount.trim()
      ? row.didAccount.trim()
      : `did:ethr:${chainId}:${acctNorm.toLowerCase()}`;

  const lines: string[] = [];
  const afterAgent: string[] = [];

  // Agent
  lines.push(`${aIri} a core:AIAgent, prov:SoftwareAgent ;`);
  lines.push(`  a eth:Account ;`);
  lines.push(`  core:agentId "${escapeTurtleString(String(agentId))}" ;`);

  // AgentRegistration8004 (ERC-8004 registration descriptor extracted from rawJson)
  const adIri = agentDescriptorIri(chainId, agentId, didAccountValue);
  // For ERC-8004 agents, use AgentRegistration8004; otherwise use AgentDescriptor
  const isERC8004 =
    (typeof tokenUriData?.type === 'string' && tokenUriData.type.includes('eip-8004')) ||
    (typeof row?.didIdentity === 'string' && row.didIdentity.trim().startsWith('did:8004:'));
  if (isERC8004) {
    // Do NOT link registration descriptor directly off the Agent.
    // Preferred path: Agent -> hasIdentity -> (AgentIdentity8004) -> hasDescriptor -> AgentRegistration8004.
  } else {
    lines.push(`  core:hasDescriptor ${adIri} ;`);
  }
  
  // Identity8004 and IdentityIdentifier8004 for didIdentity
  const didIdentityValue =
    typeof row?.didIdentity === 'string' && row.didIdentity.trim()
      ? row.didIdentity.trim()
      : isERC8004
        ? `did:8004:${chainId}:${agentId}`
        : null;

  if (didIdentityValue) {
    const didIdentityIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(didIdentityValue)}>`;
    
    // Create Identity8004 instance
    const identity8004IriValue = identity8004Iri(chainId, agentId, didIdentityValue);
    lines.push(`  core:hasIdentity ${identity8004IriValue} ;`);

    // Link identity -> registration descriptor (preferred discovery path)
    accountChunks.push(`${identity8004IriValue} core:hasDescriptor ${adIri} .\n\n`);
    
    // Create IdentityIdentifier8004 instance
    const identityIdentifierIri = identifierIri(chainId, agentId, '8004', didIdentityValue);
    
    // Emit AgentIdentity8004
    accountChunks.push(
      `${identity8004IriValue} a erc8004:AgentIdentity8004, prov:Entity ;\n` +
        `  core:hasIdentifier ${identityIdentifierIri} .\n\n`,
    );
    
    // Emit IdentityIdentifier8004
    const identityDescriptorIriValue = identifierDescriptorIri(identityIdentifierIri, '8004');
    accountChunks.push(
      `${identityIdentifierIri} a erc8004:IdentityIdentifier8004, core:UniversalIdentifier, core:Identifier, prov:Entity ;\n` +
        `  core:identifierType erc8004:IdentifierType_8004 ;\n` +
        `  core:hasDescriptor ${identityDescriptorIriValue} .\n\n`,
    );
    
    // Emit IdentifierDescriptor for IdentityIdentifier8004 with DID
    accountChunks.push(
      `${identityDescriptorIriValue} a core:IdentifierDescriptor, core:Descriptor, prov:Entity ;\n` +
        `  core:hasDID ${didIdentityIri} .\n\n`,
    );
    
    // Emit DID instance (DID is a DecentralizedIdentifier, which is a type of Identifier)
    // DID identifies the IdentityIdentifier8004 via identifies property
    // Note: hasDID is only for Descriptor → DID, not Identifier → DID
    accountChunks.push(
      `${didIdentityIri} a core:DID, core:DecentralizedIdentifier, core:Identifier, prov:Entity ;\n` +
        `  core:identifies ${identityIdentifierIri} .\n\n`,
    );
  }
  
  // NameIdentifierENS and NameENS for agentName ending in .eth
  if (row?.agentName && isValidENSName(String(row.agentName))) {
    const ensName = String(row.agentName).trim();
    const ensDid = row?.didName || `did:ens:${chainId}:${ensName}`;
    const ensDidIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(ensDid)}>`;
    
    // Create NameIdentifierENS instance
    const ensIdentifierIri = identifierIri(chainId, agentId, 'ens', null, ensName);
    // Link agent directly to NameENSIdentifier via hasIdentifier
    lines.push(`  core:hasIdentifier ${ensIdentifierIri} ;`);
    
    // Create NameENS instance
    const ensNameIriValue = ensNameIri(chainId, ensName);
    lines.push(`  core:hasName ${ensNameIriValue} ;`);
    
    // Emit NameENS
    accountChunks.push(
      `${ensNameIriValue} a eth:AgentNameENS, core:AgentName, prov:Entity ;\n` +
        `  eth:ensName "${escapeTurtleString(ensName)}" ;\n` +
        `  eth:ensChainId ${chainId} ;\n` +
        `  eth:hasIdentifier ${ensIdentifierIri} .\n\n`,
    );
    
    // Emit NameIdentifierENS
    const ensDescriptorIriValue = identifierDescriptorIri(ensIdentifierIri, 'ens');
    accountChunks.push(
      `${ensIdentifierIri} a eth:NameIdentifierENS, core:Identifier, prov:Entity ;\n` +
        `  core:identifierType eth:IdentifierType_ens ;\n` +
        `  rdfs:label "${escapeTurtleString(ensName)}" ;\n` +
        `  core:hasDescriptor ${ensDescriptorIriValue} .\n\n`,
    );
    
    // Emit IdentifierDescriptor for NameIdentifierENS with DID
    accountChunks.push(
      `${ensDescriptorIriValue} a core:IdentifierDescriptor, core:Descriptor, prov:Entity ;\n` +
        `  core:hasDID ${ensDidIri} .\n\n`,
    );
    
    // Emit DID for ENS name (DID is a DecentralizedIdentifier, which is a type of Identifier)
    // DID identifies the NameIdentifierENS via identifies property
    // Note: hasDID is only for Descriptor → DID, not Identifier → DID
    accountChunks.push(
      `${ensDidIri} a core:DID, core:DecentralizedIdentifier, core:Identifier, prov:Entity ;\n` +
        `  core:identifies ${ensIdentifierIri} .\n\n`,
    );
  }
  
  if (row?.didAccount) lines.push(`  core:didAccount "${escapeTurtleString(String(row.didAccount))}" ;`);
  if (row?.didName) lines.push(`  core:didName "${escapeTurtleString(String(row.didName))}" ;`);
  if (row?.agentAccount) {
    lines.push(`  core:agentAccount "${escapeTurtleString(String(row.agentAccount))}" ;`);
    // Link to AccountIdentifier instance (agentAccount is the canonical on-chain address for the agent)
    const acctIri = accountIri(chainId, String(row.agentAccount));
    const accountIdentifierIriValue = accountIdentifierIri(chainId, String(row.agentAccount));
    // Link agent to AccountIdentifier via hasAccountIdentifier
    lines.push(`  eth:hasAccountIdentifier ${accountIdentifierIriValue} ;`);
    // Also link via core hasIdentifier for protocol-agnostic access
    lines.push(`  core:hasIdentifier ${accountIdentifierIriValue} ;`);
    
    // Emit AccountIdentifier instance
    const accountIdentifierLines: string[] = [];
    const accountDescriptorIriValue = identifierDescriptorIri(accountIdentifierIriValue, 'account');
    accountIdentifierLines.push(`${accountIdentifierIriValue} a eth:AccountIdentifier, core:Identifier, prov:Entity ;`);
    accountIdentifierLines.push(`  core:identifierType eth:IdentifierType_account ;`);
    accountIdentifierLines.push(`  core:hasDescriptor ${accountDescriptorIriValue} ;`);
    // Link Account -> AccountIdentifier (canonical direction in agentictrust-eth)
    accountChunks.push(`${acctIri} eth:hasIdentifier ${accountIdentifierIriValue} .\n\n`);
    // Link AccountIdentifier to DID if present
    if (row?.didAccount) {
      const didIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(String(row.didAccount))}>`;
      // Emit IdentifierDescriptor for AccountIdentifier with DID
      accountChunks.push(
        `${accountDescriptorIriValue} a core:IdentifierDescriptor, core:Descriptor, prov:Entity ;\n` +
          `  core:hasDID ${didIri} .\n\n`,
      );
      // Emit DID instance (DID is a DecentralizedIdentifier, which is a type of Identifier)
      // DID identifies the AccountIdentifier via identifies property
      // Note: hasDID is only for Descriptor → DID, not Identifier → DID
      accountChunks.push(
        `${didIri} a core:DID, core:DecentralizedIdentifier, core:Identifier, prov:Entity ;\n` +
          `  core:identifies ${accountIdentifierIriValue} .\n\n`,
      );
    } else {
      // Emit IdentifierDescriptor for AccountIdentifier without DID
      accountChunks.push(
        `${accountDescriptorIriValue} a core:IdentifierDescriptor, core:Descriptor, prov:Entity .\n\n`,
      );
    }
    accountChunks.push(accountIdentifierLines.join('\n') + ' .\n\n');
    
    // Emit Account instance with account properties
    const accountLines: string[] = [];
    accountLines.push(`${acctIri} a eth:Account, prov:Entity ;`);
    accountLines.push(`  eth:accountChainId ${chainId} ;`);
    accountLines.push(`  eth:accountAddress "${escapeTurtleString(String(row.agentAccount).toLowerCase())}" ;`);
    accountLines.push(`  eth:accountType "SmartAccount" ;`);
    accountLines.push(`  eth:hasIdentifier ${accountIdentifierIriValue} ;`);
    // Link Agent Account to EOA owner if present
    if (row?.eoaAgentAccount) {
      const eoaAddr = normalizeHex(String(row.eoaAgentAccount));
      if (eoaAddr) {
        const eoaIri = accountIri(chainId, eoaAddr);
        accountLines.push(`  eth:hasEOAOwner ${eoaIri} ;`);
        accountLines.push(`  eth:signingAuthority ${eoaIri} ;`);
        // Emit EOA Account instance
        ensureAccountNode(accountChunks, chainId, eoaAddr, 'EOA');
      }
    }
    accountLines.push(`  .\n`);
    accountChunks.push(accountLines.join('\n'));
  }
  if (row?.agentIdentityOwnerAccount) lines.push(`  core:agentIdentityOwnerAccount "${escapeTurtleString(String(row.agentIdentityOwnerAccount))}" ;`);
  if (row?.eoaAgentIdentityOwnerAccount) lines.push(`  core:eoaAgentIdentityOwnerAccount "${escapeTurtleString(String(row.eoaAgentIdentityOwnerAccount))}" ;`);
  if (row?.eoaAgentAccount) lines.push(`  core:eoaAgentAccount "${escapeTurtleString(String(row.eoaAgentAccount))}" ;`);
  if (row?.agentUri) {
    const tok = turtleIriOrLiteral(String(row.agentUri));
    if (tok) lines.push(`  core:agentUri ${tok} ;`);
  }
  if (row?.a2aEndpoint) {
    const tok = turtleIriOrLiteral(String(row.a2aEndpoint));
    if (tok) lines.push(`  core:a2aEndpoint ${tok} ;`);
  }
  // Removed: ensEndpoint / agentAccountEndpoint (columns removed; derive didName / CAIP10 when needed)
  if (row?.supportedTrust) lines.push(`  core:supportedTrust "${escapeTurtleString(String(row.supportedTrust))}" ;`);
  if (row?.createdAtTime) lines.push(`  core:createdAtTime ${Number(row.createdAtTime) || 0} ;`);
  if (row?.updatedAtTime) lines.push(`  core:updatedAtTime ${Number(row.updatedAtTime) || 0} ;`);
  if (row?.rawJson) lines.push(`  core:json ${turtleJsonLiteral(String(row.rawJson))} ;`);
  lines.push(`  .\n`);

  // Populate AgentDescriptor with OASF skills/domains from agent card + agentURI registration JSON (if present)
  // Agent card fields frequently look like:
  // - oasf_skills: ["natural_language_processing/summarization", ...]
  // - oasf_domains: ["finance_and_business/accounting", ...]
  const declaredOasfSkills = new Set<string>();
  const declaredOasfDomains = new Set<string>();
  const takeStrings = (value: any): string[] => (Array.isArray(value) ? value : []).filter((x) => typeof x === 'string').map((x) => x.trim()).filter(Boolean);

  for (const s of takeStrings((agentCard as any)?.oasf_skills)) declaredOasfSkills.add(s);
  for (const d of takeStrings((agentCard as any)?.oasf_domains)) declaredOasfDomains.add(d);
  for (const s of takeStrings((tokenUriData as any)?.oasf_skills)) declaredOasfSkills.add(s);
  for (const d of takeStrings((tokenUriData as any)?.oasf_domains)) declaredOasfDomains.add(d);

  // Also accept ERC-8004 registration endpoint-level arrays:
  // registration.endpoints[].a2aSkills / a2aDomains (common in registration-v1 payloads)
  if (tokenUriData && Array.isArray((tokenUriData as any).endpoints)) {
    for (const ep of (tokenUriData as any).endpoints) {
      if (!ep || typeof ep !== 'object') continue;
      for (const s of takeStrings((ep as any).a2aSkills)) declaredOasfSkills.add(s);
      for (const d of takeStrings((ep as any).a2aDomains)) declaredOasfDomains.add(d);
      // Some payloads use generic "skills/domains" in the endpoint object.
      for (const s of takeStrings((ep as any).skills)) declaredOasfSkills.add(s);
      for (const d of takeStrings((ep as any).domains)) declaredOasfDomains.add(d);
    }
  }

  // Extract all skills from rawJson and agentCardJson using comprehensive extraction
  const allExtractedSkills = extractAllSkills(row?.rawJson, row?.agentCardJson);
  const nonOasfSkills = new Set<string>();
  for (const skill of allExtractedSkills) {
    if (isOasfSkillId(skill)) {
      // Extract OASF skill key from full IRI if needed
      const oasfKey = skill.startsWith('https://agentictrust.io/ontology/oasf#skill/')
        ? skill.slice('https://agentictrust.io/ontology/oasf#skill/'.length)
        : skill;
      declaredOasfSkills.add(oasfKey);
    } else {
      // Non-OASF skill - add without reference tag
      nonOasfSkills.add(skill);
    }
  }

  // Emit AgentRegistration8004 or AgentDescriptor node and links
  const adLines: string[] = [];
  if (isERC8004) {
    adLines.push(`${adIri} a erc8004:AgentRegistration8004, core:AgentIdentityDescriptor, core:Descriptor, prov:Entity ;`);
  } else {
    adLines.push(`${adIri} a core:AgentDescriptor, core:Descriptor, prov:Entity ;`);
  }
  
  // Extract and populate data from rawJson (registration JSON) for ERC-8004 agents
  if (isERC8004 && tokenUriData) {
    // Name, Description, Image
    if (typeof tokenUriData?.name === 'string' && tokenUriData.name.trim()) {
      adLines.push(`  dcterms:title "${escapeTurtleString(tokenUriData.name.trim())}" ;`);
      adLines.push(`  rdfs:label "${escapeTurtleString(tokenUriData.name.trim())}" ;`);
    } else if (row?.agentName) {
      adLines.push(`  dcterms:title "${escapeTurtleString(String(row.agentName))}" ;`);
      adLines.push(`  rdfs:label "${escapeTurtleString(String(row.agentName))}" ;`);
    }
    
    if (typeof tokenUriData?.description === 'string' && tokenUriData.description.trim()) {
      adLines.push(`  dcterms:description "${escapeTurtleString(tokenUriData.description.trim())}" ;`);
    }
    
    if (tokenUriData?.image != null) {
      const imgUrl = String(tokenUriData.image).trim();
      if (imgUrl) {
        const imgIri = turtleIriOrLiteral(imgUrl);
        if (imgIri) adLines.push(`  schema:image ${imgIri} ;`);
      }
    } else if (row?.image) {
      const imgIri = turtleIriOrLiteral(String(row.image));
      if (imgIri) adLines.push(`  schema:image ${imgIri} ;`);
    }
    
    // Endpoints from rawJson
    const endpoints: any[] = Array.isArray(tokenUriData?.endpoints) ? tokenUriData.endpoints : [];
    for (const ep of endpoints) {
      const epName = typeof ep?.name === 'string' ? ep.name.trim().toLowerCase() : '';
      const epUrl = typeof ep?.endpoint === 'string' ? ep.endpoint.trim() : '';
      if (!epName || !epUrl) continue;
      
      const epIri = `<https://www.agentictrust.io/id/endpoint/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(epName)}>`;
      adLines.push(`  core:hasEndpoint ${epIri} ;`);
      
      // Determine endpoint type
      let endpointType = 'unknown';
      if (epName === 'a2a' || epName === 'agent') endpointType = 'a2a';
      else if (epName === 'mcp') endpointType = 'mcp';
      else if (epName === 'ens') endpointType = 'ens';
      else if (epName === 'agentwallet' || epName === 'agent-wallet') endpointType = 'agentAccount';
      
      const endpointTypeIri = `<https://agentictrust.io/ontology/core/endpointType/${endpointType}>`;
      const endpointLines: string[] = [];
      endpointLines.push(`${epIri} a core:Endpoint, prov:Entity ;`);
      endpointLines.push(`  core:endpointName "${escapeTurtleString(epName)}" ;`);
      const urlIri = turtleIriOrLiteral(epUrl);
      if (urlIri) endpointLines.push(`  core:endpointUrl ${urlIri} ;`);
      if (typeof ep?.version === 'string' && ep.version.trim()) {
        endpointLines.push(`  core:endpointVersion "${escapeTurtleString(ep.version.trim())}" ;`);
      }
      endpointLines.push(`  core:endpointType ${endpointTypeIri} ;`);
      endpointLines.push(`  .\n`);
      accountChunks.push(endpointLines.join('\n'));
      accountChunks.push(`${endpointTypeIri} a core:EndpointType, prov:Entity ; rdfs:label "${endpointType}" .\n\n`);
    }
    
    // Trust types/models from rawJson (ERC-8004 registration JSON)
    const supportedTrustRaw =
      Array.isArray(tokenUriData?.supportedTrust) ? tokenUriData.supportedTrust :
      Array.isArray(tokenUriData?.supportedTrusts) ? tokenUriData.supportedTrusts :
      (typeof tokenUriData?.supportedTrust === 'string' ? [tokenUriData.supportedTrust] : []);

    for (const trustTypeStr of supportedTrustRaw) {
      const trustTypeValue = String(trustTypeStr).trim();
      if (!trustTypeValue) continue;

      // Keep the existing TrustType emission (verbatim)
      const trustTypeIri = `<https://www.agentictrust.io/id/trust-type/${iriEncodeSegment(trustTypeValue)}>`;
      adLines.push(`  core:hasTrustType ${trustTypeIri} ;`);
      accountChunks.push(`${trustTypeIri} a core:TrustType, prov:Entity ; core:trustTypeValue "${escapeTurtleString(trustTypeValue)}" .\n\n`);

      // Also emit canonical TrustModel categories for discovery/UI
      const model = canonicalTrustModel(trustTypeValue);
      if (model) {
        const trustModelIri = `<https://agentictrust.io/ontology/core#TrustModel_${trustModelLocalName(model)}>`;
        adLines.push(`  core:hasTrustModel ${trustModelIri} ;`);
      }
    }
    
    // DIDs from rawJson (if any additional DIDs beyond the standard ones)
    if (typeof tokenUriData?.did === 'string' && tokenUriData.did.trim()) {
      const didValue = tokenUriData.did.trim();
      const didIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(didValue)}>`;
      adLines.push(`  core:hasDID ${didIri} ;`);
      accountChunks.push(`${didIri} a core:DID, core:DecentralizedIdentifier, prov:Entity .\n\n`);
    }
    
    // DomainName from rawJson (if agentName is a domain name)
    if (typeof tokenUriData?.name === 'string' && tokenUriData.name.trim()) {
      const nameValue = tokenUriData.name.trim();
      // Check if it's a domain name (contains dots but not .eth which is ENS)
      if (nameValue.includes('.') && !nameValue.endsWith('.eth')) {
        const domainNameIri = `<https://www.agentictrust.io/id/domain-name/${iriEncodeSegment(nameValue)}>`;
        adLines.push(`  core:hasDomainName ${domainNameIri} ;`);
        accountChunks.push(`${domainNameIri} a core:DomainName, prov:Entity ; core:domainNameValue "${escapeTurtleString(nameValue)}" .\n\n`);
      }
    }
  } else {
    // Non-ERC-8004 agents: use standard AgentDescriptor
    if (row?.agentName) adLines.push(`  rdfs:label "${escapeTurtleString(String(row.agentName))}" ;`);
  }
  
  // OASF Domains and Skills (for both ERC-8004 and non-ERC-8004)
  if (declaredOasfDomains.size) {
    for (const dom of declaredOasfDomains) {
      const domClassIri = oasfDomainIri(dom);
      const domIri = agentDomainIri(chainId, agentId, dom, didAccountValue);
      adLines.push(`  core:hasDomain ${domIri} ;`);
      accountChunks.push(`${domIri} a core:AgentDomain, prov:Entity ; core:hasDomainClassification ${domClassIri} .\n\n`);
      // Emit a minimal OASF Domain node (full node also emitted from DB if present)
      accountChunks.push(`${domClassIri} a oasf:Domain, prov:Entity ; oasf:key "${escapeTurtleString(dom)}" .\n\n`);
    }
  }
  if (declaredOasfSkills.size) {
    for (const sk of declaredOasfSkills) {
      const skClassIri = oasfSkillIri(sk);
      const skIri = agentSkillIri(chainId, agentId, sk, didAccountValue);
      adLines.push(`  core:hasSkill ${skIri} ;`);
      accountChunks.push(`${skIri} a core:AgentSkill, prov:Entity ; core:hasSkillClassification ${skClassIri} .\n\n`);
      // Emit a minimal OASF Skill node (full node also emitted from DB if present)
      accountChunks.push(`${skClassIri} a oasf:Skill, prov:Entity ; oasf:key "${escapeTurtleString(sk)}" .\n\n`);
    }
  }
  // Non-OASF skills (without reference tags)
  if (nonOasfSkills.size) {
    for (const sk of nonOasfSkills) {
      const skIri = agentSkillIri(chainId, agentId, sk, didAccountValue);
      const skClassIri = skillIri(chainId, agentId, sk, didAccountValue);
      adLines.push(`  core:hasSkill ${skIri} ;`);
      accountChunks.push(`${skIri} a core:AgentSkill, prov:Entity ; core:hasSkillClassification ${skClassIri} .\n\n`);
      // Create plain SkillClassification instance (no OASF reference)
      accountChunks.push(`${skClassIri} a core:AgentSkillClassification, prov:Entity ; core:skillId "${escapeTurtleString(sk)}" .\n\n`);
    }
  }
  adLines.push(`  .\n`);
  afterAgent.push(adLines.join('\n'));

  // Create IdentityDescriptor8004 from registration JSON (rawJson) if we have Identity8004
  if (row?.didIdentity) {
    const identity8004IriValue = identity8004Iri(chainId, agentId, row.didIdentity);
    const identityDescriptorIri = identity8004DescriptorIri(chainId, agentId, row.didIdentity);
    
    // Link Identity8004 to its Descriptor
    accountChunks.push(
      `${identity8004IriValue} core:hasDescriptor ${identityDescriptorIri} .\n\n`,
    );
    
    // Create IdentityDescriptor8004
    const descriptorLines: string[] = [];
    descriptorLines.push(`${identityDescriptorIri} a erc8004:IdentityDescriptor8004, core:IdentifierDescriptor, core:Descriptor, prov:Entity ;`);
    
    if (tokenUriData) {
      if (typeof tokenUriData?.name === 'string' && tokenUriData.name.trim()) {
        descriptorLines.push(`  rdfs:label "${escapeTurtleString(tokenUriData.name.trim())}" ;`);
      }
      if (typeof tokenUriData?.description === 'string' && tokenUriData.description.trim()) {
        descriptorLines.push(`  dcterms:description "${escapeTurtleString(tokenUriData.description.trim())}" ;`);
      }
      
      // Extract Skills from tokenUri
      const tokenSkills: any[] = Array.isArray(tokenUriData?.skills) ? tokenUriData.skills : [];
      for (const skill of tokenSkills) {
        const id = typeof skill?.id === 'string' ? skill.id.trim() : typeof skill === 'string' ? skill.trim() : '';
        if (!id) continue;
        const sClassIri = skillIri(chainId, agentId, id, didAccountValue);
        const sIri = agentSkillIri(chainId, agentId, id, didAccountValue);
        descriptorLines.push(`  core:hasSkill ${sIri} ;`);
        accountChunks.push(`${sIri} a core:AgentSkill, prov:Entity ; core:hasSkillClassification ${sClassIri} .\n\n`);
        
        // Create SkillClassification instance
        const skillLines: string[] = [];
        skillLines.push(`${sClassIri} a core:AgentSkillClassification, prov:Entity ;`);
        skillLines.push(`  core:skillId "${escapeTurtleString(id)}" ;`);
        if (typeof skill?.name === 'string' && skill.name.trim()) {
          skillLines.push(`  core:skillName "${escapeTurtleString(skill.name.trim())}" ;`);
        }
        if (typeof skill?.description === 'string' && skill.description.trim()) {
          skillLines.push(`  core:skillDescription "${escapeTurtleString(skill.description.trim())}" ;`);
        }
        
        // Extract Domain from skill (emit classification, but do NOT link via core:hasDomain since
        // core:hasDomain is now Descriptor -> AgentDomain)
        if (typeof skill?.domain === 'string' && skill.domain.trim()) {
          const domainName = skill.domain.trim();
          const domainClassIri = domainIri(domainName);
          accountChunks.push(`${domainClassIri} a core:AgentDomainClassification, prov:Entity ; rdfs:label "${escapeTurtleString(domainName)}" .\n\n`);
        }
        
        // Link IntentType to Skill via targetsSkill
        // Map skill domain to intent type (e.g., "validation" -> trust.validation)
        const skillDomain = typeof skill?.domain === 'string' ? skill.domain.trim() : '';
        if (skillDomain) {
          const intentTypeName = `trust.${skillDomain}`;
          accountChunks.push(`<${intentTypeIri(intentTypeName)}> core:targetsSkill ${sClassIri} .\n\n`);
        }
        
        // Extract tags
        const tags: any[] = Array.isArray(skill?.tags) ? skill.tags : [];
        for (const t of tags) {
          if (typeof t === 'string' && t.trim()) {
            const tagIri = `<https://www.agentictrust.io/id/tag/${iriEncodeSegment(t.trim())}>`;
            skillLines.push(`  core:hasTag ${tagIri} ;`);
            accountChunks.push(`${tagIri} a core:Tag, prov:Entity ; rdfs:label "${escapeTurtleString(t.trim())}" .\n\n`);
          }
        }
        
        skillLines.push(`  .\n`);
        accountChunks.push(skillLines.join('\n'));
      }
      
      // Extract Domain from top-level tokenUri data
      if (typeof tokenUriData?.domain === 'string' && tokenUriData.domain.trim()) {
        const domainName = tokenUriData.domain.trim();
        const domainClassIri = domainIri(domainName);
        const domainIriValue = agentDomainIri(chainId, agentId, domainName, didAccountValue);
        descriptorLines.push(`  core:hasDomain ${domainIriValue} ;`);
        accountChunks.push(`${domainIriValue} a core:AgentDomain, prov:Entity ; core:hasDomainClassification ${domainClassIri} .\n\n`);
        accountChunks.push(`${domainClassIri} a core:AgentDomainClassification, prov:Entity ; rdfs:label "${escapeTurtleString(domainName)}" .\n\n`);
      }
      
      // Extract Name, Description, Image for IdentityDescriptor8004
      if (typeof tokenUriData?.name === 'string' && tokenUriData.name.trim()) {
        descriptorLines.push(`  dcterms:title "${escapeTurtleString(tokenUriData.name.trim())}" ;`);
      }
      if (typeof tokenUriData?.description === 'string' && tokenUriData.description.trim()) {
        descriptorLines.push(`  dcterms:description "${escapeTurtleString(tokenUriData.description.trim())}" ;`);
      }
      if (tokenUriData?.image != null) {
        const imgUrl = String(tokenUriData.image).trim();
        if (imgUrl) {
          const imgIri = turtleIriOrLiteral(imgUrl);
          if (imgIri) descriptorLines.push(`  schema:image ${imgIri} ;`);
        }
      }
    }
    
    descriptorLines.push(`  .\n`);
    accountChunks.push(descriptorLines.join('\n'));
  }
  
  // A2A ServiceEndpoint + Protocol (+ descriptors) from agentCardJson
  // IMPORTANT:
  // - ServiceEndpoint has its own Descriptor (UI metadata for the endpoint)
  // - Protocol has its own Descriptor (UI metadata + agent-card.json capture)
  // - serviceUrl is attached to Protocol (not ServiceEndpoint)
  // - agent-card.json is captured in core:json on the Protocol's Descriptor (not on Protocol directly)
  const hasProtocolProps = 
    (typeof agentCard?.protocolVersion === 'string' && agentCard.protocolVersion.trim()) ||
    (typeof agentCard?.preferredTransport === 'string' && agentCard.preferredTransport.trim()) ||
    // Some agent cards use serviceUri/serviceUrl instead of url.
    (typeof agentCard?.serviceUri === 'string' && agentCard.serviceUri.trim()) ||
    (typeof agentCard?.serviceURL === 'string' && agentCard.serviceURL.trim()) ||
    (typeof agentCard?.serviceUrl === 'string' && agentCard.serviceUrl.trim()) ||
    (typeof agentCard?.url === 'string' && agentCard.url.trim()) ||
    (typeof agentCard?.name === 'string' && agentCard.name.trim()) ||
    (typeof agentCard?.description === 'string' && agentCard.description.trim()) ||
    (typeof agentCard?.version === 'string' && agentCard.version.trim()) ||
    Array.isArray(agentCard?.capabilities) ||
    Array.isArray(agentCard?.operators) ||
    Array.isArray(agentCard?.defaultInputModes) ||
    Array.isArray(agentCard?.defaultOutputModes);
  
  if (hasProtocolProps && agentCard && typeof agentCard === 'object') {
    // Use DID for service endpoint/protocol IRIs (protocol-agnostic, no chainId needed)
    const didForProtocol = iriEncodeSegment(didAccountValue);
    const serviceEndpointIri = `<https://www.agentictrust.io/id/service-endpoint/a2a/${didForProtocol}>`;
    const protocolIri = `<https://www.agentictrust.io/id/protocol/a2a/${didForProtocol}>`;
    const serviceEndpointDescriptorIri = `<https://www.agentictrust.io/id/descriptor/service-endpoint/a2a/${didForProtocol}>`;
    const protocolDescriptorIri = `<https://www.agentictrust.io/id/descriptor/protocol/a2a/${didForProtocol}>`;

    // Agent exposes service endpoints
    afterAgent.push(`${agentIri} core:hasServiceEndpoint ${serviceEndpointIri} .\n`);

    // Service endpoint node (descriptor + protocol link)
    const protocolDescriptorLines: string[] = [];
    protocolDescriptorLines.push(`${serviceEndpointIri} a core:ServiceEndpoint, core:Endpoint, prov:Entity ;`);
    protocolDescriptorLines.push(`  core:endpointName "a2a" ;`);
    protocolDescriptorLines.push(`  core:hasDescriptor ${serviceEndpointDescriptorIri} ;`);
    protocolDescriptorLines.push(`  core:hasProtocol ${protocolIri} .`);
    protocolDescriptorLines.push('');

    // Service endpoint descriptor (minimal UI metadata)
    protocolDescriptorLines.push(`${serviceEndpointDescriptorIri} a core:Descriptor, prov:Entity ;`);
    protocolDescriptorLines.push(`  dcterms:title "a2a" ;`);
    protocolDescriptorLines.push(`  rdfs:label "a2a" .`);
    protocolDescriptorLines.push('');

    // Protocol instance
    protocolDescriptorLines.push(`${protocolIri} a core:A2AProtocol, core:Protocol, prov:Entity ;`);
    protocolDescriptorLines.push(`  core:hasDescriptor ${protocolDescriptorIri} ;`);

    // serviceUrl lives on Protocol (not ServiceEndpoint)
    // Prefer agent-card's top-level `url`, else fall back to ERC-8004 registration endpoint URL.
    const agentCardUrl =
      (typeof agentCard?.serviceUri === 'string' ? agentCard.serviceUri.trim() : '') ||
      (typeof agentCard?.serviceURL === 'string' ? agentCard.serviceURL.trim() : '') ||
      (typeof agentCard?.serviceUrl === 'string' ? agentCard.serviceUrl.trim() : '') ||
      (typeof agentCard?.url === 'string' ? agentCard.url.trim() : '');
    let registrationA2aUrl = '';
    try {
      const eps: any[] = Array.isArray(tokenUriData?.endpoints) ? tokenUriData.endpoints : [];
      const match =
        eps.find((e) => typeof e?.name === 'string' && e.name.trim().toLowerCase() === 'a2a') ??
        eps.find((e) => typeof e?.name === 'string' && e.name.trim().toLowerCase() === 'agent') ??
        null;
      registrationA2aUrl = typeof match?.endpoint === 'string' ? match.endpoint.trim() : '';
    } catch {
      registrationA2aUrl = '';
    }
    const serviceUrlOut = agentCardUrl || registrationA2aUrl;
    if (serviceUrlOut) {
      const tok = turtleIriOrLiteral(serviceUrlOut);
      if (tok) protocolDescriptorLines.push(`  core:serviceUrl ${tok} ;`);
    }
    
    // Core protocol fields
    if (typeof agentCard?.protocolVersion === 'string' && agentCard.protocolVersion.trim())
      protocolDescriptorLines.push(`  core:protocolVersion "${escapeTurtleString(agentCard.protocolVersion.trim())}" ;`);
    if (typeof agentCard?.preferredTransport === 'string' && agentCard.preferredTransport.trim())
      protocolDescriptorLines.push(`  core:preferredTransport "${escapeTurtleString(agentCard.preferredTransport.trim())}" ;`);
    
    // Version field (use version if protocolVersion not already set)
    if (typeof agentCard?.version === 'string' && agentCard.version.trim()) {
      const hasProtocolVersion = protocolDescriptorLines.some(l => l.includes('protocolVersion'));
      if (!hasProtocolVersion) {
        protocolDescriptorLines.push(`  core:protocolVersion "${escapeTurtleString(agentCard.version.trim())}" ;`);
      }
    }

    // Close protocol instance before starting the descriptor node
    if (protocolDescriptorLines.length) {
      const last = protocolDescriptorLines[protocolDescriptorLines.length - 1];
      protocolDescriptorLines[protocolDescriptorLines.length - 1] = last.replace(/ ;$/, ' .');
    }
    protocolDescriptorLines.push('');

    // Protocol descriptor (UI metadata + agent-card.json capture)
    protocolDescriptorLines.push(`${protocolDescriptorIri} a core:Descriptor, prov:Entity ;`);
    try {
      // Lossless capture of agent-card JSON for this protocol (if present)
      if (typeof agentCardJsonText === 'string' && agentCardJsonText.trim()) {
        protocolDescriptorLines.push(`  core:json ${turtleJsonLiteral(agentCardJsonText)} ;`);
      }
    } catch {}
    if (typeof agentCard?.name === 'string' && agentCard.name.trim()) {
      protocolDescriptorLines.push(`  dcterms:title "${escapeTurtleString(agentCard.name.trim())}" ;`);
      protocolDescriptorLines.push(`  rdfs:label "${escapeTurtleString(agentCard.name.trim())}" ;`);
    }
    if (typeof agentCard?.description === 'string' && agentCard.description.trim())
      protocolDescriptorLines.push(`  dcterms:description "${escapeTurtleString(agentCard.description.trim())}" ;`);
    if (agentCard?.image != null) {
      const imgUrl = String(agentCard.image).trim();
      if (imgUrl) {
        const imgIri = turtleIriOrLiteral(imgUrl);
        if (imgIri) protocolDescriptorLines.push(`  schema:image ${imgIri} ;`);
      }
    }
    
    // Capabilities (array of strings)
    const capabilities: any[] = Array.isArray(agentCard?.capabilities) ? agentCard.capabilities : [];
    for (const cap of capabilities) {
      if (typeof cap === 'string' && cap.trim()) {
        const capIri = `<https://www.agentictrust.io/id/capability/${iriEncodeSegment(cap.trim())}>`;
        protocolDescriptorLines.push(`  core:hasCapability ${capIri} ;`);
        accountChunks.push(`${capIri} a core:Capability, prov:Entity ; rdfs:label "${escapeTurtleString(cap.trim())}" .\n\n`);
      }
    }
    
    // Operators (array of strings)
    const operators: any[] = Array.isArray(agentCard?.operators) ? agentCard.operators : [];
    for (const op of operators) {
      if (typeof op === 'string' && op.trim()) {
        const opIri = `<https://www.agentictrust.io/id/operator/${iriEncodeSegment(op.trim())}>`;
        protocolDescriptorLines.push(`  core:hasOperator ${opIri} ;`);
        accountChunks.push(`${opIri} a core:Operator, prov:Entity ; rdfs:label "${escapeTurtleString(op.trim())}" .\n\n`);
      }
    }
    
    // Default input/output modes
    const inputModes: any[] = Array.isArray(agentCard?.defaultInputModes) ? agentCard.defaultInputModes : [];
    for (const mode of inputModes) {
      if (typeof mode === 'string' && mode.trim()) {
        const modeIri = `<https://www.agentictrust.io/id/input-mode/${iriEncodeSegment(mode.trim())}>`;
        protocolDescriptorLines.push(`  core:hasDefaultInputMode ${modeIri} ;`);
        accountChunks.push(`${modeIri} a core:InputMode, prov:Entity ; rdfs:label "${escapeTurtleString(mode.trim())}" .\n\n`);
      }
    }
    
    const outputModes: any[] = Array.isArray(agentCard?.defaultOutputModes) ? agentCard.defaultOutputModes : [];
    for (const mode of outputModes) {
      if (typeof mode === 'string' && mode.trim()) {
        const modeIri = `<https://www.agentictrust.io/id/output-mode/${iriEncodeSegment(mode.trim())}>`;
        protocolDescriptorLines.push(`  core:hasDefaultOutputMode ${modeIri} ;`);
        accountChunks.push(`${modeIri} a core:OutputMode, prov:Entity ; rdfs:label "${escapeTurtleString(mode.trim())}" .\n\n`);
      }
    }
    
    // Remove trailing semicolon and close
    if (protocolDescriptorLines.length > 0) {
      const lastLine = protocolDescriptorLines[protocolDescriptorLines.length - 1];
      protocolDescriptorLines[protocolDescriptorLines.length - 1] = lastLine.replace(/ ;$/, ' .');
      afterAgent.push(protocolDescriptorLines.join('\n') + '\n');
    }
  }

  // Skills from agentCard (A2A protocol) - these are protocol-specific, not identity-level
  // Note: Skills from tokenUri are handled in 8004IdentityDescriptor section above
  const skills: any[] = Array.isArray(agentCard?.skills) ? agentCard.skills : [];
  
  // Skills + examples + tags from agentCard (for A2A protocol)
  const allTags: string[] = [];
  for (const skill of skills) {
    const id = typeof skill?.id === 'string' ? skill.id.trim() : '';
    if (!id) continue;
    const sIri = skillIri(chainId, agentId, id, didAccountValue);
    const afterSkill: string[] = [];
    lines.push(`${sIri} a core:AgentSkillClassification, prov:Entity ;`);
    lines.push(`  core:skillId "${escapeTurtleString(id)}" ;`);
    if (typeof skill?.name === 'string' && skill.name.trim()) lines.push(`  core:skillName "${escapeTurtleString(skill.name.trim())}" ;`);
    if (typeof skill?.description === 'string' && skill.description.trim())
      lines.push(`  core:skillDescription "${escapeTurtleString(skill.description.trim())}" ;`);

    const inputSchema =
      skill?.inputSchema && typeof skill.inputSchema === 'object' ? skill.inputSchema :
      skill?.input_schema && typeof skill.input_schema === 'object' ? skill.input_schema :
      null;
    if (inputSchema) {
      const schemaIri = skillSchemaIri(chainId, agentId, id, 'input', didAccountValue);
      lines.push(`  core:hasInputSchema ${schemaIri} ;`);
      try {
        afterSkill.push(`${schemaIri} a core:JsonSchema, prov:Entity ;`);
        afterSkill.push(`  core:schemaJson ${turtleJsonLiteral(JSON.stringify(inputSchema))} ;`);
        afterSkill.push(`  .\n`);
      } catch {
        // ignore
      }
    }

    const outputSchema =
      skill?.outputSchema && typeof skill.outputSchema === 'object' ? skill.outputSchema :
      skill?.output_schema && typeof skill.output_schema === 'object' ? skill.output_schema :
      null;
    if (outputSchema) {
      const schemaIri = skillSchemaIri(chainId, agentId, id, 'output', didAccountValue);
      lines.push(`  core:hasOutputSchema ${schemaIri} ;`);
      try {
        afterSkill.push(`${schemaIri} a core:JsonSchema, prov:Entity ;`);
        afterSkill.push(`  core:schemaJson ${turtleJsonLiteral(JSON.stringify(outputSchema))} ;`);
        afterSkill.push(`  .\n`);
      } catch {
        // ignore
      }
    }

    const tags: any[] = Array.isArray(skill?.tags) ? skill.tags : [];
    for (const t of tags) {
      if (typeof t === 'string' && t.trim()) {
        const tag = t.trim();
        allTags.push(tag);
        const tagIri = `<https://www.agentictrust.io/id/tag/${iriEncodeSegment(tag)}>`;
        lines.push(`  core:hasTag ${tagIri} ;`);
      }
    }

    const examples: any[] = Array.isArray(skill?.examples) ? skill.examples : [];
    let exampleIndex = 0;
    for (const ex of examples) {
      exampleIndex += 1;
      const exIri = `<https://www.agentictrust.io/id/example/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(id)}/${exampleIndex}>`;
      lines.push(`  core:hasExample ${exIri} ;`);

      const title = typeof ex?.title === 'string' ? ex.title.trim() : '';
      afterSkill.push(`${exIri} a core:SkillExample, prov:Entity ;`);
      if (title) afterSkill.push(`  rdfs:label "${escapeTurtleString(title)}" ;`);
      try {
        afterSkill.push(`  core:json ${turtleJsonLiteral(JSON.stringify(ex))} ;`);
      } catch {
        // ignore
      }
      afterSkill.push(`  .\n`);
    }

    lines.push(`  .\n`);
    if (afterSkill.length) lines.push(afterSkill.join('\n'));
  }

  // Append protocol descriptor after agent descriptor
  if (afterAgent.length) lines.push(afterAgent.join('\n'));

  // Tag individuals (duplicates are OK in Turtle, but we de-dupe within this agent)
  for (const t of Array.from(new Set(allTags))) {
    const tagIri = `<https://www.agentictrust.io/id/tag/${iriEncodeSegment(t)}>`;
    lines.push(`${tagIri} a core:Tag, prov:Entity ; rdfs:label "${escapeTurtleString(t)}" .`);
  }
  lines.push('');

  return lines.join('\n');
}

function renderAgentNodeWithoutCard(row: any, accountChunks: string[]): string {
  const chainId = Number(row?.chainId ?? 0) || 0;
  const agentId = String(row?.agentId ?? '');
  const acctNorm = normalizeHex(row?.agentAccount) ?? null;
  if (!acctNorm) return '';
  const acctIri = accountIri(chainId, acctNorm);
  const aIri = acctIri;

  const didAccountValue =
    typeof row?.didAccount === 'string' && row.didAccount.trim()
      ? row.didAccount.trim()
      : `did:ethr:${chainId}:${acctNorm.toLowerCase()}`;

  const lines: string[] = [];
  lines.push(`${aIri} a core:AIAgent, prov:SoftwareAgent ;`);
  lines.push(`  a eth:Account ;`);
  lines.push(`  core:agentId "${escapeTurtleString(String(agentId))}" ;`);
  // Agent name is represented via AgentDescriptor (dcterms:title), not as a direct Agent property.
  
  // Identity8004 and IdentityIdentifier8004 for didIdentity
  if (row?.didIdentity) {
    const didIdentityIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(String(row.didIdentity))}>`;
    
    // Create Identity8004 instance
    const identity8004IriValue = identity8004Iri(chainId, agentId, row.didIdentity);
    lines.push(`  core:hasIdentity ${identity8004IriValue} ;`);
    
    // Create IdentityIdentifier8004 instance
    const identityIdentifierIri = identifierIri(chainId, agentId, '8004', row.didIdentity);
    
    // Emit AgentIdentity8004
    accountChunks.push(
      `${identity8004IriValue} a erc8004:AgentIdentity8004, prov:Entity ;\n` +
        `  core:hasIdentifier ${identityIdentifierIri} .\n\n`,
    );
    
    // Emit IdentityIdentifier8004
    const identityDescriptorIriValue = identifierDescriptorIri(identityIdentifierIri, '8004');
    accountChunks.push(
      `${identityIdentifierIri} a erc8004:IdentityIdentifier8004, core:UniversalIdentifier, core:Identifier, prov:Entity ;\n` +
        `  core:identifierType erc8004:IdentifierType_8004 ;\n` +
        `  core:hasDescriptor ${identityDescriptorIriValue} .\n\n`,
    );
    
    // Emit IdentifierDescriptor for IdentityIdentifier8004 with DID
    accountChunks.push(
      `${identityDescriptorIriValue} a core:IdentifierDescriptor, core:Descriptor, prov:Entity ;\n` +
        `  core:hasDID ${didIdentityIri} .\n\n`,
    );
    
    // Emit DID instance (DID is a DecentralizedIdentifier, which is a type of Identifier)
    // DID identifies the IdentityIdentifier8004 via identifies property
    // Note: hasDID is only for Descriptor → DID, not Identifier → DID
    accountChunks.push(
      `${didIdentityIri} a core:DID, core:DecentralizedIdentifier, core:Identifier, prov:Entity ;\n` +
        `  core:identifies ${identityIdentifierIri} .\n\n`,
    );
  }
  
  // NameIdentifierENS and NameENS for agentName ending in .eth
  if (row?.agentName && isValidENSName(String(row.agentName))) {
    const ensName = String(row.agentName).trim();
    const ensDid = row?.didName || `did:ens:${chainId}:${ensName}`;
    const ensDidIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(ensDid)}>`;
    
    // Create NameIdentifierENS instance
    const ensIdentifierIri = identifierIri(chainId, agentId, 'ens', null, ensName);
    // Link agent directly to NameENSIdentifier via hasIdentifier
    lines.push(`  core:hasIdentifier ${ensIdentifierIri} ;`);
    
    // Create NameENS instance
    const ensNameIriValue = ensNameIri(chainId, ensName);
    lines.push(`  core:hasName ${ensNameIriValue} ;`);
    
    // Emit NameENS
    accountChunks.push(
      `${ensNameIriValue} a eth:AgentNameENS, core:AgentName, prov:Entity ;\n` +
        `  eth:ensName "${escapeTurtleString(ensName)}" ;\n` +
        `  eth:ensChainId ${chainId} ;\n` +
        `  eth:hasIdentifier ${ensIdentifierIri} .\n\n`,
    );
    
    // Emit NameIdentifierENS
    const ensDescriptorIriValue = identifierDescriptorIri(ensIdentifierIri, 'ens');
    accountChunks.push(
      `${ensIdentifierIri} a eth:NameIdentifierENS, core:Identifier, prov:Entity ;\n` +
        `  core:identifierType eth:IdentifierType_ens ;\n` +
        `  rdfs:label "${escapeTurtleString(ensName)}" ;\n` +
        `  core:hasDescriptor ${ensDescriptorIriValue} .\n\n`,
    );
    
    // Emit IdentifierDescriptor for NameIdentifierENS with DID
    accountChunks.push(
      `${ensDescriptorIriValue} a core:IdentifierDescriptor, core:Descriptor, prov:Entity ;\n` +
        `  core:hasDID ${ensDidIri} .\n\n`,
    );
    
    // Emit DID for ENS name (DID is a DecentralizedIdentifier, which is a type of Identifier)
    // DID identifies the NameIdentifierENS via identifies property
    // Note: hasDID is only for Descriptor → DID, not Identifier → DID
    accountChunks.push(
      `${ensDidIri} a core:DID, core:DecentralizedIdentifier, core:Identifier, prov:Entity ;\n` +
        `  core:identifies ${ensIdentifierIri} .\n\n`,
    );
  }
  
  if (row?.didAccount) lines.push(`  core:didAccount "${escapeTurtleString(String(row.didAccount))}" ;`);
  if (row?.didName) lines.push(`  core:didName "${escapeTurtleString(String(row.didName))}" ;`);
  if (row?.agentAccount) {
    lines.push(`  core:agentAccount "${escapeTurtleString(String(row.agentAccount))}" ;`);
    // Link to AccountIdentifier instance (agentAccount is the canonical on-chain address for the agent)
    const acctIri = accountIri(chainId, String(row.agentAccount));
    const accountIdentifierIriValue = accountIdentifierIri(chainId, String(row.agentAccount));
    // Link agent to AccountIdentifier via hasAccountIdentifier
    lines.push(`  eth:hasAccountIdentifier ${accountIdentifierIriValue} ;`);
    // Also link via core hasIdentifier for protocol-agnostic access
    lines.push(`  core:hasIdentifier ${accountIdentifierIriValue} ;`);
    
    // Emit AccountIdentifier instance
    const accountIdentifierLines: string[] = [];
    const accountDescriptorIriValue = identifierDescriptorIri(accountIdentifierIriValue, 'account');
    accountIdentifierLines.push(`${accountIdentifierIriValue} a eth:AccountIdentifier, core:Identifier, prov:Entity ;`);
    accountIdentifierLines.push(`  core:identifierType eth:IdentifierType_account ;`);
    accountIdentifierLines.push(`  core:hasDescriptor ${accountDescriptorIriValue} ;`);
    // Link Account -> AccountIdentifier (canonical direction in agentictrust-eth)
    accountChunks.push(`${acctIri} eth:hasIdentifier ${accountIdentifierIriValue} .\n\n`);
    // Link AccountIdentifier to DID if present
    if (row?.didAccount) {
      const didIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(String(row.didAccount))}>`;
      // Emit IdentifierDescriptor for AccountIdentifier with DID
      accountChunks.push(
        `${accountDescriptorIriValue} a core:IdentifierDescriptor, core:Descriptor, prov:Entity ;\n` +
          `  core:hasDID ${didIri} .\n\n`,
      );
      // Emit DID instance (DID is a DecentralizedIdentifier, which is a type of Identifier)
      // DID identifies the AccountIdentifier via identifies property
      // Note: hasDID is only for Descriptor → DID, not Identifier → DID
      accountChunks.push(
        `${didIri} a core:DID, core:DecentralizedIdentifier, core:Identifier, prov:Entity ;\n` +
          `  core:identifies ${accountIdentifierIriValue} .\n\n`,
      );
    } else {
      // Emit IdentifierDescriptor for AccountIdentifier without DID
      accountChunks.push(
        `${accountDescriptorIriValue} a core:IdentifierDescriptor, core:Descriptor, prov:Entity .\n\n`,
      );
    }
    accountChunks.push(accountIdentifierLines.join('\n') + ' .\n\n');
    
    // Emit Account instance with account properties
    const accountLines: string[] = [];
    accountLines.push(`${acctIri} a eth:Account, prov:Entity ;`);
    accountLines.push(`  eth:accountChainId ${chainId} ;`);
    accountLines.push(`  eth:accountAddress "${escapeTurtleString(String(row.agentAccount).toLowerCase())}" ;`);
    accountLines.push(`  eth:accountType "SmartAccount" ;`);
    accountLines.push(`  eth:hasIdentifier ${accountIdentifierIriValue} ;`);
    // Link Agent Account to EOA owner if present
    if (row?.eoaAgentAccount) {
      const eoaAddr = normalizeHex(String(row.eoaAgentAccount));
      if (eoaAddr) {
        const eoaIri = accountIri(chainId, eoaAddr);
        accountLines.push(`  eth:hasEOAOwner ${eoaIri} ;`);
        accountLines.push(`  eth:signingAuthority ${eoaIri} ;`);
        // Emit EOA Account instance
        ensureAccountNode(accountChunks, chainId, eoaAddr, 'EOA');
      }
    }
    accountLines.push(`  .\n`);
    accountChunks.push(accountLines.join('\n'));
  }
  if (row?.agentIdentityOwnerAccount) lines.push(`  core:agentIdentityOwnerAccount "${escapeTurtleString(String(row.agentIdentityOwnerAccount))}" ;`);
  if (row?.eoaAgentIdentityOwnerAccount) lines.push(`  core:eoaAgentIdentityOwnerAccount "${escapeTurtleString(String(row.eoaAgentIdentityOwnerAccount))}" ;`);
  if (row?.eoaAgentAccount) lines.push(`  core:eoaAgentAccount "${escapeTurtleString(String(row.eoaAgentAccount))}" ;`);
  if (row?.agentUri) {
    const tok = turtleIriOrLiteral(String(row.agentUri));
    if (tok) lines.push(`  core:agentUri ${tok} ;`);
  }
  if (row?.a2aEndpoint) {
    const tok = turtleIriOrLiteral(String(row.a2aEndpoint));
    if (tok) lines.push(`  core:a2aEndpoint ${tok} ;`);
  }
  // Removed: ensEndpoint / agentAccountEndpoint (columns removed; derive didName / CAIP10 when needed)
  if (row?.supportedTrust) lines.push(`  core:supportedTrust "${escapeTurtleString(String(row.supportedTrust))}" ;`);
  if (row?.createdAtTime) lines.push(`  core:createdAtTime ${Number(row.createdAtTime) || 0} ;`);
  if (row?.updatedAtTime) lines.push(`  core:updatedAtTime ${Number(row.updatedAtTime) || 0} ;`);
  if (row?.rawJson) lines.push(`  core:json ${turtleJsonLiteral(String(row.rawJson))} ;`);
  lines.push(`  .\n`);

  return lines.join('\n');
}

async function exportAgentsRdfInternal(
  db: AnyDb,
  onlyAgent?: ExportOneAgent,
): Promise<{ outPath: string; bytes: number; agentCount: number }> {
  const safeAll = async (sql: string, ...params: any[]) => {
    try {
      const res = await db.prepare(sql).all(...params);
      return Array.isArray(res) ? res : Array.isArray((res as any)?.results) ? (res as any).results : [];
    } catch {
      return [];
    }
  };

  const allAgentsForMaps = await safeAll(`
    SELECT chainId, agentId, agentName, agentAccount, agentIdentityOwnerAccount, eoaAgentIdentityOwnerAccount, eoaAgentAccount, didIdentity, didAccount
    FROM agents
  `);
  const agentMetaByKey = new Map<
    string,
    {
      chainId: number;
      agentId: string;
      agentName?: string | null;
      didIdentity?: string | null;
      didAccount?: string | null;
      agentAnchorIri?: string | null; // Turtle IRI token like `<https://...>`
      identity8004Iri?: string | null; // Turtle IRI token like `<https://...>`
    }
  >();
  const agentByAccountKey = new Map<string, string>(); // `${chainId}|${addrLower}` -> agentIri
  const agentByAccountIdentifierIri = new Map<string, string>(); // `<.../account-identifier/chainId/addr>` -> agentIri
  const agentByAccountSuffixKey = new Map<string, string>(); // `${chainId}|${last40}` -> agentIri (supports prefixed account ids)
  const agentKeyByAccountKey = new Map<string, { chainId: number; agentId: string }>(); // `${chainId}|${addrLower}` -> {chainId, agentId}
  for (const row of allAgentsForMaps) {
    const chainId = Number(row?.chainId ?? 0) || 0;
    const agentId = String(row?.agentId ?? '');
    if (!agentId) continue;
    const key = `${chainId}|${agentId}`;
    const didIdentityRaw = row?.didIdentity != null ? String(row.didIdentity) : null;
    const didIdentity = didIdentityRaw && didIdentityRaw.trim() ? didIdentityRaw.trim() : `did:8004:${chainId}:${agentId}`;
    const didAccount = row?.didAccount != null ? String(row.didAccount) : null;
    const anchorAddr = normalizeHexFromAccountId(row?.agentAccount) ?? null;
    const agentAnchorIri = anchorAddr ? accountIri(chainId, anchorAddr) : null;
    const identity8004 = didIdentity ? identity8004Iri(chainId, agentId, didIdentity) : null;
    agentMetaByKey.set(key, {
      chainId,
      agentId,
      agentName: row?.agentName != null ? String(row.agentName) : null,
      didIdentity,
      didAccount,
      agentAnchorIri,
      identity8004Iri: identity8004,
    });
    const acctForAgent = anchorAddr;
    const aIri = agentAnchorIri;
    if (!aIri) continue;
    const acct = normalizeHexFromAccountId(row?.agentAccount);
    const owner = normalizeHexFromAccountId(row?.agentIdentityOwnerAccount);
    const eoa = normalizeHexFromAccountId(row?.eoaAgentIdentityOwnerAccount);

    const indexAccountIdentifier = (address: string | null) => {
      if (!address) return;
      try {
        agentByAccountIdentifierIri.set(accountIdentifierIri(chainId, address), aIri);
      } catch {
        // ignore invalid addresses
      }
    };

    const indexAccountSuffix = (address: string | null) => {
      if (!address) return;
      const norm = normalizeHex(address);
      if (!norm) return;
      const last40 = norm.replace(/^0x/i, '').slice(-40);
      if (last40.length === 40) {
        agentByAccountSuffixKey.set(`${chainId}|${last40}`, aIri);
      }
    };
    if (acct) {
      const k = `${chainId}|${acct}`;
      agentByAccountKey.set(k, aIri);
      agentKeyByAccountKey.set(k, { chainId, agentId });
      indexAccountIdentifier(acct);
      indexAccountSuffix(acct);
    }
    // Bridge relationship assertions to agents even when ERC-8092 initiator/approver addresses correspond
    // to the agent's owner EOAs (not the agent account / smart account).
    if (owner) {
      const k = `${chainId}|${owner}`;
      agentByAccountKey.set(k, aIri);
      agentKeyByAccountKey.set(k, { chainId, agentId });
      indexAccountIdentifier(owner);
      indexAccountSuffix(owner);
    }
    if (eoa) {
      const k = `${chainId}|${eoa}`;
      agentByAccountKey.set(k, aIri);
      agentKeyByAccountKey.set(k, { chainId, agentId });
      indexAccountIdentifier(eoa);
      indexAccountSuffix(eoa);
    }
  }

  const agentSql = onlyAgent
    ? `
      SELECT
        chainId, agentId, agentName, agentIdentityOwnerAccount, eoaAgentIdentityOwnerAccount, agentCategory, agentUri,
        a2aEndpoint,
        didIdentity, didAccount, didName,
        agentAccount,
        supportedTrust,
        rawJson,
        agentCardJson,
        agentCardReadAt,
        createdAtTime,
        updatedAtTime,
        description,
        image,
        type
      FROM agents
      WHERE chainId = ? AND agentId = ?
    `
    : `
      SELECT
        chainId, agentId, agentName, agentIdentityOwnerAccount, eoaAgentIdentityOwnerAccount, agentCategory, agentUri,
        a2aEndpoint,
        didIdentity, didAccount, didName,
        agentAccount,
        supportedTrust,
        rawJson,
        agentCardJson,
        agentCardReadAt,
        createdAtTime,
        updatedAtTime,
        description,
        image,
        type
      FROM agents
      ORDER BY chainId ASC, LENGTH(agentId) ASC, agentId ASC
    `;
  
  // Use streaming query if supported, otherwise load all
  let rows: any;
  if (db.prepare && typeof db.prepare === 'function') {
    const stmt = db.prepare(agentSql);
    if (stmt.bind && typeof stmt.bind === 'function') {
      rows = await stmt.bind(...(onlyAgent ? [onlyAgent.chainId, onlyAgent.agentId] : [])).all();
    } else {
      rows = await stmt.all(...(onlyAgent ? [onlyAgent.chainId, onlyAgent.agentId] : []));
    }
  } else {
    rows = await db.prepare(agentSql).all(...(onlyAgent ? [onlyAgent.chainId, onlyAgent.agentId] : []));
  }

  const agentRows: any[] = Array.isArray(rows) ? rows : Array.isArray((rows as any)?.results) ? (rows as any).results : [];
  
  // Log progress for large exports
  if (!onlyAgent && agentRows.length > 100) {
    console.log(`[rdf-export] Processing ${agentRows.length} agents...`);
  }

  const chunks: string[] = [];
  chunks.push(rdfPrefixesForAgent(onlyAgent));

  const emittedAgents = new Set<string>(); // `${chainId}|${agentId}`
  const ensureAgentNode = (chainId: number, agentId: string) => {
    const key = `${chainId}|${agentId}`;
    if (emittedAgents.has(key)) return;
    emittedAgents.add(key);
    const meta = agentMetaByKey.get(key);
    const ai = meta?.agentAnchorIri ? String(meta.agentAnchorIri) : null;
    if (!ai) return;
    const lines: string[] = [];
    lines.push(`${ai} a core:AIAgent, prov:SoftwareAgent, eth:Account ;`);
    lines.push(`  core:agentId "${escapeTurtleString(String(agentId))}" ;`);
    // Agent name is represented via AgentDescriptor (dcterms:title), not as a direct Agent property.
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  };

  let included = 0;
  const totalRows = agentRows.length;
  for (let i = 0; i < agentRows.length; i++) {
    const row = agentRows[i];
    const chainId = Number(row?.chainId ?? 0) || 0;
    const agentId = String(row?.agentId ?? '');
    if (!agentId) continue;

    const key = `${chainId}|${agentId}`;
    if (emittedAgents.has(key)) {
      continue;
    }

    // Progress logging for large exports
    if (!onlyAgent && totalRows > 500 && (i + 1) % 500 === 0) {
      console.log(`[rdf-export] Processed ${i + 1}/${totalRows} agents (${included} included)...`);
    }

    const agentCardJsonText = row?.agentCardJson != null ? String(row.agentCardJson) : '';
    if (agentCardJsonText.trim()) {
      let agentCard: any = null;
      try {
        agentCard = JSON.parse(agentCardJsonText);
      } catch {
        agentCard = null;
      }
      if (agentCard && typeof agentCard === 'object') {
        emittedAgents.add(key);
        chunks.push(renderAgentSection(row, agentCard, agentCardJsonText, chunks));
        included += 1;
        continue;
      }
    }

    emittedAgents.add(key);
    chunks.push(renderAgentNodeWithoutCard(row, chunks));
    included += 1;
  }

  // ---- OASF vocabulary (domains, skills, categories, dictionary) ----
  // Best-effort: if tables do not exist, skip without failing export.
  const oasfDomainCats = await safeAll('SELECT * FROM oasf_domain_categories');
  const oasfSkillCats = await safeAll('SELECT * FROM oasf_skill_categories');
  const oasfDomains = await safeAll('SELECT * FROM oasf_domains');
  const oasfSkills = await safeAll('SELECT * FROM oasf_skills');
  const oasfDictEntries = await safeAll('SELECT * FROM oasf_dictionary_entries');

  if (oasfDomainCats.length || oasfSkillCats.length || oasfDomains.length || oasfSkills.length || oasfDictEntries.length) {
    chunks.push('\n# ---- OASF vocabulary (synced from GitHub) ----\n');
  }

  for (const c of oasfDomainCats) {
    const key = String(c?.key ?? '').trim();
    if (!key) continue;
    const iri = oasfCategoryIri('domain', key);
    const caption = c?.caption != null ? String(c.caption) : key;
    const description = c?.description != null ? String(c.description) : '';
    const uid = c?.uid != null ? Number(c.uid) : null;
    const schemaJson = c?.schemaJson != null ? String(c.schemaJson) : '';
    const lines: string[] = [];
    lines.push(`${iri} a prov:Entity ;`);
    lines.push(`  rdfs:label "${escapeTurtleString(caption)}" ;`);
    if (description.trim()) lines.push(`  rdfs:comment "${escapeTurtleString(description)}" ;`);
    if (Number.isFinite(uid as any)) lines.push(`  core:oasfUid ${Math.trunc(uid as any)} ;`);
    if (schemaJson.trim()) lines.push(`  core:oasfSchemaJson """${escapeTurtleString(schemaJson)}"""^^xsd:string ;`);
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  }

  for (const c of oasfSkillCats) {
    const key = String(c?.key ?? '').trim();
    if (!key) continue;
    const iri = oasfCategoryIri('skill', key);
    const caption = c?.caption != null ? String(c.caption) : key;
    const description = c?.description != null ? String(c.description) : '';
    const uid = c?.uid != null ? Number(c.uid) : null;
    const schemaJson = c?.schemaJson != null ? String(c.schemaJson) : '';
    const lines: string[] = [];
    lines.push(`${iri} a prov:Entity ;`);
    lines.push(`  rdfs:label "${escapeTurtleString(caption)}" ;`);
    if (description.trim()) lines.push(`  rdfs:comment "${escapeTurtleString(description)}" ;`);
    if (Number.isFinite(uid as any)) lines.push(`  core:oasfUid ${Math.trunc(uid as any)} ;`);
    if (schemaJson.trim()) lines.push(`  core:oasfSchemaJson """${escapeTurtleString(schemaJson)}"""^^xsd:string ;`);
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  }

  for (const d of oasfDomains) {
    const domainId = String(d?.domainId ?? '').trim();
    if (!domainId) continue;
    const iri = oasfDomainIri(domainId);
    const caption = d?.caption != null ? String(d.caption) : domainId;
    const description = d?.description != null ? String(d.description) : '';
    const uid = d?.uid != null ? Number(d.uid) : null;
    const extendsKey = d?.extendsKey != null ? String(d.extendsKey) : '';
    const schemaJson = d?.schemaJson != null ? String(d.schemaJson) : '';
    const githubPath = d?.githubPath != null ? String(d.githubPath) : '';
    const githubSha = d?.githubSha != null ? String(d.githubSha) : '';
    const lines: string[] = [];
    lines.push(`${iri} a oasf:Domain, prov:Entity ;`);
    lines.push(`  oasf:key "${escapeTurtleString(domainId)}" ;`);
    lines.push(`  rdfs:label "${escapeTurtleString(caption)}" ;`);
    if (description.trim()) lines.push(`  rdfs:comment "${escapeTurtleString(description)}" ;`);
    if (Number.isFinite(uid as any)) lines.push(`  core:oasfUid ${Math.trunc(uid as any)} ;`);
    if (extendsKey.trim()) {
      lines.push(`  core:oasfExtendsKey "${escapeTurtleString(extendsKey)}" ;`);
      lines.push(`  core:oasfCategory ${oasfCategoryIri('domain', extendsKey)} ;`);
    }
    if (githubPath.trim()) lines.push(`  core:githubPath "${escapeTurtleString(githubPath)}" ;`);
    if (githubSha.trim()) lines.push(`  core:githubSha "${escapeTurtleString(githubSha)}" ;`);
    if (schemaJson.trim()) lines.push(`  core:oasfSchemaJson """${escapeTurtleString(schemaJson)}"""^^xsd:string ;`);
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  }

  for (const s of oasfSkills) {
    const skillId = String(s?.skillId ?? '').trim();
    if (!skillId) continue;
    const iri = oasfSkillIri(skillId);
    const caption = s?.caption != null ? String(s.caption) : skillId;
    const description = s?.description != null ? String(s.description) : '';
    const uid = s?.uid != null ? Number(s.uid) : null;
    const extendsKey = s?.extendsKey != null ? String(s.extendsKey) : '';
    const schemaJson = s?.schemaJson != null ? String(s.schemaJson) : '';
    const githubPath = s?.githubPath != null ? String(s.githubPath) : '';
    const githubSha = s?.githubSha != null ? String(s.githubSha) : '';
    const lines: string[] = [];
    lines.push(`${iri} a oasf:Skill, prov:Entity ;`);
    lines.push(`  oasf:key "${escapeTurtleString(skillId)}" ;`);
    lines.push(`  rdfs:label "${escapeTurtleString(caption)}" ;`);
    if (description.trim()) lines.push(`  rdfs:comment "${escapeTurtleString(description)}" ;`);
    if (Number.isFinite(uid as any)) lines.push(`  core:oasfUid ${Math.trunc(uid as any)} ;`);
    if (extendsKey.trim()) {
      lines.push(`  core:oasfExtendsKey "${escapeTurtleString(extendsKey)}" ;`);
      lines.push(`  core:oasfCategory ${oasfCategoryIri('skill', extendsKey)} ;`);
    }
    if (githubPath.trim()) lines.push(`  core:githubPath "${escapeTurtleString(githubPath)}" ;`);
    if (githubSha.trim()) lines.push(`  core:githubSha "${escapeTurtleString(githubSha)}" ;`);
    if (schemaJson.trim()) lines.push(`  core:oasfSchemaJson """${escapeTurtleString(schemaJson)}"""^^xsd:string ;`);
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  }

  for (const e of oasfDictEntries) {
    const key = String(e?.key ?? '').trim();
    if (!key) continue;
    const iri = oasfDictionaryEntryIri(key);
    const caption = e?.caption != null ? String(e.caption) : key;
    const description = e?.description != null ? String(e.description) : '';
    const type = e?.type != null ? String(e.type) : '';
    const referencesJson = e?.referencesJson != null ? String(e.referencesJson) : '';
    const schemaJson = e?.schemaJson != null ? String(e.schemaJson) : '';
    const lines: string[] = [];
    lines.push(`${iri} a prov:Entity ;`);
    lines.push(`  rdfs:label "${escapeTurtleString(caption)}" ;`);
    if (description.trim()) lines.push(`  rdfs:comment "${escapeTurtleString(description)}" ;`);
    if (type.trim()) lines.push(`  core:oasfType "${escapeTurtleString(type)}" ;`);
    if (referencesJson.trim()) lines.push(`  core:oasfReferencesJson """${escapeTurtleString(referencesJson)}"""^^xsd:string ;`);
    if (schemaJson.trim()) lines.push(`  core:oasfSchemaJson """${escapeTurtleString(schemaJson)}"""^^xsd:string ;`);
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  }

  // ---- Trust registries (feedback/validation/associations) ----
  // Best-effort: if tables do not exist, skip without failing export.

  // ERC-8092 delegation payloads (IPFS-backed) used to derive Delegation situations/assertions.
  const assocDelegationsRaw = await safeAll(`
    SELECT d.*
    FROM association_delegations d
  `);
  const assocDelegationByKey = new Map<string, any>(); // `${chainId}|${associationId}` -> row
  const delegationByFeedbackAuth = new Map<string, string>(); // feedbackAuth -> delegationAssertionIri
  const delegationByRequestHash = new Map<string, string>(); // requestHash -> delegationAssertionIri
  const delegationByAgentClientSuffix = new Map<string, string>(); // `${chainId}|${agentAnchorIri}|${clientLast40}` -> delegationAssertionIri
  for (const d of assocDelegationsRaw) {
    const chainId = Number(d?.chainId ?? 0) || 0;
    const associationId = String(d?.associationId ?? '');
    if (!associationId) continue;
    assocDelegationByKey.set(`${chainId}|${associationId}`, d);
    const fb = typeof d?.extractedFeedbackAuth === 'string' ? d.extractedFeedbackAuth.trim() : '';
    const rh = typeof d?.extractedRequestHash === 'string' ? d.extractedRequestHash.trim() : '';
    const delIri = erc8092DelegationTrustAssertionIri(chainId, associationId);
    if (fb) delegationByFeedbackAuth.set(fb, delIri);
    if (rh) delegationByRequestHash.set(rh, delIri);
  }

  // Optional permissioned-feedback (Jan 2026): feedbackAuth is no longer required in core ERC-8004,
  // but we still support delegation-based gating via ERC-8092 association delegations.
  // Best-effort: join association_delegations -> associations to map (agent, client) -> delegation assertion.
  const associationsForDelegations = await safeAll(`
    SELECT assoc.*
    FROM associations assoc
  `);
  const last40 = (value: any): string | null => {
    if (value === null || value === undefined) return null;
    const s = String(value).trim();
    if (!s) return null;
    const hex = s.replace(/^0x/i, '');
    if (hex.length < 40) return null;
    const out = hex.slice(-40).toLowerCase();
    return out.length === 40 ? out : null;
  };
  for (const assoc of associationsForDelegations) {
    const chainId = Number(assoc?.chainId ?? 0) || 0;
    const associationId = String(assoc?.associationId ?? '');
    if (!associationId) continue;
    const d = assocDelegationByKey.get(`${chainId}|${associationId}`);
    if (!d) continue;
    const kind = typeof d?.extractedKind === 'string' ? d.extractedKind.trim() : '';
    if (kind !== 'feedbackAuth') continue;

    const delIri = erc8092DelegationTrustAssertionIri(chainId, associationId);
    const init40 = last40(assoc?.initiatorAccountId);
    const appr40 = last40(assoc?.approverAccountId);
    if (!init40 || !appr40) continue;

    const initiatorAgent = agentByAccountSuffixKey.get(`${chainId}|${init40}`) || null;
    const approverAgent = agentByAccountSuffixKey.get(`${chainId}|${appr40}`) || null;
    const agentAnchor = initiatorAgent || approverAgent;
    const client40 = agentAnchor === initiatorAgent ? appr40 : agentAnchor === approverAgent ? init40 : null;
    if (!agentAnchor || !client40) continue;

    delegationByAgentClientSuffix.set(`${chainId}|${agentAnchor}|${client40}`, delIri);
  }

  const feedbacks = await safeAll(
    `
    SELECT f.*
    FROM rep_feedbacks f
    ${onlyAgent ? 'WHERE f.chainId = ? AND f.agentId = ?' : ''}
    `,
    ...(onlyAgent ? [onlyAgent.chainId, onlyAgent.agentId] : []),
  );
  
  if (!onlyAgent && feedbacks.length > 0) {
    console.log(`[rdf-export] Loaded ${feedbacks.length} feedback records`);
  }

  // Derived request/authorization artifacts (best-effort) for feedbackAuth delegation.
  // There is no dedicated feedback-auth request table yet, so we synthesize:
  // - a FeedbackAuthRequestSituation (DelegationSituation) and
  // - a DelegationTrustAssertion (grant) that authorizes the Feedback assertion.
  const feedbackAuthReqEmitted = new Set<string>(); // requestIri
  const feedbackAuthDelegationByRequest = new Map<string, string>(); // requestIri -> delegationAssertionIri

  for (const f of feedbacks) {
    const chainId = Number(f?.chainId ?? 0) || 0;
    const agentId = String(f?.agentId ?? '');
    if (!agentId) continue;
    ensureAgentNode(chainId, agentId);
    const client = normalizeHex(f?.clientAddress) || String(f?.clientAddress ?? '');
    const feedbackIndex = Number(f?.feedbackIndex ?? 0) || 0;
    const fi = feedbackIri(chainId, agentId, client, feedbackIndex);
    const meta = agentMetaByKey.get(`${chainId}|${agentId}`);
    const ai = meta?.agentAnchorIri ? String(meta.agentAnchorIri) : null;
    if (!ai) continue;
    chunks.push(`${ai} erc8004:hasFeedback ${fi} .\n`);
    if (meta?.identity8004Iri) chunks.push(`${meta.identity8004Iri} erc8004:hasFeedback ${fi} .\n`);

    const recordLines: string[] = [];
    const actIri = actIriFromRecordIri(fi);

    // Feedback is a durable trust assertion record (Entity) generated by a feedback act (Activity).
    recordLines.push(`${fi} a erc8004:Feedback, core:ReputationTrustAssertion, core:TrustAssertion, prov:Entity ;`);
    recordLines.push(`  erc8004:feedbackIndex ${feedbackIndex} ;`);
    
    // Create ReputationSituation and link to Feedback
    const repSituationIri = situationIri(chainId, agentId, 'reputation', `${client}:${feedbackIndex}`, meta?.didIdentity);
    // Situation is an epistemic object (prov:Entity); the Feedback itself is the asserting activity.
    chunks.push(`${repSituationIri} a core:ReputationTrustSituation, core:TrustSituation, prov:Entity ;`);
    // Situation is about the agent being evaluated.
    chunks.push(`  core:isAboutAgent ${ai} ;`);
    if (meta?.identity8004Iri) chunks.push(`  core:aboutSubject ${meta.identity8004Iri} ;`);
    chunks.push(`  core:satisfiesIntent <${intentTypeIri('trust.feedback')}> ;`);
    chunks.push(`  .\n`);
    // Link record and act to the asserted situation.
    chunks.push(`${fi} core:recordsSituation ${repSituationIri} .\n`);
    chunks.push(`${actIri} a erc8004:FeedbackAct, core:ReputationTrustAssertionAct, core:TrustAssertionAct, prov:Activity ;\n`);
    chunks.push(`  core:assertsSituation ${repSituationIri} ;\n`);
    chunks.push(`  core:generatedAssertionRecord ${fi} ;\n`);
    if (client) {
      const clientIri = accountIri(chainId, client);
      chunks.push(`  prov:wasAssociatedWith ${clientIri} ;\n`);
      chunks.push(`  core:assertedBy ${clientIri} ;\n`);
      // Attribute the record to the client as the author/source.
      recordLines.push(`  prov:wasAttributedTo ${clientIri} ;`);
    }
    chunks.push(`  .\n`);

    // Emit Situation participants as separate triples (outside the act node's predicate list).
    if (client) {
      const clientIri = accountIri(chainId, client);
      chunks.push(`${repSituationIri} core:hasSituationParticipant ${clientIri} .\n`);
    }

    // Inverse link for query convenience.
    chunks.push(`${fi} core:assertionRecordOf ${actIri} .\n`);
    if (client) {
      ensureAccountNode(chunks, chainId, client, 'EOA'); // Feedback client is typically EOA
      recordLines.push(`  erc8004:feedbackClient ${accountIri(chainId, client)} ;`);
    }
    if (typeof f?.endpoint === 'string' && f.endpoint.trim()) {
      const epTok = turtleIriOrLiteral(String(f.endpoint).trim());
      if (epTok) recordLines.push(`  erc8004:endpoint ${epTok} ;`);
    }
    if (f?.score != null) recordLines.push(`  erc8004:feedbackScore ${Number(f.score) || 0} ;`);
    if (f?.ratingPct != null) recordLines.push(`  erc8004:feedbackRatingPct ${Number(f.ratingPct) || 0} ;`);
    if (f?.isRevoked != null) recordLines.push(`  erc8004:isRevoked ${Number(f.isRevoked) ? 'true' : 'false'} ;`);
    if (typeof f?.skill === 'string' && f.skill.trim()) {
      recordLines.push(`  erc8004:feedbackSkill ${skillIri(chainId, agentId, String(f.skill).trim(), meta?.didIdentity)} ;`);
    }
    const domain = typeof f?.domain === 'string' ? f.domain.trim() : '';
    if (domain) {
      recordLines.push(`  erc8004:feedbackIntentType <${intentTypeIri(domain)}> ;`);
    }
    if (f?.feedbackJson) recordLines.push(`  core:json ${turtleJsonLiteral(String(f.feedbackJson))} ;`);
    const fbObj = safeJsonObject(f?.feedbackJson);
    if (fbObj) {
      const offIri = feedbackOffchainIri(chainId, String(f?.id ?? `${agentId}:${client}:${feedbackIndex}`));
      recordLines.push(`  erc8004:hasFeedbackOffchainData ${offIri} ;`);

      const off: string[] = [];
      off.push(`${offIri} a erc8004:FeedbackOffchainData, prov:Entity ;`);
      const createdAtLit = normalizeDateTimeLiteral(fbObj.createdAt);
      if (createdAtLit) off.push(`  erc8004:createdAt ${createdAtLit} ;`);
      if (typeof fbObj.reasoning === 'string' && fbObj.reasoning.trim())
        off.push(`  erc8004:reasoning "${escapeTurtleString(fbObj.reasoning.trim())}" ;`);
      if (fbObj.score != null) off.push(`  erc8004:score ${Number(fbObj.score) || 0} ;`);
      if (typeof fbObj.tag1 === 'string' && fbObj.tag1.trim()) off.push(`  erc8004:tag1 "${escapeTurtleString(fbObj.tag1.trim())}" ;`);
      if (typeof fbObj.tag2 === 'string' && fbObj.tag2.trim()) off.push(`  erc8004:tag2 "${escapeTurtleString(fbObj.tag2.trim())}" ;`);
      if (typeof fbObj.feedbackAuth === 'string' && fbObj.feedbackAuth.trim())
        off.push(`  erc8004:feedbackAuth "${escapeTurtleString(fbObj.feedbackAuth.trim())}" ;`);
      if (typeof fbObj.skill === 'string' && fbObj.skill.trim()) off.push(`  erc8004:skill "${escapeTurtleString(fbObj.skill.trim())}" ;`);
      if (typeof fbObj.context === 'string' && fbObj.context.trim()) off.push(`  erc8004:context "${escapeTurtleString(fbObj.context.trim())}" ;`);
      if (typeof fbObj.task === 'string' && fbObj.task.trim()) off.push(`  erc8004:task "${escapeTurtleString(fbObj.task.trim())}" ;`);
      if (typeof fbObj.capability === 'string' && fbObj.capability.trim()) off.push(`  erc8004:capability "${escapeTurtleString(fbObj.capability.trim())}" ;`);
      if (typeof fbObj.name === 'string' && fbObj.name.trim()) off.push(`  erc8004:name "${escapeTurtleString(fbObj.name.trim())}" ;`);
      if (typeof fbObj.clientAddress === 'string' && fbObj.clientAddress.trim())
        off.push(`  erc8004:clientAddress "${escapeTurtleString(fbObj.clientAddress.trim())}" ;`);
      if (typeof fbObj.agentRegistry === 'string' && fbObj.agentRegistry.trim())
        off.push(`  erc8004:agentRegistry "${escapeTurtleString(fbObj.agentRegistry.trim())}" ;`);
      if (fbObj.agentId != null) off.push(`  erc8004:agentIdValue ${Number(fbObj.agentId) || 0} ;`);

      const proof = (fbObj as any).proof_of_payment;
      if (proof && typeof proof === 'object') {
        const pIri = feedbackPaymentProofIri(chainId, String(f?.id ?? `${agentId}:${client}:${feedbackIndex}`));
        off.push(`  erc8004:hasPaymentProof ${pIri} ;`);
        const pp: string[] = [];
        pp.push(`${pIri} a erc8004:PaymentProof, prov:Entity ;`);
        if (typeof proof.protocol === 'string' && proof.protocol.trim())
          pp.push(`  erc8004:paymentProtocol "${escapeTurtleString(String(proof.protocol).trim())}" ;`);
        if (typeof proof.fromAddress === 'string' && proof.fromAddress.trim())
          pp.push(`  erc8004:paymentFromAddress "${escapeTurtleString(String(proof.fromAddress).trim())}" ;`);
        if (typeof proof.toAddress === 'string' && proof.toAddress.trim())
          pp.push(`  erc8004:paymentToAddress "${escapeTurtleString(String(proof.toAddress).trim())}" ;`);
        if (proof.chainId != null) pp.push(`  erc8004:paymentChainId ${Number(proof.chainId) || 0} ;`);
        if (typeof proof.txHash === 'string' && proof.txHash.trim())
          pp.push(`  erc8004:paymentTxHash "${escapeTurtleString(String(proof.txHash).trim())}" ;`);
        if (proof.amount != null) pp.push(`  erc8004:paymentAmount "${escapeTurtleString(String(proof.amount))}" ;`);
        if (typeof proof.currency === 'string' && proof.currency.trim())
          pp.push(`  erc8004:paymentCurrency "${escapeTurtleString(String(proof.currency).trim())}" ;`);
        if (typeof proof.tokenAddress === 'string' && proof.tokenAddress.trim())
          pp.push(`  erc8004:paymentTokenAddress "${escapeTurtleString(String(proof.tokenAddress).trim())}" ;`);
        pp.push(`  .\n`);
        chunks.push(pp.join('\n'));
      }

      const attachments = Array.isArray((fbObj as any).attachments) ? (fbObj as any).attachments : [];
      let ax = 0;
      for (const a of attachments) {
        if (!a || typeof a !== 'object') continue;
        ax += 1;
        const aIri = feedbackAttachmentIri(chainId, String(f?.id ?? `${agentId}:${client}:${feedbackIndex}`), ax);
        off.push(`  erc8004:hasFeedbackAttachment ${aIri} ;`);
        const att: string[] = [];
        att.push(`${aIri} a erc8004:FeedbackAttachment, prov:Entity ;`);
        if (typeof (a as any).name === 'string' && (a as any).name.trim())
          att.push(`  erc8004:attachmentName "${escapeTurtleString(String((a as any).name).trim())}" ;`);
        const uriTok = turtleIriOrStringLiteral((a as any).uri);
        if (uriTok) att.push(`  erc8004:attachmentUri ${uriTok} ;`);
        if (typeof (a as any).mimeType === 'string' && (a as any).mimeType.trim())
          att.push(`  erc8004:attachmentMimeType "${escapeTurtleString(String((a as any).mimeType).trim())}" ;`);
        if ((a as any).size != null) att.push(`  erc8004:attachmentSize ${Number((a as any).size) || 0} ;`);
        if (typeof (a as any).description === 'string' && (a as any).description.trim())
          att.push(`  erc8004:attachmentDescription "${escapeTurtleString(String((a as any).description).trim())}" ;`);
        const uploadedAtLit = normalizeDateTimeLiteral((a as any).uploadedAt);
        if (uploadedAtLit) att.push(`  erc8004:attachmentUploadedAt ${uploadedAtLit} ;`);
        att.push(`  .\n`);
        chunks.push(att.join('\n'));
      }

      off.push(`  .\n`);
      chunks.push(off.join('\n'));
    }

    // --- FeedbackAuth delegation (authorization link) ---
    const feedbackAuthToken =
      typeof f?.feedbackAuth === 'string' && f.feedbackAuth.trim()
        ? String(f.feedbackAuth).trim()
        : fbObj && typeof (fbObj as any).feedbackAuth === 'string' && String((fbObj as any).feedbackAuth).trim()
          ? String((fbObj as any).feedbackAuth).trim()
          : '';
    const onchainDelegation = feedbackAuthToken ? delegationByFeedbackAuth.get(feedbackAuthToken) : undefined;
    if (onchainDelegation) {
      // Prefer ERC-8092 delegation assertion if present.
      recordLines.push(`  core:wasAuthorizedByDelegation ${onchainDelegation} ;`);
    } else if (!feedbackAuthToken && client) {
      // Permissioned feedback (extension): link feedback to a matching ERC-8092 delegation by (agent, client)
      // even when feedbackAuth is absent (Jan 2026 core flow).
      const c40 = (() => {
        const norm = normalizeHex(client);
        if (!norm) return null;
        const out = norm.replace(/^0x/i, '').slice(-40).toLowerCase();
        return out.length === 40 ? out : null;
      })();
      const del = c40 ? delegationByAgentClientSuffix.get(`${chainId}|${ai}|${c40}`) : undefined;
      if (del) recordLines.push(`  core:wasAuthorizedByDelegation ${del} ;`);
    } else if (feedbackAuthToken && client) {
      ensureAccountNode(chunks, chainId, client, 'EOA');
      const clientIri = accountIri(chainId, client);

      // One synthesized FeedbackAuthRequestSituation per feedback record (agentId/client/feedbackIndex).
      const reqIri = feedbackAuthRequestIri(chainId, agentId, client, feedbackIndex);
      if (!feedbackAuthReqEmitted.has(reqIri)) {
        feedbackAuthReqEmitted.add(reqIri);

        const reqLines: string[] = [];
        reqLines.push(
          `${reqIri} a core:FeedbackAuthRequestSituation, core:ReputationTrustSituation, core:TrustSituation, prov:Entity ;`,
        );
        reqLines.push(`  core:isAboutAgent ${ai} ;`);
        if (meta?.identity8004Iri) reqLines.push(`  core:aboutSubject ${meta.identity8004Iri} ;`);
        reqLines.push(`  core:satisfiesIntent <${intentTypeIri('trust.feedbackAuth')}> ;`);

        // Delegation shape: agent grants client permission to give feedback.
        reqLines.push(`  core:delegationDelegator ${ai} ;`);
        reqLines.push(`  core:delegationDelegatee ${clientIri} ;`);
        reqLines.push(`  core:delegationAuthorityValue "${escapeTurtleString(feedbackAuthToken)}" ;`);

        const permIri = delegationPermissionIri(chainId, 'feedback-auth', `${agentId}/${client}/${feedbackIndex}`);
        reqLines.push(`  core:delegationGrantsPermission ${permIri} ;`);
        reqLines.push(`  .\n`);
        chunks.push(reqLines.join('\n'));

        const permLines: string[] = [];
        permLines.push(`${permIri} a core:DelegationPermission, prov:Entity ;`);
        permLines.push(`  core:permissionAction "giveFeedback" ;`);
        permLines.push(`  core:permissionResource "${escapeTurtleString(String(ai))}" ;`);
        permLines.push(`  .\n`);
        chunks.push(permLines.join('\n'));

        // DelegationTrustAssertion (grant) + act
        const delIri = delegationTrustAssertionIri(chainId, 'feedback-auth', `${agentId}/${client}/${feedbackIndex}`);
        feedbackAuthDelegationByRequest.set(reqIri, delIri);
        const delActIri = actIriFromRecordIri(delIri);

        const delRec: string[] = [];
        delRec.push(`${delIri} a core:DelegationTrustAssertion, core:TrustAssertion, prov:Entity ;`);
        delRec.push(`  core:recordsSituation ${reqIri} ;`);
        delRec.push(`  core:assertionRecordOf ${delActIri} ;`);
        delRec.push(`  prov:wasAttributedTo ${ai} ;`);
        if (meta?.identity8004Iri) delRec.push(`  core:aboutSubject ${meta.identity8004Iri} ;`);
        delRec.push(`  .\n`);
        chunks.push(delRec.join('\n'));

        const delAct: string[] = [];
        delAct.push(`${delActIri} a core:DelegationTrustAssertionAct, core:TrustAssertionAct, prov:Activity ;`);
        delAct.push(`  core:assertsSituation ${reqIri} ;`);
        delAct.push(`  core:generatedAssertionRecord ${delIri} ;`);
        delAct.push(`  prov:wasAssociatedWith ${ai} ;`);
        delAct.push(`  core:assertedBy ${ai} ;`);
        delAct.push(`  .\n`);
        chunks.push(delAct.join('\n'));

        // Situation participants
        chunks.push(`${reqIri} core:hasSituationParticipant ${clientIri} .\n`);
        chunks.push(`${reqIri} core:hasSituationParticipant ${ai} .\n`);
      }

      // Link Feedback (GiveFeedback) to delegation grant that authorized it.
      const del = feedbackAuthDelegationByRequest.get(reqIri);
      if (del) recordLines.push(`  core:wasAuthorizedByDelegation ${del} ;`);
    }
    recordLines.push(`  .\n`);
    chunks.push(recordLines.join('\n'));
  }

  const feedbackResponses = await safeAll(
    `
    SELECT r.*
    FROM rep_feedback_responses r
    `,
  );
  for (const r of feedbackResponses) {
    const chainId = Number(r?.chainId ?? 0) || 0;
    const agentId = String(r?.agentId ?? '');
    if (!agentId) continue;
    ensureAgentNode(chainId, agentId);
    const id = String(r?.id ?? '');
    if (!id) continue;
    const ri = feedbackResponseIri(chainId, id);
    const meta = agentMetaByKey.get(`${chainId}|${agentId}`);
    const ai = meta?.agentAnchorIri ? String(meta.agentAnchorIri) : null;
    if (!ai) continue;
    chunks.push(`${ai} erc8004:hasFeedback ${ri} .\n`);
    if (meta?.identity8004Iri) chunks.push(`${meta.identity8004Iri} erc8004:hasFeedback ${ri} .\n`);
    const lines: string[] = [];
    lines.push(`${ri} a erc8004:FeedbackResponse, core:ReputationTrustAssertion, prov:Activity ;`);
    if (r?.responseJson) lines.push(`  core:json ${turtleJsonLiteral(String(r.responseJson))} ;`);
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  }

  const validationRequests = await safeAll(
    `
    SELECT v.*
    FROM validation_requests v
    ${onlyAgent ? 'WHERE v.chainId = ? AND v.agentId = ?' : ''}
    `,
    ...(onlyAgent ? [onlyAgent.chainId, onlyAgent.agentId] : []),
  );
  const requestByHash = new Map<string, string>(); // `${chainId}|${hash}` -> requestIri
  const delegationByRequestIri = new Map<string, string>(); // requestIri -> delegation assertion record
  for (const v of validationRequests) {
    const chainId = Number(v?.chainId ?? 0) || 0;
    const agentId = String(v?.agentId ?? '');
    const id = String(v?.id ?? '');
    if (!id) continue;
    if (!agentId) continue;
    ensureAgentNode(chainId, agentId);
    const vi = validationRequestIri(chainId, id);
    // No direct agent link for requests; link agent via ValidationResponse using core:hasValidation.
    const lines: string[] = [];
    // ValidationRequestSituation is a Situation (Entity) being asserted/answered by later responses.
    // We model ERC-8004 validation requests as erc8004:ValidationRequestSituation (a concrete subclass of
    // core:VerificationRequestSituation) so ERC-8004 queries can stay vocabulary-native.
    const meta = agentMetaByKey.get(`${chainId}|${agentId}`);
    const ai = meta?.agentAnchorIri ? String(meta.agentAnchorIri) : null;
    if (!ai) continue;
    lines.push(`${vi} a erc8004:ValidationRequestSituation, core:VerificationTrustSituation, core:TrustSituation, prov:Entity ;`);
    lines.push(`  core:isAboutAgent ${ai} ;`);
    if (meta?.identity8004Iri) lines.push(`  core:aboutSubject ${meta.identity8004Iri} ;`);
    const validator = normalizeHex(v?.validatorAddress);
    lines.push(`  erc8004:validationChainId ${chainId} ;`);
    lines.push(`  erc8004:requestingAgentId "${escapeTurtleString(agentId)}" ;`);
    // Link VerificationTrustSituation to IntentType via satisfiesIntent
    lines.push(`  core:satisfiesIntent <${intentTypeIri('trust.validation')}> ;`);
    if (validator) {
      ensureAccountNode(chunks, chainId, validator, 'SmartAccount'); // Validator is typically agentAccount
      lines.push(`  erc8004:validatorAddress "${escapeTurtleString(validator)}" ;`);
      lines.push(`  erc8004:validationValidator ${accountIri(chainId, validator)} ;`);
      lines.push(`  core:hasSituationParticipant ${accountIri(chainId, validator)} ;`);
      const mapped = agentByAccountKey.get(`${chainId}|${validator}`);
      if (mapped) {
        lines.push(`  erc8004:validatorAgent ${mapped} ;`);
        lines.push(`  core:hasSituationParticipant ${mapped} ;`);
        const mk = agentKeyByAccountKey.get(`${chainId}|${validator}`);
        if (mk) ensureAgentNode(mk.chainId, mk.agentId);
      }
    }
    const requestHash = typeof v?.requestHash === 'string' ? v.requestHash.trim() : '';
    if (requestHash) lines.push(`  erc8004:requestHash "${escapeTurtleString(String(requestHash))}" ;`);
    if (v?.requestJson) lines.push(`  core:json ${turtleJsonLiteral(String(v.requestJson))} ;`);
    const reqObj = safeJsonObject(v?.requestJson);
    let deadlineLit: string | null = null;
    if (reqObj) {
      const offIri = validationOffchainIri(chainId, 'request', id);
      lines.push(`  erc8004:hasOffchainData ${offIri} ;`);
      const off: string[] = [];
      off.push(`${offIri} a erc8004:ValidationOffchainData, prov:Entity ;`);

      const createdAtLit = normalizeDateTimeLiteral(reqObj.createdAt);
      if (createdAtLit) off.push(`  erc8004:createdAt ${createdAtLit} ;`);
      deadlineLit = normalizeDateTimeLiteral(reqObj.deadline);
      if (deadlineLit) off.push(`  erc8004:deadline ${deadlineLit} ;`);
      if (typeof reqObj.reasoning === 'string' && reqObj.reasoning.trim())
        off.push(`  erc8004:reasoning "${escapeTurtleString(reqObj.reasoning.trim())}" ;`);

      const vtRaw = typeof reqObj.validationType === 'string' ? reqObj.validationType.trim() : '';
      if (vtRaw) {
        off.push(`  erc8004:validationTypeValue "${escapeTurtleString(vtRaw)}" ;`);
        const vt = normalizeSymbol(vtRaw);
        if (vt) off.push(`  erc8004:hasValidationType erc8004:ValidationType_${vt} ;`);
      }

      const psRaw =
        typeof (reqObj as any).parse_status === 'string'
          ? String((reqObj as any).parse_status).trim()
          : typeof (reqObj as any).parseStatus === 'string'
            ? String((reqObj as any).parseStatus).trim()
            : '';
      if (psRaw) {
        off.push(`  erc8004:parseStatusValue "${escapeTurtleString(psRaw)}" ;`);
        const ps = normalizeSymbol(psRaw);
        if (ps) off.push(`  erc8004:hasParseStatus erc8004:ParseStatus_${ps} ;`);
      }

      const attachments = Array.isArray((reqObj as any).attachments) ? (reqObj as any).attachments : [];
      let ai = 0;
      for (const a of attachments) {
        if (!a || typeof a !== 'object') continue;
        ai += 1;
        const aIri = validationAttachmentIri(chainId, 'request', id, ai);
        off.push(`  erc8004:hasAttachment ${aIri} ;`);
        const att: string[] = [];
        att.push(`${aIri} a erc8004:ValidationAttachment, prov:Entity ;`);
        if (typeof (a as any).name === 'string' && (a as any).name.trim())
          att.push(`  erc8004:attachmentName "${escapeTurtleString(String((a as any).name).trim())}" ;`);
        const uriTok = turtleIriOrStringLiteral((a as any).uri);
        if (uriTok) att.push(`  erc8004:attachmentUri ${uriTok} ;`);
        if (typeof (a as any).mimeType === 'string' && (a as any).mimeType.trim())
          att.push(`  erc8004:attachmentMimeType "${escapeTurtleString(String((a as any).mimeType).trim())}" ;`);
        if ((a as any).size != null) att.push(`  erc8004:attachmentSize ${Number((a as any).size) || 0} ;`);
        if (typeof (a as any).description === 'string' && (a as any).description.trim())
          att.push(`  erc8004:attachmentDescription "${escapeTurtleString(String((a as any).description).trim())}" ;`);
        const uploadedAtLit = normalizeDateTimeLiteral((a as any).uploadedAt);
        if (uploadedAtLit) att.push(`  erc8004:attachmentUploadedAt ${uploadedAtLit} ;`);
        att.push(`  .\n`);
        chunks.push(att.join('\n'));
      }

      off.push(`  .\n`);
      chunks.push(off.join('\n'));
    }

    // Delegation metadata for the validation request (requester delegates authority-to-validate to validator).
    lines.push(`  core:delegationDelegator ${ai} ;`);
    if (validator) {
      const delegateTok = agentByAccountKey.get(`${chainId}|${validator}`) ?? accountIri(chainId, validator);
      lines.push(`  core:delegationDelegatee ${delegateTok} ;`);
    }
    if (deadlineLit) lines.push(`  core:delegationExpiresAtTime ${deadlineLit} ;`);
    const permIri = delegationPermissionIri(chainId, 'validation-request', id);
    lines.push(`  core:delegationGrantsPermission ${permIri} ;`);

    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));

    // Permission node
    const permLines: string[] = [];
    permLines.push(`${permIri} a core:DelegationPermission, prov:Entity ;`);
    permLines.push(`  core:permissionAction "validate" ;`);
    permLines.push(`  core:permissionResource "${escapeTurtleString(String(ai))}" ;`);
    permLines.push(`  .\n`);
    chunks.push(permLines.join('\n'));

    // DelegationTrustAssertion (grant) + act:
    // Prefer onchain ERC-8092 delegation assertion if requestHash is present and mapped; otherwise synthesize.
    const onchainDel = requestHash ? delegationByRequestHash.get(requestHash) : undefined;
    if (onchainDel) {
      delegationByRequestIri.set(vi, onchainDel);
    } else {
      const delIri = delegationTrustAssertionIri(chainId, 'validation-request', id);
      delegationByRequestIri.set(vi, delIri);
      const delActIri = actIriFromRecordIri(delIri);
      const delRec: string[] = [];
      delRec.push(`${delIri} a core:DelegationTrustAssertion, core:TrustAssertion, prov:Entity ;`);
      delRec.push(`  core:recordsSituation ${vi} ;`);
      delRec.push(`  core:assertionRecordOf ${delActIri} ;`);
      delRec.push(`  prov:wasAttributedTo ${ai} ;`);
      if (meta?.identity8004Iri) delRec.push(`  core:aboutSubject ${meta.identity8004Iri} ;`);
      delRec.push(`  .\n`);
      chunks.push(delRec.join('\n'));

      const delAct: string[] = [];
      delAct.push(`${delActIri} a core:DelegationTrustAssertionAct, core:TrustAssertionAct, prov:Activity ;`);
      delAct.push(`  core:assertsSituation ${vi} ;`);
      delAct.push(`  core:generatedAssertionRecord ${delIri} ;`);
      delAct.push(`  prov:wasAssociatedWith ${ai} ;`);
      delAct.push(`  core:assertedBy ${ai} ;`);
      delAct.push(`  .\n`);
      chunks.push(delAct.join('\n'));
    }

    const rh = typeof v?.requestHash === 'string' ? v.requestHash.trim() : '';
    if (rh) requestByHash.set(`${chainId}|${rh}`, vi);
  }

  const validationResponses = await safeAll(
    `
    SELECT v.*
    FROM validation_responses v
    ${onlyAgent ? 'WHERE v.chainId = ? AND v.agentId = ?' : ''}
    `,
    ...(onlyAgent ? [onlyAgent.chainId, onlyAgent.agentId] : []),
  );
  for (const v of validationResponses) {
    const chainId = Number(v?.chainId ?? 0) || 0;
    const agentId = String(v?.agentId ?? '');
    const id = String(v?.id ?? '');
    if (!id) continue;
    if (!agentId) continue;
    ensureAgentNode(chainId, agentId);
    const vi = validationResponseIri(chainId, id);
    const actIri = actIriFromRecordIri(vi);
    const meta = agentMetaByKey.get(`${chainId}|${agentId}`);
    const ai = meta?.agentAnchorIri ? String(meta.agentAnchorIri) : null;
    if (!ai) continue;
    chunks.push(`${ai} erc8004:hasValidation ${vi} .\n`);
    if (meta?.identity8004Iri) chunks.push(`${meta.identity8004Iri} erc8004:hasValidation ${vi} .\n`);

    const recordLines: string[] = [];
    // ValidationResponse is a durable assertion record (Entity) generated by a validation-response act (Activity).
    recordLines.push(`${vi} a erc8004:ValidationResponse, core:VerificationTrustAssertion, core:TrustAssertion, prov:Entity ;`);
    if (meta?.identity8004Iri) recordLines.push(`  core:aboutSubject ${meta.identity8004Iri} ;`);
    recordLines.push(`  erc8004:validationChainIdForResponse ${chainId} ;`);
    recordLines.push(`  erc8004:requestingAgentIdForResponse "${escapeTurtleString(agentId)}" ;`);
    if (typeof v?.response === 'number' || typeof v?.response === 'string')
      recordLines.push(`  erc8004:validationResponseValue ${Number(v.response) || 0} ;`);
    if (typeof v?.responseHash === 'string' && v.responseHash.trim())
      recordLines.push(`  erc8004:responseHash "${escapeTurtleString(String(v.responseHash))}" ;`);
    if (typeof v?.tag === 'string' && v.tag.trim()) recordLines.push(`  erc8004:validationTagCheck <${checkIri(v.tag.trim())}> ;`);
    // Link record <-> act (always), and optionally link to the request situation.
    recordLines.push(`  core:assertionRecordOf ${actIri} ;`);

    const actLines: string[] = [];
    actLines.push(`${actIri} a erc8004:ValidationResponseAct, core:VerificationTrustAssertionAct, core:TrustAssertionAct, prov:Activity ;`);
    actLines.push(`  core:generatedAssertionRecord ${vi} ;`);

    const reqHash = typeof v?.requestHash === 'string' ? v.requestHash.trim() : '';
    if (reqHash) recordLines.push(`  erc8004:requestHash "${escapeTurtleString(reqHash)}" ;`);
    const reqIri = reqHash ? requestByHash.get(`${chainId}|${reqHash}`) : undefined;
    if (reqIri) {
      recordLines.push(`  erc8004:validationRespondsToRequest ${reqIri} ;`);
      recordLines.push(`  core:recordsSituation ${reqIri} ;`);
      actLines.push(`  core:assertsSituation ${reqIri} ;`);
      const del = delegationByRequestIri.get(reqIri);
      if (del) recordLines.push(`  core:wasAuthorizedByDelegation ${del} ;`);
    }
    const validator = normalizeHex(v?.validatorAddress);
    if (validator) {
      recordLines.push(`  erc8004:validatorAddressForResponse "${escapeTurtleString(validator)}" ;`);
      const mapped = agentByAccountKey.get(`${chainId}|${validator}`);
      if (mapped) {
        recordLines.push(`  erc8004:validatorAgentForResponse ${mapped} ;`);
        const mk = agentKeyByAccountKey.get(`${chainId}|${validator}`);
        if (mk) ensureAgentNode(mk.chainId, mk.agentId);
      }
      // Best-effort provenance: associate act with validator account.
      ensureAccountNode(chunks, chainId, validator, 'SmartAccount');
      actLines.push(`  prov:wasAssociatedWith ${accountIri(chainId, validator)} ;`);
      actLines.push(`  core:assertedBy ${mapped ?? accountIri(chainId, validator)} ;`);
      recordLines.push(`  prov:wasAttributedTo ${accountIri(chainId, validator)} ;`);
    }
    if (v?.responseJson) recordLines.push(`  core:json ${turtleJsonLiteral(String(v.responseJson))} ;`);
    const respObj = safeJsonObject(v?.responseJson);
    if (respObj) {
      const offIri = validationOffchainIri(chainId, 'response', id);
      recordLines.push(`  erc8004:hasOffchainData ${offIri} ;`);
      const off: string[] = [];
      off.push(`${offIri} a erc8004:ValidationOffchainData, prov:Entity ;`);
      const createdAtLit = normalizeDateTimeLiteral(respObj.createdAt);
      if (createdAtLit) off.push(`  erc8004:createdAt ${createdAtLit} ;`);
      if (typeof respObj.result === 'string' && respObj.result.trim())
        off.push(`  erc8004:result "${escapeTurtleString(respObj.result.trim())}" ;`);
      if (typeof respObj.reasoning === 'string' && respObj.reasoning.trim())
        off.push(`  erc8004:reasoning "${escapeTurtleString(respObj.reasoning.trim())}" ;`);
      if (respObj.confidence != null && Number.isFinite(Number(respObj.confidence)))
        off.push(`  erc8004:confidence ${Number(respObj.confidence)} ;`);

      const vtRaw = typeof respObj.validationType === 'string' ? respObj.validationType.trim() : '';
      if (vtRaw) {
        off.push(`  erc8004:validationTypeValue "${escapeTurtleString(vtRaw)}" ;`);
        const vt = normalizeSymbol(vtRaw);
        if (vt) off.push(`  erc8004:hasValidationType erc8004:ValidationType_${vt} ;`);
      }

      // known proof protocol hints (e.g., groth16) in zkmlProof/proofData objects
      const protoRaw =
        typeof (respObj as any)?.zkmlProof?.protocol === 'string'
          ? String((respObj as any).zkmlProof.protocol).trim()
          : typeof (respObj as any)?.proofData?.protocol === 'string'
            ? String((respObj as any).proofData.protocol).trim()
            : '';
      if (protoRaw) {
        off.push(`  erc8004:proofFormatValue "${escapeTurtleString(protoRaw)}" ;`);
        const pf = normalizeSymbol(protoRaw);
        if (pf) off.push(`  erc8004:hasProofFormat erc8004:ProofFormat_${pf} ;`);
      }

      const psRaw =
        typeof (respObj as any).parse_status === 'string'
          ? String((respObj as any).parse_status).trim()
          : typeof (respObj as any).parseStatus === 'string'
            ? String((respObj as any).parseStatus).trim()
            : '';
      if (psRaw) {
        off.push(`  erc8004:parseStatusValue "${escapeTurtleString(psRaw)}" ;`);
        const ps = normalizeSymbol(psRaw);
        if (ps) off.push(`  erc8004:hasParseStatus erc8004:ParseStatus_${ps} ;`);
      }

      const attachments = Array.isArray((respObj as any).attachments) ? (respObj as any).attachments : [];
      let ai = 0;
      for (const a of attachments) {
        if (!a || typeof a !== 'object') continue;
        ai += 1;
        const aIri = validationAttachmentIri(chainId, 'response', id, ai);
        off.push(`  erc8004:hasAttachment ${aIri} ;`);
        const att: string[] = [];
        att.push(`${aIri} a erc8004:ValidationAttachment, prov:Entity ;`);
        if (typeof (a as any).name === 'string' && (a as any).name.trim())
          att.push(`  erc8004:attachmentName "${escapeTurtleString(String((a as any).name).trim())}" ;`);
        const uriTok = turtleIriOrStringLiteral((a as any).uri);
        if (uriTok) att.push(`  erc8004:attachmentUri ${uriTok} ;`);
        if (typeof (a as any).mimeType === 'string' && (a as any).mimeType.trim())
          att.push(`  erc8004:attachmentMimeType "${escapeTurtleString(String((a as any).mimeType).trim())}" ;`);
        if ((a as any).size != null) att.push(`  erc8004:attachmentSize ${Number((a as any).size) || 0} ;`);
        if (typeof (a as any).description === 'string' && (a as any).description.trim())
          att.push(`  erc8004:attachmentDescription "${escapeTurtleString(String((a as any).description).trim())}" ;`);
        const uploadedAtLit = normalizeDateTimeLiteral((a as any).uploadedAt);
        if (uploadedAtLit) att.push(`  erc8004:attachmentUploadedAt ${uploadedAtLit} ;`);
        att.push(`  .\n`);
        chunks.push(att.join('\n'));
      }

      off.push(`  .\n`);
      chunks.push(off.join('\n'));
    }
    recordLines.push(`  .\n`);
    chunks.push(recordLines.join('\n'));

    actLines.push(`  .\n`);
    chunks.push(actLines.join('\n'));
  }

  // Relationships (ERC-8092): export as RelationshipAssertion + Relationship (see ERC8092.owl).
  const associationsRaw = await safeAll(
    `
    SELECT assoc.*
    FROM associations assoc
    `,
  );

  // NOTE: ERC8092.owl is assertion-only; we do not emit RelationshipAccount nodes.

  const associationRevocationsRaw = await safeAll(
    `
    SELECT r.*
    FROM association_revocations r
    `,
  );

  // If exporting one agent, restrict associations to those involving its known account(s).
  const associations = (() => {
    if (!onlyAgent) return associationsRaw;
    const chainId = onlyAgent.chainId;
    const agentId = onlyAgent.agentId;
    const key = `${chainId}|${agentId}`;
    const meta = agentMetaByKey.get(key);
    const targetAgentIri = agentIri(chainId, agentId, meta?.didIdentity);

    // Collect all known account keys that map to this agent (agentAccount, agentIdentityOwnerAccount, eoaAgentIdentityOwnerAccount).
    const addresses = new Set<string>();
    for (const [k, v] of agentByAccountKey.entries()) {
      if (v === targetAgentIri && k.startsWith(`${chainId}|`)) {
        addresses.add(k.split('|').slice(1).join('|'));
      }
    }

    // If we couldn't find addresses, still at least filter by chainId.
    if (addresses.size === 0) {
      return associationsRaw.filter((a: any) => Number(a?.chainId ?? 0) === chainId);
    }

    return associationsRaw.filter((a: any) => {
      if (Number(a?.chainId ?? 0) !== chainId) return false;
      const initiator = normalizeHex(a?.initiator);
      const approver = normalizeHex(a?.approver);
      return (initiator && addresses.has(initiator)) || (approver && addresses.has(approver));
    });
  })();

  const associationIds = new Set<string>(associations.map((a: any) => String(a?.associationId ?? '')).filter(Boolean));
  const associationRevocations = onlyAgent
    ? associationRevocationsRaw.filter(
        (r: any) => Number(r?.chainId ?? 0) === onlyAgent.chainId && associationIds.has(String(r?.associationId ?? '')),
      )
    : associationRevocationsRaw;
  const revocationsByAssociationKey = new Map<string, any[]>();
  for (const r of associationRevocations) {
    const chainId = Number(r?.chainId ?? 0) || 0;
    const associationId = String(r?.associationId ?? '');
    if (!associationId) continue;
    const k = `${chainId}|${associationId}`;
    const arr = revocationsByAssociationKey.get(k) ?? [];
    arr.push(r);
    revocationsByAssociationKey.set(k, arr);
  }

  const seenAssoc = new Set<string>();
  for (const assoc of associations) {
    const chainId = Number(assoc?.chainId ?? 0) || 0;
    const associationId = String(assoc?.associationId ?? '');
    if (!associationId) continue;
    const key = `${chainId}|${associationId}`;
    if (seenAssoc.has(key)) continue;
    seenAssoc.add(key);

    const relationshipId = associationId;
    const raIri = relationshipAssertionIri(chainId, associationId);
    const initiator = normalizeHex(assoc?.initiator);
    const approver = normalizeHex(assoc?.approver);

    const lookupAgentByAccountLike = (addr: string | null): string | undefined => {
      if (!addr) return undefined;
      const direct = agentByAccountKey.get(`${chainId}|${addr}`);
      if (direct) return direct;
      try {
        const byIdent = agentByAccountIdentifierIri.get(accountIdentifierIri(chainId, addr));
        if (byIdent) return byIdent;
      } catch {
        // ignore
      }
      const last40 = addr.replace(/^0x/i, '').slice(-40);
      if (last40.length === 40) {
        const bySuffix = agentByAccountSuffixKey.get(`${chainId}|${last40}`);
        if (bySuffix) return bySuffix;
      }
      return undefined;
    };

    const initiatorAgent = lookupAgentByAccountLike(initiator);
    const approverAgent = lookupAgentByAccountLike(approver);

    if (initiatorAgent) {
      chunks.push(`${initiatorAgent} erc8092:hasAssociatedAccounts ${raIri} .\n`);
      const mk = initiator ? agentKeyByAccountKey.get(`${chainId}|${initiator}`) : undefined;
      if (mk) ensureAgentNode(mk.chainId, mk.agentId);
    }
    if (approverAgent) {
      chunks.push(`${approverAgent} erc8092:hasAssociatedAccounts ${raIri} .\n`);
      const mk = approver ? agentKeyByAccountKey.get(`${chainId}|${approver}`) : undefined;
      if (mk) ensureAgentNode(mk.chainId, mk.agentId);
    }

    const lines: string[] = [];
    // Create RelationshipTrustSituation (the situation IS the relationship state)
    const relSituationIri = situationIri(chainId, associationId, 'relationship', relationshipId, undefined);
    chunks.push(`${relSituationIri} a core:RelationshipTrustSituation, core:RelationshipSituation, core:TrustSituation, prov:Entity ;`);
    // Expose "about agent" hooks:
    // - always about the participant Accounts (prov:Agent), and
    // - additionally about AIAgents when we can map the account -> agent.
    // - also about base accounts when prefixed ERC-8092 accounts are detected
    if (initiator) {
      chunks.push(`  core:isAboutAgent ${accountIri(chainId, initiator)} ;`);
      // If this is a prefixed ERC-8092 account, also link to the base account
      const last40 = initiator.replace(/^0x/i, '').slice(-40);
      if (last40.length === 40 && initiator.length > 42) {
        const baseAccount = `0x${last40}`;
        const baseAccountKey = `${chainId}|${baseAccount}`;
        // Check if base account exists in our mapping (has an identifier)
        if (agentByAccountKey.has(baseAccountKey) || agentByAccountSuffixKey.has(`${chainId}|${last40}`)) {
          chunks.push(`  core:isAboutAgent ${accountIri(chainId, baseAccount)} ;`);
        }
      }
    }
    if (approver) {
      chunks.push(`  core:isAboutAgent ${accountIri(chainId, approver)} ;`);
      // If this is a prefixed ERC-8092 account, also link to the base account
      const last40 = approver.replace(/^0x/i, '').slice(-40);
      if (last40.length === 40 && approver.length > 42) {
        const baseAccount = `0x${last40}`;
        const baseAccountKey = `${chainId}|${baseAccount}`;
        // Check if base account exists in our mapping (has an identifier)
        if (agentByAccountKey.has(baseAccountKey) || agentByAccountSuffixKey.has(`${chainId}|${last40}`)) {
          chunks.push(`  core:isAboutAgent ${accountIri(chainId, baseAccount)} ;`);
        }
      }
    }
    if (initiatorAgent) chunks.push(`  core:isAboutAgent ${initiatorAgent} ;`);
    if (approverAgent) chunks.push(`  core:isAboutAgent ${approverAgent} ;`);
    chunks.push(`  core:satisfiesIntent <${intentTypeIri('trust.relationship')}> ;`);
    chunks.push(`  .\n`);

    // Also emit unqualified situation participants (accounts + mapped agents) for convenience.
    if (initiator) {
      const initiatorAccountIri = accountIri(chainId, initiator);
      ensureAccountNode(chunks, chainId, initiator, 'SmartAccount');
      chunks.push(`${relSituationIri} core:hasSituationParticipant ${initiatorAccountIri} .\n`);
      if (initiatorAgent) chunks.push(`${relSituationIri} core:hasSituationParticipant ${initiatorAgent} .\n`);
    }
    if (approver) {
      const approverAccountIri = accountIri(chainId, approver);
      ensureAccountNode(chunks, chainId, approver, 'SmartAccount');
      chunks.push(`${relSituationIri} core:hasSituationParticipant ${approverAccountIri} .\n`);
      if (approverAgent) chunks.push(`${relSituationIri} core:hasSituationParticipant ${approverAgent} .\n`);
    }

    const actIri = actIriFromRecordIri(raIri);

    // Account association assertion record (ERC-8092 on-chain association row)
    lines.push(`${raIri} a core:TrustAssertion, erc8092:AssociatedAccounts8092, prov:Entity ;`);
    lines.push(`  erc8092:relationshipAssertionId "${escapeTurtleString(associationId)}" ;`);
    lines.push(`  erc8092:associationId "${escapeTurtleString(associationId)}" ;`);
    // Record links to asserted situation; act asserts it.
    lines.push(`  core:recordsSituation ${relSituationIri} ;`);
    lines.push(`  core:assertionRecordOf ${actIri} ;`);
    if (initiator) {
      // initiator/approver reference agentAccount, not eoaAgentIdentityOwnerAccount
      ensureAccountNode(chunks, chainId, initiator, 'SmartAccount');
      lines.push(`  erc8092:initiator ${initiatorAgent ?? accountIri(chainId, initiator)} ;`);
    }
    if (approver) {
      ensureAccountNode(chunks, chainId, approver, 'SmartAccount');
      lines.push(`  erc8092:approver ${approverAgent ?? accountIri(chainId, approver)} ;`);
    }

    if (assoc?.initiatorAccountId) {
      const id = String(assoc.initiatorAccountId);
      if (id) lines.push(`  erc8092:initiatorAccountId "${escapeTurtleString(id)}" ;`);
    }
    if (assoc?.approverAccountId) {
      const id = String(assoc.approverAccountId);
      if (id) lines.push(`  erc8092:approverAccountId "${escapeTurtleString(id)}" ;`);
    }
    if (assoc?.interfaceId) lines.push(`  erc8092:interfaceId "${escapeTurtleString(String(assoc.interfaceId))}" ;`);
    if (assoc?.validAt != null) lines.push(`  erc8092:validAt ${Number(assoc.validAt) || 0} ;`);
    if (assoc?.validUntil != null) lines.push(`  erc8092:validUntil ${Number(assoc.validUntil) || 0} ;`);
    if (assoc?.revokedAt != null) lines.push(`  erc8092:revokedAt ${Number(assoc.revokedAt) || 0} ;`);
    if (assoc?.data) lines.push(`  erc8092:dataHex "${escapeTurtleString(String(assoc.data))}" ;`);
    if (assoc?.initiatorKeyType) lines.push(`  erc8092:initiatorKeyType "${escapeTurtleString(String(assoc.initiatorKeyType))}" ;`);
    if (assoc?.approverKeyType) lines.push(`  erc8092:approverKeyType "${escapeTurtleString(String(assoc.approverKeyType))}" ;`);
    if (assoc?.initiatorSignature) lines.push(`  erc8092:initiatorSignature "${escapeTurtleString(String(assoc.initiatorSignature))}" ;`);
    if (assoc?.approverSignature) lines.push(`  erc8092:approverSignature "${escapeTurtleString(String(assoc.approverSignature))}" ;`);
    if (assoc?.createdTxHash) lines.push(`  erc8092:createdTxHash "${escapeTurtleString(String(assoc.createdTxHash))}" ;`);
    if (assoc?.createdBlockNumber != null) lines.push(`  erc8092:createdBlockNumber ${Number(assoc.createdBlockNumber) || 0} ;`);
    if (assoc?.createdTimestamp != null) lines.push(`  erc8092:createdTimestamp ${Number(assoc.createdTimestamp) || 0} ;`);
    if (assoc?.lastUpdatedTxHash) lines.push(`  erc8092:lastUpdatedTxHash "${escapeTurtleString(String(assoc.lastUpdatedTxHash))}" ;`);
    if (assoc?.lastUpdatedBlockNumber != null) lines.push(`  erc8092:lastUpdatedBlockNumber ${Number(assoc.lastUpdatedBlockNumber) || 0} ;`);
    if (assoc?.lastUpdatedTimestamp != null) lines.push(`  erc8092:lastUpdatedTimestamp ${Number(assoc.lastUpdatedTimestamp) || 0} ;`);

    const revocationRows = revocationsByAssociationKey.get(`${chainId}|${associationId}`) ?? [];
    for (const r of revocationRows) {
      const rid = String(r?.id ?? '');
      if (!rid) continue;
      lines.push(`  erc8092:revokedAt ${Number(r?.revokedAt ?? 0) || 0} ;`);
    }
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));

    // --- ERC-8092 delegation payload → DelegationTrustSituation/Assertion (best-effort) ---
    const drow = assocDelegationByKey.get(`${chainId}|${associationId}`);
    const delegationJsonText = typeof drow?.delegationJson === 'string' ? drow.delegationJson.trim() : '';
    const decodedText = typeof drow?.decodedDataText === 'string' ? drow.decodedDataText.trim() : '';
    if (drow && (delegationJsonText || decodedText)) {
      const delSituationIri = erc8092DelegationSituationIri(chainId, associationId);
      const delAssertionIri = erc8092DelegationTrustAssertionIri(chainId, associationId);
      const delActIri = actIriFromRecordIri(delAssertionIri);

      // Delegation situation (state/constraints)
      const s: string[] = [];
      s.push(`${delSituationIri} a core:DelegationTrustSituation, core:DelegationSituation, core:TrustSituation, prov:Entity ;`);
      s.push(`  core:assertedIn ${raIri} ;`);
      s.push(`  core:satisfiesIntent <${intentTypeIri('trust.delegation')}> ;`);
      if (initiator) s.push(`  core:delegationDelegator ${initiatorAgent ?? accountIri(chainId, initiator)} ;`);
      if (approver) s.push(`  core:delegationDelegatee ${approverAgent ?? accountIri(chainId, approver)} ;`);
      if (typeof drow?.ipfsCid === 'string' && drow.ipfsCid.trim())
        s.push(`  core:delegationAuthorityValue "${escapeTurtleString(drow.ipfsCid.trim())}" ;`);
      if (delegationJsonText) s.push(`  core:json ${turtleJsonLiteral(delegationJsonText)} ;`);
      else s.push(`  core:json ${turtleJsonLiteral(JSON.stringify({ raw: decodedText }))} ;`);
      s.push(`  .\n`);
      chunks.push(s.join('\n'));

      // Minimal permission extraction: try known keys, else fall back to inferred kind.
      let permAction = '';
      if (typeof drow?.extractedKind === 'string') {
        const k = drow.extractedKind.trim().toLowerCase();
        if (k.includes('feedback')) permAction = 'giveFeedback';
        else if (k.includes('validation')) permAction = 'validate';
      }
      if (!permAction && typeof drow?.extractedFeedbackAuth === 'string' && drow.extractedFeedbackAuth.trim()) permAction = 'giveFeedback';
      if (!permAction && typeof drow?.extractedRequestHash === 'string' && drow.extractedRequestHash.trim()) permAction = 'validate';

      const permIri = erc8092DelegationPermissionIri(chainId, associationId, 1);
      const p: string[] = [];
      p.push(`${permIri} a core:DelegationPermission, prov:Entity ;`);
      if (permAction) p.push(`  core:permissionAction "${escapeTurtleString(permAction)}" ;`);
      p.push(`  .\n`);
      chunks.push(p.join('\n'));
      chunks.push(`${delSituationIri} core:delegationGrantsPermission ${permIri} .\n`);

      // Delegation assertion record + act
      const r: string[] = [];
      r.push(`${delAssertionIri} a core:DelegationTrustAssertion, core:TrustAssertion, prov:Entity ;`);
      r.push(`  core:recordsSituation ${delSituationIri} ;`);
      r.push(`  core:assertionRecordOf ${delActIri} ;`);
      r.push(`  prov:wasDerivedFrom ${raIri} ;`);
      if (initiator) r.push(`  prov:wasAttributedTo ${initiatorAgent ?? accountIri(chainId, initiator)} ;`);
      r.push(`  .\n`);
      chunks.push(r.join('\n'));

      const a: string[] = [];
      a.push(`${delActIri} a core:DelegationTrustAssertionAct, core:TrustAssertionAct, prov:Activity ;`);
      a.push(`  core:generatedAssertionRecord ${delAssertionIri} ;`);
      a.push(`  core:assertsSituation ${delSituationIri} ;`);
      if (initiator) a.push(`  prov:wasAssociatedWith ${initiatorAgent ?? accountIri(chainId, initiator)} ;`);
      a.push(`  .\n`);
      chunks.push(a.join('\n'));
    }

    // Act: provenance-bearing activity that generated the record and asserted the situation.
    chunks.push(`${actIri} a erc8092:AssociatedAccountsAct8092, core:TrustAssertionAct, prov:Activity ;\n`);
    chunks.push(`  core:generatedAssertionRecord ${raIri} ;\n`);
    chunks.push(`  core:assertsSituation ${relSituationIri} ;\n`);
    // Best-effort: associate the act with a participant account if present.
    if (initiator) {
      const initiatorTok = initiatorAgent ?? accountIri(chainId, initiator);
      chunks.push(`  prov:wasAssociatedWith ${initiatorTok} ;\n`);
      chunks.push(`  core:assertedBy ${initiatorTok} ;\n`);
    }
    chunks.push(`  .\n`);

    // Emit AssociatedAccountsRevocation8092 nodes (best-effort)
    for (const r of revocationRows) {
      const rid = String(r?.id ?? '');
      if (!rid) continue;
      const rr: string[] = [];
      const rIri = relationshipRevocationAssertionIri(chainId, rid);
      const rActIri = actIriFromRecordIri(rIri);
      rr.push(`${rIri} a erc8092:AssociatedAccountsRevocation8092, prov:Entity ;`);
      rr.push(`  erc8092:relationshipAssertionId "${escapeTurtleString(rid)}" ;`);
      rr.push(`  erc8092:revocationOfAssociatedAccounts ${raIri} ;`);
      rr.push(`  core:assertionRecordOf ${rActIri} ;`);
      if (r?.revokedAt != null) rr.push(`  erc8092:revokedAt ${Number(r.revokedAt) || 0} ;`);
      if (r?.txHash) rr.push(`  erc8092:revocationTxHash "${escapeTurtleString(String(r.txHash))}" ;`);
      if (r?.blockNumber != null) rr.push(`  erc8092:revocationBlockNumber ${Number(r.blockNumber) || 0} ;`);
      if (r?.timestamp != null) rr.push(`  erc8092:revocationTimestamp ${Number(r.timestamp) || 0} ;`);
      rr.push(`  .\n`);
      chunks.push(rr.join('\n'));

      // Act for revocation
      const rrAct: string[] = [];
      rrAct.push(`${rActIri} a erc8092:AssociatedAccountsRevocationAct8092, core:TrustAssertionAct, prov:Activity ;`);
      rrAct.push(`  core:generatedAssertionRecord ${rIri} ;`);
      rrAct.push(`  core:assertsSituation ${relSituationIri} ;`);
      rrAct.push(`  .\n`);
      chunks.push(rrAct.join('\n'));
    }
  }

  // Optimize: For large exports, join more efficiently
  if (!onlyAgent && chunks.length > 1000) {
    console.log(`[rdf-export] Joining ${chunks.length} chunks...`);
  }
  const ttl = chunks.join('\n');

  const path = await import('node:path');
  const publicDir =
    (process.env.RDF_PUBLIC_DIR && process.env.RDF_PUBLIC_DIR.trim()) ||
    path.resolve(process.cwd(), '../badge-admin/public');

  const outPath = onlyAgent
    ? path.resolve(publicDir, 'rdf', `agent-${onlyAgent.chainId}-${onlyAgent.agentId}.ttl`)
    : path.resolve(publicDir, 'rdf', 'agents.ttl');
  
  if (!onlyAgent) {
    console.log(`[rdf-export] Writing ${(ttl.length / 1024 / 1024).toFixed(2)} MB to file...`);
  }
  
  await writeFileAtomically(outPath, ttl);
  const bytes = Buffer.byteLength(ttl, 'utf8');
  
  if (!onlyAgent) {
    console.log(`[rdf-export] Complete: ${included} agents, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
  }
  
  return { outPath, bytes, agentCount: included };
}

export async function exportAllAgentsRdf(db: AnyDb): Promise<{ outPath: string; bytes: number; agentCount: number }> {
  return await exportAgentsRdfInternal(db);
}

export async function exportOneAgentRdf(
  db: AnyDb,
  chainId: number,
  agentId: string,
): Promise<{ outPath: string; bytes: number; agentCount: number }> {
  return await exportAgentsRdfInternal(db, { chainId, agentId });
}

export async function exportAgentRdfForAgentCardUpdate(db: AnyDb, chainId: number, agentId: string): Promise<void> {
  if (!isNode()) return;
  if (!db) return;
  // single-file export (requested): regenerate from all stored agent cards
  const result = await exportAllAgentsRdf(db);
  console.info('[rdf-export] wrote combined', { trigger: { chainId, agentId }, ...result });
  await setCheckpointValue(db, 'agentRdfExportCursor', `${chainId}|${agentId}|${Math.floor(Date.now() / 1000)}`);
}

export async function backfillAgentRdfFromStoredAgentDescriptors(
  db: AnyDb,
  opts?: { reset?: boolean; chunkSize?: number; max?: number },
): Promise<void> {
  if (!isNode()) return;
  if (!db) return;

  const checkpointKey = 'agentRdfBackfillCursor';
  if (opts?.reset) {
    try {
      await db.prepare('DELETE FROM checkpoints WHERE key = ?').run(checkpointKey);
      console.info('[rdf-backfill] reset: cleared agentRdfBackfillCursor checkpoint');
    } catch (e) {
      console.warn('[rdf-backfill] reset requested but failed to clear checkpoint', e);
    }
  }
  const result = await exportAllAgentsRdf(db);
  console.info('[rdf-backfill] wrote combined', result);
  await setCheckpointValue(db, checkpointKey, `${Math.floor(Date.now() / 1000)}`);
}


