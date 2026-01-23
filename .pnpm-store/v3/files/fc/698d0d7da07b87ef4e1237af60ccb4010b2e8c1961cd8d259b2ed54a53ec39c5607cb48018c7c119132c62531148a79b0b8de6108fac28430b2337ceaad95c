"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wicc = exports.decodeWiccAddress = exports.encodeWiccAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "wicc";
const coinType = 99999;
const p2pkhVersions = [new Uint8Array([0x49])];
const p2shVersions = [new Uint8Array([0x33])];
exports.encodeWiccAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeWiccAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.wicc = {
    name,
    coinType,
    encode: exports.encodeWiccAddress,
    decode: exports.decodeWiccAddress,
};
//# sourceMappingURL=wicc.js.map