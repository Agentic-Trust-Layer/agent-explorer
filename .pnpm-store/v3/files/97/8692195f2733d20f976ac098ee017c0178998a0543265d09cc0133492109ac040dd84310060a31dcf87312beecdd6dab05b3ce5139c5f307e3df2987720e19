/**
 * Centralized Chain Configuration
 *
 * This module provides chain-specific configuration and utilities
 * used throughout the AgenticTrust system.
 */
import { sepolia, baseSepolia, optimismSepolia } from 'viem/chains';
export { sepolia, baseSepolia, optimismSepolia };
/**
 * Chain configuration mapping
 */
export declare const CHAIN_CONFIG: {
    readonly 11155111: {
        readonly suffix: "SEPOLIA";
        readonly name: "sepolia";
        readonly displayName: "Ethereum Sepolia";
        readonly layer: "L1";
    };
    readonly 84532: {
        readonly suffix: "BASE_SEPOLIA";
        readonly name: "baseSepolia";
        readonly displayName: "Base Sepolia";
        readonly layer: "L2";
    };
    readonly 11155420: {
        readonly suffix: "OPTIMISM_SEPOLIA";
        readonly name: "optimismSepolia";
        readonly displayName: "Optimism Sepolia";
        readonly layer: "L2";
    };
};
export type SupportedChainId = keyof typeof CHAIN_CONFIG;
export type ChainLayer = 'L1' | 'L2';
export declare function getChainLayer(chainId: number): ChainLayer;
export declare function isL1(chainId: number): boolean;
export declare function isL2(chainId: number): boolean;
/**
 * Default chain ID used when no chain is specified
 */
export declare const DEFAULT_CHAIN_ID: SupportedChainId;
/**
 * Get chain-specific environment variable
 * @param baseName - Base environment variable name (e.g., 'AGENTIC_TRUST_RPC_URL')
 * @param chainId - Chain ID to get configuration for
 * @returns Chain-specific environment variable value or fallback to base name
 */
export declare function getChainEnvVarDetails(baseName: string, chainId: number): {
    value: string;
    chainKey: string;
    fallbackKey: string;
    usedKey: string;
};
export declare function getChainEnvVar(baseName: string, chainId: number): string;
type ChainEnvVarNames = {
    rpcServer: string;
    rpcClient: string;
    bundlerServer: string;
    bundlerClient: string;
    ensOrgAddressServer: string;
    ensOrgNameClient: string;
    ensPrivateKeyServer: string;
};
export declare function getChainEnvVarNames(chainId: number): ChainEnvVarNames;
export declare function requireChainEnvVar(baseName: string, chainId: number): string;
/**
 * Get chain-specific contract address
 * @param baseName - Base environment variable name (e.g., 'AGENTIC_TRUST_ENS_REGISTRY')
 * @param chainId - Chain ID to get configuration for
 * @returns Chain-specific contract address or fallback to base name
 */
export declare function getChainContractAddress(baseName: string, chainId: number): `0x${string}` | undefined;
/**
 * Get chain object by chainId
 * @param chainId - Chain ID to get chain object for
 * @returns viem Chain object
 * @throws Error if chainId is not supported
 */
export declare function getChainById(chainId: number): any;
/**
 * Get all supported chain IDs
 * @returns Array of supported chain IDs
 */
export declare function getSupportedChainIds(): number[];
/**
 * Check if a chain ID is supported
 * @param chainId - Chain ID to check
 * @returns True if the chain ID is supported
 */
export declare function isChainSupported(chainId: number): boolean;
/**
 * Get chain configuration by chain ID
 * @param chainId - Chain ID to get configuration for
 * @returns Chain configuration object or null if not supported
 */
export declare function getChainConfig(chainId: number): typeof CHAIN_CONFIG[SupportedChainId] | null;
/**
 * Get chain-specific RPC URL (accessible from both server and client)
 *
 * Requires chain-specific environment variables - throws error if not found:
 * Browser: NEXT_PUBLIC_AGENTIC_TRUST_RPC_URL_{CHAIN_SUFFIX}
 * Server: AGENTIC_TRUST_RPC_URL_{CHAIN_SUFFIX} (preferred) or NEXT_PUBLIC_AGENTIC_TRUST_RPC_URL_{CHAIN_SUFFIX}
 * No generic fallbacks - only chain-specific variables are checked
 *
 * @param chainId - Chain ID to get RPC URL for
 * @returns RPC URL string
 */
export declare function getChainRpcUrl(chainId: number): string;
export interface ChainDisplayMetadata {
    chainId: number;
    chainIdHex: `0x${string}`;
    chainName: string;
    displayName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
}
export declare function getChainIdHex(chainId: number): `0x${string}`;
export declare function getChainDisplayMetadata(chainId: number): ChainDisplayMetadata;
export interface Web3AuthChainSettings {
    chainNamespace: 'eip155';
    chainId: `0x${string}`;
    rpcTarget: string;
    displayName: string;
    blockExplorerUrl?: string;
    ticker: string;
    tickerName: string;
    decimals: number;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
}
export declare function getWeb3AuthChainSettings(chainId: number): Web3AuthChainSettings;
/**
 * Get chain-specific bundler URL (accessible from both server and client)
 * @param chainId - Chain ID to get bundler URL for
 * @returns Bundler URL string
 */
export declare function getChainBundlerUrl(chainId: number): string;
/**
 * Check if private key mode is enabled (accessible from both server and client)
 * @returns True if private key mode is enabled
 */
export declare function isPrivateKeyMode(): boolean;
/**
 * Get ENS organization name (accessible from both server and client), chain-specific.
 * Throws if not configured.
 * @param chainId - target chain (defaults to DEFAULT_CHAIN_ID)
 */
export declare function getEnsOrgName(chainId?: number): string;
/**
 * Get ENS org address (server-only), chain-specific. Throws if not configured.
 */
export declare function getEnsOrgAddress(chainId: number): `0x${string}`;
/**
 * Get ENS private key (server-only), chain-specific. Throws if not configured.
 */
export declare function getEnsPrivateKey(chainId: number): string;
/**
 * Get Web3Auth client ID (accessible from both server and client)
 * @returns Web3Auth client ID
 */
export declare function getWeb3AuthClientId(): string;
/**
 * Get Web3Auth network (accessible from both server and client)
 * @returns Web3Auth network
 */
export declare function getWeb3AuthNetwork(): string;
//# sourceMappingURL=chainConfig.d.ts.map