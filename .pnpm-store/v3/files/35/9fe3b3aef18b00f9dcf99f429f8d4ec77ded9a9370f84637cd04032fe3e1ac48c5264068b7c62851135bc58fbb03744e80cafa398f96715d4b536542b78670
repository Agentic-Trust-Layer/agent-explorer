"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fil = exports.decodeFilAddress = exports.encodeFilAddress = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const blake2b_1 = require("@noble/hashes/blake2b");
const utils_2 = require("@noble/hashes/utils");
const base32_js_1 = require("../utils/base32.js");
const leb128_js_1 = require("../utils/leb128.js");
const name = "fil";
const coinType = 461;
const validateFilAddress = (address) => {
    if (address.length < 3)
        return false;
    if (address[0] !== "f")
        return false;
    if (address[1] === "0") {
        if (address.length > 22)
            return false;
    }
    else if (address[1] === "1" || address[1] === "2") {
        if (address.length !== 41)
            return false;
    }
    else if (address[1] === "3") {
        if (address.length !== 86)
            return false;
    }
    else {
        return false;
    }
    return true;
};
const filChecksum = (source) => (0, blake2b_1.blake2b)(source, { dkLen: 4 });
const encodeFilAddress = (source) => {
    const payload = source.slice(1);
    const protocol = source[0];
    if (protocol === 0) {
        const decoded = (0, leb128_js_1.decodeLeb128)(payload);
        return `f${protocol}${decoded}`;
    }
    const checksum = (0, blake2b_1.blake2b)(source, { dkLen: 4 });
    const bytes = (0, utils_2.concatBytes)(payload, checksum);
    const decoded = (0, base32_js_1.base32UnpaddedEncode)(bytes).toLowerCase();
    return `f${protocol}${decoded}`;
};
exports.encodeFilAddress = encodeFilAddress;
const decodeFilAddress = (source) => {
    if (!validateFilAddress(source))
        throw new Error("Unrecognised address format");
    const protocol = parseInt(source[1], 10);
    const protocolByte = new Uint8Array([protocol]);
    const encoded = source.slice(2);
    if (protocol === 0) {
        return (0, utils_2.concatBytes)(protocolByte, (0, leb128_js_1.encodeLeb128)(BigInt(encoded)));
    }
    const payloadWithChecksum = (0, base32_js_1.base32UnpaddedDecode)(encoded.toUpperCase());
    const payload = payloadWithChecksum.slice(0, -4);
    const checksum = payloadWithChecksum.slice(-4);
    const decoded = (0, utils_2.concatBytes)(protocolByte, payload);
    const newChecksum = filChecksum(decoded);
    if (!(0, utils_1.equalBytes)(checksum, newChecksum))
        throw new Error("Unrecognised address format");
    return decoded;
};
exports.decodeFilAddress = decodeFilAddress;
exports.fil = {
    name,
    coinType,
    encode: exports.encodeFilAddress,
    decode: exports.decodeFilAddress,
};
//# sourceMappingURL=fil.js.map