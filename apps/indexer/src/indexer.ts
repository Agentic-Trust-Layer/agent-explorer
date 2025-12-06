import { createPublicClient, http, webSocket, type Address, decodeEventLog } from "viem";
import { db, getCheckpoint, setCheckpoint } from "./db";
import { RPC_WS_URL, CONFIRMATIONS, START_BLOCK, LOGS_CHUNK_SIZE, BACKFILL_MODE, ETH_SEPOLIA_GRAPHQL_URL, BASE_SEPOLIA_GRAPHQL_URL, OP_SEPOLIA_GRAPHQL_URL, GRAPHQL_API_KEY, GRAPHQL_POLL_MS } from "./env";
import { ethers } from 'ethers';
import { ERC8004Client, EthersAdapter } from '@agentic-trust/8004-sdk';


import { 
    ETH_SEPOLIA_IDENTITY_REGISTRY, 
    BASE_SEPOLIA_IDENTITY_REGISTRY, 
    OP_SEPOLIA_IDENTITY_REGISTRY,
    ETH_SEPOLIA_RPC_HTTP_URL, 
    BASE_SEPOLIA_RPC_HTTP_URL,
    OP_SEPOLIA_RPC_HTTP_URL } from './env';





const ethSepliaEthersProvider = new ethers.JsonRpcProvider(ETH_SEPOLIA_RPC_HTTP_URL);
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


const baseSepliaEthersProvider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC_HTTP_URL);
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

const opSepliaEthersProvider = OP_SEPOLIA_RPC_HTTP_URL ? new ethers.JsonRpcProvider(OP_SEPOLIA_RPC_HTTP_URL) : null;
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
          const resp = await fetchFn(ipfsUrl, { 
            signal: timeoutSignal
          });
          if (resp?.ok) {
            const json = await resp.json();
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
  const agentId = toDecString(tokenId);
  const ownerAddress = to;
  let agentAccount = to; // mirror owner for now
  const agentAddress = to; // keep for backward compatibility
  let agentName = readAgentName(tokenInfo) || ""; // not modeled in ERC-721; leave empty
  let resolvedTokenURI = tokenURI ?? (typeof tokenInfo?.uri === 'string' ? tokenInfo.uri : null);
  const mintedTimestamp = (() => {
    try {
      if (tokenInfo?.mintedAt === undefined || tokenInfo?.mintedAt === null) return null;
      const parsed = Number(tokenInfo.mintedAt);
      return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : null;
    } catch {
      return null;
    }
  })();
  const metadataAgentAccount = parseCaip10Address(tokenInfo?.agentAccount);
  if (metadataAgentAccount) {
    agentAccount = metadataAgentAccount;
  }

  console.info(".... ownerAddress", ownerAddress)
  console.info(".... chainId", chainId)

  // Fetch metadata from tokenURI BEFORE database insert to populate all fields
  let preFetchedMetadata: any = null;
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
      a2aEndpoint = findEndpoint('A2A') || findEndpoint('a2a') || a2aEndpoint;
    }
  };
  let a2aEndpoint: string | null = null;
  let description: string | null = null;
  let image: string | null = null;
  const tokenInfoName = readAgentName(tokenInfo);
  if (tokenInfo && tokenInfoName) { 
    console.info("............upsertFromTransfer: tokenInfo: ", tokenInfo)
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
      try {
        preFetchedMetadata = JSON.parse(tokenInfo.metadataJson);
      } catch (error) {
        console.warn("............upsertFromTransfer: Failed to parse token metadataJson string:", error);
      }
    } else if (typeof tokenInfo.metadataJson === 'object') {
      preFetchedMetadata = tokenInfo.metadataJson;
    }
  }
  applyMetadataHints(preFetchedMetadata);
  if (!preFetchedMetadata && resolvedTokenURI) {
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


  if (ownerAddress != '0x000000000000000000000000000000000000dEaD') {
    const createdAtTime = mintedTimestamp ?? Math.floor(Date.now() / 1000);
    
    // Compute DID values
    const didIdentity = `did:8004:${chainId}:${agentId}`;
    const didAccount = agentAccount ? `did:ethr:${chainId}:${agentAccount}` : '';
    const didName = agentName && agentName.endsWith('.eth') ? `did:ens:${chainId}:${agentName}` : null;
    
    await dbInstance.prepare(`
      INSERT INTO agents(chainId, agentId, agentAddress, agentAccount, agentOwner, agentName, tokenUri, a2aEndpoint, createdAtBlock, createdAtTime, didIdentity, didAccount, didName)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(chainId, agentId) DO UPDATE SET
        agentAddress=CASE WHEN excluded.agentAddress IS NOT NULL AND excluded.agentAddress != '0x0000000000000000000000000000000000000000' THEN excluded.agentAddress ELSE agentAddress END,
        agentAccount=CASE WHEN excluded.agentAccount IS NOT NULL AND excluded.agentAccount != '0x0000000000000000000000000000000000000000' THEN excluded.agentAccount ELSE COALESCE(agentAccount, agentAddress) END,
        agentOwner=excluded.agentOwner,
        agentName=COALESCE(NULLIF(TRIM(excluded.agentName), ''), agentName),
        a2aEndpoint=COALESCE(excluded.a2aEndpoint, a2aEndpoint),
        tokenUri=COALESCE(excluded.tokenUri, tokenUri),
        didIdentity=COALESCE(excluded.didIdentity, didIdentity),
        didAccount=COALESCE(excluded.didAccount, didAccount),
        didName=COALESCE(excluded.didName, didName)
    `).run(
      chainId,
      agentId,
      agentAddress, // keep for backward compatibility
      agentAccount,
      ownerAddress,
      agentName,
      resolvedTokenURI,
      a2aEndpoint,
      Number(blockNumber),
      createdAtTime,
      didIdentity,
      didAccount,
      didName
    );


    // Use pre-fetched metadata if available, otherwise fetch now
    const metadata = preFetchedMetadata || (resolvedTokenURI ? await fetchIpfsJson(resolvedTokenURI) : null);
    if (metadata) {
      try {
        const meta = metadata as any;
        const type = typeof meta.type === 'string' ? meta.type : null;
        const name = readAgentName(meta);

        // Use pre-extracted description and image, or extract from metadata if not already extracted
        const desc = description || (typeof meta.description === 'string' ? meta.description : null);
        const img = image || (meta.image == null ? null : String(meta.image));
        const endpoints = Array.isArray(meta.endpoints) ? meta.endpoints : [];
        const findEndpoint = (n: string) => {
          const e = endpoints.find((x: any) => (x?.name ?? '').toLowerCase() === n.toLowerCase());
          return e && typeof e.endpoint === 'string' ? e.endpoint : null;
        };
        const a2aEndpoint = findEndpoint('A2A');
        const ensEndpoint = findEndpoint('ENS');
        let agentAccountEndpoint = findEndpoint('agentAccount');
        // Always ensure agentAccountEndpoint reflects current owner `to`
        console.info("............agentAccountEndpoint: ", agentAccountEndpoint)
        if (!agentAccountEndpoint || !/^eip155:/i.test(agentAccountEndpoint)) {
          console.info("............agentAccountEndpoint: no endpoint found, setting to: ", `eip155:${chainId}:${to}`)
          agentAccountEndpoint = `eip155:${chainId}:${to}`;
        }
        const supportedTrust = Array.isArray(meta.supportedTrust) ? meta.supportedTrust.map(String) : [];
        console.info("............update into table: agentId: ", agentId)
        console.info("............update into table: agentAccount: ", agentAccount)
        console.info("............update into table: type: ", type)
        console.info("............update into table: name: ", name)
        console.info("............update into table: description: ", desc)
        console.info("............update into table: image: ", img)
        console.info("............update into table: a2aEndpoint: ", a2aEndpoint)
        console.info("............update into table: ensEndpoint: ", ensEndpoint)
        const updateTime = Math.floor(Date.now() / 1000);
        
        // Compute DID values
        const didIdentity = `did:8004:${chainId}:${agentId}`;
        const didAccountValue = agentAccount ? `did:ethr:${chainId}:${agentAccount}` : '';
        const didNameValue = name && name.endsWith('.eth') ? `did:ens:${chainId}:${name}` : null;
        
        await dbInstance.prepare(`
          UPDATE agents SET
            type = COALESCE(type, ?),
            agentName = CASE 
              WHEN ? IS NOT NULL AND ? != '' THEN ? 
              ELSE agentName 
            END,
            agentAddress = CASE
              WHEN (agentAddress IS NULL OR agentAddress = '0x0000000000000000000000000000000000000000')
                   AND (? IS NOT NULL AND ? != '0x0000000000000000000000000000000000000000')
              THEN ?
              ELSE agentAddress
            END,
            agentAccount = CASE
              WHEN (agentAccount IS NULL OR agentAccount = '0x0000000000000000000000000000000000000000')
                   AND (? IS NOT NULL AND ? != '0x0000000000000000000000000000000000000000')
              THEN ?
              ELSE COALESCE(agentAccount, agentAddress)
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
            ensEndpoint = CASE 
              WHEN ? IS NOT NULL AND ? != '' THEN ? 
              ELSE ensEndpoint 
            END,
            agentAccountEndpoint = COALESCE(?, agentAccountEndpoint),
            supportedTrust = COALESCE(?, supportedTrust),
            didIdentity = COALESCE(?, didIdentity),
            didAccount = COALESCE(?, didAccount),
            didName = COALESCE(?, didName),
            rawJson = COALESCE(?, rawJson),
            updatedAtTime = ?
          WHERE chainId = ? AND agentId = ?
        `).run(
          type,
          name, name, name,
          agentAddress, agentAddress, agentAddress, // keep for backward compatibility
          agentAccount, agentAccount, agentAccount,
          desc, desc, desc,
          img, img, img,
          a2aEndpoint, a2aEndpoint, a2aEndpoint,
          ensEndpoint, ensEndpoint, ensEndpoint,
          agentAccountEndpoint,
          JSON.stringify(supportedTrust),
          didIdentity,
          didAccountValue,
          didNameValue,
          JSON.stringify(meta),
          updateTime,
          chainId,
          agentId,
        );

        await recordEvent({ transactionHash: `token:${agentId}`, logIndex: 0, blockNumber }, 'MetadataFetched', { tokenId: agentId }, dbInstance);
      } catch (error) {
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
    console.info(`............[batch:${label}] flushing ${statements.length} statements`);
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
      if (queue.length >= batchSize) {
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

function extractMetadataIdentifier(metadataId: string | null | undefined): { agentId: string; metadataKey: string } | null {
  if (typeof metadataId !== 'string') return null;
  const trimmed = metadataId.trim();
  if (!trimmed) return null;
  const separatorIndex = trimmed.indexOf('-');
  if (separatorIndex <= 0) return null;
  const agentSegment = trimmed.slice(0, separatorIndex);
  const keySegment = trimmed.slice(separatorIndex + 1);
  if (!agentSegment || !keySegment) return null;

  let agentId = agentSegment;
  try {
    const numeric = BigInt(agentSegment);
    agentId = numeric.toString();
  } catch {
    // keep original segment if not numeric
  }

  return { agentId, metadataKey: keySegment };
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
  const agentId = String(item.agentId ?? '0');
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
  const feedbackUri = item.feedbackUri != null ? String(item.feedbackUri) : null;
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
  const tag1 = normalizeHex(item.tag1);
  const tag2 = normalizeHex(item.tag2);
  const feedbackHash = normalizeHex(item.feedbackHash);
  const txHash = normalizeHex(item.txHash);
  const now = Math.floor(Date.now() / 1000);

  const stmt = dbInstance.prepare(`
    INSERT INTO rep_feedbacks (
      id, chainId, agentId, clientAddress, feedbackIndex, score, tag1, tag2,
      feedbackUri, feedbackJson, agentRegistry, feedbackCreatedAt, feedbackAuth,
      skill, capability, contextJson, feedbackType, domain, comment, ratingPct,
      feedbackTimestamp, feedbackHash, txHash, blockNumber, timestamp,
      createdAt, updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      score=excluded.score,
      tag1=excluded.tag1,
      tag2=excluded.tag2,
      feedbackUri=excluded.feedbackUri,
      feedbackJson=excluded.feedbackJson,
      agentRegistry=COALESCE(excluded.agentRegistry, agentRegistry),
      feedbackCreatedAt=COALESCE(excluded.feedbackCreatedAt, feedbackCreatedAt),
      feedbackAuth=COALESCE(excluded.feedbackAuth, feedbackAuth),
      skill=COALESCE(excluded.skill, skill),
      capability=COALESCE(excluded.capability, capability),
      contextJson=COALESCE(excluded.contextJson, contextJson),
      feedbackType=excluded.feedbackType,
      domain=excluded.domain,
      comment=excluded.comment,
      ratingPct=excluded.ratingPct,
      feedbackTimestamp=excluded.feedbackTimestamp,
      feedbackHash=excluded.feedbackHash,
      txHash=excluded.txHash,
      blockNumber=excluded.blockNumber,
      timestamp=excluded.timestamp,
      updatedAt=excluded.updatedAt
  `);

  await enqueueOrRun(batch, stmt, [
    id,
    chainId,
    agentId,
    clientAddress,
    feedbackIndex,
    score,
    tag1,
    tag2,
    feedbackUri,
    feedbackJson,
    agentRegistryFromJson,
    feedbackCreatedAt,
    feedbackAuth,
    skillFromJson,
    capabilityFromJson,
    contextJson,
    feedbackType,
    domain,
    comment,
    ratingPct,
    feedbackTimestamp,
    feedbackHash,
    txHash,
    blockNumber,
    timestamp,
    now,
    now,
  ]);

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
  const agentId = String(item.agentId ?? '0');
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
  const agentId = String(item.agentId ?? '0');
  const clientAddress = item.clientAddress ? String(item.clientAddress).toLowerCase() : '';
  const feedbackIndex = item.feedbackIndex !== null && item.feedbackIndex !== undefined ? Number(item.feedbackIndex) : 0;
  if (!clientAddress || !feedbackIndex) {
    console.warn('⚠️  recordFeedbackResponseFromGraph: missing clientAddress or feedbackIndex for', id);
    return;
  }

  const responder = item.responder ? String(item.responder).toLowerCase() : '0x0000000000000000000000000000000000000000';
  const responseUri = item.responseUri != null ? String(item.responseUri) : null;
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
  const agentId = String(item.agentId ?? '0');
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
  const agentId = String(item.agentId ?? '0');
  const validatorAddressRaw = item.validatorAddress ? String(item.validatorAddress) : '';
  const validatorAddress = validatorAddressRaw.toLowerCase();
  if (!validatorAddress) {
    console.warn('⚠️  upsertValidationResponseFromGraph: missing validatorAddress for', id);
    return;
  }

  const requestHash = normalizeHex(item.requestHash);
  const responseValue = item.response !== null && item.response !== undefined ? Number(item.response) : null;
  const responseUri = item.responseUri != null ? String(item.responseUri) : null;
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
  const tag = normalizeHex(item.tag);
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

  const metadataIdRaw = typeof item.id === 'string' ? item.id : null;
  const keyRaw = typeof item.key === 'string' ? item.key : null;
  if (!metadataIdRaw || !keyRaw) {
    console.warn('⚠️  upsertTokenMetadataFromGraph: missing id or key', item);
    return;
  }

  const parsedIdentifier = extractMetadataIdentifier(metadataIdRaw);
  if (!parsedIdentifier) {
    console.warn('⚠️  upsertTokenMetadataFromGraph: unable to parse metadata id', metadataIdRaw);
    return;
  }

  const metadataKey = keyRaw.trim();
  if (!metadataKey) {
    console.warn('⚠️  upsertTokenMetadataFromGraph: empty metadata key', item);
    return;
  }

  const valueHex = typeof item.value === 'string' ? item.value : null;
  const valueText = valueHex ? decodeHexToUtf8(valueHex) : null;
  const indexedKey = typeof item.indexedKey === 'string' ? item.indexedKey : null;
  const now = Math.floor(Date.now() / 1000);

  const stmt = dbInstance.prepare(`
    INSERT INTO token_metadata (
      chainId, metadataId, agentId, metadataKey, valueHex, valueText, indexedKey, updatedAtTime
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(chainId, metadataId) DO UPDATE SET
      agentId=excluded.agentId,
      metadataKey=excluded.metadataKey,
      valueHex=excluded.valueHex,
      valueText=excluded.valueText,
      indexedKey=excluded.indexedKey,
      updatedAtTime=excluded.updatedAtTime
  `);

  await enqueueOrRun(batch, stmt, [
    chainId,
    metadataIdRaw,
    parsedIdentifier.agentId,
    metadataKey,
    valueHex,
    valueText,
    indexedKey,
    now,
  ]);
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

export async function upsertFromTokenGraph(item: any, chainId: number) {
  const tokenId = BigInt(item?.id || 0);
  if (tokenId <= 0n) return;
  const agentId = toDecString(tokenId);
  const ownerAddress = parseCaip10Address(item?.agentAccount) || '0x0000000000000000000000000000000000000000';
  const agentAccount = ownerAddress;
  const agentAddress = ownerAddress; // keep for backward compatibility
  let agentName = readAgentName(item) || '';
  const tokenUri = typeof item?.uri === 'string' ? item.uri : null;
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

  console.info("@@@@@@@@@@@@@@@@@@@ upsertFromTokenGraph 0: item: ", item)

  // If name is missing but we have a tokenURI, try to fetch and infer fields
  /*
  
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
  */

  console.info("@@@@@@@@@@@@@@@@@@@ upsertFromTokenGraph 1: agentName: ", agentId, agentName)
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Compute DID values
  const didIdentity = `did:8004:${chainId}:${agentId}`;
  const didAccount = agentAccount ? `did:ethr:${chainId}:${agentAccount}` : '';
  const didName = agentName && agentName.endsWith('.eth') ? `did:ens:${chainId}:${agentName}` : null;
  
  await db.prepare(`
    INSERT INTO agents(chainId, agentId, agentAddress, agentAccount, agentOwner, agentName, tokenUri, createdAtBlock, createdAtTime, didIdentity, didAccount, didName)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(chainId, agentId) DO UPDATE SET
      agentAddress=CASE WHEN excluded.agentAddress IS NOT NULL AND excluded.agentAddress != '0x0000000000000000000000000000000000000000' THEN excluded.agentAddress ELSE agentAddress END,
      agentAccount=CASE WHEN excluded.agentAccount IS NOT NULL AND excluded.agentAccount != '0x0000000000000000000000000000000000000000' THEN excluded.agentAccount ELSE COALESCE(agentAccount, agentAddress) END,
      agentOwner=excluded.agentOwner,
      agentName=CASE WHEN excluded.agentName IS NOT NULL AND length(excluded.agentName) > 0 THEN excluded.agentName ELSE agentName END,
      tokenUri=COALESCE(excluded.tokenUri, tokenUri),
      didIdentity=COALESCE(excluded.didIdentity, didIdentity),
      didAccount=COALESCE(excluded.didAccount, didAccount),
      didName=COALESCE(excluded.didName, didName)
  `).run(
    chainId,
    agentId,
    agentAddress, // keep for backward compatibility
    agentAccount,
    ownerAddress,
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

  // Fill from inferred registration JSON when missing
  if (inferred && typeof inferred === 'object') {
    try {
      if ((!name || !name.trim())) {
        const inferredAgentName = readAgentName(inferred);
        if (inferredAgentName) name = inferredAgentName;
      }
      if ((!description || !description.trim()) && typeof inferred.description === 'string') description = inferred.description;
      if (!image && inferred.image != null) image = String(inferred.image);
      if (!a2aEndpoint) {
        const eps = Array.isArray(inferred.endpoints) ? inferred.endpoints : [];
        const a2a = eps.find((e: any) => String(e?.name || '').toUpperCase() === 'A2A');
        const a2aUrl = (a2a?.endpoint || a2a?.url) as string | undefined;
        if (a2aUrl) a2aEndpoint = a2aUrl;
      }
      if (!ensEndpoint) {
        const eps = Array.isArray(inferred.endpoints) ? inferred.endpoints : [];
        const ens = eps.find((e: any) => String(e?.name || '').toUpperCase() === 'ENS');
        const ensName = (ens?.endpoint || ens?.url) as string | undefined;
        if (ensName) ensEndpoint = ensName;
      }
    } catch {}
  }

  const agentAccountEndpoint = (() => {
    const parsedAccount = parseCaip10Address(item?.agentAccount);
    if (parsedAccount) return `eip155:${chainId}:${parsedAccount}`;
    if (ownerAddress && ownerAddress !== '0x0000000000000000000000000000000000000000') return `eip155:${chainId}:${ownerAddress}`;
    return null;
  })();

  let raw: string = '{}';
  try {
    if (item?.metadataJson && typeof item.metadataJson === 'string') raw = item.metadataJson;
    else if (item?.metadataJson && typeof item.metadataJson === 'object') raw = JSON.stringify(item.metadataJson);
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
        raw = JSON.stringify({ agentName: name, description, image, a2aEndpoint, ensEndpoint, agentAccount: agentAccountEndpoint });
      }
    }
  } catch {}

  // Write extended fields into agents
  const updateTime = Math.floor(Date.now() / 1000);
  await db.prepare(`
    UPDATE agents SET
      type = COALESCE(type, ?),
      agentName = COALESCE(NULLIF(TRIM(?), ''), agentName),
      description = COALESCE(?, description),
      image = COALESCE(?, image),
      a2aEndpoint = COALESCE(?, a2aEndpoint),
      ensEndpoint = COALESCE(?, ensEndpoint),
      agentAccountEndpoint = COALESCE(?, agentAccountEndpoint),
      supportedTrust = COALESCE(?, supportedTrust),
      rawJson = COALESCE(?, rawJson),
      updatedAtTime = ?
    WHERE chainId = ? AND agentId = ?
  `).run(
    type,
    name,
    description,
    image,
    a2aEndpoint,
    ensEndpoint,
    agentAccountEndpoint,
    JSON.stringify([]),
    raw,
    updateTime,
    chainId,
    agentId,
  );
}

async function applyUriUpdateFromGraph(update: any, chainId: number, dbInstance: any) {
  const tokenIdRaw = update?.token?.id ?? update?.tokenId ?? update?.id;
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

  let tokenUri = normalizeString(update?.newUri);
  if (!tokenUri) tokenUri = normalizeString(update?.token?.uri);

  let metadataRaw: string | null = null;
  let metadataObj: any = null;
  if (typeof update?.newUriJson === 'string' && update.newUriJson.trim()) {
    metadataRaw = update.newUriJson;
    try {
      metadataObj = JSON.parse(update.newUriJson);
    } catch (error) {
      console.warn('............applyUriUpdateFromGraph: failed to parse newUriJson string', error);
    }
  } else if (update?.newUriJson && typeof update.newUriJson === 'object') {
    metadataObj = update.newUriJson;
    try {
      metadataRaw = JSON.stringify(update.newUriJson);
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

  const metadataAccount = normalizeString(metadataObj?.agentAccount);
  const fallbackAccount = normalizeString(tokenData?.agentAccount);
  const agentAccount = parseCaip10Address(metadataAccount) || parseCaip10Address(fallbackAccount);
  const agentAccountEndpoint = agentAccount ? `eip155:${chainId}:${agentAccount}` : null;

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
        agentAccount: agentAccountEndpoint,
        tokenUri,
      });
    } catch {
      rawJson = null;
    }
  }

  const now = Math.floor(Date.now() / 1000);
  const blockNumberNumeric = Number(update?.blockNumber ?? 0);
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const ownerAddress = agentAccount ?? zeroAddress;
  const didIdentity = `did:8004:${chainId}:${agentId}`;
  const didAccount = agentAccount ? `did:ethr:${chainId}:${agentAccount}` : '';
  const didName = agentName && agentName.endsWith('.eth') ? `did:ens:${chainId}:${agentName}` : null;

  console.info(">>>>>>>>>>. applyUriUpdateFromGraph: agentName: ", agentName)
  await dbInstance.prepare(`
    INSERT INTO agents(chainId, agentId, agentAddress, agentAccount, agentOwner, agentName, tokenUri, createdAtBlock, createdAtTime, didIdentity, didAccount, didName)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(chainId, agentId) DO UPDATE SET
      tokenUri=COALESCE(excluded.tokenUri, tokenUri),
      agentName=COALESCE(NULLIF(TRIM(excluded.agentName), ''), agentName),
      agentAccount=CASE WHEN excluded.agentAccount IS NOT NULL AND excluded.agentAccount != '' THEN excluded.agentAccount ELSE agentAccount END,
      agentAddress=CASE WHEN excluded.agentAddress IS NOT NULL AND excluded.agentAddress != '' THEN excluded.agentAddress ELSE agentAddress END,
      agentOwner=CASE WHEN excluded.agentOwner IS NOT NULL AND excluded.agentOwner != '' THEN excluded.agentOwner ELSE agentOwner END,
      didIdentity=COALESCE(excluded.didIdentity, didIdentity),
      didAccount=COALESCE(excluded.didAccount, didAccount),
      didName=COALESCE(excluded.didName, didName)
  `).run(
    chainId,
    agentId,
    ownerAddress,
    ownerAddress,
    ownerAddress,
    agentName ?? '',
    tokenUri,
    blockNumberNumeric,
    now,
    didIdentity,
    didAccount,
    didName,
  );

  await dbInstance.prepare(`
    UPDATE agents SET
      tokenUri = COALESCE(?, tokenUri),
      agentName = CASE WHEN ? IS NOT NULL AND ? != '' THEN ? ELSE agentName END,
      description = COALESCE(?, description),
      image = COALESCE(?, image),
      a2aEndpoint = COALESCE(?, a2aEndpoint),
      ensEndpoint = COALESCE(?, ensEndpoint),
      agentAccount = CASE WHEN ? IS NOT NULL AND ? != '' THEN ? ELSE agentAccount END,
      agentAccountEndpoint = COALESCE(?, agentAccountEndpoint),
      rawJson = CASE WHEN ? IS NOT NULL AND ? != '' THEN ? ELSE rawJson END,
      updatedAtTime = ?
    WHERE chainId = ? AND agentId = ?
  `).run(
    tokenUri,
    agentName, agentName, agentName,
    description,
    image,
    a2aEndpoint,
    ensEndpoint,
    agentAccount, agentAccount, agentAccount,
    agentAccountEndpoint,
    rawJson, rawJson, rawJson,
    now,
    chainId,
    agentId,
  );
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

export async function backfill(client: ERC8004Client, dbOverride?: any) {
  // Use provided db override (for Workers) or fall back to module-level db (for local)
  const dbInstance = dbOverride || db;
  
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
  const tokenMetadataCheckpointKey = chainId ? `lastTokenMetadata_${chainId}` : 'lastTokenMetadata';
  const lastTransferRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(transferCheckpointKey) as { value?: string } | undefined;
  const lastFeedbackRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(feedbackCheckpointKey) as { value?: string } | undefined;
  const lastUriUpdateRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(uriUpdateCheckpointKey) as { value?: string } | undefined;
  const lastValidationRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(validationCheckpointKey) as { value?: string } | undefined;
  const lastTokenRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(tokenCheckpointKey) as { value?: string } | undefined;
  const lastTokenMetadataRow = await dbInstance.prepare("SELECT value FROM checkpoints WHERE key=?").get(tokenMetadataCheckpointKey) as { value?: string } | undefined;
  const lastTransfer = lastTransferRow?.value ? BigInt(lastTransferRow.value) : 0n;
  const lastFeedback = lastFeedbackRow?.value ? BigInt(lastFeedbackRow.value) : 0n;
  const lastUriUpdate = lastUriUpdateRow?.value ? BigInt(lastUriUpdateRow.value) : 0n;
  const lastValidation = lastValidationRow?.value ? BigInt(lastValidationRow.value) : 0n;
  const lastToken = lastTokenRow?.value ? BigInt(lastTokenRow.value) : 0n;
  const lastTokenMetadata = lastTokenMetadataRow?.value ? BigInt(lastTokenMetadataRow.value) : 0n;


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
    
    const res = await fetch(endpoint, { 
      method: 'POST', 
      headers, 
      body: JSON.stringify(body) 
    } as any);
    
    if (!res.ok) {
      let text = '';
      try { text = await res.text(); } catch {}
      console.error("............fetchJson: HTTP error:", res.status, text);
      throw new Error(`GraphQL ${res.status}: ${text || res.statusText}`);
    }
    
    const json = await res.json();
    return json;
  };




  const pageSize = 1000; // Reduced page size to avoid Workers timeout (30s limit)

  const fetchAllFromSubgraph = async (
    label: string,
    query: string,
    field: string,
	    options?: { optional?: boolean; lastCheckpoint?: bigint; maxSkip?: number }
  ) => {
    const allItems: any[] = [];
	    const maxSkip = options?.maxSkip ?? 5000;
  let skip = 0;
  let hasMore = true;
  let batchNumber = 0;
    const optional = options?.optional ?? false;
    const checkpointForLog = options?.lastCheckpoint ?? lastTransfer;
  
	  while (hasMore) {
	    if (skip > maxSkip) {
	      console.warn(`............[${label}] Reached skip limit (${maxSkip}); stopping pagination early after ${allItems.length} items`);
	      break;
	    }
    batchNumber++;
    const resp = await fetchJson({ 
        query,
      variables: { first: pageSize, skip } 
    }) as any;


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

        if (optional && missingField) {
          console.warn(`............[${label}] Skipping: subgraph does not expose field "${field}". Message: ${resp.errors[0]?.message || 'unknown'}`);
          return [];
        }
	        if (optional && skipLimitError) {
	          console.warn(`............[${label}] Skipping remaining pages: ${resp.errors[0]?.message || 'skip limit hit'}`);
	          return allItems;
	        }

        console.error(`............[${label}] GraphQL errors:`, JSON.stringify(resp.errors, null, 2));
        throw new Error(`GraphQL query failed for ${label}: ${JSON.stringify(resp.errors)}`);
    }
    
      const batchItems = (resp?.data?.[field] as any[]) || [];
    
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

  const tokensQuery = `query Tokens($first: Int!, $skip: Int!) {
    tokens(first: $first, skip: $skip, orderBy: mintedAt, orderDirection: asc) {
      id
      mintedAt
      uri
      metadataJson
      agentName
      agentAccount
      description
      image
      a2aEndpoint
      ensName
    }
  }`;

  const transfersQuery = `query TokensAndTransfers($first: Int!, $skip: Int!) {
    transfers(first: $first, skip: $skip, orderBy: timestamp, orderDirection: asc) {
      id
      token {
        id
        uri
        mintedAt
        agentName
        agentAccount
        description
        image
        a2aEndpoint
        chatEndpoint
        ensName
        metadataJson
      }
      from { id }
      to { id }
      blockNumber
      timestamp
    }
  }`;

  const feedbackQuery = `query RepFeedbacks($first: Int!, $skip: Int!) {
    repFeedbacks(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      agentId
      clientAddress
      score
      tag1
      tag2
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
      agentId
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
      agentId
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

  const uriUpdatesQuery = `query UriUpdates($first: Int!, $skip: Int!) {
    uriUpdates(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      newUri
      newUriJson
      blockNumber
      token {
        id
        ensName
        image
        uri
        description
        chatEndpoint
        agentName
        agentAccount
        a2aEndpoint
      }
    }
  }`;

  const validationRequestQuery = `query ValidationRequests($first: Int!, $skip: Int!) {
    validationRequests(first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      validatorAddress
      agentId
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
      agentId
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


  const transferItems = await fetchAllFromSubgraph('transfers', transfersQuery, 'transfers', { lastCheckpoint: lastTransfer });
  const tokenItems = await fetchAllFromSubgraph('tokens', tokensQuery, 'tokens', { lastCheckpoint: lastToken });
  

  const feedbackItems = await fetchAllFromSubgraph('repFeedbacks', feedbackQuery, 'repFeedbacks', { optional: true, lastCheckpoint: lastFeedback });
  const feedbackRevokedItems = await fetchAllFromSubgraph('repFeedbackRevokeds', feedbackRevokedQuery, 'repFeedbackRevokeds', { optional: true, lastCheckpoint: lastFeedback });
  const feedbackResponseItems = await fetchAllFromSubgraph('repResponseAppendeds', feedbackResponseQuery, 'repResponseAppendeds', { optional: true, lastCheckpoint: lastFeedback });
  const uriUpdateItems = await fetchAllFromSubgraph('uriUpdates', uriUpdatesQuery, 'uriUpdates', { optional: true, lastCheckpoint: lastUriUpdate });
  const validationRequestItems = await fetchAllFromSubgraph('validationRequests', validationRequestQuery, 'validationRequests', { optional: true, lastCheckpoint: lastValidation });
  const validationResponseItems = await fetchAllFromSubgraph('validationResponses', validationResponseQuery, 'validationResponses', { optional: true, lastCheckpoint: lastValidation });

  let transferCheckpointBlock = lastTransfer;
  const updateTransferCheckpointIfNeeded = async (blockNumber: bigint) => {
    if (blockNumber > transferCheckpointBlock) {
      transferCheckpointBlock = blockNumber;
      await dbInstance.prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(transferCheckpointKey, String(blockNumber));
    }
  };

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

  let tokenMetadataCheckpointBlock = lastTokenMetadata;
  const updateTokenMetadataCheckpointIfNeeded = async (blockNumber: bigint) => {
    if (blockNumber > tokenMetadataCheckpointBlock) {
      tokenMetadataCheckpointBlock = blockNumber;
      await dbInstance.prepare("INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(tokenMetadataCheckpointKey, String(blockNumber));
    }
  };

  // Upsert latest tokens metadata first (oldest-first by mintedAt)

  // Apply transfers newer than checkpoint
  const transfersOrdered = transferItems
    .filter((t) => Number(t?.blockNumber || 0) > Number(lastTransfer))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  const feedbackInsertBatch = createBatchWriter(dbInstance, 'rep_feedbacks');
  const feedbackRevokedBatch = createBatchWriter(dbInstance, 'rep_feedback_revoked');
  const feedbackResponseBatch = createBatchWriter(dbInstance, 'rep_feedback_responses');
  const validationRequestBatch = createBatchWriter(dbInstance, 'validation_requests');
  const validationResponseBatch = createBatchWriter(dbInstance, 'validation_responses');
  const tokenMetadataBatch = createBatchWriter(dbInstance, 'token_metadata');

  console.info("............  process transfers: ", transfersOrdered.length);
  for (let i = 0; i < transfersOrdered.length; i++) {
    const tr = transfersOrdered[i];
    
    const tokenId = BigInt(tr?.token?.id || '0');
    const toAddr = String(tr?.to?.id || '').toLowerCase();
    const blockNum = BigInt(tr?.blockNumber || 0);
    if (tokenId <= 0n || !toAddr) continue;
    const transferTokenUri = typeof tr?.token?.uri === 'string' ? tr.token.uri : null;
    await upsertFromTransfer(toAddr, tokenId, tr?.token as any, blockNum, transferTokenUri, chainId, dbInstance); 
    await updateTransferCheckpointIfNeeded(blockNum);
    if ((i + 1) % 25 === 0 || i === transfersOrdered.length - 1) {
      console.info(`............  transfer progress: ${i + 1}/${transfersOrdered.length} (block ${blockNum})`);
    }
  }

  const tokenMetadataQuery = `query TokenMetadata($first: Int!, $skip: Int!) {
    tokenMetadata_collection(first: $first, skip: $skip) {
      id
      key
      value
      indexedKey
    }
  }`;

  const shouldProcessTokenMetadata = transferCheckpointBlock > lastTokenMetadata;
  if (shouldProcessTokenMetadata) {
    const tokenMetadataItems = await fetchAllFromSubgraph('tokenMetadata', tokenMetadataQuery, 'tokenMetadata_collection', { optional: true });
    console.info("............  process token metadata entries: ", tokenMetadataItems.length);
    for (let i = 0; i < tokenMetadataItems.length; i++) {
      const meta = tokenMetadataItems[i];
      try {
        await upsertTokenMetadataFromGraph(meta, chainId, dbInstance, tokenMetadataBatch);
        if ((i + 1) % 100 === 0 || i === tokenMetadataItems.length - 1) {
          console.info(`............  token metadata progress: ${i + 1}/${tokenMetadataItems.length}`);
        }
      } catch (error) {
        console.error('❌ Error processing token metadata entry:', { id: meta?.id, error });
        throw error;
      }
    }
    await updateTokenMetadataCheckpointIfNeeded(transferCheckpointBlock);
  } else {
    console.info(`............  token metadata already synced to block ${lastTokenMetadata}; skipping`);
  }

  const feedbacksOrdered = feedbackItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastFeedback))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  console.info("............  process feedbacks: ", feedbacksOrdered.length);
  if (feedbacksOrdered.length > 0) {
    console.info('............  sample feedback ids:', feedbacksOrdered.slice(0, 3).map((fb) => `${fb?.id || 'unknown'}@${fb?.blockNumber || '0'}`).join(', '));
  }
  for (let i = 0; i < feedbacksOrdered.length; i++) {
    const fb = feedbacksOrdered[i];
    const blockNum = BigInt(fb?.blockNumber || 0);
    try {
      console.info("............  processing feedback upsert: ", fb?.id);
      console.info(`............  processing feedback upsert: agentId=${fb?.agentId}, id=${fb?.id}`);
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

  const feedbackRevokedOrdered = feedbackRevokedItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastFeedback))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

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

  const feedbackResponsesOrdered = feedbackResponseItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastFeedback))
  .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

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

  const validationRequestsOrdered = validationRequestItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastValidation))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  console.info("............  process validation requests: ", validationRequestsOrdered.length);
  if (validationRequestsOrdered.length > 0) {
    console.info('............  sample validation request ids:', validationRequestsOrdered.slice(0, 3).map((req) => `${req?.id || 'unknown'}@${req?.blockNumber || '0'}`).join(', '));
  }
  for (let i = 0; i < validationRequestsOrdered.length; i++) {
    const req = validationRequestsOrdered[i];
    const blockNum = BigInt(req?.blockNumber || 0);
    try {
      console.info(`............  processing validation request: agentId=${req?.agentId}, id=${req?.id}`);
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

  const validationResponsesOrdered = validationResponseItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastValidation))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

  console.info("............  process validation responses: ", validationResponsesOrdered.length);
  if (validationResponsesOrdered.length > 0) {
    console.info('............  sample validation response ids:', validationResponsesOrdered.slice(0, 3).map((resp) => `${resp?.id || 'unknown'}@${resp?.blockNumber || '0'}`).join(', '));
  }
  for (let i = 0; i < validationResponsesOrdered.length; i++) {
    const resp = validationResponsesOrdered[i];
    const blockNum = BigInt(resp?.blockNumber || 0);
    try {
      await upsertValidationResponseFromGraph(resp, chainId, dbInstance, validationResponseBatch);
      await updateValidationCheckpointIfNeeded(blockNum);
      if ((i + 1) % 25 === 0 || i === validationResponsesOrdered.length - 1) {
        console.info(`............  validation response progress: ${i + 1}/${validationResponsesOrdered.length} (block ${blockNum})`);
      }
    } catch (error) {
      console.error('❌ Error processing validation response:', { id: resp?.id, blockNum: String(blockNum), error });
      throw error;
    }
  }

  const uriUpdatesOrdered = uriUpdateItems
    .filter((item) => Number(item?.blockNumber || 0) > Number(lastUriUpdate))
    .slice()
    .sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber));

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

  await feedbackInsertBatch.flush();
  await feedbackRevokedBatch.flush();
  await feedbackResponseBatch.flush();
  await validationRequestBatch.flush();
  await validationResponseBatch.flush();
  await tokenMetadataBatch.flush();


  /*
  const tokenRecords = tokenItems
    .map((item) => {
      let mintedAt = 0n;
      try {
        mintedAt = BigInt(item?.mintedAt ?? item?.blockNumber ?? 0);
      } catch {}
      return { item, mintedAt };
    })
    .filter(({ mintedAt }) => mintedAt > lastToken)
    .sort((a, b) => {
      if (a.mintedAt === b.mintedAt) return 0;
      return a.mintedAt < b.mintedAt ? -1 : 1;
    });

  console.info("............  process tokens: ", tokenRecords.length);
  if (tokenRecords.length > 0) {
    console.info(
      '............  sample token ids:',
      tokenRecords
        .slice(0, 3)
        .map(({ item, mintedAt }) => `${item?.id || 'unknown'}@${mintedAt}`)
        .join(', '),
    );
  }

  for (let i = 0; i < tokenRecords.length; i++) {
    const { item, mintedAt } = tokenRecords[i];
    try {
      await upsertFromTokenGraph(item, chainId);
      await updateTokenCheckpointIfNeeded(mintedAt);
      if ((i + 1) % 25 === 0 || i === tokenRecords.length - 1) {
        console.info(`............  token progress: ${i + 1}/${tokenRecords.length} (mintedAt ${mintedAt})`);
      }
    } catch (error) {
      console.error('❌ Error processing token:', { id: item?.id, mintedAt: String(mintedAt), error });
      throw error;
    }
  }
  */

 

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
      console.info('Clearing database rows: agents, token_metadata, events');
      try { db.prepare('DELETE FROM token_metadata').run(); } catch {}
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
  const args: { agentId?: string } = {};
  const argv = process.argv.slice(2);
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--agentId' || arg === '--agent-id') {
      args.agentId = argv[i + 1];
      i++;
    }
  }
  
  return args;
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

(async () => {
  const args = parseArgs();
  
  // If agentId is specified, process only that agent
  if (args.agentId) {
    console.log(`🎯 Single agent mode: processing agentId ${args.agentId}`);
    await processSingleAgentId(args.agentId);
    process.exit(0);
  }
  
  // Normal indexing mode
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
  try {
    await backfill(erc8004EthSepoliaClient);
    await backfill(erc8004BaseSepoliaClient);
    
    /*
    //await backfillByIds(erc8004EthSepoliaClient)
    await backfill(erc8004BaseSepoliaClient);
    //await backfillByIds(erc8004BaseSepoliaClient)
    if (erc8004OpSepoliaClient) {
      await backfill(erc8004OpSepoliaClient);
      //await backfillByIds(erc8004OpSepoliaClient)
    }
      */
  } catch (e) {
    console.error('Initial GraphQL backfill failed:', e);
  }
  // Subscribe to on-chain events as a safety net (optional)
  //const unwatch = watch();

  // Poll GraphQL for new transfers beyond checkpoint
  //const interval = setInterval(() => { backfill().catch((e) => console.error('GraphQL backfill error', e)); }, Math.max(5000, GRAPHQL_POLL_MS));
  //console.log("Indexer running (GraphQL + watch). Press Ctrl+C to exit.");
  //process.on('SIGINT', () => { clearInterval(interval); unwatch(); process.exit(0); });
})();
