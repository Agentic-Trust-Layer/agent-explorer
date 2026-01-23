/**
 * Base types and helpers for server-side user app singletons
 * (AdminApp, ClientApp, ProviderApp).
 *
 * Centralizes common env-flag handling and logging so individual
 * user apps can "inherit" shared behavior.
 */
import type { AccountProvider } from '@agentic-trust/8004-sdk';
import type { PublicClient, WalletClient } from 'viem';
export type UserAppRole = 'admin' | 'client' | 'provider' | 'validator';
export interface BaseUserAppInstance {
    publicClient: PublicClient;
    walletClient?: WalletClient | null;
    accountProvider: AccountProvider;
    address?: `0x${string}`;
}
/**
 * Check if a given user app role is enabled based on its environment flag.
 *
 * Legacy (still supported for backwards-compatibility):
 * - admin    → AGENTIC_TRUST_IS_ADMIN_APP
 * - client   → AGENTIC_TRUST_IS_CLIENT_APP
 * - provider → AGENTIC_TRUST_IS_PROVIDER_APP
 *
 * Preferred: use AGENTIC_TRUST_APP_ROLES with a '|'‑separated list
 * of roles (e.g. "provider|client"). Falls back to legacy flags.
 */
export declare function isUserAppEnabled(role: UserAppRole): boolean;
export declare function logUserAppInitStart(role: UserAppRole, extra?: string): void;
export declare function logUserAppInitSuccess(role: UserAppRole, detail?: string): void;
export declare function logUserAppInitFailure(role: UserAppRole, error: unknown): void;
//# sourceMappingURL=userApp.d.ts.map