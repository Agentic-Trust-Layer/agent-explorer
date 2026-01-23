import { I as Implementation, T as ToMetaMaskSmartAccountParameters, a as ToMetaMaskSmartAccountReturnType, C as Caveat, R as Redemption, D as DeleGatorEnvironment } from './types-DXRahfjU.cjs';
export { A as AccountSignerConfig, k as CreateExecutionArgs, h as Delegation, E as ExecutionMode, j as ExecutionStruct, H as HybridDeleGatorDeployParams, f as HybridSignerConfig, d as MetaMaskSmartAccount, c as MetaMaskSmartAccountImplementation, M as MultiSigDeleGatorDeployParams, g as MultiSigSignerConfig, b as SignDelegationParams, S as SignUserOperationParams, W as WalletSignerConfig, e as WebAuthnSignerConfig, i as createExecution } from './types-DXRahfjU.cjs';
export { B as BalanceChangeType, d as Caveats, C as CreateDelegationOptions, b as CreateOpenDelegationOptions, c as createDelegation, a as createOpenDelegation, s as signDelegation } from './delegation-NENcKigs.cjs';
export { P as PREFERRED_VERSION, g as getDeleGatorEnvironment } from './delegatorEnvironment-CHfNTQvZ.cjs';
import { Hex, Address, WalletClient, PublicClient, Transport, Chain, Account, Client } from 'viem';
export { s as signUserOperation } from './userOp-CFv4wNkl.cjs';
export { i as contracts } from './index-e1SIEOTE.cjs';
import { c as caveatEnforcerActions } from './index-B36dUGeJ.cjs';
export { i as actions } from './index-B36dUGeJ.cjs';
import { SmartAccount, BundlerClientConfig, BundlerClient } from 'viem/account-abstraction';
export { ANY_BENEFICIARY, ROOT_AUTHORITY } from '@metamask/delegation-core';
import '@metamask/delegation-abis';
import 'viem/chains';

declare function toMetaMaskSmartAccount<TImplementation extends Implementation>(params: ToMetaMaskSmartAccountParameters<TImplementation>): Promise<ToMetaMaskSmartAccountReturnType<TImplementation>>;

declare const createCaveat: (enforcer: Hex, terms: Hex, args?: Hex) => Caveat;

declare const signatureTypes: readonly ["ECDSA"];
type SignatureType = (typeof signatureTypes)[number];
type PartialSignature = {
    signer: Address;
    signature: Hex;
    type: SignatureType;
};
declare const aggregateSignature: ({ signatures, }: {
    signatures: PartialSignature[];
}) => Hex;
type AggregateSignatureParams = {
    signatures: PartialSignature[];
};

declare const redeemDelegations: (walletClient: WalletClient, publicClient: PublicClient, delegationManagerAddress: Address, redemptions: Redemption[]) => Promise<`0x${string}`>;

type CaveatEnforcerClient<TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined> = Client<TTransport, TChain, TAccount> & ReturnType<ReturnType<typeof caveatEnforcerActions>>;
declare function createCaveatEnforcerClient<TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined>({ client, environment, }: {
    client: Client<TTransport, TChain, TAccount>;
    environment: DeleGatorEnvironment;
}): CaveatEnforcerClient<TTransport, TChain, TAccount>;

type GasPriceTier = {
    maxFeePerGas: Hex;
    maxPriorityFeePerGas: Hex;
};
type UserOperationGasPriceResponse = {
    slow: GasPriceTier;
    standard: GasPriceTier;
    fast: GasPriceTier;
};
type InfuraBundlerClient<TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends SmartAccount | undefined = SmartAccount | undefined> = BundlerClient<TTransport, TChain, TAccount> & {
    getUserOperationGasPrice(): Promise<UserOperationGasPriceResponse>;
};
declare function createInfuraBundlerClient<TTransport extends Transport, TChain extends Chain | undefined = undefined, TAccount extends SmartAccount | undefined = undefined>(config: BundlerClientConfig<TTransport, TChain, TAccount>): InfuraBundlerClient<TTransport, TChain, TAccount>;

export { type AggregateSignatureParams, Caveat, type CaveatEnforcerClient, DeleGatorEnvironment, type GasPriceTier, Implementation, type InfuraBundlerClient, type PartialSignature, type SignatureType, ToMetaMaskSmartAccountReturnType, type UserOperationGasPriceResponse, aggregateSignature, createCaveat, createCaveatEnforcerClient, createInfuraBundlerClient, redeemDelegations, toMetaMaskSmartAccount };
