"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xem = exports.decodeXemAddress = exports.encodeXemAddress = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const base32_js_1 = require("../utils/base32.js");
const bytes_js_1 = require("../utils/bytes.js");
const name = "xem";
const coinType = 43;
exports.encodeXemAddress = base32_js_1.base32Encode;
const decodeXemAddress = (source) => {
    const address = source.toUpperCase().replace(/-/g, "");
    if (!address || address.length !== 40)
        throw new Error("Invalid address");
    const decoded = (0, base32_js_1.base32Decode)(address);
    let checksum = (0, bytes_js_1.bytesToHexWithoutPrefix)((0, sha3_1.keccak_256)(decoded.slice(0, 21))).slice(0, 8);
    if (checksum !== (0, bytes_js_1.bytesToHexWithoutPrefix)(decoded.slice(21)))
        throw new Error("Invalid address");
    return decoded;
};
exports.decodeXemAddress = decodeXemAddress;
exports.xem = {
    name,
    coinType,
    encode: exports.encodeXemAddress,
    decode: exports.decodeXemAddress,
};
//# sourceMappingURL=xem.js.map