import fs from 'node:fs/promises';
import path from 'node:path';

const CORE_BASE = 'https://agentictrust.io/ontology/core#';
const INTENT_BASE = 'https://agentictrust.io/ontology/core/intent/';
const TASK_BASE = 'https://agentictrust.io/ontology/core/task/';
const MAPPING_BASE = 'https://agentictrust.io/ontology/core/intentTaskMapping/';
const OASF_BASE = 'https://agentictrust.io/ontology/oasf#';

type IntentRecord = {
  id: string;
  label?: string;
  description?: string;
  tasks?: string[];
};

type TaskRecord = {
  id: string;
  label?: string;
  description?: string;
};

type MappingRecord = {
  intentId: string;
  taskId: string;
  requiredSkills?: string[];
  optionalSkills?: string[];
};

type IntentTaskFile = {
  intents: IntentRecord[];
  tasks: TaskRecord[];
  mappings: MappingRecord[];
};

function encodeSegment(value: string): string {
  return encodeURIComponent(value);
}

function intentIri(intentId: string): string {
  return `<${INTENT_BASE}${encodeSegment(intentId)}>`;
}

function taskIri(taskId: string): string {
  return `<${TASK_BASE}${encodeSegment(taskId)}>`;
}

function mappingIri(intentId: string, taskId: string): string {
  return `<${MAPPING_BASE}${encodeSegment(intentId)}:${encodeSegment(taskId)}>`;
}

function skillIri(skillId: string): string {
  const trimmed = skillId.trim();
  if (!trimmed) return `<${OASF_BASE}skill/unknown>`;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return `<${trimmed}>`;
  }
  if (trimmed.startsWith('oasf:')) {
    const tail = trimmed.slice('oasf:'.length).replace(/^skill\//, '');
    return `<${OASF_BASE}skill/${tail}>`;
  }
  return `<${OASF_BASE}skill/${trimmed}>`;
}

function ttlEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

async function loadIntentTaskFile(filePath?: string): Promise<IntentTaskFile> {
  const resolved = filePath
    ? path.resolve(filePath)
    : path.resolve(process.cwd(), '../ontology/data/intent-task-mappings.json');
  const text = await fs.readFile(resolved, 'utf8');
  const parsed = JSON.parse(text) as IntentTaskFile;
  return {
    intents: Array.isArray(parsed.intents) ? parsed.intents : [],
    tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
    mappings: Array.isArray(parsed.mappings) ? parsed.mappings : [],
  };
}

export async function exportIntentTaskTtl(outPath?: string): Promise<{
  outPath: string;
  intentCount: number;
  taskCount: number;
  mappingCount: number;
}> {
  const data = await loadIntentTaskFile();
  const out = outPath
    ? path.resolve(outPath)
    : path.resolve(process.cwd(), '../ontology/dist/intent-task-mappings.ttl');

  const lines: string[] = [];
  lines.push(`@base <${CORE_BASE}> .`);
  lines.push(`@prefix core: <${CORE_BASE}> .`);
  lines.push(`@prefix oasf: <${OASF_BASE}> .`);
  lines.push('@prefix owl: <http://www.w3.org/2002/07/owl#> .');
  lines.push('@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .');
  lines.push('@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .');
  lines.push('');
  lines.push('core:IntentTaskMappingsOntology a owl:Ontology ;');
  lines.push('  rdfs:label "Intent Task Mappings" ;');
  lines.push('  owl:versionInfo "0.1.0" .');
  lines.push('');

  for (const intent of data.intents) {
    const iri = intentIri(intent.id);
    lines.push(`${iri} a core:IntentType ;`);
    if (intent.label) lines.push(`  rdfs:label "${ttlEscape(intent.label)}" ;`);
    if (intent.description) lines.push(`  rdfs:comment "${ttlEscape(intent.description)}" ;`);
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/;$/, '')} .`;
    lines.push('');
  }

  for (const task of data.tasks) {
    const iri = taskIri(task.id);
    lines.push(`${iri} a core:TaskType ;`);
    if (task.label) lines.push(`  rdfs:label "${ttlEscape(task.label)}" ;`);
    if (task.description) lines.push(`  rdfs:comment "${ttlEscape(task.description)}" ;`);
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/;$/, '')} .`;
    lines.push('');
  }

  for (const mapping of data.mappings) {
    const mIri = mappingIri(mapping.intentId, mapping.taskId);
    const iIri = intentIri(mapping.intentId);
    const tIri = taskIri(mapping.taskId);
    lines.push(`${mIri} a core:IntentTaskMapping ;`);
    lines.push(`  core:mapsIntentType ${iIri} ;`);
    lines.push(`  core:mapsTaskType ${tIri} ;`);
    const required = (mapping.requiredSkills ?? []).filter((s) => typeof s === 'string' && s.trim());
    const optional = (mapping.optionalSkills ?? []).filter((s) => typeof s === 'string' && s.trim());
    for (const s of required) lines.push(`  core:requiresSkill ${skillIri(s)} ;`);
    for (const s of optional) lines.push(`  core:mayUseSkill ${skillIri(s)} ;`);
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/;$/, '')} .`;
    lines.push('');
    lines.push(`${iIri} core:intentTypeToTaskType ${tIri} .`);
    lines.push('');
  }

  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, `${lines.join('\n')}\n`, 'utf8');
  return {
    outPath: out,
    intentCount: data.intents.length,
    taskCount: data.tasks.length,
    mappingCount: data.mappings.length,
  };
}
