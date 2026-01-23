import type { ECDH, EphemeralKeyPair, Recipient } from './types.js';
export declare function computeX25519Ecdh1PUv3Kek(recipient: Recipient, recipientSecret: Uint8Array | ECDH, senderPublicKey: Uint8Array, alg: string): Promise<Uint8Array<ArrayBufferLike> | null>;
export declare function createX25519Ecdh1PUv3Kek(recipientPublicKey: Uint8Array, senderSecret: Uint8Array | ECDH, alg: string, // must be provided as this is the key agreement alg + the key wrapper alg, Example: 'ECDH-ES+A256KW'
apu: string | undefined, apv: string | undefined, ephemeralKeyPair: EphemeralKeyPair | undefined): Promise<{
    epk: {
        kty: string;
        crv: string;
        x: string;
    };
    kek: Uint8Array<ArrayBufferLike>;
}>;
//# sourceMappingURL=X25519-ECDH-1PU.d.ts.map