import type { SemanticSearchService } from './semantic/semantic-search-service.js';
import { kbAgentsQuery, kbOwnedAgentsAllChainsQuery, kbOwnedAgentsQuery } from './graphdb/kb-queries.js';
import { kbAssociationsQuery, kbFeedbacksQuery, kbValidationResponsesQuery } from './graphdb/kb-queries-events.js';
import { kbHydrateAgentsByDid8004 } from './graphdb/kb-queries-hydration.js';
import { getGraphdbConfigFromEnv, queryGraphdb } from './graphdb/graphdb-http.js';
import { getAccountOwner } from './account-owner.js';

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

  const CORE_INTENT_BASE = 'https://agentictrust.io/ontology/core/intent/';
  const CORE_TASK_BASE = 'https://agentictrust.io/ontology/core/task/';
  const OASF_SKILL_BASE = 'https://agentictrust.io/ontology/oasf#skill/';
  const OASF_DOMAIN_BASE = 'https://agentictrust.io/ontology/oasf#domain/';
  const GRAPHDB_ONTOLOGY_CONTEXT = 'https://www.agentictrust.io/graph/ontology/core';

  const decodeKey = (value: string): string => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  const keyFromIri = (iri: string, base: string): string | null => {
    if (!iri.startsWith(base)) return null;
    return decodeKey(iri.slice(base.length));
  };

  const skillKeyFromIri = (iri: string): string | null => keyFromIri(iri, OASF_SKILL_BASE);

  const ensureUaidPrefix = (value: string | null | undefined): string | null => {
    const v = typeof value === 'string' ? value.trim() : '';
    if (!v) return null;
    return v.startsWith('uaid:') ? v : `uaid:${v}`;
  };

  const stripUaidPrefix = (value: string): string => {
    const v = String(value || '').trim();
    return v.startsWith('uaid:') ? v.slice('uaid:'.length) : v;
  };

  const assertUaidInput = (value: unknown, fieldName: string): string => {
    const v = typeof value === 'string' ? value.trim() : '';
    if (!v) throw new Error(`Invalid ${fieldName}: expected non-empty UAID starting with "uaid:" (e.g. uaid:did:8004:11155111:543).`);
    if (!v.startsWith('uaid:')) {
      throw new Error(
        `Invalid ${fieldName}: expected UAID to start with "uaid:". ` +
          `Received "${v}". ` +
          `If you have a DID like "did:8004:..." you must wrap it as "uaid:did:8004:...".`,
      );
    }
    return v;
  };

  const mapRowToKbAgent = (r: any) => ({
    iri: r.iri,
    uaid:
      ensureUaidPrefix(
        r.uaid ??
      (() => {
        // Backfill UAID for older KB data that predates core:uaid on core:AIAgent.
        // - SmartAgent: UAID is did:ethr:<chainId>:<agentAccountAddress>
        // - AIAgent8004: UAID is did:8004:<chainId>:<agentId>
        const m = typeof r.agentAccountIri === 'string'
          ? r.agentAccountIri.match(/^https:\/\/www\.agentictrust\.io\/id\/account\/(\d+)\/(0x[0-9a-fA-F]{40})$/)
          : null;
        if (m?.[1] && m?.[2]) return `did:ethr:${m[1]}:${m[2].toLowerCase()}`;
        return r.did8004 ?? null;
      })(),
      ),
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
    identityOwnerAccount: r.identityOwnerAccountIri ? { iri: r.identityOwnerAccountIri } : null,
    identityWalletAccount: r.identityWalletAccountIri ? { iri: r.identityWalletAccountIri } : null,
    identityOperatorAccount: r.identityOperatorAccountIri ? { iri: r.identityOperatorAccountIri } : null,

    agentOwnerAccount: r.agentOwnerAccountIri ? { iri: r.agentOwnerAccountIri } : null,
    agentOperatorAccount: r.agentOperatorAccountIri ? { iri: r.agentOperatorAccountIri } : null,
    agentWalletAccount: r.agentWalletAccountIri ? { iri: r.agentWalletAccountIri } : null,
    agentOwnerEOAAccount: r.agentOwnerEOAAccountIri ? { iri: r.agentOwnerEOAAccountIri } : null,

    agentAccount: r.agentAccountIri ? { iri: r.agentAccountIri } : null,
  });

  const normalizeHexAddr = (addr: string): string | null => {
    const a = String(addr || '').trim().toLowerCase();
    return /^0x[0-9a-f]{40}$/.test(a) ? a : null;
  };

  const parseUaidChainId = (uaid: string): number | null => {
    const u = stripUaidPrefix(String(uaid || '').trim());
    const mEthr = u.match(/^did:ethr:(\d+):0x[0-9a-fA-F]{40}$/);
    if (mEthr?.[1]) {
      const n = Number(mEthr[1]);
      return Number.isFinite(n) ? Math.trunc(n) : null;
    }
    const m8004 = u.match(/^did:8004:(\d+):\d+$/);
    if (m8004?.[1]) {
      const n = Number(m8004[1]);
      return Number.isFinite(n) ? Math.trunc(n) : null;
    }
    return null;
  };

  const resolveAgentOwnerEoaAddressByUaid = async (uaid: string): Promise<string | null> => {
    const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
    const u = String(uaid || '').trim().replace(/"/g, '\\"');
    const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT (SAMPLE(?addr) AS ?addrOut) WHERE {
  GRAPH ?g {
    FILTER(STRSTARTS(STR(?g), "https://www.agentictrust.io/graph/data/subgraph/"))
    ?agent a core:AIAgent ;
           core:uaid "${u}" .
    OPTIONAL {
      ?agent erc8004:agentOwnerEOAAccount ?acct .
      ?acct eth:accountAddress ?addr .
    }
  }
}
LIMIT 1
`;
    const res = await queryGraphdb(baseUrl, repository, auth, sparql);
    const b = res?.results?.bindings?.[0];
    const v = typeof b?.addrOut?.value === 'string' ? b.addrOut.value.trim().toLowerCase() : '';
    return normalizeHexAddr(v);
  };

  return {
    oasfSkills: async (args: any) => {
      const { key, nameKey, category, extendsKey } = args || {};
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const order = args?.orderDirection === 'desc' ? 'DESC' : 'ASC';
      const orderBy = args?.orderBy === 'caption' ? '?caption' : args?.orderBy === 'uid' ? '?uid' : '?key';
      const orderExpr = order === 'DESC' ? `DESC(${orderBy})` : `ASC(${orderBy})`;

      const filters: string[] = [];
      if (key) filters.push(`?key = "${String(key).replace(/"/g, '\\"')}"`);
      if (nameKey) filters.push(`?name = "${String(nameKey).replace(/"/g, '\\"')}"`);
      if (category) filters.push(`?category = "${String(category).replace(/"/g, '\\"')}"`);
      if (extendsKey) filters.push(`?extendsKey = "${String(extendsKey).replace(/"/g, '\\"')}"`);

      const sparql = [
        'PREFIX oasf: <https://agentictrust.io/ontology/oasf#>',
        'SELECT ?skill ?key ?name ?uid ?caption ?extends ?category ?extendsKey WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?skill a oasf:Skill .',
        '    OPTIONAL { ?skill oasf:key ?key }',
        '    OPTIONAL { ?skill oasf:name ?name }',
        '    OPTIONAL { ?skill oasf:uid ?uid }',
        '    OPTIONAL { ?skill oasf:caption ?caption }',
        '    OPTIONAL { ?skill oasf:extends ?extends }',
        '    OPTIONAL { ?skill oasf:category ?category }',
        '  }',
        `  BIND(IF(BOUND(?extends), REPLACE(STR(?extends), "${OASF_SKILL_BASE}", ""), "") AS ?extendsKey)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        `ORDER BY ${orderExpr}`,
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQueryBindings(sparql);
      return rows.map((row: any) => ({
        key: row.key?.value ?? '',
        nameKey: row.name?.value ?? null,
        uid: row.uid?.value != null ? Number(row.uid.value) : null,
        caption: row.caption?.value ?? null,
        extendsKey: row.extendsKey?.value ? decodeKey(row.extendsKey.value) : null,
        category: row.category?.value ?? null,
      }));
    },

    oasfDomains: async (args: any) => {
      const { key, nameKey, category, extendsKey } = args || {};
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const order = args?.orderDirection === 'desc' ? 'DESC' : 'ASC';
      const orderBy = args?.orderBy === 'caption' ? '?caption' : args?.orderBy === 'uid' ? '?uid' : '?key';
      const orderExpr = order === 'DESC' ? `DESC(${orderBy})` : `ASC(${orderBy})`;

      const filters: string[] = [];
      if (key) filters.push(`?key = "${String(key).replace(/"/g, '\\"')}"`);
      if (nameKey) filters.push(`?name = "${String(nameKey).replace(/"/g, '\\"')}"`);
      if (category) filters.push(`?category = "${String(category).replace(/"/g, '\\"')}"`);
      if (extendsKey) filters.push(`?extendsKey = "${String(extendsKey).replace(/"/g, '\\"')}"`);

      const sparql = [
        'PREFIX oasf: <https://agentictrust.io/ontology/oasf#>',
        'SELECT ?domain ?key ?name ?uid ?caption ?extends ?category ?extendsKey WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?domain a oasf:Domain .',
        '    OPTIONAL { ?domain oasf:key ?key }',
        '    OPTIONAL { ?domain oasf:name ?name }',
        '    OPTIONAL { ?domain oasf:uid ?uid }',
        '    OPTIONAL { ?domain oasf:caption ?caption }',
        '    OPTIONAL { ?domain oasf:extends ?extends }',
        '    OPTIONAL { ?domain oasf:category ?category }',
        '  }',
        `  BIND(IF(BOUND(?extends), REPLACE(STR(?extends), "${OASF_DOMAIN_BASE}", ""), "") AS ?extendsKey)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        `ORDER BY ${orderExpr}`,
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQueryBindings(sparql);
      return rows.map((row: any) => ({
        key: row.key?.value ?? '',
        nameKey: row.name?.value ?? null,
        uid: row.uid?.value != null ? Number(row.uid.value) : null,
        caption: row.caption?.value ?? null,
        extendsKey: row.extendsKey?.value ? decodeKey(row.extendsKey.value) : null,
        category: row.category?.value ?? null,
      }));
    },

    intentTypes: async (args: any) => {
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const filters: string[] = [];
      if (args?.label) filters.push(`?label = "${String(args.label).replace(/"/g, '\\"')}"`);
      if (args?.key) filters.push(`?key = "${String(args.key).replace(/"/g, '\\"')}"`);

      const sparql = [
        'PREFIX core: <https://agentictrust.io/ontology/core#>',
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
        'SELECT ?intent ?label ?description ?key WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?intent a core:IntentType .',
        '    OPTIONAL { ?intent rdfs:label ?label }',
        '    OPTIONAL { ?intent rdfs:comment ?description }',
        '  }',
        `  BIND(REPLACE(STR(?intent), "${CORE_INTENT_BASE}", "") AS ?key)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        'ORDER BY ?key',
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQueryBindings(sparql);
      return rows.map((row: any) => ({
        key: decodeKey(row.key?.value ?? ''),
        label: row.label?.value ?? null,
        description: row.description?.value ?? null,
      }));
    },

    taskTypes: async (args: any) => {
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const filters: string[] = [];
      if (args?.label) filters.push(`?label = "${String(args.label).replace(/"/g, '\\"')}"`);
      if (args?.key) filters.push(`?key = "${String(args.key).replace(/"/g, '\\"')}"`);

      const sparql = [
        'PREFIX core: <https://agentictrust.io/ontology/core#>',
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
        'SELECT ?task ?label ?description ?key WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?task a core:TaskType .',
        '    OPTIONAL { ?task rdfs:label ?label }',
        '    OPTIONAL { ?task rdfs:comment ?description }',
        '  }',
        `  BIND(REPLACE(STR(?task), "${CORE_TASK_BASE}", "") AS ?key)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        'ORDER BY ?key',
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQueryBindings(sparql);
      return rows.map((row: any) => ({
        key: decodeKey(row.key?.value ?? ''),
        label: row.label?.value ?? null,
        description: row.description?.value ?? null,
      }));
    },

    intentTaskMappings: async (args: any) => {
      const limit = typeof args?.limit === 'number' && Number.isFinite(args.limit) ? Math.max(1, Math.min(5000, args.limit)) : 2000;
      const offset = typeof args?.offset === 'number' && Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
      const filters: string[] = [];
      if (args?.intentKey) filters.push(`?intentKey = "${String(args.intentKey).replace(/"/g, '\\"')}"`);
      if (args?.taskKey) filters.push(`?taskKey = "${String(args.taskKey).replace(/"/g, '\\"')}"`);

      const sparql = [
        'PREFIX core: <https://agentictrust.io/ontology/core#>',
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
        'SELECT ?mapping ?intent ?task ?intentKey ?taskKey ?intentLabel ?taskLabel ?intentDesc ?taskDesc ?req ?opt WHERE {',
        `  GRAPH <${GRAPHDB_ONTOLOGY_CONTEXT}> {`,
        '    ?mapping a core:IntentTaskMapping ;',
        '      core:mapsIntentType ?intent ;',
        '      core:mapsTaskType ?task .',
        '    OPTIONAL { ?mapping core:requiresSkill ?req }',
        '    OPTIONAL { ?mapping core:mayUseSkill ?opt }',
        '    OPTIONAL { ?intent rdfs:label ?intentLabel }',
        '    OPTIONAL { ?intent rdfs:comment ?intentDesc }',
        '    OPTIONAL { ?task rdfs:label ?taskLabel }',
        '    OPTIONAL { ?task rdfs:comment ?taskDesc }',
        '  }',
        `  BIND(REPLACE(STR(?intent), "${CORE_INTENT_BASE}", "") AS ?intentKey)`,
        `  BIND(REPLACE(STR(?task), "${CORE_TASK_BASE}", "") AS ?taskKey)`,
        filters.length ? `  FILTER(${filters.join(' && ')})` : '',
        '}',
        'ORDER BY ?intentKey ?taskKey',
        `LIMIT ${limit}`,
        `OFFSET ${offset}`,
      ]
        .filter(Boolean)
        .join('\n');

      const rows = await runGraphdbQueryBindings(sparql);
      const map = new Map<string, any>();
      for (const row of rows) {
        const intentKey = decodeKey(row.intentKey?.value ?? '');
        const taskKey = decodeKey(row.taskKey?.value ?? '');
        const mapKey = `${intentKey}::${taskKey}`;
        if (!map.has(mapKey)) {
          map.set(mapKey, {
            intent: {
              key: intentKey,
              label: row.intentLabel?.value ?? null,
              description: row.intentDesc?.value ?? null,
            },
            task: {
              key: taskKey,
              label: row.taskLabel?.value ?? null,
              description: row.taskDesc?.value ?? null,
            },
            requiredSkills: new Set<string>(),
            optionalSkills: new Set<string>(),
          });
        }
        const entry = map.get(mapKey);
        if (row.req?.value) {
          const key = skillKeyFromIri(String(row.req.value));
          if (key) entry.requiredSkills.add(key);
        }
        if (row.opt?.value) {
          const key = skillKeyFromIri(String(row.opt.value));
          if (key) entry.optionalSkills.add(key);
        }
      }
      return Array.from(map.values()).map((entry) => ({
        intent: entry.intent,
        task: entry.task,
        requiredSkills: Array.from(entry.requiredSkills),
        optionalSkills: Array.from(entry.optionalSkills),
      }));
    },

    kbAgents: async (args: any) => {
      const where = args?.where ?? null;
      if (where && typeof where === 'object') {
        if (where.uaid != null) assertUaidInput(where.uaid, 'where.uaid');
        if (where.uaid_in != null) {
          if (!Array.isArray(where.uaid_in)) throw new Error(`Invalid where.uaid_in: expected an array of "uaid:*" strings.`);
          for (let i = 0; i < where.uaid_in.length; i++) {
            assertUaidInput(where.uaid_in[i], `where.uaid_in[${i}]`);
          }
        }
      }
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

    kbOwnedAgents: async (args: any) => {
      const chainId = Number(args?.chainId);
      const ownerAddress = typeof args?.ownerAddress === 'string' ? args.ownerAddress : '';
      const first = args?.first ?? null;
      const skip = args?.skip ?? null;
      const orderBy = args?.orderBy ?? null;
      const orderDirection = args?.orderDirection ?? null;

      if (!Number.isFinite(chainId) || !ownerAddress.trim()) {
        return { agents: [], total: 0, hasMore: false };
      }

      const { rows, total, hasMore } = await kbOwnedAgentsQuery({
        chainId: Math.trunc(chainId),
        ownerAddress,
        first,
        skip,
        orderBy,
        orderDirection,
      });

      const agents = rows.map((r) => mapRowToKbAgent(r));
      return { agents, total, hasMore };
    },

    kbOwnedAgentsAllChains: async (args: any) => {
      const ownerAddress = typeof args?.ownerAddress === 'string' ? args.ownerAddress : '';
      const first = args?.first ?? null;
      const skip = args?.skip ?? null;
      const orderBy = args?.orderBy ?? null;
      const orderDirection = args?.orderDirection ?? null;

      const { rows, total, hasMore } = await kbOwnedAgentsAllChainsQuery({
        ownerAddress,
        first,
        skip,
        orderBy,
        orderDirection,
      });

      const agents = rows.map((r) => mapRowToKbAgent(r));
      return { agents, total, hasMore };
    },

    kbIsOwner: async (args: any) => {
      const uaid = assertUaidInput(args?.uaid, 'uaid');
      const walletAddressRaw = typeof args?.walletAddress === 'string' ? args.walletAddress.trim() : '';
      if (!uaid || !walletAddressRaw) return false;

      const chainId = parseUaidChainId(uaid);
      const walletAddr = normalizeHexAddr(walletAddressRaw);
      if (!walletAddr) return false;

      // Try to resolve the agent's recorded EOA owner from KB.
      const agentOwnerEoa = await resolveAgentOwnerEoaAddressByUaid(uaid);
      if (!agentOwnerEoa) return false;

      // Normalize caller wallet into an EOA when possible (smart-account wallet inputs).
      let walletEoa = walletAddr;
      if (chainId) {
        const resolved = await getAccountOwner(chainId, walletAddr);
        const normalized = resolved ? normalizeHexAddr(resolved) : null;
        if (normalized) walletEoa = normalized;
      }

      return walletEoa === agentOwnerEoa;
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
        identityOwnerAccount: agent.identityOwnerAccountIri ? { iri: agent.identityOwnerAccountIri } : null,
        identityWalletAccount: agent.identityWalletAccountIri ? { iri: agent.identityWalletAccountIri } : null,
        identityOperatorAccount: agent.identityOperatorAccountIri ? { iri: agent.identityOperatorAccountIri } : null,

        agentOwnerAccount: agent.agentOwnerAccountIri ? { iri: agent.agentOwnerAccountIri } : null,
        agentOperatorAccount: agent.agentOperatorAccountIri ? { iri: agent.agentOperatorAccountIri } : null,
        agentWalletAccount: agent.agentWalletAccountIri ? { iri: agent.agentWalletAccountIri } : null,
        agentOwnerEOAAccount: agent.agentOwnerEOAAccountIri ? { iri: agent.agentOwnerEOAAccountIri } : null,

        agentAccount: agent.agentAccountIri ? { iri: agent.agentAccountIri } : null,
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
            identityOwnerAccount: r.identityOwnerAccountIri ? { iri: r.identityOwnerAccountIri } : null,
            identityWalletAccount: r.identityWalletAccountIri ? { iri: r.identityWalletAccountIri } : null,
            identityOperatorAccount: r.identityOperatorAccountIri ? { iri: r.identityOperatorAccountIri } : null,

            agentOwnerAccount: r.agentOwnerAccountIri ? { iri: r.agentOwnerAccountIri } : null,
            agentOperatorAccount: r.agentOperatorAccountIri ? { iri: r.agentOperatorAccountIri } : null,
            agentWalletAccount: r.agentWalletAccountIri ? { iri: r.agentWalletAccountIri } : null,
            agentOwnerEOAAccount: r.agentOwnerEOAAccountIri ? { iri: r.agentOwnerEOAAccountIri } : null,

            agentAccount: r.agentAccountIri ? { iri: r.agentAccountIri } : null,
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

