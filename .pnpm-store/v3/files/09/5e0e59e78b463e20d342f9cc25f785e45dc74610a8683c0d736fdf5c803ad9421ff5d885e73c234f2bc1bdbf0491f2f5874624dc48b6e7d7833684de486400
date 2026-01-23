"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sys = exports.decodeSysAddress = exports.encodeSysAddress = void 0;
const bitcoin_js_1 = require("../utils/bitcoin.js");
const name = "sys";
const coinType = 57;
const hrp = "sys";
const p2pkhVersions = [new Uint8Array([0x3f])];
const p2shVersions = [new Uint8Array([0x05])];
exports.encodeSysAddress = (0, bitcoin_js_1.createBitcoinEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeSysAddress = (0, bitcoin_js_1.createBitcoinDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.sys = {
    name,
    coinType,
    encode: exports.encodeSysAddress,
    decode: exports.decodeSysAddress,
};
//# sourceMappingURL=sys.js.map