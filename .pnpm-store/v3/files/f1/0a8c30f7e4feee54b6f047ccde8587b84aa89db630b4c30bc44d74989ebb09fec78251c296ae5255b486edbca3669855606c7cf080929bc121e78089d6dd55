import { ethers } from 'ethers';
import { sepolia } from 'viem/chains';
import { ReputationClient as BaseReputationClient, } from '@agentic-trust/8004-sdk';
import ReputationRegistryABI from './abis/ReputationRegistry.json';
export class AIAgentReputationClient extends BaseReputationClient {
    chain;
    accountProvider;
    ensRegistryAddress;
    reputationAddress;
    publicClient = null;
    constructor(accountProvider, registrationRegistryAddress, identityRegistryAddress, ensRegistryAddress) {
        // For now, we still need to pass a BlockchainAdapter to BaseReputationClient
        // TODO: Update BaseReputationClient to use AccountProvider
        // We'll create a minimal adapter wrapper for compatibility
        const minimalAdapter = {
            call: async (to, abi, functionName, args) => {
                return accountProvider?.call({ to: to, abi, functionName, args });
            },
            send: async (to, abi, functionName, args) => {
                const data = await accountProvider?.encodeFunctionData({ abi, functionName, args: args || [] });
                if (data) {
                    const tx = { to: to, data };
                    const result = await accountProvider?.send(tx);
                    return { hash: result?.hash, txHash: result?.hash };
                }
                return { hash: undefined, txHash: undefined };
            },
            signMessage: async (message) => {
                return accountProvider?.signMessage(message);
            },
        };
        super(minimalAdapter, registrationRegistryAddress, identityRegistryAddress);
        this.chain = sepolia;
        this.accountProvider = accountProvider;
        this.reputationAddress = registrationRegistryAddress;
        this.ensRegistryAddress = ensRegistryAddress;
        // Try to extract publicClient from AccountProvider if it's a ViemAccountProvider
        const viemProvider = accountProvider;
        if (viemProvider.publicClient) {
            this.publicClient = viemProvider.publicClient;
        }
    }
    // Expose base-class methods so TypeScript recognizes them on this subclass
    getIdentityRegistry() {
        return BaseReputationClient.prototype.getIdentityRegistry.call(this);
    }
    getLastIndex(agentId, clientAddress) {
        return BaseReputationClient.prototype.getLastIndex.call(this, agentId, clientAddress);
    }
    createFeedbackAuth(agentId, clientAddress, indexLimit, expiry, chainId, signerAddress) {
        console.info("----------> createFeedbackAuth", agentId, clientAddress, indexLimit, expiry, chainId, signerAddress);
        return BaseReputationClient.prototype.createFeedbackAuth.call(this, agentId, clientAddress, indexLimit, expiry, chainId, signerAddress);
    }
    signFeedbackAuth(auth) {
        return BaseReputationClient.prototype.signFeedbackAuth.call(this, auth);
    }
    // Factory: resolve identityRegistry from reputation/registration registry before constructing
    static async create(accountProvider, identityRegistryAddress, registrationRegistryAddress, ensRegistryAddress) {
        return new AIAgentReputationClient(accountProvider, registrationRegistryAddress, identityRegistryAddress, ensRegistryAddress);
    }
    /**
     * Submit feedback for an agent
     * Spec: function giveFeedback(uint256 agentId, uint8 score, bytes32 tag1, bytes32 tag2, string calldata feedbackUri, bytes32 calldata feedbackHash, bytes memory feedbackAuth)
     *
     * @param params - Feedback parameters (score is MUST, others are OPTIONAL)
     * @returns Transaction result
     */
    async giveClientFeedback(params) {
        // Validate score is 0-100 (MUST per spec)
        if (params.score < 0 || params.score > 100) {
            throw new Error('Score MUST be between 0 and 100');
        }
        // Convert optional string parameters to bytes32 (or empty bytes32 if not provided)
        // Use ethers.id() to hash strings to bytes32 (keccak256), matching base ReputationClient behavior
        const tag1 = params.tag1 ? ethers.id(params.tag1).slice(0, 66) : ethers.ZeroHash;
        const tag2 = params.tag2 ? ethers.id(params.tag2).slice(0, 66) : ethers.ZeroHash;
        const feedbackHash = params.feedbackHash || ethers.ZeroHash;
        const feedbackUri = params.feedbackUri || '';
        // Convert agentId to bigint (contract expects uint256)
        if (!params.agentId) {
            throw new Error('agentId is required');
        }
        const agentId = BigInt(params.agentId);
        console.info("params.feedbackAuth", JSON.stringify(params.feedbackAuth, null, 2));
        console.info("this.reputationAddress", this.reputationAddress);
        console.info("agentId", agentId.toString());
        console.info("score", params.score);
        console.info("tag1", tag1);
        console.info("tag2", tag2);
        console.info("feedbackUri", feedbackUri);
        console.info("feedbackHash", feedbackHash);
        // Encode function data using AccountProvider
        const data = await this.accountProvider?.encodeFunctionData({
            abi: ReputationRegistryABI,
            functionName: 'giveFeedback',
            args: [
                agentId,
                params.score,
                tag1,
                tag2,
                feedbackUri,
                feedbackHash,
                params.feedbackAuth,
            ],
        });
        // Send transaction using AccountProvider
        const tx = {
            to: this.reputationAddress,
            data: data || '0x',
            value: 0n,
        };
        const result = await this.accountProvider?.send(tx, {
            simulation: true,
        });
        return { txHash: result?.hash || '' };
    }
    /**
     * Prepare the giveFeedback transaction data without sending it.
     */
    async prepareGiveFeedbackTx(params) {
        if (params.score < 0 || params.score > 100) {
            throw new Error('Score MUST be between 0 and 100');
        }
        if (!params.agentId) {
            throw new Error('agentId is required');
        }
        if (!params.feedbackAuth) {
            throw new Error('feedbackAuth is required');
        }
        const tag1 = params.tag1
            ? ethers.id(params.tag1).slice(0, 66)
            : ethers.ZeroHash;
        const tag2 = params.tag2
            ? ethers.id(params.tag2).slice(0, 66)
            : ethers.ZeroHash;
        const feedbackHash = params.feedbackHash || ethers.ZeroHash;
        const feedbackUri = params.feedbackUri || '';
        const agentId = BigInt(params.agentId);
        const data = await this.accountProvider?.encodeFunctionData({
            abi: ReputationRegistryABI,
            functionName: 'giveFeedback',
            args: [
                agentId,
                params.score,
                tag1,
                tag2,
                feedbackUri,
                feedbackHash,
                params.feedbackAuth,
            ],
        });
        return {
            to: this.reputationAddress,
            data: data || '0x',
            value: 0n,
        };
    }
    /**
     * Append a response to an existing feedback entry for an agent.
     *
     * Wraps the ReputationRegistry `appendResponse(agentId, clientAddress, feedbackIndex, responseUri, responseHash)`
     * function using the same AccountProvider / ClientApp wiring as giveClientFeedback.
     */
    async appendToFeedback(params) {
        const agentId = BigInt(params.agentId);
        const feedbackIndex = BigInt(params.feedbackIndex);
        const responseUri = params.responseUri || '';
        const responseHash = params.responseHash && params.responseHash.length === 66
            ? params.responseHash
            : ethers.ZeroHash;
        const data = await this.accountProvider?.encodeFunctionData({
            abi: ReputationRegistryABI,
            functionName: 'appendResponse',
            args: [agentId, params.clientAddress, feedbackIndex, responseUri, responseHash],
        });
        const tx = {
            to: this.reputationAddress,
            data: data || '0x',
            value: 0n,
        };
        const result = await this.accountProvider?.send(tx, {
            simulation: true,
        });
        return { txHash: result?.hash || '' };
    }
    /**
     * Revoke a previously submitted feedback entry for an agent.
     *
     * This wraps the ReputationRegistry `revokeFeedback(uint256 tokenId, uint256 feedbackIndex)`
     * function using the same AccountProvider / ClientApp wiring as giveClientFeedback.
     */
    async revokeFeedback(agentId, feedbackIndex) {
        const data = await this.accountProvider?.encodeFunctionData({
            abi: ReputationRegistryABI,
            functionName: 'revokeFeedback',
            args: [agentId, feedbackIndex],
        });
        const tx = {
            to: this.reputationAddress,
            data: data || '0x',
            value: 0n,
        };
        const result = await this.accountProvider?.send(tx, {
            simulation: true,
        });
        return { txHash: result?.hash || '' };
    }
}
//# sourceMappingURL=AIAgentReputationClient.js.map