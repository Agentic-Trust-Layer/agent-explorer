/**
 * Ethers.js v6 adapter implementation
 */
import { Contract } from 'ethers';
export class EthersAdapter {
    provider;
    signer;
    constructor(provider, signer) {
        this.provider = provider;
        this.signer = signer;
    }
    // Public getters to access the private provider and signer
    getProvider() {
        return this.provider;
    }
    getSigner() {
        return this.signer;
    }
    async call(contractAddress, abi, functionName, args) {
        const contract = new Contract(contractAddress, abi, this.provider);
        const fn = contract[functionName];
        if (!fn || typeof fn !== 'function') {
            throw new Error(`Function ${functionName} not found in contract`);
        }
        return await fn(...(args || []));
    }
    async send(contractAddress, abi, functionName, args, overrides) {
        if (!this.signer) {
            throw new Error('Signer required for write operations');
        }
        const contract = new Contract(contractAddress, abi, this.signer);
        const fn = contract[functionName];
        if (!fn || typeof fn !== 'function') {
            throw new Error(`Function ${functionName} not found in contract`);
        }
        // Build transaction options from overrides
        const txOptions = {};
        if (overrides?.value !== undefined) {
            txOptions.value = overrides.value;
        }
        if (overrides?.gas !== undefined) {
            txOptions.gasLimit = overrides.gas;
        }
        if (overrides?.gasPrice !== undefined) {
            txOptions.gasPrice = overrides.gasPrice;
        }
        if (overrides?.maxFeePerGas !== undefined) {
            txOptions.maxFeePerGas = overrides.maxFeePerGas;
        }
        if (overrides?.maxPriorityFeePerGas !== undefined) {
            txOptions.maxPriorityFeePerGas = overrides.maxPriorityFeePerGas;
        }
        if (overrides?.nonce !== undefined) {
            txOptions.nonce = overrides.nonce;
        }
        const tx = await fn(...(args || []), Object.keys(txOptions).length > 0 ? txOptions : undefined);
        if (!tx || typeof tx.wait !== 'function') {
            throw new Error('Transaction failed to be created');
        }
        const receipt = await tx.wait();
        // Parse events from the receipt
        const events = [];
        if (receipt && receipt.logs) {
            for (const log of receipt.logs) {
                try {
                    const parsed = contract.interface.parseLog({
                        topics: [...log.topics],
                        data: log.data,
                    });
                    if (parsed) {
                        events.push({
                            name: parsed.name,
                            args: parsed.args,
                        });
                    }
                }
                catch (error) {
                    // Skip logs that don't match this contract's ABI
                    // This is normal for logs from other contracts
                }
            }
        }
        return {
            hash: receipt.hash,
            blockNumber: BigInt(receipt.blockNumber),
            receipt,
            events,
            // Legacy support - also include txHash for backward compatibility
            txHash: receipt.hash,
        };
    }
    async encodeFunctionData(contractAddress, abi, functionName, args) {
        const contract = new Contract(contractAddress, abi);
        const iface = contract.interface;
        // Strip function signature if present
        const cleanFunctionName = functionName.includes('(')
            ? functionName.substring(0, functionName.indexOf('('))
            : functionName;
        const encoded = iface.encodeFunctionData(cleanFunctionName, args || []);
        return encoded;
    }
    async getAddress() {
        if (!this.signer) {
            return null;
        }
        return (await this.signer.getAddress());
    }
    async getChainId() {
        const network = await this.provider.getNetwork();
        return Number(network.chainId);
    }
    async signMessage(message) {
        if (!this.signer) {
            throw new Error('Signer required for signing');
        }
        return (await this.signer.signMessage(message));
    }
    async signTypedData(domain, types, value) {
        if (!this.signer) {
            throw new Error('Signer required for signing');
        }
        // Check if signer supports signTypedData (Wallet does, but not all signers)
        if ('signTypedData' in this.signer && typeof this.signer.signTypedData === 'function') {
            return (await this.signer.signTypedData(domain, types, value));
        }
        throw new Error('Signer does not support EIP-712 typed data signing');
    }
}
//# sourceMappingURL=ethers.js.map