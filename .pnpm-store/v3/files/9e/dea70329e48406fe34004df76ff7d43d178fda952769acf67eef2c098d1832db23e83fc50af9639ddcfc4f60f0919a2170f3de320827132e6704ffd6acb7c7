import { type Base58CheckVersion } from "./base58.js";
export type BitcoinCoderParameters = {
    hrp: string;
    p2pkhVersions: Base58CheckVersion[];
    p2shVersions: Base58CheckVersion[];
};
export declare const createBitcoinDecoder: ({ hrp, p2pkhVersions, p2shVersions, }: BitcoinCoderParameters) => (source: string) => Uint8Array;
export declare const createBitcoinEncoder: ({ hrp, p2pkhVersions, p2shVersions, }: BitcoinCoderParameters) => (source: Uint8Array) => string;
