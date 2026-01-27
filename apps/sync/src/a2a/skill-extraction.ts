function safeJsonParse(value: unknown): any | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function parseStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((x) => typeof x === 'string')
      .map((x) => x.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    const parsed = safeJsonParse(trimmed);
    if (Array.isArray(parsed)) return parseStringArray(parsed);
    return trimmed
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function takeObjectArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value as Record<string, unknown>);
  return [];
}

export function isOasfSkillId(skill: string): boolean {
  const s = skill.trim();
  // allow full IRI or OASF-style key paths
  return s.startsWith('https://agentictrust.io/ontology/oasf#skill/') || /^[a-z0-9_]+(\/[a-z0-9_]+)+/i.test(s);
}

export function isOasfDomainId(domain: string): boolean {
  const s = domain.trim();
  return s.startsWith('https://agentictrust.io/ontology/oasf#domain/') || /^[a-z0-9_]+(\/[a-z0-9_]+)+/i.test(s);
}

export function extractSkillsFromAgentCard(agentCardJson: unknown): string[] {
  const parsed = typeof agentCardJson === 'string' ? safeJsonParse(agentCardJson) : agentCardJson;
  if (!parsed || typeof parsed !== 'object') return [];

  const skills: string[] = [];

  // top-level skills can be strings or objects (A2A standard)
  const list = Array.isArray((parsed as any).skills) ? (parsed as any).skills : [];
  for (const entry of list) {
    if (typeof entry === 'string') {
      const t = entry.trim();
      if (t) skills.push(t);
      continue;
    }
    if (entry && typeof entry === 'object') {
      const id = typeof (entry as any).id === 'string' ? (entry as any).id.trim() : '';
      const name = typeof (entry as any).name === 'string' ? (entry as any).name.trim() : '';
      if (id) skills.push(id);
      else if (name) skills.push(name);
    }
  }

  // capabilities.extensions[].params.skills
  const extensions = takeObjectArray((parsed as any).capabilities?.extensions);
  for (const ext of extensions) {
    if (!ext || typeof ext !== 'object') continue;
    const params = (ext as any).params;
    if (!params || typeof params !== 'object') continue;
    skills.push(...parseStringArray((params as any).skills));
  }

  // common fields
  skills.push(...parseStringArray((parsed as any).oasf_skills));
  skills.push(...parseStringArray((parsed as any).a2aSkills));

  return Array.from(new Set(skills.map((s) => s.trim()).filter(Boolean)));
}

export function extractDomainsFromAgentCard(agentCardJson: unknown): string[] {
  const parsed = typeof agentCardJson === 'string' ? safeJsonParse(agentCardJson) : agentCardJson;
  if (!parsed || typeof parsed !== 'object') return [];

  const domains: string[] = [];
  domains.push(...parseStringArray((parsed as any).oasf_domains));
  domains.push(...parseStringArray((parsed as any).a2aDomains));
  return Array.from(new Set(domains.map((s) => s.trim()).filter(Boolean)));
}

export function extractProtocolDataFromAgentUriJson(agentUriJsonText: string): {
  a2a: { skills: string[] };
  mcp: { skills: string[]; tools: string[] };
  oasf: { skills: string[]; domains: string[] };
} {
  const parsed = safeJsonParse(agentUriJsonText);
  if (!parsed || typeof parsed !== 'object')
    return { a2a: { skills: [] }, mcp: { skills: [], tools: [] }, oasf: { skills: [], domains: [] } };

  const a2aSkills = new Set<string>();
  const mcpSkills = new Set<string>();
  const mcpTools = new Set<string>();
  const oasfSkills = new Set<string>();
  const oasfDomains = new Set<string>();

  const services = Array.isArray((parsed as any).services) ? (parsed as any).services : [];
  const endpoints = Array.isArray((parsed as any).endpoints) ? (parsed as any).endpoints : [];
  const all = services.length ? services : endpoints;

  for (const ep of all) {
    if (!ep || typeof ep !== 'object') continue;
    const name = typeof (ep as any).name === 'string' ? (ep as any).name.trim().toLowerCase() : '';
    const isA2A = name === 'a2a' || name === 'agent';
    const isMcp = name === 'mcp';
    const isOasf = name === 'oasf';

    const skills = [
      ...parseStringArray((ep as any).a2aSkills),
      ...parseStringArray((ep as any).mcpSkills),
      ...parseStringArray((ep as any).skills),
    ];
    for (const s of skills) {
      if (!s) continue;
      if (isA2A) a2aSkills.add(s);
      if (isMcp) mcpSkills.add(s);
      if (isOasf) oasfSkills.add(s);
    }

    if (isMcp) {
      for (const t of parseStringArray((ep as any).mcpTools)) {
        if (t) mcpTools.add(t);
      }
    }

    if (isOasf) {
      for (const d of parseStringArray((ep as any).domains)) {
        if (d) oasfDomains.add(d);
      }
    }
  }

  return {
    a2a: { skills: Array.from(a2aSkills) },
    mcp: { skills: Array.from(mcpSkills), tools: Array.from(mcpTools) },
    oasf: { skills: Array.from(oasfSkills), domains: Array.from(oasfDomains) },
  };
}

