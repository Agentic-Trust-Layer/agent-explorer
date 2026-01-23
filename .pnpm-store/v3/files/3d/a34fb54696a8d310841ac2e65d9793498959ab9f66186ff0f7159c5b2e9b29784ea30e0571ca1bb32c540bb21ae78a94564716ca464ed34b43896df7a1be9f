import { keccak_256 } from "@noble/hashes/sha3";
import { concatBytes } from "@noble/hashes/utils";
import { utils } from "@scure/base";
import { decodeXmrAddress, encodeXmrAddress } from "./xmr.js";
const name = "etn";
const coinType = 415;
const type = 18;
const etnChecksum = utils.checksum(4, keccak_256);
export const encodeEtnAddress = (source) => {
    const sourceWithType = concatBytes(new Uint8Array([type]), source);
    const checksummed = etnChecksum.encode(sourceWithType);
    return encodeXmrAddress(checksummed);
};
export const decodeEtnAddress = (source) => {
    const decoded = decodeXmrAddress(source);
    if (decoded[0] !== 18)
        throw new Error("Unrecognised address format");
    const checksummed = etnChecksum.decode(decoded);
    return checksummed.slice(1);
};
export const etn = {
    name,
    coinType,
    encode: encodeEtnAddress,
    decode: decodeEtnAddress,
};
//# sourceMappingURL=etn.js.map