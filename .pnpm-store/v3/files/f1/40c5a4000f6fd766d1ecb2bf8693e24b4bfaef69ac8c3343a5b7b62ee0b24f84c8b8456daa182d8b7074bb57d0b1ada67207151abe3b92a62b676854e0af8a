"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZcashEncoder = exports.createZcashDecoder = void 0;
const base58_js_1 = require("./base58.js");
const bech32_js_1 = require("./bech32.js");
const createZcashDecoder = ({ hrp, p2pkhVersions, p2shVersions, }) => {
    const decodeBech32 = (0, bech32_js_1.createBech32Decoder)(hrp);
    const decodeBase58 = (0, base58_js_1.createBase58VersionedDecoder)(p2pkhVersions, p2shVersions);
    return (source) => {
        if (source.toLowerCase().startsWith(hrp)) {
            return decodeBech32(source);
        }
        return decodeBase58(source);
    };
};
exports.createZcashDecoder = createZcashDecoder;
const createZcashEncoder = ({ hrp, p2pkhVersions, p2shVersions, }) => {
    const encodeBech32 = (0, bech32_js_1.createBech32Encoder)(hrp);
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
exports.createZcashEncoder = createZcashEncoder;
//# sourceMappingURL=zcash.js.map