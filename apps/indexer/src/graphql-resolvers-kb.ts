import type { SemanticSearchService } from './semantic/semantic-search-service.js';
import { kbAgentsQuery, kbErc8122RegistriesQuery, kbOwnedAgentsAllChainsQuery, kbOwnedAgentsQuery } from './graphdb/kb-queries.js';
import {
  kbAssociationsQuery,
  kbReviewItemsForAgentQuery,
  kbReviewsQuery,
  kbValidationResponsesForAgentQuery,
  kbValidationResponsesQuery,
} from './graphdb/kb-queries-events.js';
import { kbHydrateAgentsByDid8004 } from './graphdb/kb-queries-hydration.js';
import { getGraphdbConfigFromEnv, queryGraphdbWithContext, type GraphdbQueryContext } from './graphdb/graphdb-http.js';
import { getAccountOwner } from './account-owner.js';
import { RegistryBrokerClient } from '@hashgraphonline/standards-sdk';
import { upsertHolResolvedAgentToGraphdb } from './graphdb/hol-upsert.js';
import { fetchHolCapabilities } from './hol/hol-api.js';
import { kbHolCapabilitiesQuery, upsertHolCapabilityCatalogToGraphdb } from './graphdb/hol-capabilities.js';

async function runGraphdbQueryBindings(sparql: string, graphdbCtx?: GraphdbQueryContext | null, label?: string): Promise<any[]> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const result = await queryGraphdbWithContext(
    baseUrl,
    repository,
    auth,
    sparql,
    graphdbCtx ? { ...graphdbCtx, label: label ?? graphdbCtx.label } : graphdbCtx,
  );
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

  // Hashgraph Online Registry/Broker client (UAID → resolved agent + profile)
  // Defaults to https://hol.org/registry/api/v1 in the SDK; we hard-code to make it explicit and stable.
  const holRegistryBroker = new RegistryBrokerClient({ baseUrl: 'https://hol.org/registry/api/v1' });

  function parseAccountFromIri(iri: string): { chainId: number | null; address: string | null } {
    const s = String(iri || '').trim();
    if (!s) return { chainId: null, address: null };
    const m = s.match(/^https:\/\/www\.agentictrust\.io\/id\/account\/(\d+)\/([^/?#]+)$/);
    if (!m) return { chainId: null, address: null };
    const chainIdRaw = Number(m[1]);
    const chainId = Number.isFinite(chainIdRaw) ? Math.trunc(chainIdRaw) : null;
    const address = (() => {
      try {
        return decodeURIComponent(m[2]).toLowerCase();
      } catch {
        return String(m[2]).toLowerCase();
      }
    })();
    return { chainId, address: address || null };
  }

  function kbAccountFromIri(iri: string) {
    const { chainId, address } = parseAccountFromIri(iri);
    return {
      iri,
      chainId,
      address,
      accountType: null,
      didEthr: chainId != null && address ? `did:ethr:${chainId}:${address}` : null,
    };
  }

  async function resolveHolAgentProfileByUaid(uaid: string, include?: any): Promise<any> {
    const includeDefault =
      include && typeof include === 'object'
        ? include
        : { capabilities: true, endpoints: true, relationships: true, validations: true };

    // Use the SDK's configured baseUrl + request pipeline so headers/fetch impl stay consistent.
    const resolved = await (holRegistryBroker as any).requestJson(buildHolResolvePath(uaid, includeDefault), { method: 'GET' });
    // eslint-disable-next-line no-console
    console.log('[hol] resolveUaid response', uaid, JSON.stringify(resolved, null, 2));

    // Best-effort: persist all resolved HOL data into the HOL KB subgraph.
    try {
      await upsertHolResolvedAgentToGraphdb({ uaid, resolved });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.warn('[hol] failed to upsert resolved agent into GraphDB', { uaid, error: String(e?.message || e || '') });
    }

    const agent = (resolved as any)?.agent ?? null;
    const profile = agent?.profile ?? null;
    return {
      uaid: typeof agent?.uaid === 'string' && agent.uaid.trim() ? agent.uaid.trim() : uaid,
      displayName: typeof profile?.display_name === 'string' ? profile.display_name : null,
      alias: typeof profile?.alias === 'string' ? profile.alias : null,
      bio: typeof profile?.bio === 'string' ? profile.bio : null,
      profileImage: typeof profile?.profileImage === 'string' ? profile.profileImage : null,
      profileJson: profile ? JSON.stringify(profile) : null,
    };
  }

  function buildHolResolvePath(uaid: string, include?: any): string {
    // SDK method `resolveUaid` doesn't expose include flags, but the request is a plain GET.
    // We implement include as query params for forward compatibility with the broker API.
    const u = new URL(`https://x/resolve/${encodeURIComponent(uaid)}`);
    const inc = include && typeof include === 'object' ? include : null;
    if (inc) {
      for (const k of ['capabilities', 'endpoints', 'relationships', 'validations'] as const) {
        const v = (inc as any)[k];
        if (typeof v === 'boolean') u.searchParams.set(`include.${k}`, v ? '1' : '0');
      }
    }
    return u.pathname + u.search;
  }

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

  const stripUaidPrefix = (value: string): string => {
    const v = String(value || '').trim();
    if (!v.startsWith('uaid:')) throw new Error(`Invalid uaid: expected prefix "uaid:". Received "${v}".`);
    return v.slice('uaid:'.length);
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

  const normalizeUaidString = (input: unknown): string | null => {
    const s = typeof input === 'string' ? input.trim() : '';
    if (!s) return null;
    return s.startsWith('uaid:') ? s : `uaid:${s}`;
  };

  const holRegistryForDid8004 = (chainId: number): string | null => {
    // Known HOL registry labels (best-effort). If unknown, omit registry filter.
    if (Math.trunc(chainId) === 1) return 'erc-8004 mainnet';
    if (Math.trunc(chainId) === 11155111) return 'erc-8004 sepolia';
    return null;
  };

  const deepGet = (obj: any, path: string[]): any => {
    let cur: any = obj;
    for (const k of path) {
      if (!cur || typeof cur !== 'object') return undefined;
      cur = cur[k];
    }
    return cur;
  };

  const stringish = (v: any): string | null => {
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && Number.isFinite(v)) return String(Math.trunc(v));
    return null;
  };

  const extractErc8004AgentIdFromSearchHit = (hit: any): string | null => {
    // Best-effort across possible payload shapes.
    const candidates = [
      deepGet(hit, ['erc8004', 'agentId']),
      deepGet(hit, ['extensions', 'erc8004', 'agentId']),
      deepGet(hit, ['metadata', 'erc8004', 'agentId']),
      deepGet(hit, ['metadata', 'extensions', 'erc8004', 'agentId']),
      deepGet(hit, ['profile', 'erc8004', 'agentId']),
      deepGet(hit, ['profile', 'extensions', 'erc8004', 'agentId']),
      deepGet(hit, ['profile', 'aiAgent', 'erc8004', 'agentId']),
      deepGet(hit, ['profile', 'aiAgent', 'extensions', 'erc8004', 'agentId']),
    ];
    for (const c of candidates) {
      const s = stringish(c);
      if (s) return s;
    }
    return null;
  };

  const extractErc8004ChainIdFromSearchHit = (hit: any): number | null => {
    const candidates = [
      deepGet(hit, ['erc8004', 'chainId']),
      deepGet(hit, ['extensions', 'erc8004', 'chainId']),
      deepGet(hit, ['metadata', 'erc8004', 'chainId']),
      deepGet(hit, ['metadata', 'extensions', 'erc8004', 'chainId']),
    ];
    for (const c of candidates) {
      const raw = typeof c === 'number' ? c : typeof c === 'string' ? Number(c) : NaN;
      if (Number.isFinite(raw)) return Math.trunc(raw);
    }
    return null;
  };

  async function tryResolveByUaidCandidate(uaidCandidate: string, include?: any): Promise<any | null> {
    try {
      console.info('[hol][did-search] try resolve candidate', { uaidCandidate });
      return await resolveHolAgentProfileByUaid(uaidCandidate, include);
    } catch (e: any) {
      console.info('[hol][did-search] resolve candidate failed', { uaidCandidate, error: String(e?.message || e || '') });
      return null;
    }
  }

  async function searchByProtocolsForAgentId(args: {
    did: string;
    chainId: number;
    agentId: string;
    registry?: string | null;
    include?: any;
  }): Promise<string | null> {
    const { did, chainId, agentId, registry } = args;

    // Cache discovered registries per protocol key (avoid scanning registries on every request).
    const registryScanCache = new Map<string, { atMs: number; registries: string[] }>();
    const REGISTRY_SCAN_TTL_MS = 30 * 60_000;

    const discoverRegistriesForProtocol = async (proto: string): Promise<string[]> => {
      const now = Date.now();
      const hit = registryScanCache.get(proto);
      if (hit && now - hit.atMs < REGISTRY_SCAN_TTL_MS) return hit.registries;

      let regsList: string[] = [];
      try {
        const regs = await holRegistryBroker.registries();
        regsList = Array.isArray((regs as any)?.registries) ? (regs as any).registries : [];
        console.info('[hol][did-search] registries()', { count: regsList.length });
      } catch (e: any) {
        console.info('[hol][did-search] registries() failed', { error: String(e?.message || e || '') });
        registryScanCache.set(proto, { atMs: now, registries: [] });
        return [];
      }

      const out: string[] = [];
      // Scan registries to find those that actually have hits for this protocol.
      for (const reg of regsList) {
        if (typeof reg !== 'string' || !reg.trim()) continue;
        try {
          const r = await holRegistryBroker.search({ page: 1, limit: 1, registry: reg, protocols: [proto] });
          const hits = Array.isArray((r as any)?.hits) ? (r as any).hits : [];
          if (hits.length > 0) out.push(reg);
        } catch {
          // ignore per-registry failures
        }
      }
      console.info('[hol][did-search] discovered registries for protocol', { proto, count: out.length });
      registryScanCache.set(proto, { atMs: now, registries: out });
      return out;
    };

    // Log canonical protocol keys so we can match what the broker expects.
    try {
      const protos = await holRegistryBroker.listProtocols();
      console.info('[hol][did-search] available protocols', { protocols: (protos as any)?.protocols ?? protos });
    } catch (e: any) {
      console.info('[hol][did-search] failed to list protocols', { error: String(e?.message || e || '') });
    }

    const protocolCandidates = ['erc-8004', 'erc8004', 'ERC-8004', 'erc_8004'];
    for (const proto of protocolCandidates) {
      for (const [label, reg] of [
        ['no-registry', null],
        ['with-registry', registry ?? null],
      ] as const) {
        // Page through a bit; protocol searches can be large.
        for (let page = 1; page <= 10; page++) {
          console.info('[hol][did-search] sdk search', { mode: 'protocol', proto, page, limit: 100, registry: reg, label });
          const r = await holRegistryBroker.search({
            page,
            limit: 100,
            protocols: [proto],
            registry: reg ?? undefined,
          });
          const hits = Array.isArray((r as any)?.hits) ? (r as any).hits : [];
          console.info('[hol][did-search] sdk search results', { mode: 'protocol', proto, page, hitCount: hits.length, label });
          if (!hits.length) break; // no more pages

          const match =
            hits.find((h: any) => extractErc8004AgentIdFromSearchHit(h) === String(agentId)) ??
            hits.find((h: any) => {
              const cid = extractErc8004ChainIdFromSearchHit(h);
              return cid != null && cid === Math.trunc(chainId) && extractErc8004AgentIdFromSearchHit(h) === String(agentId);
            }) ??
            null;
          const uaid = normalizeUaidString(match?.uaid);
          console.info('[hol][did-search] sdk filter result', {
            mode: 'protocol',
            did,
            proto,
            label,
            matched: Boolean(match),
            matchedUaid: uaid,
            matchedHitId: match?.id ?? null,
            matchedOriginalId: match?.originalId ?? null,
          });
          if (uaid) return uaid;
        }
      }

      // If global protocol search yields no match, discover which registries actually host this protocol,
      // then search within those registries (this helps when protocol hits exist but are partitioned by registry).
      const discovered = await discoverRegistriesForProtocol(proto);
      if (discovered.length) {
        for (const reg of discovered) {
          for (let page = 1; page <= 10; page++) {
            console.info('[hol][did-search] sdk search', { mode: 'protocol', proto, page, limit: 100, registry: reg, label: 'discovered-registry' });
            const r = await holRegistryBroker.search({ page, limit: 100, registry: reg, protocols: [proto] });
            const hits = Array.isArray((r as any)?.hits) ? (r as any).hits : [];
            console.info('[hol][did-search] sdk search results', { mode: 'protocol', proto, page, hitCount: hits.length, label: 'discovered-registry', registry: reg });
            if (!hits.length) break;
            const match =
              hits.find((h: any) => extractErc8004AgentIdFromSearchHit(h) === String(agentId)) ??
              hits.find((h: any) => {
                const cid = extractErc8004ChainIdFromSearchHit(h);
                return cid != null && cid === Math.trunc(chainId) && extractErc8004AgentIdFromSearchHit(h) === String(agentId);
              }) ??
              null;
            const uaid = normalizeUaidString(match?.uaid);
            console.info('[hol][did-search] sdk filter result', {
              mode: 'protocol',
              did,
              proto,
              label: 'discovered-registry',
              registry: reg,
              matched: Boolean(match),
              matchedUaid: uaid,
              matchedHitId: match?.id ?? null,
              matchedOriginalId: match?.originalId ?? null,
            });
            if (uaid) return uaid;
          }
        }
      }
    }
    return null;
  }

  // IMPORTANT: KB endpoint should only return data materialized in GraphDB.
  // Do not parse identity registration JSON at query-time.

  const mapRowToKbAgent = (r: any) => {
    const serviceEndpoints = [
      r.a2aServiceEndpointIri && r.a2aProtocolIri
        ? {
            iri: r.a2aServiceEndpointIri,
            name: 'a2a',
            descriptor: r.a2aServiceEndpointDescriptorIri
              ? {
                  iri: r.a2aServiceEndpointDescriptorIri,
                  name: r.a2aServiceEndpointDescriptorName,
                  description: r.a2aServiceEndpointDescriptorDescription,
                  image: r.a2aServiceEndpointDescriptorImage,
                }
              : null,
            protocol: {
              iri: r.a2aProtocolIri,
              protocol: 'a2a',
              protocolVersion: r.a2aProtocolVersion,
              serviceUrl: r.a2aServiceUrl,
              descriptor: r.a2aProtocolDescriptorIri
                ? {
                    iri: r.a2aProtocolDescriptorIri,
                    name: r.a2aDescriptorName,
                    description: r.a2aDescriptorDescription,
                    image: r.a2aDescriptorImage,
                    agentCardJson: r.a2aAgentCardJson,
                  }
                : null,
              skills: r.a2aSkills,
              domains: r.a2aDomains,
            },
          }
        : null,
      r.mcpServiceEndpointIri && r.mcpProtocolIri
        ? {
            iri: r.mcpServiceEndpointIri,
            name: 'mcp',
            descriptor: r.mcpServiceEndpointDescriptorIri
              ? {
                  iri: r.mcpServiceEndpointDescriptorIri,
                  name: r.mcpServiceEndpointDescriptorName,
                  description: r.mcpServiceEndpointDescriptorDescription,
                  image: r.mcpServiceEndpointDescriptorImage,
                }
              : null,
            protocol: {
              iri: r.mcpProtocolIri,
              protocol: 'mcp',
              protocolVersion: r.mcpProtocolVersion,
              serviceUrl: r.mcpServiceUrl,
              descriptor: r.mcpProtocolDescriptorIri
                ? {
                    iri: r.mcpProtocolDescriptorIri,
                    name: r.mcpDescriptorName,
                    description: r.mcpDescriptorDescription,
                    image: r.mcpDescriptorImage,
                    agentCardJson: r.mcpAgentCardJson,
                  }
                : null,
              skills: r.mcpSkills,
              domains: r.mcpDomains,
            },
          }
        : null,
    ].filter(Boolean);

    const identity8004Descriptor =
      r.identity8004DescriptorIri
        ? {
            iri: r.identity8004DescriptorIri,
            kind: '8004',
            name: r.identity8004DescriptorName,
            description: r.identity8004DescriptorDescription,
            image: r.identity8004DescriptorImage,
            registrationJson: r.identity8004RegistrationJson,
            nftMetadataJson: r.identity8004NftMetadataJson,
            registeredBy: r.identity8004RegisteredBy,
            registryNamespace: r.identity8004RegistryNamespace,
            // IMPORTANT: identity descriptor skills/domains come ONLY from agentURI registration JSON materialized on the descriptor.
            // Do not derive from protocol metadata (agent-card.json) here.
            skills: Array.isArray(r.identity8004DescriptorSkills) ? r.identity8004DescriptorSkills : [],
            domains: Array.isArray(r.identity8004DescriptorDomains) ? r.identity8004DescriptorDomains : [],
          }
        : null;

    const identityHolDescriptor =
      r.identityHolDescriptorIri
        ? {
            iri: r.identityHolDescriptorIri,
            kind: 'hol',
            name: r.identityHolDescriptorName,
            description: r.identityHolDescriptorDescription,
            image: r.identityHolDescriptorImage,
            registrationJson: r.identityHolDescriptorJson,
            nftMetadataJson: null,
            registeredBy: null,
            registryNamespace: null,
            skills: [],
            domains: [],
          }
        : null;

    const identity8004 =
      r.identity8004Iri && r.did8004
        ? {
            iri: r.identity8004Iri,
            kind: '8004',
            did: r.did8004,
            did8004: r.did8004,
            agentId8004: r.agentId8004 == null ? null : Math.trunc(r.agentId8004),
            isSmartAgent: r.agentTypes.includes('https://agentictrust.io/ontology/core#AISmartAgent'),
            descriptor: identity8004Descriptor,
            serviceEndpoints,
            ownerAccount: r.identityOwnerAccountIri ? kbAccountFromIri(r.identityOwnerAccountIri) : null,
            operatorAccount: r.identityOperatorAccountIri ? kbAccountFromIri(r.identityOperatorAccountIri) : null,
            walletAccount: r.identityWalletAccountIri ? kbAccountFromIri(r.identityWalletAccountIri) : null,
            ownerEOAAccount: r.identityOwnerEOAAccountIri ? kbAccountFromIri(r.identityOwnerEOAAccountIri) : null,
            agentAccount: r.agentAccountIri ? kbAccountFromIri(r.agentAccountIri) : null,
          }
        : null;

    const identityEns = r.identityEnsIri && r.didEns ? { iri: r.identityEnsIri, kind: 'ens', did: r.didEns, descriptor: null, serviceEndpoints: [] } : null;

    const identity8122Descriptor =
      r.identity8122DescriptorIri
        ? {
            iri: r.identity8122DescriptorIri,
            kind: '8122',
            name: r.identity8122DescriptorName,
            description: r.identity8122DescriptorDescription,
            image: r.identity8122DescriptorImage,
            registrationJson: r.identity8122DescriptorJson,
            nftMetadataJson: null,
            registeredBy: null,
            registryNamespace: null,
            skills: [],
            domains: [],
          }
        : null;

    const identity8122 =
      r.identity8122Iri && r.did8122 && r.agentId8122
        ? {
            iri: r.identity8122Iri,
            kind: '8122',
            did: r.did8122,
            did8122: r.did8122,
            agentId8122: r.agentId8122,
            registryAddress: r.registry8122,
            registry:
              r.identity8122RegistryIri && r.registry8122
                ? {
                    iri: r.identity8122RegistryIri,
                    chainId: (() => {
                      const m = String(r.did8122 || '').match(/^did:8122:(\d+):/);
                      const n = m ? Number(m[1]) : NaN;
                      return Number.isFinite(n) ? Math.trunc(n) : 0;
                    })(),
                    registryAddress: r.registry8122,
                    registrarAddress: r.identity8122RegistrarAddress,
                    registryName: r.identity8122RegistryName,
                    registryImplementationAddress: r.identity8122RegistryImplementationAddress,
                    registrarImplementationAddress: r.identity8122RegistrarImplementationAddress,
                    registeredAgentCount:
                      r.identity8122RegisteredAgentCount == null ? null : Math.trunc(r.identity8122RegisteredAgentCount),
                    lastAgentUpdatedAtTime:
                      r.identity8122LastAgentUpdatedAtTime == null ? null : Math.trunc(r.identity8122LastAgentUpdatedAtTime),
                  }
                : null,
            endpointType: r.endpointType8122,
            endpoint: r.endpoint8122,
            descriptor: identity8122Descriptor,
            serviceEndpoints: [],
            ownerAccount: r.identity8122OwnerAccountIri ? kbAccountFromIri(r.identity8122OwnerAccountIri) : null,
            agentAccount: r.identity8122AgentAccountIri ? kbAccountFromIri(r.identity8122AgentAccountIri) : null,
          }
        : null;

    const identityHol =
      r.identityHolIri && (r.identityHolProtocolIdentifier || r.identityHolUaidHOL)
        ? {
            iri: r.identityHolIri,
            kind: 'hol',
            did: r.identityHolProtocolIdentifier ?? 'aid:unknown',
            uaidHOL: r.identityHolUaidHOL,
            descriptor: identityHolDescriptor,
            serviceEndpoints: [],
          }
        : null;

    const identity =
      (r.identity8004Iri && r.did8004
        ? { iri: r.identity8004Iri, kind: '8004', did: r.did8004, descriptor: identity8004Descriptor, serviceEndpoints }
        : null) ??
      (identity8122 ? { ...identity8122 } : null) ??
      (identityHol ? { ...identityHol } : null) ??
      identityEns;

    return {
      iri: r.iri,
      uaid: r.uaid,
      agentName: r.agentDescriptorName,
      agentDescription: r.agentDescriptorDescription,
      agentImage: r.agentDescriptorImage,
      agentDescriptor: r.agentDescriptorIri
        ? {
            iri: r.agentDescriptorIri,
            name: r.agentDescriptorName,
            description: r.agentDescriptorDescription,
            image: r.agentDescriptorImage,
          }
        : null,
      agentTypes: r.agentTypes,
      createdAtBlock: r.createdAtBlock == null ? null : Math.trunc(r.createdAtBlock),
      createdAtTime: r.createdAtTime == null ? null : Math.trunc(r.createdAtTime),
      updatedAtTime: r.updatedAtTime == null ? null : Math.trunc(r.updatedAtTime),
      trustLedgerTotalPoints: r.trustLedgerTotalPoints == null ? null : Math.trunc(r.trustLedgerTotalPoints),
      trustLedgerBadgeCount: r.trustLedgerBadgeCount == null ? null : Math.trunc(r.trustLedgerBadgeCount),
      trustLedgerComputedAt: r.trustLedgerComputedAt == null ? null : Math.trunc(r.trustLedgerComputedAt),
      atiOverallScore: r.atiOverallScore == null ? null : Math.trunc(r.atiOverallScore),
      atiOverallConfidence: r.atiOverallConfidence == null ? null : Number(r.atiOverallConfidence),
      atiVersion: r.atiVersion ?? null,
      atiComputedAt: r.atiComputedAt == null ? null : Math.trunc(r.atiComputedAt),
      serviceEndpoints,
      identity8004,
      identity8122,
      identityEns,
      identityHol,
      identity,

      // Counts are precomputed in the main kbAgents/kbOwnedAgents queries to avoid N+1 GraphDB calls.
      reviewAssertions: async (args: any, ctx: any) => {
        const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
        const total = Number.isFinite(r.feedbackAssertionCount) ? Math.max(0, Math.trunc(r.feedbackAssertionCount)) : 0;
        const first = args?.first ?? null;
        const skip = args?.skip ?? null;
        return {
          total,
          items: async (_args: any, ctx2: any) => {
            const gctx = (ctx2 && typeof ctx2 === 'object' ? (ctx2 as any).graphdb : graphdbCtx) as GraphdbQueryContext | null;
            const uaid = typeof (r as any).uaid === 'string' ? String((r as any).uaid).trim() : '';
            if (!uaid) return [];
            const items = await kbReviewItemsForAgentQuery(
              {
                uaid,
                first,
                skip,
              },
              gctx,
            );
            return items.map((row) => ({ iri: row.iri, agentDid8004: row.agentDid8004, json: row.json, record: row.record }));
          },
        };
      },

      validationAssertions: async (args: any, ctx: any) => {
        const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
        const total = Number.isFinite(r.validationAssertionCount) ? Math.max(0, Math.trunc(r.validationAssertionCount)) : 0;
        const first = args?.first ?? null;
        const skip = args?.skip ?? null;
        return {
          total,
          items: async (_args: any, ctx2: any) => {
            const gctx = (ctx2 && typeof ctx2 === 'object' ? (ctx2 as any).graphdb : graphdbCtx) as GraphdbQueryContext | null;
            const res = await kbValidationResponsesForAgentQuery(
              {
                uaid: typeof (r as any).uaid === 'string' ? String((r as any).uaid).trim() : '',
                first,
                skip,
              },
              gctx,
            );
            return res.items.map((row) => ({ iri: row.iri, agentDid8004: row.agentDid8004, json: row.json, record: row.record }));
          },
        };
      },

      assertions: async () => {
        const fbTotal = Number.isFinite(r.feedbackAssertionCount) ? Math.max(0, Math.trunc(r.feedbackAssertionCount)) : 0;
        const vrTotal = Number.isFinite(r.validationAssertionCount) ? Math.max(0, Math.trunc(r.validationAssertionCount)) : 0;
        return {
          total: fbTotal + vrTotal,
          reviewResponses: { total: fbTotal, items: [] },
          validationResponses: { total: vrTotal, items: [] },
        };
      },
    };
  };

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

  const extractHolNativeIdFromUaid = (uaid: string): string | null => {
    const u = String(uaid || '').trim();
    if (!u) return null;
    // Prefer explicit params when present (HOL UAIDs often include these).
    for (const k of ['nativeId', 'uid'] as const) {
      const m = u.match(new RegExp(`[;?]${k}=([^;]+)`));
      if (m?.[1]) {
        try {
          const v = decodeURIComponent(m[1]).trim();
          if (/^\d+:\d+$/.test(v)) return v;
        } catch {
          const v = String(m[1]).trim();
          if (/^\d+:\d+$/.test(v)) return v;
        }
      }
    }
    // UAID may be a wrapped did:8004:<chainId>:<agentId>
    const did = u.startsWith('uaid:') ? u.slice('uaid:'.length) : u;
    const head = did.split(';')[0]?.trim() ?? '';
    const m8004 = head.match(/^did:8004:(\d+):(\d+)$/);
    if (m8004?.[1] && m8004?.[2]) return `${m8004[1]}:${m8004[2]}`;
    return null;
  };

  async function lookupHolUaidInKbByOriginalId(originalId: string, graphdbCtx?: GraphdbQueryContext | null): Promise<string | null> {
    const v = String(originalId || '').trim();
    if (!v) return null;
    const escaped = v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const ctx = 'https://www.agentictrust.io/graph/data/subgraph/hol';
    const sparql = `
PREFIX hol: <https://agentictrust.io/ontology/hol#>
SELECT (SAMPLE(?uaid) AS ?uaidOut) WHERE {
  GRAPH <${ctx}> {
    ?identity a hol:AgentIdentityHOL ;
             hol:uaidHOL ?uaid ;
             hol:hasAgentProfileHOL ?profile .
    ?profile hol:originalId "${escaped}" .
  }
}
LIMIT 1
`;
    const rows = await runGraphdbQueryBindings(sparql, graphdbCtx, 'hol.lookupUaidByOriginalId');
    const uaid = typeof (rows?.[0] as any)?.uaidOut?.value === 'string' ? String((rows[0] as any).uaidOut.value).trim() : '';
    return uaid && uaid.startsWith('uaid:') ? uaid : null;
  }

  async function fetchHolRegistryHitByNativeId(nativeId: string): Promise<any | null> {
    const v = String(nativeId || '').trim();
    if (!v) return null;
    // Use the exact endpoint form you provided (meta.nativeId).
    const path = `/search?registries=erc-8004&meta.nativeId=${encodeURIComponent(v)}`;
    // eslint-disable-next-line no-console
    console.info('[hol][registry-nativeId-search] request', { nativeId: v, path });
    const res = await (holRegistryBroker as any).requestJson(path, { method: 'GET' });
    const hits = Array.isArray((res as any)?.hits) ? (res as any).hits : [];
    // eslint-disable-next-line no-console
    console.info('[hol][registry-nativeId-search] response', {
      nativeId: v,
      hitCount: hits.length,
      firstUaid: typeof hits?.[0]?.uaid === 'string' ? hits[0].uaid : null,
    });
    return hits.length ? hits[0] : null;
  }

  async function ensureHolHitInKnowledgeGraph(args: { nativeId: string }): Promise<string | null> {
    // If it's already in GraphDB, don't hit the website endpoint.
    const existing = await lookupHolUaidInKbByOriginalId(args.nativeId);
    if (existing) {
      // eslint-disable-next-line no-console
      console.info('[hol][registry-nativeId-search] cache-hit (kb)', { nativeId: args.nativeId, holUaid: existing });
      return existing;
    }
    const hit = await fetchHolRegistryHitByNativeId(args.nativeId);
    const holUaid = normalizeUaidString(hit?.uaid);
    // eslint-disable-next-line no-console
    console.info('[hol][registry-nativeId-search] selected', {
      nativeId: args.nativeId,
      selected: Boolean(holUaid),
      holUaid,
      originalId: hit?.originalId ?? null,
      registry: hit?.registry ?? null,
      name: hit?.name ?? null,
    });
    if (!holUaid) return null;
    try {
      await upsertHolResolvedAgentToGraphdb({ uaid: holUaid, resolved: { agent: hit } });
    } catch (e: any) {
      console.warn('[hol] failed to upsert HOL registry search hit into GraphDB', {
        uaid: holUaid,
        nativeId: args.nativeId,
        error: String(e?.message || e || ''),
      });
    }
    return holUaid;
  }

  const resolveAgentOwnerEoaAddressByUaid = async (uaid: string, graphdbCtx?: GraphdbQueryContext | null): Promise<string | null> => {
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
      ?agent core:hasIdentity ?identity8004 .
      ?identity8004 a erc8004:AgentIdentity8004 ;
                    erc8004:hasOwnerEOAAccount ?acct .
      ?acct eth:accountAddress ?addr .
    }
  }
}
LIMIT 1
`;
    const res = await queryGraphdbWithContext(
      baseUrl,
      repository,
      auth,
      sparql,
      graphdbCtx ? { ...graphdbCtx, label: 'kbIsOwner.resolveAgentOwnerEoaAddressByUaid' } : { label: 'kbIsOwner.resolveAgentOwnerEoaAddressByUaid' },
    );
    const b = res?.results?.bindings?.[0];
    const v = typeof b?.addrOut?.value === 'string' ? b.addrOut.value.trim().toLowerCase() : '';
    return normalizeHexAddr(v);
  };

  return {
    oasfSkills: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
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

      const rows = await runGraphdbQueryBindings(sparql, graphdbCtx, 'oasfSkills');
      return rows.map((row: any) => ({
        key: row.key?.value ?? '',
        nameKey: row.name?.value ?? null,
        uid: row.uid?.value != null ? Number(row.uid.value) : null,
        caption: row.caption?.value ?? null,
        extendsKey: row.extendsKey?.value ? decodeKey(row.extendsKey.value) : null,
        category: row.category?.value ?? null,
      }));
    },

    oasfDomains: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
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

      const rows = await runGraphdbQueryBindings(sparql, graphdbCtx, 'oasfDomains');
      return rows.map((row: any) => ({
        key: row.key?.value ?? '',
        nameKey: row.name?.value ?? null,
        uid: row.uid?.value != null ? Number(row.uid.value) : null,
        caption: row.caption?.value ?? null,
        extendsKey: row.extendsKey?.value ? decodeKey(row.extendsKey.value) : null,
        category: row.category?.value ?? null,
      }));
    },

    intentTypes: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
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

      const rows = await runGraphdbQueryBindings(sparql, graphdbCtx, 'intentTypes');
      return rows.map((row: any) => ({
        key: decodeKey(row.key?.value ?? ''),
        label: row.label?.value ?? null,
        description: row.description?.value ?? null,
      }));
    },

    taskTypes: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
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

      const rows = await runGraphdbQueryBindings(sparql, graphdbCtx, 'taskTypes');
      return rows.map((row: any) => ({
        key: decodeKey(row.key?.value ?? ''),
        label: row.label?.value ?? null,
        description: row.description?.value ?? null,
      }));
    },

    intentTaskMappings: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
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

      const rows = await runGraphdbQueryBindings(sparql, graphdbCtx, 'intentTaskMappings');
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

    kbAgents: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
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

      const { rows, total, hasMore } = await kbAgentsQuery(
        {
          where,
          first,
          skip,
          orderBy,
          orderDirection,
        },
        graphdbCtx,
      );

      const agents = rows.map((r) => mapRowToKbAgent(r));

      return { agents, total, hasMore };
    },

    kbOwnedAgents: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const chainId = Number(args?.chainId);
      const ownerAddress = typeof args?.ownerAddress === 'string' ? args.ownerAddress : '';
      const first = args?.first ?? null;
      const skip = args?.skip ?? null;
      const orderBy = args?.orderBy ?? null;
      const orderDirection = args?.orderDirection ?? null;

      if (!Number.isFinite(chainId) || !ownerAddress.trim()) {
        return { agents: [], total: 0, hasMore: false };
      }

      const { rows, total, hasMore } = await kbOwnedAgentsQuery(
        {
          chainId: Math.trunc(chainId),
          ownerAddress,
          first,
          skip,
          orderBy,
          orderDirection,
        },
        graphdbCtx,
      );

      const agents = rows.map((r) => mapRowToKbAgent(r));
      return { agents, total, hasMore };
    },

    kbOwnedAgentsAllChains: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const ownerAddress = typeof args?.ownerAddress === 'string' ? args.ownerAddress : '';
      const first = args?.first ?? null;
      const skip = args?.skip ?? null;
      const orderBy = args?.orderBy ?? null;
      const orderDirection = args?.orderDirection ?? null;

      const { rows, total, hasMore } = await kbOwnedAgentsAllChainsQuery(
        {
          ownerAddress,
          first,
          skip,
          orderBy,
          orderDirection,
        },
        graphdbCtx,
      );

      const agents = rows.map((r) => mapRowToKbAgent(r));
      return { agents, total, hasMore };
    },

    kbIsOwner: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const uaid = assertUaidInput(args?.uaid, 'uaid');
      const walletAddressRaw = typeof args?.walletAddress === 'string' ? args.walletAddress.trim() : '';
      if (!uaid || !walletAddressRaw) return false;

      const chainId = parseUaidChainId(uaid);
      const walletAddr = normalizeHexAddr(walletAddressRaw);
      if (!walletAddr) return false;

      // Try to resolve the agent's recorded EOA owner from KB.
      const agentOwnerEoa = await resolveAgentOwnerEoaAddressByUaid(uaid, graphdbCtx);
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

    kbAgentByUaid: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const uaid = assertUaidInput(args?.uaid, 'uaid');
      if (!uaid) return null;
      // eslint-disable-next-line no-console
      console.info('[kb][kbAgentByUaid] start', {
        uaid,
        isDid8004: uaid.startsWith('uaid:did:8004:'),
        extractedNativeId: extractHolNativeIdFromUaid(uaid),
      });

      const run = async (uaidToQuery: string) => await kbAgentsQuery({ where: { uaid: uaidToQuery }, first: 1, skip: 0 }, graphdbCtx);

      // Use uaid (not uaid_in) so the query layer can apply base-UAID prefix matching (for HOL UAIDs).
      let res = await run(uaid);
      // eslint-disable-next-line no-console
      console.info('[kb][kbAgentByUaid] initial kbAgentsQuery result', { uaid, rows: res.rows.length });

      // If caller passed uaid:did:8004:* (common for "find HOL json for a DID"),
      // translate it via HOL registry search on meta.nativeId and then return the matching HOL agent (uaid:aid:*).
      //
      // IMPORTANT: we do this even when we *did* find an on-chain 8004 agent row, because callers want the HOL JSON
      // attached under identityHol/descriptor for that did:8004 nativeId.
      if (uaid.startsWith('uaid:did:8004:')) {
        const nativeId = extractHolNativeIdFromUaid(uaid);
        if (nativeId) {
          // eslint-disable-next-line no-console
          console.info('[hol][registry-nativeId-search] ensure (from did uaid)', { uaid, nativeId, hadKbRow: res.rows.length > 0 });
          let holUaid: string | null = null;
          try {
            holUaid = await ensureHolHitInKnowledgeGraph({ nativeId });
          } catch (e: any) {
            console.warn('[hol][registry-nativeId-search] ensure failed (non-fatal)', {
              uaid,
              nativeId,
              error: String(e?.message || e || ''),
            });
            holUaid = null;
          }

          if (holUaid) {
            const holRes = await run(holUaid);
            // Only switch to HOL result if it actually resolved to a KB agent row.
            // This avoids "losing" a perfectly valid on-chain 8004 agent when HOL
            // search is unavailable or the HOL hit hasn't been materialized into KB.
            if (holRes.rows.length) res = holRes;
          }
          // eslint-disable-next-line no-console
          console.info('[kb][kbAgentByUaid] after ensureHolHitInKnowledgeGraph', { uaid, nativeId, holUaid, rows: res.rows.length });
        } else {
          // eslint-disable-next-line no-console
          console.info('[hol][registry-nativeId-search] skipped (no nativeId extracted)', { uaid });
        }
      }

      if (!res.rows.length) {
        // For HOL-style UAIDs (uaid:aid:*), we want a hard failure with enough context for clients to debug
        // what exact UAID we attempted to resolve.
        if (uaid.startsWith('uaid:aid:')) {
          throw new Error(
            `Agent not found for uaid=${uaid}. ` +
              `If this is a HOL agent, ensure you query the HOL KB graph (chainId=295) via kbAgents(where:{chainId:295, uaid:"${uaid}"}).`,
          );
        }
        return null;
      }

      let agent = res.rows[0]!;

      // If we found a HOL agent but we don't have its HOL descriptor yet, backfill from HOL registry search.
      const needsHolDescriptor =
        Boolean(agent.identityHolIri) && !agent.identityHolDescriptorIri && !agent.identityHolDescriptorJson;
      if (needsHolDescriptor) {
        const nativeId = extractHolNativeIdFromUaid(agent.uaid ?? uaid);
        if (nativeId) {
          const holUaid = await ensureHolHitInKnowledgeGraph({ nativeId });
          if (holUaid) {
            const refreshed = await run(holUaid);
            if (refreshed.rows.length) agent = refreshed.rows[0]!;
          }
        }
      }

      return mapRowToKbAgent(agent);
    },

    kbHolAgentProfileByUaid: async (args: any) => {
      const uaid = assertUaidInput(args?.uaid, 'uaid');
      if (!uaid) return null;
      return await resolveHolAgentProfileByUaid(uaid, args?.include);
    },

    // NOTE: DID lookup flow intentionally disabled for now. Use kbHolRegistries to inspect registry labels.

    kbHolCapabilities: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const first = typeof args?.first === 'number' ? args.first : null;
      const skip = typeof args?.skip === 'number' ? args.skip : null;
      const rows = await kbHolCapabilitiesQuery({ first, skip }, graphdbCtx);
      return rows.map((r) => ({ iri: r.iri, key: r.key, label: r.label, json: r.json }));
    },

    kbHolRegistries: async () => {
      const regs = await holRegistryBroker.registries();
      const list = Array.isArray((regs as any)?.registries) ? (regs as any).registries : Array.isArray(regs) ? regs : [];
      // eslint-disable-next-line no-console
      console.info('[hol] registries', { count: list.length });
      return list;
    },

    kbHolRegistriesForProtocol: async (args: any) => {
      const protocol = typeof args?.protocol === 'string' ? args.protocol.trim() : '';
      if (!protocol) throw new Error('protocol is required');

      const regs = await holRegistryBroker.registries();
      const list = Array.isArray((regs as any)?.registries) ? (regs as any).registries : Array.isArray(regs) ? regs : [];
      const out: string[] = [];

      for (const reg of list) {
        if (typeof reg !== 'string' || !reg.trim()) continue;
        try {
          const r = await holRegistryBroker.search({ page: 1, limit: 1, registry: reg, protocols: [protocol] });
          const hits = Array.isArray((r as any)?.hits) ? (r as any).hits : [];
          if (hits.length > 0) out.push(reg);
        } catch {
          // ignore per-registry failures
        }
      }

      // eslint-disable-next-line no-console
      console.info('[hol] registriesForProtocol', { protocol, registryCount: out.length });
      return out;
    },

    kbHolStats: async () => {
      const stats = await holRegistryBroker.stats();
      const registriesRec = (stats as any)?.registries && typeof (stats as any).registries === 'object' ? (stats as any).registries : {};
      const capsRec = (stats as any)?.capabilities && typeof (stats as any).capabilities === 'object' ? (stats as any).capabilities : {};

      const registries = Object.entries(registriesRec).map(([registry, n]) => ({
        registry,
        agentCount: Number.isFinite(Number(n)) ? Math.trunc(Number(n)) : 0,
      }));
      const capabilities = Object.entries(capsRec).map(([capability, n]) => ({
        capability,
        agentCount: Number.isFinite(Number(n)) ? Math.trunc(Number(n)) : 0,
      }));

      return {
        totalAgents: Number.isFinite(Number((stats as any)?.totalAgents)) ? Math.trunc(Number((stats as any).totalAgents)) : 0,
        lastUpdate: typeof (stats as any)?.lastUpdate === 'string' ? (stats as any).lastUpdate : null,
        status: typeof (stats as any)?.status === 'string' ? (stats as any).status : null,
        registries,
        capabilities,
      };
    },

    kbHolRegistrySearch: async (args: any) => {
      const registry = typeof args?.registry === 'string' ? args.registry.trim() : '';
      if (!registry) throw new Error('registry is required');
      const q = typeof args?.q === 'string' && args.q.trim() ? args.q.trim() : undefined;
      const originalIdArg = typeof args?.originalId === 'string' && args.originalId.trim() ? args.originalId.trim() : undefined;
      const qLooksLikeOriginalId = Boolean(q && /^\d+:\d+$/.test(q));
      // If q is of the form "<chainId>:<agentId>" (e.g. "1:9402"), treat it as an originalId exact match.
      // This avoids returning a bunch of unrelated hits when the namespace search isn't exact.
      const originalId = originalIdArg ?? (qLooksLikeOriginalId ? q : undefined);
      if (!q && !originalId) throw new Error('q or originalId is required');

      // Prefer metadata filter when provided (more precise than q).
      let res: any = null;
      if (originalId) {
        console.info('>>>>>>>>>>>>>>> [hol][registry-search] originalId', { registry, originalId });
        res = await holRegistryBroker.search({
          registry,
          page: 1,
          limit: 50,
          metadata: { originalId: [originalId] },
        });
      }

      // Fallback: registry-scoped query search endpoint
      if (!res) {
        console.info('***************** [hol][registry-search] fallback to registry-scoped query search endpoint', { registry, q });
        res = await holRegistryBroker.registrySearchByNamespace(registry, q);
      }

      let hits = Array.isArray((res as any)?.hits) ? (res as any).hits : [];
      let narrowed = false;

      // Secondary narrowing: when q is of the form "<chainId>:<agentId>" (e.g. "1:9402"),
      // prefer the exact match on hit.originalId from the namespace query results.
      if (q && /^\d+:\d+$/.test(q) && hits.length > 0) {
        const exact = hits.find((h: any) => typeof h?.originalId === 'string' && h.originalId.trim() === q) ?? null;
        if (exact) {
          // eslint-disable-next-line no-console
          console.info('[hol][registry-search] exact originalId match', { registry, q, uaid: exact?.uaid ?? null, id: exact?.id ?? null });
          hits = [exact];
          narrowed = true;
          // keep res for total/page/limit fields, but override total below via hits.length fallback
        } else {
          // eslint-disable-next-line no-console
          console.info('[hol][registry-search] no exact originalId match', { registry, q, hitCount: hits.length });
        }
      }




      return {
        total: narrowed ? hits.length : Number.isFinite(Number((res as any)?.total)) ? Math.trunc(Number((res as any).total)) : hits.length,
        page: Number.isFinite(Number((res as any)?.page)) ? Math.trunc(Number((res as any).page)) : null,
        limit: Number.isFinite(Number((res as any)?.limit)) ? Math.trunc(Number((res as any).limit)) : null,
        hits: hits.map((h: any) => ({
          uaid: typeof h?.uaid === 'string' ? h.uaid : null,
          id: typeof h?.id === 'string' ? h.id : null,
          registry: typeof h?.registry === 'string' ? h.registry : null,
          name: typeof h?.name === 'string' ? h.name : null,
          description: typeof h?.description === 'string' ? h.description : null,
          originalId: typeof h?.originalId === 'string' ? h.originalId : null,
          protocols: Array.isArray(h?.protocols) ? h.protocols.map((p: any) => String(p)) : [],
          json: (() => {
            try {
              return JSON.stringify(h);
            } catch {
              return null;
            }
          })(),
        })),
      };
    },

    kbHolVectorSearch: async (args: any) => {
      const input = args?.input ?? {};
      const query = typeof input?.query === 'string' ? input.query.trim() : '';
      if (!query) throw new Error('input.query is required');
      const limit = Number.isFinite(Number(input?.limit)) ? Math.max(1, Math.trunc(Number(input.limit))) : 3;
      const filter = input?.filter && typeof input.filter === 'object' ? input.filter : null;
      const registry = typeof filter?.registry === 'string' && filter.registry.trim() ? filter.registry.trim() : undefined;
      const capabilities = Array.isArray(filter?.capabilities)
        ? filter.capabilities.map((c: any) => String(c)).filter((c: string) => c.trim())
        : undefined;

      const vectorSearch = (holRegistryBroker as any)?.vectorSearch;
      if (typeof vectorSearch !== 'function') {
        throw new Error('HOL SDK client does not support vectorSearch() in this build.');
      }

      const res = await vectorSearch.call(holRegistryBroker, {
        query,
        limit,
        filter: {
          ...(registry ? { registry } : {}),
          ...(capabilities && capabilities.length ? { capabilities } : {}),
        },
      });
      const hits = Array.isArray((res as any)?.hits) ? (res as any).hits : Array.isArray(res) ? res : [];

      return {
        total: Number.isFinite(Number((res as any)?.total)) ? Math.trunc(Number((res as any).total)) : hits.length,
        page: Number.isFinite(Number((res as any)?.page)) ? Math.trunc(Number((res as any).page)) : null,
        limit: Number.isFinite(Number((res as any)?.limit)) ? Math.trunc(Number((res as any).limit)) : limit,
        hits: hits.map((h: any) => ({
          uaid: typeof h?.uaid === 'string' ? h.uaid : null,
          id: typeof h?.id === 'string' ? h.id : null,
          registry: typeof h?.registry === 'string' ? h.registry : null,
          name: typeof h?.name === 'string' ? h.name : null,
          description: typeof h?.description === 'string' ? h.description : null,
          originalId: typeof h?.originalId === 'string' ? h.originalId : null,
          protocols: Array.isArray(h?.protocols) ? h.protocols.map((p: any) => String(p)) : [],
          json: (() => {
            try {
              return JSON.stringify(h);
            } catch {
              return null;
            }
          })(),
        })),
      };
    },

    kbHolSyncCapabilities: async () => {
      const caps = await fetchHolCapabilities();
      const res = await upsertHolCapabilityCatalogToGraphdb({ capabilities: caps });
      return { success: true, count: res.count, message: `Upserted ${res.count} HOL capabilities into KB.` };
    },

    kbErc8122Registries: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const chainId = Number(args?.chainId);
      if (!Number.isFinite(chainId) || Math.trunc(chainId) <= 0) return [];
      const first = args?.first ?? null;
      const skip = args?.skip ?? null;
      const rows = await kbErc8122RegistriesQuery({ chainId: Math.trunc(chainId), first, skip }, graphdbCtx);
      return rows.map((r) => ({
        iri: r.iri,
        chainId: r.chainId,
        registryAddress: r.registryAddress,
        registrarAddress: r.registrarAddress,
        registryName: r.registryName,
        registryImplementationAddress: r.registryImplementationAddress,
        registrarImplementationAddress: r.registrarImplementationAddress,
        registeredAgentCount: r.registeredAgentCount == null ? null : Math.trunc(r.registeredAgentCount),
        lastAgentUpdatedAtTime: r.lastAgentUpdatedAtTime == null ? null : Math.trunc(r.lastAgentUpdatedAtTime),
      }));
    },

    kbSemanticAgentSearch: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
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
        const rows = await kbHydrateAgentsByDid8004({ chainId, did8004List: didList }, graphdbCtx);
        for (const r of rows) {
          hydrated.set(r.did8004, {
            iri: r.agentIri,
            uaid: r.uaid,
            agentName: r.agentName,
            agentDescription: null,
            agentImage: null,
            agentDescriptor: null,
            agentTypes: r.agentTypes,
            serviceEndpoints: [
              r.a2aServiceEndpointIri && r.a2aProtocolIri
                ? {
                    iri: r.a2aServiceEndpointIri,
                    name: 'a2a',
                    descriptor: r.a2aServiceEndpointIri
                      ? {
                          iri: String(r.a2aServiceEndpointIri).replace('/id/service-endpoint/', '/id/descriptor/service-endpoint/'),
                          name: null,
                          description: null,
                          image: null,
                        }
                      : null,
                    protocol: {
                      iri: r.a2aProtocolIri,
                      protocol: 'a2a',
                      protocolVersion: r.a2aProtocolVersion,
                      serviceUrl: r.a2aServiceUrl,
                      descriptor: r.a2aProtocolIri
                        ? {
                            iri: String(r.a2aProtocolIri).replace('/id/protocol/', '/id/descriptor/protocol/'),
                            name: null,
                            description: null,
                            image: null,
                            agentCardJson: r.a2aJson,
                          }
                        : null,
                      skills: r.a2aSkills,
                      domains: [],
                    },
                  }
                : null,
              r.mcpServiceEndpointIri && r.mcpProtocolIri
                ? {
                    iri: r.mcpServiceEndpointIri,
                    name: 'mcp',
                    descriptor: r.mcpServiceEndpointIri
                      ? {
                          iri: String(r.mcpServiceEndpointIri).replace('/id/service-endpoint/', '/id/descriptor/service-endpoint/'),
                          name: null,
                          description: null,
                          image: null,
                        }
                      : null,
                    protocol: {
                      iri: r.mcpProtocolIri,
                      protocol: 'mcp',
                      protocolVersion: r.mcpProtocolVersion,
                      serviceUrl: r.mcpServiceUrl,
                      descriptor: r.mcpProtocolIri
                        ? {
                            iri: String(r.mcpProtocolIri).replace('/id/protocol/', '/id/descriptor/protocol/'),
                            name: null,
                            description: null,
                            image: null,
                            agentCardJson: r.mcpJson,
                          }
                        : null,
                      skills: r.mcpSkills,
                      domains: [],
                    },
                  }
                : null,
            ].filter(Boolean),
            identity8004:
              r.identity8004Iri
                ? {
                    iri: r.identity8004Iri,
                    kind: '8004',
                    did: r.did8004,
                    did8004: r.did8004,
                    agentId8004: Number.isFinite(Number(r.did8004.split(':').pop())) ? Number(r.did8004.split(':').pop()) : null,
                    isSmartAgent: r.agentTypes.includes('https://agentictrust.io/ontology/erc8004#SmartAgent'),
                    serviceEndpoints: [
                      r.a2aServiceEndpointIri && r.a2aProtocolIri
                        ? {
                            iri: r.a2aServiceEndpointIri,
                            name: 'a2a',
                            descriptor: r.a2aServiceEndpointIri
                              ? {
                                  iri: String(r.a2aServiceEndpointIri).replace('/id/service-endpoint/', '/id/descriptor/service-endpoint/'),
                                  name: null,
                                  description: null,
                                  image: null,
                                }
                              : null,
                            protocol: {
                              iri: r.a2aProtocolIri,
                              protocol: 'a2a',
                              protocolVersion: r.a2aProtocolVersion,
                              serviceUrl: r.a2aServiceUrl,
                              descriptor: r.a2aProtocolIri
                                ? {
                                    iri: String(r.a2aProtocolIri).replace('/id/protocol/', '/id/descriptor/protocol/'),
                                    name: null,
                                    description: null,
                                    image: null,
                                    agentCardJson: r.a2aJson,
                                  }
                                : null,
                              skills: r.a2aSkills,
                              domains: [],
                            },
                          }
                        : null,
                      r.mcpServiceEndpointIri && r.mcpProtocolIri
                        ? {
                            iri: r.mcpServiceEndpointIri,
                            name: 'mcp',
                            descriptor: r.mcpServiceEndpointIri
                              ? {
                                  iri: String(r.mcpServiceEndpointIri).replace('/id/service-endpoint/', '/id/descriptor/service-endpoint/'),
                                  name: null,
                                  description: null,
                                  image: null,
                                }
                              : null,
                            protocol: {
                              iri: r.mcpProtocolIri,
                              protocol: 'mcp',
                              protocolVersion: r.mcpProtocolVersion,
                              serviceUrl: r.mcpServiceUrl,
                              descriptor: r.mcpProtocolIri
                                ? {
                                    iri: String(r.mcpProtocolIri).replace('/id/protocol/', '/id/descriptor/protocol/'),
                                    name: null,
                                    description: null,
                                    image: null,
                                    agentCardJson: r.mcpJson,
                                  }
                                : null,
                              skills: r.mcpSkills,
                              domains: [],
                            },
                          }
                        : null,
                    ].filter(Boolean),
                    ownerAccount: r.identityOwnerAccountIri ? kbAccountFromIri(r.identityOwnerAccountIri) : null,
                    operatorAccount: r.identityOperatorAccountIri ? kbAccountFromIri(r.identityOperatorAccountIri) : null,
                    walletAccount: r.identityWalletAccountIri ? kbAccountFromIri(r.identityWalletAccountIri) : null,
                    ownerEOAAccount: r.identityOwnerEOAAccountIri ? kbAccountFromIri(r.identityOwnerEOAAccountIri) : null,
                    agentAccount: r.agentAccountIri ? kbAccountFromIri(r.agentAccountIri) : null,
                    descriptor: r.identity8004DescriptorIri
                      ? {
                          iri: r.identity8004DescriptorIri,
                          kind: '8004',
                          name: null,
                          description: null,
                          image: null,
                          registrationJson: r.registrationJson,
                          nftMetadataJson: null,
                          registeredBy: null,
                          registryNamespace: null,
                          skills: [],
                          domains: [],
                        }
                      : null,
                  }
                : null,
            identityEns: r.identityEnsIri && r.didEns ? { iri: r.identityEnsIri, kind: 'ens', did: r.didEns, descriptor: null, serviceEndpoints: [] } : null,
            identityHol:
              r.identityHolIri && (r.identityHolProtocolIdentifier || r.identityHolUaidHOL)
                ? {
                    iri: r.identityHolIri,
                    kind: 'hol',
                    did: r.identityHolProtocolIdentifier ?? 'aid:unknown',
                    uaidHOL: r.identityHolUaidHOL,
                    descriptor: null,
                    serviceEndpoints: [],
                  }
                : null,
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

    kbAgentTrustIndex: async (_args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const chainId = Number(_args?.chainId);
      const agentId = String(_args?.agentId ?? '').trim();
      if (!Number.isFinite(chainId) || !agentId) return null;

      const graphCtx = `https://www.agentictrust.io/graph/data/analytics/${Math.trunc(chainId)}`;
      const sparql = [
        'PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>',
        'PREFIX prov: <http://www.w3.org/ns/prov#>',
        'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>',
        '',
        'SELECT',
        '  ?ati ?overallScore ?overallConfidence ?version ?computedAt ?bundleJson',
        '  ?component ?cScore ?cWeight ?evidenceCountsJson',
        'WHERE {',
        `  GRAPH <${graphCtx}> {`,
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

      const rows = await runGraphdbQueryBindings(sparql, graphdbCtx, 'kbAgentTrustIndex');
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

    kbTrustLedgerBadgeDefinitions: async (_args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const graphCtx = `https://www.agentictrust.io/graph/data/analytics/system`;
      const sparql = [
        'PREFIX analytics: <https://agentictrust.io/ontology/core/analytics#>',
        'PREFIX prov: <http://www.w3.org/ns/prov#>',
        '',
        'SELECT ?badgeId ?program ?name ?description ?iconRef ?points ?ruleId ?ruleJson ?active ?createdAt ?updatedAt WHERE {',
        `  GRAPH <${graphCtx}> {`,
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
      const rows = await runGraphdbQueryBindings(sparql, graphdbCtx, 'kbTrustLedgerBadgeDefinitions');
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

    kbReviews: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const chainId = Number(args?.chainId);
      if (!Number.isFinite(chainId)) return [];
      const rows = await kbReviewsQuery(
        { chainId: Math.trunc(chainId), first: args?.first ?? null, skip: args?.skip ?? null },
        graphdbCtx,
      );
      return rows.map((row) => ({
        iri: row.iri,
        agentDid8004: row.agentDid8004,
        json: row.json,
        record: row.record,
      }));
    },

    kbValidations: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const chainId = Number(args?.chainId);
      if (!Number.isFinite(chainId)) return [];
      const rows = await kbValidationResponsesQuery(
        { chainId: Math.trunc(chainId), first: args?.first ?? null, skip: args?.skip ?? null },
        graphdbCtx,
      );
      return rows.map((row) => ({
        iri: row.iri,
        agentDid8004: row.agentDid8004,
        json: row.json,
        record: row.record,
      }));
    },

    kbAssociations: async (args: any, ctx: any) => {
      const graphdbCtx = (ctx && typeof ctx === 'object' ? (ctx as any).graphdb : null) as GraphdbQueryContext | null;
      const chainId = Number(args?.chainId);
      if (!Number.isFinite(chainId)) return [];
      const rows = await kbAssociationsQuery(
        { chainId: Math.trunc(chainId), first: args?.first ?? null, skip: args?.skip ?? null },
        graphdbCtx,
      );
      return rows.map((row) => ({
        iri: row.iri,
        record: row.record,
      }));
    },
  };
}

