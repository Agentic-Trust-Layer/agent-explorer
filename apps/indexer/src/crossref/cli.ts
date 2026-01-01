import '../env';
import { runHolAgentverseCrossref } from './hol-agentverse';

function hasEnv(name: string): boolean {
  const v = process.env[name];
  return typeof v === 'string' && v.trim().length > 0;
}

function envCheck(): void {
  const required = [
    'HOL_CLOUDFLARE_ACCOUNT_ID',
    'HOL_CLOUDFLARE_D1_DATABASE_ID',
    'HOL_CLOUDFLARE_API_TOKEN',
    'AGENTVERSE_CLOUDFLARE_ACCOUNT_ID',
    'AGENTVERSE_CLOUDFLARE_D1_DATABASE_ID',
    'AGENTVERSE_CLOUDFLARE_API_TOKEN',
  ] as const;

  const ok = Object.fromEntries(required.map((k) => [k, hasEnv(k)]));
  console.log('[crossref] env-check', ok);
}

function usage(): void {
  console.log('Usage: pnpm --filter erc8004-indexer crossref [hol-agentverse]');
}

(async () => {
  const mode = process.argv[2] || 'hol-agentverse';
  if (mode !== 'hol-agentverse') {
    usage();
    process.exitCode = 1;
    return;
  }

  envCheck();
  await runHolAgentverseCrossref();
})().catch((e) => {
  console.error('[crossref] failed', e);
  process.exitCode = 1;
});


