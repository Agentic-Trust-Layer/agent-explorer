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
    '@prefix agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#> .',
    '@prefix agentictrustEth: <https://www.agentictrust.io/ontology/agentictrust-eth#> .',
    '@prefix erc8004: <https://www.agentictrust.io/ontology/ERC8004#> .',
    '@prefix erc8092: <https://www.agentictrust.io/ontology/ERC8092#> .',
    '',
    // Provide an ontology header so Protégé auto-loads imports instead of requiring manual import.
    '<https://www.agentictrust.io/data/agents> a owl:Ontology ;',
    '  owl:imports <https://www.agentictrust.io/ontology/agentictrust-core> ;',
    '  owl:imports <https://www.agentictrust.io/ontology/agentictrust-eth> ;',
    '  owl:imports <https://www.agentictrust.io/ontology/ERC8004> ;',
    '  owl:imports <https://www.agentictrust.io/ontology/ERC8092> ;',
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
  // Use rdf:JSON datatype (supported by many RDF tools; Protege can still display as literal).
  // Use triple-quoted literal, but still escape backslashes/quotes to keep it robust.
  const escaped = escapeTurtleString(jsonText);
  return `"""${escaped}"""^^rdf:JSON`;
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

function agentIri(chainId: number, agentId: string, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/agent/${identifier}>`;
}

function agentDescriptorIri(chainId: number, agentId: string, didIdentity?: string | null): string {
  // Use DID for protocol-agnostic IRI, fallback to chainId/agentId if DID not available
  const identifier = didIdentity ? iriEncodeSegment(didIdentity) : `${chainId}/${iriEncodeSegment(agentId)}`;
  return `<https://www.agentictrust.io/id/agent-descriptor/${identifier}>`;
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
  // Account is prov:Entity (identifier/interface), not prov:Agent (controller)
  // Account is Ethereum-specific, uses agentictrustEth prefix
  chunks.push(
    `${acctIri} a agentictrustEth:Account, prov:Entity ;\n` +
      `  agentictrustEth:accountChainId ${chainId} ;\n` +
      `  agentictrustEth:accountAddress "${escapeTurtleString(addr.toLowerCase())}" ;\n` +
      `  agentictrustEth:accountType "${accountType}" .\n\n`,
  );
}

function feedbackIri(chainId: number, agentId: string, client: string, feedbackIndex: number): string {
  return `<https://www.agentictrust.io/id/feedback/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(client.toLowerCase())}/${feedbackIndex}>`;
}

function feedbackResponseIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/feedback-response/${chainId}/${iriEncodeSegment(id)}>`;
}

function validationRequestIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/validation-request/${chainId}/${iriEncodeSegment(id)}>`;
}

function validationResponseIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/validation-response/${chainId}/${iriEncodeSegment(id)}>`;
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

function intentTypeIri(value: string): string {
  return `https://www.agentictrust.io/ontology/agentictrust-core/intentType/${iriEncodeSegment(value)}`;
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

  const aIri = agentIri(chainId, agentId, row?.didIdentity);
  const cIri = agentDescriptorIri(chainId, agentId, row?.didIdentity);
  const fetchIri = fetchActivityIri(chainId, agentId, readAt, row?.didIdentity);

  const lines: string[] = [];
  const afterAgent: string[] = [];

  // Agent
  lines.push(`${aIri} a agentictrust:AIAgent, prov:SoftwareAgent ;`);
  lines.push(`  agentictrust:agentId "${escapeTurtleString(String(agentId))}" ;`);
  if (row?.agentName) lines.push(`  agentictrust:agentName "${escapeTurtleString(String(row.agentName))}" ;`);
  
  // 8004Identity and 8004IdentityIdentifier for didIdentity
  if (row?.didIdentity) {
    lines.push(`  agentictrust:didIdentity "${escapeTurtleString(String(row.didIdentity))}" ;`);
    const didIdentityIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(String(row.didIdentity))}>`;
    
    // Create 8004Identity instance
    const identity8004IriValue = identity8004Iri(chainId, agentId, row.didIdentity);
    lines.push(`  erc8004:has8004Identity ${identity8004IriValue} ;`);
    
    // Create 8004IdentityIdentifier instance
    const identityIdentifierIri = identifierIri(chainId, agentId, '8004', row.didIdentity);
    
    // Emit 8004Identity
    accountChunks.push(
      `${identity8004IriValue} a erc8004:8004Identity, prov:Entity ;\n` +
        `  agentictrust:hasIdentifier ${identityIdentifierIri} .\n\n`,
    );
    
    // Emit 8004IdentityIdentifier
    accountChunks.push(
      `${identityIdentifierIri} a erc8004:8004IdentityIdentifier, agentictrust:UniversalIdentifier, agentictrust:Identifier, prov:Entity ;\n` +
        `  agentictrust:identifierType erc8004:IdentifierType_8004 ;\n` +
        `  agentictrust:hasDID ${didIdentityIri} .\n\n`,
    );
    
    // Emit DID instance for identifier
    accountChunks.push(
      `${didIdentityIri} a agentictrust:DID, agentictrust:DecentralizedIdentifier, prov:Entity ;\n` +
        `  agentictrust:identifies ${identityIdentifierIri} .\n\n`,
    );
  }
  
  // ENSNameIdentifier and ENSName for agentName ending in .eth
  if (row?.agentName && isValidENSName(String(row.agentName))) {
    const ensName = String(row.agentName).trim();
    const ensDid = row?.didName || `did:ens:${chainId}:${ensName}`;
    const ensDidIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(ensDid)}>`;
    
    // Create ENSNameIdentifier instance
    const ensIdentifierIri = identifierIri(chainId, agentId, 'ens', null, ensName);
    // Link agent directly to ENSNameIdentifier via hasIdentifier
    lines.push(`  agentictrust:hasIdentifier ${ensIdentifierIri} ;`);
    
    // Create ENSName instance
    const ensNameIriValue = ensNameIri(chainId, ensName);
    lines.push(`  agentictrustEth:hasENSName ${ensNameIriValue} ;`);
    
    // Emit ENSName
    accountChunks.push(
      `${ensNameIriValue} a agentictrustEth:ENSName, agentictrust:Name, prov:Entity ;\n` +
        `  agentictrustEth:ensName "${escapeTurtleString(ensName)}" ;\n` +
        `  agentictrustEth:ensChainId ${chainId} ;\n` +
        `  agentictrustEth:hasIdentifier ${ensIdentifierIri} .\n\n`,
    );
    
    // Emit ENSNameIdentifier
    accountChunks.push(
      `${ensIdentifierIri} a agentictrustEth:ENSNameIdentifier, agentictrust:Identifier, prov:Entity ;\n` +
        `  agentictrust:identifierType agentictrustEth:IdentifierType_ens ;\n` +
        `  agentictrust:hasDID ${ensDidIri} ;\n` +
        `  rdfs:label "${escapeTurtleString(ensName)}" .\n\n`,
    );
    
    // Emit DID for ENS name
    accountChunks.push(
      `${ensDidIri} a agentictrust:DID, agentictrust:DecentralizedIdentifier, prov:Entity ;\n` +
        `  agentictrust:identifies ${ensIdentifierIri} .\n\n`,
    );
  }
  
  if (row?.didAccount) lines.push(`  agentictrust:didAccount "${escapeTurtleString(String(row.didAccount))}" ;`);
  if (row?.didName) lines.push(`  agentictrust:didName "${escapeTurtleString(String(row.didName))}" ;`);
  if (row?.agentAccount) {
    lines.push(`  agentictrust:agentAccount "${escapeTurtleString(String(row.agentAccount))}" ;`);
    // Link to AccountIdentifier instance (agentAccount is the primary account, typically SmartAccount)
    const acctIri = accountIri(chainId, String(row.agentAccount));
    const accountIdentifierIriValue = accountIdentifierIri(chainId, String(row.agentAccount));
    // Link agent to AccountIdentifier via hasAccountIdentifier
    lines.push(`  agentictrustEth:hasAccountIdentifier ${accountIdentifierIriValue} ;`);
    // Also link via core hasIdentifier for protocol-agnostic access
    lines.push(`  agentictrust:hasIdentifier ${accountIdentifierIriValue} ;`);
    
    // Emit AccountIdentifier instance
    const accountIdentifierLines: string[] = [];
    accountIdentifierLines.push(`${accountIdentifierIriValue} a agentictrustEth:AccountIdentifier, agentictrust:Identifier, prov:Entity ;`);
    accountIdentifierLines.push(`  agentictrust:identifierType agentictrustEth:IdentifierType_account ;`);
    // Link Account -> AccountIdentifier (canonical direction in agentictrust-eth)
    accountChunks.push(`${acctIri} agentictrustEth:hasIdentifier ${accountIdentifierIriValue} .\n\n`);
    // Link AccountIdentifier to DID if present
    if (row?.didAccount) {
      const didIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(String(row.didAccount))}>`;
      accountIdentifierLines.push(`  agentictrustEth:hasDID ${didIri} ;`);
      // Emit DID instance
      accountChunks.push(
        `${didIri} a agentictrust:DID, agentictrust:DecentralizedIdentifier, prov:Entity ;\n` +
          `  agentictrust:identifies ${accountIdentifierIriValue} .\n\n`,
      );
    }
    accountChunks.push(accountIdentifierLines.join('\n') + ' .\n\n');
    
    // Emit Account instance with account properties
    const accountLines: string[] = [];
    accountLines.push(`${acctIri} a agentictrustEth:Account, prov:Entity ;`);
    accountLines.push(`  agentictrustEth:accountChainId ${chainId} ;`);
    accountLines.push(`  agentictrustEth:accountAddress "${escapeTurtleString(String(row.agentAccount).toLowerCase())}" ;`);
    accountLines.push(`  agentictrustEth:accountType "SmartAccount" ;`);
    accountLines.push(`  agentictrustEth:hasIdentifier ${accountIdentifierIriValue} ;`);
    // Link Account to EOA owner if present
    if (row?.eoaOwner) {
      const eoaAddr = normalizeHex(String(row.eoaOwner));
      if (eoaAddr) {
        const eoaIri = accountIri(chainId, eoaAddr);
        accountLines.push(`  agentictrustEth:hasEOAOwner ${eoaIri} ;`);
        accountLines.push(`  agentictrustEth:signingAuthority ${eoaIri} ;`);
        // Emit EOA Account instance
        ensureAccountNode(accountChunks, chainId, eoaAddr, 'EOA');
      }
    }
    accountLines.push(`  .\n`);
    accountChunks.push(accountLines.join('\n'));
  }
  if (row?.agentOwner) lines.push(`  agentictrust:agentOwner "${escapeTurtleString(String(row.agentOwner))}" ;`);
  if (row?.eoaOwner) lines.push(`  agentictrust:eoaOwner "${escapeTurtleString(String(row.eoaOwner))}" ;`);
  if (row?.tokenUri) {
    const tok = turtleIriOrLiteral(String(row.tokenUri));
    if (tok) lines.push(`  agentictrust:tokenUri ${tok} ;`);
  }
  if (row?.a2aEndpoint) {
    const tok = turtleIriOrLiteral(String(row.a2aEndpoint));
    if (tok) lines.push(`  agentictrust:a2aEndpoint ${tok} ;`);
  }
  if (row?.ensEndpoint) {
    const tok = turtleIriOrLiteral(String(row.ensEndpoint));
    if (tok) lines.push(`  agentictrustEth:ensEndpoint ${tok} ;`);
  }
  if (row?.agentAccountEndpoint) {
    const tok = turtleIriOrLiteral(String(row.agentAccountEndpoint));
    if (tok) lines.push(`  agentictrust:agentAccountEndpoint ${tok} ;`);
  }
  if (row?.supportedTrust) lines.push(`  agentictrust:supportedTrust "${escapeTurtleString(String(row.supportedTrust))}" ;`);
  if (row?.createdAtTime) lines.push(`  agentictrust:createdAtTime ${Number(row.createdAtTime) || 0} ;`);
  if (row?.updatedAtTime) lines.push(`  agentictrust:updatedAtTime ${Number(row.updatedAtTime) || 0} ;`);
  lines.push(`  agentictrust:agentDescriptorReadAt ${readAt} ;`);
  lines.push(`  agentictrust:hasAgentDescriptor ${cIri} ;`);
  if (row?.rawJson) lines.push(`  agentictrust:json ${turtleJsonLiteral(String(row.rawJson))} ;`);
  lines.push(`  .\n`);

  // Agent descriptor (agent-level, protocol-agnostic)
  lines.push(`${cIri} a agentictrust:AgentDescriptor, prov:Entity ;`);
  if (typeof agentCard?.name === 'string' && agentCard.name.trim()) lines.push(`  rdfs:label "${escapeTurtleString(agentCard.name.trim())}" ;`);
  if (typeof agentCard?.description === 'string' && agentCard.description.trim())
    lines.push(`  dcterms:description "${escapeTurtleString(agentCard.description.trim())}" ;`);
  
  // A2A Protocol Descriptor (protocol-specific properties)
  // Note: AgentDescriptor and ProtocolDescriptor are distinct and not related per ontology design
  // Protocol-specific properties go on A2AProtocolDescriptor
  const hasProtocolProps = 
    (typeof agentCard?.protocolVersion === 'string' && agentCard.protocolVersion.trim()) ||
    (typeof agentCard?.preferredTransport === 'string' && agentCard.preferredTransport.trim()) ||
    (typeof agentCard?.url === 'string' && agentCard.url.trim());
  
  if (hasProtocolProps) {
    // Use DID for protocol descriptor IRI (protocol-agnostic, no chainId needed)
    const didForProtocol = row?.didIdentity ? iriEncodeSegment(String(row.didIdentity)) : `${chainId}/${iriEncodeSegment(agentId)}`;
    const protocolIri = `<https://www.agentictrust.io/id/protocol-descriptor/a2a/${didForProtocol}>`;
    afterAgent.push(`${protocolIri} a agentictrust:A2AProtocolDescriptor, agentictrust:ProtocolDescriptor, prov:Entity ;`);
    if (typeof agentCard?.protocolVersion === 'string' && agentCard.protocolVersion.trim())
      afterAgent.push(`  agentictrust:protocolVersion "${escapeTurtleString(agentCard.protocolVersion.trim())}" ;`);
    if (typeof agentCard?.preferredTransport === 'string' && agentCard.preferredTransport.trim())
      afterAgent.push(`  agentictrust:preferredTransport "${escapeTurtleString(agentCard.preferredTransport.trim())}" ;`);
    if (typeof agentCard?.url === 'string' && agentCard.url.trim()) {
      const tok = turtleIriOrLiteral(agentCard.url.trim());
      if (tok) afterAgent.push(`  agentictrust:serviceUrl ${tok} ;`);
    }
    afterAgent.push(`  .\n`);
  }
  lines.push(`  agentictrust:json ${turtleJsonLiteral(agentCardJsonText)} ;`);

  const skills: any[] = Array.isArray(agentCard?.skills) ? agentCard.skills : [];
  for (const skill of skills) {
    const id = typeof skill?.id === 'string' ? skill.id.trim() : '';
    if (!id) continue;
    lines.push(`  agentictrust:hasSkill ${skillIri(chainId, agentId, id, row?.didIdentity)} ;`);
  }
  lines.push(`  .\n`);

  // Fetch provenance
  lines.push(`${fetchIri} a agentictrust:AgentDescriptorFetch, prov:Activity ;`);
  lines.push(`  prov:generated ${cIri} ;`);
  lines.push(`  prov:endedAtTime "${new Date(readAt * 1000).toISOString()}"^^xsd:dateTime ;`);
  lines.push(`  .\n`);

  // Skills + examples + tags
  const allTags: string[] = [];
  for (const skill of skills) {
    const id = typeof skill?.id === 'string' ? skill.id.trim() : '';
    if (!id) continue;
    const sIri = skillIri(chainId, agentId, id, row?.didIdentity);
    const afterSkill: string[] = [];
    lines.push(`${sIri} a agentictrust:Skill, prov:Entity ;`);
    lines.push(`  agentictrust:skillId "${escapeTurtleString(id)}" ;`);
    if (typeof skill?.name === 'string' && skill.name.trim()) lines.push(`  agentictrust:skillName "${escapeTurtleString(skill.name.trim())}" ;`);
    if (typeof skill?.description === 'string' && skill.description.trim())
      lines.push(`  agentictrust:skillDescription "${escapeTurtleString(skill.description.trim())}" ;`);

    const inputSchema =
      skill?.inputSchema && typeof skill.inputSchema === 'object' ? skill.inputSchema :
      skill?.input_schema && typeof skill.input_schema === 'object' ? skill.input_schema :
      null;
    if (inputSchema) {
      const schemaIri = skillSchemaIri(chainId, agentId, id, 'input', row?.didIdentity);
      lines.push(`  agentictrust:hasInputSchema ${schemaIri} ;`);
      try {
        afterSkill.push(`${schemaIri} a agentictrust:JsonSchema, prov:Entity ;`);
        afterSkill.push(`  agentictrust:schemaJson ${turtleJsonLiteral(JSON.stringify(inputSchema))} ;`);
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
      const schemaIri = skillSchemaIri(chainId, agentId, id, 'output', row?.didIdentity);
      lines.push(`  agentictrust:hasOutputSchema ${schemaIri} ;`);
      try {
        afterSkill.push(`${schemaIri} a agentictrust:JsonSchema, prov:Entity ;`);
        afterSkill.push(`  agentictrust:schemaJson ${turtleJsonLiteral(JSON.stringify(outputSchema))} ;`);
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
        lines.push(`  agentictrust:hasTag ${tagIri} ;`);
      }
    }

    const examples: any[] = Array.isArray(skill?.examples) ? skill.examples : [];
    let exampleIndex = 0;
    for (const ex of examples) {
      exampleIndex += 1;
      const exIri = `<https://www.agentictrust.io/id/example/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(id)}/${exampleIndex}>`;
      lines.push(`  agentictrust:hasExample ${exIri} ;`);

      const title = typeof ex?.title === 'string' ? ex.title.trim() : '';
      afterSkill.push(`${exIri} a agentictrust:SkillExample, prov:Entity ;`);
      if (title) afterSkill.push(`  rdfs:label "${escapeTurtleString(title)}" ;`);
      try {
        afterSkill.push(`  agentictrust:json ${turtleJsonLiteral(JSON.stringify(ex))} ;`);
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
    lines.push(`${tagIri} a agentictrust:Tag, prov:Entity ; rdfs:label "${escapeTurtleString(t)}" .`);
  }
  lines.push('');

  return lines.join('\n');
}

function renderAgentNodeWithoutCard(row: any, accountChunks: string[]): string {
  const chainId = Number(row?.chainId ?? 0) || 0;
  const agentId = String(row?.agentId ?? '');
  const aIri = agentIri(chainId, agentId, row?.didIdentity);

  const lines: string[] = [];
  lines.push(`${aIri} a agentictrust:AIAgent, prov:SoftwareAgent ;`);
  lines.push(`  agentictrust:agentId "${escapeTurtleString(String(agentId))}" ;`);
  if (row?.agentName) lines.push(`  agentictrust:agentName "${escapeTurtleString(String(row.agentName))}" ;`);
  
  // 8004Identity and 8004IdentityIdentifier for didIdentity
  if (row?.didIdentity) {
    lines.push(`  agentictrust:didIdentity "${escapeTurtleString(String(row.didIdentity))}" ;`);
    const didIdentityIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(String(row.didIdentity))}>`;
    
    // Create 8004Identity instance
    const identity8004IriValue = identity8004Iri(chainId, agentId, row.didIdentity);
    lines.push(`  erc8004:has8004Identity ${identity8004IriValue} ;`);
    
    // Create 8004IdentityIdentifier instance
    const identityIdentifierIri = identifierIri(chainId, agentId, '8004', row.didIdentity);
    
    // Emit 8004Identity
    accountChunks.push(
      `${identity8004IriValue} a erc8004:8004Identity, prov:Entity ;\n` +
        `  agentictrust:hasIdentifier ${identityIdentifierIri} .\n\n`,
    );
    
    // Emit 8004IdentityIdentifier
    accountChunks.push(
      `${identityIdentifierIri} a erc8004:8004IdentityIdentifier, agentictrust:UniversalIdentifier, agentictrust:Identifier, prov:Entity ;\n` +
        `  agentictrust:identifierType erc8004:IdentifierType_8004 ;\n` +
        `  agentictrust:hasDID ${didIdentityIri} .\n\n`,
    );
    
    // Emit DID instance for identifier
    accountChunks.push(
      `${didIdentityIri} a agentictrust:DID, agentictrust:DecentralizedIdentifier, prov:Entity ;\n` +
        `  agentictrust:identifies ${identityIdentifierIri} .\n\n`,
    );
  }
  
  // ENSNameIdentifier and ENSName for agentName ending in .eth
  if (row?.agentName && isValidENSName(String(row.agentName))) {
    const ensName = String(row.agentName).trim();
    const ensDid = row?.didName || `did:ens:${chainId}:${ensName}`;
    const ensDidIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(ensDid)}>`;
    
    // Create ENSNameIdentifier instance
    const ensIdentifierIri = identifierIri(chainId, agentId, 'ens', null, ensName);
    // Link agent directly to ENSNameIdentifier via hasIdentifier
    lines.push(`  agentictrust:hasIdentifier ${ensIdentifierIri} ;`);
    
    // Create ENSName instance
    const ensNameIriValue = ensNameIri(chainId, ensName);
    lines.push(`  agentictrustEth:hasENSName ${ensNameIriValue} ;`);
    
    // Emit ENSName
    accountChunks.push(
      `${ensNameIriValue} a agentictrustEth:ENSName, agentictrust:Name, prov:Entity ;\n` +
        `  agentictrustEth:ensName "${escapeTurtleString(ensName)}" ;\n` +
        `  agentictrustEth:ensChainId ${chainId} ;\n` +
        `  agentictrustEth:hasIdentifier ${ensIdentifierIri} .\n\n`,
    );
    
    // Emit ENSNameIdentifier
    accountChunks.push(
      `${ensIdentifierIri} a agentictrustEth:ENSNameIdentifier, agentictrust:Identifier, prov:Entity ;\n` +
        `  agentictrust:identifierType agentictrustEth:IdentifierType_ens ;\n` +
        `  agentictrust:hasDID ${ensDidIri} ;\n` +
        `  rdfs:label "${escapeTurtleString(ensName)}" .\n\n`,
    );
    
    // Emit DID for ENS name
    accountChunks.push(
      `${ensDidIri} a agentictrust:DID, agentictrust:DecentralizedIdentifier, prov:Entity ;\n` +
        `  agentictrust:identifies ${ensIdentifierIri} .\n\n`,
    );
  }
  
  if (row?.didAccount) lines.push(`  agentictrust:didAccount "${escapeTurtleString(String(row.didAccount))}" ;`);
  if (row?.didName) lines.push(`  agentictrust:didName "${escapeTurtleString(String(row.didName))}" ;`);
  if (row?.agentAccount) {
    lines.push(`  agentictrust:agentAccount "${escapeTurtleString(String(row.agentAccount))}" ;`);
    // Link to AccountIdentifier instance (agentAccount is the primary account, typically SmartAccount)
    const acctIri = accountIri(chainId, String(row.agentAccount));
    const accountIdentifierIriValue = accountIdentifierIri(chainId, String(row.agentAccount));
    // Link agent to AccountIdentifier via hasAccountIdentifier
    lines.push(`  agentictrustEth:hasAccountIdentifier ${accountIdentifierIriValue} ;`);
    // Also link via core hasIdentifier for protocol-agnostic access
    lines.push(`  agentictrust:hasIdentifier ${accountIdentifierIriValue} ;`);
    
    // Emit AccountIdentifier instance
    const accountIdentifierLines: string[] = [];
    accountIdentifierLines.push(`${accountIdentifierIriValue} a agentictrustEth:AccountIdentifier, agentictrust:Identifier, prov:Entity ;`);
    accountIdentifierLines.push(`  agentictrust:identifierType agentictrustEth:IdentifierType_account ;`);
    // Link Account -> AccountIdentifier (canonical direction in agentictrust-eth)
    accountChunks.push(`${acctIri} agentictrustEth:hasIdentifier ${accountIdentifierIriValue} .\n\n`);
    // Link AccountIdentifier to DID if present
    if (row?.didAccount) {
      const didIri = `<https://www.agentictrust.io/id/did/${iriEncodeSegment(String(row.didAccount))}>`;
      accountIdentifierLines.push(`  agentictrustEth:hasDID ${didIri} ;`);
      // Emit DID instance
      accountChunks.push(
        `${didIri} a agentictrust:DID, agentictrust:DecentralizedIdentifier, prov:Entity ;\n` +
          `  agentictrust:identifies ${accountIdentifierIriValue} .\n\n`,
      );
    }
    accountChunks.push(accountIdentifierLines.join('\n') + ' .\n\n');
    
    // Emit Account instance with account properties
    const accountLines: string[] = [];
    accountLines.push(`${acctIri} a agentictrustEth:Account, prov:Entity ;`);
    accountLines.push(`  agentictrustEth:accountChainId ${chainId} ;`);
    accountLines.push(`  agentictrustEth:accountAddress "${escapeTurtleString(String(row.agentAccount).toLowerCase())}" ;`);
    accountLines.push(`  agentictrustEth:accountType "SmartAccount" ;`);
    accountLines.push(`  agentictrustEth:hasIdentifier ${accountIdentifierIriValue} ;`);
    // Link Account to EOA owner if present
    if (row?.eoaOwner) {
      const eoaAddr = normalizeHex(String(row.eoaOwner));
      if (eoaAddr) {
        const eoaIri = accountIri(chainId, eoaAddr);
        accountLines.push(`  agentictrustEth:hasEOAOwner ${eoaIri} ;`);
        accountLines.push(`  agentictrustEth:signingAuthority ${eoaIri} ;`);
        // Emit EOA Account instance
        ensureAccountNode(accountChunks, chainId, eoaAddr, 'EOA');
      }
    }
    accountLines.push(`  .\n`);
    accountChunks.push(accountLines.join('\n'));
  }
  if (row?.agentOwner) lines.push(`  agentictrust:agentOwner "${escapeTurtleString(String(row.agentOwner))}" ;`);
  if (row?.eoaOwner) lines.push(`  agentictrust:eoaOwner "${escapeTurtleString(String(row.eoaOwner))}" ;`);
  if (row?.tokenUri) {
    const tok = turtleIriOrLiteral(String(row.tokenUri));
    if (tok) lines.push(`  agentictrust:tokenUri ${tok} ;`);
  }
  if (row?.a2aEndpoint) {
    const tok = turtleIriOrLiteral(String(row.a2aEndpoint));
    if (tok) lines.push(`  agentictrust:a2aEndpoint ${tok} ;`);
  }
  if (row?.ensEndpoint) {
    const tok = turtleIriOrLiteral(String(row.ensEndpoint));
    if (tok) lines.push(`  agentictrustEth:ensEndpoint ${tok} ;`);
  }
  if (row?.agentAccountEndpoint) {
    const tok = turtleIriOrLiteral(String(row.agentAccountEndpoint));
    if (tok) lines.push(`  agentictrust:agentAccountEndpoint ${tok} ;`);
  }
  if (row?.supportedTrust) lines.push(`  agentictrust:supportedTrust "${escapeTurtleString(String(row.supportedTrust))}" ;`);
  if (row?.createdAtTime) lines.push(`  agentictrust:createdAtTime ${Number(row.createdAtTime) || 0} ;`);
  if (row?.updatedAtTime) lines.push(`  agentictrust:updatedAtTime ${Number(row.updatedAtTime) || 0} ;`);
  if (row?.rawJson) lines.push(`  agentictrust:json ${turtleJsonLiteral(String(row.rawJson))} ;`);
  lines.push(`  .\n`);

  return lines.join('\n');
}

async function exportAllAgentsRdf(db: AnyDb): Promise<{ outPath: string; bytes: number; agentCount: number }> {
  const safeAll = async (sql: string, ...params: any[]) => {
    try {
      const res = await db.prepare(sql).all(...params);
      return Array.isArray(res) ? res : Array.isArray((res as any)?.results) ? (res as any).results : [];
    } catch {
      return [];
    }
  };

  const allAgentsForMaps = await safeAll(`
    SELECT chainId, agentId, agentName, agentAccount, agentAddress, agentOwner, eoaOwner, didIdentity
    FROM agents
  `);
  const agentMetaByKey = new Map<string, { chainId: number; agentId: string; agentName?: string | null; didIdentity?: string | null }>();
  const agentByAccountKey = new Map<string, string>(); // `${chainId}|${addrLower}` -> agentIri
  const agentKeyByAccountKey = new Map<string, { chainId: number; agentId: string }>(); // `${chainId}|${addrLower}` -> {chainId, agentId}
  for (const row of allAgentsForMaps) {
    const chainId = Number(row?.chainId ?? 0) || 0;
    const agentId = String(row?.agentId ?? '');
    if (!agentId) continue;
    const key = `${chainId}|${agentId}`;
    agentMetaByKey.set(key, { chainId, agentId, agentName: row?.agentName != null ? String(row.agentName) : null, didIdentity: row?.didIdentity != null ? String(row.didIdentity) : null });
    const aIri = agentIri(chainId, agentId, row?.didIdentity);
    const acct = normalizeHex(row?.agentAccount);
    const addr = normalizeHex(row?.agentAddress);
    const owner = normalizeHex(row?.agentOwner);
    const eoa = normalizeHex(row?.eoaOwner);
    if (acct) {
      const k = `${chainId}|${acct}`;
      agentByAccountKey.set(k, aIri);
      agentKeyByAccountKey.set(k, { chainId, agentId });
    }
    if (addr) {
      const k = `${chainId}|${addr}`;
      agentByAccountKey.set(k, aIri);
      agentKeyByAccountKey.set(k, { chainId, agentId });
    }
    // Bridge relationship assertions to agents even when ERC-8092 initiator/approver addresses correspond
    // to the agent's owner EOAs (not the agent account / smart account).
    if (owner) {
      const k = `${chainId}|${owner}`;
      agentByAccountKey.set(k, aIri);
      agentKeyByAccountKey.set(k, { chainId, agentId });
    }
    if (eoa) {
      const k = `${chainId}|${eoa}`;
      agentByAccountKey.set(k, aIri);
      agentKeyByAccountKey.set(k, { chainId, agentId });
    }
  }

  const rows = await db
    .prepare(
      `
      SELECT
        chainId, agentId, agentName, agentOwner, eoaOwner, agentCategory, tokenUri,
        a2aEndpoint, ensEndpoint, agentAccountEndpoint,
        didIdentity, didAccount, didName,
        agentAccount,
        agentAddress,
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
    `,
    )
    .all();

  const agentRows: any[] = Array.isArray(rows) ? rows : Array.isArray((rows as any)?.results) ? (rows as any).results : [];

  const chunks: string[] = [];
  chunks.push(rdfPrefixes());

  const emittedAgents = new Set<string>(); // `${chainId}|${agentId}`
  const ensureAgentNode = (chainId: number, agentId: string) => {
    const key = `${chainId}|${agentId}`;
    if (emittedAgents.has(key)) return;
    emittedAgents.add(key);
    const meta = agentMetaByKey.get(key);
    const lines: string[] = [];
    lines.push(`${agentIri(chainId, agentId, meta?.didIdentity)} a agentictrust:AIAgent, prov:SoftwareAgent ;`);
    lines.push(`  agentictrust:agentId "${escapeTurtleString(String(agentId))}" ;`);
    if (meta?.agentName) lines.push(`  agentictrust:agentName "${escapeTurtleString(String(meta.agentName))}" ;`);
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  };

  let included = 0;
  for (const row of agentRows) {
    const chainId = Number(row?.chainId ?? 0) || 0;
    const agentId = String(row?.agentId ?? '');
    if (!agentId) continue;

    const key = `${chainId}|${agentId}`;
    if (emittedAgents.has(key)) {
      continue;
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
  }

  // ---- Trust registries (feedback/validation/associations) ----
  // Best-effort: if tables do not exist, skip without failing export.

  const feedbacks = await safeAll(
    `
    SELECT f.*
    FROM rep_feedbacks f
    `,
  );

  for (const f of feedbacks) {
    const chainId = Number(f?.chainId ?? 0) || 0;
    const agentId = String(f?.agentId ?? '');
    if (!agentId) continue;
    ensureAgentNode(chainId, agentId);
    const client = normalizeHex(f?.clientAddress) || String(f?.clientAddress ?? '');
    const feedbackIndex = Number(f?.feedbackIndex ?? 0) || 0;
    const fi = feedbackIri(chainId, agentId, client, feedbackIndex);
    const meta = agentMetaByKey.get(`${chainId}|${agentId}`);
    const ai = agentIri(chainId, agentId, meta?.didIdentity);
    chunks.push(`${ai} erc8004:hasFeedback ${fi} .\n`);

    const lines: string[] = [];
    lines.push(`${fi} a erc8004:Feedback, agentictrust:ReputationAssertion, prov:Entity ;`);
    lines.push(`  erc8004:feedbackIndex ${feedbackIndex} ;`);
    if (client) {
      ensureAccountNode(chunks, chainId, client, 'EOA'); // Feedback client is typically EOA
      lines.push(`  erc8004:feedbackClient ${accountIri(chainId, client)} ;`);
    }
    if (f?.score != null) lines.push(`  erc8004:feedbackScore ${Number(f.score) || 0} ;`);
    if (f?.ratingPct != null) lines.push(`  erc8004:feedbackRatingPct ${Number(f.ratingPct) || 0} ;`);
    if (f?.isRevoked != null) lines.push(`  erc8004:isRevoked ${Number(f.isRevoked) ? 'true' : 'false'} ;`);
    if (typeof f?.skill === 'string' && f.skill.trim()) {
      lines.push(`  erc8004:feedbackSkill ${skillIri(chainId, agentId, String(f.skill).trim(), meta?.didIdentity)} ;`);
    }
    const domain = typeof f?.domain === 'string' ? f.domain.trim() : '';
    if (domain) {
      lines.push(`  erc8004:feedbackIntentType <${intentTypeIri(domain)}> ;`);
    }
    if (f?.feedbackJson) lines.push(`  agentictrust:json ${turtleJsonLiteral(String(f.feedbackJson))} ;`);
    const fbObj = safeJsonObject(f?.feedbackJson);
    if (fbObj) {
      const offIri = feedbackOffchainIri(chainId, String(f?.id ?? `${agentId}:${client}:${feedbackIndex}`));
      lines.push(`  erc8004:hasFeedbackOffchainData ${offIri} ;`);

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
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
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
    const ai = agentIri(chainId, agentId, meta?.didIdentity);
    chunks.push(`${ai} erc8004:hasFeedback ${ri} .\n`);
    const lines: string[] = [];
    lines.push(`${ri} a erc8004:FeedbackResponse, agentictrust:ReputationAssertion, prov:Entity ;`);
    if (r?.responseJson) lines.push(`  agentictrust:json ${turtleJsonLiteral(String(r.responseJson))} ;`);
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  }

  const validationRequests = await safeAll(
    `
    SELECT v.*
    FROM validation_requests v
    `,
  );
  const requestByHash = new Map<string, string>(); // `${chainId}|${hash}` -> requestIri
  for (const v of validationRequests) {
    const chainId = Number(v?.chainId ?? 0) || 0;
    const agentId = String(v?.agentId ?? '');
    const id = String(v?.id ?? '');
    if (!id) continue;
    if (!agentId) continue;
    ensureAgentNode(chainId, agentId);
    const vi = validationRequestIri(chainId, id);
    // No direct agent link for requests; link agent via ValidationResponse using agentictrust:hasValidation.
    const lines: string[] = [];
    lines.push(`${vi} a erc8004:ValidationRequest, agentictrust:TrustSituation, prov:Activity ;`);
    const validator = normalizeHex(v?.validatorAddress);
    lines.push(`  erc8004:validationChainId ${chainId} ;`);
    lines.push(`  erc8004:requestingAgentId "${escapeTurtleString(agentId)}" ;`);
    if (validator) {
      ensureAccountNode(chunks, chainId, validator, 'SmartAccount'); // Validator is typically agentAccount
      lines.push(`  erc8004:validatorAddress "${escapeTurtleString(validator)}" ;`);
      lines.push(`  erc8004:validationValidator ${accountIri(chainId, validator)} ;`);
      const mapped = agentByAccountKey.get(`${chainId}|${validator}`);
      if (mapped) {
        lines.push(`  erc8004:validatorAgent ${mapped} ;`);
        const mk = agentKeyByAccountKey.get(`${chainId}|${validator}`);
        if (mk) ensureAgentNode(mk.chainId, mk.agentId);
      }
    }
    if (typeof v?.requestHash === 'string' && v.requestHash.trim()) lines.push(`  erc8004:requestHash "${escapeTurtleString(String(v.requestHash))}" ;`);
    if (v?.requestJson) lines.push(`  agentictrust:json ${turtleJsonLiteral(String(v.requestJson))} ;`);
    const reqObj = safeJsonObject(v?.requestJson);
    if (reqObj) {
      const offIri = validationOffchainIri(chainId, 'request', id);
      lines.push(`  erc8004:hasOffchainData ${offIri} ;`);
      const off: string[] = [];
      off.push(`${offIri} a erc8004:ValidationOffchainData, prov:Entity ;`);

      const createdAtLit = normalizeDateTimeLiteral(reqObj.createdAt);
      if (createdAtLit) off.push(`  erc8004:createdAt ${createdAtLit} ;`);
      const deadlineLit = normalizeDateTimeLiteral(reqObj.deadline);
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
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));

    const rh = typeof v?.requestHash === 'string' ? v.requestHash.trim() : '';
    if (rh) requestByHash.set(`${chainId}|${rh}`, vi);
  }

  const validationResponses = await safeAll(
    `
    SELECT v.*
    FROM validation_responses v
    `,
  );
  for (const v of validationResponses) {
    const chainId = Number(v?.chainId ?? 0) || 0;
    const agentId = String(v?.agentId ?? '');
    const id = String(v?.id ?? '');
    if (!id) continue;
    if (!agentId) continue;
    ensureAgentNode(chainId, agentId);
    const vi = validationResponseIri(chainId, id);
    const meta = agentMetaByKey.get(`${chainId}|${agentId}`);
    const ai = agentIri(chainId, agentId, meta?.didIdentity);
    chunks.push(`${ai} erc8004:hasValidation ${vi} .\n`);
    const lines: string[] = [];
    lines.push(`${vi} a erc8004:ValidationResponse, agentictrust:VerificationAssertion, prov:Entity ;`);
    lines.push(`  erc8004:validationChainIdForResponse ${chainId} ;`);
    lines.push(`  erc8004:requestingAgentIdForResponse "${escapeTurtleString(agentId)}" ;`);
    if (typeof v?.response === 'number' || typeof v?.response === 'string') lines.push(`  erc8004:validationResponseValue ${Number(v.response) || 0} ;`);
    if (typeof v?.responseHash === 'string' && v.responseHash.trim()) lines.push(`  erc8004:responseHash "${escapeTurtleString(String(v.responseHash))}" ;`);
    if (typeof v?.tag === 'string' && v.tag.trim()) lines.push(`  erc8004:validationTagCheck <${checkIri(v.tag.trim())}> ;`);
    const reqHash = typeof v?.requestHash === 'string' ? v.requestHash.trim() : '';
    if (reqHash) {
      lines.push(`  erc8004:requestHash "${escapeTurtleString(reqHash)}" ;`);
      const reqIri = requestByHash.get(`${chainId}|${reqHash}`);
      if (reqIri) {
        lines.push(`  erc8004:validationRespondsToRequest ${reqIri} ;`);
        chunks.push(`${reqIri} agentictrust:generatedAssertion ${vi} .\n`);
      }
    }
    const validator = normalizeHex(v?.validatorAddress);
    if (validator) {
      lines.push(`  erc8004:validatorAddressForResponse "${escapeTurtleString(validator)}" ;`);
      const mapped = agentByAccountKey.get(`${chainId}|${validator}`);
      if (mapped) {
        lines.push(`  erc8004:validatorAgentForResponse ${mapped} ;`);
        const mk = agentKeyByAccountKey.get(`${chainId}|${validator}`);
        if (mk) ensureAgentNode(mk.chainId, mk.agentId);
      }
    }
    if (v?.responseJson) lines.push(`  agentictrust:json ${turtleJsonLiteral(String(v.responseJson))} ;`);
    const respObj = safeJsonObject(v?.responseJson);
    if (respObj) {
      const offIri = validationOffchainIri(chainId, 'response', id);
      lines.push(`  erc8004:hasOffchainData ${offIri} ;`);
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
    lines.push(`  .\n`);
    chunks.push(lines.join('\n'));
  }

  // Relationships (ERC-8092): export as RelationshipAssertion + Relationship (see ERC8092.owl).
  const associations = await safeAll(
    `
    SELECT assoc.*
    FROM associations assoc
    `,
  );

  // Emit all relationship account ids for each chainId observed in associations.
  // Note: association_accounts table is not chain-scoped, but associations are, and our IRIs are chain-scoped.
  const associationAccounts = await safeAll(
    `
    SELECT a.*
    FROM association_accounts a
    `,
  );
  const associationChainIds = new Set<number>();
  for (const assoc of associations) {
    const chainId = Number(assoc?.chainId ?? 0) || 0;
    if (chainId) associationChainIds.add(chainId);
  }
  for (const a of associationAccounts) {
    const id = String(a?.id ?? '');
    if (!id) continue;
    for (const chainId of associationChainIds) {
      const iri = relationshipAccountIri(chainId, id);
      chunks.push(
        `${iri} a agentictrust:RelationshipAccount, erc8092:RelationshipAccount, prov:Entity ; erc8092:relationshipAccountId "${escapeTurtleString(
          id,
        )}" ; erc8092:accountAddress "${escapeTurtleString(id)}" .\n`,
      );
    }
  }

  const associationRevocations = await safeAll(
    `
    SELECT r.*
    FROM association_revocations r
    `,
  );
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
    const relIri = relationshipIri(chainId, relationshipId);
    const raIri = relationshipAssertionIri(chainId, associationId);
    const initiator = normalizeHex(assoc?.initiator);
    const approver = normalizeHex(assoc?.approver);

    const initiatorAgent = initiator ? agentByAccountKey.get(`${chainId}|${initiator}`) : undefined;
    const approverAgent = approver ? agentByAccountKey.get(`${chainId}|${approver}`) : undefined;

    if (initiatorAgent) {
      chunks.push(`${initiatorAgent} erc8092:hasRelationshipAssertion ${raIri} .\n`);
      const mk = initiator ? agentKeyByAccountKey.get(`${chainId}|${initiator}`) : undefined;
      if (mk) ensureAgentNode(mk.chainId, mk.agentId);
    }
    if (approverAgent) {
      chunks.push(`${approverAgent} erc8092:hasRelationshipAssertion ${raIri} .\n`);
      const mk = approver ? agentKeyByAccountKey.get(`${chainId}|${approver}`) : undefined;
      if (mk) ensureAgentNode(mk.chainId, mk.agentId);
    }

    const lines: string[] = [];
    // Relationship instance
    chunks.push(
      `${relIri} a agentictrust:Relationship, erc8092:ERC8092Relationship, prov:Entity ; erc8092:relationshipId "${escapeTurtleString(
        relationshipId,
      )}" .\n`,
    );

    // Relationship assertion (ERC-8092 association row)
    lines.push(`${raIri} a agentictrust:RelationshipAssertion, erc8092:ERC8092RelationshipAssertion, prov:Entity ;`);
    lines.push(`  erc8092:relationshipAssertionId "${escapeTurtleString(associationId)}" ;`);
    lines.push(`  agentictrust:assertsRelationship ${relIri} ;`);
    lines.push(`  agentictrust:aboutSubject ${relIri} ;`);
    if (initiator) {
      // initiator/approver reference agentAccount, not eoaOwner
      ensureAccountNode(chunks, chainId, initiator, 'SmartAccount');
      lines.push(`  erc8092:initiator ${initiatorAgent ?? accountIri(chainId, initiator)} ;`);
    }
    if (approver) {
      ensureAccountNode(chunks, chainId, approver, 'SmartAccount');
      lines.push(`  erc8092:approver ${approverAgent ?? accountIri(chainId, approver)} ;`);
    }

    if (assoc?.initiatorAccountId) {
      const id = String(assoc.initiatorAccountId);
      lines.push(`  erc8092:initiatorAccount ${relationshipAccountIri(chainId, id)} ;`);
      // Link RelationshipAccount -> controlling account/address node (bridge to agent account/owner)
      if (initiator) {
        ensureAccountNode(chunks, chainId, initiator, 'SmartAccount');
        chunks.push(
          `${relationshipAccountIri(chainId, id)} agentictrust:relationshipAccountForIdentifier ${accountIri(chainId, initiator)} .\n`,
        );
      }
      // Relationship -> RelationshipAccount (core-level traversal)
      chunks.push(`${relIri} agentictrust:hasRelationshipAccount ${relationshipAccountIri(chainId, id)} .\n`);
      if (initiatorAgent) {
        // Core-level bridge all the way to agent
        chunks.push(`${initiatorAgent} agentictrust:ownsRelationshipAccount ${relationshipAccountIri(chainId, id)} .\n`);
        // Also emit ERC-8092 subproperty for compatibility
        chunks.push(`${initiatorAgent} erc8092:ownsRelationshipAccount ${relationshipAccountIri(chainId, id)} .\n`);
      }
    }
    if (assoc?.approverAccountId) {
      const id = String(assoc.approverAccountId);
      lines.push(`  erc8092:approverAccount ${relationshipAccountIri(chainId, id)} ;`);
      // Link RelationshipAccount -> controlling account/address node (bridge to agent account/owner)
      if (approver) {
        ensureAccountNode(chunks, chainId, approver, 'SmartAccount');
        chunks.push(
          `${relationshipAccountIri(chainId, id)} agentictrust:relationshipAccountForIdentifier ${accountIri(chainId, approver)} .\n`,
        );
      }
      // Relationship -> RelationshipAccount (core-level traversal)
      chunks.push(`${relIri} agentictrust:hasRelationshipAccount ${relationshipAccountIri(chainId, id)} .\n`);
      if (approverAgent) {
        // Core-level bridge all the way to agent
        chunks.push(`${approverAgent} agentictrust:ownsRelationshipAccount ${relationshipAccountIri(chainId, id)} .\n`);
        // Also emit ERC-8092 subproperty for compatibility
        chunks.push(`${approverAgent} erc8092:ownsRelationshipAccount ${relationshipAccountIri(chainId, id)} .\n`);
      }
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

    // Emit RelationshipAccount nodes (best-effort)
    if (assoc?.initiatorAccountId) {
      const id = String(assoc.initiatorAccountId);
      chunks.push(
        `${relationshipAccountIri(chainId, id)} a agentictrust:RelationshipAccount, erc8092:RelationshipAccount, prov:Entity ; erc8092:relationshipAccountId "${escapeTurtleString(
          id,
        )}" ; erc8092:accountAddress "${escapeTurtleString(id)}" .\n`,
      );
    }
    if (assoc?.approverAccountId) {
      const id = String(assoc.approverAccountId);
      chunks.push(
        `${relationshipAccountIri(chainId, id)} a agentictrust:RelationshipAccount, erc8092:RelationshipAccount, prov:Entity ; erc8092:relationshipAccountId "${escapeTurtleString(
          id,
        )}" ; erc8092:accountAddress "${escapeTurtleString(id)}" .\n`,
      );
    }

    // Emit RelationshipRevocationAssertion nodes (best-effort)
    for (const r of revocationRows) {
      const rid = String(r?.id ?? '');
      if (!rid) continue;
      const rr: string[] = [];
      const rIri = relationshipRevocationAssertionIri(chainId, rid);
      rr.push(`${rIri} a erc8092:RelationshipRevocationAssertion, prov:Entity ;`);
      rr.push(`  erc8092:relationshipAssertionId "${escapeTurtleString(rid)}" ;`);
      rr.push(`  agentictrust:assertsRelationship ${relIri} ;`);
      rr.push(`  agentictrust:aboutSubject ${relIri} ;`);
      rr.push(`  erc8092:revocationOfRelationshipAssertion ${raIri} ;`);
      if (r?.revokedAt != null) rr.push(`  erc8092:revokedAt ${Number(r.revokedAt) || 0} ;`);
      if (r?.txHash) rr.push(`  erc8092:revocationTxHash "${escapeTurtleString(String(r.txHash))}" ;`);
      if (r?.blockNumber != null) rr.push(`  erc8092:revocationBlockNumber ${Number(r.blockNumber) || 0} ;`);
      if (r?.timestamp != null) rr.push(`  erc8092:revocationTimestamp ${Number(r.timestamp) || 0} ;`);
      rr.push(`  .\n`);
      chunks.push(rr.join('\n'));
    }
  }

  const ttl = chunks.join('\n');

  const path = await import('node:path');
  const publicDir =
    (process.env.RDF_PUBLIC_DIR && process.env.RDF_PUBLIC_DIR.trim()) ||
    path.resolve(process.cwd(), '../badge-admin/public');

  const outPath = path.resolve(publicDir, 'rdf', 'agents.ttl');
  await writeFileAtomically(outPath, ttl);
  return { outPath, bytes: Buffer.byteLength(ttl, 'utf8'), agentCount: included };
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


