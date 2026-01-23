import type { AgentOperationPlan, CreateAgentPayload, UpdateAgentRegistrationPayload } from './types';
type FetchLike = typeof fetch;
export interface AgentClientConfig {
    basePath?: string;
    fetch?: FetchLike;
}
export type CreateAgentClientInput = CreateAgentPayload;
export type CreateAgentClientResult = AgentOperationPlan;
export declare function createAgent(input: CreateAgentClientInput, config?: AgentClientConfig): Promise<CreateAgentClientResult>;
export interface UpdateAgentRegistrationClientInput extends Omit<UpdateAgentRegistrationPayload, 'registration'> {
    registration: string | Record<string, unknown>;
}
export type UpdateAgentRegistrationClientResult = AgentOperationPlan;
export declare function updateAgentRegistration(input: UpdateAgentRegistrationClientInput, config?: AgentClientConfig): Promise<UpdateAgentRegistrationClientResult>;
export {};
//# sourceMappingURL=client.d.ts.map