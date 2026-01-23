"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoderByCoinType = exports.getCoderByCoinName = exports.nonEvmCoinTypeToNameMap = exports.nonEvmCoinNameToTypeMap = exports.evmCoinTypeToNameMap = exports.evmCoinNameToTypeMap = exports.coinTypeToNameMap = exports.coinNameToTypeMap = void 0;
const formats = require("./coins.js");
const coinNameToTypeMap_js_1 = require("./consts/coinNameToTypeMap.js");
Object.defineProperty(exports, "coinNameToTypeMap", { enumerable: true, get: function () { return coinNameToTypeMap_js_1.coinNameToTypeMap; } });
Object.defineProperty(exports, "evmCoinNameToTypeMap", { enumerable: true, get: function () { return coinNameToTypeMap_js_1.evmCoinNameToTypeMap; } });
Object.defineProperty(exports, "nonEvmCoinNameToTypeMap", { enumerable: true, get: function () { return coinNameToTypeMap_js_1.nonEvmCoinNameToTypeMap; } });
const coinTypeToNameMap_js_1 = require("./consts/coinTypeToNameMap.js");
Object.defineProperty(exports, "coinTypeToNameMap", { enumerable: true, get: function () { return coinTypeToNameMap_js_1.coinTypeToNameMap; } });
Object.defineProperty(exports, "evmCoinTypeToNameMap", { enumerable: true, get: function () { return coinTypeToNameMap_js_1.evmCoinTypeToNameMap; } });
Object.defineProperty(exports, "nonEvmCoinTypeToNameMap", { enumerable: true, get: function () { return coinTypeToNameMap_js_1.nonEvmCoinTypeToNameMap; } });
const evm_js_1 = require("./utils/evm.js");
const getCoderByCoinName = (name) => {
    const format = formats[name];
    if (!format) {
        const coinType = coinNameToTypeMap_js_1.coinNameToTypeMap[name];
        if (!coinType)
            throw new Error(`Unsupported coin: ${name}`);
        const evmChainId = (0, evm_js_1.coinTypeToEvmChainId)(coinType);
        const ethFormat = formats["eth"];
        return {
            name: name,
            coinType,
            evmChainId,
            encode: ethFormat.encode,
            decode: ethFormat.decode,
        };
    }
    return format;
};
exports.getCoderByCoinName = getCoderByCoinName;
const getCoderByCoinType = (coinType) => {
    const names = coinTypeToNameMap_js_1.coinTypeToNameMap[String(coinType)];
    if (coinType >= evm_js_1.SLIP44_MSB) {
        const evmChainId = (0, evm_js_1.coinTypeToEvmChainId)(coinType);
        const isUnknownChain = !names;
        const name = isUnknownChain ? `Unknown Chain (${evmChainId})` : names[0];
        const ethFormat = formats["eth"];
        return {
            name,
            coinType: coinType,
            evmChainId,
            isUnknownChain,
            encode: ethFormat.encode,
            decode: ethFormat.decode,
        };
    }
    if (!names) {
        throw new Error(`Unsupported coin type: ${coinType}`);
    }
    const [name] = names;
    const format = formats[name];
    return format;
};
exports.getCoderByCoinType = getCoderByCoinType;
//# sourceMappingURL=index.js.map