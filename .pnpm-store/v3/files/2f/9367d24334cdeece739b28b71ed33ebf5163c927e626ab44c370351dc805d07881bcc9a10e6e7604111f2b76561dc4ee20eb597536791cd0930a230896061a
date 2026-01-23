import { ReputationClient as BaseReputationClient, AccountProvider, type TxRequest } from '@agentic-trust/8004-sdk';
import type { MetadataEntry } from '@agentic-trust/8004-sdk';
export interface GiveFeedbackParams {
    agent: string;
    score: number;
    feedback: string;
    metadata?: MetadataEntry[];
    tag1?: string;
    tag2?: string;
    feedbackHash?: string;
    feedbackUri?: string;
    agentId?: string;
    feedbackAuth?: string;
}
export interface AppendToFeedbackParams {
    agentId: string | number | bigint;
    clientAddress: `0x${string}`;
    feedbackIndex: string | number | bigint;
    responseUri?: string;
    responseHash?: `0x${string}`;
}
export declare class AIAgentReputationClient extends BaseReputationClient {
    private chain;
    private accountProvider;
    private ensRegistryAddress;
    private reputationAddress;
    private publicClient;
    constructor(accountProvider: AccountProvider, registrationRegistryAddress: `0x${string}`, identityRegistryAddress: `0x${string}`, ensRegistryAddress: `0x${string}`);
    getIdentityRegistry(): Promise<string>;
    getLastIndex(agentId: bigint, clientAddress: string): Promise<bigint>;
    createFeedbackAuth(agentId: bigint, clientAddress: string, indexLimit: bigint, expiry: bigint, chainId: bigint, signerAddress: string): any;
    signFeedbackAuth(auth: any): Promise<string>;
    static create(accountProvider: AccountProvider, identityRegistryAddress: `0x${string}`, registrationRegistryAddress: `0x${string}`, ensRegistryAddress: `0x${string}`): Promise<AIAgentReputationClient>;
    /**
     * Submit feedback for an agent
     * Spec: function giveFeedback(uint256 agentId, uint8 score, bytes32 tag1, bytes32 tag2, string calldata feedbackUri, bytes32 calldata feedbackHash, bytes memory feedbackAuth)
     *
     * @param params - Feedback parameters (score is MUST, others are OPTIONAL)
     * @returns Transaction result
     */
    giveClientFeedback(params: GiveFeedbackParams): Promise<{
        txHash: string;
    }>;
    /**
     * Prepare the giveFeedback transaction data without sending it.
     */
    prepareGiveFeedbackTx(params: GiveFeedbackParams): Promise<TxRequest>;
    /**
     * Append a response to an existing feedback entry for an agent.
     *
     * Wraps the ReputationRegistry `appendResponse(agentId, clientAddress, feedbackIndex, responseUri, responseHash)`
     * function using the same AccountProvider / ClientApp wiring as giveClientFeedback.
     */
    appendToFeedback(params: AppendToFeedbackParams): Promise<{
        txHash: string;
    }>;
    /**
     * Revoke a previously submitted feedback entry for an agent.
     *
     * This wraps the ReputationRegistry `revokeFeedback(uint256 tokenId, uint256 feedbackIndex)`
     * function using the same AccountProvider / ClientApp wiring as giveClientFeedback.
     */
    revokeFeedback(agentId: bigint, feedbackIndex: bigint): Promise<{
        txHash: string;
    }>;
}
//# sourceMappingURL=AIAgentReputationClient.d.ts.map