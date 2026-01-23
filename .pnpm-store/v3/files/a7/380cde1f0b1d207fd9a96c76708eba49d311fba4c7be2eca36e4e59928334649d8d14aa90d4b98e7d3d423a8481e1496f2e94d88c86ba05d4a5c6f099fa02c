"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBitcoinEncoder = exports.createBitcoinDecoder = void 0;
const base58_js_1 = require("./base58.js");
const bech32_js_1 = require("./bech32.js");
const createBitcoinDecoder = ({ hrp, p2pkhVersions, p2shVersions, }) => {
    const decodeBech32 = (0, bech32_js_1.createBech32SegwitDecoder)(hrp);
    const decodeBase58 = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
    return (source) => {
        if (source.toLowerCase().startsWith(hrp + "1")) {
            return decodeBech32(source);
        }
        return decodeBase58(source);
    };
};
exports.createBitcoinDecoder = createBitcoinDecoder;
const createBitcoinEncoder = ({ hrp, p2pkhVersions, p2shVersions, }) => {
    const encodeBech32 = (0, bech32_js_1.createBech32SegwitEncoder)(hrp);
    const encodeBase58 = (0, base58_js_1.createBase58VersionedEncoder)(p2pkhVersions[0], p2shVersions[0]);
    return (source) => {
        try {
            return encodeBase58(source);
        }
        catch {
            return encodeBech32(source);
        }
    };
};
exports.createBitcoinEncoder = createBitcoinEncoder;
//# sourceMappingURL=bitcoin.js.map