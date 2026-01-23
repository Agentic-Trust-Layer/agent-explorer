import { LogGroupRule } from "./LogGroupRule";
/**
 * Options object you can use to configure the LoggerFactory you create at LFService.
 */
export declare class LoggerFactoryOptions {
    private _logGroupRules;
    private _enabled;
    /**
     * Add LogGroupRule, see {LogGroupRule) for details
     * @param rule Rule to add
     * @returns {LoggerFactoryOptions} returns itself
     */
    addLogGroupRule(rule: LogGroupRule): LoggerFactoryOptions;
    /**
     * Enable or disable logging completely for the LoggerFactory.
     * @param enabled True for enabled (default)
     * @returns {LoggerFactoryOptions} returns itself
     */
    setEnabled(enabled: boolean): LoggerFactoryOptions;
    get logGroupRules(): LogGroupRule[];
    get enabled(): boolean;
}
