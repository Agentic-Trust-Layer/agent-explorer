import { upsertAgentCardForAgent } from './agent-card-fetch';

function safeJsonParse(value: unknown): any | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeResults(result: any): any[] {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.results)) return result.results;
  return [];
}

export function extractRegistrationA2AEndpoint(rawJson: unknown, fallbackA2AEndpoint?: string | null): string | null {
  const parsed = safeJsonParse(rawJson);
  const normalize = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null);

  const extractFromObject = (obj: any): string | null => {
    if (!obj || typeof obj !== 'object') return null;

    const endpoints = Array.isArray(obj.endpoints) ? obj.endpoints : Array.isArray(obj.Endpoints) ? obj.Endpoints : [];
    for (const e of endpoints) {
      const name = typeof e?.name === 'string' ? e.name.trim().toLowerCase() : '';
      const isA2A = name === 'a2a';
      if (!isA2A) continue;
      const v = normalize(e?.endpoint) || normalize(e?.url) || normalize(e?.href) || normalize(e?.uri);
      if (v) return v;
    }

    return null;
  };

  if (parsed && typeof parsed === 'object') {
    const v0 = extractFromObject(parsed);
    if (v0) return v0;
    const v1 = extractFromObject((parsed as any).metadata);
    if (v1) return v1;
    const v2 = extractFromObject((parsed as any).token);
    if (v2) return v2;
  }

  return typeof fallbackA2AEndpoint === 'string' && fallbackA2AEndpoint.trim() ? fallbackA2AEndpoint.trim() : null;
}

function parseAgentCardCursor(value: unknown): { chainId: number; agentId: string } {
  if (typeof value !== 'string' || !value.trim()) return { chainId: 0, agentId: '' };
  const parts = value.split('|');
  if (parts.length < 2) return { chainId: 0, agentId: '' };
  const chainId = Number(parts[0]);
  const agentId = parts.slice(1).join('|');
  return {
    chainId: Number.isFinite(chainId) && chainId >= 0 ? Math.trunc(chainId) : 0,
    agentId: typeof agentId === 'string' ? agentId : '',
  };
}

function formatAgentCardCursor(cursor: { chainId: number; agentId: string }): string {
  const chainId = Number.isFinite(cursor.chainId) && cursor.chainId >= 0 ? Math.trunc(cursor.chainId) : 0;
  const agentId = typeof cursor.agentId === 'string' ? cursor.agentId : '';
  return `${chainId}|${agentId}`;
}

async function getCheckpointValue(dbInstance: any, key: string): Promise<string | null> {
  try {
    const stmt = dbInstance.prepare('SELECT value FROM checkpoints WHERE key = ?');
    if (stmt.bind && typeof stmt.bind === 'function') {
      const row = await stmt.bind(key).first();
      return row?.value ? String(row.value) : null;
    }
    const row = await stmt.get(key);
    return row?.value ? String((row as any).value) : null;
  } catch {
    return null;
  }
}

async function setCheckpointValue(dbInstance: any, key: string, value: string): Promise<void> {
  try {
    const stmt = dbInstance.prepare(
      'INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
    );
    if (stmt.bind && typeof stmt.bind === 'function') {
      await stmt.bind(key, value).run();
      return;
    }
    await stmt.run(key, value);
  } catch {
    // best-effort
  }
}

export async function backfillAgentCards(dbInstance: any, opts?: { chunkSize?: number; reset?: boolean }) {
  if (!dbInstance) return;
  const checkpointKey = 'agentCardFetchCursor';
  const chunkSize =
    typeof opts?.chunkSize === 'number' && Number.isFinite(opts.chunkSize) && opts.chunkSize > 0 ? Math.trunc(opts.chunkSize) : 50;

  if (opts?.reset) {
    try {
      await dbInstance.prepare('DELETE FROM checkpoints WHERE key = ?').run(checkpointKey);
      console.info('[agent-card-backfill] reset: cleared agentCardFetchCursor checkpoint');
    } catch (e) {
      console.warn('[agent-card-backfill] reset requested but failed to clear checkpoint', e);
    }
  }

  let cursor = parseAgentCardCursor(await getCheckpointValue(dbInstance, checkpointKey));

  const query = `
    SELECT chainId, agentId, a2aEndpoint, rawJson, agentCardJson, agentCardReadAt
    FROM agents
    WHERE
      (
        chainId > ?
        OR (
          chainId = ?
          AND (
            LENGTH(agentId) > ?
            OR (LENGTH(agentId) = ? AND agentId > ?)
          )
        )
      )
      AND (
        agentCardJson IS NULL OR agentCardJson = ''
        OR agentCardReadAt IS NULL OR agentCardReadAt = 0
      )
    ORDER BY chainId ASC, LENGTH(agentId) ASC, agentId ASC
    LIMIT ?
  `;

  console.info('[agent-card-backfill] starting', { chunkSize, cursor });

  while (true) {
    const agentIdLen = cursor.agentId.length;
    const stmt = dbInstance.prepare(query);
    const bindParams = [cursor.chainId, cursor.chainId, agentIdLen, agentIdLen, cursor.agentId, chunkSize];
    let rows: any[] = [];
    try {
      if (stmt.bind && typeof stmt.bind === 'function') {
        const result = await stmt.bind(...bindParams).all();
        rows = normalizeResults(result);
      } else {
        const result = await stmt.all(...bindParams);
        rows = normalizeResults(result);
      }
    } catch (e) {
      console.warn('[agent-card-backfill] query failed', e);
      break;
    }

    if (!rows.length) {
      console.info('[agent-card-backfill] complete (no more rows)', { cursor });
      break;
    }

    for (const row of rows) {
      const chainId = Number(row?.chainId ?? 0) || 0;
      const agentId = String(row?.agentId ?? '');
      const fallbackA2A = row?.a2aEndpoint != null ? String(row.a2aEndpoint) : null;
      const regA2A = extractRegistrationA2AEndpoint(row?.rawJson, fallbackA2A);

      if (regA2A) {
        try {
          await upsertAgentCardForAgent(dbInstance, chainId, agentId, regA2A, { force: true });
        } catch {
          // best-effort
        }
      }

      cursor = { chainId, agentId };
      await setCheckpointValue(dbInstance, checkpointKey, formatAgentCardCursor(cursor));
    }
  }
}


