import { IKey, ManagedKeyInfo, MinimalImportableKey, TKeyType } from '@veramo/core-types';
/**
 * This base abstract class should be extended to provide cryptographic functions to other Veramo plugins.
 *
 * @public
 */
export declare abstract class AbstractKeyManagementSystem {
    abstract importKey(args: Exclude<MinimalImportableKey, 'kms'>): Promise<ManagedKeyInfo>;
    abstract listKeys(): Promise<Array<ManagedKeyInfo>>;
    abstract createKey(args: {
        type: TKeyType;
        meta?: any;
    }): Promise<ManagedKeyInfo>;
    abstract deleteKey(args: {
        kid: string;
    }): Promise<boolean>;
    /**@deprecated please use `sign({key, alg: 'eth_signTransaction', data: arrayify(serialize(transaction))})` instead */
    signEthTX({ key, transaction }: {
        key: Pick<IKey, 'kid'>;
        transaction: object;
    }): Promise<string>;
    /**@deprecated please use `sign({key, data})` instead, with `Uint8Array` data */
    signJWT({ key, data }: {
        key: Pick<IKey, 'kid'>;
        data: string | Uint8Array;
    }): Promise<string>;
    abstract sign(args: {
        keyRef: Pick<IKey, 'kid'>;
        algorithm?: string;
        data: Uint8Array;
        [x: string]: any;
    }): Promise<string>;
    abstract sharedSecret(args: {
        myKeyRef: Pick<IKey, 'kid'>;
        theirKey: Pick<IKey, 'publicKeyHex' | 'type'>;
    }): Promise<string>;
}
//# sourceMappingURL=abstract-key-management-system.d.ts.map