"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.btm = exports.decodeBtmAddress = exports.encodeBtmAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "btm";
const coinType = 153;
const hrp = "bm";
exports.encodeBtmAddress = (0, bech32_js_1.createBech32SegwitEncoder)(hrp);
exports.decodeBtmAddress = (0, bech32_js_1.createBech32SegwitDecoder)(hrp);
exports.btm = {
    name,
    coinType,
    encode: exports.encodeBtmAddress,
    decode: exports.decodeBtmAddress,
};
//# sourceMappingURL=btm.js.map