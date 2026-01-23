"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodec = exports.encode = exports.decode = exports.cidV0ToV1Base32 = exports.cidForWeb = void 0;
const helpers_js_1 = require("./helpers.js");
const map_js_1 = require("./map.js");
const profiles_js_1 = require("./profiles.js");
const varint_js_1 = require("./utils/varint.js");
var helpers_js_2 = require("./helpers.js");
Object.defineProperty(exports, "cidForWeb", { enumerable: true, get: function () { return helpers_js_2.cidForWeb; } });
Object.defineProperty(exports, "cidV0ToV1Base32", { enumerable: true, get: function () { return helpers_js_2.cidV0ToV1Base32; } });
const decode = (contentHash) => {
    const bytes = (0, profiles_js_1.hexStringToBytes)(contentHash);
    const [code, offset] = (0, varint_js_1.decodeVarint)(bytes);
    const value = bytes.slice(offset);
    const name = map_js_1.codeToName[code];
    let profile = profiles_js_1.profiles[name];
    if (!profile)
        profile = profiles_js_1.profiles["default"];
    return profile.decode(value);
};
exports.decode = decode;
const encode = (name, value) => {
    let profile = profiles_js_1.profiles[name];
    if (!profile)
        profile = profiles_js_1.profiles["default"];
    const bytes = profile.encode(value);
    const code = map_js_1.nameToCode[name];
    const codeBytes = (0, varint_js_1.encodeVarint)(code, new Uint8Array((0, varint_js_1.varintEncodingLength)(code)));
    return (0, profiles_js_1.bytesToHexString)((0, helpers_js_1.concatUint8Arrays)(codeBytes, bytes));
};
exports.encode = encode;
const getCodec = (contentHash) => {
    const bytes = (0, profiles_js_1.hexStringToBytes)(contentHash);
    const [code] = (0, varint_js_1.decodeVarint)(bytes);
    return map_js_1.codeToName[code];
};
exports.getCodec = getCodec;
//# sourceMappingURL=index.js.map