import '../env';
import { db } from '../db';
import { ensureSchemaInitialized } from '../db';
import { resolveEoaOwner } from '../ownership';

type Row = {
  chainId: number;
  agentId: string;
  agentAccount: string;
  agentIdentityOwnerAccount: string;
};

function parseCaip10ish(value: string | null | undefined): { chainId: number; address: string } | null {
  if (!value) return null;
  const v = String(value).trim();
  const idx = v.indexOf(':');
  if (idx <= 0) return null;
  const chainId = Number(v.slice(0, idx));
  const address = v.slice(idx + 1).trim();
  if (!Number.isFinite(chainId) || chainId <= 0) return null;
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return null;
  return { chainId, address: address.toLowerCase() };
}

async function resolveType(chainId: number, address: string): Promise<{ eoa: string; type: 'eoa' | 'aa' }> {
  const resolved = (await resolveEoaOwner(chainId, address)) ?? address;
  const resolvedLower = String(resolved).toLowerCase();
  const type: 'eoa' | 'aa' = resolvedLower === address.toLowerCase() ? 'eoa' : 'aa';
  return { eoa: resolvedLower, type };
}

function usage(): void {
  console.log('Usage: pnpm --filter erc8004-indexer backfill:account-types');
  console.log('Env: ACCOUNT_TYPES_CHUNK_SIZE=250');
}

(async () => {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    return;
  }
  await ensureSchemaInitialized();
  if (!db) throw new Error('DB not initialized');

  const chunkSize = Number(process.env.ACCOUNT_TYPES_CHUNK_SIZE || 250) || 250;
  const now = Math.floor(Date.now() / 1000);

  let offset = 0;
  let processed = 0;
  while (true) {
    const res = await db
      .prepare(
        `SELECT chainId, agentId, agentAccount, agentIdentityOwnerAccount
         FROM agents
         ORDER BY chainId ASC, CAST(agentId AS INTEGER) ASC, agentId ASC
         LIMIT ? OFFSET ?`,
      )
      .all(chunkSize, offset);

    const rows: Row[] = Array.isArray(res) ? (res as any) : Array.isArray((res as any)?.results) ? (res as any).results : [];
    if (!rows.length) break;

    for (const r of rows) {
      const agentAccount = parseCaip10ish(r.agentAccount);
      const identityOwner = parseCaip10ish(r.agentIdentityOwnerAccount);
      if (!agentAccount || !identityOwner) continue;

      const acct = await resolveType(agentAccount.chainId, agentAccount.address);
      const owner = await resolveType(identityOwner.chainId, identityOwner.address);

      await db
        .prepare(
          `UPDATE agents SET
             agentAccountType = ?,
             agentIdentityOwnerAccountType = ?,
             eoaAgentAccount = ?,
             eoaAgentIdentityOwnerAccount = ?,
             updatedAtTime = COALESCE(updatedAtTime, ?)
           WHERE chainId = ? AND agentId = ?`,
        )
        .run(
          acct.type,
          owner.type,
          `${agentAccount.chainId}:${acct.eoa}`,
          `${identityOwner.chainId}:${owner.eoa}`,
          now,
          r.chainId,
          r.agentId,
        );

      processed += 1;
      if (processed % 200 === 0) {
        console.log('[account-types] progress', { processed, last: { chainId: r.chainId, agentId: r.agentId } });
      }
    }

    offset += rows.length;
  }

  console.log('[account-types] done', { processed });
})().catch((e) => {
  console.error('[account-types] failed', e);
  process.exitCode = 1;
});


