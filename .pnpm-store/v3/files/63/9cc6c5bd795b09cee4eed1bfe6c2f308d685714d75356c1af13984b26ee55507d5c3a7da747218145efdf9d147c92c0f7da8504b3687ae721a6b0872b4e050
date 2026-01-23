"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xvg = exports.decodeXvgAddress = exports.encodeXvgAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "xvg";
const coinType = 77;
const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0x21])];
exports.encodeXvgAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeXvgAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.xvg = {
    name,
    coinType,
    encode: exports.encodeXvgAddress,
    decode: exports.decodeXvgAddress,
};
//# sourceMappingURL=xvg.js.map