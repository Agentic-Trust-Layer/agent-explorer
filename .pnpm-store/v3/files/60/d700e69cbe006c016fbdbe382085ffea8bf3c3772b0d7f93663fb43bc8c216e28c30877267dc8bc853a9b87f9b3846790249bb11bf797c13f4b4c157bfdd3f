"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firo = exports.decodeFiroAddress = exports.encodeFiroAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "firo";
const coinType = 136;
const p2pkhVersions = [new Uint8Array([0x52])];
const p2shVersions = [new Uint8Array([0x07])];
exports.encodeFiroAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeFiroAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.firo = {
    name,
    coinType,
    encode: exports.encodeFiroAddress,
    decode: exports.decodeFiroAddress,
};
//# sourceMappingURL=firo.js.map