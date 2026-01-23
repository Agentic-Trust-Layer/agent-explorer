"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nim = exports.decodeNimAddress = exports.encodeNimAddress = void 0;
const base_1 = require("@scure/base");
const name = "nim";
const coinType = 242;
const CCODE = "NQ";
const ibanCheck = (data) => {
    const num = data
        .toUpperCase()
        .split("")
        .map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 48 && code <= 57) {
            return c;
        }
        else {
            return (code - 55).toString();
        }
    })
        .join("");
    let tmp = "";
    for (let i = 0; i < Math.ceil(num.length / 6); i++) {
        const a = num.slice(i * 6, i * 6 + 6);
        tmp = (parseInt(tmp + a, 10) % 97).toString();
    }
    return parseInt(tmp, 10);
};
const nimChecksum = (source) => {
    return ("00" + (98 - ibanCheck(source + CCODE + "00"))).slice(-2);
};
const base32Nim = base_1.utils.chain(base_1.utils.radix2(5), base_1.utils.alphabet("0123456789ABCDEFGHJKLMNPQRSTUVXY"), base_1.utils.padding(5), base_1.utils.join(""));
const encodeNimAddress = (source) => {
    const base32Part = base32Nim.encode(source);
    const checksummed = nimChecksum(base32Part);
    return `${CCODE}${checksummed}${base32Part}`.replace(/.{4}/g, "$& ").trim();
};
exports.encodeNimAddress = encodeNimAddress;
const decodeNimAddress = (source) => {
    if (!source.startsWith(CCODE))
        throw new Error("Unrecognised address format");
    const noWhitespace = source.replace(/ /g, "");
    const checksum = noWhitespace.slice(2, 4);
    const base32Part = noWhitespace.slice(4);
    if (checksum !== nimChecksum(base32Part))
        throw new Error("Unrecognised address format");
    return base32Nim.decode(base32Part);
};
exports.decodeNimAddress = decodeNimAddress;
exports.nim = {
    name,
    coinType,
    encode: exports.encodeNimAddress,
    decode: exports.decodeNimAddress,
};
//# sourceMappingURL=nim.js.map