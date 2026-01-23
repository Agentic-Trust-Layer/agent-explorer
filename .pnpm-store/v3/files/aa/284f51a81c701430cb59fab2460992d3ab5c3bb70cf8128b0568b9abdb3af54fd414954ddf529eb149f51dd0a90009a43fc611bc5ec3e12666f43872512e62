"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dgb = exports.decodeDgbAddress = exports.encodeDgbAddress = void 0;
const bitcoin_js_1 = require("../utils/bitcoin.js");
const name = "dgb";
const coinType = 20;
const hrp = "dgb";
const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0x3f])];
exports.encodeDgbAddress = (0, bitcoin_js_1.createBitcoinEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeDgbAddress = (0, bitcoin_js_1.createBitcoinDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.dgb = {
    name,
    coinType,
    encode: exports.encodeDgbAddress,
    decode: exports.decodeDgbAddress,
};
//# sourceMappingURL=dgb.js.map