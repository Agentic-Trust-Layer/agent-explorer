import { createPublicClient, http, type Abi } from 'viem';
import { getAddress } from 'viem/utils';
import { HybridDeleGator } from '@metamask/smart-accounts-kit/contracts';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

function normalizeAddress(value: string | null | undefined): string | null {
  if (!value) return null;
  let candidate = value.trim();
  if (!candidate) return null;
  if (candidate.includes(':')) {
    const match = candidate.match(/eip155:\d+:(0x[a-fA-F0-9]{40})/);
    if (match && match[1]) candidate = match[1];
  }
  try {
    return getAddress(candidate).toLowerCase();
  } catch {
    return null;
  }
}

function is7702DelegatedBytecode(bytecode: string | null | undefined): boolean {
  const b = (bytecode || '').toLowerCase();
  return b.startsWith('0xef0100');
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
  client: ReturnType<typeof createPublicClient>,
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
    type: 'function',
    name: 'getOwners',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address[]' }],
  },
];

const ERC173_OWNER_ABI: Abi = [
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
];

export async function getAccountOwner(args: { rpcUrl: string; address: string }): Promise<string | null> {
  const rpcUrl = args.rpcUrl;
  const acct = normalizeAddress(args.address);
  if (!acct) return null;
  if (acct === ZERO_ADDRESS) return acct;

  const client = createPublicClient({ transport: http(rpcUrl) });

  const bytecode = await (client as any).getBytecode({ address: acct }).catch(() => null);
  if (!bytecode || bytecode === '0x') {
    // EOA => owner is self
    return acct;
  }

  // EIP-7702 => treat as EOA-like (owner is self)
  if (is7702DelegatedBytecode(bytecode)) return acct;

  // 1) MetaMask HybridDeleGator (owner())
  try {
    const owner = await tryReadContract<string>(client as any, {
      address: acct,
      abi: (HybridDeleGator as any).abi,
      functionName: 'owner',
    });
    const normalized = normalizeAddress(owner);
    if (normalized && normalized !== ZERO_ADDRESS) return normalized;
  } catch {}

  // 2) Multisig: getOwners() -> address[]
  try {
    const owners = await tryReadContract<any>(client as any, {
      address: acct,
      abi: GET_OWNERS_ABI,
      functionName: 'getOwners',
    });
    if (Array.isArray(owners) && owners.length) {
      const normalized = normalizeAddress(String(owners[0]));
      if (normalized && normalized !== ZERO_ADDRESS) return normalized;
    }
  } catch {}

  // 3) ERC-173: owner() -> address
  try {
    const owner = await tryReadContract<string>(client as any, {
      address: acct,
      abi: ERC173_OWNER_ABI,
      functionName: 'owner',
    });
    const normalized = normalizeAddress(owner);
    if (normalized && normalized !== ZERO_ADDRESS) return normalized;
  } catch {}

  return null;
}

