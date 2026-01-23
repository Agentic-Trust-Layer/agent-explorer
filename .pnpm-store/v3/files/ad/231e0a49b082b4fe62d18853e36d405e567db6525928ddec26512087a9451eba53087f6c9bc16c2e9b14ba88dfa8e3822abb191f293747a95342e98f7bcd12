import { LoggerFactory } from "./LoggerFactory";
import { LoggerFactoryOptions } from "./LoggerFactoryOptions";
import { LFServiceRuntimeSettings } from "./LFServiceRuntimeSettings";
/**
 * Create and configure your LoggerFactory from here.
 */
export declare class LFService {
    private static DEFAULT_LOGGER_FACTORY_NAME;
    private static INSTANCE_SERVICE;
    private static DEFAULT_LOGGER_FACTORY;
    /**
     * Create a new LoggerFactory with given options (if any). If no options
     * are specified, the LoggerFactory, will accept any named logger and will
     * log on info level by default for, to the console.
     * @param options Options, optional.
     * @returns {LoggerFactory}
     */
    static createLoggerFactory(options?: LoggerFactoryOptions | null): LoggerFactory;
    /**
     * Create a new LoggerFactory using given name (used for console api/extension).
     * @param name Name Pick something short but distinguishable. The word "DEFAULT" is reserved and cannot be taken, it is used
     * for the default LoggerFactory.
     * @param options Options, optional
     * @return {LoggerFactory}
     */
    static createNamedLoggerFactory(name: string, options?: LoggerFactoryOptions | null): LoggerFactory;
    /**
     * Closes all Loggers for LoggerFactories that were created.
     * After this call, all previously fetched Loggers (from their
     * factories) are unusable. The factories remain as they were.
     */
    static closeLoggers(): void;
    /**
     * Return LFServiceRuntimeSettings to retrieve information loggerfactories
     * and their runtime settings.
     * @returns {LFServiceRuntimeSettings}
     */
    static getRuntimeSettings(): LFServiceRuntimeSettings;
    /**
     * This property returns the default LoggerFactory (if not yet initialized it is initialized).
     * This LoggerFactory can be used to share among multiple
     * applications/libraries - that way you can enable/change logging over everything from
     * your own application when required.
     * It is recommended to be used by library developers to make logging easily available for the
     * consumers of their libraries.
     * It is highly recommended to use Loggers from the LoggerFactory with unique grouping/names to prevent
     * clashes of Loggers between multiple projects.
     * @returns {LoggerFactory} Returns the default LoggerFactory
     */
    static get DEFAULT(): LoggerFactory;
    private static getDefault;
}
