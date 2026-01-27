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
import { emitProtocolDescriptorFromRegistration } from './emit-protocol-descriptor-from-registration.js';
import { emitIdentityDescriptorSkillsDomains } from './emit-identity-descriptor-skills-domains.js';
import { extractProtocolDataFromAgentUriJson, isOasfSkillId } from '../a2a/skill-extraction.js';

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

export function emitAgentsTurtle(chainId: number, items: any[], cursorKey: 'mintedAt', minCursorExclusive: bigint): { turtle: string; maxCursor: bigint } {
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
    const uaid = didAccountSmart ?? didIdentity;
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

    if (metaAgentAccount) {
      // SmartAgent should be the only thing that links to SmartAccount
      if (smartAccountIri) lines.push(`  erc8004:hasSmartAccount ${smartAccountIri} ;`);
      // Defer SmartAccount + identifier node emission until after the agent triple is terminated with '.'
      const acctIdIri = accountIdentifierIri(didAccountSmart!);
      if (smartAccountIri) {
        // Type only as eth:Account here; `sync:account-types` will add eth:SmartAccount vs eth:EOAAccount.
        deferredNodes.push(`${smartAccountIri} a eth:Account, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);
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
    const ownerAcctIri = accountIri(chainId, ownerAddress);
    const walletAcctIri = accountIri(chainId, agentWallet);
    const operatorAcctIri = operatorAddress ? accountIri(chainId, operatorAddress) : null;
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
    if (registrationJsonText) lines.push(`  core:json ${turtleJsonLiteral(registrationJsonText)} ;`);
    if (onchainMetadataText) lines.push(`  erc8004:onchainMetadataJson ${turtleJsonLiteral(onchainMetadataText)} ;`);
    if (metaRegisteredBy) lines.push(`  erc8004:registeredBy "${escapeTurtleString(metaRegisteredBy)}" ;`);
    if (metaRegistryNamespace) lines.push(`  erc8004:registryNamespace "${escapeTurtleString(metaRegistryNamespace)}" ;`);
    // terminate descriptor
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Extract endpoint skills from registration JSON and attach to endpoint protocol descriptor(s)
    if (registrationJsonText) {
      const protocolData = extractProtocolDataFromAgentUriJson(registrationJsonText);
      const a2aSkills = protocolData.a2a.skills;
      const mcpSkills = protocolData.mcp.skills;
      const mcpTools = protocolData.mcp.tools;
      const oasfEndpointSkills = protocolData.oasf.skills;
      const oasfEndpointDomains = protocolData.oasf.domains;

      // Also attach these skills/domains to the ERC-8004 identity descriptor (in addition to protocol descriptors)
      const identitySkillsAll = [...a2aSkills, ...mcpSkills, ...oasfEndpointSkills];
      if (identitySkillsAll.length || oasfEndpointDomains.length) {
        lines.push(
          emitIdentityDescriptorSkillsDomains({
            descriptorIri,
            subjectKey: didIdentity,
            skills: identitySkillsAll,
            domains: oasfEndpointDomains,
          }),
        );
        lines.push('');
      }
      const splitSkills = (skills: string[]) => {
        const oasf: string[] = [];
        const other: string[] = [];
        for (const s of skills) {
          if (isOasfSkillId(s)) oasf.push(s);
          else other.push(s);
        }
        return { oasf, other };
      };

      // A2A descriptor (emit if A2A endpoint exists, even if skills are empty)
      {
        let serviceUrl = '';
        let version: string | null = null;
        try {
          const parsed = JSON.parse(registrationJsonText);
          const eps = Array.isArray(parsed?.services) ? parsed.services : Array.isArray(parsed?.endpoints) ? parsed.endpoints : [];
          const a2aEp = eps.find((e: any) => String(e?.name || '').trim().toLowerCase() === 'a2a');
          if (a2aEp && typeof a2aEp.endpoint === 'string' && a2aEp.endpoint.trim()) serviceUrl = a2aEp.endpoint.trim();
          if (a2aEp && typeof a2aEp.version === 'string' && a2aEp.version.trim()) version = a2aEp.version.trim();
        } catch {}
        if (serviceUrl) {
          lines.push(
            emitProtocolDescriptorFromRegistration({
              didAccount: didAccountForProtocols,
              protocol: 'a2a',
              serviceUrl,
              protocolVersion: version,
              endpointJson: null,
              skills: splitSkills(a2aSkills),
              assembledFromDescriptorIri: descriptorIri,
            }),
          );
          lines.push('');
        }
      }

      // MCP descriptor
      if (mcpSkills.length) {
        let serviceUrl = '';
        let version: string | null = null;
        let endpointObj: any | null = null;
        try {
          const parsed = JSON.parse(registrationJsonText);
          const eps = Array.isArray(parsed?.services) ? parsed.services : Array.isArray(parsed?.endpoints) ? parsed.endpoints : [];
          const mcpEp = eps.find((e: any) => String(e?.name || '').trim().toLowerCase() === 'mcp');
          if (mcpEp && typeof mcpEp.endpoint === 'string' && mcpEp.endpoint.trim()) serviceUrl = mcpEp.endpoint.trim();
          if (mcpEp && typeof mcpEp.version === 'string' && mcpEp.version.trim()) version = mcpEp.version.trim();
          endpointObj = mcpEp || null;
        } catch {}
        // Ensure mcpTools are preserved on the descriptor JSON even if subgraph didn't include them in mcpSkills
        if (endpointObj && mcpTools.length && !Array.isArray((endpointObj as any).mcpTools)) {
          (endpointObj as any).mcpTools = mcpTools;
        }
        if (serviceUrl) {
          lines.push(
            emitProtocolDescriptorFromRegistration({
              didAccount: didAccountForProtocols,
              protocol: 'mcp',
              serviceUrl,
              protocolVersion: version,
              endpointJson: endpointObj,
              skills: splitSkills(mcpSkills),
              assembledFromDescriptorIri: descriptorIri,
            }),
          );
          lines.push('');
        }
      }
    }

    // ENS Identity (optional): accept subgraph ensName OR registration JSON service entry OR on-chain metadata AGENT NAME if it looks like an ENS name
    let ensName = typeof item?.ensName === 'string' ? item.ensName.trim() : '';
    if (!ensName && registrationJsonText) {
      try {
        const parsed = JSON.parse(registrationJsonText);
        const eps = Array.isArray(parsed?.services) ? parsed.services : Array.isArray(parsed?.endpoints) ? parsed.endpoints : [];
        const ensEp = eps.find((e: any) => String(e?.name || '').trim().toLowerCase() === 'ens');
        const candidate = ensEp && ensEp.endpoint != null ? String(ensEp.endpoint).trim() : '';
        if (candidate && candidate.includes('.')) ensName = candidate;
      } catch {}
    }
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

