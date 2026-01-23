import { concatBytes } from "@noble/hashes/utils";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";
const name = "bsv";
const coinType = 236;
export const encodeBsvAddress = (source) => base58CheckEncode(concatBytes(new Uint8Array([0x00]), source));
export const decodeBsvAddress = (source) => {
    const decoded = base58CheckDecode(source);
    if (decoded.length !== 21)
        throw new Error("Unrecognised address format");
    const version = decoded[0];
    if (version !== 0x00)
        throw new Error("Unrecognised address format");
    return decoded.slice(1);
};
export const bsv = {
    name,
    coinType,
    encode: encodeBsvAddress,
    decode: decodeBsvAddress,
};
//# sourceMappingURL=bsv.js.map