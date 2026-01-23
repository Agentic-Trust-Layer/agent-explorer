"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.near = exports.decodeNearAddress = exports.encodeNearAddress = void 0;
const bytes_js_1 = require("../utils/bytes.js");
const near_js_1 = require("../utils/near.js");
const name = "near";
const coinType = 397;
const encodeNearAddress = (source) => {
    const encoded = (0, bytes_js_1.bytesToString)(source);
    if (!(0, near_js_1.validateNearAddress)(encoded))
        throw new Error("Unrecognised address format");
    return encoded;
};
exports.encodeNearAddress = encodeNearAddress;
const decodeNearAddress = (source) => {
    if (!(0, near_js_1.validateNearAddress)(source))
        throw new Error("Unrecognised address format");
    return (0, bytes_js_1.stringToBytes)(source);
};
exports.decodeNearAddress = decodeNearAddress;
exports.near = {
    name,
    coinType,
    encode: exports.encodeNearAddress,
    decode: exports.decodeNearAddress,
};
//# sourceMappingURL=near.js.map