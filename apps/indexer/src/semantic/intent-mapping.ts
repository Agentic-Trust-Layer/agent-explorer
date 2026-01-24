import fs from 'node:fs/promises';
import path from 'node:path';
import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb/graphdb-http';

type IntentRequirement = {
  requiredSkills: string[];
  label?: string;
  description?: string;
};

type IntentCacheEntry = IntentRequirement & { cachedAt: number };

const CORE_INTENT_BASE = 'https://agentictrust.io/ontology/core/intent/';
const OASF_SKILL_BASE = 'https://agentictrust.io/ontology/oasf#skill/';
const DEFAULT_CACHE_MS = 5 * 60_000;
const intentCache = new Map<string, IntentCacheEntry>();

function humanizeIntentType(intentType: string): string {
  const tail = intentType.split('.').pop() || intentType;
  return tail
    .split('_')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function intentIri(intentType: string): string {
  return `${CORE_INTENT_BASE}${encodeURIComponent(intentType)}`;
}

function skillKeyFromIri(iri: string): string | null {
  if (iri.startsWith(OASF_SKILL_BASE)) {
    return iri.slice(OASF_SKILL_BASE.length);
  }
  return null;
}

async function loadIntentFile(): Promise<Record<string, IntentRequirement>> {
  const filePath = path.resolve(process.cwd(), '../ontology/data/intent-task-mappings.json');
  const text = await fs.readFile(filePath, 'utf8');
  const json = JSON.parse(text) as {
    intents?: Array<{ id: string; label?: string; description?: string; tasks?: string[] }>;
    mappings?: Array<{ intentId: string; taskId: string; requiredSkills?: string[] }>;
  };
  const out: Record<string, IntentRequirement> = {};
  const mappingsByIntent = new Map<string, string[]>();
  for (const mapping of json.mappings ?? []) {
    const list = mappingsByIntent.get(mapping.intentId) ?? [];
    list.push(...(mapping.requiredSkills ?? []));
    mappingsByIntent.set(mapping.intentId, list);
  }
  for (const intent of json.intents ?? []) {
    out[intent.id] = {
      requiredSkills: mappingsByIntent.get(intent.id) ?? [],
      label: intent.label,
      description: intent.description,
    };
  }
  return out;
}

export async function resolveIntentRequirements(intentType?: string | null): Promise<IntentRequirement> {
  if (!intentType) return { requiredSkills: [] };
  const cacheMs = Number(process.env.INTENT_REQUIREMENTS_CACHE_MS || DEFAULT_CACHE_MS);
  const cached = intentCache.get(intentType);
  if (cached && Date.now() - cached.cachedAt < cacheMs) {
    return cached;
  }

  try {
    const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
    const intent = intentIri(intentType);
    const sparql = [
      'PREFIX core: <https://agentictrust.io/ontology/core#>',
      'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
      'SELECT ?label ?description ?skill WHERE {',
      `  BIND(<${intent}> AS ?intent)`,
      '  OPTIONAL { ?intent rdfs:label ?label }',
      '  OPTIONAL { ?intent rdfs:comment ?description }',
      '  OPTIONAL {',
      '    ?mapping a core:IntentTaskMapping ;',
      '      core:mapsIntentType ?intent ;',
      '      core:requiresSkill ?skill .',
      '  }',
      '}',
    ].join('\n');
    const result = await queryGraphdb(baseUrl, repository, auth, sparql);
    const bindings = Array.isArray(result?.results?.bindings) ? result.results.bindings : [];
    const skills = new Set<string>();
    let label: string | undefined;
    let description: string | undefined;
    for (const row of bindings) {
      if (!label && row.label?.value) label = String(row.label.value);
      if (!description && row.description?.value) description = String(row.description.value);
      if (row.skill?.value) {
        const key = skillKeyFromIri(String(row.skill.value));
        if (key) skills.add(key);
      }
    }
    const resolved = {
      requiredSkills: Array.from(skills),
      label: label ?? humanizeIntentType(intentType),
      description,
    };
    intentCache.set(intentType, { ...resolved, cachedAt: Date.now() });
    return resolved;
  } catch (err) {
    try {
      const fileData = await loadIntentFile();
      const fallback = fileData[intentType] ?? { requiredSkills: [] };
      const resolved = {
        requiredSkills: fallback.requiredSkills ?? [],
        label: fallback.label ?? humanizeIntentType(intentType),
        description: fallback.description,
      };
      intentCache.set(intentType, { ...resolved, cachedAt: Date.now() });
      return resolved;
    } catch {
      return { requiredSkills: [], label: humanizeIntentType(intentType) };
    }
  }
}

export function buildIntentQueryText(args: {
  intentType?: string | null;
  intentQuery?: string | null;
  label?: string;
  description?: string;
}): string {
  const { intentType, intentQuery, label, description } = args;
  const parts: string[] = [];
  if (intentType) {
    if (label) parts.push(label);
    if (description) parts.push(description);
  }
  if (intentQuery && intentQuery.trim()) {
    parts.push(intentQuery.trim());
  }
  return parts.filter(Boolean).join('. ');
}
