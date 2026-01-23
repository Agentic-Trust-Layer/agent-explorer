import { Logger } from "./Logger";
import { LogGroupRule } from "./LogGroupRule";
import { LogFormat, LoggerType, LogLevel } from "../LoggerOptions";
import { LogMessage } from "./AbstractLogger";
/**
 * Represents the runtime settings for a LogGroup (LogGroupRule).
 */
export declare class LogGroupRuntimeSettings {
    private _logGroupRule;
    private _level;
    private _loggerType;
    private _logFormat;
    private _callBackLogger;
    private _formatterLogMessage;
    constructor(logGroupRule: LogGroupRule);
    /**
     * Returns original LogGroupRule (so not runtime settings!)
     * @return {LogGroupRule}
     */
    get logGroupRule(): LogGroupRule;
    get level(): LogLevel;
    set level(value: LogLevel);
    get loggerType(): LoggerType;
    set loggerType(value: LoggerType);
    get logFormat(): LogFormat;
    set logFormat(value: LogFormat);
    get callBackLogger(): ((name: string, settings: LogGroupRuntimeSettings) => Logger) | null;
    set callBackLogger(value: ((name: string, settings: LogGroupRuntimeSettings) => Logger) | null);
    get formatterLogMessage(): ((message: LogMessage) => string) | null;
    set formatterLogMessage(value: ((message: LogMessage) => string) | null);
}
