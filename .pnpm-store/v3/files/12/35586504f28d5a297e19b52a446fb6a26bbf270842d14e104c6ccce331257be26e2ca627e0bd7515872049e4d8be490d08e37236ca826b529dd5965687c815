/**
 * @packageDocumentation
 *
 * Implements parsing and serialization of [IPNS Records](https://specs.ipfs.tech/ipns/ipns-record/).
 *
 * @example Create record
 *
 * ```TypeScript
 * import { createIPNSRecord } from 'ipns'
 * import { generateKeyPair } from '@libp2p/crypto/keys'
 *
 * const privateKey = await generateKeyPair('Ed25519')
 * const value = 'hello world'
 * const sequenceNumber = 0
 * const lifetime = 3_600_000 // ms, e.g. one hour
 *
 * const ipnsRecord = await createIPNSRecord(privateKey, value, sequenceNumber, lifetime)
 * ```
 *
 * @example Validate record against public key
 *
 * ```TypeScript
 * import { validate } from 'ipns/validator'
 * import { generateKeyPair } from '@libp2p/crypto/keys'
 *
 * const privateKey = await generateKeyPair('Ed25519')
 * const publicKey = privateKey.publicKey
 * const marshalledRecord = Uint8Array.from([0, 1, 2, 3])
 *
 * await validate(publicKey, marshalledRecord)
 * // if no error thrown, the record is valid
 * ```
 *
 * @example Validate record against routing key
 *
 * This is useful when validating IPNS names that use RSA keys, whose public key is embedded in the record (rather than in the routing key as with Ed25519).
 *
 * ```TypeScript
 * import { ipnsValidator } from 'ipns/validator'
 * import { multihashToIPNSRoutingKey } from 'ipns'
 * import { generateKeyPair } from '@libp2p/crypto/keys'
 *
 * const privateKey = await generateKeyPair('Ed25519')
 * const routingKey = multihashToIPNSRoutingKey(privateKey.publicKey.toMultihash())
 * const marshalledRecord = Uint8Array.from([0, 1, 2, 3])
 *
 * await ipnsValidator(routingKey, marshalledRecord)
 * ```
 *
 * @example Extract public key from record
 *
 * ```TypeScript
 * import { extractPublicKeyFromIPNSRecord, createIPNSRecord } from 'ipns'
 * import { generateKeyPair } from '@libp2p/crypto/keys'
 *
 * const privateKey = await generateKeyPair('Ed25519')
 * const record = await createIPNSRecord(privateKey, 'hello world', 0, 3_600_000)
 *
 * const publicKey = await extractPublicKeyFromIPNSRecord(record)
 * ```
 *
 * @example Marshal data with proto buffer
 *
 * ```TypeScript
 * import { createIPNSRecord, marshalIPNSRecord } from 'ipns'
 * import { generateKeyPair } from '@libp2p/crypto/keys'
 *
 * const privateKey = await generateKeyPair('Ed25519')
 * const record = await createIPNSRecord(privateKey, 'hello world', 0, 3_600_000)
 * // ...
 * const marshalledData = marshalIPNSRecord(record)
 * // ...
 * ```
 *
 * Returns the record data serialized.
 *
 * @example Unmarshal data from proto buffer
 *
 * ```TypeScript
 * import { unmarshalIPNSRecord } from 'ipns'
 *
 * const storedData = Uint8Array.from([0, 1, 2, 3, 4])
 * const ipnsRecord = unmarshalIPNSRecord(storedData)
 * ```
 *
 * Returns the `IPNSRecord` after being deserialized.
 */
import { IpnsEntry } from './pb/ipns.js';
import type { PrivateKey, PublicKey } from '@libp2p/interface';
import type { Key } from 'interface-datastore/key';
import type { CID } from 'multiformats/cid';
import type { MultihashDigest } from 'multiformats/hashes/interface';
export declare const namespace = "/ipns/";
export declare const namespaceLength: number;
export interface IPNSRecordV1V2 {
    /**
     * value of the record
     */
    value: string;
    /**
     * signature of the record
     */
    signatureV1: Uint8Array;
    /**
     * Type of validation being used
     */
    validityType: IpnsEntry.ValidityType;
    /**
     * expiration datetime for the record in RFC3339 format
     */
    validity: string;
    /**
     * number representing the version of the record
     */
    sequence: bigint;
    /**
     * ttl in nanoseconds
     */
    ttl?: bigint;
    /**
     * the public portion of the key that signed this record (only present if it was not embedded in the IPNS key)
     */
    pubKey?: Uint8Array;
    /**
     * the v2 signature of the record
     */
    signatureV2: Uint8Array;
    /**
     * extensible data
     */
    data: Uint8Array;
}
export interface IPNSRecordV2 {
    /**
     * value of the record
     */
    value: string;
    /**
     * the v2 signature of the record
     */
    signatureV2: Uint8Array;
    /**
     * Type of validation being used
     */
    validityType: IpnsEntry.ValidityType;
    /**
     * If the validity type is EOL, this is the expiration datetime for the record
     * in RFC3339 format
     */
    validity: string;
    /**
     * number representing the version of the record
     */
    sequence: bigint;
    /**
     * ttl in nanoseconds
     */
    ttl?: bigint;
    /**
     * the public portion of the key that signed this record (only present if it was not embedded in the IPNS key)
     */
    pubKey?: Uint8Array;
    /**
     * extensible data
     */
    data: Uint8Array;
}
export type IPNSRecord = IPNSRecordV1V2 | IPNSRecordV2;
export interface IPNSRecordData {
    Value: Uint8Array;
    Validity: Uint8Array;
    ValidityType: IpnsEntry.ValidityType;
    Sequence: bigint;
    TTL: bigint;
}
export interface IDKeys {
    routingPubKey: Key;
    pkKey: Key;
    routingKey: Key;
    ipnsKey: Key;
}
export interface CreateOptions {
    ttlNs?: number | bigint;
    v1Compatible?: boolean;
}
export interface CreateV2OrV1Options {
    v1Compatible: true;
}
export interface CreateV2Options {
    v1Compatible: false;
}
/**
 * Creates a new IPNS record and signs it with the given private key.
 * The IPNS Record validity should follow the [RFC3339]{@link https://www.ietf.org/rfc/rfc3339.txt} with nanoseconds precision.
 * Note: This function does not embed the public key. If you want to do that, use `EmbedPublicKey`.
 *
 * The passed value can be a CID, a PublicKey or an arbitrary string path e.g. `/ipfs/...` or `/ipns/...`.
 *
 * CIDs will be converted to v1 and stored in the record as a string similar to: `/ipfs/${cid}`
 * PublicKeys will create recursive records, eg. the record value will be `/ipns/${cidV1Libp2pKey}`
 * String paths will be stored in the record as-is, but they must start with `"/"`
 *
 * @param {PrivateKey} privateKey - the private key for signing the record.
 * @param {CID | PublicKey | string} value - content to be stored in the record.
 * @param {number | bigint} seq - number representing the current version of the record.
 * @param {number} lifetime - lifetime of the record (in milliseconds).
 * @param {CreateOptions} options - additional create options.
 */
export declare function createIPNSRecord(privateKey: PrivateKey, value: CID | PublicKey | MultihashDigest<0x00 | 0x12> | string, seq: number | bigint, lifetime: number, options?: CreateV2OrV1Options): Promise<IPNSRecordV1V2>;
export declare function createIPNSRecord(privateKey: PrivateKey, value: CID | PublicKey | MultihashDigest<0x00 | 0x12> | string, seq: number | bigint, lifetime: number, options: CreateV2Options): Promise<IPNSRecordV2>;
export declare function createIPNSRecord(privateKey: PrivateKey, value: CID | PublicKey | MultihashDigest<0x00 | 0x12> | string, seq: number | bigint, lifetime: number, options: CreateOptions): Promise<IPNSRecordV1V2>;
/**
 * Same as create(), but instead of generating a new Date, it receives the intended expiration time
 * WARNING: nano precision is not standard, make sure the value in seconds is 9 orders of magnitude lesser than the one provided.
 *
 * The passed value can be a CID, a PublicKey or an arbitrary string path e.g. `/ipfs/...` or `/ipns/...`.
 *
 * CIDs will be converted to v1 and stored in the record as a string similar to: `/ipfs/${cid}`
 * PublicKeys will create recursive records, eg. the record value will be `/ipns/${cidV1Libp2pKey}`
 * String paths will be stored in the record as-is, but they must start with `"/"`
 *
 * @param {PrivateKey} privateKey - the private key for signing the record.
 * @param {CID | PublicKey | string} value - content to be stored in the record.
 * @param {number | bigint} seq - number representing the current version of the record.
 * @param {string} expiration - expiration datetime for record in the [RFC3339]{@link https://www.ietf.org/rfc/rfc3339.txt} with nanoseconds precision.
 * @param {CreateOptions} options - additional creation options.
 */
export declare function createIPNSRecordWithExpiration(privateKey: PrivateKey, value: CID | PublicKey | MultihashDigest<0x00 | 0x12> | string, seq: number | bigint, expiration: string, options?: CreateV2OrV1Options): Promise<IPNSRecordV1V2>;
export declare function createIPNSRecordWithExpiration(privateKey: PrivateKey, value: CID | PublicKey | MultihashDigest<0x00 | 0x12> | string, seq: number | bigint, expiration: string, options: CreateV2Options): Promise<IPNSRecordV2>;
export declare function createIPNSRecordWithExpiration(privateKey: PrivateKey, value: CID | PublicKey | MultihashDigest<0x00 | 0x12> | string, seq: number | bigint, expiration: string, options: CreateOptions): Promise<IPNSRecordV1V2>;
export { unmarshalIPNSRecord } from './utils.js';
export { marshalIPNSRecord } from './utils.js';
export { multihashToIPNSRoutingKey } from './utils.js';
export { multihashFromIPNSRoutingKey } from './utils.js';
export { extractPublicKeyFromIPNSRecord } from './utils.js';
//# sourceMappingURL=index.d.ts.map