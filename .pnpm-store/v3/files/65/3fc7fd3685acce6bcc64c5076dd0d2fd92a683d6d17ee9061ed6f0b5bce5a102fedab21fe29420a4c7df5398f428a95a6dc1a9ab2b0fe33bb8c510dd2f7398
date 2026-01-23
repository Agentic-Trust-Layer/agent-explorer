import { IKey } from '@veramo/core-types';
import { AbstractKeyStore } from './abstract-key-store.js';
import { AbstractPrivateKeyStore, ImportablePrivateKey, ManagedPrivateKey } from './abstract-private-key-store.js';
/**
 * An implementation of {@link AbstractKeyStore} that holds everything in memory.
 *
 * This is usable by {@link @veramo/key-manager#KeyManager | KeyManager} to hold the key metadata and relationship to
 * the KMS implementation.
 *
 * @public
 */
export declare class MemoryKeyStore extends AbstractKeyStore {
    private keys;
    getKey({ kid }: {
        kid: string;
    }): Promise<IKey>;
    deleteKey({ kid }: {
        kid: string;
    }): Promise<boolean>;
    importKey(args: IKey): Promise<boolean>;
    listKeys(args: {}): Promise<Exclude<IKey, 'privateKeyHex'>[]>;
}
/**
 * An implementation of {@link AbstractPrivateKeyStore} that holds everything in memory.
 *
 * This is usable by {@link @veramo/kms-local#KeyManagementSystem} to hold the private key data.
 *
 * @public
 */
export declare class MemoryPrivateKeyStore extends AbstractPrivateKeyStore {
    private privateKeys;
    getKey({ alias }: {
        alias: string;
    }): Promise<ManagedPrivateKey>;
    deleteKey({ alias }: {
        alias: string;
    }): Promise<boolean>;
    importKey(args: ImportablePrivateKey): Promise<ManagedPrivateKey>;
    listKeys(): Promise<Array<ManagedPrivateKey>>;
}
//# sourceMappingURL=memory-key-store.d.ts.map