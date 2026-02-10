import {
  accountIri,
  accountIdentifierIri,
  agentDescriptorIriFromAgentIri,
  agentIriFromAccountDid,
  escapeTurtleString,
  iriEncodeSegment,
  rdfPrefixes,
  turtleJsonLiteral,
} from './common.js';

function agentIriFrom8122Did(did8122: string): string {
  return `<https://www.agentictrust.io/id/agent/by-8122-did/${iriEncodeSegment(did8122)}>`;
}

function identity8122Iri(did8122: string): string {
  return `<https://www.agentictrust.io/id/8122-identity/${iriEncodeSegment(did8122)}>`;
}

function identityIdentifier8122Iri(did8122: string): string {
  return `<https://www.agentictrust.io/id/8122-identifier/${iriEncodeSegment(did8122)}>`;
}

function identity8122DescriptorIri(chainId: number, did8122: string): string {
  return `<https://www.agentictrust.io/id/8122-identity-descriptor/${chainId}/${iriEncodeSegment(did8122)}>`;
}

function normalizeHexAddr(value: unknown): string | null {
  const s = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return /^0x[0-9a-f]{40}$/.test(s) ? s : null;
}

export function emitErc8122AgentsTurtle(args: { chainId: number; agents: any[]; metadatas: any[] }): { turtle: string } {
  const { chainId } = args;
  const agents = Array.isArray(args.agents) ? args.agents : [];
  const metadatas = Array.isArray(args.metadatas) ? args.metadatas : [];

  // Group metadata rows by registryAgent8122 id (or by agentId+registry as fallback).
  const metaByAgentRowId = new Map<string, any[]>();
  const metaByKey = new Map<string, any[]>();
  for (const m of metadatas) {
    const id = typeof m?.registryAgent8122 === 'string' ? m.registryAgent8122.trim() : '';
    if (id) {
      const arr = metaByAgentRowId.get(id) ?? [];
      arr.push(m);
      metaByAgentRowId.set(id, arr);
    }
    const reg = typeof m?.registry === 'string' ? m.registry.trim().toLowerCase() : '';
    const agentId = m?.agentId != null ? String(m.agentId) : '';
    if (reg && agentId) {
      const k = `${reg}:${agentId}`;
      const arr2 = metaByKey.get(k) ?? [];
      arr2.push(m);
      metaByKey.set(k, arr2);
    }
  }

  const lines: string[] = [];
  lines.push(rdfPrefixes());
  lines.push('');

  for (const a of agents) {
    const registry = typeof a?.registry === 'string' ? a.registry.trim().toLowerCase() : '';
    const agentId8122 = a?.agentId != null ? String(a.agentId) : '';
    if (!registry || !agentId8122) continue;

    const did8122 = `did:8122:${chainId}:${registry}:${agentId8122}`;
    const owner = normalizeHexAddr(a?.owner);
    const agentAccount = normalizeHexAddr(a?.agentAccount);
    const endpointType = typeof a?.endpointType === 'string' ? a.endpointType.trim() : '';
    const endpoint = typeof a?.endpoint === 'string' ? a.endpoint.trim() : '';

    const createdAtTime = a?.createdAt != null ? Number(a.createdAt) : null;
    const updatedAtTime = a?.updatedAt != null ? Number(a.updatedAt) : null;

    // Smart agent canonicalization:
    // If an agentAccount is present, the agent UAID is did:ethr:<chainId>:<agentAccount>.
    const didAccountSmart = agentAccount ? `did:ethr:${chainId}:${agentAccount}` : null;
    const uaid = didAccountSmart ? `uaid:${didAccountSmart}` : `uaid:${did8122}`;
    const agentNodeIri = didAccountSmart ? agentIriFromAccountDid(didAccountSmart) : agentIriFrom8122Did(did8122);

    const identityIri = identity8122Iri(did8122);
    const identIri = identityIdentifier8122Iri(did8122);
    const descIri = identity8122DescriptorIri(chainId, did8122);
    const agentDescIri = agentDescriptorIriFromAgentIri(agentNodeIri);

    // Lookup metadata rows
    const rowId = typeof a?.id === 'string' ? a.id.trim() : '';
    const metaRows =
      (rowId ? metaByAgentRowId.get(rowId) : null) ??
      (metaByKey.get(`${registry}:${agentId8122}`) ?? []);

    // Extract best-effort name/description from metadata collection (common keys: name, description, url)
    const pickMeta = (k: string): string | null => {
      const want = k.trim().toLowerCase();
      for (const r of metaRows) {
        const key = typeof r?.key === 'string' ? r.key.trim().toLowerCase() : '';
        if (key !== want) continue;
        const v = typeof r?.value === 'string' ? r.value.trim() : '';
        if (v) return v;
      }
      return null;
    };
    const metaName = pickMeta('name');
    const metaDescription = pickMeta('description');
    const metaUrl = pickMeta('url');

    // Agent node
    lines.push(`${agentNodeIri} a core:AIAgent, prov:Entity ;`);
    if (didAccountSmart) lines.push(`  a core:AISmartAgent ;`);
    lines.push(`  core:uaid "${escapeTurtleString(uaid)}" ;`);
    if (Number.isFinite(createdAtTime as any) && (createdAtTime as any) > 0) lines.push(`  core:createdAtTime ${Math.trunc(createdAtTime as any)} ;`);
    if (Number.isFinite(updatedAtTime as any) && (updatedAtTime as any) > 0) lines.push(`  core:updatedAtTime ${Math.trunc(updatedAtTime as any)} ;`);
    lines.push(`  core:hasIdentity ${identityIri} ;`);
    lines.push(`  core:hasDescriptor ${agentDescIri} .`);
    lines.push('');

    // Agent descriptor (use metadata if present)
    lines.push(`${agentDescIri} a core:AgentDescriptor, core:Descriptor, prov:Entity ;`);
    if (metaName) lines.push(`  dcterms:title "${escapeTurtleString(metaName)}" ;`);
    if (metaDescription) lines.push(`  dcterms:description "${escapeTurtleString(metaDescription)}" ;`);
    if (metaUrl) lines.push(`  core:json ${turtleJsonLiteral(JSON.stringify({ url: metaUrl }))} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Identity node
    lines.push(`${identityIri} a erc8122:AgentIdentity8122, core:AgentIdentity, prov:Entity ;`);
    lines.push(`  core:identityOf ${agentNodeIri} ;`);
    lines.push(`  core:hasIdentifier ${identIri} ;`);
    lines.push(`  core:hasDescriptor ${descIri} ;`);
    lines.push(`  erc8122:registryAddress "${escapeTurtleString(registry)}" ;`);
    lines.push(`  erc8122:agentId "${escapeTurtleString(agentId8122)}" ;`);
    if (endpointType) lines.push(`  erc8122:endpointType "${escapeTurtleString(endpointType)}" ;`);
    if (endpoint) lines.push(`  erc8122:endpoint "${escapeTurtleString(endpoint)}" ;`);
    if (owner) lines.push(`  erc8122:hasOwnerAccount ${accountIri(chainId, owner)} ;`);
    if (agentAccount) lines.push(`  erc8122:hasAgentAccount ${accountIri(chainId, agentAccount)} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // DID identifier
    lines.push(`${identIri} a erc8122:IdentityIdentifier8122, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
    lines.push(`  core:protocolIdentifier "${escapeTurtleString(did8122)}" .`);
    lines.push('');

    // Identity descriptor: store full metadata collection rows as json for now (shape varies across deployments)
    const metaJson = metaRows.map((r: any) => ({
      id: r?.id ?? null,
      key: typeof r?.key === 'string' ? r.key : null,
      value: typeof r?.value === 'string' ? r.value : r?.value ?? null,
      txHash: typeof r?.txHash === 'string' ? r.txHash : null,
      blockNumber: r?.blockNumber != null ? String(r.blockNumber) : null,
      timestamp: r?.timestamp != null ? String(r.timestamp) : null,
    }));
    lines.push(`${descIri} a erc8122:Descriptor8122Identity, core:AgentIdentityDescriptor, core:Descriptor, prov:Entity ;`);
    lines.push(`  core:json ${turtleJsonLiteral(JSON.stringify({ metadata: metaJson }))} .`);
    lines.push('');

    // Ensure referenced accounts have identifiers for GraphQL hydration (optional but helps)
    const emitAccount = (addr: string) => {
      const acctIri = accountIri(chainId, addr);
      const did = `did:ethr:${chainId}:${addr}`;
      const acctIdentIri = accountIdentifierIri(did);
      lines.push(`${acctIri} a eth:Account, core:Account, prov:Entity ;`);
      lines.push(`  eth:accountChainId ${chainId} ;`);
      lines.push(`  eth:accountAddress "${escapeTurtleString(addr)}" ;`);
      lines.push(`  eth:hasAccountIdentifier ${acctIdentIri} .`);
      lines.push('');
      lines.push(`${acctIdentIri} a eth:EthereumAccountIdentifier, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
      lines.push(`  core:protocolIdentifier "${escapeTurtleString(did)}" .`);
      lines.push('');
    };
    if (owner) emitAccount(owner);
    if (agentAccount && agentAccount !== owner) emitAccount(agentAccount);
  }

  return { turtle: lines.join('\n') };
}

