/**
 * Admin App Singleton
 *
 * Manages a singleton instance for admin-side operations using private key
 * Provides access to admin account, wallet client, and admin adapter for agent administration
 */
import { ViemAccountProvider } from '@agentic-trust/8004-sdk';
import { getChainById, getChainRpcUrl, DEFAULT_CHAIN_ID } from '../lib/chainConfig';
import { isUserAppEnabled, logUserAppInitFailure, logUserAppInitStart, logUserAppInitSuccess } from './userApp';
// Singleton instance (per private key)
// Note: We use a Map to support multiple private keys (different users)
// The key is the private key hash or address to ensure uniqueness
const adminAppInstances = new Map();
const initializationPromises = new Map();
/**
 * Check if the dedicated admin private key is configured in environment.
 *
 * This checks AGENTIC_TRUST_ADMIN_PRIVATE_KEY only. It does not consider
 * session-provided keys or AGENTIC_TRUST_ADMIN_PRIVATE_KEY.
 */
export function hasAdminPrivateKey() {
    const value = process.env.AGENTIC_TRUST_ADMIN_PRIVATE_KEY;
    return typeof value === 'string' && value.trim().length > 0;
}
/**
 * Get or create the AdminApp instance for a specific private key
 * Initializes from private key in cookies (Web3Auth/wallet) or environment variables
 *
 * @param privateKey - Optional private key. If not provided, will try cookies then env vars
 */
export async function getAdminApp(privateKey, chainId = DEFAULT_CHAIN_ID) {
    // Resolve the private key first
    let resolvedPrivateKey = privateKey;
    let walletAddress;
    if (!resolvedPrivateKey) {
        // Try to get private key from session first (for Web3Auth/wallet), then fall back to environment variable
        // Only try Next.js cookies if we're in a Next.js environment
        try {
            // Dynamically try to import next/headers (only available in Next.js apps)
            // This is wrapped in try/catch because core package doesn't have next as a dependency
            // @ts-ignore - next/headers is not available in core package, only in Next.js apps
            const nextHeaders = await import('next/headers').catch(() => null);
            if (nextHeaders && nextHeaders.cookies) {
                const cookieStore = await nextHeaders.cookies();
                resolvedPrivateKey = cookieStore.get('admin_private_key')?.value;
            }
        }
        catch (error) {
            // If cookies() fails (e.g., not in Next.js context), fall back to environment variable
            // This is expected in non-Next.js contexts
        }
        // Fall back to environment variable if no session key
        if (!resolvedPrivateKey) {
            // Check environment variables directly
            const envPrivateKey = process.env.AGENTIC_TRUST_ADMIN_PRIVATE_KEY;
            resolvedPrivateKey = envPrivateKey;
        }
    }
    // Check if we have a wallet address from MetaMask (no private key available)
    if (!resolvedPrivateKey) {
        // Try to get wallet address from session (for MetaMask)
        try {
            // @ts-ignore - next/headers is not available in core package, only in Next.js apps
            const nextHeaders = await import('next/headers').catch(() => null);
            if (nextHeaders && nextHeaders.cookies) {
                const cookieStore = await nextHeaders.cookies();
                walletAddress = cookieStore.get('wallet_address')?.value;
            }
        }
        catch (error) {
            // Ignore errors
        }
        // If we have neither private key nor wallet address, throw error
        if (!walletAddress && !resolvedPrivateKey) {
            throw new Error('Missing required: Set AGENTIC_TRUST_ADMIN_PRIVATE_KEY environment variable, authenticate via Web3Auth social login (provides private key), or connect via wallet (MetaMask/Web3Auth).\n\n' +
                'Note:\n' +
                '  - Web3Auth social login (Google, Facebook, etc.) → provides private key → full server-side operations ✅\n' +
                '  - Web3Auth/MetaMask wallet provider → no private key → read-only operations (prepare transactions) ✅\n' +
                '  - For wallet providers, implement client-side signing to complete transactions');
        }
        // If we have wallet address but no private key, we can still do read-only operations
        // (prepare transactions, encode calldata, etc.) but not sign/send transactions
        // This is handled by checking hasPrivateKey before attempting to sign
    }
    // Determine instance key - use wallet address if available, otherwise use private key address
    let instanceKeyBase;
    let resolvedAddress;
    if (resolvedPrivateKey) {
        // Use private key to derive address
        const { privateKeyToAccount } = await import('viem/accounts');
        const normalizedKey = resolvedPrivateKey.startsWith('0x') ? resolvedPrivateKey : `0x${resolvedPrivateKey}`;
        const tempAccount = privateKeyToAccount(normalizedKey);
        instanceKeyBase = tempAccount.address.toLowerCase();
        resolvedAddress = tempAccount.address;
    }
    else if (walletAddress) {
        // Use wallet address directly (for read-only operations)
        instanceKeyBase = walletAddress.toLowerCase();
        resolvedAddress = walletAddress;
    }
    else {
        throw new Error('Either private key or wallet address is required');
    }
    const instanceKey = `${instanceKeyBase}:${chainId}`;
    // If already initialized for this key, return immediately
    const existingInstance = adminAppInstances.get(instanceKey);
    if (existingInstance) {
        return existingInstance;
    }
    // If initialization is in progress for this key, wait for it
    const existingPromise = initializationPromises.get(instanceKey);
    if (existingPromise) {
        return existingPromise;
    }
    // Start initialization for this specific private key
    const initializationPromise = (async () => {
        try {
            // Check if this is an admin app (environment flag)
            if (!isUserAppEnabled('admin')) {
                throw new Error('AdminApp is only available when AGENTIC_TRUST_APP_ROLES includes "admin"');
            }
            logUserAppInitStart('admin', `chainId=${chainId}`);
            // Get chain-specific RPC URL and chain config
            const targetChainId = chainId || DEFAULT_CHAIN_ID;
            const rpcUrl = getChainRpcUrl(targetChainId);
            if (!rpcUrl) {
                throw new Error(`Missing required RPC URL. Configure AGENTIC_TRUST_RPC_URL_{CHAIN} for chainId ${targetChainId}`);
            }
            const { createPublicClient, createWalletClient, http: httpTransport } = await import('viem');
            const chain = getChainById(targetChainId);
            // Create public client (always needed)
            const publicClient = createPublicClient({
                chain,
                transport: httpTransport(rpcUrl),
            });
            let account;
            let walletClient;
            let address;
            // hasPrivateKey reflects strictly whether the dedicated admin private
            // key env var is present, not whether a session/cookie key exists.
            const hasPrivateKey = hasAdminPrivateKey();
            if (resolvedPrivateKey) {
                // Create wallet client and account from private key
                const { privateKeyToAccount } = await import('viem/accounts');
                const normalizedKey = resolvedPrivateKey.startsWith('0x') ? resolvedPrivateKey : `0x${resolvedPrivateKey}`;
                account = privateKeyToAccount(normalizedKey);
                address = account.address;
                walletClient = createWalletClient({
                    account,
                    chain,
                    transport: httpTransport(rpcUrl),
                });
            }
            else {
                // Read-only mode - use wallet address
                address = resolvedAddress;
            }
            // Create AccountProvider - walletClient is optional (null for read-only)
            const accountProvider = new ViemAccountProvider({
                publicClient,
                walletClient: walletClient ?? null,
                account: account ?? undefined,
                chainConfig: {
                    id: chain.id,
                    rpcUrl,
                    name: chain.name,
                    chain,
                },
            });
            const instance = {
                account,
                publicClient: publicClient,
                walletClient: walletClient,
                accountProvider,
                address,
                hasPrivateKey,
            };
            // Store instance by address key
            adminAppInstances.set(instanceKey, instance);
            initializationPromises.delete(instanceKey); // Remove from pending
            logUserAppInitSuccess('admin', address);
            return instance;
        }
        catch (error) {
            logUserAppInitFailure('admin', error);
            initializationPromises.delete(instanceKey); // Remove from pending on error
            throw error;
        }
    })();
    // Store promise for this key
    initializationPromises.set(instanceKey, initializationPromise);
    return initializationPromise;
}
/**
 * Get the admin address (convenience method)
 */
export async function getAdminAddress() {
    const adminApp = await getAdminApp(undefined, DEFAULT_CHAIN_ID);
    return adminApp?.address ?? '0x';
}
/**
 * Check if admin app is initialized for a specific address
 */
export function isAdminAppInitialized(address) {
    if (address) {
        const keyPrefix = `${address.toLowerCase()}:`;
        for (const key of adminAppInstances.keys()) {
            if (key.startsWith(keyPrefix)) {
                return true;
            }
        }
        return false;
    }
    return adminAppInstances.size > 0;
}
/**
 * Reset admin app instances (useful for testing)
 * @param address - Optional address to reset specific instance, or all if not provided
 */
export function resetAdminApp(address) {
    if (address) {
        const keyPrefix = `${address.toLowerCase()}:`;
        for (const key of Array.from(adminAppInstances.keys())) {
            if (key.startsWith(keyPrefix)) {
                adminAppInstances.delete(key);
                initializationPromises.delete(key);
            }
        }
    }
    else {
        adminAppInstances.clear();
        initializationPromises.clear();
    }
}
//# sourceMappingURL=adminApp.js.map