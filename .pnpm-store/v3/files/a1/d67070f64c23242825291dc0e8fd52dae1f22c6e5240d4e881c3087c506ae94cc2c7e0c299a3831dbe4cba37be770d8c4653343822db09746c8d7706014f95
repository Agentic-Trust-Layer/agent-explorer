import { AgentApiError, createAgentCore, updateAgentRegistrationCore, requestFeedbackAuthCore, prepareFeedbackCore, getFeedbackCore, } from './core';
import { parseDid8004 } from '../../shared/did8004';
const defaultContextFactory = () => ({});
function sendJson(res, status, payload) {
    res.status(status).json(payload);
}
function handleExpressError(res, error) {
    if (error instanceof AgentApiError) {
        sendJson(res, error.status ?? 400, {
            error: error.message,
            details: error.details,
        });
        return;
    }
    console.error('[AgenticTrust][Express] Unexpected error:', error);
    sendJson(res, 500, {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
    });
}
function createHandler(handler, getContext) {
    return async (req, res) => {
        try {
            const ctx = getContext(req);
            const result = await handler(ctx, req.body);
            sendJson(res, 200, result);
        }
        catch (error) {
            handleExpressError(res, error);
        }
    };
}
export function createAgentExpressHandler(getContext = defaultContextFactory) {
    return createHandler(createAgentCore, getContext);
}
export function updateAgentRegistrationExpressHandler(getContext = defaultContextFactory) {
    return async (req, res) => {
        try {
            const ctx = getContext(req);
            const did8004 = req.params?.did8004 ||
                req.params?.['did:8004'] ||
                req.params?.['did%3A8004'];
            if (!did8004) {
                throw new AgentApiError('Missing did:8004 parameter', 400);
            }
            const body = (req.body ?? {});
            const input = {
                did8004: decodeURIComponent(did8004),
                registration: body.registration,
                mode: body.mode,
            };
            const result = await updateAgentRegistrationCore(ctx, input);
            sendJson(res, 200, result);
        }
        catch (error) {
            handleExpressError(res, error);
        }
    };
}
function getQueryParam(req, key) {
    const query = req.query;
    const value = query ? query[key] : undefined;
    if (Array.isArray(value)) {
        return value[0]?.toString();
    }
    if (typeof value === 'string') {
        return value;
    }
    if (value !== undefined && value !== null) {
        return String(value);
    }
    if (typeof req.url === 'string') {
        try {
            const url = new URL(req.url, 'http://localhost');
            const param = url.searchParams.get(key);
            return param ?? undefined;
        }
        catch {
            return undefined;
        }
    }
    return undefined;
}
function parseNumber(value) {
    if (!value)
        return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}
export function requestFeedbackAuthExpressHandler(getContext = defaultContextFactory) {
    return async (req, res) => {
        try {
            const ctx = getContext(req);
            const clientAddress = getQueryParam(req, 'clientAddress') ?? '';
            const paramAgentId = getQueryParam(req, 'agentId') ??
                req.params?.did8004 ??
                req.params?.['did:8004'] ??
                req.params?.['did%3A8004'];
            let agentId = paramAgentId ?? '';
            let chainId = parseNumber(getQueryParam(req, 'chainId'));
            if (paramAgentId?.startsWith('did:8004:')) {
                try {
                    const parsed = parseDid8004(paramAgentId);
                    agentId = parsed.agentId;
                    chainId = parsed.chainId;
                }
                catch {
                    // fallback to manual values below
                }
            }
            const indexLimit = parseNumber(getQueryParam(req, 'indexLimit'));
            const expirySeconds = parseNumber(getQueryParam(req, 'expirySec')) ??
                parseNumber(getQueryParam(req, 'expirySeconds'));
            const input = {
                clientAddress,
                agentId,
                chainId,
                indexLimit,
                expirySeconds,
            };
            const result = await requestFeedbackAuthCore(ctx, input);
            sendJson(res, 200, result);
        }
        catch (error) {
            handleExpressError(res, error);
        }
    };
}
export function prepareFeedbackExpressHandler(getContext = defaultContextFactory) {
    return async (req, res) => {
        try {
            const ctx = getContext(req);
            const did8004 = req.params?.did8004 ??
                req.params?.['did:8004'] ??
                req.params?.['did%3A8004'];
            if (!did8004) {
                sendJson(res, 400, { error: 'did8004 parameter is required' });
                return;
            }
            const body = (req.body ?? {});
            const input = {
                did8004,
                ...body,
            };
            const result = await prepareFeedbackCore(ctx, input);
            sendJson(res, 200, result);
        }
        catch (error) {
            handleExpressError(res, error);
        }
    };
}
export function getFeedbackExpressHandler(getContext = defaultContextFactory) {
    return async (req, res) => {
        try {
            const ctx = getContext(req);
            const did8004 = req.params?.did8004 ??
                req.params?.['did:8004'] ??
                req.params?.['did%3A8004'];
            if (!did8004) {
                sendJson(res, 400, { error: 'did8004 parameter is required' });
                return;
            }
            const includeRevokedParam = getQueryParam(req, 'includeRevoked');
            const includeRevoked = includeRevokedParam === 'true' || includeRevokedParam === '1';
            const limit = parseNumber(getQueryParam(req, 'limit')) ?? 100;
            const offset = parseNumber(getQueryParam(req, 'offset')) ?? 0;
            const result = await getFeedbackCore(ctx, {
                did8004: decodeURIComponent(did8004),
                includeRevoked,
                limit,
                offset,
            });
            sendJson(res, 200, result);
        }
        catch (error) {
            handleExpressError(res, error);
        }
    };
}
export function mountAgentRoutes(router, options) {
    const basePath = options?.basePath ?? '/api/agents';
    const getContext = options?.createContext ?? defaultContextFactory;
    router.post(`${basePath}/create`, createAgentExpressHandler(getContext));
    router.put(`${basePath}/:did8004/registration`, updateAgentRegistrationExpressHandler(getContext));
    router.get(`${basePath}/:did8004/feedback-auth`, requestFeedbackAuthExpressHandler(getContext));
    router.post(`${basePath}/:did8004/feedback`, prepareFeedbackExpressHandler(getContext));
    router.get(`${basePath}/:did8004/feedback`, getFeedbackExpressHandler(getContext));
}
//# sourceMappingURL=express.js.map