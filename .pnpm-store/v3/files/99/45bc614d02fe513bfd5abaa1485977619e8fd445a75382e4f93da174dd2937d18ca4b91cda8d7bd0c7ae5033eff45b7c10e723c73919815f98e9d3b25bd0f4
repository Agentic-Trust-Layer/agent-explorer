"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bch = exports.decodeBchAddress = exports.encodeBchAddress = void 0;
const utils_1 = require("@noble/hashes/utils");
const base58_js_1 = require("../utils/base58.js");
const bch_js_1 = require("../utils/bch.js");
const name = "bch";
const coinType = 145;
const p2pkhVersions = [new Uint8Array([0x00])];
const p2shVersions = [new Uint8Array([0x05])];
const bchBase58Decode = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
const encodeBchAddress = (source) => {
    if (source[0] === 0x76) {
        if (source[1] !== 0xa9 ||
            source[source.length - 2] !== 0x88 ||
            source[source.length - 1] !== 0xac)
            throw new Error("Unrecognised address format");
        return (0, bch_js_1.encodeBchAddressWithVersion)(0, source.slice(3, 3 + source[2]));
    }
    if (source[0] === 0xa9) {
        if (source[source.length - 1] !== 0x87)
            throw new Error("Unrecognised address format");
        return (0, bch_js_1.encodeBchAddressWithVersion)(8, source.slice(2, 2 + source[1]));
    }
    throw new Error("Unrecognised address format");
};
exports.encodeBchAddress = encodeBchAddress;
const decodeBchAddress = (source) => {
    try {
        return bchBase58Decode(source);
    }
    catch {
        const { type, hash } = (0, bch_js_1.decodeBchAddressToTypeAndHash)(source);
        if (type === 0)
            return (0, utils_1.concatBytes)(new Uint8Array([0x76, 0xa9, 0x14]), new Uint8Array(hash), new Uint8Array([0x88, 0xac]));
        if (type === 8)
            return (0, utils_1.concatBytes)(new Uint8Array([0xa9, 0x14]), new Uint8Array(hash), new Uint8Array([0x87]));
        throw new Error("Unrecognised address format");
    }
};
exports.decodeBchAddress = decodeBchAddress;
exports.bch = {
    name,
    coinType,
    encode: exports.encodeBchAddress,
    decode: exports.decodeBchAddress,
};
//# sourceMappingURL=bch.js.map