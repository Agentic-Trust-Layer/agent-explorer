/**
 * Agentic Trust SDK - Validation Client
 * Extends the base ERC-8004 ValidationClient with AccountProvider support.
 * Uses AccountProvider (Ports & Adapters pattern) for chain I/O.
 */
import { sepolia } from 'viem/chains';
import { keccak256, stringToHex } from 'viem';
import { ValidationClient as BaseValidationClient, } from '@agentic-trust/8004-sdk';
import ValidationRegistryABI from './abis/ValidationRegistry.json';
export class AIAgentValidationClient extends BaseValidationClient {
    chain;
    accountProvider;
    validationRegistryAddress;
    constructor(accountProvider, validationRegistryAddress) {
        // Minimal adapter wrapper using AccountProvider for BaseValidationClient compatibility
        const minimalAdapter = {
            call: async (to, abi, functionName, args) => {
                return accountProvider?.call({ to: to, abi, functionName, args });
            },
            send: async (to, abi, functionName, args) => {
                const data = await accountProvider?.encodeFunctionData({
                    abi,
                    functionName,
                    args: args || [],
                });
                if (data) {
                    const tx = { to: to, data };
                    const result = await accountProvider?.send(tx);
                    return { hash: result?.hash, txHash: result?.hash };
                }
                return { hash: undefined, txHash: undefined };
            },
        };
        super(minimalAdapter, validationRegistryAddress);
        this.chain = sepolia;
        this.accountProvider = accountProvider;
        this.validationRegistryAddress = validationRegistryAddress;
    }
    // Factory helper to mirror AIAgentReputationClient.create-style API
    static async create(accountProvider, validationRegistryAddress) {
        return new AIAgentValidationClient(accountProvider, validationRegistryAddress);
    }
    // Re-expose base-class methods for TypeScript consumers
    getIdentityRegistry() {
        return BaseValidationClient.prototype.getIdentityRegistry.call(this);
    }
    getAgentValidations(agentId) {
        return BaseValidationClient.prototype.getAgentValidations.call(this, agentId);
    }
    getValidatorRequests(validatorAddress) {
        return BaseValidationClient.prototype.getValidatorRequests.call(this, validatorAddress);
    }
    getValidationStatus(requestHash) {
        return BaseValidationClient.prototype.getValidationStatus.call(this, requestHash);
    }
    getSummary(agentId, validatorAddresses, tag) {
        return BaseValidationClient.prototype.getSummary.call(this, agentId, validatorAddresses, tag);
    }
    validationRequest(params) {
        return BaseValidationClient.prototype.validationRequest.call(this, params);
    }
    validationResponse(params) {
        return BaseValidationClient.prototype.validationResponse.call(this, params);
    }
    /**
     * Prepare the validationRequest transaction data without sending it.
     * Requires the validator account address to be provided (computed server-side).
     */
    async prepareValidationRequestTx(params) {
        if (!params.agentId) {
            throw new Error('agentId is required');
        }
        if (!params.validatorAddress) {
            throw new Error('validatorAddress is required');
        }
        // Prepare validation request parameters
        const agentIdBigInt = typeof params.agentId === 'bigint'
            ? params.agentId
            : BigInt(params.agentId.toString());
        const finalRequestUri = params.requestUri || `https://agentic-trust.org/validation/${params.agentId}`;
        const finalRequestHash = params.requestHash || keccak256(stringToHex(finalRequestUri));
        // Encode the validation request call
        const data = await this.accountProvider?.encodeFunctionData({
            abi: ValidationRegistryABI,
            functionName: 'validationRequest',
            args: [params.validatorAddress, agentIdBigInt, finalRequestUri, finalRequestHash],
        });
        return {
            txRequest: {
                to: this.validationRegistryAddress,
                data: data || '0x',
                value: 0n,
            },
            requestHash: finalRequestHash,
        };
    }
    /**
     * Prepare the validationResponse transaction data without sending it.
     * This encodes the transaction that can be sent via a bundler using account abstraction.
     */
    async prepareValidationResponseTx(params) {
        if (params.response < 0 || params.response > 100) {
            throw new Error('Response MUST be between 0 and 100');
        }
        // Convert optional parameters to proper format (matching BaseValidationClient logic)
        const { ethers } = await import('ethers');
        const responseUri = params.responseUri || '';
        const responseHash = params.responseHash || ethers.ZeroHash;
        const tag = params.tag ? ethers.id(params.tag).slice(0, 66) : ethers.ZeroHash;
        // Encode the validation response call
        const data = await this.accountProvider?.encodeFunctionData({
            abi: ValidationRegistryABI,
            functionName: 'validationResponse',
            args: [params.requestHash, params.response, responseUri, responseHash, tag],
        });
        return {
            to: this.validationRegistryAddress,
            data: data || '0x',
            value: 0n,
        };
    }
}
//# sourceMappingURL=AIAgentValidationClient.js.map