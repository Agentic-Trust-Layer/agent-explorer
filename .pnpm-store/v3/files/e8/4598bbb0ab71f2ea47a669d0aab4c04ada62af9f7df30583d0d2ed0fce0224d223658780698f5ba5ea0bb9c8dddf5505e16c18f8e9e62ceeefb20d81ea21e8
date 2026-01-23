"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcn = exports.decodeBcnAddress = exports.encodeBcnAddress = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const sha3_1 = require("@noble/hashes/sha3");
const utils_2 = require("@noble/hashes/utils");
const base_1 = require("@scure/base");
const xmr_js_1 = require("./xmr.js");
const name = "bcn";
const coinType = 204;
const bcnChecksum = base_1.utils.checksum(4, sha3_1.keccak_256);
const encodeBcnAddress = (source) => {
    const checksum = (0, sha3_1.keccak_256)(source).slice(0, 4);
    return (0, xmr_js_1.encodeXmrAddress)((0, utils_2.concatBytes)(source, checksum));
};
exports.encodeBcnAddress = encodeBcnAddress;
const decodeBcnAddress = (source) => {
    const decoded = (0, xmr_js_1.decodeXmrAddress)(source);
    const tag = decoded.slice(0, -68);
    if (decoded.length < 68 ||
        (!(0, utils_1.equalBytes)(tag, new Uint8Array([0x06])) &&
            !(0, utils_1.equalBytes)(tag, new Uint8Array([0xce, 0xf6, 0x22]))))
        throw new Error("Unrecognised address format");
    return bcnChecksum.decode(decoded);
};
exports.decodeBcnAddress = decodeBcnAddress;
exports.bcn = {
    name,
    coinType,
    encode: exports.encodeBcnAddress,
    decode: exports.decodeBcnAddress,
};
//# sourceMappingURL=bcn.js.map