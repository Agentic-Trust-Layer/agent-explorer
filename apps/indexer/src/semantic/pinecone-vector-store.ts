import { Pinecone, type RecordMetadata, type RecordMetadataValue } from '@pinecone-database/pinecone';
import type { SemanticSearchFilters } from './types.js';
import type {
  VectorStoreProvider,
  VectorUpsertItem,
  VectorQueryParams,
  VectorQueryMatch,
} from './interfaces.js';

export interface PineconeVectorStoreConfig {
  apiKey: string;
  index: string;
  namespace?: string;
  batchSize?: number;
}

export class PineconeVectorStore implements VectorStoreProvider {
  private readonly client: Pinecone;
  private readonly indexName: string;
  private readonly namespace?: string;
  private readonly batchSize: number;
  private initialized = false;
  private readonly baseIndex: ReturnType<Pinecone['Index']>;
  private skipDenseUpserts = false;
  private sparseIndexMessageLogged = false;

  constructor(config: PineconeVectorStoreConfig) {
    if (!config?.apiKey) {
      throw new Error('PineconeVectorStore requires an apiKey');
    }
    if (!config.index) {
      throw new Error('PineconeVectorStore requires an index name');
    }

    this.indexName = config.index;
    this.namespace = config.namespace;
    this.batchSize = config.batchSize ?? 100;
    this.client = new Pinecone({ apiKey: config.apiKey });
    this.baseIndex = this.client.Index(this.indexName);
    console.info('[PineconeVectorStore] Initialized', {
      index: this.indexName,
      namespace: this.namespace || '(default)',
      batchSize: this.batchSize,
    });
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    await this.baseIndex.describeIndexStats();
    this.initialized = true;
  }

  async upsert(item: VectorUpsertItem): Promise<void> {
    if (this.skipDenseUpserts) {
      return;
    }
    const index = await this.getTargetIndex();
    try {
      await index.upsert([
        {
          id: item.id,
          values: item.values,
          metadata: this.normalizeMetadata(item.metadata),
        },
      ]);
      console.info('[PineconeVectorStore] upserted vector', { index: this.indexName, namespace: this.namespace || '(default)' });
    } catch (error) {
      if (this.handleSparseIndexError(error)) {
        return;
      }
      throw error;
    }
  }

  async upsertBatch(items: VectorUpsertItem[]): Promise<void> {
    if (this.skipDenseUpserts) {
      return;
    }
    const index = await this.getTargetIndex();
    for (let i = 0; i < items.length; i += this.batchSize) {
      const batch = items.slice(i, i + this.batchSize).map((item) => ({
        id: item.id,
        values: item.values,
        metadata: this.normalizeMetadata(item.metadata),
      }));
      try {
        await index.upsert(batch);
        console.info('[PineconeVectorStore] upserted batch', {
          index: this.indexName,
          namespace: this.namespace || '(default)',
          batchSize: batch.length,
        });
      } catch (error) {
        if (this.handleSparseIndexError(error)) {
          return;
        }
        throw error;
      }
    }
  }

  async query(params: VectorQueryParams): Promise<VectorQueryMatch[]> {
    const index = await this.getTargetIndex();
    const topK = params.topK ?? 5;
    console.info('[PineconeVectorStore] query issued', {
      index: this.indexName,
      namespace: this.namespace || '(default)',
      topK,
      hasFilter: Boolean(params.filter),
    });
    const response = await index.query({
      vector: params.vector,
      topK,
      includeMetadata: true,
      filter: this.transformFilters(params.filter),
    });

    const matches =
      response.matches?.map((match) => ({
        id: match.id,
        score: match.score ?? 0,
        metadata: match.metadata as Record<string, unknown> | undefined,
        matchReasons: this.generateMatchReasons(match.score ?? 0, match.metadata as Record<string, unknown> | undefined),
      })) ?? [];
    console.info('[PineconeVectorStore] query results', {
      index: this.indexName,
      namespace: this.namespace || '(default)',
      matches: matches.length,
    });
    return matches;
  }

  async delete(id: string): Promise<void> {
    const index = await this.getTargetIndex();
    await index.deleteOne(id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    const index = await this.getTargetIndex();
    for (let i = 0; i < ids.length; i += this.batchSize) {
      const batch = ids.slice(i, i + this.batchSize);
      await index.deleteMany(batch);
    }
  }

  private async getTargetIndex() {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.namespace ? this.baseIndex.namespace(this.namespace) : this.baseIndex;
  }

  private handleSparseIndexError(error: unknown): boolean {
    const message = this.extractErrorMessage(error);
    if (message && message.toLowerCase().includes('dense vectors is not supported for sparse indexes')) {
      this.skipDenseUpserts = true;
      if (!this.sparseIndexMessageLogged) {
        this.sparseIndexMessageLogged = true;
        console.warn('[PineconeVectorStore] Skipping semantic ingest: configured Pinecone index only accepts sparse vectors. Create a dense index (e.g. cosine/Euclidean) and update PINECONE_INDEX to enable embeddings.');
      }
      return true;
    }
    return false;
  }

  private extractErrorMessage(error: unknown): string | null {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
      return (error as any).message;
    }
    return null;
  }

  private transformFilters(filters?: SemanticSearchFilters): Record<string, unknown> | undefined {
    if (!filters) {
      return undefined;
    }

    const result: Record<string, unknown> = {};

    if (filters.capabilities && filters.capabilities.length > 0) {
      result.capabilities = { $in: filters.capabilities };
    }

    if (filters.inputMode) {
      result.defaultInputModes = { $in: [filters.inputMode] };
    }

    if (filters.outputMode) {
      result.defaultOutputModes = { $in: [filters.outputMode] };
    }

    if (filters.tags && filters.tags.length > 0) {
      result.tags = { $in: filters.tags };
    }

    for (const [key, value] of Object.entries(filters)) {
      if (
        key === 'capabilities' ||
        key === 'inputMode' ||
        key === 'outputMode' ||
        key === 'tags' ||
        key === 'minScore'
      ) {
        continue;
      }
      result[key] = value;
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

  private generateMatchReasons(score: number, metadata?: Record<string, unknown>): string[] | undefined {
    const reasons: string[] = [];
    if (score >= 0.9) {
      reasons.push('Excellent semantic match');
    } else if (score >= 0.7) {
      reasons.push('Good semantic match');
    } else if (score >= 0.5) {
      reasons.push('Moderate semantic match');
    }

    if (metadata && Array.isArray(metadata.capabilities)) {
      const caps = (metadata.capabilities as unknown[]).filter((value) => typeof value === 'string') as string[];
      if (caps.length > 0) {
        reasons.push(`Capabilities: ${caps.join(', ')}`);
      }
    }

    return reasons.length > 0 ? reasons : undefined;
  }

  private normalizeMetadata(metadata?: Record<string, unknown>): RecordMetadata | undefined {
    if (!metadata) {
      return undefined;
    }

    const result: Record<string, RecordMetadataValue> = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (this.isMetadataValue(value)) {
        result[key] = value;
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

  private isMetadataValue(value: unknown): value is RecordMetadataValue {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return true;
    }

    if (
      Array.isArray(value) &&
      value.every((item) => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean')
    ) {
      return true;
    }

    return false;
  }
}

