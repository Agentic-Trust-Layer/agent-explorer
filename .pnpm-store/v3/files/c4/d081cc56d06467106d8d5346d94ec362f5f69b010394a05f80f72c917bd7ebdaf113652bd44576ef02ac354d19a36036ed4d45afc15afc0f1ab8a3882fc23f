import { base32, base36, base58btc, } from "./coders.js";
import { coerce } from "./coerce.js";
import { Digest, createDigest, decodeDigest, digestEquals } from "./digest.js";
import { decodeVarint, encodeVarint, varintEncodingLength } from "./varint.js";
export function format(link, base) {
    const { bytes, version } = link;
    switch (version) {
        case 0:
            return toStringV0(bytes, baseCache(link), base ?? base58btc.encode);
        default:
            return toStringV1(bytes, baseCache(link), (base ?? base32.encode));
    }
}
export function toJSON(link) {
    return {
        "/": format(link),
    };
}
export function fromJSON(json) {
    return CID.parse(json["/"]);
}
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
export class CID {
    /**
     * @param version - Version of the CID
     * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
     * @param multihash - (Multi)hash of the of the content.
     */
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
        // flag to serializers that this is a CID and
        // should be treated specially
        this["/"] = bytes;
    }
    /**
     * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
     * please either use `CID.asCID(cid)` or switch to new signalling mechanism
     *
     * @deprecated
     */
    get asCID() {
        return this;
    }
    // ArrayBufferView
    get byteOffset() {
        return this.bytes.byteOffset;
    }
    // ArrayBufferView
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
                // sha2-256
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
                const multihash = createDigest(code, digest);
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
            digestEquals(self.multihash, unknown.multihash));
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
    // Legacy
    [Symbol.for("nodejs.util.inspect.custom")]() {
        return `CID(${this.toString()})`;
    }
    /**
     * Takes any input `value` and returns a `CID` instance if it was
     * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
     * it will return value back. If `value` is not instance of this CID
     * class, but is compatible CID it will return new instance of this
     * `CID` class. Otherwise returns null.
     *
     * This allows two different incompatible versions of CID library to
     * co-exist and interop as long as binary interface is compatible.
     */
    static asCID(input) {
        if (input == null) {
            return null;
        }
        const value = input;
        if (value instanceof CID) {
            // If value is instance of CID then we're all set.
            return value;
        }
        else if ((value["/"] != null && value["/"] === value.bytes) ||
            value.asCID === value) {
            // If value isn't instance of this CID class but `this.asCID === this` or
            // `value['/'] === value.bytes` is true it is CID instance coming from a
            // different implementation (diff version or duplicate). In that case we
            // rebase it to this `CID` implementation so caller is guaranteed to get
            // instance with expected API.
            const { version, code, multihash, bytes } = value;
            return new CID(version, code, multihash, bytes ?? encodeCID(version, code, multihash.bytes));
        }
        else if (value[cidSymbol] === true) {
            // If value is a CID from older implementation that used to be tagged via
            // symbol we still rebase it to the this `CID` implementation by
            // delegating that to a constructor.
            const { version, multihash, code } = value;
            const digest = decodeDigest(multihash);
            return CID.create(version, code, digest);
        }
        else {
            // Otherwise value is not a CID (or an incompatible version of it) in
            // which case we return `null`.
            return null;
        }
    }
    /**
     * @param version - Version of the CID
     * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
     * @param digest - (Multi)hash of the of the content.
     */
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
    /**
     * Simplified version of `create` for CIDv0.
     */
    static createV0(digest) {
        return CID.create(0, DAG_PB_CODE, digest);
    }
    /**
     * Simplified version of `create` for CIDv1.
     *
     * @param code - Content encoding format code.
     * @param digest - Multihash of the content.
     */
    static createV1(code, digest) {
        return CID.create(1, code, digest);
    }
    /**
     * Decoded a CID from its binary representation. The byte array must contain
     * only the CID with no additional bytes.
     *
     * An error will be thrown if the bytes provided do not contain a valid
     * binary representation of a CID.
     */
    static decode(bytes) {
        let [cid, remainder] = CID.decodeFirst(bytes);
        if (remainder.length !== 0) {
            [cid, remainder] = CID.decodeFirst(Uint8Array.from([0, DAG_PB_CODE, ...bytes]));
            if (remainder.length !== 0)
                throw new Error("Incorrect length");
        }
        return cid;
    }
    /**
     * Decoded a CID from its binary representation at the beginning of a byte
     * array.
     *
     * Returns an array with the first element containing the CID and the second
     * element containing the remainder of the original byte array. The remainder
     * will be a zero-length byte array if the provided bytes only contained a
     * binary CID representation.
     */
    static decodeFirst(bytes) {
        const specs = CID.inspectBytes(bytes);
        const prefixSize = specs.size - specs.multihashSize;
        const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
        if (multihashBytes.byteLength !== specs.multihashSize) {
            throw new Error("Incorrect length");
        }
        const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
        const digest = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
        const cid = specs.version === 0
            ? CID.createV0(digest)
            : CID.createV1(specs.codec, digest);
        return [cid, bytes.subarray(specs.size)];
    }
    /**
     * Inspect the initial bytes of a CID to determine its properties.
     *
     * Involves decoding up to 4 varints. Typically this will require only 4 to 6
     * bytes but for larger multicodec code values and larger multihash digest
     * lengths these varints can be quite large. It is recommended that at least
     * 10 bytes be made available in the `initialBytes` argument for a complete
     * inspection.
     */
    static inspectBytes(initialBytes) {
        let offset = 0;
        const next = () => {
            const [i, length] = decodeVarint(initialBytes.subarray(offset));
            offset += length;
            return i;
        };
        let version = next();
        let codec = DAG_PB_CODE;
        if (version === 18) {
            // CIDv0
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
        const multihashCode = next(); // multihash code
        const digestSize = next(); // multihash length
        const size = offset + digestSize;
        const multihashSize = size - prefixSize;
        return { version, codec, multihashCode, digestSize, multihashSize, size };
    }
    /**
     * Takes cid in a string representation and creates an instance. If `base`
     * decoder is not provided will use a default from the configuration. It will
     * throw an error if encoding of the CID is not compatible with supplied (or
     * a default decoder).
     */
    static parse(source, base) {
        const [prefix, bytes] = parseCIDtoBytes(source, base);
        const cid = CID.decode(bytes);
        // Cache string representation to avoid computing it on `this.toString()`
        baseCache(cid).set(prefix, source);
        return cid;
    }
}
function parseCIDtoBytes(source, base) {
    switch (source[0]) {
        // CIDv0 is parsed differently
        case "Q": {
            const decoder = base ?? base58btc;
            return [
                base58btc.prefix,
                decoder.decode(`${base58btc.prefix}${source}`),
            ];
        }
        case base58btc.prefix: {
            const decoder = base ?? base58btc;
            return [base58btc.prefix, decoder.decode(source)];
        }
        case base32.prefix: {
            const decoder = base ?? base32;
            return [base32.prefix, decoder.decode(source)];
        }
        case base36.prefix: {
            const decoder = base ?? base36;
            return [base36.prefix, decoder.decode(source)];
        }
        default: {
            source = `z${source}`;
            return [source[0], base58btc.decode(source)];
        }
    }
}
function toStringV0(bytes, cache, base) {
    const { prefix } = base;
    if (prefix !== base58btc.prefix) {
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
    const codeOffset = varintEncodingLength(version);
    const hashOffset = codeOffset + varintEncodingLength(code);
    const bytes = new Uint8Array(hashOffset + multihash.byteLength);
    encodeVarint(version, bytes, 0);
    encodeVarint(code, bytes, codeOffset);
    bytes.set(multihash, hashOffset);
    return bytes;
}
const cidSymbol = Symbol.for("@ipld/js-cid/CID");
//# sourceMappingURL=cid.js.map