type ExpressRequestLike = {
    body?: unknown;
    [key: string]: unknown;
};
type ExpressResponseLike = {
    status: (code: number) => ExpressResponseLike;
    json: (body: unknown) => ExpressResponseLike | void;
};
import { type DirectAgentApiContext } from './directServer';
import type { AgentOperationMode } from './types';
export type CreateDirectContextFromExpress = (req: ExpressRequestLike) => DirectAgentApiContext;
export declare function createAgentDirectExpressHandler(defaultMode?: AgentOperationMode, getContext?: CreateDirectContextFromExpress): (req: ExpressRequestLike, res: ExpressResponseLike) => Promise<void>;
export {};
//# sourceMappingURL=directExpress.d.ts.map