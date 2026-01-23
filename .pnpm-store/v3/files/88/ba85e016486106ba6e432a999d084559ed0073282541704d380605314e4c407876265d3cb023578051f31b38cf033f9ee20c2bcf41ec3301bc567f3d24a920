"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iota = exports.decodeIotaAddress = exports.encodeIotaAddress = void 0;
const utils_1 = require("@noble/hashes/utils");
const bech32_js_1 = require("../utils/bech32.js");
const name = "iota";
const coinType = 4218;
const hrp = "iota";
const version = new Uint8Array([0x00]);
const iotaBech32Encode = (0, bech32_js_1.createBech32Encoder)(hrp);
const iotaBech32Decode = (0, bech32_js_1.createBech32Decoder)(hrp);
const encodeIotaAddress = (source) => {
    return iotaBech32Encode((0, utils_1.concatBytes)(version, source));
};
exports.encodeIotaAddress = encodeIotaAddress;
const decodeIotaAddress = (source) => {
    const decoded = iotaBech32Decode(source);
    return decoded.slice(1);
};
exports.decodeIotaAddress = decodeIotaAddress;
exports.iota = {
    name,
    coinType,
    encode: exports.encodeIotaAddress,
    decode: exports.decodeIotaAddress,
};
//# sourceMappingURL=iota.js.map