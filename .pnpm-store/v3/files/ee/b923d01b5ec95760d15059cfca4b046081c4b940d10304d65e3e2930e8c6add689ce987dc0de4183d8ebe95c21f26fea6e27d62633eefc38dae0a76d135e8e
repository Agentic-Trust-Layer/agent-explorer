/**
 * ERC-8004 Trustless Agents Client
 *
 * This SDK makes ZERO assumptions about implementations beyond what the spec says.
 * All "MAY" fields in the spec are treated as optional, not mandatory.
 *
 * Uses adapter pattern to support any blockchain library (ethers, viem, etc.)
 *
 * Usage example:
 * ```typescript
 * import { ERC8004Client, EthersAdapter } from 'erc-8004-js';
 * import { ethers } from 'ethers';
 *
 * const provider = new ethers.JsonRpcProvider('http://localhost:8545');
 * const signer = await provider.getSigner();
 * const adapter = new EthersAdapter(provider, signer);
 *
 * const client = new ERC8004Client({
 *   adapter,
 *   addresses: {
 *     identityRegistry: '0x...',
 *     reputationRegistry: '0x...',
 *     validationRegistry: '0x...',
 *     chainId: 31337
 *   }
 * });
 * ```
 */
import { BlockchainAdapter } from './adapters/types';
import { IdentityClient } from './IdentityClient';
import { ReputationClient } from './ReputationClient';
import { ValidationClient } from './ValidationClient';
export interface ERC8004Config {
    adapter: BlockchainAdapter;
    addresses: {
        identityRegistry: string;
        reputationRegistry: string;
        validationRegistry: string;
        chainId: number;
    };
}
export declare class ERC8004Client {
    identity: IdentityClient;
    reputation: ReputationClient;
    validation: ValidationClient;
    private adapter;
    private addresses;
    constructor(config: ERC8004Config);
    /**
     * Get the current signer/wallet address
     * Returns null if no signer configured (read-only mode)
     */
    getAddress(): Promise<string | null>;
    /**
     * Get the chain ID
     */
    getChainId(): Promise<number>;
    /**
     * Get the configured contract addresses
     */
    getAddresses(): {
        identityRegistry: string;
        reputationRegistry: string;
        validationRegistry: string;
        chainId: number;
    };
}
//# sourceMappingURL=ERC8004Client.d.ts.map