import { concatUint8Arrays } from "./helpers.js";
import { codeToName, nameToCode } from "./map.js";
import { bytesToHexString, hexStringToBytes, profiles, } from "./profiles.js";
import { decodeVarint, encodeVarint, varintEncodingLength, } from "./utils/varint.js";
export {} from "./map.js";
export { cidForWeb, cidV0ToV1Base32 } from "./helpers.js";
/**
 * Decode a Content Hash.
 * @param contentHash an hex string containing a content hash
 * @return the decoded content
 */
export const decode = (contentHash) => {
    const bytes = hexStringToBytes(contentHash);
    const [code, offset] = decodeVarint(bytes);
    const value = bytes.slice(offset);
    const name = codeToName[code];
    let profile = profiles[name];
    if (!profile)
        profile = profiles["default"];
    return profile.decode(value);
};
/**
 * General purpose encoding function
 * @param name Codec name
 * @param value Content to encode
 */
export const encode = (name, value) => {
    let profile = profiles[name];
    if (!profile)
        profile = profiles["default"];
    const bytes = profile.encode(value);
    const code = nameToCode[name];
    const codeBytes = encodeVarint(code, new Uint8Array(varintEncodingLength(code)));
    return bytesToHexString(concatUint8Arrays(codeBytes, bytes));
};
/**
 * Extract the codec of a content hash
 * @param contentHash hex string containing a content hash
 * @return the extracted codec
 */
export const getCodec = (contentHash) => {
    const bytes = hexStringToBytes(contentHash);
    const [code] = decodeVarint(bytes);
    return codeToName[code];
};
//# sourceMappingURL=index.js.map