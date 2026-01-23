import { bytesToHex as bytesToNoPrefixHex, hexToBytes as noPrefixHexToBytes, } from "@noble/hashes/utils";
// https://github.com/wagmi-dev/viem/blob/0cd17e9e39fc88b414e125c1dfc9f55d7baf42b7/src/utils/encoding/toBytes.ts#L110C1-L132C2
export function hexToBytes(hex_) {
    let hex = hex_;
    let hexString = hex.slice(2);
    if (hexString.length % 2)
        hexString = `0${hexString}`;
    const bytes = new Uint8Array(hexString.length / 2);
    for (let index = 0; index < bytes.length; index++) {
        const start = index * 2;
        const hexByte = hexString.slice(start, start + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error(`Invalid byte sequence ("${hexByte}" in "${hexString}").`);
        bytes[index] = byte;
    }
    return bytes;
}
// https://github.com/wagmi-dev/viem/blob/0cd17e9e39fc88b414e125c1dfc9f55d7baf42b7/src/utils/encoding/fromHex.ts#L213C1-L220C2
export function hexToString(hex) {
    let bytes = hexToBytes(hex);
    return new TextDecoder().decode(bytes);
}
export function bytesToString(bytes) {
    return new TextDecoder().decode(bytes);
}
export function stringToBytes(str) {
    return new TextEncoder().encode(str);
}
export function bytesToHex(bytes) {
    return `0x${bytesToNoPrefixHex(bytes)}`;
}
export function bytesToBase10(bytes) {
    let bigInt = BigInt(0);
    for (let i = 0; i < bytes.length; i++) {
        bigInt = (bigInt << BigInt(8)) | BigInt(bytes[i]);
    }
    return bigInt.toString(10);
}
export function base10ToBytes(base10) {
    let bigInt = BigInt(base10);
    const bytes = [];
    while (bigInt > 0) {
        bytes.unshift(Number(bigInt & BigInt(0xff)));
        bigInt >>= BigInt(8);
    }
    return new Uint8Array(bytes);
}
export const bytesToHexWithoutPrefix = bytesToNoPrefixHex;
export const hexWithoutPrefixToBytes = noPrefixHexToBytes;
//# sourceMappingURL=bytes.js.map