"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bnb = exports.decodeBnbAddress = exports.encodeBnbAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "bnb";
const coinType = 714;
const hrp = "bnb";
exports.encodeBnbAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeBnbAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.bnb = {
    name,
    coinType,
    encode: exports.encodeBnbAddress,
    decode: exports.decodeBnbAddress,
};
//# sourceMappingURL=bnb.js.map