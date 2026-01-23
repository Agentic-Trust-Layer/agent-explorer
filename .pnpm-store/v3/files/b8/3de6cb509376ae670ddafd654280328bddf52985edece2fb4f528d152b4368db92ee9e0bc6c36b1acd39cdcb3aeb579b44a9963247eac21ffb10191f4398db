"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ae = exports.decodeAeAddress = exports.encodeAeAddress = void 0;
const utils_1 = require("@noble/hashes/utils");
const base58_js_1 = require("../utils/base58.js");
const name = "ae";
const coinType = 457;
const encodeAeAddress = (source) => {
    return `ak_${(0, base58_js_1.base58CheckEncode)(source.slice(2))}`;
};
exports.encodeAeAddress = encodeAeAddress;
const decodeAeAddress = (source) => {
    return (0, utils_1.concatBytes)(new Uint8Array([0x30, 0x78]), (0, base58_js_1.base58CheckDecode)(source.slice(3)));
};
exports.decodeAeAddress = decodeAeAddress;
exports.ae = {
    name,
    coinType,
    encode: exports.encodeAeAddress,
    decode: exports.decodeAeAddress,
};
//# sourceMappingURL=ae.js.map