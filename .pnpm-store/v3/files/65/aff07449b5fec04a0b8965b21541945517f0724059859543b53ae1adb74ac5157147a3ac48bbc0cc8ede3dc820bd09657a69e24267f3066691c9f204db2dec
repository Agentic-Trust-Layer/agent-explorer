"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strat = exports.decodeStratAddress = exports.encodeStratAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "strat";
const coinType = 105;
const p2pkhVersions = [new Uint8Array([0x3f])];
const p2shVersions = [new Uint8Array([0x7d])];
exports.encodeStratAddress = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
exports.decodeStratAddress = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
exports.strat = {
    name,
    coinType,
    encode: exports.encodeStratAddress,
    decode: exports.decodeStratAddress,
};
//# sourceMappingURL=strat.js.map