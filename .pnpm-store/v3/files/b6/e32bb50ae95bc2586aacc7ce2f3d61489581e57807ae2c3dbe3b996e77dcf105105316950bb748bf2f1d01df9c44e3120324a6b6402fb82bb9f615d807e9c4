/**
 * Ports & Adapters Architecture for Chain I/O
 *
 * Defines stable interfaces (ports) that business logic depends on,
 * independent of how signatures/submissions happen.
 *
 * Based on EIP-1193, EIP-155, ERC-1271, ERC-4337, EIP-712, CAIP-2/10, and viem.
 */
import type { Abi, Address, Hex, Chain } from 'viem';
/**
 * Chain configuration
 */
export type ChainId = number;
export interface ChainConfig {
    id: ChainId;
    rpcUrl: string;
    name: string;
    chain?: Chain;
    bundlerUrl?: string;
    paymasterUrl?: string;
}
/**
 * ReadClient - Safe for server-side use (cacheable, no signatures)
 * Handles all read operations: contract calls, block queries, etc.
 */
export interface ReadClient {
    /**
     * Get the chain ID
     */
    chainId(): Promise<ChainId>;
    /**
     * Read from a contract (view/pure functions)
     */
    call<T = unknown>(args: {
        to: Address;
        abi: Abi;
        functionName: string;
        args?: readonly unknown[];
        blockTag?: 'latest' | 'pending' | bigint;
    }): Promise<T>;
    /**
     * Get current block number
     */
    getBlockNumber(): Promise<bigint>;
    /**
     * Get block data
     */
    getBlock(blockTag?: 'latest' | 'pending' | bigint): Promise<any>;
    /**
     * Get transaction count (nonce) for an address
     */
    getTransactionCount(address: Address, blockTag?: 'pending' | 'latest'): Promise<number>;
    /**
     * Estimate gas for a transaction
     */
    estimateGas(args: {
        to: Address;
        data: Hex;
        value?: bigint;
        account?: Address;
    }): Promise<bigint>;
    /**
     * Get gas price
     */
    getGasPrice(): Promise<bigint>;
    /**
     * Encode function data (offline, no RPC call)
     */
    encodeFunctionData(args: {
        abi: Abi;
        functionName: string;
        args?: readonly unknown[];
    }): Promise<Hex>;
}
/**
 * Signer - Who approves (EOA or ERC-1271 contract wallet)
 * Handles message and typed data signing
 */
export interface Signer {
    /**
     * Get the address that will sign
     * May be EOA (EIP-191/712) or ERC-1271 contract wallet
     */
    getAddress(): Promise<Address>;
    /**
     * Sign a message (EIP-191)
     */
    signMessage(input: string | Uint8Array): Promise<Hex>;
    /**
     * Sign typed data (EIP-712)
     */
    signTypedData<TTypedData extends Record<string, unknown>>(args: {
        domain: any;
        types: any;
        primaryType: string;
        message: TTypedData;
    }): Promise<Hex>;
    /**
     * True if signature can be validated via ERC-1271 on-chain for this address
     */
    isContractSigner(): Promise<boolean>;
}
/**
 * Transaction request
 */
export type TxRequest = {
    to: Address;
    data: Hex;
    value?: bigint;
    gas?: bigint;
    gasPrice?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce?: number;
};
/**
 * Gas policy for transaction submission
 */
export interface GasPolicy {
    mode: 'self' | 'sponsored';
    maxFeePerGasWei?: bigint;
    maxPriorityFeePerGasWei?: bigint;
}
/**
 * Transaction send result
 */
export interface TxSendResult {
    hash: Hex;
    kind: 'tx' | 'userOp';
    blockNumber?: bigint;
    receipt?: any;
    events?: any[];
}
/**
 * TxSender - How submission happens (direct RPC vs AA bundler)
 * Handles transaction submission
 */
export interface TxSender {
    /**
     * Send a single transaction
     * For EOA: returns tx hash after eth_sendRawTransaction
     * For AA: returns userOp hash or eventual tx hash depending on mode
     */
    send(tx: TxRequest, opts?: {
        gasPolicy?: GasPolicy;
        simulation?: boolean;
        metadata?: Record<string, unknown>;
    }): Promise<TxSendResult>;
    /**
     * Optional batch send
     * For AA, becomes a single UserOperation with multiple calls
     * For EOA, can be sequential or batched via multicall
     */
    sendBatch(txs: TxRequest[], opts?: {
        gasPolicy?: GasPolicy;
        simulation?: boolean;
        metadata?: Record<string, unknown>;
    }): Promise<TxSendResult>;
}
/**
 * AccountProvider - Composes ReadClient, Signer, and TxSender
 * Convenience interface that provides all chain operations
 */
export interface AccountProvider extends ReadClient, Signer, TxSender {
    /**
     * Get chain configuration
     */
    chain(): ChainConfig;
}
/**
 * PreparedCall - Serializable transaction plan
 * Server builds this, browser executes it
 */
export type PreparedCall = {
    chainId: ChainId;
    description?: string;
    steps: TxRequest[];
    requiresTypedData?: {
        domain: Record<string, any>;
        types: Record<string, any>;
        message: Record<string, any>;
    };
    constraints?: {
        requireAA?: boolean;
        requireSponsoredGas?: boolean;
        deadline?: number;
    };
};
//# sourceMappingURL=types.d.ts.map