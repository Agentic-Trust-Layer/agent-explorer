import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

type IndexerPackageJson = {
  scripts?: Record<string, string>;
};

// Allow piping `--list | head` without crashing on EPIPE.
process.stdout.on('error', (e: any) => {
  if (e && e.code === 'EPIPE') process.exit(0);
});

function parseArgs(argv: string[]): { run?: string; list?: boolean } {
  const out: { run?: string; list?: boolean } = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--list') out.list = true;
    if (a === '--run') {
      const v = argv[i + 1];
      if (v && !v.startsWith('-')) out.run = v;
      i += 1;
    }
  }
  return out;
}

function readIndexerScripts(): string[] {
  const thisFile = fileURLToPath(import.meta.url);
  const pkgPath = pathResolve(path.dirname(thisFile), '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as IndexerPackageJson;
  const scripts = pkg?.scripts ? Object.keys(pkg.scripts) : [];
  const sorted = scripts.sort((a, b) => a.localeCompare(b));
  // Put the original "ingest all" entrypoint first (this runs src/indexer.ts).
  const priority = ['dev:agent'];
  const out: string[] = [];
  for (const p of priority) {
    if (sorted.includes(p)) out.push(p);
  }
  for (const s of sorted) {
    if (out.includes(s)) continue;
    out.push(s);
  }
  return out;
}

function pathResolve(...parts: string[]) {
  return path.resolve(...parts);
}

async function promptPickScript(scripts: string[]): Promise<string | null> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    process.stdout.write('\nAvailable CLIs (apps/indexer):\n');
    scripts.forEach((s, i) => process.stdout.write(`  ${String(i + 1).padStart(2, ' ')}. ${s}\n`));
    process.stdout.write('\nPick by number or script name. Enter = dev:agent. "q" = quit.\n');
    const ans = (await rl.question('> ')).trim();
    if (!ans) return 'dev:agent';
    if (ans.toLowerCase() === 'q') return null;
    const n = Number(ans);
    if (Number.isFinite(n) && n >= 1 && n <= scripts.length) return scripts[n - 1];
    if (scripts.includes(ans)) return ans;
    process.stdout.write(`Unknown choice: "${ans}"\n`);
    return null;
  } finally {
    rl.close();
  }
}

async function runPnpmScript(scriptName: string): Promise<number> {
  const child = spawn('pnpm', ['-s', scriptName], {
    stdio: 'inherit',
    shell: false,
  });
  return await new Promise<number>((resolve) => {
    child.on('close', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  const scripts = readIndexerScripts().filter((s) => s !== 'dev'); // avoid recursion

  if (args.list) {
    scripts.forEach((s) => process.stdout.write(`${s}\n`));
    return;
  }

  const picked = args.run ?? (process.stdout.isTTY ? await promptPickScript(scripts) : 'dev:agent');
  if (!picked) return;

  process.stdout.write(`\nRunning: pnpm -s ${picked}\n\n`);
  process.exitCode = await runPnpmScript(picked);
})().catch((e) => {
  console.error('[dev-indexer-menu] fatal', e);
  process.exitCode = 1;
});

