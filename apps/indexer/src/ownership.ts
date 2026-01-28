import {
  createPublicClient,
  http,
  type Abi,
  type Address,
  type Chain,
  type Hex,
  type PublicClient,
  getAddress,
} from 'viem';
import { baseSepolia, optimismSepolia, sepolia } from 'viem/chains';
import { getAccountOwner } from './account-owner.js';

import {
  BASE_SEPOLIA_RPC_HTTP_URL,
  ETH_SEPOLIA_RPC_HTTP_URL,
  OP_SEPOLIA_RPC_HTTP_URL,
} from './env';

type ChainConfig = {
  chain: Chain;
  rpcUrl?: string;
};

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAX_RESOLUTION_DEPTH = 4;

const chainConfigs: Record<number, ChainConfig> = {
  11155111: { chain: sepolia, rpcUrl: ETH_SEPOLIA_RPC_HTTP_URL },
  84532: { chain: baseSepolia, rpcUrl: BASE_SEPOLIA_RPC_HTTP_URL },
  11155420: { chain: optimismSepolia, rpcUrl: OP_SEPOLIA_RPC_HTTP_URL },
};

const publicClientCache = new Map<number, PublicClient>();
const missingClientWarning = new Set<number>();
const eoaOwnerCache = new Map<string, string | null>();
const eoaOwnerPromiseCache = new Map<string, Promise<string | null>>();
const unresolvedControllerWarning = new Set<string>();
const maxDepthWarning = new Set<string>();
const cycleWarning = new Set<string>();
const missingClientInfoWarning = new Set<number>();
const bytecodeTypeCache = new Map<string, 'eoa' | 'aa'>();
const bytecodeTypePromiseCache = new Map<string, Promise<'eoa' | 'aa' | null>>();

async function getBytecodeSafe(
  client: PublicClient,
  address: Address,
  retries = 2,
): Promise<Hex | null | undefined> {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await client.getBytecode({ address });
    } catch (e) {
      lastErr = e;
    }
  }
  // Don't spam; callers will decide how to handle unknown bytecode.
  return undefined;
}

function normalizeAddress(value: string | null | undefined): Address | null {
  if (!value) return null;
  let candidate = value.trim();
  if (!candidate) return null;
  if (candidate.includes(':')) {
    const match = candidate.match(/eip155:\d+:(0x[a-fA-F0-9]{40})/);
    if (match && match[1]) {
      candidate = match[1];
    }
  }
  try {
    return getAddress(candidate);
  } catch {
    return null;
  }
}

function cacheKey(chainId: number, address: Address): string {
  return `${chainId}:${address.toLowerCase()}`;
}

function isEoaBytecode(bytecode: Hex | null | undefined): boolean {
  return !bytecode || bytecode === '0x';
}

async function getClient(chainId: number): Promise<PublicClient | null> {
  if (publicClientCache.has(chainId)) {
    return publicClientCache.get(chainId)!;
  }
  const config = chainConfigs[chainId];
  if (!config) {
    if (!missingClientWarning.has(chainId)) {
      missingClientWarning.add(chainId);
      console.warn(`[ownership] No RPC configuration for chain ${chainId}; unable to resolve EOA owner`);
    }
    return null;
  }
  const rpcUrl = config.rpcUrl || config.chain?.rpcUrls?.default?.http?.[0];
  if (!rpcUrl) {
    if (!missingClientWarning.has(chainId)) {
      missingClientWarning.add(chainId);
      console.warn(`[ownership] Missing RPC URL for chain ${chainId}; unable to resolve EOA owner`);
    }
    return null;
  }
  const client = createPublicClient({
    chain: config.chain,
    transport: http(rpcUrl),
  });
  publicClientCache.set(chainId, client);
  return client;
}

async function resolveWithClient(
  chainId: number,
  client: PublicClient,
  account: Address,
  depth: number,
  visited: Set<string>,
): Promise<Address | null> {
  if (depth >= MAX_RESOLUTION_DEPTH) {
    const key = cacheKey(chainId, account);
    if (!maxDepthWarning.has(key)) {
      maxDepthWarning.add(key);
      console.warn(`[ownership] Max resolution depth reached for ${key}; leaving EOA owner NULL`);
    }
    return null;
  }
  const lower = account.toLowerCase();
  if (visited.has(lower)) {
    const key = cacheKey(chainId, account);
    if (!cycleWarning.has(key)) {
      cycleWarning.add(key);
      console.warn(`[ownership] Cycle detected while resolving controller for ${key}; leaving EOA owner NULL`);
    }
    return null;
  }
  visited.add(lower);

  const bytecode = await getBytecodeSafe(client, account);
  if (bytecode === undefined) {
    // If the RPC is flaky, don't force a NULL owner; best-effort by treating this hop as unresolved.
    // Returning null here means "can't prove"; callers may choose a fallback.
    return null;
  }

  if (isEoaBytecode(bytecode)) {
    return account;
  }

  const owner = await getAccountOwner(chainId, account);
  if (!owner) {
    const key = cacheKey(chainId, account);
    if (!unresolvedControllerWarning.has(key)) {
      unresolvedControllerWarning.add(key);
      console.warn(`[ownership] Could not resolve controller/owner for contract ${key}; leaving EOA owner NULL`);
    }
    return null;
  }

  // If the AA exposes an owner/controller address, trust it and stop.
  // (User requirement: do not do additional verification checks.)
  return normalizeAddress(owner);
}

export async function resolveEoaOwner(chainId: number, ownerAddress: string | null | undefined): Promise<string | null> {
  const normalized = normalizeAddress(ownerAddress);
  if (!normalized) {
    return ownerAddress ?? null;
  }
  if (normalized === ZERO_ADDRESS) {
    return normalized;
  }

  const key = cacheKey(chainId, normalized);
  if (eoaOwnerCache.has(key)) {
    return eoaOwnerCache.get(key)!;
  }
  if (eoaOwnerPromiseCache.has(key)) {
    return eoaOwnerPromiseCache.get(key)!;
  }

  const promise: Promise<string | null> = (async () => {
    const client = await getClient(chainId);
    if (!client) {
      return null;
    }
    const visited = new Set<string>();
    const resolved = await resolveWithClient(chainId, client, normalized, 0, visited);
    const out = resolved ? resolved : null;
    // Only cache positive results. Avoid caching null so temporary RPC issues don't poison results.
    if (out) eoaOwnerCache.set(key, out);
    return out;
  })();

  eoaOwnerPromiseCache.set(key, promise);
  try {
    return await promise;
  } finally {
    eoaOwnerPromiseCache.delete(key);
  }
}

export async function getAccountType(chainId: number, address: string | null | undefined): Promise<'eoa' | 'aa' | null> {
  const normalized = normalizeAddress(address);
  if (!normalized) return null;
  if (normalized === ZERO_ADDRESS) return 'eoa';

  const key = cacheKey(chainId, normalized);
  if (bytecodeTypeCache.has(key)) return bytecodeTypeCache.get(key)!;
  if (bytecodeTypePromiseCache.has(key)) return await bytecodeTypePromiseCache.get(key)!;

  const promise: Promise<'eoa' | 'aa' | null> = (async () => {
    const client = await getClient(chainId);
    if (!client) return null;
    try {
      const bytecode = await client.getBytecode({ address: normalized });
      const t: 'eoa' | 'aa' = isEoaBytecode(bytecode) ? 'eoa' : 'aa';
      bytecodeTypeCache.set(key, t);
      return t;
    } catch {
      return null;
    }
  })();
  bytecodeTypePromiseCache.set(key, promise);
  try {
    return await promise;
  } finally {
    bytecodeTypePromiseCache.delete(key);
  }
}

export async function resolveEoaInfo(
  chainId: number,
  address: string | null | undefined,
): Promise<{ accountType: 'eoa' | 'aa'; eoaAddress: string; resolved: boolean } | null> {
  const normalized = normalizeAddress(address);
  if (!normalized) return null;
  const lower = normalized.toLowerCase();
  if (lower === ZERO_ADDRESS) return { accountType: 'eoa', eoaAddress: lower, resolved: true };

  const client = await getClient(chainId);
  if (!client) {
    if (!missingClientInfoWarning.has(chainId)) {
      missingClientInfoWarning.add(chainId);
      console.warn(`[ownership] No RPC client for chain ${chainId}; defaulting accountType=eoa and eoaAddress=self`);
    }
    return { accountType: 'eoa', eoaAddress: lower, resolved: false };
  }

  let bytecode: Hex | null | undefined = null;
  try {
    bytecode = await client.getBytecode({ address: normalized });
  } catch {
    return { accountType: 'eoa', eoaAddress: lower, resolved: false };
  }

  if (isEoaBytecode(bytecode)) {
    bytecodeTypeCache.set(cacheKey(chainId, normalized), 'eoa');
    return { accountType: 'eoa', eoaAddress: lower, resolved: true };
  }

  bytecodeTypeCache.set(cacheKey(chainId, normalized), 'aa');
  const resolved = await resolveEoaOwner(chainId, lower);
  if (resolved) {
    const result = { accountType: 'aa' as const, eoaAddress: resolved.toLowerCase(), resolved: true };
    console.log(`[resolveEoaInfo] Resolved EOA for AA ${lower}: ${result.eoaAddress} (resolved=${result.resolved})`);
    return result;
  }
  // Fallback: we know it's a contract, but couldn't resolve a controller EOA.
  // Keep a value so downstream has something deterministic.
  const fallback = { accountType: 'aa' as const, eoaAddress: lower, resolved: false };
  console.log(`[resolveEoaInfo] Could not resolve EOA for AA ${lower}, using fallback: ${fallback.eoaAddress} (resolved=${fallback.resolved})`);
  return fallback;
}

