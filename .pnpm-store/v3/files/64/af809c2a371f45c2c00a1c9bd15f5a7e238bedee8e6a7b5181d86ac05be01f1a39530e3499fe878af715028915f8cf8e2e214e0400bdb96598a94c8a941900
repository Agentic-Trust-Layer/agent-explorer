"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xrp = exports.decodeXrpAddress = exports.encodeXrpAddress = void 0;
const sha256_1 = require("@noble/hashes/sha256");
const base_1 = require("@scure/base");
const name = "xrp";
const coinType = 144;
const base58XrpCheck = base_1.utils.chain(base_1.utils.checksum(4, (data) => (0, sha256_1.sha256)((0, sha256_1.sha256)(data))), base_1.base58xrp);
exports.encodeXrpAddress = base58XrpCheck.encode;
exports.decodeXrpAddress = base58XrpCheck.decode;
exports.xrp = {
    name,
    coinType,
    encode: exports.encodeXrpAddress,
    decode: exports.decodeXrpAddress,
};
//# sourceMappingURL=xrp.js.map