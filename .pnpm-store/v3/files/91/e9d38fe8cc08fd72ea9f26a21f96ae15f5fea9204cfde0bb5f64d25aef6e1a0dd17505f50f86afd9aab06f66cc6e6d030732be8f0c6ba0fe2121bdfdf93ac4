import { AIAgentENSClient } from './AIAgentENSClient';
export declare class AIAgentL2ENSNamespaceClient extends AIAgentENSClient {
    private namespaceClient;
    constructor(chain: any, rpcUrl: string, adapter: any, ensRegistryAddress: `0x${string}`, ensResolverAddress: `0x${string}`, identityRegistryAddress: `0x${string}`);
    /**
     * Override to ensure L2 client always returns true for isL2()
     */
    isL2(): boolean;
    /**
     * Override to ensure L2 client always returns false for isL1()
     */
    isL1(): boolean;
    /**
     * Override to ensure L2 client always returns 'L2'
     */
    getChainType(): 'L1' | 'L2';
    private initializeNamespaceClient;
    getAgentUrlByName(name: string): Promise<string | null>;
    /**
     * Override getAgentAccountByName to use namespace.ninja for L2 availability checking
     */
    getAgentAccountByName(name: string): Promise<`0x${string}` | null>;
    /**
     * Get the namespace client instance
     */
    getNamespaceClient(): any;
    /**
     * Note: getAgentEoaByAgentAccount is not a method of AIAgentENSClient
     * This method is actually in AIAgentIdentityClient, so we don't need to override it here.
     * The ownership detection logic is handled in the UI layer (AddAgentModal.tsx)
     */
    /**
     * Override hasAgentNameOwner to use namespace.ninja for L2 availability checking
     */
    hasAgentNameOwner(orgName: string, agentName: string): Promise<boolean>;
    /**
     * Override prepareAddAgentNameToOrgCalls to use namespace.ninja SDK for L2
     */
    prepareAddAgentNameToOrgCalls(params: {
        agentAddress: `0x${string}`;
        orgName: string;
        agentName: string;
        agentUrl: string;
    }): Promise<{
        calls: {
            to: `0x${string}`;
            data: `0x${string}`;
            value?: bigint;
        }[];
    }>;
    prepareSetNameUriCalls(name: string, uri: string): Promise<{
        calls: {
            to: `0x${string}`;
            data: `0x${string}`;
        }[];
    }>;
}
//# sourceMappingURL=AIAgentL2ENSNamespaceClient.d.ts.map