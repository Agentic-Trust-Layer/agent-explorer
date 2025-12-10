export interface SemanticSearchFilters {
  capabilities?: string[];
  inputMode?: string;
  outputMode?: string;
  tags?: string[];
  defaultInputModes?: string[];
  defaultOutputModes?: string[];
  minScore?: number;
  [key: string]: unknown;
}

export interface SemanticAgentRecord {
  agentId: string;
  chainId: number;
  name: string;
  description?: string;
  tags?: string[];
  capabilities?: string[];
  defaultInputModes?: string[];
  defaultOutputModes?: string[];
  metadata?: Record<string, unknown>;
}

