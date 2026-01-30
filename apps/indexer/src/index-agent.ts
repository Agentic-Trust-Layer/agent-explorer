/**
 * KB-first indexAgent: sync a single agent's subgraph data into GraphDB (Knowledge Base).
 *
 * NOTE: this intentionally does NOT touch D1 tables.
 */

import { BASE_SEPOLIA_GRAPHQL_URL, ETH_SEPOLIA_GRAPHQL_URL, GRAPHQL_API_KEY, OP_SEPOLIA_GRAPHQL_URL } from './env.js';
import { getGraphdbConfigFromEnv, uploadTurtleToRepository, updateGraphdb } from './graphdb/graphdb-http.js';

export interface IndexAgentConfig {
  // kept for backwards compat with server wiring; unused in KB-first mode
  db: any;
  chains: any[];
  triggerBackfill?: boolean;
}

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

function graphqlUrlForChainId(chainId: number): string {
  if (chainId === 11155111) return ETH_SEPOLIA_GRAPHQL_URL;
  if (chainId === 84532) return BASE_SEPOLIA_GRAPHQL_URL;
  if (chainId === 11155420) return OP_SEPOLIA_GRAPHQL_URL;
  return '';
}

function escapeTurtleString(value: string): string {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function iriEncodeSegment(value: string): string {
  return encodeURIComponent(String(value)).replace(/%/g, '_');
}

function rdfPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '@prefix eth: <https://agentictrust.io/ontology/eth#> .',
    '@prefix erc8004: <https://agentictrust.io/ontology/erc8004#> .',
    '@prefix erc8092: <https://agentictrust.io/ontology/erc8092#> .',
    '@prefix ens: <https://agentictrust.io/ontology/ens#> .',
    '',
  ].join('\n');
}

function agentIri(chainId: number, agentId: string): string {
  return `<https://www.agentictrust.io/id/agent/${chainId}/${iriEncodeSegment(agentId)}>`;
}

function agentIriFromAccountDid(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/agent/by-account-did/${iriEncodeSegment(didAccountValue)}>`;
}

function accountIri(chainId: number, address: string): string {
  return `<https://www.agentictrust.io/id/account/${chainId}/${iriEncodeSegment(String(address).toLowerCase())}>`;
}

function accountIdentifierIri(didAccountValue: string): string {
  return `<https://www.agentictrust.io/id/identifier/account/${iriEncodeSegment(didAccountValue)}>`;
}

function identity8004Iri(didIdentityValue: string): string {
  return `<https://www.agentictrust.io/id/8004-identity/${iriEncodeSegment(didIdentityValue)}>`;
}

function identity8004DescriptorIri(didIdentityValue: string): string {
  return `<https://www.agentictrust.io/id/8004-identity-descriptor/${iriEncodeSegment(didIdentityValue)}>`;
}

function identityIdentifier8004Iri(didIdentityValue: string): string {
  return `<https://www.agentictrust.io/id/identifier/8004/${iriEncodeSegment(didIdentityValue)}>`;
}

function subgraphIngestRecordIri(chainId: number, kind: string, entityId: string): string {
  return `<https://www.agentictrust.io/id/subgraph-ingest-record/${chainId}/${iriEncodeSegment(kind)}/${iriEncodeSegment(entityId)}>`;
}

function feedbackIri(chainId: number, agentId: string, client: string, feedbackIndex: number): string {
  return `<https://www.agentictrust.io/id/feedback/${chainId}/${iriEncodeSegment(agentId)}/${iriEncodeSegment(client.toLowerCase())}/${feedbackIndex}>`;
}

function validationResponseIri(chainId: number, id: string): string {
  return `<https://www.agentictrust.io/id/validation-response/${chainId}/${iriEncodeSegment(id)}>`;
}

function turtleJsonLiteral(json: string): string {
  return `"${escapeTurtleString(json)}"`;
}

function emitRawSubgraphRecord(opts: {
  chainId: number;
  kind: string;
  entityId: string;
  cursorValue: string;
  raw: unknown;
  txHash?: string | null;
  blockNumber?: number | string | null;
  timestamp?: number | string | null;
  recordsEntityIri: string;
}): string {
  const { chainId, kind, entityId, cursorValue, raw, txHash, blockNumber, timestamp, recordsEntityIri } = opts;
  const iri = subgraphIngestRecordIri(chainId, kind, entityId);
  const lines: string[] = [];
  lines.push(`${iri} a erc8004:SubgraphIngestRecord, prov:Entity ;`);
  lines.push(`  erc8004:subgraphChainId ${chainId} ;`);
  lines.push(`  erc8004:subgraphSource "thegraph" ;`);
  lines.push(`  erc8004:subgraphEntityKind "${escapeTurtleString(kind)}" ;`);
  lines.push(`  erc8004:subgraphEntityId "${escapeTurtleString(entityId)}" ;`);
  lines.push(`  erc8004:subgraphCursorValue "${escapeTurtleString(cursorValue)}" ;`);
  lines.push(`  erc8004:recordsEntity ${recordsEntityIri} ;`);
  try {
    const json = JSON.stringify(raw ?? null);
    lines.push(`  erc8004:subgraphRawJson ${turtleJsonLiteral(json)} ;`);
  } catch {}
  const tx = typeof txHash === 'string' ? txHash.trim() : '';
  if (tx) lines.push(`  erc8004:subgraphTxHash "${escapeTurtleString(tx)}" ;`);
  const bn = blockNumber != null ? Number(blockNumber) : NaN;
  if (Number.isFinite(bn) && bn > 0) lines.push(`  erc8004:subgraphBlockNumber ${Math.trunc(bn)} ;`);
  const ts = timestamp != null ? Number(timestamp) : NaN;
  if (Number.isFinite(ts) && ts > 0) lines.push(`  erc8004:subgraphTimestamp ${Math.trunc(ts)} ;`);
  const last = lines[lines.length - 1];
  lines[lines.length - 1] = last.replace(/ ;$/, ' .');
  return lines.join('\n') + '\n';
}

function normalizeHex(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s0 = value.trim();
  if (!s0) return null;
  const match = s0.match(/0x[0-9a-fA-F]{40}/);
  const s = (match ? match[0] : s0).trim().toLowerCase();
  if (!s.startsWith('0x')) return null;
  return /^0x[0-9a-f]{40}$/.test(s) ? s : null;
}

function pickAgentAccountFromMetadataRows(rows: any[]): string | null {
  if (!Array.isArray(rows)) return null;
  for (const r of rows) {
    const key = typeof r?.key === 'string' ? r.key.trim().toLowerCase() : '';
    if (!key) continue;
    if (key === 'agentaccount' || key === 'agent account' || key === 'agent account with address' || key === 'account') {
      const v = typeof r?.value === 'string' ? r.value.trim() : '';
      const addr = normalizeHex(v);
      if (addr) return addr;
    }
  }
  return null;
}

async function fetchJson(graphqlUrl: string, body: { query: string; variables: Record<string, any> }): Promise<any> {
  const endpoint = (graphqlUrl || '').replace(/\/graphql\/?$/i, '');
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json',
  };
  if (GRAPHQL_API_KEY) headers['Authorization'] = `Bearer ${GRAPHQL_API_KEY}`;
  const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) } as any);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GraphQL ${res.status}: ${text || res.statusText}`);
  }
  return await res.json();
}

async function fetchAllPages(graphqlUrl: string, query: string, rootField: string, variables: Record<string, any>): Promise<any[]> {
  const out: any[] = [];
  const pageSize = 200;
  for (let skip = 0; skip < 50_000; skip += pageSize) {
    const resp = await fetchJson(graphqlUrl, { query, variables: { ...variables, first: pageSize, skip } });
    const errs = resp?.errors;
    if (Array.isArray(errs) && errs.length) {
      throw new Error(`Subgraph query error: ${String(errs[0]?.message || errs[0] || 'unknown')}`);
    }
    const items = resp?.data?.[rootField];
    const arr = Array.isArray(items) ? items : [];
    out.push(...arr);
    if (arr.length < pageSize) break;
  }
  return out;
}

async function syncSingleAgentToGraphdb(chainId: number, agentId: string): Promise<{ bytes: number; agentIri: string }> {
  const graphqlUrl = graphqlUrlForChainId(chainId);
  if (!graphqlUrl) throw new Error(`No subgraph configured for chainId ${chainId}`);

  const AGENT_BY_ID_QUERY = `query AgentById($id: String!, $first: Int!, $skip: Int!) {
    agents(where: { id: $id }, first: $first, skip: $skip) {
      id
      mintedAt
      name
      agentWallet
      owner { id }
    }
  }`;

  const METADATA_BY_PREFIX_QUERY = `query AgentMetadataByPrefix($prefix: String!, $first: Int!, $skip: Int!) {
    agentMetadata_collection(where: { id_starts_with: $prefix }, first: $first, skip: $skip, orderBy: setAt, orderDirection: asc) {
      id
      key
      value
    }
  }`;

  const FEEDBACKS_FOR_AGENT_QUERY = `query RepFeedbacksForAgent($agentId: String!, $first: Int!, $skip: Int!) {
    repFeedbacks(where: { agent: $agentId }, first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      agent { id }
      clientAddress
      feedbackIndex
      feedbackJson
      txHash
      blockNumber
      timestamp
    }
  }`;

  const VALIDATION_RESPONSES_FOR_AGENT_QUERY = `query ValidationResponsesForAgent($agentId: String!, $first: Int!, $skip: Int!) {
    validationResponses(where: { agent: $agentId }, first: $first, skip: $skip, orderBy: blockNumber, orderDirection: asc) {
      id
      agent { id }
      responseJson
      txHash
      blockNumber
      timestamp
    }
  }`;

  const agents = await fetchAllPages(graphqlUrl, AGENT_BY_ID_QUERY, 'agents', { id: agentId });
  const agentRow = agents[0] ?? null;
  if (!agentRow) throw new Error(`Agent ${agentId} not found in subgraph for chainId ${chainId}`);

  // metadata: try common id patterns (agentId-*, agentId:*)
  const mdDash = await fetchAllPages(graphqlUrl, METADATA_BY_PREFIX_QUERY, 'agentMetadata_collection', { prefix: `${agentId}-` }).catch(
    () => [],
  );
  const mdColon = mdDash.length
    ? []
    : await fetchAllPages(graphqlUrl, METADATA_BY_PREFIX_QUERY, 'agentMetadata_collection', { prefix: `${agentId}:` }).catch(() => []);
  const agentMetadatas = [...mdDash, ...mdColon];
  const metaAgentAccount = pickAgentAccountFromMetadataRows(agentMetadatas);

  const owner = normalizeHex(agentRow?.owner?.id ?? '') ?? '0x0000000000000000000000000000000000000000';
  const wallet = normalizeHex(agentRow?.agentWallet ?? '') ?? owner;
  const mintedAtRaw = agentRow?.mintedAt ?? 0;
  let mintedAt = 0n;
  try {
    mintedAt = BigInt(mintedAtRaw);
  } catch {
    mintedAt = 0n;
  }

  const didIdentity = `did:8004:${chainId}:${agentId}`;
  const didAccountSmart = metaAgentAccount ? `did:ethr:${chainId}:${metaAgentAccount}` : null;
  const uaid = `uaid:${didAccountSmart ?? didIdentity}`;

  const agentNodeIri = didAccountSmart ? agentIriFromAccountDid(didAccountSmart) : agentIri(chainId, agentId);
  const agentType = didAccountSmart ? 'erc8004:SmartAgent' : 'erc8004:AIAgent8004';

  const lines: string[] = [rdfPrefixes()];

  // Agent node
  lines.push(`${agentNodeIri} a core:AIAgent, ${agentType}, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);
  const name = typeof agentRow?.name === 'string' ? agentRow.name.trim() : '';
  if (name) lines.push(`  core:agentName "${escapeTurtleString(name)}" ;`);
  lines.push(`  core:uaid "${escapeTurtleString(uaid)}" ;`);
  const ownerAcct = accountIri(chainId, owner);
  const walletAcct = accountIri(chainId, wallet);
  lines.push(`  erc8004:agentOwnerAccount ${ownerAcct} ;`);
  lines.push(`  erc8004:agentWalletAccount ${walletAcct} ;`);
  if (!didAccountSmart) lines.push(`  erc8004:agentOwnerEOAAccount ${ownerAcct} ;`);
  if (didAccountSmart) lines.push(`  erc8004:hasAgentAccount ${accountIri(chainId, metaAgentAccount!)} ;`);
  lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
  lines.push('');

  // Identity 8004
  const ident8004 = identity8004Iri(didIdentity);
  const ident8004Desc = identity8004DescriptorIri(didIdentity);
  const did8004Iri = identityIdentifier8004Iri(didIdentity);
  lines.push(`${agentNodeIri} core:hasIdentity ${ident8004} .`);
  lines.push('');
  lines.push(`${ident8004} a erc8004:AgentIdentity8004, core:AgentIdentity, prov:Entity ;`);
  lines.push(`  core:identityOf ${agentNodeIri} ;`);
  lines.push(`  core:hasIdentifier ${did8004Iri} ;`);
  lines.push(`  core:hasDescriptor ${ident8004Desc} ;`);
  lines.push(`  core:identityRegistry <https://www.agentictrust.io/id/8004-identity-registry/${chainId}> ;`);
  // identity-scoped accounts (EOA forms; smart-account resolution is handled elsewhere)
  lines.push(`  erc8004:hasOwnerAccount ${ownerAcct} ;`);
  lines.push(`  erc8004:hasWalletAccount ${walletAcct} .`);
  lines.push('');
  lines.push(`${did8004Iri} a erc8004:IdentityIdentifier8004, core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
  lines.push(`  core:protocolIdentifier "${escapeTurtleString(didIdentity)}" ;`);
  lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/8004> .`);
  lines.push('');
  lines.push(`${ident8004Desc} a erc8004:IdentityDescriptor8004, core:AgentIdentityDescriptor, core:Descriptor, prov:Entity .`);
  lines.push('');

  // Accounts (owner + wallet) + their did:ethr identifiers
  for (const addr of new Set([owner, wallet])) {
    const aIri = accountIri(chainId, addr);
    const did = `did:ethr:${chainId}:${addr}`;
    const didIri = accountIdentifierIri(did);
    lines.push(`${aIri} a eth:Account, prov:Entity ;`);
    lines.push(`  eth:accountChainId ${chainId} ;`);
    lines.push(`  eth:accountAddress "${escapeTurtleString(addr)}" ;`);
    lines.push(`  eth:hasAccountIdentifier ${didIri} .`);
    lines.push('');
    lines.push(`${didIri} a core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
    lines.push(`  core:protocolIdentifier "${escapeTurtleString(did)}" ;`);
    lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/ethr> .`);
    lines.push('');
  }

  // Smart account node (minimal)
  if (didAccountSmart) {
    const sa = accountIri(chainId, metaAgentAccount!);
    const didIri = accountIdentifierIri(didAccountSmart);
    lines.push(`${sa} a erc8004:AgentAccount, eth:Account, prov:Entity ;`);
    lines.push(`  eth:accountChainId ${chainId} ;`);
    lines.push(`  eth:accountAddress "${escapeTurtleString(metaAgentAccount!)}" ;`);
    lines.push(`  eth:hasAccountIdentifier ${didIri} .`);
    lines.push('');
    lines.push(`${didIri} a core:UniversalIdentifier, core:Identifier, core:DID, prov:Entity ;`);
    lines.push(`  core:protocolIdentifier "${escapeTurtleString(didAccountSmart)}" ;`);
    lines.push(`  core:didMethod <https://www.agentictrust.io/id/did-method/ethr> .`);
    lines.push('');
  }

  // Raw ingest record for agent
  lines.push(
    emitRawSubgraphRecord({
      chainId,
      kind: 'agents',
      entityId: agentId,
      cursorValue: mintedAt.toString(),
      raw: agentRow,
      recordsEntityIri: agentNodeIri,
    }),
  );
  lines.push('');

  const feedbacks = await fetchAllPages(graphqlUrl, FEEDBACKS_FOR_AGENT_QUERY, 'repFeedbacks', { agentId });
  for (const fb of feedbacks) {
    const id = String(fb?.id ?? '').trim();
    const client = String(fb?.clientAddress ?? '').trim();
    const feedbackIndex = Number(fb?.feedbackIndex ?? NaN);
    if (!id || !client || !Number.isFinite(feedbackIndex)) continue;
    const fIri = feedbackIri(chainId, agentId, client, feedbackIndex);
    lines.push(`${fIri} a erc8004:Feedback, prov:Entity ;`);
    lines.push(`  core:agentId "${escapeTurtleString(agentId)}" ;`);
    lines.push(`  core:json ${turtleJsonLiteral(String(fb?.feedbackJson ?? ''))} .`);
    lines.push('');
    lines.push(`${agentNodeIri} core:hasReputationAssertion ${fIri} .`);
    lines.push('');
    lines.push(
      emitRawSubgraphRecord({
        chainId,
        kind: 'feedbacks',
        entityId: id,
        cursorValue: String(fb?.blockNumber ?? ''),
        raw: fb,
        txHash: typeof fb?.txHash === 'string' ? fb.txHash : null,
        blockNumber: fb?.blockNumber ?? null,
        timestamp: fb?.timestamp ?? null,
        recordsEntityIri: fIri,
      }),
    );
    lines.push('');
  }

  const validationResponses = await fetchAllPages(graphqlUrl, VALIDATION_RESPONSES_FOR_AGENT_QUERY, 'validationResponses', { agentId });
  for (const vr of validationResponses) {
    const id = String(vr?.id ?? '').trim();
    if (!id) continue;
    const iri = validationResponseIri(chainId, id);
    lines.push(`${iri} a erc8004:ValidationResponse, prov:Entity ;`);
    lines.push(`  core:agentId "${escapeTurtleString(agentId)}" ;`);
    lines.push(`  core:json ${turtleJsonLiteral(String(vr?.responseJson ?? ''))} .`);
    lines.push('');
    lines.push(`${agentNodeIri} core:hasVerificationAssertion ${iri} .`);
    lines.push('');
    lines.push(
      emitRawSubgraphRecord({
        chainId,
        kind: 'validation-responses',
        entityId: id,
        cursorValue: String(vr?.blockNumber ?? ''),
        raw: vr,
        txHash: typeof vr?.txHash === 'string' ? vr.txHash : null,
        blockNumber: vr?.blockNumber ?? null,
        timestamp: vr?.timestamp ?? null,
        recordsEntityIri: iri,
      }),
    );
    lines.push('');
  }

  const turtle = lines.join('\n');

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const context = chainContext(chainId);
  const { bytes } = await uploadTurtleToRepository(baseUrl, repository, auth, { turtle, context });

  // Materialize counts for this agent only (fast path).
  const countUpdate = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${context}>
DELETE { ${agentNodeIri} erc8004:feedbackAssertionCount8004 ?oFb }
WHERE  { OPTIONAL { ${agentNodeIri} erc8004:feedbackAssertionCount8004 ?oFb } } ;
WITH <${context}>
INSERT { ${agentNodeIri} erc8004:feedbackAssertionCount8004 ?fbCnt }
WHERE  { SELECT (COUNT(?fb) AS ?fbCnt) WHERE { OPTIONAL { ${agentNodeIri} core:hasReputationAssertion ?fb . } } } ;
WITH <${context}>
DELETE { ${agentNodeIri} erc8004:validationAssertionCount8004 ?oVr }
WHERE  { OPTIONAL { ${agentNodeIri} erc8004:validationAssertionCount8004 ?oVr } } ;
WITH <${context}>
INSERT { ${agentNodeIri} erc8004:validationAssertionCount8004 ?vrCnt }
WHERE  { SELECT (COUNT(?vr) AS ?vrCnt) WHERE { OPTIONAL { ${agentNodeIri} core:hasVerificationAssertion ?vr . } } } ;
`;
  await updateGraphdb(baseUrl, repository, auth, countUpdate);

  return { bytes, agentIri: agentNodeIri };
}

export async function createIndexAgentResolver(_config: IndexAgentConfig) {
  return async (args: { agentId: string; chainId?: number }) => {
    try {
      const agentId = typeof args?.agentId === 'string' ? args.agentId.trim() : '';
      const chainId = typeof args?.chainId === 'number' ? Math.trunc(args.chainId) : undefined;
      if (!agentId) throw new Error('agentId is required');
      if (chainId !== undefined && (!Number.isFinite(chainId) || chainId <= 0)) throw new Error('invalid chainId');

      const targets = chainId !== undefined ? [chainId] : [11155111, 84532, 11155420];
      const processedChains: string[] = [];
      const errors: string[] = [];
      for (const cid of targets) {
        try {
          await syncSingleAgentToGraphdb(cid, agentId);
          processedChains.push(String(cid));
        } catch (e: any) {
          errors.push(`${cid}: ${String(e?.message || e || '')}`);
        }
      }

      return {
        success: processedChains.length > 0,
        message: processedChains.length
          ? `Synced agent ${agentId} into KB for chain(s): ${processedChains.join(', ')}${errors.length ? `. Errors: ${errors.join(' | ')}` : ''}`
          : `Failed to sync agent ${agentId} into KB. Errors: ${errors.join(' | ')}`,
        processedChains,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error indexing agent: ${error?.message || error}`,
        processedChains: [],
      };
    }
  };
}

