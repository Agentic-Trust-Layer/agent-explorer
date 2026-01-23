"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryError = exports.DEFAULT_RETRY_LIMIT = exports.DEFAULT_WAIT = void 0;
exports.throttledQueue = throttledQueue;
exports.seconds = seconds;
exports.minutes = minutes;
exports.hours = hours;
exports.DEFAULT_WAIT = 500;
exports.DEFAULT_RETRY_LIMIT = 30;
class RetryError extends Error {
    constructor(options = {}) {
        var _a;
        super((_a = options.message) !== null && _a !== void 0 ? _a : 'Maximum retry limit reached.');
        this.options = options;
    }
}
exports.RetryError = RetryError;
const INTERNAL_STATE = Symbol('internal_state');
function throttledQueue(options = {}) {
    const { interval = 0, maxPerInterval = Infinity, evenlySpaced = false, maxRetries = exports.DEFAULT_RETRY_LIMIT, maxRetriesWithPauses = exports.DEFAULT_RETRY_LIMIT, } = options;
    if (maxPerInterval < 1) {
        throw new Error('"maxPerInterval" must be a positive integer.');
    }
    if (interval < 0) {
        throw new Error('"interval" cannot be negative.');
    }
    if (maxRetries < 0) {
        throw new Error('"maxRetries" cannot be negative.');
    }
    if (maxRetriesWithPauses < 0) {
        throw new Error('"maxRetriesWithPauses" cannot be negative.');
    }
    /**
     * If all requests should be evenly spaced, adjust to suit.
     */
    if (evenlySpaced) {
        return throttledQueue({
            ...options,
            interval: Math.ceil(interval / maxPerInterval),
            maxPerInterval: 1,
            evenlySpaced: false,
        });
    }
    const queue = [];
    let lastIntervalStart = 0;
    let numPerInterval = 0;
    let timeout;
    /**
     * Gets called at a set interval to remove items from the queue.
     * This is a self-adjusting timer, since the browser's setTimeout is highly inaccurate.
     */
    const dequeue = () => {
        timeout = undefined;
        const intervalEnd = lastIntervalStart + interval;
        const now = Date.now();
        /**
         * Adjust the timer if it was called too early.
         */
        if (now < intervalEnd) {
            timeout = setTimeout(dequeue, intervalEnd - now);
            return;
        }
        lastIntervalStart = now;
        numPerInterval = 0;
        for (const callback of queue.splice(0, maxPerInterval)) {
            numPerInterval++;
            callback();
        }
        if (queue.length) {
            timeout = setTimeout(dequeue, interval);
        }
    };
    const enqueue = (fn, state) => new Promise((resolve, reject) => {
        if (!state) {
            state = {};
        }
        if (!(INTERNAL_STATE in state)) {
            Object.assign(state, {
                [INTERNAL_STATE]: {
                    maxRetries,
                    maxRetriesWithPauses,
                },
            });
        }
        const retryableFn = async () => {
            var _a, _b;
            try {
                return await fn({ intervalStart: lastIntervalStart, state: state });
            }
            catch (err) {
                if (err instanceof RetryError) {
                    const internalState = state[INTERNAL_STATE];
                    if (err.options.pauseQueue) {
                        if (internalState.maxRetriesWithPauses-- <= 0) {
                            throw err;
                        }
                        /**
                         * Stop accepting new functions for this interval, then push the timer out by the specified amount.
                         */
                        numPerInterval = maxPerInterval;
                        timeout !== undefined && clearTimeout(timeout);
                        timeout = setTimeout(dequeue, (_b = (_a = err.options.retryAfter) !== null && _a !== void 0 ? _a : options.interval) !== null && _b !== void 0 ? _b : exports.DEFAULT_WAIT);
                    }
                    else {
                        if (internalState.maxRetries-- <= 0) {
                            throw err;
                        }
                        /**
                         * Wait for the specified amount of time, then enqueue the function again.
                         */
                        await new Promise((r) => { var _a, _b; return setTimeout(r, (_b = (_a = err.options.retryAfter) !== null && _a !== void 0 ? _a : options.interval) !== null && _b !== void 0 ? _b : exports.DEFAULT_WAIT); });
                    }
                    return enqueue(fn, state);
                }
                throw err;
            }
        };
        const callback = () => {
            Promise.resolve()
                .then(retryableFn)
                .then(resolve)
                .catch(reject);
        };
        const now = Date.now();
        if (timeout === undefined && interval && (now - lastIntervalStart) > interval) {
            lastIntervalStart = now;
            numPerInterval = 0;
        }
        if (numPerInterval++ < maxPerInterval) {
            callback();
        }
        else {
            queue.push(callback);
            if (timeout === undefined) {
                timeout = setTimeout(dequeue, lastIntervalStart + interval - now);
            }
        }
    });
    return enqueue;
}
function getNumber(num) {
    if (typeof num === 'number') {
        return num;
    }
    const numFromStr = Number(num);
    if (!Number.isFinite(numFromStr)) {
        throw new Error(`"${num}" is not a valid number.`);
    }
    return numFromStr;
}
function seconds(numSeconds) {
    return getNumber(numSeconds) * 1000;
}
function minutes(numMinutes) {
    return getNumber(numMinutes) * seconds(60);
}
function hours(numHours) {
    return getNumber(numHours) * minutes(60);
}
//# sourceMappingURL=throttledQueue.cjs.map