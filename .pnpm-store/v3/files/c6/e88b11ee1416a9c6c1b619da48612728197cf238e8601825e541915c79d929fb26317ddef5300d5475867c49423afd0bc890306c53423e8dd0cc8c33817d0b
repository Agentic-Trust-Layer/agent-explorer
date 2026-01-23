/**
 * A client library for the w3name - IPNS over HTTP API. It provides a
 * convenient interface for creating names, making revisions to name records,
 * and publishing and resolving them via the HTTP API.
 *
 * @example
 * ```js
 * import * as Name from 'w3name'
 *
 * const name = await Name.create()
 *
 * console.log('Name:', name.toString())
 * // e.g. k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt
 *
 * // The value to publish
 * const value = '/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
 * const revision = await Name.v0(name, value)
 *
 * // Publish the revision
 * await Name.publish(revision, name.key)
 *
 * // Resolve the latest value
 * await Name.resolve(name)
 * ```
 * @module
 */
import { PrivateKey, PublicKey } from '@libp2p/interface';
import { Link } from 'multiformats';
import W3NameService from './service.js';
/**
 * Name is an IPNS key ID.
 *
 * Names can be used to retrieve the latest published value from the W3name service
 * using the {@link resolve} function.
 *
 * Note that `Name` contains only the public verification key and does not allow publishing
 * or updating records. To create or update a record, use the {@link WritableName} subclass.
 *
 * To convert from a string representation of a name to a `Name` object use the {@link parse} function.
 */
export declare class Name {
    /** @internal */
    _pubKey: PublicKey;
    /** @internal */
    _cid: Link;
    constructor(pubKey: PublicKey);
    /**
     * A binary representation of the IPNS verification key.
     */
    get bytes(): Uint8Array;
    /**
     * @returns the string representation of the IPNS verification key (e.g. `k51qzi5uqu5di9agapykyjh3tqrf7i14a7fjq46oo0f6dxiimj62knq13059lt`)
     */
    toString(): string;
}
/**
 * WritableName is a {@link Name} that has a signing key associated with it such that
 * new IPNS record {@link Revision}s can be created and signed for it.
 *
 * New `WritableName`s can be generated using the {@link create} function.
 *
 * To load a `WritableName` from a saved binary representation, see {@link from}.
 */
export declare class WritableName extends Name {
    /** @internal */
    _privKey: PrivateKey;
    constructor(privKey: PrivateKey);
    /**
     * The private signing key, as a libp2p `PrivateKey` object.
     *
     * To save a key for later loading with {@link from}, write the
     * contents of `key.raw` somewhere safe.
     */
    get key(): PrivateKey;
}
/**
 * Create a new name with associated signing key that can be used to create and
 * publish IPNS record revisions.
 */
export declare function create(): Promise<WritableName>;
/**
 * Parses a string-encoded {@link Name} to a {@link Name} object.
 *
 * Note that this returns a read-only {@link Name}, which can be used to {@link resolve} values
 * but cannot {@link publish} them.
 */
export declare function parse(name: string): Name;
/**
 * Creates a {@link WritableName} from an existing signing key (private key).
 *
 * Expects the given `Uint8Array` to contain a binary representation of a
 * private signing key. Note that this is **not** the same as the output of
 * {@link Name#bytes | Name.bytes}, which always returns an encoding of the _public_ key,
 * even when the name in question is a {@link WritableName}.
 *
 * To save the key for a {@link WritableName} so that it can be used with this
 * function, use `key.raw`, for example:
 *
 * @example
 * ```js
 * import * as Name from 'w3name'
 * import fs from 'fs'
 *
 * async function example() {
 *   const myName = await Name.create()
 *
 *   // myName.key.raw can now be written to disk / database, etc.
 *   await fs.promises.writeFile('myName.key', myName.key.raw)
 *
 *   // let's pretend some time has passed and we want to load the
 *   // key from disk:
 *   const loadedBytes = await fs.promises.readFile('myName.key')
 *   const myName2 = await Name.from(loadedBytes)
 *
 *   // myName and myName2 can now be used interchangeably
 * }
 * ```
 *
 */
export declare function from(key: Uint8Array): Promise<WritableName>;
/**
 * Create an initial version of the IPNS record for the passed {@link Name}, set to the
 * passed value.
 *
 * Note that the returned {@link Revision} object must be {@link publish}ed before it
 * can be {@link resolve}d using the service.
 */
export declare function v0(name: Name, value: string): Promise<Revision>;
/**
 * Create a {@link Revision} of the passed IPNS record by incrementing the sequence
 * number and changing the value.
 *
 * This returns a new {@link Revision} and  does not alter the original `revision` argument.
 */
export declare function increment(revision: Revision, value: string): Promise<Revision>;
export declare type RFC3339DateString = string;
export interface RevisionOptions {
    /** TTL in nanoseconds, Default: 5m */
    ttl?: bigint;
}
/**
 * A representation of a IPNS record that may be initial or revised.
 */
export declare class Revision {
    /** @internal */
    _name: Name;
    /** @internal */
    _value: string;
    /** @internal */
    _sequence: bigint;
    /** @internal */
    _validity: string;
    /** @internal */
    _ttl: bigint | undefined;
    constructor(name: Name, value: string, sequence: bigint, validity: RFC3339DateString, options?: RevisionOptions);
    get name(): Name;
    get value(): string;
    get sequence(): bigint;
    /**
     * RFC3339 date string.
     */
    get validity(): RFC3339DateString;
    /** TTL in nanoseconds */
    get ttl(): bigint | undefined;
    /**
     * Encodes a `Revision` to a binary representation and returns it as a `Uint8Array`.
     *
     * Note: if `revision.name` is a `WritableName` then signing key data will be
     * lost. i.e. the private key is not encoded.
     */
    static encode(revision: Revision): Uint8Array;
    /**
     * Decodes a `Revision` from a binary representation.
     *
     * @param bytes - a `Uint8Array` containing a binary encoding of a `Revision`, as produced by {@link #encode}.
     * @returns a {@link Revision} object
     * @throws if `bytes` does not contain a valid encoded `Revision`
     */
    static decode(bytes: Uint8Array): Revision;
}
/**
 * Publish a name {@link Revision} to W3name.
 *
 * Names should be {@link resolve}-able immediately via the w3name service, and will be
 * provided to the IPFS DHT network.
 *
 * Note that it may take a few seconds for the record to propagate and become available via
 * the IPFS DHT network and IPFS <-> HTTP gateways.
 */
export declare function publish(revision: Revision, key: PrivateKey, service?: W3NameService): Promise<void>;
/**
 * Resolve the current IPNS record revision for the passed name.
 *
 * Note that this will only resolve names published using the W3name service. Names published by
 * other IPNS implementations should be resolved using a DHT-backed implementation (e.g. kubo, js-ipfs, etc).
 */
export declare function resolve(name: Name, service?: W3NameService): Promise<Revision>;
//# sourceMappingURL=index.d.ts.map