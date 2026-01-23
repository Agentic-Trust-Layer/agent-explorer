"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractForNetwork = getContractForNetwork;
exports.configureResolverWithNetworks = configureResolverWithNetworks;
const ethers_1 = require("ethers");
const helpers_js_1 = require("./helpers.js");
const deployments_js_1 = require("./config/deployments.js");
const EthereumDIDRegistry_js_1 = require("./config/EthereumDIDRegistry.js");
const infuraNames = {
    polygon: 'matic',
    'polygon:test': 'maticmum',
    aurora: 'aurora-mainnet',
};
const knownInfuraNames = ['mainnet', 'aurora', 'linea:goerli', 'sepolia'];
function configureNetworksWithInfura(projectId) {
    if (!projectId) {
        return {};
    }
    const networks = knownInfuraNames
        .map((n) => {
        const existingDeployment = deployments_js_1.deployments.find((d) => d.name === n);
        if (existingDeployment && existingDeployment.name) {
            const infuraName = infuraNames[existingDeployment.name] || existingDeployment.name;
            const rpcUrl = `https://${infuraName}.infura.io/v3/${projectId}`;
            return { ...existingDeployment, rpcUrl };
        }
    })
        .filter((conf) => !!conf);
    return configureNetworks({ networks });
}
function getContractForNetwork(conf) {
    let provider = conf.provider || conf.web3?.currentProvider;
    if (!provider) {
        if (conf.rpcUrl) {
            const chainIdRaw = conf.chainId ? conf.chainId : deployments_js_1.deployments.find((d) => d.name === conf.name)?.chainId;
            const chainId = chainIdRaw ? BigInt(chainIdRaw) : chainIdRaw;
            provider = new ethers_1.JsonRpcProvider(conf.rpcUrl, chainId || 'any');
        }
        else {
            throw new Error(`invalid_config: No web3 provider could be determined for network ${conf.name || conf.chainId}`);
        }
    }
    const contract = ethers_1.ContractFactory.fromSolidity(EthereumDIDRegistry_js_1.EthereumDIDRegistry)
        .attach(conf.registry || helpers_js_1.DEFAULT_REGISTRY_ADDRESS)
        .connect(provider);
    return contract;
}
function configureNetwork(net) {
    const networks = {};
    const chainId = net.chainId || deployments_js_1.deployments.find((d) => net.name && (d.name === net.name || d.description === net.name))?.chainId;
    if (chainId) {
        if (net.name) {
            networks[net.name] = getContractForNetwork(net);
        }
        const id = typeof chainId === 'bigint' || typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;
        networks[id] = getContractForNetwork(net);
    }
    else if (net.provider || net.web3 || net.rpcUrl) {
        networks[net.name || ''] = getContractForNetwork(net);
    }
    return networks;
}
function configureNetworks(conf) {
    return {
        ...configureNetwork(conf),
        ...conf.networks?.reduce((networks, net) => {
            return { ...networks, ...configureNetwork(net) };
        }, {}),
    };
}
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
function configureResolverWithNetworks(conf = {}) {
    const networks = {
        ...configureNetworksWithInfura(conf.infuraProjectId),
        ...configureNetworks(conf),
    };
    if (Object.keys(networks).length === 0) {
        throw new Error('invalid_config: Please make sure to have at least one network');
    }
    return networks;
}
//# sourceMappingURL=configuration.js.map