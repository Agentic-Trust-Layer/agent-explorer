import { BytesLike, Hex } from '@metamask/utils';
export { Hex } from '@metamask/utils';

type CaveatStruct<TBytes extends BytesLike = BytesLike> = {
    enforcer: TBytes;
    terms: TBytes;
    args: TBytes;
};
type DelegationStruct<TBytes extends BytesLike = BytesLike> = {
    delegate: TBytes;
    delegator: TBytes;
    authority: TBytes;
    caveats: CaveatStruct<TBytes>[];
    salt: bigint;
    signature: TBytes;
};

type ResultValue = 'hex' | 'bytes';
type EncodingOptions<TResultValue extends ResultValue> = {
    out: TResultValue;
};

type ValueLteTerms = {
    maxValue: bigint;
};
declare function createValueLteTerms(terms: ValueLteTerms, options?: EncodingOptions<'hex'>): Hex;
declare function createValueLteTerms(terms: ValueLteTerms, options: EncodingOptions<'bytes'>): Uint8Array;

type TimestampTerms = {
    timestampAfterThreshold: number;
    timestampBeforeThreshold: number;
};
declare function createTimestampTerms(terms: TimestampTerms, encodingOptions?: EncodingOptions<'hex'>): Hex;
declare function createTimestampTerms(terms: TimestampTerms, encodingOptions: EncodingOptions<'bytes'>): Uint8Array;

type NativeTokenPeriodTransferTerms = {
    periodAmount: bigint;
    periodDuration: number;
    startDate: number;
};
declare function createNativeTokenPeriodTransferTerms(terms: NativeTokenPeriodTransferTerms, encodingOptions?: EncodingOptions<'hex'>): Hex;
declare function createNativeTokenPeriodTransferTerms(terms: NativeTokenPeriodTransferTerms, encodingOptions: EncodingOptions<'bytes'>): Uint8Array;

type ExactCalldataTerms = {
    calldata: BytesLike;
};
declare function createExactCalldataTerms(terms: ExactCalldataTerms, encodingOptions?: EncodingOptions<'hex'>): Hex;
declare function createExactCalldataTerms(terms: ExactCalldataTerms, encodingOptions: EncodingOptions<'bytes'>): Uint8Array;

type NativeTokenStreamingTerms = {
    initialAmount: bigint;
    maxAmount: bigint;
    amountPerSecond: bigint;
    startTime: number;
};
declare function createNativeTokenStreamingTerms(terms: NativeTokenStreamingTerms, encodingOptions?: EncodingOptions<'hex'>): Hex;
declare function createNativeTokenStreamingTerms(terms: NativeTokenStreamingTerms, encodingOptions: EncodingOptions<'bytes'>): Uint8Array;

type ERC20StreamingTerms = {
    tokenAddress: BytesLike;
    initialAmount: bigint;
    maxAmount: bigint;
    amountPerSecond: bigint;
    startTime: number;
};
declare function createERC20StreamingTerms(terms: ERC20StreamingTerms, encodingOptions?: EncodingOptions<'hex'>): Hex;
declare function createERC20StreamingTerms(terms: ERC20StreamingTerms, encodingOptions: EncodingOptions<'bytes'>): Uint8Array;

type ERC20TokenPeriodTransferTerms = {
    tokenAddress: BytesLike;
    periodAmount: bigint;
    periodDuration: number;
    startDate: number;
};
declare function createERC20TokenPeriodTransferTerms(terms: ERC20TokenPeriodTransferTerms, encodingOptions?: EncodingOptions<'hex'>): Hex;
declare function createERC20TokenPeriodTransferTerms(terms: ERC20TokenPeriodTransferTerms, encodingOptions: EncodingOptions<'bytes'>): Uint8Array;

type NonceTerms = {
    nonce: BytesLike;
};
declare function createNonceTerms(terms: NonceTerms, encodingOptions?: EncodingOptions<'hex'>): Hex;
declare function createNonceTerms(terms: NonceTerms, encodingOptions: EncodingOptions<'bytes'>): Uint8Array;

type AllowedCalldataTerms = {
    startIndex: number;
    value: BytesLike;
};
declare function createAllowedCalldataTerms(terms: AllowedCalldataTerms, encodingOptions?: EncodingOptions<'hex'>): Hex;
declare function createAllowedCalldataTerms(terms: AllowedCalldataTerms, encodingOptions: EncodingOptions<'bytes'>): Uint8Array;

declare const ANY_BENEFICIARY = "0x0000000000000000000000000000000000000a11";
declare const ROOT_AUTHORITY = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
declare const DELEGATION_TYPEHASH = "0x88c1d2ecf185adf710588203a5f263f0ff61be0d33da39792cde19ba9aa4331e";
declare const CAVEAT_TYPEHASH = "0x80ad7e1b04ee6d994a125f4714ca0720908bd80ed16063ec8aee4b88e9253e2d";
declare function encodeDelegations(delegations: DelegationStruct[], options?: EncodingOptions<'hex'>): Hex;
declare function encodeDelegations(delegations: DelegationStruct[], options: EncodingOptions<'bytes'>): Uint8Array;
declare function decodeDelegations(encoded: BytesLike, options?: EncodingOptions<'hex'>): DelegationStruct<Hex>[];
declare function decodeDelegations(encoded: BytesLike, options: EncodingOptions<'bytes'>): DelegationStruct<Uint8Array>[];
declare function hashDelegation(delegation: DelegationStruct, options?: EncodingOptions<'hex'>): Hex;
declare function hashDelegation(delegation: DelegationStruct, options: EncodingOptions<'bytes'>): Uint8Array;

export { ANY_BENEFICIARY, CAVEAT_TYPEHASH, type CaveatStruct as Caveat, DELEGATION_TYPEHASH, type DelegationStruct as Delegation, ROOT_AUTHORITY, createAllowedCalldataTerms, createERC20StreamingTerms, createERC20TokenPeriodTransferTerms, createExactCalldataTerms, createNativeTokenPeriodTransferTerms, createNativeTokenStreamingTerms, createNonceTerms, createTimestampTerms, createValueLteTerms, decodeDelegations, encodeDelegations, hashDelegation };
