/**
 * Reusable API route handler for resolving agent account by name
 * Handles ENS resolution
 */
import { extractAgentAccountFromDiscovery } from './accounts';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
function isValidAddress(value) {
    return (typeof value === 'string' &&
        value.startsWith('0x') &&
        value.length === 42 &&
        value.toLowerCase() !== ZERO_ADDRESS);
}
/**
 * Resolve agent account by name
 * Tries ENS resolution first, then returns null (client should compute deterministically)
 *
 * @param body - Request body with agent name
 * @param getClient - Function to get the AgenticTrustClient instance (app-specific)
 * @returns Response with resolved account address or null
 */
export async function handleResolveAccount(body, getClient) {
    try {
        const { agentName } = body;
        console.log("*********** zzz handleResolveAccount agentName", agentName);
        if (!agentName || !agentName.trim()) {
            return {
                account: null,
                method: null,
                error: 'agentName is required',
            };
        }
        const client = await getClient();
        const ensClient = await client.getENSClient();
        if (!ensClient) {
            return {
                account: null,
                method: null,
                error: 'ENS client not available',
            };
        }
        // Check if ENS client is properly configured
        const ensRegistryAddress = ensClient?.suilookeen_registrar ?? ensClient?.ensRegistryAddress;
        if (!ensRegistryAddress || ensRegistryAddress === '' || ensRegistryAddress === '0x0000000000000000000000000000000000000000') {
            return {
                account: null,
                method: null,
                error: 'ENS client not properly configured',
            };
        }
        // Try to resolve via ENS -> agent-identity -> agentId -> on-chain account
        try {
            const { agentId, account } = await ensClient.getAgentIdentityByName(agentName.trim());
            if (isValidAddress(account)) {
                return {
                    account: account,
                    method: 'ens-identity',
                };
            }
        }
        catch (ensError) {
            console.warn('ENS identity resolution failed:', ensError);
        }
        // Try to get agent account via ENS name directly
        try {
            const ensAgentAddress = await ensClient.getAgentAccountByName(agentName);
            if (isValidAddress(ensAgentAddress)) {
                return {
                    account: ensAgentAddress,
                    method: 'ens-direct',
                };
            }
        }
        catch (ensError) {
            console.warn('ENS direct resolution failed:', ensError);
        }
        // Try discovery client lookup
        try {
            const discoveryClient = await client.getDiscoveryClient();
            if (discoveryClient) {
                const discoveryAgent = await discoveryClient.getAgentByName(agentName.trim());
                console.log("*********** zzz handleResolveAccount discoveryAgent", discoveryAgent);
                const discoveryAccount = extractAgentAccountFromDiscovery(discoveryAgent);
                console.log("*********** zzz handleResolveAccount discoveryAccount", discoveryAccount);
                if (isValidAddress(discoveryAccount)) {
                    return {
                        account: discoveryAccount,
                        method: 'discovery',
                    };
                }
                const a2aEndpoint = typeof discoveryAgent?.a2aEndpoint === 'string'
                    ? discoveryAgent.a2aEndpoint.trim()
                    : '';
                if (a2aEndpoint) {
                    try {
                        const response = await fetch(a2aEndpoint, {
                            headers: {
                                Accept: 'application/json, text/plain;q=0.9',
                            },
                        });
                        if (response.ok) {
                            const json = await response.json();
                            const endpointAccount = (json && typeof json === 'object'
                                ? (json.agentAccount || json.agent?.account || json.account || null)
                                : null);
                            const derivedAccount = isValidAddress(endpointAccount)
                                ? endpointAccount
                                : extractAgentAccountFromDiscovery(json);
                            if (isValidAddress(derivedAccount)) {
                                return {
                                    account: derivedAccount,
                                    method: 'discovery',
                                };
                            }
                        }
                    }
                    catch (endpointError) {
                        console.warn('Failed to fetch agent data from discovery endpoint:', endpointError);
                    }
                }
            }
        }
        catch (discoveryError) {
            console.warn('Discovery lookup failed:', discoveryError);
        }
        // No ENS resolution found - client should compute deterministically
        return {
            account: null,
            method: 'deterministic',
        };
    }
    catch (error) {
        console.error('Error resolving account:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
            account: null,
            method: null,
            error: errorMessage,
        };
    }
}
//# sourceMappingURL=resolveAccount.js.map