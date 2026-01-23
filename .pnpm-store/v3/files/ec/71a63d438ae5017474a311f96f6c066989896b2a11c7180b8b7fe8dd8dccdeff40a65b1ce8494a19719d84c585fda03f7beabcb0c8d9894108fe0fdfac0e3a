import { eth } from "./coins.js";
import { coinNameToTypeMap } from "./consts/coinNameToTypeMap.js";
import { coinTypeToNameMap } from "./consts/coinTypeToNameMap.js";
import { SLIP44_MSB, coinTypeToEvmChainId } from "./utils/evm.js";
export const getCoderByCoinNameAsync = async (name) => {
    const coinType = coinNameToTypeMap[name];
    if (coinType === undefined)
        throw new Error(`Unsupported coin: ${name}`);
    if (coinType >= SLIP44_MSB) {
        // EVM coin
        const evmChainId = coinTypeToEvmChainId(coinType);
        return {
            name: name,
            coinType,
            evmChainId,
            encode: eth.encode,
            decode: eth.decode,
        };
    }
    const mod = await import(`./coin/${name}`);
    if (!mod)
        throw new Error(`Failed to load coin: ${name}`);
    return mod[name];
};
export const getCoderByCoinTypeAsync = async (coinType) => {
    const names = coinTypeToNameMap[String(coinType)];
    if (coinType >= SLIP44_MSB) {
        // EVM coin
        const evmChainId = coinTypeToEvmChainId(coinType);
        const isUnknownChain = !names;
        const name = isUnknownChain ? `Unknown Chain (${evmChainId})` : names[0];
        return {
            name,
            coinType: coinType,
            evmChainId,
            isUnknownChain,
            encode: eth.encode,
            decode: eth.decode,
        };
    }
    if (!names)
        throw new Error(`Unsupported coin type: ${coinType}`);
    const [name] = names;
    const mod = await import(`./coin/${name}`);
    if (!mod)
        throw new Error(`Failed to load coin: ${name}`);
    return mod[name];
};
//# sourceMappingURL=async.js.map