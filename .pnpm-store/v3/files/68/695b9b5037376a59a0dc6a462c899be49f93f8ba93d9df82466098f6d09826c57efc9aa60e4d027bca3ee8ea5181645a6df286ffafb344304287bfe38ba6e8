import type { Codec, DecodeOptions } from 'protons-runtime';
import type { Uint8ArrayList } from 'uint8arraylist';
export interface IpnsEntry {
    value?: Uint8Array;
    signatureV1?: Uint8Array;
    validityType?: IpnsEntry.ValidityType;
    validity?: Uint8Array;
    sequence?: bigint;
    ttl?: bigint;
    pubKey?: Uint8Array;
    signatureV2?: Uint8Array;
    data?: Uint8Array;
}
export declare namespace IpnsEntry {
    enum ValidityType {
        EOL = "EOL"
    }
    namespace ValidityType {
        const codec: () => Codec<ValidityType>;
    }
    const codec: () => Codec<IpnsEntry>;
    const encode: (obj: Partial<IpnsEntry>) => Uint8Array;
    const decode: (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<IpnsEntry>) => IpnsEntry;
}
//# sourceMappingURL=ipns.d.ts.map