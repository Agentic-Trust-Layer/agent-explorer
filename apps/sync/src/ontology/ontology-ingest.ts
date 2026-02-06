import fs from 'node:fs/promises';
import path from 'node:path';

import { clearStatements, ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, uploadTurtleToRepository } from '../graphdb-http.js';

async function listOntologyFiles(): Promise<string[]> {
  // When running from apps/sync, this resolves to apps/ontology/ontology
  const ontologyDir = path.resolve(process.cwd(), '../ontology/ontology');
  const entries = await fs.readdir(ontologyDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.ttl$/i.test(e.name))
    .map((e) => path.resolve(ontologyDir, e.name))
    .sort((a, b) => a.localeCompare(b));
}

export async function ingestOntologiesToGraphdb(opts?: { context?: string | null; resetContext?: boolean }): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const context = opts?.context ?? 'https://www.agentictrust.io/graph/ontology/core';
  if (opts?.resetContext) {
    await clearStatements(baseUrl, repository, auth, { context });
    console.info('[sync][ontologies] cleared ontology context', { context });
  }

  const files = await listOntologyFiles();
  if (!files.length) {
    console.info('[sync][ontologies] no ontology files found');
    return;
  }

  for (const filePath of files) {
    const turtle = await fs.readFile(filePath, 'utf8');
    if (!turtle.trim()) continue;
    const { bytes } = await uploadTurtleToRepository(baseUrl, repository, auth, { turtle, context });
    console.info('[sync][ontologies] uploaded ontology', { file: path.basename(filePath), bytes, context });
  }
}

