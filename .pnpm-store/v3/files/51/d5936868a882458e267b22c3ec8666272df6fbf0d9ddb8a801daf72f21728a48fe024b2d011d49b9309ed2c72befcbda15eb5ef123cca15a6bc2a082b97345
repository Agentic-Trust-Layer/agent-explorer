"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flux = exports.decodeFluxAddress = exports.encodeFluxAddress = void 0;
const zcash_js_1 = require("../utils/zcash.js");
const name = "flux";
const coinType = 19167;
const hrp = "za";
const p2pkhVersions = [new Uint8Array([0x1c, 0xb8])];
const p2shVersions = [new Uint8Array([0x1c, 0xbd])];
exports.encodeFluxAddress = (0, zcash_js_1.createZcashEncoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.decodeFluxAddress = (0, zcash_js_1.createZcashDecoder)({
    hrp,
    p2pkhVersions,
    p2shVersions,
});
exports.flux = {
    name,
    coinType,
    encode: exports.encodeFluxAddress,
    decode: exports.decodeFluxAddress,
};
//# sourceMappingURL=flux.js.map