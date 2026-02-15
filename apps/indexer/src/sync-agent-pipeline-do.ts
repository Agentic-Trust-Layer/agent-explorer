type Env = Record<string, any>;

type JobStatus = 'queued' | 'running' | 'completed' | 'failed';

type ChainCursor = {
  chainId: number;
  // Cursor based on (mintedAt, id)
  lastMintedAt: string; // BigInt as decimal string
  lastId: string; // agent id string
  done: boolean;
};

type JobState = {
  id: string;
  status: JobStatus;
  error: string | null;
  createdAt: number;
  startedAt: number | null;
  endedAt: number | null;
  processedAgents: number;
  limitAgents: number;
  batchSize: number;
  chains: ChainCursor[];
  chainIndex: number;
  log: string;
};

function now(): number {
  return Date.now();
}

function iriEncodeSegment(value: string): string {
  return encodeURIComponent(value).replace(/%/g, '_');
}

function jsonLiteral(s: string): string {
  const esc = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  return `"${esc}"`;
}

function appendLog(state: JobState, msg: string): void {
  const max = 250_000;
  state.log = (state.log + msg).slice(-max);
}

function uniqPositiveInts(xs: unknown[]): number[] {
  const out: number[] = [];
  const seen = new Set<number>();
  for (const x of xs) {
    const n = Math.trunc(Number(x));
    if (!Number.isFinite(n) || n <= 0) continue;
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

function subgraphUrlForChain(env: Env, chainId: number): string {
  if (chainId === 1) return String(env.ETH_MAINNET_GRAPHQL_URL || '').trim();
  if (chainId === 59144) return String(env.LINEA_MAINNET_GRAPHQL_URL || '').trim();
  return '';
}

const AGENTS_QUERY_BY_MINTEDAT_CURSOR = `query AgentsByMintedAtCursor($first: Int!, $lastMintedAt: BigInt!, $lastId: String!) {
  agents(
    first: $first,
    where: { or: [ { mintedAt_gt: $lastMintedAt }, { mintedAt: $lastMintedAt, id_gt: $lastId } ] },
    orderBy: mintedAt,
    orderDirection: asc
  ) {
    id
    mintedAt
    agentURI
    name
    description
    image
    ensName
    agentWallet
    a2aEndpoint
    chatEndpoint
    registration {
      id
      raw
      type
      name
      description
      image
      supportedTrust
      a2aEndpoint
      chatEndpoint
      ensName
      updatedAt
    }
    owner { id }
  }
}`;

async function fetchSubgraph(env: Env, graphqlUrl: string, query: string, variables: Record<string, any>): Promise<any> {
  const endpoint = (graphqlUrl || '').replace(/\/graphql\/?$/i, '');
  const headers: Record<string, string> = { 'content-type': 'application/json', accept: 'application/json' };
  const apiKey = String(env.GRAPHQL_API_KEY || '').trim();
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ query, variables }) });
  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(`Subgraph HTTP ${res.status}: ${text.slice(0, 400)}`);
  const json = text ? JSON.parse(text) : {};
  if (Array.isArray(json?.errors) && json.errors.length) throw new Error(`Subgraph errors: ${JSON.stringify(json.errors).slice(0, 400)}`);
  return json;
}

function ttlPrefixes(): string {
  return [
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix prov: <http://www.w3.org/ns/prov#> .',
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    '@prefix schema: <http://schema.org/> .',
    '@prefix core: <https://agentictrust.io/ontology/core#> .',
    '@prefix erc8004: <https://agentictrust.io/ontology/erc8004#> .',
    '@prefix eth: <https://agentictrust.io/ontology/eth#> .',
    '',
  ].join('\n');
}

function agentIri(chainId: number, agentId: string): string {
  return `<https://www.agentictrust.io/id/agent/${chainId}/${iriEncodeSegment(agentId)}>`;
}
function identity8004Iri(did: string): string {
  return `<https://www.agentictrust.io/id/8004-identity/${iriEncodeSegment(did)}>`;
}
function identifier8004Iri(did: string): string {
  return `<https://www.agentictrust.io/id/8004-identifier/${iriEncodeSegment(did)}>`;
}
function identity8004DescriptorIri(did: string): string {
  return `<https://www.agentictrust.io/id/8004-identity-descriptor/${iriEncodeSegment(did)}>`;
}
function agentDescriptorIriFromAgentIri(agentIriToken: string): string {
  const inner = agentIriToken.replace(/^<|>$/g, '');
  return `<https://www.agentictrust.io/id/agent-descriptor/${iriEncodeSegment(inner)}>`;
}
function accountIri(chainId: number, address: string): string {
  return `<https://www.agentictrust.io/id/account/${chainId}/${iriEncodeSegment(String(address).toLowerCase())}>`;
}

function emitAgentsTurtleMinimal(chainId: number, agents: any[]): string {
  const lines: string[] = [ttlPrefixes()];
  for (const a of agents) {
    const agentId = typeof a?.id === 'string' ? a.id.trim() : '';
    if (!agentId) continue;
    const mintedAt = typeof a?.mintedAt === 'string' && /^\d+$/.test(a.mintedAt) ? a.mintedAt : null;
    const updatedAt = typeof a?.registration?.updatedAt === 'string' && /^\d+$/.test(a.registration.updatedAt) ? a.registration.updatedAt : null;

    const did = `did:8004:${chainId}:${agentId}`;
    const uaid = `uaid:${did}`;

    const agentNode = agentIri(chainId, agentId);
    const agentDesc = agentDescriptorIriFromAgentIri(agentNode);
    const id8004 = identity8004Iri(did);
    const ident8004 = identifier8004Iri(did);
    const desc8004 = identity8004DescriptorIri(did);

    const name = (typeof a?.name === 'string' && a.name.trim() ? a.name.trim() : null) ?? (typeof a?.registration?.name === 'string' ? a.registration.name.trim() : null);
    const description =
      (typeof a?.description === 'string' && a.description.trim() ? a.description.trim() : null) ??
      (typeof a?.registration?.description === 'string' && a.registration.description.trim() ? a.registration.description.trim() : null);
    const image =
      (typeof a?.image === 'string' && a.image.trim() ? a.image.trim() : null) ??
      (typeof a?.registration?.image === 'string' && a.registration.image.trim() ? a.registration.image.trim() : null);
    const owner = typeof a?.owner?.id === 'string' ? a.owner.id.trim() : '';
    const wallet = typeof a?.agentWallet === 'string' ? a.agentWallet.trim() : '';

    // Agent node
    lines.push(`${agentNode} a core:AIAgent, prov:SoftwareAgent, prov:Agent, prov:Entity ;`);
    lines.push(`  core:uaid ${jsonLiteral(uaid)} ;`);
    lines.push(`  core:hasIdentity ${id8004} ;`);
    if (mintedAt) lines.push(`  core:createdAtTime ${mintedAt} ;`);
    if (updatedAt) lines.push(`  core:updatedAtTime ${updatedAt} ;`);
    if (name || description || image) lines.push(`  core:hasDescriptor ${agentDesc} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Agent descriptor (for UX fallback)
    if (name || description || image) {
      lines.push(`${agentDesc} a core:AgentDescriptor, core:Descriptor, prov:Entity ;`);
      if (name) lines.push(`  dcterms:title ${jsonLiteral(name)} ;`);
      if (description) lines.push(`  dcterms:description ${jsonLiteral(description)} ;`);
      if (image) lines.push(`  schema:image ${jsonLiteral(image)} ;`);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
      lines.push('');
    }

    // Identity 8004
    lines.push(`${id8004} a erc8004:AgentIdentity8004, core:Identity, prov:Entity ;`);
    lines.push(`  core:identityOf ${agentNode} ;`);
    lines.push(`  core:hasIdentifier ${ident8004} ;`);
    lines.push(`  core:hasDescriptor ${desc8004} ;`);
    lines.push(`  erc8004:agentId ${jsonLiteral(agentId)} ;`);
    if (owner) lines.push(`  erc8004:hasOwnerAccount ${accountIri(chainId, owner)} ;`);
    if (wallet) lines.push(`  erc8004:hasWalletAccount ${accountIri(chainId, wallet)} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');

    // Identifier
    lines.push(`${ident8004} a core:Identifier, prov:Entity ;`);
    lines.push(`  core:protocolIdentifier ${jsonLiteral(did)} .`);
    lines.push('');

    // Identity descriptor (where apps expect registrationJson + name/desc/image)
    const registrationRaw = typeof a?.registration?.raw === 'string' && a.registration.raw.trim() ? a.registration.raw.trim() : null;
    lines.push(`${desc8004} a core:Descriptor, prov:Entity ;`);
    if (registrationRaw) lines.push(`  erc8004:registrationJson ${jsonLiteral(registrationRaw)} ;`);
    if (name) lines.push(`  dcterms:title ${jsonLiteral(name)} ;`);
    if (description) lines.push(`  dcterms:description ${jsonLiteral(description)} ;`);
    if (image) lines.push(`  schema:image ${jsonLiteral(image)} ;`);
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ ;$/, ' .');
    lines.push('');
  }
  return lines.join('\n');
}

async function uploadTurtle(env: Env, params: { context: string; turtle: string }): Promise<void> {
  const baseUrl = String(env.GRAPHDB_BASE_URL || 'https://graphdb.agentkg.io').trim();
  const repository = String(env.GRAPHDB_REPOSITORY || 'agentkg').trim();
  const user = String(env.GRAPHDB_USERNAME || '').trim();
  const pass = String(env.GRAPHDB_PASSWORD || '').trim();
  const auth = user && pass ? `Basic ${btoa(`${user}:${pass}`)}` : null;

  const ctx = params.context.trim();
  const qs = ctx ? `?context=${encodeURIComponent(`<${ctx}>`)}` : '';
  const url = `${baseUrl.replace(/\\/$/, '')}/repositories/${encodeURIComponent(repository)}/statements${qs}`;
  const headers: Record<string, string> = { 'Content-Type': 'text/turtle' };
  if (auth) headers['Authorization'] = auth;

  const res = await fetch(url, { method: 'POST', headers, body: params.turtle });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GraphDB upload failed: HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
}

export class SyncAgentPipelineDO {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async load(): Promise<JobState | null> {
    return (await this.state.storage.get<JobState>('state')) ?? null;
  }

  async save(s: JobState): Promise<void> {
    await this.state.storage.put('state', s);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/start') {
      const body = (await request.json().catch(() => null)) as any;
      const chainIds = uniqPositiveInts(Array.isArray(body?.chainIds) ? body.chainIds : []);
      const limitAgents =
        typeof body?.limitAgents === 'number' && Number.isFinite(body.limitAgents) && body.limitAgents > 0
          ? Math.trunc(body.limitAgents)
          : 500;
      const batchSize =
        typeof body?.batchSize === 'number' && Number.isFinite(body.batchSize) && body.batchSize > 0
          ? Math.min(200, Math.trunc(body.batchSize))
          : 50;

      if (!chainIds.length) return Response.json({ error: 'chainIds is required' }, { status: 400 });

      // Validate subgraph URLs
      for (const cid of chainIds) {
        const u = subgraphUrlForChain(this.env, cid);
        if (!u) return Response.json({ error: `Missing subgraph url for chainId=${cid}` }, { status: 400 });
      }

      const existing = await this.load();
      if (existing && (existing.status === 'queued' || existing.status === 'running')) {
        return Response.json({ error: 'job already running', id: existing.id, status: existing.status }, { status: 409 });
      }

      const id = url.searchParams.get('id') || body?.id || crypto.randomUUID();
      const s: JobState = {
        id: String(id),
        status: 'queued',
        error: null,
        createdAt: now(),
        startedAt: null,
        endedAt: null,
        processedAgents: 0,
        limitAgents,
        batchSize,
        chains: chainIds.map((c) => ({ chainId: c, lastMintedAt: '0', lastId: '', done: false })),
        chainIndex: 0,
        log: '',
      };
      appendLog(s, `[job] queued ${new Date(s.createdAt).toISOString()} chainIds=${chainIds.join(',')} limitAgents=${limitAgents} batchSize=${batchSize}\n`);
      await this.save(s);

      // Run first step soon via alarm (avoids long request).
      await this.state.storage.setAlarm(now() + 250);
      return Response.json({ ok: true, id: s.id, status: s.status });
    }

    if (request.method === 'GET' && url.pathname === '/status') {
      const s = await this.load();
      if (!s) return Response.json({ error: 'not found' }, { status: 404 });
      const current = s.chains[s.chainIndex] ?? null;
      return Response.json({
        id: s.id,
        status: s.status,
        error: s.error,
        createdAt: s.createdAt,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        processedAgents: s.processedAgents,
        limitAgents: s.limitAgents,
        batchSize: s.batchSize,
        chainIds: s.chains.map((c) => c.chainId),
        chainIndex: s.chainIndex,
        currentChain: current,
        logTail: s.log,
      });
    }

    return new Response('not found', { status: 404 });
  }

  async alarm(): Promise<void> {
    const s = await this.load();
    if (!s) return;
    if (s.status === 'completed' || s.status === 'failed') return;

    if (s.status === 'queued') {
      s.status = 'running';
      s.startedAt = now();
      appendLog(s, `[job] running ${new Date(s.startedAt).toISOString()}\n`);
    }

    try {
      await this.runOneStep(s);
    } catch (e: any) {
      s.status = 'failed';
      s.error = String(e?.message || e || '');
      s.endedAt = now();
      appendLog(s, `[job] failed ${new Date(s.endedAt).toISOString()} error=${s.error}\n`);
      await this.save(s);
      return;
    }

    if (s.status === 'running') {
      // Schedule next step until completion.
      await this.save(s);
      await this.state.storage.setAlarm(now() + 500);
    } else {
      await this.save(s);
    }
  }

  async runOneStep(s: JobState): Promise<void> {
    if (s.processedAgents >= s.limitAgents) {
      s.status = 'completed';
      s.endedAt = now();
      appendLog(s, `[job] completed (limit reached) ${new Date(s.endedAt).toISOString()}\n`);
      return;
    }

    // Advance to next chain if needed
    while (s.chainIndex < s.chains.length && s.chains[s.chainIndex]!.done) s.chainIndex++;
    if (s.chainIndex >= s.chains.length) {
      s.status = 'completed';
      s.endedAt = now();
      appendLog(s, `[job] completed ${new Date(s.endedAt).toISOString()}\n`);
      return;
    }

    const cur = s.chains[s.chainIndex]!;
    const graphqlUrl = subgraphUrlForChain(this.env, cur.chainId);
    if (!graphqlUrl) throw new Error(`Missing subgraph url for chainId=${cur.chainId}`);

    const remaining = Math.max(0, s.limitAgents - s.processedAgents);
    const first = Math.max(1, Math.min(s.batchSize, remaining));
    appendLog(s, `[job] fetch agents chainId=${cur.chainId} first=${first} cursor=(${cur.lastMintedAt},${cur.lastId || '""'})\n`);

    const resp = await fetchSubgraph(this.env, graphqlUrl, AGENTS_QUERY_BY_MINTEDAT_CURSOR, {
      first,
      lastMintedAt: cur.lastMintedAt,
      lastId: cur.lastId || '',
    });

    const items = Array.isArray(resp?.data?.agents) ? resp.data.agents : [];
    if (!items.length) {
      cur.done = true;
      appendLog(s, `[job] chainId=${cur.chainId} done (no more agents)\n`);
      return;
    }

    // Emit + upload RDF for this batch
    const turtle = emitAgentsTurtleMinimal(cur.chainId, items);
    const ctx = `https://www.agentictrust.io/graph/data/subgraph/${cur.chainId}`;
    await uploadTurtle(this.env, { context: ctx, turtle });

    const last = items[items.length - 1]!;
    const lastMintedAt = typeof last?.mintedAt === 'string' && /^\d+$/.test(last.mintedAt) ? last.mintedAt : cur.lastMintedAt;
    const lastId = typeof last?.id === 'string' ? last.id.trim() : cur.lastId;
    cur.lastMintedAt = lastMintedAt;
    cur.lastId = lastId;

    s.processedAgents += items.length;
    appendLog(s, `[job] uploaded chainId=${cur.chainId} agents=${items.length} processed=${s.processedAgents}/${s.limitAgents}\n`);

    if (items.length < first) {
      cur.done = true;
      appendLog(s, `[job] chainId=${cur.chainId} done (short page)\n`);
    }
  }
}

