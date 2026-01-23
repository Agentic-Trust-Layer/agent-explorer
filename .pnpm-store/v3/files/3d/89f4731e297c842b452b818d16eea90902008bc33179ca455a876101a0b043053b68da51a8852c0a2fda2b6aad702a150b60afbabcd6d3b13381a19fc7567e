"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lcc = exports.decodeLccAddress = exports.encodeLccAddress = void 0;
const bitcoin_js_1 = require("../utils/bitcoin.js");
const name = "lcc";
const coinType = 192;
const hrp = "lcc";
const p2pkhVersions = [new Uint8Array([0x1c])];
const p2shVersions = [new Uint8Array([0x32]), new Uint8Array([0x05])];
exports.encodeLccAddress = (0, bitcoin_js_1.createBitcoinEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeLccAddress = (0, bitcoin_js_1.createBitcoinDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.lcc = {
    name,
    coinType,
    encode: exports.encodeLccAddress,
    decode: exports.decodeLccAddress,
};
//# sourceMappingURL=lcc.js.map