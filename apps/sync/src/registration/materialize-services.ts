import { ingestSubgraphTurtleToGraphdb } from '../graphdb-ingest.js';
import { getGraphdbConfigFromEnv, queryGraphdb } from '../graphdb-http.js';
import { rdfPrefixes } from '../rdf/common.js';
import { identity8004Iri } from '../rdf/common.js';
import { emitProtocolDescriptorFromRegistration } from '../rdf/emit-protocol-descriptor-from-registration.js';

function chainContext(chainId: number): string {
  return `https://www.agentictrust.io/graph/data/subgraph/${chainId}`;
}

function stripPrefixes(turtle: string): string {
  const s = String(turtle || '');
  const idx = s.indexOf('\n\n');
  return idx >= 0 ? s.slice(idx + 2) : s;
}

function bytesFromLatin1String(s: string): Uint8Array {
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff;
  return out;
}

function tryNodeGunzip(bytes: Uint8Array): string | null {
  try {
    const req = (0, eval)('require') as any;
    const zlib = req ? req('node:zlib') ?? req('zlib') : null;
    const B = (globalThis as any).Buffer as any;
    if (!zlib || typeof zlib.gunzipSync !== 'function' || !B) return null;
    const buf = zlib.gunzipSync(B.from(bytes));
    const text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
    return text && text.trim() ? text : null;
  } catch {
    return null;
  }
}

function decodePossiblyCompressedJsonText(raw: string | null): string | null {
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (!s) return null;
  if (s.startsWith('{') || s.startsWith('[')) return s;

  // binary-ish string
  try {
    const bytes = bytesFromLatin1String(s);
    if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
      const gunzipped = tryNodeGunzip(bytes);
      if (gunzipped) {
        const t = gunzipped.trim();
        if (t.startsWith('{') || t.startsWith('[')) return t;
      }
    }
  } catch {}

  // base64 (maybe gzipped)
  try {
    const b64ish = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.length >= 64;
    const B = (globalThis as any).Buffer as any;
    if (b64ish && B) {
      const bytes = new Uint8Array(B.from(s.replace(/\s+/g, ''), 'base64'));
      if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
        const gunzipped = tryNodeGunzip(bytes);
        if (gunzipped) {
          const t = gunzipped.trim();
          if (t.startsWith('{') || t.startsWith('[')) return t;
        }
      }
      const asUtf8 = new TextDecoder('utf-8', { fatal: false }).decode(bytes).trim();
      if (asUtf8.startsWith('{') || asUtf8.startsWith('[')) return asUtf8;
    }
  } catch {}

  return null;
}

function parseServices(jsonText: string): Array<{ name: string; endpoint: string; version: string | null; skills: string[]; domains: string[] }> {
  const raw = decodePossiblyCompressedJsonText(jsonText) ?? jsonText.trim();
  if (!(raw.startsWith('{') || raw.startsWith('['))) return [];
  try {
    const obj: any = JSON.parse(raw);
    const arr = Array.isArray(obj?.services) ? obj.services : Array.isArray(obj?.endpoints) ? obj.endpoints : [];
    if (!Array.isArray(arr)) return [];
    const out: Array<{ name: string; endpoint: string; version: string | null; skills: string[]; domains: string[] }> = [];
    for (const s of arr) {
      if (!s || typeof s !== 'object') continue;
      const name = String((s as any).name ?? '').trim();
      const endpoint = String((s as any).endpoint ?? '').trim();
      const version = typeof (s as any).version === 'string' ? String((s as any).version).trim() : null;
      const skillsRaw = Array.isArray((s as any).a2aSkills) ? (s as any).a2aSkills : Array.isArray((s as any).skills) ? (s as any).skills : [];
      const domainsRaw = Array.isArray((s as any).a2aDomains) ? (s as any).a2aDomains : Array.isArray((s as any).domains) ? (s as any).domains : [];
      const skills = skillsRaw.map((x: any) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
      const domains = domainsRaw.map((x: any) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
      if (!name || !endpoint) continue;
      out.push({ name, endpoint, version, skills, domains });
    }
    return out;
  } catch {
    return [];
  }
}

function partitionOasfKeys(values: string[]): { oasf: string[]; other: string[] } {
  const oasf: string[] = [];
  const other: string[] = [];
  for (const v of values) {
    const s = String(v || '').trim();
    if (!s) continue;
    if (/^[a-z0-9_]+(\/[a-z0-9_]+)+/i.test(s)) oasf.push(s);
    else other.push(s);
  }
  return { oasf, other };
}

export async function materializeRegistrationServicesForChain(chainId: number, opts?: { limit?: number }): Promise<void> {
  const { baseUrl, repository, auth } = getGraphdbConfigFromEnv();
  const ctx = chainContext(chainId);
  const maxAgents = typeof opts?.limit === 'number' && Number.isFinite(opts.limit) && opts.limit > 0 ? Math.trunc(opts.limit) : 50_000;
  const pageSize = 2000;
  console.info('[sync] [materialize-services] start', { chainId, maxAgents, pageSize, ctx });

  let offset = 0;
  let processed = 0;
  let emitted = 0;

  for (;;) {
    const sparql = `
PREFIX core: <https://agentictrust.io/ontology/core#>
PREFIX eth: <https://agentictrust.io/ontology/eth#>
PREFIX erc8004: <https://agentictrust.io/ontology/erc8004#>
SELECT ?agent ?didIdentity ?didAccount ?registrationJson WHERE {
  GRAPH <${ctx}> {
    ?agent a core:AIAgent ;
           core:hasIdentity ?identity8004 .
    ?identity8004 a erc8004:AgentIdentity8004 ;
                  core:hasIdentifier ?ident8004 ;
                  core:hasDescriptor ?desc8004 .
    ?ident8004 core:protocolIdentifier ?didIdentity .
    ?desc8004 erc8004:registrationJson ?registrationJson .

    OPTIONAL {
      ?agent a erc8004:SmartAgent ;
             erc8004:hasAgentAccount ?sa .
      ?sa eth:hasAccountIdentifier ?saIdent .
      ?saIdent core:protocolIdentifier ?didSmart .
    }
    OPTIONAL {
      ?identity8004 erc8004:hasWalletAccount ?wa .
      ?wa eth:hasAccountIdentifier ?waIdent .
      ?waIdent core:protocolIdentifier ?didWallet .
    }
    BIND(COALESCE(?didSmart, ?didWallet) AS ?didAccount)
  }
}
ORDER BY ?didIdentity
LIMIT ${pageSize}
OFFSET ${offset}
`;
    const res = await queryGraphdb(baseUrl, repository, auth, sparql);
    const bindings = Array.isArray(res?.results?.bindings) ? res.results.bindings : [];
    if (!bindings.length) break;

    const lines: string[] = [rdfPrefixes()];
    for (const b of bindings) {
      processed++;
      const agent = typeof b?.agent?.value === 'string' ? b.agent.value : '';
      const didIdentity = typeof b?.didIdentity?.value === 'string' ? b.didIdentity.value : '';
      const didAccount = typeof b?.didAccount?.value === 'string' ? b.didAccount.value : '';
      const registrationJson = typeof b?.registrationJson?.value === 'string' ? b.registrationJson.value : '';
      if (!agent || !didIdentity || !didAccount || !registrationJson) continue;

      const services = parseServices(registrationJson);
      for (const s of services) {
        const nameLc = s.name.trim().toLowerCase();
        const protocol: 'a2a' | 'mcp' | null = nameLc === 'a2a' ? 'a2a' : nameLc === 'mcp' ? 'mcp' : null;
        if (!protocol) continue;
        const ttl = emitProtocolDescriptorFromRegistration({
          didAccount,
          protocol,
          serviceUrl: s.endpoint,
          protocolVersion: s.version,
          endpointJson: s,
          skills: partitionOasfKeys(s.skills),
          domains: partitionOasfKeys(s.domains),
          agentIri: `<${agent}>`,
          identityIri: identity8004Iri(didIdentity),
        });
        const body = stripPrefixes(ttl).trim();
        if (body) {
          lines.push(body);
          lines.push('');
          emitted++;
        }
      }
    }

    const turtle = lines.join('\n');
    if (turtle.trim() && emitted > 0) {
      await ingestSubgraphTurtleToGraphdb({ chainId, section: 'materialize-services', turtle, resetContext: false });
    }

    offset += bindings.length;
    if (processed >= maxAgents) break;
    console.info('[sync] [materialize-services] progress', { chainId, processed, emitted, offset });
  }

  console.info('[sync] [materialize-services] done', { chainId, processed, emitted });
}

