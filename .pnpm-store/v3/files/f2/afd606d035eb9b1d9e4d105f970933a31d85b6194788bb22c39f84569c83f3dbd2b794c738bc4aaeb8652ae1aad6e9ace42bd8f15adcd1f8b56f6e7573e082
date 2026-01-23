type Bytes = Uint8Array;
/**
 * Convert a hexadecimal string to Bytes, the string can start with or without '0x'
 * @param hex a hexadecimal value
 * @return the resulting Bytes
 */
export declare const hexStringToBytes: (hex: string) => Bytes;
export declare const bytesToHexString: (bytes: Bytes) => string;
export type Profile = {
    encode: (value: string) => Bytes;
    decode: (value: Bytes) => string;
};
/**
 * list of known encoding/decoding for a given codec,
 * `encode` should be chosen among the `encodes` functions
 * `decode` should be chosen among the `decodes` functions
 */
export declare const profiles: {
    readonly skynet: {
        readonly encode: (value: string) => Bytes;
        readonly decode: (value: Bytes) => string;
    };
    readonly swarm: {
        readonly encode: (value: string) => Bytes;
        readonly decode: (value: Bytes) => string;
    };
    readonly ipfs: {
        readonly encode: (value: string) => Bytes;
        readonly decode: (value: Bytes) => string;
    };
    readonly ipns: {
        readonly encode: (value: string) => Bytes;
        readonly decode: (value: Bytes) => string;
    };
    readonly arweave: {
        readonly encode: (value: string) => Bytes;
        readonly decode: (value: Bytes) => string;
    };
    readonly default: {
        readonly encode: (value: string) => Bytes;
        readonly decode: (value: Bytes) => string;
    };
};
export {};
//# sourceMappingURL=profiles.d.ts.map