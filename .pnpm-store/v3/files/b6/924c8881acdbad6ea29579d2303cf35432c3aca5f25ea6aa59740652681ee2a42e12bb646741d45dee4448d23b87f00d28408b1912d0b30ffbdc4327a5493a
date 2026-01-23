import type { EphemeralKeyPair } from './encryption/types.js';
import { BaseName } from 'multibase';
import type { VerificationMethod } from 'did-resolver';
/**
 * @deprecated Signers will be expected to return base64url `string` signatures.
 */
export interface EcdsaSignature {
    r: string;
    s: string;
    recoveryParam?: number;
}
/**
 * @deprecated Signers will be expected to return base64url `string` signatures.
 */
export type ECDSASignature = {
    compact: Uint8Array;
    recovery?: number;
};
export type JsonWebKey = {
    crv: string;
    kty: string;
    x?: string;
    y?: string;
    [key: string]: any;
};
export declare function bytesToBase64url(b: Uint8Array): string;
export declare function base64ToBytes(s: string): Uint8Array;
export declare function bytesToBase64(b: Uint8Array): string;
export declare function base58ToBytes(s: string): Uint8Array;
export declare function bytesToBase58(b: Uint8Array): string;
export type KNOWN_JWA = 'ES256' | 'ES256K' | 'ES256K-R' | 'Ed25519' | 'EdDSA';
export type KNOWN_VERIFICATION_METHOD = 'JsonWebKey2020' | 'Multikey' | 'Secp256k1SignatureVerificationKey2018' | 'Secp256k1VerificationKey2018' | 'EcdsaSecp256k1VerificationKey2019' | 'EcdsaPublicKeySecp256k1' | 'EcdsaSecp256k1RecoveryMethod2020' | 'EcdsaSecp256r1VerificationKey2019' | 'Ed25519VerificationKey2018' | 'Ed25519VerificationKey2020' | 'ED25519SignatureVerification' | 'ConditionalProof2022' | 'X25519KeyAgreementKey2019' | 'X25519KeyAgreementKey2020';
export type KNOWN_KEY_TYPE = 'Secp256k1' | 'Ed25519' | 'X25519' | 'Bls12381G1' | 'Bls12381G2' | 'P-256';
export type PublicKeyTypes = Record<KNOWN_JWA, KNOWN_VERIFICATION_METHOD[]>;
export declare const SUPPORTED_PUBLIC_KEY_TYPES: PublicKeyTypes;
export declare const VM_TO_KEY_TYPE: Record<KNOWN_VERIFICATION_METHOD, KNOWN_KEY_TYPE | undefined>;
export type KNOWN_CODECS = 'ed25519-pub' | 'x25519-pub' | 'secp256k1-pub' | 'bls12_381-g1-pub' | 'bls12_381-g2-pub' | 'p256-pub';
export declare const supportedCodecs: Record<KNOWN_CODECS, number>;
export declare const CODEC_TO_KEY_TYPE: Record<KNOWN_CODECS, KNOWN_KEY_TYPE>;
/**
 * Extracts the raw byte representation of a public key from a VerificationMethod along with an inferred key type
 * @param pk a VerificationMethod entry from a DIDDocument
 * @return an object containing the `keyBytes` of the public key and an inferred `keyType`
 */
export declare function extractPublicKeyBytes(pk: VerificationMethod): {
    keyBytes: Uint8Array;
    keyType?: KNOWN_KEY_TYPE;
};
/**
 * Encodes the given byte array to a multibase string (defaulting to base58btc).
 * If a codec is provided, the corresponding multicodec prefix will be added.
 *
 * @param b - the Uint8Array to be encoded
 * @param base - the base to use for encoding (defaults to base58btc)
 * @param codec - the codec to use for encoding (defaults to no codec)
 *
 * @returns the multibase encoded string
 *
 * @public
 */
export declare function bytesToMultibase(b: Uint8Array, base?: BaseName, codec?: keyof typeof supportedCodecs | number): string;
/**
 * Converts a multibase string to the Uint8Array it represents.
 * This method will assume the byte array that is multibase encoded is a multicodec and will attempt to decode it.
 *
 * @param s - the string to be converted
 *
 * @throws if the string is not formatted correctly.
 *
 * @public
 */
export declare function multibaseToBytes(s: string): {
    keyBytes: Uint8Array;
    keyType?: KNOWN_KEY_TYPE;
};
export declare function hexToBytes(s: string, minLength?: number): Uint8Array;
export declare function encodeBase64url(s: string): string;
export declare function decodeBase64url(s: string): string;
export declare function bytesToHex(b: Uint8Array): string;
export declare function bytesToBigInt(b: Uint8Array): bigint;
export declare function bigintToBytes(n: bigint, minLength?: number): Uint8Array;
export declare function stringToBytes(s: string): Uint8Array;
export declare function toJose({ r, s, recoveryParam }: EcdsaSignature, recoverable?: boolean): string;
export declare function fromJose(signature: string): {
    r: string;
    s: string;
    recoveryParam?: number;
};
export declare function toSealed(ciphertext: string, tag?: string): Uint8Array;
export declare function leftpad(data: string, size?: number): string;
/**
 * Generate random x25519 key pair.
 */
export declare function generateKeyPair(): {
    secretKey: Uint8Array;
    publicKey: Uint8Array;
};
/**
 * Generate private-public x25519 key pair from `seed`.
 */
export declare function generateKeyPairFromSeed(seed: Uint8Array): {
    secretKey: Uint8Array;
    publicKey: Uint8Array;
};
export declare function genX25519EphemeralKeyPair(): EphemeralKeyPair;
/**
 * Checks if a variable is defined and not null.
 * After this check, typescript sees the variable as defined.
 *
 * @param arg - The input to be verified
 *
 * @returns true if the input variable is defined.
 */
export declare function isDefined<T>(arg: T): arg is Exclude<T, null | undefined>;
//# sourceMappingURL=util.d.ts.map