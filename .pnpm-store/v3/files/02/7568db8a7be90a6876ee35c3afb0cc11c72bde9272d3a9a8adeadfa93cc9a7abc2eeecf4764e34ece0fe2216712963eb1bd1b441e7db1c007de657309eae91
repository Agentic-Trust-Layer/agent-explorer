"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsk = exports.decodeRskAddress = exports.encodeRskAddress = void 0;
const hex_js_1 = require("../utils/hex.js");
const name = "rsk";
const coinType = 137;
const chainId = 30;
exports.encodeRskAddress = (0, hex_js_1.createHexChecksummedEncoder)(chainId);
exports.decodeRskAddress = (0, hex_js_1.createHexChecksummedDecoder)(chainId);
exports.rsk = {
    name,
    coinType,
    encode: exports.encodeRskAddress,
    decode: exports.decodeRskAddress,
};
//# sourceMappingURL=rsk.js.map