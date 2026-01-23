import { AIAgentENSClient } from './AIAgentENSClient';
export declare class AIAgentL2ENSDurenClient extends AIAgentENSClient {
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
    getAgentUrlByName(name: string): Promise<string | null>;
    getAgentAccountByName(name: string): Promise<`0x${string}` | null>;
    /**
     * Note: getAgentEoaByAgentAccount is not a method of AIAgentENSClient
     * This method is actually in AIAgentIdentityClient, so we don't need to override it here.
     * The ownership detection logic is handled in the UI layer (AddAgentModal.tsx)
     */
    /**
     * Override hasAgentNameOwner to use L2Registrar available() function
     */
    hasAgentNameOwner(orgName: string, agentName: string): Promise<boolean>;
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
    prepareAddAgentInfoCalls(params: {
        orgName: string;
        agentName: string;
        agentAddress: `0x${string}`;
        agentUrl: string;
        agentDescription?: string | null;
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
    /**
     * Register subdomain using L2Registrar contract (Base Sepolia specific)
     */
    registerSubdomain(subdomain: string, owner: `0x${string}`): Promise<{
        calls: {
            to: `0x${string}`;
            data: `0x${string}`;
            value?: bigint;
        }[];
    }>;
    /**
     * Direct chain call for setting resolver records
     */
    setResolverTextRecordDirect(name: string, key: string, value: string): Promise<{
        to: `0x${string}`;
        data: `0x${string}`;
    }>;
    /**
     * Direct chain call for setting resolver address records
     * Equivalent to: cast send resolver "setAddr(bytes32,uint256,bytes)" $NODE coinType encodedAddress
     */
    setResolverAddrRecordDirect(name: string, coinType: number, address: `0x${string}`): Promise<{
        to: `0x${string}`;
        data: `0x${string}`;
    }>;
}
//# sourceMappingURL=AIAgentL2ENSDurenClient.d.ts.map