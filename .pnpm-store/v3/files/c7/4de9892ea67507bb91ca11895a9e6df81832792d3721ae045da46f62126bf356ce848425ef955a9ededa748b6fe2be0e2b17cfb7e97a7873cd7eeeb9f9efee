"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.steem = exports.decodeSteemAddress = exports.encodeSteemAddress = void 0;
const eosio_js_1 = require("../utils/eosio.js");
const name = "steem";
const coinType = 135;
const prefix = "STM";
exports.encodeSteemAddress = (0, eosio_js_1.createEosEncoder)(prefix);
exports.decodeSteemAddress = (0, eosio_js_1.createEosDecoder)(prefix);
exports.steem = {
    name,
    coinType,
    encode: exports.encodeSteemAddress,
    decode: exports.decodeSteemAddress,
};
//# sourceMappingURL=steem.js.map