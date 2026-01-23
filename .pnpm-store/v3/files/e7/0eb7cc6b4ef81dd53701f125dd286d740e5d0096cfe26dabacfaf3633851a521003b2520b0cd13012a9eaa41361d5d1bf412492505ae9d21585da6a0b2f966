import { Hex, AbiFunction, Address, AbiParameter, TypedData } from 'viem';
import { S as SmartAccountsEnvironment, C as Caveat, k as ExecutionStruct, D as Delegation } from './types-Bwksz_U6.js';

type AllowedCalldataBuilderConfig = {
    startIndex: number;
    value: Hex;
};
declare const allowedCalldataBuilder: (environment: SmartAccountsEnvironment, config: AllowedCalldataBuilderConfig) => Caveat;

type MethodSelector = Hex | string | AbiFunction;
type AllowedMethodsBuilderConfig = {
    selectors: MethodSelector[];
};
declare const allowedMethodsBuilder: (environment: SmartAccountsEnvironment, config: AllowedMethodsBuilderConfig) => Caveat;

type AllowedTargetsBuilderConfig = {
    targets: Address[];
};
declare const allowedTargetsBuilder: (environment: SmartAccountsEnvironment, config: AllowedTargetsBuilderConfig) => Caveat;

type ArgsEqualityCheckBuilderConfig = {
    args: Hex;
};
declare const argsEqualityCheckBuilder: (environment: SmartAccountsEnvironment, config: ArgsEqualityCheckBuilderConfig) => Caveat;

type BlockNumberBuilderConfig = {
    afterThreshold: bigint;
    beforeThreshold: bigint;
};
declare const blockNumberBuilder: (environment: SmartAccountsEnvironment, config: BlockNumberBuilderConfig) => Caveat;

type CaveatWithOptionalArgs = Omit<Caveat, 'args'> & {
    args?: Caveat['args'];
};
type CaveatBuilderMap = {
    [key: string]: (environment: SmartAccountsEnvironment, ...args: [...any]) => Caveat;
};
type CaveatBuilderConfig = {
    allowInsecureUnrestrictedDelegation?: boolean;
};
declare class CaveatBuilder<TCaveatBuilderMap extends CaveatBuilderMap = Record<string, never>> {
    #private;
    constructor(environment: SmartAccountsEnvironment, config?: CaveatBuilderConfig, enforcerBuilders?: TCaveatBuilderMap, builtCaveats?: Caveat[]);
    extend<TEnforcerName extends string, TFunction extends (environment: SmartAccountsEnvironment, config: any) => Caveat>(name: TEnforcerName, fn: TFunction): CaveatBuilder<TCaveatBuilderMap & Record<TEnforcerName, TFunction>>;
    addCaveat(caveat: CaveatWithOptionalArgs): CaveatBuilder<TCaveatBuilderMap>;
    addCaveat<TEnforcerName extends keyof TCaveatBuilderMap>(name: TEnforcerName, config: Parameters<TCaveatBuilderMap[TEnforcerName]>[1]): CaveatBuilder<TCaveatBuilderMap>;
    build(): Caveat[];
}

type DeployedBuilderConfig = {
    contractAddress: Address;
    salt: Hex;
    bytecode: Hex;
};
declare const deployedBuilder: (environment: SmartAccountsEnvironment, config: DeployedBuilderConfig) => Caveat;

declare enum BalanceChangeType {
    Increase = 0,
    Decrease = 1
}

type Erc1155BalanceChangeBuilderConfig = {
    tokenAddress: Address;
    recipient: Address;
    tokenId: bigint;
    balance: bigint;
    changeType: BalanceChangeType;
};
declare const erc1155BalanceChangeBuilder: (environment: SmartAccountsEnvironment, config: Erc1155BalanceChangeBuilderConfig) => Caveat;

type Erc20BalanceChangeBuilderConfig = {
    tokenAddress: Address;
    recipient: Address;
    balance: bigint;
    changeType: BalanceChangeType;
};
declare const erc20BalanceChangeBuilder: (environment: SmartAccountsEnvironment, config: Erc20BalanceChangeBuilderConfig) => Caveat;

declare const erc20PeriodTransfer = "erc20PeriodTransfer";
type Erc20PeriodTransferBuilderConfig = {
    tokenAddress: Address;
    periodAmount: bigint;
    periodDuration: number;
    startDate: number;
};
declare const erc20PeriodTransferBuilder: (environment: SmartAccountsEnvironment, config: Erc20PeriodTransferBuilderConfig) => Caveat;

declare const erc20Streaming = "erc20Streaming";
type Erc20StreamingBuilderConfig = {
    tokenAddress: Address;
    initialAmount: bigint;
    maxAmount: bigint;
    amountPerSecond: bigint;
    startTime: number;
};
declare const erc20StreamingBuilder: (environment: SmartAccountsEnvironment, config: Erc20StreamingBuilderConfig) => Caveat;

declare const erc20TransferAmount = "erc20TransferAmount";
type Erc20TransferAmountBuilderConfig = {
    tokenAddress: Address;
    maxAmount: bigint;
};
declare const erc20TransferAmountBuilder: (environment: SmartAccountsEnvironment, config: Erc20TransferAmountBuilderConfig) => Caveat;

type Erc721BalanceChangeBuilderConfig = {
    tokenAddress: Address;
    recipient: Address;
    amount: bigint;
    changeType: BalanceChangeType;
};
declare const erc721BalanceChangeBuilder: (environment: SmartAccountsEnvironment, config: Erc721BalanceChangeBuilderConfig) => Caveat;

declare const erc721Transfer = "erc721Transfer";
type Erc721TransferBuilderConfig = {
    tokenAddress: Address;
    tokenId: bigint;
};
declare const erc721TransferBuilder: (environment: SmartAccountsEnvironment, config: Erc721TransferBuilderConfig) => Caveat;

type ExactCalldataBatchBuilderConfig = {
    executions: ExecutionStruct[];
};
declare const exactCalldataBatchBuilder: (environment: SmartAccountsEnvironment, config: ExactCalldataBatchBuilderConfig) => Caveat;

type ExactCalldataBuilderConfig = {
    calldata: Hex;
};
declare const exactCalldataBuilder: (environment: SmartAccountsEnvironment, config: ExactCalldataBuilderConfig) => Caveat;

type ExactExecutionBatchBuilderConfig = {
    executions: ExecutionStruct[];
};
declare const exactExecutionBatchBuilder: (environment: SmartAccountsEnvironment, config: ExactExecutionBatchBuilderConfig) => Caveat;

type ExactExecutionBuilderConfig = {
    execution: ExecutionStruct;
};
declare const exactExecutionBuilder: (environment: SmartAccountsEnvironment, config: ExactExecutionBuilderConfig) => Caveat;

type IdBuilderConfig = {
    id: bigint | number;
};
declare const idBuilder: (environment: SmartAccountsEnvironment, config: IdBuilderConfig) => Caveat;

type LimitedCallsBuilderConfig = {
    limit: number;
};
declare const limitedCallsBuilder: (environment: SmartAccountsEnvironment, config: LimitedCallsBuilderConfig) => Caveat;

type TokenPeriodConfig = {
    token: Hex;
    periodAmount: bigint;
    periodDuration: number;
    startDate: number;
};
type MultiTokenPeriodBuilderConfig = {
    tokenConfigs: TokenPeriodConfig[];
};
declare const multiTokenPeriodBuilder: (environment: SmartAccountsEnvironment, config: MultiTokenPeriodBuilderConfig) => Caveat;

type NativeBalanceChangeBuilderConfig = {
    recipient: Address;
    balance: bigint;
    changeType: BalanceChangeType;
};
declare const nativeBalanceChangeBuilder: (environment: SmartAccountsEnvironment, config: NativeBalanceChangeBuilderConfig) => Caveat;

type NativeTokenPaymentBuilderConfig = {
    recipient: Address;
    amount: bigint;
};
declare const nativeTokenPaymentBuilder: (environment: SmartAccountsEnvironment, config: NativeTokenPaymentBuilderConfig) => Caveat;

declare const nativeTokenPeriodTransfer = "nativeTokenPeriodTransfer";
type NativeTokenPeriodTransferBuilderConfig = {
    periodAmount: bigint;
    periodDuration: number;
    startDate: number;
};
declare const nativeTokenPeriodTransferBuilder: (environment: SmartAccountsEnvironment, config: NativeTokenPeriodTransferBuilderConfig) => Caveat;

declare const nativeTokenStreaming = "nativeTokenStreaming";
type NativeTokenStreamingBuilderConfig = {
    initialAmount: bigint;
    maxAmount: bigint;
    amountPerSecond: bigint;
    startTime: number;
};
declare const nativeTokenStreamingBuilder: (environment: SmartAccountsEnvironment, config: NativeTokenStreamingBuilderConfig) => Caveat;

declare const nativeTokenTransferAmount = "nativeTokenTransferAmount";
type NativeTokenTransferAmountBuilderConfig = {
    maxAmount: bigint;
};
declare const nativeTokenTransferAmountBuilder: (environment: SmartAccountsEnvironment, config: NativeTokenTransferAmountBuilderConfig) => Caveat;

type NonceBuilderConfig = {
    nonce: Hex;
};
declare const nonceBuilder: (environment: SmartAccountsEnvironment, config: NonceBuilderConfig) => Caveat;

declare const ownershipTransfer = "ownershipTransfer";
type OwnershipTransferBuilderConfig = {
    contractAddress: Address;
};
declare const ownershipTransferBuilder: (environment: SmartAccountsEnvironment, config: OwnershipTransferBuilderConfig) => Caveat;

type RedeemerBuilderConfig = {
    redeemers: Address[];
};
declare const redeemerBuilder: (environment: SmartAccountsEnvironment, config: RedeemerBuilderConfig) => Caveat;

type SpecificActionErc20TransferBatchBuilderConfig = {
    tokenAddress: Address;
    recipient: Address;
    amount: bigint;
    target: Address;
    calldata: Hex;
};
declare const specificActionERC20TransferBatchBuilder: (environment: SmartAccountsEnvironment, config: SpecificActionErc20TransferBatchBuilderConfig) => Caveat;

type TimestampBuilderConfig = {
    afterThreshold: number;
    beforeThreshold: number;
};
declare const timestampBuilder: (environment: SmartAccountsEnvironment, config: TimestampBuilderConfig) => Caveat;

type ValueLteBuilderConfig = {
    maxValue: bigint;
};
declare const valueLteBuilder: (environment: SmartAccountsEnvironment, config: ValueLteBuilderConfig) => Caveat;

type CoreCaveatMap = {
    allowedMethods: typeof allowedMethodsBuilder;
    allowedTargets: typeof allowedTargetsBuilder;
    deployed: typeof deployedBuilder;
    allowedCalldata: typeof allowedCalldataBuilder;
    erc20BalanceChange: typeof erc20BalanceChangeBuilder;
    erc721BalanceChange: typeof erc721BalanceChangeBuilder;
    erc1155BalanceChange: typeof erc1155BalanceChangeBuilder;
    valueLte: typeof valueLteBuilder;
    limitedCalls: typeof limitedCallsBuilder;
    id: typeof idBuilder;
    nonce: typeof nonceBuilder;
    timestamp: typeof timestampBuilder;
    blockNumber: typeof blockNumberBuilder;
    erc20TransferAmount: typeof erc20TransferAmountBuilder;
    erc20Streaming: typeof erc20StreamingBuilder;
    nativeTokenStreaming: typeof nativeTokenStreamingBuilder;
    erc721Transfer: typeof erc721TransferBuilder;
    nativeTokenTransferAmount: typeof nativeTokenTransferAmountBuilder;
    nativeBalanceChange: typeof nativeBalanceChangeBuilder;
    redeemer: typeof redeemerBuilder;
    nativeTokenPayment: typeof nativeTokenPaymentBuilder;
    argsEqualityCheck: typeof argsEqualityCheckBuilder;
    specificActionERC20TransferBatch: typeof specificActionERC20TransferBatchBuilder;
    erc20PeriodTransfer: typeof erc20PeriodTransferBuilder;
    nativeTokenPeriodTransfer: typeof nativeTokenPeriodTransferBuilder;
    exactCalldataBatch: typeof exactCalldataBatchBuilder;
    exactCalldata: typeof exactCalldataBuilder;
    exactExecution: typeof exactExecutionBuilder;
    exactExecutionBatch: typeof exactExecutionBatchBuilder;
    multiTokenPeriod: typeof multiTokenPeriodBuilder;
    ownershipTransfer: typeof ownershipTransferBuilder;
};
type CoreCaveatBuilder = CaveatBuilder<CoreCaveatMap>;
type ExtractCaveatMapType<TCaveatBuilder extends CaveatBuilder<any>> = TCaveatBuilder extends CaveatBuilder<infer TCaveatMap> ? TCaveatMap : never;
type CaveatConfiguration<TCaveatBuilder extends CaveatBuilder<any>, CaveatMap = ExtractCaveatMapType<TCaveatBuilder>> = CaveatMap extends Record<string, (...args: any[]) => any> ? {
    [TType in keyof CaveatMap]: {
        type: TType;
    } & Parameters<CaveatMap[TType]>[1];
}[keyof CaveatMap] : never;
type CoreCaveatConfiguration = CaveatConfiguration<CoreCaveatBuilder>;
declare const createCaveatBuilder: (environment: SmartAccountsEnvironment, config?: CaveatBuilderConfig) => CoreCaveatBuilder;

type Erc20PeriodicScopeConfig = {
    type: typeof erc20PeriodTransfer;
} & Erc20PeriodTransferBuilderConfig;

type Erc20StreamingScopeConfig = {
    type: typeof erc20Streaming;
} & Erc20StreamingBuilderConfig;

type Erc20TransferScopeConfig = {
    type: typeof erc20TransferAmount;
} & Erc20TransferAmountBuilderConfig;

type Erc721ScopeBaseConfig = {
    type: typeof erc721Transfer;
};
type Erc721ScopeConfig = Erc721ScopeBaseConfig & Erc721TransferBuilderConfig;

type FunctionCallScopeBaseConfig = {
    type: 'functionCall';
    allowedCalldata?: AllowedCalldataBuilderConfig[];
    exactCalldata?: ExactCalldataBuilderConfig;
    valueLte?: ValueLteBuilderConfig;
};
type FunctionCallScopeConfig = FunctionCallScopeBaseConfig & AllowedTargetsBuilderConfig & AllowedMethodsBuilderConfig;

type NativeTokenPeriodicScopeConfig = {
    type: typeof nativeTokenPeriodTransfer;
    allowedCalldata?: AllowedCalldataBuilderConfig[];
    exactCalldata?: ExactCalldataBuilderConfig;
} & NativeTokenPeriodTransferBuilderConfig;

type NativeTokenStreamingScopeConfig = {
    type: typeof nativeTokenStreaming;
    allowedCalldata?: AllowedCalldataBuilderConfig[];
    exactCalldata?: ExactCalldataBuilderConfig;
} & NativeTokenStreamingBuilderConfig;

type NativeTokenTransferScopeConfig = {
    type: typeof nativeTokenTransferAmount;
    allowedCalldata?: AllowedCalldataBuilderConfig[];
    exactCalldata?: ExactCalldataBuilderConfig;
} & NativeTokenTransferAmountBuilderConfig;

type OwnershipScopeBaseConfig = {
    type: typeof ownershipTransfer;
};
type OwnershipScopeConfig = OwnershipScopeBaseConfig & OwnershipTransferBuilderConfig;

type ScopeConfig = Erc20TransferScopeConfig | Erc20StreamingScopeConfig | Erc20PeriodicScopeConfig | NativeTokenTransferScopeConfig | NativeTokenStreamingScopeConfig | NativeTokenPeriodicScopeConfig | Erc721ScopeConfig | OwnershipScopeConfig | FunctionCallScopeConfig;

type Caveats = CaveatBuilder | (Caveat | CoreCaveatConfiguration)[];

declare const DELEGATION_ABI_TYPE_COMPONENTS: ({
    type: string;
    name: string;
    components?: undefined;
} | {
    type: string;
    name: string;
    components: {
        type: string;
        name: string;
    }[];
})[];
declare const toDelegationStruct: (delegation: Delegation) => DelegationStruct;
declare const toDelegation: (delegationStruct: DelegationStruct) => Delegation;
type DelegationStruct = Omit<Delegation, 'salt'> & {
    salt: bigint;
};
declare const encodeDelegations: (delegations: Delegation[]) => Hex;
declare const encodePermissionContexts: (delegations: Delegation[][]) => `0x${string}`[];
declare const decodeDelegations: (encoded: Hex) => Delegation[];
declare const decodePermissionContexts: (encoded: Hex[]) => Delegation[][];
declare const SIGNABLE_DELEGATION_TYPED_DATA: TypedData;
declare const DELEGATION_ARRAY_ABI_TYPE: AbiParameter;
declare const getDelegationHashOffchain: (input: Delegation) => Hex;
type BaseCreateDelegationOptions = {
    environment: SmartAccountsEnvironment;
    scope: ScopeConfig;
    from: Hex;
    caveats?: Caveats;
    parentDelegation?: Delegation | Hex;
    salt?: Hex;
};
type CreateDelegationOptions = BaseCreateDelegationOptions & {
    to: Hex;
};
type CreateOpenDelegationOptions = BaseCreateDelegationOptions;
declare const createDelegation: (options: CreateDelegationOptions) => Delegation;
declare const createOpenDelegation: (options: CreateOpenDelegationOptions) => Delegation;
declare const signDelegation: ({ privateKey, delegation, delegationManager, chainId, name, version, allowInsecureUnrestrictedDelegation, }: {
    privateKey: Hex;
    delegation: Omit<Delegation, 'signature'>;
    delegationManager: Address;
    chainId: number;
    name?: string | undefined;
    version?: string | undefined;
    allowInsecureUnrestrictedDelegation?: boolean | undefined;
}) => Promise<`0x${string}`>;

export { BalanceChangeType as B, type CreateDelegationOptions as C, DELEGATION_ARRAY_ABI_TYPE as D, SIGNABLE_DELEGATION_TYPED_DATA as S, createOpenDelegation as a, type CreateOpenDelegationOptions as b, createDelegation as c, type Caveats as d, encodeDelegations as e, decodeDelegations as f, toDelegation as g, encodePermissionContexts as h, decodePermissionContexts as i, DELEGATION_ABI_TYPE_COMPONENTS as j, getDelegationHashOffchain as k, type DelegationStruct as l, type CoreCaveatBuilder as m, type CaveatBuilderConfig as n, createCaveatBuilder as o, CaveatBuilder as p, signDelegation as s, toDelegationStruct as t };
