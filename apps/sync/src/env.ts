function envString(key: string, defaultValue?: string): string {
  const v = process.env[key];
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`Missing required environment variable: ${key}`);
}

export const ETH_MAINNET_GRAPHQL_URL = envString('ETH_MAINNET_GRAPHQL_URL', '');
export const ETH_SEPOLIA_GRAPHQL_URL = envString('ETH_SEPOLIA_GRAPHQL_URL', '');
export const BASE_SEPOLIA_GRAPHQL_URL = envString('BASE_SEPOLIA_GRAPHQL_URL', '');
export const OP_SEPOLIA_GRAPHQL_URL = envString('OP_SEPOLIA_GRAPHQL_URL', '');
export const LINEA_MAINNET_GRAPHQL_URL = envString('LINEA_MAINNET_GRAPHQL_URL', '');
export const LINEA_SEPOLIA_GRAPHQL_URL = envString('LINEA_SEPOLIA_GRAPHQL_URL', '');
export const GRAPHQL_API_KEY = envString('GRAPHQL_API_KEY', '');

// ENS subgraph endpoints (used to enumerate subnames under a parent ENS name without scanning blocks).
export const ENS_MAINNET_GRAPHQL_URL = envString('ENS_MAINNET_GRAPHQL_URL', '');
export const ENS_SEPOLIA_GRAPHQL_URL = envString('ENS_SEPOLIA_GRAPHQL_URL', '');

export const ETH_MAINNET_RPC_HTTP_URL = envString('ETH_MAINNET_RPC_HTTP_URL', '');
export const ETH_SEPOLIA_RPC_HTTP_URL = envString('ETH_SEPOLIA_RPC_HTTP_URL', '');
export const BASE_SEPOLIA_RPC_HTTP_URL = envString('BASE_SEPOLIA_RPC_HTTP_URL', '');
export const OP_SEPOLIA_RPC_HTTP_URL = envString('OP_SEPOLIA_RPC_HTTP_URL', '');
export const LINEA_MAINNET_RPC_HTTP_URL = envString('LINEA_MAINNET_RPC_HTTP_URL', '');
export const LINEA_SEPOLIA_RPC_HTTP_URL = envString('LINEA_SEPOLIA_RPC_HTTP_URL', '');

export const GRAPHDB_BASE_URL = envString('GRAPHDB_BASE_URL', 'https://graphdb.agentkg.io');
export const GRAPHDB_REPOSITORY = envString('GRAPHDB_REPOSITORY', 'agentkg');
export const GRAPHDB_USERNAME = envString('GRAPHDB_USERNAME', '');
export const GRAPHDB_PASSWORD = envString('GRAPHDB_PASSWORD', '');
