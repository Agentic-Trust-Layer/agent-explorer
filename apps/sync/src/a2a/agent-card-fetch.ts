function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

export function buildCandidateAgentCardUrls(a2aEndpoint: string): string[] {
  const base = normalizeUrl(a2aEndpoint);
  if (!base) return [];
  const candidates = new Set<string>();

  // If already points to a JSON file, try it as-is.
  if (base.toLowerCase().endsWith('.json')) candidates.add(base);

  // A2A common locations
  candidates.add(`${base}/.well-known/agent-card.json`);
  candidates.add(`${base}/agent-card.json`);

  return Array.from(candidates);
}

async function fetchJsonWithTimeout(url: string, timeoutMs: number): Promise<any | null> {
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
    if (!res.ok) return null;
    const text = await res.text().catch(() => '');
    if (!text.trim()) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  } finally {
    clearTimeout(t);
  }
}

export async function fetchA2AAgentCardFromEndpoint(a2aEndpoint: string): Promise<{ card: any; url: string } | null> {
  const urls = buildCandidateAgentCardUrls(a2aEndpoint);
  for (const url of urls) {
    // retry 2 times quickly for transient failures
    for (let attempt = 0; attempt < 2; attempt++) {
      const card = await fetchJsonWithTimeout(url, 20_000).catch(() => null);
      if (card && typeof card === 'object') return { card, url };
      if (attempt === 0) await sleep(500);
    }
  }
  return null;
}

