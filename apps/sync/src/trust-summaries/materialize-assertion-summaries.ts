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
    typeof opts?.pageSize === 'number' && Number.isFinite(opts.pageSize) && opts.pageSize > 0 ? Math.trunc(opts.pageSize) : 1000;

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const ctx = chainContext(chainId);
  console.info('[sync] [assertion-summaries] start', { chainId, ctx, maxAgents, pageSize });

  await clearExistingSummaries({ baseUrl, repository, auth, ctx });
  console.info('[sync] [assertion-summaries] cleared existing summaries', { chainId, ctx });

  let offset = 0;
  let processedAgents = 0;
  let emittedAgents = 0;

  for (;;) {
    const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?agent ?agentId ?feedbackCount ?lastFeedbackTs ?validationCount ?lastValidationTs WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent ;
           core:agentId ?agentId .

    OPTIONAL {
      SELECT ?agent (COUNT(?fb) AS ?feedbackCount) (MAX(?fbTs) AS ?lastFeedbackTs) WHERE {
        ?agent core:hasReputationAssertion ?fb .
        ?fb a erc8004:Feedback .
        OPTIONAL {
          ?fbRec a erc8004:SubgraphIngestRecord ;
                 erc8004:recordsEntity ?fb ;
                 erc8004:subgraphTimestamp ?fbTs .
        }
      } GROUP BY ?agent
    }

    OPTIONAL {
      SELECT ?agent (COUNT(?va) AS ?validationCount) (MAX(?vaTs) AS ?lastValidationTs) WHERE {
        ?agent core:hasVerificationAssertion ?va .
        ?va a erc8004:ValidationResponse .
        OPTIONAL {
          ?vaRec a erc8004:SubgraphIngestRecord ;
                 erc8004:recordsEntity ?va ;
                 erc8004:subgraphTimestamp ?vaTs .
        }
      } GROUP BY ?agent
    }
  }
}
ORDER BY xsd:integer(?agentId)
LIMIT ${pageSize}
OFFSET ${offset}
`;

    const res = await queryGraphdb(baseUrl, repository, auth, sparql);
    const bindings = Array.isArray(res?.results?.bindings) ? res.results.bindings : [];
    if (!bindings.length) break;

    const lines: string[] = [rdfPrefixes()];
    for (const b of bindings) {
      const agent = asStrBinding(b?.agent);
      const agentId = asStrBinding(b?.agentId);
      if (!agent || !agentId) continue;

      processedAgents++;
      if (processedAgents > maxAgents) break;

      const fbCount = Math.max(0, Math.trunc(asNumBinding(b?.feedbackCount) ?? 0));
      const lastFb = asNumBinding(b?.lastFeedbackTs);
      const vaCount = Math.max(0, Math.trunc(asNumBinding(b?.validationCount) ?? 0));
      const lastVa = asNumBinding(b?.lastValidationTs);

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

    offset += bindings.length;
    if (processedAgents >= maxAgents) break;
    console.info('[sync] [assertion-summaries] progress', { chainId, processedAgents, emittedAgents, offset });
  }

  console.info('[sync] [assertion-summaries] done', { chainId, processedAgents, emittedAgents });
  return { processedAgents, emittedAgents };
}

