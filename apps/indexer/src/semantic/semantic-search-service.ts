import type { SemanticSearchFilters, SemanticAgentRecord } from './types.js';
import type { EmbeddingProvider, VectorQueryMatch, VectorStoreProvider, VectorUpsertItem } from './interfaces.js';

export interface SemanticSearchParams {
  text: string;
  topK?: number;
  minScore?: number;
  filters?: SemanticSearchFilters;
}

export class SemanticSearchService {
  private readonly defaultMinScore: number;

  constructor(
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStoreProvider,
    defaultMinScore?: number,
  ) {
    this.defaultMinScore = typeof defaultMinScore === 'number' ? defaultMinScore : 0;
  }

  async upsertAgent(record: SemanticAgentRecord): Promise<void> {
    await this.upsertAgents([record]);
  }

  async upsertAgents(records: SemanticAgentRecord[]): Promise<void> {
    console.info('[semantic-search] upsertAgents invoked', { requested: records.length });
    const normalized = records
      .map((record) => this.normalizeRecord(record))
      .filter((record): record is SemanticAgentRecord => record !== null);

    if (!normalized.length) {
      console.warn('[semantic-search] upsertAgents aborted: no valid records after normalization');
      return;
    }

    const texts = normalized.map((record) => this.buildAgentText(record));
    const embeddings = await this.buildEmbeddings(texts);
    const emptyVectors = embeddings.filter((vec) => !vec || vec.length === 0).length;
    if (emptyVectors) {
      console.warn('[semantic-search] embeddings missing for some records', { emptyVectors, total: embeddings.length });
    }
    const vectorItems: VectorUpsertItem[] = normalized.map((record, index) => ({
      id: `${record.chainId}:${record.agentId}`,
      values: embeddings[index] ?? [],
      metadata: this.buildVectorMetadata(record),
    }));

    const filteredItems = vectorItems.filter((item) => Array.isArray(item.values) && item.values.length > 0);
    if (!filteredItems.length) {
      console.warn('[semantic-search] skipping upsert: all embeddings empty');
      return;
    }

    try {
      await this.vectorStore.upsertBatch(filteredItems);
      console.info('[semantic-search] upserted vectors into store', { count: filteredItems.length });
    } catch (error) {
      console.error('[semantic-search] vector store upsert failed', error);
      throw error;
    }
  }

  async search(params: SemanticSearchParams): Promise<VectorQueryMatch[]> {
    const normalized = params.text?.trim();
    if (!normalized) {
      return [];
    }

    const vector = await this.embeddingProvider.generateEmbedding(normalized);
    console.info('[semantic-search] executing query', {
      textPreview: normalized.slice(0, 64),
      topK: params.topK ?? 5,
      hasFilters: Boolean(params.filters),
    });
    const matches = await this.vectorStore.query({
      vector,
      topK: params.topK,
      filter: params.filters,
    });

    const threshold = typeof params.minScore === 'number' ? params.minScore : this.defaultMinScore;
    const filtered = matches.filter((match) => (typeof match.score === 'number' ? match.score >= threshold : true));
    console.info('[semantic-search] query results', {
      rawMatches: matches.length,
      returned: filtered.length,
      threshold,
    });
    return filtered;
  }

  private normalizeRecord(record?: SemanticAgentRecord | null): SemanticAgentRecord | null {
    if (!record) return null;
    if (record.agentId === undefined || record.agentId === null) return null;
    if (record.chainId === undefined || record.chainId === null) return null;
    const name = record.name?.toString().trim() || `agent-${record.agentId}`;
    return {
      ...record,
      name,
      description: record.description ?? '',
      tags: this.normalizeStringArray(record.tags),
      capabilities: this.normalizeStringArray(record.capabilities),
      defaultInputModes: this.normalizeStringArray(record.defaultInputModes),
      defaultOutputModes: this.normalizeStringArray(record.defaultOutputModes),
    };
  }

  private normalizeStringArray(value?: unknown): string[] | undefined {
    if (!value) return undefined;
    const arr = Array.isArray(value) ? value : [value];
    const result = arr
      .map((entry) => {
        if (typeof entry === 'string') {
          const trimmed = entry.trim();
          return trimmed.length ? trimmed : null;
        }
        return null;
      })
      .filter((entry): entry is string => Boolean(entry));
    return result.length ? Array.from(new Set(result)) : undefined;
  }

  private async buildEmbeddings(texts: string[]): Promise<number[][]> {
    if (!texts.length) {
      return [];
    }
    if (typeof this.embeddingProvider.generateBatchEmbeddings === 'function') {
      return await this.embeddingProvider.generateBatchEmbeddings(texts);
    }
    const vectors: number[][] = [];
    for (const text of texts) {
      vectors.push(await this.embeddingProvider.generateEmbedding(text));
    }
    return vectors;
  }

  private buildAgentText(record: SemanticAgentRecord): string {
    if (typeof this.embeddingProvider.prepareAgentText === 'function') {
      try {
        const prepared = this.embeddingProvider.prepareAgentText(record);
        if (prepared?.trim()) {
          return prepared.trim();
        }
      } catch {
        // Fall back to default builder
      }
    }

    const segments: string[] = [];
    segments.push(`Name: ${record.name}`);
    if (record.description) {
      segments.push(`Description: ${record.description}`);
    }
    if (record.tags?.length) {
      segments.push(`Tags: ${record.tags.join(', ')}`);
    }
    if (record.capabilities?.length) {
      segments.push(`Capabilities: ${record.capabilities.join(', ')}`);
    }
    if (record.defaultInputModes?.length) {
      segments.push(`Inputs: ${record.defaultInputModes.join(', ')}`);
    }
    if (record.defaultOutputModes?.length) {
      segments.push(`Outputs: ${record.defaultOutputModes.join(', ')}`);
    }
    segments.push(...this.serializeMetadataSegments(record.metadata));
    return segments.filter(Boolean).join('. ');
  }

  private buildVectorMetadata(record: SemanticAgentRecord): Record<string, unknown> {
    const metadata: Record<string, unknown> = {
      chainId: record.chainId,
      agentId: record.agentId,
      name: record.name,
    };
    if (record.description) metadata.description = record.description;
    if (record.tags?.length) metadata.tags = record.tags;
    if (record.capabilities?.length) metadata.capabilities = record.capabilities;
    if (record.defaultInputModes?.length) metadata.defaultInputModes = record.defaultInputModes;
    if (record.defaultOutputModes?.length) metadata.defaultOutputModes = record.defaultOutputModes;
    if (record.metadata && Object.keys(record.metadata).length > 0) {
      metadata.details = record.metadata;
    }
    return metadata;
  }

  private serializeMetadataSegments(metadata?: Record<string, unknown>): string[] {
    if (!metadata) return [];
    const segments: string[] = [];

    const stringify = (value: unknown): string | null => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length ? trimmed : null;
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }
      if (Array.isArray(value)) {
        const flat = value
          .map((entry) => stringify(entry))
          .filter((entry): entry is string => Boolean(entry));
        return flat.length ? flat.join(', ') : null;
      }
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value);
        } catch {
          return null;
        }
      }
      return null;
    };

    const handleArray = (label: string, value: unknown) => {
      const text = stringify(value);
      if (text) {
        segments.push(`${label}: ${text}`);
      }
    };

    handleArray('Supported trust', metadata['supportedTrust']);
    handleArray('Operators', metadata['operators']);
    handleArray('Skills', metadata['skills']);
    handleArray('Prompts', metadata['prompts']);
    handleArray('MCP tools', metadata['mcpTools']);
    handleArray('MCP resources', metadata['mcpResources']);

    const tokenMetadata = metadata['tokenMetadata'];
    if (Array.isArray(tokenMetadata)) {
      for (const entry of tokenMetadata) {
        if (entry && typeof entry === 'object') {
          const key = typeof (entry as any).key === 'string'
            ? (entry as any).key
            : typeof (entry as any).metadataKey === 'string'
              ? (entry as any).metadataKey
              : null;
          const valueText = stringify(
            (entry as any).valueText ?? (entry as any).value ?? (entry as any).valueHex,
          );
          if (key && valueText) {
            segments.push(`${key}: ${valueText}`);
          }
        }
      }
    }

    const tokenMetadataMap = metadata['tokenMetadataMap'];
    if (tokenMetadataMap && typeof tokenMetadataMap === 'object' && !Array.isArray(tokenMetadataMap)) {
      for (const [key, value] of Object.entries(tokenMetadataMap as Record<string, unknown>)) {
        const text = stringify(value);
        if (key && text) {
          segments.push(`${key}: ${text}`);
        }
      }
    }

    const rawMetadata = metadata['raw'];
    if (rawMetadata && typeof rawMetadata === 'object' && !Array.isArray(rawMetadata)) {
      for (const [key, value] of Object.entries(rawMetadata as Record<string, unknown>)) {
        const text = stringify(value);
        if (key && text) {
          segments.push(`${key}: ${text}`);
        }
      }
    }

    return segments;
  }
}

