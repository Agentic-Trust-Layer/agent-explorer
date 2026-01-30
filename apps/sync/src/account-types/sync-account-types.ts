import { getGraphdbConfigFromEnv, queryGraphdb, updateGraphdb } from '../graphdb-http.js';
import { listAccountsForChain } from '../graphdb/accounts.js';
import { getCheckpoint, setCheckpoint } from '../graphdb/checkpoints.js';
import { isSmartAccountViaRpc } from '../net/eth-get-code.js';
import { getAccountOwner } from '../net/account-owner.js';
import { createHash } from 'node:crypto';

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

function iriEncodeSegment(value: string): string {
  return encodeURIComponent(value).replace(/%/g, '_');
}

function accountIriPlain(chainId: number, address: string): string {
  return `https://www.agentictrust.io/id/account/${chainId}/${iriEncodeSegment(String(address).toLowerCase())}`;
}

function rpcUrlForChain(chainId: number): string {
  // Prefer explicit per-chain env vars
  if (chainId === 11155111) return process.env.ETH_SEPOLIA_RPC_HTTP_URL || process.env.ETH_SEPOLIA_RPC_URL || '';
  if (chainId === 84532) return process.env.BASE_SEPOLIA_RPC_HTTP_URL || process.env.BASE_SEPOLIA_RPC_URL || '';
  if (chainId === 11155420) return process.env.OP_SEPOLIA_RPC_HTTP_URL || process.env.OP_SEPOLIA_RPC_URL || '';
  // Generic fallback
  return process.env[`RPC_HTTP_URL_${chainId}`] || process.env[`RPC_URL_${chainId}`] || '';
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = new Array(Math.max(1, concurrency)).fill(0).map(async () => {
    while (true) {
      const idx = next++;
      if (idx >= items.length) break;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

export async function syncAccountTypesForChain(chainId: number, opts?: { limit?: number; concurrency?: number }): Promise<void> {
  const rpcUrl = rpcUrlForChain(chainId);
  if (!rpcUrl) {
    throw new Error(
      `[sync] missing RPC url for chainId=${chainId}. Set ETH_SEPOLIA_RPC_HTTP_URL / BASE_SEPOLIA_RPC_HTTP_URL / OP_SEPOLIA_RPC_HTTP_URL or RPC_HTTP_URL_${chainId}`,
    );
  }

  const limit = opts?.limit ?? 50000;
  const concurrency = Math.max(1, Math.min(25, opts?.concurrency ?? 10));

  const ctx = chainContext(chainId);
  const accounts = await listAccountsForChain(chainId, limit);
  const usable = accounts.filter((a) => a.address && a.chainId === chainId);

  // Fingerprint inputs so watch-mode doesn't redo expensive RPC classification when nothing changed.
  // (We treat "no new accounts" as "no need to re-run account-types".)
  const fingerprint = createHash('sha256')
    .update(
      usable
        .map((a) => `${a.account}|${a.address ?? ''}`)
        .sort()
        .join('\n'),
    )
    .digest('hex');
  const cpSection = 'account-types-fingerprint';
  const prev = await getCheckpoint(chainId, cpSection).catch(() => null);
  if (prev === fingerprint) {
    console.info(`[sync] [account-types] chainId=${chainId} unchanged; skipping (usable=${usable.length})`);
    return;
  }

  console.info(`[sync] [account-types] chainId=${chainId} accounts=${accounts.length} usable=${usable.length}`);

  // Diagnostics: confirm the chain context actually has data
  try {
    const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
    const diag = `
PREFIX eth: <https://agentictrust.io/ontology/eth#>
SELECT (COUNT(*) AS ?triples) (COUNT(DISTINCT ?a) AS ?accounts) WHERE {
  GRAPH <${ctx}> {
    ?s ?p ?o .
    OPTIONAL { ?a a eth:Account . }
  }
}
`;
    const res = await queryGraphdb(baseUrl, repository, auth, diag);
    const b = res?.results?.bindings?.[0];
    const triples = b?.triples?.value ?? '0';
    const accountsInGraph = b?.accounts?.value ?? '0';
    console.info('[sync] [account-types] graph diagnostics', { baseUrl, repository, ctx, triples, accounts: accountsInGraph });
  } catch (e: any) {
    console.warn('[sync] [account-types] diagnostics failed', { chainId, ctx, err: String(e?.message || e || '') });
  }

  const classified = await mapWithConcurrency(
    usable,
    concurrency,
    async (row) => {
      let smart = false;
      let lastErr: any = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          smart = await isSmartAccountViaRpc(rpcUrl, row.address!);
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
          await new Promise((r) => setTimeout(r, 250 * Math.pow(2, attempt)));
        }
      }
      if (lastErr) {
        console.warn('[sync] [account-types] rpc check failed; treating as EOA', { chainId, account: row.account, address: row.address, err: String(lastErr?.message || lastErr) });
      }
      return { account: row.account, smart };
    },
  );

  const smartSet = new Set(classified.filter((c) => c.smart).map((c) => c.account));
  const eoaSet = new Set(classified.filter((c) => !c.smart).map((c) => c.account));

  console.info(`[sync] [account-types] chainId=${chainId} smart=${smartSet.size} eoa=${eoaSet.size}`);

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();

  const chunkSize = 250;
  const allAccounts = classified.map((c) => c.account);
  for (let i = 0; i < allAccounts.length; i += chunkSize) {
    const chunk = allAccounts.slice(i, i + chunkSize);
    const valueRows: string[] = [];
    for (const acct of chunk) {
      const isSmart = smartSet.has(acct);
      const t = isSmart ? 'eth:SmartAccount' : 'eth:EOAAccount';
      valueRows.push(`(<${acct}> ${t})`);
    }

    const update = `
PREFIX eth: <https://agentictrust.io/ontology/eth#>
WITH <${ctx}>
DELETE { ?a a eth:EOAAccount . ?a a eth:SmartAccount . }
INSERT { ?a a ?t . }
WHERE {
  VALUES (?a ?t) {
    ${valueRows.join('\n    ')}
  }
}
`;
    await updateGraphdb(baseUrl, repository, auth, update);
    console.info(`[sync] [account-types] updated ${chunk.length} accounts (chunk ${i / chunkSize + 1})`);
  }

  // Ensure SmartAgent always refers to an actual AgentAccount (typed as eth:SmartAccount after classification):
  // - If hasAgentAccount points to an account that is EOA, remove the SmartAgent typing and the hasAgentAccount link.
  const fixup = `
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${ctx}>
DELETE { ?agent a erc8004:SmartAgent . ?agent erc8004:hasAgentAccount ?acct . }
INSERT { ?agent a erc8004:AIAgent8004 . }
WHERE {
  ?agent a erc8004:SmartAgent ;
         erc8004:hasAgentAccount ?acct .
  ?acct a eth:EOAAccount .
}
`;
  await updateGraphdb(baseUrl, repository, auth, fixup);
  console.info('[sync] [account-types] fixed SmartAgent links that pointed to EOAs');

  // Always resolve SmartAccount -> EOA owner relationship (eth:hasEOAOwner).
  const smartRows = usable.filter((r) => r.address && smartSet.has(r.account));
  console.info(`[sync] [account-types] resolving eoa owners for smart accounts count=${smartRows.length}`);

  const resolved = await mapWithConcurrency(
    smartRows,
    // Keep this low; owner resolution fans out into multiple RPC calls and many providers 429 easily.
    1,
    async (row) => {
      try {
        console.info('[sync] [account-types] resolve owner for agentAccount', { chainId, agentAccount: row.account, address: row.address });
        const owner = await getAccountOwner({ rpcUrl, address: row.address! });
        console.info('[sync] [account-types] resolved owner for agentAccount', {
          chainId,
          agentAccount: row.account,
          address: row.address,
          owner,
          wroteEthHasEOAOwner: Boolean(owner && owner.toLowerCase() !== row.address!.toLowerCase()),
        });
        // Only write eth:hasEOAOwner when we actually found a distinct owner address.
        if (!owner) return null;
        if (owner.toLowerCase() === row.address!.toLowerCase()) return null;
        return { smartAccountIri: row.account, eoaAddress: owner };
      } catch (e: any) {
        console.warn('[sync] [account-types] failed to resolve eoa owner', {
          chainId,
          smart: row.address,
          err: String(e?.message || e),
        });
        return null;
      }
    },
  );

  const pairs = resolved.filter(Boolean) as Array<{ smartAccountIri: string; eoaAddress: string }>;
  console.info(`[sync] [account-types] resolved eoa owners count=${pairs.length}`);

  const chunkPairs = 150;
  for (let i = 0; i < pairs.length; i += chunkPairs) {
    const chunk = pairs.slice(i, i + chunkPairs);
    const valueRows: string[] = [];
    for (const p of chunk) {
      const eoaIri = accountIriPlain(chainId, p.eoaAddress);
      valueRows.push(`(<${p.smartAccountIri}> <${eoaIri}> "${chainId}"^^<http://www.w3.org/2001/XMLSchema#integer> "${p.eoaAddress}")`);
    }

    const updateOwners = `
PREFIX eth: <https://agentictrust.io/ontology/eth#>
WITH <${ctx}>
DELETE { ?smart eth:hasEOAOwner ?old . }
INSERT {
  ?smart eth:hasEOAOwner ?eoa .
  ?eoa a eth:Account, eth:EOAAccount ;
       eth:accountChainId ?chainId ;
       eth:accountAddress ?addr .
}
WHERE {
  VALUES (?smart ?eoa ?chainId ?addr) {
    ${valueRows.join('\n    ')}
  }
  OPTIONAL { ?smart eth:hasEOAOwner ?old . }
}
`;
    await updateGraphdb(baseUrl, repository, auth, updateOwners);
    console.info(`[sync] [account-types] updated eth:hasEOAOwner for ${chunk.length} smart accounts (chunk ${i / chunkPairs + 1})`);
  }

  // Populate agentOwnerEOAAccount for SmartAgent from its agentAccount's eth:hasEOAOwner.
  const updateAgentOwnerEoa = `
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${ctx}>
DELETE { ?agent erc8004:agentOwnerEOAAccount ?old . }
INSERT { ?agent erc8004:agentOwnerEOAAccount ?eoa . }
WHERE {
  ?agent a erc8004:SmartAgent ;
         erc8004:hasAgentAccount ?acct .
  ?acct eth:hasEOAOwner ?eoa .
  OPTIONAL { ?agent erc8004:agentOwnerEOAAccount ?old . }
}
`;
  await updateGraphdb(baseUrl, repository, auth, updateAgentOwnerEoa);
  console.info('[sync] [account-types] updated SmartAgent agentOwnerEOAAccount from eth:hasEOAOwner');

  // Populate hasOwnerEOAAccount on AgentIdentity8004:
  // - if identity ownerAccount is an EOA => ownerEOA = ownerAccount
  // - if identity ownerAccount has eth:hasEOAOwner => ownerEOA = that EOA
  const updateIdentityOwnerEoa = `
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${ctx}>
DELETE { ?identity erc8004:hasOwnerEOAAccount ?old . }
INSERT { ?identity erc8004:hasOwnerEOAAccount ?eoa . }
WHERE {
  ?identity a erc8004:AgentIdentity8004 ;
            erc8004:hasOwnerAccount ?owner .
  OPTIONAL { ?owner a eth:EOAAccount . BIND(?owner AS ?eoaDirect) }
  OPTIONAL { FILTER(!BOUND(?eoaDirect)) ?owner eth:hasEOAOwner ?eoaIndirect . }
  BIND(COALESCE(?eoaDirect, ?eoaIndirect) AS ?eoa)
  FILTER(BOUND(?eoa))
  OPTIONAL { ?identity erc8004:hasOwnerEOAAccount ?old . }
}
`;
  await updateGraphdb(baseUrl, repository, auth, updateIdentityOwnerEoa);
  console.info('[sync] [account-types] updated AgentIdentity8004 hasOwnerEOAAccount (from ownerAccount / eth:hasEOAOwner)');

  await setCheckpoint(chainId, cpSection, fingerprint).catch(() => {});
}

