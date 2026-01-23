"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.one = exports.decodeOneAddress = exports.encodeOneAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "one";
const coinType = 1023;
const hrp = "one";
exports.encodeOneAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeOneAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.one = {
    name,
    coinType,
    encode: exports.encodeOneAddress,
    decode: exports.decodeOneAddress,
};
//# sourceMappingURL=one.js.map