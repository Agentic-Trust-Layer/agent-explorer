"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byronDecode = exports.byronEncode = void 0;
const base58_js_1 = require("./base58.js");
const cbor_js_1 = require("./cbor.js");
const crc32_js_1 = require("./crc32.js");
const byronEncode = (source) => {
    const checksum = (0, crc32_js_1.crc32)(source);
    const taggedValue = new cbor_js_1.TaggedValue(source.buffer, 24);
    const cborEncodedAddress = (0, cbor_js_1.cborEncode)([taggedValue, checksum]);
    const address = (0, base58_js_1.base58UncheckedEncode)(new Uint8Array(cborEncodedAddress));
    if (!address.startsWith("Ae2") && !address.startsWith("Ddz"))
        throw new Error("Unrecognised address format");
    return address;
};
exports.byronEncode = byronEncode;
const byronDecode = (source) => {
    const bytes = (0, base58_js_1.base58UncheckedDecode)(source);
    const cborDecoded = (0, cbor_js_1.cborDecode)(bytes.buffer);
    const taggedAddress = cborDecoded[0];
    if (taggedAddress === undefined)
        throw new Error("Unrecognised address format");
    const checksum = cborDecoded[1];
    const newChecksum = (0, crc32_js_1.crc32)(taggedAddress.value);
    if (checksum !== newChecksum)
        throw new Error("Unrecognised address format");
    return taggedAddress.value;
};
exports.byronDecode = byronDecode;
//# sourceMappingURL=byron.js.map