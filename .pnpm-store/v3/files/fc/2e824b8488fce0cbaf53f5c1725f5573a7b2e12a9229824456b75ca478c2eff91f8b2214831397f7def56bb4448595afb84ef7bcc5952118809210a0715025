import { IAgentContext, IIdentifier, IKey, IKeyManager, IService } from '@veramo/core-types';
import { AbstractIdentifierProvider } from '@veramo/did-manager';
import { Provider, TransactionRequest } from 'ethers';
export type IRequiredContext = IAgentContext<IKeyManager>;
/**
 * For most operations at most 60-70k gas is needed, larger amount for safety
 */
export declare const DEFAULT_GAS_LIMIT = 100000;
/**
 * Helper method that can computes the ethereumAddress corresponding to a Secp256k1 public key.
 * @param hexPublicKey A hex encoded public key, optionally prefixed with `0x`
 */
export declare function toEthereumAddress(hexPublicKey: string): string;
/**
 * Options for creating a did:ethr
 * @beta
 */
export interface CreateDidEthrOptions {
    /**
     * This can be a network name or hex encoded chain ID (string) or a chainId number
     *
     * If this is not specified, `mainnet` is assumed.
     */
    network?: string | number | bigint;
    /**
     * This is usually a did prefix, like `did:ethr` or `did:ethr:goerli` and can be used to determine the desired
     * network, if no `network` option is specified.
     */
    providerName?: string;
}
export interface TransactionOptions extends TransactionRequest {
    ttl?: number;
    encoding?: string;
    metaIdentifierKeyId?: string;
}
/**
 * Possible options for network configuration for `did:ethr`
 *
 * @beta
 */
export interface EthrNetworkConfiguration {
    /**
     * The name of the network, for example 'mainnet', 'goerli', 'polygon'.
     * If this is present, then DIDs anchored on this network will have a human-readable prefix, like
     * `did:ethr:goerli:0x...`. See the
     * {@link https://github.com/uport-project/ethr-did-registry#contract-deployments | official deployments} for a table
     * of reusable names.
     * If this parameter is not present, `chainId` MUST be specified.
     */
    name?: string;
    /**
     * Web3 provider. This is used to interact with the ethereum network.
     * When a web3 wallet is used here, it can also be used to sign transactions.
     * Either a `provider` or a `rpcUrl` must be specified. `provider` takes precedence when both are used.
     */
    provider?: Provider;
    /**
     * Equivalent to `provider`
     * Web3 provider. This is used to interact with the ethereum network.
     * When a web3 wallet is used here, it can also be used to sign transactions.
     * Either a `provider` or a `rpcUrl` must be specified. `provider` takes precedence when both are used.
     */
    web3Provider?: Provider;
    /**
     * A JSON RPC URL for the ethereum network that is being used.
     * Either a `provider` or a `rpcUrl` must be specified. `provider` takes precedence when both are used.
     */
    rpcUrl?: string;
    /**
     * The EIP1056 registry address for the ethereum network being configured.
     *
     * Please See the
     * {@link https://github.com/uport-project/ethr-did-registry#contract-deployments | official deployments} for a table
     * of known deployments.
     */
    registry?: string;
    /**
     * The chain ID for the ethereum network being configured. This can be a hex-encoded string starting with `0x`.
     * If `name` is not specified, then the hex encoded `chainId` will be used when creating DIDs, according to the
     * `did:ethr` spec.
     *
     * Example, chainId==42 and name==undefined => DIDs are prefixed with `did:ethr:0x2a:`
     */
    chainId?: string | number | bigint;
    [index: string]: any;
}
/**
 * {@link @veramo/did-manager#DIDManager} identifier provider for `did:ethr` identifiers
 * @public
 */
export declare class EthrDIDProvider extends AbstractIdentifierProvider {
    private defaultKms;
    private networks;
    private gas?;
    private ttl?;
    constructor(options: {
        defaultKms: string;
        networks?: EthrNetworkConfiguration[];
        ttl?: number;
        /**
         * @deprecated Please use the `networks` parameter instead.
         */
        network?: string | number | bigint;
        /**
         * @deprecated Please use the `networks` parameter instead.
         */
        name?: string;
        /**
         * @deprecated Please use the `networks` parameter instead.
         */
        rpcUrl?: string;
        /**
         * @deprecated Please use the `networks` parameter instead.
         */
        web3Provider?: Provider;
        /**
         * @deprecated Please use the `networks` parameter instead.
         */
        registry?: string;
        /**
         * @deprecated If tweaking is necessary, please specify the maximum `gasLimit` as an `option` to every DID update
         */
        gas?: number;
    });
    createIdentifier({ kms, options }: {
        kms?: string;
        options?: CreateDidEthrOptions;
    }, context: IRequiredContext): Promise<Omit<IIdentifier, 'provider'>>;
    updateIdentifier(args: {
        did: string;
        kms?: string | undefined;
        alias?: string | undefined;
        options?: any;
    }, context: IAgentContext<IKeyManager>): Promise<IIdentifier>;
    deleteIdentifier(identifier: IIdentifier, context: IRequiredContext): Promise<boolean>;
    private getNetworkFor;
    private getEthrDidController;
    addKey({ identifier, key, options }: {
        identifier: IIdentifier;
        key: IKey;
        options?: TransactionOptions;
    }, context: IRequiredContext): Promise<any>;
    addService({ identifier, service, options, }: {
        identifier: IIdentifier;
        service: IService;
        options?: TransactionOptions;
    }, context: IRequiredContext): Promise<any>;
    removeKey(args: {
        identifier: IIdentifier;
        kid: string;
        options?: TransactionOptions;
    }, context: IRequiredContext): Promise<any>;
    removeService(args: {
        identifier: IIdentifier;
        id: string;
        options?: TransactionOptions;
    }, context: IRequiredContext): Promise<any>;
    /**
     * Tries to determine if this DID provider can manage DIDs with the given prefix.
     *
     * If this provider was configured for a particular network and that network name or hexChainId is used in the prefix
     * it will return true.
     *
     * @param prefix - The DID prefix to match against
     */
    matchPrefix(prefix: string): boolean;
    private static createMetaSignature;
}
//# sourceMappingURL=ethr-did-provider.d.ts.map