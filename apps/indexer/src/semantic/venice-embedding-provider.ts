import type { EmbeddingProvider } from './interfaces.js';
import type { SemanticAgentRecord } from './types.js';
import { intentJsonToSearchText } from './intent-text.js';

export interface VeniceEmbeddingConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

interface VeniceEmbeddingResponse {
  data: Array<{ embedding: number[] }>;
}

export class VeniceEmbeddingProvider implements EmbeddingProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: VeniceEmbeddingConfig) {
    if (!config?.apiKey) {
      throw new Error('VeniceEmbeddingProvider requires an apiKey');
    }
    this.apiKey = config.apiKey;
    this.model = config.model ?? 'text-embedding-bge-m3';
    this.baseUrl = config.baseUrl ?? 'https://api.venice.ai/api/v1/embeddings';
    this.timeoutMs = config.timeoutMs ?? 30_000;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const payload = {
      input: text,
      model: this.model,
      encoding_format: 'float',
    };
    const response = await this.executeRequest(payload);
    return response.data[0]?.embedding ?? [];
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const payload = {
      input: texts,
      model: this.model,
      encoding_format: 'float',
    };
    const response = await this.executeRequest(payload);
    return response.data.map((entry) => entry.embedding);
  }

  prepareAgentText(agent: SemanticAgentRecord): string {
    const tags = Array.isArray(agent.tags) ? `Tags: ${agent.tags.join(', ')}` : '';
    const capabilities = Array.isArray(agent.capabilities) ? `Capabilities: ${agent.capabilities.join(', ')}` : '';
    const inputs = Array.isArray(agent.defaultInputModes)
      ? `Inputs: ${agent.defaultInputModes.join(', ')}`
      : '';
    const outputs = Array.isArray(agent.defaultOutputModes)
      ? `Outputs: ${agent.defaultOutputModes.join(', ')}`
      : '';

    const metadataObj = agent.metadata && typeof agent.metadata === 'object' ? (agent.metadata as any) : null;
    const agentCard = metadataObj?.agentCard ?? null;
    const raw = metadataObj?.raw ?? null;

    const skillsFromAgentCard: any[] = Array.isArray(agentCard?.skills) ? agentCard.skills : [];
    const skillsFromRaw: any[] = Array.isArray(raw?.skills) ? raw.skills : [];
    const rawSkills: any[] = skillsFromAgentCard.length ? skillsFromAgentCard : skillsFromRaw;

    const skillLines: string[] = [];
    const skillTags: string[] = [];
    for (const s of rawSkills) {
      if (!s || typeof s !== 'object') continue;
      const id = typeof s.id === 'string' ? s.id.trim() : '';
      const name = typeof s.name === 'string' ? s.name.trim() : '';
      const desc = typeof s.description === 'string' ? s.description.trim() : '';
      const line = [id ? `id=${id}` : '', name ? `name=${name}` : '', desc ? `description=${desc}` : '']
        .filter(Boolean)
        .join(' | ');
      if (line) skillLines.push(`Skill: ${line}`);

      if (Array.isArray(s.tags)) {
        for (const t of s.tags) {
          if (typeof t === 'string' && t.trim()) skillTags.push(t.trim());
        }
      }

      // Examples often contain structured "intent" payloads; include a compact normalized form.
      if (Array.isArray(s.examples)) {
        for (const ex of s.examples.slice(0, 5)) {
          const title = typeof ex?.title === 'string' ? ex.title.trim() : '';
          const request = ex?.request ?? ex?.input ?? ex?.example ?? null;
          const intentText = request ? intentJsonToSearchText(request) : '';
          if (title && intentText) {
            skillLines.push(`Example: ${title}\n${intentText}`);
          } else if (intentText) {
            skillLines.push(`Example:\n${intentText}`);
          } else if (title) {
            skillLines.push(`Example title: ${title}`);
          }
        }
      }
    }

    const derivedSkillTags = skillTags.length ? `Skill tags: ${Array.from(new Set(skillTags)).join(', ')}` : '';

    return [
      agent.name,
      agent.description,
      tags,
      derivedSkillTags,
      capabilities,
      inputs,
      outputs,
      skillLines.length ? skillLines.join('\n') : '',
      this.serializeMetadata(agent.metadata),
    ]
      .filter(Boolean)
      .join('. ');
  }

  private async executeRequest(body: Record<string, unknown>): Promise<VeniceEmbeddingResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Venice embedding request failed: ${response.status} ${errorText}`);
      }
      return (await response.json()) as VeniceEmbeddingResponse;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Venice embedding request timed out');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private serializeMetadata(metadata?: Record<string, unknown>): string {
    if (!metadata) {
      return '';
    }
    const entries = Object.entries(metadata)
      .filter(([, value]) => typeof value === 'string' || typeof value === 'number')
      .map(([key, value]) => `${key}: ${String(value)}`);
    return entries.length > 0 ? `Metadata: ${entries.join(', ')}` : '';
  }
}

