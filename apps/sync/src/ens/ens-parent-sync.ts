import { createPublicClient, http, zeroAddress, type Abi } from 'viem';
import { namehash, normalize } from 'viem/ens';
import { ingestSubgraphTurtleToGraphdb } from '../graphdb-ingest.js';
import { fetchAllFromSubgraph } from '../subgraph-client.js';
import { ENS_MAINNET_GRAPHQL_URL, ENS_SEPOLIA_GRAPHQL_URL } from '../env.js';
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

// Sepolia ENS contracts.
// - Registry address is commonly deployed at the same address across networks.
// - We do NOT scan NameWrapper logs; enumeration comes from ENS subgraph.
const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

const ENS_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'resolver',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: 'resolver', type: 'address' }],
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
  if (chainId === 1) return ENS_MAINNET_GRAPHQL_URL || '';
  if (chainId === 11155111) {
    // Hard-coded ENS Sepolia subgraph (The Graph Studio).
    return 'https://api.studio.thegraph.com/query/49574/enssepolia/version/latest/graphql';
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
    chainId === 59144 || chainId === 59140
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

export async function syncEnsParentForChain(
  targetChainId: number,
  opts: { parentName: string; resetContext: boolean; ensSourceChainId?: number },
): Promise<void> {
  const ensSourceChainId = Math.trunc(Number(opts?.ensSourceChainId ?? targetChainId));
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

  const client = createPublicClient({ transport: http(rpcUrl) });

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

  // Enumerate candidate subnames via ENS subgraph (no block scanning).
  const domainRows = await fetchAllFromSubgraph(ensGraphqlUrl, ENS_SUBDOMAINS_QUERY, 'domains', {
    optional: false,
    first: 500,
    maxSkip: 200_000,
    buildVariables: ({ first, skip }) => ({ first, skip, suffix }),
  });

  // Filter out the parent itself and normalize names.
  const subnames = Array.from(
    new Set(
      (domainRows || [])
        .map((d: any) => (typeof d?.name === 'string' ? d.name.trim() : ''))
        .filter(Boolean)
        .map((n: string) => {
          try {
            return normalize(n);
          } catch {
            return n.toLowerCase();
          }
        })
        .filter((n: string) => n !== parentName && n.endsWith(suffix)),
    ),
  );

  console.info('[sync] [ens-parent] enumerated subnames from ENS subgraph', {
    targetChainId,
    ensSourceChainId,
    parentName,
    suffix,
    subnames: subnames.length,
  });

  const lines: string[] = [];
  lines.push(rdfPrefixes());
  lines.push('');

  for (const ens of subnames) {
    const node = (namehash(ens) as any) as `0x${string}`;
    let resolver: `0x${string}` | null = null;
    try {
      const r = await client.readContract({
        address: ENS_REGISTRY_ADDRESS as `0x${string}`,
        abi: ENS_REGISTRY_ABI,
        functionName: 'resolver',
        args: [node],
      });
      const rr = normalizeEthAddress(r as any);
      resolver = rr && rr !== zeroAddress ? rr : null;
    } catch {
      resolver = null;
    }

    const description = resolver ? await readResolverText(client, resolver, node, 'description') : null;
    const url = resolver ? await readResolverText(client, resolver, node, 'url') : null;
    const ethAddr = resolver ? await readResolverEthAddress(client, resolver, node) : null;

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

