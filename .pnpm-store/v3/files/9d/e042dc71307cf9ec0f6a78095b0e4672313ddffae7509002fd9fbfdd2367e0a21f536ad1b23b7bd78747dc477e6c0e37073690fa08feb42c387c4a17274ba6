import { I as Implementation, T as ToMetaMaskSmartAccountParameters, a as ToMetaMaskSmartAccountReturnType, C as Caveat, R as Redemption, S as SmartAccountsEnvironment } from './types-Bwksz_U6.js';
export { A as AccountSignerConfig, l as CreateExecutionArgs, D as Delegation, E as ExecutionMode, k as ExecutionStruct, H as HybridDeleGatorDeployParams, g as HybridSignerConfig, e as MetaMaskSmartAccount, d as MetaMaskSmartAccountImplementation, M as MultiSigDeleGatorDeployParams, h as MultiSigSignerConfig, c as SignDelegationParams, b as SignUserOperationParams, i as TransferWindow, W as WalletSignerConfig, f as WebAuthnSignerConfig, j as createExecution } from './types-Bwksz_U6.js';
export { B as BalanceChangeType, d as Caveats, C as CreateDelegationOptions, b as CreateOpenDelegationOptions, c as createDelegation, a as createOpenDelegation, s as signDelegation } from './delegation-CCMAKs7W.js';
export { P as PREFERRED_VERSION, g as getSmartAccountsEnvironment } from './smartAccountsEnvironment-BOhrxEnt.js';
import { Hex, Address, WalletClient, PublicClient, Transport, Chain, Account, Client } from 'viem';
export { s as signUserOperation } from './userOp-CFv4wNkl.js';
export { i as contracts } from './index-DeHcI5-n.js';
import { c as caveatEnforcerActions } from './index-Do0GpCXe.js';
export { i as actions } from './index-Do0GpCXe.js';
import { SmartAccount, BundlerClientConfig, BundlerClient } from 'viem/account-abstraction';
export { ANY_BENEFICIARY, ROOT_AUTHORITY } from '@metamask/delegation-core';
import '@metamask/delegation-abis';
import 'viem/chains';
import '@metamask/7715-permission-types';

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
    environment: SmartAccountsEnvironment;
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

export { type AggregateSignatureParams, Caveat, type CaveatEnforcerClient, type GasPriceTier, Implementation, type InfuraBundlerClient, type PartialSignature, type SignatureType, SmartAccountsEnvironment, ToMetaMaskSmartAccountReturnType, type UserOperationGasPriceResponse, aggregateSignature, createCaveat, createCaveatEnforcerClient, createInfuraBundlerClient, redeemDelegations, toMetaMaskSmartAccount };
