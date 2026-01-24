import path from 'node:path';
import fs from 'node:fs/promises';

import { db, ensureSchemaInitialized } from '../db';
import { exportAllAgentsRdf } from '../rdf/export-agent-rdf';
import { clearStatements, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, uploadFileToRepository } from './graphdb-http';
import { exportOasfTtl } from './oasf-export';
import { exportIntentTaskTtl } from './intent-task-export';

async function listOntologyFiles(): Promise<string[]> {
  const ontologyDir = path.resolve(process.cwd(), '../badge-admin/public/ontology');
  const entries = await fs.readdir(ontologyDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.owl'))
    .map((e) => path.resolve(ontologyDir, e.name))
    .sort((a, b) => a.localeCompare(b));
}

export async function ingestOntologiesToGraphdb(opts?: { context?: string | null; resetContext?: boolean }): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const context = opts?.context ?? 'https://www.agentictrust.io/graph/ontology/core';
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[graphdb] cleared ontology context', { context });
  }

  const files = await listOntologyFiles();
  if (!files.length) {
    console.info('[graphdb] no ontology files found');
    return;
  }

  for (const f of files) {
    const { bytes } = await uploadFileToRepository(baseUrl, repository, auth, { filePath: f, context });
    console.info('[graphdb] uploaded ontology', { file: path.basename(f), bytes, context });
  }
}

export async function ingestOasfToGraphdb(opts?: { context?: string | null; resetContext?: boolean }): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const context = opts?.context ?? 'https://www.agentictrust.io/graph/ontology/core';
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[graphdb] cleared oasf context', { context });
  }

  const { outPath, skillCount, domainCount } = await exportOasfTtl();
  const { bytes } = await uploadFileToRepository(baseUrl, repository, auth, { filePath: outPath, context });
  console.info('[graphdb] uploaded oasf ttl', { file: path.basename(outPath), bytes, skillCount, domainCount, context });
}

export async function ingestIntentTaskMappingsToGraphdb(opts?: { context?: string | null; resetContext?: boolean }): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const context = opts?.context ?? 'https://www.agentictrust.io/graph/ontology/core';
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[graphdb] cleared intent/task context', { context });
  }

  const { outPath, intentCount, taskCount, mappingCount } = await exportIntentTaskTtl();
  const { bytes } = await uploadFileToRepository(baseUrl, repository, auth, { filePath: outPath, context });
  console.info('[graphdb] uploaded intent/task ttl', {
    file: path.basename(outPath),
    bytes,
    intentCount,
    taskCount,
    mappingCount,
    context,
  });
}

export async function ingestAgentsRdfToGraphdb(opts?: { context?: string | null; resetContext?: boolean }): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  await ensureSchemaInitialized();
  const result = await exportAllAgentsRdf(db);

  const context = opts?.context ?? 'https://www.agentictrust.io/graph/data/agents';
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[graphdb] cleared agents context', { context });
  }

  const { bytes } = await uploadFileToRepository(baseUrl, repository, auth, { filePath: result.outPath, context });
  console.info('[graphdb] uploaded agents ttl', { file: result.outPath, bytes, agentCount: result.agentCount, context });
}


