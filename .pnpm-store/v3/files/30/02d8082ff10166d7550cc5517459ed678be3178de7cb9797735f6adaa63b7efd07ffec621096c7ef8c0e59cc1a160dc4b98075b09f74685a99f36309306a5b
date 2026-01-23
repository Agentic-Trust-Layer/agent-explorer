"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hns = exports.decodeHnsAddress = exports.encodeHnsAddress = void 0;
const base_1 = require("@scure/base");
const name = "hns";
const coinType = 5353;
const hrp = "hs";
const versionBytes = new Uint8Array([0x00]);
const encodeHnsAddress = (source) => {
    if (source.length !== 20)
        throw new Error("Unrecognised address format");
    return base_1.bech32.encode(hrp, [versionBytes[0], ...base_1.bech32.toWords(source)]);
};
exports.encodeHnsAddress = encodeHnsAddress;
const decodeHnsAddress = (source) => {
    const { prefix, words } = base_1.bech32.decode(source);
    if (prefix !== hrp)
        throw new Error("Unrecognised address format");
    const version = words[0];
    const bytes = base_1.bech32.fromWords(words.slice(1));
    if (version !== versionBytes[0])
        throw new Error("Unrecognised address format");
    if (bytes.length !== 20)
        throw new Error("Unrecognised address format");
    return new Uint8Array(bytes);
};
exports.decodeHnsAddress = decodeHnsAddress;
exports.hns = {
    name,
    coinType,
    encode: exports.encodeHnsAddress,
    decode: exports.decodeHnsAddress,
};
//# sourceMappingURL=hns.js.map