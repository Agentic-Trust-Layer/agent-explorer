type AnyDb = any;

import { upsertAgentCardForAgent } from '../a2a/agent-card-fetch';
import { extractRegistrationA2AEndpoint } from '../a2a/agent-card-backfill';

function safeJsonParse(value: unknown): any | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function uniqStrings(values: Array<string | null | undefined>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const v of values) {
    const t = typeof v === 'string' ? v.trim() : '';
    if (!t) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function takeStringArray(value: any): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const v of value) {
    if (typeof v === 'string' && v.trim()) {
      out.push(v.trim());
      continue;
    }
    // Some producers use objects for skill-like entries.
    if (v && typeof v === 'object') {
      const id = typeof (v as any).id === 'string' ? (v as any).id.trim() : '';
      const name = typeof (v as any).name === 'string' ? (v as any).name.trim() : '';
      if (id) out.push(id);
      else if (name) out.push(name);
    }
  }
  return out;
}

function takeEndpointsArray(raw: any): any[] {
  const e = raw?.endpoints;
  if (Array.isArray(e)) return e;
  if (e && typeof e === 'object') return Object.values(e);
  return [];
}

function filterBogusIds(values: string[]): string[] {
  return values.filter((v) => v && v !== '[object Object]');
}

function takeStringSetFromAgentCard(card: any): { skills: string[]; domains: string[] } {
  const outSkills = new Set<string>();
  const outDomains = new Set<string>();

  // 1) agent card "skills" may be array of strings or array of objects ({id,name,tags,...})
  if (Array.isArray(card?.skills)) {
    for (const s of card.skills) {
      if (typeof s === 'string' && s.trim()) outSkills.add(s.trim());
      else if (s && typeof s === 'object') {
        const id = typeof (s as any).id === 'string' ? (s as any).id.trim() : '';
        const name = typeof (s as any).name === 'string' ? (s as any).name.trim() : '';
        if (id) outSkills.add(id);
        else if (name) outSkills.add(name);

      }
    }
  }

  // 2) optional top-level domains array
  if (Array.isArray(card?.domains)) {
    for (const d of card.domains) {
      if (typeof d === 'string' && d.trim()) outDomains.add(d.trim());
    }
  }

  // 3) OASF extension payloads (common pattern)
  const exts = Array.isArray(card?.capabilities?.extensions) ? card.capabilities.extensions : [];
  for (const ext of exts) {
    const params = (ext && typeof ext === 'object') ? (ext as any).params : null;
    if (!params || typeof params !== 'object') continue;
    for (const d of takeStringArray((params as any).domains)) outDomains.add(d);
    for (const s of takeStringArray((params as any).skills)) outSkills.add(s);
  }

  return { skills: [...outSkills], domains: [...outDomains] };
}

function canonicalTrustModel(value: string): string | null {
  const v = value.trim().toLowerCase();
  if (!v) return null;
  const canon = new Set([
    'execution-integrity',
    'reputation',
    'crypto-economic',
    'social-graph',
    'authority-institutional',
    'identity-assurance',
    'process-conformance',
    'data-provenance',
    'consensus-quorum',
    'contextual-situational',
  ]);
  if (canon.has(v)) return v;

  if (v === 'tee' || v === 'tee-attestation' || v === 'attestation') return 'execution-integrity';
  if (v.includes('zk') || v.includes('zkvm') || v.includes('zk-vm') || v.includes('zk-wasm') || v.includes('zkwasm') || v.includes('cairo') || v.includes('sp1') || v.includes('risc0') || v.includes('risc-zero')) {
    return 'execution-integrity';
  }
  if (v === 'reputation' || v === 'feedback' || v === 'validation') return 'reputation';
  if (v === 'crypto-economic' || v === 'crypto' || v === 'staking' || v === 'stake' || v === 'bond' || v === 'bonded' || v === 'slashing') return 'crypto-economic';
  if (v === 'social' || v === 'social-graph' || v === 'association' || v === 'associations' || v === 'erc8092') return 'social-graph';
  if (v === 'authority' || v === 'institutional' || v === 'authority/institutional' || v === 'pki' || v === 'auditor' || v === 'certifier') return 'authority-institutional';
  if (v === 'identity' || v === 'identity-assurance' || v === 'kyc' || v === 'kyb' || v === 'did' || v === 'proofing') return 'identity-assurance';
  if (v === 'process' || v === 'process-conformance' || v === 'prov' || v === 'provo' || v === 'p-plan' || v === 'audit-trail') return 'process-conformance';
  if (v === 'provenance' || v === 'data-provenance' || v === 'oracle' || v === 'signed-data' || v === 'dataset' || v === 'hash') return 'data-provenance';
  if (v === 'consensus' || v === 'quorum' || v === 'consensus/quorum' || v === 'threshold' || v === 'multisig' || v === 'dao-vote') return 'consensus-quorum';
  if (v === 'contextual' || v === 'situational' || v === 'contextual/situational') return 'contextual-situational';
  return null;
}

function parseSupportedTrust(raw: any): string[] {
  const arr =
    Array.isArray(raw?.supportedTrust) ? raw.supportedTrust :
    Array.isArray(raw?.supportedTrusts) ? raw.supportedTrusts :
    typeof raw?.supportedTrust === 'string' ? [raw.supportedTrust] :
    typeof raw?.supportedTrusts === 'string' ? [raw.supportedTrusts] :
    [];
  return uniqStrings(arr.map((x: any) => (typeof x === 'string' ? x : String(x))));
}

function parseTrustModelsFromSupportedTrust(supportedTrust: string[]): string[] {
  const models: string[] = [];
  for (const t of supportedTrust) {
    const m = canonicalTrustModel(t);
    if (m) models.push(m);
  }
  return uniqStrings(models);
}

function parseOasfFromEndpoints(raw: any): { skills: string[]; domains: string[] } {
  const endpoints = takeEndpointsArray(raw);
  const skills: string[] = [];
  const domains: string[] = [];

  for (const e of endpoints) {
    // OASF endpoint style: { name:"OASF", skills:[...], domains:[...] }
    for (const s of takeStringArray((e as any)?.skills)) skills.push(s);
    for (const d of takeStringArray((e as any)?.domains)) domains.push(d);

    // App registration style: A2A endpoint carries a2aSkills/a2aDomains
    for (const s of takeStringArray((e as any)?.a2aSkills)) skills.push(s);
    for (const d of takeStringArray((e as any)?.a2aDomains)) domains.push(d);

    // Some producers use oasf_skills/oasf_domains keys
    for (const s of takeStringArray((e as any)?.oasf_skills || (e as any)?.oasfSkills)) skills.push(s);
    for (const d of takeStringArray((e as any)?.oasf_domains || (e as any)?.oasfDomains)) domains.push(d);
  }

  // Some producers put these at the root of registration JSON.
  for (const s of takeStringArray(raw?.oasf_skills || raw?.oasfSkills)) skills.push(s);
  for (const d of takeStringArray(raw?.oasf_domains || raw?.oasfDomains)) domains.push(d);

  return { skills: uniqStrings(filterBogusIds(skills)), domains: uniqStrings(filterBogusIds(domains)) };
}

function parseProtocolsFromRawJson(raw: any): Array<{ protocol: string; version: string }> {
  const endpoints = takeEndpointsArray(raw);
  const out: Array<{ protocol: string; version: string }> = [];
  for (const ep of endpoints) {
    const protocol = typeof ep?.name === 'string' ? ep.name.trim() : '';
    if (!protocol) continue;
    const version = typeof ep?.version === 'string' && ep.version.trim() ? ep.version.trim() : '';
    out.push({ protocol, version });
  }
  // de-dupe
  const seen = new Set<string>();
  return out.filter((p) => {
    const k = `${p.protocol}::${p.version}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function parseAgentCard(card: any): {
  a2aUrl: string | null;
  protocolVersion: string | null;
  preferredTransport: string | null;
  name: string | null;
  description: string | null;
  image: string | null;
  capabilities: string[];
  operators: string[];
  skills: string[];
  domains: string[];
} {
  const norm = (v: any) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  const a2aUrl = norm(card?.url) || norm(card?.serviceUrl) || norm(card?.endpoint) || null;
  const protocolVersion = norm(card?.protocolVersion) || null;
  const preferredTransport = norm(card?.preferredTransport) || null;
  const name = norm(card?.name) || null;
  const description = norm(card?.description) || null;
  const image = norm(card?.image) || null;

  const capabilities = Array.isArray(card?.capabilities)
    ? uniqStrings(card.capabilities.map((x: any) => (typeof x === 'string' ? x : String(x))))
    : [];
  const operators = Array.isArray(card?.operators)
    ? uniqStrings(card.operators.map((x: any) => (typeof x === 'string' ? x.toLowerCase() : String(x).toLowerCase())))
    : [];

  const oasfFromCard = takeStringSetFromAgentCard(card);
  const skills = uniqStrings(filterBogusIds(oasfFromCard.skills));
  const domains = uniqStrings(filterBogusIds(oasfFromCard.domains));

  return { a2aUrl, protocolVersion, preferredTransport, name, description, image, capabilities, operators, skills, domains };
}

async function ensureColumns(db: AnyDb): Promise<void> {
  // Best-effort add columns used for derived extraction.
  const tryAdd = async (col: string, type: string) => {
    try {
      await db.exec(`ALTER TABLE agents ADD COLUMN ${col} ${type};`);
    } catch {
      // ignore
    }
  };
  // Existing/expected agent-derived columns (some DBs may not have them yet)
  await tryAdd('oasfSkillsJson', 'TEXT');
  await tryAdd('oasfDomainsJson', 'TEXT');
  await tryAdd('capabilityLabelsJson', 'TEXT');
  await tryAdd('protocolsJson', 'TEXT');
  await tryAdd('trustModelsJson', 'TEXT');
  await tryAdd('agentCardProtocolJson', 'TEXT');

  // Best-effort: ensure normalized tables exist for idempotent inserts.
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS agent_supported_trust (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        trust TEXT NOT NULL,
        PRIMARY KEY (chainId, agentId, trust)
      );
      CREATE TABLE IF NOT EXISTS agent_skills (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        skill TEXT NOT NULL,
        PRIMARY KEY (chainId, agentId, skill)
      );
      CREATE TABLE IF NOT EXISTS agent_operators (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        operator TEXT NOT NULL,
        PRIMARY KEY (chainId, agentId, operator)
      );
      CREATE TABLE IF NOT EXISTS agent_domains (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        domain TEXT NOT NULL,
        PRIMARY KEY (chainId, agentId, domain)
      );
      CREATE TABLE IF NOT EXISTS agent_protocols (
        chainId INTEGER NOT NULL,
        agentId TEXT NOT NULL,
        protocol TEXT NOT NULL,
        version TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (chainId, agentId, protocol, version)
      );
    `);
  } catch {
    // ignore
  }
}

async function getCheckpointValue(db: AnyDb, key: string): Promise<string | null> {
  try {
    const row = await db.prepare('SELECT value FROM checkpoints WHERE key=?').get(key);
    const v = (row as any)?.value;
    return typeof v === 'string' ? v : null;
  } catch {
    return null;
  }
}

async function setCheckpointValue(db: AnyDb, key: string, value: string): Promise<void> {
  try {
    await db
      .prepare('INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
      .run(key, value);
  } catch {
    // ignore
  }
}

function parseCursor(value: unknown): { chainId: number; agentId: string } {
  if (typeof value !== 'string' || !value.trim()) return { chainId: 0, agentId: '' };
  const parts = value.split('|');
  if (parts.length < 2) return { chainId: 0, agentId: '' };
  const chainId = Number(parts[0]);
  const agentId = parts.slice(1).join('|');
  return {
    chainId: Number.isFinite(chainId) && chainId >= 0 ? Math.trunc(chainId) : 0,
    agentId: typeof agentId === 'string' ? agentId : '',
  };
}

function formatCursor(cursor: { chainId: number; agentId: string }): string {
  return `${cursor.chainId}|${cursor.agentId}`;
}

export async function runAgentMetadataExtract(
  db: AnyDb,
  opts?: { reset?: boolean; overwrite?: boolean; chunkSize?: number; chainId?: number; startAgentId?: string },
): Promise<void> {
  if (!db) throw new Error('DB not initialized');
  await ensureColumns(db);

  const overwrite = opts?.overwrite === true || process.env.AGENT_META_OVERWRITE === '1';
  const reset = opts?.reset === true || process.env.AGENT_META_RESET === '1';
  const chunkSize = Number(opts?.chunkSize ?? process.env.AGENT_META_CHUNK_SIZE ?? 250) || 250;
  const chainIdFilter = Number(opts?.chainId ?? process.env.AGENT_META_CHAIN_ID ?? 0) || 0;
  const startAgentIdRaw = (opts?.startAgentId ?? process.env.AGENT_META_START_AGENT_ID ?? '').trim();
  const fetchAgentCard = process.env.AGENT_META_FETCH_AGENT_CARD ? process.env.AGENT_META_FETCH_AGENT_CARD !== '0' : true;
  const checkpointKey = chainIdFilter ? `agentMetadataExtractCursor_${chainIdFilter}` : 'agentMetadataExtractCursor';

  if (reset) {
    await setCheckpointValue(db, checkpointKey, chainIdFilter ? '' : formatCursor({ chainId: 0, agentId: '' }));
  }
  let cursor = (() => {
    const saved = getCheckpointValue(db, checkpointKey);
    // placeholder; will be awaited below
    return { chainId: 0, agentId: '' };
  })();
  const savedCursor = await getCheckpointValue(db, checkpointKey);
  if (chainIdFilter) {
    cursor = { chainId: chainIdFilter, agentId: savedCursor ? savedCursor.trim() : '' };
  } else {
    cursor = parseCursor(savedCursor);
  }

  if (startAgentIdRaw) {
    if (!chainIdFilter) {
      console.warn('[agent-meta] startAgentId ignored (requires chainId)', { startAgentId: startAgentIdRaw });
    } else {
      const startNum = Number(startAgentIdRaw);
      const curNum = Number(cursor.agentId || '0');
      if (Number.isFinite(startNum) && startNum >= 0) {
        if (!cursor.agentId || !Number.isFinite(curNum) || curNum < startNum) {
          cursor = { chainId: chainIdFilter, agentId: String(Math.trunc(startNum)) };
        }
      } else {
        console.warn('[agent-meta] invalid startAgentId ignored', { startAgentId: startAgentIdRaw });
      }
    }
  }

  console.log('[agent-meta] start', { overwrite, reset, chunkSize, chainId: chainIdFilter || 'all', cursor });

  const query = `
    SELECT
      chainId, agentId,
      rawJson, agentCardJson,
      agentUri,
      a2aEndpoint,
      -- Removed: agentAccountEndpoint
      agentName,
      description,
      image,
      active,
      supportedTrust,
      oasfSkillsJson,
      oasfDomainsJson,
      protocolsJson,
      capabilityLabelsJson,
      trustModelsJson
    FROM agents
    WHERE
      ${
        chainIdFilter
          ? '(chainId = ? AND CAST(agentId AS INTEGER) > CAST(? AS INTEGER))'
          : `(
              chainId > ?
              OR (
                chainId = ?
                AND (
                  LENGTH(agentId) > ?
                  OR (LENGTH(agentId) = ? AND agentId > ?)
                )
              )
            )`
      }
      AND (
        rawJson IS NOT NULL AND rawJson != ''
        OR agentCardJson IS NOT NULL AND agentCardJson != ''
      )
    ${
      chainIdFilter
        ? 'ORDER BY CAST(agentId AS INTEGER) ASC, agentId ASC'
        : 'ORDER BY chainId ASC, LENGTH(agentId) ASC, agentId ASC'
    }
    LIMIT ?
  `;

  let processed = 0;
  while (true) {
    const agentIdLen = cursor.agentId.length;
    const bindParams: any[] = chainIdFilter
      ? [chainIdFilter, cursor.agentId || '0']
      : [cursor.chainId, cursor.chainId, agentIdLen, agentIdLen, cursor.agentId];
    bindParams.push(chunkSize);

    let rows: any[] = [];
    try {
      const stmt = db.prepare(query);
      const result = await stmt.all(...bindParams);
      rows = Array.isArray(result) ? result : Array.isArray((result as any)?.results) ? (result as any).results : [];
    } catch (e) {
      console.warn('[agent-meta] query failed', e);
      break;
    }

    if (!rows.length) {
      console.log('[agent-meta] complete', { processed, cursor });
      break;
    }

    console.log('[agent-meta] page', { rows: rows.length, first: rows[0]?.agentId, last: rows[rows.length - 1]?.agentId });

    for (const row of rows) {
      const chainId = Number(row?.chainId ?? 0) || 0;
      const agentId = String(row?.agentId ?? '');

      console.log('[agent-meta] agent', {
        chainId,
        agentId,
        hasRawJson: Boolean(typeof row?.rawJson === 'string' && row.rawJson.trim()),
        hasAgentCardJson: Boolean(typeof row?.agentCardJson === 'string' && row.agentCardJson.trim()),
        agentUri: row?.agentUri ? String(row.agentUri) : null,
        a2aEndpoint: row?.a2aEndpoint ? String(row.a2aEndpoint) : null,
      });

      // Step 1: ensure we have agentCardJson (default-on) BEFORE extraction.
      if (fetchAgentCard) {
        const existingCardJson = typeof row?.agentCardJson === 'string' ? row.agentCardJson : '';
        const fallbackA2A = row?.a2aEndpoint != null ? String(row.a2aEndpoint) : null;
        const regA2A = extractRegistrationA2AEndpoint(row?.rawJson, fallbackA2A);
        if (regA2A && (!existingCardJson || overwrite)) {
          console.log('[agent-meta] agent-card fetch', { chainId, agentId, regA2A, overwrite });
          try {
            await upsertAgentCardForAgent(db, chainId, agentId, regA2A, { force: true });
            // Reload row.agentCardJson after fetch.
            const refreshed = await db
              .prepare('SELECT agentCardJson FROM agents WHERE chainId = ? AND agentId = ?')
              .get(chainId, agentId);
            if (refreshed && (refreshed as any).agentCardJson != null) {
              row.agentCardJson = String((refreshed as any).agentCardJson);
            }
          } catch {
            // best-effort
            console.warn('[agent-meta] agent-card fetch failed', { chainId, agentId, regA2A });
          }
        }
      }

      const raw = safeJsonParse(row?.rawJson);
      const card = safeJsonParse(row?.agentCardJson);

      const supportedTrust = raw ? parseSupportedTrust(raw) : [];
      const trustModels = supportedTrust.length ? parseTrustModelsFromSupportedTrust(supportedTrust) : [];
      const oasf = raw ? parseOasfFromEndpoints(raw) : { skills: [], domains: [] };
      const protocols = raw ? parseProtocolsFromRawJson(raw) : [];

      const cardInfo = card ? parseAgentCard(card) : null;
      const cardProtocols: Array<{ protocol: string; version: string }> = [];
      if (cardInfo?.protocolVersion) {
        cardProtocols.push({ protocol: 'a2a', version: cardInfo.protocolVersion });
      }
      const allProtocols = (() => {
        const merged = [...protocols, ...cardProtocols];
        const seen = new Set<string>();
        return merged.filter((p) => {
          const k = `${p.protocol}::${p.version}`;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
      })();

      // Merge skills/domains from rawJson OASF + any explicit agent-card arrays (if present)
      const mergedSkills = uniqStrings([...oasf.skills, ...(cardInfo?.skills ?? [])]);
      const mergedDomains = uniqStrings([...oasf.domains, ...(cardInfo?.domains ?? [])]);

      const mergedCapabilities = uniqStrings(cardInfo?.capabilities ?? []);
      const mergedOperators = uniqStrings(cardInfo?.operators ?? []);

      if (mergedSkills.includes('[object Object]') || (mergedDomains.length === 0 && typeof row?.rawJson === 'string' && row.rawJson.includes('a2aDomains'))) {
        console.warn('[agent-meta] suspicious oasf extract', {
          chainId,
          agentId,
          mergedSkillsPreview: mergedSkills.slice(0, 10),
          mergedDomainsPreview: mergedDomains.slice(0, 10),
          rawEndpointsType: typeof (raw as any)?.endpoints,
          rawEndpointsIsArray: Array.isArray((raw as any)?.endpoints),
          rawEndpointNames: Array.isArray((raw as any)?.endpoints) ? (raw as any).endpoints.map((e: any) => e?.name).slice(0, 10) : null,
          cardSkillsIsArray: Array.isArray((card as any)?.skills),
          cardSkillsFirstType: Array.isArray((card as any)?.skills) ? typeof (card as any).skills[0] : null,
        });
      }

      // upsertFromTokenGraph-like fields from ERC-8004 registration rawJson
      const endpoints = takeEndpointsArray(raw);
      const findEndpoint = (n: string): string | null => {
        const e = endpoints.find((x: any) => String(x?.name ?? '').toLowerCase() === n.toLowerCase());
        const v = e?.endpoint;
        return typeof v === 'string' && v.trim() ? v.trim() : null;
      };
      const a2aFromRaw = findEndpoint('A2A') || findEndpoint('a2a') || (typeof raw?.a2aEndpoint === 'string' ? raw.a2aEndpoint.trim() : null) || (typeof raw?.chatEndpoint === 'string' ? raw.chatEndpoint.trim() : null);
      const active = raw?.active === undefined ? null : (raw?.active === true || raw?.active === 1 || String(raw?.active).toLowerCase() === 'true' ? 1 : 0);
      const nameFromRaw = raw ? (typeof raw?.name === 'string' && raw.name.trim() ? raw.name.trim() : null) : null;
      const descFromRaw = raw ? (typeof raw?.description === 'string' && raw.description.trim() ? raw.description.trim() : null) : null;
      const imgFromRaw = raw ? (raw?.image != null ? String(raw.image).trim() : null) : null;

      // Decide whether to write based on overwrite or missing fields
      const shouldWrite =
        overwrite ||
        !row?.oasfSkillsJson ||
        !row?.oasfDomainsJson ||
        !row?.protocolsJson ||
        !row?.capabilityLabelsJson ||
        !row?.supportedTrust ||
        !row?.trustModelsJson;

      if (shouldWrite) {
        const updateTime = Math.floor(Date.now() / 1000);
        const supportedTrustJson = supportedTrust.length ? JSON.stringify(supportedTrust) : null;
        const trustModelsJson = trustModels.length ? JSON.stringify(trustModels) : null;
        const oasfSkillsJson = mergedSkills.length ? JSON.stringify(mergedSkills) : null;
        const oasfDomainsJson = mergedDomains.length ? JSON.stringify(mergedDomains) : null;
        const protocolsJson = allProtocols.length ? JSON.stringify(allProtocols) : null;
        const capabilityLabelsJson = mergedCapabilities.length ? JSON.stringify(mergedCapabilities) : null;
        const agentCardProtocolJson = cardInfo
          ? JSON.stringify({
              protocolVersion: cardInfo.protocolVersion,
              preferredTransport: cardInfo.preferredTransport,
            })
          : null;

        // Prefer the A2A URL from agent card to populate a2aEndpoint if missing
        const a2aFromCard = cardInfo?.a2aUrl || null;
        const a2aEndpoint = row?.a2aEndpoint ? String(row.a2aEndpoint) : null;
        const a2aEndpointNew = !a2aEndpoint && a2aFromCard ? a2aFromCard : null;
        const agentName = row?.agentName ? String(row.agentName) : null;
        const description = row?.description ? String(row.description) : null;
        const image = row?.image ? String(row.image) : null;
        const agentNameNew = !agentName ? (cardInfo?.name || nameFromRaw) : null;
        const descriptionNew = !description ? (cardInfo?.description || descFromRaw) : null;
        const imageNew = !image ? (cardInfo?.image || imgFromRaw) : null;

        await db
          .prepare(
            `UPDATE agents SET
               supportedTrust = COALESCE(?, supportedTrust),
               trustModelsJson = COALESCE(?, trustModelsJson),
               oasfSkillsJson = COALESCE(?, oasfSkillsJson),
               oasfDomainsJson = COALESCE(?, oasfDomainsJson),
               protocolsJson = COALESCE(?, protocolsJson),
               capabilityLabelsJson = COALESCE(?, capabilityLabelsJson),
               agentCardProtocolJson = COALESCE(?, agentCardProtocolJson),
               a2aEndpoint = COALESCE(?, a2aEndpoint),
               agentName = COALESCE(?, agentName),
               description = COALESCE(?, description),
               image = COALESCE(?, image),
               active = COALESCE(?, active),
               updatedAtTime = ?
             WHERE chainId = ? AND agentId = ?`,
          )
          .run(
            supportedTrustJson,
            trustModelsJson,
            oasfSkillsJson,
            oasfDomainsJson,
            protocolsJson,
            capabilityLabelsJson,
            agentCardProtocolJson,
            a2aEndpointNew || a2aFromRaw,
            agentNameNew,
            descriptionNew,
            imageNew,
            active,
            updateTime,
            chainId,
            agentId,
          );
      }

      // Normalized tables (best-effort)
      try {
        for (const t of supportedTrust) {
          await db
            .prepare('INSERT INTO agent_supported_trust(chainId, agentId, trust) VALUES(?, ?, ?) ON CONFLICT(chainId, agentId, trust) DO NOTHING')
            .run(chainId, agentId, t);
        }
      } catch {}
      try {
        for (const sk of mergedSkills) {
          await db
            .prepare('INSERT INTO agent_skills(chainId, agentId, skill) VALUES(?, ?, ?) ON CONFLICT(chainId, agentId, skill) DO NOTHING')
            .run(chainId, agentId, sk);
        }
      } catch {}
      try {
        for (const dom of mergedDomains) {
          await db
            .prepare('INSERT INTO agent_domains(chainId, agentId, domain) VALUES(?, ?, ?) ON CONFLICT(chainId, agentId, domain) DO NOTHING')
            .run(chainId, agentId, dom);
        }
      } catch {}
      try {
        for (const p of allProtocols) {
          await db
            .prepare('INSERT INTO agent_protocols(chainId, agentId, protocol, version) VALUES(?, ?, ?, ?) ON CONFLICT(chainId, agentId, protocol, version) DO NOTHING')
            .run(chainId, agentId, p.protocol, p.version || '');
        }
      } catch {}
      try {
        for (const op of mergedOperators) {
          await db
            .prepare('INSERT INTO agent_operators(chainId, agentId, operator) VALUES(?, ?, ?) ON CONFLICT(chainId, agentId, operator) DO NOTHING')
            .run(chainId, agentId, op);
        }
      } catch {}

      cursor = { chainId, agentId };
      processed += 1;
      console.log('[agent-meta] agent done', {
        chainId,
        agentId,
        shouldWrite,
        trustModels: trustModels.length,
        supportedTrust: supportedTrust.length,
        skills: mergedSkills.length,
        domains: mergedDomains.length,
        protocols: allProtocols.length,
        operators: mergedOperators.length,
        capabilities: mergedCapabilities.length,
      });
      if (processed % 250 === 0) {
        console.log('[agent-meta] progress', { processed, cursor });
      }
      await setCheckpointValue(db, checkpointKey, chainIdFilter ? cursor.agentId : formatCursor(cursor));
    }
  }
}


