type RetryOptions = {
  timeoutMs?: number;
  retries?: number;
  minBackoffMs?: number;
  maxBackoffMs?: number;
  retryOnStatuses?: number[];
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let undiciDispatcherPromise: Promise<any | undefined> | null = null;

async function getUndiciDispatcher(): Promise<any | undefined> {
  // Node.js fetch is backed by undici; allow tuning connect timeout via an Agent dispatcher.
  // In Workers/browsers, `undici` won't exist and `dispatcher` isn't supported.
  if (typeof process === 'undefined' || !process?.versions?.node) return undefined;

  const connectTimeoutRaw = process.env.UNDICI_CONNECT_TIMEOUT_MS;
  const connectTimeoutMs = connectTimeoutRaw && String(connectTimeoutRaw).trim() ? Number(connectTimeoutRaw) : undefined;
  if (!Number.isFinite(connectTimeoutMs as any) || (connectTimeoutMs as any) <= 0) return undefined;

  if (!undiciDispatcherPromise) {
    undiciDispatcherPromise = (async () => {
      try {
        const undici: any = await import('undici');
        const Agent = undici?.Agent;
        if (!Agent) return undefined;
        return new Agent({ connectTimeout: Math.trunc(connectTimeoutMs as any) });
      } catch {
        return undefined;
      }
    })();
  }
  return undiciDispatcherPromise;
}

function isRetryableNetworkError(err: unknown): boolean {
  const anyErr = err as any;
  const code = String(anyErr?.code || '');
  const name = String(anyErr?.name || '');
  const message = String(anyErr?.message || '');
  const lower = message.toLowerCase();

  // undici/node/network common cases
  if (name === 'AbortError') return true;
  if (code === 'ETIMEDOUT') return true;
  if (code === 'ECONNRESET') return true;
  if (code === 'EAI_AGAIN') return true;
  if (code === 'ENOTFOUND') return true;
  if (code === 'ECONNREFUSED') return true;
  if (code === 'UND_ERR_CONNECT_TIMEOUT') return true;
  if (lower.includes('fetch failed')) return true;
  if (lower.includes('connect timeout')) return true;
  if (lower.includes('socket hang up')) return true;
  if (lower.includes('econnreset')) return true;

  return false;
}

function computeBackoffMs(attempt: number, minBackoffMs: number, maxBackoffMs: number): number {
  const exp = Math.min(maxBackoffMs, minBackoffMs * Math.pow(2, attempt));
  const jitter = Math.floor(Math.random() * Math.min(250, Math.max(50, Math.floor(exp * 0.1))));
  return Math.min(maxBackoffMs, exp + jitter);
}

export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  opts?: RetryOptions,
): Promise<Response> {
  const timeoutMs = typeof opts?.timeoutMs === 'number' && opts.timeoutMs > 0 ? Math.trunc(opts.timeoutMs) : 30_000;
  const retries = typeof opts?.retries === 'number' && opts.retries >= 0 ? Math.trunc(opts.retries) : 4;
  const minBackoffMs = typeof opts?.minBackoffMs === 'number' && opts.minBackoffMs > 0 ? Math.trunc(opts.minBackoffMs) : 500;
  const maxBackoffMs = typeof opts?.maxBackoffMs === 'number' && opts.maxBackoffMs > 0 ? Math.trunc(opts.maxBackoffMs) : 30_000;
  const retryOnStatuses = opts?.retryOnStatuses ?? [429, 500, 502, 503, 504];

  for (let attempt = 0; attempt <= retries; attempt++) {
    const dispatcher = await getUndiciDispatcher();
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      try {
        controller.abort();
      } catch {}
    }, timeoutMs);

    try {
      const res = await fetch(url, {
        ...(init || {}),
        signal: controller.signal,
        ...(dispatcher ? ({ dispatcher } as any) : null),
      });

      if (retryOnStatuses.includes(res.status) && attempt < retries) {
        const retryAfter = res.headers.get('Retry-After');
        const retryAfterSeconds = retryAfter ? Number.parseInt(retryAfter, 10) : NaN;
        const waitMs = Number.isFinite(retryAfterSeconds)
          ? Math.max(0, retryAfterSeconds) * 1000
          : computeBackoffMs(attempt, minBackoffMs, maxBackoffMs);
        try {
          // Drain body so undici can reuse connections.
          await res.arrayBuffer().catch(() => undefined);
        } catch {}
        await sleep(waitMs);
        continue;
      }

      return res;
    } catch (err) {
      if (attempt >= retries || !isRetryableNetworkError(err)) throw err;
      const waitMs = computeBackoffMs(attempt, minBackoffMs, maxBackoffMs);
      await sleep(waitMs);
      continue;
    } finally {
      clearTimeout(timeout);
    }
  }

  // Should be unreachable.
  throw new Error('fetchWithRetry: exhausted retries');
}


