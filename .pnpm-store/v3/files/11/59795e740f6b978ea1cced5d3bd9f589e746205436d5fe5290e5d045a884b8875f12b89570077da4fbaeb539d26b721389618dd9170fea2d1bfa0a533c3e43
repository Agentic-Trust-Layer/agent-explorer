import { CategoryLogger } from "./CategoryLogger";
import { Category } from "./Category";
import { RuntimeSettings } from "./RuntimeSettings";
import { CategoryLogFormat, LoggerType, LogLevel } from "../LoggerOptions";
import { CategoryLogMessage } from "./AbstractCategoryLogger";
/**
 * RuntimeSettings for a category, at runtime these are associated to a category.
 */
export declare class CategoryRuntimeSettings {
    private _category;
    private _logLevel;
    private _loggerType;
    private _logFormat;
    private _callBackLogger;
    private _formatterLogMessage;
    constructor(category: Category, logLevel?: LogLevel, loggerType?: LoggerType, logFormat?: CategoryLogFormat, callBackLogger?: ((rootCategory: Category, runtimeSettings: RuntimeSettings) => CategoryLogger) | null, formatterLogMessage?: ((message: CategoryLogMessage) => string) | null);
    get category(): Category;
    get logLevel(): LogLevel;
    set logLevel(value: LogLevel);
    get loggerType(): LoggerType;
    set loggerType(value: LoggerType);
    get logFormat(): CategoryLogFormat;
    set logFormat(value: CategoryLogFormat);
    get callBackLogger(): ((rootCategory: Category, runtimeSettings: RuntimeSettings) => CategoryLogger) | null;
    set callBackLogger(value: ((rootCategory: Category, runtimeSettings: RuntimeSettings) => CategoryLogger) | null);
    get formatterLogMessage(): ((message: CategoryLogMessage) => string) | null;
    set formatterLogMessage(value: ((message: CategoryLogMessage) => string) | null);
}
