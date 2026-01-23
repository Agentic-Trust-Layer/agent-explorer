"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hnt = exports.decodeHntAddress = exports.encodeHntAddress = void 0;
const utils_1 = require("@noble/hashes/utils");
const base58_js_1 = require("../utils/base58.js");
const name = "hnt";
const coinType = 904;
const encodeHntAddress = (source) => {
    const sourceWithVersion = (0, utils_1.concatBytes)(new Uint8Array([0x00]), source);
    return (0, base58_js_1.base58CheckEncode)(sourceWithVersion);
};
exports.encodeHntAddress = encodeHntAddress;
const decodeHntAddress = (source) => {
    const decoded = (0, base58_js_1.base58CheckDecode)(source);
    const version = decoded[0];
    if (version !== 0)
        throw new Error("Unrecognised address format");
    return decoded.slice(1);
};
exports.decodeHntAddress = decodeHntAddress;
exports.hnt = {
    name,
    coinType,
    encode: exports.encodeHntAddress,
    decode: exports.decodeHntAddress,
};
//# sourceMappingURL=hnt.js.map