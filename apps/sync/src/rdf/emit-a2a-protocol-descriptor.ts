import { agentSkillIri, escapeTurtleString, oasfSkillIri, protocolIriA2a, rdfPrefixes, serviceEndpointIri, turtleIriOrLiteral, turtleJsonLiteral } from './common.js';

function asIriToken(value: string | null | undefined): string | null {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) return null;
  if (s.startsWith('<') && s.endsWith('>')) return s;
  return `<${s}>`;
}

export function emitA2AProtocolDescriptorTurtle(opts: {
  chainId: number;
  didAccount: string;
  a2aEndpoint: string;
  agentCard: any;
  skills: { oasf: string[]; other: string[] };
  domains?: { oasf: string[]; other: string[] };
  agentIri?: string | null;
  identityIri?: string | null;
}): { turtle: string; serviceEndpointIri: string; protocolIri: string } {
  const serviceEndpoint = serviceEndpointIri(opts.didAccount, 'a2a');
  const protocolIri = protocolIriA2a(opts.didAccount);
  const seDescIri = serviceEndpoint.replace('/id/service-endpoint/', '/id/descriptor/service-endpoint/');
  const pDescIri = protocolIri.replace('/id/protocol/', '/id/descriptor/protocol/');

  const lines: string[] = [rdfPrefixes()];

  // Attach endpoint to both the agent and its identity (best-effort; may already exist)
  const agentIriTok = asIriToken(opts.agentIri);
  const identityIriTok = asIriToken(opts.identityIri);
  if (agentIriTok) lines.push(`${agentIriTok} core:hasServiceEndpoint ${serviceEndpoint} .`);
  if (identityIriTok) lines.push(`${identityIriTok} core:hasServiceEndpoint ${serviceEndpoint} .`);
  if (opts.agentIri || opts.identityIri) lines.push('');

  const serviceUrl =
    (typeof opts.agentCard?.serviceUri === 'string' && opts.agentCard.serviceUri.trim() ? opts.agentCard.serviceUri.trim() : '') ||
    (typeof opts.agentCard?.serviceURL === 'string' && opts.agentCard.serviceURL.trim() ? opts.agentCard.serviceURL.trim() : '') ||
    (typeof opts.agentCard?.serviceUrl === 'string' && opts.agentCard.serviceUrl.trim() ? opts.agentCard.serviceUrl.trim() : '') ||
    (typeof opts.agentCard?.url === 'string' && opts.agentCard.url.trim() ? opts.agentCard.url.trim() : '') ||
    opts.a2aEndpoint;
  const serviceTok = turtleIriOrLiteral(serviceUrl);
  lines.push(`${serviceEndpoint} a core:ServiceEndpoint, core:Endpoint, prov:Entity ;`);
  lines.push(`  core:endpointName "a2a" ;`);
  lines.push(`  core:hasDescriptor ${seDescIri} ;`);
  lines.push(`  core:hasProtocol ${protocolIri} .`);
  lines.push('');

  const desc: string[] = [];
  desc.push(`${protocolIri} a core:A2AProtocol, core:Protocol, prov:Entity ;`);
  desc.push(`  core:hasDescriptor ${pDescIri} ;`);
  if (serviceTok) desc.push(`  core:serviceUrl ${serviceTok} ;`);

  if (typeof opts.agentCard?.protocolVersion === 'string' && opts.agentCard.protocolVersion.trim()) {
    desc.push(`  core:protocolVersion "${escapeTurtleString(opts.agentCard.protocolVersion.trim())}" ;`);
  } else if (typeof opts.agentCard?.version === 'string' && opts.agentCard.version.trim()) {
    desc.push(`  core:protocolVersion "${escapeTurtleString(opts.agentCard.version.trim())}" ;`);
  }

  if (typeof opts.agentCard?.preferredTransport === 'string' && opts.agentCard.preferredTransport.trim()) {
    desc.push(`  core:preferredTransport "${escapeTurtleString(opts.agentCard.preferredTransport.trim())}" ;`);
  }

  const extraNodes: string[] = [];

  // skills (link from descriptor + emit skill nodes)
  for (const sk of opts.skills.oasf) {
    const skKey = sk.startsWith('https://agentictrust.io/ontology/oasf#skill/')
      ? sk.slice('https://agentictrust.io/ontology/oasf#skill/'.length)
      : sk;
    const skillNode = agentSkillIri(opts.didAccount, skKey);
    const classification = oasfSkillIri(skKey);
    desc.push(`  core:hasSkill ${skillNode} ;`);
    extraNodes.push(`${skillNode} a core:AgentSkill, prov:Entity ; core:hasSkillClassification ${classification} .`);
    extraNodes.push(`${classification} a oasf:Skill, prov:Entity ; oasf:key "${escapeTurtleString(skKey)}" .`);
  }

  for (const sk of opts.skills.other) {
    const skillNode = agentSkillIri(opts.didAccount, sk);
    desc.push(`  core:hasSkill ${skillNode} ;`);
    extraNodes.push(`${skillNode} a core:AgentSkill, prov:Entity ; core:skillId "${escapeTurtleString(sk)}" ; rdfs:label "${escapeTurtleString(sk)}" .`);
  }

  // terminate descriptor
  desc[desc.length - 1] = desc[desc.length - 1].replace(/ ;$/, ' .');
  lines.push(desc.join('\n'));
  lines.push('');

  // Endpoint descriptor
  lines.push(`${seDescIri} a core:Descriptor, prov:Entity ;`);
  lines.push(`  dcterms:title "a2a" ;`);
  lines.push(`  rdfs:label "a2a" .`);
  lines.push('');

  // Protocol descriptor (UI metadata + agent-card.json capture)
  const pDescLines: string[] = [];
  pDescLines.push(`${pDescIri} a core:Descriptor, prov:Entity ;`);
  if (typeof opts.agentCard?.name === 'string' && opts.agentCard.name.trim()) {
    pDescLines.push(`  dcterms:title "${escapeTurtleString(opts.agentCard.name.trim())}" ;`);
    pDescLines.push(`  rdfs:label "${escapeTurtleString(opts.agentCard.name.trim())}" ;`);
  } else {
    pDescLines.push(`  dcterms:title "a2a" ;`);
    pDescLines.push(`  rdfs:label "a2a" ;`);
  }
  if (typeof opts.agentCard?.description === 'string' && opts.agentCard.description.trim()) {
    pDescLines.push(`  dcterms:description "${escapeTurtleString(opts.agentCard.description.trim())}" ;`);
  }
  if (typeof opts.agentCard?.image === 'string' && opts.agentCard.image.trim()) {
    const imgTok = turtleIriOrLiteral(opts.agentCard.image.trim());
    if (imgTok) pDescLines.push(`  schema:image ${imgTok} ;`);
  }
  try {
    const json = JSON.stringify(opts.agentCard ?? null);
    pDescLines.push(`  core:json ${turtleJsonLiteral(json)} ;`);
  } catch {}
  pDescLines[pDescLines.length - 1] = pDescLines[pDescLines.length - 1].replace(/ ;$/, ' .');
  lines.push(pDescLines.join('\n'));
  lines.push('');

  // Domains (A2A protocol-specific)
  const domains = opts.domains ?? null;
  if (domains) {
    for (const d of domains.oasf) {
      const dKey = d.startsWith('https://agentictrust.io/ontology/oasf#domain/')
        ? d.slice('https://agentictrust.io/ontology/oasf#domain/'.length)
        : d;
      const domainNode = `<https://www.agentictrust.io/id/agent-domain/${encodeURIComponent(opts.didAccount).replace(/%/g, '_')}/${encodeURIComponent(dKey).replace(/%/g, '_')}>`;
      desc.push(`  core:hasDomain ${domainNode} ;`);
      // (We don't emit full domain classification nodes here; registration sync does.)
    }
  }

  for (const n of extraNodes) lines.push(n + '\n');

  lines.push('');
  return { turtle: lines.join('\n'), serviceEndpointIri: serviceEndpoint, protocolIri };
}

