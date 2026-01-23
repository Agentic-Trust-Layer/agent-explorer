/**
 * Client App Singleton
 *
 * Manages a singleton instance for client-side operations using private key
 * Provides access to client account, wallet client, and client address
 */
import { ViemAccountProvider } from '@agentic-trust/8004-sdk';
import { isUserAppEnabled, logUserAppInitStart, logUserAppInitFailure, logUserAppInitSuccess } from './userApp';
// Singleton instance
let clientAppInstance = null;
let initializationPromise = null;
/**
 * Get or create the ClientApp singleton
 * Initializes from private key in environment variables
 */
export async function getClientApp() {
    // Check if this process is configured to act as a client app
    // If not, do nothing and return undefined (no side effects)
    const isClientApp = isUserAppEnabled('client');
    if (!isClientApp) {
        return undefined;
    }
    // If already initialized, return immediately
    if (clientAppInstance) {
        return clientAppInstance;
    }
    // If initialization is in progress, wait for it
    if (initializationPromise) {
        return initializationPromise;
    }
    initializationPromise = (async () => {
        try {
            const { getChainRpcUrl, DEFAULT_CHAIN_ID } = await import('../lib/chainConfig');
            const privateKey = process.env.AGENTIC_TRUST_ADMIN_PRIVATE_KEY;
            const rpcUrl = getChainRpcUrl(DEFAULT_CHAIN_ID);
            if (!privateKey) {
                console.warn('ClientApp role is enabled but AGENTIC_TRUST_ADMIN_PRIVATE_KEY is not set; skipping ClientApp initialization for this process.');
                clientAppInstance = null;
                initializationPromise = null;
                return undefined;
            }
            if (!rpcUrl) {
                console.warn('ClientApp role is enabled but no RPC URL is configured; set AGENTIC_TRUST_RPC_URL_* env vars. Skipping ClientApp initialization.');
                clientAppInstance = null;
                initializationPromise = null;
                return undefined;
            }
            // Start initialization (only when we have the minimum env to proceed)
            logUserAppInitStart('client', `NODE_ENV=${process.env.NODE_ENV}`);
            const { privateKeyToAccount } = await import('viem/accounts');
            const { createPublicClient, createWalletClient, http: httpTransport } = await import('viem');
            const { sepolia } = await import('viem/chains');
            // Normalize private key
            const normalizedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
            const account = privateKeyToAccount(normalizedKey);
            const address = account.address;
            // Create public and wallet clients
            const publicClient = createPublicClient({
                chain: sepolia,
                transport: httpTransport(rpcUrl),
            });
            const walletClient = createWalletClient({
                account,
                chain: sepolia,
                transport: httpTransport(rpcUrl),
            });
            // Create AccountProvider
            const accountProvider = new ViemAccountProvider({
                publicClient,
                walletClient,
                account,
                chainConfig: {
                    id: sepolia.id,
                    rpcUrl,
                    name: sepolia.name,
                    chain: sepolia,
                },
            });
            clientAppInstance = {
                account,
                publicClient: publicClient,
                walletClient: walletClient,
                accountProvider,
                address,
            };
            logUserAppInitSuccess('client', address);
            return clientAppInstance;
        }
        catch (error) {
            logUserAppInitFailure('client', error);
            initializationPromise = null; // Reset on error so it can be retried
            throw error;
        }
    })();
    return initializationPromise;
}
/**
 * Backwards-compatible helper to get the client address as a string.
 * Prefer using getClientApp() or getClientAppAccount() in new code.
 */
export async function getClientAddress() {
    const clientApp = await getClientApp();
    return clientApp?.address;
}
/**
 * Get the full viem Account for the ClientApp (convenience method).
 * Returns undefined if the ClientApp is not enabled/initialized.
 */
export async function getClientAppAccount() {
    const clientApp = await getClientApp();
    return clientApp?.account;
}
/**
 * Check if client app is initialized
 */
export function isClientAppInitialized() {
    return clientAppInstance !== null;
}
/**
 * Reset the singleton (useful for testing)
 */
export function resetClientApp() {
    clientAppInstance = null;
    initializationPromise = null;
}
//# sourceMappingURL=clientApp.js.map