"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.etn = exports.decodeEtnAddress = exports.encodeEtnAddress = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const utils_1 = require("@noble/hashes/utils");
const base_1 = require("@scure/base");
const xmr_js_1 = require("./xmr.js");
const name = "etn";
const coinType = 415;
const type = 18;
const etnChecksum = base_1.utils.checksum(4, sha3_1.keccak_256);
const encodeEtnAddress = (source) => {
    const sourceWithType = (0, utils_1.concatBytes)(new Uint8Array([type]), source);
    const checksummed = etnChecksum.encode(sourceWithType);
    return (0, xmr_js_1.encodeXmrAddress)(checksummed);
};
exports.encodeEtnAddress = encodeEtnAddress;
const decodeEtnAddress = (source) => {
    const decoded = (0, xmr_js_1.decodeXmrAddress)(source);
    if (decoded[0] !== 18)
        throw new Error("Unrecognised address format");
    const checksummed = etnChecksum.decode(decoded);
    return checksummed.slice(1);
};
exports.decodeEtnAddress = decodeEtnAddress;
exports.etn = {
    name,
    coinType,
    encode: exports.encodeEtnAddress,
    decode: exports.decodeEtnAddress,
};
//# sourceMappingURL=etn.js.map