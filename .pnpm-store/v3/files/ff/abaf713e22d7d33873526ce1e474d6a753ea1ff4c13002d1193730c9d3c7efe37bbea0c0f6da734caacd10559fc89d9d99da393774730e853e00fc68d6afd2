"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sol = exports.decodeSolAddress = exports.encodeSolAddress = void 0;
const base58_js_1 = require("../utils/base58.js");
const name = "sol";
const coinType = 501;
const encodeSolAddress = (source) => {
    if (source.length !== 32)
        throw new Error("Unrecognised address format");
    const encoded = (0, base58_js_1.base58UncheckedEncode)(source);
    if (encoded.length < 32 || encoded.length > 44)
        throw new Error("Unrecognised address format");
    return encoded;
};
exports.encodeSolAddress = encodeSolAddress;
const decodeSolAddress = (source) => {
    if (source.length < 32 || source.length > 44)
        throw new Error("Unrecognised address format");
    const decoded = (0, base58_js_1.base58UncheckedDecode)(source);
    if (decoded.length !== 32)
        throw new Error("Unrecognised address format");
    return decoded;
};
exports.decodeSolAddress = decodeSolAddress;
exports.sol = {
    name,
    coinType,
    encode: exports.encodeSolAddress,
    decode: exports.decodeSolAddress,
};
//# sourceMappingURL=sol.js.map