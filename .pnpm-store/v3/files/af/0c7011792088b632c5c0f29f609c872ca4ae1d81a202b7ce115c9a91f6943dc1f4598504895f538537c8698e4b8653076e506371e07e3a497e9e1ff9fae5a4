export type Multibase<Prefix extends string> = string | `${Prefix}${string}`;
/**
 * Multibase encoder for the specific base encoding encodes bytes into
 * multibase of that encoding.
 */
export type MultibaseEncoder<Prefix extends string> = {
    /**
     * Name of the encoding.
     */
    name: string;
    /**
     * Prefix character for that base encoding.
     */
    prefix: Prefix;
    /**
     * Encodes binary data into **multibase** string (which will have a
     * prefix added).
     */
    encode: (bytes: Uint8Array) => Multibase<Prefix>;
};
/**
 * Interface implemented by multibase decoder, that takes multibase strings
 * to bytes. It may support single encoding like base32 or multiple encodings
 * like base32, base58btc, base64. If passed multibase is incompatible it will
 * throw an exception.
 */
export interface MultibaseDecoder<Prefix extends string> {
    /**
     * Decodes **multibase** string (which must have a multibase prefix added).
     * If prefix does not match
     */
    decode: (multibase: Multibase<Prefix>) => Uint8Array;
}
type MultibaseCoder<Prefix extends string> = MultibaseEncoder<Prefix> & MultibaseDecoder<Prefix>;
export declare const base58btc: MultibaseCoder<"z">;
export declare const base32: MultibaseCoder<"b">;
export declare const base36: MultibaseCoder<"k">;
export declare const base64url: MultibaseCoder<"u">;
export {};
//# sourceMappingURL=coders.d.ts.map