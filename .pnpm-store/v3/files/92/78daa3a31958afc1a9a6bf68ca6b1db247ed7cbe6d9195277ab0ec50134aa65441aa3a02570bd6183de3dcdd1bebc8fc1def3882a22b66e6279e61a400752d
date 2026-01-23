import { DIDDocumentSection, IAgentPlugin, IResolver } from '@veramo/core-types';
import { DIDDocument, DIDResolutionOptions, DIDResolutionResult, DIDResolver, Resolvable, ServiceEndpoint, VerificationMethod } from 'did-resolver';
/**
 * A Veramo Plugin that enables users to resolve DID documents.
 *
 * This plugin is used automatically by plugins that create or verify Verifiable Credentials or Presentations or when
 * working with DIDComm
 *
 * @public
 */
export declare class DIDResolverPlugin implements IAgentPlugin {
    readonly methods: IResolver;
    readonly schema: {
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
    private didResolver;
    constructor(options: {
        resolver?: Resolvable;
    } | {
        [didMethod: string]: DIDResolver;
    });
    /** {@inheritDoc @veramo/core-types#IResolver.resolveDid} */
    resolveDid({ didUrl, options, }: {
        didUrl: string;
        options?: DIDResolutionOptions;
    }): Promise<DIDResolutionResult>;
    /** {@inheritDoc @veramo/core-types#IResolver.getDIDComponentById} */
    getDIDComponentById({ didDocument, didUrl, section, }: {
        didDocument: DIDDocument;
        didUrl: string;
        section?: DIDDocumentSection;
    }): Promise<VerificationMethod | ServiceEndpoint>;
}
//# sourceMappingURL=resolver.d.ts.map