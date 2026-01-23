"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerce = void 0;
const coerce = (o) => {
    if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
        return o;
    if (o instanceof ArrayBuffer)
        return new Uint8Array(o);
    if (ArrayBuffer.isView(o)) {
        return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
    }
    throw new Error("Unknown type, must be binary type");
};
exports.coerce = coerce;
//# sourceMappingURL=coerce.js.map