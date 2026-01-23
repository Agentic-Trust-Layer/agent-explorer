"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lrg = exports.decodeLrgAddress = exports.encodeLrgAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "lrg";
const coinType = 568;
const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0x0d])];
exports.encodeLrgAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeLrgAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.lrg = {
    name,
    coinType,
    encode: exports.encodeLrgAddress,
    decode: exports.decodeLrgAddress,
};
//# sourceMappingURL=lrg.js.map