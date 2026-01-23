"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEosDecoder = exports.createEosEncoder = void 0;
const secp256k1_1 = require("@noble/curves/secp256k1");
const ripemd160_1 = require("@noble/hashes/ripemd160");
const base_1 = require("@scure/base");
const base58_js_1 = require("./base58.js");
const eosChecksum = base_1.utils.checksum(4, ripemd160_1.ripemd160);
const createEosEncoder = (prefix) => (source) => {
    const point = secp256k1_1.secp256k1.ProjectivePoint.fromHex(source);
    const checksummed = eosChecksum.encode(point.toRawBytes(true));
    const encoded = (0, base58_js_1.base58UncheckedEncode)(checksummed);
    return `${prefix}${encoded}`;
};
exports.createEosEncoder = createEosEncoder;
const createEosDecoder = (prefix) => (source) => {
    if (!source.startsWith(prefix))
        throw new Error("Unrecognised address format");
    const prefixStripped = source.slice(prefix.length);
    const decoded = (0, base58_js_1.base58UncheckedDecode)(prefixStripped);
    const checksummed = eosChecksum.decode(decoded);
    return checksummed;
};
exports.createEosDecoder = createEosDecoder;
//# sourceMappingURL=eosio.js.map