import { base58UncheckedDecode, base58UncheckedEncode, } from "../utils/base58.js";
const name = "sol";
const coinType = 501;
export const encodeSolAddress = (source) => {
    if (source.length !== 32)
        throw new Error("Unrecognised address format");
    const encoded = base58UncheckedEncode(source);
    if (encoded.length < 32 || encoded.length > 44)
        throw new Error("Unrecognised address format");
    return encoded;
};
export const decodeSolAddress = (source) => {
    if (source.length < 32 || source.length > 44)
        throw new Error("Unrecognised address format");
    const decoded = base58UncheckedDecode(source);
    if (decoded.length !== 32)
        throw new Error("Unrecognised address format");
    return decoded;
};
export const sol = {
    name,
    coinType,
    encode: encodeSolAddress,
    decode: decodeSolAddress,
};
//# sourceMappingURL=sol.js.map