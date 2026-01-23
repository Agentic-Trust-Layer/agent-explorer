"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waves = exports.decodeWavesAddress = exports.encodeWavesAddress = void 0;
const blake2b_1 = require("@noble/hashes/blake2b");
const sha3_1 = require("@noble/hashes/sha3");
const base_1 = require("@scure/base");
const base58_js_1 = require("../utils/base58.js");
const name = "waves";
const coinType = 5741564;
const checksumFn = (source) => (0, sha3_1.keccak_256)((0, blake2b_1.blake2b)(source, { dkLen: 32 }));
const checksumLength = 4;
const wavesChecksum = base_1.utils.checksum(checksumLength, checksumFn);
exports.encodeWavesAddress = base58_js_1.base58UncheckedEncode;
const decodeWavesAddress = (source) => {
    const decoded = (0, base58_js_1.base58UncheckedDecode)(source);
    if (decoded[0] !== 1)
        throw new Error("Invalid address format");
    if (decoded[1] !== 87 || decoded.length !== 26)
        throw new Error("Invalid address format");
    wavesChecksum.decode(decoded);
    return decoded;
};
exports.decodeWavesAddress = decodeWavesAddress;
exports.waves = {
    name,
    coinType,
    encode: exports.encodeWavesAddress,
    decode: exports.decodeWavesAddress,
};
//# sourceMappingURL=waves.js.map