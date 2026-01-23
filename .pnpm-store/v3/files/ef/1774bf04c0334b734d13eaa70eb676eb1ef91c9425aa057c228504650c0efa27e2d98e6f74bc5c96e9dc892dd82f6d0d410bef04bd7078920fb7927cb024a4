"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rdd = exports.decodeRddAddress = exports.encodeRddAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "rdd";
const coinType = 4;
const p2pkhVersions = [new Uint8Array([0x3d])];
const p2shVersions = [new Uint8Array([0x05])];
exports.encodeRddAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeRddAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.rdd = {
    name,
    coinType,
    encode: exports.encodeRddAddress,
    decode: exports.decodeRddAddress,
};
//# sourceMappingURL=rdd.js.map