import { type Hex } from "./bytes.js";
export declare const stripHexPrefix: (str: string) => string;
export declare const rawChecksumAddress: ({ address, hash, length, }: {
    address: string[];
    hash: Uint8Array;
    length: number;
}) => Hex;
export declare function checksumAddress(address_: string, chainId?: number): string;
export declare function isAddress(address: string): boolean;
export declare function isValidChecksumAddress(address: string, chainId?: number): boolean;
export declare const createHexChecksummedEncoder: (chainId?: number) => (source: Uint8Array) => string;
export declare const createHexChecksummedDecoder: (chainId?: number) => (source: string) => Uint8Array;
//# sourceMappingURL=hex.d.ts.map