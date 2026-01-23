"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xtz = exports.decodeXtzAddress = exports.encodeXtzAddress = void 0;
const utils_1 = require("@noble/hashes/utils");
const base58_js_1 = require("../utils/base58.js");
const name = "xtz";
const coinType = 1729;
const encodeXtzAddress = (source) => {
    if (source.length !== 22 && source.length !== 21)
        throw new Error("Unrecognised address format");
    const version = source[0];
    if (version === 0) {
        let prefix;
        if (source[1] === 0x00)
            prefix = new Uint8Array([0x06, 0xa1, 0x9f]);
        else if (source[1] === 0x01)
            prefix = new Uint8Array([0x06, 0xa1, 0xa1]);
        else if (source[1] === 0x02)
            prefix = new Uint8Array([0x06, 0xa1, 0xa4]);
        else
            throw new Error("Unrecognised address format");
        return (0, base58_js_1.base58CheckEncode)((0, utils_1.concatBytes)(prefix, source.slice(2)));
    }
    if (version === 1) {
        return (0, base58_js_1.base58CheckEncode)((0, utils_1.concatBytes)(new Uint8Array([0x02, 0x5a, 0x79]), source.slice(1, 21)));
    }
    throw new Error("Unrecognised address format");
};
exports.encodeXtzAddress = encodeXtzAddress;
const decodeXtzAddress = (source) => {
    const decoded = (0, base58_js_1.base58CheckDecode)(source).slice(3);
    const prefix = source.slice(0, 3);
    if (prefix === "tz1")
        return (0, utils_1.concatBytes)(new Uint8Array([0x00, 0x00]), decoded);
    if (prefix === "tz2")
        return (0, utils_1.concatBytes)(new Uint8Array([0x00, 0x01]), decoded);
    if (prefix === "tz3")
        return (0, utils_1.concatBytes)(new Uint8Array([0x00, 0x02]), decoded);
    if (prefix === "KT1")
        return (0, utils_1.concatBytes)(new Uint8Array([0x01]), decoded, new Uint8Array([0x00]));
    throw new Error("Unrecognised address format");
};
exports.decodeXtzAddress = decodeXtzAddress;
exports.xtz = {
    name,
    coinType,
    encode: exports.encodeXtzAddress,
    decode: exports.decodeXtzAddress,
};
//# sourceMappingURL=xtz.js.map