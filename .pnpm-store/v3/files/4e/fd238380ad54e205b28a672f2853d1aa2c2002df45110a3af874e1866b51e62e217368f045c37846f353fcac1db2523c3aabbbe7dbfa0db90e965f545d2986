"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom = exports.decodeAtomAddress = exports.encodeAtomAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "atom";
const coinType = 118;
exports.encodeAtomAddress = (0, bech32_js_1.createBech32Encoder)("cosmos");
exports.decodeAtomAddress = (0, bech32_js_1.createBech32Decoder)("cosmos");
exports.atom = {
    name,
    coinType,
    encode: exports.encodeAtomAddress,
    decode: exports.decodeAtomAddress,
};
//# sourceMappingURL=atom.js.map