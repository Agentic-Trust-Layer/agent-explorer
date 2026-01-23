"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aion = exports.decodeAionAddress = exports.encodeAionAddress = void 0;
const bytes_js_1 = require("../utils/bytes.js");
const name = "aion";
const coinType = 425;
const hexRegex = /^[0-9A-Fa-f]{64}$/g;
const encodeAionAddress = (source) => {
    if (source.length !== 32)
        throw new Error("Unrecognised address format");
    return (0, bytes_js_1.bytesToHex)(source);
};
exports.encodeAionAddress = encodeAionAddress;
const decodeAionAddress = (source) => {
    const noPrefix = source.startsWith("0x") ? source.slice(2) : source;
    if (noPrefix.length !== 64)
        throw new Error("Unrecognised address format");
    if (!hexRegex.test(noPrefix))
        throw new Error("Unrecognised address format");
    return (0, bytes_js_1.hexWithoutPrefixToBytes)(noPrefix);
};
exports.decodeAionAddress = decodeAionAddress;
exports.aion = {
    name,
    coinType,
    encode: exports.encodeAionAddress,
    decode: exports.decodeAionAddress,
};
//# sourceMappingURL=aion.js.map