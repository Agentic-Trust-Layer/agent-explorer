"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbtc = exports.decodeRbtcAddress = exports.encodeRbtcAddress = void 0;
const hex_js_1 = require("../utils/hex.js");
const name = "rbtc";
const coinType = 137;
const chainId = 30;
exports.encodeRbtcAddress = (0, hex_js_1.createHexChecksummedEncoder)(chainId);
exports.decodeRbtcAddress = (0, hex_js_1.createHexChecksummedDecoder)(chainId);
exports.rbtc = {
    name,
    coinType,
    encode: exports.encodeRbtcAddress,
    decode: exports.decodeRbtcAddress,
};
//# sourceMappingURL=rbtc.js.map