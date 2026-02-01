type D1Config = {
  accountId: string;
  databaseId: string;
  apiToken: string;
};

function envString(key: string): string {
  const v = (globalThis as any)?.process?.env?.[key];
  return typeof v === 'string' ? v.trim() : '';
}

export function getD1ConfigFromEnv(): D1Config | null {
  const accountId = envString('CLOUDFLARE_ACCOUNT_ID');
  const databaseId = envString('CLOUDFLARE_D1_DATABASE_ID');
  const apiToken = envString('CLOUDFLARE_API_TOKEN');
  if (!accountId || !databaseId || !apiToken) return null;
  return { accountId, databaseId, apiToken };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function d1FetchJson(
  config: D1Config,
  body: any,
  opts?: { timeoutMs?: number; retries?: number },
): Promise<any> {
  const timeoutMs = Number.isFinite(Number(opts?.timeoutMs)) && Number(opts?.timeoutMs) > 0 ? Number(opts?.timeoutMs) : 20_000;
  const retries = Number.isFinite(Number(opts?.retries)) && Number(opts?.retries) >= 0 ? Math.trunc(Number(opts?.retries)) : 2;
  const retryOnStatuses = new Set([429, 500, 502, 503, 504, 522, 524]);

  const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => {
      try {
        controller.abort();
      } catch {}
    }, timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      } as any);

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        if (retryOnStatuses.has(res.status) && attempt < retries) {
          await sleep(Math.min(20_000, 750 * Math.pow(2, attempt)));
          continue;
        }
        throw new Error(`D1 HTTP ${res.status}${text ? `: ${text.slice(0, 500)}` : ''}`);
      }

      return await res.json().catch(() => null);
    } catch (e: any) {
      const name = String(e?.name || '');
      if (attempt < retries && (name === 'AbortError' || String(e?.message || '').toLowerCase().includes('fetch failed'))) {
        await sleep(Math.min(20_000, 750 * Math.pow(2, attempt)));
        continue;
      }
      throw e;
    } finally {
      clearTimeout(t);
    }
  }
  throw new Error('d1FetchJson: exhausted retries');
}

export async function d1Exec(sql: string, params: any[] = [], opts?: { timeoutMs?: number; retries?: number }): Promise<void> {
  const cfg = getD1ConfigFromEnv();
  if (!cfg) throw new Error('D1 not configured (missing CLOUDFLARE_* env vars)');
  const data = await d1FetchJson(cfg, { sql, params: Array.isArray(params) ? params : [] }, opts);
  if (!data || data.success === false) {
    const err = data?.errors?.[0]?.message || data?.error || JSON.stringify(data);
    throw new Error(`D1 exec failed: ${String(err).slice(0, 500)}`);
  }
}

export async function d1Query<T = any>(
  sql: string,
  params: any[] = [],
  opts?: { timeoutMs?: number; retries?: number },
): Promise<T[]> {
  const cfg = getD1ConfigFromEnv();
  if (!cfg) throw new Error('D1 not configured (missing CLOUDFLARE_* env vars)');
  const data = await d1FetchJson(cfg, { sql, params: Array.isArray(params) ? params : [] }, opts);
  if (!data || data.success === false) {
    const err = data?.errors?.[0]?.message || data?.error || JSON.stringify(data);
    throw new Error(`D1 query failed: ${String(err).slice(0, 500)}`);
  }
  // Cloudflare D1 API returns { result: [ { results: [...] } ] } in many environments
  const results = data?.result?.[0]?.results;
  return Array.isArray(results) ? (results as T[]) : [];
}

