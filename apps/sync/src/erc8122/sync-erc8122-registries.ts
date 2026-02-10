import { createPublicClient, http, type Abi } from 'viem';
import { getAddress } from 'viem/utils';
import { ingestSubgraphTurtleToGraphdb } from '../graphdb-ingest.js';
import {
  agentRegistry8122Iri,
  agentRegistrar8122Iri,
  escapeTurtleString,
  rdfPrefixes,
  registryFactory8122Iri,
  turtleJsonLiteral,
} from '../rdf/common.js';

function normalizeHexAddr(value: unknown): string | null {
  const s = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return /^0x[0-9a-f]{40}$/.test(s) ? s : null;
}

function rpcUrlForChainId(chainId: number): string {
  if (chainId === 1) return process.env.ETH_MAINNET_RPC_HTTP_URL || process.env.ETH_MAINNET_RPC_URL || '';
  if (chainId === 11155111) return process.env.ETH_SEPOLIA_RPC_HTTP_URL || process.env.ETH_SEPOLIA_RPC_URL || '';
  if (chainId === 84532) return process.env.BASE_SEPOLIA_RPC_HTTP_URL || process.env.BASE_SEPOLIA_RPC_URL || '';
  if (chainId === 11155420) return process.env.OP_SEPOLIA_RPC_HTTP_URL || process.env.OP_SEPOLIA_RPC_URL || '';
  return process.env[`RPC_HTTP_URL_${chainId}`] || process.env[`RPC_URL_${chainId}`] || '';
}

function factoryAddressForChain(chainId: number): string | null {
  const specific = process.env[`ERC8122_FACTORY_ADDRESS_${chainId}`];
  const generic = process.env.ERC8122_FACTORY_ADDRESS;
  const raw = (specific && specific.trim()) || (generic && generic.trim()) || '';
  const n = normalizeHexAddr(raw);
  // Default the known Sepolia factory if nothing is set.
  if (!n && chainId === 11155111) return '0xedd20967a704c2b2065b7adf41c8ca0d6bec01b3';
  return n;
}

const AGENT_REGISTRY_FACTORY_ABI: Abi = [
  {
    type: 'function',
    name: 'registryImplementation',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'registrarImplementation',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'getDeployedRegistriesCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getDeployedRegistries',
    stateMutability: 'view',
    inputs: [
      { name: 'start', type: 'uint256' },
      { name: 'end', type: 'uint256' },
    ],
    outputs: [{ name: 'registries', type: 'address[]' }],
  },
  {
    type: 'function',
    name: 'registryToRegistrar',
    stateMutability: 'view',
    inputs: [{ name: 'registry', type: 'address' }],
    outputs: [{ name: 'registrar', type: 'address' }],
  },
] as const;

const ERC721_NAME_ABI: Abi = [
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

const CONTRACT_METADATA_ABI: Abi = [
  // ERC-8049-ish pattern used by the factory: setContractMetadata("name", bytes(name))
  {
    type: 'function',
    name: 'getContractMetadata',
    stateMutability: 'view',
    inputs: [{ name: 'key', type: 'string' }],
    outputs: [{ name: '', type: 'bytes' }],
  },
  // Some implementations expose a direct mapping getter name.
  {
    type: 'function',
    name: 'contractMetadata',
    stateMutability: 'view',
    inputs: [{ name: 'key', type: 'string' }],
    outputs: [{ name: '', type: 'bytes' }],
  },
] as const;

function bytesToUtf8(value: unknown): string | null {
  if (!value) return null;
  try {
    // viem can return bytes as `0x...` string or Uint8Array depending on transport/version.
    const hex = typeof value === 'string' ? value : null;
    const bytes: Uint8Array | null =
      hex && hex.startsWith('0x')
        ? (() => {
            const s = hex.slice(2);
            if (!s || s.length % 2 !== 0) return null;
            const out = new Uint8Array(s.length / 2);
            for (let i = 0; i < out.length; i++) out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
            return out;
          })()
        : value instanceof Uint8Array
          ? value
          : null;
    if (!bytes || bytes.length === 0) return null;
    const txt = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    const cleaned = txt.replace(/\u0000+$/g, '').trim();
    return cleaned || null;
  } catch {
    return null;
  }
}

export async function syncErc8122RegistriesToGraphdbForChain(args: {
  chainId: number;
  resetContext?: boolean;
  pageSize?: number;
  maxRegistries?: number;
}): Promise<{ count: number; factoryAddress: string | null }> {
  const chainId = Math.trunc(Number(args.chainId));
  const resetContext = Boolean(args.resetContext);
  const pageSize = Number.isFinite(args.pageSize) && (args.pageSize as number) > 0 ? Math.trunc(args.pageSize as number) : 250;
  const maxRegistries =
    Number.isFinite(args.maxRegistries) && (args.maxRegistries as number) > 0 ? Math.trunc(args.maxRegistries as number) : null;

  const factoryAddress = factoryAddressForChain(chainId);
  if (!factoryAddress) {
    console.info('[sync] [erc8122-registries] no factory address configured; skipping', { chainId });
    return { count: 0, factoryAddress: null };
  }

  const rpcUrl = rpcUrlForChainId(chainId);
  if (!rpcUrl) {
    console.warn('[sync] [erc8122-registries] missing RPC url; skipping', {
      chainId,
      factoryAddress,
      hint: 'Set ETH_*_RPC_HTTP_URL or RPC_HTTP_URL_<chainId>',
    });
    return { count: 0, factoryAddress };
  }

  const client = createPublicClient({ transport: http(rpcUrl) });
  const factory = getAddress(factoryAddress);

  // Factory global implementation addresses
  let registryImpl: string | null = null;
  let registrarImpl: string | null = null;
  try {
    registryImpl = String(await client.readContract({ address: factory, abi: AGENT_REGISTRY_FACTORY_ABI, functionName: 'registryImplementation' }));
  } catch {}
  try {
    registrarImpl = String(
      await client.readContract({ address: factory, abi: AGENT_REGISTRY_FACTORY_ABI, functionName: 'registrarImplementation' }),
    );
  } catch {}

  // Registry list
  let total = 0n;
  try {
    total = (await client.readContract({
      address: factory,
      abi: AGENT_REGISTRY_FACTORY_ABI,
      functionName: 'getDeployedRegistriesCount',
    })) as bigint;
  } catch (e: any) {
    console.warn('[sync] [erc8122-registries] failed to read registry count', { chainId, factoryAddress, error: String(e?.message || e || '') });
    return { count: 0, factoryAddress };
  }

  const allRegistries: string[] = [];
  for (let start = 0n; start < total; start += BigInt(pageSize)) {
    const end = start + BigInt(pageSize) > total ? total : start + BigInt(pageSize);
    try {
      const page = (await client.readContract({
        address: factory,
        abi: AGENT_REGISTRY_FACTORY_ABI,
        functionName: 'getDeployedRegistries',
        args: [start, end],
      })) as readonly string[];
      for (const a of page) {
        const n = normalizeHexAddr(a);
        if (n) allRegistries.push(n);
        if (maxRegistries != null && allRegistries.length >= maxRegistries) break;
      }
    } catch (e: any) {
      console.warn('[sync] [erc8122-registries] failed to page registries', {
        chainId,
        factoryAddress,
        start: start.toString(),
        end: end.toString(),
        error: String(e?.message || e || ''),
      });
    }
    if (maxRegistries != null && allRegistries.length >= maxRegistries) break;
  }

  // Registry list source of truth: on-chain factory.
  // We intentionally avoid relying on subgraph registryAgent8122S for registry discovery, since subgraph
  // coverage can lag or be incomplete.

  // On-chain per-registry: registrar + best-effort registry name()
  const lines: string[] = [rdfPrefixes()];
  const factoryIri = registryFactory8122Iri(chainId, factory);
  lines.push(`${factoryIri} a erc8122:AgentRegistryFactory8122, prov:Entity ;`);
  lines.push(`  erc8122:factoryAddress "${escapeTurtleString(factory)}" ;`);
  if (registryImpl && normalizeHexAddr(registryImpl)) lines.push(`  erc8122:registryImplementationAddress "${escapeTurtleString(String(registryImpl).toLowerCase())}" ;`);
  if (registrarImpl && normalizeHexAddr(registrarImpl)) lines.push(`  erc8122:registrarImplementationAddress "${escapeTurtleString(String(registrarImpl).toLowerCase())}" ;`);
  lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
  lines.push('');

  let emitted = 0;
  const nameRows: Array<{ registry: string; name: string | null; registrar: string | null }> = [];
  for (const regAddr of allRegistries) {
    const regIri = agentRegistry8122Iri(chainId, regAddr);
    let registrarAddr: string | null = null;
    try {
      const r = (await client.readContract({
        address: factory,
        abi: AGENT_REGISTRY_FACTORY_ABI,
        functionName: 'registryToRegistrar',
        args: [getAddress(regAddr)],
      })) as string;
      registrarAddr = normalizeHexAddr(r);
    } catch {}

    let regName: string | null = null;
    try {
      const n = (await client.readContract({ address: getAddress(regAddr), abi: ERC721_NAME_ABI, functionName: 'name' })) as string;
      regName = typeof n === 'string' && n.trim() ? n.trim() : null;
    } catch {}
    if (!regName) {
      // Factory sets metadata via reg.setContractMetadata("name", bytes(name)).
      // Read it back here (best effort); not all registries implement this getter.
      try {
        const b = await client.readContract({
          address: getAddress(regAddr),
          abi: CONTRACT_METADATA_ABI,
          functionName: 'getContractMetadata',
          args: ['name'],
        });
        regName = bytesToUtf8(b);
      } catch {}
    }
    if (!regName) {
      try {
        const b = await client.readContract({
          address: getAddress(regAddr),
          abi: CONTRACT_METADATA_ABI,
          functionName: 'contractMetadata',
          args: ['name'],
        });
        regName = bytesToUtf8(b);
      } catch {}
    }

    nameRows.push({ registry: regAddr, name: regName, registrar: registrarAddr });

    lines.push(`${regIri} a erc8122:AgentRegistry8122, core:AgentRegistry, prov:Entity ;`);
    lines.push(`  erc8122:registryContractAddress "${escapeTurtleString(regAddr)}" ;`);
    if (regName) lines.push(`  erc8122:registryName "${escapeTurtleString(regName)}" ;`);
    if (registryImpl && normalizeHexAddr(registryImpl)) {
      lines.push(`  erc8122:registryImplementationAddress "${escapeTurtleString(String(registryImpl).toLowerCase())}" ;`);
    }
    if (registrarImpl && normalizeHexAddr(registrarImpl)) {
      lines.push(`  erc8122:registrarImplementationAddress "${escapeTurtleString(String(registrarImpl).toLowerCase())}" ;`);
    }
    if (registrarAddr) {
      const registrarIri = agentRegistrar8122Iri(chainId, registrarAddr);
      lines.push(`  erc8122:hasRegistrar ${registrarIri} ;`);
    }
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    if (registrarAddr) {
      const registrarIri = agentRegistrar8122Iri(chainId, registrarAddr);
      lines.push(`${registrarIri} a erc8122:AgentRegistrar8122, prov:Entity ;`);
      lines.push(`  erc8122:registrarContractAddress "${escapeTurtleString(registrarAddr)}" ;`);
      lines.push(`  erc8122:forRegistry ${regIri} ;`);
      if (registrarImpl && normalizeHexAddr(registrarImpl)) {
        lines.push(`  erc8122:registrarImplementationAddress "${escapeTurtleString(String(registrarImpl).toLowerCase())}" ;`);
      }
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      lines.push('');
    }

    // Link factory -> registry (and registrar)
    lines.push(`${factoryIri} erc8122:deployedRegistry ${regIri} .`);
    if (registrarAddr) lines.push(`${factoryIri} erc8122:deployedRegistrar ${agentRegistrar8122Iri(chainId, registrarAddr)} .`);
    lines.push('');

    emitted += 1;
  }

  // Print on-chain registry names (sample by default to avoid log spam).
  try {
    const showAll = process.env.SYNC_ERC8122_REGISTRY_NAMES === '1';
    const maxToShow = showAll ? nameRows.length : Math.min(25, nameRows.length);
    const rowsToShow = nameRows.slice(0, maxToShow).map((r) => ({
      registry: r.registry,
      registrar: r.registrar,
      name: r.name,
    }));
    console.info('[sync] [erc8122-registries] on-chain registry names', {
      chainId,
      factory,
      totalRegistries: nameRows.length,
      shown: rowsToShow.length,
      setEnv: showAll ? null : 'Set SYNC_ERC8122_REGISTRY_NAMES=1 to print all registry names.',
      registries: rowsToShow,
    });
  } catch {}

  // Helpful digest JSON for debugging
  try {
    const digest = JSON.stringify(
      {
        chainId,
        factory,
        registryImplementation: registryImpl,
        registrarImplementation: registrarImpl,
        registries: emitted,
      },
      null,
      0,
    );
    lines.push(`${factoryIri} core:json ${turtleJsonLiteral(digest)} .`);
    lines.push('');
  } catch {}

  const turtle = lines.join('\n');
  await ingestSubgraphTurtleToGraphdb({
    chainId,
    section: 'erc8122-registries',
    turtle,
    resetContext,
  });

  console.info('[sync] [erc8122-registries] ingested', { chainId, factoryAddress: factory, registries: emitted });
  return { count: emitted, factoryAddress: factory };
}

