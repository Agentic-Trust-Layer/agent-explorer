/**
 * Agentic Trust SDK - ENS Client
 * Uses AccountProvider (Ports & Adapters pattern) for chain I/O.
 */
import { type Chain } from 'viem';
import { AccountProvider } from '@agentic-trust/8004-sdk';
export declare class AIAgentENSClient {
    private chain;
    private accountProvider;
    private ensRegistryAddress;
    private ensResolverAddress;
    private identityRegistryAddress;
    private publicClient;
    constructor(chain: Chain, rpcUrl: string, accountProvider: AccountProvider, ensRegistryAddress: `0x${string}`, ensResolverAddress: `0x${string}`, identityRegistryAddress: `0x${string}`);
    getEnsRegistryAddress(): `0x${string}`;
    getEnsResolverAddress(): `0x${string}`;
    /**
     * Check if this client is for L1 (ETH Sepolia)
     * Base implementation - can be overridden by subclasses
     */
    isL1(): boolean;
    /**
     * Check if this client is for L2 (Base Sepolia, Optimism Sepolia, etc.)
     * Base implementation - can be overridden by subclasses
     */
    isL2(): boolean;
    /**
     * Get the chain type as a string
     */
    getChainType(): 'L1' | 'L2';
    encodeCall(abi: any[], functionName: string, args: any[]): string;
    encodeSetNameUri(name: string, uri: string): Promise<`0x${string}`>;
    prepareSetNameUriCalls(name: string, uri: string): Promise<{
        calls: {
            to: `0x${string}`;
            data: `0x${string}`;
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
    prepareSetNameImageCalls(name: string, imageUrl: string): Promise<{
        calls: {
            to: `0x${string}`;
            data: `0x${string}`;
        }[];
    }>;
    prepareSetNameDescriptionCalls(name: string, description: string): Promise<{
        calls: {
            to: `0x${string}`;
            data: `0x${string}`;
        }[];
    }>;
    encodeSetNameAgentIdentity(name: string, agentIdentity: BigInt): Promise<`0x${string}`>;
    prepareSetNameAgentIdentityCalls(name: string, agentIdentity: BigInt): Promise<{
        calls: {
            to: `0x${string}`;
            data: `0x${string}`;
        }[];
    }>;
    isValidAgentAccount(agentAccount: `0x${string}`): Promise<boolean | null>;
    /**
     * Resolve an agent by account address via ENS reverse + text record.
     * 1) Reverse resolve address -> ENS name via ENS Registry + resolver.name(bytes32)
     * 2) Read resolver.text(node, 'agent-identity') and decode agentId
     */
    getAgentIdentityByAccount(account: `0x${string}`): Promise<{
        agentId: bigint | null;
        ensName: string | null;
    }>;
    /**
     * Resolve an agent by ENS name via resolver.text(namehash(name), 'agent-identity')
     */
    getAgentIdentityByName(name: string): Promise<{
        agentId: bigint | null;
        account: string | null;
    }>;
    /**
     * Check if an agent name record already has an owner in the ENS Registry.
     * This doesn't require an address to be set, just checks if the record exists.
     */
    hasAgentNameOwner(orgName: string, agentName: string): Promise<boolean>;
    /**
     * Resolve account address for an ENS name via resolver.addr(namehash(name)).
     */
    getAgentAccountByName(name: string): Promise<`0x${string}` | null>;
    /**
     * Get the Agent URL via ENS text record for a given ENS name.
     */
    getAgentUrlByName(name: string): Promise<string | null>;
    /**
     * Get the Agent Avatar/Image via ENS text record for a given ENS name.
     */
    getAgentImageByName(name: string): Promise<string | null>;
    /**
     * Get the Agent Description via ENS text record for a given ENS name.
     */
    getAgentDescriptionByName(name: string): Promise<string | null>;
    /**
     * Reverse lookup: account address -> ENS name via resolver.name(reverseNode)
     */
    getAgentNameByAccount(account: `0x${string}`): Promise<string | null>;
    prepareSetAgentNameInfoCalls(params: {
        orgName: string;
        agentName: string;
        agentAddress: `0x${string}`;
        agentUrl?: string | null;
        agentDescription?: string | null;
    }): Promise<{
        calls: {
            to: `0x${string}`;
            data: `0x${string}`;
        }[];
    }>;
    prepareAddAgentNameToOrgCalls(params: {
        agentAddress: `0x${string}`;
        orgName: string;
        agentName: string;
        agentUrl: string;
    }): Promise<{
        calls: {
            to: `0x${string}`;
            data: `0x${string}`;
        }[];
    }>;
    private isZeroAddress;
    getAddressFromENSName(ensName: string): Promise<`0x${string}` | null>;
    /**
     * Resolve a chain-scoped env var, falling back to the base name.
     * For example, with baseName 'AGENTIC_TRUST_ENS_PUBLIC_RESOLVER' and
     * chain.id=11155111, this checks:
     *  - AGENTIC_TRUST_ENS_PUBLIC_RESOLVER_SEPOLIA
     *  - AGENTIC_TRUST_ENS_PUBLIC_RESOLVER
     */
    private getChainScopedAddress;
    /** Decode ERC-7930-like agent identity hex string */
    private decodeAgentIdentity;
}
//# sourceMappingURL=AIAgentENSClient.d.ts.map