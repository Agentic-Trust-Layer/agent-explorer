import { DIDDocumentSection, IAgentContext, IIdentifier, IKey, IResolver } from '@veramo/core-types';
import { DIDDocument, DIDResolutionOptions, VerificationMethod } from 'did-resolver';
import { _ExtendedIKey, _ExtendedVerificationMethod, _NormalizedVerificationMethod } from './types/utility-types.js';
/**
 * Converts Ed25519 public keys to X25519
 * @param publicKey - The bytes of an Ed25519P public key
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function convertEd25519PublicKeyToX25519(publicKey: Uint8Array): Uint8Array;
/**
 * Converts Ed25519 private keys to X25519
 * @param privateKey - The bytes of an Ed25519P private key
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function convertEd25519PrivateKeyToX25519(privateKey: Uint8Array): Uint8Array;
/**
 * Converts any Ed25519 keys of an {@link @veramo/core-types#IIdentifier | IIdentifier} to X25519 to be usable for
 * encryption.
 *
 * @param identifier - the identifier with keys
 *
 * @returns the array of converted keys filtered to contain ONLY X25519 keys usable for encryption.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function convertIdentifierEncryptionKeys(identifier: IIdentifier): IKey[];
/**
 * Converts any Secp256k1 public keys of an {@link @veramo/core-types#IIdentifier | IIdentifier} to their compressed
 * form.
 *
 * @param identifier - the identifier with keys
 *
 * @returns the array of keys where the Secp256k1 entries are compressed.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function compressIdentifierSecp256k1Keys(identifier: IIdentifier): IKey[];
/**
 * Extracts an ethereum address from a {@link did-resolver#VerificationMethod | verification method} supporting legacy
 * representations.
 *
 * @param verificationMethod - the VerificationMethod object (from a DID document)
 *
 * @returns an ethereum address `string` or `undefined` if none could be extracted
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function getEthereumAddress(verificationMethod: VerificationMethod): string | undefined;
/**
 * Extracts the chain ID from a {@link did-resolver#VerificationMethod | verification method} supporting legacy
 * representations as well.
 *
 * @param verificationMethod - the VerificationMethod object (from a DID document)
 *
 * @returns a chain ID `number` or `undefined` if none could be extracted.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function getChainId(verificationMethod: _NormalizedVerificationMethod): number;
/**
 * Maps the keys of a locally managed {@link @veramo/core-types#IIdentifier | IIdentifier} to the corresponding
 * {@link did-resolver#VerificationMethod | VerificationMethod} entries from the DID document.
 *
 * @param identifier - the identifier to be mapped
 * @param section - the section of the DID document to be mapped (see
 *   {@link https://www.w3.org/TR/did-core/#verification-relationships | verification relationships}), but can also be
 *   `verificationMethod` to map all the keys.
 * @param context - the veramo agent context, which must contain a {@link @veramo/core-types#IResolver | IResolver}
 *   implementation that can resolve the DID document of the identifier.
 * @param resolutionOptions - optional parameters to be passed to the DID resolver
 *
 * @returns an array of mapped keys. The corresponding verification method is added to the `meta.verificationMethod`
 *   property of the key.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function mapIdentifierKeysToDoc(identifier: IIdentifier, section: DIDDocumentSection | undefined, context: IAgentContext<IResolver>, resolutionOptions?: DIDResolutionOptions): Promise<_ExtendedIKey[]>;
/**
 * Resolve a DID document or throw an error if the resolution fails.
 *
 * @param didUrl - the DID to be resolved
 * @param context - the veramo agent context, which must contain a {@link @veramo/core-types#IResolver | IResolver}
 *   implementation that can resolve the DID document of the `didUrl`.
 * @param resolutionOptions - optional parameters to be passed to the DID resolver
 *
 * @returns a {@link did-resolver#DIDDocument | DIDDocument} if resolution is successful
 * @throws if the resolution fails
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function resolveDidOrThrow(didUrl: string, context: IAgentContext<IResolver>, resolutionOptions?: DIDResolutionOptions): Promise<DIDDocument>;
/**
 * Dereferences keys from DID document and normalizes them for easy comparison.
 *
 * When dereferencing keyAgreement keys, only Ed25519 and X25519 curves are supported.
 * Other key types are omitted from the result and Ed25519 keys are converted to X25519
 *
 * @returns a Promise that resolves to the list of dereferenced keys.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function dereferenceDidKeys(didDocument: DIDDocument, section: DIDDocumentSection | undefined, context: IAgentContext<IResolver>): Promise<_NormalizedVerificationMethod[]>;
/**
 * Converts the publicKey of a VerificationMethod to hex encoding (publicKeyHex)
 *
 * @param pk - the VerificationMethod to be converted
 * @param convert - when this flag is set to true, Ed25519 keys are converted to their X25519 pairs
 * @returns the hex encoding of the public key along with the inferred key type
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function extractPublicKeyHex(pk: _ExtendedVerificationMethod, convert?: boolean): {
    publicKeyHex: string;
    keyType: string | undefined;
};
//# sourceMappingURL=did-utils.d.ts.map