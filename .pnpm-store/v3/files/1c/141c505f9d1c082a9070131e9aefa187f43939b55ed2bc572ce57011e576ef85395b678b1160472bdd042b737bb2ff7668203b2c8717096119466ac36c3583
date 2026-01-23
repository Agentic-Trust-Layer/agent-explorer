"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doge = exports.decodeDogeAddress = exports.encodeDogeAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "doge";
const coinType = 3;
const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0x16])];
exports.encodeDogeAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeDogeAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.doge = {
    name,
    coinType,
    encode: exports.encodeDogeAddress,
    decode: exports.decodeDogeAddress,
};
//# sourceMappingURL=doge.js.map