import '../env';
import { db } from '../db';
import { exportAllAgentsRdf } from './export-agent-rdf';

async function main(): Promise<void> {
  if (!db) throw new Error('DB not initialized');
  const result = await exportAllAgentsRdf(db);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(String(err?.stack || err?.message || err));
  process.exit(1);
});


