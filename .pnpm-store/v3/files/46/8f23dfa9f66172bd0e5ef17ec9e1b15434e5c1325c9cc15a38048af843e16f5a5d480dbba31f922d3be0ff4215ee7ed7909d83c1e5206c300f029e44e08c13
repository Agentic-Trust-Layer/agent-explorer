import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";
const name = "ark";
const coinType = 111;
export const encodeArkAddress = base58CheckEncode;
export const decodeArkAddress = (source) => {
    const decoded = base58CheckDecode(source);
    if (decoded[0] !== 23)
        throw new Error("Invalid address");
    return decoded;
};
export const ark = {
    name,
    coinType,
    encode: encodeArkAddress,
    decode: decodeArkAddress,
};
//# sourceMappingURL=ark.js.map