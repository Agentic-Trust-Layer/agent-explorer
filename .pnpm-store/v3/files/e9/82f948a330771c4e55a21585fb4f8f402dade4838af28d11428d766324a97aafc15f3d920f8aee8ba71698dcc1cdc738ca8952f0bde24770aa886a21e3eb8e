export type Base58CheckVersion = Uint8Array;
export declare const base58UncheckedEncode: (data: Uint8Array) => string;
export declare const base58UncheckedDecode: (str: string) => Uint8Array;
export declare const base58CheckEncode: (data: Uint8Array) => string;
export declare const base58CheckDecode: (str: string) => Uint8Array;
export declare const createBase58VersionedEncoder: (p2pkhVersion: Base58CheckVersion, p2shVersion: Base58CheckVersion) => (source: Uint8Array) => string;
export declare const createBase58VersionedDecoder: (p2pkhVersions: Base58CheckVersion[], p2shVersions: Base58CheckVersion[]) => (source: string) => Uint8Array;
