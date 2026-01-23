/**
 * Adapter interface for blockchain interactions
 * Allows SDK to work with any blockchain library (ethers, viem, etc.)
 */
import type { Abi, Address, Hex, PublicClient, WalletClient, Chain, Transport, Account } from 'viem';
export type ContractCallResult = {
    hash: Hex;
    blockNumber?: bigint;
    receipt?: any;
    events?: any[];
    [key: string]: any;
};
export interface BlockchainAdapter {
    /**
     * Call a read-only contract function (no signature required)
     * @param contractAddress - The contract address
     * @param abi - The contract ABI
     * @param functionName - The function name to call
     * @param args - Optional function arguments
     * @returns The result of the contract call
     */
    call<T = unknown>(contractAddress: Address, abi: Abi, functionName: string, args?: readonly unknown[]): Promise<T>;
    /**
     * Send a transaction to a contract function (requires signature)
     * @param contractAddress - The contract address
     * @param abi - The contract ABI
     * @param functionName - The function name to call
     * @param args - Optional function arguments
     * @param overrides - Optional transaction overrides (value, gas, account, etc.)
     * @returns Transaction result with hash
     */
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
    /**
     * Encode function call data (requires nothing, just encoding)
     * @param contractAddress - The contract address (for validation, may be optional)
     * @param abi - The contract ABI
     * @param functionName - The function name to encode
     * @param args - Optional function arguments
     * @returns Encoded function call data as hex string
     */
    encodeFunctionData(contractAddress: Address, abi: Abi, functionName: string, args?: readonly unknown[]): Promise<Hex>;
    /**
     * Current signer/wallet address (null in read-only mode)
     * @returns The address of the current signer, or null if no signer
     */
    getAddress(): Promise<Address | null>;
    /**
     * Get chain id
     * @returns The current chain ID
     */
    getChainId(): Promise<number>;
    /**
     * Sign a message (EIP-191). If no wallet, throws
     * @param message - The message to sign (string or Uint8Array)
     * @returns The signature as hex string
     */
    signMessage(message: string | Uint8Array): Promise<Hex>;
    /**
     * Sign typed data (EIP-712). If no wallet, throws
     * @param domain - The EIP-712 domain
     * @param types - The EIP-712 types
     * @param value - The value to sign
     * @returns The signature as hex string
     */
    signTypedData<TTypedData extends Record<string, unknown>>(domain: any, types: any, value: TTypedData): Promise<Hex>;
}
export type ViemAdapterOptions = {
    publicClient: PublicClient;
    walletClient?: WalletClient<Transport, Chain, Account> | null;
};
//# sourceMappingURL=types.d.ts.map