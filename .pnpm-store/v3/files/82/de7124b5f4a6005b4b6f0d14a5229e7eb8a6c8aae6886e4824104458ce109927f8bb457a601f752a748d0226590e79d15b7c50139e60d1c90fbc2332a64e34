"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthrDidResolver = void 0;
exports.getResolver = getResolver;
const ethers_1 = require("ethers");
const configuration_js_1 = require("./configuration.js");
const helpers_js_1 = require("./helpers.js");
const logParser_js_1 = require("./logParser.js");
function getResolver(options) {
    return new EthrDidResolver(options).build();
}
class EthrDidResolver {
    constructor(options) {
        this.contracts = (0, configuration_js_1.configureResolverWithNetworks)(options);
    }
    /**
     * Returns the block number with the previous change to a particular address (DID)
     *
     * @param address - the address (DID) to check for changes
     * @param networkId - the EVM network to check
     * @param blockTag - the block tag to use for the query (default: 'latest')
     */
    async previousChange(address, networkId, blockTag) {
        return await this.contracts[networkId].changed(address, { blockTag });
    }
    async getBlockMetadata(blockHeight, networkId) {
        const networkContract = this.contracts[networkId];
        if (!networkContract)
            throw new Error(`No contract configured for network ${networkId}`);
        if (!networkContract.runner)
            throw new Error(`No runner configured for contract with network ${networkId}`);
        if (!networkContract.runner.provider)
            throw new Error(`No provider configured for runner in contract with network ${networkId}`);
        const block = await networkContract.runner.provider.getBlock(blockHeight);
        if (!block)
            throw new Error(`Block at height ${blockHeight} not found`);
        return {
            height: block.number.toString(),
            isoDate: new Date(block.timestamp * 1000).toISOString().replace('.000', ''),
        };
    }
    async changeLog(identity, networkId, blockTag = 'latest') {
        const contract = this.contracts[networkId];
        if (!contract)
            throw new Error(`No contract configured for network ${networkId}`);
        if (!contract.runner)
            throw new Error(`No runner configured for contract with network ${networkId}`);
        if (!contract.runner.provider)
            throw new Error(`No provider configured for runner in contract with network ${networkId}`);
        const provider = contract.runner.provider;
        const hexChainId = networkId.startsWith('0x') ? networkId : undefined;
        //TODO: this can be used to check if the configuration is ok
        const chainId = hexChainId ? BigInt(hexChainId) : (await provider.getNetwork()).chainId;
        const history = [];
        const { address, publicKey } = (0, helpers_js_1.interpretIdentifier)(identity);
        const controllerKey = publicKey;
        let previousChange = await this.previousChange(address, networkId, blockTag);
        while (previousChange) {
            const blockNumber = previousChange;
            const logs = await provider.getLogs({
                address: await contract.getAddress(), // networks[networkId].registryAddress,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                topics: [null, `0x000000000000000000000000${address.slice(2)}`],
                fromBlock: previousChange,
                toBlock: previousChange,
            });
            const events = (0, logParser_js_1.logDecoder)(contract, logs);
            events.reverse();
            previousChange = null;
            for (const event of events) {
                history.unshift(event);
                if (event.previousChange < blockNumber) {
                    previousChange = event.previousChange;
                }
            }
        }
        return { address, history, controllerKey, chainId };
    }
    wrapDidDocument(did, address, controllerKey, history, chainId, blockHeight, now) {
        const baseDIDDocument = {
            id: did,
            verificationMethod: [],
            authentication: [],
            assertionMethod: [],
        };
        let controller = address;
        const authentication = [`${did}#controller`];
        const assertionMethod = [`${did}#controller`];
        let versionId = 0;
        let nextVersionId = Number.POSITIVE_INFINITY;
        let deactivated = false;
        let delegateCount = 0;
        let serviceCount = 0;
        let endpoint = '';
        const auth = {};
        const keyAgreementRefs = {};
        const signingRefs = {};
        const pks = {};
        const services = {};
        if (typeof blockHeight === 'string') {
            // latest
            blockHeight = -1;
        }
        for (const event of history) {
            if (blockHeight !== -1 && event.blockNumber > blockHeight) {
                if (nextVersionId > event.blockNumber) {
                    nextVersionId = event.blockNumber;
                }
                continue;
            }
            else {
                if (versionId < event.blockNumber) {
                    versionId = event.blockNumber;
                }
            }
            const validTo = event.validTo || BigInt(0);
            const eventIndex = `${event._eventName}-${event.delegateType || event.name}-${event.delegate || event.value}`;
            if (validTo && validTo >= now) {
                if (event._eventName === helpers_js_1.eventNames.DIDDelegateChanged) {
                    const currentEvent = event;
                    delegateCount++;
                    const delegateType = currentEvent.delegateType; //conversion from bytes32 is done in logParser
                    switch (delegateType) {
                        case 'sigAuth':
                            auth[eventIndex] = `${did}#delegate-${delegateCount}`;
                            signingRefs[eventIndex] = `${did}#delegate-${delegateCount}`;
                        // eslint-disable-next-line no-fallthrough
                        case 'veriKey':
                            pks[eventIndex] = {
                                id: `${did}#delegate-${delegateCount}`,
                                type: helpers_js_1.verificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020,
                                controller: did,
                                blockchainAccountId: `eip155:${chainId}:${currentEvent.delegate}`,
                            };
                            signingRefs[eventIndex] = `${did}#delegate-${delegateCount}`;
                            break;
                    }
                }
                else if (event._eventName === helpers_js_1.eventNames.DIDAttributeChanged) {
                    const currentEvent = event;
                    const name = currentEvent.name; //conversion from bytes32 is done in logParser
                    const match = name.match(/^did\/(pub|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/);
                    if (match) {
                        const section = match[1];
                        const algorithm = match[2];
                        const type = helpers_js_1.legacyAttrTypes[match[4]] || match[4];
                        const encoding = match[6];
                        switch (section) {
                            case 'pub': {
                                delegateCount++;
                                const pk = {
                                    id: `${did}#delegate-${delegateCount}`,
                                    type: `${algorithm}${type}`,
                                    controller: did,
                                };
                                pk.type = helpers_js_1.legacyAlgoMap[pk.type] || algorithm;
                                switch (encoding) {
                                    case null:
                                    case undefined:
                                    case 'hex':
                                        pk.publicKeyHex = (0, helpers_js_1.strip0x)(currentEvent.value);
                                        break;
                                    case 'base64':
                                        pk.publicKeyBase64 = (0, ethers_1.encodeBase64)(currentEvent.value);
                                        break;
                                    case 'base58':
                                        pk.publicKeyBase58 = (0, ethers_1.encodeBase58)(currentEvent.value);
                                        break;
                                    case 'pem':
                                        pk.publicKeyPem = (0, ethers_1.toUtf8String)(currentEvent.value);
                                        break;
                                    default:
                                        pk.value = (0, helpers_js_1.strip0x)(currentEvent.value);
                                }
                                pks[eventIndex] = pk;
                                if (match[4] === 'sigAuth') {
                                    auth[eventIndex] = pk.id;
                                    signingRefs[eventIndex] = pk.id;
                                }
                                else if (match[4] === 'enc') {
                                    keyAgreementRefs[eventIndex] = pk.id;
                                }
                                else {
                                    signingRefs[eventIndex] = pk.id;
                                }
                                break;
                            }
                            case 'svc': {
                                serviceCount++;
                                const encodedService = (0, ethers_1.toUtf8String)(currentEvent.value);
                                try {
                                    endpoint = JSON.parse(encodedService);
                                }
                                catch {
                                    endpoint = encodedService;
                                }
                                services[eventIndex] = {
                                    id: `${did}#service-${serviceCount}`,
                                    type: algorithm,
                                    serviceEndpoint: endpoint,
                                };
                                break;
                            }
                        }
                    }
                }
            }
            else if (event._eventName === helpers_js_1.eventNames.DIDOwnerChanged) {
                const currentEvent = event;
                controller = currentEvent.owner;
                if (currentEvent.owner === helpers_js_1.nullAddress) {
                    deactivated = true;
                    break;
                }
            }
            else {
                if (event._eventName === helpers_js_1.eventNames.DIDDelegateChanged ||
                    (event._eventName === helpers_js_1.eventNames.DIDAttributeChanged &&
                        event.name.match(/^did\/pub\//))) {
                    delegateCount++;
                }
                else if (event._eventName === helpers_js_1.eventNames.DIDAttributeChanged &&
                    event.name.match(/^did\/svc\//)) {
                    serviceCount++;
                }
                delete auth[eventIndex];
                delete signingRefs[eventIndex];
                delete pks[eventIndex];
                delete services[eventIndex];
            }
        }
        const publicKeys = [
            {
                id: `${did}#controller`,
                type: helpers_js_1.verificationMethodTypes.EcdsaSecp256k1RecoveryMethod2020,
                controller: did,
                blockchainAccountId: `eip155:${chainId}:${controller}`,
            },
        ];
        if (controllerKey && controller == address) {
            publicKeys.push({
                id: `${did}#controllerKey`,
                type: helpers_js_1.verificationMethodTypes.EcdsaSecp256k1VerificationKey2019,
                controller: did,
                publicKeyHex: (0, helpers_js_1.strip0x)(controllerKey),
            });
            authentication.push(`${did}#controllerKey`);
            assertionMethod.push(`${did}#controllerKey`);
        }
        const didDocument = {
            ...baseDIDDocument,
            verificationMethod: publicKeys.concat(Object.values(pks)),
            authentication: authentication.concat(Object.values(auth)),
            assertionMethod: assertionMethod.concat(Object.values(signingRefs)),
        };
        if (Object.values(services).length > 0) {
            didDocument.service = Object.values(services);
        }
        if (Object.values(keyAgreementRefs).length > 0) {
            didDocument.keyAgreement = Object.values(keyAgreementRefs);
        }
        return deactivated
            ? {
                didDocument: baseDIDDocument,
                deactivated,
                versionId,
                nextVersionId,
            }
            : { didDocument, deactivated, versionId, nextVersionId };
    }
    async resolve(did, parsed, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _unused, options) {
        let ldContext = {};
        if (options.accept === 'application/did+json') {
            ldContext = {};
        }
        else if (options.accept === 'application/did+ld+json' || typeof options.accept !== 'string') {
            ldContext = {
                '@context': [
                    'https://www.w3.org/ns/did/v1',
                    // defines EcdsaSecp256k1RecoveryMethod2020 & blockchainAccountId
                    'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
                    // defines publicKeyHex & EcdsaSecp256k1VerificationKey2019; v2 does not define publicKeyHex
                    'https://w3id.org/security/v3-unstable',
                ],
            };
        }
        else {
            return {
                didResolutionMetadata: {
                    error: helpers_js_1.Errors.unsupportedFormat,
                    message: `The DID resolver does not support the requested 'accept' format: ${options.accept}`,
                },
                didDocumentMetadata: {},
                didDocument: null,
            };
        }
        const fullId = parsed.id.match(helpers_js_1.identifierMatcher);
        if (!fullId) {
            return {
                didResolutionMetadata: {
                    error: helpers_js_1.Errors.invalidDid,
                    message: `Not a valid did:ethr: ${parsed.id}`,
                },
                didDocumentMetadata: {},
                didDocument: null,
            };
        }
        const id = fullId[2];
        const networkId = !fullId[1] ? 'mainnet' : fullId[1].slice(0, -1);
        let blockTag = options.blockTag || 'latest';
        if (typeof parsed.query === 'string') {
            const qParams = new URLSearchParams(parsed.query);
            blockTag = qParams.get('versionId') ?? blockTag;
            const parsedBlockTag = Number.parseInt(blockTag);
            if (!Number.isNaN(parsedBlockTag)) {
                blockTag = parsedBlockTag;
            }
            else {
                blockTag = 'latest';
            }
        }
        if (!this.contracts[networkId]) {
            return {
                didResolutionMetadata: {
                    error: helpers_js_1.Errors.unknownNetwork,
                    message: `The DID resolver does not have a configuration for network: ${networkId}`,
                },
                didDocumentMetadata: {},
                didDocument: null,
            };
        }
        let now = BigInt(Math.floor(new Date().getTime() / 1000));
        if (typeof blockTag === 'number') {
            const block = await this.getBlockMetadata(blockTag, networkId);
            now = BigInt(Date.parse(block.isoDate) / 1000);
        }
        else {
            // 'latest'
        }
        const { address, history, controllerKey, chainId } = await this.changeLog(id, networkId, 'latest');
        try {
            const { didDocument, deactivated, versionId, nextVersionId } = this.wrapDidDocument(did, address, controllerKey, history, chainId, blockTag, now);
            const status = deactivated ? { deactivated: true } : {};
            let versionMeta = {};
            let versionMetaNext = {};
            if (versionId !== 0) {
                const block = await this.getBlockMetadata(versionId, networkId);
                versionMeta = {
                    versionId: block.height,
                    updated: block.isoDate,
                };
            }
            if (nextVersionId !== Number.POSITIVE_INFINITY) {
                const block = await this.getBlockMetadata(nextVersionId, networkId);
                versionMetaNext = {
                    nextVersionId: block.height,
                    nextUpdate: block.isoDate,
                };
            }
            return {
                didDocumentMetadata: { ...status, ...versionMeta, ...versionMetaNext },
                didResolutionMetadata: { contentType: options.accept ?? 'application/did+ld+json' },
                didDocument: {
                    ...didDocument,
                    ...ldContext,
                },
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            return {
                didResolutionMetadata: {
                    error: helpers_js_1.Errors.notFound,
                    message: e.toString(), // This is not in spec, nut may be helpful
                },
                didDocumentMetadata: {},
                didDocument: null,
            };
        }
    }
    build() {
        return { ethr: this.resolve.bind(this) };
    }
}
exports.EthrDidResolver = EthrDidResolver;
//# sourceMappingURL=resolver.js.map