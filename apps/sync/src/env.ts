function envString(key: string, defaultValue?: string): string {
  const v = process.env[key];
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing required environment variable: ${key}`);
}

export const ETH_SEPOLIA_GRAPHQL_URL = envString('ETH_SEPOLIA_GRAPHQL_URL', '');
export const BASE_SEPOLIA_GRAPHQL_URL = envString('BASE_SEPOLIA_GRAPHQL_URL', '');
export const OP_SEPOLIA_GRAPHQL_URL = envString('OP_SEPOLIA_GRAPHQL_URL', '');
export const GRAPHQL_API_KEY = envString('GRAPHQL_API_KEY', '');

export const GRAPHDB_BASE_URL = envString('GRAPHDB_BASE_URL', 'https://graphdb.agentkg.io');
export const GRAPHDB_REPOSITORY = envString('GRAPHDB_REPOSITORY', 'agentkg');
export const GRAPHDB_USERNAME = envString('GRAPHDB_USERNAME', '');
export const GRAPHDB_PASSWORD = envString('GRAPHDB_PASSWORD', '');
