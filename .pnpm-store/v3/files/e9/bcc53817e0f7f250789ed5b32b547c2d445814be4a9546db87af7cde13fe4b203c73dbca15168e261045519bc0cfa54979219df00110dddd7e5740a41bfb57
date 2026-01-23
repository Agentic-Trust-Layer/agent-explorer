"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ltc = exports.decodeLtcAddress = exports.encodeLtcAddress = void 0;
const bitcoin_js_1 = require("../utils/bitcoin.js");
const name = "ltc";
const coinType = 2;
const hrp = "ltc";
const p2pkhVersions = [new Uint8Array([0x30])];
const p2shVersions = [new Uint8Array([0x32]), new Uint8Array([0x05])];
exports.encodeLtcAddress = (0, bitcoin_js_1.createBitcoinEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeLtcAddress = (0, bitcoin_js_1.createBitcoinDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.ltc = {
    name,
    coinType,
    encode: exports.encodeLtcAddress,
    decode: exports.decodeLtcAddress,
};
//# sourceMappingURL=ltc.js.map