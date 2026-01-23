"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iotx = exports.decodeIotxAddress = exports.encodeIotxAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "iotx";
const coinType = 304;
const hrp = "io";
exports.encodeIotxAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeIotxAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.iotx = {
    name,
    coinType,
    encode: exports.encodeIotxAddress,
    decode: exports.decodeIotxAddress,
};
//# sourceMappingURL=iotx.js.map