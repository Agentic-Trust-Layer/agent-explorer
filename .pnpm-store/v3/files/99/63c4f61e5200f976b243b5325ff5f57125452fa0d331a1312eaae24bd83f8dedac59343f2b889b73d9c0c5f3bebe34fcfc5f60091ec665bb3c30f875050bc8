"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinNameToTypeMap = exports.nonEvmCoinNameToTypeMap = exports.evmCoinNameToTypeMap = void 0;
const coinTypeToNameMap_js_1 = require("./coinTypeToNameMap.js");
exports.evmCoinNameToTypeMap = Object.freeze(Object.fromEntries(Object.entries(coinTypeToNameMap_js_1.evmCoinTypeToNameMap).map(([k, [v]]) => [v, parseInt(k)])));
exports.nonEvmCoinNameToTypeMap = Object.freeze(Object.fromEntries(Object.entries(coinTypeToNameMap_js_1.nonEvmCoinTypeToNameMap).map(([k, [v]]) => [v, parseInt(k)])));
exports.coinNameToTypeMap = Object.freeze({
    ...exports.evmCoinNameToTypeMap,
    ...exports.nonEvmCoinNameToTypeMap,
});
//# sourceMappingURL=coinNameToTypeMap.js.map