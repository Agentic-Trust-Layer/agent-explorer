import { fetchA2AAgentCardFromEndpoint } from './agent-card-fetch.js';
import { extractProtocolDataFromAgentUriJson, extractSkillsFromAgentCard, isOasfSkillId } from './skill-extraction.js';
import { listAgentsWithA2AEndpoint } from '../graphdb/agents.js';
import { getGraphdbConfigFromEnv, queryGraphdb, updateGraphdb } from '../graphdb-http.js';
import { ingestSubgraphTurtleToGraphdb } from '../graphdb-ingest.js';
import { getCheckpoint, setCheckpoint } from '../graphdb/checkpoints.js';
import { identity8004DescriptorIri } from '../rdf/common.js';
import { emitA2AProtocolDescriptorTurtle } from '../rdf/emit-a2a-protocol-descriptor.js';
import { emitIdentityDescriptorSkillsDomains } from '../rdf/emit-identity-descriptor-skills-domains.js';
import { createHash } from 'node:crypto';

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

async function protocolDescriptorHasJson(chainId: number, didAccount: string): Promise<boolean> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
ASK {
  GRAPH <${ctx}> {
    <https://www.agentictrust.io/id/protocol-descriptor/a2a/${encodeURIComponent(didAccount).replace(/%/g, '_')}> core:json ?j .
  }
}
`;
  const res = await queryGraphdb(baseUrl, repository, auth, sparql);
  return Boolean(res?.boolean);
}

async function clearExistingProtocolDescriptor(chainId: number, didAccount: string): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const didEnc = encodeURIComponent(didAccount).replace(/%/g, '_');
  const protocolDescriptor = `<https://www.agentictrust.io/id/protocol-descriptor/a2a/${didEnc}>`;
  const protocol = `<https://www.agentictrust.io/id/protocol/a2a/${didEnc}>`;

  const update = `
PREFIX core: <https://agentictrust.io/ontology/core#>
WITH <${ctx}>
DELETE {
  ${protocolDescriptor} ?p ?o .
  ${protocol} ?p2 ?o2 .
  ?skill ?sp ?so .
  ?cls ?cp ?co .
} WHERE {
  OPTIONAL { ${protocolDescriptor} ?p ?o . }
  OPTIONAL { ${protocol} ?p2 ?o2 . }
  OPTIONAL {
    ${protocolDescriptor} core:hasSkill ?skill .
    OPTIONAL { ?skill ?sp ?so . }
    OPTIONAL {
      ?skill core:hasSkillClassification ?cls .
      OPTIONAL { ?cls ?cp ?co . }
    }
  }
};
`;
  await updateGraphdb(baseUrl, repository, auth, update);
}

export async function syncAgentCardsForChain(chainId: number, opts?: { force?: boolean; limit?: number }): Promise<void> {
  // DISABLED: A2A agent card fetching removed for performance
  // This function previously fetched agent cards via HTTP from A2A endpoints, which caused sync performance issues
  console.info(`[sync] [agent-cards] chainId=${chainId} disabled (performance optimization)`);
  return;
  
  const force = opts?.force ?? false;
  const limit = opts?.limit ?? 5000;

  const rows = await listAgentsWithA2AEndpoint(chainId, limit);
  // Fingerprint the input set so watch-mode doesn't redo work when nothing changed.
  // Include didAccount (often derived) and endpoint; include identity + registration JSON since those impact skill merging.
  const fingerprint = createHash('sha256')
    .update(
      rows
        .map((r) =>
          [
            r.agent || '',
            r.a2aEndpoint || '',
            r.didAccount || '',
            r.didIdentity || '',
            r.agentUriJson || '',
          ].join('|'),
        )
        .sort()
        .join('\n'),
    )
    .digest('hex');
  const cpSection = 'agent-cards-fingerprint';
  const prev = await getCheckpoint(chainId, cpSection).catch(() => null);
  if (!force && prev === fingerprint) {
    console.info(`[sync] [agent-cards] chainId=${chainId} unchanged; skipping (agentsWithA2A=${rows.length})`);
    return;
  }

  console.info(`[sync] [agent-cards] chainId=${chainId} agentsWithA2A=${rows.length}`);

  for (const row of rows) {
    const a2aEndpoint = row.a2aEndpoint?.trim();
    if (!a2aEndpoint) continue;
    const didAccount = row.didAccount?.trim();
    if (!didAccount) {
      console.warn('[sync] [agent-cards] missing didAccount; skipping', { chainId, agent: row.agent, a2aEndpoint });
      continue;
    }
    const didIdentity = row.didIdentity?.trim() || null;

    if (!force) {
      const has = await protocolDescriptorHasJson(chainId, didAccount).catch(() => false);
      if (has) continue;
    }

    const fetched = await fetchA2AAgentCardFromEndpoint(a2aEndpoint);
    if (!fetched) {
      console.warn('[sync] [agent-cards] missing or non-json at endpoint', { chainId, didAccount, a2aEndpoint });
      continue;
    }

    const skillsAll = extractSkillsFromAgentCard(fetched.card);
    // Merge in skills from agentURI registration JSON (endpoint-level a2aSkills)
    const regSkills = row.agentUriJson ? extractProtocolDataFromAgentUriJson(row.agentUriJson).a2a.skills : [];
    const combinedSkills = Array.from(new Set([...skillsAll, ...regSkills].map((s) => s.trim()).filter(Boolean)));
    const oasf: string[] = [];
    const other: string[] = [];
    for (const s of combinedSkills) {
      if (isOasfSkillId(s)) oasf.push(s);
      else other.push(s);
    }

    const adIri = didIdentity ? identity8004DescriptorIri(didIdentity) : null;
    const { turtle } = emitA2AProtocolDescriptorTurtle({
      chainId,
      didAccount,
      a2aEndpoint,
      agentCard: fetched.card,
      skills: { oasf, other },
      agentDescriptorIri: adIri,
    });

    await clearExistingProtocolDescriptor(chainId, didAccount).catch(() => {});
    let combinedTurtle = turtle;
    // Also attach these skills to the ERC-8004 identity descriptor (requested)
    if (didIdentity) {
      combinedTurtle +=
        '\n' +
        emitIdentityDescriptorSkillsDomains({
          descriptorIri: identity8004DescriptorIri(didIdentity),
          subjectKey: didIdentity,
          skills: combinedSkills,
          domains: [],
        });
    }
    await ingestSubgraphTurtleToGraphdb({ chainId, section: 'agent-cards', turtle: combinedTurtle, resetContext: false });
  }

  await setCheckpoint(chainId, cpSection, fingerprint).catch(() => {});
}

