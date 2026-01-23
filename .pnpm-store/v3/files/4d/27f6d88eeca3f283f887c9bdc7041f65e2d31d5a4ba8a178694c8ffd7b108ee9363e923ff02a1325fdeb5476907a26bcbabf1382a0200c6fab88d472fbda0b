"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.btc = exports.decodeBtcAddress = exports.encodeBtcAddress = void 0;
const bitcoin_js_1 = require("../utils/bitcoin.js");
const name = "btc";
const coinType = 0;
const hrp = "bc";
const p2pkhVersions = [new Uint8Array([0x00])];
const p2shVersions = [new Uint8Array([0x05])];
exports.encodeBtcAddress = (0, bitcoin_js_1.createBitcoinEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeBtcAddress = (0, bitcoin_js_1.createBitcoinDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.btc = {
    name,
    coinType,
    encode: exports.encodeBtcAddress,
    decode: exports.decodeBtcAddress,
};
//# sourceMappingURL=btc.js.map