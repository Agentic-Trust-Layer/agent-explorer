"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kava = exports.decodeKavaAddress = exports.encodeKavaAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "kava";
const coinType = 459;
const hrp = "kava";
exports.encodeKavaAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeKavaAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.kava = {
    name,
    coinType,
    encode: exports.encodeKavaAddress,
    decode: exports.decodeKavaAddress,
};
//# sourceMappingURL=kava.js.map