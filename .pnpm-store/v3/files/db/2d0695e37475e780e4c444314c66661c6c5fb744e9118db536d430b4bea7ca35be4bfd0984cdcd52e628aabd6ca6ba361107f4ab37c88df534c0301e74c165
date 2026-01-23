import { createBase58VersionedDecoder, createBase58VersionedEncoder, } from "./base58.js";
import { createBech32SegwitDecoder, createBech32SegwitEncoder, } from "./bech32.js";
export const createBitcoinDecoder = ({ hrp, p2pkhVersions, p2shVersions, }) => {
    const decodeBech32 = createBech32SegwitDecoder(hrp);
    const decodeBase58 = createBase58VersionedDecoder(p2pkhVersions, p2shVersions);
    return (source) => {
        if (source.toLowerCase().startsWith(hrp + "1")) {
            return decodeBech32(source);
        }
        return decodeBase58(source);
    };
};
export const createBitcoinEncoder = ({ hrp, p2pkhVersions, p2shVersions, }) => {
    const encodeBech32 = createBech32SegwitEncoder(hrp);
    const encodeBase58 = createBase58VersionedEncoder(p2pkhVersions[0], p2shVersions[0]);
    return (source) => {
        try {
            return encodeBase58(source);
        }
        catch {
            return encodeBech32(source);
        }
    };
};
//# sourceMappingURL=bitcoin.js.map