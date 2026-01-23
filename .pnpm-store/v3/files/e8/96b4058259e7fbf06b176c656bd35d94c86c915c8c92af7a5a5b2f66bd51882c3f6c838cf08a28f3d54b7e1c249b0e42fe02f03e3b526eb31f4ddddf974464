"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryControl = exports.getLogControl = exports.help = exports.MessageFormatUtils = exports.LinkedList = exports.SimpleMap = exports.LogLevel = exports.LoggerType = exports.LogFormat = exports.DateFormatEnum = exports.DateFormat = exports.CategoryLogFormat = exports.MessageBufferLoggerImpl = exports.ConsoleLoggerImpl = exports.AbstractLogger = exports.LFService = exports.LogGroupRule = exports.LoggerFactoryOptions = exports.CategoryServiceFactory = exports.CategoryMessageBufferLoggerImpl = exports.CategoryConfiguration = exports.CategoryRuntimeSettings = exports.Category = exports.CategoryDelegateLoggerImpl = exports.CategoryConsoleLoggerImpl = exports.AbstractCategoryLogger = exports.ExtensionHelper = void 0;
var LogGroupControl_1 = require("./control/LogGroupControl");
var CategoryServiceControl_1 = require("./control/CategoryServiceControl");
// Public stuff we export for extension
__exportStar(require("./extension/MessagesToExtensionJSON"), exports);
__exportStar(require("./extension/MessagesFromExtensionJSON"), exports);
__exportStar(require("./extension/ExtensionMessageJSON"), exports);
var ExtensionHelper_1 = require("./extension/ExtensionHelper");
Object.defineProperty(exports, "ExtensionHelper", { enumerable: true, get: function () { return ExtensionHelper_1.ExtensionHelper; } });
// Category related
var AbstractCategoryLogger_1 = require("./log/category/AbstractCategoryLogger");
Object.defineProperty(exports, "AbstractCategoryLogger", { enumerable: true, get: function () { return AbstractCategoryLogger_1.AbstractCategoryLogger; } });
var CategoryConsoleLoggerImpl_1 = require("./log/category/CategoryConsoleLoggerImpl");
Object.defineProperty(exports, "CategoryConsoleLoggerImpl", { enumerable: true, get: function () { return CategoryConsoleLoggerImpl_1.CategoryConsoleLoggerImpl; } });
var CategoryDelegateLoggerImpl_1 = require("./log/category/CategoryDelegateLoggerImpl");
Object.defineProperty(exports, "CategoryDelegateLoggerImpl", { enumerable: true, get: function () { return CategoryDelegateLoggerImpl_1.CategoryDelegateLoggerImpl; } });
var Category_1 = require("./log/category/Category");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return Category_1.Category; } });
var CategoryRuntimeSettings_1 = require("./log/category/CategoryRuntimeSettings");
Object.defineProperty(exports, "CategoryRuntimeSettings", { enumerable: true, get: function () { return CategoryRuntimeSettings_1.CategoryRuntimeSettings; } });
var CategoryConfiguration_1 = require("./log/category/CategoryConfiguration");
Object.defineProperty(exports, "CategoryConfiguration", { enumerable: true, get: function () { return CategoryConfiguration_1.CategoryConfiguration; } });
var CategoryMessageBufferImpl_1 = require("./log/category/CategoryMessageBufferImpl");
Object.defineProperty(exports, "CategoryMessageBufferLoggerImpl", { enumerable: true, get: function () { return CategoryMessageBufferImpl_1.CategoryMessageBufferLoggerImpl; } });
var CategoryServiceFactory_1 = require("./log/category/CategoryServiceFactory");
Object.defineProperty(exports, "CategoryServiceFactory", { enumerable: true, get: function () { return CategoryServiceFactory_1.CategoryServiceFactory; } });
var LoggerFactoryOptions_1 = require("./log/standard/LoggerFactoryOptions");
Object.defineProperty(exports, "LoggerFactoryOptions", { enumerable: true, get: function () { return LoggerFactoryOptions_1.LoggerFactoryOptions; } });
var LogGroupRule_1 = require("./log/standard/LogGroupRule");
Object.defineProperty(exports, "LogGroupRule", { enumerable: true, get: function () { return LogGroupRule_1.LogGroupRule; } });
var LFService_1 = require("./log/standard/LFService");
Object.defineProperty(exports, "LFService", { enumerable: true, get: function () { return LFService_1.LFService; } });
var AbstractLogger_1 = require("./log/standard/AbstractLogger");
Object.defineProperty(exports, "AbstractLogger", { enumerable: true, get: function () { return AbstractLogger_1.AbstractLogger; } });
var ConsoleLoggerImpl_1 = require("./log/standard/ConsoleLoggerImpl");
Object.defineProperty(exports, "ConsoleLoggerImpl", { enumerable: true, get: function () { return ConsoleLoggerImpl_1.ConsoleLoggerImpl; } });
var MessageBufferLoggerImpl_1 = require("./log/standard/MessageBufferLoggerImpl");
Object.defineProperty(exports, "MessageBufferLoggerImpl", { enumerable: true, get: function () { return MessageBufferLoggerImpl_1.MessageBufferLoggerImpl; } });
var LoggerOptions_1 = require("./log/LoggerOptions");
Object.defineProperty(exports, "CategoryLogFormat", { enumerable: true, get: function () { return LoggerOptions_1.CategoryLogFormat; } });
Object.defineProperty(exports, "DateFormat", { enumerable: true, get: function () { return LoggerOptions_1.DateFormat; } });
Object.defineProperty(exports, "DateFormatEnum", { enumerable: true, get: function () { return LoggerOptions_1.DateFormatEnum; } });
Object.defineProperty(exports, "LogFormat", { enumerable: true, get: function () { return LoggerOptions_1.LogFormat; } });
Object.defineProperty(exports, "LoggerType", { enumerable: true, get: function () { return LoggerOptions_1.LoggerType; } });
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return LoggerOptions_1.LogLevel; } });
// Utilities
var DataStructures_1 = require("./utils/DataStructures");
Object.defineProperty(exports, "SimpleMap", { enumerable: true, get: function () { return DataStructures_1.SimpleMap; } });
Object.defineProperty(exports, "LinkedList", { enumerable: true, get: function () { return DataStructures_1.LinkedList; } });
__exportStar(require("./utils/JSONHelper"), exports);
var MessageUtils_1 = require("./utils/MessageUtils");
Object.defineProperty(exports, "MessageFormatUtils", { enumerable: true, get: function () { return MessageUtils_1.MessageFormatUtils; } });
/*
 Functions to export on TSL libarary var.
*/
// Export help function
function help() {
    /* tslint:disable:no-console */
    console.log("help()\n   ** Shows this help\n\n getLogControl(): LoggerControl\n   ** Returns LoggerControl Object, use to dynamically change loglevels for log4j logging.\n   ** Call .help() on LoggerControl object for available options.\n\n getCategoryControl(): CategoryServiceControl\n   ** Returns CategoryServiceControl Object, use to dynamically change loglevels for category logging.\n   ** Call .help() on CategoryServiceControl object for available options.\n");
    /* tslint:enable:no-console */
}
exports.help = help;
// Export LogControl function (log4j)
function getLogControl() {
    return new LogGroupControl_1.LoggerControlImpl();
}
exports.getLogControl = getLogControl;
// Export CategoryControl function
function getCategoryControl() {
    return new CategoryServiceControl_1.CategoryServiceControlImpl();
}
exports.getCategoryControl = getCategoryControl;
//# sourceMappingURL=typescript-logging.js.map