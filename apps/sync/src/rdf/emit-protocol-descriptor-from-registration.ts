import {
  agentSkillIri,
  escapeTurtleString,
  oasfSkillIri,
  protocolDescriptorIriA2a,
  protocolDescriptorIriMcp,
  protocolIriA2a,
  protocolIriMcp,
  rdfPrefixes,
  turtleIriOrLiteral,
  turtleJsonLiteral,
} from './common.js';

export function emitProtocolDescriptorFromRegistration(opts: {
  didAccount: string;
  protocol: 'a2a' | 'mcp';
  serviceUrl: string;
  protocolVersion?: string | null;
  endpointJson?: any | null;
  skills: { oasf: string[]; other: string[] };
  assembledFromDescriptorIri?: string | null;
}): string {
  const didAccount = opts.didAccount;
  const pdIri = opts.protocol === 'a2a' ? protocolDescriptorIriA2a(didAccount) : protocolDescriptorIriMcp(didAccount);
  const pIri = opts.protocol === 'a2a' ? protocolIriA2a(didAccount) : protocolIriMcp(didAccount);
  const pdClass = opts.protocol === 'a2a' ? 'core:A2AProtocolDescriptor' : 'core:MCPProtocolDescriptor';

  const lines: string[] = [rdfPrefixes()];

  lines.push(`${pIri} a core:Protocol, prov:Entity ;`);
  lines.push(`  core:hasProtocolDescriptor ${pdIri} .`);
  lines.push('');

  if (opts.assembledFromDescriptorIri) {
    lines.push(`${opts.assembledFromDescriptorIri} core:assembledFromMetadata ${pdIri} .`);
    lines.push('');
  }

  const desc: string[] = [];
  desc.push(`${pdIri} a ${pdClass}, core:ProtocolDescriptor, core:Descriptor, prov:Entity ;`);

  const serviceTok = turtleIriOrLiteral(opts.serviceUrl);
  if (serviceTok) desc.push(`  core:serviceUrl ${serviceTok} ;`);
  if (opts.protocolVersion && opts.protocolVersion.trim()) {
    desc.push(`  core:protocolVersion "${escapeTurtleString(opts.protocolVersion.trim())}" ;`);
  }

  if (opts.endpointJson != null) {
    try {
      const json = JSON.stringify(opts.endpointJson);
      desc.push(`  core:json ${turtleJsonLiteral(json)} ;`);
    } catch {}
  }

  // Best-effort: mirror UX fields from descriptor JSON onto explicit properties
  const name = typeof (opts.endpointJson as any)?.name === 'string' ? String((opts.endpointJson as any).name).trim() : '';
  if (name) {
    desc.push(`  dcterms:title "${escapeTurtleString(name)}" ;`);
    desc.push(`  rdfs:label "${escapeTurtleString(name)}" ;`);
  }
  const description =
    typeof (opts.endpointJson as any)?.description === 'string' ? String((opts.endpointJson as any).description).trim() : '';
  if (description) desc.push(`  dcterms:description "${escapeTurtleString(description)}" ;`);
  const image = typeof (opts.endpointJson as any)?.image === 'string' ? String((opts.endpointJson as any).image).trim() : '';
  if (image) {
    const imgTok = turtleIriOrLiteral(image);
    if (imgTok) desc.push(`  schema:image ${imgTok} ;`);
  }

  const extra: string[] = [];
  for (const sk of opts.skills.oasf) {
    const skKey = sk.startsWith('https://agentictrust.io/ontology/oasf#skill/')
      ? sk.slice('https://agentictrust.io/ontology/oasf#skill/'.length)
      : sk;
    const skillNode = agentSkillIri(didAccount, skKey);
    const classification = oasfSkillIri(skKey);
    desc.push(`  core:hasSkill ${skillNode} ;`);
    extra.push(`${skillNode} a core:AgentSkill, prov:Entity ; core:hasSkillClassification ${classification} .`);
    extra.push(`${classification} a oasf:Skill, prov:Entity ; oasf:key "${escapeTurtleString(skKey)}" .`);
  }
  for (const sk of opts.skills.other) {
    const skillNode = agentSkillIri(didAccount, sk);
    desc.push(`  core:hasSkill ${skillNode} ;`);
    extra.push(`${skillNode} a core:AgentSkill, prov:Entity ; core:skillId "${escapeTurtleString(sk)}" ; rdfs:label "${escapeTurtleString(sk)}" .`);
  }

  desc[desc.length - 1] = desc[desc.length - 1].replace(/ ;$/, ' .');
  lines.push(desc.join('\n'));
  lines.push('');
  for (const n of extra) lines.push(n + '\n');
  lines.push('');

  return lines.join('\n');
}

