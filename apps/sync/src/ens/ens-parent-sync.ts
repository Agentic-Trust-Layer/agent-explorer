import { createPublicClient, http, zeroAddress, type Abi } from 'viem';
import { namehash, normalize } from 'viem/ens';
import { ingestSubgraphTurtleToGraphdb } from '../graphdb-ingest.js';
import { fetchAllFromSubgraph } from '../subgraph-client.js';
import {
  ENS_MAINNET_GRAPHQL_URL,
  ENS_SEPOLIA_GRAPHQL_URL,
  GRAPHQL_API_KEY,
  LINEA_MAINNET_GRAPHQL_URL,
  LINEA_SEPOLIA_GRAPHQL_URL,
} from '../env.js';
import {
  accountIri,
  accountIdentifierIri,
  agentDescriptorIriFromAgentIri,
  agentIriFromAccountDid,
  escapeTurtleString,
  iriEncodeSegment,
  rdfPrefixes,
  turtleJsonLiteral,
} from '../rdf/common.js';

// Default registry for mainnet/Sepolia (canonical ENS)
const DEFAULT_ENS_REGISTRY_MAINNET = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

// Linea naming registry contracts (used for tokenURI(name) + owner(node) fallback).
// These are required because the Linea naming subgraph does not currently expose domain resolver/name fields.
const DEFAULT_LINEA_NAMING_REGISTRY_MAINNET = '0x257ed5b68c2a32273db8490e744028a63acc771f';
const DEFAULT_LINEA_NAMING_REGISTRY_SEPOLIA = '0x257ed5b68c2a32273db8490e744028a63acc771f';

// ENS mainnet subgraph ID (Graph Network / Explorer) used when ENS_MAINNET_GRAPHQL_URL is not set.
// Requires GRAPHQL_API_KEY for gateway.thegraph.com.
const ENS_MAINNET_SUBGRAPH_ID = '5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH';

function getChainSuffix(chainId: number): string {
  if (chainId === 1) return 'MAINNET';
  if (chainId === 11155111) return 'SEPOLIA';
  if (chainId === 84532) return 'BASE_SEPOLIA';
  if (chainId === 11155420) return 'OPTIMISM_SEPOLIA';
  if (chainId === 59144) return 'LINEA';
  if (chainId === 59141) return 'LINEA_SEPOLIA';
  return String(chainId);
}

function getEnsRegistryForChain(chainId: number): string {
  const suffix = getChainSuffix(chainId);
  const val = process.env[`AGENTIC_TRUST_ENS_REGISTRY_${suffix}`]?.trim();
  if (val && val.startsWith('0x') && val.length === 42) return val;
  if (chainId === 1 || chainId === 11155111) return DEFAULT_ENS_REGISTRY_MAINNET;
  if (chainId === 59144) return DEFAULT_LINEA_NAMING_REGISTRY_MAINNET;
  if (chainId === 59141) return DEFAULT_LINEA_NAMING_REGISTRY_SEPOLIA;
  return '';
}

function getEnsResolverForChain(chainId: number): string | null {
  const suffix = getChainSuffix(chainId);
  const val = process.env[`AGENTIC_TRUST_ENS_RESOLVER_${suffix}`]?.trim();
  if (val && val.startsWith('0x') && val.length === 42) return val;
  return null;
}

const ENS_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'resolver',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: 'resolver', type: 'address' }],
  },
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: 'owner', type: 'address' }],
  },
] as const satisfies Abi;

const ERC721_METADATA_ABI = [
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
  },
] as const satisfies Abi;

const RESOLVER_ABI = [
  // addr(bytes32) -> address (most resolvers)
  {
    type: 'function',
    name: 'addr',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: 'addr', type: 'address' }],
  },
  // name(bytes32) -> string (some naming resolvers expose forward name)
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: 'name', type: 'string' }],
  },
  // addr(bytes32,uint256) -> bytes (multi-coin resolvers)
  {
    type: 'function',
    name: 'addr',
    stateMutability: 'view',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'coinType', type: 'uint256' },
    ],
    outputs: [{ name: 'addr', type: 'bytes' }],
  },
  // text(bytes32,string) -> string
  {
    type: 'function',
    name: 'text',
    stateMutability: 'view',
    inputs: [
      { name: 'node', type: 'bytes32' },
      { name: 'key', type: 'string' },
    ],
    outputs: [{ name: 'value', type: 'string' }],
  },
] as const satisfies Abi;

function getRpcUrl(chainId: number): string {
  if (chainId === 1) return process.env.ETH_MAINNET_RPC_HTTP_URL || process.env.ETH_MAINNET_RPC_URL || '';
  if (chainId === 11155111) return process.env.ETH_SEPOLIA_RPC_HTTP_URL || process.env.ETH_SEPOLIA_RPC_URL || '';
  if (chainId === 84532) return process.env.BASE_SEPOLIA_RPC_HTTP_URL || process.env.BASE_SEPOLIA_RPC_URL || '';
  if (chainId === 11155420) return process.env.OP_SEPOLIA_RPC_HTTP_URL || process.env.OP_SEPOLIA_RPC_URL || '';
  if (chainId === 59144)
    return process.env.LINEA_MAINNET_RPC_HTTP_URL || process.env.LINEA_MAINNET_RPC_URL || process.env.RPC_HTTP_URL_59144 || process.env.RPC_URL_59144 || '';
  if (chainId === 59141)
    return process.env.LINEA_SEPOLIA_RPC_HTTP_URL || process.env.LINEA_SEPOLIA_RPC_URL || process.env.RPC_HTTP_URL_59141 || process.env.RPC_URL_59141 || '';
  return process.env[`RPC_HTTP_URL_${chainId}`] || process.env[`RPC_URL_${chainId}`] || '';
}

function normalizeEthAddress(value: unknown): `0x${string}` | null {
  const s = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!/^0x[0-9a-f]{40}$/.test(s)) return null;
  return s as `0x${string}`;
}

function ensNameIri(chainId: number, ensName: string): string {
  return `<https://www.agentictrust.io/id/ens-name/${chainId}/${iriEncodeSegment(ensName)}>`;
}

function ensNameDescriptorIri(chainId: number, ensName: string): string {
  return `<https://www.agentictrust.io/id/ens-name-descriptor/${chainId}/${iriEncodeSegment(ensName)}>`;
}

type TokenUriMeta = {
  name?: string | null;
  address?: string | null;
  description?: string | null;
  url?: string | null;
};

function tryParseTokenUriMeta(tokenUri: string): TokenUriMeta | null {
  const uri = String(tokenUri || '').trim();
  if (!uri) return null;

  const extract = (json: any): TokenUriMeta => {
    const name = normalizeEnsNameOrNull(json?.name);
    const address = normalizeEthAddress(json?.address ?? json?.resolvedAddress ?? json?.addr);
    const description = typeof json?.description === 'string' ? json.description.trim() : null;
    const url = typeof json?.url === 'string' ? json.url.trim() : null;
    return { name, address, description, url };
  };

  // Common pattern: data:application/json;base64,eyJuYW1lIjoiLi4uIn0=
  const base64Prefix = 'data:application/json;base64,';
  if (uri.startsWith(base64Prefix)) {
    const b64 = uri.slice(base64Prefix.length).trim();
    try {
      const jsonText = Buffer.from(b64, 'base64').toString('utf8');
      const json = JSON.parse(jsonText);
      return extract(json);
    } catch {
      return null;
    }
  }

  // Less common pattern: data:application/json;utf8,{...}
  const utf8Prefix = 'data:application/json;utf8,';
  if (uri.startsWith(utf8Prefix)) {
    const jsonText = uri.slice(utf8Prefix.length);
    try {
      const json = JSON.parse(jsonText);
      return extract(json);
    } catch {
      return null;
    }
  }

  return null;
}

async function isContractDeployed(
  client: ReturnType<typeof createPublicClient>,
  address: `0x${string}` | null,
): Promise<boolean> {
  if (!address) return false;
  try {
    const bytecode = await client.getBytecode({ address });
    return typeof bytecode === 'string' && bytecode !== '0x';
  } catch {
    return false;
  }
}

async function readResolverText(
  client: ReturnType<typeof createPublicClient>,
  resolver: `0x${string}`,
  node: `0x${string}`,
  key: string,
): Promise<string | null> {
  try {
    const v = await client.readContract({
      address: resolver,
      abi: RESOLVER_ABI,
      functionName: 'text',
      args: [node, key],
    });
    const s = typeof v === 'string' ? v.trim() : '';
    return s ? s : null;
  } catch {
    return null;
  }
}

async function readResolverName(
  client: ReturnType<typeof createPublicClient>,
  resolver: `0x${string}`,
  node: `0x${string}`,
): Promise<string | null> {
  try {
    const v = await client.readContract({
      address: resolver,
      abi: RESOLVER_ABI,
      functionName: 'name',
      args: [node],
    });
    const s = typeof v === 'string' ? v.trim() : '';
    return s ? s : null;
  } catch {
    return null;
  }
}

async function readTokenUriName(
  client: ReturnType<typeof createPublicClient>,
  contract: `0x${string}`,
  node: `0x${string}`,
): Promise<string | null> {
  try {
    const tokenId = BigInt(node);
    const uri = await client.readContract({
      address: contract,
      abi: ERC721_METADATA_ABI,
      functionName: 'tokenURI',
      args: [tokenId],
    });
    const meta = typeof uri === 'string' ? tryParseTokenUriMeta(uri) : null;
    return meta?.name ? normalizeEnsNameOrNull(meta.name) : null;
  } catch {
    return null;
  }
}

async function readTokenUriMeta(
  client: ReturnType<typeof createPublicClient>,
  contract: `0x${string}`,
  node: `0x${string}`,
): Promise<TokenUriMeta | null> {
  try {
    const tokenId = BigInt(node);
    const uri = await client.readContract({
      address: contract,
      abi: ERC721_METADATA_ABI,
      functionName: 'tokenURI',
      args: [tokenId],
    });
    if (typeof uri !== 'string') return null;
    const meta = tryParseTokenUriMeta(uri);
    if (!meta) return null;
    return {
      name: meta.name ? normalizeEnsNameOrNull(meta.name) : null,
      address: meta.address ? normalizeEthAddress(meta.address) : null,
      description: typeof meta.description === 'string' && meta.description.trim() ? meta.description.trim() : null,
      url: typeof meta.url === 'string' && meta.url.trim() ? meta.url.trim() : null,
    };
  } catch {
    return null;
  }
}

async function readRegistryOwnerAddress(
  client: ReturnType<typeof createPublicClient>,
  registry: `0x${string}`,
  node: `0x${string}`,
): Promise<`0x${string}` | null> {
  try {
    const v = await client.readContract({
      address: registry,
      abi: ENS_REGISTRY_ABI,
      functionName: 'owner',
      args: [node],
    });
    const addr = normalizeEthAddress(v as any);
    if (!addr || addr === zeroAddress) return null;
    return addr;
  } catch {
    return null;
  }
}

async function readResolverEthAddress(
  client: ReturnType<typeof createPublicClient>,
  resolver: `0x${string}`,
  node: `0x${string}`,
): Promise<`0x${string}` | null> {
  // Try addr(bytes32) first.
  try {
    const v = await client.readContract({
      address: resolver,
      abi: RESOLVER_ABI,
      functionName: 'addr',
      args: [node],
    });
    const addr = normalizeEthAddress(v as any);
    if (addr && addr !== zeroAddress) return addr;
  } catch {
    // ignore
  }

  // Fallback: multi-coin addr(bytes32,uint256) for coinType 60 (ETH).
  try {
    const v = await client.readContract({
      address: resolver,
      abi: RESOLVER_ABI,
      functionName: 'addr',
      args: [node, 60n],
    });
    // Return type is bytes (EIP-2304 style). If it encodes an EVM address, it is 20 bytes.
    const hex = typeof v === 'string' ? v.trim().toLowerCase() : '';
    if (/^0x[0-9a-f]{40}$/.test(hex)) return hex as `0x${string}`;
    if (/^0x[0-9a-f]{40}$/.test(hex.slice(0, 42))) return hex.slice(0, 42) as `0x${string}`;
  } catch {
    // ignore
  }

  return null;
}

function getEnsSubgraphUrl(chainId: number): string {
  // Prefer explicit per-chain env override.
  const byChain = process.env[`ENS_GRAPHQL_URL_${chainId}`] || process.env[`ENS_SUBGRAPH_URL_${chainId}`] || '';
  if (byChain && String(byChain).trim()) return String(byChain).trim();
  if (chainId === 1) {
    if (ENS_MAINNET_GRAPHQL_URL && ENS_MAINNET_GRAPHQL_URL.trim()) return ENS_MAINNET_GRAPHQL_URL.trim();
    const key = String(GRAPHQL_API_KEY || '').trim();
    if (key) return `https://gateway.thegraph.com/api/${key}/subgraphs/id/${ENS_MAINNET_SUBGRAPH_ID}`;
    return '';
  }
  if (chainId === 11155111) {
    // Hard-coded ENS Sepolia subgraph (The Graph Studio).
    return ENS_SEPOLIA_GRAPHQL_URL || 'https://api.studio.thegraph.com/query/49574/enssepolia/version/latest/graphql';
  }
  if (chainId === 59144) {
    // Linea naming subgraph (schema differs from canonical ENS; domains.name can be null).
    return LINEA_MAINNET_GRAPHQL_URL || 'https://api.studio.thegraph.com/query/1716075/agentic-trust-linea-mainnet/version/latest';
  }
  if (chainId === 59141) {
    return LINEA_SEPOLIA_GRAPHQL_URL || 'https://api.studio.thegraph.com/query/1716075/agentic-trust-linea-sepolia/version/latest';
  }
  return '';
}

function envOrEmpty(key: string): string {
  const v = process.env[key];
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Select the ENS parent name we should enumerate for a given *target* chain.
 * Uses the frontend-style NEXT_PUBLIC envs as the source of truth for the org name.
 */
export function ensParentNameForTargetChain(targetChainId: number): string {
  const chainId = Math.trunc(Number(targetChainId));
  const base =
    chainId === 59144 || chainId === 59141
      ? envOrEmpty('NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME_LINEA')
      : chainId === 11155111
        ? envOrEmpty('NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME_SEPOLIA')
        : chainId === 84532
          ? envOrEmpty('NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME_BASE_SEPOLIA')
          : envOrEmpty('NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME');

  const name = (base || '8004-agent').trim();
  if (!name) return '8004-agent.eth';
  return name.endsWith('.eth') ? name : `${name}.eth`;
}

const ENS_SUBDOMAINS_QUERY = `query DomainsBySuffix($first: Int!, $skip: Int!, $suffix: String!) {
  domains(first: $first, skip: $skip, where: { name_ends_with: $suffix }, orderBy: createdAt, orderDirection: asc) {
    id
    name
  }
}`;

const LINEA_DOMAINS_QUERY = `query Domains($first: Int!, $skip: Int!, $suffix: String!) {
  domains(first: $first, skip: $skip, orderBy: createdAt, orderDirection: asc) {
    id
    labelHash
    name
    owner
    resolver
    createdAt
    parent {
      id
      labelHash
      name
      owner
    }
  }
}`;

function parseBytes32Node(value: unknown): `0x${string}` | null {
  const s = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!/^0x[0-9a-f]{64}$/.test(s)) return null;
  return s as `0x${string}`;
}

function normalizeEnsNameOrNull(value: unknown): string | null {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return null;
  try {
    return normalize(raw);
  } catch {
    return raw.toLowerCase();
  }
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T, idx: number) => Promise<R>): Promise<R[]> {
  const n = Math.max(1, Math.trunc(limit || 1));
  const out = new Array<R>(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length || 1) }, async () => {
      while (true) {
        const idx = i++;
        if (idx >= items.length) return;
        out[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return out;
}

export async function syncEnsParentForChain(
  targetChainId: number,
  opts: { parentName: string; resetContext: boolean; ensSourceChainId?: number },
): Promise<void> {
  const target = Math.trunc(Number(targetChainId));
  const defaultEnsSourceChainId = target === 1 ? 1 : target === 59144 || target === 59141 ? target : 11155111;
  const ensSourceChainId = Math.trunc(Number(opts?.ensSourceChainId ?? defaultEnsSourceChainId));
  const parentNameRaw = String(opts.parentName || '').trim();
  const parentName = (() => {
    try {
      return normalize(parentNameRaw);
    } catch {
      return parentNameRaw.toLowerCase();
    }
  })();
  if (!parentName || !parentName.includes('.') || !parentName.endsWith('.eth')) {
    throw new Error(`[sync] ens-parent invalid --parent: ${opts.parentName}`);
  }

  const ensGraphqlUrl = getEnsSubgraphUrl(ensSourceChainId);
  if (!ensGraphqlUrl) {
    throw new Error(
      `[sync] ens-parent missing ENS subgraph url for ensSourceChainId=${ensSourceChainId}. ` +
        `Set ENS_SEPOLIA_GRAPHQL_URL / ENS_MAINNET_GRAPHQL_URL (or ENS_SUBGRAPH_URL_${ensSourceChainId} / ENS_GRAPHQL_URL_${ensSourceChainId}).`,
    );
  }

  const rpcUrl = getRpcUrl(ensSourceChainId);
  if (!rpcUrl || !rpcUrl.trim()) {
    throw new Error(
      `[sync] ens-parent missing RPC url for ensSourceChainId=${ensSourceChainId}. ` +
        `Set ETH_SEPOLIA_RPC_HTTP_URL / ETH_MAINNET_RPC_HTTP_URL (or RPC_HTTP_URL_${ensSourceChainId})`,
    );
  }

  // Enumerate candidate subnames via subgraph (no block scanning).
  // NOTE: Linea naming subgraphs often do not support ENS registry lookups like L1 ENS does.
  const isLineaSource = ensSourceChainId === 59144 || ensSourceChainId === 59141;

  const registryAddress = getEnsRegistryForChain(ensSourceChainId);
  const registryAddr = registryAddress && registryAddress.startsWith('0x') ? (registryAddress as `0x${string}`) : null;
  if (!registryAddr && !isLineaSource) {
    throw new Error(
      `[sync] ens-parent missing ENS registry for ensSourceChainId=${ensSourceChainId}. ` +
        `Set AGENTIC_TRUST_ENS_REGISTRY_${getChainSuffix(ensSourceChainId)} (or use default for mainnet/sepolia).`,
    );
  }

  const client = createPublicClient({ transport: http(rpcUrl) });
  const registryAddrForLookup = (await (async () => {
    if (registryAddr) return registryAddr;
    // Heuristic: many ENS-like deployments reuse the canonical registry address. If no explicit registry is configured
    // (common on Linea), try it, but only if contract bytecode is present.
    if (!isLineaSource) return null;
    const guess = DEFAULT_ENS_REGISTRY_MAINNET as `0x${string}`;
    const ok = await isContractDeployed(client, guess);
    return ok ? guess : null;
  })()) as `0x${string}` | null;

  const suffix = `.${parentName}`;
  console.info('[sync] [ens-parent] starting', {
    targetChainId,
    ensSourceChainId,
    parentName,
    ensGraphqlUrl,
    suffix,
    resetContext: opts.resetContext,
  });

  let totalNames = 0;
  let totalWithAddr = 0;

  const domainRows = await fetchAllFromSubgraph(
    ensGraphqlUrl,
    isLineaSource ? LINEA_DOMAINS_QUERY : ENS_SUBDOMAINS_QUERY,
    'domains',
    {
      optional: false,
      first: 500,
      maxSkip: 200_000,
      buildVariables: ({ first, skip }) => ({ first, skip, suffix }),
    },
  );

  const defaultResolver = getEnsResolverForChain(ensSourceChainId);

  // On Linea naming subgraphs, `domains.name` can be null. We treat `domains.id` as the node hash and ask
  // the resolver on-chain to reconstruct the full name.
  let subnames: string[] = [];
  if (!isLineaSource) {
    // Filter out the parent itself and normalize names.
    subnames = Array.from(
      new Set(
        (domainRows || [])
          .map((d: any) => (typeof d?.name === 'string' ? d.name.trim() : ''))
          .filter(Boolean)
          .map((n: string) => normalizeEnsNameOrNull(n))
          .filter(Boolean)
          .filter((n: any) => n !== parentName && String(n).endsWith(suffix)),
      ),
    ) as string[];
  } else {
    const candidates = (domainRows || [])
      .map((d: any) => ({
        node: parseBytes32Node(d?.id),
        resolver: normalizeEthAddress(d?.resolver),
        name: normalizeEnsNameOrNull(d?.name),
      }))
      .filter((x: any) => x.node);

    const candidatesWithResolver = candidates.filter((c: any) => c?.resolver).length;
    if (!registryAddrForLookup && !defaultResolver && candidatesWithResolver === 0) {
      throw new Error(
        `[sync] ens-parent Linea mode requires either a registry, a default resolver, or resolvers on the domain rows. ` +
          `Set AGENTIC_TRUST_ENS_REGISTRY_${getChainSuffix(ensSourceChainId)} or AGENTIC_TRUST_ENS_RESOLVER_${getChainSuffix(ensSourceChainId)}.`,
      );
    }

    const rpcConcurrency = (() => {
      const v = process.env.ENS_LINEA_RESOLVE_CONCURRENCY;
      const n = v ? Number(v) : NaN;
      return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 8;
    })();

    let resolvedNames = 0;
    let matchedSuffix = 0;

    const names = await mapWithConcurrency(candidates, rpcConcurrency, async (c) => {
      // Prefer resolver address from subgraph row; then registry; then env default resolver.
      let resolver: `0x${string}` | null = (c.resolver as any) || null;
      if (!resolver && registryAddrForLookup) {
        try {
          const r = await client.readContract({
            address: registryAddrForLookup,
            abi: ENS_REGISTRY_ABI,
            functionName: 'resolver',
            args: [c.node as `0x${string}`],
          });
          const rr = normalizeEthAddress(r as any);
          resolver = rr && rr !== zeroAddress ? rr : null;
        } catch {
          // ignore
        }
      }
      if (!resolver && defaultResolver) resolver = defaultResolver as `0x${string}`;

      // If subgraph already included a name, keep it.
      let name = c.name || null;
      if (!name) {
        // Linea naming contracts often store the name in ERC-721 tokenURI JSON metadata.
        if (registryAddrForLookup) {
          name = await readTokenUriName(client, registryAddrForLookup, c.node as `0x${string}`);
        }
        if (!name && resolver) {
          name = await readResolverName(client, resolver, c.node as `0x${string}`);
          if (!name) name = await readResolverText(client, resolver, c.node as `0x${string}`, 'name');
          if (!name) name = await readResolverText(client, resolver, c.node as `0x${string}`, 'ens.name');
        }
        name = normalizeEnsNameOrNull(name);
      }
      if (!name) return null;

      resolvedNames += 1;
      if (name !== parentName && name.endsWith(suffix)) matchedSuffix += 1;
      return name !== parentName && name.endsWith(suffix) ? name : null;
    });

    subnames = Array.from(new Set(names.filter(Boolean) as string[]));
    console.info('[sync] [ens-parent] linea name reconstruction', {
      targetChainId,
      ensSourceChainId,
      parentName,
      suffix,
      domainRows: (domainRows || []).length,
      candidateNodes: candidates.length,
      candidatesWithResolver,
      resolvedNames,
      matchedSuffix,
      subnames: subnames.length,
      rpcConcurrency,
      registryLookup: Boolean(registryAddrForLookup),
      defaultResolver: Boolean(defaultResolver),
    });
  }

  console.info('[sync] [ens-parent] enumerated subnames from ENS subgraph', {
    targetChainId,
    ensSourceChainId,
    parentName,
    suffix,
    subnames: subnames.length,
    subnamesList: subnames.length <= 200 ? subnames : undefined,
    subnamesSample: subnames.length > 200 ? subnames.slice(0, 50) : undefined,
  });

  const lines: string[] = [];
  lines.push(rdfPrefixes());
  lines.push('');

  for (const ens of subnames) {
    const node = (namehash(ens) as any) as `0x${string}`;
    let resolver: `0x${string}` | null = null;
    if (registryAddrForLookup) {
      try {
        const r = await client.readContract({
          address: registryAddrForLookup,
          abi: ENS_REGISTRY_ABI,
          functionName: 'resolver',
          args: [node],
        });
        const rr = normalizeEthAddress(r as any);
        resolver = rr && rr !== zeroAddress ? rr : null;
      } catch {
        // registry may not implement resolver(node) on Durin L2
      }
    }
    // Fallback to chain-specific resolver (e.g. Ethereum Sepolia universal resolver for subnames)
    if (!resolver && defaultResolver) {
      resolver = defaultResolver as `0x${string}`;
    }

    const tokenMeta =
      isLineaSource && registryAddrForLookup ? await readTokenUriMeta(client, registryAddrForLookup, node) : null;

    const description =
      tokenMeta?.description ?? (resolver ? await readResolverText(client, resolver, node, 'description') : null);
    const url = tokenMeta?.url ?? (resolver ? await readResolverText(client, resolver, node, 'url') : null);

    // Primary resolution: resolver addr record (if we can get a resolver).
    // Linea fallback: tokenURI metadata address, then registry owner(node).
    const ethAddr =
      tokenMeta?.address ??
      (resolver ? await readResolverEthAddress(client, resolver, node) : null) ??
      (isLineaSource && registryAddrForLookup ? await readRegistryOwnerAddress(client, registryAddrForLookup, node) : null);

    // Store ENS name nodes under the *target chain* so they can be joined to that chain's agent identities.
    const nameIri = ensNameIri(targetChainId, ens);
    const nameDescIri = ensNameDescriptorIri(targetChainId, ens);

    // ENS name node
    lines.push(`${nameIri} a eth:AgentNameENS, core:AgentName, prov:Entity ;`);
    lines.push(`  eth:ensName "${escapeTurtleString(ens)}" ;`);
    // ENS itself lives on the ENS source chain (mainnet or sepolia).
    lines.push(`  eth:ensChainId ${ensSourceChainId} ;`);
    lines.push(`  core:hasDescriptor ${nameDescIri} ;`);
    if (ethAddr) {
      // Link resolution to the account on the *target chain* so downstream queries match did:ethr:<targetChainId>:0x...
      lines.push(`  eth:ensResolvesTo ${accountIri(targetChainId, ethAddr)} ;`);
    }
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // ENS name descriptor (store resolver + text records as json evidence)
    const descriptorJson = {
      parentName,
      ensName: ens,
      targetChainId,
      ensSourceChainId,
      node,
      resolver,
      resolvedAddress: ethAddr,
      lineaTokenMeta: tokenMeta ?? undefined,
      records: {
        description,
        url,
      },
      ensSubgraph: {
        url: ensGraphqlUrl,
      },
    };
    lines.push(`${nameDescIri} a eth:AgentNameENSDescriptor, core:AgentNameDescriptor, core:Descriptor, prov:Entity ;`);
    lines.push(`  core:json ${turtleJsonLiteral(JSON.stringify(descriptorJson))} .`);
    lines.push('');

    if (ethAddr) {
      const did = `did:ethr:${targetChainId}:${ethAddr}`;
      const uaid = `uaid:${did}`;
      const acctIri = accountIri(targetChainId, ethAddr);
      const acctIdentIri = accountIdentifierIri(did);
      const agentIri = agentIriFromAccountDid(did);
      const agentDescIri = agentDescriptorIriFromAgentIri(agentIri);

      // Account node
      lines.push(`${acctIri} a eth:Account, core:Account, prov:Entity ;`);
      lines.push(`  eth:accountChainId ${targetChainId} ;`);
      lines.push(`  eth:accountAddress "${escapeTurtleString(ethAddr)}" ;`);
      lines.push(`  eth:hasAccountIdentifier ${acctIdentIri} .`);
      lines.push('');
      lines.push(`${acctIdentIri} a eth:EthereumAccountIdentifier, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
      lines.push(`  core:protocolIdentifier "${escapeTurtleString(did)}" .`);
      lines.push('');

      // Smart agent node keyed by account DID, linked to ENS name
      lines.push(`${agentIri} a core:AIAgent, core:AISmartAgent, prov:Entity ;`);
      lines.push(`  core:uaid "${escapeTurtleString(uaid)}" ;`);
      lines.push(`  core:hasAgentAccount ${acctIri} ;`);
      lines.push(`  core:hasName ${nameIri} ;`);
      lines.push(`  core:hasDescriptor ${agentDescIri} .`);
      lines.push('');

      // Agent descriptor
      lines.push(`${agentDescIri} a core:AgentDescriptor, core:Descriptor, prov:Entity ;`);
      lines.push(`  dcterms:title "${escapeTurtleString(ens)}" ;`);
      if (description) lines.push(`  dcterms:description "${escapeTurtleString(description)}" ;`);
      if (url) lines.push(`  core:json ${turtleJsonLiteral(JSON.stringify({ url }))} ;`);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      lines.push('');

      totalWithAddr += 1;
    }

    totalNames += 1;
  }

  // Ingest once (reset clears prior ens-parent statements for this chain context).
  await ingestSubgraphTurtleToGraphdb({
    chainId: targetChainId,
    section: 'ens-parent',
    turtle: lines.join('\n'),
    resetContext: opts.resetContext,
  });

  console.info('[sync] [ens-parent] complete', { targetChainId, ensSourceChainId, parentName, totalNames, totalWithAddr });
}

