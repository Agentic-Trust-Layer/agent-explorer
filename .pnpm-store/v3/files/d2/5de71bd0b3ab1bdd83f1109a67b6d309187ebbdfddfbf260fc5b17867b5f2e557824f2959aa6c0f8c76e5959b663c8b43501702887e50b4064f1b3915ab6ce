"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rvn = exports.decodeRvnAddress = exports.encodeRvnAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "rvn";
const coinType = 175;
const p2pkhVersions = [new Uint8Array([0x3c])];
const p2shVersions = [new Uint8Array([0x7a])];
exports.encodeRvnAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeRvnAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.rvn = {
    name,
    coinType,
    encode: exports.encodeRvnAddress,
    decode: exports.decodeRvnAddress,
};
//# sourceMappingURL=rvn.js.map