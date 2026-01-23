import { IKey, ManagedKeyInfo, MinimalImportableKey, TKeyType } from '@veramo/core-types';
import { AbstractKeyManagementSystem, AbstractPrivateKeyStore } from '@veramo/key-manager';
/**
 * This is an implementation of {@link @veramo/key-manager#AbstractKeyManagementSystem | AbstractKeyManagementSystem}
 * that uses a local {@link @veramo/key-manager#AbstractPrivateKeyStore | AbstractPrivateKeyStore} to hold private key
 * material.
 *
 * The key material is used to provide local implementations of various cryptographic algorithms.
 *
 * @public
 */
export declare class KeyManagementSystem extends AbstractKeyManagementSystem {
    private readonly keyStore;
    constructor(keyStore: AbstractPrivateKeyStore);
    importKey(args: Omit<MinimalImportableKey, 'kms'>): Promise<ManagedKeyInfo>;
    listKeys(): Promise<ManagedKeyInfo[]>;
    createKey({ type }: {
        type: TKeyType;
    }): Promise<ManagedKeyInfo>;
    deleteKey(args: {
        kid: string;
    }): Promise<boolean>;
    sign({ keyRef, algorithm, data, }: {
        keyRef: Pick<IKey, 'kid'>;
        algorithm?: string;
        data: Uint8Array;
    }): Promise<string>;
    sharedSecret(args: {
        myKeyRef: Pick<IKey, 'kid'>;
        theirKey: Pick<IKey, 'type' | 'publicKeyHex'>;
    }): Promise<string>;
    /**
     * @returns a `0x` prefixed hex string representing the signed EIP712 data
     */
    private eth_signTypedData;
    /**
     * @returns a `0x` prefixed hex string representing the signed message
     */
    private eth_signMessage;
    /**
     * @returns a `0x` prefixed hex string representing the signed raw transaction
     */
    private eth_signTransaction;
    /**
     * @returns a `0x` prefixed hex string representing the signed digest in compact format
     */
    private eth_rawSign;
    /**
     * @returns a base64url encoded signature for the `EdDSA` alg
     */
    private signEdDSA;
    /**
     * @returns a base64url encoded signature for the `ES256K` or `ES256K-R` alg
     */
    private signES256K;
    /**
     * @returns a base64url encoded signature for the `ES256` alg
     */
    private signES256;
    /**
     * Converts a {@link @veramo/key-manager#ManagedPrivateKey | ManagedPrivateKey} to
     * {@link @veramo/core-types#ManagedKeyInfo}
     */
    private asManagedKeyInfo;
}
//# sourceMappingURL=key-management-system.d.ts.map