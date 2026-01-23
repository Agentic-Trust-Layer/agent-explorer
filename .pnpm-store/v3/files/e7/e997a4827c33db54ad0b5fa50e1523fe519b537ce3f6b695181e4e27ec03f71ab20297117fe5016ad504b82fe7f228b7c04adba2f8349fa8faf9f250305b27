import { Category } from "./Category";
import { CategoryLogger } from "./CategoryLogger";
import { RuntimeSettings } from "./RuntimeSettings";
import { CategoryRuntimeSettings } from "./CategoryRuntimeSettings";
import { CategoryConfiguration } from "./CategoryConfiguration";
/**
 * The service (only available as singleton) for all category related stuff as
 * retrieving, registering a logger. You should normally NOT use this,
 * instead use CategoryServiceFactory which is meant for end users.
 */
export declare class CategoryServiceImpl implements RuntimeSettings {
    private static _INSTANCE;
    private _defaultConfig;
    private _mapState;
    private constructor();
    static getInstance(): CategoryServiceImpl;
    getLogger(category: Category): CategoryLogger;
    /**
     * Clears everything, including a default configuration you may have set.
     * After this you need to re-register your categories etc.
     */
    clear(): void;
    getCategorySettings(category: Category): CategoryRuntimeSettings;
    getOriginalCategorySettings(category: Category): CategoryRuntimeSettings;
    /**
     * Set the default configuration. New root loggers created get this
     * applied. If you want to reset all current loggers to have this
     * applied as well, pass in reset=true (the default is false). All
     * categories will be reset then as well.
     * @param config New config
     * @param reset Defaults to true. Set to true to reset all loggers and current runtimesettings.
     */
    setDefaultConfiguration(config: CategoryConfiguration, reset?: boolean): void;
    /**
     * Set new configuration settings for a category (and possibly its child categories)
     * @param config Config
     * @param category Category
     * @param applyChildren True to apply to child categories, defaults to false.
     */
    setConfigurationCategory(config: CategoryConfiguration, category: Category, applyChildren?: boolean): void;
    registerCategory(category: Category): void;
    /**
     * Used to enable integration with chrome extension. Do not use manually, the
     * extension and the logger framework deal with this.
     */
    enableExtensionIntegration(): void;
    /**
     * Return all root categories currently registered.
     */
    getRootCategories(): Category[];
    /**
     * Return Category by id
     * @param id The id of the category to find
     * @returns {Category} or null if not found
     */
    getCategoryById(id: number): Category | null;
    private createOrGetCategoryState;
    private createState;
    private createLogger;
    private static getCategoryKey;
}
