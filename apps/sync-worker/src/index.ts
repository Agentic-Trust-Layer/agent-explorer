type Env = {
  RUNNER_BASE_URL: string;
};

function json(data: any, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init?.headers ?? {}),
    },
  });
}

function corsHeaders(): Record<string, string> {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
  };
}

function parseChainIds(input: string | null): number[] {
  const raw = String(input ?? '').trim().toLowerCase();
  if (!raw || raw === 'all' || raw === 'main' || raw === 'main-chains') return [1, 59144];
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const out: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (Number.isFinite(n) && n > 0) out.push(Math.trunc(n));
  }
  return Array.from(new Set(out));
}

function joinUrl(base: string, path: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

function isIpv4Literal(host: string): boolean {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  for (let i = 1; i <= 4; i++) {
    const n = Number(m[i]);
    if (!Number.isFinite(n) || n < 0 || n > 255) return false;
  }
  return true;
}

function runnerBaseUrlOrError(runnerBase: string): { ok: true; base: string } | { ok: false; res: Response } {
  let u: URL;
  try {
    u = new URL(runnerBase);
  } catch {
    return {
      ok: false,
      res: json(
        { error: 'RUNNER_BASE_URL must be a valid URL (include http:// or https://)', runnerBase },
        { status: 500, headers: corsHeaders() },
      ),
    };
  }

  // Cloudflare Workers cannot fetch IP literals in production; must use a hostname with an A/AAAA record.
  // See: https://developers.cloudflare.com/workers/platform/known-issues/#fetch-to-ip-addresses
  if (isIpv4Literal(u.hostname) || u.hostname.includes(':')) {
    return {
      ok: false,
      res: json(
        {
          error: 'RUNNER_BASE_URL cannot be an IP address in production Workers. Use a DNS hostname (A/AAAA record) instead.',
          runnerBase,
          hint: 'Create e.g. runner.agentkg.io -> <VM public IP>, or use Cloudflare Tunnel, then set RUNNER_BASE_URL=https://runner.agentkg.io',
          docs: 'https://developers.cloudflare.com/workers/platform/known-issues/#fetch-to-ip-addresses',
        },
        { status: 500, headers: corsHeaders() },
      ),
    };
  }

  return { ok: true, base: runnerBase };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });

    if (url.pathname === '/health' && request.method === 'GET') {
      return json(
        {
          ok: true,
          service: 'sync-worker',
          runnerConfigured: Boolean(String(env.RUNNER_BASE_URL || '').trim()),
          ts: new Date().toISOString(),
        },
        { headers: corsHeaders() },
      );
    }

    if (url.pathname === '/sync/agent-pipeline' && request.method === 'POST') {
      const runnerBase = String(env.RUNNER_BASE_URL || '').trim();
      if (!runnerBase) return json({ error: 'RUNNER_BASE_URL is not configured' }, { status: 500, headers: corsHeaders() });
      const runnerOk = runnerBaseUrlOrError(runnerBase);
      if (!runnerOk.ok) return runnerOk.res;

      const chainIds = parseChainIds(url.searchParams.get('chainId'));
      if (!chainIds.length) return json({ error: 'invalid chainId' }, { status: 400, headers: corsHeaders() });

      const body = (await request.json().catch(() => ({}))) as any;
      const payload = {
        chainIds,
        limit: body?.limit ?? null,
        agentIdsCsv: body?.agentIdsCsv ?? null,
        ensureAgent: body?.ensureAgent ?? null,
      };

      console.log('[sync-worker] trigger', {
        path: url.pathname,
        chainIds,
        hasLimit: payload.limit != null,
        hasAgentIdsCsv: Boolean(payload.agentIdsCsv),
        ensureAgent: payload.ensureAgent === true,
      });

      const resp = await fetch(joinUrl(runnerOk.base, '/run'), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const text = await resp.text().catch(() => '');
      let data: any = text;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {}

      console.log('[sync-worker] trigger result', {
        httpStatus: resp.status,
        jobId: typeof data?.jobId === 'string' ? data.jobId : null,
        chainIds: Array.isArray(data?.chainIds) ? data.chainIds : chainIds,
      });
      return json(data, { status: resp.status, headers: corsHeaders() });
    }

    const jobMatch = url.pathname.match(/^\/sync\/jobs\/([^/]+)$/);
    if (jobMatch && request.method === 'GET') {
      const runnerBase = String(env.RUNNER_BASE_URL || '').trim();
      if (!runnerBase) return json({ error: 'RUNNER_BASE_URL is not configured' }, { status: 500, headers: corsHeaders() });
      const runnerOk = runnerBaseUrlOrError(runnerBase);
      if (!runnerOk.ok) return runnerOk.res;

      const jobId = decodeURIComponent(jobMatch[1] || '').trim();
      const resp = await fetch(joinUrl(runnerOk.base, `/jobs/${encodeURIComponent(jobId)}`), {
        method: 'GET',
        headers: {},
      });
      const text = await resp.text().catch(() => '');
      let data: any = text;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {}

      // Keep logs concise: only status and any kb summaries (if present).
      console.log('[sync-worker] job status', {
        jobId,
        httpStatus: resp.status,
        status: typeof data?.status === 'string' ? data.status : null,
        exitCode: typeof data?.exitCode === 'number' ? data.exitCode : null,
        error: typeof data?.error === 'string' ? data.error : null,
        kbSummaryChains: data?.kbSummaryByChain ? Object.keys(data.kbSummaryByChain) : [],
      });
      return json(data, { status: resp.status, headers: corsHeaders() });
    }

    return json({ error: 'not found', path: url.pathname }, { status: 404, headers: corsHeaders() });
  },
};

