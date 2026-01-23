"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aib = exports.decodeAibAddress = exports.encodeAibAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "aib";
const coinType = 55;
const p2pkhVersions = [new Uint8Array([0x17])];
const p2shVersions = [new Uint8Array([0x05])];
exports.encodeAibAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeAibAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.aib = {
    name,
    coinType,
    encode: exports.encodeAibAddress,
    decode: exports.decodeAibAddress,
};
//# sourceMappingURL=aib.js.map