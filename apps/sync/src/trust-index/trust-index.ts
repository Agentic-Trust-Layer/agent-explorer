import { ensureRepositoryExistsOrThrow, getGraphdbConfigFromEnv, queryGraphdb, updateGraphdb, uploadTurtleToRepository, clearStatements } from '../graphdb-http.js';

type EvidenceRow = {
  agentIri: string;
  agentId: string; // numeric string
  createdAtTime: number | null;
  updatedAtTime: number | null;
  feedbackAssertionCount: number;
  validationAssertionCount: number;
  hasA2A: boolean;
  hasMCP: boolean;
  hasA2AAgentCardJson: boolean;
  hasMCPAgentCardJson: boolean;
  // Descriptor-derived signals (from ERC-8004 identity registrationJson)
  hasA2AFromRegistration: boolean;
  hasMCPFromRegistration: boolean;
  hasWebFromRegistration: boolean;
  hasOASFServiceFromRegistration: boolean;
  hasA2AAgentCardUrlFromRegistration: boolean;
  hasMCPAgentCardUrlFromRegistration: boolean;
  registrationSkillCount: number;
  registrationDomainCount: number;
  x402SupportFromRegistration: boolean;
  agentDescriptorCompleteness01: number; // 0..1
  identityDescriptorCompleteness01: number; // 0..1
  hasIdentitySkills: boolean;
  hasIdentityDomains: boolean;
  hasA2ASkills: boolean;
  hasA2ADomains: boolean;
  hasMCPSkills: boolean;
  hasMCPDomains: boolean;
};

type ExistingAtiRow = {
  computedAt: number | null;
  bundleJson: string | null;
  version: string | null;
};

type TrustIndexComponentName =
  | 'existence'
  | 'identity'
  | 'descriptor'
  | 'capability'
  | 'experience'
  | 'freshness'
  | 'endpoints'
  | 'agentCard';

type TrustIndexComponent = {
  component: TrustIndexComponentName;
  score: number; // 0..100
  weight: number; // 0..1
  evidenceCountsJson: string;
};

type TrustIndexComputed = {
  chainId: number;
  agentIri: string;
  agentId: string;
  overallScore: number; // integer 0..100
  overallConfidence: number; // 0..1
  computedAt: number; // unix seconds
  version: string;
  bundleJson: string;
  components: TrustIndexComponent[];
  sourceUpdatedAtTime: number; // unix seconds (best-effort)
};

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function clamp01(x: number): number {
  return clamp(Number.isFinite(x) ? x : 0, 0, 1);
}

function clamp100(x: number): number {
  return clamp(Number.isFinite(x) ? x : 0, 0, 100);
}

function safeJsonObject(raw: string | null): Record<string, any> | null {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s) return null;
  try {
    const v = JSON.parse(s);
    if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
    return v as Record<string, any>;
  } catch {
    return null;
  }
}

function deriveRegistrationSignals(registrationJson: string | null): {
  hasA2AFromRegistration: boolean;
  hasMCPFromRegistration: boolean;
  hasWebFromRegistration: boolean;
  hasOASFServiceFromRegistration: boolean;
  hasA2AAgentCardUrlFromRegistration: boolean;
  hasMCPAgentCardUrlFromRegistration: boolean;
  registrationSkillCount: number;
  registrationDomainCount: number;
  x402SupportFromRegistration: boolean;
} {
  const obj = safeJsonObject(registrationJson);
  const services = Array.isArray(obj?.services) ? (obj?.services as any[]) : [];
  let hasA2A = false;
  let hasMCP = false;
  let hasWeb = false;
  let hasOASF = false;
  let hasA2ACardUrl = false;
  let hasMCPCardUrl = false;
  let skillCount = 0;
  let domainCount = 0;

  for (const s of services) {
    if (!s || typeof s !== 'object') continue;
    const name = String((s as any).name ?? (s as any).type ?? '').trim().toLowerCase();
    const endpoint = String((s as any).endpoint ?? '').trim();
    if (name === 'a2a') {
      hasA2A = true;
      if (endpoint && endpoint.toLowerCase().includes('agent-card.json')) hasA2ACardUrl = true;
      const a2aSkills = (s as any).a2aSkills;
      if (Array.isArray(a2aSkills)) skillCount += a2aSkills.filter((x: any) => typeof x === 'string' && x.trim()).length;
    } else if (name === 'mcp') {
      hasMCP = true;
      // Heuristic: if an MCP service points at an agent-card-like JSON, treat as partial evidence.
      if (endpoint && endpoint.toLowerCase().includes('agent-card')) hasMCPCardUrl = true;
      const skills = (s as any).skills;
      if (Array.isArray(skills)) skillCount += skills.filter((x: any) => typeof x === 'string' && x.trim()).length;
    } else if (name === 'oasf') {
      hasOASF = true;
      const skills = (s as any).skills;
      const domains = (s as any).domains;
      if (Array.isArray(skills)) skillCount += skills.filter((x: any) => typeof x === 'string' && x.trim()).length;
      if (Array.isArray(domains)) domainCount += domains.filter((x: any) => typeof x === 'string' && x.trim()).length;
    } else if (name === 'web') {
      hasWeb = true;
    }
  }

  const x402Support = Boolean((obj as any)?.x402support ?? (obj as any)?.x402Support);

  return {
    hasA2AFromRegistration: hasA2A,
    hasMCPFromRegistration: hasMCP,
    hasWebFromRegistration: hasWeb,
    hasOASFServiceFromRegistration: hasOASF,
    hasA2AAgentCardUrlFromRegistration: hasA2ACardUrl,
    hasMCPAgentCardUrlFromRegistration: hasMCPCardUrl,
    registrationSkillCount: Math.max(0, Math.trunc(skillCount)),
    registrationDomainCount: Math.max(0, Math.trunc(domainCount)),
    x402SupportFromRegistration: x402Support,
  };
}

function parseChainIds(csv: string): number[] {
  const ids = (csv || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n))
    .map((n) => Math.trunc(n))
    .filter((n) => n > 0);
  return Array.from(new Set(ids));
}

function asNumberBinding(b: any): number | null {
  const raw = b?.value;
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function asStringBinding(b: any): string | null {
  const v = b?.value;
  return typeof v === 'string' && v.trim() ? v : null;
}

function asBoolBinding(b: any): boolean {
  const v = b?.value;
  if (typeof v === 'boolean') return v;
  const s = String(v ?? '').trim().toLowerCase();
  if (s === 'true') return true;
  if (s === 'false') return false;
  const n = Number(s);
  if (Number.isFinite(n)) return n !== 0;
  return false;
}

function jsonLiteral(s: string): string {
  // Turtle string literal with escaping
  const esc = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${esc}"`;
}

function trustIndexIri(chainId: number, agentId: string): string {
  return `https://www.agentictrust.io/id/agent-trust-index/${chainId}/${encodeURIComponent(agentId)}`;
}

function trustComponentIri(chainId: number, agentId: string, component: string): string {
  return `https://www.agentictrust.io/id/agent-trust-component/${chainId}/${encodeURIComponent(agentId)}/${encodeURIComponent(component)}`;
}

function defaultWeights(): Record<TrustIndexComponentName, number> {
  return {
    // Sum = 1.0
    existence: 0.08,
    identity: 0.12,
    descriptor: 0.18,
    capability: 0.22,
    experience: 0.16,
    freshness: 0.12,
    endpoints: 0.06,
    agentCard: 0.06,
  };
}

function scoreLogCount(count: number, capAt: number): number {
  const c = Math.max(0, Math.trunc(count));
  if (c <= 0) return 0;
  // log-scaled 0..100 where c==capAt -> 100
  const x = Math.log10(1 + c);
  const xMax = Math.log10(1 + Math.max(1, capAt));
  return clamp((x / xMax) * 100, 0, 100);
}

function scoreFreshness(updatedAtTime: number | null, now: number): number {
  const t = updatedAtTime != null && Number.isFinite(updatedAtTime) ? updatedAtTime : null;
  if (!t) return 0;
  const ageDays = Math.max(0, (now - t) / (24 * 3600));
  // Simple decay: 1 day => ~98, 30 days => ~60, 180 days => ~10
  const score = 100 * Math.exp(-ageDays / 45);
  return clamp(score, 0, 100);
}

function computeTrustIndex(row: EvidenceRow, opts: { chainId: number; now: number; version: string }): TrustIndexComputed {
  const weights = defaultWeights();

  const hasA2AAny = row.hasA2A || row.hasA2AFromRegistration;
  const hasMCPAny = row.hasMCP || row.hasMCPFromRegistration;

  const existenceScore = 100; // row only exists if we have erc8004:agentId
  const identityScore = 100; // row only exists if we have 8004 identity+agentId
  const descriptorScore = clamp100(
    100 *
      clamp01(
        // agent descriptor completeness matters slightly more than identity descriptor for discovery UX
        0.55 * row.agentDescriptorCompleteness01 + 0.45 * row.identityDescriptorCompleteness01,
      ),
  );
  const capabilityScore = scoreLogCount(row.validationAssertionCount, 50);
  const experienceScore = scoreLogCount(row.feedbackAssertionCount, 50);
  const endpointsScore = hasA2AAny || hasMCPAny || row.hasWebFromRegistration ? 100 : 0;
  const agentCardScore = clamp100(
    100 *
      clamp01(
        // Prefer A2A card presence if available, else MCP.
        row.hasA2AAgentCardJson
          ? 1
          : row.hasMCPAgentCardJson
            ? 0.85
            : row.hasA2AAgentCardUrlFromRegistration
              ? 0.65
              : row.hasMCPAgentCardUrlFromRegistration
                ? 0.55
                : 0,
      ),
  );
  const freshnessScore = scoreFreshness(row.updatedAtTime, opts.now);

  const components: TrustIndexComponent[] = [
    {
      component: 'existence',
      score: existenceScore,
      weight: weights.existence,
      evidenceCountsJson: JSON.stringify({ hasErc8004AgentId: true }),
    },
    {
      component: 'identity',
      score: identityScore,
      weight: weights.identity,
      evidenceCountsJson: JSON.stringify({ hasIdentity8004: true }),
    },
    {
      component: 'descriptor',
      score: descriptorScore,
      weight: weights.descriptor,
      evidenceCountsJson: JSON.stringify({
        agentDescriptorCompleteness01: row.agentDescriptorCompleteness01,
        identityDescriptorCompleteness01: row.identityDescriptorCompleteness01,
        hasIdentitySkills: row.hasIdentitySkills,
        hasIdentityDomains: row.hasIdentityDomains,
        hasA2ASkills: row.hasA2ASkills,
        hasA2ADomains: row.hasA2ADomains,
        hasMCPSkills: row.hasMCPSkills,
        hasMCPDomains: row.hasMCPDomains,
        registrationSkillCount: row.registrationSkillCount,
        registrationDomainCount: row.registrationDomainCount,
        x402SupportFromRegistration: row.x402SupportFromRegistration,
      }),
    },
    {
      component: 'capability',
      score: capabilityScore,
      weight: weights.capability,
      evidenceCountsJson: JSON.stringify({ validationAssertionCount: row.validationAssertionCount }),
    },
    {
      component: 'experience',
      score: experienceScore,
      weight: weights.experience,
      evidenceCountsJson: JSON.stringify({ feedbackAssertionCount: row.feedbackAssertionCount }),
    },
    {
      component: 'freshness',
      score: freshnessScore,
      weight: weights.freshness,
      evidenceCountsJson: JSON.stringify({ updatedAtTime: row.updatedAtTime }),
    },
    {
      component: 'endpoints',
      score: endpointsScore,
      weight: weights.endpoints,
      evidenceCountsJson: JSON.stringify({
        hasA2A: row.hasA2A,
        hasMCP: row.hasMCP,
        hasA2AFromRegistration: row.hasA2AFromRegistration,
        hasMCPFromRegistration: row.hasMCPFromRegistration,
        hasWebFromRegistration: row.hasWebFromRegistration,
        hasOASFServiceFromRegistration: row.hasOASFServiceFromRegistration,
      }),
    },
    {
      component: 'agentCard',
      score: agentCardScore,
      weight: weights.agentCard,
      evidenceCountsJson: JSON.stringify({
        hasA2AAgentCardJson: row.hasA2AAgentCardJson,
        hasMCPAgentCardJson: row.hasMCPAgentCardJson,
        hasA2AAgentCardUrlFromRegistration: row.hasA2AAgentCardUrlFromRegistration,
        hasMCPAgentCardUrlFromRegistration: row.hasMCPAgentCardUrlFromRegistration,
      }),
    },
  ];

  const weighted = components.reduce((acc, c) => acc + c.score * c.weight, 0);
  const overallScore = clamp(Math.round(weighted), 0, 100);

  const sampleStrength = clamp((Math.log10(1 + row.feedbackAssertionCount + row.validationAssertionCount) / Math.log10(1 + 100)) * 0.7 + 0.3, 0, 1);
  const freshnessFactor = clamp(freshnessScore / 100, 0, 1);
  const overallConfidence = clamp(sampleStrength * 0.7 + freshnessFactor * 0.3, 0, 1);

  const sourceUpdatedAtTime = Math.max(0, Math.trunc(row.updatedAtTime ?? row.createdAtTime ?? 0));
  const bundleJson = JSON.stringify({
    version: opts.version,
    chainId: opts.chainId,
    agentId: row.agentId,
    inputs: {
      agentIri: row.agentIri,
      createdAtTime: row.createdAtTime,
      updatedAtTime: row.updatedAtTime,
      feedbackAssertionCount: row.feedbackAssertionCount,
      validationAssertionCount: row.validationAssertionCount,
      hasA2A: hasA2AAny,
      hasMCP: hasMCPAny,
      hasA2AAgentCardJson: row.hasA2AAgentCardJson,
      hasMCPAgentCardJson: row.hasMCPAgentCardJson,
      hasA2AFromRegistration: row.hasA2AFromRegistration,
      hasMCPFromRegistration: row.hasMCPFromRegistration,
      hasWebFromRegistration: row.hasWebFromRegistration,
      hasOASFServiceFromRegistration: row.hasOASFServiceFromRegistration,
      hasA2AAgentCardUrlFromRegistration: row.hasA2AAgentCardUrlFromRegistration,
      hasMCPAgentCardUrlFromRegistration: row.hasMCPAgentCardUrlFromRegistration,
      registrationSkillCount: row.registrationSkillCount,
      registrationDomainCount: row.registrationDomainCount,
      x402SupportFromRegistration: row.x402SupportFromRegistration,
      agentDescriptorCompleteness01: row.agentDescriptorCompleteness01,
      identityDescriptorCompleteness01: row.identityDescriptorCompleteness01,
      hasIdentitySkills: row.hasIdentitySkills,
      hasIdentityDomains: row.hasIdentityDomains,
      hasA2ASkills: row.hasA2ASkills,
      hasA2ADomains: row.hasA2ADomains,
      hasMCPSkills: row.hasMCPSkills,
      hasMCPDomains: row.hasMCPDomains,
    },
    computed: {
      overallScore,
      overallConfidence,
      components: components.map((c) => ({ component: c.component, score: c.score, weight: c.weight })),
    },
    cache: {
      sourceUpdatedAtTime,
    },
  });

  return {
    chainId: opts.chainId,
    agentIri: row.agentIri,
    agentId: row.agentId,
    overallScore,
    overallConfidence,
    computedAt: opts.now,
    version: opts.version,
    bundleJson,
    components,
    sourceUpdatedAtTime,
  };
}

function buildDeleteSparql(ctxIri: string, iris: string[]): string {
  const values = iris.map((i) => `<${i}>`).join(' ');
  return [
    'PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>',
    '',
    `WITH <${ctxIri}>`,
    'DELETE { ?s ?p ?o }',
    'WHERE {',
    `  VALUES ?s { ${values} }`,
    '  ?s ?p ?o .',
    '}',
    '',
  ].join('\n');
}

function toAtiTurtle(records: TrustIndexComputed[], chainId: number): { turtle: string; subjects: string[] } {
  const subjects: string[] = [];
  const lines: string[] = [];
  lines.push(
    'PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    '',
  );

  for (const r of records) {
    const ati = trustIndexIri(chainId, r.agentId);
    subjects.push(ati);
    lines.push(`<${ati}> a analytics:AgentTrustIndex, prov:Entity ;`);
    lines.push(`  analytics:forAgent <${r.agentIri}> ;`);
    lines.push(`  analytics:chainId ${chainId} ;`);
    lines.push(`  analytics:agentId ${jsonLiteral(r.agentId)} ;`);
    lines.push(`  analytics:overallScore ${Math.trunc(r.overallScore)} ;`);
    lines.push(`  analytics:overallConfidence ${r.overallConfidence.toFixed(4)} ;`);
    lines.push(`  analytics:version ${jsonLiteral(r.version)} ;`);
    lines.push(`  analytics:computedAt ${Math.trunc(r.computedAt)} ;`);
    lines.push(`  analytics:bundleJson ${jsonLiteral(r.bundleJson)} .`);
    lines.push('');

    for (const c of r.components) {
      const compIri = trustComponentIri(chainId, r.agentId, c.component);
      subjects.push(compIri);
      lines.push(`<${compIri}> a analytics:AgentTrustComponent, prov:Entity ;`);
      lines.push(`  analytics:componentOf <${ati}> ;`);
      lines.push(`  analytics:component ${jsonLiteral(c.component)} ;`);
      lines.push(`  analytics:score ${c.score.toFixed(4)} ;`);
      lines.push(`  analytics:weight ${c.weight.toFixed(6)} ;`);
      lines.push(`  analytics:evidenceCountsJson ${jsonLiteral(c.evidenceCountsJson)} .`);
      lines.push('');
    }
  }

  return { turtle: lines.join('\n'), subjects };
}

async function fetchEvidencePage(args: {
  baseUrl: string;
  repository: string;
  auth: any;
  ctxIri: string;
  limit: number;
  offset: number;
}): Promise<EvidenceRow[]> {
  const sparql = [
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    'PREFIX core: <https://agentictrust.io/ontology/core#>',
    'PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>',
    'PREFIX dcterms: <http://purl.org/dc/terms/>',
    'PREFIX schema: <http://schema.org/>',
    '',
    'SELECT',
    '  ?agent ?agentId ?identity8004',
    '  ?createdAtTime ?updatedAtTime ?feedbackAssertionCount ?validationAssertionCount',
    '  ?hasA2A ?hasMCP ?hasA2AAgentCardJson ?hasMCPAgentCardJson',
    '  ?registrationJson',
    '  ?agentDescCompleteness ?idDescCompleteness',
    '  ?hasIdentitySkills ?hasIdentityDomains ?hasA2ASkills ?hasA2ADomains ?hasMCPSkills ?hasMCPDomains',
    'WHERE {',
    '  {',
    '    SELECT ?agent ?agentId ?identity8004 WHERE {',
    `      GRAPH <${args.ctxIri}> {`,
    '        ?agent a core:AIAgent ; core:hasIdentity ?identity8004 .',
    '        ?identity8004 a erc8004:AgentIdentity8004 ; erc8004:agentId ?agentId .',
    '      }',
    '    }',
    '    ORDER BY xsd:integer(?agentId) ASC(STR(?agent))',
    `    LIMIT ${Math.trunc(args.limit)}`,
    `    OFFSET ${Math.trunc(args.offset)}`,
    '  }',
    '',
    `  GRAPH <${args.ctxIri}> {`,
    '    OPTIONAL { ?agent core:createdAtTime ?createdAtTime . }',
    '    OPTIONAL { ?agent core:updatedAtTime ?updatedAtTime . }',
    '    OPTIONAL { ?agent core:hasFeedbackAssertionSummary ?fbS . ?fbS core:feedbackAssertionCount ?feedbackAssertionCount . }',
    '    OPTIONAL { ?agent core:hasValidationAssertionSummary ?vrS . ?vrS core:validationAssertionCount ?validationAssertionCount . }',
    '',
    // Agent descriptor completeness (title/description/image)
    '    BIND(EXISTS { ?agent core:hasDescriptor ?_agentDescT . ?_agentDescT dcterms:title ?_agentDescTitle . } AS ?_hasAdTitle)',
    '    BIND(EXISTS { ?agent core:hasDescriptor ?_agentDescD . ?_agentDescD dcterms:description ?_agentDescDesc . } AS ?_hasAdDesc)',
    '    BIND(EXISTS { ?agent core:hasDescriptor ?_agentDescI . ?_agentDescI schema:image ?_agentDescImg . } AS ?_hasAdImg)',
    '    BIND(((IF(?_hasAdTitle, 1, 0) + IF(?_hasAdDesc, 1, 0) + IF(?_hasAdImg, 1, 0)) / 3.0) AS ?agentDescCompleteness)',
    '',
    // Identity descriptor completeness (registrationJson + image + registeredBy + registryNamespace)
    '    BIND(EXISTS { ?identity8004 core:hasDescriptor ?_idDescRj . ?_idDescRj erc8004:registrationJson ?_rj . } AS ?_hasRegJson)',
    '    BIND(EXISTS { ?identity8004 core:hasDescriptor ?_idDescImg . ?_idDescImg schema:image ?_idImg . } AS ?_hasIdImg)',
    '    BIND(EXISTS { ?identity8004 core:hasDescriptor ?_idDescRb . ?_idDescRb erc8004:registeredBy ?_rb . } AS ?_hasRegBy)',
    '    BIND(EXISTS { ?identity8004 core:hasDescriptor ?_idDescRn . ?_idDescRn erc8004:registryNamespace ?_rn . } AS ?_hasRegNs)',
    '    BIND(((IF(?_hasRegJson, 1, 0) + IF(?_hasIdImg, 1, 0) + IF(?_hasRegBy, 1, 0) + IF(?_hasRegNs, 1, 0)) / 4.0) AS ?idDescCompleteness)',
    '',
    // Pull the raw registrationJson for descriptor-derived service signals (do NOT store full JSON in analytics; parse into booleans/counts)
    '    OPTIONAL {',
    '      ?identity8004 core:hasDescriptor ?_idDescRegJson .',
    '      ?_idDescRegJson erc8004:registrationJson ?registrationJson .',
    '    }',
    '',
    // Endpoint + protocol existence signals
    '    BIND(EXISTS {',
    '      ?agent core:hasIdentity ?_idA2A .',
    '      ?_idA2A core:hasServiceEndpoint ?_seA2A .',
    '      ?_seA2A core:hasProtocol ?_pA2A .',
    '      ?_pA2A a core:A2AProtocol .',
    '    } AS ?hasA2A)',
    '    BIND(EXISTS {',
    '      ?agent core:hasIdentity ?_idMCP .',
    '      ?_idMCP core:hasServiceEndpoint ?_seMCP .',
    '      ?_seMCP core:hasProtocol ?_pMCP .',
    '      ?_pMCP a core:MCPProtocol .',
    '    } AS ?hasMCP)',
    '',
    // Agent-card JSON present on protocol descriptor
    '    BIND(EXISTS {',
    '      ?agent core:hasIdentity ?_idA2A2 .',
    '      ?_idA2A2 core:hasServiceEndpoint ?_seA2A2 .',
    '      ?_seA2A2 core:hasProtocol ?_pA2A2 .',
    '      ?_pA2A2 a core:A2AProtocol ;',
    '            core:hasDescriptor ?_pA2ADesc .',
    '      ?_pA2ADesc core:agentCardJson ?_acj .',
    '    } AS ?hasA2AAgentCardJson)',
    '    BIND(EXISTS {',
    '      ?agent core:hasIdentity ?_idMCP2 .',
    '      ?_idMCP2 core:hasServiceEndpoint ?_seMCP2 .',
    '      ?_seMCP2 core:hasProtocol ?_pMCP2 .',
    '      ?_pMCP2 a core:MCPProtocol ;',
    '            core:hasDescriptor ?_pMCPDesc .',
    '      ?_pMCPDesc core:agentCardJson ?_mcj .',
    '    } AS ?hasMCPAgentCardJson)',
    '',
    // Skills/domains existence signals (already materialized in KB; no JSON parsing here)
    '    BIND(EXISTS { ?identity8004 core:hasDescriptor ?_idDescSkill . ?_idDescSkill core:hasSkill ?_idSkill . } AS ?hasIdentitySkills)',
    '    BIND(EXISTS { ?identity8004 core:hasDescriptor ?_idDescDomain . ?_idDescDomain core:hasDomain ?_idDomain . } AS ?hasIdentityDomains)',
    '    BIND(EXISTS { ?agent core:hasIdentity ?_idA2A3 . ?_idA2A3 core:hasServiceEndpoint ?_seA2A3 . ?_seA2A3 core:hasProtocol ?_pA2A3 . ?_pA2A3 a core:A2AProtocol ; core:hasSkill ?_a2aSkill . } AS ?hasA2ASkills)',
    '    BIND(EXISTS { ?agent core:hasIdentity ?_idA2A4 . ?_idA2A4 core:hasServiceEndpoint ?_seA2A4 . ?_seA2A4 core:hasProtocol ?_pA2A4 . ?_pA2A4 a core:A2AProtocol ; core:hasDomain ?_a2aDomain . } AS ?hasA2ADomains)',
    '    BIND(EXISTS { ?agent core:hasIdentity ?_idMCP3 . ?_idMCP3 core:hasServiceEndpoint ?_seMCP3 . ?_seMCP3 core:hasProtocol ?_pMCP3 . ?_pMCP3 a core:MCPProtocol ; core:hasSkill ?_mcpSkill . } AS ?hasMCPSkills)',
    '    BIND(EXISTS { ?agent core:hasIdentity ?_idMCP4 . ?_idMCP4 core:hasServiceEndpoint ?_seMCP4 . ?_seMCP4 core:hasProtocol ?_pMCP4 . ?_pMCP4 a core:MCPProtocol ; core:hasDomain ?_mcpDomain . } AS ?hasMCPDomains)',
    '  }',
    '}',
    '',
  ].join('\n');

  const json = await queryGraphdb(args.baseUrl, args.repository, args.auth, sparql);
  const bindings = json?.results?.bindings;
  if (!Array.isArray(bindings)) return [];

  function maxTime(a: number | null, b: number | null): number | null {
    if (a == null) return b == null ? null : Math.trunc(b);
    if (b == null) return Math.trunc(a);
    return Math.max(Math.trunc(a), Math.trunc(b));
  }

  // De-duplicate per agentId in TS to avoid heavy GROUP BY in GraphDB.
  // We take max for numeric rollups and OR for boolean rollups.
  const map = new Map<string, EvidenceRow & { _registrationJson: string | null }>();

  for (const b of bindings) {
    const agentIri = asStringBinding(b.agent) ?? '';
    const agentId = asStringBinding(b.agentId) ?? '';
    if (!agentIri || !agentId) continue;

    const createdAtTime = asNumberBinding(b.createdAtTime);
    const updatedAtTime = asNumberBinding(b.updatedAtTime);
    const feedbackAssertionCount = Math.max(0, Math.trunc(asNumberBinding(b.feedbackAssertionCount) ?? 0));
    const validationAssertionCount = Math.max(0, Math.trunc(asNumberBinding(b.validationAssertionCount) ?? 0));
    const hasA2A = asBoolBinding(b.hasA2A);
    const hasMCP = asBoolBinding(b.hasMCP);
    const hasA2AAgentCardJson = asBoolBinding(b.hasA2AAgentCardJson);
    const hasMCPAgentCardJson = asBoolBinding(b.hasMCPAgentCardJson);
    const registrationJson = asStringBinding(b.registrationJson);
    const agentDescriptorCompleteness01 = clamp01(asNumberBinding(b.agentDescCompleteness) ?? 0);
    const identityDescriptorCompleteness01 = clamp01(asNumberBinding(b.idDescCompleteness) ?? 0);
    const hasIdentitySkills = asBoolBinding(b.hasIdentitySkills);
    const hasIdentityDomains = asBoolBinding(b.hasIdentityDomains);
    const hasA2ASkills = asBoolBinding(b.hasA2ASkills);
    const hasA2ADomains = asBoolBinding(b.hasA2ADomains);
    const hasMCPSkills = asBoolBinding(b.hasMCPSkills);
    const hasMCPDomains = asBoolBinding(b.hasMCPDomains);

    const existing = map.get(agentId);
    if (!existing) {
      map.set(agentId, {
        agentIri,
        agentId,
        createdAtTime: createdAtTime != null ? Math.trunc(createdAtTime) : null,
        updatedAtTime: updatedAtTime != null ? Math.trunc(updatedAtTime) : null,
        feedbackAssertionCount,
        validationAssertionCount,
        hasA2A,
        hasMCP,
        hasA2AAgentCardJson,
        hasMCPAgentCardJson,
        hasA2AFromRegistration: false,
        hasMCPFromRegistration: false,
        hasWebFromRegistration: false,
        hasOASFServiceFromRegistration: false,
        hasA2AAgentCardUrlFromRegistration: false,
        hasMCPAgentCardUrlFromRegistration: false,
        registrationSkillCount: 0,
        registrationDomainCount: 0,
        x402SupportFromRegistration: false,
        agentDescriptorCompleteness01,
        identityDescriptorCompleteness01,
        hasIdentitySkills,
        hasIdentityDomains,
        hasA2ASkills,
        hasA2ADomains,
        hasMCPSkills,
        hasMCPDomains,
        _registrationJson: registrationJson,
      });
      continue;
    }

    existing.createdAtTime = maxTime(existing.createdAtTime, createdAtTime != null ? Math.trunc(createdAtTime) : null);
    existing.updatedAtTime = maxTime(existing.updatedAtTime, updatedAtTime != null ? Math.trunc(updatedAtTime) : null);
    existing.feedbackAssertionCount = Math.max(existing.feedbackAssertionCount, feedbackAssertionCount);
    existing.validationAssertionCount = Math.max(existing.validationAssertionCount, validationAssertionCount);
    existing.hasA2A = existing.hasA2A || hasA2A;
    existing.hasMCP = existing.hasMCP || hasMCP;
    existing.hasA2AAgentCardJson = existing.hasA2AAgentCardJson || hasA2AAgentCardJson;
    existing.hasMCPAgentCardJson = existing.hasMCPAgentCardJson || hasMCPAgentCardJson;
    existing.agentDescriptorCompleteness01 = Math.max(existing.agentDescriptorCompleteness01, agentDescriptorCompleteness01);
    existing.identityDescriptorCompleteness01 = Math.max(existing.identityDescriptorCompleteness01, identityDescriptorCompleteness01);
    existing.hasIdentitySkills = existing.hasIdentitySkills || hasIdentitySkills;
    existing.hasIdentityDomains = existing.hasIdentityDomains || hasIdentityDomains;
    existing.hasA2ASkills = existing.hasA2ASkills || hasA2ASkills;
    existing.hasA2ADomains = existing.hasA2ADomains || hasA2ADomains;
    existing.hasMCPSkills = existing.hasMCPSkills || hasMCPSkills;
    existing.hasMCPDomains = existing.hasMCPDomains || hasMCPDomains;
    if (!existing._registrationJson && registrationJson) existing._registrationJson = registrationJson;
  }

  const out: EvidenceRow[] = [];
  for (const r of map.values()) {
    const reg = deriveRegistrationSignals(r._registrationJson);
    const { _registrationJson: _ignored, ...base } = r;
    out.push({ ...(base as EvidenceRow), ...reg });
  }

  // Preserve deterministic ordering within page
  out.sort((a, b) => Number(a.agentId) - Number(b.agentId));
  return out;
}

async function fetchExistingAtiByAgentIds(args: {
  baseUrl: string;
  repository: string;
  auth: any;
  analyticsCtxIri: string;
  chainId: number;
  agentIds: string[];
}): Promise<Map<string, ExistingAtiRow>> {
  const out = new Map<string, ExistingAtiRow>();
  if (!args.agentIds.length) return out;
  const values = args.agentIds.map((id) => jsonLiteral(id)).join(' ');
  const sparql = [
    'PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
    '',
    'SELECT ?agentId ?computedAt ?bundleJson ?version WHERE {',
    `  GRAPH <${args.analyticsCtxIri}> {`,
    '    ?ati a analytics:AgentTrustIndex, prov:Entity ;',
    `         analytics:chainId ${Math.trunc(args.chainId)} ;`,
    '         analytics:agentId ?agentId ;',
    '         analytics:computedAt ?computedAt ;',
    '         analytics:version ?version .',
    '    OPTIONAL { ?ati analytics:bundleJson ?bundleJson }',
    `    VALUES ?agentId { ${values} }`,
    '  }',
    '}',
    '',
  ].join('\n');

  const json = await queryGraphdb(args.baseUrl, args.repository, args.auth, sparql);
  const bindings = json?.results?.bindings;
  if (!Array.isArray(bindings)) return out;
  for (const b of bindings) {
    const agentId = asStringBinding(b.agentId);
    if (!agentId) continue;
    out.set(agentId, {
      computedAt: asNumberBinding(b.computedAt),
      bundleJson: asStringBinding(b.bundleJson),
      version: asStringBinding(b.version),
    });
  }
  return out;
}

function shouldSkipRecompute(args: {
  evidenceUpdatedAtTime: number | null;
  existing: ExistingAtiRow | null;
  ttlSeconds: number;
  now: number;
  version: string;
  force: boolean;
  evidenceInputs?: Record<string, any> | null;
}): boolean {
  if (args.force) return false;
  if (!args.existing) return false;
  if (!args.existing.computedAt || args.existing.computedAt <= 0) return false;
  if (args.existing.version && args.existing.version !== args.version) return false;

  const age = args.now - args.existing.computedAt;
  if (age > args.ttlSeconds) return false;

  let cachedSourceUpdatedAtTime: number | null = null;
  let cachedInputs: Record<string, any> | null = null;
  try {
    if (args.existing.bundleJson) {
      const parsed = JSON.parse(args.existing.bundleJson);
      const t = parsed?.cache?.sourceUpdatedAtTime;
      if (Number.isFinite(Number(t))) cachedSourceUpdatedAtTime = Math.trunc(Number(t));
      if (parsed && typeof parsed === 'object' && parsed.inputs && typeof parsed.inputs === 'object') {
        cachedInputs = parsed.inputs as Record<string, any>;
      }
    }
  } catch {}

  const src = cachedSourceUpdatedAtTime != null ? cachedSourceUpdatedAtTime : null;
  const ev = args.evidenceUpdatedAtTime != null ? Math.trunc(args.evidenceUpdatedAtTime) : null;
  if (!src || !ev) return false;
  if (ev > src) return false;

  // If evidence inputs changed (e.g. agent-card now present), don't skip even if updatedAtTime didn't change.
  if (args.evidenceInputs && cachedInputs) {
    const keysToCompare = Object.keys(args.evidenceInputs);
    for (const k of keysToCompare) {
      const cur = (args.evidenceInputs as any)[k];
      const prev = (cachedInputs as any)[k];
      if (JSON.stringify(cur) !== JSON.stringify(prev)) return false;
    }
  }
  return true;
}

export async function runTrustIndexForChains(args: {
  chainIdsCsv: string;
  resetContext: boolean;
}): Promise<void> {
  const chainIds = parseChainIds(args.chainIdsCsv || '1,11155111');
  if (!chainIds.length) throw new Error('[trust-index] no chainIds provided');

  // Intentionally no runtime tuning knobs (no flags/env), except SYNC_CHAIN_ID.
  const ttlSeconds = 6 * 3600;
  const pageSize = 500;
  const batchSize = 200;
  const version = 'kb-cts-v1';

  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  await ensureRepositoryExistsOrThrow(baseUrl, repository, auth);

  const now = nowSeconds();

  for (const chainId of chainIds) {
    const kbCtxIri = `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
    const analyticsCtxIri = `https://www.agentictrust.io/graph/data/analytics/${chainId}`;
    console.info('[trust-index] start', {
      chainId,
      kbCtxIri,
      analyticsCtxIri,
      resetContext: args.resetContext,
      force: false,
      ttlSeconds,
      pageSize,
      batchSize,
      version,
    });

    if (args.resetContext) {
      console.info('[trust-index] clearing analytics context', { chainId, analyticsCtxIri });
      await clearStatements(baseUrl, repository, auth, { context: analyticsCtxIri });
    }

    let offset = 0;
    let processed = 0;
    let recomputed = 0;
    let skipped = 0;

    for (;;) {
      const page = await fetchEvidencePage({ baseUrl, repository, auth, ctxIri: kbCtxIri, limit: pageSize, offset });
      if (!page.length) break;

      processed += page.length;
      offset += page.length;

      // Pre-fetch existing ATI for skip logic in this page (in chunks to avoid huge VALUES)
      const existingMap = new Map<string, ExistingAtiRow>();
      for (let i = 0; i < page.length; i += 200) {
        const chunkIds = page.slice(i, i + 200).map((r) => r.agentId);
        const m = await fetchExistingAtiByAgentIds({
          baseUrl,
          repository,
          auth,
          analyticsCtxIri,
          chainId,
          agentIds: chunkIds,
        });
        for (const [k, v] of m.entries()) existingMap.set(k, v);
      }

      const toCompute: EvidenceRow[] = [];
      for (const r of page) {
        const existing = existingMap.get(r.agentId) ?? null;
        const evUpd = r.updatedAtTime ?? r.createdAtTime ?? null;
        const evidenceInputs = {
          hasA2A: r.hasA2A,
          hasMCP: r.hasMCP,
          hasA2AAgentCardJson: r.hasA2AAgentCardJson,
          hasMCPAgentCardJson: r.hasMCPAgentCardJson,
          hasA2AFromRegistration: r.hasA2AFromRegistration,
          hasMCPFromRegistration: r.hasMCPFromRegistration,
          hasWebFromRegistration: r.hasWebFromRegistration,
          hasOASFServiceFromRegistration: r.hasOASFServiceFromRegistration,
          hasA2AAgentCardUrlFromRegistration: r.hasA2AAgentCardUrlFromRegistration,
          hasMCPAgentCardUrlFromRegistration: r.hasMCPAgentCardUrlFromRegistration,
          registrationSkillCount: r.registrationSkillCount,
          registrationDomainCount: r.registrationDomainCount,
          x402SupportFromRegistration: r.x402SupportFromRegistration,
          agentDescriptorCompleteness01: r.agentDescriptorCompleteness01,
          identityDescriptorCompleteness01: r.identityDescriptorCompleteness01,
          hasIdentitySkills: r.hasIdentitySkills,
          hasIdentityDomains: r.hasIdentityDomains,
          hasA2ASkills: r.hasA2ASkills,
          hasA2ADomains: r.hasA2ADomains,
          hasMCPSkills: r.hasMCPSkills,
          hasMCPDomains: r.hasMCPDomains,
          feedbackAssertionCount: r.feedbackAssertionCount,
          validationAssertionCount: r.validationAssertionCount,
        };
        const skip = shouldSkipRecompute({
          evidenceUpdatedAtTime: evUpd,
          existing,
          ttlSeconds,
          now,
          version,
          force: false,
          evidenceInputs,
        });
        if (skip) skipped++;
        else toCompute.push(r);
      }

      // Compute + upsert in batches
      for (let i = 0; i < toCompute.length; i += batchSize) {
        const batch = toCompute.slice(i, i + batchSize);
        if (!batch.length) continue;

        const computed = batch.map((r) => computeTrustIndex(r, { chainId, now, version }));
        recomputed += computed.length;

        const { turtle, subjects } = toAtiTurtle(computed, chainId);
        const deleteSparql = buildDeleteSparql(analyticsCtxIri, subjects);
        await updateGraphdb(baseUrl, repository, auth, deleteSparql, { timeoutMs: 120_000, retries: 3 });
        await uploadTurtleToRepository(baseUrl, repository, auth, { turtle, context: analyticsCtxIri });
      }

      console.info('[trust-index] progress', { chainId, processed, recomputed, skipped, offset });
    }

    console.info('[trust-index] done', { chainId, processed, recomputed, skipped });
  }
}

