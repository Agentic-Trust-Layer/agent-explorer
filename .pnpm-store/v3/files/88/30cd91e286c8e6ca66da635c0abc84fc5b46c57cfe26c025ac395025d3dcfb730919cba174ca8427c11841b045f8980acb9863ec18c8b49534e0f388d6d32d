"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDotAddressDecoder = exports.createDotAddressEncoder = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const blake2b_1 = require("@noble/hashes/blake2b");
const utils_2 = require("@noble/hashes/utils");
const base58_js_1 = require("./base58.js");
const prefixStringBytes = new Uint8Array([
    0x53, 0x53, 0x35, 0x38, 0x50, 0x52, 0x45,
]);
const dotChecksum = (sourceWithTypePrefix) => (0, blake2b_1.blake2b)((0, utils_2.concatBytes)(prefixStringBytes, sourceWithTypePrefix)).slice(0, 2);
const createDotAddressEncoder = (type) => (source) => {
    const typePrefix = new Uint8Array([type]);
    const sourceWithTypePrefix = (0, utils_2.concatBytes)(typePrefix, source);
    const checksum = dotChecksum(sourceWithTypePrefix);
    return (0, base58_js_1.base58UncheckedEncode)((0, utils_2.concatBytes)(sourceWithTypePrefix, checksum));
};
exports.createDotAddressEncoder = createDotAddressEncoder;
const createDotAddressDecoder = (type) => (source) => {
    const decoded = (0, base58_js_1.base58UncheckedDecode)(source);
    if (decoded[0] !== type)
        throw new Error("Unrecognized address format");
    const checksum = decoded.slice(33, 35);
    const newChecksum = dotChecksum(decoded.slice(0, 33));
    if (!(0, utils_1.equalBytes)(checksum, newChecksum))
        throw new Error("Unrecognized address format");
    return decoded.slice(1, 33);
};
exports.createDotAddressDecoder = createDotAddressDecoder;
//# sourceMappingURL=dot.js.map