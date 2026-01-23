/**
 * Reusable API-layer helper for agent discovery suitable for Next.js route handlers.
 * Parses common search options and maps core Agent objects into a flat JSON
 * payload that UIs can consume directly.
 */
import type { ListAgentsResponse, DiscoverAgentsOptions, DiscoverParams } from './agents';
import type { AgentInfo } from '../models/agentInfo';
type AgenticTrustClient = {
    searchAgents: (options?: DiscoverAgentsOptions | string) => Promise<ListAgentsResponse>;
};
export type DiscoverRequest = {
    page?: number;
    pageSize?: number;
    query?: string;
    params?: DiscoverParams;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
};
export type Agent = AgentInfo;
export type DiscoverResponse = {
    agents: Agent[];
    total: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
};
/**
 * Execute an agents search via the core client and map to a flat API payload.
 *
 * @param req Parsed discovery parameters (page/pageSize/query/params/order*)
 * @param getClient Function returning an initialized AgenticTrustClient (app-specific)
 */
export declare function discoverAgents(req: DiscoverRequest, getClient: () => Promise<AgenticTrustClient>): Promise<DiscoverResponse>;
export {};
//# sourceMappingURL=discover.d.ts.map