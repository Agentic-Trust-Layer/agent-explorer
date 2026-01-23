import { coinNameToTypeMap, evmCoinNameToTypeMap, nonEvmCoinNameToTypeMap } from "./consts/coinNameToTypeMap.js";
import { coinTypeToNameMap, evmCoinTypeToNameMap, nonEvmCoinTypeToNameMap } from "./consts/coinTypeToNameMap.js";
import type { Coin, CoinName, CoinType, DecoderFunction, EncoderFunction, EvmCoinName, EvmCoinType, GetCoderByCoinName, GetCoderByCoinType } from "./types.js";
export type { Coin, CoinName, CoinType, DecoderFunction, EncoderFunction, EvmCoinName, EvmCoinType, };
export { coinNameToTypeMap, coinTypeToNameMap, evmCoinNameToTypeMap, evmCoinTypeToNameMap, nonEvmCoinNameToTypeMap, nonEvmCoinTypeToNameMap, };
export declare const getCoderByCoinName: <TCoinName extends string = string>(name: TCoinName) => GetCoderByCoinName<TCoinName>;
export declare const getCoderByCoinType: <TCoinType extends number = number>(coinType: TCoinType) => GetCoderByCoinType<TCoinType>;
