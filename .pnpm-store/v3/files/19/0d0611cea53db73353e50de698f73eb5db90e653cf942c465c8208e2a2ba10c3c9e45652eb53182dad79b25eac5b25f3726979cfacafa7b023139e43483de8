"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ada = exports.decodeAdaAddress = exports.encodeAdaAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const byron_js_1 = require("../utils/byron.js");
const name = "ada";
const coinType = 1815;
const hrp = "addr";
const limit = 104;
const cardanoBech32Encode = (0, bech32_js_1.createBech32Encoder)(hrp, limit);
const cardanoBech32Decode = (0, bech32_js_1.createBech32Decoder)(hrp, limit);
const encodeAdaAddress = (source) => {
    try {
        return (0, byron_js_1.byronEncode)(source);
    }
    catch {
        return cardanoBech32Encode(source);
    }
};
exports.encodeAdaAddress = encodeAdaAddress;
const decodeAdaAddress = (source) => {
    if (source.toLowerCase().startsWith(hrp)) {
        return cardanoBech32Decode(source);
    }
    return (0, byron_js_1.byronDecode)(source);
};
exports.decodeAdaAddress = decodeAdaAddress;
exports.ada = {
    name,
    coinType,
    encode: exports.encodeAdaAddress,
    decode: exports.decodeAdaAddress,
};
//# sourceMappingURL=ada.js.map