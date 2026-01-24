import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_REPO = 'Agentic-Trust-Layer/oasf';
const DEFAULT_REF = 'main';
const OASF_BASE = 'https://agentictrust.io/ontology/oasf#';

type OasfEntity = {
  key: string;
  name: string;
  caption?: string;
  description?: string;
  category?: string;
  extends?: string;
  uid?: number;
  attributes?: Record<string, unknown>;
};

type GitTreeItem = { path: string; type: string; sha: string; url: string };

function getRepoConfig() {
  const repo = (process.env.OASF_REPO || DEFAULT_REPO).trim();
  const ref = (process.env.OASF_REF || DEFAULT_REF).trim();
  const token = (process.env.GITHUB_TOKEN || '').trim();
  return { repo, ref, token };
}

function ttlEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function iriForSkill(key: string): string {
  return `<${OASF_BASE}skill/${key}>`;
}

function iriForDomain(key: string): string {
  return `<${OASF_BASE}domain/${key}>`;
}

async function fetchJson(url: string, token?: string): Promise<any> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'agent-explorer',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OASF fetch failed ${res.status} ${url}: ${text || res.statusText}`);
  }
  return res.json();
}

async function fetchRawJson<T>(repo: string, ref: string, filePath: string, token?: string): Promise<T> {
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/${filePath}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'agent-explorer',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OASF raw fetch failed ${res.status} ${url}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

async function fetchTree(repo: string, ref: string, token?: string): Promise<GitTreeItem[]> {
  const url = `https://api.github.com/repos/${repo}/git/trees/${ref}?recursive=1`;
  const data = await fetchJson(url, token);
  return Array.isArray(data?.tree) ? (data.tree as GitTreeItem[]) : [];
}

function normalizeKey(pathParts: string[]): string {
  return pathParts.join('/');
}

function parseEntityFromJson(key: string, json: Record<string, any>): OasfEntity {
  return {
    key,
    name: String(json?.name || key.split('/').pop() || key),
    caption: typeof json?.caption === 'string' ? json.caption : undefined,
    description: typeof json?.description === 'string' ? json.description : undefined,
    category: typeof json?.category === 'string' ? json.category : undefined,
    extends: typeof json?.extends === 'string' ? json.extends : undefined,
    uid: typeof json?.uid === 'number' ? json.uid : undefined,
    attributes: json?.attributes && typeof json.attributes === 'object' ? json.attributes : undefined,
  };
}

function buildNameIndex(items: OasfEntity[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const item of items) {
    if (!map.has(item.name)) {
      map.set(item.name, item.key);
    }
  }
  return map;
}

function writeEntityLines(lines: string[], entity: OasfEntity, type: 'skill' | 'domain', nameIndex: Map<string, string>) {
  const iri = type === 'skill' ? iriForSkill(entity.key) : iriForDomain(entity.key);
  lines.push(`${iri} a oasf:${type === 'skill' ? 'Skill' : 'Domain'} ;`);
  lines.push(`  oasf:key "${ttlEscape(entity.key)}" ;`);
  lines.push(`  oasf:name "${ttlEscape(entity.name)}" ;`);
  if (entity.caption) lines.push(`  oasf:caption "${ttlEscape(entity.caption)}" ;`);
  if (entity.description) lines.push(`  oasf:description "${ttlEscape(entity.description)}" ;`);
  if (entity.category) lines.push(`  oasf:category "${ttlEscape(entity.category)}" ;`);
  if (typeof entity.uid === 'number') lines.push(`  oasf:uid "${entity.uid}"^^xsd:integer ;`);
  if (entity.extends) {
    const targetKey = nameIndex.get(entity.extends);
    if (targetKey) {
      const targetIri = type === 'skill' ? iriForSkill(targetKey) : iriForDomain(targetKey);
      lines.push(`  oasf:extends ${targetIri} ;`);
    } else {
      lines.push(`  oasf:extends "${ttlEscape(entity.extends)}" ;`);
    }
  }
  lines[lines.length - 1] = `${lines[lines.length - 1].replace(/;$/, '')} .`;
  lines.push('');
}

export async function exportOasfTtl(outPath?: string): Promise<{
  outPath: string;
  skillCount: number;
  domainCount: number;
}> {
  const { repo, ref, token } = getRepoConfig();
  const tree = await fetchTree(repo, ref, token);

  const skillFiles = tree.filter(
    (item) =>
      item.type === 'blob' &&
      item.path.startsWith('schema/skills/') &&
      item.path.endsWith('.json') &&
      !item.path.endsWith('main_skills.json') &&
      !item.path.endsWith('skill_categories.json'),
  );

  const domainFiles = tree.filter(
    (item) =>
      item.type === 'blob' &&
      item.path.startsWith('schema/domains/') &&
      item.path.endsWith('.json') &&
      !item.path.endsWith('domain_categories.json'),
  );

  const skills: OasfEntity[] = [];
  for (const item of skillFiles) {
    const key = normalizeKey(item.path.replace('schema/skills/', '').replace('.json', '').split('/'));
    const json = await fetchRawJson<Record<string, any>>(repo, ref, item.path, token);
    skills.push(parseEntityFromJson(key, json));
  }

  const domains: OasfEntity[] = [];
  for (const item of domainFiles) {
    const key = normalizeKey(item.path.replace('schema/domains/', '').replace('.json', '').split('/'));
    const json = await fetchRawJson<Record<string, any>>(repo, ref, item.path, token);
    domains.push(parseEntityFromJson(key, json));
  }

  const skillNameIndex = buildNameIndex(skills);
  const domainNameIndex = buildNameIndex(domains);

  const lines: string[] = [];
  lines.push(`@base <${OASF_BASE}> .`);
  lines.push(`@prefix oasf: <${OASF_BASE}> .`);
  lines.push('@prefix owl: <http://www.w3.org/2002/07/owl#> .');
  lines.push('@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .');
  lines.push('@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .');
  lines.push('');
  lines.push('oasf:Ontology a owl:Ontology ;');
  lines.push('  rdfs:label "OASF Skills and Domains" ;');
  lines.push('  owl:versionInfo "0.1.0" .');
  lines.push('');

  for (const skill of skills) {
    writeEntityLines(lines, skill, 'skill', skillNameIndex);
  }
  for (const domain of domains) {
    writeEntityLines(lines, domain, 'domain', domainNameIndex);
  }

  const out = outPath
    ? path.resolve(outPath)
    : path.resolve(process.cwd(), '../ontology/dist/oasf-skills-domains.ttl');
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, `${lines.join('\n')}\n`, 'utf8');
  return { outPath: out, skillCount: skills.length, domainCount: domains.length };
}
