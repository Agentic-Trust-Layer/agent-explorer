/**
 * Viem-based AccountProvider implementation
 * Implements ReadClient, Signer, and TxSender using Viem
 */
import { getAddress, } from 'viem';
/**
 * Viem-based AccountProvider
 * Composes ReadClient, Signer, and TxSender using Viem clients
 */
export class ViemAccountProvider {
    publicClient;
    walletClient;
    account;
    chainConfig;
    constructor(options) {
        this.publicClient = options.publicClient;
        this.walletClient = options.walletClient ?? null;
        this.account = options.account;
        this.chainConfig = options.chainConfig;
        // Extract account from walletClient if available
        if (this.walletClient && 'account' in this.walletClient && this.walletClient.account) {
            this.account = this.walletClient.account;
        }
    }
    // ChainConfig
    chain() {
        return this.chainConfig;
    }
    // ReadClient implementation
    async chainId() {
        return this.publicClient.getChainId();
    }
    async call(args) {
        const cleanFunctionName = args.functionName.includes('(')
            ? args.functionName.substring(0, args.functionName.indexOf('('))
            : args.functionName;
        const result = await this.publicClient.readContract({
            address: args.to,
            abi: args.abi,
            functionName: cleanFunctionName,
            args: args.args,
            blockTag: args.blockTag,
        });
        return result;
    }
    async getBlockNumber() {
        return this.publicClient.getBlockNumber();
    }
    async getBlock(blockTag) {
        const tag = blockTag === undefined ? 'latest' : (typeof blockTag === 'bigint' ? blockTag : blockTag);
        return this.publicClient.getBlock({ blockTag: tag });
    }
    async getTransactionCount(address, blockTag = 'pending') {
        return this.publicClient.getTransactionCount({ address, blockTag });
    }
    async estimateGas(args) {
        return this.publicClient.estimateGas({
            account: args.account || (await this.getAddress()),
            to: args.to,
            data: args.data,
            value: args.value,
        });
    }
    async getGasPrice() {
        return this.publicClient.getGasPrice();
    }
    async encodeFunctionData(args) {
        const { encodeFunctionData } = await import('viem');
        const cleanFunctionName = args.functionName.includes('(')
            ? args.functionName.substring(0, args.functionName.indexOf('('))
            : args.functionName;
        return encodeFunctionData({
            abi: args.abi,
            functionName: cleanFunctionName,
            args: args.args,
        });
    }
    // Signer implementation
    async getAddress() {
        if (!this.walletClient) {
            throw new Error('Wallet client required for signing. Provide walletClient when creating the provider.');
        }
        if (this.account) {
            if (typeof this.account === 'string') {
                return await getAddress(this.account);
            }
            return this.account.address;
        }
        if (this.walletClient && 'account' in this.walletClient && this.walletClient.account) {
            const account = this.walletClient.account;
            return typeof account === 'string' ? await getAddress(account) : account.address;
        }
        throw new Error('No account available for signing. Provide account in walletClient or constructor.');
    }
    async signMessage(message) {
        if (!this.walletClient) {
            throw new Error('Wallet client required for signing. Provide walletClient when creating the provider.');
        }
        const account = await this.getAddress();
        const accountObj = this.account
            ? (typeof this.account === 'string' ? null : this.account)
            : (this.walletClient.account || null);
        if (!accountObj) {
            throw new Error('Account object required for signing. Provide account in walletClient.');
        }
        return this.walletClient.signMessage({
            account: accountObj,
            message: typeof message === 'string' ? message : { raw: message },
        });
    }
    async signTypedData(args) {
        if (!this.walletClient) {
            throw new Error('Wallet client required for signing. Provide walletClient when creating the provider.');
        }
        const accountObj = this.account
            ? (typeof this.account === 'string' ? null : this.account)
            : (this.walletClient.account || null);
        if (!accountObj) {
            throw new Error('Account object required for signing. Provide account in walletClient.');
        }
        return this.walletClient.signTypedData({
            account: accountObj,
            domain: args.domain,
            types: args.types,
            primaryType: args.primaryType,
            message: args.message,
        });
    }
    async isContractSigner() {
        // Check if address is a contract (has code)
        try {
            const address = await this.getAddress();
            const code = await this.publicClient.getBytecode({ address });
            return code !== undefined && code !== '0x';
        }
        catch {
            return false;
        }
    }
    // TxSender implementation
    async send(tx, opts) {
        if (!this.walletClient) {
            throw new Error('Wallet client required for sending transactions. Provide walletClient when creating the provider.');
        }
        const account = await this.getAddress();
        const accountObj = this.account
            ? (typeof this.account === 'string' ? null : this.account)
            : (this.walletClient.account || null);
        if (!accountObj) {
            throw new Error('Account object required for sending. Provide account in walletClient.');
        }
        // Simulate if requested (using estimateGas for basic validation)
        if (opts?.simulation !== false) {
            try {
                await this.estimateGas({
                    to: tx.to,
                    data: tx.data,
                    value: tx.value,
                    account: accountObj.address,
                });
            }
            catch (simError) {
                console.warn('Transaction simulation failed:', simError);
                // Continue anyway if simulation fails
            }
        }
        // Prepare transaction request
        const request = {
            account: accountObj,
            to: tx.to,
            data: tx.data,
            value: tx.value || 0n,
        };
        if (tx.gas) {
            request.gas = tx.gas;
        }
        if (tx.maxFeePerGas) {
            request.maxFeePerGas = tx.maxFeePerGas;
        }
        if (tx.maxPriorityFeePerGas) {
            request.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
        }
        if (tx.gasPrice) {
            request.gasPrice = tx.gasPrice;
        }
        if (tx.nonce !== undefined) {
            request.nonce = tx.nonce;
        }
        // Send transaction
        // Use sendTransaction since data is already encoded (not writeContract which expects ABI)
        const hash = await this.walletClient.sendTransaction({
            ...request,
            chain: this.walletClient.chain,
        });
        // Wait for receipt
        const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
        // Parse events if ABI is available (would need to be passed in metadata)
        const events = [];
        // Events parsing would require ABI from metadata - simplified for now
        return {
            hash,
            kind: 'tx',
            blockNumber: receipt.blockNumber,
            receipt,
            events,
        };
    }
    async sendBatch(txs, opts) {
        // For EOA, send sequentially
        // For AA, this would be a single UserOperation with multiple calls
        // For now, implement sequential sends
        if (txs.length === 0) {
            throw new Error('Cannot send empty batch');
        }
        if (txs.length === 1) {
            return this.send(txs[0], opts);
        }
        // Sequential sends (could be optimized with multicall or AA)
        let lastResult = null;
        for (const tx of txs) {
            lastResult = await this.send(tx, opts);
        }
        if (!lastResult) {
            throw new Error('Batch send failed');
        }
        return lastResult;
    }
}
//# sourceMappingURL=ViemAccountProvider.js.map