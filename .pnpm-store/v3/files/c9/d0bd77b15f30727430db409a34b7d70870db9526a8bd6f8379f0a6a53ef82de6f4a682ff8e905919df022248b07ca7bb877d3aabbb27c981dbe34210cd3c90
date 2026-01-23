"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eos = exports.decodeEosAddress = exports.encodeEosAddress = void 0;
const eosio_js_1 = require("../utils/eosio.js");
const name = "eos";
const coinType = 194;
const prefix = "EOS";
exports.encodeEosAddress = (0, eosio_js_1.createEosEncoder)(prefix);
exports.decodeEosAddress = (0, eosio_js_1.createEosDecoder)(prefix);
exports.eos = {
    name,
    coinType,
    encode: exports.encodeEosAddress,
    decode: exports.decodeEosAddress,
};
//# sourceMappingURL=eos.js.map