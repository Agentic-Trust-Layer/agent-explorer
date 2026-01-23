"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.algo = exports.decodeAlgoAddress = exports.encodeAlgoAddress = void 0;
const sha512_1 = require("@noble/hashes/sha512");
const base_1 = require("@scure/base");
const base32_js_1 = require("../utils/base32.js");
const name = "algo";
const coinType = 283;
const algoChecksum = base_1.utils.checksum(4, (data) => (0, sha512_1.sha512_256)(data).slice(-4));
const encodeAlgoAddress = (source) => {
    const checksum = algoChecksum.encode(source);
    return (0, base32_js_1.base32UnpaddedEncode)(checksum);
};
exports.encodeAlgoAddress = encodeAlgoAddress;
const decodeAlgoAddress = (source) => {
    const decoded = (0, base32_js_1.base32UnpaddedDecode)(source);
    if (decoded.length !== 36)
        throw new Error("Unrecognised address format");
    return algoChecksum.decode(decoded);
};
exports.decodeAlgoAddress = decodeAlgoAddress;
exports.algo = {
    name,
    coinType,
    encode: exports.encodeAlgoAddress,
    decode: exports.decodeAlgoAddress,
};
//# sourceMappingURL=algo.js.map