import { CategoryLogMessage } from "../log/category/AbstractCategoryLogger";
import { DateFormat } from "../log/LoggerOptions";
import { LogMessage } from "../log/standard/AbstractLogger";
/**
 * Some utilities to format messages.
 */
export declare class MessageFormatUtils {
    /**
     * Render given date in given DateFormat and return as String.
     * @param date Date
     * @param dateFormat Format
     * @returns {string} Formatted date
     */
    static renderDate(date: Date, dateFormat: DateFormat): string;
    /**
     * Renders given category log message in default format.
     * @param msg Message to format
     * @param addStack If true adds the stack to the output, otherwise skips it
     * @returns {string} Formatted message
     */
    static renderDefaultMessage(msg: CategoryLogMessage, addStack: boolean): string;
    /**
     * Renders given log4j log message in default format.
     * @param msg Message to format
     * @param addStack If true adds the stack to the output, otherwise skips it
     * @returns {string} Formatted message
     */
    static renderDefaultLog4jMessage(msg: LogMessage, addStack: boolean): string;
    /**
     * Render error as stack
     * @param error Return error as Promise
     * @returns {Promise<string>|Promise} Promise for stack
     */
    static renderError(error: Error): Promise<string>;
}
