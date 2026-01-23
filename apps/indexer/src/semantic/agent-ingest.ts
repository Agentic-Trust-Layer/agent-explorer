import type { SemanticSearchService } from './semantic-search-service.js';
import type { SemanticAgentRecord } from './types.js';

type AgentSemanticRow = {
  chainId: number;
  agentId: string;
  effectiveUpdatedAt: number;
  agentName?: string | null;
  description?: string | null;
  type?: string | null;
  image?: string | null;
  a2aEndpoint?: string | null;
  // Removed: agentAccountEndpoint (confusing/overloaded)
  supportedTrust?: string | null;
  rawJson?: string | null;
  agentCardJson?: string | null;
  operatorsJson?: string | null;
  skillsJson?: string | null;
  trustJson?: string | null;
  toolsJson?: string | null;
  promptsJson?: string | null;
  resourcesJson?: string | null;
  agentMetadataJson?: string | null;
};

const DEFAULT_CHUNK_SIZE = 75;
const DEFAULT_CHECKPOINT_KEY = 'semanticIngestCursor';

const AGENT_CHUNK_QUERY = `
SELECT
  a.chainId,
  a.agentId,
  COALESCE(a.updatedAtTime, a.createdAtTime, 0) AS effectiveUpdatedAt,
  a.agentName,
  a.description,
  a.type,
  a.image,
  a.a2aEndpoint,
  -- Removed: a.agentAccountEndpoint
  a.supportedTrust,
  a.rawJson,
  a.agentCardJson,
  COALESCE((SELECT json_group_array(operator) FROM agent_operators ao WHERE ao.chainId = a.chainId AND ao.agentId = a.agentId), '[]') AS operatorsJson,
  COALESCE((SELECT json_group_array(skill) FROM agent_skills s WHERE s.chainId = a.chainId AND s.agentId = a.agentId), '[]') AS skillsJson,
  COALESCE((SELECT json_group_array(trust) FROM agent_supported_trust st WHERE st.chainId = a.chainId AND st.agentId = a.agentId), '[]') AS trustJson,
  COALESCE((SELECT json_group_array(tool) FROM agent_mcp_tools mt WHERE mt.chainId = a.chainId AND mt.agentId = a.agentId), '[]') AS toolsJson,
  COALESCE((SELECT json_group_array(prompt) FROM agent_mcp_prompts mp WHERE mp.chainId = a.chainId AND mp.agentId = a.agentId), '[]') AS promptsJson,
  COALESCE((SELECT json_group_array(resource) FROM agent_mcp_resources mr WHERE mr.chainId = a.chainId AND mr.agentId = a.agentId), '[]') AS resourcesJson,
  COALESCE((
    SELECT json_group_array(json_object(
      'key', key,
      'valueText', valueText,
      'valueHex', valueHex,
      'indexedKey', indexedKey
    ))
    FROM agent_metadata am
    WHERE am.chainId = a.chainId AND am.agentId = a.agentId
  ), '[]') AS agentMetadataJson
FROM agents a
WHERE
  (
    COALESCE(a.updatedAtTime, a.createdAtTime, 0) > ?
  )
  OR
  (
    COALESCE(a.updatedAtTime, a.createdAtTime, 0) = ?
    AND (
      a.chainId > ?
      OR (
        a.chainId = ?
        AND (
          LENGTH(a.agentId) > ?
          OR (LENGTH(a.agentId) = ? AND a.agentId > ?)
        )
      )
    )
  )
ORDER BY
  COALESCE(a.updatedAtTime, a.createdAtTime, 0) ASC,
  a.chainId ASC,
  LENGTH(a.agentId) ASC,
  a.agentId ASC
LIMIT ?
`;

function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value !== 'string') {
    return fallback;
  }
  try {
    const parsed = JSON.parse(value);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function parseStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    const cleaned: string[] = [];
    for (const entry of value) {
      if (typeof entry === 'string') {
        const trimmed = entry.trim();
        if (trimmed.length > 0) {
          cleaned.push(trimmed);
        }
      }
    }
    return cleaned;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parseStringArray(parsed);
      }
    } catch {
      // Not JSON - treat as comma separated
      return trimmed
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }
  }
  return [];
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value && value.length > 0)));
}

const OASF_TO_EXECUTABLE_SKILLS: Record<string, string> = {
  'trust.validate.name': 'governance_and_trust/trust/trust_validate_name',
  'trust.validate.account': 'governance_and_trust/trust/trust_validate_account',
  'trust.validate.app': 'governance_and_trust/trust/trust_validate_app',
  'trust.feedback.authorization': 'governance_and_trust/trust/trust_feedback_authorization',
};

function normalizeSkillId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('oasf:')) {
    const withoutPrefix = trimmed.slice('oasf:'.length);
    return normalizeSkillId(withoutPrefix);
  }
  if (trimmed.startsWith('trust/')) {
    const tail = trimmed.slice('trust/'.length);
    if (tail.startsWith('trust_validate_')) {
      const suffix = tail.slice('trust_validate_'.length);
      return `governance_and_trust/trust/trust_validate_${suffix}`;
    }
    return trimmed;
  }
  if (trimmed.startsWith('trust_validate_')) {
    const suffix = trimmed.slice('trust_validate_'.length);
    return `governance_and_trust/trust/trust_validate_${suffix}`;
  }
  if (trimmed.startsWith('trust.validate.')) {
    const suffix = trimmed.slice('trust.validate.'.length);
    return `governance_and_trust/trust/trust_validate_${suffix}`;
  }
  if (trimmed === 'trust.feedback.authorization') {
    return 'governance_and_trust/trust/trust_feedback_authorization';
  }
  const mapped = OASF_TO_EXECUTABLE_SKILLS[trimmed];
  return mapped ?? trimmed;
}

function normalizeSkillArray(values: string[]): string[] {
  const normalized = values
    .map((value) => normalizeSkillId(value))
    .filter((value): value is string => Boolean(value));
  return dedupeStrings(normalized);
}

function takeObjectArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value as Record<string, unknown>);
  return [];
}

function extractA2aSkillsFromRegistration(rawJson: Record<string, unknown> | null): string[] {
  if (!rawJson) return [];
  const endpoints = takeObjectArray((rawJson as any).endpoints);
  const skills: string[] = [];
  for (const endpoint of endpoints) {
    if (!endpoint || typeof endpoint !== 'object') continue;
    const a2aSkills = parseStringArray((endpoint as any).a2aSkills);
    skills.push(...a2aSkills);
  }
  return normalizeSkillArray(skills);
}

function extractA2aSkillsFromAgentCard(agentCardJson: Record<string, unknown> | null): string[] {
  if (!agentCardJson) return [];
  const skills: string[] = [];
  const list = Array.isArray((agentCardJson as any).skills) ? (agentCardJson as any).skills : [];
  for (const entry of list) {
    if (typeof entry === 'string') {
      const trimmed = entry.trim();
      if (trimmed) skills.push(trimmed);
      continue;
    }
    if (entry && typeof entry === 'object') {
      const id = typeof (entry as any).id === 'string' ? (entry as any).id.trim() : '';
      const name = typeof (entry as any).name === 'string' ? (entry as any).name.trim() : '';
      if (id) skills.push(id);
      else if (name) skills.push(name);
    }
  }
  return normalizeSkillArray(skills);
}

function extractOasfSkillsFromAgentCard(agentCardJson: Record<string, unknown> | null): string[] {
  if (!agentCardJson) return [];
  const skills: string[] = [];
  const extensions = Array.isArray((agentCardJson as any).capabilities?.extensions)
    ? (agentCardJson as any).capabilities.extensions
    : [];
  for (const ext of extensions) {
    if (!ext || typeof ext !== 'object') continue;
    const params = (ext as any).params;
    if (!params || typeof params !== 'object') continue;
    skills.push(...parseStringArray((params as any).skills));
  }
  return normalizeSkillArray(skills);
}

function buildMetadataMap(entries: any[]): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    const key = typeof entry.key === 'string' ? entry.key : null;
    if (!key) continue;
    if (entry.valueText && typeof entry.valueText === 'string' && entry.valueText.trim().length) {
      const trimmed = entry.valueText.trim();
      try {
        map[key] = JSON.parse(trimmed);
      } catch {
        map[key] = trimmed;
      }
    } else if (entry.valueHex) {
      map[key] = entry.valueHex;
    } else {
      map[key] = entry;
    }
  }
  return map;
}

function extractStringArrayFromMetadata(map: Record<string, unknown>, key: string): string[] {
  if (!map || !key) return [];
  return parseStringArray(map[key]);
}

function mapRowToSemanticRecord(row: AgentSemanticRow): SemanticAgentRecord | null {
  if (row.chainId === undefined || row.agentId === undefined) {
    return null;
  }

  const skills = normalizeSkillArray(parseStringArray(safeJsonParse(row.skillsJson, [])));
  const prompts = parseStringArray(safeJsonParse(row.promptsJson, []));
  const trustFromTable = parseStringArray(safeJsonParse(row.trustJson, []));
  const trustFromColumn = parseStringArray(row.supportedTrust);
  const tools = parseStringArray(safeJsonParse(row.toolsJson, []));
  const resources = parseStringArray(safeJsonParse(row.resourcesJson, []));
  const operators = parseStringArray(safeJsonParse(row.operatorsJson, []));
  const tokenMetadataEntries = safeJsonParse<any[]>(row.agentMetadataJson, []);
  const agentMetadataMap = buildMetadataMap(tokenMetadataEntries);
  const rawJson = safeJsonParse<Record<string, unknown>>(row.rawJson, {});
  const agentCardJson = safeJsonParse<Record<string, unknown>>(row.agentCardJson, {});

  // Only ingest agents that have a valid, non-empty agent card JSON.
  // This ensures semantic search operates exclusively over agent-card-enriched embeddings.
  if (!agentCardJson || Object.keys(agentCardJson).length === 0) {
    return null;
  }

  const a2aSkillsFromRegistration = extractA2aSkillsFromRegistration(rawJson);
  const a2aSkillsFromAgentCard = extractA2aSkillsFromAgentCard(agentCardJson);
  const oasfSkills = extractOasfSkillsFromAgentCard(agentCardJson);
  const a2aSkills = dedupeStrings([
    ...skills,
    ...a2aSkillsFromRegistration,
    ...a2aSkillsFromAgentCard,
    ...oasfSkills,
  ]);

  const tags = dedupeStrings([...skills, ...prompts, ...a2aSkills]);
  const capabilities = dedupeStrings([...trustFromTable, ...trustFromColumn, ...tools, ...resources]);
  const inputModesFromMetadata = extractStringArrayFromMetadata(agentMetadataMap, 'defaultInputModes');
  const inputModesFromRaw = extractStringArrayFromMetadata(rawJson ?? {}, 'defaultInputModes');
  const defaultInputModes = inputModesFromMetadata.length ? inputModesFromMetadata : inputModesFromRaw;

  const outputModesFromMetadata = extractStringArrayFromMetadata(agentMetadataMap, 'defaultOutputModes');
  const outputModesFromRaw = extractStringArrayFromMetadata(rawJson ?? {}, 'defaultOutputModes');
  const defaultOutputModes = outputModesFromMetadata.length ? outputModesFromMetadata : outputModesFromRaw;

  const metadata: Record<string, unknown> = {};
  if (operators.length) metadata.operators = operators;
  if (skills.length) metadata.skills = skills;
  if (a2aSkills.length) metadata.a2aSkills = a2aSkills;
  if (prompts.length) metadata.prompts = prompts;
  if (trustFromTable.length || trustFromColumn.length) metadata.supportedTrust = dedupeStrings([...trustFromTable, ...trustFromColumn]);
  if (tools.length) metadata.mcpTools = tools;
  if (resources.length) metadata.mcpResources = resources;
  if (tokenMetadataEntries.length) metadata.agentMetadata = tokenMetadataEntries;
  if (Object.keys(agentMetadataMap).length) metadata.agentMetadataMap = agentMetadataMap;
  if (rawJson && Object.keys(rawJson).length) metadata.raw = rawJson;
  if (agentCardJson && Object.keys(agentCardJson).length) metadata.agentCard = agentCardJson;
  const endpoints: Record<string, string> = {};
  if (row.a2aEndpoint?.trim()) endpoints.a2aEndpoint = row.a2aEndpoint.trim();
  // Removed: agentAccountEndpoint (confusing/overloaded)
  if (Object.keys(endpoints).length) metadata.endpoints = endpoints;
  if (row.type) metadata.type = row.type;
  if (row.image) metadata.image = row.image;

  const record: SemanticAgentRecord = {
    agentId: String(row.agentId),
    chainId: Number(row.chainId),
    name: row.agentName?.trim() || `agent-${row.agentId}`,
    description: row.description || undefined,
    tags: tags.length ? tags : undefined,
    capabilities: capabilities.length ? capabilities : undefined,
    defaultInputModes: defaultInputModes && defaultInputModes.length ? defaultInputModes : undefined,
    defaultOutputModes: defaultOutputModes && defaultOutputModes.length ? defaultOutputModes : undefined,
    metadata: Object.keys(metadata).length ? metadata : undefined,
  };

  return record;
}

async function fetchAgentChunk(
  db: any,
  limit: number,
  cursor: { time: number; chainId: number; agentId: string },
): Promise<AgentSemanticRow[]> {
  const stmt = db.prepare(AGENT_CHUNK_QUERY);
  const agentId = cursor.agentId ?? '';
  const agentIdLen = agentId.length;
  const bindParams = [
    cursor.time,
    cursor.time,
    cursor.chainId,
    cursor.chainId,
    agentIdLen,
    agentIdLen,
    agentId,
    limit,
  ];
  if (stmt.bind && typeof stmt.bind === 'function') {
    const result = await stmt.bind(...bindParams).all();
    return Array.isArray(result) ? (result as AgentSemanticRow[]) : Array.isArray(result?.results) ? (result.results as AgentSemanticRow[]) : [];
  }
  const rows = await stmt.all(...bindParams);
  return Array.isArray(rows) ? (rows as AgentSemanticRow[]) : [];
}

function parseCursor(value: unknown): { time: number; chainId: number; agentId: string } {
  if (typeof value !== 'string' || !value.trim()) {
    return { time: 0, chainId: 0, agentId: '' };
  }
  const parts = value.split('|');
  if (parts.length < 3) {
    return { time: 0, chainId: 0, agentId: '' };
  }
  const time = Number(parts[0]);
  const chainId = Number(parts[1]);
  const agentId = parts.slice(2).join('|'); // preserve if agentId ever contains '|'
  return {
    time: Number.isFinite(time) && time >= 0 ? Math.trunc(time) : 0,
    chainId: Number.isFinite(chainId) && chainId >= 0 ? Math.trunc(chainId) : 0,
    agentId: typeof agentId === 'string' ? agentId : '',
  };
}

function formatCursor(cursor: { time: number; chainId: number; agentId: string }): string {
  const time = Number.isFinite(cursor.time) && cursor.time >= 0 ? Math.trunc(cursor.time) : 0;
  const chainId = Number.isFinite(cursor.chainId) && cursor.chainId >= 0 ? Math.trunc(cursor.chainId) : 0;
  const agentId = typeof cursor.agentId === 'string' ? cursor.agentId : '';
  return `${time}|${chainId}|${agentId}`;
}

async function getCheckpointValue(db: any, key: string): Promise<string | null> {
  try {
    const stmt = db.prepare('SELECT value FROM checkpoints WHERE key = ?');
    if (stmt.bind && typeof stmt.bind === 'function') {
      const row = await stmt.bind(key).first();
      return row?.value ? String(row.value) : null;
    }
    const row = await stmt.get(key);
    return row?.value ? String((row as any).value) : null;
  } catch {
    return null;
  }
}

async function setCheckpointValue(db: any, key: string, value: string): Promise<void> {
  try {
    const stmt = db.prepare('INSERT INTO checkpoints(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value');
    if (stmt.bind && typeof stmt.bind === 'function') {
      await stmt.bind(key, value).run();
      return;
    }
    await stmt.run(key, value);
  } catch {
    // best-effort
  }
}


export interface SemanticIngestOptions {
  chunkSize?: number;
  logger?: Pick<Console, 'info' | 'error'>;
  checkpointKey?: string;
}

export interface SemanticIngestResult {
  processed: number;
  batches: number;
}

export async function ingestAgentsIntoSemanticStore(
  db: any,
  semanticService: SemanticSearchService,
  options: SemanticIngestOptions = {},
): Promise<SemanticIngestResult> {
  const chunkSize = options.chunkSize && options.chunkSize > 0 ? options.chunkSize : DEFAULT_CHUNK_SIZE;
  const checkpointKey = options.checkpointKey?.trim() || DEFAULT_CHECKPOINT_KEY;
  const initial = parseCursor(await getCheckpointValue(db, checkpointKey));
  let cursor = { ...initial };
  let processed = 0;
  let batches = 0;

  while (true) {
    console.info('[semantic-ingest] fetching rows', { chunkSize, cursor });
    const rows = await fetchAgentChunk(db, chunkSize, cursor);
    if (!rows.length) {
      console.info('[semantic-ingest] no more agent rows found', { cursor });
      break;
    }

    const records = rows
      .map(mapRowToSemanticRecord)
      .filter((record): record is SemanticAgentRecord => Boolean(record));

    if (records.length) {
      records.forEach((record) => {
        console.info('[semantic-ingest] record details', JSON.stringify(record, null, 2));
      });
      console.info('[semantic-ingest] prepared normalized records', {
        chunk: batches + 1,
        normalized: records.length,
        sample: records.slice(0, 3).map((record) => `${record.chainId}:${record.agentId}`),
      });
      await semanticService.upsertAgents(records);
      processed += records.length;
      batches += 1;
      const logMessage = `[semantic-ingest] Upserted chunk ${batches} (${records.length} agents, total ${processed})`;
      if (options.logger?.info) {
        options.logger.info(logMessage);
      } else {
        console.info(logMessage);
      }
    } else {
      console.warn('[semantic-ingest] chunk contained no usable agent records', { chunk: batches + 1 });
    }

    const last = rows[rows.length - 1];
    cursor = {
      time: Number(last?.effectiveUpdatedAt ?? cursor.time) || cursor.time,
      chainId: Number(last?.chainId ?? cursor.chainId) || cursor.chainId,
      agentId: String(last?.agentId ?? cursor.agentId),
    };
    await setCheckpointValue(db, checkpointKey, formatCursor(cursor));
  }

  return { processed, batches };
}

