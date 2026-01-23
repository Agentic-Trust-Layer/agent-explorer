"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icx = exports.decodeIcxAddress = exports.encodeIcxAddress = void 0;
const utils_1 = require("@noble/hashes/utils");
const bytes_js_1 = require("../utils/bytes.js");
const name = "icx";
const coinType = 74;
const encodeIcxAddress = (source) => {
    if (source.length !== 21)
        throw new Error("Invalid address length");
    const type = source[0];
    if (type === 0x00)
        return `hx${(0, bytes_js_1.bytesToHexWithoutPrefix)(source.slice(1))}`;
    if (type === 0x01)
        return `cx${(0, bytes_js_1.bytesToHexWithoutPrefix)(source.slice(1))}`;
    throw new Error("Invalid address type");
};
exports.encodeIcxAddress = encodeIcxAddress;
const decodeIcxAddress = (source) => {
    const prefix = source.slice(0, 2);
    const body = source.slice(2);
    if (prefix === "hx")
        return (0, utils_1.concatBytes)(new Uint8Array([0x00]), (0, bytes_js_1.hexWithoutPrefixToBytes)(body));
    if (prefix === "cx")
        return (0, utils_1.concatBytes)(new Uint8Array([0x01]), (0, bytes_js_1.hexWithoutPrefixToBytes)(body));
    throw new Error("Invalid address prefix");
};
exports.decodeIcxAddress = decodeIcxAddress;
exports.icx = {
    name,
    coinType,
    encode: exports.encodeIcxAddress,
    decode: exports.decodeIcxAddress,
};
//# sourceMappingURL=icx.js.map