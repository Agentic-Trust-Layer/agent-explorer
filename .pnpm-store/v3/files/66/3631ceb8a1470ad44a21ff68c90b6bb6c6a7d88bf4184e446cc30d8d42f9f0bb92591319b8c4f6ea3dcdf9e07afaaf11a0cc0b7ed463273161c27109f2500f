import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex, hexToBytes, stringToBytes } from "./bytes.js";
export const stripHexPrefix = (str) => str.startsWith("0x") ? str.slice(2) : str;
export const rawChecksumAddress = ({ address, hash, length, }) => {
    for (let i = 0; i < length; i += 2) {
        if (hash[i >> 1] >> 4 >= 8 && address[i]) {
            address[i] = address[i].toUpperCase();
        }
        if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
            address[i + 1] = address[i + 1].toUpperCase();
        }
    }
    return `0x${address.join("")}`;
};
export function checksumAddress(address_, chainId) {
    const hexAddress = chainId
        ? `${chainId}${address_.toLowerCase()}`
        : address_.substring(2).toLowerCase();
    const hash = keccak_256(stringToBytes(hexAddress));
    const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
    return rawChecksumAddress({ address, hash, length: 40 });
}
export function isAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
export function isValidChecksumAddress(address, chainId) {
    return isAddress(address) && checksumAddress(address, chainId) === address;
}
export const createHexChecksummedEncoder = (chainId) => (source) => checksumAddress(bytesToHex(source), chainId);
export const createHexChecksummedDecoder = (chainId) => (source) => {
    if (!isValidChecksumAddress(source, chainId)) {
        throw Error("Unrecognised address format");
    }
    return hexToBytes(source);
};
//# sourceMappingURL=hex.js.map