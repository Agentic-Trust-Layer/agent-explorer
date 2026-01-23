"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexWithoutPrefixToBytes = exports.bytesToHexWithoutPrefix = exports.base10ToBytes = exports.bytesToBase10 = exports.bytesToHex = exports.stringToBytes = exports.bytesToString = exports.hexToString = exports.hexToBytes = void 0;
const utils_1 = require("@noble/hashes/utils");
function hexToBytes(hex_) {
    let hex = hex_;
    let hexString = hex.slice(2);
    if (hexString.length % 2)
        hexString = `0${hexString}`;
    const bytes = new Uint8Array(hexString.length / 2);
    for (let index = 0; index < bytes.length; index++) {
        const start = index * 2;
        const hexByte = hexString.slice(start, start + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error(`Invalid byte sequence ("${hexByte}" in "${hexString}").`);
        bytes[index] = byte;
    }
    return bytes;
}
exports.hexToBytes = hexToBytes;
function hexToString(hex) {
    let bytes = hexToBytes(hex);
    return new TextDecoder().decode(bytes);
}
exports.hexToString = hexToString;
function bytesToString(bytes) {
    return new TextDecoder().decode(bytes);
}
exports.bytesToString = bytesToString;
function stringToBytes(str) {
    return new TextEncoder().encode(str);
}
exports.stringToBytes = stringToBytes;
function bytesToHex(bytes) {
    return `0x${(0, utils_1.bytesToHex)(bytes)}`;
}
exports.bytesToHex = bytesToHex;
function bytesToBase10(bytes) {
    let bigInt = BigInt(0);
    for (let i = 0; i < bytes.length; i++) {
        bigInt = (bigInt << BigInt(8)) | BigInt(bytes[i]);
    }
    return bigInt.toString(10);
}
exports.bytesToBase10 = bytesToBase10;
function base10ToBytes(base10) {
    let bigInt = BigInt(base10);
    const bytes = [];
    while (bigInt > 0) {
        bytes.unshift(Number(bigInt & BigInt(0xff)));
        bigInt >>= BigInt(8);
    }
    return new Uint8Array(bytes);
}
exports.base10ToBytes = base10ToBytes;
exports.bytesToHexWithoutPrefix = utils_1.bytesToHex;
exports.hexWithoutPrefixToBytes = utils_1.hexToBytes;
//# sourceMappingURL=bytes.js.map