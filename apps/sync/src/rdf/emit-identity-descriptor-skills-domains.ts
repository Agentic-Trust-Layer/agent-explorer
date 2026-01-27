import { agentDomainIri, agentSkillIri, escapeTurtleString, oasfDomainIri, oasfSkillIri, rdfPrefixes } from './common.js';

function isOasfKey(value: string): boolean {
  return /^[a-z0-9_]+(\/[a-z0-9_]+)+/i.test(value.trim());
}

export function emitIdentityDescriptorSkillsDomains(opts: {
  descriptorIri: string;
  subjectKey: string; // use did:8004... so agent-skill/domain IRIs are identity-keyed
  skills: string[];
  domains: string[];
}): string {
  const lines: string[] = [rdfPrefixes()];

  const skillNodes: string[] = [];
  const domainNodes: string[] = [];

  for (const raw of opts.skills) {
    const s = String(raw || '').trim();
    if (!s) continue;
    const skillNode = agentSkillIri(opts.subjectKey, s);
    lines.push(`${opts.descriptorIri} core:hasSkill ${skillNode} .`);

    if (s.startsWith('https://agentictrust.io/ontology/oasf#skill/')) {
      const skKey = s.slice('https://agentictrust.io/ontology/oasf#skill/'.length);
      const classification = oasfSkillIri(skKey);
      skillNodes.push(`${skillNode} a core:AgentSkill, prov:Entity ; core:hasSkillClassification ${classification} .`);
      skillNodes.push(`${classification} a oasf:Skill, prov:Entity ; oasf:key "${escapeTurtleString(skKey)}" .`);
    } else if (isOasfKey(s)) {
      const classification = oasfSkillIri(s);
      skillNodes.push(`${skillNode} a core:AgentSkill, prov:Entity ; core:hasSkillClassification ${classification} .`);
      skillNodes.push(`${classification} a oasf:Skill, prov:Entity ; oasf:key "${escapeTurtleString(s)}" .`);
    } else {
      skillNodes.push(
        `${skillNode} a core:AgentSkill, prov:Entity ; core:skillId "${escapeTurtleString(s)}" ; rdfs:label "${escapeTurtleString(s)}" .`,
      );
    }
  }

  for (const raw of opts.domains) {
    const d = String(raw || '').trim();
    if (!d) continue;
    const domainNode = agentDomainIri(opts.subjectKey, d);
    lines.push(`${opts.descriptorIri} core:hasDomain ${domainNode} .`);

    if (isOasfKey(d)) {
      const classification = oasfDomainIri(d);
      domainNodes.push(`${domainNode} a core:AgentDomain, prov:Entity ; core:hasDomainClassification ${classification} .`);
      domainNodes.push(`${classification} a oasf:Domain, prov:Entity ; oasf:key "${escapeTurtleString(d)}" .`);
    } else {
      // No canonical domain-id property exists in core ontology; keep it as a label-only AgentDomain.
      domainNodes.push(`${domainNode} a core:AgentDomain, prov:Entity ; rdfs:label "${escapeTurtleString(d)}" .`);
    }
  }

  lines.push('');
  for (const n of [...skillNodes, ...domainNodes]) lines.push(n + '\n');
  lines.push('');
  return lines.join('\n');
}

