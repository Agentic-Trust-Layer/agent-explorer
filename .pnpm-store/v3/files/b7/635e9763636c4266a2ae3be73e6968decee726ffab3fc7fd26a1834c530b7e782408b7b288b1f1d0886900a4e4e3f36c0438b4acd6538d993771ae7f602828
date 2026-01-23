"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.btg = exports.decodeBtgAddress = exports.encodeBtgAddress = void 0;
const bitcoin_js_1 = require("../utils/bitcoin.js");
const name = "btg";
const coinType = 156;
const hrp = "btg";
const p2pkhVersions = [new Uint8Array([0x26])];
const p2shVersions = [new Uint8Array([0x17])];
exports.encodeBtgAddress = (0, bitcoin_js_1.createBitcoinEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeBtgAddress = (0, bitcoin_js_1.createBitcoinDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.btg = {
    name,
    coinType,
    encode: exports.encodeBtgAddress,
    decode: exports.decodeBtgAddress,
};
//# sourceMappingURL=btg.js.map