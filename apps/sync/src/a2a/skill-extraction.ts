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
  return s.startsWith('https://agentictrust.io/ontology/oasf#skill/') || /^[a-z0-9_]+\/[a-z0-9_]+/i.test(s);
}

export function extractSkillsFromAgentCard(agentCardJson: unknown): string[] {
  const parsed = typeof agentCardJson === 'string' ? safeJsonParse(agentCardJson) : agentCardJson;
  if (!parsed || typeof parsed !== 'object') return [];

  const skills: string[] = [];

  // top-level skills can be strings or objects
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

  // common A2A fields
  skills.push(...parseStringArray((parsed as any).oasf_skills));
  skills.push(...parseStringArray((parsed as any).a2aSkills));

  const unique = Array.from(new Set(skills.map((s) => s.trim()).filter(Boolean)));
  return unique;
}

