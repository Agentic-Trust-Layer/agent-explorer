/**
 * Base abstractions for chain-aware domain clients
 * (discovery, identity, ENS, reputation).
 *
 * Each concrete singleton wraps an instance of this base class.
 */
/**
 * Generic base class for domain-specific clients.
 *
 * - TClient: the underlying client type (e.g. AIAgentDiscoveryClient)
 * - TKey:    key type used to distinguish instances (e.g. chainId or 'global')
 */
export class DomainClient {
    type;
    instances = new Map();
    initPromises = new Map();
    constructor(type) {
        this.type = type;
    }
    /**
     * Get or create a client for a given key.
     * Handles memoization and in‑flight initialization tracking.
     */
    async get(key, initArg) {
        if (this.instances.has(key)) {
            return this.instances.get(key);
        }
        if (this.initPromises.has(key)) {
            return this.initPromises.get(key);
        }
        const promise = this.buildClient(key, initArg)
            .then((client) => {
            this.instances.set(key, client);
            this.initPromises.delete(key);
            return client;
        })
            .catch((error) => {
            this.initPromises.delete(key);
            throw error;
        });
        this.initPromises.set(key, promise);
        return promise;
    }
    isInitialized(key) {
        return this.instances.has(key);
    }
    /**
     * Reset one or all instances (useful for testing).
     */
    reset(key) {
        if (typeof key === 'undefined') {
            this.instances.clear();
            this.initPromises.clear();
        }
        else {
            this.instances.delete(key);
            this.initPromises.delete(key);
        }
    }
}
//# sourceMappingURL=domainClient.js.map