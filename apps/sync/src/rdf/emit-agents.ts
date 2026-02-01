import {
  accountIdentifierIri,
  accountIri,
  agentIriFromAccountDid,
  agentIri,
  escapeTurtleString,
  identityEnsIri,
  identityEnsDescriptorIri,
  identityIdentifier8004Iri,
  identityIdentifierEnsIri,
  identity8004Iri,
  identity8004DescriptorIri,
  rdfPrefixes,
  turtleIriOrLiteral,
  turtleJsonLiteral,
} from './common.js';
import { emitRawSubgraphRecord } from './emit-raw-record.js';
// SKIPPED: Protocol descriptor and skills extraction removed for performance (agentUri JSON parsing)
// import { emitProtocolDescriptorFromRegistration } from './emit-protocol-descriptor-from-registration.js';
// import { emitIdentityDescriptorSkillsDomains } from './emit-identity-descriptor-skills-domains.js';
// import { extractProtocolDataFromAgentUriJson, isOasfSkillId } from '../a2a/skill-extraction.js';

function normalizeHex(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s0 = value.trim();
  if (!s0) return null;
  // Accept embedded addresses (e.g., "eip155:1:0xabc..." or "AGENT ACCOUNT: 0xabc...")
  const match = s0.match(/0x[0-9a-fA-F]{40}/);
  const s = (match ? match[0] : s0).trim().toLowerCase();
  if (!s) return null;
  const hex = s.startsWith('0x') ? s : null;
  if (!hex) return null;
  return /^0x[0-9a-f]{40}$/.test(hex) ? hex : null;
}

function hexToUtf8Maybe(hex: string): string | null {
  const h = String(hex || '').trim();
  if (!/^0x[0-9a-fA-F]*$/.test(h)) return null;
  const raw = h.slice(2);
  if (raw.length < 2 || raw.length % 2 !== 0) return null;
  try {
    const bytes = new Uint8Array(raw.length / 2);
    for (let i = 0; i < raw.length; i += 2) bytes[i / 2] = parseInt(raw.slice(i, i + 2), 16);
    // strip null padding
    let end = bytes.length;
    while (end > 0 && bytes[end - 1] === 0) end--;
    const sliced = bytes.slice(0, end);
    const text = new TextDecoder('utf-8', { fatal: false }).decode(sliced);
    const trimmed = text.trim();
    if (!trimmed) return null;
    // heuristic: mostly printable
    const printable = trimmed.split('').filter((c) => c >= ' ' && c <= '~').length;
    if (printable / Math.max(1, trimmed.length) < 0.75) return null;
    return trimmed;
  } catch {
    return null;
  }
}

function buildOnchainMetadataFromAgentMetadatas(rows: any[]): { text: string; obj: any } | null {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const entries = rows
    .map((r) => {
      const key = typeof r?.key === 'string' ? r.key.trim() : '';
      const valueHex = typeof r?.value === 'string' ? r.value.trim() : '';
      const decoded = valueHex ? hexToUtf8Maybe(valueHex) : null;
      const value = decoded ?? valueHex;
      return {
        id: String(r?.id || ''),
        key,
        indexedKey: typeof r?.indexedKey === 'string' ? r.indexedKey : null,
        value,
        valueHex: valueHex || null,
        setAt: r?.setAt != null ? String(r.setAt) : null,
        setBy: typeof r?.setBy === 'string' ? r.setBy : null,
        txHash: typeof r?.txHash === 'string' ? r.txHash : null,
        blockNumber: r?.blockNumber != null ? String(r.blockNumber) : null,
        timestamp: r?.timestamp != null ? String(r.timestamp) : null,
      };
    })
    .filter((e) => e.key);
  const byKey: Record<string, any> = {};
  for (const e of entries) {
    if (!(e.key in byKey)) byKey[e.key] = e.value;
  }
  const obj = { entries, byKey };
  const text = JSON.stringify(obj);
  return { text, obj };
}

function pickString(obj: any, keys: string[]): string {
  if (!obj || typeof obj !== 'object') return '';
  for (const k of keys) {
    const v = (obj as any)[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  // case-insensitive fallback
  const lc = new Map<string, string>();
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') lc.set(k.trim().toLowerCase(), v);
  }
  for (const k of keys) {
    const v = lc.get(k.trim().toLowerCase());
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

function findLabeledValue(obj: any, label: string): string {
  const target = label.trim().toLowerCase();
  const seen = new Set<any>();
  const walk = (node: any): string => {
    if (!node || typeof node !== 'object') return '';
    if (seen.has(node)) return '';
    seen.add(node);

    if (Array.isArray(node)) {
      for (const it of node) {
        const v = walk(it);
        if (v) return v;
      }
      return '';
    }

    // Common NFT metadata attribute patterns
    const traitType = typeof (node as any).trait_type === 'string' ? (node as any).trait_type.trim().toLowerCase() : '';
    const traitType2 = typeof (node as any).traitType === 'string' ? (node as any).traitType.trim().toLowerCase() : '';
    if (traitType === target || traitType2 === target) {
      const v = (node as any).value ?? (node as any).Value;
      if (typeof v === 'string' && v.trim()) return v.trim();
    }

    // Keyed directly by label
    for (const [k, v] of Object.entries(node)) {
      if (String(k).trim().toLowerCase() === target && typeof v === 'string' && v.trim()) return v.trim();
    }

    for (const v of Object.values(node)) {
      const r = walk(v);
      if (r) return r;
    }
    return '';
  };
  return walk(obj);
}

export function emitAgentsTurtle(
  chainId: number,
  items: any[],
  cursorKey: 'mintedAt',
  minCursorExclusive: bigint,
): { turtle: string; maxCursor: bigint } {
  const lines: string[] = [rdfPrefixes()];
  let maxCursor = minCursorExclusive;
  const emittedAccounts = new Set<string>();
  const emittedAccountIdentifiers = new Set<string>();

  for (const item of items) {
    const agentId = String(item?.id ?? '').trim();
    if (!agentId) continue;

    const mintedAtRaw = item?.mintedAt ?? 0;
    let mintedAt = 0n;
    try {
      mintedAt = BigInt(mintedAtRaw);
    } catch {
      mintedAt = 0n;
    }
    if (mintedAt <= minCursorExclusive) continue;
    if (mintedAt > maxCursor) maxCursor = mintedAt;

    const owner = normalizeHex(item?.owner?.id ?? item?.owner) ?? '0x0000000000000000000000000000000000000000';

    // On-chain metadata is arbitrary and comes from AgentMetadata KV rows (NOT from agent.metadataJson).
    const kvBuilt = buildOnchainMetadataFromAgentMetadatas((item as any)?.agentMetadatas);
    const onchainMetadataText = kvBuilt?.text && kvBuilt.text.trim() ? kvBuilt.text : '';
    const onchainObj = kvBuilt?.obj ?? null;
    const onchainByKey = onchainObj && typeof onchainObj === 'object' ? (onchainObj as any).byKey : null;

    const metaAgentName =
      pickString(onchainByKey, ['agentName', 'name', 'AGENT NAME']) ||
      pickString(onchainObj, ['AGENT NAME', 'agentName', 'name']) ||
      findLabeledValue(onchainObj, 'AGENT NAME');
    const metaAgentWallet = normalizeHex(
      pickString(onchainByKey, ['agentWallet', 'wallet', 'AGENT WALLET']) ||
        pickString(onchainObj, ['AGENT WALLET', 'agentWallet', 'wallet']) ||
        findLabeledValue(onchainObj, 'AGENT WALLET'),
    );
    const metaAgentAccount = normalizeHex(
      pickString(onchainByKey, ['agentAccount', 'AGENT ACCOUNT', 'AGENT ACCOUNT with address', 'account']) ||
        pickString(onchainObj, ['AGENT ACCOUNT', 'AGENT ACCOUNT with address', 'agentAccount', 'account']) ||
        findLabeledValue(onchainObj, 'AGENT ACCOUNT') ||
        findLabeledValue(onchainObj, 'AGENT ACCOUNT with address'),
    );
    const metaRegisteredBy =
      pickString(onchainByKey, ['registeredBy', 'REGISTERED BY']) ||
      pickString(onchainObj, ['REGISTERED BY', 'registeredBy']) ||
      findLabeledValue(onchainObj, 'REGISTERED BY');
    const metaRegistryNamespace =
      pickString(onchainByKey, ['registryNamespace', 'namespace', 'REGISTRY NAMESPACE']) ||
      pickString(onchainObj, ['REGISTRY NAMESPACE', 'registryNamespace', 'namespace']) ||
      findLabeledValue(onchainObj, 'REGISTRY NAMESPACE');

    // ERC-8004 "wallet" comes from metadata keys when present (paymentWallet/agentWallet), otherwise fall back to agent.agentWallet
    const metaPaymentWallet = normalizeHex(pickString(onchainByKey, ['paymentWallet']) || '');
    const walletAddress = metaPaymentWallet ?? metaAgentWallet ?? normalizeHex(item?.agentWallet) ?? owner;
    const metaOwnerAccount = normalizeHex(pickString(onchainByKey, ['ownerAccount']) || '');
    const metaOperatorAccount = normalizeHex(pickString(onchainByKey, ['operatorAccount', 'operator']) || '');
    const ownerAddress = metaOwnerAccount ?? owner;
    const operatorAddress = metaOperatorAccount || null;

    const agentWallet = walletAddress;
    if (!agentWallet) continue;

    // If on-chain metadata includes AGENT ACCOUNT, emit a SmartAgent node and associate it with a SmartAccount node.
    // Otherwise anchor the agent to the ERC-8004 agent id.
    const smartAccountIri = metaAgentAccount ? accountIri(chainId, metaAgentAccount) : null;
    const didIdentity = `did:8004:${chainId}:${agentId}`;
    const didAccountEoa = `did:ethr:${chainId}:${agentWallet}`;
    const didAccountSmart = metaAgentAccount ? `did:ethr:${chainId}:${metaAgentAccount}` : null;
    // UAID is a UAID-string (not a DID). Clients expect it to start with "uaid:".
    // We currently derive it from the authority / native identifier we already have:
    // - SmartAgent: did:ethr:<chainId>:<smartAccount>
    // - AIAgent8004: did:8004:<chainId>:<agentId>
    const uaid = `uaid:${didAccountSmart ?? didIdentity}`;
    const didAccountForProtocols = didAccountSmart ?? didAccountEoa;
    const deferredNodes: string[] = [];

    // IMPORTANT:
    // - SmartAgent node IRI is keyed off smart account DID (authority / UAID)
    // - Non-smart ERC-8004 agent stays keyed off agentId
    const agentNodeIri = didAccountSmart ? agentIriFromAccountDid(didAccountSmart) : agentIri(chainId, agentId);

    // Agent node: emit the most specific type only; inference gives core:AIAgent etc.
    const agentType = metaAgentAccount ? 'erc8004:SmartAgent' : 'erc8004:AIAgent8004';
    // Emit core:AIAgent explicitly so queries don't rely on inference.
    lines.push(`${agentNodeIri} a core:AIAgent, ${agentType}, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);

    const name = (typeof item?.name === 'string' && item.name.trim() ? item.name.trim() : '') || metaAgentName;
    if (name) lines.push(`  core:agentName "${escapeTurtleString(name)}" ;`);
    lines.push(`  core:uaid "${escapeTurtleString(uaid)}" ;`);
    // Materialize numeric agentId for fast sorting/filtering (avoid runtime STR/REPLACE parsing).
    const agentIdNum = Number(agentId);
    if (Number.isFinite(agentIdNum) && agentIdNum > 0) lines.push(`  erc8004:agentId8004 ${Math.trunc(agentIdNum)} ;`);

    // Agent-scoped account relationships (distinct from identity-scoped accounts).
    // For AIAgent8004 these are copied from the identity accounts; for SmartAgent,
    // agentOwnerEOAAccount is resolved later via sync:account-types from the agentAccount.
    const ownerAcctIri = accountIri(chainId, ownerAddress);
    const operatorAcctIri = operatorAddress ? accountIri(chainId, operatorAddress) : null;
    const walletAcctIri = accountIri(chainId, agentWallet);
    lines.push(`  erc8004:agentOwnerAccount ${ownerAcctIri} ;`);
    lines.push(`  erc8004:agentWalletAccount ${walletAcctIri} ;`);
    if (operatorAcctIri) lines.push(`  erc8004:agentOperatorAccount ${operatorAcctIri} ;`);
    if (!metaAgentAccount) {
      // AIAgent8004: agentOwnerEOAAccount is the identity owner account (no indirection).
      lines.push(`  erc8004:agentOwnerEOAAccount ${ownerAcctIri} ;`);
    }

    if (metaAgentAccount) {
      // SmartAgent should be the only thing that links to its agentAccount
      if (smartAccountIri) lines.push(`  erc8004:hasAgentAccount ${smartAccountIri} ;`);
      // Defer SmartAccount + identifier node emission until after the agent triple is terminated with '.'
      const acctIdIri = accountIdentifierIri(didAccountSmart!);
      if (smartAccountIri) {
        // Type as ERC-8004 AgentAccount + eth:Account here; `sync:account-types` will add eth:SmartAccount vs eth:EOAAccount.
        deferredNodes.push(`${smartAccountIri} a erc8004:AgentAccount, eth:Account, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);
        deferredNodes.push(`  eth:accountChainId ${chainId} ;`);
        deferredNodes.push(`  eth:accountAddress "${escapeTurtleString(metaAgentAccount)}" ;`);
        deferredNodes.push(`  eth:hasAccountIdentifier ${acctIdIri} .\n`);
      }
      deferredNodes.push(`${acctIdIri} a eth:AccountIdentifier, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
      deferredNodes.push(`  core:protocolIdentifier "${escapeTurtleString(didAccountSmart!)}" ;`);
      deferredNodes.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/ethr> .\n`);
    }

    // NOTE:
    // - We do NOT store agentURI/a2aEndpoint directly on core:AIAgent anymore (legacy).
    // - We store ERC-8004 registration JSON on the ERC-8004 identity descriptor (core:json).
    // - A2A endpoints are represented via core:A2AProtocolDescriptor + core:serviceUrl.
    const registrationRaw = typeof item?.registration?.raw === 'string' && item.registration.raw.trim() ? item.registration.raw.trim() : '';
    const registrationJsonText = registrationRaw;

    // Identity node + registration descriptor link (minimal, but standard-aligned)
    const identityIri = identity8004Iri(didIdentity);
    const identityIdentifierIri = identityIdentifier8004Iri(didIdentity);
    const descriptorIri = identity8004DescriptorIri(didIdentity);
    lines.push(`  core:hasIdentity ${identityIri} ;`);
    // terminate agent
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Emit deferred nodes (e.g., SmartAccount + identifiers) after agent termination
    if (deferredNodes.length) {
      for (const ln of deferredNodes) lines.push(ln);
      lines.push('');
    }

    lines.push(`${identityIri} a erc8004:AgentIdentity8004, core:AgentIdentity, prov:Entity ;`);
    lines.push(`  core:identityOf ${agentNodeIri} ;`);
    // ERC-8004 identity owns owner/operator/wallet → Account relationships (account subtype resolved later via RPC)
    lines.push(`  erc8004:hasOwnerAccount ${ownerAcctIri} ;`);
    lines.push(`  erc8004:hasWalletAccount ${walletAcctIri} ;`);
    if (operatorAcctIri) lines.push(`  erc8004:hasOperatorAccount ${operatorAcctIri} ;`);
    // Associate DID identifier (did:8004:{chainId}:{id})
    lines.push(`  core:hasIdentifier ${identityIdentifierIri} ;`);
    lines.push(`  core:hasDescriptor ${descriptorIri} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Emit Account nodes (typed as eth:Account only; subtype resolved later via RPC classification)
    const ensureAccount = (address: string) => {
      const acctIri = accountIri(chainId, address);
      if (!emittedAccounts.has(acctIri)) {
        emittedAccounts.add(acctIri);
        const did = `did:ethr:${chainId}:${address}`;
        const idIri = accountIdentifierIri(did);
        lines.push(`${acctIri} a eth:Account, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);
        lines.push(`  eth:accountChainId ${chainId} ;`);
        lines.push(`  eth:accountAddress "${escapeTurtleString(address)}" ;`);
        lines.push(`  eth:hasAccountIdentifier ${idIri} .`);
        lines.push('');
        if (!emittedAccountIdentifiers.has(idIri)) {
          emittedAccountIdentifiers.add(idIri);
          lines.push(`${idIri} a eth:AccountIdentifier, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
          lines.push(`  core:protocolIdentifier "${escapeTurtleString(did)}" ;`);
          lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/ethr> .`);
          lines.push('');
        }
      }
    };

    ensureAccount(ownerAddress);
    ensureAccount(agentWallet);
    if (operatorAddress) ensureAccount(operatorAddress);

    lines.push(`${identityIdentifierIri} a erc8004:IdentityIdentifier8004, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
    lines.push(`  core:protocolIdentifier "${escapeTurtleString(didIdentity)}" ;`);
    lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/8004> .`);
    lines.push('');

    // Descriptor node
    lines.push(
      `${descriptorIri} a erc8004:IdentityDescriptor8004, erc8004:AgentRegistration8004, core:AgentIdentityDescriptor, core:Descriptor, prov:Entity ;`,
    );
    if (name) lines.push(`  core:descriptorName "${escapeTurtleString(name)}" ;`);
    if (typeof item?.description === 'string' && item.description.trim()) lines.push(`  core:descriptorDescription "${escapeTurtleString(item.description.trim())}" ;`);
    if (item?.image != null) {
      const imgTok = turtleIriOrLiteral(String(item.image));
      if (imgTok) lines.push(`  core:descriptorImage ${imgTok} ;`);
    }
    // AgentURI / registration JSON: ALWAYS store on identity descriptor.
    if (registrationJsonText) lines.push(`  core:json ${turtleJsonLiteral(registrationJsonText)} ;`);
    // NOTE: We still skip agentUri JSON expansion (protocol descriptors / skills extraction) for performance.
    // - Protocol descriptor extraction removed (A2A/MCP skills/endpoints from registration JSON)
    // - Skills/domains extraction from registration JSON removed
    // SKIPPED: onchainMetadataJson removed for performance (was 1-3KB per agent, stored as escaped JSON literal)
    // Essential fields (registeredBy, registryNamespace) are still stored as individual triples
    if (metaRegisteredBy) lines.push(`  erc8004:registeredBy "${escapeTurtleString(metaRegisteredBy)}" ;`);
    if (metaRegistryNamespace) lines.push(`  erc8004:registryNamespace "${escapeTurtleString(metaRegistryNamespace)}" ;`);
    // terminate descriptor
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // ENS Identity (optional): accept subgraph ensName OR on-chain metadata AGENT NAME if it looks like an ENS name
    // SKIPPED: registration JSON parsing for ENS name extraction (performance)
    let ensName = typeof item?.ensName === 'string' ? item.ensName.trim() : '';
    if (!ensName && metaAgentName && metaAgentName.includes('.') && metaAgentName.toLowerCase().endsWith('.eth')) {
      ensName = metaAgentName;
    }
    if (ensName) {
      const ensDid = `did:ens:${ensName}`;
      const ensIdIri = identityEnsIri(ensName);
      const ensDescriptorIri = identityEnsDescriptorIri(ensName);
      const didEnsIri = identityIdentifierEnsIri(ensName);

      lines.push(`${agentNodeIri} core:hasIdentity ${ensIdIri} .`);
      lines.push('');

      lines.push(`${ensIdIri} a ens:EnsIdentity, core:AgentIdentity, prov:Entity ;`);
      lines.push(`  core:identityOf ${agentNodeIri} ;`);
      lines.push(`  core:hasIdentifier ${didEnsIri} ;`);
      lines.push(`  core:hasDescriptor ${ensDescriptorIri} ;`);
      lines.push(`  core:identityRegistry <https://www.agentictrust.io/id/ens-registry> .`);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      lines.push('');

      lines.push(`${didEnsIri} a ens:EnsIdentifier, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
      lines.push(`  core:protocolIdentifier "${escapeTurtleString(ensDid)}" ;`);
      lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/ens> .`);
      lines.push('');

      lines.push(`${ensDescriptorIri} a ens:EnsIdentityDescriptor, core:AgentIdentityDescriptor, core:Descriptor, prov:Entity ;`);
      lines.push(`  ens:ensName "${escapeTurtleString(ensName)}" .`);
      lines.push('');
    }

    // Raw ingest record (stores full subgraph row)
    lines.push(
      emitRawSubgraphRecord({
        chainId,
        kind: 'agents',
        entityId: agentId,
        cursorValue: mintedAt.toString(),
        raw: item,
        txHash: null,
        blockNumber: null,
        timestamp: null,
        recordsEntityIri: agentNodeIri,
      }),
    );
    lines.push('');
  }

  return { turtle: lines.join('\n'), maxCursor };
}

