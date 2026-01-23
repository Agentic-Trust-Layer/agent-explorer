"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.via = exports.decodeViaAddress = exports.encodeViaAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "via";
const coinType = 14;
const p2pkhVersions = [new Uint8Array([0x47])];
const p2shVersions = [new Uint8Array([0x21])];
exports.encodeViaAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeViaAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.via = {
    name,
    coinType,
    encode: exports.encodeViaAddress,
    decode: exports.decodeViaAddress,
};
//# sourceMappingURL=via.js.map