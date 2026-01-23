"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zel = exports.decodeZelAddress = exports.encodeZelAddress = void 0;
const zcash_js_1 = require("../utils/zcash.js");
const name = "zel";
const coinType = 19167;
const hrp = "za";
const p2pkhVersions = [new Uint8Array([0x1c, 0xb8])];
const p2shVersions = [new Uint8Array([0x1c, 0xbd])];
exports.encodeZelAddress = (0, zcash_js_1.createZcashEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeZelAddress = (0, zcash_js_1.createZcashDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.zel = {
    name,
    coinType,
    encode: exports.encodeZelAddress,
    decode: exports.decodeZelAddress,
};
//# sourceMappingURL=zel.js.map