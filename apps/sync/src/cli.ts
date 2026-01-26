import './env-load.js';
import {
  SUBGRAPH_ENDPOINTS,
  fetchAllFromSubgraph,
  AGENTS_QUERY,
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
  | 'all';

async function syncAgents(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching agents from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  const last = (await getCheckpoint(endpoint.chainId, 'agents')) ?? '0';
  let lastCursor = 0n;
  try {
    lastCursor = BigInt(last);
  } catch {
    lastCursor = 0n;
  }

  // Agents query is mint-ordered; many subgraphs don't support mintedAt_gt filters reliably, so we filter client-side like indexer.
  const items = await fetchAllFromSubgraph(endpoint.url, AGENTS_QUERY, 'agents', { optional: false });
  console.info(`[sync] fetched ${items.length} agents from ${endpoint.name}`);

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
  const last = (await getCheckpoint(endpoint.chainId, 'feedbacks')) ?? '0';
  let lastBlock = 0n;
  try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }

  const items = await fetchAllFromSubgraph(endpoint.url, FEEDBACKS_QUERY, 'repFeedbacks', { optional: true });
  console.info(`[sync] fetched ${items.length} feedbacks from ${endpoint.name}`);
  const { turtle, maxBlock } = emitFeedbacksTurtle(endpoint.chainId, items, lastBlock);
  if (turtle.trim()) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'feedbacks', turtle, resetContext });
    if (maxBlock > lastBlock) await setCheckpoint(endpoint.chainId, 'feedbacks', maxBlock.toString());
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
  const last = (await getCheckpoint(endpoint.chainId, 'validation-requests')) ?? '0';
  let lastBlock = 0n;
  try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  const items = await fetchAllFromSubgraph(endpoint.url, VALIDATION_REQUESTS_QUERY, 'validationRequests', { optional: true });
  console.info(`[sync] fetched ${items.length} validation requests from ${endpoint.name}`);
  const { turtle, maxBlock } = emitValidationRequestsTurtle(endpoint.chainId, items, lastBlock);
  if (turtle.trim()) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'validation-requests', turtle, resetContext });
    if (maxBlock > lastBlock) await setCheckpoint(endpoint.chainId, 'validation-requests', maxBlock.toString());
  }
}

async function syncValidationResponses(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching validation responses from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  const last = (await getCheckpoint(endpoint.chainId, 'validation-responses')) ?? '0';
  let lastBlock = 0n;
  try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  const items = await fetchAllFromSubgraph(endpoint.url, VALIDATION_RESPONSES_QUERY, 'validationResponses', { optional: true });
  console.info(`[sync] fetched ${items.length} validation responses from ${endpoint.name}`);
  const { turtle, maxBlock } = emitValidationResponsesTurtle(endpoint.chainId, items, lastBlock);
  if (turtle.trim()) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'validation-responses', turtle, resetContext });
    if (maxBlock > lastBlock) await setCheckpoint(endpoint.chainId, 'validation-responses', maxBlock.toString());
  }
}

async function syncAssociations(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching associations from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  const last = (await getCheckpoint(endpoint.chainId, 'associations')) ?? '0';
  let lastBlock = 0n;
  try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  const items = await fetchAllFromSubgraph(endpoint.url, ASSOCIATIONS_QUERY, 'associations', { optional: true });
  console.info(`[sync] fetched ${items.length} associations from ${endpoint.name}`);
  const { turtle, maxBlock } = emitAssociationsTurtle(endpoint.chainId, items, lastBlock);
  if (turtle.trim()) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'associations', turtle, resetContext });
    if (maxBlock > lastBlock) await setCheckpoint(endpoint.chainId, 'associations', maxBlock.toString());
  }
}

async function syncAssociationRevocations(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  console.info(`[sync] fetching association revocations from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  const last = (await getCheckpoint(endpoint.chainId, 'association-revocations')) ?? '0';
  let lastBlock = 0n;
  try { lastBlock = BigInt(last); } catch { lastBlock = 0n; }
  const items = await fetchAllFromSubgraph(endpoint.url, ASSOCIATION_REVOCATIONS_QUERY, 'associationRevocations', { optional: true });
  console.info(`[sync] fetched ${items.length} association revocations from ${endpoint.name}`);
  const { turtle, maxBlock } = emitAssociationRevocationsTurtle(endpoint.chainId, items, lastBlock);
  if (turtle.trim()) {
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'association-revocations', turtle, resetContext });
    if (maxBlock > lastBlock) await setCheckpoint(endpoint.chainId, 'association-revocations', maxBlock.toString());
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

const command = (process.argv[2] || 'all') as SyncCommand;
const resetContext = process.argv.includes('--reset') || process.env.SYNC_RESET === '1';

runSync(command, resetContext).catch((error) => {
  console.error('[sync] fatal error:', error);
  process.exitCode = 1;
});
