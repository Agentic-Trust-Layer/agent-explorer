import { evmCoinTypeToNameMap, nonEvmCoinTypeToNameMap, } from "./coinTypeToNameMap.js";
export const evmCoinNameToTypeMap = Object.freeze(Object.fromEntries(Object.entries(evmCoinTypeToNameMap).map(([k, [v]]) => [v, parseInt(k)])));
export const nonEvmCoinNameToTypeMap = Object.freeze(Object.fromEntries(Object.entries(nonEvmCoinTypeToNameMap).map(([k, [v]]) => [v, parseInt(k)])));
export const coinNameToTypeMap = Object.freeze({
    ...evmCoinNameToTypeMap,
    ...nonEvmCoinNameToTypeMap,
});
//# sourceMappingURL=coinNameToTypeMap.js.map