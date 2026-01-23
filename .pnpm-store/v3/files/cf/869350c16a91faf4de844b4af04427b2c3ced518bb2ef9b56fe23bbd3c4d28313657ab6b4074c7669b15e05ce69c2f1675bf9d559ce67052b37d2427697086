import { AddressLike, BlockTag, Contract, Overrides, Provider, Signer, TransactionReceipt } from 'ethers';
import { address, MetaSignature } from './helpers.js';
/**
 * A class that can be used to interact with the ERC1056 contract on behalf of a local controller key-pair
 */
export declare class EthrDidController {
    private contract;
    private readonly signer?;
    private readonly address;
    readonly did: string;
    private readonly legacyNonce;
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
    constructor(identifier: string | address, contract?: Contract, signer?: Signer, chainNameOrId?: string, provider?: Provider, rpcUrl?: string, registry?: string, legacyNonce?: boolean);
    /**
     * @returns the encoded attribute value in hex or utf8 bytes
     * @param attrValue - the attribute value to encode (e.g. service endpoint, public key, etc.)
     *
     * @remarks The incoming attribute value may be a hex encoded key, or an utf8 encoded string (like service endpoints)
     **/
    encodeAttributeValue(attrValue: string | `0x${string}`): Uint8Array | `0x${string}`;
    getOwner(address: address, blockTag?: BlockTag): Promise<string>;
    attachContract(controller?: AddressLike): Promise<Contract>;
    changeOwner(newOwner: address, options?: Overrides): Promise<TransactionReceipt>;
    createChangeOwnerHash(newOwner: address): Promise<string>;
    changeOwnerSigned(newOwner: address, metaSignature: MetaSignature, options?: Overrides): Promise<TransactionReceipt>;
    addDelegate(delegateType: string, delegateAddress: address, exp: number, options?: Overrides): Promise<TransactionReceipt>;
    createAddDelegateHash(delegateType: string, delegateAddress: address, exp: number): Promise<string>;
    addDelegateSigned(delegateType: string, delegateAddress: address, exp: number, metaSignature: MetaSignature, options?: Overrides): Promise<TransactionReceipt>;
    revokeDelegate(delegateType: string, delegateAddress: address, options?: Overrides): Promise<TransactionReceipt>;
    createRevokeDelegateHash(delegateType: string, delegateAddress: address): Promise<string>;
    revokeDelegateSigned(delegateType: string, delegateAddress: address, metaSignature: MetaSignature, options?: Overrides): Promise<TransactionReceipt>;
    setAttribute(attrName: string, attrValue: string, exp: number, options?: Overrides): Promise<TransactionReceipt>;
    createSetAttributeHash(attrName: string, attrValue: string, exp: number): Promise<string>;
    setAttributeSigned(attrName: string, attrValue: string, exp: number, metaSignature: MetaSignature, options?: Overrides): Promise<TransactionReceipt>;
    revokeAttribute(attrName: string, attrValue: string, options?: Overrides): Promise<TransactionReceipt>;
    createRevokeAttributeHash(attrName: string, attrValue: string): Promise<string>;
    /**
     * The legacy version of the ethr-did-registry contract tracks the nonce as a property of the original owner, and not
     * as a property of the signer (current owner). That's why we need to differentiate between deployments here, or
     * otherwise our signature will be computed wrong resulting in a failed TX.
     *
     * Not only that, but the nonce is loaded differently for [set/revoke]AttributeSigned methods.
     */
    private getPaddedNonceCompatibility;
    revokeAttributeSigned(attrName: string, attrValue: string, metaSignature: MetaSignature, options?: Overrides): Promise<TransactionReceipt>;
}
//# sourceMappingURL=controller.d.ts.map