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
  if (chainId === 1) return process.env.ETH_MAINNET_RPC_HTTP_URL || process.env.ETH_MAINNET_RPC_URL || '';
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
      `[sync] missing RPC url for chainId=${chainId}. Set ETH_MAINNET_RPC_HTTP_URL / ETH_SEPOLIA_RPC_HTTP_URL / BASE_SEPOLIA_RPC_HTTP_URL / OP_SEPOLIA_RPC_HTTP_URL or RPC_HTTP_URL_${chainId}`,
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
    // IMPORTANT: do NOT use "?s ?p ?o" here. That forces a full triple scan and can stall GraphDB,
    // especially while this job is running large SPARQL UPDATEs.
    // Keep diagnostics index-friendly (type-based counts).
    const diag = `
PREFIX eth: <https://agentictrust.io/ontology/eth#>
SELECT ?accounts ?eoa ?smart WHERE {
  {
    SELECT (COUNT(DISTINCT ?a) AS ?accounts) WHERE {
      GRAPH <${ctx}> { ?a a eth:Account . }
    }
  }
  {
    SELECT (COUNT(DISTINCT ?eoaA) AS ?eoa) WHERE {
      GRAPH <${ctx}> { ?eoaA a eth:EOAAccount . }
    }
  }
  {
    SELECT (COUNT(DISTINCT ?smartA) AS ?smart) WHERE {
      GRAPH <${ctx}> { ?smartA a eth:SmartAccount . }
    }
  }
}
`;
    const res = await queryGraphdb(baseUrl, repository, auth, diag);
    const b = res?.results?.bindings?.[0];
    const accountsInGraph = b?.accounts?.value ?? '0';
    const eoaInGraph = b?.eoa?.value ?? '0';
    const smartInGraph = b?.smart?.value ?? '0';
    console.info('[sync] [account-types] graph diagnostics', {
      baseUrl,
      repository,
      ctx,
      accounts: accountsInGraph,
      eoa: eoaInGraph,
      smart: smartInGraph,
    });
  } catch (e: any) {
    console.warn('[sync] [account-types] diagnostics failed', { chainId, ctx, err: String(e?.message || e || '') });
  }

  const classified = await mapWithConcurrency(
    usable,
    concurrency,
    async (row) => {
      let smart: boolean | null = false;
      let lastErr: any = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          smart = await isSmartAccountViaRpc(rpcUrl, row.address!);
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
          const msg = String((e as any)?.message || e || '');
          const is429 = msg.includes(' 429') || msg.includes('"code":429') || msg.toLowerCase().includes('too many');
          const base = is429 ? 2_000 : 250;
          await new Promise((r) => setTimeout(r, base * Math.pow(2, attempt)));
        }
      }
      if (lastErr) {
        // IMPORTANT: don't poison account typing on rate limits / transient RPC failures.
        // Leave it unknown; a later run (with a healthier RPC) can classify it correctly.
        smart = null;
        console.warn('[sync] [account-types] rpc check failed; leaving untyped', {
          chainId,
          account: row.account,
          address: row.address,
          err: String(lastErr?.message || lastErr),
        });
      }
      return { account: row.account, smart };
    },
  );

  const smartSet = new Set(classified.filter((c) => c.smart === true).map((c) => c.account));
  const eoaSet = new Set(classified.filter((c) => c.smart === false).map((c) => c.account));
  const unknownSet = new Set(classified.filter((c) => c.smart == null).map((c) => c.account));

  console.info(`[sync] [account-types] chainId=${chainId} smart=${smartSet.size} eoa=${eoaSet.size} unknown=${unknownSet.size}`);

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();

  // Keep GraphDB responsive: write in small chunks and pause between updates.
  // Large SPARQL UPDATEs can stall the repo (esp. with inference enabled).
  const chunkSize = 25;
  const knownAccounts = classified.filter((c) => c.smart != null).map((c) => c.account);
  for (let i = 0; i < knownAccounts.length; i += chunkSize) {
    const chunk = knownAccounts.slice(i, i + chunkSize);
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
    try {
      // Fail fast so this job doesn't make GraphDB unusable for minutes.
      await updateGraphdb(baseUrl, repository, auth, update, { timeoutMs: 15_000, retries: 0 });
      console.info(`[sync] [account-types] updated ${chunk.length} accounts (chunk ${i / chunkSize + 1})`);
    } catch (e: any) {
      console.warn('[sync] [account-types] typing update timed out/failed; stopping early to keep GraphDB responsive', {
        chainId,
        ctx,
        chunk: i / chunkSize + 1,
        err: String(e?.message || e || ''),
      });
      return;
    }
    // Small pause between chunks to reduce write pressure.
    await new Promise((r) => setTimeout(r, 250));
  }

  // Ensure AISmartAgent always refers to an actual SmartAccount (typed as eth:SmartAccount after classification):
  // - If core:hasAgentAccount points to an account that is EOA, remove the AISmartAgent typing and the link.
  //
  // IMPORTANT: the naive graph-wide join can stall GraphDB during update-heavy periods.
  // Rewrite this as a VALUES-driven update using the EOA account list we *already* computed via RPC.
  const eoaAccounts = usable.filter((r) => r.address && eoaSet.has(r.account)).map((r) => r.account);
  // Keep this small; even though it's VALUES-driven, GraphDB can be busy right after big UPDATEs.
  const fixChunk = 50;
  let attemptedAccounts = 0;
  // Give GraphDB a brief breather after the large account typing updates.
  await new Promise((r) => setTimeout(r, 500));
  for (let i = 0; i < eoaAccounts.length; i += fixChunk) {
    const chunk = eoaAccounts.slice(i, i + fixChunk);
    if (!chunk.length) continue;
    attemptedAccounts += chunk.length;
    const valueRows = chunk.map((acct) => `(<${acct}>)`).join('\n    ');
    const fixup = `
PREFIX core: <https://agentictrust.io/ontology/core#>
WITH <${ctx}>
DELETE { ?agent a core:AISmartAgent . ?agent core:hasAgentAccount ?acct . }
WHERE {
  VALUES (?acct) {
    ${valueRows}
  }
  ?agent a core:AISmartAgent ;
         core:hasAgentAccount ?acct .
}
`;
    try {
      // Fail fast: this fixup is best-effort and should not block the whole sync job.
      await updateGraphdb(baseUrl, repository, auth, fixup, { timeoutMs: 10_000, retries: 0 });
      console.info(`[sync] [account-types] fixed AISmartAgent links for ${chunk.length} EOA accounts (chunk ${i / fixChunk + 1})`);
    } catch (e: any) {
      console.warn('[sync] [account-types] AISmartAgent fixup timed out/failed; skipping remaining fixup work', {
        chainId,
        ctx,
        err: String(e?.message || e || ''),
      });
      break;
    }
  }
  console.info('[sync] [account-types] fixed AISmartAgent links that pointed to EOAs', { attemptedAccounts });

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

  // Populate erc8004:hasOwnerEOAAccount on AgentIdentity8004:
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

