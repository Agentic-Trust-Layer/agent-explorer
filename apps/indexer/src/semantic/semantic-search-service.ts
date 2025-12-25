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
  private static readonly MAX_EMBEDDING_TOKENS = 8192;
  // Heuristic: token ~= 4 chars for typical English/JSON-ish text.
  // Keep margin to avoid hard failures from tokenizer differences.
  private static readonly APPROX_CHARS_PER_TOKEN = 4;
  private static readonly TOKEN_SAFETY_MARGIN = 512;
  private static readonly MAX_EMBEDDING_CHARS =
    (SemanticSearchService.MAX_EMBEDDING_TOKENS - SemanticSearchService.TOKEN_SAFETY_MARGIN) *
    SemanticSearchService.APPROX_CHARS_PER_TOKEN;
  private static readonly MAX_EMBEDDING_SPLIT_DEPTH = 8;

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

    const safeQuery = this.clampTextForEmbedding(normalized);
    const vector = await this.generateEmbeddingResilient(safeQuery);
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

    const chunkedByText = texts.map((text, index) => {
      const chunks = this.chunkTextForEmbedding(text);
      if (chunks.length > 1) {
        console.warn('[semantic-search] embedding text exceeded token limit; chunking', {
          index,
          originalChars: text.length,
          chunks: chunks.length,
          maxChars: SemanticSearchService.MAX_EMBEDDING_CHARS,
        });
      }
      return chunks;
    });

    const allChunks: string[] = [];
    const chunkSpans: Array<{ start: number; count: number }> = [];
    for (const chunks of chunkedByText) {
      const start = allChunks.length;
      allChunks.push(...chunks);
      chunkSpans.push({ start, count: chunks.length });
    }

    let chunkEmbeddings: number[][];
    if (typeof this.embeddingProvider.generateBatchEmbeddings === 'function') {
      try {
        chunkEmbeddings = await this.embeddingProvider.generateBatchEmbeddings(allChunks);
      } catch (error) {
        if (this.isTokenLimitError(error)) {
          console.warn('[semantic-search] batch embedding hit token limit; falling back to per-chunk requests');
          chunkEmbeddings = await this.embedChunksIndividually(allChunks);
        } else {
          throw error;
        }
      }
    } else {
      chunkEmbeddings = await this.embedChunksIndividually(allChunks);
    }

    return chunkSpans.map(({ start, count }) => {
      const vectors = chunkEmbeddings.slice(start, start + count).filter((vec) => Array.isArray(vec) && vec.length > 0);
      if (!vectors.length) return [];
      if (vectors.length === 1) return vectors[0] ?? [];
      return this.averageVectors(vectors);
    });
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

  private async embedChunksIndividually(chunks: string[]): Promise<number[][]> {
    const vectors: number[][] = [];
    for (const chunk of chunks) {
      vectors.push(await this.generateEmbeddingResilient(chunk));
    }
    return vectors;
  }

  private isTokenLimitError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error ?? '');
    return /maximum token limit|exceeds the maximum token limit|8192 tokens/i.test(message);
  }

  private findSplitIndex(text: string): number {
    const mid = Math.floor(text.length / 2);
    const window = 4000;
    const start = Math.max(0, mid - window);
    const end = Math.min(text.length, mid + window);
    const slice = text.slice(start, end);

    // Prefer paragraph boundary, then sentence-ish boundary, then whitespace.
    const candidates = ['\n\n', '\n', '. ', '; ', ', ', ' '];
    for (const needle of candidates) {
      const idx = slice.lastIndexOf(needle, mid - start);
      if (idx !== -1) {
        return start + idx + needle.length;
      }
    }
    return mid;
  }

  private async generateEmbeddingResilient(text: string, depth = 0): Promise<number[]> {
    const trimmed = text?.trim() ?? '';
    if (!trimmed) return [];

    try {
      return await this.embeddingProvider.generateEmbedding(trimmed);
    } catch (error) {
      if (!this.isTokenLimitError(error)) {
        throw error;
      }

      if (depth >= SemanticSearchService.MAX_EMBEDDING_SPLIT_DEPTH) {
        const clamped = this.clampTextForEmbedding(trimmed);
        if (clamped.length < trimmed.length) {
          console.warn('[semantic-search] token limit persists; truncating text for embedding', {
            depth,
            originalChars: trimmed.length,
            clampedChars: clamped.length,
          });
          return await this.embeddingProvider.generateEmbedding(clamped);
        }
        throw error;
      }

      const splitAt = this.findSplitIndex(trimmed);
      const left = trimmed.slice(0, splitAt).trim();
      const right = trimmed.slice(splitAt).trim();

      // If we can't split meaningfully, truncate harder and retry once.
      if (!left || !right) {
        const hard = trimmed.slice(0, Math.max(1, Math.floor(trimmed.length / 2))).trim();
        if (!hard || hard === trimmed) {
          throw error;
        }
        console.warn('[semantic-search] token limit; hard-splitting text for embedding', {
          depth,
          originalChars: trimmed.length,
          hardChars: hard.length,
        });
        return await this.generateEmbeddingResilient(hard, depth + 1);
      }

      console.warn('[semantic-search] token limit; splitting text for embedding', {
        depth,
        leftChars: left.length,
        rightChars: right.length,
      });

      const [a, b] = await Promise.all([
        this.generateEmbeddingResilient(left, depth + 1),
        this.generateEmbeddingResilient(right, depth + 1),
      ]);
      const vectors = [a, b].filter((vec) => Array.isArray(vec) && vec.length > 0);
      if (!vectors.length) return [];
      if (vectors.length === 1) return vectors[0] ?? [];
      return this.averageVectors(vectors);
    }
  }

  private averageVectors(vectors: number[][]): number[] {
    const dim = vectors[0]?.length ?? 0;
    if (!dim) return [];
    const sum = new Array<number>(dim).fill(0);
    let count = 0;
    for (const vec of vectors) {
      if (!Array.isArray(vec) || vec.length !== dim) continue;
      for (let i = 0; i < dim; i++) {
        sum[i] += vec[i] ?? 0;
      }
      count += 1;
    }
    if (!count) return [];
    for (let i = 0; i < dim; i++) {
      sum[i] /= count;
    }
    return sum;
  }

  private clampTextForEmbedding(text: string): string {
    const trimmed = text?.trim() ?? '';
    if (!trimmed) return '';
    if (trimmed.length <= SemanticSearchService.MAX_EMBEDDING_CHARS) return trimmed;
    return trimmed.slice(0, SemanticSearchService.MAX_EMBEDDING_CHARS);
  }

  private chunkTextForEmbedding(text: string): string[] {
    const trimmed = text?.trim() ?? '';
    if (!trimmed) return [''];

    const maxChars = SemanticSearchService.MAX_EMBEDDING_CHARS;
    if (trimmed.length <= maxChars) return [trimmed];

    // Prefer splitting on paragraph boundaries, then fall back to hard slices.
    const paragraphs = trimmed.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);
    const chunks: string[] = [];
    let current = '';

    const flush = () => {
      const c = current.trim();
      if (c) chunks.push(c);
      current = '';
    };

    const pushWithLimit = (segment: string) => {
      const seg = segment.trim();
      if (!seg) return;

      // If segment itself is too large, hard-slice it.
      if (seg.length > maxChars) {
        flush();
        for (let i = 0; i < seg.length; i += maxChars) {
          const slice = seg.slice(i, i + maxChars).trim();
          if (slice) chunks.push(slice);
        }
        return;
      }

      if (!current) {
        current = seg;
        return;
      }

      const candidate = `${current}\n\n${seg}`;
      if (candidate.length <= maxChars) {
        current = candidate;
      } else {
        flush();
        current = seg;
      }
    };

    if (!paragraphs.length) {
      // Shouldn't happen, but keep behavior safe.
      return [trimmed.slice(0, maxChars)];
    }

    for (const para of paragraphs) {
      pushWithLimit(para);
    }
    flush();

    return chunks.length ? chunks : [trimmed.slice(0, maxChars)];
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

    // Flag vectors that were embedded with a parsed A2A agent card.
    // We enforce semantic search to only query these vectors.
    try {
      const agentCard = record.metadata && typeof record.metadata === 'object' ? (record.metadata as any).agentCard : null;
      const hasAgentCard =
        agentCard &&
        typeof agentCard === 'object' &&
        !Array.isArray(agentCard) &&
        (typeof (agentCard as any).protocolVersion === 'string' ||
          typeof (agentCard as any).name === 'string' ||
          Array.isArray((agentCard as any).skills)) &&
        Object.keys(agentCard).length > 0;
      if (hasAgentCard) {
        metadata.hasAgentCard = true;
      }
    } catch {
      // ignore
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

