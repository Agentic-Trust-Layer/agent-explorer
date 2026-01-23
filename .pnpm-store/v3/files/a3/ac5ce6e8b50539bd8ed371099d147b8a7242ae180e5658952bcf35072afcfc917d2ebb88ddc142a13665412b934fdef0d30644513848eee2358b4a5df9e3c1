"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.legacyAlgoMap = exports.legacyAttrTypes = exports.eventNames = exports.verificationMethodTypes = exports.MESSAGE_PREFIX = exports.DEFAULT_JSON_RPC = exports.DEFAULT_REGISTRY_ADDRESS = exports.nullAddress = exports.identifierMatcher = void 0;
exports.strip0x = strip0x;
exports.bytes32toString = bytes32toString;
exports.stringToBytes32 = stringToBytes32;
exports.interpretIdentifier = interpretIdentifier;
exports.isDefined = isDefined;
const ethers_1 = require("ethers");
exports.identifierMatcher = /^(.*)?(0x[0-9a-fA-F]{40}|0x[0-9a-fA-F]{66})$/;
exports.nullAddress = '0x0000000000000000000000000000000000000000';
exports.DEFAULT_REGISTRY_ADDRESS = '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b';
exports.DEFAULT_JSON_RPC = 'http://127.0.0.1:8545/';
exports.MESSAGE_PREFIX = '0x1900';
var verificationMethodTypes;
(function (verificationMethodTypes) {
    verificationMethodTypes["EcdsaSecp256k1VerificationKey2019"] = "EcdsaSecp256k1VerificationKey2019";
    verificationMethodTypes["EcdsaSecp256k1RecoveryMethod2020"] = "EcdsaSecp256k1RecoveryMethod2020";
    verificationMethodTypes["Ed25519VerificationKey2018"] = "Ed25519VerificationKey2018";
    verificationMethodTypes["RSAVerificationKey2018"] = "RSAVerificationKey2018";
    verificationMethodTypes["X25519KeyAgreementKey2019"] = "X25519KeyAgreementKey2019";
})(verificationMethodTypes || (exports.verificationMethodTypes = verificationMethodTypes = {}));
var eventNames;
(function (eventNames) {
    eventNames["DIDOwnerChanged"] = "DIDOwnerChanged";
    eventNames["DIDAttributeChanged"] = "DIDAttributeChanged";
    eventNames["DIDDelegateChanged"] = "DIDDelegateChanged";
})(eventNames || (exports.eventNames = eventNames = {}));
exports.legacyAttrTypes = {
    sigAuth: 'SignatureAuthentication2018',
    veriKey: 'VerificationKey2018',
    enc: 'KeyAgreementKey2019',
};
exports.legacyAlgoMap = {
    /**@deprecated */
    Secp256k1VerificationKey2018: verificationMethodTypes.EcdsaSecp256k1VerificationKey2019,
    /**@deprecated */
    Ed25519SignatureAuthentication2018: verificationMethodTypes.Ed25519VerificationKey2018,
    /**@deprecated */
    Secp256k1SignatureAuthentication2018: verificationMethodTypes.EcdsaSecp256k1VerificationKey2019,
    //keep legacy mapping
    RSAVerificationKey2018: verificationMethodTypes.RSAVerificationKey2018,
    Ed25519VerificationKey2018: verificationMethodTypes.Ed25519VerificationKey2018,
    X25519KeyAgreementKey2019: verificationMethodTypes.X25519KeyAgreementKey2019,
};
function strip0x(input) {
    return input.startsWith('0x') ? input.slice(2) : input;
}
function bytes32toString(input) {
    return (0, ethers_1.toUtf8String)(input).replace(/\0+$/, '');
}
function stringToBytes32(str) {
    const bytes = (0, ethers_1.toUtf8Bytes)(str);
    return (0, ethers_1.zeroPadBytes)(bytes.slice(0, 32), 32);
}
function interpretIdentifier(identifier) {
    let id = identifier;
    let network = undefined;
    if (id.startsWith('did:ethr')) {
        id = id.split('?')[0];
        const components = id.split(':');
        id = components[components.length - 1];
        if (components.length >= 4) {
            network = components.splice(2, components.length - 3).join(':');
        }
    }
    if (id.length > 42) {
        return { address: (0, ethers_1.computeAddress)(id), publicKey: id, network };
    }
    else {
        return { address: (0, ethers_1.getAddress)(id), network }; // checksum address
    }
}
var Errors;
(function (Errors) {
    /**
     * The resolver has failed to construct the DID document.
     * This can be caused by a network issue, a wrong registry address or malformed logs while parsing the registry
     * history. Please inspect the `DIDResolutionMetadata.message` to debug further.
     */
    Errors["notFound"] = "notFound";
    /**
     * The resolver does not know how to resolve the given DID. Most likely it is not a `did:ethr`.
     */
    Errors["invalidDid"] = "invalidDid";
    /**
     * The resolver is misconfigured or is being asked to resolve a `DID` anchored on an unknown network
     */
    Errors["unknownNetwork"] = "unknownNetwork";
    /**
     * The resolver does not support the 'accept' format requested with `DIDResolutionOptions`
     */
    Errors["unsupportedFormat"] = "unsupportedFormat";
})(Errors || (exports.Errors = Errors = {}));
/**
 * Returns true when the argument is defined and not null.
 * Usable as array.filter(isDefined)
 * @param arg
 */
function isDefined(arg) {
    return arg !== null && typeof arg !== 'undefined';
}
//# sourceMappingURL=helpers.js.map