import { LogLevel } from "../LoggerOptions";
import { CategoryLogger } from "./CategoryLogger";
import { ErrorType, MessageType } from "../standard/Logger";
/**
 * Category for use with categorized logging.
 * At minimum you need one category, which will serve as the root category.
 * You can create child categories (like a tree). You can have multiple root
 * categories.
 */
export declare class Category implements CategoryLogger {
    private static currentId;
    private _id;
    private _name;
    private _parent;
    private _children;
    private _logLevel;
    private _logger;
    constructor(name: string, parent?: Category | null);
    get name(): string;
    get parent(): Category | null;
    get children(): Category[];
    get logLevel(): LogLevel;
    trace(msg: MessageType, ...categories: Category[]): void;
    debug(msg: MessageType, ...categories: Category[]): void;
    info(msg: MessageType, ...categories: Category[]): void;
    warn(msg: MessageType, ...categories: Category[]): void;
    error(msg: MessageType, error: ErrorType, ...categories: Category[]): void;
    fatal(msg: MessageType, error: ErrorType, ...categories: Category[]): void;
    resolved(msg: MessageType, error: ErrorType, ...categories: Category[]): void;
    log(level: LogLevel, msg: MessageType, error: ErrorType, ...categories: Category[]): void;
    getCategoryPath(): string;
    /**
     * Returns the id for this category (this
     * is for internal purposes only).
     * @returns {number} Id
     */
    get id(): number;
    private loadCategoryLogger;
    private static nextId;
}
