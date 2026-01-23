import { Contract, Provider } from 'ethers';
import { EthrDidRegistryDeployment } from './config/deployments.js';
/**
 * A configuration entry for an ethereum network
 * It should contain at least one of `name` or `chainId` AND one of `provider`, `web3`, or `rpcUrl`
 *
 * @example ```js
 * { name: 'development', registry: '0x9af37603e98e0dc2b855be647c39abe984fc2445', rpcUrl: 'http://127.0.0.1:8545/' }
 * { name: 'sepolia', chainId: 11155111, provider: new InfuraProvider('sepolia') }
 * { name: 'goerli', provider: new AlchemyProvider('goerli') }
 * { name: 'rsk:testnet', chainId: '0x1f', rpcUrl: 'https://public-node.testnet.rsk.co' }
 * ```
 */
export interface ProviderConfiguration extends Omit<EthrDidRegistryDeployment, 'chainId'> {
    provider?: Provider | null;
    chainId?: string | number | bigint;
    web3?: any;
}
export interface MultiProviderConfiguration extends ProviderConfiguration {
    networks?: ProviderConfiguration[];
}
export interface InfuraConfiguration {
    infuraProjectId: string;
}
export type ConfigurationOptions = MultiProviderConfiguration | InfuraConfiguration;
export type ConfiguredNetworks = Record<string, Contract>;
export declare function getContractForNetwork(conf: ProviderConfiguration): Contract;
/**
 * Generates a configuration that maps ethereum network names and chainIDs to the respective ERC1056 contracts deployed
 * on them.
 * @returns a record of ERC1056 `Contract` instances
 * @param conf - configuration options for the resolver. An array of network details.
 * Each network entry should contain at least one of `name` or `chainId` AND one of `provider`, `web3`, or `rpcUrl`
 * For convenience, you can also specify an `infuraProjectId` which will create a mapping for all the networks
 *   supported by https://infura.io.
 * @example ```js
 * [
 *   { name: 'development', registry: '0x9af37603e98e0dc2b855be647c39abe984fc2445', rpcUrl: 'http://127.0.0.1:8545/' },
 *   { name: 'goerli', chainId: 5, provider: new InfuraProvider('goerli') },
 *   { name: 'sepolia', provider: new AlchemyProvider('sepolia') },
 *   { name: 'rsk:testnet', chainId: '0x1f', rpcUrl: 'https://public-node.testnet.rsk.co' },
 * ]
 * ```
 */
export declare function configureResolverWithNetworks(conf?: ConfigurationOptions): ConfiguredNetworks;
//# sourceMappingURL=configuration.d.ts.map