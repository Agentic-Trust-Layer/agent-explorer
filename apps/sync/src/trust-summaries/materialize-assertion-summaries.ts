import {
  ensureRepositoryExistsOrThrow,
  getGraphdbConfigFromEnv,
  queryGraphdb,
  updateGraphdb,
  uploadTurtleToRepository,
} from '../graphdb-http.js';
import { escapeTurtleString, iriEncodeSegment, rdfPrefixes } from '../rdf/common.js';

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

function feedbackSummaryIri(chainId: number, agentId: string): string {
  return `<https://www.agentictrust.io/id/feedback-assertion-summary/${chainId}/${iriEncodeSegment(agentId)}>`;
}

function validationSummaryIri(chainId: number, agentId: string): string {
  return `<https://www.agentictrust.io/id/validation-assertion-summary/${chainId}/${iriEncodeSegment(agentId)}>`;
}

function asNumBinding(b: any): number | null {
  const raw = b?.value;
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function asStrBinding(b: any): string | null {
  const v = b?.value;
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

async function clearExistingSummaries(args: {
  baseUrl: string;
  repository: string;
  auth: any;
  ctx: string;
}): Promise<void> {
  const { baseUrl, repository, auth, ctx } = args;
  const sparqlUpdate = `
PREFIX core: <https://agentictrust.io/ontology/core#>
WITH <${ctx}>
DELETE { ?agent core:hasFeedbackAssertionSummary ?sum . }
WHERE  { ?agent core:hasFeedbackAssertionSummary ?sum . } ;
WITH <${ctx}>
DELETE { ?agent core:hasValidationAssertionSummary ?sum . }
WHERE  { ?agent core:hasValidationAssertionSummary ?sum . } ;
WITH <${ctx}>
DELETE { ?sum ?p ?o . }
WHERE  { ?sum a core:FeedbackAssertionSummary ; ?p ?o . } ;
WITH <${ctx}>
DELETE { ?sum ?p ?o . }
WHERE  { ?sum a core:ValidationAssertionSummary ; ?p ?o . } ;
`;
  await updateGraphdb(baseUrl, repository, auth, sparqlUpdate);
}

export async function materializeAssertionSummariesForChain(
  chainId: number,
  opts?: { limit?: number; pageSize?: number },
): Promise<{ processedAgents: number; emittedAgents: number }> {
  const maxAgents = typeof opts?.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : 100_000;
  const pageSize =
    typeof opts?.pageSize === 'number' && Number.isFinite(opts.pageSize) && opts.pageSize > 0 ? Math.trunc(opts.pageSize) : 100;

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const ctx = chainContext(chainId);
  console.info('[sync] [assertion-summaries] start', { chainId, ctx, maxAgents, pageSize });

  await clearExistingSummaries({ baseUrl, repository, auth, ctx });
  console.info('[sync] [assertion-summaries] cleared existing summaries', { chainId, ctx });

  let offset = 0;
  let processedAgents = 0;
  let emittedAgents = 0;

  const agentPageSparql = (pageOffset: number) => `
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?agent ?agentId WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent ;
           core:hasIdentity ?id .
    ?id a erc8004:AgentIdentity8004 ;
        erc8004:agentId ?agentId .
  }
}
ORDER BY xsd:integer(?agentId) ASC(STR(?agent))
LIMIT ${pageSize}
OFFSET ${Math.trunc(pageOffset)}
`;

  const valuesForAgents = (agents: string[]) =>
    agents
      .map((a) => {
        const iri = String(a || '').trim();
        if (!iri) return null;
        return iri.startsWith('<') ? iri : `<${iri}>`;
      })
      .filter((x): x is string => Boolean(x))
      .join(' ');

  // Keep these queries cheap: do counts and MAX timestamps separately.
  // MAX timestamp requires joining SubgraphIngestRecord, which can blow up memory when combined with counts.
  const feedbackCountsSparql = (agentIris: string[]) => `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?agent (COUNT(?fb) AS ?feedbackCount) WHERE {
  GRAPH <${ctx}> {
    VALUES ?agent { ${valuesForAgents(agentIris)} }
    OPTIONAL {
      ?agent core:hasReputationAssertion ?fb .
      ?fb a erc8004:Feedback .
    }
  }
}
GROUP BY ?agent
`;

  const feedbackLastTsSparql = (agentIris: string[]) => `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?agent (MAX(?fbTs) AS ?lastFeedbackTs) WHERE {
  GRAPH <${ctx}> {
    VALUES ?agent { ${valuesForAgents(agentIris)} }
    ?agent core:hasReputationAssertion ?fb .
    ?fb a erc8004:Feedback .
    ?fbRec a erc8004:SubgraphIngestRecord ;
           erc8004:recordsEntity ?fb ;
           erc8004:subgraphTimestamp ?fbTs .
  }
}
GROUP BY ?agent
`;

  const validationCountsSparql = (agentIris: string[]) => `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?agent (COUNT(?va) AS ?validationCount) WHERE {
  GRAPH <${ctx}> {
    VALUES ?agent { ${valuesForAgents(agentIris)} }
    OPTIONAL {
      ?agent core:hasVerificationAssertion ?va .
      ?va a erc8004:ValidationResponse .
    }
  }
}
GROUP BY ?agent
`;

  const validationLastTsSparql = (agentIris: string[]) => `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?agent (MAX(?vaTs) AS ?lastValidationTs) WHERE {
  GRAPH <${ctx}> {
    VALUES ?agent { ${valuesForAgents(agentIris)} }
    ?agent core:hasVerificationAssertion ?va .
    ?va a erc8004:ValidationResponse .
    ?vaRec a erc8004:SubgraphIngestRecord ;
           erc8004:recordsEntity ?va ;
           erc8004:subgraphTimestamp ?vaTs .
  }
}
GROUP BY ?agent
`;

  for (;;) {
    // Phase 1: get a page of agents.
    const resAgents = await queryGraphdb(baseUrl, repository, auth, agentPageSparql(offset));
    const bindingsAgents = Array.isArray(resAgents?.results?.bindings) ? resAgents.results.bindings : [];
    if (!bindingsAgents.length) break;

    const pageAgents: Array<{ agent: string; agentId: string }> = bindingsAgents
      .map((b: any) => ({ agent: asStrBinding(b?.agent), agentId: asStrBinding(b?.agentId) }))
      .filter((x: any) => Boolean(x.agent && x.agentId));

    const agentIris = pageAgents.map((a) => a.agent);

    // Phase 2: compute signals only for those agents (VALUES), to avoid full-graph GROUP BY memory pressure.
    const fbMap = new Map<string, { count: number; lastTs: number | null }>();
    const vaMap = new Map<string, { count: number; lastTs: number | null }>();

    const resFb = await queryGraphdb(baseUrl, repository, auth, feedbackCountsSparql(agentIris));
    const fbBindings = Array.isArray(resFb?.results?.bindings) ? resFb.results.bindings : [];
    for (const b of fbBindings) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      fbMap.set(a, { count: Math.max(0, Math.trunc(asNumBinding(b?.feedbackCount) ?? 0)), lastTs: null });
    }

    const resFbTs = await queryGraphdb(baseUrl, repository, auth, feedbackLastTsSparql(agentIris));
    const fbTsBindings = Array.isArray(resFbTs?.results?.bindings) ? resFbTs.results.bindings : [];
    for (const b of fbTsBindings) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      const prev = fbMap.get(a) ?? { count: 0, lastTs: null };
      prev.lastTs = asNumBinding(b?.lastFeedbackTs);
      fbMap.set(a, prev);
    }

    const resVa = await queryGraphdb(baseUrl, repository, auth, validationCountsSparql(agentIris));
    const vaBindings = Array.isArray(resVa?.results?.bindings) ? resVa.results.bindings : [];
    for (const b of vaBindings) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      vaMap.set(a, { count: Math.max(0, Math.trunc(asNumBinding(b?.validationCount) ?? 0)), lastTs: null });
    }

    const resVaTs = await queryGraphdb(baseUrl, repository, auth, validationLastTsSparql(agentIris));
    const vaTsBindings = Array.isArray(resVaTs?.results?.bindings) ? resVaTs.results.bindings : [];
    for (const b of vaTsBindings) {
      const a = asStrBinding(b?.agent);
      if (!a) continue;
      const prev = vaMap.get(a) ?? { count: 0, lastTs: null };
      prev.lastTs = asNumBinding(b?.lastValidationTs);
      vaMap.set(a, prev);
    }

    const lines: string[] = [rdfPrefixes()];
    for (const a of pageAgents) {
      const agent = a.agent;
      const agentId = a.agentId;

      processedAgents++;
      if (processedAgents > maxAgents) break;

      const fb = fbMap.get(agent) ?? { count: 0, lastTs: null };
      const va = vaMap.get(agent) ?? { count: 0, lastTs: null };
      const fbCount = fb.count;
      const lastFb = fb.lastTs;
      const vaCount = va.count;
      const lastVa = va.lastTs;

      const agentTok = agent.startsWith('<') ? agent : `<${agent}>`;
      const fbSum = feedbackSummaryIri(chainId, agentId);
      const vaSum = validationSummaryIri(chainId, agentId);

      lines.push(`${agentTok} core:hasFeedbackAssertionSummary ${fbSum} .`);
      lines.push(`${fbSum} a core:FeedbackAssertionSummary, prov:Entity ;`);
      lines.push(`  core:feedbackAssertionCount ${fbCount} ;`);
      if (lastFb != null && Number.isFinite(lastFb) && lastFb > 0) lines.push(`  core:lastFeedbackAtTime ${Math.trunc(lastFb)} ;`);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      lines.push('');

      lines.push(`${agentTok} core:hasValidationAssertionSummary ${vaSum} .`);
      lines.push(`${vaSum} a core:ValidationAssertionSummary, prov:Entity ;`);
      lines.push(`  core:validationAssertionCount ${vaCount} ;`);
      if (lastVa != null && Number.isFinite(lastVa) && lastVa > 0) lines.push(`  core:lastValidationAtTime ${Math.trunc(lastVa)} ;`);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      lines.push('');

      // Also store the agentId as a label-like hint on the summaries for easier ad-hoc debugging.
      lines.push(`${fbSum} rdfs:label "feedback-summary/${escapeTurtleString(agentId)}" .`);
      lines.push(`${vaSum} rdfs:label "validation-summary/${escapeTurtleString(agentId)}" .`);
      lines.push('');

      emittedAgents++;
    }

    const turtle = lines.join('\n');
    if (turtle.trim() && emittedAgents > 0) {
      await uploadTurtleToRepository(baseUrl, repository, auth, { context: ctx, turtle });
    }

    offset += pageAgents.length;
    if (processedAgents >= maxAgents) break;
    console.info('[sync] [assertion-summaries] progress', { chainId, processedAgents, emittedAgents, offset });
  }

  console.info('[sync] [assertion-summaries] done', { chainId, processedAgents, emittedAgents });
  return { processedAgents, emittedAgents };
}

