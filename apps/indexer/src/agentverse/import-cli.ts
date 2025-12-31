import '../env';
import { importAgentverseAgentsFromEnv } from './import';

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
  console.log('[agentverse-import] env-check', {
    hasAccountId: Boolean(process.env.AGENTVERSE_CLOUDFLARE_ACCOUNT_ID),
    hasDatabaseId: Boolean(process.env.AGENTVERSE_CLOUDFLARE_D1_DATABASE_ID),
    hasApiToken: Boolean(process.env.AGENTVERSE_CLOUDFLARE_API_TOKEN),
    hasJwt: Boolean(process.env.AGENTVERSE_JWT),
  });
  const result = await importAgentverseAgentsFromEnv({
    holBaseUrl: process.env.HOL_BASE_URL,
    pageSize: parseNum(process.env.AGENTVERSE_PAGE_SIZE),
    maxPages: parseNum(process.env.AGENTVERSE_MAX_PAGES),
    chainId: parseNum(process.env.AGENTVERSE_CHAIN_ID),
    resume: process.env.AGENTVERSE_RESUME !== '0',
    reset: parseBool(process.env.AGENTVERSE_RESET),
    availableOnly: process.env.AGENTVERSE_AVAILABLE_ONLY !== '0',
    logEach: parseBool(process.env.AGENTVERSE_LOG_EACH),
  });
  console.log('[agentverse-import] complete', result);
})().catch((e) => {
  console.error('[agentverse-import] failed', e);
  process.exitCode = 1;
});


