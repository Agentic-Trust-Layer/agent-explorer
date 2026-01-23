import { HybridDeleGator, MultiSigDeleGator, EIP7702StatelessDeleGator } from '@metamask/delegation-abis';
import { Address, Hex, PublicClient, WalletClient, Transport, Chain, Account, OneOf } from 'viem';
import { WebAuthnAccount, SmartAccount, SmartAccountImplementation, entryPoint07Abi } from 'viem/account-abstraction';
import { Prettify } from 'viem/chains';

declare enum Implementation {
    MultiSig = "MultiSig",
    Hybrid = "Hybrid",
    Stateless7702 = "Stateless7702"
}
declare enum TransferWindow {
    Hourly = 3600,
    Daily = 86400,
    Weekly = 604800,
    BiWeekly = 1209600,
    Monthly = 2592000,
    Quarterly = 7776000,
    Yearly = 31536000
}

type ExecutionStruct = {
    target: Address;
    value: bigint;
    callData: Hex;
};
type CreateExecutionArgs = {
    target: Address;
    value?: bigint;
    callData?: Hex;
};
declare const createExecution: ({ target, value, callData, }: CreateExecutionArgs) => ExecutionStruct;
declare enum ExecutionMode {
    SingleDefault = "0x0000000000000000000000000000000000000000000000000000000000000000",
    SingleTry = "0x0001000000000000000000000000000000000000000000000000000000000000",
    BatchDefault = "0x0100000000000000000000000000000000000000000000000000000000000000",
    BatchTry = "0x0101000000000000000000000000000000000000000000000000000000000000"
}
declare const encodeSingleExecution: (execution: ExecutionStruct) => Hex;
declare const encodeBatchExecution: (executions: ExecutionStruct[]) => Hex;
declare const encodeExecutionCalldata: (executions: ExecutionStruct[]) => Hex;
declare const encodeExecutionCalldatas: (executionsBatch: ExecutionStruct[][]) => Hex[];

type Caveat = {
    enforcer: Hex;
    terms: Hex;
    args: Hex;
};
type Delegation = {
    delegate: Hex;
    delegator: Hex;
    authority: Hex;
    caveats: Caveat[];
    salt: Hex;
    signature: Hex;
};
type SmartAccountsEnvironment = {
    DelegationManager: Hex;
    EntryPoint: Hex;
    SimpleFactory: Hex;
    implementations: {
        [implementation: string]: Hex;
    };
    caveatEnforcers: {
        [enforcer: string]: Hex;
    };
};
type MultiSigDeleGatorDeployParams = [signers: Hex[], threshold: bigint];
type HybridDeleGatorDeployParams = [
    owner: Hex,
    keyIds: string[],
    xValues: bigint[],
    yValues: bigint[]
];
type Redemption = {
    permissionContext: Delegation[];
    executions: ExecutionStruct[];
    mode: ExecutionMode;
};
type DeployParams<TImplementation extends Implementation> = {
    [Implementation.MultiSig]: MultiSigDeleGatorDeployParams;
    [Implementation.Hybrid]: HybridDeleGatorDeployParams;
    [Implementation.Stateless7702]: never;
}[TImplementation];
type ToMetaMaskSmartAccountParameters<TImplementation extends Implementation> = {
    client: PublicClient;
    implementation: TImplementation;
    signer: SignerConfigByImplementation<TImplementation>;
    environment?: SmartAccountsEnvironment;
} & OneOf<{
    deployParams: DeployParams<TImplementation>;
    deploySalt: Hex;
} | {
    address: Address;
}>;
type SignUserOperationParams = Parameters<ToMetaMaskSmartAccountReturnType<Implementation>['signUserOperation']>[0];
type SignDelegationParams = {
    delegation: Omit<Delegation, 'signature'>;
} & {
    chainId?: number;
};
type MetaMaskSmartAccountImplementation<TImplementation extends Implementation> = SmartAccountImplementation<typeof entryPoint07Abi, '0.7', {
    abi: {
        [Implementation.Hybrid]: typeof HybridDeleGator.abi;
        [Implementation.MultiSig]: typeof MultiSigDeleGator.abi;
        [Implementation.Stateless7702]: typeof EIP7702StatelessDeleGator.abi;
    }[TImplementation];
    signDelegation: (params: SignDelegationParams) => Promise<Hex>;
    environment: SmartAccountsEnvironment;
}>;
type MetaMaskSmartAccount<TImplementation extends Implementation = Implementation> = ToMetaMaskSmartAccountReturnType<TImplementation>;
type ToMetaMaskSmartAccountReturnType<TImplementation extends Implementation> = Prettify<SmartAccount<MetaMaskSmartAccountImplementation<TImplementation>>>;
type WalletSignerConfig = {
    walletClient: WalletClient<Transport, Chain | undefined, Account>;
};
type AccountSignerConfig = {
    account: Pick<Account, 'signMessage' | 'signTypedData' | 'address'>;
};
type WebAuthnSignerConfig = {
    webAuthnAccount: WebAuthnAccount;
    keyId: Hex;
};
type HybridSignerConfig = WalletSignerConfig | AccountSignerConfig | WebAuthnSignerConfig;
type MultiSigSignerConfig = (WalletSignerConfig | AccountSignerConfig)[];
type Stateless7702SignerConfig = WalletSignerConfig | AccountSignerConfig;
type SignerConfigByImplementation<TImplementation extends Implementation> = {
    [Implementation.Hybrid]: HybridSignerConfig;
    [Implementation.MultiSig]: MultiSigSignerConfig;
    [Implementation.Stateless7702]: Stateless7702SignerConfig;
}[TImplementation];
type Call = {
    to: Hex;
    data?: Hex | undefined;
    value?: bigint | undefined;
};

export { type AccountSignerConfig as A, type Caveat as C, type Delegation as D, ExecutionMode as E, type HybridDeleGatorDeployParams as H, Implementation as I, type MultiSigDeleGatorDeployParams as M, type Redemption as R, type SmartAccountsEnvironment as S, type ToMetaMaskSmartAccountParameters as T, type WalletSignerConfig as W, type ToMetaMaskSmartAccountReturnType as a, type SignUserOperationParams as b, type SignDelegationParams as c, type MetaMaskSmartAccountImplementation as d, type MetaMaskSmartAccount as e, type WebAuthnSignerConfig as f, type HybridSignerConfig as g, type MultiSigSignerConfig as h, TransferWindow as i, createExecution as j, type ExecutionStruct as k, type CreateExecutionArgs as l, type Call as m, type DeployParams as n, encodeExecutionCalldata as o, encodeExecutionCalldatas as p, encodeSingleExecution as q, encodeBatchExecution as r };
