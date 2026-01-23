"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ppc = exports.decodePpcAddress = exports.encodePpcAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "ppc";
const coinType = 6;
const p2pkhVersions = [new Uint8Array([0x37])];
const p2shVersions = [new Uint8Array([0x75])];
exports.encodePpcAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodePpcAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.ppc = {
    name,
    coinType,
    encode: exports.encodePpcAddress,
    decode: exports.decodePpcAddress,
};
//# sourceMappingURL=ppc.js.map