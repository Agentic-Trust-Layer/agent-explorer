"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lsk = exports.decodeLskAddress = exports.encodeLskAddress = void 0;
const bytes_js_1 = require("../utils/bytes.js");
const name = "lsk";
const coinType = 134;
const encodeLskAddress = (source) => {
    return `${(0, bytes_js_1.bytesToBase10)(source)}L`;
};
exports.encodeLskAddress = encodeLskAddress;
const decodeLskAddress = (source) => {
    if (source.length < 2 || source.length > 22)
        throw new Error("Invalid address length");
    if (!source.endsWith("L") || source.includes("."))
        throw new Error("Invalid address format");
    return (0, bytes_js_1.base10ToBytes)(source.slice(0, -1));
};
exports.decodeLskAddress = decodeLskAddress;
exports.lsk = {
    name,
    coinType,
    encode: exports.encodeLskAddress,
    decode: exports.decodeLskAddress,
};
//# sourceMappingURL=lsk.js.map