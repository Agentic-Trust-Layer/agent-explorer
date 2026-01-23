import { bytesToString, stringToBytes } from "../utils/bytes.js";
import { validateNearAddress } from "../utils/near.js";
const name = "near";
const coinType = 397;
export const encodeNearAddress = (source) => {
    const encoded = bytesToString(source);
    if (!validateNearAddress(encoded))
        throw new Error("Unrecognised address format");
    return encoded;
};
export const decodeNearAddress = (source) => {
    if (!validateNearAddress(source))
        throw new Error("Unrecognised address format");
    return stringToBytes(source);
};
export const near = {
    name,
    coinType,
    encode: encodeNearAddress,
    decode: decodeNearAddress,
};
//# sourceMappingURL=near.js.map