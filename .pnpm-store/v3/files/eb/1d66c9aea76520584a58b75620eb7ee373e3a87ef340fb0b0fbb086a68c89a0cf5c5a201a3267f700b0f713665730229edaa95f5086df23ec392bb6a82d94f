/**
 * Represents metadata for a deployment of the ERC1056 registry contract.
 *
 * This can be used to correctly connect DIDs anchored on a particular network to the known registry for that network.
 */
export type EthrDidRegistryDeployment = {
    /**
     * The chain ID of the ethereum-like network for this deployment.
     *
     * The HEX encoding of this value gets used to construct DIDs anchored on this network when the `name` property is
     * not set. Example: `did:ethr:<0xHexChainId>:0x...`
     */
    chainId: number | bigint;
    /**
     * The ERC1056 contract address on this network
     */
    registry: string;
    /**
     * The name of the network.
     * This is used to construct DIDs on this network: `did:ethr:<name>:0x...`.
     * If this is omitted, DIDs for this network are constructed using the HEX encoding of the chainID
     */
    name?: string;
    description?: string;
    /**
     * A JSON-RPC endpoint that can be used to broadcast transactions or queries to this network
     */
    rpcUrl?: string;
    /**
     * Contracts prior to ethr-did-registry@0.0.3 track nonces differently for meta-transactions
     *
     * @see https://github.com/decentralized-identity/ethr-did-resolver/pull/164
     */
    legacyNonce?: boolean;
    [x: string]: any;
};
/**
 * Represents the known deployments of the ERC1056 registry contract.
 */
export declare const deployments: EthrDidRegistryDeployment[];
//# sourceMappingURL=deployments.d.ts.map