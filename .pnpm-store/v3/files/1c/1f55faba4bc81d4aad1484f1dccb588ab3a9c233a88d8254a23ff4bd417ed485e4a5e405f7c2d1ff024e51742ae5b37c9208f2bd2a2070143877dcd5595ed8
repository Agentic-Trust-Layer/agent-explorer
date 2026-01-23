/**
 * Identity Client for ERC-8004
 * Handles agent registration and identity management
 */
import IdentityRegistryABI from './abis/IdentityRegistry.json';
export class IdentityClient {
    adapter;
    contractAddress;
    constructor(adapter, contractAddress) {
        this.adapter = adapter;
        this.contractAddress = contractAddress;
    }
    /**
     * Register a new agent with no URI (URI can be set later)
     * Spec: function register() returns (uint256 agentId)
     */
    async register() {
        const result = await this.adapter.send(this.contractAddress, IdentityRegistryABI, 'register', []);
        // Parse agentId from receipt logs
        // This is implementation-agnostic - we just need to find the Registered event
        const agentId = this.extractAgentIdFromReceipt(result);
        return {
            agentId,
            txHash: result.hash || result.txHash,
        };
    }
    /**
     * Register a new agent with a token URI
     * Spec: function register(string tokenURI) returns (uint256 agentId)
     * @param tokenUri - URI pointing to agent registration file (MAY use ipfs://, https://, etc.)
     */
    async registerWithURI(tokenUri) {
        const result = await this.adapter.send(this.contractAddress, IdentityRegistryABI, 'register(string)', [tokenUri]);
        const agentId = this.extractAgentIdFromReceipt(result);
        return {
            agentId,
            txHash: result.hash || result.txHash,
        };
    }
    /**
     * Register a new agent with URI and optional on-chain metadata
     * Spec: function register(string tokenURI, MetadataEntry[] calldata metadata) returns (uint256 agentId)
     * @param tokenUri - URI pointing to agent registration file
     * @param metadata - OPTIONAL on-chain metadata entries
     */
    async registerWithMetadata(tokenUri, metadata = []) {
        console.log('********************* registerWithMetadata: metadata', metadata);
        // Convert metadata to contract format
        // For viem, bytes need to be hex strings, not Uint8Array
        const metadataFormatted = metadata.map(m => {
            const bytes = this.stringToBytes(m.value);
            // Convert Uint8Array to hex string for viem compatibility
            const hexString = this.bytesToHex(bytes);
            return {
                key: m.key,
                value: hexString
            };
        });
        console.log('********************* registerWithMetadata: metadataFormatted', metadataFormatted);
        const result = await this.adapter.send(this.contractAddress, IdentityRegistryABI, 'register(string,(string,bytes)[])', [tokenUri, metadataFormatted]);
        const agentId = this.extractAgentIdFromReceipt(result);
        return {
            agentId,
            txHash: result.hash || result.txHash,
        };
    }
    /**
     * Get the token URI for an agent
     * Spec: Standard ERC-721 tokenURI function
     * @param agentId - The agent's ID
     * @returns URI string (MAY be ipfs://, https://, etc.)
     */
    async getTokenURI(agentId) {
        console.log('********************* getTokenURI: agentId', agentId);
        return await this.adapter.call(this.contractAddress, IdentityRegistryABI, 'tokenURI', [agentId]);
    }
    /**
     * Set the token URI for an agent
     * Note: This is an implementation-specific extension (not in base spec).
     * Assumes implementation exposes setAgentUri with owner/operator checks.
     * @param agentId - The agent's ID
     * @param uri - New URI string
     */
    async setAgentUri(agentId, uri) {
        const result = await this.adapter.send(this.contractAddress, IdentityRegistryABI, 'setAgentUri', [agentId, uri]);
        return { txHash: result.hash || result.txHash };
    }
    /**
     * Get the owner of an agent
     * Spec: Standard ERC-721 ownerOf function
     * @param agentId - The agent's ID
     */
    async getOwner(agentId) {
        return await this.adapter.call(this.contractAddress, IdentityRegistryABI, 'ownerOf', [agentId]);
    }
    /**
     * Get on-chain metadata for an agent
     * Spec: function getMetadata(uint256 agentId, string key) returns (bytes)
     * @param agentId - The agent's ID
     * @param key - Metadata key
     */
    async getMetadata(agentId, key) {
        const bytes = await this.adapter.call(this.contractAddress, IdentityRegistryABI, 'getMetadata', [agentId, key]);
        return this.bytesToString(bytes);
    }
    /**
     * Set on-chain metadata for an agent
     * Spec: function setMetadata(uint256 agentId, string key, bytes value)
     * @param agentId - The agent's ID
     * @param key - Metadata key
     * @param value - Metadata value
     */
    async setMetadata(agentId, key, value) {
        const result = await this.adapter.send(this.contractAddress, IdentityRegistryABI, 'setMetadata', [agentId, key, this.stringToBytes(value)]);
        return { txHash: result.hash || result.txHash };
    }
    /**
     * Fetch and parse the agent registration file from the token URI
     * This is a convenience function that fetches the URI and parses it
     * Note: Does not validate - spec says ERC-8004 cannot cryptographically guarantee
     * that advertised capabilities are functional
     * @param agentId - The agent's ID
     */
    async getRegistrationFile(agentId) {
        const uri = await this.getTokenURI(agentId);
        console.log('********************* getRegistrationFile: uri', uri);
        // Handle different URI schemes
        if (uri.startsWith('ipfs://')) {
            // IPFS gateway - implementation specific, using public gateway
            const cid = uri.replace('ipfs://', '');
            const httpUri = `https://ipfs.io/ipfs/${cid}`;
            const response = await fetch(httpUri);
            return await response.json();
        }
        else if (uri.startsWith('https://') || uri.startsWith('http://')) {
            const response = await fetch(uri);
            return await response.json();
        }
        else {
            throw new Error(`Unsupported URI scheme: ${uri}`);
        }
    }
    /**
     * Helper: Extract agentId from transaction receipt
     * Looks for the Registered event which contains the agentId
     */
    extractAgentIdFromReceipt(result) {
        // Look for Registered event in parsed events
        if (result.events && result.events.length > 0) {
            const registeredEvent = result.events.find((e) => e.name === 'Registered');
            if (registeredEvent && registeredEvent.args) {
                return BigInt(registeredEvent.args.agentId || registeredEvent.args[0]);
            }
        }
        throw new Error('Could not extract agentId from transaction receipt - Registered event not found. ' +
            'This usually means the contract is not deployed or the ABI does not match the deployed contract.');
    }
    /**
     * Helper: Convert string to bytes (adapter-agnostic)
     */
    stringToBytes(value) {
        return new TextEncoder().encode(value);
    }
    /**
     * Helper: Convert bytes to string (adapter-agnostic)
     */
    bytesToString(bytes) {
        if (bytes instanceof Uint8Array) {
            return new TextDecoder().decode(bytes);
        }
        // Handle hex string format (ethers returns this)
        if (typeof bytes === 'string' && bytes.startsWith('0x')) {
            const hex = bytes.slice(2);
            const arr = new Uint8Array(hex.length / 2);
            for (let i = 0; i < hex.length; i += 2) {
                arr[i / 2] = parseInt(hex.slice(i, i + 2), 16);
            }
            return new TextDecoder().decode(arr);
        }
        return bytes.toString();
    }
    /**
     * Helper: Convert Uint8Array to hex string (for viem compatibility)
     */
    bytesToHex(bytes) {
        return '0x' + Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}
//# sourceMappingURL=IdentityClient.js.map