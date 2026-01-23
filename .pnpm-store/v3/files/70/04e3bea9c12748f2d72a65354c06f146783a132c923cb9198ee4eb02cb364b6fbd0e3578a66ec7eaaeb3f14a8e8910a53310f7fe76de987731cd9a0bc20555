import { IAgentContext, IAgentPlugin } from '@veramo/core-types';
import { IDIDDiscovery, IDIDDiscoveryDiscoverDidArgs, IDIDDiscoveryDiscoverDidResult } from './types.js';
import { AbstractDidDiscoveryProvider } from './abstract-did-discovery-provider.js';
/**
 * This class adds support for discovering DIDs.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export declare class DIDDiscovery implements IAgentPlugin {
    readonly methods: IDIDDiscovery;
    readonly schema: {
        components: {
            schemas: {
                IDIDDiscoveryDiscoverDidArgs: {
                    type: string;
                    properties: {
                        query: {
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
                IDIDDiscoveryDiscoverDidResult: {
                    type: string;
                    properties: {
                        query: {
                            type: string;
                            description: string;
                        };
                        options: {
                            type: string;
                            description: string;
                        };
                        results: {
                            type: string;
                            items: {
                                $ref: string;
                            };
                            description: string;
                        };
                        errors: {
                            type: string;
                            additionalProperties: {
                                type: string;
                            };
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                IDIDDiscoveryProviderResult: {
                    type: string;
                    properties: {
                        provider: {
                            type: string;
                            description: string;
                        };
                        matches: {
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
                IDIDDiscoverMatch: {
                    type: string;
                    properties: {
                        did: {
                            type: string;
                            description: string;
                        };
                        metaData: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
            };
            methods: {
                discoverDid: {
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
    readonly providers: Array<AbstractDidDiscoveryProvider>;
    constructor(options: {
        providers: Array<AbstractDidDiscoveryProvider>;
    });
    /**
     * Queries data providers and returns DIDs with metadata
     *
     * @param args - The param object with the properties necessary to discover DID
     * @param context - *RESERVED* This is filled by the framework when the method is called.
     *
     */
    discoverDid(args: IDIDDiscoveryDiscoverDidArgs, context: IAgentContext<any>): Promise<IDIDDiscoveryDiscoverDidResult>;
}
//# sourceMappingURL=action-handler.d.ts.map