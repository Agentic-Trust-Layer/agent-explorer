import { JWTVerified, Signer as JWTSigner } from 'did-jwt';
import { MetaSignature } from 'ethr-did-resolver';
import { Resolvable } from 'did-resolver';
import { Signer as TxSigner, Provider, Overrides } from 'ethers';
export declare enum DelegateTypes {
    veriKey = "veriKey",
    sigAuth = "sigAuth",
    enc = "enc"
}
interface IConfig {
    identifier: string;
    chainNameOrId?: string | number | bigint;
    registry?: string;
    signer?: JWTSigner;
    alg?: 'ES256K' | 'ES256K-R';
    txSigner?: TxSigner;
    privateKey?: string;
    rpcUrl?: string;
    provider?: Provider;
    web3?: any;
}
export type KeyPair = {
    address: string;
    privateKey: string;
    publicKey: string;
    identifier: string;
};
type DelegateOptions = {
    delegateType?: DelegateTypes;
    expiresIn?: number;
};
export declare class EthrDID {
    did: string;
    address: string;
    signer?: JWTSigner;
    alg?: 'ES256K' | 'ES256K-R';
    private owner?;
    private readonly controller?;
    constructor(conf: IConfig);
    static createKeyPair(chainNameOrId?: string | number): KeyPair;
    lookupOwner(cache?: boolean): Promise<string>;
    changeOwner(newOwner: string, txOptions?: Overrides): Promise<string>;
    createChangeOwnerHash(newOwner: string): Promise<string>;
    changeOwnerSigned(newOwner: string, signature: MetaSignature, txOptions?: Overrides): Promise<string>;
    addDelegate(delegate: string, delegateOptions?: DelegateOptions, txOptions?: Overrides): Promise<string>;
    createAddDelegateHash(delegateType: string, delegateAddress: string, exp: number): Promise<string>;
    addDelegateSigned(delegate: string, signature: MetaSignature, delegateOptions?: DelegateOptions, txOptions?: Overrides): Promise<string>;
    revokeDelegate(delegate: string, delegateType?: DelegateTypes, txOptions?: Overrides): Promise<string>;
    createRevokeDelegateHash(delegateType: string, delegateAddress: string): Promise<string>;
    revokeDelegateSigned(delegate: string, delegateType: DelegateTypes | undefined, signature: MetaSignature, txOptions?: Overrides): Promise<string>;
    setAttribute(key: string, value: string | Uint8Array, expiresIn?: number, 
    /** @deprecated please use `txOptions.gasLimit` */
    gasLimit?: number, txOptions?: Overrides): Promise<string>;
    createSetAttributeHash(attrName: string, attrValue: string, exp: number): Promise<string>;
    setAttributeSigned(key: string, value: string | Uint8Array, expiresIn: number | undefined, signature: MetaSignature, txOptions?: Overrides): Promise<string>;
    revokeAttribute(key: string, value: string | Uint8Array, 
    /** @deprecated please use `txOptions.gasLimit` */
    gasLimit?: number, txOptions?: Overrides): Promise<string>;
    createRevokeAttributeHash(attrName: string, attrValue: string): Promise<string>;
    revokeAttributeSigned(key: string, value: string | Uint8Array, signature: MetaSignature, txOptions?: Overrides): Promise<string>;
    createSigningDelegate(delegateType?: DelegateTypes, expiresIn?: number): Promise<{
        kp: KeyPair;
        txHash: string;
    }>;
    signJWT(payload: any, expiresIn?: number): Promise<string>;
    verifyJWT(jwt: string, resolver: Resolvable, audience?: string): Promise<JWTVerified>;
}
export {};
//# sourceMappingURL=index.d.ts.map