import { agentSkillIri, escapeTurtleString, oasfSkillIri, protocolDescriptorIriA2a, protocolIriA2a, rdfPrefixes, turtleIriOrLiteral, turtleJsonLiteral } from './common.js';

export function emitA2AProtocolDescriptorTurtle(opts: {
  chainId: number;
  didAccount: string;
  a2aEndpoint: string;
  agentCard: any;
  skills: { oasf: string[]; other: string[] };
  agentDescriptorIri?: string | null;
}): { turtle: string; protocolDescriptorIri: string; protocolIri: string } {
  const protocolDescriptorIri = protocolDescriptorIriA2a(opts.didAccount);
  const protocolIri = protocolIriA2a(opts.didAccount);

  const lines: string[] = [rdfPrefixes()];

  // Protocol instance
  lines.push(`${protocolIri} a core:Protocol, prov:Entity ;`);
  lines.push(`  core:hasProtocolDescriptor ${protocolDescriptorIri} .`);
  lines.push('');

  if (opts.agentDescriptorIri) {
    lines.push(`${opts.agentDescriptorIri} core:assembledFromMetadata ${protocolDescriptorIri} .`);
    lines.push('');
  }

  const desc: string[] = [];
  desc.push(`${protocolDescriptorIri} a core:A2AProtocolDescriptor, core:ProtocolDescriptor, core:Descriptor, prov:Entity ;`);

  const serviceUrl =
    (typeof opts.agentCard?.serviceUrl === 'string' && opts.agentCard.serviceUrl.trim()) ? opts.agentCard.serviceUrl.trim() : opts.a2aEndpoint;
  const serviceTok = turtleIriOrLiteral(serviceUrl);
  if (serviceTok) desc.push(`  core:serviceUrl ${serviceTok} ;`);

  if (typeof opts.agentCard?.protocolVersion === 'string' && opts.agentCard.protocolVersion.trim()) {
    desc.push(`  core:protocolVersion "${escapeTurtleString(opts.agentCard.protocolVersion.trim())}" ;`);
  } else if (typeof opts.agentCard?.version === 'string' && opts.agentCard.version.trim()) {
    desc.push(`  core:protocolVersion "${escapeTurtleString(opts.agentCard.version.trim())}" ;`);
  }

  if (typeof opts.agentCard?.preferredTransport === 'string' && opts.agentCard.preferredTransport.trim()) {
    desc.push(`  core:preferredTransport "${escapeTurtleString(opts.agentCard.preferredTransport.trim())}" ;`);
  }

  if (typeof opts.agentCard?.name === 'string' && opts.agentCard.name.trim()) {
    desc.push(`  core:descriptorName "${escapeTurtleString(opts.agentCard.name.trim())}" ;`);
    desc.push(`  rdfs:label "${escapeTurtleString(opts.agentCard.name.trim())}" ;`);
  }
  if (typeof opts.agentCard?.description === 'string' && opts.agentCard.description.trim()) {
    desc.push(`  core:descriptorDescription "${escapeTurtleString(opts.agentCard.description.trim())}" ;`);
  }

  try {
    const json = JSON.stringify(opts.agentCard ?? null);
    desc.push(`  core:json ${turtleJsonLiteral(json)} ;`);
  } catch {}

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
  for (const n of extraNodes) lines.push(n + '\n');

  lines.push('');
  return { turtle: lines.join('\n'), protocolDescriptorIri, protocolIri };
}

