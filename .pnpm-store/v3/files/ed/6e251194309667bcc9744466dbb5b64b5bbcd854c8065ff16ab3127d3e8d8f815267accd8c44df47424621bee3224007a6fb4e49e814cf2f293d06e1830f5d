/**
 * L2 ENS Client for Base Sepolia and Optimism Sepolia
 * Extends AIAgentENSClient with namespace.ninja integration for L2 subname operations
 */
import { encodeFunctionData, namehash } from 'viem';
import { AIAgentENSClient } from './AIAgentENSClient';
// @ts-ignore - @thenamespace/mint-manager doesn't have type definitions
import { createMintClient } from '@thenamespace/mint-manager';
import { createIndexerClient } from '@thenamespace/indexer';
import { sepolia, baseSepolia, optimismSepolia } from 'viem/chains';
export class AIAgentL2ENSNamespaceClient extends AIAgentENSClient {
    namespaceClient = null;
    constructor(chain, rpcUrl, adapter, ensRegistryAddress, ensResolverAddress, identityRegistryAddress) {
        super(chain, rpcUrl, adapter, ensRegistryAddress, ensResolverAddress, identityRegistryAddress);
        this.initializeNamespaceClient();
    }
    /**
     * Override to ensure L2 client always returns true for isL2()
     */
    isL2() {
        return true; // This is always an L2 client
    }
    /**
     * Override to ensure L2 client always returns false for isL1()
     */
    isL1() {
        return false; // This is never an L1 client
    }
    /**
     * Override to ensure L2 client always returns 'L2'
     */
    getChainType() {
        return 'L2';
    }
    initializeNamespaceClient() {
        try {
            const client = createMintClient({
                isTestnet: true, // Use testnet (sepolia)
                cursomRpcUrls: {
                    [sepolia.id]: process.env.ETH_SEPOLIA_RPC_URL || '',
                    [baseSepolia.id]: process.env.BASE_SEPOLIA_RPC_URL || '',
                    [optimismSepolia.id]: process.env.OP_SEPOLIA_RPC_URL || '',
                }
            });
            this.namespaceClient = client;
            console.info('Namespace.ninja L2 client initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize namespace.ninja L2 client:', error);
        }
    }
    async getAgentUrlByName(name) {
        // If standard lookup fails and we have namespace client, try L2 lookup
        if (this.namespaceClient) {
            try {
                const chainId = this.chain.id;
                const isAvailable = await this.namespaceClient.isL2SubnameAvailable(name, chainId);
                if (!isAvailable) {
                    const client = createIndexerClient();
                    const subname = await client.getL2Subname({
                        chainId: this.chain.id,
                        nameOrNamehash: namehash(name)
                    });
                    console.info("subname for name: ", name, " is: ", subname);
                    if (subname) {
                        if (subname.records?.texts?.url) {
                            const url = subname.records?.texts?.url;
                            return url;
                        }
                    }
                    return null;
                }
            }
            catch (error) {
                console.error('Error checking L2 subname availability 1:', error);
            }
        }
        return null;
    }
    /**
     * Override getAgentAccountByName to use namespace.ninja for L2 availability checking
     */
    async getAgentAccountByName(name) {
        console.info("AIAgentL2ENSClient.getAgentAccountByName: ", name);
        // If standard lookup fails and we have namespace client, try L2 lookup
        if (this.namespaceClient) {
            try {
                const chainId = this.chain.id;
                const isAvailable = await this.namespaceClient.isL2SubnameAvailable(name, chainId);
                if (!isAvailable) {
                    console.info("AIAgentL2ENSClient.getAgentAccountByName: not available");
                    const client = createIndexerClient();
                    const subname = await client.getL2Subname({
                        chainId: this.chain.id,
                        nameOrNamehash: namehash(name)
                    });
                    console.info("AIAgentL2ENSClient.getAgentAccountByName: subname: ", subname);
                    if (subname) {
                        console.info("AIAgentL2ENSClient.getAgentAccountByName: subname.owner: ", subname.owner);
                        return subname.owner;
                    }
                    return null;
                }
            }
            catch (error) {
                console.error('Error checking L2 subname availability 2:', error);
            }
        }
        return null;
    }
    /**
     * Get the namespace client instance
     */
    getNamespaceClient() {
        return this.namespaceClient;
    }
    /**
     * Note: getAgentEoaByAgentAccount is not a method of AIAgentENSClient
     * This method is actually in AIAgentIdentityClient, so we don't need to override it here.
     * The ownership detection logic is handled in the UI layer (AddAgentModal.tsx)
     */
    /**
     * Override hasAgentNameOwner to use namespace.ninja for L2 availability checking
     */
    async hasAgentNameOwner(orgName, agentName) {
        console.info("AIAgentL2ENSNamespaceClient.hasAgentNameOwner");
        const clean = (s) => (s || '').trim().toLowerCase();
        const parent = clean(orgName) + ".eth";
        const label = clean(agentName).replace(/\s+/g, '-');
        const fullSubname = `${label}.${parent}`;
        // Use namespace.ninja to check if subname exists
        if (this.namespaceClient) {
            try {
                const chainId = this.chain.id;
                const isAvailable = await this.namespaceClient.isL2SubnameAvailable(fullSubname, chainId);
                const hasOwner = !isAvailable; // If not available, it has an owner
                console.info(`AIAgentL2ENSNamespaceClient.hasAgentNameOwner: "${fullSubname}" ${hasOwner ? 'HAS owner' : 'has NO owner'}`);
                return hasOwner;
            }
            catch (error) {
                console.error('Error checking agent name owner:', error);
                return false;
            }
        }
        return false;
    }
    /**
     * Override prepareAddAgentNameToOrgCalls to use namespace.ninja SDK for L2
     */
    async prepareAddAgentNameToOrgCalls(params) {
        console.log("AIAgentL2ENSClient.prepareAddAgentNameToOrgCalls");
        console.log("orgName: ", params.orgName);
        console.log("agentName: ", params.agentName);
        console.log("agentAddress: ", params.agentAddress);
        const clean = (s) => (s || '').trim().toLowerCase();
        const parent = clean(params.orgName) + ".eth";
        const label = clean(params.agentName).replace(/\s+/g, '-');
        const fullSubname = `${label}.${parent}.eth`;
        const agentAddress = params.agentAddress;
        const agentUrl = params.agentUrl;
        const chainName = this.chain.name.toLowerCase().replace(/\s+/g, '-');
        console.info("parent: ", parent);
        console.info("label: ", label);
        console.info("agentAddress: ", agentAddress);
        console.info("chainName: ", chainName);
        console.info("agentUrl: ", agentUrl);
        // Prepare mint transaction parameters using namespace.ninja SDK
        const mintRequest = {
            parentName: parent, // e.g., "theorg.eth"
            label: label, // e.g., "atl-test-1"
            owner: agentAddress,
            minterAddress: agentAddress,
            records: {
                texts: [
                    { key: 'name', value: label },
                    { key: 'url', value: agentUrl },
                    { key: 'description', value: `Agent: ${label}` },
                    { key: 'chain', value: chainName },
                    { key: 'agent-account', value: agentAddress },
                ],
                addresses: [
                    {
                        chain: 60, // Ethereum coin type
                        value: agentAddress
                    },
                ],
            }
        };
        console.info("mintRequest: ", mintRequest);
        const mintParams = await this.namespaceClient.getMintTransactionParameters(mintRequest);
        console.info("mintParams: ", mintParams);
        const { to, data, value } = {
            to: mintParams.contractAddress,
            data: encodeFunctionData({
                abi: mintParams.abi,
                functionName: mintParams.functionName,
                args: mintParams.args,
            }),
            value: mintParams.value || 0n
        };
        const rtnCalls = [{
                to: to,
                data: data,
                value: value,
            }];
        // Return the mint transaction parameters as calls
        return { calls: rtnCalls };
    }
    async prepareSetNameUriCalls(name, uri) {
        const calls = [];
        return { calls };
    }
}
//# sourceMappingURL=AIAgentL2ENSNamespaceClient.js.map