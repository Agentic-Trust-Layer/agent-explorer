"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeLeb128 = exports.encodeLeb128 = void 0;
const encodeLeb128 = (source) => {
    const bytes = [];
    do {
        let byte = Number(source & 127n);
        source >>= 7n;
        if (source != 0n) {
            byte = byte | 128;
        }
        bytes.push(byte);
    } while (source != 0n);
    return Uint8Array.from(bytes);
};
exports.encodeLeb128 = encodeLeb128;
const decodeLeb128 = (source) => {
    let result = 0n;
    let shift = 0n;
    for (const byte of source) {
        result |= BigInt(byte & 127) << shift;
        if ((byte & 128) === 0)
            break;
        shift += 7n;
    }
    return result;
};
exports.decodeLeb128 = decodeLeb128;
//# sourceMappingURL=leb128.js.map