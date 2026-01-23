/**
 * Allows to change the settings for one or all LogGroups.
 * Options will be applied only if set, undefined options are ignored.
 *
 * The only property really required is group.
 */
export interface LogGroupControlSettings {
    /**
     * Apply to specific group, or "all".
     */
    group: number | "all";
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
     * Whether to show the logger name, undefined will not change the setting.
     */
    showLoggerName: boolean | undefined;
}
/**
 *  Interface to control LoggerFactories (LoggerFactory and related loggers) through
 *  ordinary console (in browsers).
 */
export interface LoggerControl {
    /**
     * Shows help for this object.
     */
    help(): void;
    /**
     * Lists all registered logger factories with associated log groups with respective ids
     */
    listFactories(): void;
    /**
     * Show settings for LoggerFactory id (see listFactories() to get it) or null, for all.
     * @param idFactory LoggerFactory id or all
     */
    showSettings(idFactory: number | "all"): void;
    /**
     * Reset one or all factories back to original values.
     * @param idFactory Id factory or "all" for all.
     */
    reset(idFactory: number | "all"): void;
    /**
     * Return LoggerFactoryControl object. Throws error when number is invalid.
     * @param idFactory Id factory
     * @returns {LoggerFactoryControl}
     */
    getLoggerFactoryControl(idFactory: number): LoggerFactoryControl;
}
/**
 * Interface to control LoggerFactory.
 */
export interface LoggerFactoryControl {
    /**
     * Shows help
     */
    help(): void;
    /**
     * Shows an example of usage.
     */
    example(): void;
    /**
     * Prints settings for given group id, "all" for all group.
     */
    showSettings(id: number | "all"): void;
    /**
     * Apply new settings, see LogGroupControlSettings for details.
     * @param settings Settings to set
     */
    change(settings: LogGroupControlSettings): void;
    /**
     * Resets everything to original values, for one specific or for all groups.
     */
    reset(id: number | "all"): void;
}
export declare class LoggerControlImpl implements LoggerControl {
    private static _help;
    help(): void;
    listFactories(): void;
    showSettings(id?: number | "all"): void;
    reset(idFactory?: number | "all"): void;
    getLoggerFactoryControl(idFactory: number): LoggerFactoryControl;
    private static _getRuntimeSettingsLoggerFactories;
    private static _getSettings;
}
