"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avax = exports.decodeAvaxAddress = exports.encodeAvaxAddress = void 0;
const bech32_js_1 = require("../utils/bech32.js");
const name = "avax";
const coinType = 9000;
const hrp = "avax";
const decodeBech32 = (0, bech32_js_1.createBech32Decoder)(hrp);
exports.encodeAvaxAddress = (0, bech32_js_1.createBech32Encoder)(hrp);
const decodeAvaxAddress = (source) => {
    let address;
    const [id, possibleAddr] = source.split("-");
    if (!possibleAddr) {
        address = id;
    }
    else {
        address = possibleAddr;
    }
    return decodeBech32(address);
};
exports.decodeAvaxAddress = decodeAvaxAddress;
exports.avax = {
    name,
    coinType,
    encode: exports.encodeAvaxAddress,
    decode: exports.decodeAvaxAddress,
};
//# sourceMappingURL=avax.js.map