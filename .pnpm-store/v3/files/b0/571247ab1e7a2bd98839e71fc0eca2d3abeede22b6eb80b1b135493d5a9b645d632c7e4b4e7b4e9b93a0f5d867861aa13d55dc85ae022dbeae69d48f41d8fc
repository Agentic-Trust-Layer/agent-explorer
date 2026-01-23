"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthrDidController = void 0;
const ethers_1 = require("ethers");
const configuration_js_1 = require("./configuration.js");
const helpers_js_1 = require("./helpers.js");
/**
 * A class that can be used to interact with the ERC1056 contract on behalf of a local controller key-pair
 */
class EthrDidController {
    /**
     * Creates an EthrDidController instance.
     *
     * @param identifier - required - a `did:ethr` string or a publicKeyHex or an ethereum address
     * @param signer - optional - a Signer that represents the current controller key (owner) of the identifier. If a
     *   'signer' is not provided, then a 'contract' with an attached signer can be used.
     * @param contract - optional - a Contract instance representing a ERC1056 contract. At least one of `contract`,
     *   `provider`, or `rpcUrl` is required
     * @param chainNameOrId - optional - the network name or chainID, defaults to 'mainnet'
     * @param provider - optional - a web3 Provider. At least one of `contract`, `provider`, or `rpcUrl` is required
     * @param rpcUrl - optional - a JSON-RPC URL that can be used to connect to an ethereum network. At least one of
     *   `contract`, `provider`, or `rpcUrl` is required
     * @param registry - optional - The ERC1056 registry address. Defaults to
     *   '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b'. Only used with 'provider' or 'rpcUrl'
     * @param legacyNonce - optional - If the legacy nonce tracking method should be accounted for. If lesser version of
     *   did-ethr-registry contract v1.0.0 is used then this should be true.
     */
    constructor(identifier, contract, signer, chainNameOrId = 'mainnet', provider, rpcUrl, registry = helpers_js_1.DEFAULT_REGISTRY_ADDRESS, legacyNonce = true) {
        this.legacyNonce = legacyNonce;
        // initialize identifier
        const { address, publicKey, network } = (0, helpers_js_1.interpretIdentifier)(identifier);
        const net = network || chainNameOrId;
        // initialize contract connection
        if (contract) {
            this.contract = contract;
        }
        else if (provider || signer?.provider || rpcUrl) {
            const prov = provider || signer?.provider;
            this.contract = (0, configuration_js_1.getContractForNetwork)({ name: net, provider: prov, registry, rpcUrl });
        }
        else {
            throw new Error(' either a contract instance or a provider or rpcUrl is required to initialize');
        }
        this.signer = signer;
        this.address = address;
        let networkString = net ? `${net}:` : '';
        if (networkString in ['mainnet:', '0x1:']) {
            networkString = '';
        }
        this.did = publicKey ? `did:ethr:${networkString}${publicKey}` : `did:ethr:${networkString}${address}`;
    }
    /**
     * @returns the encoded attribute value in hex or utf8 bytes
     * @param attrValue - the attribute value to encode (e.g. service endpoint, public key, etc.)
     *
     * @remarks The incoming attribute value may be a hex encoded key, or an utf8 encoded string (like service endpoints)
     **/
    encodeAttributeValue(attrValue) {
        return (0, ethers_1.isHexString)(attrValue) ? attrValue : (0, ethers_1.toUtf8Bytes)(attrValue);
    }
    async getOwner(address, blockTag) {
        return this.contract.identityOwner(address, { blockTag });
    }
    async attachContract(controller) {
        let currentOwner = controller ? await controller : await this.getOwner(this.address, 'latest');
        if (typeof currentOwner !== 'string')
            currentOwner = await controller.getAddress();
        let signer;
        if (this.signer) {
            signer = this.signer;
        }
        else {
            if (!this.contract)
                throw new Error(`No contract configured`);
            if (!this.contract.runner)
                throw new Error(`No runner configured for contract`);
            if (!this.contract.runner.provider)
                throw new Error(`No provider configured for runner in contract`);
            signer = (await this.contract.runner.provider.getSigner(currentOwner)) || this.contract.signer;
        }
        return this.contract.connect(signer); // Needed because ethers attach returns a BaseContract
    }
    async changeOwner(newOwner, options = {}) {
        // console.log(`changing owner for ${oldOwner} on registry at ${registryContract.address}`)
        const overrides = {
            gasLimit: 123456,
            ...options,
        };
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const ownerChange = await contract.changeOwner(this.address, newOwner, overrides);
        return await ownerChange.wait();
    }
    async createChangeOwnerHash(newOwner) {
        const paddedNonce = await this.getPaddedNonceCompatibility();
        const dataToHash = (0, ethers_1.concat)([
            helpers_js_1.MESSAGE_PREFIX,
            await this.contract.getAddress(),
            paddedNonce,
            this.address,
            (0, ethers_1.getBytes)((0, ethers_1.concat)([(0, ethers_1.toUtf8Bytes)('changeOwner'), newOwner])),
        ]);
        return (0, ethers_1.keccak256)(dataToHash);
    }
    async changeOwnerSigned(newOwner, metaSignature, options = {}) {
        const overrides = {
            gasLimit: 123456,
            ...options,
        };
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const ownerChange = await contract.changeOwnerSigned(this.address, metaSignature.sigV, metaSignature.sigR, metaSignature.sigS, newOwner, overrides);
        return await ownerChange.wait();
    }
    async addDelegate(delegateType, delegateAddress, exp, options = {}) {
        const overrides = {
            gasLimit: 123456,
            ...options,
        };
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const delegateTypeBytes = (0, helpers_js_1.stringToBytes32)(delegateType);
        const addDelegateTx = await contract.addDelegate(this.address, delegateTypeBytes, delegateAddress, exp, overrides);
        return await addDelegateTx.wait();
    }
    async createAddDelegateHash(delegateType, delegateAddress, exp) {
        const paddedNonce = await this.getPaddedNonceCompatibility();
        const dataToHash = (0, ethers_1.concat)([
            helpers_js_1.MESSAGE_PREFIX,
            await this.contract.getAddress(),
            paddedNonce,
            this.address,
            (0, ethers_1.concat)([
                (0, ethers_1.toUtf8Bytes)('addDelegate'),
                (0, ethers_1.encodeBytes32String)(delegateType),
                delegateAddress,
                (0, ethers_1.zeroPadValue)((0, ethers_1.toBeHex)(exp), 32),
            ]),
        ]);
        return (0, ethers_1.keccak256)(dataToHash);
    }
    async addDelegateSigned(delegateType, delegateAddress, exp, metaSignature, options = {}) {
        const overrides = {
            gasLimit: 123456,
            ...options,
        };
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const delegateTypeBytes = (0, helpers_js_1.stringToBytes32)(delegateType);
        const addDelegateTx = await contract.addDelegateSigned(this.address, metaSignature.sigV, metaSignature.sigR, metaSignature.sigS, delegateTypeBytes, delegateAddress, exp, overrides);
        return await addDelegateTx.wait();
    }
    async revokeDelegate(delegateType, delegateAddress, options = {}) {
        const overrides = {
            gasLimit: 123456,
            ...options,
        };
        delegateType = delegateType.startsWith('0x') ? delegateType : (0, helpers_js_1.stringToBytes32)(delegateType);
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const addDelegateTx = await contract.revokeDelegate(this.address, delegateType, delegateAddress, overrides);
        return await addDelegateTx.wait();
    }
    async createRevokeDelegateHash(delegateType, delegateAddress) {
        const paddedNonce = await this.getPaddedNonceCompatibility();
        const dataToHash = (0, ethers_1.concat)([
            helpers_js_1.MESSAGE_PREFIX,
            await this.contract.getAddress(),
            paddedNonce,
            this.address,
            (0, ethers_1.getBytes)((0, ethers_1.concat)([(0, ethers_1.toUtf8Bytes)('revokeDelegate'), (0, ethers_1.encodeBytes32String)(delegateType), delegateAddress])),
        ]);
        return (0, ethers_1.keccak256)(dataToHash);
    }
    async revokeDelegateSigned(delegateType, delegateAddress, metaSignature, options = {}) {
        const overrides = {
            gasLimit: 123456,
            ...options,
        };
        delegateType = delegateType.startsWith('0x') ? delegateType : (0, helpers_js_1.stringToBytes32)(delegateType);
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const addDelegateTx = await contract.revokeDelegateSigned(this.address, metaSignature.sigV, metaSignature.sigR, metaSignature.sigS, delegateType, delegateAddress, overrides);
        return await addDelegateTx.wait();
    }
    async setAttribute(attrName, attrValue, exp, options = {}) {
        const overrides = {
            gasLimit: 123456,
            controller: undefined,
            ...options,
        };
        attrName = attrName.startsWith('0x') ? attrName : (0, helpers_js_1.stringToBytes32)(attrName);
        attrValue = attrValue.startsWith('0x') ? attrValue : (0, ethers_1.hexlify)((0, ethers_1.toUtf8Bytes)(attrValue));
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const setAttrTx = await contract.setAttribute(this.address, attrName, attrValue, exp, overrides);
        return await setAttrTx.wait();
    }
    async createSetAttributeHash(attrName, attrValue, exp) {
        const paddedNonce = await this.getPaddedNonceCompatibility(true);
        const encodedValue = this.encodeAttributeValue(attrValue);
        const dataToHash = (0, ethers_1.concat)([
            helpers_js_1.MESSAGE_PREFIX,
            await this.contract.getAddress(),
            paddedNonce,
            this.address,
            (0, ethers_1.concat)([
                (0, ethers_1.toUtf8Bytes)('setAttribute'),
                (0, ethers_1.encodeBytes32String)(attrName),
                encodedValue,
                (0, ethers_1.zeroPadValue)((0, ethers_1.toBeHex)(exp), 32),
            ]),
        ]);
        return (0, ethers_1.keccak256)(dataToHash);
    }
    async setAttributeSigned(attrName, attrValue, exp, metaSignature, options = {}) {
        const overrides = {
            gasLimit: 123456,
            controller: undefined,
            ...options,
        };
        attrName = attrName.startsWith('0x') ? attrName : (0, helpers_js_1.stringToBytes32)(attrName);
        attrValue = attrValue.startsWith('0x') ? attrValue : (0, ethers_1.hexlify)((0, ethers_1.toUtf8Bytes)(attrValue));
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const setAttrTx = await contract.setAttributeSigned(this.address, metaSignature.sigV, metaSignature.sigR, metaSignature.sigS, attrName, attrValue, exp, overrides);
        return await setAttrTx.wait();
    }
    async revokeAttribute(attrName, attrValue, options = {}) {
        // console.log(`revoking attribute ${attrName}(${attrValue}) for ${identity}`)
        const overrides = {
            gasLimit: 123456,
            ...options,
        };
        attrName = attrName.startsWith('0x') ? attrName : (0, helpers_js_1.stringToBytes32)(attrName);
        attrValue = attrValue.startsWith('0x') ? attrValue : (0, ethers_1.hexlify)((0, ethers_1.toUtf8Bytes)(attrValue));
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const revokeAttributeTX = await contract.revokeAttribute(this.address, attrName, attrValue, overrides);
        return await revokeAttributeTX.wait();
    }
    async createRevokeAttributeHash(attrName, attrValue) {
        const paddedNonce = await this.getPaddedNonceCompatibility(true);
        const encodedValue = this.encodeAttributeValue(attrValue);
        const dataToHash = (0, ethers_1.concat)([
            helpers_js_1.MESSAGE_PREFIX,
            await this.contract.getAddress(),
            paddedNonce,
            this.address,
            (0, ethers_1.getBytes)((0, ethers_1.concat)([(0, ethers_1.toUtf8Bytes)('revokeAttribute'), (0, ethers_1.encodeBytes32String)(attrName), encodedValue])),
        ]);
        return (0, ethers_1.keccak256)(dataToHash);
    }
    /**
     * The legacy version of the ethr-did-registry contract tracks the nonce as a property of the original owner, and not
     * as a property of the signer (current owner). That's why we need to differentiate between deployments here, or
     * otherwise our signature will be computed wrong resulting in a failed TX.
     *
     * Not only that, but the nonce is loaded differently for [set/revoke]AttributeSigned methods.
     */
    async getPaddedNonceCompatibility(attribute = false) {
        let nonceKey;
        if (this.legacyNonce && attribute) {
            nonceKey = this.address;
        }
        else {
            nonceKey = await this.getOwner(this.address);
        }
        return (0, ethers_1.zeroPadValue)((0, ethers_1.toBeHex)(await this.contract.nonce(nonceKey)), 32);
    }
    async revokeAttributeSigned(attrName, attrValue, metaSignature, options = {}) {
        // console.log(`revoking attribute ${attrName}(${attrValue}) for ${identity}`)
        const overrides = {
            gasLimit: 123456,
            ...options,
        };
        attrName = attrName.startsWith('0x') ? attrName : (0, helpers_js_1.stringToBytes32)(attrName);
        attrValue = attrValue.startsWith('0x') ? attrValue : (0, ethers_1.hexlify)((0, ethers_1.toUtf8Bytes)(attrValue));
        const contract = await this.attachContract(overrides.from ?? undefined);
        delete overrides.from;
        const revokeAttributeTX = await contract.revokeAttributeSigned(this.address, metaSignature.sigV, metaSignature.sigR, metaSignature.sigS, attrName, attrValue, overrides);
        return await revokeAttributeTX.wait();
    }
}
exports.EthrDidController = EthrDidController;
//# sourceMappingURL=controller.js.map