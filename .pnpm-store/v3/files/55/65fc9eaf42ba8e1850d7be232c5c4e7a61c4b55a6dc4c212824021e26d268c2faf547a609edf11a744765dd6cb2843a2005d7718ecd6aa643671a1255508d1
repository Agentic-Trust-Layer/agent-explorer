/**
 * Ethers.js v6 adapter implementation
 */
import { ethers } from 'ethers';
import type { Abi, Address, Hex } from 'viem';
import { BlockchainAdapter, ContractCallResult } from './types';
export declare class EthersAdapter implements BlockchainAdapter {
    private provider;
    private signer?;
    constructor(provider: ethers.Provider, signer?: ethers.Signer);
    getProvider(): ethers.Provider;
    getSigner(): ethers.Signer | undefined;
    call<T = unknown>(contractAddress: Address, abi: Abi, functionName: string, args?: readonly unknown[]): Promise<T>;
    send(contractAddress: Address, abi: Abi, functionName: string, args?: readonly unknown[], overrides?: {
        value?: bigint;
        gas?: bigint;
        gasPrice?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        nonce?: number;
        account?: Address;
        chain?: any;
    }): Promise<ContractCallResult>;
    encodeFunctionData(contractAddress: Address, abi: Abi, functionName: string, args?: readonly unknown[]): Promise<Hex>;
    getAddress(): Promise<Address | null>;
    getChainId(): Promise<number>;
    signMessage(message: string | Uint8Array): Promise<Hex>;
    signTypedData<TTypedData extends Record<string, unknown>>(domain: any, types: any, value: TTypedData): Promise<Hex>;
}
//# sourceMappingURL=ethers.d.ts.map