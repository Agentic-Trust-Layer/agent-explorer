"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcd = exports.decodeBcdAddress = exports.encodeBcdAddress = void 0;
const bitcoin_js_1 = require("../utils/bitcoin.js");
const name = "bcd";
const coinType = 999;
const hrp = "bcd";
const p2pkhVersions = [new Uint8Array([0x00])];
const p2shVersions = [new Uint8Array([0x05])];
exports.encodeBcdAddress = (0, bitcoin_js_1.createBitcoinEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeBcdAddress = (0, bitcoin_js_1.createBitcoinDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.bcd = {
    name,
    coinType,
    encode: exports.encodeBcdAddress,
    decode: exports.decodeBcdAddress,
};
//# sourceMappingURL=bcd.js.map