import * as formats from "./coins.js";
import { coinNameToTypeMap, evmCoinNameToTypeMap, nonEvmCoinNameToTypeMap, } from "./consts/coinNameToTypeMap.js";
import { coinTypeToNameMap, evmCoinTypeToNameMap, nonEvmCoinTypeToNameMap, } from "./consts/coinTypeToNameMap.js";
import { SLIP44_MSB, coinTypeToEvmChainId } from "./utils/evm.js";
export { coinNameToTypeMap, coinTypeToNameMap, evmCoinNameToTypeMap, evmCoinTypeToNameMap, nonEvmCoinNameToTypeMap, nonEvmCoinTypeToNameMap, };
export const getCoderByCoinName = (name) => {
    const format = formats[name];
    if (!format) {
        // EVM coin
        const coinType = coinNameToTypeMap[name];
        if (!coinType)
            throw new Error(`Unsupported coin: ${name}`);
        const evmChainId = coinTypeToEvmChainId(coinType);
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
export const getCoderByCoinType = (coinType) => {
    const names = coinTypeToNameMap[String(coinType)];
    // https://docs.ens.domains/ens-improvement-proposals/ensip-11-evmchain-address-resolution
    if (coinType >= SLIP44_MSB) {
        // EVM coin
        const evmChainId = coinTypeToEvmChainId(coinType);
        const isUnknownChain = !names;
        const name = isUnknownChain ? `Unknown Chain (${evmChainId})` : names[0]; // name is derivable
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
//# sourceMappingURL=index.js.map