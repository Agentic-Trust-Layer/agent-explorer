import '../env';
import { db } from '../db';
import { trustLedgerProcessAgent } from './processor';
import { updateTrustLedgerRankings } from './rankings';

function parseNum(value: string | undefined): number | undefined {
  if (!value || !value.trim()) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

async function processAllAgents(chainId?: number) {
  const chainIdFilter = chainId !== undefined ? 'WHERE chainId = ?' : '';
  const params = chainId !== undefined ? [chainId] : [];
  
  const query = `SELECT DISTINCT chainId, agentId FROM agents ${chainIdFilter} ORDER BY chainId, agentId`;
  const stmt = db.prepare(query);
  let rows: any[] = [];
  
  if (stmt.bind && typeof stmt.bind === 'function') {
    const result = await stmt.bind(...params).all();
    rows = Array.isArray(result?.results) ? result.results : [];
  } else {
    const result = await stmt.all(...params);
    rows = Array.isArray(result) ? result : [];
  }

  console.log(`[badge-process] Processing ${rows.length} agent(s)...`);
  
  let processed = 0;
  let errors = 0;
  
  for (const row of rows) {
    const cId = Number(row?.chainId ?? 0);
    const agentId = String(row?.agentId ?? '');
    if (!agentId) continue;
    
    try {
      await trustLedgerProcessAgent(db, cId, agentId, { evidenceEventId: null, evidence: { source: 'cli' } });
      processed++;
      if (processed % 100 === 0) {
        console.log(`[badge-process] Progress: ${processed}/${rows.length} agents processed`);
      }
    } catch (e: unknown) {
      errors++;
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`[badge-process] Failed to process agent ${agentId} on chain ${cId}:`, msg);
    }
  }
  
  console.log(`[badge-process] Complete: ${processed} processed, ${errors} errors`);
  
  // Update rankings after processing all agents
  if (chainId !== undefined) {
    console.log(`[badge-process] Updating trust ledger rankings for chain ${chainId}...`);
    try {
      await updateTrustLedgerRankings(db, chainId);
      console.log(`[badge-process] Rankings updated for chain ${chainId}`);
    } catch (e) {
      console.error(`[badge-process] Failed to update rankings:`, e);
    }
  } else {
    // Update rankings for all chains
    const chainIds = [...new Set(rows.map(r => Number(r?.chainId ?? 0)).filter(c => c > 0))];
    for (const cId of chainIds) {
      console.log(`[badge-process] Updating trust ledger rankings for chain ${cId}...`);
      try {
        await updateTrustLedgerRankings(db, cId);
        console.log(`[badge-process] Rankings updated for chain ${cId}`);
      } catch (e) {
        console.error(`[badge-process] Failed to update rankings for chain ${cId}:`, e);
      }
    }
  }
}

async function processSingleAgent(chainId: number, agentId: string) {
  console.log(`[badge-process] Processing agent ${agentId} on chain ${chainId}...`);
  try {
    await trustLedgerProcessAgent(db, chainId, agentId, { evidenceEventId: null, evidence: { source: 'cli' } });
    console.log(`[badge-process] Agent ${agentId} processed successfully`);
    
    // Update rankings for the chain
    console.log(`[badge-process] Updating trust ledger rankings for chain ${chainId}...`);
    await updateTrustLedgerRankings(db, chainId);
    console.log(`[badge-process] Rankings updated for chain ${chainId}`);
  } catch (e) {
    console.error(`[badge-process] Failed to process agent:`, e);
    process.exitCode = 1;
  }
}

(async () => {
  const chainId = parseNum(process.env.BADGE_CHAIN_ID);
  const agentId = process.env.BADGE_AGENT_ID?.trim();
  
  if (agentId && chainId !== undefined) {
    await processSingleAgent(chainId, agentId);
  } else {
    await processAllAgents(chainId);
  }
})().catch((e) => {
  console.error('[badge-process] failed', e);
  process.exitCode = 1;
});

