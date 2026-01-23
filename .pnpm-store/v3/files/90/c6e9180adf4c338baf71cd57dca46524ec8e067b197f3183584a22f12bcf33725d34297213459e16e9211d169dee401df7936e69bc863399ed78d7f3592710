/**
 * Admin App Singleton
 *
 * Manages a singleton instance for admin-side operations using private key
 * Provides access to admin account, wallet client, and admin adapter for agent administration
 */
import { type AccountProvider } from '@agentic-trust/8004-sdk';
import type { Account, PublicClient, WalletClient } from 'viem';
type AdminAppInstance = {
    account?: Account;
    publicClient: PublicClient;
    walletClient?: WalletClient;
    accountProvider: AccountProvider;
    address: `0x${string}`;
    hasPrivateKey: boolean;
};
/**
 * Check if the dedicated admin private key is configured in environment.
 *
 * This checks AGENTIC_TRUST_ADMIN_PRIVATE_KEY only. It does not consider
 * session-provided keys or AGENTIC_TRUST_ADMIN_PRIVATE_KEY.
 */
export declare function hasAdminPrivateKey(): boolean;
/**
 * Get or create the AdminApp instance for a specific private key
 * Initializes from private key in cookies (Web3Auth/wallet) or environment variables
 *
 * @param privateKey - Optional private key. If not provided, will try cookies then env vars
 */
export declare function getAdminApp(privateKey?: string, chainId?: number): Promise<AdminAppInstance | undefined>;
/**
 * Get the admin address (convenience method)
 */
export declare function getAdminAddress(): Promise<`0x${string}`>;
/**
 * Check if admin app is initialized for a specific address
 */
export declare function isAdminAppInitialized(address?: string): boolean;
/**
 * Reset admin app instances (useful for testing)
 * @param address - Optional address to reset specific instance, or all if not provided
 */
export declare function resetAdminApp(address?: string): void;
export {};
//# sourceMappingURL=adminApp.d.ts.map