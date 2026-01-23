"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryDelegateLoggerImpl = void 0;
/**
 * Delegate logger, delegates logging to given logger (constructor).
 */
var CategoryDelegateLoggerImpl = /** @class */ (function () {
    function CategoryDelegateLoggerImpl(delegate) {
        this._delegate = delegate;
    }
    Object.defineProperty(CategoryDelegateLoggerImpl.prototype, "delegate", {
        get: function () {
            return this._delegate;
        },
        set: function (value) {
            this._delegate = value;
        },
        enumerable: false,
        configurable: true
    });
    CategoryDelegateLoggerImpl.prototype.trace = function (msg) {
        var _a;
        var categories = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            categories[_i - 1] = arguments[_i];
        }
        (_a = this._delegate).trace.apply(_a, __spreadArray([msg], categories, false));
    };
    CategoryDelegateLoggerImpl.prototype.debug = function (msg) {
        var _a;
        var categories = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            categories[_i - 1] = arguments[_i];
        }
        (_a = this._delegate).debug.apply(_a, __spreadArray([msg], categories, false));
    };
    CategoryDelegateLoggerImpl.prototype.info = function (msg) {
        var _a;
        var categories = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            categories[_i - 1] = arguments[_i];
        }
        (_a = this._delegate).info.apply(_a, __spreadArray([msg], categories, false));
    };
    CategoryDelegateLoggerImpl.prototype.warn = function (msg) {
        var _a;
        var categories = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            categories[_i - 1] = arguments[_i];
        }
        (_a = this._delegate).warn.apply(_a, __spreadArray([msg], categories, false));
    };
    CategoryDelegateLoggerImpl.prototype.error = function (msg, error) {
        var _a;
        var categories = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            categories[_i - 2] = arguments[_i];
        }
        (_a = this._delegate).error.apply(_a, __spreadArray([msg, error], categories, false));
    };
    CategoryDelegateLoggerImpl.prototype.fatal = function (msg, error) {
        var _a;
        var categories = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            categories[_i - 2] = arguments[_i];
        }
        (_a = this._delegate).fatal.apply(_a, __spreadArray([msg, error], categories, false));
    };
    CategoryDelegateLoggerImpl.prototype.resolved = function (msg, error) {
        var _a;
        var categories = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            categories[_i - 2] = arguments[_i];
        }
        (_a = this._delegate).resolved.apply(_a, __spreadArray([msg, error], categories, false));
    };
    CategoryDelegateLoggerImpl.prototype.log = function (level, msg, error) {
        var _a;
        var categories = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            categories[_i - 3] = arguments[_i];
        }
        (_a = this._delegate).log.apply(_a, __spreadArray([level, msg, error], categories, false));
    };
    return CategoryDelegateLoggerImpl;
}());
exports.CategoryDelegateLoggerImpl = CategoryDelegateLoggerImpl;
//# sourceMappingURL=CategoryDelegateLoggerImpl.js.map