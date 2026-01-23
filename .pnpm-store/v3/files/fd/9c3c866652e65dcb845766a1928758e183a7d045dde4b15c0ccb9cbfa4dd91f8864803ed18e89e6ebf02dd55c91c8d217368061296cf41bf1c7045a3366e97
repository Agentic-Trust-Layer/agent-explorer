/**
 * Shared helpers to resolve AccountProviders for domain clients
 * (reputation, ENS, etc.) from user apps and environment.
 */
import { type AccountProvider } from '@agentic-trust/8004-sdk';
import { getAdminApp } from '../userApps/adminApp';
import { getClientApp } from '../userApps/clientApp';
import { getProviderApp } from '../userApps/providerApp';
import { getValidatorApp } from '../userApps/validatorApp';
export interface DomainUserApps {
    adminApp?: Awaited<ReturnType<typeof getAdminApp>>;
    clientApp?: Awaited<ReturnType<typeof getClientApp>>;
    providerApp?: Awaited<ReturnType<typeof getProviderApp>>;
    validatorApp?: Awaited<ReturnType<typeof getValidatorApp>>;
}
/**
 * Resolve which user apps are active in this process based on roles.
 * This can be called once and passed into domain client initializers.
 */
export declare function resolveDomainUserApps(): Promise<DomainUserApps>;
/**
 * Resolve an AccountProvider suitable for reputation operations
 * for the given chain. Prefers:
 *   1. AdminApp
 *   2. ProviderApp (optionally upgraded by ClientApp)
 *   3. ClientApp
 *
 * Falls back to a read-only provider derived from the provider's
 * session key (if available).
 */
export declare function resolveReputationAccountProvider(chainId: number, rpcUrl: string, userApps?: DomainUserApps): Promise<AccountProvider>;
/**
 * Resolve an AccountProvider suitable for ENS operations for the given chain.
 * Prefers:
 *   1. AdminApp
 *   2. ClientApp
 *   3. ProviderApp
 *
 * Falls back to a read-only provider if none are available.
 */
export declare function resolveENSAccountProvider(chainId: number, rpcUrl: string, userApps?: DomainUserApps): Promise<AccountProvider>;
/**
 * Resolve an AccountProvider suitable for validation operations for the given chain.
 * Prefers:
 *   1. ValidatorApp (for validation responses)
 *   2. AdminApp
 *   3. ProviderApp
 *   4. ClientApp
 *
 * Falls back to a read-only provider if none are available.
 */
export declare function resolveValidationAccountProvider(chainId: number, rpcUrl: string, userApps?: DomainUserApps): Promise<AccountProvider>;
//# sourceMappingURL=domainAccountProviders.d.ts.map