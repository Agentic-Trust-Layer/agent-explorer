import { ingestSubgraphTurtleToGraphdb } from '../graphdb-ingest.js';
import { listAgentsWithMcpEndpoint } from '../graphdb/agents.js';
import { emitMcpProtocolDescriptorHealthTurtle } from '../rdf/emit-mcp-protocol-descriptor.js';
import { fetchMcpSignals } from './mcp-fetch.js';

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

    const { turtle } = emitMcpProtocolDescriptorHealthTurtle({
      didAccount,
      checkedAtTime,
      alive: fetched.alive,
      statusCode: fetched.status,
      tools: fetched.tools,
      prompts: fetched.prompts,
      toolsListJson: fetched.toolsJson,
      promptsListJson: fetched.promptsJson,
    });

    if (turtle.trim()) {
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

