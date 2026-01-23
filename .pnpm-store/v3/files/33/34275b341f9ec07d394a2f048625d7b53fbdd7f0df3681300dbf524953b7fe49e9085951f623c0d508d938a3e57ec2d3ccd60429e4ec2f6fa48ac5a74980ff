export { p as CaveatBuilder, n as CaveatBuilderConfig, m as CoreCaveatBuilder, j as DELEGATION_ABI_TYPE_COMPONENTS, D as DELEGATION_ARRAY_ABI_TYPE, l as DelegationStruct, S as SIGNABLE_DELEGATION_TYPED_DATA, o as createCaveatBuilder, f as decodeDelegations, i as decodePermissionContexts, e as encodeDelegations, h as encodePermissionContexts, k as getDelegationHashOffchain, g as toDelegation, t as toDelegationStruct } from '../delegation-C7M1fy5Q.cjs';
import { m as Call, I as Implementation, S as SmartAccountsEnvironment, n as DeployParams } from '../types-Bwksz_U6.cjs';
export { k as ExecutionStruct, r as encodeBatchExecution, o as encodeExecutionCalldata, p as encodeExecutionCalldatas, q as encodeSingleExecution } from '../types-Bwksz_U6.cjs';
export { S as SIGNABLE_USER_OP_TYPED_DATA } from '../userOp-CFv4wNkl.cjs';
import { Address, Hex } from 'viem';
export { d as deploySmartAccountsEnvironment, o as overrideDeployedEnvironment } from '../smartAccountsEnvironment-SVknZ_3f.cjs';
export { DELEGATION_TYPEHASH } from '@metamask/delegation-core';
import '@metamask/delegation-abis';
import 'viem/account-abstraction';
import 'viem/chains';

declare const SIGNATURE_ABI_PARAMS: readonly [{
    readonly type: "bytes32";
}, {
    readonly type: "uint256";
}, {
    readonly type: "uint256";
}, {
    readonly type: "bytes";
}, {
    readonly type: "bool";
}, {
    readonly type: "string";
}, {
    readonly type: "string";
}, {
    readonly type: "uint256";
}];
type AuthenticatorFlags = {
    userVerified: boolean;
};

declare const encodeCalls: (calls: readonly Call[]) => `0x${string}`;
declare const encodeCallsForCaller: (caller: Address, calls: readonly Call[]) => Promise<Hex>;

declare const getCounterfactualAccountData: <TImplementation extends Implementation>({ factory, implementations, implementation, deployParams, deploySalt, }: {
    factory: Address;
    implementations: SmartAccountsEnvironment['implementations'];
    implementation: TImplementation;
    deployParams: DeployParams<TImplementation>;
    deploySalt: Hex;
}) => Promise<{
    factoryData: Hex;
    address: Address;
}>;

export { type AuthenticatorFlags, SIGNATURE_ABI_PARAMS, encodeCalls, encodeCallsForCaller, getCounterfactualAccountData };
