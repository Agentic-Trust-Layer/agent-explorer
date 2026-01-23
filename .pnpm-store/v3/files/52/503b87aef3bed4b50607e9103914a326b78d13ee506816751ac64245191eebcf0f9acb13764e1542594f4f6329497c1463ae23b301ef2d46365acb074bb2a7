"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iris = exports.decodeIrisAddress = exports.encodeIrisAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "iris";
const coinType = 566;
const hrp = "iaa";
exports.encodeIrisAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeIrisAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.iris = {
    name,
    coinType,
    encode: exports.encodeIrisAddress,
    decode: exports.decodeIrisAddress,
};
//# sourceMappingURL=iris.js.map