"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nostr = exports.decodeNostrAddress = exports.encodeNostrAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "nostr";
const coinType = 1237;
const hrp = "npub";
exports.encodeNostrAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
exports.decodeNostrAddress = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.nostr = {
    name,
    coinType,
    encode: exports.encodeNostrAddress,
    decode: exports.decodeNostrAddress,
};
//# sourceMappingURL=nostr.js.map