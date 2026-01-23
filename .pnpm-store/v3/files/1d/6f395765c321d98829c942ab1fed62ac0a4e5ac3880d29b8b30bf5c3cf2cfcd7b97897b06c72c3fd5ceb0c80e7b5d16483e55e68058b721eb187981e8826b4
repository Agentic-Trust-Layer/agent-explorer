/**
 * Viem adapter implementation
 * Viem is a modern TypeScript-first Ethereum library
 */
import { PublicClient, WalletClient, Account, Address, Hex, Abi, Chain, Transport } from 'viem';
import { BlockchainAdapter, ContractCallResult, ViemAdapterOptions } from './types';
export declare class ViemAdapter implements BlockchainAdapter {
    private publicClient;
    private walletClient?;
    private account?;
    constructor(publicClient: PublicClient, walletClient?: WalletClient<Transport, Chain, Account> | null, account?: Account | Address);
    constructor(options: ViemAdapterOptions);
    call<T = unknown>(contractAddress: Address, abi: Abi, functionName: string, args?: readonly unknown[]): Promise<T>;
    send(contractAddress: Address, abi: Abi, functionName: string, args?: readonly unknown[], overrides?: {
        value?: bigint;
        gas?: bigint;
        gasPrice?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        nonce?: number;
        account?: Address;
        chain?: Chain;
    }): Promise<ContractCallResult>;
    encodeFunctionData(contractAddress: Address, abi: Abi, functionName: string, args?: readonly unknown[]): Promise<Hex>;
    getAddress(): Promise<Address | null>;
    getChainId(): Promise<number>;
    signMessage(message: string | Uint8Array): Promise<Hex>;
    signTypedData<TTypedData extends Record<string, unknown>>(domain: any, types: any, value: TTypedData): Promise<Hex>;
}
//# sourceMappingURL=viem.d.ts.map