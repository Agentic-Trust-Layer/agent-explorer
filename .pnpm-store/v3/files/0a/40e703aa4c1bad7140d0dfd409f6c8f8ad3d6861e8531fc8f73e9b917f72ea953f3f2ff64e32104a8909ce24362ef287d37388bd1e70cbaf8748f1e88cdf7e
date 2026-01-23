import type { Add, GtOrEq, Lt, Subtract } from "ts-arithmetic";
import type { EvmChainId, EvmCoinType } from "../types.js";
export declare const SLIP44_MSB = 2147483648;
export declare const isEvmCoinType: <TCoinType extends number = number>(coinType: TCoinType) => GtOrEq<TCoinType, 2147483648> extends 1 ? true : false;
type EvmChainIdToCoinType<TChainId extends EvmChainId | number = EvmChainId | number> = Lt<TChainId, typeof SLIP44_MSB> extends 1 ? Add<TChainId, typeof SLIP44_MSB> : never;
export declare const evmChainIdToCoinType: <TChainId extends number = number>(chainId: TChainId) => EvmChainIdToCoinType<TChainId>;
type CoinTypeToEvmChainId<TCoinType extends EvmCoinType | number = EvmCoinType | number> = Lt<TCoinType, typeof SLIP44_MSB> extends 1 ? never : Subtract<TCoinType, typeof SLIP44_MSB>;
export declare const coinTypeToEvmChainId: <TCoinType extends number = number>(coinType: TCoinType) => CoinTypeToEvmChainId<TCoinType>;
export {};
