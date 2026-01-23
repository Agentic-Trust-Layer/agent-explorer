"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profiles = exports.bytesToHexString = exports.hexStringToBytes = void 0;
const coders_1 = require("@ensdomains/address-encoder/coders");
const cid_js_1 = require("./utils/cid.js");
const coders_js_1 = require("./utils/coders.js");
const digest_js_1 = require("./utils/digest.js");
const hexStringToBytes = (hex) => {
    let value = hex;
    if (value.startsWith("0x")) {
        value = value.slice(2);
    }
    if (value.length % 2 !== 0) {
        throw new Error("Invalid hex string");
    }
    const bytes = new Uint8Array(value.length / 2);
    for (let i = 0; i < value.length; i += 2) {
        bytes[i / 2] = parseInt(value.slice(i, i + 2), 16);
    }
    return bytes;
};
exports.hexStringToBytes = hexStringToBytes;
const bytesToHexString = (bytes) => {
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, "0");
    }
    return hex;
};
exports.bytesToHexString = bytesToHexString;
const isCryptographicIPNS = (cid) => {
    try {
        const { multihash } = cid;
        if (multihash.size < 38) {
            const mh = (0, digest_js_1.decodeDigest)(multihash.bytes);
            if (mh.code === 0x0 && mh.size < 36) {
                return false;
            }
        }
        return true;
    }
    catch (_) {
        return false;
    }
};
const base64Decode = (value) => (0, coders_1.decodeArAddress)(value);
const encodes = {
    skynet: (value) => {
        return base64Decode(value);
    },
    swarm: (value) => {
        const bytes = (0, exports.hexStringToBytes)(value);
        const multihash = (0, digest_js_1.createDigest)(0x1b, bytes);
        return cid_js_1.CID.create(1, 0xfa, multihash).bytes;
    },
    ipfs: (value) => {
        return cid_js_1.CID.parse(value).toV1().bytes;
    },
    ipns: (value) => {
        const cid = cid_js_1.CID.parse(value);
        return cid_js_1.CID.create(1, 0x72, cid.multihash).bytes;
    },
    utf8: (value) => {
        const encoder = new TextEncoder();
        return encoder.encode(value);
    },
    arweave: (value) => {
        return base64Decode(value);
    },
};
const decodes = {
    hexMultiHash: (value) => {
        const cid = cid_js_1.CID.decode(value);
        return (0, exports.bytesToHexString)((0, digest_js_1.decodeDigest)(cid.multihash.bytes).digest);
    },
    ipfs: (value) => {
        const cid = cid_js_1.CID.decode(value).toV1();
        return cid.toString(cid.code === 0x72 ? coders_js_1.base36 : coders_js_1.base32);
    },
    ipns: (value) => {
        const cid = cid_js_1.CID.decode(value).toV1();
        if (!isCryptographicIPNS(cid)) {
            console.warn("[ensdomains/content-hash] use of non-cryptographic identifiers in ipns-ns is deprecated and will be removed, migrate to ED25519 libp2p-key");
            return String.fromCodePoint(...cid_js_1.CID.decode(value).multihash.digest);
        }
        return cid.toString(coders_js_1.base36);
    },
    utf8: (value) => {
        const decoder = new TextDecoder();
        return decoder.decode(value);
    },
    base64: (value) => {
        return (0, coders_1.encodeArAddress)(value);
    },
};
exports.profiles = {
    skynet: {
        encode: encodes.skynet,
        decode: decodes.base64,
    },
    swarm: {
        encode: encodes.swarm,
        decode: decodes.hexMultiHash,
    },
    ipfs: {
        encode: encodes.ipfs,
        decode: decodes.ipfs,
    },
    ipns: {
        encode: encodes.ipns,
        decode: decodes.ipns,
    },
    arweave: {
        encode: encodes.arweave,
        decode: decodes.base64,
    },
    default: {
        encode: encodes.utf8,
        decode: decodes.utf8,
    },
};
//# sourceMappingURL=profiles.js.map