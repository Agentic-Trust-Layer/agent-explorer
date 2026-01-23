/**
 * Provider App Singleton
 *
 * Manages a singleton instance for provider-side operations using session package
 * Provides access to agent account, delegation setup, and wallet client for agent operations
 */
import { type AccountProvider } from '@agentic-trust/8004-sdk';
import type { Account, PublicClient, WalletClient } from 'viem';
import type { DelegationSetup } from '../lib/sessionPackage';
import type { SessionPackage } from '../../shared/sessionPackage';
type ProviderAppInstance = {
    sessionPackage: SessionPackage;
    delegationSetup: DelegationSetup;
    agentAccount: Account;
    publicClient: PublicClient;
    walletClient: WalletClient;
    accountProvider: AccountProvider;
    agentId: bigint;
};
/**
 * Get or create the ProviderApp singleton
 * Initializes from session package in environment variables
 */
export declare function getProviderApp(): Promise<ProviderAppInstance | undefined>;
/**
 * Get the agent ID (convenience method)
 */
export declare function getProviderAgentId(): Promise<bigint>;
/**
 * Check if provider app is initialized
 */
export declare function isProviderAppInitialized(): boolean;
/**
 * Reset the singleton (useful for testing)
 */
export declare function resetProviderApp(): void;
export {};
//# sourceMappingURL=providerApp.d.ts.map