/**
 * Reusable API route handler for resolving agent account by name
 * Handles ENS resolution
 */
type AgenticTrustClient = {
    getENSClient(): Promise<any>;
    getDiscoveryClient(): Promise<{
        getAgentByName(agentName: string): Promise<{
            agentAccount?: string | null;
            agentAccountEndpoint?: string | null;
            rawJson?: string | null;
            a2aEndpoint?: string | null;
        } | null>;
    }>;
};
/**
 * Request body type for resolve account
 */
export interface ResolveAccountRequestBody {
    agentName: string;
}
/**
 * Response type for resolve account
 */
export interface ResolveAccountResponse {
    account: string | null;
    method: 'ens-identity' | 'ens-direct' | 'discovery' | 'deterministic' | null;
    error?: string;
}
/**
 * Resolve agent account by name
 * Tries ENS resolution first, then returns null (client should compute deterministically)
 *
 * @param body - Request body with agent name
 * @param getClient - Function to get the AgenticTrustClient instance (app-specific)
 * @returns Response with resolved account address or null
 */
export declare function handleResolveAccount(body: ResolveAccountRequestBody, getClient: () => Promise<AgenticTrustClient>): Promise<ResolveAccountResponse>;
export {};
//# sourceMappingURL=resolveAccount.d.ts.map