"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bps = exports.decodeBpsAddress = exports.encodeBpsAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "bps";
const coinType = 576;
const p2pkhVersions = [new Uint8Array([0x00])];
const p2shVersions = [new Uint8Array([0x05])];
exports.encodeBpsAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeBpsAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.bps = {
    name,
    coinType,
    encode: exports.encodeBpsAddress,
    decode: exports.decodeBpsAddress,
};
//# sourceMappingURL=bps.js.map