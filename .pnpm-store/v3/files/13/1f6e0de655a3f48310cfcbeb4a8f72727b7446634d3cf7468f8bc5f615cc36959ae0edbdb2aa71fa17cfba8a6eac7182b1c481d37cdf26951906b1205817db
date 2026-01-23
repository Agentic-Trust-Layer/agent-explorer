import { Logger } from "./Logger";
import { LoggerFactory } from "./LoggerFactory";
import { LoggerFactoryRuntimeSettings } from "./LoggerFactoryRuntimeSettings";
import { LoggerFactoryOptions } from "./LoggerFactoryOptions";
import { LogGroupRuntimeSettings } from "./LogGroupRuntimeSettings";
export declare class LoggerFactoryImpl implements LoggerFactory, LoggerFactoryRuntimeSettings {
    private _name;
    private _options;
    private _loggers;
    private _logGroupRuntimeSettingsIndexed;
    private _loggerToLogGroupSettings;
    constructor(name: string, options: LoggerFactoryOptions);
    configure(options: LoggerFactoryOptions): void;
    getLogger(named: string): Logger;
    isEnabled(): boolean;
    closeLoggers(): void;
    getName(): string;
    getLogGroupRuntimeSettingsByIndex(idx: number): LogGroupRuntimeSettings | null;
    getLogGroupRuntimeSettingsByLoggerName(nameLogger: string): LogGroupRuntimeSettings | null;
    getLogGroupRuntimeSettings(): LogGroupRuntimeSettings[];
    private loadLogger;
}
