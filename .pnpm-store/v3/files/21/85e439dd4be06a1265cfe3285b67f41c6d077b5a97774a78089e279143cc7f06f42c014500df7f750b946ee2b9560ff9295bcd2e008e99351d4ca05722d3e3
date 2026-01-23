"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kmd = exports.decodeKmdAddress = exports.encodeKmdAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "kmd";
const coinType = 141;
const p2pkhVersions = [new Uint8Array([0x3c])];
const p2shVersions = [new Uint8Array([0x55])];
exports.encodeKmdAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeKmdAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.kmd = {
    name,
    coinType,
    encode: exports.encodeKmdAddress,
    decode: exports.decodeKmdAddress,
};
//# sourceMappingURL=kmd.js.map