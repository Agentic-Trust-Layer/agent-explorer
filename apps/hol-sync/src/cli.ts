import './env-load.js';
import { readHolAgentsFromD1 } from './db/read-agents.js';
import { emitHolAgentsTurtle } from './rdf/emit-hol-agents.js';
import { ingestHolTurtleToGraphdb } from './graphdb/ingest.js';

type SyncCommand = 'agents' | 'all';

async function syncHolAgents() {
  console.info('[hol-sync] fetching HOL agents from D1 database');
  const agents = await readHolAgentsFromD1();
  console.info(`[hol-sync] fetched ${agents.length} HOL agents from D1`);

  if (agents.length === 0) {
    console.info('[hol-sync] no agents to sync');
    return;
  }

  console.info('[hol-sync] emitting RDF Turtle');
  const turtle = emitHolAgentsTurtle(agents);
  const turtleBytes = new TextEncoder().encode(turtle).length;
  console.info(`[hol-sync] generated ${turtleBytes} bytes of RDF Turtle`);

  console.info('[hol-sync] ingesting to GraphDB');
  await ingestHolTurtleToGraphdb(turtle);
  console.info('[hol-sync] HOL agents sync complete', { agentsCount: agents.length });
}

async function runSync(command: SyncCommand) {
  try {
    switch (command) {
      case 'agents':
        await syncHolAgents();
        break;
      case 'all':
        await syncHolAgents();
        break;
      default:
        console.error(`[hol-sync] unknown command: ${command}`);
        process.exitCode = 1;
        return;
    }
  } catch (error) {
    console.error(`[hol-sync] error:`, error);
    process.exitCode = 1;
  }
}

const command = (process.argv[2] || 'all') as SyncCommand;

runSync(command).catch((error) => {
  console.error('[hol-sync] fatal error:', error);
  process.exitCode = 1;
});
