import path from 'node:path';
import fs from 'node:fs/promises';

import { createHolDbFromEnv } from '../hol/hol-import';
import { exportHolAgentsRdf } from '../rdf/export-hol-rdf';
import { clearStatements, createRepository, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, uploadFileToRepository } from './graphdb-http';

async function listOntologyFiles(): Promise<string[]> {
  const ontologyDir = path.resolve(process.cwd(), '../badge-admin/public/ontology');
  const entries = await fs.readdir(ontologyDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.owl'))
    .map((e) => path.resolve(ontologyDir, e.name))
    .sort((a, b) => a.localeCompare(b));
}

export async function ingestHolOntologiesToGraphdb(opts?: { context?: string | null; resetContext?: boolean; repository?: string }): Promise<void> {
  const baseConfig = getGraphdbConfigFromEnv();
  const repository = opts?.repository || 'holagents';
  const { baseUrl, auth } = baseConfig;
  
  // Create repository if it doesn't exist
  try {
    await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);
  } catch {
    // Repository doesn't exist, create it
    console.info('[graphdb-hol] creating repository', { repository });
    await createRepository(baseUrl, repository, auth);
  }

  const context = opts?.context ?? 'https://www.agentictrust.io/graph/ontology';
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[graphdb-hol] cleared ontology context', { context });
  }

  const files = await listOntologyFiles();
  if (!files.length) {
    console.info('[graphdb-hol] no ontology files found');
    return;
  }

  for (const f of files) {
    const { bytes } = await uploadFileToRepository(baseUrl, repository, auth, { filePath: f, context });
    console.info('[graphdb-hol] uploaded ontology', { file: path.basename(f), bytes, context });
  }
}

export async function ingestHolAgentsRdfToGraphdb(opts?: { context?: string | null; resetContext?: boolean; repository?: string }): Promise<void> {
  const baseConfig = getGraphdbConfigFromEnv();
  const repository = opts?.repository || 'holagents';
  const { baseUrl, auth } = baseConfig;
  
  // Create repository if it doesn't exist
  try {
    await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);
  } catch {
    // Repository doesn't exist, create it
    console.info('[graphdb-hol] creating repository', { repository });
    await createRepository(baseUrl, repository, auth);
  }

  const db = await createHolDbFromEnv();
  const result = await exportHolAgentsRdf(db);

  const context = opts?.context ?? 'https://www.agentictrust.io/graph/data/hol-agents';
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[graphdb-hol] cleared agents context', { context });
  }

  const { bytes } = await uploadFileToRepository(baseUrl, repository, auth, { filePath: result.outPath, context });
  console.info('[graphdb-hol] uploaded hol agents ttl', { file: result.outPath, bytes, agentCount: result.agentCount, context });
}

