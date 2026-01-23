export declare const schema: {
    IResolver: {
        components: {
            schemas: {
                GetDIDComponentArgs: {
                    type: string;
                    properties: {
                        didDocument: {
                            $ref: string;
                            description: string;
                        };
                        didUrl: {
                            type: string;
                            description: string;
                        };
                        section: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                DIDDocument: {
                    type: string;
                    properties: {
                        authentication: {
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
                        };
                        assertionMethod: {
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
                        };
                        keyAgreement: {
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
                        };
                        capabilityInvocation: {
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
                        };
                        capabilityDelegation: {
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
                        };
                        "@context": {
                            anyOf: ({
                                type: string;
                                const: string;
                                items?: undefined;
                            } | {
                                type: string;
                                const?: undefined;
                                items?: undefined;
                            } | {
                                type: string;
                                items: {
                                    type: string;
                                };
                                const?: undefined;
                            })[];
                        };
                        id: {
                            type: string;
                        };
                        alsoKnownAs: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        controller: {
                            anyOf: ({
                                type: string;
                                items?: undefined;
                            } | {
                                type: string;
                                items: {
                                    type: string;
                                };
                            })[];
                        };
                        verificationMethod: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        service: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        publicKey: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            deprecated: boolean;
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
                DIDDocumentSection: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                        const?: undefined;
                    } | {
                        type: string;
                        const: string;
                        $ref?: undefined;
                    })[];
                    description: string;
                };
                KeyCapabilitySection: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                DIDDocComponent: {
                    anyOf: {
                        $ref: string;
                    }[];
                    description: string;
                };
                ResolveDidArgs: {
                    type: string;
                    properties: {
                        didUrl: {
                            type: string;
                            description: string;
                        };
                        options: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                DIDResolutionOptions: {
                    type: string;
                    properties: {
                        accept: {
                            type: string;
                        };
                    };
                    description: string;
                };
                DIDResolutionResult: {
                    type: string;
                    properties: {
                        "@context": {
                            anyOf: ({
                                type: string;
                                const: string;
                                items?: undefined;
                            } | {
                                type: string;
                                const?: undefined;
                                items?: undefined;
                            } | {
                                type: string;
                                items: {
                                    type: string;
                                };
                                const?: undefined;
                            })[];
                        };
                        didResolutionMetadata: {
                            $ref: string;
                        };
                        didDocument: {
                            anyOf: ({
                                $ref: string;
                                type?: undefined;
                            } | {
                                type: string;
                                $ref?: undefined;
                            })[];
                        };
                        didDocumentMetadata: {
                            $ref: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                DIDResolutionMetadata: {
                    type: string;
                    properties: {
                        contentType: {
                            type: string;
                        };
                        error: {
                            type: string;
                        };
                    };
                    description: string;
                };
                DIDDocumentMetadata: {
                    type: string;
                    properties: {
                        created: {
                            type: string;
                        };
                        updated: {
                            type: string;
                        };
                        deactivated: {
                            type: string;
                        };
                        versionId: {
                            type: string;
                        };
                        nextUpdate: {
                            type: string;
                        };
                        nextVersionId: {
                            type: string;
                        };
                        equivalentId: {
                            type: string;
                        };
                        canonicalId: {
                            type: string;
                        };
                    };
                    description: string;
                };
            };
            methods: {
                getDIDComponentById: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                resolveDid: {
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
    IKeyManager: {
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
    IDIDManager: {
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
    IDataStore: {
        components: {
            schemas: {
                IDataStoreDeleteMessageArgs: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDataStoreDeleteVerifiableCredentialArgs: {
                    type: string;
                    properties: {
                        hash: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDataStoreGetMessageArgs: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IMessage: {
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
                        createdAt: {
                            type: string;
                            description: string;
                        };
                        expiresAt: {
                            type: string;
                            description: string;
                        };
                        threadId: {
                            type: string;
                            description: string;
                        };
                        raw: {
                            type: string;
                            description: string;
                        };
                        data: {
                            anyOf: {
                                type: string;
                            }[];
                            description: string;
                        };
                        replyTo: {
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        };
                        replyUrl: {
                            type: string;
                            description: string;
                        };
                        from: {
                            type: string;
                            description: string;
                        };
                        to: {
                            type: string;
                            description: string;
                        };
                        metaData: {
                            anyOf: ({
                                type: string;
                                items: {
                                    $ref: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                            description: string;
                        };
                        credentials: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        presentations: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        attachments: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        returnRoute: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IMetaData: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                            description: string;
                        };
                        value: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                VerifiableCredential: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        issuer: {
                            $ref: string;
                        };
                        credentialSubject: {
                            $ref: string;
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        credentialStatus: {
                            $ref: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                ProofType: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                        };
                    };
                    description: string;
                };
                IssuerType: {
                    anyOf: ({
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                        };
                        required: string[];
                    } | {
                        type: string;
                        properties?: undefined;
                        required?: undefined;
                    })[];
                    description: string;
                };
                CredentialSubject: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                    };
                    description: string;
                };
                ContextType: {
                    anyOf: ({
                        type: string;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            anyOf: {
                                type: string;
                            }[];
                        };
                    })[];
                    description: string;
                };
                CredentialStatusReference: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                VerifiablePresentation: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        holder: {
                            type: string;
                        };
                        verifiableCredential: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        verifier: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                W3CVerifiableCredential: {
                    anyOf: {
                        $ref: string;
                    }[];
                    description: string;
                };
                CompactJWT: {
                    type: string;
                    description: string;
                };
                IMessageAttachment: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        description: {
                            type: string;
                        };
                        filename: {
                            type: string;
                        };
                        media_type: {
                            type: string;
                        };
                        format: {
                            type: string;
                        };
                        lastmod_time: {
                            type: string;
                        };
                        byte_count: {
                            type: string;
                        };
                        data: {
                            $ref: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IMessageAttachmentData: {
                    type: string;
                    properties: {
                        jws: {};
                        hash: {
                            type: string;
                        };
                        links: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        base64: {
                            type: string;
                        };
                        json: {};
                    };
                    description: string;
                };
                IDataStoreGetVerifiableCredentialArgs: {
                    type: string;
                    properties: {
                        hash: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDataStoreGetVerifiablePresentationArgs: {
                    type: string;
                    properties: {
                        hash: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDataStoreSaveMessageArgs: {
                    type: string;
                    properties: {
                        message: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDataStoreSaveVerifiableCredentialArgs: {
                    type: string;
                    properties: {
                        verifiableCredential: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDataStoreSaveVerifiablePresentationArgs: {
                    type: string;
                    properties: {
                        verifiablePresentation: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
            };
            methods: {
                dataStoreDeleteMessage: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                dataStoreDeleteVerifiableCredential: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                dataStoreGetMessage: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                dataStoreGetVerifiableCredential: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                dataStoreGetVerifiablePresentation: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                dataStoreSaveMessage: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                dataStoreSaveVerifiableCredential: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                dataStoreSaveVerifiablePresentation: {
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
    IDataStoreORM: {
        components: {
            schemas: {
                FindIdentifiersArgs: {
                    $ref: string;
                    description: string;
                };
                "FindArgs-TIdentifiersColumns": {
                    type: string;
                    properties: {
                        where: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        order: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        skip: {
                            type: string;
                            description: string;
                        };
                        take: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
                "Where-TIdentifiersColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        value: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        not: {
                            type: string;
                        };
                        op: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                TIdentifiersColumns: {
                    type: string;
                    enum: string[];
                    description: string;
                    deprecated: string;
                };
                "Order-TIdentifiersColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        direction: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                PartialIdentifier: {
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
                FindMessagesArgs: {
                    $ref: string;
                    description: string;
                };
                "FindArgs-TMessageColumns": {
                    type: string;
                    properties: {
                        where: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        order: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        skip: {
                            type: string;
                            description: string;
                        };
                        take: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
                "Where-TMessageColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        value: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        not: {
                            type: string;
                        };
                        op: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                TMessageColumns: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                "Order-TMessageColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        direction: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                IMessage: {
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
                        createdAt: {
                            type: string;
                            description: string;
                        };
                        expiresAt: {
                            type: string;
                            description: string;
                        };
                        threadId: {
                            type: string;
                            description: string;
                        };
                        raw: {
                            type: string;
                            description: string;
                        };
                        data: {
                            anyOf: {
                                type: string;
                            }[];
                            description: string;
                        };
                        replyTo: {
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        };
                        replyUrl: {
                            type: string;
                            description: string;
                        };
                        from: {
                            type: string;
                            description: string;
                        };
                        to: {
                            type: string;
                            description: string;
                        };
                        metaData: {
                            anyOf: ({
                                type: string;
                                items: {
                                    $ref: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                            description: string;
                        };
                        credentials: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        presentations: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        attachments: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        returnRoute: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IMetaData: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                            description: string;
                        };
                        value: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                VerifiableCredential: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        issuer: {
                            $ref: string;
                        };
                        credentialSubject: {
                            $ref: string;
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        credentialStatus: {
                            $ref: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                ProofType: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                        };
                    };
                    description: string;
                };
                IssuerType: {
                    anyOf: ({
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                        };
                        required: string[];
                    } | {
                        type: string;
                        properties?: undefined;
                        required?: undefined;
                    })[];
                    description: string;
                };
                CredentialSubject: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                    };
                    description: string;
                };
                ContextType: {
                    anyOf: ({
                        type: string;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            anyOf: {
                                type: string;
                            }[];
                        };
                    })[];
                    description: string;
                };
                CredentialStatusReference: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                VerifiablePresentation: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        holder: {
                            type: string;
                        };
                        verifiableCredential: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        verifier: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                W3CVerifiableCredential: {
                    anyOf: {
                        $ref: string;
                    }[];
                    description: string;
                };
                CompactJWT: {
                    type: string;
                    description: string;
                };
                IMessageAttachment: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        description: {
                            type: string;
                        };
                        filename: {
                            type: string;
                        };
                        media_type: {
                            type: string;
                        };
                        format: {
                            type: string;
                        };
                        lastmod_time: {
                            type: string;
                        };
                        byte_count: {
                            type: string;
                        };
                        data: {
                            $ref: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IMessageAttachmentData: {
                    type: string;
                    properties: {
                        jws: {};
                        hash: {
                            type: string;
                        };
                        links: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        base64: {
                            type: string;
                        };
                        json: {};
                    };
                    description: string;
                };
                FindCredentialsArgs: {
                    $ref: string;
                    description: string;
                };
                "FindArgs-TCredentialColumns": {
                    type: string;
                    properties: {
                        where: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        order: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        skip: {
                            type: string;
                            description: string;
                        };
                        take: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
                "Where-TCredentialColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        value: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        not: {
                            type: string;
                        };
                        op: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                TCredentialColumns: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                "Order-TCredentialColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        direction: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                UniqueVerifiableCredential: {
                    type: string;
                    properties: {
                        hash: {
                            type: string;
                        };
                        verifiableCredential: {
                            $ref: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                FindClaimsArgs: {
                    $ref: string;
                    description: string;
                };
                "FindArgs-TClaimsColumns": {
                    type: string;
                    properties: {
                        where: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        order: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        skip: {
                            type: string;
                            description: string;
                        };
                        take: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
                "Where-TClaimsColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        value: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        not: {
                            type: string;
                        };
                        op: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                TClaimsColumns: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                "Order-TClaimsColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        direction: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                FindPresentationsArgs: {
                    $ref: string;
                    description: string;
                };
                "FindArgs-TPresentationColumns": {
                    type: string;
                    properties: {
                        where: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        order: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        skip: {
                            type: string;
                            description: string;
                        };
                        take: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
                "Where-TPresentationColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        value: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        not: {
                            type: string;
                        };
                        op: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                TPresentationColumns: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                "Order-TPresentationColumns": {
                    type: string;
                    properties: {
                        column: {
                            $ref: string;
                        };
                        direction: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
                UniqueVerifiablePresentation: {
                    type: string;
                    properties: {
                        hash: {
                            type: string;
                        };
                        verifiablePresentation: {
                            $ref: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
            };
            methods: {
                dataStoreORMGetIdentifiers: {
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
                dataStoreORMGetIdentifiersCount: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                dataStoreORMGetMessages: {
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
                dataStoreORMGetMessagesCount: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                dataStoreORMGetVerifiableCredentials: {
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
                dataStoreORMGetVerifiableCredentialsByClaims: {
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
                dataStoreORMGetVerifiableCredentialsByClaimsCount: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                dataStoreORMGetVerifiableCredentialsCount: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        type: string;
                    };
                };
                dataStoreORMGetVerifiablePresentations: {
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
                dataStoreORMGetVerifiablePresentationsCount: {
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
    IMessageHandler: {
        components: {
            schemas: {
                IHandleMessageArgs: {
                    type: string;
                    properties: {
                        raw: {
                            type: string;
                            description: string;
                        };
                        metaData: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        save: {
                            type: string;
                            description: string;
                            deprecated: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IMetaData: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                            description: string;
                        };
                        value: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IMessage: {
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
                        createdAt: {
                            type: string;
                            description: string;
                        };
                        expiresAt: {
                            type: string;
                            description: string;
                        };
                        threadId: {
                            type: string;
                            description: string;
                        };
                        raw: {
                            type: string;
                            description: string;
                        };
                        data: {
                            anyOf: {
                                type: string;
                            }[];
                            description: string;
                        };
                        replyTo: {
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        };
                        replyUrl: {
                            type: string;
                            description: string;
                        };
                        from: {
                            type: string;
                            description: string;
                        };
                        to: {
                            type: string;
                            description: string;
                        };
                        metaData: {
                            anyOf: ({
                                type: string;
                                items: {
                                    $ref: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                            description: string;
                        };
                        credentials: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        presentations: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        attachments: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        returnRoute: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                VerifiableCredential: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        issuer: {
                            $ref: string;
                        };
                        credentialSubject: {
                            $ref: string;
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        credentialStatus: {
                            $ref: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                ProofType: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                        };
                    };
                    description: string;
                };
                IssuerType: {
                    anyOf: ({
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                        };
                        required: string[];
                    } | {
                        type: string;
                        properties?: undefined;
                        required?: undefined;
                    })[];
                    description: string;
                };
                CredentialSubject: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                    };
                    description: string;
                };
                ContextType: {
                    anyOf: ({
                        type: string;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            anyOf: {
                                type: string;
                            }[];
                        };
                    })[];
                    description: string;
                };
                CredentialStatusReference: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                VerifiablePresentation: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        holder: {
                            type: string;
                        };
                        verifiableCredential: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        verifier: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                W3CVerifiableCredential: {
                    anyOf: {
                        $ref: string;
                    }[];
                    description: string;
                };
                CompactJWT: {
                    type: string;
                    description: string;
                };
                IMessageAttachment: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        description: {
                            type: string;
                        };
                        filename: {
                            type: string;
                        };
                        media_type: {
                            type: string;
                        };
                        format: {
                            type: string;
                        };
                        lastmod_time: {
                            type: string;
                        };
                        byte_count: {
                            type: string;
                        };
                        data: {
                            $ref: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IMessageAttachmentData: {
                    type: string;
                    properties: {
                        jws: {};
                        hash: {
                            type: string;
                        };
                        links: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        base64: {
                            type: string;
                        };
                        json: {};
                    };
                    description: string;
                };
            };
            methods: {
                handleMessage: {
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
    ICredentialIssuer: {
        components: {
            schemas: {
                ICreateVerifiableCredentialArgs: {
                    type: string;
                    properties: {
                        resolutionOptions: {
                            type: string;
                            properties: {
                                publicKeyFormat: {
                                    type: string;
                                };
                                accept: {
                                    type: string;
                                };
                            };
                            description: string;
                        };
                        credential: {
                            $ref: string;
                            description: string;
                        };
                        save: {
                            type: string;
                            description: string;
                            deprecated: string;
                        };
                        proofFormat: {
                            $ref: string;
                            description: string;
                        };
                        removeOriginalFields: {
                            type: string;
                            description: string;
                        };
                        keyRef: {
                            type: string;
                            description: string;
                        };
                        fetchRemoteContexts: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    additionalProperties: {
                        description: string;
                    };
                    description: string;
                };
                CredentialPayload: {
                    type: string;
                    properties: {
                        issuer: {
                            $ref: string;
                        };
                        credentialSubject: {
                            $ref: string;
                        };
                        type: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        "@context": {
                            $ref: string;
                        };
                        issuanceDate: {
                            $ref: string;
                        };
                        expirationDate: {
                            $ref: string;
                        };
                        credentialStatus: {
                            $ref: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IssuerType: {
                    anyOf: ({
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                        };
                        required: string[];
                    } | {
                        type: string;
                        properties?: undefined;
                        required?: undefined;
                    })[];
                    description: string;
                };
                CredentialSubject: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                    };
                    description: string;
                };
                ContextType: {
                    anyOf: ({
                        type: string;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            anyOf: {
                                type: string;
                            }[];
                        };
                    })[];
                    description: string;
                };
                DateType: {
                    type: string;
                    description: string;
                };
                CredentialStatusReference: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                ProofFormat: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                VerifiableCredential: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        issuer: {
                            $ref: string;
                        };
                        credentialSubject: {
                            $ref: string;
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        credentialStatus: {
                            $ref: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                ProofType: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                        };
                    };
                    description: string;
                };
                ICreateVerifiablePresentationArgs: {
                    type: string;
                    properties: {
                        resolutionOptions: {
                            type: string;
                            properties: {
                                publicKeyFormat: {
                                    type: string;
                                };
                                accept: {
                                    type: string;
                                };
                            };
                            description: string;
                        };
                        presentation: {
                            $ref: string;
                            description: string;
                        };
                        save: {
                            type: string;
                            description: string;
                            deprecated: string;
                        };
                        challenge: {
                            type: string;
                            description: string;
                        };
                        domain: {
                            type: string;
                            description: string;
                        };
                        proofFormat: {
                            $ref: string;
                            description: string;
                        };
                        removeOriginalFields: {
                            type: string;
                            description: string;
                        };
                        keyRef: {
                            type: string;
                            description: string;
                        };
                        fetchRemoteContexts: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    additionalProperties: {
                        description: string;
                    };
                    description: string;
                };
                PresentationPayload: {
                    type: string;
                    properties: {
                        holder: {
                            type: string;
                        };
                        verifiableCredential: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        type: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        "@context": {
                            $ref: string;
                        };
                        verifier: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        issuanceDate: {
                            $ref: string;
                        };
                        expirationDate: {
                            $ref: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                W3CVerifiableCredential: {
                    anyOf: {
                        $ref: string;
                    }[];
                    description: string;
                };
                CompactJWT: {
                    type: string;
                    description: string;
                };
                VerifiablePresentation: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        holder: {
                            type: string;
                        };
                        verifiableCredential: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        verifier: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
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
            };
            methods: {
                createVerifiableCredential: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                createVerifiablePresentation: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                listUsableProofFormats: {
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
            };
        };
    };
    ICredentialVerifier: {
        components: {
            schemas: {
                IVerifyCredentialArgs: {
                    type: string;
                    properties: {
                        resolutionOptions: {
                            type: string;
                            properties: {
                                publicKeyFormat: {
                                    type: string;
                                };
                                accept: {
                                    type: string;
                                };
                            };
                            description: string;
                        };
                        credential: {
                            $ref: string;
                            description: string;
                        };
                        fetchRemoteContexts: {
                            type: string;
                            description: string;
                        };
                        policies: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    additionalProperties: {
                        description: string;
                    };
                    description: string;
                };
                W3CVerifiableCredential: {
                    anyOf: {
                        $ref: string;
                    }[];
                    description: string;
                };
                VerifiableCredential: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        issuer: {
                            $ref: string;
                        };
                        credentialSubject: {
                            $ref: string;
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        credentialStatus: {
                            $ref: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                ProofType: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                        };
                    };
                    description: string;
                };
                IssuerType: {
                    anyOf: ({
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                        };
                        required: string[];
                    } | {
                        type: string;
                        properties?: undefined;
                        required?: undefined;
                    })[];
                    description: string;
                };
                CredentialSubject: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                    };
                    description: string;
                };
                ContextType: {
                    anyOf: ({
                        type: string;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            anyOf: {
                                type: string;
                            }[];
                        };
                    })[];
                    description: string;
                };
                CredentialStatusReference: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                CompactJWT: {
                    type: string;
                    description: string;
                };
                VerificationPolicies: {
                    type: string;
                    properties: {
                        now: {
                            type: string;
                            description: string;
                        };
                        issuanceDate: {
                            type: string;
                            description: string;
                        };
                        expirationDate: {
                            type: string;
                            description: string;
                        };
                        audience: {
                            type: string;
                            description: string;
                        };
                        credentialStatus: {
                            type: string;
                            description: string;
                        };
                    };
                    additionalProperties: {
                        description: string;
                    };
                    description: string;
                };
                IVerifyResult: {
                    type: string;
                    properties: {
                        verified: {
                            type: string;
                            description: string;
                        };
                        error: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    additionalProperties: {
                        description: string;
                    };
                    description: string;
                };
                IError: {
                    type: string;
                    properties: {
                        message: {
                            type: string;
                            description: string;
                        };
                        errorCode: {
                            type: string;
                            description: string;
                        };
                    };
                    description: string;
                };
                IVerifyPresentationArgs: {
                    type: string;
                    properties: {
                        resolutionOptions: {
                            type: string;
                            properties: {
                                publicKeyFormat: {
                                    type: string;
                                };
                                accept: {
                                    type: string;
                                };
                            };
                            description: string;
                        };
                        presentation: {
                            $ref: string;
                            description: string;
                        };
                        challenge: {
                            type: string;
                            description: string;
                        };
                        domain: {
                            type: string;
                            description: string;
                        };
                        fetchRemoteContexts: {
                            type: string;
                            description: string;
                        };
                        policies: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    additionalProperties: {
                        description: string;
                    };
                    description: string;
                };
                W3CVerifiablePresentation: {
                    anyOf: {
                        $ref: string;
                    }[];
                    description: string;
                };
                VerifiablePresentation: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        holder: {
                            type: string;
                        };
                        verifiableCredential: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        verifier: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
            };
            methods: {
                verifyCredential: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                verifyPresentation: {
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
    ICredentialPlugin: {
        components: {
            schemas: {};
            methods: {};
        };
    };
    ICredentialStatus: {
        components: {
            schemas: {};
            methods: {};
        };
    };
    ICredentialStatusVerifier: {
        components: {
            schemas: {
                ICheckCredentialStatusArgs: {
                    type: string;
                    properties: {
                        resolutionOptions: {
                            type: string;
                            properties: {
                                publicKeyFormat: {
                                    type: string;
                                };
                                accept: {
                                    type: string;
                                };
                            };
                            description: string;
                        };
                        credential: {
                            $ref: string;
                            description: string;
                        };
                        didDocumentOverride: {
                            $ref: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                VerifiableCredential: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        issuer: {
                            $ref: string;
                        };
                        credentialSubject: {
                            $ref: string;
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        credentialStatus: {
                            $ref: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                ProofType: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                        };
                    };
                    description: string;
                };
                IssuerType: {
                    anyOf: ({
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                        };
                        required: string[];
                    } | {
                        type: string;
                        properties?: undefined;
                        required?: undefined;
                    })[];
                    description: string;
                };
                CredentialSubject: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                    };
                    description: string;
                };
                ContextType: {
                    anyOf: ({
                        type: string;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            anyOf: {
                                type: string;
                            }[];
                        };
                    })[];
                    description: string;
                };
                CredentialStatusReference: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                DIDDocument: {
                    type: string;
                    properties: {
                        authentication: {
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
                        };
                        assertionMethod: {
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
                        };
                        keyAgreement: {
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
                        };
                        capabilityInvocation: {
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
                        };
                        capabilityDelegation: {
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
                        };
                        "@context": {
                            anyOf: ({
                                type: string;
                                const: string;
                                items?: undefined;
                            } | {
                                type: string;
                                const?: undefined;
                                items?: undefined;
                            } | {
                                type: string;
                                items: {
                                    type: string;
                                };
                                const?: undefined;
                            })[];
                        };
                        id: {
                            type: string;
                        };
                        alsoKnownAs: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        controller: {
                            anyOf: ({
                                type: string;
                                items?: undefined;
                            } | {
                                type: string;
                                items: {
                                    type: string;
                                };
                            })[];
                        };
                        verificationMethod: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        service: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                        };
                        publicKey: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            deprecated: boolean;
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
                CredentialStatus: {
                    type: string;
                    properties: {
                        revoked: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
            };
            methods: {
                checkCredentialStatus: {
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
    ICredentialStatusManager: {
        components: {
            schemas: {
                CredentialStatusGenerateArgs: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    additionalProperties: {
                        description: string;
                    };
                    description: string;
                };
                CredentialStatusReference: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                CredentialStatusUpdateArgs: {
                    type: string;
                    properties: {
                        vc: {
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
                VerifiableCredential: {
                    type: string;
                    properties: {
                        proof: {
                            $ref: string;
                        };
                        issuer: {
                            $ref: string;
                        };
                        credentialSubject: {
                            $ref: string;
                        };
                        type: {
                            anyOf: ({
                                type: string;
                                items: {
                                    type: string;
                                };
                            } | {
                                type: string;
                                items?: undefined;
                            })[];
                        };
                        "@context": {
                            $ref: string;
                        };
                        issuanceDate: {
                            type: string;
                        };
                        expirationDate: {
                            type: string;
                        };
                        credentialStatus: {
                            $ref: string;
                        };
                        id: {
                            type: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                ProofType: {
                    type: string;
                    properties: {
                        type: {
                            type: string;
                        };
                    };
                    description: string;
                };
                IssuerType: {
                    anyOf: ({
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                        };
                        required: string[];
                    } | {
                        type: string;
                        properties?: undefined;
                        required?: undefined;
                    })[];
                    description: string;
                };
                CredentialSubject: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                    };
                    description: string;
                };
                ContextType: {
                    anyOf: ({
                        type: string;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            anyOf: {
                                type: string;
                            }[];
                        };
                    })[];
                    description: string;
                };
            };
            methods: {
                credentialStatusGenerate: {
                    description: string;
                    arguments: {
                        $ref: string;
                    };
                    returnType: {
                        $ref: string;
                    };
                };
                credentialStatusTypes: {
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
                credentialStatusUpdate: {
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
};
//# sourceMappingURL=plugin.schema.d.ts.map