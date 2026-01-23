import { AccountSigner, PermissionResponse, PermissionTypes, PermissionRequest } from '@metamask/7715-permission-types';
import { Address, Client, Transport, Chain, Account, RpcSchema, SendTransactionRequest, SendTransactionParameters, Hex, OneOf, PublicClient, WalletClient } from 'viem';
import { SmartAccount, SendUserOperationParameters } from 'viem/account-abstraction';
import { l as Call, h as Delegation } from '../types-DXRahfjU.js';
import '@metamask/delegation-abis';
import 'viem/chains';

type MetaMaskExtensionSchema = RpcSchema & [
    {
        Method: 'wallet_requestExecutionPermissions';
        Params: PermissionRequest<AccountSigner, PermissionTypes>[];
        ReturnType: PermissionResponse<AccountSigner, PermissionTypes>[];
    }
];
type MetaMaskExtensionClient = Client<Transport, Chain | undefined, Account | undefined, MetaMaskExtensionSchema>;
type PermissionParameter = {
    type: string;
    data: Record<string, unknown>;
};
type NativeTokenStreamPermissionParameter = PermissionParameter & {
    type: 'native-token-stream';
    data: {
        amountPerSecond: bigint;
        initialAmount?: bigint;
        maxAmount?: bigint;
        startTime?: number;
        justification?: string;
    };
};
type Erc20TokenStreamPermissionParameter = PermissionParameter & {
    type: 'erc20-token-stream';
    data: {
        tokenAddress: Address;
        amountPerSecond: bigint;
        initialAmount?: bigint;
        maxAmount?: bigint;
        startTime?: number;
        justification?: string;
    };
};
type NativeTokenPeriodicPermissionParameter = PermissionParameter & {
    type: 'native-token-periodic';
    data: {
        periodAmount: bigint;
        periodDuration: number;
        startTime?: number;
        justification?: string;
    };
};
type Erc20TokenPeriodicPermissionParameter = PermissionParameter & {
    type: 'erc20-token-periodic';
    data: {
        tokenAddress: Address;
        periodAmount: bigint;
        periodDuration: number;
        startTime?: number;
        justification?: string;
    };
};
type SupportedPermissionParams = NativeTokenStreamPermissionParameter | Erc20TokenStreamPermissionParameter | NativeTokenPeriodicPermissionParameter | Erc20TokenPeriodicPermissionParameter;
type SignerParam = Address | AccountSigner;
type PermissionRequestParameter = {
    chainId: number;
    permission: SupportedPermissionParams;
    isAdjustmentAllowed: boolean;
    signer: SignerParam;
    address?: Address;
    expiry: number;
};
type RequestExecutionPermissionsParameters = PermissionRequestParameter[];
type RequestExecutionPermissionsReturnType = PermissionResponse<AccountSigner, PermissionTypes>[];
declare function erc7715RequestExecutionPermissionsAction(client: MetaMaskExtensionClient, parameters: RequestExecutionPermissionsParameters): Promise<RequestExecutionPermissionsReturnType>;

type DelegatedCall = Call & OneOf<{
    permissionsContext: Hex;
    delegationManager: Hex;
} | object>;
type SendTransactionWithDelegationParameters<TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined, TChainOverride extends Chain | undefined = Chain | undefined, TRequest extends SendTransactionRequest<TChain, TChainOverride> = SendTransactionRequest<TChain, TChainOverride>> = SendTransactionParameters<TChain, TAccount, TChainOverride, TRequest> & {
    permissionsContext: Hex;
    delegationManager: Hex;
};
type SendUserOperationWithDelegationParameters<TAccount extends SmartAccount | undefined = SmartAccount | undefined, TAccountOverride extends SmartAccount | undefined = SmartAccount | undefined> = SendUserOperationParameters<TAccount, TAccountOverride, DelegatedCall[]> & {
    accountMetadata?: {
        factory: Hex;
        factoryData: Hex;
    }[];
    calls: DelegatedCall[];
    publicClient: PublicClient<Transport, Chain>;
};

declare enum DelegationStoreFilter {
    Given = "GIVEN",
    Received = "RECEIVED",
    All = "ALL"
}
type Environment = {
    apiUrl: string;
};
type DelegationStorageConfig = {
    apiKey: string;
    apiKeyId: string;
    environment: Environment;
    fetcher?: typeof fetch;
};
declare class DelegationStorageClient {
    #private;
    constructor(config: DelegationStorageConfig);
    getDelegationChain(leafDelegationOrDelegationHash: Hex | Delegation): Promise<Delegation[]>;
    fetchDelegations(deleGatorAddress: Hex, filterMode?: DelegationStoreFilter): Promise<Delegation[]>;
    storeDelegation(delegation: Delegation): Promise<Hex>;
}

declare const erc7715ProviderActions: () => (client: Client) => {
    requestExecutionPermissions: (parameters: RequestExecutionPermissionsParameters) => Promise<RequestExecutionPermissionsReturnType>;
};
declare const erc7710WalletActions: () => (client: WalletClient) => {
    sendTransactionWithDelegation: (args: SendTransactionWithDelegationParameters) => Promise<`0x${string}`>;
};
declare const erc7710BundlerActions: () => (client: Client) => {
    sendUserOperationWithDelegation: (args: SendUserOperationWithDelegationParameters) => Promise<`0x${string}`>;
};

export { DelegationStorageClient, type DelegationStorageConfig, DelegationStoreFilter, type Environment, type MetaMaskExtensionClient, type MetaMaskExtensionSchema, type RequestExecutionPermissionsParameters, type RequestExecutionPermissionsReturnType, erc7710BundlerActions, erc7710WalletActions, erc7715ProviderActions, erc7715RequestExecutionPermissionsAction as requestExecutionPermissions };
