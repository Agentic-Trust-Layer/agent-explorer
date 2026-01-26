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
    const cleaned: string[] = [];
    for (const entry of value) {
      if (typeof entry === 'string') {
        const trimmed = entry.trim();
        if (trimmed.length > 0) {
          cleaned.push(trimmed);
        }
      }
    }
    return cleaned;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parseStringArray(parsed);
      }
    } catch {
      // Not JSON - treat as comma separated
      return trimmed
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }
  }
  return [];
}

function takeObjectArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value as Record<string, unknown>);
  return [];
}

const OASF_SKILL_BASE = 'https://agentictrust.io/ontology/oasf#skill/';

function isOasfSkill(skill: string): boolean {
  const trimmed = skill.trim();
  return trimmed.startsWith(OASF_SKILL_BASE);
}

function extractSkillsFromRawJson(rawJson: unknown): string[] {
  const parsed = safeJsonParse(rawJson);
  if (!parsed || typeof parsed !== 'object') return [];

  const skills: string[] = [];

  // Extract from endpoints[].a2aSkills
  const endpoints = takeObjectArray((parsed as any).endpoints);
  for (const endpoint of endpoints) {
    if (!endpoint || typeof endpoint !== 'object') continue;
    const a2aSkills = parseStringArray((endpoint as any).a2aSkills);
    skills.push(...a2aSkills);
    // Also check for generic "skills" in endpoint
    const endpointSkills = parseStringArray((endpoint as any).skills);
    skills.push(...endpointSkills);
  }

  // Extract from top-level skills array
  const topLevelSkills = parseStringArray((parsed as any).skills);
  skills.push(...topLevelSkills);

  // Extract from top-level a2aSkills array
  const topLevelA2aSkills = parseStringArray((parsed as any).a2aSkills);
  skills.push(...topLevelA2aSkills);

  // Extract from metadata.skills or metadata.a2aSkills
  const metadata = (parsed as any).metadata;
  if (metadata && typeof metadata === 'object') {
    const metadataSkills = parseStringArray(metadata.skills);
    skills.push(...metadataSkills);
    const metadataA2aSkills = parseStringArray(metadata.a2aSkills);
    skills.push(...metadataA2aSkills);
  }

  return skills.filter((s) => s && s.trim().length > 0);
}

function extractSkillsFromAgentCard(agentCardJson: unknown): string[] {
  const parsed = safeJsonParse(agentCardJson);
  if (!parsed || typeof parsed !== 'object') return [];

  const skills: string[] = [];

  // Extract from top-level skills array
  const list = Array.isArray((parsed as any).skills) ? (parsed as any).skills : [];
  for (const entry of list) {
    if (typeof entry === 'string') {
      const trimmed = entry.trim();
      if (trimmed) skills.push(trimmed);
      continue;
    }
    if (entry && typeof entry === 'object') {
      const id = typeof (entry as any).id === 'string' ? (entry as any).id.trim() : '';
      const name = typeof (entry as any).name === 'string' ? (entry as any).name.trim() : '';
      if (id) skills.push(id);
      else if (name) skills.push(name);
    }
  }

  // Extract from capabilities.extensions[].params.skills (OASF skills)
  const extensions = Array.isArray((parsed as any).capabilities?.extensions)
    ? (parsed as any).capabilities.extensions
    : [];
  for (const ext of extensions) {
    if (!ext || typeof ext !== 'object') continue;
    const params = (ext as any).params;
    if (!params || typeof params !== 'object') continue;
    const extSkills = parseStringArray((params as any).skills);
    skills.push(...extSkills);
  }

  // Extract from top-level oasf_skills array
  const oasfSkills = parseStringArray((parsed as any).oasf_skills);
  skills.push(...oasfSkills);

  return skills.filter((s) => s && s.trim().length > 0);
}

export function extractAllSkills(rawJson: unknown, agentCardJson: unknown): string[] {
  const skillsFromRaw = extractSkillsFromRawJson(rawJson);
  const skillsFromCard = extractSkillsFromAgentCard(agentCardJson);
  const allSkills = [...skillsFromRaw, ...skillsFromCard];

  // Deduplicate
  const unique = Array.from(new Set(allSkills.map((s) => s.trim()).filter((s) => s.length > 0)));
  return unique;
}

export function isOasfSkillId(skill: string): boolean {
  return isOasfSkill(skill);
}
