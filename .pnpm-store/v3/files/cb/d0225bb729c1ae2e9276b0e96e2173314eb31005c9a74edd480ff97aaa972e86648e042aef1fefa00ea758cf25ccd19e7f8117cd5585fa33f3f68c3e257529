import { CategoryLogMessage } from "../log/category/AbstractCategoryLogger";
import { ExtensionMessageJSON } from "./ExtensionMessageJSON";
export declare class ExtensionHelper {
    private static registered;
    private constructor();
    /**
     * Enables the window event listener to listen to messages (from extensions).
     * Can be registered/enabled only once.
     */
    static register(): void;
    static processMessageFromExtension(msg: ExtensionMessageJSON<any>): void;
    static sendCategoryLogMessage(msg: CategoryLogMessage): void;
    private static sendCategoriesRuntimeUpdateMessage;
    private static sendRootCategoriesToExtension;
    /**
     * If extension integration is enabled, will send the root categories over to the extension.
     * Otherwise does nothing.
     */
    private static getCategoryAsJSON;
    private static applyLogLevel;
    private static _applyLogLevelRecursive;
    private static getAllCategories;
    private static sendMessage;
    /**
     *  Extension framework will call this to enable the integration between two,
     *  after this call the framework will respond with postMessage() messages.
     */
    private static enableExtensionIntegration;
}
