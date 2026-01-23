/**
 * Viem-based AccountProvider implementation
 * Implements ReadClient, Signer, and TxSender using Viem
 */
import { PublicClient, WalletClient, Account, Address, Hex, Abi, Chain, Transport } from 'viem';
import type { AccountProvider, ChainConfig, TxRequest, TxSendResult, GasPolicy } from '../types';
export interface ViemAccountProviderOptions {
    publicClient: PublicClient;
    walletClient?: WalletClient<Transport, Chain, Account> | null;
    account?: Account | Address;
    chainConfig: ChainConfig;
}
/**
 * Viem-based AccountProvider
 * Composes ReadClient, Signer, and TxSender using Viem clients
 */
export declare class ViemAccountProvider implements AccountProvider {
    private publicClient;
    private walletClient?;
    private account?;
    private chainConfig;
    constructor(options: ViemAccountProviderOptions);
    chain(): ChainConfig;
    chainId(): Promise<number>;
    call<T = unknown>(args: {
        to: Address;
        abi: Abi;
        functionName: string;
        args?: readonly unknown[];
        blockTag?: 'latest' | 'pending' | bigint;
    }): Promise<T>;
    getBlockNumber(): Promise<bigint>;
    getBlock(blockTag?: 'latest' | 'pending' | bigint): Promise<any>;
    getTransactionCount(address: Address, blockTag?: 'pending' | 'latest'): Promise<number>;
    estimateGas(args: {
        to: Address;
        data: Hex;
        value?: bigint;
        account?: Address;
    }): Promise<bigint>;
    getGasPrice(): Promise<bigint>;
    encodeFunctionData(args: {
        abi: Abi;
        functionName: string;
        args?: readonly unknown[];
    }): Promise<Hex>;
    getAddress(): Promise<Address>;
    signMessage(message: string | Uint8Array): Promise<Hex>;
    signTypedData<TTypedData extends Record<string, unknown>>(args: {
        domain: any;
        types: any;
        primaryType: string;
        message: TTypedData;
    }): Promise<Hex>;
    isContractSigner(): Promise<boolean>;
    send(tx: TxRequest, opts?: {
        gasPolicy?: GasPolicy;
        simulation?: boolean;
        metadata?: Record<string, unknown>;
    }): Promise<TxSendResult>;
    sendBatch(txs: TxRequest[], opts?: {
        gasPolicy?: GasPolicy;
        simulation?: boolean;
        metadata?: Record<string, unknown>;
    }): Promise<TxSendResult>;
}
//# sourceMappingURL=ViemAccountProvider.d.ts.map