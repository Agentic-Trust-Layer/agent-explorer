"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vsys = exports.decodeVsysAddress = exports.encodeVsysAddress = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const blake2b_1 = require("@noble/hashes/blake2b");
const sha3_1 = require("@noble/hashes/sha3");
const base58_js_1 = require("../utils/base58.js");
const name = "vsys";
const coinType = 360;
const vsysChecksum = (source) => {
    if (source[0] !== 5 || source[1] !== 77 || source.length !== 26)
        return false;
    const checksum = source.slice(-4);
    const newChecksum = (0, sha3_1.keccak_256)((0, blake2b_1.blake2b)(source.slice(0, -4), { dkLen: 32 })).slice(0, 4);
    if (!(0, utils_1.equalBytes)(checksum, newChecksum))
        return false;
    return true;
};
const encodeVsysAddress = (source) => {
    if (!vsysChecksum(source))
        throw new Error("Unrecognised address format");
    return (0, base58_js_1.base58UncheckedEncode)(source);
};
exports.encodeVsysAddress = encodeVsysAddress;
const decodeVsysAddress = (source) => {
    const encoded = source.startsWith("address:") ? source.slice(8) : source;
    if (encoded.length > 36)
        throw new Error("Unrecognised address format");
    const decoded = (0, base58_js_1.base58UncheckedDecode)(encoded);
    if (!vsysChecksum(decoded))
        throw new Error("Unrecognised address format");
    return decoded;
};
exports.decodeVsysAddress = decodeVsysAddress;
exports.vsys = {
    name,
    coinType,
    encode: exports.encodeVsysAddress,
    decode: exports.decodeVsysAddress,
};
//# sourceMappingURL=vsys.js.map