import './env-load.js';
import {
  SUBGRAPH_ENDPOINTS,
  fetchAllFromSubgraph,
  AGENTS_QUERY,
  AGENT_METADATA_COLLECTION_QUERY,
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
import { listAgentIriByDidIdentity } from './graphdb/agents.js';

type SyncCommand =
  | 'agents'
  | 'feedbacks'
  | 'feedback-revocations'
  | 'feedback-responses'
  | 'validations'
  | 'validation-requests'
  | 'validation-responses'
  | 'associations'
  | 'association-revocations'
  | 'agent-cards'
  | 'account-types'
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
  try {
    items = await fetchAllFromSubgraph(endpoint.url, AGENTS_QUERY, 'agents', { optional: false });
  } catch (e: any) {
    const msg = String(e?.message || e || '');
    if (msg.includes('Subgraph schema mismatch') && msg.includes('no field "agents"')) {
      console.warn(`[sync] skipping agents for ${endpoint.name}: subgraph has no "agents" field`);
      return;
    }
    throw e;
  }
  console.info(`[sync] fetched ${items.length} agents from ${endpoint.name}`);

  // Attach on-chain metadata KV rows if the subgraph exposes them (optional).
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

  const metas = await fetchAllFromSubgraph(endpoint.url, AGENT_METADATA_COLLECTION_QUERY, 'agentMetadata_collection', {
    optional: true,
    maxSkip: 50_000,
  });
  if (metas.length) {
    const byAgent = new Map<string, any[]>();
    for (const m of metas) {
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
    console.info(`[sync] attached ${metas.length} agentMetadatas rows to agents`);
  }

  const { turtle, maxCursor } = emitAgentsTurtle(endpoint.chainId, items, 'mintedAt', lastCursor);
  if (turtle.trim()) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'agents', turtle, resetContext });
    if (maxCursor > lastCursor) {
      await setCheckpoint(endpoint.chainId, 'agents', maxCursor.toString());
    }
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
  if (SUBGRAPH_ENDPOINTS.length === 0) {
    console.error('[sync] no subgraph endpoints configured');
    process.exitCode = 1;
    return;
  }

  for (const endpoint of SUBGRAPH_ENDPOINTS) {
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
          await syncAssociations(endpoint, resetContext);
          await syncAssociationRevocations(endpoint, resetContext);
          await syncAgentCardsForChain(endpoint.chainId, { force: process.env.SYNC_AGENT_CARDS_FORCE === '1' });
          await syncAccountTypesForChain(endpoint.chainId, {});
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
  const intervalMs = intervalMsRaw && String(intervalMsRaw).trim() ? Number(intervalMsRaw) : 60_000;
  const ms = Number.isFinite(intervalMs) && intervalMs > 1000 ? Math.trunc(intervalMs) : 60_000;

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
    const delay = Math.max(1000, ms - elapsed);
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
