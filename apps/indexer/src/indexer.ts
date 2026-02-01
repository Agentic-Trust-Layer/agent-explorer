import { createPublicClient, http, webSocket, type Address, decodeEventLog } from "viem";
import { db, getCheckpoint, setCheckpoint, ensureSchemaInitialized } from "./db";
import { RPC_WS_URL, CONFIRMATIONS, START_BLOCK, LOGS_CHUNK_SIZE, BACKFILL_MODE, ETH_SEPOLIA_GRAPHQL_URL, BASE_SEPOLIA_GRAPHQL_URL, OP_SEPOLIA_GRAPHQL_URL, GRAPHQL_API_KEY, GRAPHQL_POLL_MS } from "./env";
import { ethers } from 'ethers';
import { ERC8004Client, EthersAdapter } from '@agentic-trust/8004-sdk';
import { fileURLToPath } from 'node:url';
import { resolve as pathResolve } from 'node:path';
// Semantic ingest is intentionally NOT part of the indexer runtime. Use CLI only.
import { resolveEoaInfo, resolveEoaOwner } from './ownership.js';
import { computeAndUpsertATI } from './ati.js';
import { upsertAgentCardForAgent } from './a2a/agent-card-fetch.js';


import { 
    ETH_SEPOLIA_IDENTITY_REGISTRY, 
    BASE_SEPOLIA_IDENTITY_REGISTRY, 
    OP_SEPOLIA_IDENTITY_REGISTRY,
    ETH_SEPOLIA_RPC_HTTP_URL, 
    BASE_SEPOLIA_RPC_HTTP_URL,
    OP_SEPOLIA_RPC_HTTP_URL } from './env';

function makeRpcProvider(rpcUrl: string): ethers.JsonRpcProvider {
  // ethers v6 request timeouts default relatively low; make this configurable for slower RPCs.
  const timeoutMsRaw = process.env.RPC_HTTP_TIMEOUT_MS;
  const timeoutMs = timeoutMsRaw && String(timeoutMsRaw).trim() ? Number(timeoutMsRaw) : 60_000;
  const req = new ethers.FetchRequest(rpcUrl);
  (req as any).timeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 60_000;
  return new ethers.JsonRpcProvider(req);
}

const ethSepliaEthersProvider = makeRpcProvider(ETH_SEPOLIA_RPC_HTTP_URL);
const ethSepoliathersAdapter = new EthersAdapter(ethSepliaEthersProvider); // No signer needed for reads


const erc8004EthSepoliaClient = new ERC8004Client({
  adapter: ethSepoliathersAdapter,
  addresses: {
    identityRegistry: ETH_SEPOLIA_IDENTITY_REGISTRY!,
    reputationRegistry: '0x0000000000000000000000000000000000000000', // Not used by indexer
    validationRegistry: '0x0000000000000000000000000000000000000000', // Not used by indexer
    chainId: 11155111, // Eth Sepolia
  }
});

async function maybeBackfillRdfFromStoredAgentCards(dbInstance: any) {
  // RDF export is intentionally NOT part of the indexer runtime.
  // Run RDF generation via CLI only (e.g. `pnpm rdf:agent` or `pnpm graphdb:ingest agents`).
  void dbInstance;
}


const baseSepliaEthersProvider = makeRpcProvider(BASE_SEPOLIA_RPC_HTTP_URL);
const baseSepoliathersAdapter = new EthersAdapter(baseSepliaEthersProvider); // No signer needed for reads

const erc8004BaseSepoliaClient = new ERC8004Client({
  adapter: baseSepoliathersAdapter,
  addresses: {
    identityRegistry: BASE_SEPOLIA_IDENTITY_REGISTRY!,
    reputationRegistry: '0x0000000000000000000000000000000000000000', // Not used by indexer
    validationRegistry: '0x0000000000000000000000000000000000000000', // Not used by indexer
    chainId: 84532, // Base Sepolia (L2)
  }
});

const opSepliaEthersProvider = OP_SEPOLIA_RPC_HTTP_URL ? makeRpcProvider(OP_SEPOLIA_RPC_HTTP_URL) : null;
const opSepoliathersAdapter = opSepliaEthersProvider ? new EthersAdapter(opSepliaEthersProvider) : null;

const erc8004OpSepoliaClient = opSepoliathersAdapter && OP_SEPOLIA_IDENTITY_REGISTRY ? new ERC8004Client({
  adapter: opSepoliathersAdapter,
  addresses: {
    identityRegistry: OP_SEPOLIA_IDENTITY_REGISTRY,
    reputationRegistry: '0x0000000000000000000000000000000000000000', // Not used by indexer
    validationRegistry: '0x0000000000000000000000000000000000000000', // Not used by indexer
    chainId: 11155420, // Optimism Sepolia (L2)
  }
}) : null;


// ---- helpers ----
function toDecString(x: bigint | number | string) {
  return typeof x === "bigint" ? x.toString(10) : String(x);
}



export async function tryReadTokenURI(client: ERC8004Client, tokenId: bigint): Promise<string | null> {
  try {

    const uri = await client.identity.getTokenURI(tokenId);

    return uri ?? null;
  } catch {
    return null;
  }
}

function extractCid(tokenURI: string): string | null {
  try {
    if (tokenURI.startsWith('ipfs://')) {
      const rest = tokenURI.slice('ipfs://'.length);
      const cid = rest.split('/')[0]?.trim();
      return cid || null;
    }
    
    // Try subdomain format: https://CID.ipfs.gateway.com (Web3Storage, Pinata subdomain)
    const subdomainMatch = tokenURI.match(/https?:\/\/([a-zA-Z0-9]{46,})\.ipfs\.[^\/\s]*/i);
    if (subdomainMatch && subdomainMatch[1]) {
      return subdomainMatch[1];
    }
    
    // Try path format: https://gateway.com/ipfs/CID (Pinata, IPFS.io, etc.)
    const pathMatch = tokenURI.match(/https?:\/\/[^\/]+\/ipfs\/([a-zA-Z0-9]{46,})/i);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }
    
    // Fallback: try to match any CID-like pattern (Qm... or bafy...)
    const cidMatch = tokenURI.match(/(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{56})/i);
    if (cidMatch && cidMatch[1]) {
      return cidMatch[1];
    }
  } catch {}
  return null;
}

function hexToUtf8(dataHex: string): string | null {
  const h = typeof dataHex === 'string' ? dataHex.trim() : '';
  if (!h || !h.startsWith('0x')) return null;
  const hex = h.slice(2);
  if (!hex || hex.length % 2 !== 0) return null;
  try {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    const trimmed = text.replace(/\u0000/g, '').trim();
    if (!trimmed) return null;
    // Heuristic: require that the output is mostly printable
    const printable = trimmed.replace(/[^\x09\x0a\x0d\x20-\x7e]/g, '');
    if (printable.length / trimmed.length < 0.75) return null;
    return trimmed;
  } catch {
    return null;
  }
}

function decodeAbiStringFromBytesHex(dataHex: string): string | null {
  const h = typeof dataHex === 'string' ? dataHex.trim() : '';
  if (!h || !h.startsWith('0x')) return null;
  const hex = h.slice(2);
  if (!hex || hex.length % 2 !== 0) return null;
  try {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    const readWord = (wordIndex: number): bigint => {
      const off = wordIndex * 32;
      if (off + 32 > bytes.byteLength) return 0n;
      let v = 0n;
      for (let i = 0; i < 32; i++) v = (v << 8n) | BigInt(bytes[off + i]);
      return v;
    };

    const tryOffset = (off: bigint): string | null => {
      const o = Number(off);
      if (!Number.isFinite(o) || o < 0 || o + 32 > bytes.byteLength) return null;
      if (o % 32 !== 0) return null;
      // length word
      let len = 0n;
      for (let i = 0; i < 32; i++) len = (len << 8n) | BigInt(bytes[o + i]);
      const n = Number(len);
      if (!Number.isFinite(n) || n < 0 || o + 32 + n > bytes.byteLength) return null;
      const slice = bytes.slice(o + 32, o + 32 + n);
      const txt = new TextDecoder('utf-8', { fatal: false }).decode(slice).replace(/\u0000/g, '').trim();
      return txt || null;
    };

    // Common patterns:
    // 1) abi.encode(string): first word is offset (0x20)
    // 2) abi.encode(uint256, string): second word is offset (0x40)
    const w0 = readWord(0);
    const w1 = readWord(1);
    return tryOffset(w0) ?? tryOffset(w1);
  } catch {
    return null;
  }
}

function extractIpfsUriFromAssociationData(dataHex: string): { ipfsUri: string; cid: string } | null {
  // Try decode bytes->utf8 first; otherwise fall back to scanning for CID patterns.
  const decodedAbi = decodeAbiStringFromBytesHex(dataHex) ?? '';
  const decoded = decodedAbi || hexToUtf8(dataHex) || '';
  const candidates: string[] = [];
  if (decoded) candidates.push(decoded);
  // Also include hex itself as a scan surface (some encodings embed ASCII)
  candidates.push(dataHex);

  for (const s of candidates) {
    if (!s) continue;
    const cid = extractCid(s);
    if (cid) {
      // Normalize to ipfs://CID if we don't already have an ipfs-like URI
      const ipfsUri = s.includes('ipfs://') || s.includes('/ipfs/') || s.includes('.ipfs.')
        ? s
        : `ipfs://${cid}`;
      return { ipfsUri, cid };
    }
  }
  return null;
}

function deepFindString(obj: any, keys: string[]): string | null {
  const seen = new Set<any>();
  const maxNodes = 10_000;
  let nodes = 0;
  const stack: any[] = [obj];
  while (stack.length) {
    const cur = stack.pop();
    nodes += 1;
    if (nodes > maxNodes) return null;
    if (!cur || typeof cur !== 'object') continue;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const k of keys) {
      const v = (cur as any)[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    if (Array.isArray(cur)) {
      for (const v of cur) stack.push(v);
    } else {
      for (const v of Object.values(cur)) stack.push(v);
    }
  }
  return null;
}

async function upsertAssociationDelegationFromIpfs(item: any, chainId: number, dbInstance: any): Promise<void> {
  const associationId = normalizeHex(item?.id != null ? String(item.id) : null);
  if (!associationId) return;
  const dataHex = normalizeHex(item?.data != null ? String(item.data) : null) ?? '';
  if (!dataHex) return;

  const decodedText = decodeAbiStringFromBytesHex(dataHex) ?? hexToUtf8(dataHex);
  const ptr = extractIpfsUriFromAssociationData(dataHex);
  let json: any | null = null;
  if (ptr) {
    json = await fetchIpfsJson(ptr.ipfsUri);
    if (!json || typeof json !== 'object') json = null;
  }
  // If we can't fetch IPFS JSON, still persist decoded text (so RDF export can materialize delegations).
  if (!json && !decodedText) return;
  if (!json && decodedText) json = { raw: decodedText };

  const extractedFeedbackAuth = deepFindString(json, ['feedbackAuth', 'feedback_auth', 'feedbackAuthToken']);
  const extractedRequestHash = deepFindString(json, ['requestHash', 'request_hash', 'validationRequestHash']);
  const extractedKind =
    extractedFeedbackAuth ? 'feedbackAuth' : extractedRequestHash ? 'validationRequest' : (deepFindString(json, ['type', '@type']) ?? 'unknown');

  const now = Math.floor(Date.now() / 1000);
  const stmt = dbInstance.prepare(`
    INSERT INTO association_delegations(
      chainId, associationId,
      ipfsUri, ipfsCid, delegationJson, decodedDataText,
      extractedKind, extractedFeedbackAuth, extractedRequestHash,
      fetchedAt, updatedAt
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(chainId, associationId) DO UPDATE SET
      ipfsUri=excluded.ipfsUri,
      ipfsCid=excluded.ipfsCid,
      delegationJson=excluded.delegationJson,
      decodedDataText=excluded.decodedDataText,
      extractedKind=excluded.extractedKind,
      extractedFeedbackAuth=excluded.extractedFeedbackAuth,
      extractedRequestHash=excluded.extractedRequestHash,
      updatedAt=excluded.updatedAt
  `);

  await stmt.run(
    chainId,
    associationId,
    ptr?.ipfsUri ?? '',
    ptr?.cid ?? '',
    JSON.stringify(json),
    decodedText ?? '',
    extractedKind,
    extractedFeedbackAuth ?? '',
    extractedRequestHash ?? '',
    now,
    now,
  );

  // Debug-friendly: confirm we wrote something for this association.
  if (process?.env?.DEBUG_ASSOC_DELEGATIONS === '1') {
    console.info('............association_delegations upserted', {
      chainId,
      associationId,
      ipfsCid: ptr?.cid ?? '',
      kind: extractedKind,
      hasDecodedText: Boolean(decodedText && decodedText.trim()),
    });
  }
}

/**
 * Create an AbortSignal with timeout (compatible with both Node.js and Workers)
 */
function createTimeoutSignal(timeoutMs: number): AbortSignal {
  // Try AbortSignal.timeout if available (Node.js 17.3+, modern browsers)
  if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    return (AbortSignal as any).timeout(timeoutMs);
  }
  
  // Fallback: create manual AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  // Note: We can't clear the timeout on success in Workers, but that's okay
  // The timeout will just fire and abort, but the promise should already be resolved
  return controller.signal;
}

async function fetchIpfsJson(tokenURI: string | null): Promise<any | null> {
  if (!tokenURI) return null;
  const fetchFn = (globalThis as any).fetch as undefined | ((input: any, init?: any) => Promise<any>);
  if (!fetchFn) return null;
  try {
    // Handle inline data URIs (data:application/json,...)
    if (tokenURI.startsWith('data:application/json')) {
      try {
        const commaIndex = tokenURI.indexOf(',');
        if (commaIndex === -1) {
          console.warn("............fetchIpfsJson: Invalid data URI format");
          return null;
        }
        
        const jsonData = tokenURI.substring(commaIndex + 1);
        let parsed;
        
        // Check if it's marked as base64 encoded
        if (tokenURI.startsWith('data:application/json;base64,')) {
          try {
            // Try base64 decode first (use atob for compatibility with Workers)
            const jsonString = atob(jsonData);
            parsed = JSON.parse(jsonString);
          } catch (e) {
            // If base64 fails, try parsing as plain JSON (some URIs are mislabeled)
            console.info("............fetchIpfsJson: base64 decode failed, trying plain JSON");
            try {
              parsed = JSON.parse(jsonData);
            } catch (e2) {
              const decodedJson = decodeURIComponent(jsonData);
              parsed = JSON.parse(decodedJson);
            }
          }
        } else {
          // Plain JSON - try parsing directly first, then URL decode if needed
          try {
            parsed = JSON.parse(jsonData);
          } catch (e) {
            const decodedJson = decodeURIComponent(jsonData);
            parsed = JSON.parse(decodedJson);
          }
        }
        
        return parsed;
      } catch (e) {
        console.warn("............fetchIpfsJson: Failed to parse inline data URI:", e);
        return null;
      }
    }
    
    const cid = extractCid(tokenURI);
    if (cid) {
      // Detect if URI suggests a specific service (from URL format)
      const isPinataUrl = tokenURI.includes('pinata') || tokenURI.includes('gateway.pinata.cloud');
      const isWeb3StorageUrl = tokenURI.includes('w3s.link') || tokenURI.includes('web3.storage');
      
      // Try multiple IPFS gateways as fallbacks
      // Prioritize based on detected service, then try all options
      const gateways: Array<{ url: string; service: string }> = [];

      // If tokenURI is already a gateway URL, try it first.
      if (/^https?:\/\//i.test(tokenURI) && (tokenURI.includes('.ipfs.') || tokenURI.includes('/ipfs/'))) {
        gateways.push({ url: tokenURI, service: 'Original tokenURI gateway' });
      }
      
      // Pinata gateways (try first if detected as Pinata, otherwise after Web3Storage)
      const pinataGateways = [
        { url: `https://gateway.pinata.cloud/ipfs/${cid}`, service: 'Pinata (gateway.pinata.cloud)' },
        { url: `https://${cid}.ipfs.mypinata.cloud`, service: 'Pinata (mypinata.cloud subdomain)' },
      ];
      
      // Web3Storage gateways (try first if detected as Web3Storage, otherwise try early)
      const web3StorageGateways = [
        { url: `https://${cid}.ipfs.w3s.link`, service: 'Web3Storage (w3s.link)' },
        { url: `https://w3s.link/ipfs/${cid}`, service: 'Web3Storage (w3s.link path)' },
      ];
      
      // Public IPFS gateways (fallbacks)
      const publicGateways = [
        { url: `https://ipfs.io/ipfs/${cid}`, service: 'IPFS.io' },
        { url: `https://cloudflare-ipfs.com/ipfs/${cid}`, service: 'Cloudflare IPFS' },
        { url: `https://${cid}.ipfs.dweb.link`, service: 'Protocol Labs (ipfs.dweb.link subdomain)' },
        { url: `https://ipfs.dweb.link/ipfs/${cid}`, service: 'Protocol Labs (ipfs.dweb.link path)' },
        { url: `https://dweb.link/ipfs/${cid}`, service: 'Protocol Labs (dweb.link)' },
        { url: `https://gateway.ipfs.io/ipfs/${cid}`, service: 'IPFS Gateway' },
      ];
      
      // Build gateway list with priority based on detection
      if (isPinataUrl) {
        // Pinata detected: try Pinata first, then Web3Storage, then public
        gateways.push(...pinataGateways, ...web3StorageGateways, ...publicGateways);
      } else if (isWeb3StorageUrl) {
        // Web3Storage detected: try Web3Storage first, then Pinata, then public
        gateways.push(...web3StorageGateways, ...pinataGateways, ...publicGateways);
      } else {
        // No detection: try Web3Storage first (most common), then Pinata, then public
        gateways.push(...web3StorageGateways, ...pinataGateways, ...publicGateways);
      }
      
      for (const { url: ipfsUrl, service } of gateways) {
        try {
          const timeoutSignal = createTimeoutSignal(10000); // 10 second timeout per gateway
          console.info(`............fetchIpfsJson: trying ${service}: ${ipfsUrl}`);
          const resp = await fetchFn(ipfsUrl, { 
            signal: timeoutSignal
          });
          if (resp?.ok) {
            const json = await resp.json();
            console.info(`............fetchIpfsJson: ✅ success from ${service}`);
            return json ?? null;
          } else {
          }
        } catch (e: any) {
          const errorMsg = e?.message || String(e);
          // Don't log timeout errors for every gateway (too noisy)
          if (!errorMsg.includes('aborted') && !errorMsg.includes('timeout')) {
            console.info(`............fetchIpfsJson: ${service} failed: ${errorMsg}, trying next gateway`)
          }
          // Continue to next gateway
          continue;
        }
      }
      
      console.warn(`............fetchIpfsJson: ❌ all IPFS gateways failed for CID: ${cid}`)
    }
    if (/^https?:\/\//i.test(tokenURI)) {
      const resp = await fetchFn(tokenURI);
      if (resp?.ok) return await resp.json();
    }
  } catch {}
  return null;
}

export async function upsertFromTransfer(to: string, tokenId: bigint, tokenInfo: any, blockNumber: bigint, tokenURI: string | null, chainId: number, dbOverride?: any) {
  // Use provided db override (for Workers) or fall back to module-level db (for local)
  const dbInstance = dbOverride || db;
  
  if (!dbInstance) {
    throw new Error('Database instance required for upsertFromTransfer. In Workers, db must be passed via dbOverride parameter');
  }
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const agentId = toDecString(tokenId);
  const agentIdentityOwnerAccountAddr = to.toLowerCase(); // ERC-721 owner (Account.id)
  // Never allow an "unknown" owner from the subgraph to clobber a previously-correct row.
  // Some subgraph deployments can temporarily emit zero-address owners; treat those rows as invalid updates.
  if (agentIdentityOwnerAccountAddr === ZERO_ADDRESS) {
    console.warn(`[upsertFromTransfer] skip zero-owner update (chainId=${chainId} agentId=${agentId})`);
    return;
  }
  let agentAccountAddr: string | null = null; // agent's configured account (subgraph agentWallet)
  let agentName = readAgentName(tokenInfo) || ""; // not modeled in ERC-721; leave empty
  let resolvedTokenURI =
    tokenURI ??
    (typeof tokenInfo?.agentUri === 'string' ? tokenInfo.agentUri : null) ??
    (typeof tokenInfo?.agentURI === 'string' ? tokenInfo.agentURI : null) ??
    (typeof tokenInfo?.uri === 'string' ? tokenInfo.uri : null);
  let shouldFetchAgentCard = false;
  try {
    const existing = await dbInstance
      .prepare('SELECT agentUri, agentCardReadAt FROM agents WHERE chainId = ? AND agentId = ?')
      .get(chainId, agentId);
    const prevTokenUri = (existing as any)?.agentUri != null ? String((existing as any).agentUri) : null;
    const prevReadAt = Number((existing as any)?.agentCardReadAt ?? 0) || 0;
    if (prevTokenUri !== resolvedTokenURI) shouldFetchAgentCard = true;
    if (!prevReadAt) shouldFetchAgentCard = true;
  } catch {
    // best-effort
  }
  const mintedTimestamp = (() => {
    try {
      if (tokenInfo?.mintedAt === undefined || tokenInfo?.mintedAt === null) return null;
      const parsed = Number(tokenInfo.mintedAt);
      return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : null;
    } catch {
      return null;
    }
  })();
  const metadataAgentWallet = (() => {
    const v = tokenInfo?.agentWallet;
    if (typeof v !== 'string') return null;
    const s = v.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(s)) return null;
    const addr = s.toLowerCase();
    return addr === ZERO_ADDRESS ? null : addr;
  })();
  if (metadataAgentWallet) {
    agentAccountAddr = metadataAgentWallet;
  }

  // Extremely noisy during backfills; enable only when debugging transfers.
  if (process.env.DEBUG_TRANSFERS === '1') {
    console.info('.... processed agentId', { chainId, agentId, tokenId: tokenId.toString() });
    console.info(".... agentIdentityOwnerAccount", agentIdentityOwnerAccountAddr);
    console.info(".... chainId", chainId);
  }

  // Fetch metadata from tokenURI BEFORE database insert to populate all fields
  let preFetchedMetadata: any = null;
  // Preserve raw registration JSON from the subgraph even if we fail to parse it.
  // This should be the primary source of agents.rawJson during backfills (no extra IPFS/RPC).
  let metadataJsonRaw: string | null = null;
  const applyMetadataHints = (meta: any) => {
    if (!meta || typeof meta !== 'object') return;
    const inferredName = readAgentName(meta);
    if ((!agentName || agentName.trim() === '') && inferredName) {
      agentName = inferredName;
        }
    if ((!description || !description.trim()) && typeof meta.description === 'string' && meta.description.trim()) {
      description = meta.description.trim();
    }
    if (!image && meta.image != null) {
      image = String(meta.image);
    }
    if (!a2aEndpoint) {
      const endpoints = Array.isArray(meta.endpoints) ? meta.endpoints : [];
        const findEndpoint = (n: string) => {
          const e = endpoints.find((x: any) => (x?.name ?? '').toLowerCase() === n.toLowerCase());
          return e && typeof e.endpoint === 'string' ? e.endpoint : null;
        };
      a2aEndpoint = a2aEndpoint || findEndpoint('A2A') || findEndpoint('a2a');
    }
  };
  let a2aEndpoint: string | null = null;
  let description: string | null = null;
  let image: string | null = null;
  const tokenInfoName = readAgentName(tokenInfo);
  if (tokenInfo && tokenInfoName) { 
    if (process.env.DEBUG_TRANSFERS === '1') {
      console.info("............upsertFromTransfer: tokenInfo: ", tokenInfo);
    }
    agentName = tokenInfoName;
  }
  if (tokenInfo && typeof tokenInfo.description === 'string' && tokenInfo.description.trim()) {
    description = tokenInfo.description.trim();
  }
  if (tokenInfo && tokenInfo.image != null) {
    image = String(tokenInfo.image);
  }
  if (tokenInfo && typeof tokenInfo.a2aEndpoint === 'string' && tokenInfo.a2aEndpoint.trim()) {
    a2aEndpoint = tokenInfo.a2aEndpoint;
  } else if (!a2aEndpoint && typeof tokenInfo?.chatEndpoint === 'string' && tokenInfo.chatEndpoint.trim()) {
    a2aEndpoint = tokenInfo.chatEndpoint.trim();
        }

  if (tokenInfo?.metadataJson) {
    if (typeof tokenInfo.metadataJson === 'string' && tokenInfo.metadataJson.trim()) {
      const mj = tokenInfo.metadataJson.trim();
      metadataJsonRaw = mj;
      try {
        preFetchedMetadata = JSON.parse(mj);
      } catch (error) {
        console.warn("............upsertFromTransfer: Failed to parse token metadataJson string:", error);
      }
    } else if (typeof tokenInfo.metadataJson === 'object') {
      preFetchedMetadata = tokenInfo.metadataJson;
      try {
        metadataJsonRaw = JSON.stringify(tokenInfo.metadataJson);
      } catch {
        metadataJsonRaw = null;
      }
    }
  }
  applyMetadataHints(preFetchedMetadata);
  // Inline data URIs don't require network; parse even when IPFS fetch is disabled.
  if (!preFetchedMetadata && resolvedTokenURI && resolvedTokenURI.startsWith('data:application/json')) {
    try {
      const inlineMetadata = await fetchIpfsJson(resolvedTokenURI);
      if (inlineMetadata && typeof inlineMetadata === 'object') {
        preFetchedMetadata = inlineMetadata;
        if (!metadataJsonRaw) {
          try {
            metadataJsonRaw = JSON.stringify(inlineMetadata);
          } catch {
            metadataJsonRaw = null;
          }
        }
        applyMetadataHints(preFetchedMetadata);
      }
    } catch (e) {
      console.warn("............upsertFromTransfer: Failed to parse inline agentUri data:", e);
    }
  }
  // IPFS metadata fetch is very slow during big backfills; keep it opt-in.
  const allowIpfsMetadataFetch = process.env.FETCH_IPFS_METADATA_ON_WRITE === '1';
  if (!preFetchedMetadata && resolvedTokenURI && allowIpfsMetadataFetch) {
    try {
      const metadata = await fetchIpfsJson(resolvedTokenURI);
      if (metadata && typeof metadata === 'object') {
        preFetchedMetadata = metadata;
        applyMetadataHints(preFetchedMetadata);
      }
    } catch (e) {
      console.warn("............upsertFromTransfer: Failed to fetch metadata before insert:", e);
    }
  }


  if (agentIdentityOwnerAccountAddr != '0x000000000000000000000000000000000000dEaD') {
    // Types should always be present (eoa|aa). We determine this by resolving to the controlling EOA:
    // - if resolve(addr) == addr => 'eoa'
    // - else => 'aa'
    //
    const ownerInfo = await resolveEoaInfo(chainId, agentIdentityOwnerAccountAddr);
    const createdAtTime = mintedTimestamp ?? Math.floor(Date.now() / 1000);
    
    // Compute DID values
    const didIdentity = `did:8004:${chainId}:${agentId}`;
    const agentAccountAddrFinal = (agentAccountAddr ?? agentIdentityOwnerAccountAddr).toLowerCase();
    if (agentAccountAddrFinal === ZERO_ADDRESS) {
      console.warn(`[upsertFromTransfer] skip zero-agentAccount update (chainId=${chainId} agentId=${agentId})`);
      return;
    }
    const agentInfo = await resolveEoaInfo(chainId, agentAccountAddrFinal);
    const didAccount = agentAccountAddrFinal ? `did:ethr:${chainId}:${agentAccountAddrFinal}` : '';
    const didName = agentName && agentName.endsWith('.eth') ? `did:ens:${chainId}:${agentName}` : null;

    // Canonical DB storage: "{chainId}:{0x...}"
    const agentAccount = `${chainId}:${agentAccountAddrFinal}`;
    const eoaAgentAccount = agentInfo ? `${chainId}:${agentInfo.eoaAddress}` : `${chainId}:${agentAccountAddrFinal}`;
    console.log(`[upsertFromTransfer] agentAccount=${agentAccount}, agentInfo=${JSON.stringify(agentInfo)}, eoaAgentAccount=${eoaAgentAccount}`);
    const agentIdentityOwnerAccount = `${chainId}:${agentIdentityOwnerAccountAddr}`;
    const eoaAgentIdentityOwnerAccount = ownerInfo ? `${chainId}:${ownerInfo.eoaAddress}` : `${chainId}:${agentIdentityOwnerAccountAddr}`;

    const agentIdentityOwnerAccountType = ownerInfo ? ownerInfo.accountType : 'eoa';
    const agentAccountType = agentInfo ? agentInfo.accountType : 'eoa';

    // Strict schema only (no backward compatibility).
    await dbInstance.prepare(
      `
      INSERT INTO agents(
        chainId, agentId,
        agentAccount, eoaAgentAccount,
        agentIdentityOwnerAccount, eoaAgentIdentityOwnerAccount,
        agentAccountType, agentIdentityOwnerAccountType,
        agentName, agentUri,
        createdAtBlock, createdAtTime,
        didIdentity, didAccount, didName,
        rawJson, updatedAtTime,
        a2aEndpoint
      )
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId) DO UPDATE SET
        agentAccount=CASE
          WHEN excluded.agentAccount IS NOT NULL AND substr(excluded.agentAccount, -40) != substr('0000000000000000000000000000000000000000', -40)
          THEN excluded.agentAccount
          ELSE agentAccount
        END,
        eoaAgentAccount=CASE
          WHEN excluded.eoaAgentAccount IS NOT NULL AND substr(excluded.eoaAgentAccount, -40) != substr('0000000000000000000000000000000000000000', -40)
          THEN excluded.eoaAgentAccount
          ELSE eoaAgentAccount
        END,
        agentIdentityOwnerAccount=CASE
          WHEN excluded.agentIdentityOwnerAccount IS NOT NULL AND substr(excluded.agentIdentityOwnerAccount, -40) != substr('0000000000000000000000000000000000000000', -40)
          THEN excluded.agentIdentityOwnerAccount
          ELSE agentIdentityOwnerAccount
        END,
        eoaAgentIdentityOwnerAccount=CASE
          WHEN excluded.eoaAgentIdentityOwnerAccount IS NOT NULL AND substr(excluded.eoaAgentIdentityOwnerAccount, -40) != substr('0000000000000000000000000000000000000000', -40)
          THEN excluded.eoaAgentIdentityOwnerAccount
          ELSE eoaAgentIdentityOwnerAccount
        END,
        agentAccountType=COALESCE(excluded.agentAccountType, agentAccountType),
        agentIdentityOwnerAccountType=COALESCE(excluded.agentIdentityOwnerAccountType, agentIdentityOwnerAccountType),
        agentName=COALESCE(NULLIF(TRIM(excluded.agentName), ''), agentName),
        agentUri=COALESCE(excluded.agentUri, agentUri),
        didIdentity=COALESCE(excluded.didIdentity, didIdentity),
        didAccount=CASE
          WHEN excluded.didAccount IS NOT NULL AND excluded.didAccount NOT LIKE '%:0x0000000000000000000000000000000000000000'
          THEN excluded.didAccount
          ELSE didAccount
        END,
        didName=COALESCE(excluded.didName, didName),
        rawJson=COALESCE(excluded.rawJson, rawJson),
        updatedAtTime=COALESCE(excluded.updatedAtTime, updatedAtTime),
        a2aEndpoint=COALESCE(excluded.a2aEndpoint, a2aEndpoint)
      `,
    ).run(
      chainId,
      agentId,
      agentAccount,
      eoaAgentAccount,
      agentIdentityOwnerAccount,
      eoaAgentIdentityOwnerAccount,
      agentAccountType,
      agentIdentityOwnerAccountType,
      agentName,
      resolvedTokenURI,
      Number(blockNumber),
      createdAtTime,
      didIdentity,
      didAccount,
      didName,
      metadataJsonRaw,
      Math.floor(Date.now() / 1000),
      a2aEndpoint,
    );

    // ATI compute is intentionally NOT part of the hot path (expensive). Use CLI only.
    if (process.env.ATI_COMPUTE_ON_WRITE === '1') {
      try {
        await computeAndUpsertATI(dbInstance, chainId, agentId);
      } catch (e) {
        console.warn('............ATI compute failed (upsertFromTransfer)', e);
      }
    }
    // NOTE: Transfer events don’t change validation/association/feedback signals used by the Trust Ledger badges.
    // Running trust-ledger evaluation here makes backfills look “infinite” (lots of expensive badge-rule queries).
    // Trust ledger processing is triggered by the relevant evidence events (validation/association/feedback) instead.

    // Use pre-fetched registration JSON (metadataJson) when available; avoid IPFS fetch by default.
    const metadata =
      preFetchedMetadata ||
      (allowIpfsMetadataFetch && resolvedTokenURI ? await fetchIpfsJson(resolvedTokenURI) : null);
    if (metadata) {
      try {
        const meta = metadata as any;
        const type = typeof meta.type === 'string' ? meta.type : null;
        const name = readAgentName(meta);
        const agentCategory = readAgentCategory(meta);

        // Use pre-extracted description and image, or extract from metadata if not already extracted
        const desc = description || (typeof meta.description === 'string' ? meta.description : null);
        const img = image || (meta.image == null ? null : String(meta.image));
        const endpoints = Array.isArray(meta.endpoints) ? meta.endpoints : [];
        const findEndpoint = (n: string) => {
          const e = endpoints.find((x: any) => (x?.name ?? '').toLowerCase() === n.toLowerCase());
          return e && typeof e.endpoint === 'string' ? e.endpoint : null;
        };
        const a2aEndpoint = findEndpoint('A2A');
        // Removed: agentAccountEndpoint (confusing/overloaded; derive CAIP10 when needed)
        const supportedTrust =
          Array.isArray(meta.supportedTrust) ? meta.supportedTrust.map(String) :
          Array.isArray((meta as any).supportedTrusts) ? (meta as any).supportedTrusts.map(String) :
          [];
        const activeFromMeta: number | null = (() => {
          const v = (meta as any)?.active;
          if (v === undefined || v === null) return null;
          if (v === true || v === 1) return 1;
          if (v === false || v === 0) return 0;
          const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
          if (!s) return null;
          if (s === '1' || s === 'true' || s === 'active' || s === 'enabled' || s === 'on' || s === 'yes' || s === 'y') return 1;
          if (s === '0' || s === 'false' || s === 'inactive' || s === 'disabled' || s === 'off' || s === 'no' || s === 'n') return 0;
          return null;
        })();

        // ---- Registration JSON ingest: OASF skills/domains + protocol versions ----
        // From example: endpoints[] contains an OASF entry with {skills[], domains[]}
        const oasfEndpoint = endpoints.find((e: any) => {
          const n = typeof e?.name === 'string' ? e.name.trim().toLowerCase() : '';
          return n === 'oasf' || Boolean(e?.skills) || Boolean(e?.domains);
        });
        const oasfSkills = Array.isArray(oasfEndpoint?.skills) ? oasfEndpoint.skills.map((s: any) => String(s)).filter(Boolean) : [];
        const oasfDomains = Array.isArray(oasfEndpoint?.domains) ? oasfEndpoint.domains.map((d: any) => String(d)).filter(Boolean) : [];

        // Protocols: store endpoint name + version (if present)
        const protocolRows: { protocol: string; version: string }[] = [];
        for (const ep of endpoints) {
          const pname = typeof ep?.name === 'string' ? ep.name.trim() : '';
          if (!pname) continue;
          const ver = typeof ep?.version === 'string' && ep.version.trim() ? ep.version.trim() : '';
          protocolRows.push({ protocol: pname, version: ver });
        }

        // Batch upserts to normalized tables (fast; uses db.batch if available)
        const stmts: any[] = [];
        try {
          // supportedTrust -> agent_supported_trust
          for (const t of supportedTrust) {
            const v = String(t).trim();
            if (!v) continue;
            const s = dbInstance
              .prepare('INSERT INTO agent_supported_trust(chainId, agentId, trust) VALUES(?, ?, ?) ON CONFLICT(chainId, agentId, trust) DO NOTHING')
              .bind(chainId, agentId, v);
            stmts.push(s);
          }
        } catch {}
        try {
          // OASF skills -> agent_skills
          for (const sk of oasfSkills) {
            const v = String(sk).trim();
            if (!v) continue;
            const s = dbInstance
              .prepare('INSERT INTO agent_skills(chainId, agentId, skill) VALUES(?, ?, ?) ON CONFLICT(chainId, agentId, skill) DO NOTHING')
              .bind(chainId, agentId, v);
            stmts.push(s);
          }
        } catch {}
        try {
          // OASF domains -> agent_domains (new)
          for (const dom of oasfDomains) {
            const v = String(dom).trim();
            if (!v) continue;
            const s = dbInstance
              .prepare('INSERT INTO agent_domains(chainId, agentId, domain) VALUES(?, ?, ?) ON CONFLICT(chainId, agentId, domain) DO NOTHING')
              .bind(chainId, agentId, v);
            stmts.push(s);
          }
        } catch {}
        try {
          // protocols -> agent_protocols (new)
          for (const p of protocolRows) {
            const pn = String(p.protocol).trim();
            if (!pn) continue;
            const pv = String(p.version ?? '').trim(); // store empty string if missing
            const s = dbInstance
              .prepare('INSERT INTO agent_protocols(chainId, agentId, protocol, version) VALUES(?, ?, ?, ?) ON CONFLICT(chainId, agentId, protocol, version) DO NOTHING')
              .bind(chainId, agentId, pn, pv);
            stmts.push(s);
          }
        } catch {}

        if (stmts.length && typeof dbInstance.batch === 'function') {
          try {
            await dbInstance.batch(stmts);
          } catch {
            // fallback: run sequentially
            for (const s of stmts) {
              try { await s.run(); } catch {}
            }
          }
        } else {
          // No batching support; best-effort sequential.
          for (const s of stmts) {
            try { await s.run(); } catch {}
          }
        }
        if (process.env.DEBUG_METADATA === '1') {
          console.info("............update into table: agentId: ", agentId);
          console.info("............update into table: agentAccount: ", agentAccount);
          console.info("............update into table: type: ", type);
          console.info("............update into table: name: ", name);
          console.info("............update into table: description: ", desc);
          console.info("............update into table: image: ", img);
          console.info("............update into table: a2aEndpoint: ", a2aEndpoint);
        }
        const updateTime = Math.floor(Date.now() / 1000);
        
        // Compute DID values
        const didIdentity = `did:8004:${chainId}:${agentId}`;
        const didAccountValue = agentAccountAddrFinal ? `did:ethr:${chainId}:${agentAccountAddrFinal}` : '';
        const didNameValue = name && name.endsWith('.eth') ? `did:ens:${chainId}:${name}` : null;
        
        // Prefer storing the raw subgraph JSON (metadataJsonRaw) for agents.rawJson.
        // Fall back to stringifying the parsed metadata object.
        let rawJsonToStore: string | null = metadataJsonRaw;
        if (!rawJsonToStore) {
          try {
            rawJsonToStore = JSON.stringify(meta);
          } catch {
            rawJsonToStore = null;
          }
        }

        await dbInstance.prepare(`
          UPDATE agents SET
            type = COALESCE(type, ?),
            agentName = CASE 
              WHEN ? IS NOT NULL AND ? != '' THEN ? 
              ELSE agentName 
            END,
            agentCategory = CASE
              WHEN ? IS NOT NULL AND ? != '' THEN ?
              ELSE agentCategory
            END,
            description = CASE 
              WHEN ? IS NOT NULL AND ? != '' THEN ? 
              ELSE description 
            END,
            image = CASE 
              WHEN ? IS NOT NULL AND ? != '' THEN ? 
              ELSE image 
            END,
            a2aEndpoint = CASE 
              WHEN ? IS NOT NULL AND ? != '' THEN ? 
              ELSE a2aEndpoint 
            END,
            supportedTrust = COALESCE(?, supportedTrust),
            active = COALESCE(?, active),
            didIdentity = COALESCE(?, didIdentity),
            didAccount = COALESCE(?, didAccount),
            didName = COALESCE(?, didName),
            rawJson = COALESCE(?, rawJson),
            updatedAtTime = ?
          WHERE chainId = ? AND agentId = ?
        `).run(
          type,
          name, name, name,
          agentCategory, agentCategory, agentCategory,
          desc, desc, desc,
          img, img, img,
          a2aEndpoint, a2aEndpoint, a2aEndpoint,
          JSON.stringify(supportedTrust),
          activeFromMeta,
          didIdentity,
          didAccountValue,
          didNameValue,
          rawJsonToStore,
          updateTime,
          chainId,
          agentId,
        );

        // ATI compute is intentionally NOT part of the hot path (expensive). Use CLI only.
        if (process.env.ATI_COMPUTE_ON_WRITE === '1') {
          try {
            await computeAndUpsertATI(dbInstance, chainId, agentId);
          } catch (e) {
            console.warn('............ATI compute failed (metadata update)', e);
          }
        }
        // Badge processing is now done via CLI: `pnpm badge:process`

        // Agent-card fetch is intentionally NOT part of the hot path (network-heavy). Use CLI only.
        if (process.env.AGENT_CARD_FETCH_ON_UPDATE === '1') {
          try {
            if (a2aEndpoint && shouldFetchAgentCard) {
              await upsertAgentCardForAgent(dbInstance, chainId, agentId, String(a2aEndpoint), { force: true });
            }
          } catch {}
        }

        await recordEvent({ transactionHash: `token:${agentId}`, logIndex: 0, blockNumber }, 'MetadataFetched', { tokenId: agentId }, dbInstance);
      } catch (error) {
        const msg = String((error as any)?.message || error || '');
        if (msg.includes('no such column: agentCategory')) {
          throw new Error(
            `DB schema out of date: missing agents.agentCategory. ` +
              `Apply migrations (recommended: apps/indexer/migrations/0031_agents_schema_caip10.sql) and retry.`,
          );
        }
        console.info("........... error updating a2aEndpoint", error)
      }
    }


  }
  else {
    console.info("remove from list")
    try {
      const agentId = toDecString(tokenId);
      await dbInstance.prepare("DELETE FROM agents WHERE chainId = ? AND agentId = ?").run(chainId, agentId);
      await recordEvent({ transactionHash: `token:${agentId}`, logIndex: 0, blockNumber }, 'Burned', { tokenId: agentId }, dbInstance);
    } catch {}
  }
}

type BatchWriter = {
  enqueue(statement: any): Promise<void>;
  flush(): Promise<void>;
};

function createBatchWriter(dbInstance: any, label: string, batchSize = 50): BatchWriter {
  const supportsBatch = typeof dbInstance.batch === 'function';
  const envBatchSizeRaw = process.env.D1_WRITE_BATCH_SIZE;
  const envBatchSize = envBatchSizeRaw && envBatchSizeRaw.trim() ? Number(envBatchSizeRaw) : NaN;
  const effectiveBatchSize = Number.isFinite(envBatchSize) && envBatchSize > 0 ? Math.trunc(envBatchSize) : batchSize;
  let queue: any[] = [];

  const runStatement = async (statement: any) => {
    if (!statement) return;

    const attempt = async () => {
      if (typeof statement.run === 'function') {
        await statement.run();
        return;
      }
      if (typeof statement === 'function') {
        await statement();
        return;
      }
    };

    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await attempt();
        return;
      } catch (error: any) {
        const message = String(error?.message || '');
        const isNetworkError =
          error?.code === 'ECONNRESET' ||
          /fetch failed/i.test(message) ||
          /D1 API error:\s*5\d{2}/i.test(message);
        if (!isNetworkError || i === maxRetries - 1) {
          throw error;
        }
        const delayMs = 200 * (i + 1);
        console.warn(`............[batch:${label}] transient error, retrying in ${delayMs}ms (${i + 1}/${maxRetries}):`, error?.message || error);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  };

  const flush = async () => {
    if (!queue.length) return;
    const statements = queue;
    queue = [];
    if (process.env.D1_BATCH_LOG === '1') {
      console.info(`............[batch:${label}] flushing ${statements.length} statements`);
    }
    if (supportsBatch) {
      await dbInstance.batch(statements);
    } else {
      for (const statement of statements) {
        await runStatement(statement);
      }
    }
  };

  return {
    enqueue: async (statement: any) => {
      if (!supportsBatch) {
        await runStatement(statement);
        return;
      }
      queue.push(statement);
      if (queue.length >= effectiveBatchSize) {
        await flush();
      }
    },
    flush,
  };
}

async function enqueueOrRun(batch: BatchWriter | undefined, stmt: any, params: any[]) {
  const execute = async () => {
    await stmt.run(...params);
  };

  if (!batch) {
    await execute();
    return;
  }

  if (typeof stmt.bind === 'function') {
    await batch.enqueue(stmt.bind(...params));
    return;
  }

  await batch.enqueue({ run: execute });
}

function normalizeHex(value: string | null | undefined): string | null {
  if (!value) return null;
  return String(value).toLowerCase();
}

function decodeHexToUtf8(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  let normalized = value.trim();
  if (!normalized) return null;
  if (normalized.startsWith('0x') || normalized.startsWith('0X')) {
    normalized = normalized.slice(2);
  }
  if (!normalized) return '';
  if (normalized.length % 2 === 1) {
    normalized = `0${normalized}`;
  }

  const byteLength = Math.floor(normalized.length / 2);
  const bytes = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    const byteHex = normalized.slice(i * 2, i * 2 + 2);
    const parsed = parseInt(byteHex, 16);
    if (Number.isNaN(parsed)) {
      return null;
    }
    bytes[i] = parsed;
  }

  try {
    let text: string | null = null;
    if (typeof TextDecoder !== 'undefined') {
      const decoder = new TextDecoder('utf-8', { fatal: false });
      text = decoder.decode(bytes);
    } else if (typeof Buffer !== 'undefined') {
      text = Buffer.from(bytes).toString('utf8');
    }
    if (text === null) return null;
    return text.replace(/\u0000+$/g, '');
  } catch {
    return null;
  }
}

async function resolveFeedbackIndex(
  dbInstance: any,
  chainId: number,
  agentId: string,
  clientAddress: string,
  graphIndex: string | number | null | undefined,
  feedbackId: string
): Promise<number> {
  if (graphIndex !== undefined && graphIndex !== null) {
    const parsed = Number(graphIndex);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const existing = await dbInstance.prepare('SELECT feedbackIndex FROM rep_feedbacks WHERE id = ?').get(feedbackId) as { feedbackIndex?: number } | undefined;
  if (existing?.feedbackIndex !== undefined && existing.feedbackIndex !== null) {
    return Number(existing.feedbackIndex);
  }

  const maxRow = await dbInstance.prepare('SELECT COALESCE(MAX(feedbackIndex), 0) as maxIndex FROM rep_feedbacks WHERE chainId = ? AND agentId = ? AND clientAddress = ?').get(chainId, agentId, clientAddress) as { maxIndex?: number } | undefined;
  const maxIndex = maxRow?.maxIndex ?? 0;
  return Number(maxIndex) + 1;
}

async function upsertFeedbackFromGraph(
  item: any,
  chainId: number,
  dbInstance: any,
  batch?: BatchWriter
): Promise<number | null> {
  if (!item?.id) {
    console.warn('⚠️  upsertFeedbackFromGraph: missing id', item);
    return null;
  }

  const id = String(item.id);
  const agentId = String(item?.agent?.id ?? '0');
  const clientAddressRaw = item.clientAddress ? String(item.clientAddress) : '';
  const clientAddress = clientAddressRaw.toLowerCase();

  if (!clientAddress) {
    console.warn('⚠️  upsertFeedbackFromGraph: missing clientAddress for', id);
    return null;
  }

  const feedbackIndex = await resolveFeedbackIndex(dbInstance, chainId, agentId, clientAddress, item.feedbackIndex, id);
  const score = item.score !== null && item.score !== undefined ? Number(item.score) : null;
  const ratingPct = item.ratingPct !== null && item.ratingPct !== undefined ? Number(item.ratingPct) : null;
  const blockNumber = item.blockNumber !== null && item.blockNumber !== undefined ? Number(item.blockNumber) : 0;
  const timestamp = item.timestamp !== null && item.timestamp !== undefined ? Number(item.timestamp) : 0;
  const feedbackUri =
    item.feedbackURI != null ? String(item.feedbackURI) :
    item.feedbackUri != null ? String(item.feedbackUri) :
    item.fileuri != null ? String(item.fileuri) :
    null;
  let feedbackJson: string | null = null;
  let parsedFeedbackJson: any | null = null;
  let agentRegistryFromJson: string | null = null;
  let feedbackCreatedAt: string | null = null;
  let feedbackAuth: string | null = null;
  let skillFromJson: string | null = null;
  let capabilityFromJson: string | null = null;
  let contextJson: string | null = null;
  if (item.feedbackJson != null) {
    if (typeof item.feedbackJson === 'string') {
      feedbackJson = item.feedbackJson;
      try {
        parsedFeedbackJson = JSON.parse(item.feedbackJson);
      } catch {
        parsedFeedbackJson = null;
      }
    } else {
      try {
        feedbackJson = JSON.stringify(item.feedbackJson);
        parsedFeedbackJson = item.feedbackJson;
      } catch {
        feedbackJson = String(item.feedbackJson);
        parsedFeedbackJson = null;
      }
    }
  }
  if (parsedFeedbackJson && typeof parsedFeedbackJson === 'object') {
    agentRegistryFromJson = parsedFeedbackJson.agentRegistry ? String(parsedFeedbackJson.agentRegistry) : null;
    feedbackCreatedAt = parsedFeedbackJson.createdAt ? String(parsedFeedbackJson.createdAt) : null;
    feedbackAuth = parsedFeedbackJson.feedbackAuth ? String(parsedFeedbackJson.feedbackAuth) : null;
    skillFromJson = parsedFeedbackJson.skill ? String(parsedFeedbackJson.skill) : null;
    capabilityFromJson = parsedFeedbackJson.capability ? String(parsedFeedbackJson.capability) : null;
    if (parsedFeedbackJson.context !== undefined) {
      if (typeof parsedFeedbackJson.context === 'string') {
        contextJson = parsedFeedbackJson.context;
      } else {
        try {
          contextJson = JSON.stringify(parsedFeedbackJson.context);
        } catch {
          contextJson = String(parsedFeedbackJson.context);
        }
      }
    }
  }
  const feedbackType = item.feedbackType != null ? String(item.feedbackType) : null;
  const domain = item.domain != null ? String(item.domain) : null;
  const comment = item.comment != null ? String(item.comment) : null;
  const feedbackTimestamp = item.feedbackTimestamp != null ? String(item.feedbackTimestamp) : null;
  const endpoint =
    item.endpoint != null ? String(item.endpoint).trim() :
    (parsedFeedbackJson?.endpoint != null ? String(parsedFeedbackJson.endpoint).trim() : null);
  const normalizeTagValue = (raw: any): string | null => {
    if (raw === null || raw === undefined) return null;
    const s = String(raw).trim();
    if (!s) return null;
    // old subgraphs used bytes32 tags (0x...)
    if (s.startsWith('0x') && s.length === 66) return normalizeHex(s);
    return s;
  };
  const tag1 = normalizeTagValue(item.tag1);
  const tag2 = normalizeTagValue(item.tag2);
  const feedbackHash = normalizeHex(item.feedbackHash ?? item.filehash);
  const txHash = normalizeHex(item.txHash);
  const now = Math.floor(Date.now() / 1000);

  // Strict schema only (no backward compatibility).
  type Cand = { col: string; value: any; update?: 'excluded' | 'coalesce'; optional?: boolean };
  const candidates: Cand[] = [
    // Required base columns from 0008_add_feedback_tables.sql
    { col: 'id', value: id, optional: false, update: 'excluded' },
    { col: 'chainId', value: chainId, optional: false, update: 'excluded' },
    { col: 'agentId', value: agentId, optional: false, update: 'excluded' },
    { col: 'clientAddress', value: clientAddress, optional: false, update: 'excluded' },
    { col: 'feedbackIndex', value: feedbackIndex, optional: false, update: 'excluded' },
    { col: 'createdAt', value: now, optional: false, update: 'excluded' },
    { col: 'updatedAt', value: now, optional: false, update: 'excluded' },

    // Core fields (present in early schema)
    { col: 'score', value: score, optional: true, update: 'excluded' },
    { col: 'tag1', value: tag1, optional: true, update: 'excluded' },
    { col: 'tag2', value: tag2, optional: true, update: 'excluded' },
    { col: 'feedbackUri', value: feedbackUri, optional: true, update: 'excluded' },
    { col: 'feedbackJson', value: feedbackJson, optional: true, update: 'excluded' },
    { col: 'feedbackType', value: feedbackType, optional: true, update: 'excluded' },
    { col: 'domain', value: domain, optional: true, update: 'excluded' },
    { col: 'comment', value: comment, optional: true, update: 'excluded' },
    { col: 'ratingPct', value: ratingPct, optional: true, update: 'excluded' },
    { col: 'feedbackTimestamp', value: feedbackTimestamp, optional: true, update: 'excluded' },
    { col: 'feedbackHash', value: feedbackHash, optional: true, update: 'excluded' },
    { col: 'txHash', value: txHash, optional: true, update: 'excluded' },
    { col: 'blockNumber', value: blockNumber, optional: true, update: 'excluded' },
    { col: 'timestamp', value: timestamp, optional: true, update: 'excluded' },

    { col: 'endpoint', value: endpoint, update: 'excluded' },
    { col: 'agentRegistry', value: agentRegistryFromJson, update: 'coalesce' },
    { col: 'feedbackCreatedAt', value: feedbackCreatedAt, update: 'coalesce' },
    { col: 'feedbackAuth', value: feedbackAuth, update: 'coalesce' },
    { col: 'skill', value: skillFromJson, update: 'coalesce' },
    { col: 'capability', value: capabilityFromJson, update: 'coalesce' },
    { col: 'contextJson', value: contextJson, update: 'coalesce' },
  ];

  const cols = candidates.map((c) => c.col);
  const args = candidates.map((c) => c.value);
  const placeholders = cols.map(() => '?').join(', ');
  const updateSets: string[] = [];
  for (const c of candidates) {
    // Don't update unique key columns
    if (c.col === 'chainId' || c.col === 'agentId' || c.col === 'clientAddress' || c.col === 'feedbackIndex') {
      continue;
    }
    if (c.col === 'createdAt') continue;
    if (c.col === 'updatedAt') {
      updateSets.push(`updatedAt=excluded.updatedAt`);
      continue;
    }
    if (c.update === 'coalesce') {
      updateSets.push(`${c.col}=COALESCE(excluded.${c.col}, ${c.col})`);
    } else {
      updateSets.push(`${c.col}=excluded.${c.col}`);
    }
  }

  const sql = `
    INSERT INTO rep_feedbacks (${cols.join(', ')})
    VALUES (${placeholders})
    ON CONFLICT(chainId, agentId, clientAddress, feedbackIndex) DO UPDATE SET
      ${updateSets.join(',\n      ')}
  `;
  const stmt = dbInstance.prepare(sql);
  await enqueueOrRun(batch, stmt, args);

  // Badge processing is now done via CLI: `pnpm badge:process`

  return feedbackIndex;
}

async function recordFeedbackRevocationFromGraph(
  item: any,
  chainId: number,
  dbInstance: any,
  batch?: BatchWriter
): Promise<void> {
  if (!item?.id) {
    console.warn('⚠️  recordFeedbackRevocationFromGraph: missing id', item);
    return;
  }
  const id = String(item.id);
  const agentId = String(item?.agent?.id ?? '0');
  const clientAddress = item.clientAddress ? String(item.clientAddress).toLowerCase() : '';
  const feedbackIndex = item.feedbackIndex !== null && item.feedbackIndex !== undefined ? Number(item.feedbackIndex) : 0;
  if (!clientAddress || !feedbackIndex) {
    console.warn('⚠️  recordFeedbackRevocationFromGraph: missing clientAddress or feedbackIndex for', id);
    return;
  }

  const blockNumber = item.blockNumber !== null && item.blockNumber !== undefined ? Number(item.blockNumber) : 0;
  const timestamp = item.timestamp !== null && item.timestamp !== undefined ? Number(item.timestamp) : 0;
  const txHash = normalizeHex(item.txHash);
  const now = Math.floor(Date.now() / 1000);

  const stmt = dbInstance.prepare(`
    INSERT INTO rep_feedback_revoked (id, chainId, agentId, clientAddress, feedbackIndex, txHash, blockNumber, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      txHash=excluded.txHash,
      blockNumber=excluded.blockNumber,
      timestamp=excluded.timestamp
  `);

  await enqueueOrRun(batch, stmt, [
    id,
    chainId,
    agentId,
    clientAddress,
    feedbackIndex,
    txHash,
    blockNumber,
    timestamp,
  ]);

  await dbInstance.prepare(`
    UPDATE rep_feedbacks
    SET isRevoked = 1,
        revokedTxHash = ?,
        revokedBlockNumber = ?,
        revokedTimestamp = ?,
        updatedAt = ?
    WHERE chainId = ? AND agentId = ? AND clientAddress = ? AND feedbackIndex = ?
  `).run(
    txHash,
    blockNumber,
    timestamp,
    now,
    chainId,
    agentId,
    clientAddress,
    feedbackIndex
  );
}

async function recordFeedbackResponseFromGraph(
  item: any,
  chainId: number,
  dbInstance: any,
  batch?: BatchWriter
): Promise<void> {
  if (!item?.id) {
    console.warn('⚠️  recordFeedbackResponseFromGraph: missing id', item);
    return;
  }

  const id = String(item.id);
  const agentId = String(item?.agent?.id ?? '0');
  const clientAddress = item.clientAddress ? String(item.clientAddress).toLowerCase() : '';
  const feedbackIndex = item.feedbackIndex !== null && item.feedbackIndex !== undefined ? Number(item.feedbackIndex) : 0;
  if (!clientAddress || !feedbackIndex) {
    console.warn('⚠️  recordFeedbackResponseFromGraph: missing clientAddress or feedbackIndex for', id);
    return;
  }

  const responder = item.responder ? String(item.responder).toLowerCase() : '0x0000000000000000000000000000000000000000';
  const responseUri =
    item.responseURI != null ? String(item.responseURI) :
    item.responseUri != null ? String(item.responseUri) :
    null;
  let responseJson: string | null = null;
  if (item.responseJson != null) {
    if (typeof item.responseJson === 'string') {
      responseJson = item.responseJson;
    } else {
      try {
        responseJson = JSON.stringify(item.responseJson);
      } catch {
        responseJson = String(item.responseJson);
      }
    }
  }
  const responseHash = normalizeHex(item.responseHash);
  const blockNumber = item.blockNumber !== null && item.blockNumber !== undefined ? Number(item.blockNumber) : 0;
  const timestamp = item.timestamp !== null && item.timestamp !== undefined ? Number(item.timestamp) : 0;
  const txHash = normalizeHex(item.txHash);
  const now = Math.floor(Date.now() / 1000);

  const stmt = dbInstance.prepare(`
    INSERT INTO rep_feedback_responses (
      id, chainId, agentId, clientAddress, feedbackIndex, responder,
      responseUri, responseJson, responseHash, txHash, blockNumber, timestamp
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      responder=excluded.responder,
      responseUri=excluded.responseUri,
      responseJson=excluded.responseJson,
      responseHash=excluded.responseHash,
      txHash=excluded.txHash,
      blockNumber=excluded.blockNumber,
      timestamp=excluded.timestamp
  `);

  await enqueueOrRun(batch, stmt, [
    id,
    chainId,
    agentId,
    clientAddress,
    feedbackIndex,
    responder,
    responseUri,
    responseJson,
    responseHash,
    txHash,
    blockNumber,
    timestamp,
  ]);

  await dbInstance.prepare(`
    UPDATE rep_feedbacks
    SET responseCount = (
      SELECT COUNT(*)
      FROM rep_feedback_responses
      WHERE chainId = ? AND agentId = ? AND clientAddress = ? AND feedbackIndex = ?
    ),
    updatedAt = ?
    WHERE chainId = ? AND agentId = ? AND clientAddress = ? AND feedbackIndex = ?
  `).run(
    chainId,
    agentId,
    clientAddress,
    feedbackIndex,
    now,
    chainId,
    agentId,
    clientAddress,
    feedbackIndex
  );
}

async function upsertValidationRequestFromGraph(
  item: any,
  chainId: number,
  dbInstance: any,
  batch?: BatchWriter
): Promise<void> {
  if (!item?.id) {
    console.warn('⚠️  upsertValidationRequestFromGraph: missing id', item);
    return;
  }
  const id = String(item.id);
  const agentId = String(item?.agent?.id ?? '0');
  const validatorAddressRaw = item.validatorAddress ? String(item.validatorAddress) : '';
  const validatorAddress = validatorAddressRaw.toLowerCase();
  if (!validatorAddress) {
    console.warn('⚠️  upsertValidationRequestFromGraph: missing validatorAddress for', id);
    return;
  }

  const requestUri = item.requestUri != null ? String(item.requestUri) : null;
  let requestJson: string | null = null;
  if (item.requestJson != null) {
    if (typeof item.requestJson === 'string') {
      requestJson = item.requestJson;
    } else {
      try {
        requestJson = JSON.stringify(item.requestJson);
      } catch {
        requestJson = String(item.requestJson);
      }
    }
  }
  const requestHash = normalizeHex(item.requestHash);
  const txHash = normalizeHex(item.txHash);
  const blockNumber = item.blockNumber !== null && item.blockNumber !== undefined ? Number(item.blockNumber) : 0;
  const timestamp = item.timestamp !== null && item.timestamp !== undefined ? Number(item.timestamp) : 0;
  const now = Math.floor(Date.now() / 1000);

  const stmt = dbInstance.prepare(`
    INSERT INTO validation_requests (
      id, chainId, agentId, validatorAddress, requestUri, requestJson,
      requestHash, txHash, blockNumber, timestamp, createdAt, updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      validatorAddress=excluded.validatorAddress,
      requestUri=excluded.requestUri,
      requestJson=excluded.requestJson,
      requestHash=COALESCE(excluded.requestHash, requestHash),
      txHash=excluded.txHash,
      blockNumber=excluded.blockNumber,
      timestamp=excluded.timestamp,
      updatedAt=excluded.updatedAt
  `);

  await enqueueOrRun(batch, stmt, [
    id,
    chainId,
    agentId,
    validatorAddress,
    requestUri,
    requestJson,
    requestHash,
    txHash,
    blockNumber,
    timestamp,
    now,
    now,
  ]);
}

async function upsertValidationResponseFromGraph(
  item: any,
  chainId: number,
  dbInstance: any,
  batch?: BatchWriter
): Promise<void> {
  if (!item?.id) {
    console.warn('⚠️  upsertValidationResponseFromGraph: missing id', item);
    return;
  }

  const id = String(item.id);
  const agentId = String(item?.agent?.id ?? '0');
  const validatorAddressRaw = item.validatorAddress ? String(item.validatorAddress) : '';
  const validatorAddress = validatorAddressRaw.toLowerCase();
  if (!validatorAddress) {
    console.warn('⚠️  upsertValidationResponseFromGraph: missing validatorAddress for', id);
    return;
  }

  const requestHash = normalizeHex(item.requestHash);
  const responseValue = item.response !== null && item.response !== undefined ? Number(item.response) : null;
  const responseUri =
    item.responseURI != null ? String(item.responseURI) :
    item.responseUri != null ? String(item.responseUri) :
    null;
  let responseJson: string | null = null;
  if (item.responseJson != null) {
    if (typeof item.responseJson === 'string') {
      responseJson = item.responseJson;
    } else {
      try {
        responseJson = JSON.stringify(item.responseJson);
      } catch {
        responseJson = String(item.responseJson);
      }
    }
  }
  const responseHash = normalizeHex(item.responseHash);
  const tag = item.tag != null ? String(item.tag) : null;
  const txHash = normalizeHex(item.txHash);
  const blockNumber = item.blockNumber !== null && item.blockNumber !== undefined ? Number(item.blockNumber) : 0;
  const timestamp = item.timestamp !== null && item.timestamp !== undefined ? Number(item.timestamp) : 0;
  const now = Math.floor(Date.now() / 1000);

  const stmt = dbInstance.prepare(`
    INSERT INTO validation_responses (
      id, chainId, agentId, validatorAddress, requestHash, response,
      responseUri, responseJson, responseHash, tag, txHash, blockNumber,
      timestamp, createdAt, updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      validatorAddress=excluded.validatorAddress,
      requestHash=COALESCE(excluded.requestHash, requestHash),
      response=excluded.response,
      responseUri=excluded.responseUri,
      responseJson=excluded.responseJson,
      responseHash=excluded.responseHash,
      tag=excluded.tag,
      txHash=excluded.txHash,
      blockNumber=excluded.blockNumber,
      timestamp=excluded.timestamp,
      updatedAt=excluded.updatedAt
  `);

  await enqueueOrRun(batch, stmt, [
    id,
    chainId,
    agentId,
    validatorAddress,
    requestHash,
    responseValue,
    responseUri,
    responseJson,
    responseHash,
    tag,
    txHash,
    blockNumber,
    timestamp,
    now,
    now,
  ]);
}

async function upsertTokenMetadataFromGraph(
  item: any,
  chainId: number,
  dbInstance: any,
  batch?: BatchWriter
): Promise<void> {
  if (!item) return;
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  const metadataIdRaw = typeof item.id === 'string' ? item.id : null;
  const keyRaw = typeof item.key === 'string' ? item.key : null;
  const agentIdRaw =
    item?.agent?.id != null ? String(item.agent.id) :
    item?.agentId != null ? String(item.agentId) :
    (() => {
      // New subgraph shape: `id` looks like `${agentId}-${key}`
      if (typeof metadataIdRaw !== 'string') return null;
      const idx = metadataIdRaw.indexOf('-');
      if (idx <= 0) return null;
      return metadataIdRaw.slice(0, idx);
    })();
  if (!metadataIdRaw || !agentIdRaw || !keyRaw) {
    console.warn('⚠️  upsertTokenMetadataFromGraph: missing id or key', item);
    return;
  }

  const key = keyRaw.trim();
  if (!key) {
    console.warn('⚠️  upsertTokenMetadataFromGraph: empty metadata key', item);
    return;
  }

  const valueHex = item.value != null ? String(item.value) : null;
  const valueText = valueHex ? decodeHexToUtf8(valueHex) : null;
  const indexedKey = typeof item.indexedKey === 'string' ? item.indexedKey : null;
  const now = Math.floor(Date.now() / 1000);

  const setAt = item?.setAt != null ? Number(item.setAt) : null;
  const setBy = item?.setBy != null ? String(item.setBy).toLowerCase() : null;
  const txHash = item?.txHash != null ? String(item.txHash).toLowerCase() : null;
  const blockNumber = item?.blockNumber != null ? Number(item.blockNumber) : null;
  const timestamp = item?.timestamp != null ? Number(item.timestamp) : null;

  const stmt = dbInstance.prepare(`
    INSERT INTO agent_metadata (
      chainId, id, agentId, key, valueHex, valueText, indexedKey,
      setAt, setBy, txHash, blockNumber, timestamp,
      updatedAtTime
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(chainId, id) DO UPDATE SET
      agentId=excluded.agentId,
      key=excluded.key,
      valueHex=excluded.valueHex,
      valueText=excluded.valueText,
      indexedKey=excluded.indexedKey,
      setAt=COALESCE(excluded.setAt, setAt),
      setBy=COALESCE(excluded.setBy, setBy),
      txHash=COALESCE(excluded.txHash, txHash),
      blockNumber=COALESCE(excluded.blockNumber, blockNumber),
      timestamp=COALESCE(excluded.timestamp, timestamp),
      updatedAtTime=excluded.updatedAtTime
  `);

  await enqueueOrRun(batch, stmt, [
    chainId,
    metadataIdRaw,
    agentIdRaw,
    key,
    valueHex,
    valueText,
    indexedKey,
    setAt,
    setBy,
    txHash,
    blockNumber,
    timestamp,
    now,
  ]);

  // agentName -> update agents row (overwrite with latest)
  if (key === 'agentName') {
    const name = valueText ? valueText.trim() : '';
    if (name) {
      const didNameValue = name.endsWith('.eth') ? `did:ens:${chainId}:${name}` : null;
      const updateStmt = dbInstance.prepare(`
        UPDATE agents
        SET agentName = ?,
            didName = CASE WHEN ? IS NOT NULL THEN ? ELSE didName END,
            updatedAtTime = ?
        WHERE chainId = ? AND agentId = ?
      `);
      await enqueueOrRun(batch, updateStmt, [name, didNameValue, didNameValue, now, chainId, agentIdRaw]);
    }
  }

  // If metadata sets the operational account, reflect it into agents.agentAccount (CAIP10-ish: `${chainId}:${address}`)
  // Supports:
  // - value = 0x + 40 hex (raw address)
  // - value = hex-encoded UTF-8 "0x...." (string address)
  if (key === 'agentWallet' || key === 'agentAccount') {
    const candidate =
      (valueHex && /^0x[a-fA-F0-9]{40}$/.test(valueHex.trim()) ? valueHex.trim() : null) ??
      (valueText && /^0x[a-fA-F0-9]{40}$/.test(valueText.trim()) ? valueText.trim() : null) ??
      (valueText ? parseCaip10Address(valueText.trim()) : null);

    if (candidate) {
      const addr = candidate.toLowerCase();
      if (addr === ZERO_ADDRESS) return;
      const agentAccountValue = `${chainId}:${addr}`;
      const didAccountValue = `did:ethr:${chainId}:${addr}`;
      const info = await resolveEoaInfo(chainId, addr);
      const agentAccountType = info ? info.accountType : 'eoa';
      const eoaAgentAccountValue = info ? `${chainId}:${info.eoaAddress}` : `${chainId}:${addr}`;
      const updateStmt = dbInstance.prepare(`
        UPDATE agents
        SET agentAccount = ?,
            didAccount = ?,
            eoaAgentAccount = ?,
            agentAccountType = COALESCE(?, agentAccountType),
            updatedAtTime = ?
        WHERE chainId = ? AND agentId = ?
      `);
      await enqueueOrRun(batch, updateStmt, [
        agentAccountValue,
        didAccountValue,
        eoaAgentAccountValue,
        agentAccountType,
        now,
        chainId,
        agentIdRaw,
      ]);
    }
  }

  // status/active -> agents.active
  if (key === 'status' || key === 'active') {
    const activeValue = parseActiveMetadataValue(valueText);
    if (activeValue !== null) {
      const updateStmt = dbInstance.prepare(`
        UPDATE agents
        SET active = ?,
            updatedAtTime = ?
        WHERE chainId = ? AND agentId = ?
      `);
      await enqueueOrRun(batch, updateStmt, [activeValue, now, chainId, agentIdRaw]);
    }
  }
}

// Parse CAIP-10 like eip155:chainId:0x... to 0x address
function parseCaip10Address(value: string | null | undefined): string | null {
  try {
    if (!value) return null;
    const v = String(value).trim();
    if (/^0x[a-fA-F0-9]{40}$/.test(v)) return v;
    if (v.startsWith('eip155:')) {
      const parts = v.split(':');
      const addr = parts[2];
      if (addr && /^0x[a-fA-F0-9]{40}$/.test(addr)) return addr;
    }
  } catch {}
  return null;
}

async function resolveEoaOwnerSafe(chainId: number, ownerAddress: string | null | undefined): Promise<string | null> {
  try {
    return await resolveEoaOwner(chainId, ownerAddress ?? null);
  } catch (error) {
    console.warn('[ownership] Failed to resolve EOA owner', { chainId, ownerAddress, error });
    return ownerAddress ?? null;
  }
}

function readAgentName(source: any): string | null {
  const normalize = (value: any): string | null => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  try {
    if (!source) return null;
    if (typeof source === 'string') {
      return normalize(source);
    }
    if (typeof source === 'object') {
      const direct = normalize((source as any)?.agentName);
      if (direct) return direct;
      return normalize((source as any)?.name);
    }
  } catch {}
  return null;
}

function normalizeMetadataString(value: any): string | null {
  try {
    if (value == null) return null;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
    const coerced = String(value).trim();
    return coerced.length > 0 ? coerced : null;
  } catch {
    return null;
  }
}

function parseActiveMetadataValue(valueText: string | null | undefined): number | null {
  if (!valueText) return null;
  const v = String(valueText).trim().toLowerCase();
  if (!v) return null;
  // Positive-ish
  if (v === '1' || v === 'true' || v === 'active' || v === 'enabled' || v === 'on' || v === 'yes' || v === 'y') return 1;
  // Negative-ish
  if (v === '0' || v === 'false' || v === 'inactive' || v === 'disabled' || v === 'off' || v === 'no' || v === 'n') return 0;
  return null;
}

/**
 * Extract "Category" from common NFT metadata formats:
 * - top-level `category`/`Category`
 * - `attributes[]` entries with trait_type/key/name == "Category" (case-insensitive)
 */
function readAgentCategory(metadata: any): string | null {
  try {
    if (!metadata || typeof metadata !== 'object') return null;

    const direct =
      normalizeMetadataString((metadata as any).agentCategory) ??
      normalizeMetadataString((metadata as any).category) ??
      normalizeMetadataString((metadata as any).Category);
    if (direct) return direct;

    const attrs = Array.isArray((metadata as any).attributes) ? (metadata as any).attributes : [];
    for (const attr of attrs) {
      const key =
        normalizeMetadataString(attr?.trait_type) ??
        normalizeMetadataString(attr?.traitType) ??
        normalizeMetadataString(attr?.key) ??
        normalizeMetadataString(attr?.name);
      if (key && key.toLowerCase() === 'category') {
        const v = normalizeMetadataString(attr?.value);
        if (v) return v;
      }
    }
  } catch {}
  return null;
}

export async function upsertFromTokenGraph(item: any, chainId: number) {
  const tokenId = BigInt(item?.id || 0);
  if (tokenId <= 0n) return;
  // Canonical: route token snapshot ingest through the transfer upsert path so all DB writes
  // stay consistent (CAIP10-ish account strings + did* derivations).
  const ownerAddress =
    parseCaip10Address(item?.owner?.id) ||
    parseCaip10Address(item?.owner) ||
    '0x0000000000000000000000000000000000000000';
  const mintedAt = BigInt(item?.mintedAt || 0);
  const tokenUri =
    (typeof item?.agentURI === 'string' ? item.agentURI : null) ??
    (typeof item?.agentUri === 'string' ? item.agentUri : null) ??
    (typeof item?.uri === 'string' ? item.uri : null);
  await upsertFromTransfer(ownerAddress.toLowerCase(), tokenId, item, mintedAt, tokenUri, chainId);
  return;
}

/* LEGACY_REMOVED (no backward compatibility needed)
  const agentId = toDecString(tokenId);
  const ownerAddress =
    parseCaip10Address(item?.owner?.id) ||
    parseCaip10Address(item?.owner) ||
    '0x0000000000000000000000000000000000000000';
  const agentAccount = (() => {
    const v = item?.agentWallet;
    if (typeof v !== 'string') return null;
    const s = v.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(s)) return null;
    return s.toLowerCase();
  })() || ownerAddress;
  const agentAddress = ownerAddress; // keep for backward compatibility
  let agentName = readAgentName(item) || '';
  const tokenUri =
    (typeof item?.agentURI === 'string' ? item.agentURI : null) ??
    (typeof item?.agentUri === 'string' ? item.agentUri : null) ??
    (typeof item?.agentURI === 'string' ? item.agentURI : null) ??
    (typeof item?.uri === 'string' ? item.uri : null);
  const mintedAtBigInt = (() => {
    try {
      const raw = item?.mintedAt ?? item?.blockNumber ?? 0;
      if (typeof raw === 'bigint') return raw;
      if (typeof raw === 'number') return BigInt(Math.max(0, raw));
      if (typeof raw === 'string' && raw.trim() !== '') return BigInt(raw.trim());
    } catch {}
    return 0n;
  })();
  const mintedAtNumber = (() => {
    const maxSafe = BigInt(Number.MAX_SAFE_INTEGER);
    const clamped = mintedAtBigInt > maxSafe ? maxSafe : mintedAtBigInt;
    return Number(clamped);
  })();
  const createdAtBlock = mintedAtNumber || 0;
  const createdAtTime = (() => {
    const candidates = [item?.timestamp, item?.mintedAtTime, mintedAtNumber, Math.floor(Date.now() / 1000)];
    for (const candidate of candidates) {
      const parsed = Number(candidate);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    return Math.floor(Date.now() / 1000);
  })();

  let uriMetadata: any | null = null;
  let inferred: any | null = null;

  if (process.env.DEBUG_TOKENS === '1') {
    console.info("@@@@@@@@@@@@@@@@@@@ upsertFromTokenGraph 0: item: ", item);
  }

  // Parse registration JSON from the subgraph (metadataJson). This is the primary source of rich agent metadata.
  let metadataObj: any | null = null;
  let metadataRaw: string | null = null;
  try {
    if (typeof item?.metadataJson === 'string' && item.metadataJson.trim()) {
      const mj = item.metadataJson.trim();
      metadataRaw = mj;
      try {
        metadataObj = JSON.parse(mj);
      } catch {}
    } else if (item?.metadataJson && typeof item.metadataJson === 'object') {
      metadataObj = item.metadataJson;
      try {
        metadataRaw = JSON.stringify(item.metadataJson);
      } catch {
        metadataRaw = null;
      }
    }
  } catch {}

  // If name is missing but we have a tokenURI, try to fetch and infer fields
  //
  
  if ((!agentName || agentName.trim() === '') && tokenUri) {
    try {
      console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: tokenUri: ", tokenUri)
      inferred = await fetchIpfsJson(tokenUri);
      if (inferred && typeof inferred === 'object') {
        console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: inferred: ", inferred)
        const inferredName = readAgentName(inferred);
        if (inferredName) {
          agentName = inferredName;
          console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: agentName: ", agentName)
        }
      }
    } catch {}
  }
  
  // Also fetch URI metadata if metadataJson is empty to get complete data
  
  if (tokenUri && (!item?.metadataJson || (typeof item.metadataJson === 'string' && item.metadataJson.trim() === ''))) {
    try {
      console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: metadataJson is empty, fetching from tokenUri:", tokenUri);
      uriMetadata = await fetchIpfsJson(tokenUri);
      if (uriMetadata && typeof uriMetadata === 'object') {
        console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: fetched URI metadata:", uriMetadata);
        
        // Update agentName from URI metadata if it's missing
        if ((!agentName || agentName.trim() === '')) {
          const uriAgentName = readAgentName(uriMetadata);
          if (uriAgentName) {
            agentName = uriAgentName;
          console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: updated agentName from URI:", agentName);
          }
        }
      }
    } catch (uriError) {
      console.warn("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: Failed to fetch URI metadata:", uriError);
    }
  }
  //

  if (process.env.DEBUG_TOKENS === '1') {
    console.info("@@@@@@@@@@@@@@@@@@@ upsertFromTokenGraph 1: agentName: ", agentId, agentName);
  }
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Compute DID values
  const didIdentity = `did:8004:${chainId}:${agentId}`;
  const didAccount = agentAccount ? `did:ethr:${chainId}:${agentAccount}` : '';
  const didName = agentName && agentName.endsWith('.eth') ? `did:ens:${chainId}:${agentName}` : null;
  // Resolving EOA owners can be RPC-heavy; keep it opt-in (matches upsertFromTransfer behavior).
  const resolveEoa = process.env.RESOLVE_EOA_OWNER_ON_WRITE === '1';
  const resolvedEoaOwnerAccount = resolveEoa ? await resolveEoaOwnerSafe(chainId, ownerAddress) : null;
  const eoaAgentIdentityOwnerAccount = resolvedEoaOwnerAccount;
  const resolvedEoaAgentAccount = resolveEoa && agentAccount ? await resolveEoaOwnerSafe(chainId, agentAccount) : null;
  const eoaAgentAccount = resolvedEoaAgentAccount;
  const agentIdentityOwnerAccountType =
    resolvedEoaOwnerAccount && ownerAddress
      ? ((resolvedEoaOwnerAccount ?? '').toLowerCase() === ownerAddress.toLowerCase() ? 'eoa' : 'aa')
      : null;
  const agentAccountType =
    resolvedEoaAgentAccount && agentAccount
      ? ((resolvedEoaAgentAccount ?? '').toLowerCase() === agentAccount.toLowerCase() ? 'eoa' : 'aa')
      : null;
  await db.prepare(`
    INSERT INTO agents(chainId, agentId, agentAddress, agentAccount, agentIdentityOwnerAccount, eoaAgentIdentityOwnerAccount, eoaAgentAccount, agentIdentityOwnerAccountType, agentAccountType, agentName, agentUri, createdAtBlock, createdAtTime, didIdentity, didAccount, didName)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(chainId, agentId) DO UPDATE SET
      agentAddress=CASE WHEN excluded.agentAddress IS NOT NULL AND excluded.agentAddress != '0x0000000000000000000000000000000000000000' THEN excluded.agentAddress ELSE agentAddress END,
      agentAccount=CASE WHEN excluded.agentAccount IS NOT NULL AND excluded.agentAccount != '0x0000000000000000000000000000000000000000' THEN excluded.agentAccount ELSE COALESCE(agentAccount, agentAddress) END,
      agentIdentityOwnerAccount=excluded.agentIdentityOwnerAccount,
      eoaAgentIdentityOwnerAccount=CASE WHEN excluded.eoaAgentIdentityOwnerAccount IS NOT NULL AND excluded.eoaAgentIdentityOwnerAccount != '' THEN excluded.eoaAgentIdentityOwnerAccount ELSE eoaAgentIdentityOwnerAccount END,
      eoaAgentAccount=COALESCE(excluded.eoaAgentAccount, eoaAgentAccount),
      agentIdentityOwnerAccountType=COALESCE(excluded.agentIdentityOwnerAccountType, agentIdentityOwnerAccountType),
      agentAccountType=COALESCE(excluded.agentAccountType, agentAccountType),
      agentName=CASE WHEN excluded.agentName IS NOT NULL AND length(excluded.agentName) > 0 THEN excluded.agentName ELSE agentName END,
      agentUri=COALESCE(excluded.agentUri, agentUri),
      didIdentity=COALESCE(excluded.didIdentity, didIdentity),
      didAccount=COALESCE(excluded.didAccount, didAccount),
      didName=COALESCE(excluded.didName, didName)
  `).run(
    chainId,
    agentId,
    agentAddress, // keep for backward compatibility
    agentAccount,
    ownerAddress,
    eoaAgentIdentityOwnerAccount,
    eoaAgentAccount,
    agentIdentityOwnerAccountType,
    agentAccountType,
    agentName,
    tokenUri,
    createdAtBlock,
    createdAtTime,
    didIdentity,
    didAccount,
    didName
  );

  const type = null;
  let name: string | null = readAgentName(item);
  let description: string | null = typeof item?.description === 'string' ? item.description : null;
  let image: string | null = item?.image == null ? null : String(item.image);
  let a2aEndpoint: string | null = typeof item?.a2aEndpoint === 'string' ? item.a2aEndpoint : null;
  let ensEndpoint: string | null = typeof item?.ensName === 'string' ? item.ensName : null;

  // Fill from registration JSON when GraphQL top-level fields are missing.
  try {
    if (metadataObj && typeof metadataObj === 'object') {
      if (!name?.trim()) {
        const inferredName = readAgentName(metadataObj);
        if (inferredName) name = inferredName;
      }
      if (!description?.trim() && typeof metadataObj.description === 'string' && metadataObj.description.trim()) {
        description = metadataObj.description.trim();
      }
      if (!image && metadataObj.image != null) {
        image = String(metadataObj.image);
      }
      if (!a2aEndpoint) {
        const endpoints = Array.isArray(metadataObj.endpoints) ? metadataObj.endpoints : [];
        const findEndpoint = (n: string) => {
          const e = endpoints.find((x: any) => (x?.name ?? '').toLowerCase() === n.toLowerCase());
          return e && typeof e.endpoint === 'string' ? e.endpoint : null;
        };
        a2aEndpoint = findEndpoint('A2A') || findEndpoint('a2a');
      }
      if (!ensEndpoint) {
        const endpoints = Array.isArray(metadataObj.endpoints) ? metadataObj.endpoints : [];
        const findEndpoint = (n: string) => {
          const e = endpoints.find((x: any) => (x?.name ?? '').toLowerCase() === n.toLowerCase());
          return e && typeof e.endpoint === 'string' ? e.endpoint : null;
        };
        ensEndpoint = findEndpoint('ENS') || findEndpoint('ens');
      }
    }
  } catch {}

  // Fill from inferred registration JSON when missing
  if (inferred && typeof inferred === 'object') {
    try {
      if (!name?.trim()) {
        const inferredAgentName = readAgentName(inferred);
        if (inferredAgentName) name = inferredAgentName;
      }
      if (!description?.trim() && typeof inferred.description === 'string') description = inferred.description;
      if (!image && inferred.image != null) image = String(inferred.image);
      if (!a2aEndpoint) {
        const eps = Array.isArray(inferred.endpoints) ? inferred.endpoints : [];
        const a2a = eps.find((e: any) => String(e?.name || '').toUpperCase() === 'A2A');
        const a2aUrl = (a2a?.endpoint || a2a?.url) as string | undefined;
        a2aEndpoint = a2aUrl || null;
      }
      if (!ensEndpoint) {
        const eps = Array.isArray(inferred.endpoints) ? inferred.endpoints : [];
        const ens = eps.find((e: any) => String(e?.name || '').toUpperCase() === 'ENS');
        const ensName = (ens?.endpoint || ens?.url) as string | undefined;
        ensEndpoint = ensName || null;
      }
    } catch {}
  }

  // Removed: agentAccountEndpoint (confusing/overloaded)

  let raw: string = '{}';
  try {
    if (metadataRaw != null && metadataRaw !== '') raw = metadataRaw as string;
    else if (metadataObj) raw = JSON.stringify(metadataObj);
    else if (inferred) raw = JSON.stringify(inferred);
    else {
      // Use uriMetadata if we fetched it earlier
      if (uriMetadata && typeof uriMetadata === 'object') {
        console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: using previously fetched URI metadata");
        raw = JSON.stringify(uriMetadata);
        
        // Update fields from URI metadata (override empty values from GraphQL)
        const uriAgentName = readAgentName(uriMetadata);
        if (uriAgentName) {
          name = uriAgentName;
          console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: updated name from URI:", name);
        }
        if (typeof uriMetadata.description === 'string' && uriMetadata.description.trim()) {
          description = uriMetadata.description;
          console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: updated description from URI:", description);
        }
        if (uriMetadata.image != null) {
          image = String(uriMetadata.image);
          console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: updated image from URI:", image);
        }
        
        // Extract endpoints using the same logic
        const endpoints = Array.isArray(uriMetadata.endpoints) ? uriMetadata.endpoints : [];
        const findEndpoint = (n: string) => {
          const e = endpoints.find((x: any) => (x?.name ?? '').toLowerCase() === n.toLowerCase());
          return e && typeof e.endpoint === 'string' ? e.endpoint : null;
        };
        
        const uriA2aEndpoint = findEndpoint('A2A');
        if (uriA2aEndpoint) {
          a2aEndpoint = uriA2aEndpoint;
          console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: updated a2aEndpoint from URI:", a2aEndpoint);
        }
        
        const uriEnsEndpoint = findEndpoint('ENS');
        if (uriEnsEndpoint) {
          ensEndpoint = uriEnsEndpoint;
          console.info("^^^^^^^^^^^^^^^^^^^^^ upsertFromTokenGraph: updated ensEndpoint from URI:", ensEndpoint);
        }

      } else {
        raw = JSON.stringify({ agentName: name, description, image, a2aEndpoint, ensEndpoint, agentAccount });
      }
    }
  } catch {}

  // Write extended fields into agents
  const updateTime = Math.floor(Date.now() / 1000);
  const agentCategory = readAgentCategory(uriMetadata ?? metadataObj);
  
  // Extract active field from metadata
  // Default to false, only set to true if explicitly set to true in tokenUri JSON
  const metadataForActive = uriMetadata ?? metadataObj;
  const activeValue = metadataForActive?.active;
  const active = activeValue !== undefined
    ? !!(activeValue === true || activeValue === 1 || String(activeValue).toLowerCase() === 'true')
    : false; // Default to false if not present

  // supportedTrust can appear as supportedTrust OR supportedTrusts in registration JSON (we accept either).
  const supportedTrust =
    Array.isArray(metadataObj?.supportedTrust) ? metadataObj.supportedTrust.map(String) :
    Array.isArray(metadataObj?.supportedTrusts) ? metadataObj.supportedTrusts.map(String) :
    [];
  
  await db.prepare(`
    UPDATE agents SET
      type = COALESCE(type, ?),
      agentName = COALESCE(NULLIF(TRIM(?), ''), agentName),
      agentCategory = CASE
        WHEN ? IS NOT NULL AND ? != '' THEN ?
        ELSE agentCategory
      END,
      description = COALESCE(?, description),
      image = COALESCE(?, image),
      a2aEndpoint = COALESCE(?, a2aEndpoint),
      ensEndpoint = COALESCE(?, ensEndpoint),
      supportedTrust = COALESCE(?, supportedTrust),
      active = ?,
      rawJson = COALESCE(?, rawJson),
      updatedAtTime = ?
    WHERE chainId = ? AND agentId = ?
  `).run(
    type,
    name,
    agentCategory, agentCategory, agentCategory,
    description,
    image,
    a2aEndpoint,
    ensEndpoint,
    JSON.stringify(supportedTrust),
    active ? 1 : 0,
    raw,
    updateTime,
    chainId,
    agentId,
  );

  // Fetch A2A agent card when tokenUri was set/updated (best-effort).
  try {
    if (tokenUri && a2aEndpoint) {
      if (process.env.AGENT_CARD_FETCH_ON_UPDATE === '1') {
        await upsertAgentCardForAgent(db, chainId, agentId, String(a2aEndpoint), { force: true });
      }
    }
  } catch {}
}
*/

async function applyUriUpdateFromGraph(update: any, chainId: number, dbInstance: any) {
  const tokenIdRaw = update?.agent?.id;
  if (tokenIdRaw == null) {
    console.warn('............applyUriUpdateFromGraph: missing token id in update', update?.id);
    return;
  }

  let tokenId: bigint;
  try {
    tokenId = BigInt(tokenIdRaw);
  } catch (error) {
    console.warn('............applyUriUpdateFromGraph: invalid token id', tokenIdRaw, error);
    return;
  }
  if (process.env.DEBUG_TRANSFERS === '1') {
    console.info('.... processed agentId (uriUpdate)', { chainId, agentId: toDecString(tokenId), tokenId: tokenId.toString() });
  }
  if (tokenId <= 0n) return;

  const agentId = toDecString(tokenId);
  const normalizeString = (value: any): string | null => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };
  const findEndpoint = (meta: any, label: string): string | null => {
    if (!meta) return null;
    const directKey = normalizeString(meta?.[`${label}Endpoint`]);
    if (directKey) return directKey;
    const endpoints = Array.isArray(meta?.endpoints) ? meta.endpoints : [];
    const target = label.toLowerCase();
    for (const entry of endpoints) {
      const name = typeof entry?.name === 'string' ? entry.name.toLowerCase() : '';
      if (name === target) {
        const raw = normalizeString(entry?.endpoint) || normalizeString(entry?.url);
        if (raw) return raw;
      }
    }
    return null;
  };

  const tokenUri = normalizeString(update?.newAgentURI);

  let metadataRaw: string | null = null;
  let metadataObj: any = null;
  const newUriJson = update?.newAgentURIJson;
  if (typeof newUriJson === 'string' && newUriJson.trim()) {
    metadataRaw = newUriJson;
    try {
      metadataObj = JSON.parse(newUriJson);
    } catch (error) {
      console.warn('............applyUriUpdateFromGraph: failed to parse newUriJson string', error);
    }
  } else if (newUriJson && typeof newUriJson === 'object') {
    metadataObj = newUriJson;
    try {
      metadataRaw = JSON.stringify(newUriJson);
    } catch {}
  }

  
  /*
  if (!metadataObj && tokenUri) {
    try {
      metadataObj = await fetchIpfsJson(tokenUri);
      if (metadataObj) metadataRaw = JSON.stringify(metadataObj);
    } catch (error) {
      console.warn('............applyUriUpdateFromGraph: failed to fetch metadata for tokenUri', tokenUri, error);
    }
  }
  */

  const tokenData = update?.token || {};
  console.info("............applyUriUpdateFromGraph: tokenData: ", tokenData)
  const metadataName = readAgentName(metadataObj);
  const fallbackName = readAgentName(tokenData);
  const agentName = metadataName || fallbackName || null;

  const metadataDescription = normalizeString(metadataObj?.description);
  const fallbackDescription = normalizeString(tokenData?.description);
  const description = metadataDescription || fallbackDescription;

  const metadataImage = metadataObj?.image != null ? String(metadataObj.image) : null;
  const fallbackImage = tokenData?.image != null ? String(tokenData.image) : null;
  const image = metadataImage || fallbackImage;

  const metadataA2a = findEndpoint(metadataObj, 'a2a') || normalizeString(metadataObj?.a2aEndpoint);
  const fallbackA2a = normalizeString(tokenData?.a2aEndpoint) || normalizeString(tokenData?.chatEndpoint);
  const a2aEndpoint = metadataA2a || fallbackA2a;

  const metadataEns = findEndpoint(metadataObj, 'ens') || normalizeString(metadataObj?.ensEndpoint);
  const fallbackEns = normalizeString(tokenData?.ensName);
  const ensEndpoint = metadataEns || fallbackEns;


  const agentCategory = readAgentCategory(metadataObj);

  const agentAccount = (() => {
    const v = tokenData?.agentWallet;
    if (typeof v !== 'string') return null;
    const s = v.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(s)) return null;
    return s.toLowerCase();
  })();
  // Extract active field from metadata
  // Default to false, only set to true if explicitly set to true in tokenUri JSON
  const metadataActive = metadataObj?.active;
  const fallbackActive = tokenData?.active;
  const activeValue = metadataActive !== undefined ? metadataActive : fallbackActive;
  const active = activeValue !== undefined 
    ? !!(activeValue === true || activeValue === 1 || String(activeValue).toLowerCase() === 'true')
    : false; // Default to false if not present

  let rawJson = metadataRaw;
  if (!rawJson && metadataObj) {
    try {
      rawJson = JSON.stringify(metadataObj);
    } catch {}
  }
  if (!rawJson) {
    try {
      rawJson = JSON.stringify({
        agentName,
        description,
        image,
        a2aEndpoint,
        ensEndpoint,
        agentAccount,
        agentUri: tokenUri,
      });
    } catch {
      rawJson = null;
    }
  }

  const now = Math.floor(Date.now() / 1000);
  const blockNumberNumeric = Number(update?.blockNumber ?? 0);
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const ownerAddress = agentAccount ?? zeroAddress;
  const eoaAgentIdentityOwnerAccount = await resolveEoaOwnerSafe(chainId, ownerAddress);
  const eoaAgentAccount = agentAccount ? (await resolveEoaOwnerSafe(chainId, agentAccount)) : null;
  const agentIdentityOwnerAccountType =
    ownerAddress && eoaAgentIdentityOwnerAccount
      ? (eoaAgentIdentityOwnerAccount.toLowerCase() === ownerAddress.toLowerCase() ? 'eoa' : 'aa')
      : null;
  const agentAccountType =
    agentAccount && eoaAgentAccount
      ? (eoaAgentAccount.toLowerCase() === agentAccount.toLowerCase() ? 'eoa' : 'aa')
      : null;
  const didIdentity = `did:8004:${chainId}:${agentId}`;
  const didAccount = agentAccount ? `did:ethr:${chainId}:${agentAccount}` : '';
  const didName = agentName && agentName.endsWith('.eth') ? `did:ens:${chainId}:${agentName}` : null;

  // IMPORTANT: Do NOT write a rigid INSERT/UPDATE here.
  // D1 schemas vary wildly across deployments and you don't want migrations.
  // Route through `upsertFromTransfer` so account fields and did* are computed consistently.
  console.info(">>>>>>>>>>. applyUriUpdateFromGraph: agentName: ", agentName);
  try {
    const tokenId = BigInt(agentId);
    const tokenInfoForUpsert: any = {
      // Prefer the parsed JSON object if available (lets upsertFromTransfer extract OASF, endpoints, etc)
      metadataJson: metadataObj ?? (metadataRaw || null),
      agentWallet: agentAccount || undefined,
      // Helpful fallbacks if metadataJson is missing fields
      name: agentName || undefined,
      description: description || undefined,
      image: image || undefined,
      a2aEndpoint: a2aEndpoint || undefined,
      chatEndpoint: tokenData?.chatEndpoint || undefined,
      ensName: ensEndpoint || undefined,
      active: active ? 1 : 0,
      // Some subgraphs include these directly; keep them if present
      agentURI: tokenUri,
      agentUri: tokenUri,
      tokenUri: tokenUri,
    };
    await upsertFromTransfer(
      (ownerAddress || zeroAddress).toLowerCase(),
      tokenId,
      tokenInfoForUpsert,
      BigInt(blockNumberNumeric || 0),
      tokenUri,
      chainId,
      dbInstance,
    );
  } catch (e) {
    console.error('❌ Error routing uri update through upsertFromTransfer:', e);
    throw e;
  }

  // Agent-card fetch is intentionally NOT part of the hot path (network-heavy). Use CLI only.
  if (process.env.AGENT_CARD_FETCH_ON_UPDATE === '1') {
    try {
      if (a2aEndpoint && tokenUri) {
        await upsertAgentCardForAgent(dbInstance, chainId, agentId, String(a2aEndpoint), { force: true });
      }
    } catch {}
  }

  // ATI compute is intentionally NOT part of the hot path (expensive). Use CLI only.
  if (process.env.ATI_COMPUTE_ON_WRITE === '1') {
    try {
      await computeAndUpsertATI(dbInstance, chainId, agentId);
    } catch (e) {
      console.warn('............ATI compute failed (applyUriUpdateFromGraph)', e);
    }
  }
  // Badge processing is now done via CLI: `pnpm badge:process`
}

async function recordEvent(ev: any, type: string, args: any, agentIdForEventOrDb?: string | any, dbOverride?: any) {
  // Support both old signature (agentIdForEvent as string) and new signature (dbOverride)
  const agentIdForEvent = typeof agentIdForEventOrDb === 'string' ? agentIdForEventOrDb : undefined;
  const dbInstance = dbOverride || (typeof agentIdForEventOrDb !== 'string' ? agentIdForEventOrDb : undefined) || db;
  
  if (!dbInstance) {
    throw new Error('Database instance required for recordEvent. In Workers, db must be passed via dbOverride parameter');
  }
  
  const id = `${ev.transactionHash}:${ev.logIndex}`;
  const agentId = agentIdForEvent ?? (args?.agentId !== undefined ? toDecString(args.agentId) : (args?.tokenId !== undefined ? toDecString(args.tokenId) : "0"));
  await dbInstance.prepare(`INSERT OR IGNORE INTO events(id, agentId, type, blockNumber, logIndex, txHash, data)
              VALUES(?, ?, ?, ?, ?, ?, ?)`).run(
    id,
    agentId,
    type,
    Number(ev.blockNumber),
    Number(ev.logIndex),
    ev.transactionHash,
    JSON.stringify({ ...args, agentId })
  );
}

async function upsertAssociationFromGraph(
  item: any,
  chainId: number,
  dbInstance: any,
  associationAccountsBatch?: BatchWriter,
  associationsBatch?: BatchWriter,
): Promise<void> {
  if (!item?.id) {
    console.warn('⚠️  upsertAssociationFromGraph: missing id', item);
    return;
  }

  const associationId = normalizeHex(String(item.id));
  if (!associationId) return;

  const initiatorAccountId = normalizeHex(item?.initiatorAccount?.id ? String(item.initiatorAccount.id) : null);
  const approverAccountId = normalizeHex(item?.approverAccount?.id ? String(item.approverAccount.id) : null);
  if (!initiatorAccountId || !approverAccountId) {
    console.warn('⚠️  upsertAssociationFromGraph: missing initiator/approver account id for', associationId);
    return;
  }

  // Ensure account rows exist (best-effort; no FK constraints enforced in D1 by default)
  const accountStmt = dbInstance.prepare(`INSERT OR IGNORE INTO association_accounts(id) VALUES(?)`);
  await enqueueOrRun(associationAccountsBatch, accountStmt, [initiatorAccountId]);
  await enqueueOrRun(associationAccountsBatch, accountStmt, [approverAccountId]);

  const initiator = normalizeHex(item?.initiator != null ? String(item.initiator) : null) ?? '';
  const approver = normalizeHex(item?.approver != null ? String(item.approver) : null) ?? '';
  const interfaceId = normalizeHex(item?.interfaceId != null ? String(item.interfaceId) : null) ?? '';
  const data = normalizeHex(item?.data != null ? String(item.data) : null) ?? '';
  const initiatorKeyType = normalizeHex(item?.initiatorKeyType != null ? String(item.initiatorKeyType) : null) ?? '';
  const approverKeyType = normalizeHex(item?.approverKeyType != null ? String(item.approverKeyType) : null) ?? '';
  const initiatorSignature = normalizeHex(item?.initiatorSignature != null ? String(item.initiatorSignature) : null) ?? '';
  const approverSignature = normalizeHex(item?.approverSignature != null ? String(item.approverSignature) : null) ?? '';

  const validAt = item?.validAt != null ? Number(item.validAt) : 0;
  const validUntil = item?.validUntil != null ? Number(item.validUntil) : 0;
  const revokedAt = item?.revokedAt != null ? Number(item.revokedAt) : null;

  const createdTxHash = normalizeHex(item?.createdTxHash != null ? String(item.createdTxHash) : null) ?? '';
  const createdBlockNumber = item?.createdBlockNumber != null ? Number(item.createdBlockNumber) : 0;
  const createdTimestamp = item?.createdTimestamp != null ? Number(item.createdTimestamp) : 0;
  const lastUpdatedTxHash = normalizeHex(item?.lastUpdatedTxHash != null ? String(item.lastUpdatedTxHash) : null) ?? '';
  const lastUpdatedBlockNumber = item?.lastUpdatedBlockNumber != null ? Number(item.lastUpdatedBlockNumber) : 0;
  const lastUpdatedTimestamp = item?.lastUpdatedTimestamp != null ? Number(item.lastUpdatedTimestamp) : 0;

  const stmt = dbInstance.prepare(`
    INSERT INTO associations(
      chainId, associationId,
      initiatorAccountId, approverAccountId,
      initiator, approver, validAt, validUntil, interfaceId, data,
      initiatorKeyType, approverKeyType, initiatorSignature, approverSignature,
      revokedAt,
      createdTxHash, createdBlockNumber, createdTimestamp,
      lastUpdatedTxHash, lastUpdatedBlockNumber, lastUpdatedTimestamp
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(chainId, associationId) DO UPDATE SET
      initiatorAccountId=excluded.initiatorAccountId,
      approverAccountId=excluded.approverAccountId,
      initiator=excluded.initiator,
      approver=excluded.approver,
      validAt=excluded.validAt,
      validUntil=excluded.validUntil,
      interfaceId=excluded.interfaceId,
      data=excluded.data,
      initiatorKeyType=excluded.initiatorKeyType,
      approverKeyType=excluded.approverKeyType,
      initiatorSignature=excluded.initiatorSignature,
      approverSignature=excluded.approverSignature,
      revokedAt=excluded.revokedAt,
      createdTxHash=excluded.createdTxHash,
      createdBlockNumber=excluded.createdBlockNumber,
      createdTimestamp=excluded.createdTimestamp,
      lastUpdatedTxHash=excluded.lastUpdatedTxHash,
      lastUpdatedBlockNumber=excluded.lastUpdatedBlockNumber,
      lastUpdatedTimestamp=excluded.lastUpdatedTimestamp
  `);

  await enqueueOrRun(associationsBatch, stmt, [
    chainId,
    associationId,
    initiatorAccountId,
    approverAccountId,
    initiator,
    approver,
    validAt,
    validUntil,
    interfaceId,
    data,
    initiatorKeyType,
    approverKeyType,
    initiatorSignature,
    approverSignature,
    revokedAt,
    createdTxHash,
    createdBlockNumber,
    createdTimestamp,
    lastUpdatedTxHash,
    lastUpdatedBlockNumber,
    lastUpdatedTimestamp,
  ]);

  // Best-effort: recompute ATI for any agents matching initiator/approver account suffixes.
  try {
    const suffixA = initiatorAccountId.slice(-40);
    const suffixB = approverAccountId.slice(-40);
    const agentRows = await dbInstance
      .prepare(`SELECT agentId FROM agents WHERE chainId = ? AND (substr(LOWER(agentAccount), -40) = ? OR substr(LOWER(agentAccount), -40) = ?) LIMIT 10`)
      .all(chainId, suffixA, suffixB);
    const results = Array.isArray((agentRows as any)?.results) ? (agentRows as any).results : Array.isArray(agentRows) ? agentRows : [];
    for (const r of results) {
      const aid = String(r?.agentId ?? '');
      if (!aid) continue;
      await computeAndUpsertATI(dbInstance, chainId, aid);
      // Badge processing is now done via CLI: `pnpm badge:process`
    }
  } catch (e) {
    console.warn('............ATI compute failed (association upsert)', e);
  }
}

async function recordAssociationRevocationFromGraph(
  item: any,
  chainId: number,
  dbInstance: any,
  batch?: BatchWriter,
): Promise<void> {
  if (!item?.id) {
    console.warn('⚠️  recordAssociationRevocationFromGraph: missing id', item);
    return;
  }
  const id = String(item.id);
  const associationId = normalizeHex(item?.associationId != null ? String(item.associationId) : null);
  if (!associationId) {
    console.warn('⚠️  recordAssociationRevocationFromGraph: missing associationId for', id);
    return;
  }
  const revokedAt = item?.revokedAt != null ? Number(item.revokedAt) : 0;
  const txHash = normalizeHex(item?.txHash != null ? String(item.txHash) : null) ?? '';
  const blockNumber = item?.blockNumber != null ? Number(item.blockNumber) : 0;
  const timestamp = item?.timestamp != null ? Number(item.timestamp) : 0;

  const stmt = dbInstance.prepare(`
    INSERT INTO association_revocations(chainId, id, associationId, revokedAt, txHash, blockNumber, timestamp)
    VALUES(?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(chainId, id) DO UPDATE SET
      associationId=excluded.associationId,
      revokedAt=excluded.revokedAt,
      txHash=excluded.txHash,
      blockNumber=excluded.blockNumber,
      timestamp=excluded.timestamp
  `);

  await enqueueOrRun(batch, stmt, [
    chainId,
    id,
    associationId,
    revokedAt,
    txHash,
    blockNumber,
    timestamp,
  ]);
}

// Sections: allow running only parts of the ingest flow without duplicating code.
export type BackfillSection =
  | 'agents'
  | 'registrationFiles'
  | 'agentMetadata'
  | 'feedbacks'
  | 'feedbackRevocations'
  | 'feedbackResponses'
  | 'validationRequests'
  | 'validationResponses'
  | 'uriUpdates'
  | 'associations'
  | 'associationRevocations';

export const ALL_BACKFILL_SECTIONS: BackfillSection[] = [
  'agents',
  'registrationFiles',
  'agentMetadata',
  'feedbacks',
  'feedbackRevocations',
  'feedbackResponses',
  'validationRequests',
  'validationResponses',
  'uriUpdates',
  'associations',
  'associationRevocations',
];

export async function backfill(
  client: ERC8004Client,
  dbOverrideOrOptions?:
    | any
    | {
        dbOverride?: any;
        sections?: BackfillSection[];
      },
) {
  // Backwards compatible arg shape: backfill(client, dbOverride) or backfill(client, { dbOverride, sections }).
  const opts =
    dbOverrideOrOptions && typeof dbOverrideOrOptions === 'object' && ('sections' in dbOverrideOrOptions || 'dbOverride' in dbOverrideOrOptions)
      ? (dbOverrideOrOptions as any)
      : { dbOverride: dbOverrideOrOptions };
  const dbInstance = opts.dbOverride || db;
  const selectedSectionsRaw =
    Array.isArray(opts.sections) && opts.sections.length ? (opts.sections as BackfillSection[]) : ALL_BACKFILL_SECTIONS;
  const selected = new Set<BackfillSection>(selectedSectionsRaw);

  if (!dbInstance) {
    throw new Error('Database instance required for backfill. In Workers, db must be passed via env.DB');
  }

  const chainId = await client.getChainId();

  // Get chain-specific GraphQL URL
  let graphqlUrl = '';
  if (chainId === 11155111) {
    // ETH Sepolia
    graphqlUrl = ETH_SEPOLIA_GRAPHQL_URL;
  } else if (chainId === 84532) {
    // Base Sepolia (L2)
    graphqlUrl = BASE_SEPOLIA_GRAPHQL_URL;
  } else if (chainId === 11155420) {
    // Optimism Sepolia (L2)
    graphqlUrl = OP_SEPOLIA_GRAPHQL_URL;
  } 




  // GraphQL-driven indexing: fetch latest transfers and upsert
  if (!graphqlUrl) {
    console.warn(`GRAPHQL_URL not configured for chain ${chainId}; skipping GraphQL backfill`);
    return;
  }

  // Use dbInstance directly instead of getCheckpoint (which uses global db)
  const transferCheckpointKey = chainId ? `lastProcessed_${chainId}` : 'lastProcessed';
  const feedbackCheckpointKey = chainId ? `lastProcessedFeedback_${chainId}` : 'lastProcessedFeedback';
  const uriUpdateCheckpointKey = chainId ? `lastUriUpdate_${chainId}` : 'lastUriUpdate';
  const validationCheckpointKey = chainId ? `lastValidation_${chainId}` : 'lastValidation';
  const tokenCheckpointKey = chainId ? `lastToken_${chainId}` : 'lastToken';
  const registrationFileCheckpointKey = chainId ? `lastAgentRegistrationFile_${chainId}` : 'lastAgentRegistrationFile';
  const agentMetadataCheckpointKey = chainId ? `lastAgentMetadata_${chainId}` : 'lastAgentMetadata';
  const associationCheckpointKey = chainId ? `lastAssociation_${chainId}` : 'lastAssociation';
  const associationRevocationCheckpointKey = chainId ? `lastAssociationRevocation_${chainId}` : 'lastAssociationRevocation';
  const lastTransferRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(transferCheckpointKey) as { value?: string } | undefined;
  const lastFeedbackRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(feedbackCheckpointKey) as { value?: string } | undefined;
  const lastUriUpdateRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(uriUpdateCheckpointKey) as { value?: string } | undefined;
  const lastValidationRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(validationCheckpointKey) as { value?: string } | undefined;
  const lastTokenRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(tokenCheckpointKey) as { value?: string } | undefined;
  const lastRegistrationFileRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(registrationFileCheckpointKey) as { value?: string } | undefined;
  const lastTokenMetadataRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(agentMetadataCheckpointKey) as { value?: string } | undefined;
  const lastAssociationRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(associationCheckpointKey) as { value?: string } | undefined;
  const lastAssociationRevocationRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(associationRevocationCheckpointKey) as { value?: string } | undefined;
  const lastTransfer = lastTransferRow?.value ? BigInt(lastTransferRow.value) : 0n;
  const lastFeedback = lastFeedbackRow?.value ? BigInt(lastFeedbackRow.value) : 0n;
  const lastUriUpdate = lastUriUpdateRow?.value ? BigInt(lastUriUpdateRow.value) : 0n;
  const lastValidation = lastValidationRow?.value ? BigInt(lastValidationRow.value) : 0n;
  const lastToken = lastTokenRow?.value ? BigInt(lastTokenRow.value) : 0n;
  const lastAgentRegistrationFile = lastRegistrationFileRow?.value ? BigInt(lastRegistrationFileRow.value) : 0n;
  const lastAgentMetadata = lastTokenMetadataRow?.value ? BigInt(lastTokenMetadataRow.value) : 0n;
  const lastAssociation = lastAssociationRow?.value ? BigInt(lastAssociationRow.value) : 0n;
  const lastAssociationRevocation = lastAssociationRevocationRow?.value ? BigInt(lastAssociationRevocationRow.value) : 0n;


  const fetchJson = async (body: any) => {
    // Normalize URL: some gateways expect <key>/<subgraph> without trailing /graphql
    // The Graph Studio URLs are already complete, so we don't need to append /graphql
    const endpoint = (graphqlUrl || '').replace(/\/graphql\/?$/i, '');
    
    
    // Prepare headers
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'accept': 'application/json'
    };
    
    // Add authorization header if API key is provided
    if (GRAPHQL_API_KEY) {
      headers['Authorization'] = `Bearer ${GRAPHQL_API_KEY}`;
    }
    
    // Hard timeout so a stalled subgraph doesn't hang the whole indexer forever.
    // Use Promise.race() so this works even if fetch abort semantics are flaky in a given runtime.
    const timeoutMs = 60_000;
    const controller = new AbortController();
    let timeoutHandle: any;
    let res: any;
    try {
      res = await Promise.race([
        fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        } as any),
        new Promise((_, reject) => {
          timeoutHandle = setTimeout(() => {
            try { controller.abort(); } catch {}
            reject(new Error(`GraphQL timeout after ${timeoutMs}ms`));
          }, timeoutMs);
        }),
      ]);
    } catch (e: any) {
      const msg = String(e?.message || e || '');
      if (msg.toLowerCase().includes('timeout')) {
        throw new Error(`GraphQL timeout after ${timeoutMs}ms`);
      }
      const name = String(e?.name || '');
      if (name === 'AbortError') {
        throw new Error(`GraphQL timeout after ${timeoutMs}ms`);
      }
      throw e;
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    }
    
    if (!res.ok) {
      let text = '';
      try { text = await res.text(); } catch {}
      console.error("............fetchJson: HTTP error:", res.status, text);
      throw new Error(`GraphQL ${res.status}: ${text || res.statusText}`);
    }
    
    const json = await res.json();
    return json;
  };

  // ---- Subgraph schema guardrails (fail fast with a clear message) ----
  // We require the Jan 2026 schema roots for agent ingest.
  const fetchQueryFieldNames = async (): Promise<Set<string>> => {
    const introspectionQuery = {
      query: `query IntrospectQueryFields {
        __schema {
          queryType {
            fields { name }
          }
        }
      }`,
      variables: {},
    };
    try {
      const resp = await fetchJson(introspectionQuery);
      const fields = (resp?.data?.__schema?.queryType?.fields || []) as any[];
      return new Set(fields.map((f: any) => String(f?.name || '')).filter(Boolean));
    } catch (e) {
      // If introspection is disabled, we can't validate early. Proceed and let queries fail normally.
      console.warn('[subgraph] Introspection failed; cannot validate schema up-front:', e);
      return new Set<string>();
    }
  };

  const queryFields = await fetchQueryFieldNames();

  // Subgraph schema: (Jan 2026) use the new canonical names only.
  const ROOT_AGENTS_FIELD = 'agents';
  const ROOT_AGENT_REGISTRATION_FILES_FIELD = 'agentRegistrationFiles';
  const ROOT_TRANSFERS_FIELD = 'agentTransfers';
  const ROOT_URI_UPDATES_FIELD = 'agentURIUpdates';
  const ROOT_AGENT_METADATA_FIELD =
    (queryFields.has('agentMetadatas') && 'agentMetadatas') ||
    (queryFields.has('agentMetadataEntries') && 'agentMetadataEntries') ||
    null;
  const AGENT_METADATA_COLLECTION_FIELD = queryFields.has('agentMetadata_collection')
    ? 'agentMetadata_collection'
    : null;
  const hasAgentMetadataField = Boolean(ROOT_AGENT_METADATA_FIELD || AGENT_METADATA_COLLECTION_FIELD);
  const ROOT_FEEDBACKS_FIELD = 'repFeedbacks';
  const ROOT_FEEDBACK_REVOKEDS_FIELD = 'repFeedbackRevokeds';
  const ROOT_FEEDBACK_RESPONSES_FIELD = 'repResponseAppendeds';
  const ROOT_VALIDATION_REQUESTS_FIELD = 'validationRequests';
  const ROOT_VALIDATION_RESPONSES_FIELD = 'validationResponses';
  const ROOT_ASSOCIATIONS_FIELD = 'associations';
  const ROOT_ASSOCIATION_REVOCATIONS_FIELD = 'associationRevocations';


  // Keep pages relatively small to reduce load on The Graph and avoid long-running queries/timeouts.
  const pageSize = (() => {
    const raw = process.env.SUBGRAPH_PAGE_SIZE;
    const n = raw && raw.trim() ? Number(raw) : NaN;
    // 500 is usually safe for subgraphs; tune via env.
    return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 500;
  })();

  const fetchAllFromSubgraph = async (
    label: string,
    query: string,
    field: string,
    options?: {
      optional?: boolean;
      lastCheckpoint?: bigint;
      maxSkip?: number;
      maxRetries?: number;
      buildVariables?: (args: { first: number; skip: number }) => Record<string, any>;
    }
  ) => {
    const allItems: any[] = [];
	    const maxSkip = options?.maxSkip ?? 5000;
  let skip = 0;
  let hasMore = true;
  let batchNumber = 0;
    const optional = options?.optional ?? false;
    const maxRetries = options?.maxRetries ?? (optional ? 6 : 3);
    const checkpointForLog = options?.lastCheckpoint ?? lastTransfer;
    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
  
	  while (hasMore) {
	    if (skip > maxSkip) {
	      console.warn(`............[${label}] Reached skip limit (${maxSkip}); stopping pagination early after ${allItems.length} items`);
	      break;
	    }
    batchNumber++;
    if (batchNumber === 1 && skip === 0) {
      console.info(`............[${label}] Fetching first page (pageSize=${pageSize})`);
    }
    const variables = options?.buildVariables
      ? options.buildVariables({ first: pageSize, skip })
      : { first: pageSize, skip };

    let resp: any;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        resp = await fetchJson({
          query,
          variables
        }) as any;
        break;
      } catch (e: any) {
        console.error("............fetchJson error:", e);
        const msg = String(e?.message || e || '');
        const lower = msg.toLowerCase();
        const isRetryableHttp =
          lower.includes('graphql 429') ||
          lower.includes('graphql 502') ||
          lower.includes('graphql 503') ||
          lower.includes('graphql 504') ||
          lower.includes('timeout') ||
          lower.includes('econnreset') ||
          lower.includes('fetch failed');

        if (!isRetryableHttp || attempt >= maxRetries) {
          throw e;
        }

        const backoffMs = Math.min(30_000, 750 * Math.pow(2, attempt)) + Math.floor(Math.random() * 250);
        console.warn(`............[${label}] Network/HTTP retry ${attempt + 1}/${maxRetries} (skip=${skip}, batch=${batchNumber}) after ${backoffMs}ms: ${msg}`);
        await sleep(backoffMs);
      }
    }


  	    if (resp?.errors && Array.isArray(resp.errors) && resp.errors.length > 0) {
        const missingField = resp.errors.some((err: any) => {
          const message = err?.message || '';
          if (typeof message !== 'string') return false;
          return message.includes(`field "${field}"`) || message.includes(`field \`${field}\``) || message.includes(field);
        });
	        const skipLimitError = resp.errors.some((err: any) => {
	          const message = String(err?.message || '').toLowerCase();
	          return message.includes('skip') && message.includes('argument');
	        });
          const overloadedError = resp.errors.some((err: any) => {
            const message = String(err?.message || '').toLowerCase();
            return (
              message.includes('service is overloaded') ||
              (message.includes('overloaded') && message.includes('service')) ||
              message.includes('can not run the query right now') ||
              message.includes('try again in a few minutes') ||
              message.includes('rate limit') ||
              message.includes('too many requests')
            );
          });

        if (optional && missingField) {
          console.warn(`............[${label}] Skipping: subgraph does not expose field "${field}". Message: ${resp.errors[0]?.message || 'unknown'}`);
          return [];
        }
	        if (optional && skipLimitError) {
	          console.warn(`............[${label}] Skipping remaining pages: ${resp.errors[0]?.message || 'skip limit hit'}`);
	          return allItems;
	        }
          if (overloadedError) {
            // The subgraph sometimes returns "service is overloaded..." as a GraphQL error payload.
            // Retry a few times; if still failing and this fetch is optional, skip so indexer keeps running.
            let succeeded = false;
            const overloadRetries = optional ? maxRetries : 1;
            for (let attempt = 0; attempt < overloadRetries; attempt++) {
              const backoffMs = Math.min(60_000, 1_000 * Math.pow(2, attempt)) + Math.floor(Math.random() * 500);
              console.warn(`............[${label}] Subgraph overloaded; retry ${attempt + 1}/${overloadRetries} (skip=${skip}, batch=${batchNumber}) after ${backoffMs}ms. Error: ${resp.errors[0]?.message || 'unknown'}`);
              await sleep(backoffMs);
              const retryResp = await fetchJson({ query, variables }).catch((e: any) => ({ errors: [{ message: String(e?.message || e || '') }] }));
              if (!retryResp?.errors || retryResp.errors.length === 0) {
                resp = retryResp;
                succeeded = true;
                break;
              }
            }

            if (!succeeded) {
              // Even for non-optional entities, don't abort the whole run on overload; skip and try again next run.
              console.warn(
                `............[${label}] Skipping due to overload (optional=${optional}). ` +
                `lastCheckpoint=${String(checkpointForLog)} itemsSoFar=${allItems.length}`
              );
              return allItems;
            }
          }

        // Some subgraphs have inconsistent data where `UriUpdate.token` is declared non-null
        // but occasionally resolves to null. The Graph returns errors but can still return
        // partial `data`. If so, keep going and just drop null items later.
        const uriUpdateTokenNullError =
          field === 'uriUpdates' &&
          resp?.data?.[field] &&
          resp.errors.every((err: any) => String(err?.message || '').includes('Null value resolved for non-null field') && String(err?.message || '').includes('token'));
        if (uriUpdateTokenNullError) {
          console.warn(`............[${label}] Proceeding with partial data despite token null errors (will filter null items). errors=${resp.errors.length}`);
          resp.errors = [];
        }

        // Some subgraphs also have inconsistent relations where `*.agent` is declared non-null
        // but resolves to null for a few rows. The Graph returns errors, but can still return
        // partial `data` with null list items. Treat these as non-fatal and drop null items later.
        const agentRelationNullError =
          (field === 'validationRequests' ||
            field === 'validationResponses' ||
            field === 'repFeedbacks' ||
            field === 'repFeedbackRevokeds' ||
            field === 'repResponseAppendeds') &&
          resp.errors.every((err: any) => {
            const msg = String(err?.message || '');
            return msg.includes('Null value resolved for non-null field') && msg.includes('agent');
          });
        if (agentRelationNullError) {
          console.warn(`............[${label}] Proceeding with partial data despite agent relation null errors (will filter null items). errors=${resp.errors.length}`);
          // If data is missing entirely, coerce to empty list so pagination can continue safely.
          if (!resp.data) resp.data = {};
          if (!resp.data[field]) resp.data[field] = [];
          resp.errors = [];
        }

        // The overload retry path can replace `resp` with a successful response; re-check before failing.
        // If this fetch is optional, never abort the whole backfill on errors—log and continue.
        if (resp?.errors && Array.isArray(resp.errors) && resp.errors.length > 0) {
          const errJson = JSON.stringify(resp.errors, null, 2) ?? String(resp.errors);
          if (optional) {
            console.warn(`............[${label}] Skipping due to GraphQL errors (optional=true). lastCheckpoint=${String(checkpointForLog)} itemsSoFar=${allItems.length} errors=${errJson}`);
            return allItems;
          }
          console.error(`............[${label}] GraphQL errors:`, errJson);
          throw new Error(`GraphQL query failed for ${label}: ${errJson}`);
        }
    }
    
      const batchItems = (((resp?.data?.[field] as any[]) || []) as any[]).filter(Boolean);
    
      if (batchItems.length === 0) {
      hasMore = false;
        console.info(`............[${label}] No more rows found, stopping pagination`);
    } else {
        allItems.push(...batchItems);
      if (batchItems.length < pageSize) {
        hasMore = false;
          console.info(`............[${label}] Reached end (got ${batchItems.length} < ${pageSize})`);
      } else {
        skip += pageSize;
	        if (skip > maxSkip) {
	          console.warn(`............[${label}] Next skip (${skip}) would exceed limit (${maxSkip}); stopping pagination`);
	          hasMore = false;
	        }
      }
    }
  }
  
    return allItems;
  };

  const agentsQuery = `query Agents($first: Int!, $skip: Int!) {
    agents(first: $first, skip: $skip, orderBy: mintedAt, orderDirection: asc) {
      id
      mintedAt
      agentURI
      metadataJson
      name
      description
      image
      ensName
      agentWallet
      a2aEndpoint
      chatEndpoint
      registration {
        id
        agentURI
        raw
        type
        name
        description
        image
        supportedTrust
        a2aEndpoint
        chatEndpoint
        ensName
        updatedAt
      }
      owner { id }
    }
  }`;

  // Prefer agentRegistrationFiles over transfer history for driving registration/metadata ingest.
  // NOTE: Marked optional because some subgraph deployments may not expose this root field.
  const agentRegistrationFilesQuery = `query AgentRegistrationFiles($first: Int!, $skip: Int!) {
    agentRegistrationFiles(first: $first, skip: $skip, orderBy: updatedAt, orderDirection: asc) {
      id
      agent { id owner { id } agentWallet mintedAt }
      agentURI
      raw
      type
      name
      description
      image
      supportedTrust
      a2aEndpoint
      chatEndpoint
      ensName
      updatedAt
    }
  }`;

  const transfersQuery = `query AgentTransfers($first: Int!, $skip: Int!) {
    agentTransfers(first: $first, skip: $skip, orderBy: timestamp, orderDirection: asc) {
      id
      agent {
        id
        mintedAt
        agentURI
        metadataJson
        name
        description
        image
        ensName
        agentWallet
        a2aEndpoint
        chatEndpoint
        owner { id }
      }
      from { id }
      to { id }
      txHash
      blockNumber
      timestamp
    }
  }`;

  const feedbackQuery = `query RepFeedbacks($first: Int!, $skip: Int!) {
    repFeedbacks(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      agent { id }
      clientAddress
      feedbackIndex
      score
      tag1
      tag2
      endpoint
      feedbackUri
      feedbackJson
      feedbackType
      domain
      comment
      ratingPct
      feedbackTimestamp
      feedbackHash
      txHash
      blockNumber
      timestamp
    }
  }`;

  const feedbackRevokedQuery = `query RepFeedbackRevokeds($first: Int!, $skip: Int!) {
    repFeedbackRevokeds(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      agent { id }
      clientAddress
      feedbackIndex
      txHash
      blockNumber
      timestamp
    }
  }`;

  const feedbackResponseQuery = `query RepResponseAppendeds($first: Int!, $skip: Int!) {
    repResponseAppendeds(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      agent { id }
      clientAddress
      feedbackIndex
      responder
      responseUri
      responseJson
      responseHash
      txHash
      blockNumber
      timestamp
    }
  }`;

  const uriUpdatesQuery = `query AgentURIUpdates($first: Int!, $skip: Int!) {
    agentURIUpdates(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      agent { id agentWallet }
      newAgentURI
      newAgentURIJson
      updatedBy
      txHash
      blockNumber
      timestamp
    }
  }`;

  const validationRequestQuery = `query ValidationRequests($first: Int!, $skip: Int!) {
    validationRequests(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      validatorAddress
      agent { id }
      requestUri
      requestJson
      requestHash
      txHash
      blockNumber
      timestamp
    }
  }`;

  const validationResponseQuery = `query ValidationResponses($first: Int!, $skip: Int!) {
    validationResponses(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      validatorAddress
      agent { id }
      requestHash
      response
      responseUri
      responseJson
      responseHash
      tag
      txHash
      blockNumber
      timestamp
    }
  }`;

  const associationsQuery = `query Associations($first: Int!, $skip: Int!) {
    associations(first: $first, skip: $skip, orderBy: lastUpdatedBlockNumber, orderDirection: asc) {
      id
      initiatorAccount { id }
      approverAccount { id }
      initiator
      approver
      validAt
      validUntil
      interfaceId
      data
      initiatorKeyType
      approverKeyType
      initiatorSignature
      approverSignature
      revokedAt
      createdTxHash
      createdBlockNumber
      createdTimestamp
      lastUpdatedTxHash
      lastUpdatedBlockNumber
      lastUpdatedTimestamp
    }
  }`;

  const associationRevocationsQuery = `query AssociationRevocations($first: Int!, $skip: Int!) {
    associationRevocations(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      associationId
      revokedAt
      txHash
      blockNumber
      timestamp
    }
  }`;

  // Agents snapshot (authoritative current view)
  if (queryFields.size > 0 && !queryFields.has(ROOT_AGENTS_FIELD)) {
    const available = Array.from(queryFields).sort().slice(0, 80).join(', ');
    throw new Error(
      `Subgraph schema mismatch: Query has no field "agents". ` +
        `Point ETH_SEPOLIA_GRAPHQL_URL (or chain URL) at the Jan 2026 subgraph. ` +
        `Available query fields (first 80): ${available}`,
    );
  }
  const agentItems = await fetchAllFromSubgraph('agents', agentsQuery, ROOT_AGENTS_FIELD, { lastCheckpoint: lastToken });
  // Registration file stream (authoritative metadata records)
  const registrationFileItems =
    queryFields.size > 0 && !queryFields.has(ROOT_AGENT_REGISTRATION_FILES_FIELD)
      ? []
      : await fetchAllFromSubgraph(
          'agentRegistrationFiles',
          agentRegistrationFilesQuery,
          ROOT_AGENT_REGISTRATION_FILES_FIELD,
          { optional: true, lastCheckpoint: lastAgentRegistrationFile },
        );

  const feedbackItems = await fetchAllFromSubgraph('repFeedbacks', feedbackQuery, ROOT_FEEDBACKS_FIELD, { optional: true, lastCheckpoint: lastFeedback });
  const feedbackRevokedItems = await fetchAllFromSubgraph('repFeedbackRevokeds', feedbackRevokedQuery, ROOT_FEEDBACK_REVOKEDS_FIELD, { optional: true, lastCheckpoint: lastFeedback });
  const feedbackResponseItems = await fetchAllFromSubgraph('repResponseAppendeds', feedbackResponseQuery, ROOT_FEEDBACK_RESPONSES_FIELD, { optional: true, lastCheckpoint: lastFeedback });
  const uriUpdateItems = await fetchAllFromSubgraph('agentURIUpdates', uriUpdatesQuery, ROOT_URI_UPDATES_FIELD, { optional: true, lastCheckpoint: lastUriUpdate });
  const validationRequestItems = await fetchAllFromSubgraph('validationRequests', validationRequestQuery, ROOT_VALIDATION_REQUESTS_FIELD, { optional: true, lastCheckpoint: lastValidation });
  const validationResponseItems = await fetchAllFromSubgraph('validationResponses', validationResponseQuery, ROOT_VALIDATION_RESPONSES_FIELD, { optional: true, lastCheckpoint: lastValidation });
  const associationItems = await fetchAllFromSubgraph('associations', associationsQuery, ROOT_ASSOCIATIONS_FIELD, { optional: true, lastCheckpoint: lastAssociation });
  const associationRevocationItems = await fetchAllFromSubgraph('associationRevocations', associationRevocationsQuery, ROOT_ASSOCIATION_REVOCATIONS_FIELD, { optional: true, lastCheckpoint: lastAssociationRevocation });

  // Removed: transfer-driven ingestion (use agents + agentRegistrationFiles instead)

  let feedbackCheckpointBlock = lastFeedback;
  const updateFeedbackCheckpointIfNeeded = async (blockNumber: bigint) => {
    if (blockNumber > feedbackCheckpointBlock) {
      feedbackCheckpointBlock = blockNumber;
      await dbInstance.prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(feedbackCheckpointKey, String(blockNumber));
    }
  };

  let uriUpdateCheckpointBlock = lastUriUpdate;
  const updateUriCheckpointIfNeeded = async (blockNumber: bigint) => {
    if (blockNumber > uriUpdateCheckpointBlock) {
      uriUpdateCheckpointBlock = blockNumber;
      await dbInstance.prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(uriUpdateCheckpointKey, String(blockNumber));
    }
  };

  let validationCheckpointBlock = lastValidation;
  const updateValidationCheckpointIfNeeded = async (blockNumber: bigint) => {
    if (blockNumber > validationCheckpointBlock) {
      validationCheckpointBlock = blockNumber;
      await dbInstance.prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(validationCheckpointKey, String(blockNumber));
    }
  };

  let tokenCheckpointBlock = lastToken;
  const updateTokenCheckpointIfNeeded = async (blockNumber: bigint) => {
    if (blockNumber > tokenCheckpointBlock) {
      tokenCheckpointBlock = blockNumber;
      await dbInstance.prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(tokenCheckpointKey, String(blockNumber));
  }
  };

  let registrationFileCheckpoint = lastAgentRegistrationFile;
  const updateRegistrationFileCheckpointIfNeeded = async (updatedAt: bigint) => {
    if (updatedAt > registrationFileCheckpoint) {
      registrationFileCheckpoint = updatedAt;
      await dbInstance
        .prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
        .run(registrationFileCheckpointKey, String(updatedAt));
    }
  };

  let agentMetadataCheckpointBlock = lastAgentMetadata;
  const updateAgentMetadataCheckpointIfNeeded = async (blockNumber: bigint) => {
    if (blockNumber > agentMetadataCheckpointBlock) {
      agentMetadataCheckpointBlock = blockNumber;
      await dbInstance
        .prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
        .run(agentMetadataCheckpointKey, String(blockNumber));
    }
  };

  let associationCheckpointBlock = lastAssociation;
  const updateAssociationCheckpointIfNeeded = async (blockNumber: bigint) => {
    if (blockNumber > associationCheckpointBlock) {
      associationCheckpointBlock = blockNumber;
      await dbInstance.prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(associationCheckpointKey, String(blockNumber));
    }
  };

  let associationRevocationCheckpointBlock = lastAssociationRevocation;
  const updateAssociationRevocationCheckpointIfNeeded = async (blockNumber: bigint) => {
    if (blockNumber > associationRevocationCheckpointBlock) {
      associationRevocationCheckpointBlock = blockNumber;
      await dbInstance.prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(associationRevocationCheckpointKey, String(blockNumber));
    }
  };

  // Upsert latest tokens metadata first (oldest-first by mintedAt)

  // Prefer processing agents snapshots (mintedAt-ordered).
  const agentsOrdered = agentItems
    .filter((t) => Number(t?.mintedAt || 0) > Number(lastToken))
    .slice()
    .sort((a, b) => Number(a.mintedAt) - Number(b.mintedAt));

  const feedbackInsertBatch = createBatchWriter(dbInstance, 'rep_feedbacks');
  const feedbackRevokedBatch = createBatchWriter(dbInstance, 'rep_feedback_revoked');
  const feedbackResponseBatch = createBatchWriter(dbInstance, 'rep_feedback_responses');
  const validationRequestBatch = createBatchWriter(dbInstance, 'validation_requests');
  const validationResponseBatch = createBatchWriter(dbInstance, 'validation_responses');
  const agentMetadataBatch = createBatchWriter(dbInstance, 'agent_metadata');
  const associationAccountsBatch = createBatchWriter(dbInstance, 'association_accounts');
  const associationsBatch = createBatchWriter(dbInstance, 'associations');
  const associationRevocationsBatch = createBatchWriter(dbInstance, 'association_revocations');

  if (selected.has('agents')) {
    console.info("............  process agents: ", agentsOrdered.length);
    for (let i = 0; i < agentsOrdered.length; i++) {
      const a = agentsOrdered[i];
      const tokenId = BigInt(a?.id || '0');
      const toAddr = String(a?.owner?.id || '').toLowerCase();
      // mintedAt is used as a monotonic cursor; treat it as a "block-like" bigint for checkpointing.
      const mintedAt = BigInt(a?.mintedAt || 0);
      if (tokenId <= 0n || !toAddr) continue;
      const tokenUri = typeof a?.agentURI === 'string' ? a.agentURI : null;
      await upsertFromTransfer(toAddr, tokenId, a as any, mintedAt, tokenUri, chainId, dbInstance);
      await updateTokenCheckpointIfNeeded(mintedAt);
      if ((i + 1) % 50 === 0 || i === agentsOrdered.length - 1) {
        console.info(`............  agent progress: ${i + 1}/${agentsOrdered.length} (mintedAt ${mintedAt})`);
      }
    }
  }

  // Ingest registration file records (authoritative metadata updates).
  if (selected.has('registrationFiles') && registrationFileItems.length > 0) {
    const regOrdered = registrationFileItems
      .filter((rf) => Number(rf?.updatedAt || 0) > Number(lastAgentRegistrationFile))
      .slice()
      .sort((a, b) => Number(a?.updatedAt || 0) - Number(b?.updatedAt || 0));

    console.info("............  process agentRegistrationFiles: ", regOrdered.length);
    for (let i = 0; i < regOrdered.length; i++) {
      const rf = regOrdered[i];
      const agent = rf?.agent || {};
      const tokenId = BigInt(agent?.id || rf?.id || '0');
      const toAddr = String(agent?.owner?.id || '').toLowerCase();
      const updatedAt = BigInt(rf?.updatedAt || 0);
      if (tokenId <= 0n || !toAddr) continue;

      // Feed registration raw JSON (if present) through the same agent upsert path.
      // upsertFromTransfer expects `metadataJson` as a JSON string.
      const pseudoAgent = {
        id: String(agent?.id ?? rf?.id ?? ''),
        mintedAt: agent?.mintedAt,
        agentURI: rf?.agentURI ?? agent?.agentURI,
        metadataJson: rf?.raw ?? null,
        name: rf?.name ?? null,
        description: rf?.description ?? null,
        image: rf?.image ?? null,
        ensName: rf?.ensName ?? null,
        agentWallet: agent?.agentWallet ?? null,
        a2aEndpoint: rf?.a2aEndpoint ?? null,
        chatEndpoint: rf?.chatEndpoint ?? null,
        owner: agent?.owner ?? null,
      };

      const regUri = typeof (rf?.agentURI ?? agent?.agentURI) === 'string' ? String(rf?.agentURI ?? agent?.agentURI) : null;
      await upsertFromTransfer(toAddr, tokenId, pseudoAgent as any, updatedAt, regUri, chainId, dbInstance);
      await updateRegistrationFileCheckpointIfNeeded(updatedAt);
      if ((i + 1) % 100 === 0 || i === regOrdered.length - 1) {
        console.info(`............  agentRegistrationFiles progress: ${i + 1}/${regOrdered.length} (updatedAt ${updatedAt})`);
      }
    }
  }

  const minTokenMetadataBlock = lastAgentMetadata > 0n ? lastAgentMetadata : 0n;
  let tokenMetadataItems: any[] = [];
  if (ROOT_AGENT_METADATA_FIELD) {
    const agentMetadataQuery = `query AgentMetadatas($first: Int!, $skip: Int!, $minBlock: BigInt!) {
      ${ROOT_AGENT_METADATA_FIELD}(
        first: $first,
        skip: $skip,
        orderBy: blockNumber,
        orderDirection: asc,
        where: { blockNumber_gt: $minBlock }
      ) {
        id
        agent { id }
        key
        value
        indexedKey
        setAt
        setBy
        txHash
        blockNumber
        timestamp
      }
    }`;
    tokenMetadataItems = await fetchAllFromSubgraph(
      ROOT_AGENT_METADATA_FIELD,
      agentMetadataQuery,
      ROOT_AGENT_METADATA_FIELD,
      {
        optional: true,
        buildVariables: ({ first, skip }) => ({
          first,
          skip,
          minBlock: minTokenMetadataBlock.toString(),
        }),
      },
    );
  } else if (AGENT_METADATA_COLLECTION_FIELD) {
    const agentMetadataCollectionQuery = `query AgentMetadataCollection($first: Int!, $skip: Int!, $chainId: Int!) {
      ${AGENT_METADATA_COLLECTION_FIELD}(
        chainId: $chainId,
        first: $first,
        skip: $skip
      ) {
        id
        agent { id }
        key
        value
        indexedKey
        setAt
        setBy
        txHash
        blockNumber
        timestamp
      }
    }`;
    tokenMetadataItems = await fetchAllFromSubgraph(
      AGENT_METADATA_COLLECTION_FIELD,
      agentMetadataCollectionQuery,
      AGENT_METADATA_COLLECTION_FIELD,
      {
        optional: true,
        buildVariables: ({ first, skip }) => ({
          first,
          skip,
          chainId,
        }),
      },
    );
    // Collection roots don't accept block filters; filter client-side to honor checkpoint.
    tokenMetadataItems = tokenMetadataItems.filter((meta) => {
      const bn = meta?.blockNumber ?? meta?.block?.number ?? 0;
      try {
        return bn ? BigInt(bn) > minTokenMetadataBlock : false;
      } catch {
        return false;
      }
    });
  } else {
    console.warn('............[agentMetadata] Skipping: subgraph does not expose agent metadata root field');
  }

  if (!selected.has('agentMetadata')) {
    // skip
  } else if (tokenMetadataItems.length === 0) {
    console.info(`............  no agent metadata updates beyond block ${lastAgentMetadata}`);
  } else {
    console.info("............  process agent metadata entries: ", tokenMetadataItems.length);
    let maxMetadataBlock = lastAgentMetadata;
    for (let i = 0; i < tokenMetadataItems.length; i++) {
      const meta = tokenMetadataItems[i];
      const metadataBlockRaw = meta?.blockNumber ?? meta?.block?.number ?? 0;
      let metadataBlock = 0n;
      try {
        metadataBlock = metadataBlockRaw ? BigInt(metadataBlockRaw) : 0n;
      } catch {
        metadataBlock = 0n;
      }

      if (metadataBlock <= lastAgentMetadata) {
        continue;
      }

      try {
        await upsertTokenMetadataFromGraph(meta, chainId, dbInstance, agentMetadataBatch);
        if (metadataBlock > maxMetadataBlock) {
          maxMetadataBlock = metadataBlock;
        }
        if ((i + 1) % 100 === 0 || i === tokenMetadataItems.length - 1) {
          console.info(`............  token metadata progress: ${i + 1}/${tokenMetadataItems.length} (block ${metadataBlock})`);
        }
      } catch (error) {
        console.error('❌ Error processing token metadata entry:', { id: meta?.id, error });
        throw error;
      }
    }

    if (maxMetadataBlock > lastAgentMetadata) {
      await updateAgentMetadataCheckpointIfNeeded(maxMetadataBlock);
    }
  }

  const feedbacksOrdered = feedbackItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastFeedback))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  if (selected.has('feedbacks')) {
    console.info("............  process feedbacks: ", feedbacksOrdered.length);
    if (feedbacksOrdered.length > 0) {
      console.info('............  sample feedback ids:', feedbacksOrdered.slice(0, 3).map((fb) => `${fb?.id || 'unknown'}@${fb?.blockNumber || '0'}`).join(', '));
    }
    for (let i = 0; i < feedbacksOrdered.length; i++) {
      const fb = feedbacksOrdered[i];
      const blockNum = BigInt(fb?.blockNumber || 0);
      try {
        if (process.env.DEBUG_FEEDBACK === '1') {
          console.info("............  processing feedback upsert: ", fb?.id);
          console.info(`............  processing feedback upsert: agentId=${fb?.agent?.id}, id=${fb?.id}`);
        }
        await upsertFeedbackFromGraph(fb, chainId, dbInstance, feedbackInsertBatch);
        await updateFeedbackCheckpointIfNeeded(blockNum);
        if ((i + 1) % 25 === 0 || i === feedbacksOrdered.length - 1) {
          console.info(`............  feedback progress: ${i + 1}/${feedbacksOrdered.length} (block ${blockNum})`);
        }
      } catch (error) {
        console.error('❌ Error processing feedback from Graph:', { id: fb?.id, blockNum: String(blockNum), error });
        throw error;
      }
    }
  }

  const feedbackRevokedOrdered = feedbackRevokedItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastFeedback))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  if (selected.has('feedbackRevocations')) {
    console.info("............  process feedback revocations: ", feedbackRevokedOrdered.length);
    if (feedbackRevokedOrdered.length > 0) {
      console.info('............  sample revocation ids:', feedbackRevokedOrdered.slice(0, 3).map((rev) => `${rev?.id || 'unknown'}@${rev?.blockNumber || '0'}`).join(', '));
    }
    for (let i = 0; i < feedbackRevokedOrdered.length; i++) {
      const rev = feedbackRevokedOrdered[i];
      const blockNum = BigInt(rev?.blockNumber || 0);
      try {
        await recordFeedbackRevocationFromGraph(rev, chainId, dbInstance, feedbackRevokedBatch);
        await updateFeedbackCheckpointIfNeeded(blockNum);
        if ((i + 1) % 25 === 0 || i === feedbackRevokedOrdered.length - 1) {
          console.info(`............  feedback revocation progress: ${i + 1}/${feedbackRevokedOrdered.length} (block ${blockNum})`);
        }
      } catch (error) {
        console.error('❌ Error processing feedback revocation:', { id: rev?.id, blockNum: String(blockNum), error });
        throw error;
      }
    }
  }

  const feedbackResponsesOrdered = feedbackResponseItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastFeedback))
  .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  if (selected.has('feedbackResponses')) {
    console.info("............  process feedback responses: ", feedbackResponsesOrdered.length);
    if (feedbackResponsesOrdered.length > 0) {
      console.info('............  sample response ids:', feedbackResponsesOrdered.slice(0, 3).map((resp) => `${resp?.id || 'unknown'}@${resp?.blockNumber || '0'}`).join(', '));
    }
    for (let i = 0; i < feedbackResponsesOrdered.length; i++) {
      const resp = feedbackResponsesOrdered[i];
      const blockNum = BigInt(resp?.blockNumber || 0);
      try {
        await recordFeedbackResponseFromGraph(resp, chainId, dbInstance, feedbackResponseBatch);
        await updateFeedbackCheckpointIfNeeded(blockNum);
        if ((i + 1) % 25 === 0 || i === feedbackResponsesOrdered.length - 1) {
          console.info(`............  feedback response progress: ${i + 1}/${feedbackResponsesOrdered.length} (block ${blockNum})`);
        }
      } catch (error) {
        console.error('❌ Error processing feedback response:', { id: resp?.id, blockNum: String(blockNum), error });
        throw error;
      }
    }
  }

  const validationRequestsOrdered = validationRequestItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastValidation))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  if (selected.has('validationRequests')) {
    console.info("............  process validation requests: ", validationRequestsOrdered.length);
    if (validationRequestsOrdered.length > 0) {
      console.info('............  sample validation request ids:', validationRequestsOrdered.slice(0, 3).map((req) => `${req?.id || 'unknown'}@${req?.blockNumber || '0'}`).join(', '));
    }
    for (let i = 0; i < validationRequestsOrdered.length; i++) {
      const req = validationRequestsOrdered[i];
      const blockNum = BigInt(req?.blockNumber || 0);
      try {
        console.info(`............  processing validation request: agentId=${req?.agent?.id}, id=${req?.id}`);
        await upsertValidationRequestFromGraph(req, chainId, dbInstance, validationRequestBatch);
        await updateValidationCheckpointIfNeeded(blockNum);
        if ((i + 1) % 25 === 0 || i === validationRequestsOrdered.length - 1) {
          console.info(`............  validation request progress: ${i + 1}/${validationRequestsOrdered.length} (block ${blockNum})`);
        }
      } catch (error) {
        console.error('❌ Error processing validation request:', { id: req?.id, blockNum: String(blockNum), error });
        throw error;
      }
    }
  }

  const validationResponsesOrdered = validationResponseItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastValidation))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  const validationAgentsToProcess = new Map<string, string>();
  if (selected.has('validationResponses')) {
    console.info("............  process validation responses: ", validationResponsesOrdered.length);
    if (validationResponsesOrdered.length > 0) {
      console.info('............  sample validation response ids:', validationResponsesOrdered.slice(0, 3).map((resp) => `${resp?.id || 'unknown'}@${resp?.blockNumber || '0'}`).join(', '));
    }
    for (let i = 0; i < validationResponsesOrdered.length; i++) {
      const resp = validationResponsesOrdered[i];
      const blockNum = BigInt(resp?.blockNumber || 0);
      try {
        await upsertValidationResponseFromGraph(resp, chainId, dbInstance, validationResponseBatch);
        if (resp?.agent?.id != null) {
          validationAgentsToProcess.set(String(resp.agent.id), String(resp?.id ?? ''));
        }
        await updateValidationCheckpointIfNeeded(blockNum);
        if ((i + 1) % 25 === 0 || i === validationResponsesOrdered.length - 1) {
          console.info(`............  validation response progress: ${i + 1}/${validationResponsesOrdered.length} (block ${blockNum})`);
        }
      } catch (error) {
        console.error('❌ Error processing validation response:', { id: resp?.id, blockNum: String(blockNum), error });
        throw error;
      }
    }
  }

  const uriUpdatesOrdered = uriUpdateItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastUriUpdate))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  if (selected.has('uriUpdates')) {
    console.info("............  process uri updates: ", uriUpdatesOrdered.length);
    if (uriUpdatesOrdered.length > 0) {
      console.info('............  sample uri update ids:', uriUpdatesOrdered.slice(0, 3).map((u) => `${u?.id || 'unknown'}@${u?.blockNumber || '0'}`).join(', '));
    }
    for (let i = 0; i < uriUpdatesOrdered.length; i++) {
      const update = uriUpdatesOrdered[i];
      const blockNum = BigInt(update?.blockNumber || 0);
      try {
        await applyUriUpdateFromGraph(update, chainId, dbInstance);
        await updateUriCheckpointIfNeeded(blockNum);
        if ((i + 1) % 25 === 0 || i === uriUpdatesOrdered.length - 1) {
          console.info(`............  uri update progress: ${i + 1}/${uriUpdatesOrdered.length} (block ${blockNum})`);
        }
      } catch (error) {
        console.error('❌ Error processing uri update:', { id: update?.id, blockNum: String(blockNum), error });
        throw error;
      }
    }
  }

  const associationsOrdered = associationItems
    .filter((item) => Number(item?.lastUpdatedBlockNumber || item?.createdBlockNumber || 0) > Number(lastAssociation))
    .slice()
    .sort((a, b) => Number(a?.lastUpdatedBlockNumber || a?.createdBlockNumber || 0) - Number(b?.lastUpdatedBlockNumber || b?.createdBlockNumber || 0));

  if (selected.has('associations')) {
    console.info("............  process associations: ", associationsOrdered.length);
    if (associationsOrdered.length > 0) {
      console.info('............  sample association ids:', associationsOrdered.slice(0, 3).map((a) => `${a?.id || 'unknown'}@${a?.lastUpdatedBlockNumber || a?.createdBlockNumber || '0'}`).join(', '));
    }
    for (let i = 0; i < associationsOrdered.length; i++) {
      const assoc = associationsOrdered[i];
      const blockNum = BigInt(assoc?.lastUpdatedBlockNumber || assoc?.createdBlockNumber || 0);
      try {
        await upsertAssociationFromGraph(assoc, chainId, dbInstance, associationAccountsBatch, associationsBatch);
        // Best-effort: if the association.data points to IPFS delegation metadata, fetch+persist it for RDF export.
        try {
          await upsertAssociationDelegationFromIpfs(assoc, chainId, dbInstance);
        } catch (e) {
          // Do not fail the full backfill on IPFS issues.
          console.warn('⚠️  association delegation IPFS ingest failed (best-effort)', { id: assoc?.id, err: String((e as any)?.message || e) });
        }
        await updateAssociationCheckpointIfNeeded(blockNum);
        if ((i + 1) % 50 === 0 || i === associationsOrdered.length - 1) {
          console.info(`............  associations progress: ${i + 1}/${associationsOrdered.length} (block ${blockNum})`);
        }
      } catch (error) {
        console.error('❌ Error processing association:', { id: assoc?.id, blockNum: String(blockNum), error });
        throw error;
      }
    }
  }

  const associationRevocationsOrdered = associationRevocationItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastAssociationRevocation))
    .slice()
    .sort((a, b) => Number(a?.blockNumber || 0) - Number(b?.blockNumber || 0));

  if (selected.has('associationRevocations')) {
    console.info("............  process association revocations: ", associationRevocationsOrdered.length);
    if (associationRevocationsOrdered.length > 0) {
      console.info('............  sample association revocation ids:', associationRevocationsOrdered.slice(0, 3).map((r) => `${r?.id || 'unknown'}@${r?.blockNumber || '0'}`).join(', '));
    }
    for (let i = 0; i < associationRevocationsOrdered.length; i++) {
      const rev = associationRevocationsOrdered[i];
      const blockNum = BigInt(rev?.blockNumber || 0);
      try {
        await recordAssociationRevocationFromGraph(rev, chainId, dbInstance, associationRevocationsBatch);
        await updateAssociationRevocationCheckpointIfNeeded(blockNum);
        if ((i + 1) % 50 === 0 || i === associationRevocationsOrdered.length - 1) {
          console.info(`............  association revocation progress: ${i + 1}/${associationRevocationsOrdered.length} (block ${blockNum})`);
        }
      } catch (error) {
        console.error('❌ Error processing association revocation:', { id: rev?.id, blockNum: String(blockNum), error });
        throw error;
      }
    }
  }

  await feedbackInsertBatch.flush();
  await feedbackRevokedBatch.flush();
  await feedbackResponseBatch.flush();
  await validationRequestBatch.flush();
  await validationResponseBatch.flush();
  await agentMetadataBatch.flush();
  await associationAccountsBatch.flush();
  await associationsBatch.flush();
  await associationRevocationsBatch.flush();

  // Badge processing is now done via CLI: `pnpm badge:process`


  // Token ingestion (upsertFromTokenGraph) is intentionally NOT part of the main indexer flow.
  // Use backfill CLIs to enrich agents from tokenUri/rawJson/agentCardJson.
  // This avoids long-running subgraph scans and reduces blast radius on duplicate/partial backfills.

  // Badge processing and rankings are now done via CLI: `pnpm badge:process`

}
/*
async function backfillByIds(client: ERC8004Client) {

  const chainId = await client.getChainId();
  
  // Optional ID-based backfill for sequential tokenIds starting at 1
  async function idExists(client: ERC8004Client, id: bigint): Promise<boolean> {
    try {
      // Use ownerOf - if it doesn't throw, the token exists
      await client.identity.getOwner(id);
      return true;
    } catch {
      return false;
    }
  }

  // Exponential + binary search to find max existing tokenId
  let lo = 0n;
  let hi = 1n;
  while (await idExists(client, hi)) { lo = hi; hi <<= 1n; }
  let left = lo + 1n;
  let right = hi;
  let max = lo;
  while (left <= right) {
    const mid = (left + right) >> 1n;
    if (await idExists(client, mid)) { max = mid; left = mid + 1n; } else { right = mid - 1n; }
  }

  if (max === 0n) {
    console.log('No tokens found via ID scan.');
    try {
      console.info('Clearing database rows: agents, agent_metadata, events');
      try { db.prepare('DELETE FROM agent_metadata').run(); } catch {}
      try { db.prepare('DELETE FROM agents').run(); } catch {}
      try { db.prepare('DELETE FROM events').run(); } catch {}
    } catch {}
    return;
  }

  console.log(`ID backfill: scanning 1 → ${max}`);
  for (let id = 1n; id <= max; id++) {
    try {

      const owner = await client.identity.getOwner(id);
      const uri = await tryReadTokenURI(client, id);
      console.info("............uri: ", uri)
      await upsertFromTransfer(owner, id, 0n, uri, chainId); // L2 chainId (Base Sepolia or Optimism Sepolia)
    } catch {
      // skip gaps or read errors
    }
  }
}

function watch() {
  const unsubs = [
    client.watchContractEvent({ address: IDENTITY_REGISTRY as `0x${string}`, abi: identityRegistryAbi, eventName: 'Transfer', onLogs: async (logs) => {
      for (const log of logs) {
        const { from, to, tokenId } = (log as any).args;
        const uri = await tryReadTokenURI(tokenId as bigint);
        await upsertFromTransfer(to as string, tokenId as bigint, log.blockNumber!, uri);
        recordEvent(log, 'Transfer', { from, to, tokenId: toDecString(tokenId) });
        setCheckpoint(log.blockNumber!);
      }
    }}),
    client.watchContractEvent({ address: IDENTITY_REGISTRY as `0x${string}`, abi: identityRegistryAbi, eventName: 'Approval', onLogs: (logs) => {
      for (const log of logs) {
        recordEvent(log, 'Approval', { ...((log as any).args), tokenId: toDecString(((log as any).args).tokenId) });
        setCheckpoint(log.blockNumber!);
      }
    }}),
    client.watchContractEvent({ address: IDENTITY_REGISTRY as `0x${string}`, abi: identityRegistryAbi, eventName: 'ApprovalForAll', onLogs: (logs) => {
      for (const log of logs) {
        recordEvent(log, 'ApprovalForAll', (log as any).args);
        setCheckpoint(log.blockNumber!);
      }
    }}),
    client.watchContractEvent({ address: IDENTITY_REGISTRY as `0x${string}`, abi: identityRegistryAbi, eventName: 'MetadataSet', onLogs: (logs) => {
      for (const log of logs) {
        recordEvent(log, 'MetadataSet', { ...((log as any).args), agentId: toDecString(((log as any).args).agentId) });
        setCheckpoint(log.blockNumber!);
      }
    }}),
    // Removed MetadataDeleted watcher (no longer in ABI)
  ];
  return () => unsubs.forEach((u) => u?.());
}
  */

// Parse command-line arguments
function parseArgs() {
  const args: { agentId?: string; sections?: string } = {};
  const argv = process.argv.slice(2);
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--agentId' || arg === '--agent-id') {
      args.agentId = argv[i + 1];
      i++;
    }
    if (arg === '--sections' || arg === '--section') {
      args.sections = argv[i + 1];
      i++;
    }
  }
  
  return args;
}

export function getClientsByChainId(): Record<string, any> {
  const clientsByChainId: Record<string, any> = {
    '11155111': erc8004EthSepoliaClient,
    '84532': erc8004BaseSepoliaClient,
  };
  if (erc8004OpSepoliaClient) clientsByChainId['11155420'] = erc8004OpSepoliaClient;
  return clientsByChainId;
}

async function promptForSectionsIfTty(): Promise<BackfillSection[] | null> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return null;
  try {
    const readline = await import('node:readline/promises');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    try {
      const answer = (await rl.question(`Run all ingest sections? (Y/n): `)).trim().toLowerCase();
      if (!answer || answer === 'y' || answer === 'yes') return null;
      const list = (await rl.question(`Which section(s)? (${ALL_BACKFILL_SECTIONS.join(', ')}): `)).trim();
      if (!list) return null;
      const parts = list.split(',').map((s) => s.trim()).filter(Boolean);
      const valid = new Set(ALL_BACKFILL_SECTIONS);
      const picked = parts.filter((p) => valid.has(p as BackfillSection)) as BackfillSection[];
      return picked.length ? picked : null;
    } finally {
      rl.close();
    }
  } catch {
    return null;
  }
}

// Process a specific agentId across all chains, ignoring checkpoints
async function processSingleAgentId(agentId: string) {
  const agentIdBigInt = BigInt(agentId);
  console.log(`🔄 Processing agentId ${agentId} across all chains (ignoring checkpoints)...`);
  
  const clients = [
    { name: 'ETH Sepolia', client: erc8004EthSepoliaClient, chainId: 11155111 },
    { name: 'Base Sepolia', client: erc8004BaseSepoliaClient, chainId: 84532 },
  ];
  
  if (erc8004OpSepoliaClient) {
    clients.push({ name: 'Optimism Sepolia', client: erc8004OpSepoliaClient, chainId: 11155420 });
  }
  
  for (const { name, client, chainId } of clients) {
    try {
      console.log(`\n📋 Processing ${name} (chainId: ${chainId})...`);
      
      // Check if agent exists by trying to get owner
      try {
        const owner = await client.identity.getOwner(agentIdBigInt);
        const tokenURI = await tryReadTokenURI(client, agentIdBigInt);
        
        // Get current block number for timestamp (use a recent block or current)
        const publicClient = (client as any).adapter?.provider;
        let blockNumber = 0n;
        try {
          const block = await publicClient?.getBlockNumber?.() || await publicClient?.getBlock?.('latest');
          blockNumber = block?.number ? BigInt(block.number) : 0n;
        } catch {
          // If we can't get block number, use 0
          blockNumber = 0n;
        }
        
        if (owner && owner !== '0x0000000000000000000000000000000000000000') {
          console.log(`  ✅ Agent ${agentId} exists on ${name}, owner: ${owner}`);
          await upsertFromTransfer(owner.toLowerCase(), agentIdBigInt, null, blockNumber || 0n, tokenURI, chainId);
          console.log(`  ✅ Successfully processed agentId ${agentId} on ${name}`);
        } else {
          console.log(`  ⚠️  Agent ${agentId} does not exist or is burned on ${name}`);
        }
      } catch (error: any) {
        console.log(`  ⚠️  Agent ${agentId} not found on ${name}: ${error?.message || error}`);
      }
    } catch (error: any) {
      console.error(`  ❌ Error processing ${name}:`, error?.message || error);
    }
  }
  
  console.log(`\n✅ Finished processing agentId ${agentId}`);
}

export async function runIndexerMain() {
  const args = parseArgs();
  
  // If agentId is specified, process only that agent
  if (args.agentId) {
    console.log(`🎯 Single agent mode: processing agentId ${args.agentId}`);
    await processSingleAgentId(args.agentId);
    return;
  }
  
  // Normal indexing mode
  // HOL import is intentionally NOT part of the normal indexer flow.
  // Run it only via the CLI: `pnpm import:hol` or `pnpm graphdb:ingest-hol ...`
  // NANDA import is intentionally NOT part of the normal indexer flow.
  // Run it only via the CLI: `pnpm import:nanda`

  // Ensure our primary D1 schema is initialized (development safety checks)
  await ensureSchemaInitialized();

  // Check if database has any data - if not, reset checkpoint to 0
  try {
    const agentCount = await db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number };
    const eventCount = await db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
    
    if (agentCount.count === 0 && eventCount.count === 0) {
      console.log('Database is empty - resetting checkpoints to 0 for all chains');
      await setCheckpoint(0n, 11155111); // ETH Sepolia
      await setCheckpoint(0n, 84532); // Base Sepolia (L2)
      await setCheckpoint(0n, 11155420); // Optimism Sepolia (L2)
      // Clear any stale checkpoint data
      await db.prepare("DELETE FROM checkpoints WHERE key LIKE 'lastProcessed%'").run();
    }
  } catch (error) {
    console.warn('Error checking database state:', error);
  }

  // Initial run (don't crash on failure)
  // Default: run only ETH Mainnet. To run multiple, set INDEXER_CHAIN_IDS="1,84532,11155420".
  const chainIdsRaw = (process.env.INDEXER_CHAIN_IDS || '1').trim();
  const chainIds = chainIdsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const clientsByChainId = getClientsByChainId();

  // Optional interactive selection for development runs.
  // Default: run all sections.
  const pickedFromPrompt = !args.sections ? await promptForSectionsIfTty() : null;
  const sectionsFromArgs =
    args.sections && args.sections.trim()
      ? args.sections
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  const requestedSections =
    sectionsFromArgs.length
      ? (sectionsFromArgs as BackfillSection[])
      : (pickedFromPrompt && pickedFromPrompt.length ? pickedFromPrompt : null);

  try {
    for (const cid of chainIds) {
      const c = clientsByChainId[cid];
      if (!c) {
        console.warn(`Skipping unknown INDEXER_CHAIN_ID=${cid}`);
        continue;
      }
      await backfill(c, requestedSections ? { sections: requestedSections } : undefined);
    }
  } catch (e) {
    console.error('Initial GraphQL backfill failed:', e);
  }

  // Agent-card backfill is intentionally NOT part of the indexer runtime. Use CLI only.

  // OASF skill metadata sync is now done via CLI: `pnpm skills:sync`

  // RDF export is intentionally NOT part of the indexer runtime.

  // Semantic ingest is intentionally NOT part of the indexer runtime. Use CLI only.

  // Subscribe to on-chain events as a safety net (optional)
  //const unwatch = watch();

  // Poll GraphQL for new transfers beyond checkpoint
  //const interval = setInterval(() => { backfill().catch((e) => console.error('GraphQL backfill error', e)); }, Math.max(5000, GRAPHQL_POLL_MS));
  //console.log("Indexer running (GraphQL + watch). Press Ctrl+C to exit.");
  //process.on('SIGINT', () => { clearInterval(interval); unwatch(); process.exit(0); });
}

// Only run when invoked as the entry script (so CLIs can import backfill helpers without side-effects).
const isEntry = (() => {
  const thisFile = fileURLToPath(import.meta.url);
  return process.argv.some((a) => {
    try {
      return pathResolve(a) === thisFile;
    } catch {
      return false;
    }
  });
})();

if (isEntry) {
  runIndexerMain().catch((e) => {
    console.error('[indexer] fatal', e);
    process.exitCode = 1;
  });
}
