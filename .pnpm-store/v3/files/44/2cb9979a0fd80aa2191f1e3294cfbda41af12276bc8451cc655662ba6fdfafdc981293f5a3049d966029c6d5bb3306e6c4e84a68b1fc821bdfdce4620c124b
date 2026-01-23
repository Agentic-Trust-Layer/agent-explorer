"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strk = exports.decodeStrkAddress = exports.encodeStrkAddress = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const bytes_js_1 = require("../utils/bytes.js");
const hex_js_1 = require("../utils/hex.js");
const name = "strk";
const coinType = 9004;
const addressLength = 32;
const addressRegex = /^0x[a-fA-F0-9]{64}$/;
const strkChecksum = (source) => {
    const chars = (0, bytes_js_1.bytesToHexWithoutPrefix)(source).toLowerCase().split("");
    const sourceLeadingZeroIndex = source.findIndex((byte) => byte !== 0x00);
    const leadingZeroStripped = sourceLeadingZeroIndex > 0 ? source.slice(sourceLeadingZeroIndex) : source;
    const hash = new Uint8Array(32);
    hash.set((0, sha3_1.keccak_256)(leadingZeroStripped), sourceLeadingZeroIndex);
    return (0, hex_js_1.rawChecksumAddress)({ address: chars, hash, length: 64 });
};
const encodeStrkAddress = (source) => {
    if (source.length !== addressLength)
        throw new Error("Unrecognised address format");
    return strkChecksum(source);
};
exports.encodeStrkAddress = encodeStrkAddress;
const decodeStrkAddress = (source) => {
    if (!addressRegex.test(source))
        throw new Error("Unrecognised address format");
    const decoded = (0, bytes_js_1.hexToBytes)(source);
    if (strkChecksum(decoded) !== source)
        throw new Error("Unrecognised address format");
    return decoded;
};
exports.decodeStrkAddress = decodeStrkAddress;
exports.strk = {
    name,
    coinType,
    encode: exports.encodeStrkAddress,
    decode: exports.decodeStrkAddress,
};
//# sourceMappingURL=strk.js.map