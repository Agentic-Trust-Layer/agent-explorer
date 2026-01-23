"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CID = exports.fromJSON = exports.toJSON = exports.format = void 0;
const coders_js_1 = require("./coders.js");
const coerce_js_1 = require("./coerce.js");
const digest_js_1 = require("./digest.js");
const varint_js_1 = require("./varint.js");
function format(link, base) {
    const { bytes, version } = link;
    switch (version) {
        case 0:
            return toStringV0(bytes, baseCache(link), base ?? coders_js_1.base58btc.encode);
        default:
            return toStringV1(bytes, baseCache(link), (base ?? coders_js_1.base32.encode));
    }
}
exports.format = format;
function toJSON(link) {
    return {
        "/": format(link),
    };
}
exports.toJSON = toJSON;
function fromJSON(json) {
    return CID.parse(json["/"]);
}
exports.fromJSON = fromJSON;
const cache = new WeakMap();
function baseCache(cid) {
    const baseCache = cache.get(cid);
    if (baseCache == null) {
        const baseCache = new Map();
        cache.set(cid, baseCache);
        return baseCache;
    }
    return baseCache;
}
class CID {
    constructor(version, code, multihash, bytes) {
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "multihash", {
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
        Object.defineProperty(this, "/", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.code = code;
        this.version = version;
        this.multihash = multihash;
        this.bytes = bytes;
        this["/"] = bytes;
    }
    get asCID() {
        return this;
    }
    get byteOffset() {
        return this.bytes.byteOffset;
    }
    get byteLength() {
        return this.bytes.byteLength;
    }
    toV0() {
        switch (this.version) {
            case 0: {
                return this;
            }
            case 1: {
                const { code, multihash } = this;
                if (code !== DAG_PB_CODE) {
                    throw new Error("Cannot convert a non dag-pb CID to CIDv0");
                }
                if (multihash.code !== SHA_256_CODE) {
                    throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
                }
                return CID.createV0(multihash);
            }
            default: {
                throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
            }
        }
    }
    toV1() {
        switch (this.version) {
            case 0: {
                const { code, digest } = this.multihash;
                const multihash = (0, digest_js_1.createDigest)(code, digest);
                return CID.createV1(this.code, multihash);
            }
            case 1: {
                return this;
            }
            default: {
                throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
            }
        }
    }
    equals(other) {
        return CID.equals(this, other);
    }
    static equals(self, other) {
        const unknown = other;
        return (unknown != null &&
            self.code === unknown.code &&
            self.version === unknown.version &&
            (0, digest_js_1.digestEquals)(self.multihash, unknown.multihash));
    }
    toString(base) {
        return format(this, base);
    }
    toJSON() {
        return { "/": format(this) };
    }
    link() {
        return this;
    }
    get [Symbol.toStringTag]() {
        return "CID";
    }
    [Symbol.for("nodejs.util.inspect.custom")]() {
        return `CID(${this.toString()})`;
    }
    static asCID(input) {
        if (input == null) {
            return null;
        }
        const value = input;
        if (value instanceof CID) {
            return value;
        }
        else if ((value["/"] != null && value["/"] === value.bytes) ||
            value.asCID === value) {
            const { version, code, multihash, bytes } = value;
            return new CID(version, code, multihash, bytes ?? encodeCID(version, code, multihash.bytes));
        }
        else if (value[cidSymbol] === true) {
            const { version, multihash, code } = value;
            const digest = (0, digest_js_1.decodeDigest)(multihash);
            return CID.create(version, code, digest);
        }
        else {
            return null;
        }
    }
    static create(version, code, digest) {
        if (typeof code !== "number") {
            throw new Error("String codecs are no longer supported");
        }
        if (!(digest.bytes instanceof Uint8Array)) {
            throw new Error("Invalid digest");
        }
        switch (version) {
            case 0: {
                if (code !== DAG_PB_CODE) {
                    throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
                }
                else {
                    return new CID(version, code, digest, digest.bytes);
                }
            }
            case 1: {
                const bytes = encodeCID(version, code, digest.bytes);
                return new CID(version, code, digest, bytes);
            }
            default: {
                throw new Error("Invalid version");
            }
        }
    }
    static createV0(digest) {
        return CID.create(0, DAG_PB_CODE, digest);
    }
    static createV1(code, digest) {
        return CID.create(1, code, digest);
    }
    static decode(bytes) {
        let [cid, remainder] = CID.decodeFirst(bytes);
        if (remainder.length !== 0) {
            [cid, remainder] = CID.decodeFirst(Uint8Array.from([0, DAG_PB_CODE, ...bytes]));
            if (remainder.length !== 0)
                throw new Error("Incorrect length");
        }
        return cid;
    }
    static decodeFirst(bytes) {
        const specs = CID.inspectBytes(bytes);
        const prefixSize = specs.size - specs.multihashSize;
        const multihashBytes = (0, coerce_js_1.coerce)(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
        if (multihashBytes.byteLength !== specs.multihashSize) {
            throw new Error("Incorrect length");
        }
        const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
        const digest = new digest_js_1.Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
        const cid = specs.version === 0
            ? CID.createV0(digest)
            : CID.createV1(specs.codec, digest);
        return [cid, bytes.subarray(specs.size)];
    }
    static inspectBytes(initialBytes) {
        let offset = 0;
        const next = () => {
            const [i, length] = (0, varint_js_1.decodeVarint)(initialBytes.subarray(offset));
            offset += length;
            return i;
        };
        let version = next();
        let codec = DAG_PB_CODE;
        if (version === 18) {
            version = 0;
            offset = 0;
        }
        else {
            codec = next();
        }
        if (version !== 0 && version !== 1) {
            throw new RangeError(`Invalid CID version ${version}`);
        }
        const prefixSize = offset;
        const multihashCode = next();
        const digestSize = next();
        const size = offset + digestSize;
        const multihashSize = size - prefixSize;
        return { version, codec, multihashCode, digestSize, multihashSize, size };
    }
    static parse(source, base) {
        const [prefix, bytes] = parseCIDtoBytes(source, base);
        const cid = CID.decode(bytes);
        baseCache(cid).set(prefix, source);
        return cid;
    }
}
exports.CID = CID;
function parseCIDtoBytes(source, base) {
    switch (source[0]) {
        case "Q": {
            const decoder = base ?? coders_js_1.base58btc;
            return [
                coders_js_1.base58btc.prefix,
                decoder.decode(`${coders_js_1.base58btc.prefix}${source}`),
            ];
        }
        case coders_js_1.base58btc.prefix: {
            const decoder = base ?? coders_js_1.base58btc;
            return [coders_js_1.base58btc.prefix, decoder.decode(source)];
        }
        case coders_js_1.base32.prefix: {
            const decoder = base ?? coders_js_1.base32;
            return [coders_js_1.base32.prefix, decoder.decode(source)];
        }
        case coders_js_1.base36.prefix: {
            const decoder = base ?? coders_js_1.base36;
            return [coders_js_1.base36.prefix, decoder.decode(source)];
        }
        default: {
            source = `z${source}`;
            return [source[0], coders_js_1.base58btc.decode(source)];
        }
    }
}
function toStringV0(bytes, cache, base) {
    const { prefix } = base;
    if (prefix !== coders_js_1.base58btc.prefix) {
        throw Error(`Cannot string encode V0 in ${base.name} encoding`);
    }
    const cid = cache.get(prefix);
    if (cid == null) {
        const cid = base.encode(bytes).slice(1);
        cache.set(prefix, cid);
        return cid;
    }
    else {
        return cid;
    }
}
function toStringV1(bytes, cache, base) {
    const { prefix } = base;
    const cid = cache.get(prefix);
    if (cid == null) {
        const cid = base.encode(bytes);
        cache.set(prefix, cid);
        return cid;
    }
    else {
        return cid;
    }
}
const DAG_PB_CODE = 0x70;
const SHA_256_CODE = 0x12;
function encodeCID(version, code, multihash) {
    const codeOffset = (0, varint_js_1.varintEncodingLength)(version);
    const hashOffset = codeOffset + (0, varint_js_1.varintEncodingLength)(code);
    const bytes = new Uint8Array(hashOffset + multihash.byteLength);
    (0, varint_js_1.encodeVarint)(version, bytes, 0);
    (0, varint_js_1.encodeVarint)(code, bytes, codeOffset);
    bytes.set(multihash, hashOffset);
    return bytes;
}
const cidSymbol = Symbol.for("@ipld/js-cid/CID");
//# sourceMappingURL=cid.js.map