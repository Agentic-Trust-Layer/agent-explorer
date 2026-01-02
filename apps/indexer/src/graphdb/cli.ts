import { createRepository, getGraphdbConfigFromEnv, listRepositories } from './graphdb-http';

function usage(): never {
  console.error(
    [
      'Usage:',
      '  tsx src/graphdb/cli.ts repos',
      '  tsx src/graphdb/cli.ts create-repo [--force]',
      '  tsx src/graphdb/cli.ts ingest [all|agents|ontologies] [--reset]',
      '  tsx src/graphdb/cli.ts ingest-hol [all|agents|ontologies] [--reset]',
      '',
      'Env:',
      '  GRAPHDB_BASE_URL=http://localhost:7200',
      '  GRAPHDB_REPOSITORY=agentictrust (or holagents for HOL)',
      '  GRAPHDB_USERNAME=... (optional)',
      '  GRAPHDB_PASSWORD=... (optional)',
      '  GRAPHDB_RULESET=owl-horst-optimized (optional)',
      '',
      'Flags:',
      '  --reset   Clears the target context before loading (safe for local dev)',
      '  --force   Re-create repository if it already exists (delete+create)',
      '',
    ].join('\n'),
  );
  process.exit(2);
}

function hasFlag(name: string): boolean {
  return process.argv.slice(2).includes(name);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd) usage();

  if (cmd === 'repos') {
    const { baseUrl, auth } = getGraphdbConfigFromEnv();
    const repos = await listRepositories(baseUrl, auth);
    console.log(JSON.stringify({ baseUrl, repos }, null, 2));
    return;
  }

  if (cmd === 'create-repo') {
    const force = hasFlag('--force');
    const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
    await createRepository(baseUrl, repository, auth, { force });
    console.log(JSON.stringify({ baseUrl, created: repository }, null, 2));
    return;
  }

  if (cmd === 'ingest') {
    const target = args[1] ?? 'all';
    const reset = hasFlag('--reset');

    // Import lazily so "repos" and "create-repo" don't require indexer DB env vars.
    const mod = await import('./ingest');

    if (target === 'agents') {
      await mod.ingestAgentsRdfToGraphdb({ resetContext: reset });
      return;
    }
    if (target === 'ontologies') {
      await mod.ingestOntologiesToGraphdb({ resetContext: reset });
      return;
    }
    if (target === 'all') {
      await mod.ingestOntologiesToGraphdb({ resetContext: reset });
      await mod.ingestAgentsRdfToGraphdb({ resetContext: reset });
      return;
    }

    usage();
  }

  if (cmd === 'ingest-hol') {
    const target = args[1] ?? 'all';
    const reset = hasFlag('--reset');

    // Import lazily so "repos" and "create-repo" don't require HOL DB env vars.
    const mod = await import('./hol-ingest');

    if (target === 'agents') {
      await mod.ingestHolAgentsRdfToGraphdb({ resetContext: reset, repository: 'holagents' });
      return;
    }
    if (target === 'ontologies') {
      await mod.ingestHolOntologiesToGraphdb({ resetContext: reset, repository: 'holagents' });
      return;
    }
    if (target === 'all') {
      await mod.ingestHolOntologiesToGraphdb({ resetContext: reset, repository: 'holagents' });
      await mod.ingestHolAgentsRdfToGraphdb({ resetContext: reset, repository: 'holagents' });
      return;
    }

    usage();
  }

  usage();
}

main().catch((err) => {
  console.error(String(err?.stack || err?.message || err));
  process.exit(1);
});


