import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb-http.js';

export type AccountRow = {
  account: string; // IRI
  address: string | null; // 0x...
  chainId: number | null;
};

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

function parseAccountIri(accountIri: string): { chainId: number | null; address: string | null } {
  // Expected: https://www.agentictrust.io/id/account/{chainId}/{addressLower}
  try {
    const url = new URL(accountIri);
    const parts = url.pathname.split('/').filter(Boolean);
    const idx = parts.indexOf('account');
    if (idx >= 0 && parts.length >= idx + 3) {
      const chain = Number(parts[idx + 1]);
      const addr = decodeURIComponent(parts[idx + 2]);
      const address = /^0x[0-9a-fA-F]{40}$/.test(addr) ? addr.toLowerCase() : null;
      return { chainId: Number.isFinite(chain) ? chain : null, address };
    }
  } catch {}
  return { chainId: null, address: null };
}

export async function listAccountsForChain(chainId: number, limit: number = 50000): Promise<AccountRow[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);

  const sparql = `
PREFIX eth: <https://agentictrust.io/ontology/eth#>
SELECT ?account ?address ?chainId WHERE {
  GRAPH <${ctx}> {
    ?account a eth:Account .
    OPTIONAL { ?account eth:accountAddress ?address . }
    OPTIONAL { ?account eth:accountChainId ?chainId . }
  }
}
LIMIT ${Math.max(1, Math.min(200000, limit))}
`;

  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  const bindings = res?.results?.bindings;
  if (!Array.isArray(bindings)) return [];

  const out: AccountRow[] = [];
  for (const b of bindings) {
    const account = String(b?.account?.value || '');
    if (!account) continue;
    const parsed = parseAccountIri(account);
    const addressRaw = typeof b?.address?.value === 'string' ? b.address.value : null;
    const address =
      addressRaw && /^0x[0-9a-fA-F]{40}$/.test(addressRaw.trim()) ? addressRaw.trim().toLowerCase() : parsed.address;
    const chainRaw = b?.chainId?.value;
    const chain = chainRaw != null ? Number(chainRaw) : parsed.chainId;
    out.push({ account, address, chainId: Number.isFinite(chain) ? chain : parsed.chainId });
  }
  return out;
}

