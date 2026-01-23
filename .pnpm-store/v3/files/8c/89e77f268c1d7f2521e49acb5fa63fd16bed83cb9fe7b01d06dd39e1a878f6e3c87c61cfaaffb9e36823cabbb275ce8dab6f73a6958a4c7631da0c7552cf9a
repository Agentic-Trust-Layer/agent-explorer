/**
 * Base abstractions for chain-aware domain clients
 * (discovery, identity, ENS, reputation).
 *
 * Each concrete singleton wraps an instance of this base class.
 */
export type DomainClientType = 'discovery' | 'identity' | 'ens' | 'reputation' | 'validation';
/**
 * Generic base class for domain-specific clients.
 *
 * - TClient: the underlying client type (e.g. AIAgentDiscoveryClient)
 * - TKey:    key type used to distinguish instances (e.g. chainId or 'global')
 */
export declare abstract class DomainClient<TClient, TKey = number> {
    readonly type: DomainClientType;
    protected instances: Map<TKey, TClient>;
    protected initPromises: Map<TKey, Promise<TClient>>;
    constructor(type: DomainClientType);
    /**
     * Concrete subclasses must implement client construction for a given key.
     * The optional initArg can be used to pass through configuration overrides.
     */
    protected abstract buildClient(key: TKey, initArg?: unknown): Promise<TClient>;
    /**
     * Get or create a client for a given key.
     * Handles memoization and in‑flight initialization tracking.
     */
    get(key: TKey, initArg?: unknown): Promise<TClient>;
    isInitialized(key: TKey): boolean;
    /**
     * Reset one or all instances (useful for testing).
     */
    reset(key?: TKey): void;
}
//# sourceMappingURL=domainClient.d.ts.map