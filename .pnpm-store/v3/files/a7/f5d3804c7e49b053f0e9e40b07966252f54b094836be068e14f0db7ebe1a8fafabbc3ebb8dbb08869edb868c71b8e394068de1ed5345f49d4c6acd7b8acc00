import type { MultihashDigest } from "../types.js";
/**
 * Represents a multihash digest which carries information about the
 * hashing algorithm and an actual hash digest.
 */
export declare class Digest<Code extends number, Size extends number> implements MultihashDigest {
    readonly code: Code;
    readonly size: Size;
    readonly digest: Uint8Array;
    readonly bytes: Uint8Array;
    /**
     * Creates a multihash digest.
     */
    constructor(code: Code, size: Size, digest: Uint8Array, bytes: Uint8Array);
}
/**
 * Creates a multihash digest.
 */
export declare const createDigest: <Code extends number>(code: Code, digest: Uint8Array) => Digest<Code, number>;
/**
 * Turns bytes representation of multihash digest into an instance.
 */
export declare const decodeDigest: (multihash: Uint8Array) => MultihashDigest;
export declare const digestEquals: (a: MultihashDigest, b: unknown) => b is MultihashDigest;
//# sourceMappingURL=digest.d.ts.map