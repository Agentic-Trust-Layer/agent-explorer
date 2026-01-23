"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bsv = exports.decodeBsvAddress = exports.encodeBsvAddress = void 0;
const utils_1 = require("@noble/hashes/utils");
const base58_js_1 = require("../utils/base58.js");
const name = "bsv";
const coinType = 236;
const encodeBsvAddress = (source) => (0, base58_js_1.base58CheckEncode)((0, utils_1.concatBytes)(new Uint8Array([0x00]), source));
exports.encodeBsvAddress = encodeBsvAddress;
const decodeBsvAddress = (source) => {
    const decoded = (0, base58_js_1.base58CheckDecode)(source);
    if (decoded.length !== 21)
        throw new Error("Unrecognised address format");
    const version = decoded[0];
    if (version !== 0x00)
        throw new Error("Unrecognised address format");
    return decoded.slice(1);
};
exports.decodeBsvAddress = decodeBsvAddress;
exports.bsv = {
    name,
    coinType,
    encode: exports.encodeBsvAddress,
    decode: exports.decodeBsvAddress,
};
//# sourceMappingURL=bsv.js.map