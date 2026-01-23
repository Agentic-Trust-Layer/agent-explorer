"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flow = exports.decodeFlowAddress = exports.encodeFlowAddress = void 0;
const bytes_js_1 = require("../utils/bytes.js");
const flow_js_1 = require("../utils/flow.js");
const name = "flow";
const coinType = 539;
const addressLength = 8;
const encodeFlowAddress = (source) => {
    let bytes = new Uint8Array(addressLength);
    if (source.length > addressLength) {
        bytes.set(source.slice(source.length - addressLength));
    }
    else {
        bytes.set(source, addressLength - source.length);
    }
    return (0, bytes_js_1.bytesToHex)(bytes).toLowerCase();
};
exports.encodeFlowAddress = encodeFlowAddress;
const decodeFlowAddress = (source) => {
    if (!(0, flow_js_1.validateFlowAddress)(BigInt(source)))
        throw new Error("Unrecognised address format");
    return (0, bytes_js_1.hexWithoutPrefixToBytes)(source.startsWith("0x") ? source.slice(2) : source);
};
exports.decodeFlowAddress = decodeFlowAddress;
exports.flow = {
    name,
    coinType,
    encode: exports.encodeFlowAddress,
    decode: exports.decodeFlowAddress,
};
//# sourceMappingURL=flow.js.map