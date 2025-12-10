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
const eoaOwnerCache = new Map<string, string>();
const eoaOwnerPromiseCache = new Map<string, Promise<string>>();

const OWNER_ABI = [
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
] as const satisfies Abi;

const CONTROLLER_ABI = [
  {
    type: 'function',
    name: 'controller',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
] as const satisfies Abi;

const GET_OWNER_ABI = [
  {
    type: 'function',
    name: 'getOwner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
] as const satisfies Abi;

const GET_CONTROLLER_ABI = [
  {
    type: 'function',
    name: 'getController',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
] as const satisfies Abi;

const GET_OWNERS_ABI = [
  {
    type: 'function',
    name: 'getOwners',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address[]' }],
  },
] as const satisfies Abi;

const OWNERS_ARRAY_ABI = [
  {
    type: 'function',
    name: 'owners',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address[]' }],
  },
] as const satisfies Abi;

const OWNERS_INDEX_ABI = [
  {
    type: 'function',
    name: 'owners',
    stateMutability: 'view',
    inputs: [{ name: 'index', type: 'uint256' }],
    outputs: [{ type: 'address' }],
  },
] as const satisfies Abi;

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

async function tryReadContract<T>(
  client: PublicClient,
  params: {
    address: Address;
    abi: Abi;
    functionName: string;
    args?: readonly unknown[];
  },
): Promise<T | null> {
  try {
    return (await client.readContract(params as any)) as T;
  } catch {
    return null;
  }
}

async function findControllerAddress(client: PublicClient, account: Address): Promise<Address | null> {
  const tryAddress = async (abi: Abi, functionName: string, args?: readonly unknown[]): Promise<Address | null> => {
    const result = await tryReadContract<Address>(client, { address: account, abi, functionName, args });
    if (result) {
      const normalized = normalizeAddress(result);
      if (normalized && normalized !== ZERO_ADDRESS) {
        return normalized;
      }
    }
    return null;
  };

  const attempts: Array<() => Promise<Address | null>> = [
    () => tryAddress(OWNER_ABI, 'owner'),
    () => tryAddress(CONTROLLER_ABI, 'controller'),
    () => tryAddress(GET_OWNER_ABI, 'getOwner'),
    () => tryAddress(GET_CONTROLLER_ABI, 'getController'),
    async () => {
      const owners = await tryReadContract<readonly Address[]>(client, { address: account, abi: GET_OWNERS_ABI, functionName: 'getOwners' });
      if (owners && owners.length) {
        return normalizeAddress(owners[0]);
      }
      return null;
    },
    async () => {
      const owners = await tryReadContract<readonly Address[]>(client, { address: account, abi: OWNERS_ARRAY_ABI, functionName: 'owners' });
      if (owners && owners.length) {
        return normalizeAddress(owners[0]);
      }
      return null;
    },
    () => tryAddress(OWNERS_INDEX_ABI, 'owners', [0n]),
  ];

  for (const attempt of attempts) {
    try {
      const controller = await attempt();
      if (controller) {
        return controller;
      }
    } catch {
      // Ignore and try next
    }
  }
  return null;
}

async function resolveWithClient(
  chainId: number,
  client: PublicClient,
  account: Address,
  depth: number,
  visited: Set<string>,
): Promise<Address> {
  if (depth >= MAX_RESOLUTION_DEPTH) {
    return account;
  }
  const lower = account.toLowerCase();
  if (visited.has(lower)) {
    return account;
  }
  visited.add(lower);

  let bytecode: Hex | null | undefined = null;
  try {
    bytecode = await client.getBytecode({ address: account });
  } catch {
    return account;
  }

  if (isEoaBytecode(bytecode)) {
    return account;
  }

  const controller = await findControllerAddress(client, account);
  if (!controller) {
    return account;
  }

  return resolveWithClient(chainId, client, controller, depth + 1, visited);
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

  const promise = (async () => {
    const client = await getClient(chainId);
    if (!client) {
      eoaOwnerCache.set(key, normalized);
      return normalized;
    }
    const visited = new Set<string>();
    const resolved = await resolveWithClient(chainId, client, normalized, 0, visited);
    eoaOwnerCache.set(key, resolved);
    return resolved;
  })();

  eoaOwnerPromiseCache.set(key, promise);
  try {
    return await promise;
  } finally {
    eoaOwnerPromiseCache.delete(key);
  }
}

