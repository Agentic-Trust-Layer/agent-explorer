type Env = {
  RUNNER_BASE_URL: string;
  RUNNER_TOKEN?: string; // set via `wrangler secret put RUNNER_TOKEN`
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
    'access-control-allow-headers': 'content-type, x-sync-token',
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

function requireToken(req: Request, env: Env): Response | null {
  const expected = String(env.RUNNER_TOKEN ?? '').trim();
  // If no token configured, allow unauthenticated (not recommended but supports early dev).
  if (!expected) return null;
  const got = (req.headers.get('x-sync-token') || '').trim();
  if (got && got === expected) return null;
  return json({ error: 'unauthorized' }, { status: 401, headers: corsHeaders() });
}

function joinUrl(base: string, path: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
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
      const authErr = requireToken(request, env);
      if (authErr) return authErr;

      const runnerBase = String(env.RUNNER_BASE_URL || '').trim();
      if (!runnerBase) return json({ error: 'RUNNER_BASE_URL is not configured' }, { status: 500, headers: corsHeaders() });

      const chainIds = parseChainIds(url.searchParams.get('chainId'));
      if (!chainIds.length) return json({ error: 'invalid chainId' }, { status: 400, headers: corsHeaders() });

      const body = (await request.json().catch(() => ({}))) as any;
      const payload = {
        chainIds,
        limit: body?.limit ?? null,
        agentIdsCsv: body?.agentIdsCsv ?? null,
        ensureAgent: body?.ensureAgent ?? null,
      };

      const resp = await fetch(joinUrl(runnerBase, '/run'), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-sync-token': (request.headers.get('x-sync-token') || '').trim(),
        },
        body: JSON.stringify(payload),
      });
      const text = await resp.text().catch(() => '');
      let data: any = text;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {}
      return json(data, { status: resp.status, headers: corsHeaders() });
    }

    const jobMatch = url.pathname.match(/^\\/sync\\/jobs\\/([^/]+)$/);
    if (jobMatch && request.method === 'GET') {
      const authErr = requireToken(request, env);
      if (authErr) return authErr;

      const runnerBase = String(env.RUNNER_BASE_URL || '').trim();
      if (!runnerBase) return json({ error: 'RUNNER_BASE_URL is not configured' }, { status: 500, headers: corsHeaders() });

      const jobId = decodeURIComponent(jobMatch[1] || '').trim();
      const resp = await fetch(joinUrl(runnerBase, `/jobs/${encodeURIComponent(jobId)}`), {
        method: 'GET',
        headers: {
          'x-sync-token': (request.headers.get('x-sync-token') || '').trim(),
        },
      });
      const text = await resp.text().catch(() => '');
      let data: any = text;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {}
      return json(data, { status: resp.status, headers: corsHeaders() });
    }

    return json({ error: 'not found', path: url.pathname }, { status: 404, headers: corsHeaders() });
  },
};

