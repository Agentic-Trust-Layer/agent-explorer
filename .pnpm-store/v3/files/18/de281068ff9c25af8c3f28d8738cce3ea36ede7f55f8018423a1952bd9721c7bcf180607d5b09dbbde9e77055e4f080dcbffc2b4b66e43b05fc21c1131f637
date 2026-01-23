export interface PublicService {
    endpoint: URL;
    rateLimiter?: RateLimiter;
}
/**
 * RateLimiter returns a promise that resolves when it is safe to send a request
 * that does not exceed the rate limit.
 */
export declare type RateLimiter = () => Promise<void>;
/**
 * W3NameService coordinates access to the W3name API.
 */
export default class W3NameService implements PublicService {
    endpoint: URL;
    waitForRateLimit: RateLimiter;
    constructor(endpoint?: URL, waitForRateLimit?: RateLimiter);
}
//# sourceMappingURL=service.d.ts.map