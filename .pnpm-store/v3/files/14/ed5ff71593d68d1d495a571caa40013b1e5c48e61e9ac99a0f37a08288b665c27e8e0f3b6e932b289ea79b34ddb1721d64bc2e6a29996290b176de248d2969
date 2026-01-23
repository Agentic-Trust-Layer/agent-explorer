"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stx = exports.decodeStxAddress = exports.encodeStxAddress = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const sha256_1 = require("@noble/hashes/sha256");
const utils_2 = require("@noble/hashes/utils");
const base_1 = require("@scure/base");
const base32_js_1 = require("../utils/base32.js");
const name = "stx";
const coinType = 5757;
const prefix = "S";
const length = 20;
const checkumLength = 4;
const p2pkhVersion = new Uint8Array([22]);
const p2shVersion = new Uint8Array([20]);
const radixStx = {
    encode: (source) => convertRadixStx(source, 8, 5, true),
    decode: (source) => Uint8Array.from(convertRadixStx(source, 5, 8, false)),
};
const convertRadixStx = (data, from, to, padding) => {
    let carry = 0;
    let pos = 0;
    const mask = 2 ** to - 1;
    const res = [];
    for (const n of data.reverse()) {
        carry = (n << pos) | carry;
        pos += from;
        let i = 0;
        for (; pos >= to; pos -= to) {
            const v = ((carry >> (to * i)) & mask) >>> 0;
            res.unshift(v);
            i += 1;
        }
        carry = carry >> (to * i);
    }
    if (!padding && pos >= from)
        throw new Error("Excess padding");
    if (!padding && carry)
        throw new Error(`Non-zero padding: ${carry}`);
    if (padding && pos > 0)
        res.unshift(carry >>> 0);
    return res;
};
const base32Stx = base_1.utils.chain(radixStx, base_1.utils.alphabet("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), base_1.utils.join(""));
const stxChecksum = (data) => (0, sha256_1.sha256)((0, sha256_1.sha256)(data)).slice(0, checkumLength);
const encodeStxAddress = (source) => {
    if (source.length !== length + checkumLength)
        throw new Error("Unrecognised address format");
    const hash160 = source.slice(0, length);
    const checksum = source.slice(-checkumLength);
    let version;
    let encoded;
    if ((0, utils_1.equalBytes)(checksum, stxChecksum((0, utils_2.concatBytes)(p2pkhVersion, hash160)))) {
        version = "P";
        encoded = base32Stx.encode(source);
    }
    else if ((0, utils_1.equalBytes)(checksum, stxChecksum((0, utils_2.concatBytes)(p2shVersion, hash160)))) {
        version = "M";
        encoded = base32Stx.encode(source);
    }
    else
        throw new Error("Unrecognised address format");
    return `${prefix}${version}${encoded}`;
};
exports.encodeStxAddress = encodeStxAddress;
const decodeStxAddress = (source) => {
    if (source.length < 6)
        throw new Error("Unrecognised address format");
    if (source[0] !== "S")
        throw new Error("Unrecognised address format");
    const normalised = (0, base32_js_1.base32CrockfordNormalise)(source);
    const version = normalised[1];
    let versionBytes;
    if (version === "P")
        versionBytes = p2pkhVersion;
    else if (version === "M")
        versionBytes = p2shVersion;
    else
        throw new Error("Unrecognised address format");
    const payload = base32Stx.decode(normalised.slice(2));
    const decoded = payload.slice(0, -checkumLength);
    const checksum = payload.slice(-checkumLength);
    const newChecksum = stxChecksum((0, utils_2.concatBytes)(versionBytes, decoded));
    if (!(0, utils_1.equalBytes)(checksum, newChecksum))
        throw new Error("Unrecognised address format");
    return payload;
};
exports.decodeStxAddress = decodeStxAddress;
exports.stx = {
    name,
    coinType,
    encode: exports.encodeStxAddress,
    decode: exports.decodeStxAddress,
};
//# sourceMappingURL=stx.js.map