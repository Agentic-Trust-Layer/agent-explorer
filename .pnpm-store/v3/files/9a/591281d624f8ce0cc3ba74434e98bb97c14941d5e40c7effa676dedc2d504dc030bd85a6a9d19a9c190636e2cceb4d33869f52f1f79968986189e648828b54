"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBech32SegwitDecoder = exports.createBech32SegwitEncoder = exports.createBech32mDecoder = exports.createBech32mEncoder = exports.createBech32Decoder = exports.createBech32Encoder = void 0;
const utils_1 = require("@noble/hashes/utils");
const base_1 = require("@scure/base");
const createInternalBech32Encoder = ({ bechLib, hrp, limit }) => (source) => {
    return bechLib.encode(hrp, bechLib.toWords(source), limit);
};
const createInternalBech32Decoder = ({ bechLib, hrp, limit }) => (source) => {
    const { prefix, words } = bechLib.decode(source, limit);
    if (prefix !== hrp) {
        throw new Error("Unexpected human-readable part in bech32 encoded address");
    }
    return new Uint8Array(bechLib.fromWords(words));
};
const createBech32Encoder = (hrp, limit) => createInternalBech32Encoder({ hrp, bechLib: base_1.bech32, limit });
exports.createBech32Encoder = createBech32Encoder;
const createBech32Decoder = (hrp, limit) => createInternalBech32Decoder({ hrp, bechLib: base_1.bech32, limit });
exports.createBech32Decoder = createBech32Decoder;
const createBech32mEncoder = (hrp, limit) => createInternalBech32Encoder({ hrp, bechLib: base_1.bech32m, limit });
exports.createBech32mEncoder = createBech32mEncoder;
const createBech32mDecoder = (hrp, limit) => createInternalBech32Decoder({ hrp, bechLib: base_1.bech32m, limit });
exports.createBech32mDecoder = createBech32mDecoder;
const createBech32SegwitEncoder = (hrp) => (source) => {
    let version = source[0];
    if (version >= 0x51 && version <= 0x60) {
        version -= 0x50;
    }
    else if (version !== 0x00) {
        throw new Error("Unrecognised address format");
    }
    let words = [];
    if (version > 0 && version < 17) {
        words = [version].concat(base_1.bech32m.toWords(source.slice(2, source[1] + 2)));
        return base_1.bech32m.encode(hrp, words);
    }
    words = [version].concat(base_1.bech32.toWords(source.slice(2, source[1] + 2)));
    return base_1.bech32.encode(hrp, words);
};
exports.createBech32SegwitEncoder = createBech32SegwitEncoder;
const createBech32SegwitDecoder = (hrp) => (source) => {
    const decodedObj = base_1.bech32.decodeUnsafe(source) || base_1.bech32m.decodeUnsafe(source);
    if (!decodedObj)
        throw new Error("Unrecognised address format");
    const { prefix, words } = decodedObj;
    if (prefix !== hrp)
        throw new Error("Unexpected human-readable part in bech32 encoded address");
    const script = base_1.bech32.fromWords(words.slice(1));
    let version = words[0];
    if (version > 0) {
        version += 0x50;
    }
    return (0, utils_1.concatBytes)(new Uint8Array([version, script.length]), new Uint8Array(script));
};
exports.createBech32SegwitDecoder = createBech32SegwitDecoder;
//# sourceMappingURL=bech32.js.map