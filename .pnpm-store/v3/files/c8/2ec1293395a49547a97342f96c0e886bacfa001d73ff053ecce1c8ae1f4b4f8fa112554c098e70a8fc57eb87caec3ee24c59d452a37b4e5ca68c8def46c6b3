/**
 * Environment-configured AgenticTrustClient factory for server-side apps.
 *
 * This helper creates an AgenticTrustClient using environment variables.
 */
import { AgenticTrustClient } from '../singletons/agenticTrustClient';
import { getChainRpcUrl, DEFAULT_CHAIN_ID } from './chainConfig';
/**
 * Create an AgenticTrustClient using environment configuration.
 *
 * - Uses AGENTIC_TRUST_DISCOVERY_URL and AGENTIC_TRUST_DISCOVERY_API_KEY for GraphQL.
 * - Uses AGENTIC_TRUST_ADMIN_PRIVATE_KEY for signing.
 * - Derives RPC URL, identity registry, and reputation registry from chain config helpers.
 * - Optionally wires a session package when AGENTIC_TRUST_SESSION_PACKAGE_PATH and
 *   AGENTIC_TRUST_ENS_REGISTRY are configured.
 */
export async function getAgenticTrustClient() {
    try {
        const discoveryUrl = process.env.AGENTIC_TRUST_DISCOVERY_URL;
        const apiKey = process.env.AGENTIC_TRUST_DISCOVERY_API_KEY;
        if (!discoveryUrl) {
            throw new Error('Missing required environment variable: AGENTIC_TRUST_DISCOVERY_URL. ' +
                'This is required for the AgenticTrustClient to connect to the discovery GraphQL API.');
        }
        if (!apiKey) {
            console.warn('[AgenticTrustClient] Warning: AGENTIC_TRUST_DISCOVERY_API_KEY environment variable is not set. ' +
                'Discovery API requests may fail with authentication errors. Set AGENTIC_TRUST_DISCOVERY_API_KEY to your access code.');
        }
        const privateKey = process.env.AGENTIC_TRUST_ADMIN_PRIVATE_KEY;
        const rpcUrl = getChainRpcUrl(DEFAULT_CHAIN_ID);
        // Get chain-specific configuration (identity / reputation / ENS registry)
        const { getChainEnvVar } = await import('./chainConfig');
        const identityRegistry = getChainEnvVar('AGENTIC_TRUST_IDENTITY_REGISTRY', DEFAULT_CHAIN_ID);
        const reputationRegistry = getChainEnvVar('AGENTIC_TRUST_REPUTATION_REGISTRY', DEFAULT_CHAIN_ID);
        const ensRegistry = getChainEnvVar('AGENTIC_TRUST_ENS_REGISTRY', DEFAULT_CHAIN_ID);
        // Session package configuration (for provider-style deployments)
        const sessionPackagePath = process.env.AGENTIC_TRUST_SESSION_PACKAGE_PATH;
        const config = {
            timeout: 30000,
            headers: {
                Accept: 'application/json',
            },
        };
        if (discoveryUrl) {
            config.graphQLUrl = discoveryUrl;
        }
        if (apiKey) {
            config.apiKey = apiKey;
        }
        if (privateKey) {
            config.privateKey = privateKey;
        }
        if (rpcUrl) {
            config.rpcUrl = rpcUrl;
        }
        if (identityRegistry) {
            config.identityRegistry = identityRegistry;
        }
        if (reputationRegistry) {
            config.reputationRegistry = reputationRegistry;
        }
        if (sessionPackagePath && ensRegistry) {
            config.sessionPackage = {
                filePath: sessionPackagePath,
                ensRegistry: ensRegistry,
            };
        }
        return await AgenticTrustClient.create(config);
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=agenticTrust.js.map