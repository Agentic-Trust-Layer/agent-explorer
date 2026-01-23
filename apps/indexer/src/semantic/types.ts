export interface SemanticSearchFilters {
  capabilities?: string[];
  a2aSkills?: string[];
  oasfSkills?: string[];
  inputMode?: string;
  outputMode?: string;
  tags?: string[];
  defaultInputModes?: string[];
  defaultOutputModes?: string[];
  minScore?: number;
  $or?: Array<Record<string, unknown>>;
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

