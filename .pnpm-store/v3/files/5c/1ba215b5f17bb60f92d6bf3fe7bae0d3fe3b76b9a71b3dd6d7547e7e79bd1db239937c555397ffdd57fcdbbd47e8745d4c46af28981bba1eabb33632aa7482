"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sero = exports.decodeSeroAddress = exports.encodeSeroAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "sero";
const coinType = 569;
exports.encodeSeroAddress = base58_js_1.base58UncheckedEncode;
const decodeSeroAddress = (source) => {
    const decoded = (0, base58_js_1.base58UncheckedDecode)(source);
    if (decoded.length !== 96)
        throw new Error("Unrecognised address format");
    return decoded;
};
exports.decodeSeroAddress = decodeSeroAddress;
exports.sero = {
    name,
    coinType,
    encode: exports.encodeSeroAddress,
    decode: exports.decodeSeroAddress,
};
//# sourceMappingURL=sero.js.map