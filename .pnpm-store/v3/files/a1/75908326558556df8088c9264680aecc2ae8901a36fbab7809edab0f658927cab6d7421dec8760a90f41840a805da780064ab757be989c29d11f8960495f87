/**
 * Reputation Client for ERC-8004
 * Handles feedback submission and reputation queries
 */
import { BlockchainAdapter } from './adapters/types';
import { FeedbackAuth } from './types';
export interface GiveFeedbackParams {
    agentId: bigint;
    score: number;
    tag1?: string;
    tag2?: string;
    feedbackUri?: string;
    feedbackHash?: string;
    feedbackAuth: string;
}
import type { Address } from 'viem';
export declare class ReputationClient {
    private adapter;
    private contractAddress;
    private identityRegistryAddress;
    constructor(adapter: BlockchainAdapter, contractAddress: string | Address, identityRegistryAddress: string | Address);
    /**
     * Create a feedbackAuth structure to be signed
     * Spec: tuple (agentId, clientAddress, indexLimit, expiry, chainId, identityRegistry, signerAddress)
     *
     * @param agentId - The agent ID
     * @param clientAddress - Address authorized to give feedback
     * @param indexLimit - Must be > last feedback index from this client (typically lastIndex + 1)
     * @param expiry - Unix timestamp when authorization expires
     * @param chainId - Chain ID where feedback will be submitted
     * @param signerAddress - Address of the signer (agent owner/operator)
     */
    createFeedbackAuth(agentId: bigint, clientAddress: string, indexLimit: bigint, expiry: bigint, chainId: bigint, signerAddress: string): FeedbackAuth;
    /**
     * Sign a feedbackAuth using EIP-191
     * The agent owner/operator signs to authorize a client to give feedback
     *
     * @param auth - The feedbackAuth structure
     * @returns Signed authorization as bytes (encoded tuple + signature)
     */
    signFeedbackAuth(auth: FeedbackAuth): Promise<string>;
    /**
     * Submit feedback for an agent
     * Spec: function giveFeedback(uint256 agentId, uint8 score, bytes32 tag1, bytes32 tag2, string calldata feedbackUri, bytes32 calldata feedbackHash, bytes memory feedbackAuth)
     *
     * @param params - Feedback parameters (score is MUST, others are OPTIONAL)
     * @returns Transaction result
     */
    giveFeedback(params: GiveFeedbackParams): Promise<{
        txHash: string;
    }>;
    /**
     * Revoke previously submitted feedback
     * Spec: function revokeFeedback(uint256 agentId, uint64 feedbackIndex)
     *
     * @param agentId - The agent ID
     * @param feedbackIndex - Index of feedback to revoke
     */
    revokeFeedback(agentId: bigint, feedbackIndex: bigint): Promise<{
        txHash: string;
    }>;
    /**
     * Append a response to existing feedback
     * Spec: function appendResponse(uint256 agentId, address clientAddress, uint64 feedbackIndex, string calldata responseUri, bytes32 calldata responseHash)
     *
     * @param agentId - The agent ID
     * @param clientAddress - Client who gave the feedback
     * @param feedbackIndex - Index of the feedback
     * @param responseUri - URI to response content
     * @param responseHash - OPTIONAL hash of response content (KECCAK-256)
     */
    appendResponse(agentId: bigint, clientAddress: string, feedbackIndex: bigint, responseUri: string, responseHash?: string): Promise<{
        txHash: string;
    }>;
    /**
     * Get the identity registry address
     * Spec: function getIdentityRegistry() external view returns (address identityRegistry)
     */
    getIdentityRegistry(): Promise<string>;
    /**
     * Get reputation summary for an agent
     * Spec: function getSummary(uint256 agentId, address[] calldata clientAddresses, bytes32 tag1, bytes32 tag2) returns (uint64 count, uint8 averageScore)
     * Note: agentId is ONLY mandatory parameter, others are OPTIONAL filters
     *
     * @param agentId - The agent ID (MANDATORY)
     * @param clientAddresses - OPTIONAL filter by specific clients
     * @param tag1 - OPTIONAL filter by tag1
     * @param tag2 - OPTIONAL filter by tag2
     */
    getSummary(agentId: bigint, clientAddresses?: string[], tag1?: string, tag2?: string): Promise<{
        count: bigint;
        averageScore: number;
    }>;
    /**
     * Read a specific feedback entry
     * Spec: function readFeedback(uint256 agentId, address clientAddress, uint64 index) returns (uint8 score, bytes32 tag1, bytes32 tag2, bool isRevoked)
     *
     * @param agentId - The agent ID
     * @param clientAddress - Client who gave feedback
     * @param index - Feedback index
     */
    readFeedback(agentId: bigint, clientAddress: string, index: bigint): Promise<{
        score: number;
        tag1: string;
        tag2: string;
        isRevoked: boolean;
    }>;
    /**
     * Read all feedback for an agent with optional filters
     * Spec: function readAllFeedback(uint256 agentId, address[] calldata clientAddresses, bytes32 tag1, bytes32 tag2, bool includeRevoked) returns arrays
     * Note: agentId is ONLY mandatory parameter
     *
     * @param agentId - The agent ID (MANDATORY)
     * @param clientAddresses - OPTIONAL filter by clients
     * @param tag1 - OPTIONAL filter by tag1
     * @param tag2 - OPTIONAL filter by tag2
     * @param includeRevoked - OPTIONAL include revoked feedback
     */
    readAllFeedback(agentId: bigint, clientAddresses?: string[], tag1?: string, tag2?: string, includeRevoked?: boolean): Promise<{
        clientAddresses: string[];
        scores: number[];
        tag1s: string[];
        tag2s: string[];
        revokedStatuses: boolean[];
    }>;
    /**
     * Get response count for a feedback entry
     * Spec: function getResponseCount(uint256 agentId, address clientAddress, uint64 feedbackIndex, address[] responders) returns (uint64)
     * Note: agentId is ONLY mandatory parameter
     */
    getResponseCount(agentId: bigint, clientAddress?: string, feedbackIndex?: bigint, responders?: string[]): Promise<bigint>;
    /**
     * Get all clients who have given feedback to an agent
     * Spec: function getClients(uint256 agentId) returns (address[] memory)
     */
    getClients(agentId: bigint): Promise<string[]>;
    /**
     * Get the last feedback index from a client for an agent
     * Spec: function getLastIndex(uint256 agentId, address clientAddress) returns (uint64)
     *
     * @param agentId - The agent ID
     * @param clientAddress - Client address
     * @returns Last feedback index (0 if no feedback yet)
     */
    getLastIndex(agentId: bigint, clientAddress: string): Promise<bigint>;
}
//# sourceMappingURL=ReputationClient.d.ts.map