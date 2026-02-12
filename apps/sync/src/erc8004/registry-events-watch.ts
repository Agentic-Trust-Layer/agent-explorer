import { createPublicClient, http, webSocket, type Abi, type Address, type Log } from 'viem';

function normalizeHexAddr(value: unknown): string | null {
  const s = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return /^0x[0-9a-f]{40}$/.test(s) ? s : null;
}

function wsUrlForChainId(chainId: number): string {
  // Prefer explicit per-chain WS env vars
  if (chainId === 1) return process.env.ETH_MAINNET_RPC_WS_URL || process.env.ETH_MAINNET_RPC_WSS_URL || '';
  if (chainId === 11155111) return process.env.ETH_SEPOLIA_RPC_WS_URL || process.env.ETH_SEPOLIA_RPC_WSS_URL || '';
  if (chainId === 84532) return process.env.BASE_SEPOLIA_RPC_WS_URL || process.env.BASE_SEPOLIA_RPC_WSS_URL || '';
  if (chainId === 11155420) return process.env.OP_SEPOLIA_RPC_WS_URL || process.env.OP_SEPOLIA_RPC_WSS_URL || '';
  if (chainId === 59144) return process.env.LINEA_MAINNET_RPC_WS_URL || process.env.LINEA_MAINNET_RPC_WSS_URL || '';
  return process.env[`RPC_WS_URL_${chainId}`] || process.env[`RPC_WSS_URL_${chainId}`] || '';
}

function httpUrlForChainId(chainId: number): string {
  // Prefer explicit per-chain HTTP env vars (already used by other jobs like account-types)
  if (chainId === 1) return process.env.ETH_MAINNET_RPC_HTTP_URL || process.env.ETH_MAINNET_RPC_URL || '';
  if (chainId === 11155111) return process.env.ETH_SEPOLIA_RPC_HTTP_URL || process.env.ETH_SEPOLIA_RPC_URL || '';
  if (chainId === 84532) return process.env.BASE_SEPOLIA_RPC_HTTP_URL || process.env.BASE_SEPOLIA_RPC_URL || '';
  if (chainId === 11155420) return process.env.OP_SEPOLIA_RPC_HTTP_URL || process.env.OP_SEPOLIA_RPC_URL || '';
  if (chainId === 59144) return process.env.LINEA_MAINNET_RPC_HTTP_URL || process.env.LINEA_MAINNET_RPC_URL || '';
  return process.env[`RPC_HTTP_URL_${chainId}`] || process.env[`RPC_URL_${chainId}`] || '';
}

function erc8004IdentityRegistryForChainId(chainId: number): string | null {
  const v =
    chainId === 1
      ? process.env.ETH_MAINNET_IDENTITY_REGISTRY
      : chainId === 11155111
        ? process.env.ETH_SEPOLIA_IDENTITY_REGISTRY
        : chainId === 84532
          ? process.env.BASE_SEPOLIA_IDENTITY_REGISTRY
          : chainId === 11155420
            ? process.env.OP_SEPOLIA_IDENTITY_REGISTRY
            : chainId === 59144
              ? process.env.LINEA_MAINNET_IDENTITY_REGISTRY
            : process.env[`IDENTITY_REGISTRY_${chainId}`];
  const n = normalizeHexAddr(v);
  return n;
}

const ERC721_EVENTS_ABI: Abi = [
  {
    type: 'event',
    name: 'Transfer',
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
  },
  // ERC-4906 (metadata refresh) - optional
  {
    type: 'event',
    name: 'MetadataUpdate',
    anonymous: false,
    inputs: [{ indexed: false, name: '_tokenId', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'BatchMetadataUpdate',
    anonymous: false,
    inputs: [
      { indexed: false, name: '_fromTokenId', type: 'uint256' },
      { indexed: false, name: '_toTokenId', type: 'uint256' },
    ],
  },
] as const;

type Endpoint = { chainId: number; name: string; url: string };

export async function watchErc8004RegistryEventsMultiChain(args: {
  endpoints: Endpoint[];
  debounceMs?: number;
  onAgentIds?: (args: { chainId: number; agentIds: string[] }) => Promise<void>;
}): Promise<never> {
  const endpoints = Array.isArray(args.endpoints) ? args.endpoints : [];
  const debounceMs = Number.isFinite(Number(args.debounceMs)) ? Math.max(1000, Math.trunc(Number(args.debounceMs))) : 7500;
  const onAgentIds = typeof args.onAgentIds === 'function' ? args.onAgentIds : null;

  if (!endpoints.length) throw new Error('[sync] [erc8004-events] no endpoints provided');

  console.info('[sync] [erc8004-events] starting', {
    debounceMs,
    chains: endpoints.map((e) => ({ chainId: e.chainId, name: e.name })),
    hintWsEnv:
      'WS is optional. If ETH_*_RPC_WS_URL is not set, watcher falls back to HTTP polling via ETH_*_RPC_HTTP_URL.',
  });

  const watchers = endpoints.map(async (ep) => {
    const chainId = Math.trunc(Number(ep.chainId));
    const registryAddr = erc8004IdentityRegistryForChainId(chainId);
    if (!registryAddr) {
      console.warn('[sync] [erc8004-events] missing identity registry address; skipping chain', {
        chainId,
        name: ep.name,
        hint: 'Set ETH_*_IDENTITY_REGISTRY or IDENTITY_REGISTRY_<chainId>',
      });
      // Keep process alive: this watcher never resolves.
      // eslint-disable-next-line no-constant-condition
      for (;;) await new Promise((r) => setTimeout(r, 60_000));
    }

    const wsUrl = wsUrlForChainId(chainId);
    const httpUrl = httpUrlForChainId(chainId);
    const mode = wsUrl ? 'ws' : 'http-poll';
    if (!wsUrl && !httpUrl) {
      console.warn('[sync] [erc8004-events] missing RPC url (WS+HTTP); skipping chain', {
        chainId,
        name: ep.name,
        registry: registryAddr,
        hint: 'Set ETH_*_RPC_WS_URL (optional) and/or ETH_*_RPC_HTTP_URL (required for polling fallback)',
      });
      // eslint-disable-next-line no-constant-condition
      for (;;) await new Promise((r) => setTimeout(r, 60_000));
    }

    const client = createPublicClient({
      transport: wsUrl ? webSocket(wsUrl) : http(httpUrl),
      pollingInterval: wsUrl ? undefined : 6000,
    });
    const address = registryAddr as Address;

    const pending = new Set<string>();
    let flushTimer: any = null;

    const scheduleFlush = () => {
      if (flushTimer) return;
      flushTimer = setTimeout(async () => {
        flushTimer = null;
        const batch = Array.from(pending);
        pending.clear();
        if (!batch.length) return;
        if (!onAgentIds) {
          console.info('[sync] [erc8004-events] agentIds queued', { chainId, count: batch.length, agentIds: batch.slice(0, 50) });
          return;
        }
        try {
          await onAgentIds({ chainId, agentIds: batch });
        } catch (e: any) {
          console.warn('[sync] [erc8004-events] onAgentIds handler failed (non-fatal)', {
            chainId,
            count: batch.length,
            error: String(e?.message || e || ''),
          });
        }
      }, debounceMs);
    };

    const onAgentId = (id: string) => {
      const s = String(id || '').trim();
      if (!s) return;
      pending.add(s);
      scheduleFlush();
    };

    const onLogsError = (err: any) => {
      console.warn('[sync] [erc8004-events] watcher error', { chainId, name: ep.name, error: String(err?.message || err || '') });
    };

    // Transfer: treat as “agent changed”. Mint is Transfer(from=0x0).
    client.watchContractEvent({
      address,
      abi: ERC721_EVENTS_ABI,
      eventName: 'Transfer',
      onLogs: (logs: Log[]) => {
        for (const l of logs) {
          const argsAny = (l as any)?.args ?? {};
          const tokenId = argsAny?.tokenId ?? null;
          try {
            const n = typeof tokenId === 'bigint' ? tokenId : BigInt(String(tokenId ?? ''));
            onAgentId(n.toString());
          } catch {}
        }
      },
      onError: onLogsError,
    });

    // MetadataUpdate: treat as “agent updated” if emitted.
    client.watchContractEvent({
      address,
      abi: ERC721_EVENTS_ABI,
      eventName: 'MetadataUpdate',
      onLogs: (logs: Log[]) => {
        for (const l of logs) {
          const argsAny = (l as any)?.args ?? {};
          const tokenId = argsAny?._tokenId ?? null;
          try {
            const n = typeof tokenId === 'bigint' ? tokenId : BigInt(String(tokenId ?? ''));
            onAgentId(n.toString());
          } catch {}
        }
      },
      onError: onLogsError,
    });

    // BatchMetadataUpdate: range; cap to avoid runaway.
    client.watchContractEvent({
      address,
      abi: ERC721_EVENTS_ABI,
      eventName: 'BatchMetadataUpdate',
      onLogs: (logs: Log[]) => {
        for (const l of logs) {
          const argsAny = (l as any)?.args ?? {};
          const fromId = argsAny?._fromTokenId ?? null;
          const toId = argsAny?._toTokenId ?? null;
          try {
            const from = typeof fromId === 'bigint' ? fromId : BigInt(String(fromId ?? ''));
            const to = typeof toId === 'bigint' ? toId : BigInt(String(toId ?? ''));
            if (to < from) continue;
            const span = to - from;
            const cap = 250n;
            const end = span > cap ? from + cap : to;
            for (let x = from; x <= end; x++) onAgentId(x.toString());
            if (end < to) {
              console.warn('[sync] [erc8004-events] batch metadata update range capped', {
                chainId,
                from: from.toString(),
                to: to.toString(),
                emitted: (end - from + 1n).toString(),
              });
            }
          } catch {}
        }
      },
      onError: onLogsError,
    });

    console.info('[sync] [erc8004-events] watching', {
      chainId,
      name: ep.name,
      registry: address,
      mode,
      rpc: (wsUrl || httpUrl).replace(/:\/\/.*@/, '://***@'), // best-effort redaction
    });

    // Keep watcher alive forever.
    // eslint-disable-next-line no-constant-condition
    for (;;) {
      await new Promise((r) => setTimeout(r, 60_000));
      // If there are pending agentIds but no timer (possible if timer was cleared by GC), schedule again.
      if (pending.size > 0) scheduleFlush();
    }
  });

  // Never resolves.
  await Promise.all(watchers);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  throw new Error('unreachable');
}

