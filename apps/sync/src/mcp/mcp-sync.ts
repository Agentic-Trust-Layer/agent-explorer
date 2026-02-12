import { ingestSubgraphTurtleToGraphdb } from '../graphdb-ingest.js';
import { listAgentsWithMcpEndpoint, listAgentsWithMcpEndpointByAgentIds } from '../graphdb/agents.js';
import { emitMcpProtocolDescriptorHealthTurtle } from '../rdf/emit-mcp-protocol-descriptor.js';
import { fetchMcpSignals } from './mcp-fetch.js';
import { getGraphdbConfigFromEnv, updateGraphdb } from '../graphdb-http.js';

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export async function syncMcpForChain(chainId: number, opts?: { limit?: number }): Promise<void> {
  const limit = typeof opts?.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : 2000;
  console.info('[sync] [mcp] starting', { chainId, limit });

  const rows = await listAgentsWithMcpEndpoint(chainId, limit).catch(() => []);
  console.info('[sync] [mcp] candidates', { chainId, count: rows.length });
  if (!rows.length) return;

  let ok = 0;
  let fail = 0;
  const checkedAtTime = nowSeconds();

  for (const r of rows) {
    const didAccount = (r.didAccount || '').trim();
    const mcpEndpoint = String(r.mcpEndpoint || '').trim();
    if (!didAccount || !mcpEndpoint) {
      fail++;
      continue;
    }

    const fetched = await fetchMcpSignals(mcpEndpoint).catch(() => null);
    if (!fetched) {
      fail++;
      continue;
    }

    const emitted = emitMcpProtocolDescriptorHealthTurtle({
      didAccount,
      checkedAtTime,
      alive: fetched.alive,
      statusCode: fetched.status,
      tools: fetched.tools,
      prompts: fetched.prompts,
      toolsListJson: fetched.toolsJson,
      promptsListJson: fetched.promptsJson,
    });
    const { turtle, protocolDescriptorIri } = emitted;

    if (turtle.trim()) {
      // Best-effort: clear prior health fields so values don't accumulate as multi-valued props.
      try {
        const ctx = chainContext(chainId);
        const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
        const del = `
PREFIX core: <https://agentictrust.io/ontology/core#>
WITH <${ctx}>
DELETE { <${protocolDescriptorIri}> ?p ?o . }
WHERE { OPTIONAL { <${protocolDescriptorIri}> ?p ?o . } }
`;
        await updateGraphdb(baseUrl, repository, auth, del, { timeoutMs: 15_000, retries: 0 });
      } catch {}
      await ingestSubgraphTurtleToGraphdb({
        chainId,
        section: 'mcp',
        turtle,
        resetContext: false,
      });
      ok++;
    } else {
      fail++;
    }
  }

  console.info('[sync] [mcp] complete', { chainId, ok, fail });
}

export async function syncMcpForAgentIds(chainId: number, agentIds: Array<string | number>): Promise<void> {
  const ids = Array.from(new Set((Array.isArray(agentIds) ? agentIds : []).map((x) => String(x || '').trim()).filter(Boolean)));
  console.info('[sync] [mcp] starting (targeted)', { chainId, agentIds: ids.slice(0, 100), count: ids.length });
  if (!ids.length) return;

  const rows = await listAgentsWithMcpEndpointByAgentIds(chainId, ids).catch(() => []);
  console.info('[sync] [mcp] candidates (targeted)', { chainId, count: rows.length });
  if (!rows.length) return;

  let ok = 0;
  let fail = 0;
  const checkedAtTime = nowSeconds();

  for (const r of rows) {
    const didAccount = (r.didAccount || '').trim();
    const mcpEndpoint = String(r.mcpEndpoint || '').trim();
    if (!didAccount || !mcpEndpoint) {
      fail++;
      continue;
    }

    const fetched = await fetchMcpSignals(mcpEndpoint).catch(() => null);
    if (!fetched) {
      fail++;
      continue;
    }

    const emitted = emitMcpProtocolDescriptorHealthTurtle({
      didAccount,
      checkedAtTime,
      alive: fetched.alive,
      statusCode: fetched.status,
      tools: fetched.tools,
      prompts: fetched.prompts,
      toolsListJson: fetched.toolsJson,
      promptsListJson: fetched.promptsJson,
    });
    const { turtle, protocolDescriptorIri } = emitted;

    if (turtle.trim()) {
      try {
        const ctx = chainContext(chainId);
        const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
        const del = `
PREFIX core: <https://agentictrust.io/ontology/core#>
WITH <${ctx}>
DELETE { <${protocolDescriptorIri}> ?p ?o . }
WHERE { OPTIONAL { <${protocolDescriptorIri}> ?p ?o . } }
`;
        await updateGraphdb(baseUrl, repository, auth, del, { timeoutMs: 15_000, retries: 0 });
      } catch {}
      await ingestSubgraphTurtleToGraphdb({
        chainId,
        section: 'mcp',
        turtle,
        resetContext: false,
      });
      ok++;
    } else {
      fail++;
    }
  }

  console.info('[sync] [mcp] complete (targeted)', { chainId, ok, fail });
}

