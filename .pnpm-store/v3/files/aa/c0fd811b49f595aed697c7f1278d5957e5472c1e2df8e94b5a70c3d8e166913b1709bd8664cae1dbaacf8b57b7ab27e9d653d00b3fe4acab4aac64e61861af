"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digestEquals = exports.decodeDigest = exports.createDigest = exports.Digest = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const coerce_js_1 = require("./coerce.js");
const varint_js_1 = require("./varint.js");
class Digest {
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
exports.Digest = Digest;
const createDigest = (code, digest) => {
    const size = digest.byteLength;
    const sizeOffset = (0, varint_js_1.varintEncodingLength)(code);
    const digestOffset = sizeOffset + (0, varint_js_1.varintEncodingLength)(size);
    const bytes = new Uint8Array(digestOffset + size);
    (0, varint_js_1.encodeVarint)(code, bytes, 0);
    (0, varint_js_1.encodeVarint)(size, bytes, sizeOffset);
    bytes.set(digest, digestOffset);
    return new Digest(code, size, digest, bytes);
};
exports.createDigest = createDigest;
const decodeDigest = (multihash) => {
    const bytes = (0, coerce_js_1.coerce)(multihash);
    const [code, sizeOffset] = (0, varint_js_1.decodeVarint)(bytes);
    const [size, digestOffset] = (0, varint_js_1.decodeVarint)(bytes.subarray(sizeOffset));
    const digest = bytes.subarray(sizeOffset + digestOffset);
    if (digest.byteLength !== size) {
        throw new Error("Incorrect length");
    }
    return new Digest(code, size, digest, bytes);
};
exports.decodeDigest = decodeDigest;
const digestEquals = (a, b) => {
    if (a === b) {
        return true;
    }
    else {
        const data = b;
        return (a.code === data.code &&
            a.size === data.size &&
            data.bytes instanceof Uint8Array &&
            (0, utils_1.equalBytes)(a.bytes, data.bytes));
    }
};
exports.digestEquals = digestEquals;
//# sourceMappingURL=digest.js.map