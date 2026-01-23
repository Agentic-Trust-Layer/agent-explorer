"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatUint8Arrays = exports.cidV0ToV1Base32 = exports.cidForWeb = void 0;
const cid_js_1 = require("./utils/cid.js");
const coders_js_1 = require("./utils/coders.js");
const dnsLabelMaxLength = 63;
const cidForWeb = (ipfsHash) => {
    let cid = cid_js_1.CID.parse(ipfsHash);
    if (cid.version === 0) {
        cid = cid.toV1();
    }
    const dnsLabel = cid.toString(coders_js_1.base32);
    if (dnsLabel.length > dnsLabelMaxLength) {
        const b36 = cid.toString(coders_js_1.base36);
        if (b36.length <= dnsLabelMaxLength) {
            return b36;
        }
        throw new TypeError(`CID is longer than DNS limit of ${dnsLabelMaxLength} characters and is not compatible with public gateways`);
    }
    return dnsLabel;
};
exports.cidForWeb = cidForWeb;
const cidV0ToV1Base32 = (ipfsHash) => {
    let cid = cid_js_1.CID.parse(ipfsHash);
    if (cid.version === 0) {
        cid = cid.toV1();
    }
    return cid.toString(coders_js_1.base32);
};
exports.cidV0ToV1Base32 = cidV0ToV1Base32;
const concatUint8Arrays = (array1, array2) => {
    let result = new Uint8Array(array1.length + array2.length);
    result.set(array1, 0);
    result.set(array2, array1.length);
    return result;
};
exports.concatUint8Arrays = concatUint8Arrays;
//# sourceMappingURL=helpers.js.map