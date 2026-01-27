import type { SemanticSearchService } from './semantic/semantic-search-service.js';
import { kbAgentsQuery } from './graphdb/kb-queries.js';
import { kbAssociationsQuery, kbFeedbacksQuery, kbValidationResponsesQuery } from './graphdb/kb-queries-events.js';
import { kbHydrateAgentsByDid8004 } from './graphdb/kb-queries-hydration.js';
import { getGraphdbConfigFromEnv, queryGraphdb } from './graphdb/graphdb-http.js';

async function runGraphdbQueryBindings(sparql: string): Promise<any[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const result = await queryGraphdb(baseUrl, repository, auth, sparql);
  return Array.isArray(result?.results?.bindings) ? result.results.bindings : [];
}

export type GraphQLKbResolverOptions = {
  semanticSearchService?: SemanticSearchService | null;
};

export function createGraphQLResolversKb(opts?: GraphQLKbResolverOptions) {
  const semanticSearchService = opts?.semanticSearchService ?? null;

  const mapRowToKbAgent = (r: any) => ({
    iri: r.iri,
    uaid: r.uaid,
    agentName: r.agentName,
    agentTypes: r.agentTypes,
    did8004: r.did8004,
    agentId8004: r.agentId8004 == null ? null : Math.trunc(r.agentId8004),
    isSmartAgent: r.agentTypes.includes('https://agentictrust.io/ontology/erc8004#SmartAgent'),
    identity8004:
      r.identity8004Iri && r.did8004
        ? {
            iri: r.identity8004Iri,
            kind: '8004',
            did: r.did8004,
            descriptor:
              r.identity8004DescriptorIri
                ? {
                    iri: r.identity8004DescriptorIri,
                    kind: '8004',
                    json: r.identity8004RegistrationJson,
                    onchainMetadataJson: r.identity8004OnchainMetadataJson,
                    registeredBy: r.identity8004RegisteredBy,
                    registryNamespace: r.identity8004RegistryNamespace,
                    skills: [],
                    domains: [],
                    protocolDescriptors: [
                      r.a2aProtocolDescriptorIri && r.a2aServiceUrl
                        ? {
                            iri: r.a2aProtocolDescriptorIri,
                            protocol: 'a2a',
                            serviceUrl: r.a2aServiceUrl,
                            protocolVersion: r.a2aProtocolVersion,
                            json: r.a2aJson,
                            skills: r.a2aSkills,
                            domains: [],
                          }
                        : null,
                      r.mcpProtocolDescriptorIri && r.mcpServiceUrl
                        ? {
                            iri: r.mcpProtocolDescriptorIri,
                            protocol: 'mcp',
                            serviceUrl: r.mcpServiceUrl,
                            protocolVersion: r.mcpProtocolVersion,
                            json: r.mcpJson,
                            skills: r.mcpSkills,
                            domains: [],
                          }
                        : null,
                    ].filter(Boolean),
                  }
                : null,
          }
        : null,
    identityEns: r.identityEnsIri && r.didEns ? { iri: r.identityEnsIri, kind: 'ens', did: r.didEns } : null,
    ownerAccount: r.ownerAccountIri ? { iri: r.ownerAccountIri } : null,
    walletAccount: r.walletAccountIri ? { iri: r.walletAccountIri } : null,
    operatorAccount: r.operatorAccountIri ? { iri: r.operatorAccountIri } : null,
    smartAccount: r.smartAccountIri ? { iri: r.smartAccountIri } : null,
  });

  return {
    kbAgents: async (args: any) => {
      const where = args?.where ?? null;
      const first = args?.first ?? null;
      const skip = args?.skip ?? null;
      const orderBy = args?.orderBy ?? null;
      const orderDirection = args?.orderDirection ?? null;

      const { rows, total, hasMore } = await kbAgentsQuery({
        where,
        first,
        skip,
        orderBy,
        orderDirection,
      });

      const agents = rows.map((r) => mapRowToKbAgent(r));

      return { agents, total, hasMore };
    },

    kbAgent: async (args: any) => {
      const chainId = Number(args?.chainId);
      const agentId8004 = Number(args?.agentId8004);
      if (!Number.isFinite(chainId) || !Number.isFinite(agentId8004)) return null;
      const did8004 = `did:8004:${Math.trunc(chainId)}:${Math.trunc(agentId8004)}`;
      const res = await kbAgentsQuery({ where: { chainId: Math.trunc(chainId), did8004 }, first: 1, skip: 0 });
      if (!res.rows.length) return null;
      const agent = res.rows[0]!;
      return {
        iri: agent.iri,
        uaid: agent.uaid,
        agentName: agent.agentName,
        agentTypes: agent.agentTypes,
        did8004: agent.did8004,
        agentId8004: agent.agentId8004 == null ? null : Math.trunc(agent.agentId8004),
        isSmartAgent: agent.agentTypes.includes('https://agentictrust.io/ontology/erc8004#SmartAgent'),
        identity8004:
          agent.identity8004Iri && agent.did8004
            ? {
                iri: agent.identity8004Iri,
                kind: '8004',
                did: agent.did8004,
                descriptor:
                  agent.identity8004DescriptorIri
                    ? {
                        iri: agent.identity8004DescriptorIri,
                        kind: '8004',
                        json: agent.identity8004RegistrationJson,
                        onchainMetadataJson: agent.identity8004OnchainMetadataJson,
                        registeredBy: agent.identity8004RegisteredBy,
                        registryNamespace: agent.identity8004RegistryNamespace,
                        skills: [],
                        domains: [],
                        protocolDescriptors: [
                          agent.a2aProtocolDescriptorIri && agent.a2aServiceUrl
                            ? {
                                iri: agent.a2aProtocolDescriptorIri,
                                protocol: 'a2a',
                                serviceUrl: agent.a2aServiceUrl,
                                protocolVersion: agent.a2aProtocolVersion,
                                json: agent.a2aJson,
                                skills: agent.a2aSkills,
                                domains: [],
                              }
                            : null,
                          agent.mcpProtocolDescriptorIri && agent.mcpServiceUrl
                            ? {
                                iri: agent.mcpProtocolDescriptorIri,
                                protocol: 'mcp',
                                serviceUrl: agent.mcpServiceUrl,
                                protocolVersion: agent.mcpProtocolVersion,
                                json: agent.mcpJson,
                                skills: agent.mcpSkills,
                                domains: [],
                              }
                            : null,
                        ].filter(Boolean),
                      }
                    : null,
              }
            : null,
        identityEns: agent.identityEnsIri && agent.didEns ? { iri: agent.identityEnsIri, kind: 'ens', did: agent.didEns } : null,
        ownerAccount: agent.ownerAccountIri ? { iri: agent.ownerAccountIri } : null,
        walletAccount: agent.walletAccountIri ? { iri: agent.walletAccountIri } : null,
        operatorAccount: agent.operatorAccountIri ? { iri: agent.operatorAccountIri } : null,
        smartAccount: agent.smartAccountIri ? { iri: agent.smartAccountIri } : null,
      };
    },

    kbAgentByDid: async (args: any) => {
      const did8004 = typeof args?.did8004 === 'string' ? args.did8004.trim() : '';
      if (!did8004) return null;
      const res = await kbAgentsQuery({ where: { did8004 }, first: 1, skip: 0 });
      if (!res.rows.length) return null;
      const agent = res.rows[0]!;
      return mapRowToKbAgent(agent);
    },

    kbSemanticAgentSearch: async (args: any) => {
      if (!semanticSearchService) {
        return { matches: [], total: 0, intentType: null };
      }
      const input = args?.input ?? {};
      const text = typeof input.text === 'string' ? input.text : '';
      if (!text.trim()) return { matches: [], total: 0, intentType: null };
      const topK = typeof input.topK === 'number' ? input.topK : undefined;
      const minScore = typeof input.minScore === 'number' ? input.minScore : undefined;
      const matches = await semanticSearchService.search({ text, topK, minScore, filters: input.filters });

      const didsByChain = new Map<number, string[]>();
      for (const m of matches) {
        const meta = (m as any)?.metadata ?? {};
        const chainId = Number(meta.chainId ?? undefined);
        const agentId = meta.agentId != null ? String(meta.agentId) : null;
        if (!Number.isFinite(chainId) || !agentId) continue;
        const did8004 = `did:8004:${Math.trunc(chainId)}:${agentId}`;
        if (!didsByChain.has(Math.trunc(chainId))) didsByChain.set(Math.trunc(chainId), []);
        didsByChain.get(Math.trunc(chainId))!.push(did8004);
      }

      const hydrated = new Map<string, any>();
      for (const [chainId, didList] of didsByChain.entries()) {
        const rows = await kbHydrateAgentsByDid8004({ chainId, did8004List: didList });
        for (const r of rows) {
          hydrated.set(r.did8004, {
            iri: r.agentIri,
            uaid: r.uaid,
            agentName: r.agentName,
            agentTypes: r.agentTypes,
            did8004: r.did8004,
            agentId8004: Number.isFinite(Number(r.did8004.split(':').pop())) ? Number(r.did8004.split(':').pop()) : null,
            isSmartAgent: r.agentTypes.includes('https://agentictrust.io/ontology/erc8004#SmartAgent'),
            identity8004:
              r.identity8004Iri
                ? {
                    iri: r.identity8004Iri,
                    kind: '8004',
                    did: r.did8004,
                    descriptor: r.identity8004DescriptorIri
                      ? {
                          iri: r.identity8004DescriptorIri,
                          kind: '8004',
                          json: r.registrationJson,
                          onchainMetadataJson: null,
                          registeredBy: null,
                          registryNamespace: null,
                          skills: [],
                          domains: [],
                          protocolDescriptors: [
                            r.a2aProtocolDescriptorIri && r.a2aServiceUrl
                              ? {
                                  iri: r.a2aProtocolDescriptorIri,
                                  protocol: 'a2a',
                                  serviceUrl: r.a2aServiceUrl,
                                  protocolVersion: r.a2aProtocolVersion,
                                  json: r.a2aJson,
                                  skills: r.a2aSkills,
                                  domains: [],
                                }
                              : null,
                            r.mcpProtocolDescriptorIri && r.mcpServiceUrl
                              ? {
                                  iri: r.mcpProtocolDescriptorIri,
                                  protocol: 'mcp',
                                  serviceUrl: r.mcpServiceUrl,
                                  protocolVersion: r.mcpProtocolVersion,
                                  json: r.mcpJson,
                                  skills: r.mcpSkills,
                                  domains: [],
                                }
                              : null,
                          ].filter(Boolean),
                        }
                      : null,
                  }
                : null,
            identityEns: r.identityEnsIri && r.didEns ? { iri: r.identityEnsIri, kind: 'ens', did: r.didEns } : null,
            ownerAccount: r.ownerAccountIri ? { iri: r.ownerAccountIri } : null,
            walletAccount: r.walletAccountIri ? { iri: r.walletAccountIri } : null,
            operatorAccount: r.operatorAccountIri ? { iri: r.operatorAccountIri } : null,
            smartAccount: r.smartAccountIri ? { iri: r.smartAccountIri } : null,
          });
        }
      }

      const out = matches.map((m) => {
        const meta = (m as any)?.metadata ?? {};
        const chainId = Number(meta.chainId ?? undefined);
        const agentId = meta.agentId != null ? String(meta.agentId) : null;
        const did8004 = Number.isFinite(chainId) && agentId ? `did:8004:${Math.trunc(chainId)}:${agentId}` : null;
        return {
          agent: did8004 ? hydrated.get(did8004) ?? null : null,
          score: typeof m.score === 'number' ? m.score : 0,
          matchReasons: (m as any).matchReasons ?? null,
        };
      });

      return { matches: out, total: out.length, intentType: null };
    },

    kbAgentTrustIndex: async (_args: any) => {
      const chainId = Number(_args?.chainId);
      const agentId = String(_args?.agentId ?? '').trim();
      if (!Number.isFinite(chainId) || !agentId) return null;

      const ctx = `https://www.agentictrust.io/graph/data/analytics/${Math.trunc(chainId)}`;
      const sparql = [
        'PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>',
        'PREFIX prov: <http://www.w3.org/ns/prov#>',
        'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
        '',
        'SELECT',
        '  ?ati ?overallScore ?overallConfidence ?version ?computedAt ?bundleJson',
        '  ?component ?cScore ?cWeight ?evidenceCountsJson',
        'WHERE {',
        `  GRAPH <${ctx}> {`,
        '    ?ati a analytics:AgentTrustIndex, prov:Entity ;',
        `         analytics:chainId ${Math.trunc(chainId)} ;`,
        `         analytics:agentId "${agentId.replace(/"/g, '\\"')}" ;`,
        '         analytics:overallScore ?overallScore ;',
        '         analytics:version ?version ;',
        '         analytics:computedAt ?computedAt .',
        '    OPTIONAL { ?ati analytics:overallConfidence ?overallConfidence }',
        '    OPTIONAL { ?ati analytics:bundleJson ?bundleJson }',
        '    OPTIONAL {',
        '      ?comp a analytics:AgentTrustComponent, prov:Entity ;',
        '            analytics:componentOf ?ati ;',
        '            analytics:component ?component ;',
        '            analytics:score ?cScore ;',
        '            analytics:weight ?cWeight .',
        '      OPTIONAL { ?comp analytics:evidenceCountsJson ?evidenceCountsJson }',
        '    }',
        '  }',
        '}',
        '',
      ].join('\n');

      const rows = await runGraphdbQueryBindings(sparql);
      if (!rows.length) return null;

      const first = rows[0]!;
      const components = rows
        .map((r: any) => ({
          component: r.component?.value ?? '',
          score: r.cScore?.value != null ? Number(r.cScore.value) : 0,
          weight: r.cWeight?.value != null ? Number(r.cWeight.value) : 0,
          evidenceCountsJson: r.evidenceCountsJson?.value ?? null,
        }))
        .filter((c) => c.component);

      return {
        chainId: Math.trunc(chainId),
        agentId,
        overallScore: first.overallScore?.value != null ? Number(first.overallScore.value) : 0,
        overallConfidence: first.overallConfidence?.value != null ? Number(first.overallConfidence.value) : null,
        version: first.version?.value ?? '',
        computedAt: first.computedAt?.value != null ? Number(first.computedAt.value) : 0,
        bundleJson: first.bundleJson?.value ?? null,
        components,
      };
    },

    kbTrustLedgerBadgeDefinitions: async () => {
      const ctx = `https://www.agentictrust.io/graph/data/analytics/system`;
      const sparql = [
        'PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>',
        'PREFIX prov: <http://www.w3.org/ns/prov#>',
        '',
        'SELECT ?badgeId ?program ?name ?description ?iconRef ?points ?ruleId ?ruleJson ?active ?createdAt ?updatedAt WHERE {',
        `  GRAPH <${ctx}> {`,
        '    ?b a analytics:TrustLedgerBadgeDefinition, prov:Entity ;',
        '       analytics:badgeId ?badgeId ;',
        '       analytics:program ?program ;',
        '       analytics:name ?name ;',
        '       analytics:points ?points ;',
        '       analytics:ruleId ?ruleId ;',
        '       analytics:active ?active ;',
        '       analytics:createdAt ?createdAt ;',
        '       analytics:updatedAt ?updatedAt .',
        '    OPTIONAL { ?b analytics:description ?description }',
        '    OPTIONAL { ?b analytics:iconRef ?iconRef }',
        '    OPTIONAL { ?b analytics:ruleJson ?ruleJson }',
        '  }',
        '}',
        'ORDER BY ?badgeId',
        '',
      ].join('\n');
      const rows = await runGraphdbQueryBindings(sparql);
      return rows.map((r: any) => ({
        badgeId: r.badgeId?.value ?? '',
        program: r.program?.value ?? '',
        name: r.name?.value ?? '',
        description: r.description?.value ?? null,
        iconRef: r.iconRef?.value ?? null,
        points: r.points?.value != null ? Number(r.points.value) : 0,
        ruleId: r.ruleId?.value ?? '',
        ruleJson: r.ruleJson?.value ?? null,
        active: String(r.active?.value ?? 'false') === 'true',
        createdAt: r.createdAt?.value != null ? Number(r.createdAt.value) : 0,
        updatedAt: r.updatedAt?.value != null ? Number(r.updatedAt.value) : 0,
      }));
    },

    kbFeedbacks: async (args: any) => {
      const chainId = Number(args?.chainId);
      if (!Number.isFinite(chainId)) return [];
      const rows = await kbFeedbacksQuery({ chainId: Math.trunc(chainId), first: args?.first ?? null, skip: args?.skip ?? null });
      return rows.map((row) => ({
        iri: row.iri,
        agentDid8004: row.agentDid8004,
        json: row.json,
        record: row.record,
      }));
    },

    kbValidations: async (args: any) => {
      const chainId = Number(args?.chainId);
      if (!Number.isFinite(chainId)) return [];
      const rows = await kbValidationResponsesQuery({ chainId: Math.trunc(chainId), first: args?.first ?? null, skip: args?.skip ?? null });
      return rows.map((row) => ({
        iri: row.iri,
        agentDid8004: row.agentDid8004,
        json: row.json,
        record: row.record,
      }));
    },

    kbAssociations: async (args: any) => {
      const chainId = Number(args?.chainId);
      if (!Number.isFinite(chainId)) return [];
      const rows = await kbAssociationsQuery({ chainId: Math.trunc(chainId), first: args?.first ?? null, skip: args?.skip ?? null });
      return rows.map((row) => ({
        iri: row.iri,
        record: row.record,
      }));
    },
  };
}

