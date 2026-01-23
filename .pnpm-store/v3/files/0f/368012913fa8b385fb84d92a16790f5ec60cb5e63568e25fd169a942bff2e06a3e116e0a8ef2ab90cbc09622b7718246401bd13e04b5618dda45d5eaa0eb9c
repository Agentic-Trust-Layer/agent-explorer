"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nas = exports.decodeNasAddress = exports.encodeNasAddress = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const base_1 = require("@scure/base");
const base58_js_1 = require("../utils/base58.js");
const name = "nas";
const coinType = 2718;
const nasChecksum = base_1.utils.checksum(4, sha3_1.sha3_256);
const encodeNasAddress = (source) => {
    const checksummed = nasChecksum.encode(source);
    return (0, base58_js_1.base58UncheckedEncode)(checksummed);
};
exports.encodeNasAddress = encodeNasAddress;
const decodeNasAddress = (source) => {
    const decoded = (0, base58_js_1.base58UncheckedDecode)(source);
    if (decoded.length !== 26 ||
        decoded[0] !== 25 ||
        (decoded[1] !== 87 && decoded[1] !== 88))
        throw new Error("Unrecognised address format");
    return nasChecksum.decode(decoded);
};
exports.decodeNasAddress = decodeNasAddress;
exports.nas = {
    name,
    coinType,
    encode: exports.encodeNasAddress,
    decode: exports.decodeNasAddress,
};
//# sourceMappingURL=nas.js.map