"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wan = exports.decodeWanAddress = exports.encodeWanAddress = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const bytes_js_1 = require("../utils/bytes.js");
const hex_js_1 = require("../utils/hex.js");
const name = "wan";
const coinType = 5718350;
const wanChecksum = (addressBytes) => {
    const addressStr = (0, bytes_js_1.bytesToHexWithoutPrefix)(addressBytes);
    const address = addressStr.split("");
    const hash = (0, sha3_1.keccak_256)((0, bytes_js_1.stringToBytes)(addressStr));
    let hashByte;
    for (let i = 0; i < 40; i++) {
        hashByte = hash[Math.floor(i / 2)];
        if (i % 2 === 0)
            hashByte = hashByte >> 4;
        else
            hashByte &= 0xf;
        if (address[i] > "9" && hashByte <= 7)
            address[i] = address[i].toUpperCase();
    }
    return `0x${address.join("")}`;
};
const encodeWanAddress = (source) => {
    return wanChecksum(source);
};
exports.encodeWanAddress = encodeWanAddress;
const decodeWanAddress = (source) => {
    if (!(0, hex_js_1.isAddress)(source))
        throw new Error("Unrecognised address format");
    const bytes = (0, bytes_js_1.hexToBytes)(source);
    if (wanChecksum(bytes) !== source)
        throw new Error("Unrecognised address format");
    return bytes;
};
exports.decodeWanAddress = decodeWanAddress;
exports.wan = {
    name,
    coinType,
    encode: exports.encodeWanAddress,
    decode: exports.decodeWanAddress,
};
//# sourceMappingURL=wan.js.map