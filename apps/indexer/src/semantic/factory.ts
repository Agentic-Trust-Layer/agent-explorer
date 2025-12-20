import { PineconeVectorStore } from './pinecone-vector-store.js';
import { VeniceEmbeddingProvider } from './venice-embedding-provider.js';
import { SemanticSearchService } from './semantic-search-service.js';

function readEnv(env: Record<string, any> | undefined, key: string): string | undefined {
  if (env && typeof env[key] === 'string') {
    return env[key] as string;
  }
  if (typeof process !== 'undefined' && process?.env && typeof process.env[key] === 'string') {
    return process.env[key];
  }
  return undefined;
}

function parseIntLike(value?: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseFloatLike(value?: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function createSemanticSearchServiceFromEnv(env?: Record<string, any>): SemanticSearchService | null {
  const pineconeApiKey = readEnv(env, 'PINECONE_API_KEY');
  const pineconeIndex = readEnv(env, 'PINECONE_INDEX');
  const veniceApiKey = readEnv(env, 'VENICE_API_KEY');

  // Debug logging for Workers environment
  if (typeof process === 'undefined' || !process.env) {
    // Running in Workers - log what we found
    console.info('[semantic-factory] Workers environment check:', {
      hasEnv: !!env,
      envKeys: env ? Object.keys(env).filter(k => k.includes('API') || k.includes('INDEX')) : [],
      hasPineconeKey: !!pineconeApiKey,
      hasPineconeIndex: !!pineconeIndex,
      hasVeniceKey: !!veniceApiKey,
      veniceKeyLength: veniceApiKey ? veniceApiKey.length : 0,
      veniceKeyPreview: veniceApiKey ? `${veniceApiKey.substring(0, 4)}...${veniceApiKey.substring(veniceApiKey.length - 4)}` : 'missing',
    });
  }

  if (!pineconeApiKey || !pineconeIndex || !veniceApiKey) {
    console.warn('⚠️ Semantic search disabled: missing Pinecone or Venice configuration', {
      missing: {
        pineconeApiKey: !pineconeApiKey,
        pineconeIndex: !pineconeIndex,
        veniceApiKey: !veniceApiKey,
      }
    });
    return null;
  }

  const pineconeNamespace = readEnv(env, 'PINECONE_NAMESPACE');
  const pineconeBatchSize = parseIntLike(readEnv(env, 'PINECONE_BATCH_SIZE'));
  const veniceModel = readEnv(env, 'VENICE_MODEL');
  const veniceBaseUrl = readEnv(env, 'VENICE_BASE_URL');
  const veniceTimeout = parseIntLike(readEnv(env, 'VENICE_TIMEOUT_MS'));
  const defaultMinScore = parseFloatLike(readEnv(env, 'SEMANTIC_SEARCH_MIN_SCORE'));

  const vectorStore = new PineconeVectorStore({
    apiKey: pineconeApiKey,
    index: pineconeIndex,
    namespace: pineconeNamespace,
    batchSize: pineconeBatchSize,
  });

  const embeddingProvider = new VeniceEmbeddingProvider({
    apiKey: veniceApiKey,
    model: veniceModel,
    baseUrl: veniceBaseUrl,
    timeoutMs: veniceTimeout,
  });

  return new SemanticSearchService(embeddingProvider, vectorStore, defaultMinScore);
}

