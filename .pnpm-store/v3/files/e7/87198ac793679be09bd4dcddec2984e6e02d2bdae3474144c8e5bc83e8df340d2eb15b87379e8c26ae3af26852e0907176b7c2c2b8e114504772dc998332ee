import { equalBytes } from "@noble/curves/abstract/utils";
import { coerce } from "./coerce.js";
import { decodeVarint, encodeVarint, varintEncodingLength } from "./varint.js";
/**
 * Represents a multihash digest which carries information about the
 * hashing algorithm and an actual hash digest.
 */
export class Digest {
    /**
     * Creates a multihash digest.
     */
    constructor(code, size, digest, bytes) {
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "size", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "digest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bytes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.code = code;
        this.size = size;
        this.digest = digest;
        this.bytes = bytes;
    }
}
/**
 * Creates a multihash digest.
 */
export const createDigest = (code, digest) => {
    const size = digest.byteLength;
    const sizeOffset = varintEncodingLength(code);
    const digestOffset = sizeOffset + varintEncodingLength(size);
    const bytes = new Uint8Array(digestOffset + size);
    encodeVarint(code, bytes, 0);
    encodeVarint(size, bytes, sizeOffset);
    bytes.set(digest, digestOffset);
    return new Digest(code, size, digest, bytes);
};
/**
 * Turns bytes representation of multihash digest into an instance.
 */
export const decodeDigest = (multihash) => {
    const bytes = coerce(multihash);
    const [code, sizeOffset] = decodeVarint(bytes);
    const [size, digestOffset] = decodeVarint(bytes.subarray(sizeOffset));
    const digest = bytes.subarray(sizeOffset + digestOffset);
    if (digest.byteLength !== size) {
        throw new Error("Incorrect length");
    }
    return new Digest(code, size, digest, bytes);
};
export const digestEquals = (a, b) => {
    if (a === b) {
        return true;
    }
    else {
        const data = b;
        return (a.code === data.code &&
            a.size === data.size &&
            data.bytes instanceof Uint8Array &&
            equalBytes(a.bytes, data.bytes));
    }
};
//# sourceMappingURL=digest.js.map