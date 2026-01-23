/**
 * Viem adapter implementation
 * Viem is a modern TypeScript-first Ethereum library
 */
import { decodeEventLog, encodeFunctionData as viemEncodeFunctionData, getAddress, } from 'viem';
export class ViemAdapter {
    publicClient;
    walletClient;
    account;
    constructor(publicClientOrOptions, walletClient, account) {
        // Support both constructor patterns
        if (publicClientOrOptions && typeof publicClientOrOptions === 'object' && 'publicClient' in publicClientOrOptions) {
            // Options pattern
            this.publicClient = publicClientOrOptions.publicClient;
            this.walletClient = publicClientOrOptions.walletClient ?? null;
            // Extract account from walletClient if available
            if (this.walletClient && 'account' in this.walletClient && this.walletClient.account) {
                this.account = this.walletClient.account;
            }
        }
        else {
            // Legacy pattern
            this.publicClient = publicClientOrOptions;
            this.walletClient = walletClient ?? null;
            this.account = account;
        }
    }
    async call(contractAddress, abi, functionName, args) {
        // Strip function signature if present (ethers format compatibility)
        // Viem auto-matches based on args, ethers uses "functionName(types)"
        const cleanFunctionName = functionName.includes('(')
            ? functionName.substring(0, functionName.indexOf('('))
            : functionName;
        // ABI is already in proper JSON format, use directly
        const result = await this.publicClient.readContract({
            address: contractAddress,
            abi: abi,
            functionName: cleanFunctionName,
            args: args,
        });
        return result;
    }
    async send(contractAddress, abi, functionName, args, overrides) {
        if (!this.walletClient) {
            throw new Error('Wallet client required for write operations. Provide walletClient (not private key) when creating the adapter.');
        }
        // Use override account if provided, otherwise use configured account
        // walletClient can provide account from wallet provider (MetaMask, Web3Auth, etc.)
        // No private key needed - walletClient handles signing via wallet provider
        const account = overrides?.account
            ? (await getAddress(overrides.account))
            : (this.account
                ? (typeof this.account === 'string' ? await getAddress(this.account) : this.account)
                : (this.walletClient && 'account' in this.walletClient && this.walletClient.account
                    ? (typeof this.walletClient.account === 'string'
                        ? await getAddress(this.walletClient.account)
                        : this.walletClient.account)
                    : null));
        if (!account) {
            throw new Error('Account required for write operations. Provide account in walletClient (e.g., from MetaMask/Web3Auth wallet provider), constructor, or overrides.');
        }
        // Strip function signature if present (ethers format compatibility)
        const cleanFunctionName = functionName.includes('(')
            ? functionName.substring(0, functionName.indexOf('('))
            : functionName;
        // Build request options
        const requestOptions = {
            address: contractAddress,
            abi: abi,
            functionName: cleanFunctionName,
            args: args,
            account,
        };
        // Add override values
        if (overrides?.value !== undefined) {
            requestOptions.value = overrides.value;
        }
        if (overrides?.gas !== undefined) {
            requestOptions.gas = overrides.gas;
        }
        if (overrides?.maxFeePerGas !== undefined) {
            requestOptions.maxFeePerGas = overrides.maxFeePerGas;
        }
        if (overrides?.maxPriorityFeePerGas !== undefined) {
            requestOptions.maxPriorityFeePerGas = overrides.maxPriorityFeePerGas;
        }
        if (overrides?.nonce !== undefined) {
            requestOptions.nonce = overrides.nonce;
        }
        // Simulate the transaction first
        console.info('Simulating transaction...');
        const { request } = await this.publicClient.simulateContract(requestOptions);
        // Write the transaction
        // walletClient.writeContract should sign locally when account is set on walletClient
        console.info('Writing transaction...');
        // Use override chain if provided, otherwise use walletClient's chain
        const chain = overrides?.chain || this.walletClient.chain;
        // Remove account from request if walletClient already has account configured
        // This ensures Viem signs locally using walletClient's account
        const { account: _, ...requestWithoutAccount } = request;
        const hash = await this.walletClient.writeContract({
            ...requestWithoutAccount,
            chain,
            // Don't pass account here - let walletClient use its configured account or the one we determined
        });
        // Wait for transaction receipt
        console.info('Waiting for transaction receipt...');
        const receipt = await this.publicClient.waitForTransactionReceipt({
            hash,
        });
        // Parse events from the receipt
        console.info('Parsing events from receipt...');
        const events = [];
        for (const log of receipt.logs) {
            try {
                const decoded = decodeEventLog({
                    abi: abi,
                    data: log.data,
                    topics: log.topics,
                });
                events.push({
                    name: decoded.eventName,
                    args: decoded.args,
                });
            }
            catch {
                // Skip logs that can't be decoded with this ABI
            }
        }
        return {
            hash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
            receipt,
            events,
        };
    }
    async encodeFunctionData(contractAddress, abi, functionName, args) {
        // Strip function signature if present (ethers format compatibility)
        const cleanFunctionName = functionName.includes('(')
            ? functionName.substring(0, functionName.indexOf('('))
            : functionName;
        // Encode the function call data
        const encoded = viemEncodeFunctionData({
            abi: abi,
            functionName: cleanFunctionName,
            args: args,
        });
        return encoded;
    }
    async getAddress() {
        if (!this.account) {
            // Try to get from walletClient if available
            if (this.walletClient && 'account' in this.walletClient && this.walletClient.account) {
                const account = this.walletClient.account;
                return typeof account === 'string' ? await getAddress(account) : account.address;
            }
            return null;
        }
        // Handle both Account objects and raw addresses
        if (typeof this.account === 'string') {
            return await getAddress(this.account);
        }
        return this.account.address;
    }
    async getChainId() {
        const chainId = await this.publicClient.getChainId();
        return chainId;
    }
    async signMessage(message) {
        if (!this.walletClient) {
            throw new Error('Wallet client required for signing. Provide walletClient (not private key) when creating the adapter.');
        }
        // Determine account to use - walletClient can provide account from wallet provider (MetaMask, etc.)
        const account = this.account
            ? (typeof this.account === 'string' ? await getAddress(this.account) : this.account)
            : (this.walletClient.account || null);
        if (!account) {
            throw new Error('Account required for signing. Provide account in walletClient (e.g., from MetaMask/Web3Auth wallet provider) or constructor.');
        }
        // walletClient.signMessage works with wallet providers (MetaMask, Web3Auth, etc.)
        // No private key needed - the wallet provider handles signing
        const signature = await this.walletClient.signMessage({
            account,
            message: typeof message === 'string' ? message : { raw: message },
        });
        return signature;
    }
    async signTypedData(domain, types, value) {
        if (!this.walletClient) {
            throw new Error('Wallet client required for signing. Provide walletClient (not private key) when creating the adapter.');
        }
        // Determine account to use - walletClient can provide account from wallet provider (MetaMask, etc.)
        const account = this.account
            ? (typeof this.account === 'string' ? await getAddress(this.account) : this.account)
            : (this.walletClient.account || null);
        if (!account) {
            throw new Error('Account required for signing. Provide account in walletClient (e.g., from MetaMask/Web3Auth wallet provider) or constructor.');
        }
        const primaryType = Object.keys(types)[0];
        if (!primaryType) {
            throw new Error('Types object must have at least one key for primaryType');
        }
        const signature = await this.walletClient.signTypedData({
            account,
            domain,
            types,
            primaryType, // Viem requires primaryType
            message: value,
        });
        return signature;
    }
}
//# sourceMappingURL=viem.js.map