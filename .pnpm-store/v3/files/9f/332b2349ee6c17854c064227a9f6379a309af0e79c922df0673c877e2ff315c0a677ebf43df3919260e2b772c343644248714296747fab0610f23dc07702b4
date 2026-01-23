import { AbstractKeyStore } from './abstract-key-store.js';
import { AbstractKeyManagementSystem } from './abstract-key-management-system.js';
import { IAgentPlugin, IKey, IKeyManager, IKeyManagerCreateArgs, IKeyManagerDecryptJWEArgs, IKeyManagerDeleteArgs, IKeyManagerEncryptJWEArgs, IKeyManagerGetArgs, IKeyManagerSharedSecretArgs, IKeyManagerSignArgs, IKeyManagerSignEthTXArgs, IKeyManagerSignJWTArgs, ManagedKeyInfo, MinimalImportableKey } from '@veramo/core-types';
import { type ECDH } from 'did-jwt';
/**
 * Agent plugin that implements {@link @veramo/core-types#IKeyManager} methods.
 *
 * This plugin orchestrates various implementations of {@link AbstractKeyManagementSystem}, using a KeyStore to
 * remember the link between a key reference, its metadata, and the respective key management system that provides the
 * actual cryptographic capabilities.
 *
 * The methods of this plugin are used automatically by other plugins, such as
 * {@link @veramo/did-manager#DIDManager | DIDManager},
 * {@link @veramo/credential-w3c#CredentialPlugin | CredentialPlugin}, or {@link @veramo/did-comm#DIDComm | DIDComm} to
 * perform their required cryptographic operations using the managed keys.
 *
 * @public
 */
export declare class KeyManager implements IAgentPlugin {
    /**
     * Plugin methods
     * @public
     */
    readonly methods: IKeyManager;
    readonly schema: {
        components: {
            schemas: {
                IKeyManagerCreateArgs: {
                    type: string;
                    properties: {
                        type: {
                            $ref: string;
                            description: string;
                        };
                        kms: {
                            type: string;
                            description: string;
                        };
                        meta: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                TKeyType: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                KeyMetadata: {
                    type: string;
                    properties: {
                        algorithms: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                    };
                    description: string;
                };
                TAlg: {
                    type: string;
                    description: string;
                };
                ManagedKeyInfo: {
                    type: string;
                    properties: {
                        kid: {
                            type: string;
                            description: string;
                        };
                        kms: {
                            type: string;
                            description: string;
                        };
                        type: {
                            $ref: string;
                            description: string;
                        };
                        publicKeyHex: {
                            type: string;
                            description: string;
                        };
                        meta: {
                            anyOf: ({
                                $ref: string;
                                type?: undefined;
                            } | {
                                type: string;
                                $ref?: undefined;
                            })[];
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IKeyManagerDecryptJWEArgs: {
                    type: string;
                    properties: {
                        kid: {
                            type: string;
                            description: string;
                        };
                        data: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IKeyManagerDeleteArgs: {
                    type: string;
                    properties: {
                        kid: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IKeyManagerEncryptJWEArgs: {
                    type: string;
                    properties: {
                        kid: {
                            type: string;
                            description: string;
                        };
                        to: {
                            type: string;
                            properties: {
                                kid: {
                                    type: string;
                                    description: string;
                                };
                                type: {
                                    $ref: string;
                                    description: string;
                                };
                                publicKeyHex: {
                                    type: string;
                                    description: string;
                                };
                                privateKeyHex: {
                                    type: string;
                                    description: string;
                                };
                                meta: {
                                    anyOf: ({
                                        $ref: string;
                                        type?: undefined;
                                    } | {
                                        type: string;
                                        $ref?: undefined;
                                    })[];
                                    description: string;
                                };
                            };
                            required: string[];
                            description: string;
                        };
                        data: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IKeyManagerGetArgs: {
                    type: string;
                    properties: {
                        kid: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IKey: {
                    type: string;
                    properties: {
                        kid: {
                            type: string;
                            description: string;
                        };
                        kms: {
                            type: string;
                            description: string;
                        };
                        type: {
                            $ref: string;
                            description: string;
                        };
                        publicKeyHex: {
                            type: string;
                            description: string;
                        };
                        privateKeyHex: {
                            type: string;
                            description: string;
                        };
                        meta: {
                            anyOf: ({
                                $ref: string;
                                type?: undefined;
                            } | {
                                type: string;
                                $ref?: undefined;
                            })[];
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                MinimalImportableKey: {
                    $ref: string;
                    description: string;
                };
                "RequireOnly<IKey,(\"privateKeyHex\"|\"type\"|\"kms\")>": {
                    type: string;
                    properties: {
                        kid: {
                            type: string;
                            description: string;
                        };
                        kms: {
                            type: string;
                            description: string;
                        };
                        type: {
                            $ref: string;
                            description: string;
                        };
                        publicKeyHex: {
                            type: string;
                            description: string;
                        };
                        privateKeyHex: {
                            type: string;
                            description: string;
                        };
                        meta: {
                            anyOf: ({
                                $ref: string;
                                type?: undefined;
                            } | {
                                type: string;
                                $ref?: undefined;
                            })[];
                            description: string;
                        };
                    };
                    description: string;
                };
                IKeyManagerSharedSecretArgs: {
                    type: string;
                    properties: {
                        secretKeyRef: {
                            type: string;
                            description: string;
                        };
                        publicKey: {
                            type: string;
                            properties: {
                                publicKeyHex: {
                                    type: string;
                                    description: string;
                                };
                                type: {
                                    $ref: string;
                                    description: string;
                                };
                            };
                            required: string[];
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IKeyManagerSignArgs: {
                    type: string;
                    properties: {
                        keyRef: {
                            type: string;
                            description: string;
                        };
                        algorithm: {
                            type: string;
                            description: string;
                        };
                        data: {
                            type: string;
                            description: string;
                        };
                        encoding: {
                            type: string;
                            enum: string[];
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IKeyManagerSignEthTXArgs: {
                    type: string;
                    properties: {
                        kid: {
                            type: string;
                            description: string;
                        };
                        transaction: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IKeyManagerSignJWTArgs: {
                    type: string;
                    properties: {
                        kid: {
                            type: string;
                            description: string;
                        };
                        data: {
                            anyOf: ({
                                type: string;
                                properties?: undefined;
                                required?: undefined;
                                additionalProperties?: undefined;
                            } | {
                                type: string;
                                properties: {
                                    BYTES_PER_ELEMENT: {
                                        type: string;
                                    };
                                    buffer: {
                                        anyOf: ({
                                            type: string;
                                            properties: {
                                                byteLength: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        } | {
                                            type?: undefined;
                                            properties?: undefined;
                                            required?: undefined;
                                        })[];
                                    };
                                    byteLength: {
                                        type: string;
                                    };
                                    byteOffset: {
                                        type: string;
                                    };
                                    length: {
                                        type: string;
                                    };
                                };
                                required: string[];
                                additionalProperties: {
                                    type: string;
                                };
                            })[];
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
            };
            methods: {
                keyManagerCreate: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                keyManagerDecryptJWE: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                keyManagerDelete: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                keyManagerEncryptJWE: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                keyManagerGet: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                keyManagerGetKeyManagementSystems: {
                    description: string;
                    arguments: {
                        type: string;
                    };
                    returnType: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
                keyManagerImport: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                keyManagerSharedSecret: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                keyManagerSign: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                keyManagerSignEthTX: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                keyManagerSignJWT: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
            };
        };
    };
    private store;
    private kms;
    constructor(options: {
        store: AbstractKeyStore;
        kms: Record<string, AbstractKeyManagementSystem>;
    });
    private getKms;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerGetKeyManagementSystems} */
    keyManagerGetKeyManagementSystems(): Promise<Array<string>>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerCreate} */
    keyManagerCreate(args: IKeyManagerCreateArgs): Promise<ManagedKeyInfo>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerGet} */
    keyManagerGet({ kid }: IKeyManagerGetArgs): Promise<IKey>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerDelete} */
    keyManagerDelete({ kid }: IKeyManagerDeleteArgs): Promise<boolean>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerImport} */
    keyManagerImport(key: MinimalImportableKey): Promise<ManagedKeyInfo>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerEncryptJWE} */
    keyManagerEncryptJWE({ kid, to, data }: IKeyManagerEncryptJWEArgs): Promise<string>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerDecryptJWE} */
    keyManagerDecryptJWE({ kid, data }: IKeyManagerDecryptJWEArgs): Promise<string>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerSignJWT} */
    keyManagerSignJWT({ kid, data }: IKeyManagerSignJWTArgs): Promise<string>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerSign} */
    keyManagerSign(args: IKeyManagerSignArgs): Promise<string>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerSignEthTX} */
    keyManagerSignEthTX({ kid, transaction }: IKeyManagerSignEthTXArgs): Promise<string>;
    /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerSharedSecret} */
    keyManagerSharedSecret(args: IKeyManagerSharedSecretArgs): Promise<string>;
    createX25519ECDH(secretKeyRef: string): ECDH;
}
//# sourceMappingURL=key-manager.d.ts.map