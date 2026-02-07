import './env-load.js';
import {
  SUBGRAPH_ENDPOINTS,
  fetchAllFromSubgraph,
  fetchAllFromSubgraphByIdCursor,
  AGENTS_QUERY,
  AGENTS_QUERY_BY_MINTEDAT_CURSOR,
  fetchAllFromSubgraphByMintedAtCursor,
  fetchAgentMintedAtById,
  AGENT_METADATA_COLLECTION_QUERY,
  AGENT_METADATA_COLLECTION_QUERY_BY_ID_CURSOR,
  FEEDBACKS_QUERY,
  FEEDBACK_REVOCATIONS_QUERY,
  FEEDBACK_RESPONSES_QUERY,
  VALIDATION_REQUESTS_QUERY,
  VALIDATION_RESPONSES_QUERY,
  ASSOCIATIONS_QUERY,
  ASSOCIATION_REVOCATIONS_QUERY,
} from './subgraph-client.js';
import { ingestSubgraphTurtleToGraphdb } from './graphdb-ingest.js';
import { getCheckpoint, setCheckpoint } from './graphdb/checkpoints.js';
import { emitAgentsTurtle } from './rdf/emit-agents.js';
import { emitFeedbacksTurtle } from './rdf/emit-feedbacks.js';
import { emitValidationRequestsTurtle, emitValidationResponsesTurtle } from './rdf/emit-validations.js';
import { emitAssociationsTurtle, emitAssociationRevocationsTurtle } from './rdf/emit-associations.js';
import { syncAgentCardsForChain } from './a2a/agent-card-sync.js';
import { syncAccountTypesForChain } from './account-types/sync-account-types.js';
import { getMaxAgentId8004, getMaxDid8004AgentId, listAgentIriByDidIdentity } from './graphdb/agents.js';
import { ingestOasfToGraphdb } from './oasf/oasf-ingest.js';
import { ingestOntologiesToGraphdb } from './ontology/ontology-ingest.js';
import { runTrustIndexForChains } from './trust-index/trust-index.js';
import { materializeRegistrationServicesForChain } from './registration/materialize-services.js';
import { materializeAssertionSummariesForChain } from './trust-summaries/materialize-assertion-summaries.js';
import { syncTrustLedgerToGraphdbForChain } from './trust-ledger/sync-trust-ledger.js';

type SyncCommand =
  | 'agents'
  | 'feedbacks'
  | 'feedback-revocations'
  | 'feedback-responses'
  | 'validations'
  | 'validation-requests'
  | 'validation-responses'
  | 'assertion-summaries'
  | 'associations'
  | 'association-revocations'
  | 'agent-cards'
  | 'oasf'
  | 'ontologies'
  | 'trust-index'
  | 'trust-ledger'
  | 'account-types'
  | 'materialize-services'
  | 'watch'
  | 'all';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncAgents(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching agents from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  // If we're resetting the GraphDB context, we MUST also ignore prior checkpoints,
  // otherwise we'll clear the data and then filter out all rows as "already processed".
  let lastCursor = 0n;
  if (!resetContext) {
    const last = (await getCheckpoint(endpoint.chainId, 'agents')) ?? '0';
    try {
      lastCursor = BigInt(last);
    } catch {
      lastCursor = 0n;
    }
  }

  // Agents query is mint-ordered; many subgraphs don't support mintedAt_gt filters reliably, so we filter client-side like indexer.
  // Some chains/subgraphs don't expose "agents" at all; skip cleanly in that case.
  let items: any[] = [];
  let cursorModeUsed = false;
  const limitArg = process.argv.find((a) => a.startsWith('--limit=')) ?? '';
  const parsedLimit = limitArg ? Number(limitArg.split('=')[1]) : NaN;
  const maxAgentsPerRun =
    Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.trunc(parsedLimit) : 5000; // keep runs bounded; repeated runs/watch will catch up
  const uploadChunkArg = process.argv.find((a) => a.startsWith('--uploadChunkBytes=')) ?? '';
  const parsedUploadChunk = uploadChunkArg ? Number(uploadChunkArg.split('=')[1]) : NaN;
  const uploadChunkBytes = Number.isFinite(parsedUploadChunk) && parsedUploadChunk > 0 ? Math.trunc(parsedUploadChunk) : undefined;
  try {
    // Prefer cursor pagination (bypasses skip<=5000 limits).
    try {
      const rawCursor = resetContext ? null : await getCheckpoint(endpoint.chainId, 'agents-mintedat-cursor');
      let startAfterMintedAt = '0';
      let startAfterId = '0';
      if (rawCursor && rawCursor.trim()) {
        try {
          const parsed = JSON.parse(rawCursor);
          const m = typeof parsed?.mintedAt === 'string' ? parsed.mintedAt.trim() : '';
          const i = typeof parsed?.id === 'string' ? parsed.id.trim() : '';
          if (/^\d+$/.test(m)) startAfterMintedAt = m;
          if (i) startAfterId = i;
        } catch {}
      } else if (!resetContext) {
        // Seed the new cursor key from what's already in GraphDB so we don't replay from 0.
        const maxId = await getMaxAgentId8004(endpoint.chainId).catch(() => null);
        if (maxId != null && maxId > 0) {
          const seededId = String(maxId);
          const seededMintedAt = await fetchAgentMintedAtById(endpoint.url, seededId).catch(() => null);
          if (seededMintedAt) {
            startAfterMintedAt = seededMintedAt;
            startAfterId = seededId;
            console.info('[sync] seeded agents-mintedat-cursor from GraphDB', {
              chainId: endpoint.chainId,
              startAfterMintedAt,
              startAfterId,
            });
          } else {
            console.warn('[sync] could not seed agents-mintedat-cursor (subgraph mintedAt missing for id)', {
              chainId: endpoint.chainId,
              seededId,
            });
          }
        }
      }

      // If we have a cursor but it's clearly behind what's already present in GraphDB (common after switching checkpoint keys),
      // jump forward to the GraphDB max derived from did:8004:<chainId>:<agentId>.
      if (!resetContext) {
        const maxDidId = await getMaxDid8004AgentId(endpoint.chainId).catch(() => null);
        const curIdNum = /^\d+$/.test(startAfterId) ? Number(startAfterId) : 0;
        if (maxDidId != null && maxDidId > 0 && Number.isFinite(curIdNum) && maxDidId > curIdNum + 100) {
          const seededId = String(maxDidId);
          const seededMintedAt = await fetchAgentMintedAtById(endpoint.url, seededId).catch(() => null);
          if (seededMintedAt) {
            startAfterMintedAt = seededMintedAt;
            startAfterId = seededId;
            console.info('[sync] bumped agents-mintedat-cursor to GraphDB max did:8004 agent id', {
              chainId: endpoint.chainId,
              startAfterMintedAt,
              startAfterId,
            });
          } else {
            console.warn('[sync] could not bump agents-mintedat-cursor (subgraph mintedAt missing for id)', {
              chainId: endpoint.chainId,
              seededId,
            });
          }
        }
      }

      items = await fetchAllFromSubgraphByMintedAtCursor(endpoint.url, AGENTS_QUERY_BY_MINTEDAT_CURSOR, 'agents', {
        optional: false,
        first: Math.min(500, maxAgentsPerRun),
        startAfterMintedAt,
        startAfterId,
        maxItems: maxAgentsPerRun,
      });
      cursorModeUsed = true;
    } catch (e: any) {
      const msg = String(e?.message || e || '');
      console.warn(`[sync] agents cursor pagination failed; falling back to skip pagination: ${msg}`);
      items = await fetchAllFromSubgraph(endpoint.url, AGENTS_QUERY, 'agents', { optional: false });
    }
  } catch (e: any) {
    const msg = String(e?.message || e || '');
    if (msg.includes('Subgraph schema mismatch') && msg.includes('no field "agents"')) {
      console.warn(`[sync] skipping agents for ${endpoint.name}: subgraph has no "agents" field`);
      return;
    }
    throw e;
  }
  console.info(`[sync] fetched ${items.length} agents from ${endpoint.name}`, {
    cursorModeUsed,
    maxAgentsPerRun,
  });

  // Attach on-chain metadata KV rows if the subgraph exposes them (optional).
  // This is required for SmartAgent detection via "AGENT ACCOUNT"/agentAccount metadata.
  // Always-on (best effort): if the subgraph doesn't expose agentMetadata_collection, we just skip quietly.
  const skipMetadata = false;
  const inferAgentIdFromMetadataId = (id: unknown): string => {
    const s = String(id ?? '').trim();
    if (!s) return '';
    // Most common pattern is "agentId-key" or "agentId:key"
    const parts = s.split(/[-:]/).filter(Boolean);
    const first = parts[0] ? parts[0].trim() : '';
    if (/^\d+$/.test(first)) return first;
    // fallback: find first integer-looking segment
    const match = s.match(/\b\d+\b/);
    return match ? match[0] : '';
  };

  if (!skipMetadata) {
    const metas = await fetchAllFromSubgraph(endpoint.url, AGENT_METADATA_COLLECTION_QUERY, 'agentMetadata_collection', {
      optional: true,
      maxSkip: 50_000,
    });
    // If we hit skip caps, retry using cursor pagination (best effort).
    let metasCursor: any[] = [];
    try {
      metasCursor = await fetchAllFromSubgraphByIdCursor(
        endpoint.url,
        AGENT_METADATA_COLLECTION_QUERY_BY_ID_CURSOR,
        'agentMetadata_collection',
        {
          optional: true,
          first: 500,
          maxItems: 250_000,
        },
      );
    } catch (e: any) {
      const msg = String(e?.message || e || '');
      console.warn(`[sync] agentMetadata_collection cursor pagination unsupported/failed; keeping skip-based results: ${msg}`);
      metasCursor = [];
    }
    const metasToUse = metasCursor.length ? metasCursor : metas;
    if (metasToUse.length) {
      const byAgent = new Map<string, any[]>();
      for (const m of metasToUse) {
        const aid = inferAgentIdFromMetadataId(m?.id);
        if (!aid) continue;
        const arr = byAgent.get(aid) ?? [];
        arr.push(m);
        byAgent.set(aid, arr);
      }
      for (const it of items) {
        const aid = String(it?.id || '').trim();
        if (!aid) continue;
        const arr = byAgent.get(aid);
        if (arr && arr.length) (it as any).agentMetadatas = arr;
      }
      console.info(`[sync] attached ${metasToUse.length} agentMetadatas rows to agents`);
    }
  } else {
    console.info('[sync] skipping agentMetadata_collection attachment');
  }

  // If we used id-cursor pagination, the subgraph already returned only new ids.
  // In that case, avoid mintedAt checkpoint filtering (it can drop valid rows when mintedAt is missing/0).
  const effectiveLastCursor = cursorModeUsed ? -1n : lastCursor;
  const { turtle, maxCursor } = emitAgentsTurtle(endpoint.chainId, items, 'mintedAt', effectiveLastCursor);
  try {
    const withMeta = items.filter((it: any) => Array.isArray((it as any)?.agentMetadatas) && (it as any).agentMetadatas.length > 0).length;
    console.info('[sync] agent metadata attachment summary', {
      chainId: endpoint.chainId,
      agents: items.length,
      agentsWithAgentMetadatas: withMeta,
    });
  } catch {}
  if (turtle.trim()) {
    console.info('[sync] ingest starting', { chainId: endpoint.chainId, turtleBytes: turtle.length });
    await ingestSubgraphTurtleToGraphdb({
      chainId: endpoint.chainId,
      section: 'agents',
      turtle,
      resetContext,
      upload: {
        // Uploads are always sequential (GraphDB stays queryable during sync).
        chunkBytes: uploadChunkBytes,
      },
    });
    console.info('[sync] ingest complete, waiting before checkpoint', { chainId: endpoint.chainId });
    
    // Give GraphDB a moment to finish processing the uploads before updating checkpoint
    // This prevents checkpoint updates from timing out when GraphDB is still indexing
    await sleep(2000); // 2 second delay
    console.info('[sync] delay complete, updating checkpoints', { chainId: endpoint.chainId, cursorModeUsed });
    
    if (!cursorModeUsed && maxCursor > lastCursor) {
      console.info('[sync] updating agents checkpoint', { chainId: endpoint.chainId, maxCursor: maxCursor.toString() });
      try {
        await setCheckpoint(endpoint.chainId, 'agents', maxCursor.toString());
        console.info('[sync] agents checkpoint updated', { chainId: endpoint.chainId });
      } catch (e: any) {
        console.warn('[sync] checkpoint update failed (non-fatal)', {
          chainId: endpoint.chainId,
          section: 'agents',
          error: String(e?.message || e || ''),
        });
      }
    }
    if (cursorModeUsed && items.length) {
      const last = items[items.length - 1];
      const lastId = typeof last?.id === 'string' ? last.id.trim() : '';
      const lastMintedAt = typeof last?.mintedAt === 'string' ? last.mintedAt.trim() : '';
      if (lastId && /^\d+$/.test(lastMintedAt)) {
        console.info('[sync] updating agents-mintedat-cursor checkpoint', { chainId: endpoint.chainId, lastMintedAt, lastId });
        try {
          await setCheckpoint(endpoint.chainId, 'agents-mintedat-cursor', JSON.stringify({ mintedAt: lastMintedAt, id: lastId }));
          console.info('[sync] agents-mintedat-cursor checkpoint updated', { chainId: endpoint.chainId, lastMintedAt, lastId });
        } catch (e: any) {
          console.warn('[sync] checkpoint update failed (non-fatal)', {
            chainId: endpoint.chainId,
            section: 'agents-mintedat-cursor',
            error: String(e?.message || e || ''),
          });
        }
      } else {
        console.warn('[sync] no usable cursor for agents-mintedat-cursor checkpoint', { chainId: endpoint.chainId, lastItem: last });
      }
    }
    console.info('[sync] agents sync complete', {
      chainId: endpoint.chainId,
      emitted: true,
      cursorModeUsed,
      fetched: items.length,
    });
  } else {
    console.info('[sync] agents sync complete', {
      chainId: endpoint.chainId,
      emitted: false,
      cursorModeUsed,
      fetched: items.length,
    });
  }
}

async function syncFeedbacks(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching feedbacks from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  let lastBlock = 0n;
  if (!resetContext) {
    const last = (await getCheckpoint(endpoint.chainId, 'feedbacks')) ?? '0';
    try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  }

  const agentIriByDidIdentity = await listAgentIriByDidIdentity(endpoint.chainId).catch(() => new Map<string, string>());
  const items = await fetchAllFromSubgraph(endpoint.url, FEEDBACKS_QUERY, 'repFeedbacks', { optional: true });
  console.info(`[sync] fetched ${items.length} feedbacks from ${endpoint.name}`);
  const { turtle, maxBlock } = emitFeedbacksTurtle(endpoint.chainId, items, lastBlock, agentIriByDidIdentity);
  // Only ingest if we actually emitted at least 1 new record (avoid uploading prefix-only TTL).
  if (maxBlock > lastBlock) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'feedbacks', turtle, resetContext });
    await setCheckpoint(endpoint.chainId, 'feedbacks', maxBlock.toString());
  }
}

async function syncFeedbackRevocations(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching feedback revocations from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  const last = (await getCheckpoint(endpoint.chainId, 'feedback-revocations')) ?? '0';
  let lastBlock = 0n;
  try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  const items = await fetchAllFromSubgraph(endpoint.url, FEEDBACK_REVOCATIONS_QUERY, 'repFeedbackRevokeds', { optional: true });
  console.info(`[sync] fetched ${items.length} feedback revocations from ${endpoint.name}`);
  // For now, store only raw records (typed feedback revocation class not in current TTL)
  // TODO: add an ERC-8004 revocation class if needed.
  // Keep checkpoint update based on max block in returned items.
  let max = lastBlock;
  for (const it of items) {
    try {
      const bn = BigInt(it?.blockNumber ?? 0);
      if (bn > max) max = bn;
    } catch {}
  }
  if (max > lastBlock) await setCheckpoint(endpoint.chainId, 'feedback-revocations', max.toString());
}

async function syncFeedbackResponses(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching feedback responses from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  const last = (await getCheckpoint(endpoint.chainId, 'feedback-responses')) ?? '0';
  let lastBlock = 0n;
  try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  const items = await fetchAllFromSubgraph(endpoint.url, FEEDBACK_RESPONSES_QUERY, 'repResponseAppendeds', { optional: true });
  console.info(`[sync] fetched ${items.length} feedback responses from ${endpoint.name}`);
  let max = lastBlock;
  for (const it of items) {
    try {
      const bn = BigInt(it?.blockNumber ?? 0);
      if (bn > max) max = bn;
    } catch {}
  }
  if (max > lastBlock) await setCheckpoint(endpoint.chainId, 'feedback-responses', max.toString());
}

async function syncValidationRequests(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching validation requests from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  let lastBlock = 0n;
  if (!resetContext) {
    const last = (await getCheckpoint(endpoint.chainId, 'validation-requests')) ?? '0';
    try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  }
  const items = await fetchAllFromSubgraph(endpoint.url, VALIDATION_REQUESTS_QUERY, 'validationRequests', { optional: true });
  console.info(`[sync] fetched ${items.length} validation requests from ${endpoint.name}`);
  const { turtle, maxBlock } = emitValidationRequestsTurtle(endpoint.chainId, items, lastBlock);
  // Only ingest if we actually emitted at least 1 new record (avoid uploading prefix-only TTL).
  if (maxBlock > lastBlock) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'validation-requests', turtle, resetContext });
    await setCheckpoint(endpoint.chainId, 'validation-requests', maxBlock.toString());
  }
}

async function syncValidationResponses(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching validation responses from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  let lastBlock = 0n;
  if (!resetContext) {
    const last = (await getCheckpoint(endpoint.chainId, 'validation-responses')) ?? '0';
    try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  }
  const agentIriByDidIdentity = await listAgentIriByDidIdentity(endpoint.chainId).catch(() => new Map<string, string>());
  const items = await fetchAllFromSubgraph(endpoint.url, VALIDATION_RESPONSES_QUERY, 'validationResponses', { optional: true });
  console.info(`[sync] fetched ${items.length} validation responses from ${endpoint.name}`);
  const { turtle, maxBlock } = emitValidationResponsesTurtle(endpoint.chainId, items, lastBlock, agentIriByDidIdentity);
  if (maxBlock > lastBlock) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'validation-responses', turtle, resetContext });
    await setCheckpoint(endpoint.chainId, 'validation-responses', maxBlock.toString());
  }
}

async function syncAssociations(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching associations from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  let lastBlock = 0n;
  if (!resetContext) {
    const last = (await getCheckpoint(endpoint.chainId, 'associations')) ?? '0';
    try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  }
  const items = await fetchAllFromSubgraph(endpoint.url, ASSOCIATIONS_QUERY, 'associations', { optional: true });
  console.info(`[sync] fetched ${items.length} associations from ${endpoint.name}`);
  const { turtle, maxBlock } = emitAssociationsTurtle(endpoint.chainId, items, lastBlock);
  if (maxBlock > lastBlock) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'associations', turtle, resetContext });
    await setCheckpoint(endpoint.chainId, 'associations', maxBlock.toString());
  }
}

async function syncAssociationRevocations(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching association revocations from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  let lastBlock = 0n;
  if (!resetContext) {
    const last = (await getCheckpoint(endpoint.chainId, 'association-revocations')) ?? '0';
    try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  }
  const items = await fetchAllFromSubgraph(endpoint.url, ASSOCIATION_REVOCATIONS_QUERY, 'associationRevocations', { optional: true });
  console.info(`[sync] fetched ${items.length} association revocations from ${endpoint.name}`);
  const { turtle, maxBlock } = emitAssociationRevocationsTurtle(endpoint.chainId, items, lastBlock);
  if (maxBlock > lastBlock) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'association-revocations', turtle, resetContext });
    await setCheckpoint(endpoint.chainId, 'association-revocations', maxBlock.toString());
  }
}

async function runSync(command: SyncCommand, resetContext: boolean = false) {
  // Global one-shot commands (not chain/subgraph specific)
  if (command === 'oasf') {
    await ingestOasfToGraphdb({ resetContext });
    return;
  }
  if (command === 'ontologies') {
    await ingestOntologiesToGraphdb({ resetContext });
    return;
  }
  if (command === 'trust-index') {
    await runTrustIndexForChains({
      chainIdsCsv: process.env.SYNC_CHAIN_ID || '1,11155111',
      resetContext,
    });
    return;
  }

  // Filter endpoints by chainId if specified (default to chainId=1,11155111 for mainnet and sepolia)
  const chainIdFilterRaw = process.env.SYNC_CHAIN_ID || '1,11155111';
  const chainIdFilters = chainIdFilterRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const n = Number(s);
      return Number.isFinite(n) ? Math.trunc(n) : null;
    })
    .filter((n): n is number => n !== null);

  if (!process.env.SYNC_CHAIN_ID) {
    console.info(`[sync] defaulting to chainId=1,11155111 (mainnet and sepolia). Set SYNC_CHAIN_ID to override.`);
  }

  const endpoints = SUBGRAPH_ENDPOINTS.filter((ep) => chainIdFilters.includes(ep.chainId));

  if (endpoints.length === 0) {
    console.error(
      `[sync] no subgraph endpoints configured for chainId(s): ${chainIdFilters.join(', ')}. Available: ${SUBGRAPH_ENDPOINTS.map((e) => `${e.name} (${e.chainId})`).join(', ') || 'none'}`,
    );
    if (chainIdFilters.includes(1) && !SUBGRAPH_ENDPOINTS.some((e) => e.chainId === 1)) {
      const hasMainnetGraphql = process.env.ETH_MAINNET_GRAPHQL_URL && process.env.ETH_MAINNET_GRAPHQL_URL.trim();
      const hasMainnetRpc = process.env.ETH_MAINNET_RPC_HTTP_URL && process.env.ETH_MAINNET_RPC_HTTP_URL.trim();
      console.error(`[sync] chainId=1 (mainnet) is not configured:`);
      if (!hasMainnetGraphql) {
        console.error(`  ❌ ETH_MAINNET_GRAPHQL_URL is not set or empty`);
      } else {
        console.info(`  ✓ ETH_MAINNET_GRAPHQL_URL is set`);
      }
      if (!hasMainnetRpc) {
        console.error(`  ❌ ETH_MAINNET_RPC_HTTP_URL is not set or empty`);
      } else {
        console.info(`  ✓ ETH_MAINNET_RPC_HTTP_URL is set`);
      }
      console.error(`[sync] To enable mainnet (chainId=1), set both:`);
      console.error(`  - ETH_MAINNET_GRAPHQL_URL=<your-mainnet-subgraph-url>`);
      console.error(`  - ETH_MAINNET_RPC_HTTP_URL=<your-mainnet-rpc-url>`);
    }
    process.exitCode = 1;
    return;
  }

  console.info(`[sync] processing chainId(s): ${chainIdFilters.join(', ')} (${endpoints.map((e) => e.name).join(', ')})`);

  for (const endpoint of endpoints) {
    try {
      switch (command) {
        case 'watch':
          // handled outside runSync
          break;
        case 'agents':
          await syncAgents(endpoint, resetContext);
          break;
        case 'feedbacks':
          await syncFeedbacks(endpoint, resetContext);
          await syncFeedbackRevocations(endpoint, resetContext);
          await syncFeedbackResponses(endpoint, resetContext);
          break;
        case 'feedback-revocations':
          await syncFeedbackRevocations(endpoint, resetContext);
          break;
        case 'feedback-responses':
          await syncFeedbackResponses(endpoint, resetContext);
          break;
        case 'validations':
          await syncValidationRequests(endpoint, resetContext);
          await syncValidationResponses(endpoint, resetContext);
          break;
        case 'validation-requests':
          await syncValidationRequests(endpoint, resetContext);
          break;
        case 'validation-responses':
          await syncValidationResponses(endpoint, resetContext);
          break;
        case 'assertion-summaries':
          await materializeAssertionSummariesForChain(endpoint.chainId, {
            limit: process.env.SYNC_ASSERTION_SUMMARIES_LIMIT ? Number(process.env.SYNC_ASSERTION_SUMMARIES_LIMIT) : undefined,
          });
          break;
        case 'associations':
          await syncAssociations(endpoint, resetContext);
          await syncAssociationRevocations(endpoint, resetContext);
          break;
        case 'association-revocations':
          await syncAssociationRevocations(endpoint, resetContext);
          break;
        case 'agent-cards':
          await syncAgentCardsForChain(endpoint.chainId, { force: process.env.SYNC_AGENT_CARDS_FORCE === '1' });
          break;
        case 'materialize-services':
          await materializeRegistrationServicesForChain(endpoint.chainId, {
            limit: process.env.SYNC_MATERIALIZE_SERVICES_LIMIT ? Number(process.env.SYNC_MATERIALIZE_SERVICES_LIMIT) : undefined,
          });
          break;
        case 'trust-ledger': {
          const limitScores = process.env.SYNC_TRUST_LEDGER_SCORES_LIMIT ? Number(process.env.SYNC_TRUST_LEDGER_SCORES_LIMIT) : undefined;
          const limitBadgeDefs = process.env.SYNC_TRUST_LEDGER_BADGES_LIMIT ? Number(process.env.SYNC_TRUST_LEDGER_BADGES_LIMIT) : undefined;
          await syncTrustLedgerToGraphdbForChain(endpoint.chainId, { resetContext, limitScores, limitBadgeDefs });
          break;
        }
        case 'account-types': {
          const limitArg = process.argv.find((a) => a.startsWith('--limit=')) ?? '';
          const concArg = process.argv.find((a) => a.startsWith('--concurrency=')) ?? '';
          const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
          const concurrency = concArg ? Number(concArg.split('=')[1]) : undefined;
          await syncAccountTypesForChain(endpoint.chainId, { limit, concurrency });
          break;
        }
        case 'all':
          await syncAgents(endpoint, resetContext);
          await syncFeedbacks(endpoint, resetContext);
          await syncFeedbackRevocations(endpoint, resetContext);
          await syncFeedbackResponses(endpoint, resetContext);
          await syncValidationRequests(endpoint, resetContext);
          await syncValidationResponses(endpoint, resetContext);
          await materializeAssertionSummariesForChain(endpoint.chainId, {});
          await syncAssociations(endpoint, resetContext);
          await syncAssociationRevocations(endpoint, resetContext);
          await materializeRegistrationServicesForChain(endpoint.chainId, {});
          await syncAgentCardsForChain(endpoint.chainId, { force: process.env.SYNC_AGENT_CARDS_FORCE === '1' });
          await syncAccountTypesForChain(endpoint.chainId, {});
          await syncTrustLedgerToGraphdbForChain(endpoint.chainId, { resetContext });
          break;
        default:
          console.error(`[sync] unknown command: ${command}`);
          process.exitCode = 1;
          return;
      }
    } catch (error) {
      console.error(`[sync] error syncing ${endpoint.name}:`, error);
    }
  }
}

async function runWatch(args: { subcommand: SyncCommand; resetContext: boolean }) {
  const intervalMsRaw = process.env.SYNC_WATCH_INTERVAL_MS;
  // Default slower to reduce subgraph/RPC/GraphDB pressure and avoid rate limits/timeouts.
  const intervalMs = intervalMsRaw && String(intervalMsRaw).trim() ? Number(intervalMsRaw) : 180_000;
  const ms = Number.isFinite(intervalMs) && intervalMs > 1000 ? Math.trunc(intervalMs) : 180_000;

  console.info('[sync] watch enabled', {
    subcommand: args.subcommand,
    intervalMs: ms,
    resetFirstCycle: args.resetContext,
    endpoints: SUBGRAPH_ENDPOINTS.map((e) => ({ name: e.name, chainId: e.chainId })),
  });

  let cycle = 0;
  for (;;) {
    cycle++;
    const startedAt = Date.now();
    try {
      await runSync(args.subcommand, cycle === 1 ? args.resetContext : false);
    } catch (e) {
      console.error('[sync] watch cycle error:', e);
    }
    const elapsed = Date.now() - startedAt;
    // Ensure a minimum cooldown even if the cycle runs longer than the interval.
    const minDelayRaw = process.env.SYNC_WATCH_MIN_DELAY_MS;
    const minDelayParsed = minDelayRaw && String(minDelayRaw).trim() ? Number(minDelayRaw) : 15_000;
    const minDelay = Number.isFinite(minDelayParsed) && minDelayParsed >= 1000 ? Math.trunc(minDelayParsed) : 15_000;
    const delay = Math.max(minDelay, ms - elapsed);
    console.info('[sync] watch cycle complete', { cycle, elapsedMs: elapsed, nextInMs: delay });
    await sleep(delay);
  }
}

const command = (process.argv[2] || 'all') as SyncCommand;
const resetContext = process.argv.includes('--reset') || process.env.SYNC_RESET === '1';
const watchSubcommand = (process.argv[3] || 'all') as SyncCommand;

const main = async () => {
  if (command === 'watch') {
    // Watch mode: continuously re-run incremental syncs using GraphDB checkpoints.
    // Example: pnpm --filter sync sync:watch all
    await runWatch({ subcommand: watchSubcommand, resetContext });
    return;
  }
  await runSync(command, resetContext);
};

main().catch((error) => {
  console.error('[sync] fatal error:', error);
  process.exitCode = 1;
});
