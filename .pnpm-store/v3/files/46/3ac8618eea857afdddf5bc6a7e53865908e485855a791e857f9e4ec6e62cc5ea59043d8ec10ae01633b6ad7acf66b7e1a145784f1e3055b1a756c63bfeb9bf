import { LogData } from "../LogData";
import { CategoryLogFormat, LogLevel } from "../LoggerOptions";
import { ErrorType, MessageType } from "../standard/Logger";
import { CategoryLogger } from "./CategoryLogger";
import { Category } from "./Category";
import { RuntimeSettings } from "./RuntimeSettings";
/**
 * Contains information about a single log message.
 */
export interface CategoryLogMessage {
    readonly message: string | LogData;
    /**
     * Returns the resolved stack (based on error).
     * Available only when error is present.
     */
    readonly errorAsStack: string | null;
    readonly error: Error | null;
    readonly categories: Category[];
    readonly date: Date;
    readonly level: LogLevel;
    readonly logFormat: CategoryLogFormat;
    readonly isResolvedErrorMessage: boolean;
    /**
     * True if message represents LogData (false for a string message).
     */
    readonly isMessageLogData: boolean;
    /**
     * Always retrieves the message, from either the string directly
     * or in case of LogData from LogData itself.
     */
    readonly messageAsString: string;
    /**
     * If present returns LogData, otherwise null.
     */
    readonly logData: LogData | null;
}
/**
 * Abstract category logger, use as your base class for new type of loggers (it
 * saves you a lot of work) and override doLog(CategoryLogMessage). The message argument
 * provides full access to anything related to the logging event.
 * If you just want the standard line of logging, call: this.createDefaultLogMessage(msg) on
 * this class which will return you the formatted log message as string (e.g. the
 * default loggers all use this).
 */
export declare abstract class AbstractCategoryLogger implements CategoryLogger {
    private rootCategory;
    private runtimeSettings;
    private allMessages;
    constructor(rootCategory: Category, runtimeSettings: RuntimeSettings);
    trace(msg: MessageType, ...categories: Category[]): void;
    debug(msg: MessageType, ...categories: Category[]): void;
    info(msg: MessageType, ...categories: Category[]): void;
    warn(msg: MessageType, ...categories: Category[]): void;
    error(msg: MessageType, error: ErrorType, ...categories: Category[]): void;
    fatal(msg: MessageType, error: ErrorType, ...categories: Category[]): void;
    resolved(msg: MessageType, error: ErrorType, ...categories: Category[]): void;
    log(level: LogLevel, msg: MessageType, error: ErrorType, ...categories: Category[]): void;
    protected getRootCategory(): Category;
    /**
     * Implement this method in your custom logger
     * @param msg Message
     */
    protected abstract doLog(msg: CategoryLogMessage): void;
    protected createDefaultLogMessage(msg: CategoryLogMessage): string;
    /**
     * Return optional message formatter. All LoggerTypes (except custom) will see if
     * they have this, and if so use it to log.
     * @returns {((message:CategoryLogMessage)=>string)|null}
     */
    protected _getMessageFormatter(): ((message: CategoryLogMessage) => string) | null;
    private _log;
    private _logInternal;
    private processMessages;
}
