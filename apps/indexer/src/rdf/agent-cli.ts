import '../env';
import { db } from '../db';
import { exportOneAgentRdf } from './export-agent-rdf';

function usage(): never {
  console.error('Usage: tsx src/rdf/agent-cli.ts <chainId> <agentId> [--stdout]');
  process.exit(2);
}

function hasFlag(name: string): boolean {
  return process.argv.slice(2).includes(name);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((a) => a !== '--stdout');
  const chainIdRaw = args[0];
  const agentId = args[1];
  if (!chainIdRaw || !agentId) usage();

  const chainId = Number(chainIdRaw);
  if (!Number.isFinite(chainId) || chainId <= 0) usage();
  if (!db) throw new Error('DB not initialized');

  const result = await exportOneAgentRdf(db, chainId, String(agentId));
  if (hasFlag('--stdout')) {
    const fs = await import('node:fs/promises');
    const ttl = await fs.readFile(result.outPath, 'utf8');
    process.stdout.write(ttl);
    return;
  }
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(String(err?.stack || err?.message || err));
  process.exit(1);
});


