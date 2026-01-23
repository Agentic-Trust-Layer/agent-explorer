/**
 * ENS Client Singleton
 *
 * Manages a singleton instance of AIAgentENSClient
 * Initialized from environment variables using AccountProvider
 */
import { AIAgentENSClient } from '@agentic-trust/8004-ext-sdk';
/**
 * Get or create the AIAgentENSClient singleton
 * Initializes from environment variables using AccountProvider from AdminApp, ClientApp, or ProviderApp
 */
export declare function getENSClient(chainId?: number): Promise<AIAgentENSClient>;
/**
 * Check if ENS client is initialized for a specific chain
 */
export declare function isENSClientInitialized(chainId?: number): boolean;
/**
 * Reset the ENS client instance for a specific chain (useful for testing)
 */
export declare function resetENSClient(chainId?: number): void;
/**
 * Check if an ENS name is available
 *
 * @param agentName - The agent name (e.g., "my-agent")
 * @param orgName - The organization name (e.g., "8004-agent" or "8004-agent.eth")
 * @returns true if the ENS name is available, false if it's taken, null if check failed
 */
/**
 * Check if an ENS name is available (general purpose)
 *
 * @param ensName - Full ENS name (e.g., "agentname.orgname.eth" or "orgname.eth")
 * @param chainId - Chain ID where the ENS name should be checked
 * @returns true if the ENS name is available, false if it's taken, null if check failed
 */
export declare function isENSNameAvailable(ensName: string, chainId?: number): Promise<boolean | null>;
/**
 * Check if an ENS name is available (legacy method for backward compatibility)
 *
 * @param orgName - The organization name (e.g., "8004-agent" or "8004-agent.eth")
 * @param agentName - The agent name (e.g., "my-agent")
 * @param chainId - Chain ID where the ENS name should be checked
 * @returns true if the ENS name is available, false if it's taken, null if check failed
 */
export declare function isENSAvailable(orgName: string, agentName: string, chainId?: number): Promise<boolean | null>;
/**
 * Get comprehensive ENS name info in one call.
 * Returns account/address, image/avatar, url, description, and availability.
 */
export declare function getENSInfo(ensName: string, chainId?: number): Promise<{
    name: string;
    chainId?: number;
    available: boolean | null;
    account: `0x${string}` | string | null;
    image: string | null;
    url: string | null;
    description: string | null;
}>;
export declare function sendSponsoredUserOperation(params: {
    bundlerUrl: string;
    chain: any;
    accountClient: any;
    calls: {
        to: `0x${string}`;
        data?: `0x${string}`;
        value?: bigint;
    }[];
}): Promise<`0x${string}`>;
/**
 * Create an ENS subdomain name for an agent
 *
 * @param agentName - The agent name (e.g., "my-agent")
 * @param orgName - The organization name (e.g., "8004-agent" or "8004-agent.eth")
 * @param agentAddress - The agent's account address (0x...)
 * @param agentUrl - Optional agent URL to set in ENS text record
 * @param accountProvider - Optional AccountProvider to use (if not provided, will try to get from AdminApp/ClientApp/ProviderApp)
 * @returns Array of transaction hashes for the ENS creation transactions
 * @throws Error if ENS creation fails
 */
export interface AddAgentToOrgL1Params {
    agentName: string;
    orgName: string;
    agentAddress: `0x${string}`;
    agentUrl?: string;
    chainId?: number;
}
export interface AddAgentToOrgL1Result {
    calls: {
        to: `0x${string}`;
        data: `0x${string}`;
        value?: bigint;
    }[];
}
export interface AddAgentToOrgL2Params {
    agentName: string;
    orgName: string;
    agentAddress: `0x${string}`;
    agentUrl?: string;
    chainId?: number;
}
export interface AddAgentToOrgL2Result {
    calls: {
        to: `0x${string}`;
        data: `0x${string}`;
        value?: bigint;
    }[];
}
export interface PrepareL1AgentNameInfoParams {
    agentAddress: `0x${string}`;
    orgName: string;
    agentName: string;
    agentUrl?: string;
    agentDescription?: string;
    chainId?: number;
}
export interface PrepareL1AgentNameInfoResult {
    calls: {
        to: `0x${string}`;
        data: `0x${string}`;
        value?: bigint;
    }[];
}
export interface PrepareL2AgentNameInfoParams {
    agentAddress: `0x${string}`;
    orgName: string;
    agentName: string;
    agentUrl?: string;
    agentDescription?: string;
    agentImage?: string;
    chainId?: number;
}
export interface PrepareL2AgentNameInfoResult {
    calls: {
        to: `0x${string}`;
        data: `0x${string}`;
        value?: bigint;
    }[];
}
export declare function addAgentNameToL1Org(params: AddAgentToOrgL1Params): Promise<string>;
export declare function prepareL1AgentNameInfoCalls(params: PrepareL1AgentNameInfoParams): Promise<PrepareL1AgentNameInfoResult>;
export declare function addAgentNameToL2Org(params: PrepareL2AgentNameInfoParams): Promise<PrepareL1AgentNameInfoResult>;
export declare function prepareL2AgentNameInfoCalls(params: PrepareL2AgentNameInfoParams): Promise<PrepareL2AgentNameInfoResult>;
//# sourceMappingURL=ensClient.d.ts.map