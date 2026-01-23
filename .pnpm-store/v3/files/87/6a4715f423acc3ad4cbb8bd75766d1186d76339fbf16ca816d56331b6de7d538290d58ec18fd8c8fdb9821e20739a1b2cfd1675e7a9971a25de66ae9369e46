import { bytesToBase58, base58ToBytes, base64ToBytes, bytesToBase64url, bytesToMultibase, multibaseToBytes } from 'did-jwt';
export { bytesToBase58, base58ToBytes, bytesToBase64url, base64ToBytes, multibaseToBytes, bytesToMultibase };
/**
 * Encodes a Uint8Array to a base64 string representation with padding.
 * @param b - the byte array to convert
 *
 * @public
 */
export declare function bytesToBase64(b: Uint8Array): string;
/**
 * Encodes the bytes of an input string to base64url
 * @param s - the original string
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function encodeBase64url(s: string): string;
/**
 * Decodes a base64url string to a utf8 string represented by the same bytes.
 * @param s - the base64url string to be decoded
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function decodeBase64url(s: string): string;
/**
 * Builds a string from a Uint8Array using the utf-8 encoding.
 * @param b - the array to be converted
 *
 * @public
 */
export declare function bytesToUtf8String(b: Uint8Array): string;
/**
 * Encodes a string to a Uint8Array using the utf-8 encoding.
 * @param s - the string to be encoded
 *
 * @public
 */
export declare function stringToUtf8Bytes(s: string): Uint8Array;
/**
 * Stringifies a JSON object and encodes the bytes of the resulting string to a base64url representation.
 * @param payload - the object to be encoded
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function encodeJoseBlob(payload: {}): string;
/**
 * Decodes a base64url string representing stringified JSON to a JSON object.
 *
 * @param blob - The base64url encoded stringified JSON to be decoded
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function decodeJoseBlob(blob: string): any;
/**
 * Converts a hex string (with or without prefix) to a byte array (Uint8Array)
 *
 * @param hexString - The string representing the encoding
 * @returns the `Uint8Array` represented by the given string
 *
 * @throws `illegal_argument` error if the parameter is not a string
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function hexToBytes(hexString: string): Uint8Array;
/**
 * Converts a Uint8Array input to a hex string
 *
 * @param byteArray - The array to be converted
 * @param prefix - If this is set to true, the resulting hex string will be prefixed with 0x
 *
 * @returns the hex encoding of the input byte array
 *
 * @throws `illegal_argument` error if the input is not a Uint8Array
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function bytesToHex(byteArray: Uint8Array, prefix?: boolean): string;
/**
 * Concatenates a bunch of arrays into one Uint8Array
 * @param arrays - the arrays to be concatenated
 * @param length - the maximum length of the resulting array
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare function concat(arrays: ArrayLike<number>[], length?: number): Uint8Array;
//# sourceMappingURL=encodings.d.ts.map