import { decodeArAddress, encodeArAddress, } from "@ensdomains/address-encoder/coders";
import { base58, utils } from "@scure/base";
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
export const base58btc = createMultibaseCoder({
    name: "base58btc",
    prefix: "z",
    encode: base58.encode,
    decode: base58.decode,
});
const customBase32 = utils.chain(utils.radix2(5), utils.alphabet("abcdefghijklmnopqrstuvwxyz234567"), utils.join(""));
export const base32 = createMultibaseCoder({
    name: "base32",
    prefix: "b",
    encode: (bytes) => customBase32.encode(bytes),
    decode: (multibase) => customBase32.decode(multibase),
});
const base36Chain = utils.chain(utils.radix(36), utils.alphabet("0123456789abcdefghijklmnopqrstuvwxyz"), utils.join(""));
export const base36 = createMultibaseCoder({
    name: "base36",
    prefix: "k",
    encode: base36Chain.encode,
    decode: base36Chain.decode,
});
export const base64url = createMultibaseCoder({
    name: "base64url",
    prefix: "u",
    encode: encodeArAddress,
    decode: decodeArAddress,
});
//# sourceMappingURL=coders.js.map