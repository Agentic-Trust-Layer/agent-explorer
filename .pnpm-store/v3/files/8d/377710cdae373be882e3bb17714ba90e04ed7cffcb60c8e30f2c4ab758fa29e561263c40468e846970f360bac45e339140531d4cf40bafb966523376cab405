import { concatBytes } from "@noble/hashes/utils";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";
const name = "ae";
const coinType = 457;
export const encodeAeAddress = (source) => {
    return `ak_${base58CheckEncode(source.slice(2))}`;
};
export const decodeAeAddress = (source) => {
    return concatBytes(new Uint8Array([0x30, 0x78] /* 0x string */), base58CheckDecode(source.slice(3)));
};
export const ae = {
    name,
    coinType,
    encode: encodeAeAddress,
    decode: decodeAeAddress,
};
//# sourceMappingURL=ae.js.map