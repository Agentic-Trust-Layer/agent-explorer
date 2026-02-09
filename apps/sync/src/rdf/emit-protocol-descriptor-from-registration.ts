import {
  agentDomainIri,
  agentSkillIri,
  escapeTurtleString,
  oasfDomainIri,
  oasfSkillIri,
  protocolIriA2a,
  protocolIriMcp,
  rdfPrefixes,
  serviceEndpointIri,
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
  domains?: { oasf: string[]; other: string[] } | null;
  agentIri?: string | null;
  identityIri?: string | null;
}): string {
  const didAccount = opts.didAccount;
  const seIri = serviceEndpointIri(didAccount, opts.protocol);
  const pIri = opts.protocol === 'a2a' ? protocolIriA2a(didAccount) : protocolIriMcp(didAccount);
  const pClass = opts.protocol === 'a2a' ? 'core:A2AProtocol' : 'core:MCPProtocol';
  const seDescIri = seIri.replace('/id/service-endpoint/', '/id/descriptor/service-endpoint/');
  const pDescIri = pIri.replace('/id/protocol/', '/id/descriptor/protocol/');

  const lines: string[] = [rdfPrefixes()];

  // Attach endpoint to both the agent and its identity.
  if (opts.agentIri) lines.push(`${opts.agentIri} core:hasServiceEndpoint ${seIri} .`);
  if (opts.identityIri) lines.push(`${opts.identityIri} core:hasServiceEndpoint ${seIri} .`);
  if (opts.agentIri || opts.identityIri) lines.push('');

  // Service endpoint node (name + protocol link + descriptor)
  lines.push(`${seIri} a core:ServiceEndpoint, core:Endpoint, prov:Entity ;`);
  lines.push(`  core:endpointName "${escapeTurtleString(opts.protocol)}" ;`);
  lines.push(`  core:hasDescriptor ${seDescIri} ;`);
  lines.push(`  core:hasProtocol ${pIri} .`);
  lines.push('');

  const proto: string[] = [];
  proto.push(`${pIri} a ${pClass}, core:Protocol, prov:Entity ;`);
  proto.push(`  core:hasDescriptor ${pDescIri} ;`);
  // serviceUrl lives on Protocol (not ServiceEndpoint)
  const serviceTok = turtleIriOrLiteral(opts.serviceUrl);
  if (serviceTok) proto.push(`  core:serviceUrl ${serviceTok} ;`);
  if (opts.protocolVersion && opts.protocolVersion.trim()) proto.push(`  core:protocolVersion "${escapeTurtleString(opts.protocolVersion.trim())}" ;`);

  const extra: string[] = [];
  for (const sk of opts.skills.oasf) {
    const skKey = sk.startsWith('https://agentictrust.io/ontology/oasf#skill/')
      ? sk.slice('https://agentictrust.io/ontology/oasf#skill/'.length)
      : sk;
    const skillNode = agentSkillIri(didAccount, skKey);
    const classification = oasfSkillIri(skKey);
    proto.push(`  core:hasSkill ${skillNode} ;`);
    extra.push(`${skillNode} a core:AgentSkill, prov:Entity ; core:hasSkillClassification ${classification} .`);
    extra.push(`${classification} a oasf:Skill, prov:Entity ; oasf:key "${escapeTurtleString(skKey)}" .`);
  }
  for (const sk of opts.skills.other) {
    const skillNode = agentSkillIri(didAccount, sk);
    proto.push(`  core:hasSkill ${skillNode} ;`);
    extra.push(`${skillNode} a core:AgentSkill, prov:Entity ; core:skillId "${escapeTurtleString(sk)}" ; rdfs:label "${escapeTurtleString(sk)}" .`);
  }

  // Domains (best-effort). Represent as core:AgentDomain nodes.
  const domains = opts.domains ?? null;
  if (domains) {
    for (const d of domains.oasf) {
      const key = d.startsWith('https://agentictrust.io/ontology/oasf#domain/')
        ? d.slice('https://agentictrust.io/ontology/oasf#domain/'.length)
        : d;
      const domainNode = agentDomainIri(didAccount, key);
      const classification = oasfDomainIri(key);
      proto.push(`  core:hasDomain ${domainNode} ;`);
      extra.push(`${domainNode} a core:AgentDomain, prov:Entity ; core:hasDomainClassification ${classification} .`);
      extra.push(`${classification} a oasf:Domain, prov:Entity ; oasf:key "${escapeTurtleString(key)}" .`);
    }
    for (const d of domains.other) {
      const domainNode = agentDomainIri(didAccount, d);
      proto.push(`  core:hasDomain ${domainNode} ;`);
      extra.push(`${domainNode} a core:AgentDomain, prov:Entity ; rdfs:label "${escapeTurtleString(d)}" .`);
    }
  }

  proto[proto.length - 1] = proto[proto.length - 1].replace(/ ;$/, ' .');
  lines.push(proto.join('\n'));
  lines.push('');

  // Endpoint descriptor (minimal metadata)
  lines.push(`${seDescIri} a core:Descriptor, prov:Entity ;`);
  lines.push(`  dcterms:title "${escapeTurtleString(opts.protocol)}" ;`);
  lines.push(`  rdfs:label "${escapeTurtleString(opts.protocol)}" .`);
  lines.push('');

  // Protocol descriptor (placeholder; agent-cards sync will populate core:agentCardJson + UX fields)
  const isMcp = opts.protocol === 'mcp';
  const pDescType = isMcp ? 'core:DescriptorMCPProtocol' : 'core:Descriptor';
  lines.push(`${pDescIri} a ${pDescType}, core:Descriptor, prov:Entity ;`);
  lines.push(`  dcterms:title "${escapeTurtleString(opts.protocol)}" ;`);
  lines.push(`  rdfs:label "${escapeTurtleString(opts.protocol)}" ;`);

  // MCP registration-declared tools/prompts/capabilities (materialize for analytics/badges).
  if (isMcp && opts.endpointJson && typeof opts.endpointJson === 'object') {
    const tools = Array.isArray((opts.endpointJson as any).tools) ? (opts.endpointJson as any).tools : [];
    const prompts = Array.isArray((opts.endpointJson as any).prompts) ? (opts.endpointJson as any).prompts : [];
    const capabilities = Array.isArray((opts.endpointJson as any).capabilities) ? (opts.endpointJson as any).capabilities : [];

    const toolsStr = tools.filter((x: any) => typeof x === 'string' && x.trim()).map((x: any) => String(x).trim());
    const promptsStr = prompts.filter((x: any) => typeof x === 'string' && x.trim()).map((x: any) => String(x).trim());
    const capsStr = capabilities.filter((x: any) => typeof x === 'string' && x.trim()).map((x: any) => String(x).trim());

    if (toolsStr.length) {
      lines.push(`  core:mcpToolsCount ${toolsStr.length} ;`);
      lines.push(`  core:mcpToolsJson ${turtleJsonLiteral(JSON.stringify(toolsStr))} ;`);
    }
    if (promptsStr.length) {
      lines.push(`  core:mcpPromptsCount ${promptsStr.length} ;`);
      lines.push(`  core:mcpPromptsJson ${turtleJsonLiteral(JSON.stringify(promptsStr))} ;`);
    }
    if (capsStr.length) {
      lines.push(`  core:mcpCapabilitiesCount ${capsStr.length} ;`);
      lines.push(`  core:mcpCapabilitiesJson ${turtleJsonLiteral(JSON.stringify(capsStr))} ;`);
    }
  }

  lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
  lines.push('');

  for (const n of extra) lines.push(n + '\n');
  lines.push('');

  return lines.join('\n');
}

