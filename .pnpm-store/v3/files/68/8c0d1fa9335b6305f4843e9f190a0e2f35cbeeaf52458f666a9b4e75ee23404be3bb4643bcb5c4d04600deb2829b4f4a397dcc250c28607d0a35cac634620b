import { type AgentApiContext } from './core';
type RouteParams = Record<string, string | string[] | undefined>;
export type CreateContextFromNext = (req: Request) => AgentApiContext;
export declare function createAgentRouteHandler(createContext?: CreateContextFromNext): (req: Request) => Promise<any>;
export declare function updateAgentRegistrationRouteHandler(createContext?: CreateContextFromNext): (req: Request, context: {
    params: RouteParams;
}) => Promise<any>;
export declare function requestFeedbackAuthRouteHandler(createContext?: CreateContextFromNext): (req: Request, context?: {
    params?: RouteParams;
}) => Promise<any>;
export declare function prepareFeedbackRouteHandler(createContext?: CreateContextFromNext): (req: Request, context: {
    params: RouteParams;
}) => Promise<any>;
export declare function prepareValidationRequestRouteHandler(createContext?: CreateContextFromNext): (req: Request, context: {
    params: RouteParams;
}) => Promise<any>;
export declare function getFeedbackRouteHandler(createContext?: CreateContextFromNext): (req: Request, context: {
    params: RouteParams;
}) => Promise<any>;
export declare function directFeedbackRouteHandler(createContext?: CreateContextFromNext): (req: Request, context: {
    params: RouteParams;
}) => Promise<any>;
export declare function getValidationsRouteHandler(createContext?: CreateContextFromNext): (req: Request, context: {
    params: RouteParams;
}) => Promise<any>;
export {};
//# sourceMappingURL=next.d.ts.map