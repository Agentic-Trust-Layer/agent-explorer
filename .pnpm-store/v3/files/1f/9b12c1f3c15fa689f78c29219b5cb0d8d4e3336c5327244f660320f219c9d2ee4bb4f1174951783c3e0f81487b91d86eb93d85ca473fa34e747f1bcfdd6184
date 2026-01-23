/**
 * Provider App Singleton
 *
 * Manages a singleton instance for provider-side operations using session package
 * Provides access to agent account, delegation setup, and wallet client for agent operations
 */
import { ViemAccountProvider } from '@agentic-trust/8004-sdk';
import { isUserAppEnabled, logUserAppInitStart, logUserAppInitFailure, logUserAppInitSuccess } from './userApp';
// Singleton instance
let providerAppInstance = null;
let initializationPromise = null;
/**
 * Get or create the ProviderApp singleton
 * Initializes from session package in environment variables
 */
export async function getProviderApp() {
    // If already initialized, return immediately
    if (providerAppInstance) {
        return providerAppInstance;
    }
    // If initialization is in progress, wait for it
    if (initializationPromise) {
        return initializationPromise;
    }
    // Start initialization
    logUserAppInitStart('provider');
    initializationPromise = (async () => {
        try {
            const sessionPackagePath = process.env.AGENTIC_TRUST_SESSION_PACKAGE_PATH;
            if (!sessionPackagePath) {
                throw new Error('Missing required environment variable: AGENTIC_TRUST_SESSION_PACKAGE_PATH');
            }
            // Load session package and build delegation setup
            const { loadSessionPackage, buildDelegationSetup, buildAgentAccountFromSession } = await import('../lib/sessionPackage');
            const sessionPackage = loadSessionPackage(sessionPackagePath);
            const delegationSetup = buildDelegationSetup(sessionPackage);
            // Get agent account from session package
            const agentAccount = await buildAgentAccountFromSession(sessionPackage);
            // Create wallet client for agent
            const { createWalletClient, http: httpTransport } = await import('viem');
            const walletClient = createWalletClient({
                account: agentAccount,
                chain: delegationSetup.chain,
                transport: httpTransport(delegationSetup.rpcUrl),
            });
            // Create AccountProvider
            const accountProvider = new ViemAccountProvider({
                publicClient: delegationSetup.publicClient,
                walletClient: walletClient,
                account: agentAccount,
                chainConfig: {
                    id: delegationSetup.chain.id,
                    rpcUrl: delegationSetup.rpcUrl,
                    name: delegationSetup.chain.name,
                    chain: delegationSetup.chain,
                },
            });
            providerAppInstance = {
                sessionPackage,
                delegationSetup,
                agentAccount,
                publicClient: delegationSetup.publicClient,
                walletClient: walletClient,
                accountProvider,
                agentId: BigInt(sessionPackage.agentId),
            };
            logUserAppInitSuccess('provider', sessionPackage.agentId?.toString());
            return providerAppInstance;
        }
        catch (error) {
            logUserAppInitFailure('provider', error);
            initializationPromise = null; // Reset on error so it can be retried
            throw error;
        }
    })();
    // Check if this is a provider app (environment variable flag)
    if (!isUserAppEnabled('provider')) {
        return undefined;
    }
    return initializationPromise;
}
/**
 * Get the agent ID (convenience method)
 */
export async function getProviderAgentId() {
    const providerApp = await getProviderApp();
    return providerApp?.agentId ?? BigInt(0);
}
/**
 * Check if provider app is initialized
 */
export function isProviderAppInitialized() {
    return providerAppInstance !== null;
}
/**
 * Reset the singleton (useful for testing)
 */
export function resetProviderApp() {
    providerAppInstance = null;
    initializationPromise = null;
}
//# sourceMappingURL=providerApp.js.map