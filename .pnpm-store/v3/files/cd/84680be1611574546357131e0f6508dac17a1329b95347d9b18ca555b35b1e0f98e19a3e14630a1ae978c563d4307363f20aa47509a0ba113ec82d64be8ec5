import { getAddress, computeAddress, AbstractSigner, } from 'ethers';
/**
 * Creates an `ethers` - `signer` implementation by wrapping
 * a veramo agent with a key-manager that should be capable of `eth_signTransaction`
 *
 * @internal This is exported for convenience, not meant to be supported as part of the public API
 */
export class KmsEthereumSigner extends AbstractSigner {
    context;
    controllerKey;
    provider;
    constructor(controllerKey, context, provider) {
        super(provider);
        this.controllerKey = controllerKey;
        this.context = context;
        this.provider = provider || null;
    }
    async getAddress() {
        // publicKeyHex is not available when using web3provider
        if (this.controllerKey.meta?.account) {
            return this.controllerKey.meta?.account;
        }
        return computeAddress('0x' + this.controllerKey.publicKeyHex);
    }
    async signTransaction(transaction) {
        if (transaction.from != null) {
            const thisAddress = await this.getAddress();
            if (getAddress(transaction.from) !== thisAddress) {
                throw new Error(`transaction from address mismatch ${transaction.from} != ${thisAddress}`);
            }
        }
        const signature = await this.context.agent.keyManagerSign({
            keyRef: this.controllerKey.kid,
            data: transaction.unsignedSerialized,
            algorithm: 'eth_signTransaction',
            encoding: 'base16',
        });
        return signature;
    }
    async signTypedData(domain, types, value) {
        const data = JSON.stringify({
            domain: domain,
            types: types,
            message: value,
        });
        return this.context.agent.keyManagerSign({
            keyRef: this.controllerKey.kid,
            algorithm: 'eth_signTypedData',
            data: data,
        });
    }
    signMessage(message) {
        throw new Error('not_implemented: signMessage() Method not implemented by KmsEthereumSigner.');
    }
    connect(provider) {
        if (!provider) {
            throw new Error('provider must not be null');
        }
        return new KmsEthereumSigner(this.controllerKey, this.context, provider);
    }
}
function isAddressable(address) {
    return address.getAddress !== undefined;
}
//# sourceMappingURL=kms-eth-signer.js.map