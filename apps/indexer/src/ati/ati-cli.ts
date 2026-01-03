import '../env';
import { db } from '../db';
import { computeAndUpsertATI } from '../ati';

function parseNum(value: string | undefined): number | undefined {
  if (!value || !value.trim()) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

async function runWithConcurrency<T>(items: T[], limit: number, fn: (item: T) => Promise<void>): Promise<void> {
  const concurrency = Number.isFinite(limit) && limit > 0 ? Math.trunc(limit) : 1;
  if (concurrency <= 1 || items.length <= 1) {
    for (const it of items) await fn(it);
    return;
  }
  let idx = 0;
  const workers = new Array(Math.min(concurrency, items.length)).fill(0).map(async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) break;
      await fn(items[i]);
    }
  });
  await Promise.all(workers);
}

(async () => {
  if (!db) throw new Error('DB not initialized');

  const chainId = parseNum(process.env.ATI_CHAIN_ID);
  const agentId = process.env.ATI_AGENT_ID?.trim();
  const limit = parseNum(process.env.ATI_LIMIT) ?? undefined;
  const concurrency = parseNum(process.env.ATI_CONCURRENCY) ?? 8;

  if (agentId && chainId !== undefined) {
    await computeAndUpsertATI(db, chainId, agentId);
    console.log(JSON.stringify({ ok: true, chainId, agentId }, null, 2));
    return;
  }

  const where = chainId !== undefined ? 'WHERE chainId = ?' : '';
  const sql = `SELECT chainId, agentId FROM agents ${where} ORDER BY chainId ASC, LENGTH(agentId) ASC, agentId ASC ${limit ? 'LIMIT ?' : ''}`;
  const params: any[] = [];
  if (chainId !== undefined) params.push(chainId);
  if (limit) params.push(limit);

  const stmt = db.prepare(sql);
  let rows: any[] = [];
  if (stmt.bind && typeof stmt.bind === 'function') {
    const res = await stmt.bind(...params).all();
    rows = Array.isArray(res?.results) ? res.results : [];
  } else {
    const res = await stmt.all(...params);
    rows = Array.isArray(res) ? res : [];
  }

  console.info('[ati] starting', { rows: rows.length, chainId: chainId ?? null, concurrency });
  let ok = 0;
  let err = 0;

  await runWithConcurrency(rows, concurrency, async (r) => {
    const c = Number(r?.chainId ?? 0) || 0;
    const a = String(r?.agentId ?? '');
    if (!a) return;
    try {
      await computeAndUpsertATI(db, c, a);
      ok += 1;
    } catch {
      err += 1;
    }
  });

  console.log(JSON.stringify({ ok, err }, null, 2));
})().catch((e) => {
  console.error('[ati] failed', e);
  process.exitCode = 1;
});


