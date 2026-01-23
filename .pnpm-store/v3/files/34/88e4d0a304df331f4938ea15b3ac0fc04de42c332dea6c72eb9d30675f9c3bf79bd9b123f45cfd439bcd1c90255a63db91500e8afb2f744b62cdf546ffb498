"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zec = exports.decodeZecAddress = exports.encodeZecAddress = void 0;
const zcash_js_1 = require("../utils/zcash.js");
const name = "zec";
const coinType = 133;
const hrp = "zs";
const p2pkhVersions = [new Uint8Array([0x1c, 0xb8])];
const p2shVersions = [new Uint8Array([0x1c, 0xbd])];
exports.encodeZecAddress = (0, zcash_js_1.createZcashEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeZecAddress = (0, zcash_js_1.createZcashDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.zec = {
    name,
    coinType,
    encode: exports.encodeZecAddress,
    decode: exports.decodeZecAddress,
};
//# sourceMappingURL=zec.js.map