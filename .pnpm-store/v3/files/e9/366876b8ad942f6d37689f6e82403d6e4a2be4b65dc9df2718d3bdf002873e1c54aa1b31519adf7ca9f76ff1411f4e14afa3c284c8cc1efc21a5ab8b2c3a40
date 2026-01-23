"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBase58VersionedDecoder = exports.createBase58VersionedEncoder = exports.base58CheckDecode = exports.base58CheckEncode = exports.base58UncheckedDecode = exports.base58UncheckedEncode = void 0;
const sha256_1 = require("@noble/hashes/sha256");
const utils_1 = require("@noble/hashes/utils");
const base_1 = require("@scure/base");
const base58Unchecked = base_1.base58;
exports.base58UncheckedEncode = base58Unchecked.encode;
exports.base58UncheckedDecode = base58Unchecked.decode;
const base58Check = (0, base_1.createBase58check)(sha256_1.sha256);
exports.base58CheckEncode = base58Check.encode;
exports.base58CheckDecode = base58Check.decode;
const createBase58VersionedEncoder = (p2pkhVersion, p2shVersion) => (source) => {
    if (source[0] === 0x76) {
        if (source[1] !== 0xa9 ||
            source[source.length - 2] !== 0x88 ||
            source[source.length - 1] !== 0xac) {
            throw new Error("Unrecognised address format");
        }
        return (0, exports.base58CheckEncode)((0, utils_1.concatBytes)(p2pkhVersion, source.slice(3, 3 + source[2])));
    }
    if (source[0] === 0xa9) {
        if (source[source.length - 1] !== 0x87) {
            throw new Error("Unrecognised address format");
        }
        return (0, exports.base58CheckEncode)((0, utils_1.concatBytes)(p2shVersion, source.slice(2, 2 + source[1])));
    }
    throw new Error("Unrecognised address format");
};
exports.createBase58VersionedEncoder = createBase58VersionedEncoder;
const createBase58VersionedDecoder = (p2pkhVersions, p2shVersions) => (source) => {
    const addr = (0, exports.base58CheckDecode)(source);
    const checkVersion = (version) => {
        return version.every((value, index) => index < addr.length && value === addr[index]);
    };
    if (p2pkhVersions.some(checkVersion))
        return (0, utils_1.concatBytes)(new Uint8Array([0x76, 0xa9, 0x14]), addr.slice(p2pkhVersions[0].length), new Uint8Array([0x88, 0xac]));
    if (p2shVersions.some(checkVersion))
        return (0, utils_1.concatBytes)(new Uint8Array([0xa9, 0x14]), addr.slice(p2shVersions[0].length), new Uint8Array([0x87]));
    throw new Error("Unrecognised address format");
};
exports.createBase58VersionedDecoder = createBase58VersionedDecoder;
//# sourceMappingURL=base58.js.map