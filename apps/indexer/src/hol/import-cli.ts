import '../env';
import { importHolAgentsFromEnv } from './hol-import';

function parseBool(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

function parseNum(value: string | undefined): number | undefined {
  if (!value || !value.trim()) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

(async () => {
  console.log('[hol-import] env-check', {
    hasAccountId: Boolean(process.env.HOL_CLOUDFLARE_ACCOUNT_ID),
    hasDatabaseId: Boolean(process.env.HOL_CLOUDFLARE_D1_DATABASE_ID),
    hasApiToken: Boolean(process.env.HOL_CLOUDFLARE_API_TOKEN),
  });
  const result = await importHolAgentsFromEnv({
    holBaseUrl: process.env.HOL_BASE_URL,
    pageSize: parseNum(process.env.HOL_PAGE_SIZE),
    maxPages: parseNum(process.env.HOL_MAX_PAGES),
    chainId: parseNum(process.env.HOL_CHAIN_ID),
    registry: process.env.HOL_REGISTRY,
    registries: process.env.HOL_REGISTRIES
      ? process.env.HOL_REGISTRIES.split(',').map((x) => x.trim()).filter(Boolean)
      : undefined,
    capability: process.env.HOL_CAPABILITY,
    trust: process.env.HOL_TRUST,
    q: process.env.HOL_QUERY,
  });
  console.log('[hol-import] complete', result);
})().catch((e) => {
  console.error('[hol-import] failed', e);
  process.exitCode = 1;
});


