import { escapeTurtleString, iriEncodeSegment, rdfPrefixes } from './common.js';

function envInt(key: string, fallback: number): number {
  const raw = (globalThis as any)?.process?.env?.[key];
  const n = raw != null ? Number(String(raw).trim()) : NaN;
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

// HOL is queried in KB as chainId=295 (maps to GRAPH <.../subgraph/hol>)
const HOL_CHAIN_ID = envInt('HOL_CHAIN_ID', 295);

type ParsedUaid = {
  uaid: string;
  // "aid" | "did" | other
  kind: 'aid' | 'did' | 'other';
  // For aid: the aid agentId value. For did: the full DID string (did:8004..., did:ethr..., etc.)
  primaryId: string;
  // Everything after the first ';' (may include multiple ';' segments)
  routeRaw: string | null;
  // Parsed key/value pairs from route (for segments like "k=v")
  routeParams: Record<string, string>;
  // Derived chainId if present (did methods), else null
  chainId: number | null;
};

function parseRouteParams(routeRaw: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  const raw = typeof routeRaw === 'string' ? routeRaw.trim() : '';
  if (!raw) return out;
  for (const seg of raw.split(';')) {
    const s = seg.trim();
    if (!s) continue;
    const eq = s.indexOf('=');
    if (eq <= 0) continue;
    const k = s.slice(0, eq).trim();
    const v = s.slice(eq + 1).trim();
    if (!k || !v) continue;
    if (!(k in out)) out[k] = v;
  }
  return out;
}

function parseUaidString(input: unknown, fallbackPrimaryId: string): ParsedUaid {
  const raw = typeof input === 'string' ? input.trim() : '';
  const uaid = raw && raw.startsWith('uaid:') ? raw : raw ? `uaid:${raw}` : `uaid:aid:${fallbackPrimaryId}`;

  const afterPrefix = uaid.startsWith('uaid:') ? uaid.slice('uaid:'.length) : uaid;
  const semi = afterPrefix.indexOf(';');
  const head = (semi >= 0 ? afterPrefix.slice(0, semi) : afterPrefix).trim();
  const routeRaw = semi >= 0 ? afterPrefix.slice(semi + 1).trim() : null;
  const routeParams = parseRouteParams(routeRaw);

  if (head.startsWith('aid:')) {
    const primaryId = head.slice('aid:'.length).trim() || fallbackPrimaryId;
    return { uaid, kind: 'aid', primaryId, routeRaw: routeRaw || null, routeParams, chainId: HOL_CHAIN_ID };
  }

  if (head.startsWith('did:')) {
    const did = head.trim();
    // did:<method>:<chainId>:... (try to read numeric chainId from segment 3)
    const parts = did.split(':');
    const chainIdRaw = parts.length >= 3 ? parts[2] : '';
    const chainIdNum = /^\d+$/.test(chainIdRaw) ? Number(chainIdRaw) : NaN;
    const chainId = Number.isFinite(chainIdNum) ? Math.trunc(chainIdNum) : null;
    return { uaid, kind: 'did', primaryId: did, routeRaw: routeRaw || null, routeParams, chainId };
  }

  return {
    uaid,
    kind: 'other',
    primaryId: head || fallbackPrimaryId,
    routeRaw: routeRaw || null,
    routeParams,
    chainId: null,
  };
}

function agentIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/agent/hol/${iriEncodeSegment(agentId)}>`;
}

function identityHolIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/hol-identity/${iriEncodeSegment(agentId)}>`;
}

function identityHolDescriptorIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/hol-identity-descriptor/${iriEncodeSegment(agentId)}>`;
}

function identityIdentifierHolIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/identifier/hol/${iriEncodeSegment(agentId)}>`;
}

function agentDescriptorIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/agent-descriptor/hol/${iriEncodeSegment(agentId)}>`;
}

function agentProfileHolIri(agentId: string): string {
  return `<https://www.agentictrust.io/id/hol-profile/${iriEncodeSegment(agentId)}>`;
}

function registryHolIri(registry: string): string {
  const key = registry && registry.trim() ? registry.trim() : 'HOL';
  return `<https://www.agentictrust.io/id/registry/hol/${iriEncodeSegment(key)}>`;
}

export interface HolAgentData {
  agentId: string;
  agentName: string;
  agentAddress: string; // UAID string in hol-indexer
  agentOwner: string; // registry label (e.g. "HOL")
  tokenUri?: string;
  createdAtBlock?: number;
  createdAtTime?: number;
  description?: string;
  image?: string;
  type?: string;
  rawJson?: string;
  updatedAtTime?: number;
}

export function emitHolAgentsTurtle(items: HolAgentData[]): string {
  const lines: string[] = [rdfPrefixes()];
  lines.push('@prefix hol: <https://agentictrust.io/ontology/hol#> .');
  lines.push('');

  const emittedRegistries = new Set<string>();

  for (const item of items) {
    const rowAgentId = String(item?.agentId ?? '').trim();
    if (!rowAgentId) continue;

    const agentName = String(item?.agentName ?? '').trim() || `HOL Agent ${rowAgentId}`;
    const description = String(item?.description ?? '').trim();
    const image = String(item?.image ?? '').trim();
    const rawJson = String(item?.rawJson ?? '').trim();
    const agentAddress = String((item as any)?.agentAddress ?? '').trim();
    const agentOwner = String((item as any)?.agentOwner ?? '').trim() || 'HOL';

    // Parse UAID (uaid:aid:*;... or uaid:did:*;...)
    const parsed = parseUaidString(agentAddress, rowAgentId);
    const agentKey = parsed.kind === 'aid' ? parsed.primaryId : rowAgentId;

    const agentNodeIri = agentIri(agentKey);
    const identityIri = identityHolIri(agentKey);
    const identityDescIri = identityHolDescriptorIri(agentKey);
    const identityIdentIri = identityIdentifierHolIri(agentKey);
    const agentDescIri = agentDescriptorIri(agentKey);
    const profileIri = agentProfileHolIri(agentKey);

    const uaid = parsed.uaid;
    const protocolIdentifier =
      parsed.kind === 'did' ? parsed.primaryId : parsed.kind === 'aid' ? `aid:${parsed.primaryId}` : parsed.primaryId;

    const registryIri = registryHolIri(agentOwner);
    if (!emittedRegistries.has(registryIri)) {
      emittedRegistries.add(registryIri);
      lines.push(`${registryIri} a hol:AgentIdentityRegistryHOL, core:AgentRegistry, prov:Entity ;`);
      lines.push(`  rdfs:label "${escapeTurtleString(agentOwner)}" ;`);
      lines.push(`  core:registryChainId ${HOL_CHAIN_ID} .`);
      lines.push('');
    }

    // Agent node
    lines.push(`${agentNodeIri} a core:AIAgent, hol:AIAgentHOL, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);
    lines.push(`  core:uaid "${escapeTurtleString(uaid)}" ;`);
    lines.push(`  core:hasIdentity ${identityIri} ;`);
    lines.push(`  core:hasDescriptor ${agentDescIri} ;`);
    if (rawJson) {
      lines.push(`  core:json "${escapeTurtleString(rawJson)}" ;`);
    }
    lines.push(`  .`);
    lines.push('');

    // HOL profile (parsed UAID pieces + route)
    lines.push(`${profileIri} a hol:AgentProfileHOL, prov:Entity ;`);
    lines.push(`  hol:uaid "${escapeTurtleString(uaid)}" ;`);
    lines.push(`  hol:originalId "${escapeTurtleString(parsed.primaryId)}" ;`);
    lines.push(`  hol:registry "${escapeTurtleString(parsed.routeParams.registry ?? agentOwner)}" ;`);
    if (parsed.routeRaw) lines.push(`  core:json "${escapeTurtleString(parsed.routeRaw)}" ;`);
    lines.push(`  .`);
    lines.push('');

    // Agent descriptor
    lines.push(`${agentDescIri} a core:AgentDescriptor, hol:HOLAgentDescriptor, prov:Entity ;`);
    if (agentName) {
      lines.push(`  dcterms:title "${escapeTurtleString(agentName)}" ;`);
    }
    if (description) {
      lines.push(`  dcterms:description "${escapeTurtleString(description)}" ;`);
    }
    if (image) {
      lines.push(`  schema:image "${escapeTurtleString(image)}" ;`);
    }
    lines.push(`  .`);
    lines.push('');

    // HOL Identity
    lines.push(`${identityIri} a hol:AgentIdentityHOL, core:AgentIdentity, prov:Entity ;`);
    lines.push(`  core:hasIdentifier ${identityIdentIri} ;`);
    lines.push(`  core:hasDescriptor ${identityDescIri} ;`);
    // Attach the identity to its registry (core identity module)
    lines.push(`  core:identityRegistry ${registryIri} ;`);
    lines.push(`  hol:hasAgentProfileHOL ${profileIri} ;`);
    lines.push(`  .`);
    lines.push('');

    // Identity identifier
    lines.push(`${identityIdentIri} a hol:IdentityIdentifierHOL, core:UniversalIdentifier, core:Identifier, prov:Entity ;`);
    lines.push(`  core:protocolIdentifier "${escapeTurtleString(protocolIdentifier)}" ;`);
    lines.push(`  .`);
    lines.push('');

    // Identity descriptor
    lines.push(`${identityDescIri} a hol:IdentityDescriptorHOL, core:AgentIdentityDescriptor, prov:Entity ;`);
    if (agentName) {
      lines.push(`  dcterms:title "${escapeTurtleString(agentName)}" ;`);
    }
    if (description) {
      lines.push(`  dcterms:description "${escapeTurtleString(description)}" ;`);
    }
    if (image) {
      lines.push(`  schema:image "${escapeTurtleString(image)}" ;`);
    }
    if (rawJson) {
      lines.push(`  core:json "${escapeTurtleString(rawJson)}" ;`);
    }
    lines.push(`  .`);
    lines.push('');
  }

  return lines.join('\n');
}
