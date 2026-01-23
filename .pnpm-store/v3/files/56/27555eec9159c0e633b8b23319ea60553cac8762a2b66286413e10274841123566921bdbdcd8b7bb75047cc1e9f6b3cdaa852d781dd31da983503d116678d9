import { CID } from 'multiformats/cid';
import { IpnsEntry } from './pb/ipns.js';
import type { IPNSRecord, IPNSRecordV2, IPNSRecordData } from './index.js';
import type { PublicKey } from '@libp2p/interface';
import type { MultihashDigest } from 'multiformats/cid';
/**
 * Extracts a public key from the passed PeerId, falling back to the pubKey
 * embedded in the ipns record
 */
export declare function extractPublicKeyFromIPNSRecord(record: IPNSRecord | IPNSRecordV2): PublicKey | undefined;
/**
 * Utility for creating the record data for being signed
 */
export declare function ipnsRecordDataForV1Sig(value: Uint8Array, validityType: IpnsEntry.ValidityType, validity: Uint8Array): Uint8Array;
/**
 * Utility for creating the record data for being signed
 */
export declare function ipnsRecordDataForV2Sig(data: Uint8Array): Uint8Array;
export declare function marshalIPNSRecord(obj: IPNSRecord | IPNSRecordV2): Uint8Array;
export declare function unmarshalIPNSRecord(buf: Uint8Array): IPNSRecord;
export declare function multihashToIPNSRoutingKey(digest: MultihashDigest<0x00 | 0x12>): Uint8Array;
export declare function multihashFromIPNSRoutingKey(key: Uint8Array): MultihashDigest<0x00 | 0x12>;
export declare function createCborData(value: Uint8Array, validityType: IpnsEntry.ValidityType, validity: Uint8Array, sequence: bigint, ttl: bigint): Uint8Array;
export declare function parseCborData(buf: Uint8Array): IPNSRecordData;
export declare function normalizeByteValue(value: Uint8Array): string;
/**
 * Normalizes the given record value. It ensures it is a PeerID, a CID or a
 * string starting with '/'. PeerIDs become `/ipns/${cidV1Libp2pKey}`,
 * CIDs become `/ipfs/${cidAsV1}`.
 */
export declare function normalizeValue(value?: CID | PublicKey | MultihashDigest<0x00 | 0x12> | string): string;
export declare function isCodec<T extends number>(digest: MultihashDigest, codec: T): digest is MultihashDigest<T>;
//# sourceMappingURL=utils.d.ts.map