"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ont = exports.decodeOntAddress = exports.encodeOntAddress = void 0;
const utils_1 = require("@noble/hashes/utils");
const base58_js_1 = require("../utils/base58.js");
const name = "ont";
const coinType = 1024;
const encodeOntAddress = (source) => {
    const sourceWithVersion = (0, utils_1.concatBytes)(new Uint8Array([0x17]), source);
    return (0, base58_js_1.base58CheckEncode)(sourceWithVersion);
};
exports.encodeOntAddress = encodeOntAddress;
const decodeOntAddress = (source) => {
    const decoded = (0, base58_js_1.base58CheckDecode)(source);
    const version = decoded[0];
    if (version !== 0x17)
        throw new Error("Unrecognised address format");
    return decoded.slice(1);
};
exports.decodeOntAddress = decodeOntAddress;
exports.ont = {
    name,
    coinType,
    encode: exports.encodeOntAddress,
    decode: exports.decodeOntAddress,
};
//# sourceMappingURL=ont.js.map