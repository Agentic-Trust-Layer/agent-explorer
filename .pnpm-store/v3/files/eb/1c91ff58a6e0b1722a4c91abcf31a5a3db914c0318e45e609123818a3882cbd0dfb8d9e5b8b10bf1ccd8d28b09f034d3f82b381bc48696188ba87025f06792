import { bytesToHex, hexWithoutPrefixToBytes } from "../utils/bytes.js";
import { validateFlowAddress } from "../utils/flow.js";
const name = "flow";
const coinType = 539;
const addressLength = 8;
export const encodeFlowAddress = (source) => {
    let bytes = new Uint8Array(addressLength);
    if (source.length > addressLength) {
        bytes.set(source.slice(source.length - addressLength));
    }
    else {
        bytes.set(source, addressLength - source.length);
    }
    return bytesToHex(bytes).toLowerCase();
};
export const decodeFlowAddress = (source) => {
    if (!validateFlowAddress(BigInt(source)))
        throw new Error("Unrecognised address format");
    return hexWithoutPrefixToBytes(source.startsWith("0x") ? source.slice(2) : source);
};
export const flow = {
    name,
    coinType,
    encode: encodeFlowAddress,
    decode: decodeFlowAddress,
};
//# sourceMappingURL=flow.js.map