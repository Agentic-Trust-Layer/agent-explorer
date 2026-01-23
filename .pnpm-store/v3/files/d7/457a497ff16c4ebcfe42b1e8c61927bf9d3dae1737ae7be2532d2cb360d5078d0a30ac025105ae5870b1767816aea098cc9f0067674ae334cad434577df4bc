"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ark = exports.decodeArkAddress = exports.encodeArkAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "ark";
const coinType = 111;
exports.encodeArkAddress = base58_js_1.base58CheckEncode;
const decodeArkAddress = (source) => {
    const decoded = (0, base58_js_1.base58CheckDecode)(source);
    if (decoded[0] !== 23)
        throw new Error("Invalid address");
    return decoded;
};
exports.decodeArkAddress = decodeArkAddress;
exports.ark = {
    name,
    coinType,
    encode: exports.encodeArkAddress,
    decode: exports.decodeArkAddress,
};
//# sourceMappingURL=ark.js.map