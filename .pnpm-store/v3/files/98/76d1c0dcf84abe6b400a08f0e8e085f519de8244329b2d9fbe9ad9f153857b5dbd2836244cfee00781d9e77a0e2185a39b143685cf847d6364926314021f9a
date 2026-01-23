import { LogLevel } from "../LoggerOptions";
import { MessageType } from "../standard/Logger";
import { CategoryLogger } from "./CategoryLogger";
import { Category } from "./Category";
/**
 * Delegate logger, delegates logging to given logger (constructor).
 */
export declare class CategoryDelegateLoggerImpl implements CategoryLogger {
    private _delegate;
    constructor(delegate: CategoryLogger);
    get delegate(): CategoryLogger;
    set delegate(value: CategoryLogger);
    trace(msg: MessageType, ...categories: Category[]): void;
    debug(msg: MessageType, ...categories: Category[]): void;
    info(msg: MessageType, ...categories: Category[]): void;
    warn(msg: MessageType, ...categories: Category[]): void;
    error(msg: MessageType, error: Error, ...categories: Category[]): void;
    fatal(msg: MessageType, error: Error, ...categories: Category[]): void;
    resolved(msg: MessageType, error: Error, ...categories: Category[]): void;
    log(level: LogLevel, msg: MessageType, error: Error, ...categories: Category[]): void;
}
