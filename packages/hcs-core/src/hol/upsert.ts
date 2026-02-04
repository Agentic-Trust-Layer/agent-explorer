import { escapeTurtleString, iriEncodeSegment } from '../rdf/common.js';

function holChainContext(): string {
  // Must match indexer KB convention for HOL (chainId=295).
  return 'https://www.agentictrust.io/graph/data/subgraph/hol';
}

function sparqlLiteralString(value: unknown): string {
  return `"${escapeTurtleString(String(value ?? ''))}"`;
}

function sparqlLiteralNumber(value: unknown, datatype: 'integer' | 'decimal' = 'decimal'): string | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(n)) return null;
  const v = datatype === 'integer' ? String(Math.trunc(n)) : String(n);
  return `"${v}"^^xsd:${datatype}`;
}

function sparqlLiteralInteger(value: unknown): string | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(n)) return null;
  return `"${String(Math.trunc(n))}"^^xsd:integer`;
}

function asNonEmptyString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function asStringArray(v: any): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter((s) => Boolean(s));
}

function asNumberArray(v: any): number[] {
  if (!Array.isArray(v)) return [];
  const out: number[] = [];
  for (const x of v) {
    const n = typeof x === 'number' ? x : typeof x === 'string' ? Number(x) : NaN;
    if (Number.isFinite(n)) out.push(Math.trunc(n));
  }
  return out;
}

function parseUaidHead(uaid: string): { kind: 'aid' | 'did' | 'other'; primaryId: string } {
  const raw = String(uaid || '').trim();
  const afterPrefix = raw.startsWith('uaid:') ? raw.slice('uaid:'.length) : raw;
  const semi = afterPrefix.indexOf(';');
  const head = (semi >= 0 ? afterPrefix.slice(0, semi) : afterPrefix).trim();
  if (head.startsWith('aid:')) return { kind: 'aid', primaryId: head.slice('aid:'.length).trim() || 'unknown' };
  if (head.startsWith('did:')) return { kind: 'did', primaryId: head };
  return { kind: 'other', primaryId: head || 'unknown' };
}

function agentIri(agentKey: string): string {
  return `<https://www.agentictrust.io/id/agent/hol/${iriEncodeSegment(agentKey)}>`;
}
function identityHolIri(agentKey: string): string {
  return `<https://www.agentictrust.io/id/hol-identity/${iriEncodeSegment(agentKey)}>`;
}
function identityHolDescriptorIri(agentKey: string): string {
  return `<https://www.agentictrust.io/id/hol-identity-descriptor/${iriEncodeSegment(agentKey)}>`;
}
function identityIdentifierHolIri(agentKey: string): string {
  return `<https://www.agentictrust.io/id/identifier/hol/${iriEncodeSegment(agentKey)}>`;
}
function agentDescriptorIri(agentKey: string): string {
  return `<https://www.agentictrust.io/id/agent-descriptor/hol/${iriEncodeSegment(agentKey)}>`;
}
function agentProfileHolIri(agentKey: string): string {
  return `<https://www.agentictrust.io/id/hol-profile/${iriEncodeSegment(agentKey)}>`;
}
function registryHolIri(registry: string): string {
  const key = registry && registry.trim() ? registry.trim() : 'HOL';
  return `<https://www.agentictrust.io/id/registry/hol/${iriEncodeSegment(key)}>`;
}
function capabilityHolIri(agentKey: string, capKey: string): string {
  return `<https://www.agentictrust.io/id/hol-capability/${iriEncodeSegment(agentKey)}/${iriEncodeSegment(capKey)}>`;
}
function endpointHolIri(agentKey: string, epKey: string): string {
  return `<https://www.agentictrust.io/id/endpoint/hol/${iriEncodeSegment(agentKey)}/${iriEncodeSegment(epKey)}>`;
}
function relationshipHolIri(agentKey: string, relKey: string): string {
  return `<https://www.agentictrust.io/id/hol-relationship/${iriEncodeSegment(agentKey)}/${iriEncodeSegment(relKey)}>`;
}
function validationHolIri(agentKey: string, valKey: string): string {
  return `<https://www.agentictrust.io/id/hol-validation/${iriEncodeSegment(agentKey)}/${iriEncodeSegment(valKey)}>`;
}

function stableJsonKey(value: unknown, fallback: string): string {
  const s = typeof value === 'string' && value.trim() ? value.trim() : null;
  if (s) return s.slice(0, 250);
  try {
    const json = JSON.stringify(value);
    return json && json.length <= 250 ? json : fallback;
  } catch {
    return fallback;
  }
}

function stringifyJson(value: unknown): string {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return 'null';
  }
}

function extractArray(root: any, key: string): any[] {
  const direct = root?.[key];
  if (Array.isArray(direct)) return direct;
  const agent = root?.agent;
  if (Array.isArray(agent?.[key])) return agent[key];
  const profile = agent?.profile;
  if (Array.isArray(profile?.[key])) return profile[key];
  return [];
}

function extractOriginalId(agent: any, uaid: string): string | null {
  const candidates = [
    agent?.originalId,
    agent?.metadata?.nativeId,
    agent?.metadata?.native_id,
    agent?.metadata?.uid,
    agent?.uaidNativeId,
    agent?.uid,
    agent?.uaidContext?.nativeId,
  ];
  for (const c of candidates) {
    const s = asNonEmptyString(c);
    if (s && /^\d+:\d+$/.test(s)) return s;
  }
  // Derive from did:8004 UAID head when possible
  const parsed = parseUaidHead(uaid);
  if (parsed.kind === 'did') {
    const m = parsed.primaryId.match(/^did:8004:(\d+):(\d+)$/);
    if (m?.[1] && m?.[2]) return `${m[1]}:${m[2]}`;
  }
  return null;
}

function extractImage(agent: any): string | null {
  const endpointsCustom = agent?.endpoints?.customEndpoints && typeof agent.endpoints.customEndpoints === 'object' ? agent.endpoints.customEndpoints : null;
  const candidates = [
    agent?.image,
    agent?.metadata?.image,
    agent?.metadata?.registrationImage,
    endpointsCustom?.['registration.image'],
    agent?.profile?.profileImage,
  ];
  for (const c of candidates) {
    const s = asNonEmptyString(c);
    if (s) return s;
  }
  return null;
}

function extractRegistry(agent: any): string | null {
  const candidates = [agent?.registry, agent?.uaidContext?.registry, agent?.metadata?.registry];
  for (const c of candidates) {
    const s = asNonEmptyString(c);
    if (s) return s;
  }
  return null;
}

function extractProtocols(agent: any): string[] {
  const out = new Set<string>();
  for (const p of asStringArray(agent?.protocols)) out.add(p);
  const single = asNonEmptyString(agent?.protocol);
  if (single) out.add(single);
  for (const p of asStringArray(agent?.metadata?.protocols)) out.add(p);
  const mSingle = asNonEmptyString(agent?.metadata?.protocol);
  if (mSingle) out.add(mSingle);
  return Array.from(out);
}

function extractCapabilityLabels(agent: any): string[] {
  const out = new Set<string>();
  for (const s of asStringArray(agent?.metadata?.capabilityLabels)) out.add(s);
  for (const s of asStringArray(agent?.profile?.properties?.capabilityLabels)) out.add(s);
  return Array.from(out);
}

function extractCapabilityTokens(agent: any): string[] {
  const out = new Set<string>();
  for (const s of asStringArray(agent?.capabilityTokens)) out.add(s);
  for (const s of asStringArray(agent?.metadata?.capabilityTokens)) out.add(s);
  return Array.from(out);
}

function extractOasfSkillUids(agent: any): number[] {
  const out = new Set<number>();
  for (const n of asNumberArray(agent?.metadata?.oasfSkills)) out.add(n);
  for (const n of asNumberArray(agent?.profile?.properties?.oasfSkills)) out.add(n);
  return Array.from(out);
}

export function buildHolResolvedAgentUpsertSparql(args: {
  uaid: string;
  resolved: any;
}): { sparqlUpdate: string; context: string } {
  const uaid = String(args.uaid || '').trim();
  const resolved = args.resolved ?? null;
  const agent = resolved?.agent ?? null;
  const profile = agent?.profile ?? null;

  const parsed = parseUaidHead(uaid);
  const agentId = asNonEmptyString(agent?.id);
  // Stable IDs:
  // - uaid:aid:* → use the aid segment
  // - uaid:did:* → use the did itself (NOT the broker hit UUID)
  // - fallback → use agent.id if available, else the parsed head
  const agentKey =
    parsed.kind === 'aid' ? parsed.primaryId : parsed.kind === 'did' ? parsed.primaryId : agentId || parsed.primaryId;

  const ctx = holChainContext();

  const agentNode = agentIri(agentKey);
  const identityNode = identityHolIri(agentKey);
  const identityDescNode = identityHolDescriptorIri(agentKey);
  const identityIdentNode = identityIdentifierHolIri(agentKey);
  const agentDescNode = agentDescriptorIri(agentKey);
  const profileNode = agentProfileHolIri(agentKey);

  const registryLabel = extractRegistry(agent) || 'HOL';
  const registryNode = registryHolIri(registryLabel);

  const name = asNonEmptyString(agent?.name) || (agentId ? `HOL Agent ${agentId}` : `HOL Agent ${agentKey}`);
  const description = asNonEmptyString(agent?.description);
  const image = extractImage(agent) || asNonEmptyString(profile?.profileImage);

  const displayName = asNonEmptyString(profile?.display_name) || asNonEmptyString(profile?.displayName) || null;
  const alias = asNonEmptyString(profile?.alias) || null;
  const bio = asNonEmptyString(profile?.bio) || null;

  const originalId = extractOriginalId(agent, uaid);
  const oasfSkillUids = extractOasfSkillUids(agent);
  const protocols = extractProtocols(agent);
  const capabilityLabels = extractCapabilityLabels(agent);
  const capabilityTokens = extractCapabilityTokens(agent);
  const trustScoresObj = agent?.trustScores ?? agent?.metadata?.trustScores ?? null;
  const trustScoresJson = trustScoresObj ? stringifyJson(trustScoresObj) : null;

  const trustScore = sparqlLiteralNumber(agent?.trustScore, 'decimal') ?? sparqlLiteralNumber(profile?.trustScore, 'decimal');
  const rating = sparqlLiteralNumber(profile?.rating, 'decimal') ?? sparqlLiteralNumber(agent?.rating, 'decimal');
  const totalInteractions = sparqlLiteralNumber(profile?.totalInteractions, 'integer') ?? sparqlLiteralNumber(agent?.totalInteractions, 'integer');

  const capabilities = Array.isArray(agent?.capabilities) ? agent.capabilities : [];
  const endpointsRaw = agent?.endpoints;
  const endpoints: any[] = Array.isArray(endpointsRaw)
    ? endpointsRaw
    : endpointsRaw && typeof endpointsRaw === 'object'
      ? Object.entries(endpointsRaw).map(([k, v]) => ({ key: k, value: v }))
      : [];

  const relationships = extractArray(resolved, 'relationships');
  const validations = extractArray(resolved, 'validations');

  const deletePrefixes: string[] = [
    `https://www.agentictrust.io/id/agent/hol/${iriEncodeSegment(agentKey)}`,
    `https://www.agentictrust.io/id/hol-identity/${iriEncodeSegment(agentKey)}`,
    `https://www.agentictrust.io/id/hol-identity-descriptor/${iriEncodeSegment(agentKey)}`,
    `https://www.agentictrust.io/id/identifier/hol/${iriEncodeSegment(agentKey)}`,
    `https://www.agentictrust.io/id/agent-descriptor/hol/${iriEncodeSegment(agentKey)}`,
    `https://www.agentictrust.io/id/hol-profile/${iriEncodeSegment(agentKey)}`,
    `https://www.agentictrust.io/id/hol-capability/${iriEncodeSegment(agentKey)}/`,
    `https://www.agentictrust.io/id/endpoint/hol/${iriEncodeSegment(agentKey)}/`,
    `https://www.agentictrust.io/id/hol-relationship/${iriEncodeSegment(agentKey)}/`,
    `https://www.agentictrust.io/id/hol-validation/${iriEncodeSegment(agentKey)}/`,
  ];

  const deleteFilter = deletePrefixes.map((p) => `STRSTARTS(STR(?s), "${p}")`).join(' || ');

  const lines: string[] = [];
  lines.push('PREFIX owl: <http://www.w3.org/2002/07/owl#>');
  lines.push('PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>');
  lines.push('PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>');
  lines.push('PREFIX prov: <http://www.w3.org/ns/prov#>');
  lines.push('PREFIX dcterms: <http://purl.org/dc/terms/>');
  lines.push('PREFIX schema: <http://schema.org/>');
  lines.push('PREFIX core: <https://agentictrust.io/ontology/core#>');
  lines.push('PREFIX hol: <https://agentictrust.io/ontology/hol#>');
  lines.push('');

  // Delete all previously-owned HOL nodes for this agentKey (but NOT registries).
  lines.push(`DELETE { GRAPH <${ctx}> { ?s ?p ?o } }`);
  lines.push(`WHERE  { GRAPH <${ctx}> { ?s ?p ?o . FILTER(${deleteFilter}) } } ;`);
  lines.push('');

  // Insert registry node (idempotent; do not delete shared registry nodes).
  lines.push('INSERT DATA {');
  lines.push(`  GRAPH <${ctx}> {`);
  lines.push(`    ${registryNode} a hol:AgentIdentityRegistryHOL, core:AgentRegistry, prov:Entity ;`);
  lines.push(`      rdfs:label ${sparqlLiteralString(registryLabel)} .`);
  lines.push('');

  // Agent node
  lines.push(`    ${agentNode} a core:AIAgent, hol:AIAgentHOL, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);
  lines.push(`      core:uaid ${sparqlLiteralString(uaid)} ;`);
  lines.push(`      core:hasIdentity ${identityNode} ;`);
  lines.push(`      core:hasDescriptor ${agentDescNode} ;`);
  lines.push(`      .`);
  lines.push('');

  // Agent descriptor
  lines.push(`    ${agentDescNode} a core:AgentDescriptor, hol:HOLAgentDescriptor, prov:Entity ;`);
  lines.push(`      dcterms:title ${sparqlLiteralString(name)} ;`);
  if (description) lines.push(`      dcterms:description ${sparqlLiteralString(description)} ;`);
  if (image) lines.push(`      schema:image ${sparqlLiteralString(image)} ;`);
  lines.push(`      .`);
  lines.push('');

  // Profile node (store full raw JSON here)
  lines.push(`    ${profileNode} a hol:AgentProfileHOL, prov:Entity ;`);
  lines.push(`      hol:uaid ${sparqlLiteralString(uaid)} ;`);
  lines.push(`      hol:registry ${sparqlLiteralString(registryLabel)} ;`);
  if (originalId) lines.push(`      hol:originalId ${sparqlLiteralString(originalId)} ;`);
  if (displayName) lines.push(`      hol:displayName ${sparqlLiteralString(displayName)} ;`);
  if (alias) lines.push(`      hol:alias ${sparqlLiteralString(alias)} ;`);
  if (bio) lines.push(`      hol:bio ${sparqlLiteralString(bio)} ;`);
  if (rating) lines.push(`      hol:rating ${rating} ;`);
  if (trustScore) lines.push(`      hol:trustScore ${trustScore} ;`);
  if (totalInteractions) lines.push(`      hol:totalInteractions ${totalInteractions} ;`);
  if (trustScoresJson) lines.push(`      hol:trustScoresJson ${sparqlLiteralString(trustScoresJson)} ;`);
  lines.push(`      core:json ${sparqlLiteralString(stringifyJson(resolved))} ;`);
  lines.push(`      .`);
  lines.push('');

  // Profile extracted metadata facets
  for (const uid of oasfSkillUids) {
    const lit = sparqlLiteralInteger(uid);
    if (lit) lines.push(`    ${profileNode} hol:oasfSkillUid ${lit} .`);
  }
  for (const p of protocols) {
    lines.push(`    ${profileNode} hol:protocol ${sparqlLiteralString(p)} .`);
  }
  for (const c of capabilityLabels) {
    lines.push(`    ${profileNode} hol:capabilityLabel ${sparqlLiteralString(c)} .`);
  }
  for (const t of capabilityTokens) {
    lines.push(`    ${profileNode} hol:capabilityToken ${sparqlLiteralString(t)} .`);
  }
  if (oasfSkillUids.length || protocols.length || capabilityLabels.length || capabilityTokens.length) lines.push('');

  // HOL Identity
  lines.push(`    ${identityNode} a hol:AgentIdentityHOL, core:AgentIdentity, prov:Entity ;`);
  lines.push(`      core:hasIdentifier ${identityIdentNode} ;`);
  lines.push(`      core:hasDescriptor ${identityDescNode} ;`);
  lines.push(`      core:identityRegistry ${registryNode} ;`);
  lines.push(`      hol:hasAgentProfileHOL ${profileNode} ;`);
  lines.push(`      hol:uaidHOL ${sparqlLiteralString(uaid)} ;`);
  lines.push(`      .`);
  lines.push('');

  // Identity identifier
  const protocolIdentifier =
    parsed.kind === 'did' ? parsed.primaryId : parsed.kind === 'aid' ? `aid:${parsed.primaryId}` : parsed.primaryId;
  lines.push(`    ${identityIdentNode} a hol:IdentityIdentifierHOL, core:UniversalIdentifier, core:Identifier, prov:Entity ;`);
  lines.push(`      core:protocolIdentifier ${sparqlLiteralString(protocolIdentifier)} ;`);
  lines.push(`      .`);
  lines.push('');

  // Identity descriptor
  lines.push(`    ${identityDescNode} a hol:IdentityDescriptorHOL, core:AgentIdentityDescriptor, prov:Entity ;`);
  lines.push(`      dcterms:title ${sparqlLiteralString(name)} ;`);
  if (description) lines.push(`      dcterms:description ${sparqlLiteralString(description)} ;`);
  if (image) lines.push(`      schema:image ${sparqlLiteralString(image)} ;`);
  // Prefer the full agent payload (search hits include metadata/nativeId/etc).
  lines.push(`      core:json ${sparqlLiteralString(stringifyJson(agent ?? profile ?? resolved))} ;`);
  lines.push(`      .`);
  lines.push('');

  // Capabilities
  for (let i = 0; i < capabilities.length; i++) {
    const cap = capabilities[i];
    const capKey = stableJsonKey(cap, `cap-${i}`);
    const capNode = capabilityHolIri(agentKey, capKey);
    const label = asNonEmptyString((cap as any)?.label) || asNonEmptyString((cap as any)?.name) || (typeof cap === 'string' ? cap : null);
    lines.push(`    ${capNode} a hol:CapabilityHOL, prov:Entity ;`);
    if (label) lines.push(`      rdfs:label ${sparqlLiteralString(label)} ;`);
    lines.push(`      core:json ${sparqlLiteralString(stringifyJson(cap))} ;`);
    lines.push(`      .`);
    lines.push(`    ${profileNode} hol:hasCapabilityHOL ${capNode} .`);
    lines.push('');
  }

  // Capability labels as capability nodes too (more useful than numeric indexes)
  for (let i = 0; i < capabilityLabels.length; i++) {
    const label = capabilityLabels[i]!;
    const capNode = capabilityHolIri(agentKey, `label-${iriEncodeSegment(label)}`);
    lines.push(`    ${capNode} a hol:CapabilityHOL, prov:Entity ;`);
    lines.push(`      rdfs:label ${sparqlLiteralString(label)} ;`);
    lines.push(`      core:json ${sparqlLiteralString(stringifyJson({ label }))} ;`);
    lines.push(`      .`);
    lines.push(`    ${profileNode} hol:hasCapabilityHOL ${capNode} .`);
    lines.push('');
  }

  // Endpoints (link from agent descriptor; represent as core:Endpoint)
  for (let i = 0; i < endpoints.length; i++) {
    const ep = endpoints[i];
    const epKey = stableJsonKey(ep, `endpoint-${i}`);
    const epNode = endpointHolIri(agentKey, epKey);
    const url =
      typeof ep === 'string'
        ? ep
        : asNonEmptyString((ep as any)?.endpoint) ||
          asNonEmptyString((ep as any)?.url) ||
          asNonEmptyString((ep as any)?.href) ||
          (typeof (ep as any)?.value === 'string' ? (ep as any).value : null);
    const epName = asNonEmptyString((ep as any)?.name) || asNonEmptyString((ep as any)?.key) || null;
    lines.push(`    ${epNode} a core:Endpoint, prov:Entity ;`);
    if (epName) lines.push(`      core:endpointName ${sparqlLiteralString(epName)} ;`);
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      lines.push(`      core:endpointUrl <${url.replace(/>/g, '%3E')}> ;`);
    }
    lines.push(`      core:json ${sparqlLiteralString(stringifyJson(ep))} ;`);
    lines.push(`      .`);
    lines.push(`    ${agentDescNode} core:hasEndpoint ${epNode} .`);
    lines.push('');
  }

  // Relationships / validations (opaque for now; store raw objects)
  for (let i = 0; i < relationships.length; i++) {
    const rel = relationships[i];
    const relKey = stableJsonKey(rel, `rel-${i}`);
    const relNode = relationshipHolIri(agentKey, relKey);
    lines.push(`    ${relNode} a hol:RelationshipHOL, prov:Entity ;`);
    lines.push(`      core:json ${sparqlLiteralString(stringifyJson(rel))} ;`);
    lines.push(`      .`);
    lines.push(`    ${profileNode} hol:hasRelationshipHOL ${relNode} .`);
    lines.push('');
  }
  for (let i = 0; i < validations.length; i++) {
    const val = validations[i];
    const valKey = stableJsonKey(val, `val-${i}`);
    const valNode = validationHolIri(agentKey, valKey);
    lines.push(`    ${valNode} a hol:ValidationHOL, prov:Entity ;`);
    lines.push(`      core:json ${sparqlLiteralString(stringifyJson(val))} ;`);
    lines.push(`      .`);
    lines.push(`    ${profileNode} hol:hasValidationHOL ${valNode} .`);
    lines.push('');
  }

  lines.push('  }');
  lines.push('}');
  lines.push('');

  return { sparqlUpdate: lines.join('\n'), context: ctx };
}

