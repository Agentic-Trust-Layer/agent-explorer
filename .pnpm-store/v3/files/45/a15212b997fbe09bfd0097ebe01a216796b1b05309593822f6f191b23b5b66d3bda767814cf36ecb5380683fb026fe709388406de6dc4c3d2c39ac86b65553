"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divi = exports.decodeDiviAddress = exports.encodeDiviAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "divi";
const coinType = 301;
const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0xd])];
exports.encodeDiviAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeDiviAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.divi = {
    name,
    coinType,
    encode: exports.encodeDiviAddress,
    decode: exports.decodeDiviAddress,
};
//# sourceMappingURL=divi.js.map