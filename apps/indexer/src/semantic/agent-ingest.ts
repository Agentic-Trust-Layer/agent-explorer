import type { SemanticSearchService } from './semantic-search-service.js';
import type { SemanticAgentRecord } from './types.js';

type AgentSemanticRow = {
  chainId: number;
  agentId: string;
  agentName?: string | null;
  description?: string | null;
  type?: string | null;
  image?: string | null;
  a2aEndpoint?: string | null;
  ensEndpoint?: string | null;
  agentAccountEndpoint?: string | null;
  supportedTrust?: string | null;
  rawJson?: string | null;
  operatorsJson?: string | null;
  skillsJson?: string | null;
  trustJson?: string | null;
  toolsJson?: string | null;
  promptsJson?: string | null;
  resourcesJson?: string | null;
  tokenMetadataJson?: string | null;
};

const DEFAULT_CHUNK_SIZE = 75;

const AGENT_CHUNK_QUERY = `
SELECT
  a.chainId,
  a.agentId,
  a.agentName,
  a.description,
  a.type,
  a.image,
  a.a2aEndpoint,
  a.ensEndpoint,
  a.agentAccountEndpoint,
  a.supportedTrust,
  a.rawJson,
  COALESCE((SELECT json_group_array(operator) FROM agent_operators ao WHERE ao.chainId = a.chainId AND ao.agentId = a.agentId), '[]') AS operatorsJson,
  COALESCE((SELECT json_group_array(skill) FROM agent_skills s WHERE s.chainId = a.chainId AND s.agentId = a.agentId), '[]') AS skillsJson,
  COALESCE((SELECT json_group_array(trust) FROM agent_supported_trust st WHERE st.chainId = a.chainId AND st.agentId = a.agentId), '[]') AS trustJson,
  COALESCE((SELECT json_group_array(tool) FROM agent_mcp_tools mt WHERE mt.chainId = a.chainId AND mt.agentId = a.agentId), '[]') AS toolsJson,
  COALESCE((SELECT json_group_array(prompt) FROM agent_mcp_prompts mp WHERE mp.chainId = a.chainId AND mp.agentId = a.agentId), '[]') AS promptsJson,
  COALESCE((SELECT json_group_array(resource) FROM agent_mcp_resources mr WHERE mr.chainId = a.chainId AND mr.agentId = a.agentId), '[]') AS resourcesJson,
  COALESCE((
    SELECT json_group_array(json_object(
      'key', metadataKey,
      'valueText', valueText,
      'valueHex', valueHex,
      'indexedKey', indexedKey
    ))
    FROM token_metadata tm
    WHERE tm.chainId = a.chainId AND tm.agentId = a.agentId
  ), '[]') AS tokenMetadataJson
FROM agents a
ORDER BY a.chainId ASC, LENGTH(a.agentId) ASC, a.agentId ASC
LIMIT ? OFFSET ?
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

function buildMetadataMap(entries: any[]): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    const key = typeof entry.key === 'string' ? entry.key : typeof entry.metadataKey === 'string' ? entry.metadataKey : null;
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

  const skills = parseStringArray(safeJsonParse(row.skillsJson, []));
  const prompts = parseStringArray(safeJsonParse(row.promptsJson, []));
  const trustFromTable = parseStringArray(safeJsonParse(row.trustJson, []));
  const trustFromColumn = parseStringArray(row.supportedTrust);
  const tools = parseStringArray(safeJsonParse(row.toolsJson, []));
  const resources = parseStringArray(safeJsonParse(row.resourcesJson, []));
  const operators = parseStringArray(safeJsonParse(row.operatorsJson, []));
  const tokenMetadataEntries = safeJsonParse<any[]>(row.tokenMetadataJson, []);
  const tokenMetadataMap = buildMetadataMap(tokenMetadataEntries);
  const rawJson = safeJsonParse<Record<string, unknown>>(row.rawJson, {});

  const tags = dedupeStrings([...skills, ...prompts]);
  const capabilities = dedupeStrings([...trustFromTable, ...trustFromColumn, ...tools, ...resources]);
  const inputModesFromMetadata = extractStringArrayFromMetadata(tokenMetadataMap, 'defaultInputModes');
  const inputModesFromRaw = extractStringArrayFromMetadata(rawJson ?? {}, 'defaultInputModes');
  const defaultInputModes = inputModesFromMetadata.length ? inputModesFromMetadata : inputModesFromRaw;

  const outputModesFromMetadata = extractStringArrayFromMetadata(tokenMetadataMap, 'defaultOutputModes');
  const outputModesFromRaw = extractStringArrayFromMetadata(rawJson ?? {}, 'defaultOutputModes');
  const defaultOutputModes = outputModesFromMetadata.length ? outputModesFromMetadata : outputModesFromRaw;

  const metadata: Record<string, unknown> = {};
  if (operators.length) metadata.operators = operators;
  if (skills.length) metadata.skills = skills;
  if (prompts.length) metadata.prompts = prompts;
  if (trustFromTable.length || trustFromColumn.length) metadata.supportedTrust = dedupeStrings([...trustFromTable, ...trustFromColumn]);
  if (tools.length) metadata.mcpTools = tools;
  if (resources.length) metadata.mcpResources = resources;
  if (tokenMetadataEntries.length) metadata.tokenMetadata = tokenMetadataEntries;
  if (Object.keys(tokenMetadataMap).length) metadata.tokenMetadataMap = tokenMetadataMap;
  if (rawJson && Object.keys(rawJson).length) metadata.raw = rawJson;
  const endpoints: Record<string, string> = {};
  if (row.a2aEndpoint?.trim()) endpoints.a2aEndpoint = row.a2aEndpoint.trim();
  if (row.ensEndpoint?.trim()) endpoints.ensEndpoint = row.ensEndpoint.trim();
  if (row.agentAccountEndpoint?.trim()) endpoints.agentAccountEndpoint = row.agentAccountEndpoint.trim();
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

async function fetchAgentChunk(db: any, limit: number, offset: number): Promise<AgentSemanticRow[]> {
  const stmt = db.prepare(AGENT_CHUNK_QUERY);
  if (stmt.bind && typeof stmt.bind === 'function') {
    const result = await stmt.bind(limit, offset).all();
    return Array.isArray(result?.results) ? (result.results as AgentSemanticRow[]) : [];
  }
  const rows = await stmt.all(limit, offset);
  return Array.isArray(rows) ? (rows as AgentSemanticRow[]) : [];
}


export interface SemanticIngestOptions {
  chunkSize?: number;
  logger?: Pick<Console, 'info' | 'error'>;
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
  let offset = 0;
  let processed = 0;
  let batches = 0;

  while (true) {
    console.info('[semantic-ingest] fetching rows', { offset, chunkSize });
    const rows = await fetchAgentChunk(db, chunkSize, offset);
    if (!rows.length) {
      console.info('[semantic-ingest] no more agent rows found', { offset });
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

    offset += rows.length;
    if (rows.length < chunkSize) {
      break;
    }
  }

  return { processed, batches };
}

