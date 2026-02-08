import {
  accountIri,
  accountIdentifierIri,
  agentIriFrom8122Did,
  agentIriFromAccountDid,
  agentDescriptorIriFromAgentIri,
  agentRegistry8122Iri,
  escapeTurtleString,
  identity8122DescriptorIri,
  identity8122Iri,
  identityIdentifier8122Iri,
  rdfPrefixes,
  turtleJsonLiteral,
} from './common.js';

function normalizeHexAddr(value: unknown): string | null {
  const s = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return /^0x[0-9a-f]{40}$/.test(s) ? s : null;
}

function bytesFromHex(hex: string): Uint8Array | null {
  const s = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (!s || s.length % 2 !== 0) return null;
  if (!/^[0-9a-fA-F]+$/.test(s)) return null;
  const out = new Uint8Array(s.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function decode8122Value(value: unknown): string | null {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return null;
  if (raw.startsWith('0x')) {
    const bytes = bytesFromHex(raw);
    if (!bytes) return null;
    try {
      const txt = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      const cleaned = txt.replace(/\u0000+$/g, '').trim();
      return cleaned || null;
    } catch {
      return null;
    }
  }
  return raw;
}

function did8122(chainId: number, registry: string, agentId: string): string {
  // Deterministic identity string. (Not specified by ERC-8122; we mint a DID-like identifier for KB use.)
  const reg = registry.trim().toLowerCase();
  const aid = agentId.trim();
  return `did:8122:${chainId}:${reg}:${aid}`;
}

export function emitErc8122AgentsTurtle(args: {
  chainId: number;
  agents: any[];
  metadatas: any[];
}): { turtle: string } {
  const chainId = Math.trunc(Number(args.chainId));
  const lines: string[] = [rdfPrefixes()];

  // Group metadata rows by agentId
  const metaByAgent = new Map<string, any[]>();
  for (const m of args.metadatas || []) {
    const aid = typeof m?.agentId === 'string' ? m.agentId.trim() : '';
    if (!aid) continue;
    const arr = metaByAgent.get(aid) ?? [];
    arr.push(m);
    metaByAgent.set(aid, arr);
  }

  for (const row of args.agents || []) {
    const agentId = typeof row?.agentId === 'string' ? row.agentId.trim() : '';
    const createdAt = typeof row?.createdAt === 'string' ? row.createdAt.trim() : '';
    const updatedAt = typeof row?.updatedAt === 'string' ? row.updatedAt.trim() : '';
    const registry = normalizeHexAddr(row?.registry);
    const owner = normalizeHexAddr(row?.owner);
    const endpointType = typeof row?.endpointType === 'string' ? row.endpointType.trim() : '';
    const endpoint = typeof row?.endpoint === 'string' ? row.endpoint.trim() : '';
    const agentAccount = normalizeHexAddr(row?.agentAccount);

    if (!agentId || !registry || !owner) continue;

    const didIdentity = did8122(chainId, registry, agentId);
    const uaid = `uaid:${didIdentity}`;

    // If agentAccount is present, key agent node off account DID to merge with SmartAgent keyed nodes.
    const agentNode =
      agentAccount != null
        ? agentIriFromAccountDid(`did:ethr:${chainId}:${agentAccount}`)
        : agentIriFrom8122Did(didIdentity);

    const identityIri = identity8122Iri(didIdentity);
    const identIri = identityIdentifier8122Iri(didIdentity);
    const descIri = identity8122DescriptorIri(didIdentity);
    const agentDescIri = agentDescriptorIriFromAgentIri(agentNode);

    // Derive descriptor values from metadata collection (hex->utf8)
    const metas = metaByAgent.get(agentId) ?? [];
    let name: string | null = null;
    let description: string | null = null;
    let endpointTypeMeta: string | null = null;
    const kv: Record<string, any> = {};

    for (const m of metas) {
      const key = typeof m?.key === 'string' ? m.key.trim() : '';
      if (!key) continue;
      const decoded = decode8122Value(m?.value);
      if (decoded != null) kv[key] = decoded;
      if (key === 'name' && decoded) name = decoded;
      if (key === 'description' && decoded) description = decoded;
      if (key === 'endpoint_type' && decoded) endpointTypeMeta = decoded;
    }

    const effectiveEndpointType = endpointType || endpointTypeMeta || null;

    // Agent node (registry-agnostic typing)
    const agentExtraType = agentAccount != null ? ', core:AISmartAgent' : '';
    lines.push(`${agentNode} a core:AIAgent${agentExtraType}, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);
    lines.push(`  core:uaid "${escapeTurtleString(uaid)}" ;`);
    if (createdAt && /^\d+$/.test(createdAt)) lines.push(`  core:createdAtTime ${createdAt} ;`);
    if (updatedAt && /^\d+$/.test(updatedAt)) lines.push(`  core:updatedAtTime ${updatedAt} ;`);
    if (agentAccount != null) {
      const aaIri = accountIri(chainId, agentAccount);
      lines.push(`  core:hasAgentAccount ${aaIri} ;`);
    }
    // Keep a numeric-ish agent id on the agent for paging convenience (matches 8004 pattern but scoped in erc8122 namespace)
    lines.push(`  core:hasIdentity ${identityIri} ;`);
    lines.push(`  core:hasDescriptor ${agentDescIri} .`);
    lines.push('');

    // Agent descriptor (drive agentName/description in KB GraphQL)
    lines.push(`${agentDescIri} a core:AgentDescriptor, core:Descriptor, prov:Entity ;`);
    if (name) lines.push(`  dcterms:title "${escapeTurtleString(name)}" ;`);
    if (description) lines.push(`  dcterms:description "${escapeTurtleString(description)}" ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Identity node
    const ownerAcctIri = accountIri(chainId, owner);
    const ownerDid = `did:ethr:${chainId}:${owner}`;
    const ownerIdentIri = accountIdentifierIri(ownerDid);

    lines.push(`${identityIri} a erc8122:AgentIdentity8122, core:AgentIdentity, prov:Entity ;`);
    lines.push(`  core:identityOf ${agentNode} ;`);
    lines.push(`  core:identityRegistry ${agentRegistry8122Iri(chainId, registry)} ;`);
    lines.push(`  core:hasIdentifier ${identIri} ;`);
    lines.push(`  core:hasDescriptor ${descIri} ;`);
    lines.push(`  erc8122:agentId "${escapeTurtleString(agentId)}" ;`);
    lines.push(`  erc8122:registryAddress "${escapeTurtleString(registry)}" ;`);
    if (effectiveEndpointType) lines.push(`  erc8122:endpointType "${escapeTurtleString(effectiveEndpointType)}" ;`);
    if (endpoint) lines.push(`  erc8122:endpoint "${escapeTurtleString(endpoint)}" ;`);
    // Registry-specific owner link
    lines.push(`  erc8122:hasOwnerAccount ${ownerAcctIri} ;`);
    if (agentAccount) {
      const aaIri = accountIri(chainId, agentAccount);
      lines.push(`  erc8122:hasAgentAccount ${aaIri} ;`);
    }
    if (createdAt && /^\d+$/.test(createdAt)) lines.push(`  core:createdAtTime ${createdAt} ;`);
    if (updatedAt && /^\d+$/.test(updatedAt)) lines.push(`  core:updatedAtTime ${updatedAt} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Identity identifier node (DID string)
    lines.push(`${identIri} a erc8122:IdentityIdentifier8122, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
    lines.push(`  core:protocolIdentifier "${escapeTurtleString(didIdentity)}" ;`);
    lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/8122> .`);
    lines.push('');

    // Owner account node (eth:Account)
    lines.push(`${ownerAcctIri} a eth:Account, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);
    lines.push(`  eth:accountChainId ${chainId} ;`);
    lines.push(`  eth:accountAddress "${escapeTurtleString(owner)}" ;`);
    lines.push(`  eth:hasAccountIdentifier ${ownerIdentIri} .`);
    lines.push('');
    lines.push(`${ownerIdentIri} a eth:AccountIdentifier, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
    lines.push(`  core:protocolIdentifier "${escapeTurtleString(ownerDid)}" ;`);
    lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/ethr> .`);
    lines.push('');

    // Descriptor node (from metadata)
    lines.push(`${descIri} a erc8122:Descriptor8122Identity, core:AgentIdentityDescriptor, core:Descriptor, prov:Entity ;`);
    if (name) lines.push(`  dcterms:title "${escapeTurtleString(name)}" ;`);
    if (description) lines.push(`  dcterms:description "${escapeTurtleString(description)}" ;`);
    if (effectiveEndpointType) lines.push(`  rdfs:label "${escapeTurtleString(effectiveEndpointType)}" ;`);
    try {
      const json = JSON.stringify({ ...kv, endpointType: effectiveEndpointType, endpoint: endpoint || null, registry, owner, agentId }, null, 0);
      lines.push(`  core:json ${turtleJsonLiteral(json)} ;`);
    } catch {}
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');
  }

  return { turtle: lines.join('\n') };
}

