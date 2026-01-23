import type { Resolvable } from 'did-resolver';
import type { AnonEncryptParams, AuthEncryptParams, Decrypter, ECDH, Encrypter, KeyWrapper, ProtectedHeader } from './types.js';
/**
 * @deprecated Use
 *   {@link xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2 | xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2() } instead
 */
export declare function createAuthEncrypter(recipientPublicKey: Uint8Array, senderSecret: Uint8Array | ECDH, options?: Partial<AuthEncryptParams>): Encrypter;
/**
 * @deprecated Use {@link xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2 | xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2() }
 *   instead
 */
export declare function createAnonEncrypter(publicKey: Uint8Array, options?: Partial<AnonEncryptParams>): Encrypter;
/**
 * @deprecated Use
 *   {@link xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2 | xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2() } instead
 */
export declare function createAuthDecrypter(recipientSecret: Uint8Array | ECDH, senderPublicKey: Uint8Array): Decrypter;
/**
 * @deprecated Use {@link xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2 | xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2() }
 *   instead
 */
export declare function createAnonDecrypter(recipientSecret: Uint8Array | ECDH): Decrypter;
export declare function validateHeader(header?: ProtectedHeader): Required<Pick<ProtectedHeader, 'epk' | 'iv' | 'tag'>>;
export declare const xc20pKeyWrapper: KeyWrapper;
/**
 * @deprecated Use {@link xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2 | xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2() }
 *   instead
 */
export declare function x25519Encrypter(publicKey: Uint8Array, kid?: string, apv?: string): Encrypter;
/**
 * Recommended encrypter for anonymous encryption (i.e. no sender authentication).
 * Uses {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | ECDH-ES+XC20PKW v2}.
 *
 * @param recipientPublicKey - the byte array representing the recipient public key
 * @param options - {@link AnonEncryptParams} used to specify the recipient key ID (`kid`)
 *
 * @returns an {@link Encrypter} instance usable with {@link createJWE}
 *
 * NOTE: ECDH-ES+XC20PKW is a proposed draft in IETF and not a standard yet and
 * is subject to change as new revisions or until the official CFRG specification is released.
 */
export declare function xc20pAnonEncrypterEcdhESx25519WithXc20PkwV2(recipientPublicKey: Uint8Array, options?: Partial<AnonEncryptParams>): Encrypter;
/**
 *  Recommended encrypter for authenticated encryption (i.e. sender authentication and requires
 *  sender private key to encrypt the data).
 *  Uses {@link https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03 | ECDH-1PU v3 } and
 *  {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | XC20PKW v2 }.
 *
 *  @param recipientPublicKey - the byte array representing the recipient public key
 *  @param senderSecret - either a Uint8Array representing the sender secret key or
 *    an ECDH function that wraps the key and can promise a shared secret given a public key
 *  @param options - {@link AuthEncryptParams} used to specify extra header parameters
 *
 *  @returns an {@link Encrypter} instance usable with {@link createJWE}
 *
 *  NOTE: ECDH-1PU and XC20PKW are proposed drafts in IETF and not a standard yet and
 *  are subject to change as new revisions or until the official CFRG specification are released.
 *
 * Implements ECDH-1PU+XC20PKW with XChaCha20Poly1305 based on the following specs:
 *   - {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | XC20PKW}
 *   - {@link https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03 | ECDH-1PU}
 */
export declare function xc20pAuthEncrypterEcdh1PuV3x25519WithXc20PkwV2(recipientPublicKey: Uint8Array, senderSecret: Uint8Array | ECDH, options?: Partial<AuthEncryptParams>): Encrypter;
export declare function resolveX25519Encrypters(dids: string[], resolver: Resolvable): Promise<Encrypter[]>;
/**
 * @deprecated Use {@link xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2 | xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2() }
 *   instead
 */
export declare function x25519Decrypter(receiverSecret: Uint8Array | ECDH): Decrypter;
/**
 * Recommended decrypter for anonymous encryption (i.e. no sender authentication).
 * Uses {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | ECDH-ES+XC20PKW v2 }.
 *
 * @param recipientSecret - either a Uint8Array representing the recipient secret key or
 *   an ECDH function that wraps the key and can promise a shared secret given a public key
 *
 * @returns a {@link Decrypter} instance usable with {@link decryptJWE}
 *
 * NOTE: ECDH-ES+XC20PKW is a proposed draft in IETF and not a standard yet and
 * is subject to change as new revisions or until the official CFRG specification is released.
 *
 * @beta
 */
export declare function xc20pAnonDecrypterEcdhESx25519WithXc20PkwV2(recipientSecret: Uint8Array | ECDH): Decrypter;
/**
 * Recommended decrypter for authenticated encryption (i.e. sender authentication and requires
 * sender public key to decrypt the data).
 * Uses {@link https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03 | ECDH-1PU v3 } and
 * {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | XC20PKW v2 }.
 *
 * @param recipientSecret - either a Uint8Array representing the recipient secret key or
 *   an ECDH function that wraps the key and can promise a shared secret given a public key
 * @param senderPublicKey - the byte array representing the sender public key
 *
 * @returns a {@link Decrypter} instance usable with {@link decryptJWE}
 *
 * NOTE: ECDH-1PU and XC20PKW are proposed drafts in IETF and not a standard yet and
 * are subject to change as new revisions or until the official CFRG specification are released.
 *
 * @beta
 *
 * Implements ECDH-1PU+XC20PKW with XChaCha20Poly1305 based on the following specs:
 *   - {@link https://tools.ietf.org/html/draft-amringer-jose-chacha-02 | XC20PKW}
 *   - {@link https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03 | ECDH-1PU}
 */
export declare function xc20pAuthDecrypterEcdh1PuV3x25519WithXc20PkwV2(recipientSecret: Uint8Array | ECDH, senderPublicKey: Uint8Array): Decrypter;
//# sourceMappingURL=xc20pEncryption.d.ts.map