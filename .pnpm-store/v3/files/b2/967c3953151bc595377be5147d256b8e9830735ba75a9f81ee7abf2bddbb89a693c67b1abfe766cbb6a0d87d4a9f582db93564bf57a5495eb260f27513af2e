/**
 * Validation Client for ERC-8004
 * Handles validation requests and responses
 */
import type { Address } from 'viem';
import { BlockchainAdapter } from './adapters/types';
import { ValidationStatus } from './types';
export interface ValidationRequestParams {
    validatorAddress: string;
    agentId: bigint;
    requestUri: string;
    requestHash: string;
}
export interface ValidationResponseParams {
    requestHash: string;
    response: number;
    responseUri?: string;
    responseHash?: string;
    tag?: string;
}
export declare class ValidationClient {
    private adapter;
    private contractAddress;
    constructor(adapter: BlockchainAdapter, contractAddress: string | Address);
    /**
     * Request validation from a validator
     * Spec: function validationRequest(address validatorAddress, uint256 agentId, string requestUri, bytes32 requestHash)
     * Note: MUST be called by owner or operator of agentId
     * Note: requestHash MUST be keccak256 of the content at requestUri
     *
     * @param params - Validation request parameters
     * @returns Transaction result with requestHash
     */
    validationRequest(params: ValidationRequestParams): Promise<{
        txHash: string;
        requestHash: string;
    }>;
    /**
     * Provide a validation response
     * Spec: function validationResponse(bytes32 requestHash, uint8 response, string responseUri, bytes32 responseHash, bytes32 tag)
     * Note: MUST be called by the validatorAddress specified in the original request
     * Note: Can be called multiple times for the same requestHash
     *
     * @param params - Validation response parameters
     * @returns Transaction result
     */
    validationResponse(params: ValidationResponseParams): Promise<{
        txHash: string;
    }>;
    /**
     * Get the identity registry address
     * Spec: function getIdentityRegistry() external view returns (address identityRegistry)
     */
    getIdentityRegistry(): Promise<string>;
    /**
     * Get validation status for a request
     * Spec (new): function getValidationStatus(bytes32 requestHash) returns (address validatorAddress, uint256 agentId, uint8 response, bytes32 responseHash, bytes32 tag, uint256 lastUpdate)
     * Spec (old): function getValidationStatus(bytes32 requestHash) returns (address validatorAddress, uint256 agentId, uint8 response, bytes32 tag, uint256 lastUpdate)
     * Note: Backward compatible with both old and new contract versions
     *
     * @param requestHash - The request hash (bytes32)
     * @returns Validation status
     */
    getValidationStatus(requestHash: string): Promise<ValidationStatus>;
    /**
     * Get validation summary for an agent
     * Spec: function getSummary(uint256 agentId, address[] validatorAddresses, bytes32 tag) returns (uint64 count, uint8 avgResponse)
     * Note: agentId is ONLY mandatory parameter, validatorAddresses and tag are OPTIONAL filters
     *
     * @param agentId - The agent ID (MANDATORY)
     * @param validatorAddresses - OPTIONAL filter by specific validators
     * @param tag - OPTIONAL filter by tag
     * @returns Summary statistics
     */
    getSummary(agentId: bigint, validatorAddresses?: string[], tag?: string): Promise<{
        count: bigint;
        avgResponse: number;
    }>;
    /**
     * Get all validation request hashes for an agent
     * Spec: function getAgentValidations(uint256 agentId) returns (bytes32[] requestHashes)
     *
     * @param agentId - The agent ID
     * @returns Array of request hashes
     */
    getAgentValidations(agentId: bigint): Promise<string[]>;
    /**
     * Get all request hashes for a validator
     * Spec: function getValidatorRequests(address validatorAddress) returns (bytes32[] requestHashes)
     *
     * @param validatorAddress - The validator address
     * @returns Array of request hashes
     */
    getValidatorRequests(validatorAddress: string): Promise<string[]>;
}
//# sourceMappingURL=ValidationClient.d.ts.map