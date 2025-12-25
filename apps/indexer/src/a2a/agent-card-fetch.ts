function normalizeUrl(url: string): string {
  return url.trim();
}

function tryParseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function removeTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function buildCandidateAgentCardUrls(registrationA2AEndpoint: string): string[] {
  const raw = normalizeUrl(registrationA2AEndpoint);
  if (!raw) return [];

  const candidates: string[] = [];

  // 1) If the endpoint already looks like an agent card url, try it first.
  candidates.push(raw);

  const parsed = tryParseUrl(raw);
  if (!parsed) {
    return uniq(candidates);
  }

  const origin = parsed.origin;
  const path = parsed.pathname || '';

  // 2) Standard-ish well-known locations at the origin.
  candidates.push(`${origin}/.well-known/agent.json`);
  candidates.push(`${origin}/.well-known/agent-card.json`);

  // 3) If the provided endpoint is a base URL (not a .json), try appending well-known.
  const noQuery = `${origin}${path}`;
  if (!/\.json$/i.test(path)) {
    const base = removeTrailingSlash(noQuery);
    candidates.push(`${base}/.well-known/agent.json`);
    candidates.push(`${base}/.well-known/agent-card.json`);
  }

  // 4) Some providers host at root without .well-known
  candidates.push(`${origin}/agent.json`);
  candidates.push(`${origin}/agent-card.json`);

  return uniq(candidates.filter(Boolean));
}

async function fetchJsonWithTimeout(url: string, timeoutMs: number): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        // Some servers block requests without UA.
        'User-Agent': 'erc8004-indexer/agent-card-fetch',
      },
      signal: controller.signal,
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`HTTP ${resp.status}${text ? `: ${text.slice(0, 200)}` : ''}`);
    }
    return await resp.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchA2AAgentCardFromRegistrationEndpoint(
  registrationA2AEndpoint: string,
  opts?: { timeoutMs?: number; maxAttempts?: number },
): Promise<{ url: string; card: any } | null> {
  const timeoutMs = opts?.timeoutMs ?? 8000;
  const maxAttempts = opts?.maxAttempts ?? 4;

  const candidates = buildCandidateAgentCardUrls(registrationA2AEndpoint);
  if (!candidates.length) return null;

  let attempts = 0;
  for (const url of candidates) {
    if (attempts >= maxAttempts) break;
    attempts += 1;
    try {
      const card = await fetchJsonWithTimeout(url, timeoutMs);
      if (card && typeof card === 'object') {
        return { url, card };
      }
    } catch {
      // best-effort: continue to next candidate
      continue;
    }
  }
  return null;
}

export async function upsertAgentCardForAgent(
  db: any,
  chainId: number,
  agentId: string,
  registrationA2AEndpoint: string,
  opts?: { force?: boolean },
): Promise<boolean> {
  if (!db || !registrationA2AEndpoint) return false;

  const now = Math.floor(Date.now() / 1000);
  const force = opts?.force === true;

  // Skip if we already have a recent card (unless forced).
  try {
    if (!force) {
      const row = await db
        .prepare('SELECT agentCardReadAt FROM agents WHERE chainId = ? AND agentId = ?')
        .get(chainId, agentId);
      const prev = Number((row as any)?.agentCardReadAt ?? 0) || 0;
      if (prev > 0 && now - prev < 24 * 60 * 60) {
        return false;
      }
    }
  } catch {
    // continue
  }

  const fetched = await fetchA2AAgentCardFromRegistrationEndpoint(registrationA2AEndpoint);
  if (!fetched) {
    if (process.env.DEBUG_AGENT_CARD === '1') {
      console.info('[agent-card] not found', { chainId, agentId, registrationA2AEndpoint });
    }
    return false;
  }

  let jsonText: string | null = null;
  try {
    jsonText = JSON.stringify(fetched.card);
  } catch {
    jsonText = null;
  }
  if (!jsonText) return false;

  console.info('[agent-card] fetched', {
    chainId,
    agentId,
    registrationA2AEndpoint,
    fetchedFromUrl: fetched.url,
    bytes: jsonText.length,
  });

  try {
    await db
      .prepare(
        `
        UPDATE agents
        SET agentCardJson = ?, agentCardReadAt = ?, updatedAtTime = ?
        WHERE chainId = ? AND agentId = ?
      `,
      )
      .run(jsonText, now, now, chainId, agentId);
  } catch {
    // best-effort
  }

  // Only update RDF when we successfully fetched/stored an agent card.
  // This runs only in Node.js (local indexer). Workers environments will skip.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isNode = typeof process !== 'undefined' && Boolean((process as any).versions?.node);
    if (isNode) {
      // Extensionless import works in both tsx (ts) and built (js) environments.
      const mod = await import('../rdf/export-agent-rdf');
      if (typeof (mod as any).exportAgentRdfForAgentCardUpdate === 'function') {
        await (mod as any).exportAgentRdfForAgentCardUpdate(db, chainId, agentId);
      }
    }
  } catch (err) {
    if (process.env.DEBUG_RDF_EXPORT === '1') {
      console.warn('[rdf-export] failed', { chainId, agentId, err });
    }
  }

  return true;
}


