import type { IPNSRecord } from './index.js';
import type { PublicKey } from '@libp2p/interface';
/**
 * Validates the given IPNS Record against the given public key. We need a "raw"
 * record in order to be able to access to all of its fields.
 */
export declare function validate(publicKey: PublicKey, marshalledRecord: Uint8Array): Promise<void>;
/**
 * Validate the given IPNS record against the given routing key.
 *
 * @see https://specs.ipfs.tech/ipns/ipns-record/#routing-record for the binary format of the routing key
 *
 * @param routingKey - The routing key in binary format: binary(ascii(IPNS_PREFIX) + multihash(public key))
 * @param marshalledRecord - The marshalled record to validate.
 */
export declare function ipnsValidator(routingKey: Uint8Array, marshalledRecord: Uint8Array): Promise<void>;
/**
 * Returns the number of milliseconds until the record expires.
 * If the record is already expired, returns 0.
 *
 * @param record - The IPNS record to validate.
 * @returns The number of milliseconds until the record expires, or 0 if the record is already expired.
 */
export declare function validFor(record: IPNSRecord): number;
//# sourceMappingURL=validator.d.ts.map