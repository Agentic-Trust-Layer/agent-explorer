import { type AgentApiContext } from './core';
type ExpressRequestLike = {
    body?: unknown;
    params?: Record<string, string | undefined>;
    query?: Record<string, unknown>;
    url?: string;
    [key: string]: unknown;
};
type ExpressResponseLike = {
    status: (code: number) => ExpressResponseLike;
    json: (body: unknown) => ExpressResponseLike | void;
};
type ExpressRouterLike = {
    post: (path: string, handler: (req: ExpressRequestLike, res: ExpressResponseLike) => unknown) => unknown;
    get: (path: string, handler: (req: ExpressRequestLike, res: ExpressResponseLike) => unknown) => unknown;
    put: (path: string, handler: (req: ExpressRequestLike, res: ExpressResponseLike) => unknown) => unknown;
};
export type CreateContextFromExpress = (req: ExpressRequestLike) => AgentApiContext;
export declare function createAgentExpressHandler(getContext?: CreateContextFromExpress): (req: ExpressRequestLike, res: ExpressResponseLike) => Promise<void>;
export declare function updateAgentRegistrationExpressHandler(getContext?: CreateContextFromExpress): (req: ExpressRequestLike, res: ExpressResponseLike) => Promise<void>;
export declare function requestFeedbackAuthExpressHandler(getContext?: CreateContextFromExpress): (req: ExpressRequestLike, res: ExpressResponseLike) => Promise<void>;
export declare function prepareFeedbackExpressHandler(getContext?: CreateContextFromExpress): (req: ExpressRequestLike, res: ExpressResponseLike) => Promise<void>;
export declare function getFeedbackExpressHandler(getContext?: CreateContextFromExpress): (req: ExpressRequestLike, res: ExpressResponseLike) => Promise<void>;
export interface MountAgentRoutesOptions {
    basePath?: string;
    createContext?: CreateContextFromExpress;
}
export declare function mountAgentRoutes(router: ExpressRouterLike, options?: MountAgentRoutesOptions): void;
export {};
//# sourceMappingURL=express.d.ts.map