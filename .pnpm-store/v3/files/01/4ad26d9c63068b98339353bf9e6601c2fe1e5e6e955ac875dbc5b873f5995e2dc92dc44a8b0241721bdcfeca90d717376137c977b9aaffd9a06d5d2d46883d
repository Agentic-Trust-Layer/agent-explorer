/**
 * Discovery Client Singleton
 *
 * Manages a singleton instance of AIAgentDiscoveryClient
 * Initialized from environment variables or AgenticTrustClient config
 */
import { AIAgentDiscoveryClient, } from '@agentic-trust/8004-ext-sdk';
import { DomainClient } from './domainClient';
class DiscoveryDomainClient extends DomainClient {
    constructor() {
        super('discovery');
    }
    // initArg is an optional Partial<AIAgentDiscoveryClientConfig> override
    async buildClient(_key, initArg) {
        const overrideConfig = (initArg || {});
        // Get configuration from environment variables or provided config
        // Note: endpoint should be the full discovery GraphQL URL (e.g., https://api.example.com/graphql)
        let discoveryUrl = overrideConfig.endpoint;
        if (!discoveryUrl) {
            // Try environment variable
            discoveryUrl = process.env.AGENTIC_TRUST_DISCOVERY_URL;
            // If it doesn't end with /graphql, append it
            if (discoveryUrl && !discoveryUrl.endsWith('/graphql')) {
                discoveryUrl = `${discoveryUrl.replace(/\/$/, '')}/graphql`;
            }
        }
        const apiKey = overrideConfig.apiKey ??
            process.env.AGENTIC_TRUST_DISCOVERY_API_KEY;
        if (!discoveryUrl) {
            throw new Error('Missing required configuration: Discovery endpoint. Set AGENTIC_TRUST_DISCOVERY_URL or provide config.endpoint');
        }
        // Build full config
        const clientConfig = {
            endpoint: discoveryUrl,
            apiKey,
            timeout: overrideConfig.timeout,
            headers: overrideConfig.headers,
        };
        return new AIAgentDiscoveryClient(clientConfig);
    }
}
const discoveryDomainClient = new DiscoveryDomainClient();
/**
 * Get or create the AIAgentDiscoveryClient singleton
 * Initializes from environment variables or provided config
 */
export async function getDiscoveryClient(config) {
    const key = 'global';
    // If a config override is provided, reset and re‑initialize with that config
    if (config) {
        discoveryDomainClient.reset(key);
        return discoveryDomainClient.get(key, config);
    }
    return discoveryDomainClient.get(key);
}
/**
 * Check if discovery client is initialized
 */
export function isDiscoveryClientInitialized() {
    return discoveryDomainClient.isInitialized('global');
}
/**
 * Reset the singleton (useful for testing)
 */
export function resetDiscoveryClient() {
    discoveryDomainClient.reset();
}
//# sourceMappingURL=discoveryClient.js.map