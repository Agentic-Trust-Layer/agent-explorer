import { AbstractSecretBox } from '@veramo/key-manager';
/**
 * This is an implementation of {@link @veramo/key-manager#AbstractSecretBox | AbstractSecretBox} that uses a JavaScript
 * {@link https://nacl.cr.yp.to/secretbox.html | nacl secretBox} implementation for encryption.
 *
 * See {@link @veramo/data-store#PrivateKeyStore}
 * See {@link @veramo/data-store-json#PrivateKeyStoreJson}
 * See {@link @veramo/key-manager#AbstractSecretBox}
 *
 * @public
 */
export declare class SecretBox extends AbstractSecretBox {
    private secretKey;
    constructor(secretKey: string);
    static createSecretKey(): Promise<string>;
    encrypt(message: string): Promise<string>;
    decrypt(encryptedMessageHex: string): Promise<string>;
}
//# sourceMappingURL=secret-box.d.ts.map