"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinTypeToEvmChainId = exports.evmChainIdToCoinType = exports.isEvmCoinType = exports.SLIP44_MSB = void 0;
exports.SLIP44_MSB = 0x80000000;
const isEvmCoinType = (coinType) => ((coinType & exports.SLIP44_MSB) !== 0);
exports.isEvmCoinType = isEvmCoinType;
const evmChainIdToCoinType = (chainId) => {
    if (chainId >= exports.SLIP44_MSB)
        throw new Error("Invalid chainId");
    return ((exports.SLIP44_MSB | chainId) >>> 0);
};
exports.evmChainIdToCoinType = evmChainIdToCoinType;
const coinTypeToEvmChainId = (coinType) => {
    if ((coinType & exports.SLIP44_MSB) === 0)
        throw new Error("Coin type is not an EVM chain");
    return (((exports.SLIP44_MSB - 1) & coinType) >>
        0);
};
exports.coinTypeToEvmChainId = coinTypeToEvmChainId;
//# sourceMappingURL=evm.js.map