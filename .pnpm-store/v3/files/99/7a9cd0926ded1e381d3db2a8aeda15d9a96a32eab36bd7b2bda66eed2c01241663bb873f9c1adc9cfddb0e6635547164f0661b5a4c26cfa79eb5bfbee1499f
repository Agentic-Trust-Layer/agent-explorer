import { CategoryLogger } from "./CategoryLogger";
import { Category } from "./Category";
import { RuntimeSettings } from "./RuntimeSettings";
import { CategoryLogFormat, LoggerType, LogLevel } from "../LoggerOptions";
import { CategoryLogMessage } from "./AbstractCategoryLogger";
/**
 * Default configuration, can be used to initially set a different default configuration
 * on the CategoryServiceFactory. This will be applied to all categories already registered (or
 * registered in the future). Can also be applied to one Category (and childs).
 */
export declare class CategoryConfiguration {
    private _logLevel;
    private _loggerType;
    private _logFormat;
    private _callBackLogger;
    private _formatterLogMessage;
    /**
     * Create a new instance
     * @param logLevel Log level for all loggers, default is LogLevel.Error
     * @param loggerType Where to log, default is LoggerType.Console
     * @param logFormat What logging format to use, use default instance, for default values see CategoryLogFormat.
     * @param callBackLogger Optional callback, if LoggerType.Custom is used as loggerType. In that case must return a new Logger instance.
     *            It is recommended to extend AbstractCategoryLogger to make your custom logger.
     */
    constructor(logLevel?: LogLevel, loggerType?: LoggerType, logFormat?: CategoryLogFormat, callBackLogger?: ((rootCategory: Category, runtimeSettings: RuntimeSettings) => CategoryLogger) | null);
    get logLevel(): LogLevel;
    get loggerType(): LoggerType;
    get logFormat(): CategoryLogFormat;
    get callBackLogger(): ((rootCategory: Category, runtimeSettings: RuntimeSettings) => CategoryLogger) | null;
    /**
     * Get the formatterLogMessage function, see comment on the setter.
     * @returns {((message:CategoryLogMessage)=>string)|null}
     */
    get formatterLogMessage(): ((message: CategoryLogMessage) => string) | null;
    /**
     * Set the default formatterLogMessage function, if set it is applied to all type of loggers except for a custom logger.
     * By default this is null (not set). You can assign a function to allow custom formatting of a log message.
     * Each log message will call this function then and expects your function to format the message and return a string.
     * Will throw an error if you attempt to set a formatterLogMessage if the LoggerType is custom.
     * @param value The formatter function, or null to reset it.
     */
    set formatterLogMessage(value: ((message: CategoryLogMessage) => string) | null);
    copy(): CategoryConfiguration;
}
