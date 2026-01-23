import { AbstractLogger, LogMessage } from "./AbstractLogger";
import { LogGroupRuntimeSettings } from "./LogGroupRuntimeSettings";
/**
 * Logger which buffers all messages, use with care due to possible high memory footprint.
 * Can be convenient in some cases. Call toString() for full output, or cast to this class
 * and call getMessages() to do something with it yourself.
 */
export declare class MessageBufferLoggerImpl extends AbstractLogger {
    private messages;
    constructor(name: string, logGroupRuntimeSettings: LogGroupRuntimeSettings);
    close(): void;
    getMessages(): string[];
    toString(): string;
    protected doLog(message: LogMessage): void;
}
