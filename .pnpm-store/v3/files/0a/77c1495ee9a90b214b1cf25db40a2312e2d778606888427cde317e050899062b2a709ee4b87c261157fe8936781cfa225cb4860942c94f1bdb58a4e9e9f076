/**
 * Validator App Singleton
 *
 * Manages a singleton instance for validator-side operations using private key
 * Provides access to validator account, wallet client, and validator address
 * Used for processing ENS validation requests
 */
import { type AccountProvider } from '@agentic-trust/8004-sdk';
import type { Account, PublicClient, WalletClient } from 'viem';
type ValidatorAppInstance = {
    account: Account;
    publicClient: PublicClient;
    walletClient: WalletClient;
    accountProvider: AccountProvider;
    address: `0x${string}`;
    hasPrivateKey: boolean;
};
/**
 * Check if the validator private key is configured in environment.
 */
export declare function hasValidatorPrivateKey(): boolean;
/**
 * Get or create the ValidatorApp instance
 * Initializes from private key in environment variables
 *
 * @param chainId - Chain ID (defaults to DEFAULT_CHAIN_ID)
 */
export declare function getValidatorApp(chainId?: number): Promise<ValidatorAppInstance | undefined>;
/**
 * Get the validator address (convenience method)
 */
export declare function getValidatorAddress(chainId?: number): Promise<`0x${string}` | undefined>;
/**
 * Check if validator app is initialized for a specific chain
 */
export declare function isValidatorAppInitialized(chainId?: number): boolean;
/**
 * Reset validator app instances (useful for testing)
 * @param chainId - Optional chain ID to reset specific instance, or all if not provided
 */
export declare function resetValidatorApp(chainId?: number): void;
export {};
//# sourceMappingURL=validatorApp.d.ts.map