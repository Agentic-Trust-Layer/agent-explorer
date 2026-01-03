import '../env';
import { createHash } from 'node:crypto';
import type { AnyDb } from '../hol/hol-import';
import { createHolDbFromEnv } from '../hol/hol-import';

function rdfPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    '@prefix agentictrust: <https://www.agentictrust.io/ontology/agentictrust-core#> .',
    '@prefix hol: <https://www.agentictrust.io/ontology/hol#> .',
    '',
    '<https://www.agentictrust.io/data/hol-agents> a owl:Ontology ;',
    '  owl:imports <https://www.agentictrust.io/ontology/agentictrust-core> ;',
    '  owl:imports <https://www.agentictrust.io/ontology/hol> ;',
    '  .',
    '',
  ].join('\n');
}

function escapeTurtleString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    // Escape angle brackets in string literals to prevent GraphDB from misinterpreting them as IRIs
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E');
}

function iriEncodeSegment(seg: string): string {
  if (!seg || typeof seg !== 'string') return '';
  // Reject problematic values that shouldn't be in IRIs
  const trimmed = seg.trim();
  if (!trimmed || trimmed === 'value' || trimmed === 'type' || trimmed.length === 0) {
    return 'invalid';
  }
  // encodeURIComponent already handles most special characters
  // But we need to handle / specially - keep it as %2F, not double-encode
  return encodeURIComponent(trimmed).replace(/%2F/g, '%252F');
}

function isSafeAbsoluteIri(value: string): boolean {
  if (!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)) return false;
  // GraphDB is strict about IRI validity - reject localhost and other problematic patterns
  if (/[<>"\s\\{}|^`\[\]]/.test(value)) return false;
  // Reject localhost URLs as they're not valid in production RDF
  if (/^https?:\/\/localhost[:\/]/i.test(value)) return false;
  // Reject data URIs - they're too long and may contain problematic characters
  if (/^data:/.test(value)) return false;
  // Reject URLs with query parameters containing colons (e.g., ?q=tbn:...) as GraphDB may reject them
  if (/\?[^#]*:/.test(value)) return false;
  // Reject very long IRIs (GraphDB may have limits)
  if (value.length > 200) return false;
  // Only allow http/https IRIs for safety
  if (!/^https?:\/\//.test(value)) return false;
  // Reject single-word values that aren't valid IRIs (e.g., "value", "type", etc.)
  if (/^[a-z]+$/i.test(value) && value.length < 10) return false;
  // Reject IRIs with double slashes in the path (e.g., https://domain//path)
  if (/^https?:\/\/[^\/]+\/\/+/.test(value)) return false;

  // Additional hostname sanity checks (GraphDB tends to reject "weird but RFC-legal" IRIs)
  // - must have a dot
  // - TLD length >= 2
  // - reject IPv4 hosts and common local dev hosts
  try {
    const u = new URL(value);
    const host = (u.hostname ?? '').toLowerCase();
    if (!host) return false;
    if (host === 'localhost') return false;
    if (host === 'locahost') return false;
    // Reject IPv4 (GraphDB often rejects these in some deployments, and we don't want local endpoints as IRIs)
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
    if (!host.includes('.')) return false;
    const tld = host.split('.').pop() ?? '';
    if (tld.length < 2) return false;
  } catch {
    return false;
  }

  return true;
}

function turtleIriOrLiteral(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  let s = value.trim();
  // Reject common invalid values that might be misinterpreted as IRIs
  if (s === 'value' || s === 'type' || s === 'name' || s.length < 4) {
    return `"${escapeTurtleString(s)}"`;
  }
  // Filter out localhost URLs - they're not valid in production RDF
  if (/^https?:\/\/localhost[:\/]/.test(s)) {
    // Return as string literal instead of IRI
    return `"${escapeTurtleString(s)}"`;
  }
  // Filter out data URIs - they're too long and may contain problematic characters
  if (/^data:/.test(s)) {
    return `"${escapeTurtleString(s)}"`;
  }
  // Fix double slashes in URL paths (e.g., https://domain//path -> https://domain/path)
  if (/^https?:\/\//.test(s)) {
    s = s.replace(/(https?:\/\/[^\/]+)\/\/+/g, '$1/');
  }
  if (isSafeAbsoluteIri(s)) return `<${s}>`;
  return `"${escapeTurtleString(s)}"`;
}

function turtleJsonLiteral(jsonText: string): string {
  const escaped = jsonText
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
  return `"""${escaped}"""^^xsd:string`;
}

function agentIri(agentId: string, uaid?: string | null): string {
  // Use agentId for IRI since it's more stable and doesn't contain special characters like UAID
  const identifier = iriEncodeSegment(agentId);
  return `<https://www.agentictrust.io/id/hol-agent/${identifier}>`;
}

function identityHOLIri(agentId: string, uaid?: string | null): string {
  const identifier = iriEncodeSegment(agentId);
  return `<https://www.agentictrust.io/id/hol-identity/${identifier}>`;
}

function identityIdentifierHOLIri(agentId: string, uaid?: string | null): string {
  const identifier = iriEncodeSegment(agentId);
  return `<https://www.agentictrust.io/id/hol-identifier/${identifier}>`;
}

function identityDescriptorHOLIri(agentId: string, uaid?: string | null): string {
  const identifier = iriEncodeSegment(agentId);
  return `<https://www.agentictrust.io/id/hol-identity-descriptor/${identifier}>`;
}

function profileHOLIri(agentId: string, uaid?: string | null): string {
  const identifier = iriEncodeSegment(agentId);
  return `<https://www.agentictrust.io/id/hol-profile/${identifier}>`;
}

function identifierDescriptorIri(identifierIri: string): string {
  const match = identifierIri.match(/\/hol-identifier\/([^>]+)>/);
  if (match) {
    return `<https://www.agentictrust.io/id/hol-identifier-descriptor/${match[1]}>`;
  }
  return identifierIri.replace('/hol-identifier/', '/hol-identifier-descriptor/');
}

function oasfDomainIri(domainId: string): string {
  return `<https://www.agentictrust.io/id/oasf/domain/${iriEncodePath(domainId)}>`;
}

function oasfSkillIri(skillId: string): string {
  return `<https://www.agentictrust.io/id/oasf/skill/${iriEncodePath(skillId)}>`;
}

function iriEncodePath(pathValue: string): string {
  return String(pathValue)
    .split('/')
    .filter((s) => s.length > 0)
    .map((s) => iriEncodeSegment(s))
    .join('/');
}

function holAgentSkillIri(agentId: string, skillKey: string): string {
  const identifier = iriEncodeSegment(agentId);
  return `<https://www.agentictrust.io/id/hol-agent-skill/${identifier}/${iriEncodePath(skillKey)}>`;
}

function endpointIri(agentId: string, endpointName: string, uaid?: string | null): string {
  // Use agentId only (not UAID) to avoid very long encoded paths that GraphDB rejects
  const identifier = iriEncodeSegment(agentId);
  // Always encode endpoint name to handle dots and other special characters
  const encodedName = iriEncodeSegment(endpointName);
  return `<https://www.agentictrust.io/id/hol-endpoint/${identifier}/${encodedName}>`;
}

function capabilityIri(capability: string): string {
  return `<https://www.agentictrust.io/id/hol-capability/${iriEncodeSegment(capability)}>`;
}

function protocolIri(protocol: string): string {
  return `<https://www.agentictrust.io/id/hol-protocol/${iriEncodeSegment(protocol)}>`;
}

export async function exportHolAgentsRdf(db: AnyDb): Promise<{ outPath: string; bytes: number; agentCount: number }> {
  const chunks: string[] = [];
  chunks.push(rdfPrefixes());

  const rows = await db.prepare(`
    SELECT
      chainId, agentId, agentName, agentOwner, agentAddress,
      rawJson, description, image, type,
      displayName, alias, bio, rating, trustScore,
      totalInteractions, availabilityScore, availabilityLatencyMs,
      availabilityStatus, availabilityCheckedAt, availabilityReason,
      availabilitySource, available, detectedLanguage,
      aiagentCreator, aiagentModel, oasfSkillsJson,
      capabilityLabelsJson, protocolsJson,
      primaryEndpoint, customEndpoint,
      createdAtTime, updatedAtTime
    FROM agents
    ORDER BY chainId ASC, LENGTH(agentId) ASC, agentId ASC
  `).all();

  const agentRows: any[] = Array.isArray(rows) ? rows : Array.isArray((rows as any)?.results) ? (rows as any).results : [];
  let included = 0;

  for (const row of agentRows) {
    const chainId = Number(row?.chainId ?? 0) || 0;
    let agentId = String(row?.agentId ?? '');
    if (!agentId) continue;
    
    // If agentId is a UAID (very long, contains uaid:), use a hash-based identifier instead
    // to avoid creating IRIs that are too long for GraphDB
    if (agentId.length > 100 || agentId.toLowerCase().startsWith('uaid:')) {
      // Use a hash of the agentId to create a stable, shorter identifier
      const hash = createHash('sha256').update(agentId).digest('hex').slice(0, 32);
      agentId = `hol-${hash}`;
    }
    
    // Skip agents with problematic IDs that might create invalid IRIs
    // (e.g., IDs that when encoded create patterns GraphDB rejects)
    if (agentId.toLowerCase().includes('localhost') && agentId.length > 50) {
      continue; // Skip very long localhost IDs that might cause issues
    }

    let rawJsonData: any = null;
    if (row?.rawJson) {
      try {
        rawJsonData = JSON.parse(String(row.rawJson));
      } catch {
        // ignore parse errors
      }
    }

    const uaid = rawJsonData?.uaid || null;
    const registry = rawJsonData?.registry || row?.agentOwner || 'HOL';
    const originalId = rawJsonData?.originalId || agentId;

    const aIri = agentIri(agentId, uaid);
    const identityIri = identityHOLIri(agentId, uaid);
    const identifierIri = identityIdentifierHOLIri(agentId, uaid);
    const identityDescriptorIri = identityDescriptorHOLIri(agentId, uaid);
    const profileIri = profileHOLIri(agentId, uaid);

    // Agent
    const agentLines: string[] = [];
    agentLines.push(`${aIri} a agentictrust:AIAgent, prov:SoftwareAgent ;`);
    agentLines.push(`  agentictrust:agentId "${escapeTurtleString(agentId)}" ;`);
    if (row?.agentName) agentLines.push(`  agentictrust:agentName "${escapeTurtleString(String(row.agentName))}" ;`);
    agentLines.push(`  agentictrust:hasIdentity ${identityIri} ;`);
    agentLines.push(`  hol:hasAgentProfileHOL ${profileIri} ;`);
    agentLines.push(`  .\n`);
    chunks.push(agentLines.join('\n'));

    // AgentIdentityHOL
    const identityLines: string[] = [];
    identityLines.push(`${identityIri} a hol:AgentIdentityHOL, agentictrust:AgentIdentity, prov:Entity ;`);
    identityLines.push(`  agentictrust:hasIdentifier ${identifierIri} ;`);
    identityLines.push(`  agentictrust:hasDescriptor ${identityDescriptorIri} ;`);
    identityLines.push(`  .\n`);
    chunks.push(identityLines.join('\n'));

    // IdentityIdentifierHOL
    const identifierDescriptorIriValue = identifierDescriptorIri(identifierIri);
    const identifierLines: string[] = [];
    identifierLines.push(`${identifierIri} a hol:IdentityIdentifierHOL, agentictrust:UniversalIdentifier, agentictrust:Identifier, prov:Entity ;`);
    identifierLines.push(`  agentictrust:identifierType hol:IdentifierType_HOL ;`);
    identifierLines.push(`  agentictrust:hasDescriptor ${identifierDescriptorIriValue} ;`);
    if (uaid && typeof uaid === 'string' && uaid.trim()) {
      identifierLines.push(`  rdfs:label "${escapeTurtleString(uaid.trim())}" ;`);
    }
    identifierLines.push(`  .\n`);
    chunks.push(identifierLines.join('\n'));

    // IdentifierDescriptor for IdentityIdentifierHOL
    const identifierDescriptorLines: string[] = [];
    identifierDescriptorLines.push(`${identifierDescriptorIriValue} a agentictrust:IdentifierDescriptor, agentictrust:Descriptor, prov:Entity ;`);
    if (uaid && typeof uaid === 'string' && uaid.trim()) {
      // UAID may contain special characters like : and ; which are valid in URIs but problematic in IRIs
      // Use a hash-based identifier instead to avoid IRI encoding issues
      const uaidHash = createHash('sha256').update(uaid.trim()).digest('hex').slice(0, 32);
      const didIri = `<https://www.agentictrust.io/id/did/hol/${uaidHash}>`;
      identifierDescriptorLines.push(`  agentictrust:hasDID ${didIri} ;`);
      // Emit DID as a separate statement block
      const didLines: string[] = [];
      didLines.push(`${didIri} a agentictrust:DID, agentictrust:DecentralizedIdentifier, agentictrust:Identifier, prov:Entity ;`);
      didLines.push(`  agentictrust:identifies ${identifierIri} ;`);
      didLines.push(`  rdfs:label "${escapeTurtleString(uaid.trim())}" .\n\n`);
      chunks.push(didLines.join('\n'));
    }
    identifierDescriptorLines.push(`  .\n`);
    chunks.push(identifierDescriptorLines.join('\n'));

    // IdentityDescriptorHOL
    const identityDescriptorLines: string[] = [];
    identityDescriptorLines.push(`${identityDescriptorIri} a hol:IdentityDescriptorHOL, agentictrust:AgentIdentityDescriptor, agentictrust:Descriptor, prov:Entity ;`);
    
    // Extract from rawJson
    if (rawJsonData) {
      if (typeof rawJsonData?.name === 'string' && rawJsonData.name.trim()) {
        identityDescriptorLines.push(`  agentictrust:descriptorName "${escapeTurtleString(rawJsonData.name.trim())}" ;`);
        identityDescriptorLines.push(`  rdfs:label "${escapeTurtleString(rawJsonData.name.trim())}" ;`);
      } else if (row?.agentName) {
        identityDescriptorLines.push(`  agentictrust:descriptorName "${escapeTurtleString(String(row.agentName))}" ;`);
        identityDescriptorLines.push(`  rdfs:label "${escapeTurtleString(String(row.agentName))}" ;`);
      }
      
      if (typeof rawJsonData?.description === 'string' && rawJsonData.description.trim()) {
        identityDescriptorLines.push(`  agentictrust:descriptorDescription "${escapeTurtleString(rawJsonData.description.trim())}" ;`);
      } else if (row?.description) {
        identityDescriptorLines.push(`  agentictrust:descriptorDescription "${escapeTurtleString(String(row.description))}" ;`);
      }
      
      if (rawJsonData?.image != null) {
        const imgUrl = String(rawJsonData.image).trim();
        if (imgUrl) {
          const imgIri = turtleIriOrLiteral(imgUrl);
          if (imgIri) identityDescriptorLines.push(`  agentictrust:descriptorImage ${imgIri} ;`);
        }
      } else if (row?.image) {
        const imgIri = turtleIriOrLiteral(String(row.image));
        if (imgIri) identityDescriptorLines.push(`  agentictrust:descriptorImage ${imgIri} ;`);
      }
    }
    
    identityDescriptorLines.push(`  .\n`);
    chunks.push(identityDescriptorLines.join('\n'));

    // AgentProfileHOL
    const profileLines: string[] = [];
    profileLines.push(`${profileIri} a hol:AgentProfileHOL, agentictrust:AgentIdentityDescriptor, agentictrust:Descriptor, prov:Entity ;`);
    
    if (uaid) profileLines.push(`  hol:uaid "${escapeTurtleString(uaid)}" ;`);
    if (originalId) profileLines.push(`  hol:originalId "${escapeTurtleString(originalId)}" ;`);
    if (registry) profileLines.push(`  hol:registry "${escapeTurtleString(registry)}" ;`);
    
    // Name fields
    const displayName = rawJsonData?.profile?.display_name || rawJsonData?.profile?.displayName || row?.displayName || rawJsonData?.name || row?.agentName;
    if (displayName) {
      profileLines.push(`  hol:displayName "${escapeTurtleString(String(displayName))}" ;`);
      profileLines.push(`  agentictrust:descriptorName "${escapeTurtleString(String(displayName))}" ;`);
      profileLines.push(`  rdfs:label "${escapeTurtleString(String(displayName))}" ;`);
    }
    
    const alias = rawJsonData?.profile?.alias || row?.alias || agentId;
    if (alias) profileLines.push(`  hol:alias "${escapeTurtleString(String(alias))}" ;`);
    
    const bio = rawJsonData?.profile?.bio || row?.bio || rawJsonData?.description || row?.description;
    if (bio) {
      profileLines.push(`  hol:bio "${escapeTurtleString(String(bio))}" ;`);
      profileLines.push(`  agentictrust:descriptorDescription "${escapeTurtleString(String(bio))}" ;`);
    }
    
    // Rating and trust
    const rating = rawJsonData?.metadata?.rating ?? rawJsonData?.rating ?? row?.rating;
    if (rating != null && Number.isFinite(rating)) {
      profileLines.push(`  hol:rating ${Number(rating)} ;`);
    }
    
    const trustScore = rawJsonData?.trustScore ?? rawJsonData?.metadata?.trustScore ?? row?.trustScore;
    if (trustScore != null && Number.isFinite(trustScore)) {
      profileLines.push(`  hol:trustScore ${Number(trustScore)} ;`);
    }
    
    // Interactions and availability
    const totalInteractions = rawJsonData?.metadata?.totalInteractions ?? rawJsonData?.totalInteractions ?? row?.totalInteractions;
    if (totalInteractions != null && Number.isFinite(totalInteractions)) {
      profileLines.push(`  hol:totalInteractions ${Number(totalInteractions)} ;`);
    }
    
    const availabilityScore = rawJsonData?.metadata?.availabilityScore ?? rawJsonData?.availabilityScore ?? row?.availabilityScore;
    if (availabilityScore != null && Number.isFinite(availabilityScore)) {
      profileLines.push(`  hol:availabilityScore ${Number(availabilityScore)} ;`);
    }
    
    const availabilityLatencyMs = rawJsonData?.metadata?.availabilityLatencyMs ?? rawJsonData?.availabilityLatencyMs ?? row?.availabilityLatencyMs;
    if (availabilityLatencyMs != null && Number.isFinite(availabilityLatencyMs)) {
      profileLines.push(`  hol:availabilityLatencyMs ${Number(availabilityLatencyMs)} ;`);
    }
    
    const availabilityStatus = rawJsonData?.metadata?.availabilityStatus ?? rawJsonData?.availabilityStatus ?? row?.availabilityStatus;
    if (availabilityStatus) profileLines.push(`  hol:availabilityStatus "${escapeTurtleString(String(availabilityStatus))}" ;`);
    
    const availabilityCheckedAt = rawJsonData?.metadata?.availabilityCheckedAt ?? rawJsonData?.availabilityCheckedAt;
    if (availabilityCheckedAt) {
      const checkedAt = typeof availabilityCheckedAt === 'string' ? Math.floor(Date.parse(availabilityCheckedAt) / 1000) : Number(availabilityCheckedAt);
      if (Number.isFinite(checkedAt) && checkedAt > 0) {
        profileLines.push(`  hol:availabilityCheckedAt ${checkedAt} ;`);
      }
    } else if (row?.availabilityCheckedAt) {
      profileLines.push(`  hol:availabilityCheckedAt ${Number(row.availabilityCheckedAt)} ;`);
    }
    
    const availabilityReason = rawJsonData?.metadata?.availabilityReason ?? rawJsonData?.availabilityReason ?? row?.availabilityReason;
    if (availabilityReason) profileLines.push(`  hol:availabilityReason "${escapeTurtleString(String(availabilityReason))}" ;`);
    
    const availabilitySource = rawJsonData?.metadata?.availabilitySource ?? rawJsonData?.availabilitySource ?? row?.availabilitySource;
    if (availabilitySource) profileLines.push(`  hol:availabilitySource "${escapeTurtleString(String(availabilitySource))}" ;`);
    
    const available = rawJsonData?.available ?? (row?.available === 1);
    if (available !== undefined) profileLines.push(`  hol:available "${available ? 'true' : 'false'}" ;`);
    
    // Language
    const detectedLanguage = rawJsonData?.metadata?.detectedLanguage ?? rawJsonData?.detectedLanguage ?? row?.detectedLanguage;
    if (detectedLanguage) profileLines.push(`  hol:detectedLanguage "${escapeTurtleString(String(detectedLanguage))}" ;`);
    
    const detectedLanguageCode = rawJsonData?.metadata?.detectedLanguageCode ?? rawJsonData?.detectedLanguageCode;
    if (detectedLanguageCode) profileLines.push(`  hol:detectedLanguageCode "${escapeTurtleString(String(detectedLanguageCode))}" ;`);
    
    const detectedLanguageConfidence = rawJsonData?.metadata?.detectedLanguageConfidence ?? rawJsonData?.detectedLanguageConfidence;
    if (detectedLanguageConfidence != null && Number.isFinite(detectedLanguageConfidence)) {
      profileLines.push(`  hol:detectedLanguageConfidence ${Number(detectedLanguageConfidence)} ;`);
    }
    
    // Adapter and protocol
    const adapter = rawJsonData?.metadata?.adapter ?? rawJsonData?.adapter;
    if (adapter) profileLines.push(`  hol:adapter "${escapeTurtleString(String(adapter))}" ;`);
    
    const protocol = rawJsonData?.metadata?.protocol ?? rawJsonData?.protocol;
    if (protocol) profileLines.push(`  hol:protocol "${escapeTurtleString(String(protocol))}" ;`);
    
    // AI Agent metadata
    const aiagentCreator = rawJsonData?.profile?.aiAgent?.creator ?? rawJsonData?.metadata?.creator ?? row?.aiagentCreator;
    if (aiagentCreator) profileLines.push(`  hol:aiagentCreator "${escapeTurtleString(String(aiagentCreator))}" ;`);
    
    const aiagentModel = rawJsonData?.profile?.aiAgent?.model ?? rawJsonData?.metadata?.model ?? row?.aiagentModel;
    if (aiagentModel) profileLines.push(`  hol:aiagentModel "${escapeTurtleString(String(aiagentModel))}" ;`);
    
    // Communication and routing
    const communicationSupported = rawJsonData?.communicationSupported;
    if (communicationSupported !== undefined) profileLines.push(`  hol:communicationSupported "${communicationSupported ? 'true' : 'false'}" ;`);
    
    const routingSupported = rawJsonData?.routingSupported;
    if (routingSupported !== undefined) profileLines.push(`  hol:routingSupported "${routingSupported ? 'true' : 'false'}" ;`);
    
    // Image status
    const imageStatus = rawJsonData?.metadata?.imageStatus ?? rawJsonData?.imageStatus;
    if (imageStatus) profileLines.push(`  hol:imageStatus "${escapeTurtleString(String(imageStatus))}" ;`);
    
    // Timestamps
    if (rawJsonData?.lastIndexed) {
      const lastIndexed = typeof rawJsonData.lastIndexed === 'string' ? Math.floor(Date.parse(rawJsonData.lastIndexed) / 1000) : Number(rawJsonData.lastIndexed);
      if (Number.isFinite(lastIndexed) && lastIndexed > 0) {
        profileLines.push(`  hol:lastIndexed ${lastIndexed} ;`);
      }
    }
    
    if (rawJsonData?.lastSeen) {
      const lastSeen = typeof rawJsonData.lastSeen === 'string' ? Math.floor(Date.parse(rawJsonData.lastSeen) / 1000) : Number(rawJsonData.lastSeen);
      if (Number.isFinite(lastSeen) && lastSeen > 0) {
        profileLines.push(`  hol:lastSeen ${lastSeen} ;`);
      }
    }
    
    // Capabilities
    const capabilities: any[] = rawJsonData?.capabilities || (row?.capabilityLabelsJson ? JSON.parse(row.capabilityLabelsJson) : []);
    for (const cap of capabilities) {
      if (typeof cap === 'string' && cap.trim()) {
        const capIri = capabilityIri(cap.trim());
        profileLines.push(`  agentictrust:hasCapability ${capIri} ;`);
        chunks.push(`${capIri} a agentictrust:Capability, prov:Entity ; rdfs:label "${escapeTurtleString(cap.trim())}" .\n\n`);
      }
    }
    
    // Protocols
    const protocols: any[] = rawJsonData?.protocols || (row?.protocolsJson ? JSON.parse(row.protocolsJson) : []);
    for (const proto of protocols) {
      if (typeof proto === 'string' && proto.trim()) {
        const protoIri = protocolIri(proto.trim());
        profileLines.push(`  agentictrust:supportsProtocol ${protoIri} ;`);
        chunks.push(`${protoIri} a agentictrust:ProtocolType, prov:Entity ; rdfs:label "${escapeTurtleString(proto.trim())}" .\n\n`);
      }
    }
    
    // OASF Skills
    const oasfSkills: any[] = rawJsonData?.metadata?.oasfSkills || rawJsonData?.metadata?.oasf_skills || (row?.oasfSkillsJson ? JSON.parse(row.oasfSkillsJson) : []);
    for (const skill of oasfSkills) {
      if (typeof skill === 'string' && skill.trim()) {
        const skClassIri = oasfSkillIri(skill.trim());
        const skIri = holAgentSkillIri(agentId, skill.trim());
        profileLines.push(`  agentictrust:hasSkill ${skIri} ;`);
        chunks.push(`${skIri} a agentictrust:AgentSkill, prov:Entity ; agentictrust:hasSkillClassification ${skClassIri} .\n\n`);
        chunks.push(`${skClassIri} a agentictrust:OASFSkill, agentictrust:AgentSkillClassification, prov:Entity ; agentictrust:oasfSkillId "${escapeTurtleString(skill.trim())}" .\n\n`);
      }
    }
    
    // Endpoints
    const endpoints = rawJsonData?.endpoints;
    if (endpoints && typeof endpoints === 'object') {
      // API endpoint
      if (typeof endpoints?.api === 'string' && endpoints.api.trim()) {
        const epIri = endpointIri(agentId, 'api', uaid);
        profileLines.push(`  agentictrust:hasEndpoint ${epIri} ;`);
        const epUrl = turtleIriOrLiteral(endpoints.api.trim());
        if (epUrl) {
          chunks.push(`${epIri} a agentictrust:Endpoint, prov:Entity ;`);
          chunks.push(`  agentictrust:endpointName "api" ;`);
          chunks.push(`  agentictrust:endpointUrl ${epUrl} ;`);
          chunks.push(`  agentictrust:endpointType <https://www.agentictrust.io/ontology/agentictrust-core/endpointType/a2a> ;`);
          chunks.push(`  .\n\n`);
        }
      }
      
      // Custom endpoints
      if (endpoints?.customEndpoints && typeof endpoints.customEndpoints === 'object') {
        for (const [key, value] of Object.entries(endpoints.customEndpoints)) {
          if (typeof key === 'string' && key.trim()) {
            // Extract URL from endpoint object or use string value directly
            let endpointUrl: string | null = null;
            if (typeof value === 'string' && value.trim()) {
              const strValue = value.trim();
              // Check if this is a Python object string representation (contains "Endpoint(" or angle brackets)
              // Try to extract the actual URL from it
              const urlMatch = strValue.match(/value=['"]([^'"]+)['"]/);
              if (urlMatch && urlMatch[1]) {
                endpointUrl = urlMatch[1].trim();
              } else if (!strValue.includes('<') && !strValue.includes('Endpoint(')) {
                // Only use if it doesn't look like a Python object representation
                endpointUrl = strValue;
              } else {
                continue; // Skip Python object representations
              }
            } else if (value && typeof value === 'object') {
              // Handle endpoint objects with 'value' field
              endpointUrl = (value as any)?.value;
              if (typeof endpointUrl !== 'string' || !endpointUrl.trim()) {
                continue; // Skip if no valid URL
              }
              endpointUrl = endpointUrl.trim();
            } else {
              continue; // Skip non-string, non-object values
            }
            
            // Validate that we have a real URL, not just the word "value" or other invalid values
            if (!endpointUrl || endpointUrl === 'value' || endpointUrl === 'type' || endpointUrl.length < 4 || !endpointUrl.includes('://')) {
              continue;
            }
            
            const epIri = endpointIri(agentId, key.trim(), uaid);
            profileLines.push(`  agentictrust:hasEndpoint ${epIri} ;`);
            const epUrl = turtleIriOrLiteral(endpointUrl);
            if (epUrl) {
              chunks.push(`${epIri} a agentictrust:Endpoint, prov:Entity ;`);
              chunks.push(`  agentictrust:endpointName "${escapeTurtleString(key.trim())}" ;`);
              chunks.push(`  agentictrust:endpointUrl ${epUrl} ;`);
              chunks.push(`  agentictrust:endpointType <https://www.agentictrust.io/ontology/agentictrust-core/endpointType/a2a> ;`);
              chunks.push(`  .\n\n`);
            }
          }
        }
      }
    }
    
    // Primary endpoint from row
    if (row?.primaryEndpoint) {
      const epIri = endpointIri(agentId, 'primary', uaid);
      profileLines.push(`  agentictrust:hasEndpoint ${epIri} ;`);
      const epUrl = turtleIriOrLiteral(String(row.primaryEndpoint));
      if (epUrl) {
        chunks.push(`${epIri} a agentictrust:Endpoint, prov:Entity ;`);
        chunks.push(`  agentictrust:endpointName "primary" ;`);
        chunks.push(`  agentictrust:endpointUrl ${epUrl} ;`);
        chunks.push(`  agentictrust:endpointType <https://www.agentictrust.io/ontology/agentictrust-core/endpointType/a2a> ;`);
        chunks.push(`  .\n\n`);
      }
    }
    
    // Remove trailing semicolon and close
    if (profileLines.length > 0) {
      const lastLine = profileLines[profileLines.length - 1];
      profileLines[profileLines.length - 1] = lastLine.replace(/ ;$/, ' .');
      chunks.push(profileLines.join('\n') + '\n');
    }
    
    included += 1;
  }

  const ttl = chunks.join('\n');
  const path = await import('node:path');
  const fs = await import('node:fs/promises');
  
  const publicDir = path.resolve(process.cwd(), '../badge-admin/public');
  const outPath = path.resolve(publicDir, 'rdf', 'hol-agents.ttl');
  await fs.writeFile(outPath, ttl, 'utf8');
  
  return { outPath, bytes: Buffer.byteLength(ttl, 'utf8'), agentCount: included };
}

