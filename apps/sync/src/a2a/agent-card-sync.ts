import { ingestSubgraphTurtleToGraphdb } from '../graphdb-ingest.js';
import { listAgentsWithA2AEndpoint, listAgentsWithA2AEndpointByAgentIds } from '../graphdb/agents.js';
import { fetchA2AAgentCardFromEndpoint } from './agent-card-fetch.js';
import { extractDomainsFromAgentCard, extractSkillsFromAgentCard, isOasfDomainId, isOasfSkillId } from './skill-extraction.js';
import { emitA2AProtocolDescriptorTurtle } from '../rdf/emit-a2a-protocol-descriptor.js';
import { identity8004Iri } from '../rdf/common.js';
import { getGraphdbConfigFromEnv, updateGraphdb } from '../graphdb-http.js';

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

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
      // Best-effort: clear prior A2A nodes for this didAccount so skills/card changes don't accumulate stale triples.
      try {
        const ctx = chainContext(chainId);
        const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
        const did = encodeURIComponent(didAccount).replace(/%/g, '_');
        const seIri = `https://www.agentictrust.io/id/service-endpoint/${did}/a2a`;
        const pIri = `https://www.agentictrust.io/id/protocol/${did}/a2a`;
        const seDescIri = seIri.replace('/id/service-endpoint/', '/id/descriptor/service-endpoint/');
        const pDescIri = pIri.replace('/id/protocol/', '/id/descriptor/protocol/');
        const del = `
PREFIX core: <https://agentictrust.io/ontology/core#>
WITH <${ctx}>
DELETE { <${pIri}> ?pp ?po . <${pDescIri}> ?dp ?do . <${seIri}> ?sp ?so . <${seDescIri}> ?sdp ?sdo . ?skill ?skp ?sko . }
WHERE {
  OPTIONAL { <${pIri}> ?pp ?po . }
  OPTIONAL { <${pDescIri}> ?dp ?do . }
  OPTIONAL { <${seIri}> ?sp ?so . }
  OPTIONAL { <${seDescIri}> ?sdp ?sdo . }
  OPTIONAL { <${pIri}> core:hasSkill ?skill . ?skill ?skp ?sko . }
}
`;
        await updateGraphdb(baseUrl, repository, auth, del, { timeoutMs: 15_000, retries: 0 });
      } catch {}
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

export async function syncAgentCardsForAgentIds(
  chainId: number,
  agentIds: Array<string | number>,
  opts?: { force?: boolean },
): Promise<void> {
  const ids = Array.from(new Set((Array.isArray(agentIds) ? agentIds : []).map((x) => String(x || '').trim()).filter(Boolean)));
  console.info('[sync] [agent-cards] starting (targeted)', { chainId, agentIds: ids.slice(0, 100), count: ids.length, force: opts?.force === true });
  if (!ids.length) return;

  const rows = await listAgentsWithA2AEndpointByAgentIds(chainId, ids).catch(() => []);
  console.info('[sync] [agent-cards] candidates (targeted)', { chainId, count: rows.length });
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
      try {
        const ctx = chainContext(chainId);
        const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
        const did = encodeURIComponent(didAccount).replace(/%/g, '_');
        const seIri = `https://www.agentictrust.io/id/service-endpoint/${did}/a2a`;
        const pIri = `https://www.agentictrust.io/id/protocol/${did}/a2a`;
        const seDescIri = seIri.replace('/id/service-endpoint/', '/id/descriptor/service-endpoint/');
        const pDescIri = pIri.replace('/id/protocol/', '/id/descriptor/protocol/');
        const del = `
PREFIX core: <https://agentictrust.io/ontology/core#>
WITH <${ctx}>
DELETE { <${pIri}> ?pp ?po . <${pDescIri}> ?dp ?do . <${seIri}> ?sp ?so . <${seDescIri}> ?sdp ?sdo . ?skill ?skp ?sko . }
WHERE {
  OPTIONAL { <${pIri}> ?pp ?po . }
  OPTIONAL { <${pDescIri}> ?dp ?do . }
  OPTIONAL { <${seIri}> ?sp ?so . }
  OPTIONAL { <${seDescIri}> ?sdp ?sdo . }
  OPTIONAL { <${pIri}> core:hasSkill ?skill . ?skill ?skp ?sko . }
}
`;
        await updateGraphdb(baseUrl, repository, auth, del, { timeoutMs: 15_000, retries: 0 });
      } catch {}
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

  console.info('[sync] [agent-cards] complete (targeted)', { chainId, ok, fail });
}

