"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grin = exports.decodeGrinAddress = exports.encodeGrinAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "grin";
const coinType = 592;
const hrp = "grin";
exports.encodeGrinAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeGrinAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.grin = {
    name,
    coinType,
    encode: exports.encodeGrinAddress,
    decode: exports.decodeGrinAddress,
};
//# sourceMappingURL=grin.js.map