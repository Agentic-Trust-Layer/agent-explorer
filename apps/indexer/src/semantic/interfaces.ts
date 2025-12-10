import type { SemanticSearchFilters, SemanticAgentRecord } from './types.js';

export interface VectorUpsertItem {
  id: string;
  values: number[];
  metadata?: Record<string, unknown>;
}

export interface VectorQueryParams {
  vector: number[];
  topK?: number;
  filter?: SemanticSearchFilters;
}

export interface VectorQueryMatch {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
  matchReasons?: string[];
}

export interface VectorStoreProvider {
  initialize(): Promise<void>;
  upsert(item: VectorUpsertItem): Promise<void>;
  upsertBatch(items: VectorUpsertItem[]): Promise<void>;
  query(params: VectorQueryParams): Promise<VectorQueryMatch[]>;
  delete(id: string): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
}

export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  generateBatchEmbeddings?(texts: string[]): Promise<number[][]>;
  prepareAgentText?(agent: SemanticAgentRecord): string;
}

