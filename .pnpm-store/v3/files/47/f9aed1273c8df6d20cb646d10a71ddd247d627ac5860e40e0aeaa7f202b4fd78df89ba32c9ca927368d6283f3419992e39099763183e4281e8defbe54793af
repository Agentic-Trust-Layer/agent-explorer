"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cca = exports.decodeCcaAddress = exports.encodeCcaAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "cca";
const coinType = 489;
const p2pkhVersions = [new Uint8Array([0x0b])];
const p2shVersions = [new Uint8Array([0x05])];
exports.encodeCcaAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeCcaAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.cca = {
    name,
    coinType,
    encode: exports.encodeCcaAddress,
    decode: exports.decodeCcaAddress,
};
//# sourceMappingURL=cca.js.map