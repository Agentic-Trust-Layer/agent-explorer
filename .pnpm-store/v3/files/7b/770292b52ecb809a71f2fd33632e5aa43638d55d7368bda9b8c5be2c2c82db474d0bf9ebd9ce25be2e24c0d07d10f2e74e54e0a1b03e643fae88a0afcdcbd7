import { AccountSigner, PermissionResponse, PermissionTypes, PermissionRequest } from '@metamask/7715-permission-types';
import * as viem from 'viem';
import { Address, Client, Transport, Chain, Account, RpcSchema, SendTransactionRequest, SendTransactionParameters, Hex, OneOf, PublicClient, WalletClient } from 'viem';
import { SmartAccount, SendUserOperationParameters } from 'viem/account-abstraction';
import { m as Call, S as SmartAccountsEnvironment, D as Delegation } from './types-Bwksz_U6.js';
import { U as UserOperationV07 } from './userOp-CFv4wNkl.js';

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
type Erc20TokenRevocationPermissionParameter = PermissionParameter & {
    type: 'erc20-token-revocation';
    data: {
        justification?: string;
    };
};
type SupportedPermissionParams = NativeTokenStreamPermissionParameter | Erc20TokenStreamPermissionParameter | NativeTokenPeriodicPermissionParameter | Erc20TokenPeriodicPermissionParameter | Erc20TokenRevocationPermissionParameter;
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

type CaveatEnforcerParams = {
    delegation: Delegation;
};
type PeriodTransferResult = {
    availableAmount: bigint;
    isNewPeriod: boolean;
    currentPeriod: bigint;
};
type StreamingResult = {
    availableAmount: bigint;
};
declare function getErc20PeriodTransferEnforcerAvailableAmount(client: Client, environment: SmartAccountsEnvironment, params: CaveatEnforcerParams): Promise<PeriodTransferResult>;
declare function getErc20StreamingEnforcerAvailableAmount(client: Client, environment: SmartAccountsEnvironment, params: CaveatEnforcerParams): Promise<StreamingResult>;
declare function getMultiTokenPeriodEnforcerAvailableAmount(client: Client, environment: SmartAccountsEnvironment, params: CaveatEnforcerParams): Promise<PeriodTransferResult>;
declare function getNativeTokenPeriodTransferEnforcerAvailableAmount(client: Client, environment: SmartAccountsEnvironment, params: CaveatEnforcerParams): Promise<PeriodTransferResult>;
declare function getNativeTokenStreamingEnforcerAvailableAmount(client: Client, environment: SmartAccountsEnvironment, params: CaveatEnforcerParams): Promise<StreamingResult>;
declare const caveatEnforcerActions: ({ environment }: {
    environment: SmartAccountsEnvironment;
}) => (client: Client) => {
    getErc20PeriodTransferEnforcerAvailableAmount: (params: CaveatEnforcerParams) => Promise<PeriodTransferResult>;
    getErc20StreamingEnforcerAvailableAmount: (params: CaveatEnforcerParams) => Promise<StreamingResult>;
    getMultiTokenPeriodEnforcerAvailableAmount: (params: CaveatEnforcerParams) => Promise<PeriodTransferResult>;
    getNativeTokenPeriodTransferEnforcerAvailableAmount: (params: CaveatEnforcerParams) => Promise<PeriodTransferResult>;
    getNativeTokenStreamingEnforcerAvailableAmount: (params: CaveatEnforcerParams) => Promise<StreamingResult>;
};

type IsValid7702ImplementationParameters = {
    client: Client;
    accountAddress: Address;
    environment: SmartAccountsEnvironment;
};
declare function isValid7702Implementation({ client, accountAddress, environment, }: IsValid7702ImplementationParameters): Promise<boolean>;

type SignDelegationParameters = {
    account?: Account | Address;
    delegation: Omit<Delegation, 'signature'>;
    delegationManager: Address;
    chainId: number;
    name?: string;
    version?: string;
    allowInsecureUnrestrictedDelegation?: boolean;
};
type SignDelegationReturnType = Hex;
declare function signDelegation<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: Client<Transport, TChain, TAccount> & {
    signTypedData: WalletClient['signTypedData'];
}, parameters: SignDelegationParameters): Promise<SignDelegationReturnType>;
declare function signDelegationActions(): <TChain extends Chain | undefined, TAccount extends Account | undefined>(client: {
    account: TAccount;
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime: number;
    ccipRead?: false | {
        request?: ((parameters: viem.CcipRequestParameters) => Promise<`0x${string}`>) | undefined;
    } | undefined;
    chain: TChain;
    key: string;
    name: string;
    pollingInterval: number;
    request: viem.EIP1193RequestFn<[{
        Method: "web3_clientVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "web3_sha3";
        Parameters: [data: `0x${string}`];
        ReturnType: string;
    }, {
        Method: "net_listening";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "net_peerCount";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "net_version";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blobBaseFee";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blockNumber";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_call";
        Parameters: readonly [transaction: viem.ExactPartial<viem.RpcTransactionRequest>] | readonly [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier] | readonly [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier, stateOverrideSet: viem.RpcStateOverride] | readonly [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier, stateOverrideSet: viem.RpcStateOverride, blockOverrides: viem.RpcBlockOverrides];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_createAccessList";
        Parameters: [transaction: viem.ExactPartial<viem.RpcTransactionRequest>] | [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: {
            accessList: viem.AccessList;
            gasUsed: `0x${string}`;
        };
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_coinbase";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: viem.RpcTransactionRequest] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag, stateOverride: viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_feeHistory";
        Parameters: [blockCount: `0x${string}`, newestBlock: `0x${string}` | viem.BlockTag, rewardPercentiles: number[] | undefined];
        ReturnType: viem.RpcFeeHistory;
    }, {
        Method: "eth_gasPrice";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBalance";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockByHash";
        Parameters: [hash: `0x${string}`, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockTransactionCountByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockTransactionCountByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getCode";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getFilterChanges";
        Parameters: [filterId: `0x${string}`];
        ReturnType: `0x${string}`[] | viem.RpcLog[];
    }, {
        Method: "eth_getFilterLogs";
        Parameters: [filterId: `0x${string}`];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getLogs";
        Parameters: [{
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        } & ({
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            blockHash?: undefined;
        } | {
            fromBlock?: undefined;
            toBlock?: undefined;
            blockHash?: `0x${string}` | undefined;
        })];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getProof";
        Parameters: [address: `0x${string}`, storageKeys: `0x${string}`[], block: `0x${string}` | viem.BlockTag];
        ReturnType: viem.RpcProof;
    }, {
        Method: "eth_getStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionCount";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransactionReceipt | null;
    }, {
        Method: "eth_getUncleByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleCountByBlockHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getUncleCountByBlockNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_maxPriorityFeePerGas";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newBlockFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newFilter";
        Parameters: [filter: {
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        }];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newPendingTransactionFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_protocolVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_simulateV1";
        Parameters: [{
            blockStateCalls: readonly {
                blockOverrides?: viem.RpcBlockOverrides | undefined;
                calls?: readonly viem.ExactPartial<viem.RpcTransactionRequest>[] | undefined;
                stateOverrides?: viem.RpcStateOverride | undefined;
            }[];
            returnFullTransactions?: boolean | undefined;
            traceTransfers?: boolean | undefined;
            validation?: boolean | undefined;
        }, `0x${string}` | viem.BlockTag];
        ReturnType: readonly (viem.RpcBlock & {
            calls: readonly {
                error?: {
                    data?: `0x${string}` | undefined;
                    code: number;
                    message: string;
                } | undefined;
                logs?: readonly viem.RpcLog[] | undefined;
                gasUsed: `0x${string}`;
                returnData: `0x${string}`;
                status: `0x${string}`;
            }[];
        })[];
    }, {
        Method: "eth_uninstallFilter";
        Parameters: [filterId: `0x${string}`];
        ReturnType: boolean;
    }, {
        Method: "eth_accounts";
        Parameters?: undefined;
        ReturnType: `0x${string}`[];
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: viem.RpcTransactionRequest] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag, stateOverride: viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_requestAccounts";
        Parameters?: undefined;
        ReturnType: `0x${string}`[];
    }, {
        Method: "eth_sendTransaction";
        Parameters: [transaction: viem.RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_sign";
        Parameters: [address: `0x${string}`, data: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_signTransaction";
        Parameters: [request: viem.RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_signTypedData_v4";
        Parameters: [address: `0x${string}`, message: string];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_syncing";
        Parameters?: undefined;
        ReturnType: false | viem.NetworkSync;
    }, {
        Method: "personal_sign";
        Parameters: [data: `0x${string}`, address: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "wallet_addEthereumChain";
        Parameters: [chain: viem.AddEthereumChainParameter];
        ReturnType: null;
    }, {
        Method: "wallet_addSubAccount";
        Parameters: [{
            account: viem.OneOf<{
                keys: readonly {
                    publicKey: `0x${string}`;
                    type: "address" | "p256" | "webcrypto-p256" | "webauthn-p256";
                }[];
                type: "create";
            } | {
                address: `0x${string}`;
                chainId?: number | undefined;
                type: "deployed";
            } | {
                address: `0x${string}`;
                chainId?: number | undefined;
                factory: `0x${string}`;
                factoryData: `0x${string}`;
                type: "undeployed";
            }>;
            version: string;
        }];
        ReturnType: {
            address: `0x${string}`;
            factory?: `0x${string}` | undefined;
            factoryData?: `0x${string}` | undefined;
        };
    }, {
        Method: "wallet_connect";
        Parameters: [{
            capabilities?: {
                [key: string]: any;
            } | undefined;
            version: string;
        }];
        ReturnType: {
            accounts: readonly {
                address: `0x${string}`;
                capabilities?: {
                    [key: string]: any;
                } | undefined;
            }[];
        };
    }, {
        Method: "wallet_disconnect";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "wallet_getCallsStatus";
        Parameters?: [string] | undefined;
        ReturnType: viem.WalletGetCallsStatusReturnType<{
            [key: string]: any;
        }, `0x${string}`, `0x${string}`, `0x${string}`>;
    }, {
        Method: "wallet_getCapabilities";
        Parameters?: readonly [] | readonly [`0x${string}` | undefined] | readonly [`0x${string}` | undefined, readonly `0x${string}`[] | undefined] | undefined;
        ReturnType: {
            [x: `0x${string}`]: {
                [key: string]: any;
            };
        };
    }, {
        Method: "wallet_getPermissions";
        Parameters?: undefined;
        ReturnType: viem.WalletPermission[];
    }, {
        Method: "wallet_grantPermissions";
        Parameters?: [viem.WalletGrantPermissionsParameters] | undefined;
        ReturnType: {
            expiry: number;
            factory?: `0x${string}` | undefined;
            factoryData?: string | undefined;
            grantedPermissions: readonly {
                data: unknown;
                policies: readonly {
                    data: unknown;
                    type: string;
                }[];
                required?: boolean | undefined;
                type: string;
            }[];
            permissionsContext: string;
            signerData?: {
                userOpBuilder?: `0x${string}` | undefined;
                submitToAddress?: `0x${string}` | undefined;
            } | undefined;
        };
    }, {
        Method: "wallet_requestPermissions";
        Parameters: [permissions: {
            eth_accounts: Record<string, any>;
        }];
        ReturnType: viem.WalletPermission[];
    }, {
        Method: "wallet_revokePermissions";
        Parameters: [permissions: {
            eth_accounts: Record<string, any>;
        }];
        ReturnType: null;
    }, {
        Method: "wallet_sendCalls";
        Parameters?: viem.WalletSendCallsParameters<{
            [key: string]: any;
        }, `0x${string}`, `0x${string}`> | undefined;
        ReturnType: viem.WalletSendCallsReturnType<{
            [key: string]: any;
        }>;
    }, {
        Method: "wallet_sendTransaction";
        Parameters: [transaction: viem.RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "wallet_showCallsStatus";
        Parameters?: [string] | undefined;
        ReturnType: void;
    }, {
        Method: "wallet_switchEthereumChain";
        Parameters: [chain: {
            chainId: string;
        }];
        ReturnType: null;
    }, {
        Method: "wallet_watchAsset";
        Parameters: viem.WatchAssetParams;
        ReturnType: boolean;
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateUserOperationGas";
        Parameters: [userOperation: viem.RpcUserOperation, entrypoint: `0x${string}`] | [userOperation: viem.RpcUserOperation, entrypoint: `0x${string}`, stateOverrideSet: viem.RpcStateOverride];
        ReturnType: viem.RpcEstimateUserOperationGasReturnType;
    }, {
        Method: "eth_getUserOperationByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcGetUserOperationByHashReturnType | null;
    }, {
        Method: "eth_getUserOperationReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcUserOperationReceipt | null;
    }, {
        Method: "eth_sendUserOperation";
        Parameters: [userOperation: viem.RpcUserOperation, entrypoint: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_supportedEntryPoints";
        Parameters?: undefined;
        ReturnType: readonly `0x${string}`[];
    }, {
        Method: "pm_getPaymasterStubData";
        Parameters?: [userOperation: viem.OneOf<viem.PartialBy<Pick<viem.RpcUserOperation<"0.6">, "callData" | "nonce" | "maxFeePerGas" | "maxPriorityFeePerGas" | "callGasLimit" | "preVerificationGas" | "sender" | "verificationGasLimit" | "initCode">, "maxFeePerGas" | "maxPriorityFeePerGas" | "callGasLimit" | "preVerificationGas" | "verificationGasLimit" | "initCode"> | viem.PartialBy<Pick<viem.RpcUserOperation<"0.7">, "callData" | "nonce" | "maxFeePerGas" | "maxPriorityFeePerGas" | "factory" | "factoryData" | "callGasLimit" | "preVerificationGas" | "sender" | "verificationGasLimit">, "maxFeePerGas" | "maxPriorityFeePerGas" | "factory" | "factoryData" | "callGasLimit" | "preVerificationGas" | "verificationGasLimit">>, entrypoint: `0x${string}`, chainId: `0x${string}`, context: unknown] | undefined;
        ReturnType: viem.OneOf<{
            paymasterAndData: `0x${string}`;
        } | {
            paymaster: `0x${string}`;
            paymasterData: `0x${string}`;
            paymasterVerificationGasLimit: `0x${string}`;
            paymasterPostOpGasLimit: `0x${string}`;
        }> & {
            sponsor?: {
                name: string;
                icon?: string | undefined;
            } | undefined;
            isFinal?: boolean | undefined;
        };
    }, {
        Method: "pm_getPaymasterData";
        Parameters?: [userOperation: Pick<viem.RpcUserOperation<"0.6">, "callData" | "nonce" | "maxFeePerGas" | "maxPriorityFeePerGas" | "callGasLimit" | "preVerificationGas" | "sender" | "verificationGasLimit" | "initCode"> | Pick<viem.RpcUserOperation<"0.7">, "callData" | "nonce" | "maxFeePerGas" | "maxPriorityFeePerGas" | "factory" | "factoryData" | "callGasLimit" | "preVerificationGas" | "sender" | "verificationGasLimit">, entrypoint: `0x${string}`, chainId: `0x${string}`, context: unknown] | undefined;
        ReturnType: viem.OneOf<{
            paymasterAndData: `0x${string}`;
        } | {
            paymaster: `0x${string}`;
            paymasterData: `0x${string}`;
            paymasterVerificationGasLimit: `0x${string}`;
            paymasterPostOpGasLimit: `0x${string}`;
        }>;
    }]>;
    transport: viem.TransportConfig<string, viem.EIP1193RequestFn> & Record<string, any>;
    type: string;
    uid: string;
} & {
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & viem.ExactPartial<Pick<viem.PublicActions<Transport, TChain, TAccount>, "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<viem.WalletActions<TChain, TAccount>, "sendTransaction" | "writeContract">>>(fn: (client: Client<Transport, TChain, TAccount, undefined, {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } | undefined>) => client) => Client<Transport, TChain, TAccount, undefined, { [K in keyof client]: client[K]; }>;
} & {
    signTypedData: WalletClient['signTypedData'];
}) => {
    signDelegation: (parameters: Omit<SignDelegationParameters, 'chainId'> & {
        chainId?: number;
    }) => Promise<`0x${string}`>;
};

type SignUserOperationParameters = {
    account?: Account | Address;
    userOperation: Omit<UserOperationV07, 'signature'>;
    entryPoint: {
        address: Address;
    };
    chainId: number;
    address: Address;
    name: 'HybridDeleGator' | 'MultiSigDeleGator';
    version?: string;
};
type SignUserOperationReturnType = Hex;
declare function signUserOperation<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: Client<Transport, TChain, TAccount> & {
    signTypedData: WalletClient['signTypedData'];
}, parameters: SignUserOperationParameters): Promise<SignUserOperationReturnType>;
declare function signUserOperationActions(): <TChain extends Chain | undefined, TAccount extends Account | undefined>(client: {
    account: TAccount;
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime: number;
    ccipRead?: false | {
        request?: ((parameters: viem.CcipRequestParameters) => Promise<`0x${string}`>) | undefined;
    } | undefined;
    chain: TChain;
    key: string;
    name: string;
    pollingInterval: number;
    request: viem.EIP1193RequestFn<[{
        Method: "web3_clientVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "web3_sha3";
        Parameters: [data: `0x${string}`];
        ReturnType: string;
    }, {
        Method: "net_listening";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "net_peerCount";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "net_version";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blobBaseFee";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blockNumber";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_call";
        Parameters: readonly [transaction: viem.ExactPartial<viem.RpcTransactionRequest>] | readonly [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier] | readonly [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier, stateOverrideSet: viem.RpcStateOverride] | readonly [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier, stateOverrideSet: viem.RpcStateOverride, blockOverrides: viem.RpcBlockOverrides];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_createAccessList";
        Parameters: [transaction: viem.ExactPartial<viem.RpcTransactionRequest>] | [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: {
            accessList: viem.AccessList;
            gasUsed: `0x${string}`;
        };
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_coinbase";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: viem.RpcTransactionRequest] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag, stateOverride: viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_feeHistory";
        Parameters: [blockCount: `0x${string}`, newestBlock: `0x${string}` | viem.BlockTag, rewardPercentiles: number[] | undefined];
        ReturnType: viem.RpcFeeHistory;
    }, {
        Method: "eth_gasPrice";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBalance";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockByHash";
        Parameters: [hash: `0x${string}`, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockTransactionCountByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockTransactionCountByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getCode";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getFilterChanges";
        Parameters: [filterId: `0x${string}`];
        ReturnType: `0x${string}`[] | viem.RpcLog[];
    }, {
        Method: "eth_getFilterLogs";
        Parameters: [filterId: `0x${string}`];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getLogs";
        Parameters: [{
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        } & ({
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            blockHash?: undefined;
        } | {
            fromBlock?: undefined;
            toBlock?: undefined;
            blockHash?: `0x${string}` | undefined;
        })];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getProof";
        Parameters: [address: `0x${string}`, storageKeys: `0x${string}`[], block: `0x${string}` | viem.BlockTag];
        ReturnType: viem.RpcProof;
    }, {
        Method: "eth_getStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionCount";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransactionReceipt | null;
    }, {
        Method: "eth_getUncleByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleCountByBlockHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getUncleCountByBlockNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_maxPriorityFeePerGas";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newBlockFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newFilter";
        Parameters: [filter: {
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        }];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newPendingTransactionFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_protocolVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_simulateV1";
        Parameters: [{
            blockStateCalls: readonly {
                blockOverrides?: viem.RpcBlockOverrides | undefined;
                calls?: readonly viem.ExactPartial<viem.RpcTransactionRequest>[] | undefined;
                stateOverrides?: viem.RpcStateOverride | undefined;
            }[];
            returnFullTransactions?: boolean | undefined;
            traceTransfers?: boolean | undefined;
            validation?: boolean | undefined;
        }, `0x${string}` | viem.BlockTag];
        ReturnType: readonly (viem.RpcBlock & {
            calls: readonly {
                error?: {
                    data?: `0x${string}` | undefined;
                    code: number;
                    message: string;
                } | undefined;
                logs?: readonly viem.RpcLog[] | undefined;
                gasUsed: `0x${string}`;
                returnData: `0x${string}`;
                status: `0x${string}`;
            }[];
        })[];
    }, {
        Method: "eth_uninstallFilter";
        Parameters: [filterId: `0x${string}`];
        ReturnType: boolean;
    }, {
        Method: "eth_accounts";
        Parameters?: undefined;
        ReturnType: `0x${string}`[];
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: viem.RpcTransactionRequest] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag, stateOverride: viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_requestAccounts";
        Parameters?: undefined;
        ReturnType: `0x${string}`[];
    }, {
        Method: "eth_sendTransaction";
        Parameters: [transaction: viem.RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_sign";
        Parameters: [address: `0x${string}`, data: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_signTransaction";
        Parameters: [request: viem.RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_signTypedData_v4";
        Parameters: [address: `0x${string}`, message: string];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_syncing";
        Parameters?: undefined;
        ReturnType: false | viem.NetworkSync;
    }, {
        Method: "personal_sign";
        Parameters: [data: `0x${string}`, address: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "wallet_addEthereumChain";
        Parameters: [chain: viem.AddEthereumChainParameter];
        ReturnType: null;
    }, {
        Method: "wallet_addSubAccount";
        Parameters: [{
            account: viem.OneOf<{
                keys: readonly {
                    publicKey: `0x${string}`;
                    type: "address" | "p256" | "webcrypto-p256" | "webauthn-p256";
                }[];
                type: "create";
            } | {
                address: `0x${string}`;
                chainId?: number | undefined;
                type: "deployed";
            } | {
                address: `0x${string}`;
                chainId?: number | undefined;
                factory: `0x${string}`;
                factoryData: `0x${string}`;
                type: "undeployed";
            }>;
            version: string;
        }];
        ReturnType: {
            address: `0x${string}`;
            factory?: `0x${string}` | undefined;
            factoryData?: `0x${string}` | undefined;
        };
    }, {
        Method: "wallet_connect";
        Parameters: [{
            capabilities?: {
                [key: string]: any;
            } | undefined;
            version: string;
        }];
        ReturnType: {
            accounts: readonly {
                address: `0x${string}`;
                capabilities?: {
                    [key: string]: any;
                } | undefined;
            }[];
        };
    }, {
        Method: "wallet_disconnect";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "wallet_getCallsStatus";
        Parameters?: [string] | undefined;
        ReturnType: viem.WalletGetCallsStatusReturnType<{
            [key: string]: any;
        }, `0x${string}`, `0x${string}`, `0x${string}`>;
    }, {
        Method: "wallet_getCapabilities";
        Parameters?: readonly [] | readonly [`0x${string}` | undefined] | readonly [`0x${string}` | undefined, readonly `0x${string}`[] | undefined] | undefined;
        ReturnType: {
            [x: `0x${string}`]: {
                [key: string]: any;
            };
        };
    }, {
        Method: "wallet_getPermissions";
        Parameters?: undefined;
        ReturnType: viem.WalletPermission[];
    }, {
        Method: "wallet_grantPermissions";
        Parameters?: [viem.WalletGrantPermissionsParameters] | undefined;
        ReturnType: {
            expiry: number;
            factory?: `0x${string}` | undefined;
            factoryData?: string | undefined;
            grantedPermissions: readonly {
                data: unknown;
                policies: readonly {
                    data: unknown;
                    type: string;
                }[];
                required?: boolean | undefined;
                type: string;
            }[];
            permissionsContext: string;
            signerData?: {
                userOpBuilder?: `0x${string}` | undefined;
                submitToAddress?: `0x${string}` | undefined;
            } | undefined;
        };
    }, {
        Method: "wallet_requestPermissions";
        Parameters: [permissions: {
            eth_accounts: Record<string, any>;
        }];
        ReturnType: viem.WalletPermission[];
    }, {
        Method: "wallet_revokePermissions";
        Parameters: [permissions: {
            eth_accounts: Record<string, any>;
        }];
        ReturnType: null;
    }, {
        Method: "wallet_sendCalls";
        Parameters?: viem.WalletSendCallsParameters<{
            [key: string]: any;
        }, `0x${string}`, `0x${string}`> | undefined;
        ReturnType: viem.WalletSendCallsReturnType<{
            [key: string]: any;
        }>;
    }, {
        Method: "wallet_sendTransaction";
        Parameters: [transaction: viem.RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "wallet_showCallsStatus";
        Parameters?: [string] | undefined;
        ReturnType: void;
    }, {
        Method: "wallet_switchEthereumChain";
        Parameters: [chain: {
            chainId: string;
        }];
        ReturnType: null;
    }, {
        Method: "wallet_watchAsset";
        Parameters: viem.WatchAssetParams;
        ReturnType: boolean;
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateUserOperationGas";
        Parameters: [userOperation: viem.RpcUserOperation, entrypoint: `0x${string}`] | [userOperation: viem.RpcUserOperation, entrypoint: `0x${string}`, stateOverrideSet: viem.RpcStateOverride];
        ReturnType: viem.RpcEstimateUserOperationGasReturnType;
    }, {
        Method: "eth_getUserOperationByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcGetUserOperationByHashReturnType | null;
    }, {
        Method: "eth_getUserOperationReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcUserOperationReceipt | null;
    }, {
        Method: "eth_sendUserOperation";
        Parameters: [userOperation: viem.RpcUserOperation, entrypoint: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_supportedEntryPoints";
        Parameters?: undefined;
        ReturnType: readonly `0x${string}`[];
    }, {
        Method: "pm_getPaymasterStubData";
        Parameters?: [userOperation: viem.OneOf<viem.PartialBy<Pick<viem.RpcUserOperation<"0.6">, "callData" | "nonce" | "maxFeePerGas" | "maxPriorityFeePerGas" | "callGasLimit" | "preVerificationGas" | "sender" | "verificationGasLimit" | "initCode">, "maxFeePerGas" | "maxPriorityFeePerGas" | "callGasLimit" | "preVerificationGas" | "verificationGasLimit" | "initCode"> | viem.PartialBy<Pick<viem.RpcUserOperation<"0.7">, "callData" | "nonce" | "maxFeePerGas" | "maxPriorityFeePerGas" | "factory" | "factoryData" | "callGasLimit" | "preVerificationGas" | "sender" | "verificationGasLimit">, "maxFeePerGas" | "maxPriorityFeePerGas" | "factory" | "factoryData" | "callGasLimit" | "preVerificationGas" | "verificationGasLimit">>, entrypoint: `0x${string}`, chainId: `0x${string}`, context: unknown] | undefined;
        ReturnType: viem.OneOf<{
            paymasterAndData: `0x${string}`;
        } | {
            paymaster: `0x${string}`;
            paymasterData: `0x${string}`;
            paymasterVerificationGasLimit: `0x${string}`;
            paymasterPostOpGasLimit: `0x${string}`;
        }> & {
            sponsor?: {
                name: string;
                icon?: string | undefined;
            } | undefined;
            isFinal?: boolean | undefined;
        };
    }, {
        Method: "pm_getPaymasterData";
        Parameters?: [userOperation: Pick<viem.RpcUserOperation<"0.6">, "callData" | "nonce" | "maxFeePerGas" | "maxPriorityFeePerGas" | "callGasLimit" | "preVerificationGas" | "sender" | "verificationGasLimit" | "initCode"> | Pick<viem.RpcUserOperation<"0.7">, "callData" | "nonce" | "maxFeePerGas" | "maxPriorityFeePerGas" | "factory" | "factoryData" | "callGasLimit" | "preVerificationGas" | "sender" | "verificationGasLimit">, entrypoint: `0x${string}`, chainId: `0x${string}`, context: unknown] | undefined;
        ReturnType: viem.OneOf<{
            paymasterAndData: `0x${string}`;
        } | {
            paymaster: `0x${string}`;
            paymasterData: `0x${string}`;
            paymasterVerificationGasLimit: `0x${string}`;
            paymasterPostOpGasLimit: `0x${string}`;
        }>;
    }]>;
    transport: viem.TransportConfig<string, viem.EIP1193RequestFn> & Record<string, any>;
    type: string;
    uid: string;
} & {
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & viem.ExactPartial<Pick<viem.PublicActions<Transport, TChain, TAccount>, "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<viem.WalletActions<TChain, TAccount>, "sendTransaction" | "writeContract">>>(fn: (client: Client<Transport, TChain, TAccount, undefined, {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } | undefined>) => client) => Client<Transport, TChain, TAccount, undefined, { [K in keyof client]: client[K]; }>;
} & {
    signTypedData: WalletClient['signTypedData'];
}) => {
    signUserOperation: (parameters: Omit<SignUserOperationParameters, 'chainId'> & {
        chainId?: number;
    }) => Promise<`0x${string}`>;
};

declare const erc7715ProviderActions: () => (client: Client) => {
    requestExecutionPermissions: (parameters: RequestExecutionPermissionsParameters) => Promise<RequestExecutionPermissionsReturnType>;
};
declare const erc7710WalletActions: () => (client: WalletClient) => {
    sendTransactionWithDelegation: (args: SendTransactionWithDelegationParameters) => Promise<`0x${string}`>;
};
declare const erc7710BundlerActions: () => (client: Client) => {
    sendUserOperationWithDelegation: (args: SendUserOperationWithDelegationParameters) => Promise<`0x${string}`>;
};

type index_CaveatEnforcerParams = CaveatEnforcerParams;
type index_DelegatedCall = DelegatedCall;
type index_MetaMaskExtensionClient = MetaMaskExtensionClient;
type index_MetaMaskExtensionSchema = MetaMaskExtensionSchema;
type index_PeriodTransferResult = PeriodTransferResult;
type index_RequestExecutionPermissionsParameters = RequestExecutionPermissionsParameters;
type index_RequestExecutionPermissionsReturnType = RequestExecutionPermissionsReturnType;
type index_SignDelegationParameters = SignDelegationParameters;
type index_SignDelegationReturnType = SignDelegationReturnType;
type index_SignUserOperationParameters = SignUserOperationParameters;
type index_SignUserOperationReturnType = SignUserOperationReturnType;
type index_StreamingResult = StreamingResult;
declare const index_caveatEnforcerActions: typeof caveatEnforcerActions;
declare const index_erc7710BundlerActions: typeof erc7710BundlerActions;
declare const index_erc7710WalletActions: typeof erc7710WalletActions;
declare const index_erc7715ProviderActions: typeof erc7715ProviderActions;
declare const index_getErc20PeriodTransferEnforcerAvailableAmount: typeof getErc20PeriodTransferEnforcerAvailableAmount;
declare const index_getErc20StreamingEnforcerAvailableAmount: typeof getErc20StreamingEnforcerAvailableAmount;
declare const index_getMultiTokenPeriodEnforcerAvailableAmount: typeof getMultiTokenPeriodEnforcerAvailableAmount;
declare const index_getNativeTokenPeriodTransferEnforcerAvailableAmount: typeof getNativeTokenPeriodTransferEnforcerAvailableAmount;
declare const index_getNativeTokenStreamingEnforcerAvailableAmount: typeof getNativeTokenStreamingEnforcerAvailableAmount;
declare const index_isValid7702Implementation: typeof isValid7702Implementation;
declare const index_signDelegation: typeof signDelegation;
declare const index_signDelegationActions: typeof signDelegationActions;
declare const index_signUserOperation: typeof signUserOperation;
declare const index_signUserOperationActions: typeof signUserOperationActions;
declare namespace index {
  export { type index_CaveatEnforcerParams as CaveatEnforcerParams, type index_DelegatedCall as DelegatedCall, type index_MetaMaskExtensionClient as MetaMaskExtensionClient, type index_MetaMaskExtensionSchema as MetaMaskExtensionSchema, type index_PeriodTransferResult as PeriodTransferResult, type index_RequestExecutionPermissionsParameters as RequestExecutionPermissionsParameters, type index_RequestExecutionPermissionsReturnType as RequestExecutionPermissionsReturnType, type index_SignDelegationParameters as SignDelegationParameters, type index_SignDelegationReturnType as SignDelegationReturnType, type index_SignUserOperationParameters as SignUserOperationParameters, type index_SignUserOperationReturnType as SignUserOperationReturnType, type index_StreamingResult as StreamingResult, index_caveatEnforcerActions as caveatEnforcerActions, index_erc7710BundlerActions as erc7710BundlerActions, index_erc7710WalletActions as erc7710WalletActions, index_erc7715ProviderActions as erc7715ProviderActions, index_getErc20PeriodTransferEnforcerAvailableAmount as getErc20PeriodTransferEnforcerAvailableAmount, index_getErc20StreamingEnforcerAvailableAmount as getErc20StreamingEnforcerAvailableAmount, index_getMultiTokenPeriodEnforcerAvailableAmount as getMultiTokenPeriodEnforcerAvailableAmount, index_getNativeTokenPeriodTransferEnforcerAvailableAmount as getNativeTokenPeriodTransferEnforcerAvailableAmount, index_getNativeTokenStreamingEnforcerAvailableAmount as getNativeTokenStreamingEnforcerAvailableAmount, index_isValid7702Implementation as isValid7702Implementation, erc7715RequestExecutionPermissionsAction as requestExecutionPermissions, index_signDelegation as signDelegation, index_signDelegationActions as signDelegationActions, index_signUserOperation as signUserOperation, index_signUserOperationActions as signUserOperationActions };
}

export { type CaveatEnforcerParams as C, type DelegatedCall as D, type MetaMaskExtensionClient as M, type PeriodTransferResult as P, type RequestExecutionPermissionsParameters as R, type StreamingResult as S, erc7710WalletActions as a, erc7710BundlerActions as b, caveatEnforcerActions as c, getErc20StreamingEnforcerAvailableAmount as d, erc7715ProviderActions as e, getMultiTokenPeriodEnforcerAvailableAmount as f, getErc20PeriodTransferEnforcerAvailableAmount as g, getNativeTokenPeriodTransferEnforcerAvailableAmount as h, index as i, getNativeTokenStreamingEnforcerAvailableAmount as j, isValid7702Implementation as k, signDelegationActions as l, type SignDelegationParameters as m, type SignDelegationReturnType as n, signUserOperation as o, signUserOperationActions as p, type SignUserOperationParameters as q, type SignUserOperationReturnType as r, signDelegation as s, erc7715RequestExecutionPermissionsAction as t, type MetaMaskExtensionSchema as u, type RequestExecutionPermissionsReturnType as v };
