import { getGraphdbConfigFromEnv, queryGraphdb, updateGraphdb } from '../graphdb-http.js';
import { listAccountsForChain } from '../graphdb/accounts.js';
import { isSmartAccountViaRpc } from '../net/eth-get-code.js';

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
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

  // Ensure SmartAgent always refers to an actual SmartAccount:
  // - If hasSmartAccount points to an account that is EOA, remove the SmartAgent typing and the hasSmartAccount link.
  const fixup = `
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${ctx}>
DELETE { ?agent a erc8004:SmartAgent . ?agent erc8004:hasSmartAccount ?acct . }
INSERT { ?agent a erc8004:AIAgent8004 . }
WHERE {
  ?agent a erc8004:SmartAgent ;
         erc8004:hasSmartAccount ?acct .
  ?acct a eth:EOAAccount .
}
`;
  await updateGraphdb(baseUrl, repository, auth, fixup);
  console.info('[sync] [account-types] fixed SmartAgent links that pointed to EOAs');
}

