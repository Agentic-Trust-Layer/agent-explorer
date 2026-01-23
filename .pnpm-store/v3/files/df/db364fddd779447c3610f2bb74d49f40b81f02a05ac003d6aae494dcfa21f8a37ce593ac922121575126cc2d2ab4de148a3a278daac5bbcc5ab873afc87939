/**
 * Allows to change the settings for one or all Categories.
 * Options will be applied only if set, undefined options are ignored.
 *
 * The only properties required are recursive (to apply recursively to child categories or not) and idCategory.
 */
export interface CategoryServiceControlSettings {
    /**
     * Apply to child categories (true) or not.
     */
    recursive: boolean;
    /**
     * Apply to specific category, or "all".
     */
    category: number | "all";
    /**
     * Set log level, undefined will not change the setting.
     */
    logLevel: "Fatal" | "Error" | "Warn" | "Info" | "Debug" | "Trace" | undefined;
    /**
     * Set the log format, undefined will not change the setting.
     */
    logFormat: "Default" | "YearMonthDayTime" | "YearDayMonthWithFullTime" | "YearDayMonthTime" | undefined;
    /**
     * Whether to show timestamp, undefined will not change the setting.
     */
    showTimestamp: boolean | undefined;
    /**
     * Whether to show the category name, undefined will not change the setting.
     */
    showCategoryName: boolean | undefined;
}
/**
 * Interface to control CategoryService and relatedm, through
 * ordinary console in browsers.
 */
export interface CategoryServiceControl {
    /**
     * Shows help
     */
    help(): void;
    /**
     * Shows an example of usage.
     */
    example(): void;
    /**
     * Prints settings for given category id, when "all" for all categories.
     */
    showSettings(id: number | "all"): void;
    /**
     * Apply new settings, see CategoryServiceControlSettings for details.
     * @param settings Settings to set
     */
    change(settings: CategoryServiceControlSettings): void;
    /**
     * Resets everything to original values, for one specific or for all categories.
     */
    reset(id: number | "all"): void;
}
/**
 * Implementation class for CategoryServiceControl.
 */
export declare class CategoryServiceControlImpl implements CategoryServiceControl {
    private static _help;
    private static _example;
    help(): void;
    example(): void;
    showSettings(id?: number | "all"): void;
    change(settings: CategoryServiceControlSettings): void;
    reset(id?: number | "all"): void;
    private static _processCategory;
    private static _applyToCategory;
    private static _getCategoryService;
    private static _getCategories;
}
