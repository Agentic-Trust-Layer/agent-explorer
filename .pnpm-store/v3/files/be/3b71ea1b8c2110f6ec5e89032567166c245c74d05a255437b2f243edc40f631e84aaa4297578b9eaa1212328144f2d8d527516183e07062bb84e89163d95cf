import type { AgenticTrustClient } from '../../server/singletons/agenticTrustClient';
import { type AgentOperationPlan, type CreateAgentPayload, type UpdateAgentRegistrationPayload, type RequestFeedbackAuthPayload, type RequestFeedbackAuthResult, type PrepareFeedbackPayload, type PrepareValidationRequestPayload, type DirectFeedbackPayload } from './types';
export declare class AgentApiError extends Error {
    status: number;
    details?: unknown | undefined;
    constructor(message: string, status?: number, details?: unknown | undefined);
}
export interface AgentApiContext {
    tenantId?: string;
    requestId?: string;
    /**
     * Optional override for providing a pre-configured AgenticTrustClient.
     * Falls back to the shared singleton if not provided.
     */
    getClient?: () => Promise<AgenticTrustClient>;
}
export declare function createAgentCore(ctx: AgentApiContext | undefined, input: CreateAgentPayload): Promise<AgentOperationPlan>;
export declare function updateAgentRegistrationCore(ctx: AgentApiContext | undefined, input: UpdateAgentRegistrationPayload): Promise<AgentOperationPlan>;
export declare function requestFeedbackAuthCore(ctx: AgentApiContext | undefined, input: RequestFeedbackAuthPayload): Promise<RequestFeedbackAuthResult>;
export declare function prepareFeedbackCore(ctx: AgentApiContext | undefined, input: PrepareFeedbackPayload): Promise<AgentOperationPlan>;
export declare function prepareValidationRequestCore(ctx: AgentApiContext | undefined, input: PrepareValidationRequestPayload): Promise<AgentOperationPlan>;
export interface GetFeedbackInput {
    did8004: string;
    includeRevoked?: boolean;
    limit?: number;
    offset?: number;
}
export interface GetFeedbackResult {
    feedback: unknown;
    summary: unknown;
}
export declare function getFeedbackCore(ctx: AgentApiContext | undefined, input: GetFeedbackInput): Promise<GetFeedbackResult>;
export interface DirectFeedbackResult {
    success: true;
    txHash: string;
}
export declare function submitFeedbackDirectCore(ctx: AgentApiContext | undefined, input: DirectFeedbackPayload): Promise<DirectFeedbackResult>;
//# sourceMappingURL=core.d.ts.map