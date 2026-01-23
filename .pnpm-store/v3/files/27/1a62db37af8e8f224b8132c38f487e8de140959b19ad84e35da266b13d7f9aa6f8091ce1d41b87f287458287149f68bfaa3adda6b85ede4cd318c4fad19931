"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.luna = exports.decodeLunaAddress = exports.encodeLunaAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "luna";
const coinType = 330;
const hrp = "terra";
exports.encodeLunaAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeLunaAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.luna = {
    name,
    coinType,
    encode: exports.encodeLunaAddress,
    decode: exports.decodeLunaAddress,
};
//# sourceMappingURL=luna.js.map