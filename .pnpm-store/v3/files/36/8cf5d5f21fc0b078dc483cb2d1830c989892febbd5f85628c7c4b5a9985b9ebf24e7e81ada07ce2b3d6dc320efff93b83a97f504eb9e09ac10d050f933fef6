export const SLIP44_MSB = 0x80000000;
export const isEvmCoinType = (coinType) => ((coinType & SLIP44_MSB) !== 0);
export const evmChainIdToCoinType = (chainId) => {
    if (chainId >= SLIP44_MSB)
        throw new Error("Invalid chainId");
    return ((SLIP44_MSB | chainId) >>> 0);
};
export const coinTypeToEvmChainId = (coinType) => {
    if ((coinType & SLIP44_MSB) === 0)
        throw new Error("Coin type is not an EVM chain");
    return (((SLIP44_MSB - 1) & coinType) >>
        0);
};
//# sourceMappingURL=evm.js.map