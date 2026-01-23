"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nano = exports.decodeNanoAddress = exports.encodeNanoAddress = void 0;
const blake2b_1 = require("@noble/hashes/blake2b");
const base_1 = require("@scure/base");
const name = "nano";
const coinType = 165;
const convertRadixNano = (data, from, to) => {
    const leftover = (data.length * from) % to;
    const offset = leftover === 0 ? 0 : to - leftover;
    let carry = 0;
    let pos = 0;
    const mask = 2 ** to - 1;
    const res = [];
    for (let i = 0; i < data.length; i++) {
        const n = data[i];
        if (n >= 2 ** from)
            throw new Error(`convertRadixNano: invalid data word=${n} from=${from}`);
        carry = (carry << from) | n;
        if (pos + from > 32)
            throw new Error(`convertRadixNano: carry overflow pos=${pos} from=${from}`);
        pos += from;
        for (; pos >= to; pos -= to) {
            res.push((carry >>> (pos + offset - to)) & mask);
        }
    }
    carry = (carry << (to - (pos + offset))) & mask;
    if (pos > 0)
        res.push(carry >>> 0);
    return res;
};
const radixNano = {
    encode: (source) => convertRadixNano(source, 8, 5),
    decode: (source) => {
        const leftover = (source.length * 5) % 8;
        let result = convertRadixNano(source, 5, 8);
        if (leftover !== 0)
            result = result.slice(1);
        return Uint8Array.from(result);
    },
};
const base32Nano = base_1.utils.chain(radixNano, base_1.utils.alphabet("13456789abcdefghijkmnopqrstuwxyz"), base_1.utils.join(""));
const encodeNanoAddress = (source) => {
    const encoded = base32Nano.encode(source);
    const checksum = (0, blake2b_1.blake2b)(source, { dkLen: 5 }).reverse();
    const checksumEncoded = base32Nano.encode(checksum);
    return `nano_${encoded}${checksumEncoded}`;
};
exports.encodeNanoAddress = encodeNanoAddress;
const decodeNanoAddress = (source) => {
    const decoded = base32Nano.decode(source.slice(5));
    return Uint8Array.from(decoded.slice(0, -5));
};
exports.decodeNanoAddress = decodeNanoAddress;
exports.nano = {
    name,
    coinType,
    encode: exports.encodeNanoAddress,
    decode: exports.decodeNanoAddress,
};
//# sourceMappingURL=nano.js.map