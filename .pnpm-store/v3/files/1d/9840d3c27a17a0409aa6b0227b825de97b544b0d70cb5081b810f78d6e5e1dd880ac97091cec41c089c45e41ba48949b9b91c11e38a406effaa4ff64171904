"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mona = exports.decodeMonaAddress = exports.encodeMonaAddress = void 0;
const bitcoin_js_1 = require("../utils/bitcoin.js");
const name = "mona";
const coinType = 22;
const hrp = "mona";
const p2pkhVersions = [new Uint8Array([0x32])];
const p2shVersions = [new Uint8Array([0x37]), new Uint8Array([0x05])];
exports.encodeMonaAddress = (0, bitcoin_js_1.createBitcoinEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeMonaAddress = (0, bitcoin_js_1.createBitcoinDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.mona = {
    name,
    coinType,
    encode: exports.encodeMonaAddress,
    decode: exports.decodeMonaAddress,
};
//# sourceMappingURL=mona.js.map