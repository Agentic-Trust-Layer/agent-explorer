"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xch = exports.decodeXchAddress = exports.encodeXchAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "xch";
const coinType = 8444;
const hrp = "xch";
const limit = 90;
exports.encodeXchAddress = (0, bech32_js_1.createBech32mEncoder)(hrp, limit);
exports.decodeXchAddress = (0, bech32_js_1.createBech32mDecoder)(hrp, limit);
exports.xch = {
    name,
    coinType,
    encode: exports.encodeXchAddress,
    decode: exports.decodeXchAddress,
};
//# sourceMappingURL=xch.js.map