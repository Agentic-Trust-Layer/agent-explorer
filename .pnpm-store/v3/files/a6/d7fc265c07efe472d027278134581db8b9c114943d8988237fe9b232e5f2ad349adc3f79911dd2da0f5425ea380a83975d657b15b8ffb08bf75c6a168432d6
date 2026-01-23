"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64url = exports.base36 = exports.base32 = exports.base58btc = void 0;
const coders_1 = require("@ensdomains/address-encoder/coders");
const base_1 = require("@scure/base");
const createMultibaseCoder = ({ name, prefix, encode: encodeWithoutPrefix, decode: decodeWithoutPrefix, }) => {
    const encode = (bytes) => `${prefix}${encodeWithoutPrefix(bytes)}`;
    const decode = (multibase) => {
        if (!multibase.startsWith(prefix)) {
            throw new Error(`Multibase ${name} must start with ${prefix}`);
        }
        return decodeWithoutPrefix(multibase.slice(prefix.length));
    };
    return {
        name,
        prefix,
        encode,
        decode,
    };
};
exports.base58btc = createMultibaseCoder({
    name: "base58btc",
    prefix: "z",
    encode: base_1.base58.encode,
    decode: base_1.base58.decode,
});
const customBase32 = base_1.utils.chain(base_1.utils.radix2(5), base_1.utils.alphabet("abcdefghijklmnopqrstuvwxyz234567"), base_1.utils.join(""));
exports.base32 = createMultibaseCoder({
    name: "base32",
    prefix: "b",
    encode: (bytes) => customBase32.encode(bytes),
    decode: (multibase) => customBase32.decode(multibase),
});
const base36Chain = base_1.utils.chain(base_1.utils.radix(36), base_1.utils.alphabet("0123456789abcdefghijklmnopqrstuvwxyz"), base_1.utils.join(""));
exports.base36 = createMultibaseCoder({
    name: "base36",
    prefix: "k",
    encode: base36Chain.encode,
    decode: base36Chain.decode,
});
exports.base64url = createMultibaseCoder({
    name: "base64url",
    prefix: "u",
    encode: coders_1.encodeArAddress,
    decode: coders_1.decodeArAddress,
});
//# sourceMappingURL=coders.js.map