import type { ECDH, EphemeralKeyPair, Recipient } from './types.js';
export declare function computeX25519EcdhEsKek(recipient: Recipient, receiverSecret: Uint8Array | ECDH, alg: string): Promise<Uint8Array<ArrayBufferLike> | null>;
export declare function createX25519EcdhEsKek(recipientPublicKey: Uint8Array, senderSecret: Uint8Array | ECDH | undefined, // unused
alg: string, apu: string | undefined, // unused
apv: string | undefined, ephemeralKeyPair: EphemeralKeyPair | undefined): Promise<{
    epk: {
        kty: string;
        crv: string;
        x: string;
    };
    kek: Uint8Array<ArrayBufferLike>;
}>;
//# sourceMappingURL=X25519-ECDH-ES.d.ts.map