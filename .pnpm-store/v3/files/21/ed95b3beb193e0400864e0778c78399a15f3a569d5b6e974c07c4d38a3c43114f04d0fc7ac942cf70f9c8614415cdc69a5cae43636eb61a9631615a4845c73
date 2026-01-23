"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nuls = exports.decodeNulsAddress = exports.encodeNulsAddress = void 0;
const utils_1 = require("@noble/hashes/utils");
const base58_js_1 = require("../utils/base58.js");
const name = "nuls";
const coinType = 8964;
const prefixReference = ["a", "b", "c", "d", "e"];
const decodePrefix = (source) => {
    for (let i = 0; i < source.length; i++) {
        const value = source.charCodeAt(i);
        if (value >= 97) {
            return source.slice(i + 1);
        }
    }
    throw new Error("Unrecognised address format");
};
const encodeNulsAddress = (source) => {
    const chainId = (source[0] & 0xff) | ((source[1] & 0xff) << 8);
    const payload = new Uint8Array(source.length + 1);
    let xor = 0x00;
    for (let i = 0; i < source.length; i++) {
        const byte = source[i];
        const value = byte > 127 ? byte - 256 : byte;
        payload[i] = value;
        xor ^= value;
    }
    payload[source.length] = xor;
    let prefix;
    if (chainId === 1)
        prefix = "NULS";
    else if (chainId === 2)
        prefix = "tNULS";
    else {
        const chainIdBytes = (0, utils_1.concatBytes)(new Uint8Array([0xff & (chainId >> 0)]), new Uint8Array([0xff & (chainId >> 8)]));
        prefix = (0, base58_js_1.base58UncheckedEncode)(chainIdBytes).toUpperCase();
    }
    return (prefix + prefixReference[prefix.length - 1] + (0, base58_js_1.base58UncheckedEncode)(payload));
};
exports.encodeNulsAddress = encodeNulsAddress;
const decodeNulsAddress = (source) => {
    let sourceWithoutPrefix;
    if (source.startsWith("NULS"))
        sourceWithoutPrefix = source.slice(5);
    else if (source.startsWith("tNULS"))
        sourceWithoutPrefix = source.slice(6);
    else
        sourceWithoutPrefix = decodePrefix(source);
    const payload = (0, base58_js_1.base58UncheckedDecode)(sourceWithoutPrefix);
    let xor = 0x00;
    for (let i = 0; i < payload.length - 1; i++) {
        const byte = payload[i];
        const value = byte > 127 ? byte - 256 : byte;
        payload[i] = value;
        xor ^= value;
    }
    if (xor < 0)
        xor += 256;
    if (xor !== payload[payload.length - 1])
        throw new Error("Unrecognised address format");
    return payload.slice(0, -1);
};
exports.decodeNulsAddress = decodeNulsAddress;
exports.nuls = {
    name,
    coinType,
    encode: exports.encodeNulsAddress,
    decode: exports.decodeNulsAddress,
};
//# sourceMappingURL=nuls.js.map