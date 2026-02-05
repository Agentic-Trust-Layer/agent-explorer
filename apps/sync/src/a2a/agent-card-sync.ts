import { ingestSubgraphTurtleToGraphdb } from '../graphdb-ingest.js';
import { listAgentsWithA2AEndpoint } from '../graphdb/agents.js';
import { fetchA2AAgentCardFromEndpoint } from './agent-card-fetch.js';
import { extractDomainsFromAgentCard, extractSkillsFromAgentCard, isOasfDomainId, isOasfSkillId } from './skill-extraction.js';
import { emitA2AProtocolDescriptorTurtle } from '../rdf/emit-a2a-protocol-descriptor.js';
import { identity8004Iri } from '../rdf/common.js';

function partitionOasf(values: string[], isOasf: (v: string) => boolean): { oasf: string[]; other: string[] } {
  const oasfOut: string[] = [];
  const otherOut: string[] = [];
  for (const raw of values) {
    const s = String(raw || '').trim();
    if (!s) continue;
    if (isOasf(s)) oasfOut.push(s);
    else otherOut.push(s);
  }
  // preserve deterministic output
  const uniq = (arr: string[]) => Array.from(new Set(arr));
  return { oasf: uniq(oasfOut), other: uniq(otherOut) };
}

function asIriToken(value: string | null | undefined): string | null {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) return null;
  if (s.startsWith('<') && s.endsWith('>')) return s;
  // assume absolute IRI string
  return `<${s}>`;
}

export async function syncAgentCardsForChain(chainId: number, opts?: { force?: boolean; limit?: number }): Promise<void> {
  const limit = typeof opts?.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : 2000;
  console.info('[sync] [agent-cards] starting', { chainId, limit, force: opts?.force === true });

  // NOTE: we fetch candidate agents from GraphDB (already synced from subgraph registration JSON).
  const rows = await listAgentsWithA2AEndpoint(chainId, limit).catch(() => []);
  console.info('[sync] [agent-cards] candidates', { chainId, count: rows.length });
  if (!rows.length) return;

  let ok = 0;
  let fail = 0;

  for (const r of rows) {
    const didAccount = (r.didAccount || '').trim();
    const a2aEndpoint = String(r.a2aEndpoint || '').trim();
    if (!didAccount || !a2aEndpoint) {
      fail++;
      continue;
    }

    const fetched = await fetchA2AAgentCardFromEndpoint(a2aEndpoint).catch(() => null);
    if (!fetched?.card) {
      fail++;
      continue;
    }

    const skills = partitionOasf(extractSkillsFromAgentCard(fetched.card), isOasfSkillId);
    const domains = partitionOasf(extractDomainsFromAgentCard(fetched.card), isOasfDomainId);

    const agentIriTok = asIriToken(r.agent);
    const identityIriTok = r.didIdentity ? identity8004Iri(String(r.didIdentity).trim()) : null;

    const { turtle } = emitA2AProtocolDescriptorTurtle({
      chainId,
      didAccount,
      a2aEndpoint: fetched.url || a2aEndpoint,
      agentCard: fetched.card,
      skills,
      domains,
      agentIri: agentIriTok,
      identityIri: identityIriTok,
    });

    if (turtle.trim()) {
      await ingestSubgraphTurtleToGraphdb({
        chainId,
        section: 'agent-cards',
        turtle,
        resetContext: false,
      });
      ok++;
    } else {
      fail++;
    }
  }

  console.info('[sync] [agent-cards] complete', { chainId, ok, fail });
}

