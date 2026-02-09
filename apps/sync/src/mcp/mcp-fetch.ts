function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

async function fetchJsonWithTimeout(url: string, timeoutMs: number): Promise<{ status: number; json: any | null } | null> {
  const controller = new AbortController();
  const t = setTimeout(() => {
    try {
      controller.abort();
    } catch {}
  }, timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    } as any);
    const status = res.status;
    const text = await res.text().catch(() => '');
    if (!res.ok) return { status, json: null };
    if (!text.trim()) return { status, json: null };
    try {
      return { status, json: JSON.parse(text) };
    } catch {
      return { status, json: null };
    }
  } finally {
    clearTimeout(t);
  }
}

function extractStringArray(v: any): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
}

export type McpFetchResult = {
  checkedUrl: string;
  status: number | null;
  alive: boolean;
  tools: string[];
  prompts: string[];
  toolsJson: any | null;
  promptsJson: any | null;
};

export async function fetchMcpSignals(endpoint: string): Promise<McpFetchResult> {
  const base = normalizeUrl(endpoint);
  const candidates = new Set<string>();
  if (base) {
    candidates.add(base);
    // Common “REST-ish” patterns used by some MCP deployments
    candidates.add(`${base}/tools`);
    candidates.add(`${base}/prompts`);
    candidates.add(`${base}/resources`);
  }

  // Try each candidate with a small retry.
  for (const url of Array.from(candidates)) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetchJsonWithTimeout(url, 12_000).catch(() => null);
      const status = res?.status ?? null;
      const json = res?.json ?? null;
      const alive = status != null && status >= 200 && status < 300;

      // Heuristic: accept either:
      // - { tools: [...], prompts: [...] }
      // - [...tools] from /tools
      // - [...prompts] from /prompts
      let tools: string[] = [];
      let prompts: string[] = [];
      let toolsJson: any | null = null;
      let promptsJson: any | null = null;

      if (json && typeof json === 'object' && !Array.isArray(json)) {
        tools = extractStringArray((json as any).tools);
        prompts = extractStringArray((json as any).prompts);
        if (tools.length) toolsJson = (json as any).tools;
        if (prompts.length) promptsJson = (json as any).prompts;
      } else if (Array.isArray(json)) {
        const arr = extractStringArray(json);
        // Guess based on URL path
        if (url.toLowerCase().endsWith('/prompts')) {
          prompts = arr;
          promptsJson = json;
        } else {
          tools = arr;
          toolsJson = json;
        }
      }

      if (alive) {
        return { checkedUrl: url, status, alive: true, tools, prompts, toolsJson, promptsJson };
      }

      // Retry quickly once for transient issues.
      if (attempt === 0) await sleep(500);
    }
  }

  return { checkedUrl: base || endpoint, status: null, alive: false, tools: [], prompts: [], toolsJson: null, promptsJson: null };
}

