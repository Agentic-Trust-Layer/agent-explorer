type AnyDb = any;

function safeJsonParse(s: unknown): any | null {
  if (typeof s !== 'string' || !s.trim()) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function normalizeString(value: any): string | null {
  if (value == null) return null;
  if (typeof value === 'string') {
    const t = value.trim();
    return t ? t : null;
  }
  const t = String(value).trim();
  return t ? t : null;
}

function readAgentName(metadata: any): string | null {
  try {
    if (!metadata || typeof metadata !== 'object') return null;
    return (
      normalizeString(metadata?.name) ||
      normalizeString(metadata?.agentName) ||
      normalizeString(metadata?.Name) ||
      normalizeString(metadata?.AgentName)
    );
  } catch {
    return null;
  }
}

function extractCid(tokenURI: string): string | null {
  try {
    if (tokenURI.startsWith('ipfs://')) {
      const rest = tokenURI.slice('ipfs://'.length);
      const cid = rest.split('/')[0]?.trim();
      return cid || null;
    }
    // subdomain CID.ipfs.<gateway>
    const sub = tokenURI.match(/https?:\/\/([a-zA-Z0-9]{46,})\.ipfs\.[^\/\s]*/i);
    if (sub?.[1]) return sub[1];
    // path .../ipfs/CID
    const path = tokenURI.match(/https?:\/\/[^\/]+\/ipfs\/([a-zA-Z0-9]{46,})/i);
    if (path?.[1]) return path[1];
    // generic CID
    const any = tokenURI.match(/(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{56})/i);
    if (any?.[1]) return any[1];
  } catch {}
  return null;
}

function createTimeoutSignal(timeoutMs: number): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    return (AbortSignal as any).timeout(timeoutMs);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

async function fetchTokenUriJson(tokenURI: string | null): Promise<any | null> {
  if (!tokenURI) return null;
  const fetchFn = (globalThis as any).fetch as undefined | ((input: any, init?: any) => Promise<any>);
  if (!fetchFn) return null;

  const uri = tokenURI.trim();
  if (!uri) return null;

  // If agentUri itself is a JSON string, parse it directly.
  // This handles cases where agentUri is stored as inline JSON rather than a URL/data URI.
  if (uri.startsWith('{') || uri.startsWith('[')) {
    try {
      return JSON.parse(uri);
    } catch {
      return null;
    }
  }
  // If agentUri is percent-encoded JSON (e.g. starts with %7B), decode and parse.
  if (uri.startsWith('%7B') || uri.startsWith('%5B')) {
    try {
      const decoded = decodeURIComponent(uri);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  // data:application/json,....
  if (uri.startsWith('data:application/json')) {
    try {
      const commaIndex = uri.indexOf(',');
      if (commaIndex === -1) return null;
      const jsonData = uri.substring(commaIndex + 1);
      if (uri.startsWith('data:application/json;base64,')) {
        try {
          const decoded = typeof atob !== 'undefined' ? atob(jsonData) : Buffer.from(jsonData, 'base64').toString('utf-8');
          try {
            // Normal base64-encoded JSON
            return JSON.parse(decoded);
          } catch {
            // Some producers base64-encode a percent-encoded JSON string
            return JSON.parse(decodeURIComponent(decoded));
          }
        } catch {
          // mislabeled: try plain/decodeURIComponent
          try {
            return JSON.parse(jsonData);
          } catch {
            // If it's actually base64, the above will fail; best-effort decodeURIComponent anyway.
            return JSON.parse(decodeURIComponent(jsonData));
          }
        }
      }
      try {
        return JSON.parse(jsonData);
      } catch {
        return JSON.parse(decodeURIComponent(jsonData));
      }
    } catch {
      return null;
    }
  }

  const cid = extractCid(uri);
  if (cid) {
    const gateways: string[] = [];
    // If URI is already a gateway URL, try it first.
    if (/^https?:\/\//i.test(uri) && (uri.includes('.ipfs.') || uri.includes('/ipfs/'))) gateways.push(uri);
    // Common gateways
    gateways.push(
      `https://${cid}.ipfs.w3s.link`,
      `https://w3s.link/ipfs/${cid}`,
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      `https://${cid}.ipfs.mypinata.cloud`,
      `https://ipfs.io/ipfs/${cid}`,
      `https://cloudflare-ipfs.com/ipfs/${cid}`,
      `https://${cid}.ipfs.dweb.link`,
      `https://ipfs.dweb.link/ipfs/${cid}`,
      `https://dweb.link/ipfs/${cid}`,
    );

    for (const u of gateways) {
      try {
        const resp = await fetchFn(u, { signal: createTimeoutSignal(10_000) } as any);
        if (resp?.ok) return (await resp.json()) ?? null;
      } catch {
        // try next gateway
      }
    }
  }

  if (/^https?:\/\//i.test(uri)) {
    try {
      const resp = await fetchFn(uri, { signal: createTimeoutSignal(15_000) } as any);
      if (resp?.ok) return (await resp.json()) ?? null;
    } catch {
      return null;
    }
  }

  return null;
}

function findEndpoint(metadata: any, name: string): string | null {
  try {
    const eps = Array.isArray(metadata?.endpoints) ? metadata.endpoints : [];
    const target = name.toLowerCase();
    const e = eps.find((x: any) => String(x?.name ?? '').toLowerCase() === target);
    const v = e?.endpoint;
    return typeof v === 'string' && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

function parseSupportedTrust(metadata: any): string[] {
  try {
    const a = Array.isArray(metadata?.supportedTrust) ? metadata.supportedTrust : null;
    const b = Array.isArray(metadata?.supportedTrusts) ? metadata.supportedTrusts : null;
    const arr = (a ?? b ?? []) as any[];
    return arr.map((x) => String(x).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function parseBoolean(value: any): number | null {
  if (value === undefined) return null;
  try {
    const b = !!(value === true || value === 1 || String(value).toLowerCase() === 'true');
    return b ? 1 : 0;
  } catch {
    return null;
  }
}

function truncateForLog(value: unknown, maxLen: number): string {
  try {
    const s = value == null ? '' : String(value);
    if (s.length <= maxLen) return s;
    return s.slice(0, maxLen) + `…(len=${s.length})`;
  } catch {
    return '';
  }
}

async function getCheckpoint(db: AnyDb, key: string): Promise<string | null> {
  const row = (await db.prepare('SELECT value FROM checkpoints WHERE key=?').get(key)) as any;
  const v = row?.value;
  return typeof v === 'string' ? v : null;
}

async function setCheckpoint(db: AnyDb, key: string, value: string): Promise<void> {
  await db
    .prepare('INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
    .run(key, value);
}

export async function runTokenUriBackfill(
  db: AnyDb,
  opts?: { chainId?: number; reset?: boolean; overwrite?: boolean; pageSize?: number; max?: number; startAgentId?: string },
): Promise<void> {
  const chainIdFilter = Number(opts?.chainId ?? 0) || 0;
  const overwrite = opts?.overwrite === true;
  const pageSize = Number(opts?.pageSize ?? process.env.TOKENURI_BACKFILL_PAGE_SIZE ?? 250) || 250;
  const max = Number(opts?.max ?? process.env.TOKENURI_BACKFILL_MAX ?? 0) || 0;
  const reset = opts?.reset === true || process.env.TOKENURI_BACKFILL_RESET === '1';
  const verbose = process.env.TOKENURI_BACKFILL_VERBOSE === '1';
  // Log page-level progress by default (env can still enable verbose per-agent logs).
  const pageLog = process.env.TOKENURI_BACKFILL_PAGE_LOG ? process.env.TOKENURI_BACKFILL_PAGE_LOG === '1' : true;
  const startAgentId = (opts?.startAgentId || '').trim();
  const logEvery = (() => {
    const raw = process.env.TOKENURI_BACKFILL_LOG_EVERY;
    const n = raw && raw.trim() ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 50;
  })();

  const ckKey = chainIdFilter ? `tokenUriBackfillCursor_${chainIdFilter}` : 'tokenUriBackfillCursor';

  let cursorChainId = 0;
  let cursorAgentId = '';
  if (!reset && !startAgentId) {
    const saved = await getCheckpoint(db, ckKey);
    if (saved) {
      if (chainIdFilter) {
        // For a fixed chainId, checkpoint is the last agentId processed.
        cursorChainId = chainIdFilter;
        cursorAgentId = saved.trim();
      } else {
        // For multi-chain scans, checkpoint is JSON: { chainId, agentId }.
        const parsed = safeJsonParse(saved);
        cursorChainId = Number(parsed?.chainId ?? 0) || 0;
        cursorAgentId = typeof parsed?.agentId === 'string' ? parsed.agentId : '';
      }
    }
  } else {
    await setCheckpoint(db, ckKey, chainIdFilter ? '' : JSON.stringify({ chainId: 0, agentId: '' }));
    if (chainIdFilter) {
      cursorChainId = chainIdFilter;
      cursorAgentId = startAgentId || '';
    } else if (startAgentId) {
      // In all-chain mode, startAgentId is ambiguous; ignore.
      cursorChainId = 0;
      cursorAgentId = '';
    }
  }

  console.log('[tokenuri-backfill] start', {
    chainId: chainIdFilter || 'all',
    overwrite,
    reset,
    pageSize,
    max,
    verbose,
    pageLog,
    logEvery,
    startAgentId: startAgentId || null,
    cursor: { chainId: cursorChainId, agentId: cursorAgentId },
  });

  // Basic sanity: show counts so it's obvious if we point at the wrong DB.
  try {
    const row = (await db
      .prepare(
        `SELECT
           COUNT(*) as n,
           SUM(CASE WHEN agentUri IS NOT NULL AND agentUri != '' THEN 1 ELSE 0 END) as withAgentUri,
           SUM(CASE WHEN rawJson IS NOT NULL AND rawJson != '' THEN 1 ELSE 0 END) as withRawJson
         FROM agents${chainIdFilter ? ' WHERE chainId = ?' : ''}`,
      )
      .get(...(chainIdFilter ? [chainIdFilter] : []))) as any;
    console.log('[tokenuri-backfill] counts', {
      chainId: chainIdFilter || 'all',
      total: Number(row?.n ?? 0) || 0,
      withTokenUri: Number(row?.withTokenUri ?? 0) || 0,
      withRawJson: Number(row?.withRawJson ?? 0) || 0,
    });
  } catch (e: any) {
    console.warn('[tokenuri-backfill] count query failed', String(e?.message || e));
  }

  let processed = 0;
  let scanned = 0;
  let fetchedOk = 0;
  let fetchedNull = 0;
  let updated = 0;
  let updateSkipped = 0;
  let fetchErrors = 0;
  for (;;) {
    const where: string[] = [];
    const params: any[] = [];

    if (chainIdFilter) {
      where.push('chainId = ?');
      params.push(chainIdFilter);
    }

    // pagination cursor
    if (chainIdFilter) {
      // When scanning a single chain, sort by numeric agentId and keep a simple "last agentId" cursor.
      where.push('CAST(agentId AS INTEGER) > CAST(? AS INTEGER)');
      params.push(cursorAgentId || '0');
    } else {
      where.push('(chainId > ? OR (chainId = ? AND agentId > ?))');
      params.push(cursorChainId, cursorChainId, cursorAgentId);
    }

    where.push("agentUri IS NOT NULL AND agentUri != ''");
    if (!overwrite) where.push("(rawJson IS NULL OR rawJson = '')");

    const orderBy = chainIdFilter
      ? 'ORDER BY CAST(agentId AS INTEGER) ASC, agentId ASC'
      : 'ORDER BY chainId ASC, agentId ASC';
    const sql = `
      SELECT chainId, agentId, agentUri, rawJson
      FROM agents
      WHERE ${where.join(' AND ')}
      ${orderBy}
      LIMIT ?
    `;
    const res = await db.prepare(sql).all(...params, pageSize);
    const rows = Array.isArray(res) ? res : ((res as any)?.results || (res as any)?.rows || []);
    if (!rows.length) break;
    if (pageLog || verbose) {
      const first = rows[0];
      const last = rows[rows.length - 1];
      console.log('[tokenuri-backfill] page', {
        chainId: chainIdFilter || 'all',
        rows: rows.length,
        firstAgentId: String(first?.agentId ?? ''),
        lastAgentId: String(last?.agentId ?? ''),
      });
    }

    for (const r of rows) {
      const chainId = Number(r?.chainId ?? 0) || 0;
      const agentId = String(r?.agentId ?? '');
      const tokenUri = typeof r?.agentUri === 'string' ? r.agentUri : null;

      let fetched: any | null = null;
      try {
        // Log each agent processed (default-on).
        console.log('[agenturi-backfill] agent', { chainId, agentId, agentUri: truncateForLog(tokenUri, 220) || null });
        fetched = await fetchTokenUriJson(tokenUri);
      } catch {
        fetchErrors += 1;
        fetched = null;
      }

      if (fetched && typeof fetched === 'object') {
        fetchedOk += 1;
        const name = readAgentName(fetched);
        const desc = normalizeString(fetched?.description);
        const img = fetched?.image == null ? null : normalizeString(fetched?.image);
        const a2a = findEndpoint(fetched, 'A2A') || findEndpoint(fetched, 'a2a') || normalizeString(fetched?.a2aEndpoint) || normalizeString(fetched?.chatEndpoint);
        const ens = findEndpoint(fetched, 'ENS') || findEndpoint(fetched, 'ens') || normalizeString(fetched?.ensEndpoint) || normalizeString(fetched?.ensName);
        const supportedTrust = parseSupportedTrust(fetched);
        const active = parseBoolean(fetched?.active);

        let rawJson: string | null = null;
        try {
          rawJson = JSON.stringify(fetched);
        } catch {
          rawJson = null;
        }
        console.log('[tokenuri-backfill] fetchedRawJson', { chainId, agentId, rawJson: truncateForLog(rawJson, 800) || null });

        const updateTime = Math.floor(Date.now() / 1000);
        await db
          .prepare(
            `UPDATE agents SET
               agentName = COALESCE(NULLIF(TRIM(?), ''), agentName),
               description = COALESCE(NULLIF(TRIM(?), ''), description),
               image = COALESCE(NULLIF(TRIM(?), ''), image),
               a2aEndpoint = COALESCE(NULLIF(TRIM(?), ''), a2aEndpoint),
               ensEndpoint = COALESCE(NULLIF(TRIM(?), ''), ensEndpoint),
               supportedTrust = COALESCE(?, supportedTrust),
               active = COALESCE(?, active),
               rawJson = COALESCE(?, rawJson),
               updatedAtTime = ?
             WHERE chainId = ? AND agentId = ?`,
          )
          .run(
            name ?? null,
            desc ?? null,
            img ?? null,
            a2a ?? null,
            ens ?? null,
            supportedTrust.length ? JSON.stringify(supportedTrust) : null,
            active,
            rawJson,
            updateTime,
            chainId,
            agentId,
          );

        processed += 1;
        updated += 1;
        if (verbose) {
          console.log('[tokenuri-backfill] updated', {
            chainId,
            agentId,
            hasName: Boolean(name),
            hasA2a: Boolean(a2a),
            hasEns: Boolean(ens),
            supportedTrustCount: supportedTrust.length,
            active,
          });
        }
        if (max > 0 && processed >= max) {
          cursorChainId = chainId;
          cursorAgentId = agentId;
          await setCheckpoint(db, ckKey, JSON.stringify({ chainId: cursorChainId, agentId: cursorAgentId }));
          console.log('[tokenuri-backfill] max reached', { processed, cursor: { chainId: cursorChainId, agentId: cursorAgentId } });
          return;
        }
      } else {
        fetchedNull += 1;
        console.log('[tokenuri-backfill] fetchedRawJson', { chainId, agentId, rawJson: null });
      }

      cursorChainId = chainId;
      cursorAgentId = agentId;
      scanned += 1;
      await setCheckpoint(db, ckKey, chainIdFilter ? cursorAgentId : JSON.stringify({ chainId: cursorChainId, agentId: cursorAgentId }));

      if (logEvery > 0 && scanned % logEvery === 0) {
        console.log('[tokenuri-backfill] progress', {
          chainId: chainIdFilter || 'all',
          scanned,
          fetchedOk,
          fetchedNull,
          fetchErrors,
          updated,
          updateSkipped,
          cursor: { chainId: cursorChainId, agentId: cursorAgentId },
        });
      }
    }
  }

  console.log('[tokenuri-backfill] complete', {
    chainId: chainIdFilter || 'all',
    scanned,
    fetchedOk,
    fetchedNull,
    fetchErrors,
    updated,
    updateSkipped,
    processed,
    cursor: { chainId: cursorChainId, agentId: cursorAgentId },
  });
}


