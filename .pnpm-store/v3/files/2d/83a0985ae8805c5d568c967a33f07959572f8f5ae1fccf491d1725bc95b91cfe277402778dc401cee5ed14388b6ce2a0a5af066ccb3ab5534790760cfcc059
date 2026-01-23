import { Provider, Signer, TypedDataDomain, TypedDataField, Transaction, AbstractSigner } from 'ethers';
import { IRequiredContext } from './ethr-did-provider.js';
import { IKey } from '@veramo/core-types';
/**
 * Creates an `ethers` - `signer` implementation by wrapping
 * a veramo agent with a key-manager that should be capable of `eth_signTransaction`
 *
 * @internal This is exported for convenience, not meant to be supported as part of the public API
 */
export declare class KmsEthereumSigner extends AbstractSigner {
    private context;
    private controllerKey;
    readonly provider: Provider | null;
    constructor(controllerKey: IKey, context: IRequiredContext, provider?: Provider);
    getAddress(): Promise<string>;
    signTransaction(transaction: Transaction): Promise<string>;
    signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<string>;
    signMessage(message: string | Uint8Array): Promise<string>;
    connect(provider: Provider | null): Signer;
}
//# sourceMappingURL=kms-eth-signer.d.ts.map