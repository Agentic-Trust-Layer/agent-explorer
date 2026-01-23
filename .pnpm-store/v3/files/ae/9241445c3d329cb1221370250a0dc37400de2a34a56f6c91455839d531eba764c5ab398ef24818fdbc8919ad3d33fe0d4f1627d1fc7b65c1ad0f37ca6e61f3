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
import { publicKeyToProtobuf } from '@libp2p/crypto/keys';
import { logger } from '@libp2p/logger';
import NanoDate from 'timestamp-nano';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { SignatureCreationError } from './errors.js';
import { IpnsEntry } from './pb/ipns.js';
import { createCborData, ipnsRecordDataForV1Sig, ipnsRecordDataForV2Sig, normalizeValue } from './utils.js';
const log = logger('ipns');
const DEFAULT_TTL_NS = 5 * 60 * 1e+9; // 5 Minutes or 300 Seconds, as suggested by https://specs.ipfs.tech/ipns/ipns-record/#ttl-uint64
export const namespace = '/ipns/';
export const namespaceLength = namespace.length;
const defaultCreateOptions = {
    v1Compatible: true,
    ttlNs: DEFAULT_TTL_NS
};
export async function createIPNSRecord(privateKey, value, seq, lifetime, options = defaultCreateOptions) {
    // Validity in ISOString with nanoseconds precision and validity type EOL
    const expirationDate = new NanoDate(Date.now() + Number(lifetime));
    const validityType = IpnsEntry.ValidityType.EOL;
    const ttlNs = BigInt(options.ttlNs ?? DEFAULT_TTL_NS);
    return _create(privateKey, value, seq, validityType, expirationDate.toString(), ttlNs, options);
}
export async function createIPNSRecordWithExpiration(privateKey, value, seq, expiration, options = defaultCreateOptions) {
    const expirationDate = NanoDate.fromString(expiration);
    const validityType = IpnsEntry.ValidityType.EOL;
    const ttlNs = BigInt(options.ttlNs ?? DEFAULT_TTL_NS);
    return _create(privateKey, value, seq, validityType, expirationDate.toString(), ttlNs, options);
}
const _create = async (privateKey, value, seq, validityType, validity, ttl, options = defaultCreateOptions) => {
    seq = BigInt(seq);
    const isoValidity = uint8ArrayFromString(validity);
    const normalizedValue = normalizeValue(value);
    const encodedValue = uint8ArrayFromString(normalizedValue);
    const data = createCborData(encodedValue, validityType, isoValidity, seq, ttl);
    const sigData = ipnsRecordDataForV2Sig(data);
    const signatureV2 = await privateKey.sign(sigData);
    let pubKey;
    // if we cannot derive the public key from the PeerId (e.g. RSA PeerIDs),
    // we have to embed it in the IPNS record
    if (privateKey.type === 'RSA') {
        pubKey = publicKeyToProtobuf(privateKey.publicKey);
    }
    if (options.v1Compatible === true) {
        const signatureV1 = await signLegacyV1(privateKey, encodedValue, validityType, isoValidity);
        const record = {
            value: normalizedValue,
            signatureV1,
            validity,
            validityType,
            sequence: seq,
            ttl,
            signatureV2,
            data
        };
        if (pubKey != null) {
            record.pubKey = pubKey;
        }
        return record;
    }
    else {
        const record = {
            value: normalizedValue,
            validity,
            validityType,
            sequence: seq,
            ttl,
            signatureV2,
            data
        };
        if (pubKey != null) {
            record.pubKey = pubKey;
        }
        return record;
    }
};
export { unmarshalIPNSRecord } from './utils.js';
export { marshalIPNSRecord } from './utils.js';
export { multihashToIPNSRoutingKey } from './utils.js';
export { multihashFromIPNSRoutingKey } from './utils.js';
export { extractPublicKeyFromIPNSRecord } from './utils.js';
/**
 * Sign ipns record data using the legacy V1 signature scheme
 */
const signLegacyV1 = async (privateKey, value, validityType, validity) => {
    try {
        const dataForSignature = ipnsRecordDataForV1Sig(value, validityType, validity);
        return await privateKey.sign(dataForSignature);
    }
    catch (error) {
        log.error('record signature creation failed', error);
        throw new SignatureCreationError('Record signature creation failed');
    }
};
//# sourceMappingURL=index.js.map