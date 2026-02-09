import {
  accountIdentifierIri,
  accountIri,
  agentDescriptorIriFromAgentIri,
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
// Protocol descriptor + skills/domains extraction from ERC-8004 registration JSON (erc8004:registrationJson)
import { emitProtocolDescriptorFromRegistration } from './emit-protocol-descriptor-from-registration.js';
import { emitIdentityDescriptorSkillsDomains } from './emit-identity-descriptor-skills-domains.js';
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

function parseDescriptorFieldsFromJson(jsonText: string): { name: string | null; description: string | null; image: string | null } {
  const raw = typeof jsonText === 'string' ? jsonText.trim() : '';
  if (!raw) return { name: null, description: null, image: null };
  // Fast reject non-JSON
  if (!(raw.startsWith('{') || raw.startsWith('['))) return { name: null, description: null, image: null };
  try {
    const obj: any = JSON.parse(raw);
    const name = typeof obj?.name === 'string' && obj.name.trim() ? obj.name.trim() : null;
    const description = typeof obj?.description === 'string' && obj.description.trim() ? obj.description.trim() : null;
    const image = typeof obj?.image === 'string' && obj.image.trim() ? obj.image.trim() : null;
    return { name, description, image };
  } catch {
    return { name: null, description: null, image: null };
  }
}

function bytesFromLatin1String(s: string): Uint8Array {
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff;
  return out;
}

function tryNodeGunzip(bytes: Uint8Array): string | null {
  // Avoid TS/node typings by using dynamic require (sync runs in Node).
  try {
    const req = (0, eval)('require') as any;
    const zlib = req ? req('node:zlib') ?? req('zlib') : null;
    const B = (globalThis as any).Buffer as any;
    if (!zlib || typeof zlib.gunzipSync !== 'function' || !B) return null;
    const buf = zlib.gunzipSync(B.from(bytes));
    const text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
    return text && text.trim() ? text : null;
  } catch {
    return null;
  }
}

function decodePossiblyCompressedJsonText(raw: string): string {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  if (s.startsWith('{') || s.startsWith('[')) return s;

  // Case 1: raw bytes came through as a binary-ish string (often starts with gzip magic 0x1f 0x8b).
  try {
    const bytes = bytesFromLatin1String(s);
    if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
      const gunzipped = tryNodeGunzip(bytes);
      if (gunzipped) {
        const t = gunzipped.trim();
        if (t.startsWith('{') || t.startsWith('[')) return t;
      }
    }
  } catch {}

  // Case 2: base64-encoded payload (optionally gzip-compressed).
  try {
    const b64ish = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.length >= 64;
    const B = (globalThis as any).Buffer as any;
    if (b64ish && B) {
      const bytes = new Uint8Array(B.from(s.replace(/\s+/g, ''), 'base64'));
      if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
        const gunzipped = tryNodeGunzip(bytes);
        if (gunzipped) {
          const t = gunzipped.trim();
          if (t.startsWith('{') || t.startsWith('[')) return t;
        }
      }
      const asUtf8 = new TextDecoder('utf-8', { fatal: false }).decode(bytes).trim();
      if (asUtf8.startsWith('{') || asUtf8.startsWith('[')) return asUtf8;
    }
  } catch {}

  // Give up: keep original (so we don't delete data).
  return s;
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

function parseRegistrationEndpoints(jsonText: string): any[] {
  const raw = typeof jsonText === 'string' ? jsonText.trim() : '';
  if (!raw) return [];
  if (!(raw.startsWith('{') || raw.startsWith('['))) return [];
  try {
    const obj: any = JSON.parse(raw);
    // Support both legacy `endpoints` and current `services` shapes.
    const endpoints = Array.isArray(obj?.endpoints)
      ? obj.endpoints
      : Array.isArray(obj?.services)
        ? obj.services
        : [];
    return Array.isArray(endpoints) ? endpoints : [];
  } catch {
    return [];
  }
}

function parseRegistrationObject(jsonText: string): any | null {
  const raw = typeof jsonText === 'string' ? jsonText.trim() : '';
  if (!raw) return null;
  if (!(raw.startsWith('{') || raw.startsWith('['))) return null;
  try {
    const obj: any = JSON.parse(raw);
    return obj && typeof obj === 'object' ? obj : null;
  } catch {
    return null;
  }
}

function parseEip155ChainIdFromAgentRegistry(registry: unknown): number | null {
  const s = typeof registry === 'string' ? registry.trim() : '';
  // Expected: eip155:<chainId>:<address>
  const parts = s.split(':');
  if (parts.length < 3) return null;
  if (parts[0].toLowerCase() !== 'eip155') return null;
  const n = Number(parts[1]);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
}

function splitSkillsDomains(ep: any): { skills: string[]; domains: string[] } {
  const skills = Array.isArray(ep?.a2aSkills)
    ? ep.a2aSkills
    : Array.isArray(ep?.skills)
      ? ep.skills
      : [];
  const domains = Array.isArray(ep?.a2aDomains)
    ? ep.a2aDomains
    : Array.isArray(ep?.domains)
      ? ep.domains
      : [];
  const sOut = skills.map((x: any) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
  const dOut = domains.map((x: any) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
  return { skills: sOut, domains: dOut };
}

function partitionOasfKeys(values: string[]): { oasf: string[]; other: string[] } {
  const oasf: string[] = [];
  const other: string[] = [];
  for (const v of values) {
    const s = String(v || '').trim();
    if (!s) continue;
    // treat slash-separated keys as OASF-like; else keep as other
    if (/^[a-z0-9_]+(\/[a-z0-9_]+)+/i.test(s)) oasf.push(s);
    else other.push(s);
  }
  return { oasf, other };
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

    const mintedAtStr = mintedAt > 0n ? mintedAt.toString() : '';
    const parseBigintTime = (v: any): bigint | null => {
      const s = typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(Math.trunc(v)) : '';
      return s && /^\d+$/.test(s) ? BigInt(s) : null;
    };
    let updatedAt = mintedAt > 0n ? mintedAt : 0n;
    // Subgraph registration updatedAt (when available)
    const regUpdated = parseBigintTime(item?.registration?.updatedAt);
    if (regUpdated != null && regUpdated > updatedAt) updatedAt = regUpdated;
    // On-chain metadata KV rows (AgentMetadata entity) - use the latest setAt/timestamp
    const metas = Array.isArray((item as any)?.agentMetadatas) ? ((item as any).agentMetadatas as any[]) : [];
    for (const m of metas) {
      const t1 = parseBigintTime(m?.setAt);
      if (t1 != null && t1 > updatedAt) updatedAt = t1;
      const t2 = parseBigintTime(m?.timestamp);
      if (t2 != null && t2 > updatedAt) updatedAt = t2;
    }
    const updatedAtStr = updatedAt > 0n ? updatedAt.toString() : '';

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
    // - AISmartAgent: did:ethr:<chainId>:<smartAccount>
    // - AIAgent: did:8004:<chainId>:<agentId>
    const uaid = `uaid:${didAccountSmart ?? didIdentity}`;
    const didAccountForProtocols = didAccountSmart ?? didAccountEoa;
    const deferredNodes: string[] = [];

    // IMPORTANT:
    // - SmartAgent node IRI is keyed off smart account DID (authority / UAID)
    // - Non-smart ERC-8004 agent stays keyed off agentId
    const agentNodeIri = didAccountSmart ? agentIriFromAccountDid(didAccountSmart) : agentIri(chainId, agentId);

    // Agent node: only core:AIAgent plus optional core:AISmartAgent (registry-agnostic).
    // Emit core:AIAgent explicitly so queries don't rely on inference.
    const agentExtraType = metaAgentAccount ? ', core:AISmartAgent' : '';
    lines.push(`${agentNodeIri} a core:AIAgent${agentExtraType}, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);

    // Prefer UX fields from the identity descriptor JSON (registration JSON).
    // Requirement: pick the first non-empty value from descriptor JSON (identity descriptor is the first/primary descriptor).
    const registrationRaw = typeof item?.registration?.raw === 'string' && item.registration.raw.trim() ? item.registration.raw.trim() : '';
    const registrationJsonText = registrationRaw ? decodePossiblyCompressedJsonText(registrationRaw) : '';
    const parsedFromDescriptorJson = registrationJsonText ? parseDescriptorFieldsFromJson(registrationJsonText) : { name: null, description: null, image: null };

    const name = (typeof item?.name === 'string' && item.name.trim() ? item.name.trim() : '') || metaAgentName;
    lines.push(`  core:uaid "${escapeTurtleString(uaid)}" ;`);
    // Provenance timestamps must be directly sortable on the agent node.
    if (mintedAtStr) lines.push(`  core:createdAtTime ${mintedAtStr} ;`);
    if (updatedAtStr) lines.push(`  core:updatedAtTime ${updatedAtStr} ;`);
    // NOTE: Do not materialize did:8004/agentId on the agent node.
    // The ERC-8004 agent id belongs on the ERC-8004 identity (erc8004:agentId).
    const agentIdNum = Number(agentId);
    // Legacy + paging/sorting convenience: materialize the numeric agentId on the agent node.
    if (Number.isFinite(agentIdNum) && agentIdNum > 0) lines.push(`  erc8004:agentId8004 ${Math.trunc(agentIdNum)} ;`);

    // AgentDescriptor: normalize UX fields onto a descriptor node (Agent -> core:hasDescriptor -> core:AgentDescriptor)
    const agentDescriptorIri = agentDescriptorIriFromAgentIri(agentNodeIri);
    lines.push(`  core:hasDescriptor ${agentDescriptorIri} ;`);

    // Agent-scoped account relationships:
    // - Keep ONLY SmartAgent -> hasAgentAccount at the agent level (this is not duplicated from identity).
    // - Do NOT copy owner/operator/wallet/ownerEOA accounts onto the agent. Those live on the ERC-8004 identity:
    //   erc8004:hasOwnerAccount / hasOperatorAccount / hasWalletAccount / hasOwnerEOAAccount.
    const ownerAcctIri = accountIri(chainId, ownerAddress);
    const operatorAcctIri = operatorAddress ? accountIri(chainId, operatorAddress) : null;
    const walletAcctIri = accountIri(chainId, agentWallet);
    void ownerAcctIri;
    void operatorAcctIri;
    void walletAcctIri;

    if (metaAgentAccount) {
      // AISmartAgent should be the only thing that links to its agentAccount
      if (smartAccountIri) lines.push(`  core:hasAgentAccount ${smartAccountIri} ;`);
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
    // - We store ERC-8004 registration JSON on the ERC-8004 identity descriptor (erc8004:registrationJson).
    // - A2A/MCP endpoints are represented via core:ServiceEndpoint + core:hasProtocol -> core:A2AProtocol/core:MCPProtocol.
    // Identity node + registration descriptor link (minimal, but standard-aligned)
    const identityIri = identity8004Iri(didIdentity);
    const identityIdentifierIri = identityIdentifier8004Iri(didIdentity);
    const descriptorIri = identity8004DescriptorIri(didIdentity);
    lines.push(`  core:hasIdentity ${identityIri} ;`);
    // terminate agent
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Emit AgentDescriptor node using standard vocab:
    // - dcterms:title (name)
    // - dcterms:description (description)
    // - schema:image (image)
    // Values sourced from the first identity descriptor JSON that provides them (registration JSON).
    const agentDescTitle = parsedFromDescriptorJson.name ?? (name ? String(name).trim() : null);
    const agentDescDescription = parsedFromDescriptorJson.description ?? null;
    const agentDescImage = parsedFromDescriptorJson.image ?? null;
    lines.push(`${agentDescriptorIri} a core:AgentDescriptor, core:Descriptor, prov:Entity ;`);
    if (agentDescTitle) lines.push(`  dcterms:title "${escapeTurtleString(agentDescTitle)}" ;`);
    if (agentDescDescription) lines.push(`  dcterms:description "${escapeTurtleString(agentDescDescription)}" ;`);
    if (agentDescImage) {
      const imgTok = turtleIriOrLiteral(agentDescImage);
      if (imgTok) lines.push(`  schema:image ${imgTok} ;`);
    }
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Emit deferred nodes (e.g., SmartAccount + identifiers) after agent termination
    if (deferredNodes.length) {
      for (const ln of deferredNodes) lines.push(ln);
      lines.push('');
    }

    lines.push(`${identityIri} a erc8004:AgentIdentity8004, core:AgentIdentity, prov:Entity ;`);
    lines.push(`  core:identityOf ${agentNodeIri} ;`);
    // Materialize numeric agentId on the identity for fast query/sort without DID parsing.
    if (Number.isFinite(agentIdNum) && agentIdNum > 0) lines.push(`  erc8004:agentId ${Math.trunc(agentIdNum)} ;`);
    // Provenance timestamps live on the identity too (agent mirrors these values).
    if (mintedAtStr) lines.push(`  core:createdAtTime ${mintedAtStr} ;`);
    if (updatedAtStr) lines.push(`  core:updatedAtTime ${updatedAtStr} ;`);
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
      `${descriptorIri} a erc8004:Descriptor8004Identity, erc8004:IdentityDescriptor8004, erc8004:AgentRegistration8004, core:AgentIdentityDescriptor, core:Descriptor, prov:Entity ;`,
    );
    const parsed = registrationJsonText ? parseDescriptorFieldsFromJson(registrationJsonText) : { name: null, description: null, image: null };
    const descTitle = parsed.name ?? name;
    const descDescription =
      parsed.description ??
      (typeof item?.description === 'string' && item.description.trim() ? item.description.trim() : null);
    const descImage = parsed.image ?? (item?.image != null ? String(item.image) : null);

    if (descTitle) lines.push(`  dcterms:title "${escapeTurtleString(descTitle)}" ;`);
    if (descDescription) lines.push(`  dcterms:description "${escapeTurtleString(descDescription)}" ;`);
    if (descImage) {
      const imgTok = turtleIriOrLiteral(descImage);
      if (imgTok) lines.push(`  schema:image ${imgTok} ;`);
    }
    // AgentURI / registration JSON: ALWAYS store on identity descriptor.
    if (registrationJsonText) lines.push(`  erc8004:registrationJson ${turtleJsonLiteral(registrationJsonText)} ;`);

    // Registration-derived signals (materialized for analytics/badges)
    const regObj = registrationJsonText ? parseRegistrationObject(registrationJsonText) : null;
    if (regObj && typeof regObj === 'object') {
      const x402 = Boolean((regObj as any).x402Support ?? (regObj as any).x402support);
      if (x402) lines.push(`  erc8004:x402Support true ;`);

      // OASF service declaration counts (skills + domains)
      const services = Array.isArray((regObj as any).services) ? ((regObj as any).services as any[]) : [];
      let oasfSkillCount = 0;
      let oasfDomainCount = 0;
      for (const s of services) {
        if (!s || typeof s !== 'object') continue;
        const name = String((s as any).name ?? '').trim().toLowerCase();
        if (name !== 'oasf') continue;
        const skills = Array.isArray((s as any).skills) ? (s as any).skills : [];
        const domains = Array.isArray((s as any).domains) ? (s as any).domains : [];
        const uniqSkills = new Set(skills.filter((x: any) => typeof x === 'string' && x.trim()).map((x: any) => String(x).trim()));
        const uniqDomains = new Set(domains.filter((x: any) => typeof x === 'string' && x.trim()).map((x: any) => String(x).trim()));
        oasfSkillCount = Math.max(oasfSkillCount, uniqSkills.size);
        oasfDomainCount = Math.max(oasfDomainCount, uniqDomains.size);
      }
      if (oasfSkillCount > 0) lines.push(`  erc8004:registrationOasfSkillCount ${oasfSkillCount} ;`);
      if (oasfDomainCount > 0) lines.push(`  erc8004:registrationOasfDomainCount ${oasfDomainCount} ;`);
    }
    // Parse registration JSON once during sync and materialize skills/domains/protocolDescriptors into KB triples.
    // On-chain metadata KV rows (lossless) stored on identity descriptor.
    // Source: subgraph agentMetadata_collection rows attached to item.agentMetadatas.
    if (onchainObj && typeof onchainObj === 'object') {
      try {
        // Prefer the normalized KV object produced by buildOnchainMetadataFromAgentMetadatas.
        lines.push(`  erc8004:nftMetadataJson ${turtleJsonLiteral(JSON.stringify(onchainObj))} ;`);
      } catch {}
    } else if (onchainMetadataText && onchainMetadataText.trim()) {
      try {
        // Fallback: raw text form from buildOnchainMetadataFromAgentMetadatas (still from subgraph).
        lines.push(`  erc8004:nftMetadataJson ${turtleJsonLiteral(String(onchainMetadataText))} ;`);
      } catch {}
    }
    // Essential fields (registeredBy, registryNamespace) are still stored as individual triples
    if (metaRegisteredBy) lines.push(`  erc8004:registeredBy "${escapeTurtleString(metaRegisteredBy)}" ;`);
    if (metaRegistryNamespace) lines.push(`  erc8004:registryNamespace "${escapeTurtleString(metaRegistryNamespace)}" ;`);
    // terminate descriptor
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Multi-registration references: add additional ERC-8004 identities (different chains/agentIds) to the same agent node.
    if (regObj && typeof regObj === 'object') {
      const regs = Array.isArray((regObj as any).registrations) ? ((regObj as any).registrations as any[]) : [];
      for (const r of regs) {
        if (!r || typeof r !== 'object') continue;
        const otherAgentIdRaw = (r as any).agentId;
        const otherAgentIdNum = Number(otherAgentIdRaw);
        if (!Number.isFinite(otherAgentIdNum) || otherAgentIdNum <= 0) continue;
        const otherChainId = parseEip155ChainIdFromAgentRegistry((r as any).agentRegistry);
        if (!otherChainId) continue;
        // Skip the current chain/agentId (already emitted).
        if (otherChainId === chainId && Math.trunc(otherAgentIdNum) === Math.trunc(agentIdNum)) continue;

        const otherDidIdentity = `did:8004:${otherChainId}:${Math.trunc(otherAgentIdNum)}`;
        const otherIdentityIri = identity8004Iri(otherDidIdentity);
        const otherIdentifierIri = identityIdentifier8004Iri(otherDidIdentity);

        // Link agent -> identity
        lines.push(`${agentNodeIri} core:hasIdentity ${otherIdentityIri} .`);
        lines.push('');

        // Minimal identity node (no accounts/descriptors because we don't have them here)
        lines.push(`${otherIdentityIri} a erc8004:AgentIdentity8004, core:AgentIdentity, prov:Entity ;`);
        lines.push(`  core:identityOf ${agentNodeIri} ;`);
        lines.push(`  erc8004:agentId ${Math.trunc(otherAgentIdNum)} ;`);
        lines.push(`  core:hasIdentifier ${otherIdentifierIri} .`);
        lines.push('');

        lines.push(`${otherIdentifierIri} a erc8004:IdentityIdentifier8004, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
        lines.push(`  core:protocolIdentifier "${escapeTurtleString(otherDidIdentity)}" ;`);
        lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/8004> .`);
        lines.push('');
      }
    }

    if (registrationJsonText) {
      const endpoints = parseRegistrationEndpoints(registrationJsonText);
      const allSkills: string[] = [];
      const allDomains: string[] = [];
      for (const ep of endpoints) {
        if (!ep || typeof ep !== 'object') continue;
        const epName = typeof ep?.name === 'string' ? ep.name.trim().toLowerCase() : '';
        const serviceUrl = typeof ep?.endpoint === 'string' ? ep.endpoint.trim() : '';
        if (!serviceUrl) continue;
        const { skills, domains } = splitSkillsDomains(ep);
        allSkills.push(...skills);
        allDomains.push(...domains);

        // Only materialize Protocol/ServiceEndpoint triples for known protocol types.
        // Other `services` (e.g. OASF, web, twitter, email) are kept as descriptor evidence only.
        const protocol: 'a2a' | 'mcp' | null = epName.includes('a2a') ? 'a2a' : epName.includes('mcp') ? 'mcp' : null;
        if (!protocol) continue;

        lines.push(
          emitProtocolDescriptorFromRegistration({
            didAccount: didAccountForProtocols,
            protocol,
            serviceUrl,
            protocolVersion: typeof ep?.version === 'string' ? ep.version : null,
            endpointJson: ep,
            skills: partitionOasfKeys(skills),
            domains: partitionOasfKeys(domains),
            agentIri: agentNodeIri,
            identityIri: identityIri,
          }),
        );
        lines.push('');
      }

      // Also attach aggregated skills/domains directly to the identity descriptor for easy query/mapping.
      const uniq = (arr: string[]) => Array.from(new Set(arr.map((s) => String(s || '').trim()).filter(Boolean)));
      const aggSkills = uniq(allSkills);
      const aggDomains = uniq(allDomains);
      if (aggSkills.length || aggDomains.length) {
        lines.push(
          emitIdentityDescriptorSkillsDomains({
            descriptorIri,
            subjectKey: didIdentity,
            skills: aggSkills,
            domains: aggDomains,
          }),
        );
        lines.push('');
      }
    }

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

      lines.push(`${ensIdIri} a ens:AgentIdentityEns, core:AgentIdentity, prov:Entity ;`);
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
        recordsEntityIri: identityIri,
      }),
    );
    lines.push('');
  }

  return { turtle: lines.join('\n'), maxCursor };
}

