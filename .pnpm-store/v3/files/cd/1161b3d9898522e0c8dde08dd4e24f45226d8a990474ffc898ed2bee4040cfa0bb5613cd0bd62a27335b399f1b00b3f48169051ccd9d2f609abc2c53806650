/**
 * Identity Client for ERC-8004
 * Handles agent registration and identity management
 */
import { BlockchainAdapter } from './adapters/types';
import { MetadataEntry, AgentRegistrationFile } from './types';
import type { Address } from 'viem';
export declare class IdentityClient {
    private adapter;
    private contractAddress;
    constructor(adapter: BlockchainAdapter, contractAddress: string | Address);
    /**
     * Register a new agent with no URI (URI can be set later)
     * Spec: function register() returns (uint256 agentId)
     */
    register(): Promise<{
        agentId: bigint;
        txHash: string;
    }>;
    /**
     * Register a new agent with a token URI
     * Spec: function register(string tokenURI) returns (uint256 agentId)
     * @param tokenUri - URI pointing to agent registration file (MAY use ipfs://, https://, etc.)
     */
    registerWithURI(tokenUri: string): Promise<{
        agentId: bigint;
        txHash: string;
    }>;
    /**
     * Register a new agent with URI and optional on-chain metadata
     * Spec: function register(string tokenURI, MetadataEntry[] calldata metadata) returns (uint256 agentId)
     * @param tokenUri - URI pointing to agent registration file
     * @param metadata - OPTIONAL on-chain metadata entries
     */
    registerWithMetadata(tokenUri: string, metadata?: MetadataEntry[]): Promise<{
        agentId: bigint;
        txHash: string;
    }>;
    /**
     * Get the token URI for an agent
     * Spec: Standard ERC-721 tokenURI function
     * @param agentId - The agent's ID
     * @returns URI string (MAY be ipfs://, https://, etc.)
     */
    getTokenURI(agentId: bigint): Promise<string>;
    /**
     * Set the token URI for an agent
     * Note: This is an implementation-specific extension (not in base spec).
     * Assumes implementation exposes setAgentUri with owner/operator checks.
     * @param agentId - The agent's ID
     * @param uri - New URI string
     */
    setAgentUri(agentId: bigint, uri: string): Promise<{
        txHash: string;
    }>;
    /**
     * Get the owner of an agent
     * Spec: Standard ERC-721 ownerOf function
     * @param agentId - The agent's ID
     */
    getOwner(agentId: bigint): Promise<string>;
    /**
     * Get on-chain metadata for an agent
     * Spec: function getMetadata(uint256 agentId, string key) returns (bytes)
     * @param agentId - The agent's ID
     * @param key - Metadata key
     */
    getMetadata(agentId: bigint, key: string): Promise<string>;
    /**
     * Set on-chain metadata for an agent
     * Spec: function setMetadata(uint256 agentId, string key, bytes value)
     * @param agentId - The agent's ID
     * @param key - Metadata key
     * @param value - Metadata value
     */
    setMetadata(agentId: bigint, key: string, value: string): Promise<{
        txHash: string;
    }>;
    /**
     * Fetch and parse the agent registration file from the token URI
     * This is a convenience function that fetches the URI and parses it
     * Note: Does not validate - spec says ERC-8004 cannot cryptographically guarantee
     * that advertised capabilities are functional
     * @param agentId - The agent's ID
     */
    getRegistrationFile(agentId: bigint): Promise<AgentRegistrationFile>;
    /**
     * Helper: Extract agentId from transaction receipt
     * Looks for the Registered event which contains the agentId
     */
    private extractAgentIdFromReceipt;
    /**
     * Helper: Convert string to bytes (adapter-agnostic)
     */
    private stringToBytes;
    /**
     * Helper: Convert bytes to string (adapter-agnostic)
     */
    private bytesToString;
    /**
     * Helper: Convert Uint8Array to hex string (for viem compatibility)
     */
    private bytesToHex;
}
//# sourceMappingURL=IdentityClient.d.ts.map