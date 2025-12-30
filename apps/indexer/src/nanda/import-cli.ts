import '../env';
import { importNandaAgentsFromEnv } from './nanda-import';

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
  const mode = (process.env.NANDA_IMPORT_MODE as any) || undefined;
  const result = await importNandaAgentsFromEnv({
    nandaBaseUrl: process.env.NANDA_BASE_URL,
    pageSize: parseNum(process.env.NANDA_PAGE_SIZE),
    maxPages: parseNum(process.env.NANDA_MAX_PAGES),
    search: process.env.NANDA_SEARCH,
    query: process.env.NANDA_QUERY,
    // NANDA_TYPE is only for discovery_search mode; servers mode uses NANDA_SERVER_TYPES.
    type: mode === 'servers' ? undefined : process.env.NANDA_TYPE,
    serverTypes: mode === 'servers' ? process.env.NANDA_SERVER_TYPES : undefined,
    tags: process.env.NANDA_TAGS,
    verified: process.env.NANDA_VERIFIED ? parseBool(process.env.NANDA_VERIFIED) : undefined,
    mode,
    includeDetails: parseBool(process.env.NANDA_INCLUDE_DETAILS),
    chainId: parseNum(process.env.NANDA_CHAIN_ID),
  });
  console.log('[nanda-import] complete', result);
})().catch((e) => {
  console.error('[nanda-import] failed', e);
  process.exitCode = 1;
});


