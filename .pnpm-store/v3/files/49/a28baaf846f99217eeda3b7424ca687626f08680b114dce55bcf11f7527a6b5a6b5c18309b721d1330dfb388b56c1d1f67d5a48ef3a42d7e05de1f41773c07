"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ckb = exports.decodeCkbAddress = exports.encodeCkbAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "ckb";
const coinType = 309;
const hrp = "ckb";
exports.encodeCkbAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeCkbAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.ckb = {
    name,
    coinType,
    encode: exports.encodeCkbAddress,
    decode: exports.decodeCkbAddress,
};
//# sourceMappingURL=ckb.js.map