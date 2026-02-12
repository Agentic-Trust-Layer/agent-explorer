import { createPublicClient, http, type Abi, type Address, type Chain, type PublicClient } from 'viem';
import { baseSepolia, linea, optimismSepolia, sepolia } from 'viem/chains';
import { getAddress } from 'viem';
import { HybridDeleGator } from '@metamask/smart-accounts-kit/contracts';

import { BASE_SEPOLIA_RPC_HTTP_URL, ETH_SEPOLIA_RPC_HTTP_URL, OP_SEPOLIA_RPC_HTTP_URL, LINEA_MAINNET_RPC_HTTP_URL } from './env';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

type ChainConfig = { chain: Chain; rpcUrl?: string };
const chainConfigs: Record<number, ChainConfig> = {
  11155111: { chain: sepolia, rpcUrl: ETH_SEPOLIA_RPC_HTTP_URL },
  84532: { chain: baseSepolia, rpcUrl: BASE_SEPOLIA_RPC_HTTP_URL },
  11155420: { chain: optimismSepolia, rpcUrl: OP_SEPOLIA_RPC_HTTP_URL },
  59144: { chain: linea, rpcUrl: LINEA_MAINNET_RPC_HTTP_URL },
};

const clientCache = new Map<number, PublicClient>();

function normalizeAddress(value: string | null | undefined): Address | null {
  if (!value) return null;
  let candidate = value.trim();
  if (!candidate) return null;
  if (candidate.includes(':')) {
    const match = candidate.match(/eip155:\d+:(0x[a-fA-F0-9]{40})/);
    if (match && match[1]) candidate = match[1];
  }
  try {
    return getAddress(candidate);
  } catch {
    return null;
  }
}

function is7702DelegatedBytecode(bytecode: string | null | undefined): boolean {
  const b = (bytecode || '').toLowerCase();
  // EIP-7702 delegated code prefix: 0xef0100...
  return b.startsWith('0xef0100');
}

async function getClient(chainId: number): Promise<PublicClient | null> {
  if (clientCache.has(chainId)) return clientCache.get(chainId)!;
  const config = chainConfigs[chainId];
  if (!config) return null;
  const rpcUrl = config.rpcUrl || config.chain?.rpcUrls?.default?.http?.[0];
  if (!rpcUrl) return null;
  const client = createPublicClient({ chain: config.chain, transport: http(rpcUrl) });
  clientCache.set(chainId, client);
  return client;
}

function isRetryableRpcError(e: any): boolean {
  const msg = String(e?.message || e || '').toLowerCase();
  return (
    msg.includes(' 429') ||
    msg.includes('http 429') ||
    msg.includes('rate limit') ||
    msg.includes('too many request') ||
    msg.includes('timeout') ||
    msg.includes('econnreset') ||
    msg.includes('fetch failed')
  );
}

async function tryReadContract<T>(
  client: PublicClient,
  params: any,
  opts?: { retries?: number; baseDelayMs?: number },
): Promise<T | null> {
  const retries = Math.max(0, Math.min(8, opts?.retries ?? 4));
  const baseDelayMs = Math.max(50, Math.min(5_000, opts?.baseDelayMs ?? 200));
  let lastErr: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return (await (client as any).readContract(params)) as T;
    } catch (e: any) {
      lastErr = e;
      if (!isRetryableRpcError(e)) return null;
      if (attempt >= retries) break;
      const backoff = Math.min(30_000, baseDelayMs * Math.pow(2, attempt)) + Math.floor(Math.random() * 150);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw lastErr ?? new Error('RPC retry exhausted');
}

const GET_OWNERS_ABI: Abi = [
  {
    name: 'getOwners',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address[]' }],
  },
] as const;

const ERC173_OWNER_ABI: Abi = [
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
] as const;

export async function getAccountOwner(chainId: number, accountAddress: string): Promise<string | null> {
  const client = await getClient(chainId);
  if (!client) return null;

  const acct = normalizeAddress(accountAddress);
  if (!acct) return null;
  if (acct.toLowerCase() === ZERO_ADDRESS) return acct;

  const bytecode = await client.getBytecode({ address: acct }).catch(() => null);
  if (!bytecode || bytecode === '0x') {
    // EOA => owner is self
    return acct.toLowerCase();
  }

  // EIP-7702 => treat as EOA-like (owner is self)
  if (is7702DelegatedBytecode(bytecode)) return acct.toLowerCase();

  // 1) MetaMask HybridDeleGator (owner())
  try {
    const owner = await tryReadContract<string>(client, {
      address: acct,
      abi: (HybridDeleGator as any).abi,
      functionName: 'owner',
    });
    const normalized = normalizeAddress(owner);
    if (normalized && normalized.toLowerCase() !== ZERO_ADDRESS) return normalized.toLowerCase();
  } catch {}

  // 2) Multisig: getOwners() -> address[]
  try {
    const owners = await tryReadContract<any>(client, {
      address: acct,
      abi: GET_OWNERS_ABI,
      functionName: 'getOwners',
    });
    if (Array.isArray(owners) && owners.length) {
      const normalized = normalizeAddress(String(owners[0]));
      if (normalized && normalized.toLowerCase() !== ZERO_ADDRESS) return normalized.toLowerCase();
    }
  } catch {}

  // 3) ERC-173: owner() -> address
  try {
    const owner = await tryReadContract<string>(client, {
      address: acct,
      abi: ERC173_OWNER_ABI,
      functionName: 'owner',
    });
    const normalized = normalizeAddress(owner);
    if (normalized && normalized.toLowerCase() !== ZERO_ADDRESS) return normalized.toLowerCase();
  } catch {}

  // Unknown contract type
  return null;
}

