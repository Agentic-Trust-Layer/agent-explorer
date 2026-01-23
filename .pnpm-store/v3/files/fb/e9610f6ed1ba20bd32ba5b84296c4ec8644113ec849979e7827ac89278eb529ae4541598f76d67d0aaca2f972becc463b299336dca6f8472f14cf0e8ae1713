import type { ByteView, MultihashDigest } from "../types.js";
import { type MultibaseDecoder, type MultibaseEncoder } from "./coders.js";
import type { DAG_PB, Link, LinkJSON, SHA_256, ToString, UnknownLink, Version } from "./link.js";
export declare function format<T extends Link<unknown, number, number, Version>, Prefix extends string>(link: T, base?: MultibaseEncoder<Prefix>): ToString<T, Prefix>;
export declare function toJSON<Link extends UnknownLink>(link: Link): LinkJSON<Link>;
export declare function fromJSON<Link extends UnknownLink>(json: LinkJSON<Link>): CID<unknown, number, number, Version>;
export declare class CID<Data = unknown, Format extends number = number, Alg extends number = number, TVersion extends Version = Version> implements Link<Data, Format, Alg, TVersion> {
    readonly code: Format;
    readonly version: TVersion;
    readonly multihash: MultihashDigest<Alg>;
    readonly bytes: Uint8Array;
    readonly "/": Uint8Array;
    /**
     * @param version - Version of the CID
     * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
     * @param multihash - (Multi)hash of the of the content.
     */
    constructor(version: TVersion, code: Format, multihash: MultihashDigest<Alg>, bytes: Uint8Array);
    /**
     * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
     * please either use `CID.asCID(cid)` or switch to new signalling mechanism
     *
     * @deprecated
     */
    get asCID(): this;
    get byteOffset(): number;
    get byteLength(): number;
    toV0(): CID<Data, DAG_PB, SHA_256, 0>;
    toV1(): CID<Data, Format, Alg, 1>;
    equals(other: unknown): other is CID<Data, Format, Alg, Version>;
    static equals<Data, Format extends number, Alg extends number, TVersion extends Version>(self: Link<Data, Format, Alg, TVersion>, other: unknown): other is CID;
    toString(base?: MultibaseEncoder<string>): string;
    toJSON(): {
        "/": ToString<CID<Data, Format, Alg, Version>, string>;
    };
    link(): this;
    get [Symbol.toStringTag](): string;
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
    static asCID<Data, Format extends number, Alg extends number, TVersion extends Version, U>(input: Link<Data, Format, Alg, TVersion> | U): CID<Data, Format, Alg, TVersion> | null;
    /**
     * @param version - Version of the CID
     * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
     * @param digest - (Multi)hash of the of the content.
     */
    static create<Data, Format extends number, Alg extends number, TVersion extends Version>(version: TVersion, code: Format, digest: MultihashDigest<Alg>): CID<Data, Format, Alg, TVersion>;
    /**
     * Simplified version of `create` for CIDv0.
     */
    static createV0<T = unknown>(digest: MultihashDigest<typeof SHA_256_CODE>): CID<T, typeof DAG_PB_CODE, typeof SHA_256_CODE, 0>;
    /**
     * Simplified version of `create` for CIDv1.
     *
     * @param code - Content encoding format code.
     * @param digest - Multihash of the content.
     */
    static createV1<Data, Code extends number, Alg extends number>(code: Code, digest: MultihashDigest<Alg>): CID<Data, Code, Alg, 1>;
    /**
     * Decoded a CID from its binary representation. The byte array must contain
     * only the CID with no additional bytes.
     *
     * An error will be thrown if the bytes provided do not contain a valid
     * binary representation of a CID.
     */
    static decode<Data, Code extends number, Alg extends number, TVersion extends Version>(bytes: ByteView<Link<Data, Code, Alg, TVersion>>): CID<Data, Code, Alg, TVersion>;
    /**
     * Decoded a CID from its binary representation at the beginning of a byte
     * array.
     *
     * Returns an array with the first element containing the CID and the second
     * element containing the remainder of the original byte array. The remainder
     * will be a zero-length byte array if the provided bytes only contained a
     * binary CID representation.
     */
    static decodeFirst<T, C extends number, A extends number, V extends Version>(bytes: ByteView<Link<T, C, A, V>>): [CID<T, C, A, V>, Uint8Array];
    /**
     * Inspect the initial bytes of a CID to determine its properties.
     *
     * Involves decoding up to 4 varints. Typically this will require only 4 to 6
     * bytes but for larger multicodec code values and larger multihash digest
     * lengths these varints can be quite large. It is recommended that at least
     * 10 bytes be made available in the `initialBytes` argument for a complete
     * inspection.
     */
    static inspectBytes<T, C extends number, A extends number, V extends Version>(initialBytes: ByteView<Link<T, C, A, V>>): {
        version: V;
        codec: C;
        multihashCode: A;
        digestSize: number;
        multihashSize: number;
        size: number;
    };
    /**
     * Takes cid in a string representation and creates an instance. If `base`
     * decoder is not provided will use a default from the configuration. It will
     * throw an error if encoding of the CID is not compatible with supplied (or
     * a default decoder).
     */
    static parse<Prefix extends string, Data, Code extends number, Alg extends number, TVersion extends Version>(source: ToString<Link<Data, Code, Alg, TVersion>, Prefix>, base?: MultibaseDecoder<Prefix>): CID<Data, Code, Alg, TVersion>;
}
declare const DAG_PB_CODE = 112;
declare const SHA_256_CODE = 18;
export {};
//# sourceMappingURL=cid.d.ts.map