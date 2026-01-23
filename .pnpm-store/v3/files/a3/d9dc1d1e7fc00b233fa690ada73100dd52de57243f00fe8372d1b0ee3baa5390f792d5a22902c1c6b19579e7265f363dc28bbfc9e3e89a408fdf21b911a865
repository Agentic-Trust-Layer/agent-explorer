/**
 * Client App Singleton
 *
 * Manages a singleton instance for client-side operations using private key
 * Provides access to client account, wallet client, and client address
 */
import { type AccountProvider } from '@agentic-trust/8004-sdk';
import type { Account, PublicClient, WalletClient } from 'viem';
type ClientAppInstance = {
    account: Account;
    publicClient: PublicClient;
    walletClient: WalletClient;
    accountProvider: AccountProvider;
    address: `0x${string}`;
};
/**
 * Get or create the ClientApp singleton
 * Initializes from private key in environment variables
 */
export declare function getClientApp(): Promise<ClientAppInstance | undefined>;
/**
 * Backwards-compatible helper to get the client address as a string.
 * Prefer using getClientApp() or getClientAppAccount() in new code.
 */
export declare function getClientAddress(): Promise<string | undefined>;
/**
 * Get the full viem Account for the ClientApp (convenience method).
 * Returns undefined if the ClientApp is not enabled/initialized.
 */
export declare function getClientAppAccount(): Promise<Account | undefined>;
/**
 * Check if client app is initialized
 */
export declare function isClientAppInitialized(): boolean;
/**
 * Reset the singleton (useful for testing)
 */
export declare function resetClientApp(): void;
export {};
//# sourceMappingURL=clientApp.d.ts.map