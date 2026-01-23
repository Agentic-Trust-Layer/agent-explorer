"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sc = exports.decodeScAddress = exports.encodeScAddress = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const blake2b_1 = require("@noble/hashes/blake2b");
const utils_2 = require("@noble/hashes/utils");
const bytes_js_1 = require("../utils/bytes.js");
const name = "sc";
const coinType = 1991;
const length = 32;
const checksumLength = 6;
const scChecksum = (source) => (0, blake2b_1.blake2b)(source, { dkLen: length }).slice(0, checksumLength);
const encodeScAddress = (source) => {
    const checksum = scChecksum(source);
    return (0, bytes_js_1.bytesToHexWithoutPrefix)((0, utils_2.concatBytes)(source, checksum));
};
exports.encodeScAddress = encodeScAddress;
const decodeScAddress = (source) => {
    if (source.length !== 76)
        throw new Error("Unrecognised address format");
    const decoded = (0, bytes_js_1.hexWithoutPrefixToBytes)(source);
    const payload = decoded.slice(0, -checksumLength);
    const checksum = decoded.slice(-checksumLength);
    const newChecksum = scChecksum(payload);
    if (!(0, utils_1.equalBytes)(checksum, newChecksum))
        throw new Error("Unrecognised address format");
    return payload;
};
exports.decodeScAddress = decodeScAddress;
exports.sc = {
    name,
    coinType,
    encode: exports.encodeScAddress,
    decode: exports.decodeScAddress,
};
//# sourceMappingURL=sc.js.map