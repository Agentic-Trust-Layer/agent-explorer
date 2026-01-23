"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoderByCoinTypeAsync = exports.getCoderByCoinNameAsync = void 0;
const coins_js_1 = require("./coins.js");
const coinNameToTypeMap_js_1 = require("./consts/coinNameToTypeMap.js");
const coinTypeToNameMap_js_1 = require("./consts/coinTypeToNameMap.js");
const evm_js_1 = require("./utils/evm.js");
const getCoderByCoinNameAsync = async (name) => {
    const coinType = coinNameToTypeMap_js_1.coinNameToTypeMap[name];
    if (coinType === undefined)
        throw new Error(`Unsupported coin: ${name}`);
    if (coinType >= evm_js_1.SLIP44_MSB) {
        const evmChainId = (0, evm_js_1.coinTypeToEvmChainId)(coinType);
        return {
            name: name,
            coinType,
            evmChainId,
            encode: coins_js_1.eth.encode,
            decode: coins_js_1.eth.decode,
        };
    }
    const mod = await Promise.resolve(`${`./coin/${name}`}`).then(s => require(s));
    if (!mod)
        throw new Error(`Failed to load coin: ${name}`);
    return mod[name];
};
exports.getCoderByCoinNameAsync = getCoderByCoinNameAsync;
const getCoderByCoinTypeAsync = async (coinType) => {
    const names = coinTypeToNameMap_js_1.coinTypeToNameMap[String(coinType)];
    if (coinType >= evm_js_1.SLIP44_MSB) {
        const evmChainId = (0, evm_js_1.coinTypeToEvmChainId)(coinType);
        const isUnknownChain = !names;
        const name = isUnknownChain ? `Unknown Chain (${evmChainId})` : names[0];
        return {
            name,
            coinType: coinType,
            evmChainId,
            isUnknownChain,
            encode: coins_js_1.eth.encode,
            decode: coins_js_1.eth.decode,
        };
    }
    if (!names)
        throw new Error(`Unsupported coin type: ${coinType}`);
    const [name] = names;
    const mod = await Promise.resolve(`${`./coin/${name}`}`).then(s => require(s));
    if (!mod)
        throw new Error(`Failed to load coin: ${name}`);
    return mod[name];
};
exports.getCoderByCoinTypeAsync = getCoderByCoinTypeAsync;
//# sourceMappingURL=async.js.map