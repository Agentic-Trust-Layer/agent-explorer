import './env-load.js';
import {
  SUBGRAPH_ENDPOINTS,
  pingSubgraph,
  fetchAllFromSubgraph,
  fetchAllFromSubgraphByIdCursor,
  AGENTS_QUERY,
  AGENTS_QUERY_BY_MINTEDAT_CURSOR,
  fetchAllFromSubgraphByMintedAtCursor,
  fetchAgentMintedAtById,
  fetchAgentById,
  AGENT_METADATA_COLLECTION_QUERY,
  AGENT_METADATA_COLLECTION_QUERY_BY_ID_CURSOR,
  FEEDBACKS_QUERY,
  FEEDBACK_REVOCATIONS_QUERY,
  FEEDBACK_RESPONSES_QUERY,
  VALIDATION_REQUESTS_QUERY,
  VALIDATION_RESPONSES_QUERY,
  ASSOCIATIONS_QUERY,
  ASSOCIATION_REVOCATIONS_QUERY,
  REGISTRY_AGENT_8122_QUERY,
  REGISTRY_AGENT_8122_METADATA_COLLECTION_QUERY,
  REGISTRY_AGENT_8122_QUERY_BY_REGISTRY_IN,
  REGISTRY_AGENT_8122_METADATA_COLLECTION_QUERY_BY_REGISTRY_IN,
  REGISTRY_AGENT_8122_QUERY_LEGACY,
  REGISTRY_AGENT_8122_METADATA_COLLECTION_QUERY_LEGACY,
  REGISTRY_AGENT_8122_QUERY_BY_REGISTRY_IN_LEGACY,
  REGISTRY_AGENT_8122_METADATA_COLLECTION_QUERY_BY_REGISTRY_IN_LEGACY,
  fetchFeedbacksByAgentId,
  fetchValidationRequestsByAgentId,
  fetchValidationResponsesByAgentId,
} from './subgraph-client.js';
import {
  clearSubgraphSectionForAgent,
  clearSubgraphSectionForAgentBatch,
  ingestSubgraphTurtleToGraphdb,
} from './graphdb-ingest.js';
import { clearCheckpointsForChain, getCheckpoint, setCheckpoint } from './graphdb/checkpoints.js';
import { emitAgentsTurtle } from './rdf/emit-agents.js';
import { emitFeedbacksTurtle, extractAgentIdFromFeedbackRow } from './rdf/emit-feedbacks.js';
import { emitValidationRequestsTurtle, emitValidationResponsesTurtle } from './rdf/emit-validations.js';
import { emitAssociationsTurtle, emitAssociationRevocationsTurtle } from './rdf/emit-associations.js';
import { emitErc8122AgentsTurtle } from './rdf/emit-erc8122.js';
import { syncErc8122RegistriesToGraphdbForChain } from './erc8122/sync-erc8122-registries.js';
import { syncAgentCardsForAgentIds, syncAgentCardsForChain } from './a2a/agent-card-sync.js';
import { syncAccountTypesForChain } from './account-types/sync-account-types.js';
import {
  getMaxAgentId8004,
  getMaxDid8004AgentId,
  listAccountsForAgent,
  listAccountsForAgentBatch,
  listAgentIdsForChain,
  listAgentIriByDidIdentity,
} from './graphdb/agents.js';
import { ingestOasfToGraphdb } from './oasf/oasf-ingest.js';
import { ingestOntologiesToGraphdb } from './ontology/ontology-ingest.js';
import { runTrustIndexForChains } from './trust-index/trust-index.js';
import { materializeRegistrationServicesForChain } from './registration/materialize-services.js';
import { materializeAssertionSummariesForChain } from './trust-summaries/materialize-assertion-summaries.js';
import { syncTrustLedgerToGraphdbForChain } from './trust-ledger/sync-trust-ledger.js';
import { syncMcpForAgentIds, syncMcpForChain } from './mcp/mcp-sync.js';
import { syncEnsParentForChain } from './ens/ens-parent-sync.js';
import { ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, queryGraphdb, updateGraphdb } from './graphdb-http.js';
import { watchErc8004RegistryEventsMultiChain } from './erc8004/registry-events-watch.js';

type SyncCommand =
  | 'agents'
  | 'erc8004-events'
  | 'erc8122'
  | 'erc8122-registries'
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
  | 'mcp'
  | 'oasf'
  | 'ontologies'
  | 'trust-index'
  | 'trust-ledger'
  | 'ens-parent'
  | 'account-types'
  | 'materialize-services'
  | 'watch'
  | 'all'
  | 'reset-chain-agents'
  | 'agent-pipeline'
  | 'subgraph-ping';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns the list of agent IDs that were ingested in this run (for pipeline to process only that batch). */
async function syncAgents(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean): Promise<string[]> {
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
  const envLimit = Number(process.env.SYNC_AGENT_LIMIT ?? '');
  const defaultLimit = Number.isFinite(envLimit) && envLimit > 0 ? Math.trunc(envLimit) : 5000;
  const maxAgentsPerRun =
    Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.trunc(parsedLimit) : defaultLimit; // keep runs bounded; repeated runs/watch will catch up
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
      return [];
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
    const ingestedIds = items
      .map((it: any) => String(it?.id ?? '').trim())
      .filter((id) => /^\d+$/.test(id));
    return ingestedIds;
  }
  console.info('[sync] agents sync complete', {
    chainId: endpoint.chainId,
    emitted: false,
    cursorModeUsed,
    fetched: items.length,
  });
  return [];
}

/** Sync a single agent from subgraph into GraphDB (for agent-pipeline when using --agent-ids for new agents). */
export async function syncSingleAgent(
  endpoint: { url: string; chainId: number; name: string },
  agentId: string,
): Promise<boolean> {
  const id = String(agentId ?? '').trim();
  if (!id) return false;
  const row = await fetchAgentById(endpoint.url, id).catch(() => null);
  if (!row) {
    console.warn('[sync] [syncSingleAgent] agent not found in subgraph', { chainId: endpoint.chainId, agentId: id });
    return false;
  }
  const { turtle } = emitAgentsTurtle(endpoint.chainId, [row], 'mintedAt', -1n);
  if (!turtle || !turtle.trim()) return true;
  await ingestSubgraphTurtleToGraphdb({
    chainId: endpoint.chainId,
    section: 'agents',
    turtle,
    resetContext: false,
  });
  return true;
}

async function clearErc8004AgentFromGraphdb(chainId: number, agentId8004: number): Promise<void> {
  const chainIdInt = Math.trunc(Number(chainId));
  const agentIdInt = Math.trunc(Number(agentId8004));
  if (!chainIdInt || !Number.isFinite(agentIdInt) || agentIdInt < 0) return;

  const ctx = `https://www.agentictrust.io/graph/data/subgraph/${chainIdInt}`;
  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
WITH <${ctx}>
DELETE { ?node ?p ?o . }
WHERE {
  {
    SELECT DISTINCT ?node WHERE {
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        BIND(?agent AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        BIND(?id AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?agent core:hasDescriptor ?agentDesc .
        BIND(?agentDesc AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?id core:hasDescriptor ?desc .
        BIND(?desc AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?id core:hasIdentifier ?ident .
        BIND(?ident AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?agent core:hasServiceEndpoint ?se .
        BIND(?se AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?id core:hasServiceEndpoint ?se .
        BIND(?se AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?id core:hasServiceEndpoint ?se .
        ?se core:hasDescriptor ?seDesc .
        BIND(?seDesc AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?id core:hasServiceEndpoint ?se .
        ?se core:hasProtocol ?proto .
        BIND(?proto AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?id core:hasServiceEndpoint ?se .
        ?se core:hasProtocol ?proto .
        ?proto core:hasDescriptor ?protoDesc .
        BIND(?protoDesc AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?id core:hasServiceEndpoint ?se .
        ?se core:hasProtocol ?proto .
        ?proto core:hasSkill ?sk .
        BIND(?sk AS ?node)
      }
      UNION
      {
        ?id a erc8004:AgentIdentity8004 ;
            erc8004:agentId ${agentIdInt} ;
            core:identityOf ?agent .
        ?id core:hasServiceEndpoint ?se .
        ?se core:hasProtocol ?proto .
        ?proto core:hasDomain ?dm .
        BIND(?dm AS ?node)
      }
    }
  }
  ?node ?p ?o .
}
`;

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await updateGraphdb(baseUrl, repository, auth, sparql, { timeoutMs: 15_000, retries: 0 });
}

async function syncErc8004AgentById(
  endpoint: { url: string; chainId: number; name: string },
  agentId: string,
): Promise<{ ownerAddress: string | null; agentWallet: string | null }> {
  const id = String(agentId || '').trim();
  if (!id) return { ownerAddress: null, agentWallet: null };
  if (!/^\d+$/.test(id)) throw new Error(`Invalid agentId: ${id}`);

  console.info('[sync] [erc8004-agent] fetching agent by id', { chainId: endpoint.chainId, agentId: id });

  // Subgraph can lag the on-chain event slightly; retry a few times.
  let row: any | null = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    row = await fetchAgentById(endpoint.url, id, { maxRetries: 2 }).catch(() => null);
    if (row) break;
    await sleep(1500 * Math.pow(1.5, attempt));
  }
  if (!row) {
    console.warn('[sync] [erc8004-agent] agent not found in subgraph (yet); skipping', { chainId: endpoint.chainId, agentId: id });
    return { ownerAddress: null, agentWallet: null };
  }

  // Best-effort: clear old per-agent nodes so updates don't accumulate stale values.
  try {
    await clearErc8004AgentFromGraphdb(endpoint.chainId, Number(id));
  } catch (e: any) {
    console.warn('[sync] [erc8004-agent] clear failed (non-fatal)', { chainId: endpoint.chainId, agentId: id, error: String(e?.message || e || '') });
  }

  const item = { ...row, agentMetadatas: [] };
  const { turtle } = emitAgentsTurtle(endpoint.chainId, [item], 'mintedAt', -1n);
  if (!turtle.trim()) return { ownerAddress: null, agentWallet: null };
  await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'agents', turtle, resetContext: false });
  console.info('[sync] [erc8004-agent] ingested', { chainId: endpoint.chainId, agentId: id });
  const ownerAddress = typeof row?.owner?.id === 'string' ? row.owner.id.trim().toLowerCase() : null;
  const agentWallet = typeof row?.agentWallet === 'string' ? row.agentWallet.trim().toLowerCase() : null;
  return { ownerAddress: ownerAddress && ownerAddress.startsWith('0x') ? ownerAddress : null, agentWallet: agentWallet && agentWallet.startsWith('0x') ? agentWallet : null };
}

async function syncErc8122(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  // ERC-8122 fields may not exist on all subgraphs; treat as optional.
  console.info(`[sync] fetching erc8122 agents from ${endpoint.name} (chainId: ${endpoint.chainId})`);
  console.info(`[sync] erc8122 subgraph endpoint`, { chainId: endpoint.chainId, name: endpoint.name, url: endpoint.url });

  const normalizeHexAddr = (value: unknown): string | null => {
    const s = typeof value === 'string' ? value.trim().toLowerCase() : '';
    return /^0x[0-9a-f]{40}$/.test(s) ? s : null;
  };

  const listRegistriesFromKb = async (): Promise<string[]> => {
    // Registry source of truth: KB (GraphDB) written by sync:erc8122-registries
    const ctx = `https://www.agentictrust.io/graph/data/subgraph/${endpoint.chainId}`;
    const sparql = [
      'PREFIX erc8122: <https://agentictrust.io/ontology/erc8122#>',
      'SELECT DISTINCT ?addr WHERE {',
      `  GRAPH <${ctx}> {`,
      '    ?reg a erc8122:AgentRegistry8122 ;',
      '         erc8122:registryContractAddress ?addr .',
      '  }',
      '}',
      'ORDER BY LCASE(STR(?addr))',
      '',
    ].join('\n');
    const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
    const res = await queryGraphdb(baseUrl, repository, auth, sparql);
    const out: string[] = [];
    for (const b of Array.isArray(res?.results?.bindings) ? res.results.bindings : []) {
      const v = typeof (b as any)?.addr?.value === 'string' ? String((b as any).addr.value) : '';
      const n = normalizeHexAddr(v);
      if (n) out.push(n);
    }
    return out;
  };

  const listRegistryNamesFromKb = async (): Promise<Map<string, string>> => {
    const ctx = `https://www.agentictrust.io/graph/data/subgraph/${endpoint.chainId}`;
    const sparql = [
      'PREFIX erc8122: <https://agentictrust.io/ontology/erc8122#>',
      'SELECT DISTINCT ?addr ?name WHERE {',
      `  GRAPH <${ctx}> {`,
      '    ?reg a erc8122:AgentRegistry8122 ;',
      '         erc8122:registryContractAddress ?addr .',
      '    OPTIONAL { ?reg erc8122:registryName ?name . }',
      '  }',
      '}',
      'ORDER BY LCASE(STR(?addr))',
      '',
    ].join('\n');
    const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
    const res = await queryGraphdb(baseUrl, repository, auth, sparql);
    const out = new Map<string, string>();
    for (const b of Array.isArray(res?.results?.bindings) ? res.results.bindings : []) {
      const addr = typeof (b as any)?.addr?.value === 'string' ? String((b as any).addr.value) : '';
      const naddr = normalizeHexAddr(addr);
      if (!naddr) continue;
      const name = typeof (b as any)?.name?.value === 'string' ? String((b as any).name.value).trim() : '';
      if (name) out.set(naddr, name);
    }
    return out;
  };

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const s = Math.max(1, Math.trunc(size));
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += s) out.push(arr.slice(i, i + s));
    return out;
  };

  let registries: string[] = [];
  try {
    registries = await listRegistriesFromKb();
  } catch (e: any) {
    console.warn('[sync] erc8122 failed to list registries from KB; falling back to unfiltered subgraph fetch', {
      chainId: endpoint.chainId,
      error: String(e?.message || e || ''),
    });
    registries = [];
  }

  const useRegistryFilter = registries.length > 0;
  const registryChunks = useRegistryFilter ? chunkArray(registries, 100) : [];
  if (useRegistryFilter) {
    console.info('[sync] erc8122 registry allowlist from KB', {
      chainId: endpoint.chainId,
      registries: registries.length,
      chunks: registryChunks.length,
    });
  } else {
    console.info('[sync] erc8122 registry allowlist from KB is empty; fetching all subgraph rows', { chainId: endpoint.chainId });
  }

  const agents: any[] = [];
  const metadatas: any[] = [];
  if (!useRegistryFilter) {
    agents.push(...(await fetchAllFromSubgraph(endpoint.url, REGISTRY_AGENT_8122_QUERY, 'registryAgent8122s', { optional: true })));
    metadatas.push(
      ...(await fetchAllFromSubgraph(
        endpoint.url,
        REGISTRY_AGENT_8122_METADATA_COLLECTION_QUERY,
        'registryAgent8122Metadatas',
        { optional: true, maxSkip: 50_000 },
      )),
    );
  } else {
    for (const regs of registryChunks) {
      agents.push(
        ...(await fetchAllFromSubgraph(endpoint.url, REGISTRY_AGENT_8122_QUERY_BY_REGISTRY_IN, 'registryAgent8122s', {
          optional: true,
          buildVariables: ({ first, skip }) => ({ first, skip, registries: regs }),
        })),
      );
      metadatas.push(
        ...(await fetchAllFromSubgraph(endpoint.url, REGISTRY_AGENT_8122_METADATA_COLLECTION_QUERY_BY_REGISTRY_IN, 'registryAgent8122Metadatas', {
          optional: true,
          maxSkip: 50_000,
          buildVariables: ({ first, skip }) => ({ first, skip, registries: regs }),
        })),
      );
    }
  }

  // Legacy fallback: some deployed subgraphs use old root field names.
  if (!agents.length && !metadatas.length) {
    console.warn('[sync] erc8122: no rows from new schema; attempting legacy field names', {
      chainId: endpoint.chainId,
      endpoint: endpoint.name,
    });
    if (!useRegistryFilter) {
      agents.push(...(await fetchAllFromSubgraph(endpoint.url, REGISTRY_AGENT_8122_QUERY_LEGACY, 'registryAgent8122S', { optional: true })));
      metadatas.push(
        ...(await fetchAllFromSubgraph(
          endpoint.url,
          REGISTRY_AGENT_8122_METADATA_COLLECTION_QUERY_LEGACY,
          'registryAgent8122Metadata_collection',
          { optional: true, maxSkip: 50_000 },
        )),
      );
    } else {
      for (const regs of registryChunks) {
        agents.push(
          ...(await fetchAllFromSubgraph(endpoint.url, REGISTRY_AGENT_8122_QUERY_BY_REGISTRY_IN_LEGACY, 'registryAgent8122S', {
            optional: true,
            buildVariables: ({ first, skip }) => ({ first, skip, registries: regs }),
          })),
        );
        metadatas.push(
          ...(await fetchAllFromSubgraph(
            endpoint.url,
            REGISTRY_AGENT_8122_METADATA_COLLECTION_QUERY_BY_REGISTRY_IN_LEGACY,
            'registryAgent8122Metadata_collection',
            {
              optional: true,
              maxSkip: 50_000,
              buildVariables: ({ first, skip }) => ({ first, skip, registries: regs }),
            },
          )),
        );
      }
    }
  }

  console.info(`[sync] fetched erc8122 rows from ${endpoint.name}`, {
    chainId: endpoint.chainId,
    agents: agents.length,
    metadatas: metadatas.length,
  });

  // Log each agent row (bounded by env to avoid accidental spam).
  try {
    const showAll = process.env.SYNC_DEBUG_ERC8122 === '1';
    const maxToShow = showAll ? agents.length : Math.min(50, agents.length);
    const rows = (agents || []).slice(0, maxToShow).map((a: any) => ({
      registry: a?.registry ?? null,
      agentId: a?.agentId ?? null,
      owner: a?.owner ?? null,
      endpointType: a?.endpointType ?? null,
      endpoint: a?.endpoint ?? null,
      agentAccount: a?.agentAccount ?? null,
    }));
    console.info('[sync] erc8122 agents (per-row)', {
      chainId: endpoint.chainId,
      total: agents.length,
      shown: rows.length,
      setEnv: showAll ? null : 'Set SYNC_DEBUG_ERC8122=1 to print all rows.',
      rows,
    });
  } catch {}

  // Always log a small sample so it's obvious whether we're reading the right data.
  try {
    const sample = (agents || []).slice(0, 25).map((a: any) => ({
      id: a?.id ?? null,
      agentId: a?.agentId ?? null,
      registry: a?.registry ?? null,
      owner: a?.owner ?? null,
      endpointType: a?.endpointType ?? null,
      endpoint: a?.endpoint ?? null,
      agentAccount: a?.agentAccount ?? null,
      createdAt: a?.createdAt ?? null,
      updatedAt: a?.updatedAt ?? null,
    }));
    console.info('[sync] erc8122 agent sample', { chainId: endpoint.chainId, sampleCount: sample.length, sample });
  } catch {}

  // IMPORTANT: when --reset is used, clear the section even if the subgraph has 0 rows.
  if (!agents.length && !metadatas.length) {
    if (resetContext) {
      await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'erc8122', turtle: '', resetContext: true });
    }
    return;
  }

  let registryNamesByAddress: Map<string, string> | null = null;
  try {
    registryNamesByAddress = await listRegistryNamesFromKb();
    console.info('[sync] erc8122 registry names from KB', {
      chainId: endpoint.chainId,
      registriesWithNames: registryNamesByAddress.size,
    });
  } catch (e: any) {
    console.warn('[sync] erc8122 failed to read registry names from KB (non-fatal)', {
      chainId: endpoint.chainId,
      error: String(e?.message || e || ''),
    });
    registryNamesByAddress = null;
  }

  const { turtle } = emitErc8122AgentsTurtle({ chainId: endpoint.chainId, agents, metadatas, registryNamesByAddress });
  if (!turtle.trim()) {
    // Still clear if reset requested.
    if (resetContext) {
      await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'erc8122', turtle: '', resetContext: true });
    }
    return;
  }

  await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'erc8122', turtle, resetContext });
}

async function syncErc8122Registries(endpoint: { url: string; chainId: number; name: string }, resetContext: boolean) {
  // Registry factories + registries + registrars are read from chain RPC (and optionally enriched from subgraph).
  console.info(`[sync] syncing erc8122 registries (chainId: ${endpoint.chainId})`);
  await syncErc8122RegistriesToGraphdbForChain({ chainId: endpoint.chainId, resetContext });
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

export type BulkSubgraphData = {
  feedbacksByAgentId: Map<string, any[]>;
  validationRequestsByAgentId: Map<string, any[]>;
  validationResponsesByAgentId: Map<string, any[]>;
  associationsByAccountId: Map<string, any[]>;
};

/** Bulk-load feedbacks, validation requests/responses, and associations once per run for pipeline. */
async function loadBulkSubgraphData(endpoint: { url: string; chainId: number; name: string }): Promise<BulkSubgraphData> {
  const opts = { optional: true, first: 500, maxSkip: 150_000 };
  const bulkDelayMs = Math.max(0, Number(process.env.SUBGRAPH_BULK_FETCH_DELAY_MS) || 2000);
  const feedbackItems = await fetchAllFromSubgraph(endpoint.url, FEEDBACKS_QUERY, 'repFeedbacks', opts).catch(() => []);
  if (bulkDelayMs) await sleep(bulkDelayMs);
  const reqItems = await fetchAllFromSubgraph(endpoint.url, VALIDATION_REQUESTS_QUERY, 'validationRequests', opts).catch(() => []);
  if (bulkDelayMs) await sleep(bulkDelayMs);
  const resItems = await fetchAllFromSubgraph(endpoint.url, VALIDATION_RESPONSES_QUERY, 'validationResponses', opts).catch(() => []);
  if (bulkDelayMs) await sleep(bulkDelayMs);
  const assocItems = await fetchAllFromSubgraph(endpoint.url, ASSOCIATIONS_QUERY, 'associations', opts).catch(() => []);
  console.info('[sync] [bulk] loaded', {
    feedbacks: feedbackItems.length,
    validationRequests: reqItems.length,
    validationResponses: resItems.length,
    associations: assocItems.length,
  });
  const feedbacksByAgentId = new Map<string, any[]>();
  for (const fb of feedbackItems) {
    const aid = extractAgentIdFromFeedbackRow(fb);
    if (aid) {
      const arr = feedbacksByAgentId.get(aid) ?? [];
      arr.push(fb);
      feedbacksByAgentId.set(aid, arr);
    }
  }
  const validationRequestsByAgentId = new Map<string, any[]>();
  for (const r of reqItems) {
    const aid = typeof r?.agent?.id === 'string' ? r.agent.id.trim() : '';
    if (aid) {
      const arr = validationRequestsByAgentId.get(aid) ?? [];
      arr.push(r);
      validationRequestsByAgentId.set(aid, arr);
    }
  }
  const validationResponsesByAgentId = new Map<string, any[]>();
  for (const r of resItems) {
    const aid = typeof r?.agent?.id === 'string' ? r.agent.id.trim() : '';
    if (aid) {
      const arr = validationResponsesByAgentId.get(aid) ?? [];
      arr.push(r);
      validationResponsesByAgentId.set(aid, arr);
    }
  }
  const associationsByAccountId = new Map<string, any[]>();
  for (const a of assocItems) {
    const init = String(a?.initiatorAccount?.id ?? '').trim().toLowerCase();
    const appr = String(a?.approverAccount?.id ?? '').trim().toLowerCase();
    if (init) {
      const arr = associationsByAccountId.get(init) ?? [];
      arr.push(a);
      associationsByAccountId.set(init, arr);
    }
    if (appr && appr !== init) {
      const arr = associationsByAccountId.get(appr) ?? [];
      arr.push(a);
      associationsByAccountId.set(appr, arr);
    }
  }
  return { feedbacksByAgentId, validationRequestsByAgentId, validationResponsesByAgentId, associationsByAccountId };
}

async function syncFeedbacksForAgent(
  endpoint: { url: string; chainId: number; name: string },
  agentId: string,
  preloaded?: BulkSubgraphData,
  agentIriByDidIdentity?: Map<string, string>,
): Promise<void> {
  const items = preloaded
    ? (preloaded.feedbacksByAgentId.get(agentId) ?? [])
    : await fetchFeedbacksByAgentId(endpoint.url, agentId, { optional: true }).catch(() => []);
  await clearSubgraphSectionForAgent({ chainId: endpoint.chainId, section: 'feedbacks', agentId });
  const iriMap =
    agentIriByDidIdentity ?? (await listAgentIriByDidIdentity(endpoint.chainId).catch(() => new Map<string, string>()));
  const { turtle } = emitFeedbacksTurtle(endpoint.chainId, items, -1n, iriMap);
  if (turtle.trim())
    await ingestSubgraphTurtleToGraphdb({
      chainId: endpoint.chainId,
      section: 'feedbacks',
      turtle,
      resetContext: false,
      skipAssertionCountMaterialization: true,
    });
}

async function syncValidationsForAgent(
  endpoint: { url: string; chainId: number; name: string },
  agentId: string,
  preloaded?: BulkSubgraphData,
  agentIriByDidIdentity?: Map<string, string>,
): Promise<void> {
  const [reqItems, resItems] = preloaded
    ? [
        preloaded.validationRequestsByAgentId.get(agentId) ?? [],
        preloaded.validationResponsesByAgentId.get(agentId) ?? [],
      ]
    : await Promise.all([
        fetchValidationRequestsByAgentId(endpoint.url, agentId, { optional: true }).catch(() => []),
        fetchValidationResponsesByAgentId(endpoint.url, agentId, { optional: true }).catch(() => []),
      ]);
  await clearSubgraphSectionForAgent({ chainId: endpoint.chainId, section: 'validation-requests', agentId });
  await clearSubgraphSectionForAgent({ chainId: endpoint.chainId, section: 'validation-responses', agentId });
  const { turtle: reqTurtle } = emitValidationRequestsTurtle(endpoint.chainId, reqItems, -1n);
  const iriMap =
    agentIriByDidIdentity ?? (await listAgentIriByDidIdentity(endpoint.chainId).catch(() => new Map<string, string>()));
  const { turtle: resTurtle } = emitValidationResponsesTurtle(endpoint.chainId, resItems, -1n, iriMap);
  if (reqTurtle.trim())
    await ingestSubgraphTurtleToGraphdb({
      chainId: endpoint.chainId,
      section: 'validation-requests',
      turtle: reqTurtle,
      resetContext: false,
    });
  if (resTurtle.trim())
    await ingestSubgraphTurtleToGraphdb({
      chainId: endpoint.chainId,
      section: 'validation-responses',
      turtle: resTurtle,
      resetContext: false,
      skipAssertionCountMaterialization: true,
    });
}

async function syncAssociationsForAgent(
  endpoint: { url: string; chainId: number; name: string },
  agentId: string,
  preloaded?: BulkSubgraphData,
  accountIrisFromCaller?: string[],
): Promise<void> {
  const accountIris =
    accountIrisFromCaller ?? (await listAccountsForAgent(endpoint.chainId, agentId).catch(() => []));
  if (!accountIris.length) return;
  const accountIds = accountIris
    .map((iri) => {
      try {
        const parts = new URL(iri).pathname.split('/').filter(Boolean);
        const idx = parts.indexOf('account');
        if (idx >= 0 && parts[idx + 2]) return String(parts[idx + 2]).toLowerCase();
      } catch {}
      return null;
    })
    .filter((x): x is string => x != null && /^0x[0-9a-f]{40}$/.test(x));
  const accountIdSet = new Set(accountIds);
  let items: any[];
  if (preloaded) {
    const seen = new Set<string>();
    items = [];
    for (const accId of accountIds) {
      const list = preloaded.associationsByAccountId.get(accId) ?? [];
      for (const a of list) {
        const id = a?.id;
        if (id && !seen.has(id)) {
          seen.add(id);
          items.push(a);
        }
      }
    }
  } else {
    const allItems = await fetchAllFromSubgraph(endpoint.url, ASSOCIATIONS_QUERY, 'associations', {
      optional: true,
      first: 2000,
      maxSkip: 20_000,
    }).catch(() => []);
    items = allItems.filter(
      (a: any) =>
        accountIdSet.has(String(a?.initiatorAccount?.id ?? '').trim().toLowerCase()) ||
        accountIdSet.has(String(a?.approverAccount?.id ?? '').trim().toLowerCase()),
    );
  }
  await clearSubgraphSectionForAgent({ chainId: endpoint.chainId, section: 'associations', agentId, accountIris });
  const { turtle } = emitAssociationsTurtle(endpoint.chainId, items, -1n);
  if (turtle.trim()) await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'associations', turtle, resetContext: false });
}

/** Batch sync feedbacks for all agents: one clear, one emit (concat), one ingest. */
async function syncFeedbacksForBatch(
  endpoint: { url: string; chainId: number; name: string },
  agentIds: string[],
  bulk: BulkSubgraphData,
  agentIriByDidIdentity: Map<string, string>,
): Promise<void> {
  if (!agentIds.length) return;
  await clearSubgraphSectionForAgentBatch({ chainId: endpoint.chainId, section: 'feedbacks', agentIds });
  const turtles: string[] = [];
  for (const agentId of agentIds) {
    const items = bulk.feedbacksByAgentId.get(agentId) ?? [];
    const { turtle } = emitFeedbacksTurtle(endpoint.chainId, items, -1n, agentIriByDidIdentity);
    if (turtle.trim()) turtles.push(turtle);
  }
  const combined = turtles.join('\n\n');
  if (combined.trim())
    await ingestSubgraphTurtleToGraphdb({
      chainId: endpoint.chainId,
      section: 'feedbacks',
      turtle: combined,
      resetContext: false,
      skipAssertionCountMaterialization: true,
    });
}

/** Batch sync validations for all agents: batch clear requests+responses, batch emit, batch ingest. */
async function syncValidationsForBatch(
  endpoint: { url: string; chainId: number; name: string },
  agentIds: string[],
  bulk: BulkSubgraphData,
  agentIriByDidIdentity: Map<string, string>,
): Promise<void> {
  if (!agentIds.length) return;
  await clearSubgraphSectionForAgentBatch({ chainId: endpoint.chainId, section: 'validation-requests', agentIds });
  await clearSubgraphSectionForAgentBatch({ chainId: endpoint.chainId, section: 'validation-responses', agentIds });
  const reqTurtles: string[] = [];
  const resTurtles: string[] = [];
  for (const agentId of agentIds) {
    const reqItems = bulk.validationRequestsByAgentId.get(agentId) ?? [];
    const resItems = bulk.validationResponsesByAgentId.get(agentId) ?? [];
    const { turtle: reqTurtle } = emitValidationRequestsTurtle(endpoint.chainId, reqItems, -1n);
    const { turtle: resTurtle } = emitValidationResponsesTurtle(endpoint.chainId, resItems, -1n, agentIriByDidIdentity);
    if (reqTurtle.trim()) reqTurtles.push(reqTurtle);
    if (resTurtle.trim()) resTurtles.push(resTurtle);
  }
  if (reqTurtles.join('').trim())
    await ingestSubgraphTurtleToGraphdb({
      chainId: endpoint.chainId,
      section: 'validation-requests',
      turtle: reqTurtles.join('\n\n'),
      resetContext: false,
    });
  if (resTurtles.join('').trim())
    await ingestSubgraphTurtleToGraphdb({
      chainId: endpoint.chainId,
      section: 'validation-responses',
      turtle: resTurtles.join('\n\n'),
      resetContext: false,
      skipAssertionCountMaterialization: true,
    });
}

/** Batch sync associations for all agents: batch clear by account IRIs, batch emit, batch ingest. */
async function syncAssociationsForBatch(
  endpoint: { url: string; chainId: number; name: string },
  agentIds: string[],
  bulk: BulkSubgraphData,
  accountIrisByAgentId: Map<string, string[]>,
): Promise<void> {
  const allAccountIris = Array.from(
    new Set(
      [...accountIrisByAgentId.values()].flat().filter((iri) => iri.startsWith('http')),
    ),
  );
  if (!allAccountIris.length) return;
  await clearSubgraphSectionForAgentBatch({
    chainId: endpoint.chainId,
    section: 'associations',
    agentIds: [],
    accountIris: allAccountIris,
  });
  const turtles: string[] = [];
  for (const agentId of agentIds) {
    const accountIris = accountIrisByAgentId.get(agentId) ?? [];
    if (!accountIris.length) continue;
    const accountIds = accountIris
      .map((iri) => {
        try {
          const parts = new URL(iri).pathname.split('/').filter(Boolean);
          const idx = parts.indexOf('account');
          if (idx >= 0 && parts[idx + 2]) return String(parts[idx + 2]).toLowerCase();
        } catch {}
        return null;
      })
      .filter((x): x is string => x != null && /^0x[0-9a-f]{40}$/.test(x));
    const seen = new Set<string>();
    const items: any[] = [];
    for (const accId of accountIds) {
      for (const a of bulk.associationsByAccountId.get(accId) ?? []) {
        if (a?.id && !seen.has(a.id)) {
          seen.add(a.id);
          items.push(a);
        }
      }
    }
    const { turtle } = emitAssociationsTurtle(endpoint.chainId, items, -1n);
    if (turtle.trim()) turtles.push(turtle);
  }
  const combined = turtles.join('\n\n');
  if (combined.trim())
    await ingestSubgraphTurtleToGraphdb({ chainId: endpoint.chainId, section: 'associations', turtle: combined, resetContext: false });
}

async function runSync(command: SyncCommand, resetContext: boolean = false) {
  // Global one-shot commands (not chain/subgraph specific)
  if (command === 'subgraph-ping') {
    const chainIdRaw = process.env.SYNC_CHAIN_ID?.trim() || '1';
    const chainId = Number(chainIdRaw);
    const endpoint = SUBGRAPH_ENDPOINTS.find((ep) => ep.chainId === chainId);
    if (!endpoint?.url) {
      console.error('[sync] subgraph-ping: no subgraph url for chainId', chainId, '- set SYNC_CHAIN_ID and env vars');
      process.exitCode = 1;
      return;
    }
    console.info('[sync] subgraph-ping', { chainId, name: endpoint.name, url: endpoint.url.replace(/\/[^/]*$/, '/...') });
    try {
      const { ok, status, body } = await pingSubgraph(endpoint.url);
      if (ok) {
        console.info('[sync] subgraph-ping OK', { status, response: JSON.stringify(body, null, 2).slice(0, 500) });
      } else {
        console.error('[sync] subgraph-ping FAILED', { status, response: JSON.stringify(body, null, 2) });
        process.exitCode = 1;
      }
    } catch (e: any) {
      console.error('[sync] subgraph-ping error:', e?.message ?? e);
      process.exitCode = 1;
    }
    return;
  }

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

  if (command === 'reset-chain-agents') {
    const chainIdRaw = process.env.SYNC_CHAIN_ID?.trim();
    if (!chainIdRaw) {
      console.error('[sync] reset-chain-agents requires SYNC_CHAIN_ID (single chain, e.g. SYNC_CHAIN_ID=59144)');
      process.exitCode = 1;
      return;
    }
    const chainId = Number(chainIdRaw);
    if (!Number.isFinite(chainId)) {
      console.error('[sync] reset-chain-agents: SYNC_CHAIN_ID must be a number', { value: chainIdRaw });
      process.exitCode = 1;
      return;
    }
    const endpoint = SUBGRAPH_ENDPOINTS.find((ep) => ep.chainId === chainId);
    // NOTE: reset-chain-agents clears GraphDB contexts and recomputes analytics graphs.
    // It does not need to contact the subgraph. Allow running even if the chain is not configured
    // in SUBGRAPH_ENDPOINTS so users can clean up partial/incorrect data.
    if (!endpoint) {
      console.warn(
        `[sync] reset-chain-agents: no subgraph endpoint configured for chainId=${chainId}. Continuing anyway (will only reset GraphDB data).`,
      );
    }
    console.info('[sync] [reset-chain-agents] start', { chainId, name: endpoint?.name ?? `chain-${chainId}` });
    await ingestSubgraphTurtleToGraphdb({ chainId, section: 'agents', turtle: '', resetContext: true });
    await clearCheckpointsForChain(chainId);
    await materializeAssertionSummariesForChain(chainId, {});
    await runTrustIndexForChains({ chainIdsCsv: String(chainId), resetContext: true });
    await syncTrustLedgerToGraphdbForChain(chainId, { resetContext: true });
    console.info('[sync] [reset-chain-agents] done', { chainId });
    return;
  }

  // agent-pipeline: run incremental agent sync (next batch from subgraph), then process only that batch.
  // Repeated runs fetch the next batch (default 5000). Use --limit=N to change batch size (e.g. --limit=25000 for one big run).
  if (command === 'agent-pipeline') {
    const chainIdRaw = process.env.SYNC_CHAIN_ID?.trim();
    if (!chainIdRaw) {
      console.error('[sync] agent-pipeline requires SYNC_CHAIN_ID (single chain, e.g. SYNC_CHAIN_ID=59144)');
      process.exitCode = 1;
      return;
    }
    const chainId = Number(chainIdRaw);
    if (!Number.isFinite(chainId)) {
      console.error('[sync] agent-pipeline: SYNC_CHAIN_ID must be a number', { value: chainIdRaw });
      process.exitCode = 1;
      return;
    }
    const endpoint = SUBGRAPH_ENDPOINTS.find((ep) => ep.chainId === chainId);
    if (!endpoint) {
      console.error(`[sync] agent-pipeline: no subgraph endpoint for chainId=${chainId}. Configure subgraph/RPC for that chain.`);
      process.exitCode = 1;
      return;
    }
    const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
    try {
      await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);
    } catch (e: any) {
      console.error(
        '[sync] agent-pipeline: GraphDB is not reachable. The pipeline requires GraphDB to store agents, feedbacks, validations, assertion summaries, and trust data.\n' +
          `  Ensure GraphDB is running and GRAPHDB_BASE_URL (${baseUrl}) / GRAPHDB_REPOSITORY (${repository}) are correct.\n` +
          `  Error: ${String(e?.message ?? e)}`,
      );
      process.exitCode = 1;
      return;
    }
    const agentIdsArg = process.argv.find((a) => a.startsWith('--agent-ids='));
    const limitArg = process.argv.find((a) => a.startsWith('--limit='));
    const ensureAgentArg = process.argv.includes('--ensure-agent');
    let agentIds: string[];
    if (agentIdsArg) {
      const csv = String(agentIdsArg.split('=')[1] ?? '').trim();
      agentIds = csv ? csv.split(',').map((s) => s.trim()).filter((s) => /^\d+$/.test(s)) : [];
      if (!agentIds.length) {
        console.error('[sync] agent-pipeline: --agent-ids= must be comma-separated numeric ids');
        process.exitCode = 1;
        return;
      }
    } else {
      // Always run incremental agent sync first; then process only the batch just ingested.
      // Repeated runs fetch the next batch (e.g. next 5000) and process only that batch.
      const ingestedIds = await syncAgents(endpoint, false);
      if (!ingestedIds.length) {
        console.info('[sync] [agent-pipeline] no new agents from subgraph (caught up). Run again later for more.');
        return;
      }
      agentIds = ingestedIds.sort((a, b) => Number(a) - Number(b));
      console.info('[sync] [agent-pipeline] will process batch just synced', { chainId, agentCount: agentIds.length });
      const cooldownMs = Math.max(0, Number(process.env.SUBGRAPH_COOLDOWN_AFTER_AGENTS_MS) || 3000);
      if (cooldownMs) {
        console.info('[sync] [agent-pipeline] cooldown before bulk load', { cooldownMs });
        await sleep(cooldownMs);
      }
    }
    const bulk = agentIdsArg ? undefined : await loadBulkSubgraphData(endpoint);
    const useBatch = bulk != null;
    const agentIriByDidIdentity =
      useBatch ? await listAgentIriByDidIdentity(chainId).catch(() => new Map<string, string>()) : undefined;
    const timing =
      process.env.SYNC_TIMING === '1' ||
      process.env.SYNC_TIMING === 'true' ||
      process.argv.some((a) => a === '--timing');
    const fullTiming = timing;
    const logTotalMs = process.env.SYNC_LOG_AGENT_MS === '1' || fullTiming;
    const skipValidations =
      process.env.SYNC_SKIP_VALIDATIONS === '1' || process.env.SYNC_SKIP_VALIDATIONS === 'true';
    const skipAssociations =
      process.env.SYNC_SKIP_ASSOCIATIONS === '1' || process.env.SYNC_SKIP_ASSOCIATIONS === 'true';
    console.info('[sync] [agent-pipeline] start', {
      chainId,
      name: endpoint.name,
      agentCount: agentIds.length,
      batchMode: useBatch,
      timing: fullTiming ? 'full (per-step ms)' : logTotalMs ? 'totalMs per agent' : 'off (use --timing for breakdown)',
      skipValidations,
      skipAssociations,
    });

    if (useBatch) {
      const t0 = Date.now();
      const accountIrisByAgentId = await listAccountsForAgentBatch(chainId, agentIds);
      const allAccounts = Array.from(new Set([...accountIrisByAgentId.values()].flat()));
      if (allAccounts.length) await syncAccountTypesForChain(chainId, { accounts: allAccounts });
      const tAcct = fullTiming ? Date.now() : 0;
      await syncAgentCardsForAgentIds(chainId, agentIds, {});
      const tCards = fullTiming ? Date.now() : 0;
      await syncFeedbacksForBatch(endpoint, agentIds, bulk!, agentIriByDidIdentity!);
      const tFb = fullTiming ? Date.now() : 0;
      if (!skipValidations) await syncValidationsForBatch(endpoint, agentIds, bulk!, agentIriByDidIdentity!);
      const tVal = fullTiming ? Date.now() : 0;
      if (!skipAssociations) await syncAssociationsForBatch(endpoint, agentIds, bulk!, accountIrisByAgentId);
      const tAssoc = fullTiming ? Date.now() : 0;
      await materializeAssertionSummariesForChain(chainId, { agentIds });
      const tSum = fullTiming ? Date.now() : 0;
      await runTrustIndexForChains({ chainIdsCsv: String(chainId), resetContext: false, agentIds });
      const tTrustIndex = fullTiming ? Date.now() : 0;
      await syncTrustLedgerToGraphdbForChain(chainId, { agentIds });
      const tEnd = Date.now();
      if (fullTiming) {
        console.info('[sync] [agent-pipeline] batch complete', {
          agentCount: agentIds.length,
          ms: tEnd - t0,
          accounts: tAcct - t0,
          cards: tCards - tAcct,
          feedbacks: tFb - tCards,
          validations: tVal - tFb,
          associations: tAssoc - tVal,
          summaries: tSum - tAssoc,
          trustIndex: tTrustIndex - tSum,
          trustLedger: tEnd - tTrustIndex,
        });
      }
    } else {
    for (let i = 0; i < agentIds.length; i++) {
      const agentId = agentIds[i];
      const t0 = Date.now();
      if (agentIdsArg || ensureAgentArg) await syncSingleAgent(endpoint, agentId);
      const tAccounts = fullTiming ? Date.now() : 0;
      const accounts = await listAccountsForAgent(chainId, agentId);
      if (accounts.length) await syncAccountTypesForChain(chainId, { accounts });
      const tCards = fullTiming ? Date.now() : 0;
      await syncAgentCardsForAgentIds(chainId, [agentId], {});
      const tFb = fullTiming ? Date.now() : 0;
      await syncFeedbacksForAgent(endpoint, agentId, bulk, agentIriByDidIdentity);
      if (!skipValidations) await syncValidationsForAgent(endpoint, agentId, bulk, agentIriByDidIdentity);
      const tVal = fullTiming ? Date.now() : 0;
      if (!skipAssociations) await syncAssociationsForAgent(endpoint, agentId, bulk, accounts);
      const tAssoc = fullTiming ? Date.now() : 0;
      const tSum = fullTiming ? Date.now() : 0;
      await materializeAssertionSummariesForChain(chainId, { agentIds: [agentId] });
      const tTrust = fullTiming ? Date.now() : 0;
      await runTrustIndexForChains({ chainIdsCsv: String(chainId), resetContext: false, agentIds: [agentId] });
      const tEnd = Date.now();
      const totalMs = tEnd - t0;
      if (fullTiming) {
        console.info('[sync] [agent-pipeline] agent', {
          index: i + 1,
          total: agentIds.length,
          agentId,
          ms: totalMs,
          accounts: tAccounts - t0,
          cards: tCards - tAccounts,
          feedbacks: tFb - tCards,
          validations: tVal - tFb,
          associations: tAssoc - tVal,
          summaries: tSum - tAssoc,
          trustIndex: tEnd - tTrust,
        });
      } else if (logTotalMs) {
        console.info('[sync] [agent-pipeline] agent', {
          index: i + 1,
          total: agentIds.length,
          agentId,
          ms: totalMs,
        });
      } else if ((i + 1) % 100 === 0 || i === 0) {
        console.info('[sync] [agent-pipeline] agent', { index: i + 1, total: agentIds.length, agentId });
      }
    }
      await syncTrustLedgerToGraphdbForChain(chainId, { agentIds });
    }
    console.info('[sync] [agent-pipeline] done', { chainId, agentCount: agentIds.length });
    return;
  }

  // Filter endpoints by chainId if specified.
  // Default:
  // - most commands: chainId=1,11155111 (mainnet + sepolia)
  // - erc8004-events: chainId=1 only (so it can run without per-chain WS config)
  const chainIdFilterRaw = process.env.SYNC_CHAIN_ID || (command === 'erc8004-events' ? '1' : '1,11155111');
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
    const dflt = command === 'erc8004-events' ? '1' : '1,11155111';
    console.info(`[sync] defaulting to chainId=${dflt}. Set SYNC_CHAIN_ID to override.`);
  }

  const endpoints = SUBGRAPH_ENDPOINTS.filter((ep) => chainIdFilters.includes(ep.chainId));

  if (endpoints.length === 0) {
    console.error(
      `[sync] no subgraph endpoints configured for chainId(s): ${chainIdFilters.join(', ')}. Available: ${SUBGRAPH_ENDPOINTS.map((e) => `${e.name} (${e.chainId})`).join(', ') || 'none'}`,
    );
    const missing = chainIdFilters.filter((cid) => !SUBGRAPH_ENDPOINTS.some((e) => e.chainId === cid));
    for (const cid of missing) {
      const label =
        cid === 1
          ? 'mainnet'
          : cid === 11155111
            ? 'sepolia'
            : cid === 84532
              ? 'base-sepolia'
              : cid === 11155420
                ? 'op-sepolia'
                : cid === 59144
                  ? 'linea-mainnet'
                  : 'unknown';
      const graphqlKey =
        cid === 1
          ? 'ETH_MAINNET_GRAPHQL_URL'
          : cid === 11155111
            ? 'ETH_SEPOLIA_GRAPHQL_URL'
            : cid === 84532
              ? 'BASE_SEPOLIA_GRAPHQL_URL'
              : cid === 11155420
                ? 'OP_SEPOLIA_GRAPHQL_URL'
                : cid === 59144
                  ? 'LINEA_MAINNET_GRAPHQL_URL'
                  : `RPC_GRAPHQL_URL_${cid}`;
      const rpcKey =
        cid === 1
          ? 'ETH_MAINNET_RPC_HTTP_URL'
          : cid === 11155111
            ? 'ETH_SEPOLIA_RPC_HTTP_URL'
            : cid === 84532
              ? 'BASE_SEPOLIA_RPC_HTTP_URL'
              : cid === 11155420
                ? 'OP_SEPOLIA_RPC_HTTP_URL'
                : cid === 59144
                  ? 'LINEA_MAINNET_RPC_HTTP_URL'
                  : `RPC_HTTP_URL_${cid}`;

      const hasGraphql = process.env[graphqlKey] && process.env[graphqlKey]!.trim();
      const hasRpc = process.env[rpcKey] && process.env[rpcKey]!.trim();

      console.error(`[sync] chainId=${cid} (${label}) is not configured:`);
      if (!hasGraphql) console.error(`  ❌ ${graphqlKey} is not set or empty`);
      else console.info(`  ✓ ${graphqlKey} is set`);
      // Many jobs need RPC; if it's unset, still hint here because users often run account-types next.
      if (!hasRpc) console.error(`  ⚠️  ${rpcKey} is not set or empty (required for account-types / watcher polling)`);
      else console.info(`  ✓ ${rpcKey} is set`);

      if (cid === 59144) {
        console.error(`[sync] For Linea mainnet subgraph "agentic-trust-layer-linea-mainnet", typical Graph Studio URL looks like:`);
        console.error(`  - LINEA_MAINNET_GRAPHQL_URL=https://api.studio.thegraph.com/query/<account>/<subgraph>/version/latest`);
      }
    }
    process.exitCode = 1;
    return;
  }

  console.info(`[sync] processing chainId(s): ${chainIdFilters.join(', ')} (${endpoints.map((e) => e.name).join(', ')})`);

  if (command === 'erc8004-events') {
    // Long-running process: watch on-chain events. Agent sync is off by default; set SYNC_ERC8004_EVENTS_SYNC_AGENTS=1 to enable.
    const eventsSyncAgents = process.env.SYNC_ERC8004_EVENTS_SYNC_AGENTS === '1' || process.env.SYNC_ERC8004_EVENTS_SYNC_AGENTS === 'true';
    await watchErc8004RegistryEventsMultiChain({
      endpoints,
      onAgentIds: eventsSyncAgents
        ? async ({ chainId, agentIds }) => {
            const ep = endpoints.find((e) => e.chainId === chainId);
            if (!ep) return;
            const uniq = Array.from(new Set((agentIds || []).map((x) => String(x || '').trim()).filter(Boolean)));
            if (!uniq.length) return;
            console.info('[sync] [erc8004-events] processing agentIds', { chainId, count: uniq.length, agentIds: uniq.slice(0, 50) });
            for (const id of uniq) {
              try {
                const synced = await syncErc8004AgentById(ep, id);
                await syncAgentCardsForAgentIds(chainId, [id]).catch(() => {});
                await syncMcpForAgentIds(chainId, [id]).catch(() => {});
                const acctTargets = [synced.ownerAddress, synced.agentWallet].filter((x): x is string => Boolean(x));
                if (acctTargets.length) {
                  await syncAccountTypesForChain(chainId, { accounts: acctTargets }).catch(() => {});
                }
                await syncTrustLedgerToGraphdbForChain(chainId, { agentIds: [id] }).catch(() => {});
              } catch (e: any) {
                console.warn('[sync] [erc8004-events] agent sync failed (non-fatal)', {
                  chainId,
                  agentId: id,
                  error: String(e?.message || e || ''),
                });
              }
            }
          }
        : undefined,
    });
    if (!eventsSyncAgents) {
      console.info('[sync] [erc8004-events] agent sync disabled by default. Set SYNC_ERC8004_EVENTS_SYNC_AGENTS=1 to enable.');
    }
    return;
  }

  for (const endpoint of endpoints) {
    try {
      switch (command) {
        case 'watch':
          // handled outside runSync
          break;
        case 'agents':
          await syncAgents(endpoint, resetContext);
          break;
        case 'erc8122':
          await syncErc8122(endpoint, resetContext);
          break;
        case 'erc8122-registries':
          await syncErc8122Registries(endpoint, resetContext);
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
          await materializeAssertionSummariesForChain(endpoint.chainId, {});
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
        case 'mcp':
          await syncMcpForChain(endpoint.chainId, {});
          break;
        case 'materialize-services':
          await materializeRegistrationServicesForChain(endpoint.chainId, {});
          break;
        case 'trust-ledger': {
          await syncTrustLedgerToGraphdbForChain(endpoint.chainId, { resetContext });
          break;
        }
        case 'ens-parent': {
          const parentArg = process.argv.find((a) => a.startsWith('--parent=')) ?? '';
          const parent = parentArg ? String(parentArg.split('=')[1] || '').trim() : '8004-agent.eth';
          await syncEnsParentForChain(endpoint.chainId, { parentName: parent, resetContext });
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
        case 'all': {
          // Agent sync (8004 + 8122) is off by default in watch/all. Set SYNC_AUTO_SYNC_AGENTS=1 to include.
          const autoSyncAgents = process.env.SYNC_AUTO_SYNC_AGENTS === '1' || process.env.SYNC_AUTO_SYNC_AGENTS === 'true';
          if (autoSyncAgents) {
            await syncAgents(endpoint, resetContext);
            await syncErc8122(endpoint, resetContext);
            await syncErc8122Registries(endpoint, resetContext);
          } else {
            console.info('[sync] [all] skipping agents/erc8122 (default). Set SYNC_AUTO_SYNC_AGENTS=1 to include.');
          }
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
        }
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
