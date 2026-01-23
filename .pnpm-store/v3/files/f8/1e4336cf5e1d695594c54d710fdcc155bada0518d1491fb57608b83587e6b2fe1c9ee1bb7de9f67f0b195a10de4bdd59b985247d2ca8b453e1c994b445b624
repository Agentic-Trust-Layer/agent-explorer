"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base32CrockfordNormalise = exports.base32UnpaddedDecode = exports.base32UnpaddedEncode = exports.base32Decode = exports.base32Encode = void 0;
const base_1 = require("@scure/base");
exports.base32Encode = base_1.base32.encode;
exports.base32Decode = base_1.base32.decode;
const base32Unpadded = base_1.utils.chain(base_1.utils.radix2(5), base_1.utils.alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), base_1.utils.join(""));
exports.base32UnpaddedEncode = base32Unpadded.encode;
exports.base32UnpaddedDecode = base32Unpadded.decode;
const base32CrockfordNormalise = (source) => source.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1");
exports.base32CrockfordNormalise = base32CrockfordNormalise;
//# sourceMappingURL=base32.js.map