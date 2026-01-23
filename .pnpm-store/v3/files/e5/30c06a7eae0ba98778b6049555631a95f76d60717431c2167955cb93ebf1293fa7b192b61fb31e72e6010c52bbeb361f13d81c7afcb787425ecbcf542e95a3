import { LogLevel } from "../LoggerOptions";
import { ErrorType, Logger, MessageType } from "./Logger";
import { LogData } from "../LogData";
import { LogGroupRule } from "./LogGroupRule";
import { LogGroupRuntimeSettings } from "./LogGroupRuntimeSettings";
/**
 * Log message, providing all data for a single message.
 */
export interface LogMessage {
    /**
     * Name of the logger.
     */
    readonly loggerName: string;
    /**
     * Original, unformatted message or LogData.
     */
    readonly message: string | LogData;
    /**
     * Returns the resolved stack (based on error).
     * Available only when error is present, null otherwise.
     */
    readonly errorAsStack: string | null;
    /**
     * Error when present, or null.
     */
    readonly error: Error | null;
    /**
     * Which LogGroupRule matched for this message.
     */
    readonly logGroupRule: LogGroupRule;
    /**
     * Time for message.
     */
    readonly date: Date;
    /**
     * LogLevel used
     */
    readonly level: LogLevel;
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
 * Abstract base logger, extend to easily implement a custom logger that
 * logs wherever you want. You only need to implement doLog(msg: LogMessage) and
 * log that somewhere (it will contain format and everything else).
 */
export declare abstract class AbstractLogger implements Logger {
    private _logGroupRuntimeSettings;
    private _allMessages;
    protected _name: string;
    protected _open: boolean;
    constructor(name: string, logGroupRuntimeSettings: LogGroupRuntimeSettings);
    get name(): string;
    trace(msg: MessageType, error?: ErrorType): void;
    debug(msg: MessageType, error?: ErrorType): void;
    info(msg: MessageType, error?: ErrorType): void;
    warn(msg: MessageType, error?: ErrorType): void;
    error(msg: MessageType, error?: ErrorType): void;
    fatal(msg: MessageType, error?: ErrorType): void;
    isTraceEnabled(): boolean;
    isDebugEnabled(): boolean;
    isInfoEnabled(): boolean;
    isWarnEnabled(): boolean;
    isErrorEnabled(): boolean;
    isFatalEnabled(): boolean;
    getLogLevel(): LogLevel;
    isOpen(): boolean;
    close(): void;
    protected createDefaultLogMessage(msg: LogMessage): string;
    /**
     * Return optional message formatter. All LoggerTypes (except custom) will see if
     * they have this, and if so use it to log.
     * @returns {((message:LogMessage)=>string)|null}
     */
    protected _getMessageFormatter(): ((message: LogMessage) => string) | null;
    protected abstract doLog(msg: LogMessage): void;
    private _log;
    private createMessage;
    private processMessages;
}
