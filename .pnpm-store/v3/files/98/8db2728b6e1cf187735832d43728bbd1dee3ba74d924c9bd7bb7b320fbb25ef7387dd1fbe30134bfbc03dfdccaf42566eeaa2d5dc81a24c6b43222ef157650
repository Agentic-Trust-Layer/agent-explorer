"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHexChecksummedDecoder = exports.createHexChecksummedEncoder = exports.isValidChecksumAddress = exports.isAddress = exports.checksumAddress = exports.rawChecksumAddress = exports.stripHexPrefix = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const bytes_js_1 = require("./bytes.js");
const stripHexPrefix = (str) => str.startsWith("0x") ? str.slice(2) : str;
exports.stripHexPrefix = stripHexPrefix;
const rawChecksumAddress = ({ address, hash, length, }) => {
    for (let i = 0; i < length; i += 2) {
        if (hash[i >> 1] >> 4 >= 8 && address[i]) {
            address[i] = address[i].toUpperCase();
        }
        if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
            address[i + 1] = address[i + 1].toUpperCase();
        }
    }
    return `0x${address.join("")}`;
};
exports.rawChecksumAddress = rawChecksumAddress;
function checksumAddress(address_, chainId) {
    const hexAddress = chainId
        ? `${chainId}${address_.toLowerCase()}`
        : address_.substring(2).toLowerCase();
    const hash = (0, sha3_1.keccak_256)((0, bytes_js_1.stringToBytes)(hexAddress));
    const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
    return (0, exports.rawChecksumAddress)({ address, hash, length: 40 });
}
exports.checksumAddress = checksumAddress;
function isAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
exports.isAddress = isAddress;
function isValidChecksumAddress(address, chainId) {
    if (!isAddress(address))
        return false;
    if (address === checksumAddress(address, chainId))
        return true;
    const prefixlessAddress = (0, exports.stripHexPrefix)(address);
    if (prefixlessAddress.toLowerCase() === prefixlessAddress)
        return true;
    if (prefixlessAddress.toUpperCase() === prefixlessAddress)
        return true;
    return false;
}
exports.isValidChecksumAddress = isValidChecksumAddress;
const createHexChecksummedEncoder = (chainId) => (source) => checksumAddress((0, bytes_js_1.bytesToHex)(source), chainId);
exports.createHexChecksummedEncoder = createHexChecksummedEncoder;
const createHexChecksummedDecoder = (chainId) => (source) => {
    if (!isValidChecksumAddress(source, chainId)) {
        throw new Error("Unrecognised address format");
    }
    return (0, bytes_js_1.hexToBytes)(source);
};
exports.createHexChecksummedDecoder = createHexChecksummedDecoder;
//# sourceMappingURL=hex.js.map