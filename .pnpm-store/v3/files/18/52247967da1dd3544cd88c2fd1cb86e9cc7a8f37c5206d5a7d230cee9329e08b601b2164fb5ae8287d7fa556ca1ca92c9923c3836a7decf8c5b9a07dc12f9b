import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";
const name = "avax";
const coinType = 9000;
const hrp = "avax";
const decodeBech32 = createBech32Decoder(hrp);
export const encodeAvaxAddress = createBech32Encoder(hrp);
export const decodeAvaxAddress = (source) => {
    let address;
    const [id, possibleAddr] = source.split("-");
    if (!possibleAddr) {
        address = id;
    }
    else {
        address = possibleAddr;
    }
    return decodeBech32(address);
};
export const avax = {
    name,
    coinType,
    encode: encodeAvaxAddress,
    decode: decodeAvaxAddress,
};
//# sourceMappingURL=avax.js.map