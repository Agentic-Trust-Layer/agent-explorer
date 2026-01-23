"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xlm = exports.decodeXlmAddress = exports.encodeXlmAddress = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const utils_2 = require("@noble/hashes/utils");
const base32_js_1 = require("../utils/base32.js");
const bytes_js_1 = require("../utils/bytes.js");
const name = "xlm";
const coinType = 148;
const versionByte = new Uint8Array([0x30]);
const xlmChecksum = (source) => {
    let crc = 0;
    for (let i = 0; i < source.length; i++) {
        const byte = source[i];
        let code = (crc >>> 8) & 0xff;
        code ^= byte & 0xff;
        code ^= code >>> 4;
        crc = (crc << 8) & 0xffff;
        crc ^= code;
        code = (code << 5) & 0xffff;
        crc ^= code;
        code = (code << 7) & 0xffff;
        crc ^= code;
    }
    return (0, bytes_js_1.hexWithoutPrefixToBytes)(crc.toString(16).padStart(4, "0")).reverse();
};
const encodeXlmAddress = (source) => {
    const payload = (0, utils_2.concatBytes)(versionByte, source);
    const checksummed = xlmChecksum(payload);
    const payloadWithChecksum = (0, utils_2.concatBytes)(payload, checksummed);
    return (0, base32_js_1.base32Encode)(payloadWithChecksum);
};
exports.encodeXlmAddress = encodeXlmAddress;
const decodeXlmAddress = (source) => {
    const decoded = (0, base32_js_1.base32Decode)(source);
    const version = decoded[0];
    const payload = decoded.slice(0, -2);
    const output = payload.slice(1);
    const checksum = decoded.slice(-2);
    if (version !== versionByte[0])
        throw new Error("Unrecognised address format");
    const newChecksum = xlmChecksum(payload);
    if (!(0, utils_1.equalBytes)(checksum, newChecksum))
        throw new Error("Unrecognised address format");
    return output;
};
exports.decodeXlmAddress = decodeXlmAddress;
exports.xlm = {
    name,
    coinType,
    encode: exports.encodeXlmAddress,
    decode: exports.decodeXlmAddress,
};
//# sourceMappingURL=xlm.js.map