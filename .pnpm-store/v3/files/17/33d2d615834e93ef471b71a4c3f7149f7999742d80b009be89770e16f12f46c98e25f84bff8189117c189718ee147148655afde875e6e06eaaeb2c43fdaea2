"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rune = exports.decodeRuneAddress = exports.encodeRuneAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "rune";
const coinType = 931;
const hrp = "thor";
exports.encodeRuneAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeRuneAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.rune = {
    name,
    coinType,
    encode: exports.encodeRuneAddress,
    decode: exports.decodeRuneAddress,
};
//# sourceMappingURL=rune.js.map