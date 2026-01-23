import { AbstractCategoryLogger, CategoryLogMessage } from "./AbstractCategoryLogger";
/**
 * Logger which buffers all messages, use with care due to possible high memory footprint.
 * Can be convenient in some cases. Call toString() for full output, or cast to this class
 * and call getMessages() to do something with it yourself.
 */
export declare class CategoryMessageBufferLoggerImpl extends AbstractCategoryLogger {
    private messages;
    getMessages(): string[];
    toString(): string;
    protected doLog(msg: CategoryLogMessage): void;
}
