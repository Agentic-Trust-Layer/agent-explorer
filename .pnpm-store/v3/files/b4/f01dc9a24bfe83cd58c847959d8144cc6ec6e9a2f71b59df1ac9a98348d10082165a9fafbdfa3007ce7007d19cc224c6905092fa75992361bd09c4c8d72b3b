"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dash = exports.decodeDashAddress = exports.encodeDashAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "dash";
const coinType = 5;
const p2pkhVersions = [new Uint8Array([0x4c])];
const p2shVersions = [new Uint8Array([0x10])];
exports.encodeDashAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeDashAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.dash = {
    name,
    coinType,
    encode: exports.encodeDashAddress,
    decode: exports.decodeDashAddress,
};
//# sourceMappingURL=dash.js.map