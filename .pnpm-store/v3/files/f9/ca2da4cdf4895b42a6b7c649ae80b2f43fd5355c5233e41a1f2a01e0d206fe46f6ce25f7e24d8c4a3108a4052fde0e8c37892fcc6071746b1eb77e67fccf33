export type QueueItemContext<State> = {
    intervalStart: number;
    state: State;
};
export type QueueItem<State, Return> = (context: QueueItemContext<State>) => Promise<Return> | Return;
export type ThrottledQueueOptions = {
    /**
     * Max number of executions for a given interval.
     */
    maxPerInterval?: number;
    /**
     * Duration in milliseconds.
     */
    interval?: number;
    /**
     * Space out the executions evenly.
     */
    evenlySpaced?: boolean;
    /**
     * How many times can `manager.retry` be called before throwing a `RetryError`.
     */
    maxRetries?: number;
    /**
     * How many times can `manager.pauseAndRetry` be called before throwing a `RetryError`.
     */
    maxRetriesWithPauses?: number;
};
export declare const DEFAULT_WAIT = 500;
export declare const DEFAULT_RETRY_LIMIT = 30;
export type RetryErrorOptions = {
    retryAfter?: number | null;
    pauseQueue?: boolean;
    message?: string;
};
export declare class RetryError extends Error {
    readonly options: RetryErrorOptions;
    constructor(options?: RetryErrorOptions);
}
export declare function throttledQueue(options?: ThrottledQueueOptions): <Return, State extends Record<string, unknown> = Record<string, unknown>>(fn: QueueItem<State, Return>, state?: State) => Promise<Return>;
export declare function seconds(numSeconds: number | string): number;
export declare function minutes(numMinutes: number | string): number;
export declare function hours(numHours: number | string): number;
