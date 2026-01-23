import { base10ToBytes, bytesToBase10 } from "../utils/bytes.js";
const name = "lsk";
const coinType = 134;
export const encodeLskAddress = (source) => {
    return `${bytesToBase10(source)}L`;
};
export const decodeLskAddress = (source) => {
    if (source.length < 2 || source.length > 22)
        throw new Error("Invalid address length");
    if (!source.endsWith("L") || source.includes("."))
        throw new Error("Invalid address format");
    return base10ToBytes(source.slice(0, -1));
};
export const lsk = {
    name,
    coinType,
    encode: encodeLskAddress,
    decode: decodeLskAddress,
};
//# sourceMappingURL=lsk.js.map