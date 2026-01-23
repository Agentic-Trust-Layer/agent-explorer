"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zen = exports.decodeZenAddress = exports.encodeZenAddress = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const base58_js_1 = require("../utils/base58.js");
const name = "zen";
const coinType = 121;
const validPrefixes = [
    new Uint8Array([0x20, 0x89]),
    new Uint8Array([0x1c, 0xb8]),
    new Uint8Array([0x20, 0x96]),
    new Uint8Array([0x1c, 0xbd]),
    new Uint8Array([0x16, 0x9a]),
];
const encodeZenAddress = (source) => {
    const prefix = source.slice(0, 2);
    if (!validPrefixes.some((x) => (0, utils_1.equalBytes)(x, prefix)))
        throw new Error("Invalid prefix");
    return (0, base58_js_1.base58CheckEncode)(source);
};
exports.encodeZenAddress = encodeZenAddress;
const decodeZenAddress = (source) => {
    const decoded = (0, base58_js_1.base58CheckDecode)(source);
    const prefix = decoded.slice(0, 2);
    if (!validPrefixes.some((x) => (0, utils_1.equalBytes)(x, prefix)))
        throw new Error("Invalid prefix");
    return decoded;
};
exports.decodeZenAddress = decodeZenAddress;
exports.zen = {
    name,
    coinType,
    encode: exports.encodeZenAddress,
    decode: exports.decodeZenAddress,
};
//# sourceMappingURL=zen.js.map