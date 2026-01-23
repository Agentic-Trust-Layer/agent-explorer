import { AbstractIdentifierProvider } from './abstract-identifier-provider.js';
import { IAgentPlugin, IIdentifier, IAgentContext, IDIDManager, IKeyManager, IDIDManagerGetArgs, IDIDManagerCreateArgs, IDIDManagerGetByAliasArgs, IDIDManagerGetOrCreateArgs, IDIDManagerUpdateArgs, IDIDManagerDeleteArgs, IDIDManagerAddKeyArgs, IDIDManagerRemoveKeyArgs, IDIDManagerAddServiceArgs, IDIDManagerRemoveServiceArgs, IDIDManagerFindArgs, IDIDManagerSetAliasArgs, MinimalImportableIdentifier } from '@veramo/core-types';
import { AbstractDIDStore } from './abstract-identifier-store.js';
/**
 * Agent plugin that implements {@link @veramo/core-types#IDIDManager} interface
 * @public
 */
export declare class DIDManager implements IAgentPlugin {
    /**
     * Plugin methods
     * @public
     */
    readonly methods: IDIDManager;
    readonly schema: {
        components: {
            schemas: {
                IDIDManagerAddKeyArgs: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                        key: {
                            $ref: string;
                            description: string;
                        };
                        options: {
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
                IDIDManagerAddServiceArgs: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                        service: {
                            $ref: string;
                            description: string;
                        };
                        options: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IService: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                            description: string;
                        };
                        type: {
                            type: string;
                            description: string;
                        };
                        serviceEndpoint: {
                            anyOf: ({
                                $ref: string;
                                type?: undefined;
                                items?: undefined;
                            } | {
                                type: string;
                                items: {
                                    $ref: string;
                                };
                                $ref?: undefined;
                            })[];
                            description: string;
                        };
                        description: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IServiceEndpoint: {
                    anyOf: {
                        type: string;
                    }[];
                    description: string;
                };
                IDIDManagerCreateArgs: {
                    type: string;
                    properties: {
                        alias: {
                            type: string;
                            description: string;
                        };
                        provider: {
                            type: string;
                            description: string;
                        };
                        kms: {
                            type: string;
                            description: string;
                        };
                        options: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
                IIdentifier: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                        alias: {
                            type: string;
                            description: string;
                        };
                        provider: {
                            type: string;
                            description: string;
                        };
                        controllerKeyId: {
                            type: string;
                            description: string;
                        };
                        keys: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        services: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDIDManagerDeleteArgs: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDIDManagerFindArgs: {
                    type: string;
                    properties: {
                        alias: {
                            type: string;
                            description: string;
                        };
                        provider: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
                IDIDManagerGetArgs: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDIDManagerGetByAliasArgs: {
                    type: string;
                    properties: {
                        alias: {
                            type: string;
                            description: string;
                        };
                        provider: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDIDManagerGetOrCreateArgs: {
                    type: string;
                    properties: {
                        alias: {
                            type: string;
                            description: string;
                        };
                        provider: {
                            type: string;
                            description: string;
                        };
                        kms: {
                            type: string;
                            description: string;
                        };
                        options: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                MinimalImportableIdentifier: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                        alias: {
                            type: string;
                            description: string;
                        };
                        provider: {
                            type: string;
                            description: string;
                        };
                        controllerKeyId: {
                            type: string;
                            description: string;
                        };
                        keys: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        services: {
                            type: string;
                            items: {
                                $ref: string;
                            };
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
                IDIDManagerRemoveKeyArgs: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                        kid: {
                            type: string;
                            description: string;
                        };
                        options: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDIDManagerRemoveServiceArgs: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                        id: {
                            type: string;
                            description: string;
                        };
                        options: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDIDManagerSetAliasArgs: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                        alias: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDIDManagerUpdateArgs: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                        document: {
                            type: string;
                            properties: {
                                "@context": {
                                    anyOf: ({
                                        type: string;
                                        properties: {};
                                        allOf?: undefined;
                                    } | {
                                        type: string;
                                        properties?: undefined;
                                        allOf?: undefined;
                                    } | {
                                        allOf: ({
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                            properties?: undefined;
                                        } | {
                                            type: string;
                                            properties: {};
                                            items?: undefined;
                                        })[];
                                        type?: undefined;
                                        properties?: undefined;
                                    })[];
                                };
                                id: {
                                    type: string;
                                };
                                alsoKnownAs: {
                                    allOf: ({
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {};
                                        items?: undefined;
                                    })[];
                                };
                                controller: {
                                    anyOf: ({
                                        type: string;
                                        allOf?: undefined;
                                    } | {
                                        allOf: ({
                                            type: string;
                                            items: {
                                                type: string;
                                            };
                                            properties?: undefined;
                                        } | {
                                            type: string;
                                            properties: {};
                                            items?: undefined;
                                        })[];
                                        type?: undefined;
                                    })[];
                                };
                                verificationMethod: {
                                    allOf: ({
                                        type: string;
                                        items: {
                                            $ref: string;
                                        };
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {};
                                        items?: undefined;
                                    })[];
                                };
                                service: {
                                    allOf: ({
                                        type: string;
                                        items: {
                                            $ref: string;
                                        };
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {};
                                        items?: undefined;
                                    })[];
                                };
                                publicKey: {
                                    allOf: ({
                                        type: string;
                                        items: {
                                            $ref: string;
                                        };
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {};
                                        items?: undefined;
                                    })[];
                                    deprecated: boolean;
                                };
                                authentication: {
                                    allOf: ({
                                        type: string;
                                        items: {
                                            anyOf: ({
                                                type: string;
                                                $ref?: undefined;
                                            } | {
                                                $ref: string;
                                                type?: undefined;
                                            })[];
                                        };
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {};
                                        items?: undefined;
                                    })[];
                                };
                                assertionMethod: {
                                    allOf: ({
                                        type: string;
                                        items: {
                                            anyOf: ({
                                                type: string;
                                                $ref?: undefined;
                                            } | {
                                                $ref: string;
                                                type?: undefined;
                                            })[];
                                        };
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {};
                                        items?: undefined;
                                    })[];
                                };
                                keyAgreement: {
                                    allOf: ({
                                        type: string;
                                        items: {
                                            anyOf: ({
                                                type: string;
                                                $ref?: undefined;
                                            } | {
                                                $ref: string;
                                                type?: undefined;
                                            })[];
                                        };
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {};
                                        items?: undefined;
                                    })[];
                                };
                                capabilityInvocation: {
                                    allOf: ({
                                        type: string;
                                        items: {
                                            anyOf: ({
                                                type: string;
                                                $ref?: undefined;
                                            } | {
                                                $ref: string;
                                                type?: undefined;
                                            })[];
                                        };
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {};
                                        items?: undefined;
                                    })[];
                                };
                                capabilityDelegation: {
                                    allOf: ({
                                        type: string;
                                        items: {
                                            anyOf: ({
                                                type: string;
                                                $ref?: undefined;
                                            } | {
                                                $ref: string;
                                                type?: undefined;
                                            })[];
                                        };
                                        properties?: undefined;
                                    } | {
                                        type: string;
                                        properties: {};
                                        items?: undefined;
                                    })[];
                                };
                            };
                            description: string;
                        };
                        options: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                VerificationMethod: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                        controller: {
                            type: string;
                        };
                        publicKeyBase58: {
                            type: string;
                        };
                        publicKeyBase64: {
                            type: string;
                        };
                        publicKeyJwk: {
                            $ref: string;
                        };
                        publicKeyHex: {
                            type: string;
                        };
                        publicKeyMultibase: {
                            type: string;
                        };
                        blockchainAccountId: {
                            type: string;
                        };
                        ethereumAddress: {
                            type: string;
                        };
                        conditionOr: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        conditionAnd: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        threshold: {
                            type: string;
                        };
                        conditionThreshold: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        conditionWeightedThreshold: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        conditionDelegated: {
                            type: string;
                        };
                        relationshipParent: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        relationshipChild: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        relationshipSibling: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                    };
                    required: string[];
                    description: string;
                };
                JsonWebKey: {
                    type: string;
                    properties: {
                        alg: {
                            type: string;
                        };
                        crv: {
                            type: string;
                        };
                        e: {
                            type: string;
                        };
                        ext: {
                            type: string;
                        };
                        key_ops: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        kid: {
                            type: string;
                        };
                        kty: {
                            type: string;
                        };
                        n: {
                            type: string;
                        };
                        use: {
                            type: string;
                        };
                        x: {
                            type: string;
                        };
                        y: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                ConditionWeightedThreshold: {
                    type: string;
                    properties: {
                        condition: {
                            $ref: string;
                        };
                        weight: {
                            type: string;
                        };
                    };
                    required: string[];
                };
                Service: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                        serviceEndpoint: {
                            anyOf: ({
                                $ref: string;
                                type?: undefined;
                                items?: undefined;
                            } | {
                                type: string;
                                items: {
                                    $ref: string;
                                };
                                $ref?: undefined;
                            })[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                ServiceEndpoint: {
                    anyOf: {
                        type: string;
                    }[];
                    description: string;
                };
            };
            methods: {
                didManagerAddKey: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                didManagerAddService: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                didManagerCreate: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                didManagerDelete: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                didManagerFind: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                    };
                };
                didManagerGet: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                didManagerGetByAlias: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                didManagerGetOrCreate: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                didManagerGetProviders: {
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
                didManagerImport: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                didManagerRemoveKey: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                didManagerRemoveService: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                didManagerSetAlias: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                didManagerUpdate: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
            };
        };
    };
    private providers;
    private defaultProvider;
    private store;
    constructor(options: {
        providers: Record<string, AbstractIdentifierProvider>;
        defaultProvider: string;
        store: AbstractDIDStore;
    });
    private getProvider;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerGetProviders} */
    didManagerGetProviders(): Promise<string[]>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerFind} */
    didManagerFind(args: IDIDManagerFindArgs): Promise<IIdentifier[]>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerGet} */
    didManagerGet({ did }: IDIDManagerGetArgs): Promise<IIdentifier>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerGetByAlias} */
    didManagerGetByAlias({ alias }: IDIDManagerGetByAliasArgs): Promise<IIdentifier>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerCreate} */
    didManagerCreate(args: IDIDManagerCreateArgs, context: IAgentContext<IKeyManager>): Promise<IIdentifier>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerGetOrCreate} */
    didManagerGetOrCreate({ provider, alias, kms, options }: IDIDManagerGetOrCreateArgs, context: IAgentContext<IKeyManager>): Promise<IIdentifier>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerUpdate} */
    didManagerUpdate({ did, document, options }: IDIDManagerUpdateArgs, context: IAgentContext<IKeyManager>): Promise<IIdentifier>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerSetAlias} */
    didManagerSetAlias({ did, alias }: IDIDManagerSetAliasArgs, context: IAgentContext<IKeyManager>): Promise<boolean>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerImport} */
    didManagerImport(identifier: MinimalImportableIdentifier, context: IAgentContext<IKeyManager>): Promise<IIdentifier>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerDelete} */
    didManagerDelete({ did }: IDIDManagerDeleteArgs, context: IAgentContext<IKeyManager>): Promise<boolean>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerAddKey} */
    didManagerAddKey({ did, key, options }: IDIDManagerAddKeyArgs, context: IAgentContext<IKeyManager>): Promise<any>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerRemoveKey} */
    didManagerRemoveKey({ did, kid, options }: IDIDManagerRemoveKeyArgs, context: IAgentContext<IKeyManager>): Promise<any>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerAddService} */
    didManagerAddService({ did, service, options }: IDIDManagerAddServiceArgs, context: IAgentContext<IKeyManager>): Promise<any>;
    /** {@inheritDoc @veramo/core-types#IDIDManager.didManagerRemoveService} */
    didManagerRemoveService({ did, id, options }: IDIDManagerRemoveServiceArgs, context: IAgentContext<IKeyManager>): Promise<any>;
}
//# sourceMappingURL=id-manager.d.ts.map