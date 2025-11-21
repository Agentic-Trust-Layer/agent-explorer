import { sepolia, baseSepolia, optimismSepolia } from 'viem/chains';
import { Chain } from 'viem';

export type ChainConfig = {
  chainId: number;
  chainIdHex: string;
  chainName: string;
  rpcUrl: string;
  identityRegistryAddress: `0x${string}`;
  bundlerUrl: string;
  explorerUrl: string;
  explorerName: string;
  viemChain: Chain;
  networkType: 'L1' | 'L2';
  ensOrgName?: string;
};

export const CHAIN_CONFIGS: ChainConfig[] = [
  {
    chainId: 11155111,
    chainIdHex: '0xaa36a7',
    chainName: 'Ethereum Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL as string,
    identityRegistryAddress: process.env.NEXT_PUBLIC_ETH_SEPOLIA_IDENTITY_REGISTRY as `0x${string}`,
    bundlerUrl: process.env.NEXT_PUBLIC_ETH_SEPOLIA_BUNDLER_URL as string,
    explorerUrl: 'https://sepolia.etherscan.io',
    explorerName: 'Etherscan',
    viemChain: sepolia,
    networkType: 'L1' as const,
    ensOrgName: process.env.NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME_SEPOLIA ?? '8004-agent'
  },
  {
    chainId: 84532,
    chainIdHex: '0x14a34',
    chainName: 'Base Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL as string,
    identityRegistryAddress: process.env.NEXT_PUBLIC_BASE_SEPOLIA_IDENTITY_REGISTRY as `0x${string}`,
    bundlerUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_BUNDLER_URL as string,
    explorerUrl: 'https://sepolia.basescan.org',
    explorerName: 'Basescan',
    viemChain: baseSepolia,
    networkType: 'L2' as const,
    ensOrgName: process.env.NEXT_PUBLIC_AGENTIC_TRUST_ENS_ORG_NAME_BASE_SEPOLIA ?? '8004-base-agent'
  },
  {
    chainId: 11155420,
    chainIdHex: '0xaef3c',
    chainName: 'OP Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_OP_SEPOLIA_RPC_URL as string,
    identityRegistryAddress: process.env.NEXT_PUBLIC_OP_SEPOLIA_IDENTITY_REGISTRY as `0x${string}`,
    bundlerUrl: process.env.NEXT_PUBLIC_OP_SEPOLIA_BUNDLER_URL as string,
    explorerUrl: 'https://sepolia-optimism.etherscan.io',
    explorerName: 'Etherscan',
    viemChain: optimismSepolia,
    networkType: 'L2' as const,
    ensOrgName: process.env.NEXT_PUBLIC_OP_SEPOLIA_ENS_ORG ?? '8004-opt-agent'
  }
].filter((config) => 
  // Only include chains that have all required configuration
  config.rpcUrl && 
  config.identityRegistryAddress && 
  config.bundlerUrl
);

export function getChainConfig(chainId: number): ChainConfig | undefined {
  return CHAIN_CONFIGS.find(config => config.chainId === chainId);
}

export function getChainConfigByHex(chainIdHex: string): ChainConfig | undefined {
  return CHAIN_CONFIGS.find(config => config.chainIdHex === chainIdHex);
}

export function getExplorerUrl(chainId: number): string {
  const config = getChainConfig(chainId);
  return config?.explorerUrl || 'https://sepolia.etherscan.io';
}

export function getExplorerName(chainId: number): string {
  const config = getChainConfig(chainId);
  return config?.explorerName || 'Etherscan';
}

export function getIdentityRegistry(chainId: number): `0x${string}` | undefined {
  const config = getChainConfig(chainId);
  return config?.identityRegistryAddress;
}

export function getBundlerUrl(chainId: number): string | undefined {
  const config = getChainConfig(chainId);
  return config?.bundlerUrl;
}

export function getRpcUrl(chainId: number): string | undefined {
  const config = getChainConfig(chainId);
  return config?.rpcUrl;
}

export function getChainIdHex(chainId: number): string | undefined {
  const config = getChainConfig(chainId);
  return config?.chainIdHex;
}

export function getViemChain(chainId: number): Chain | undefined {
  const config = getChainConfig(chainId);
  return config?.viemChain;
}

export function getNetworkType(chainId: number): 'L1' | 'L2' | undefined {
  const config = getChainConfig(chainId);
  return config?.networkType;
}

export function getEnsOrgName(chainId: number): string | undefined {
  const config = getChainConfig(chainId);
  return config?.ensOrgName;
}

