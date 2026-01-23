"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ccxx = exports.decodeCcxxAddress = exports.encodeCcxxAddress = void 0;
const bitcoin_js_1 = require("../utils/bitcoin.js");
const name = "ccxx";
const coinType = 571;
const hrp = "ccx";
const p2pkhVersions = [new Uint8Array([0x89])];
const p2shVersions = [new Uint8Array([0x4b]), new Uint8Array([0x05])];
exports.encodeCcxxAddress = (0, bitcoin_js_1.createBitcoinEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeCcxxAddress = (0, bitcoin_js_1.createBitcoinDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.ccxx = {
    name,
    coinType,
    encode: exports.encodeCcxxAddress,
    decode: exports.decodeCcxxAddress,
};
//# sourceMappingURL=ccxx.js.map