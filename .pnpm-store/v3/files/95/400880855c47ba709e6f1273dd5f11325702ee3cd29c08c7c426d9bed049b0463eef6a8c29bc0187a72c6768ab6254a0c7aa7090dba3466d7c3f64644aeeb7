import { VerificationMethod } from 'did-resolver';
export declare const identifierMatcher: RegExp;
export declare const nullAddress = "0x0000000000000000000000000000000000000000";
export declare const DEFAULT_REGISTRY_ADDRESS = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";
export declare const DEFAULT_JSON_RPC = "http://127.0.0.1:8545/";
export declare const MESSAGE_PREFIX = "0x1900";
export type address = string;
export type uint256 = bigint;
export type bytes32 = string;
export type bytes = string;
export interface ERC1056Event {
    identity: address;
    previousChange: uint256;
    validTo?: bigint;
    _eventName: string;
    blockNumber: number;
}
export interface DIDOwnerChanged extends ERC1056Event {
    owner: address;
}
export interface DIDAttributeChanged extends ERC1056Event {
    name: bytes32;
    value: bytes;
    validTo: uint256;
}
export interface DIDDelegateChanged extends ERC1056Event {
    delegateType: bytes32;
    delegate: address;
    validTo: uint256;
}
export declare enum verificationMethodTypes {
    EcdsaSecp256k1VerificationKey2019 = "EcdsaSecp256k1VerificationKey2019",
    EcdsaSecp256k1RecoveryMethod2020 = "EcdsaSecp256k1RecoveryMethod2020",
    Ed25519VerificationKey2018 = "Ed25519VerificationKey2018",
    RSAVerificationKey2018 = "RSAVerificationKey2018",
    X25519KeyAgreementKey2019 = "X25519KeyAgreementKey2019"
}
export declare enum eventNames {
    DIDOwnerChanged = "DIDOwnerChanged",
    DIDAttributeChanged = "DIDAttributeChanged",
    DIDDelegateChanged = "DIDDelegateChanged"
}
export interface LegacyVerificationMethod extends VerificationMethod {
    /**@deprecated */
    publicKeyHex?: string;
    /**@deprecated */
    publicKeyBase64?: string;
    /**@deprecated */
    publicKeyPem?: string;
    [x: string]: any;
}
/**
 * Interface for transporting v, r, s signature parameters used in meta transactions
 */
export interface MetaSignature {
    sigV: number;
    sigR: bytes32;
    sigS: bytes32;
}
export declare const legacyAttrTypes: Record<string, string>;
export declare const legacyAlgoMap: Record<string, string>;
export declare function strip0x(input: string): string;
export declare function bytes32toString(input: bytes32 | Uint8Array): string;
export declare function stringToBytes32(str: string): string;
export declare function interpretIdentifier(identifier: string): {
    address: string;
    publicKey?: string;
    network?: string;
};
export declare enum Errors {
    /**
     * The resolver has failed to construct the DID document.
     * This can be caused by a network issue, a wrong registry address or malformed logs while parsing the registry
     * history. Please inspect the `DIDResolutionMetadata.message` to debug further.
     */
    notFound = "notFound",
    /**
     * The resolver does not know how to resolve the given DID. Most likely it is not a `did:ethr`.
     */
    invalidDid = "invalidDid",
    /**
     * The resolver is misconfigured or is being asked to resolve a `DID` anchored on an unknown network
     */
    unknownNetwork = "unknownNetwork",
    /**
     * The resolver does not support the 'accept' format requested with `DIDResolutionOptions`
     */
    unsupportedFormat = "unsupportedFormat"
}
/**
 * Returns true when the argument is defined and not null.
 * Usable as array.filter(isDefined)
 * @param arg
 */
export declare function isDefined<T>(arg: T): arg is Exclude<T, null | undefined>;
//# sourceMappingURL=helpers.d.ts.map