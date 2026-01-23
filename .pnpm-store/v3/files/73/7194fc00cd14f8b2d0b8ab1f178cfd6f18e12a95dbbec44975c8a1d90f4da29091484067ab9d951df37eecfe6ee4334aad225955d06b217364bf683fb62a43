/**
 * IPFS Storage Implementation
 *
 * Consolidated IPFS client for uploading and retrieving data
 * Supports Pinata, Web3.Storage, and multiple IPFS gateways
 * Handles inline data URIs, CID extraction, and gateway fallbacks
 */
export interface IPFSConfig {
    /**
     * Pinata JWT token (preferred, defaults to PINATA_JWT env var)
     */
    pinataJwt?: string;
    /**
     * Pinata API key (alternative to JWT)
     */
    pinataApiKey?: string;
    /**
     * Pinata API secret (required if using API key)
     */
    pinataApiSecret?: string;
    /**
     * Web3.Storage token (optional, fallback)
     */
    web3StorageToken?: string;
    /**
     * Custom IPFS gateway URL (optional, for uploads)
     */
    gatewayUrl?: string;
    /**
     * IPFS API endpoint (optional, for direct IPFS node access)
     */
    ipfsApiUrl?: string;
    /**
     * Request timeout in milliseconds (default: 10000)
     */
    timeout?: number;
}
export interface UploadResult {
    /**
     * Content Identifier (CID) of the uploaded content
     */
    cid: string;
    /**
     * URL to access the content via IPFS gateway
     */
    url: string;
    /**
     * Token URI format (ipfs://CID)
     */
    tokenUri: string;
    /**
     * Size of the uploaded content in bytes
     */
    size?: number;
}
export interface IPFSStorage {
    /**
     * Upload data to IPFS
     * @param data - Data to upload (string, Blob, File, or File-like object)
     * @param filename - Optional filename for the upload
     * @returns Upload result with CID, URL, and tokenUri
     */
    upload(data: string | Blob | File | ArrayBuffer, filename?: string): Promise<UploadResult>;
    /**
     * Retrieve data from IPFS by CID or tokenUri
     * @param cidOrTokenUri - CID, tokenUri (ipfs://CID), or full gateway URL
     * @returns The retrieved data as Blob
     */
    get(cidOrTokenUri: string): Promise<Blob>;
    /**
     * Retrieve JSON data from IPFS by CID or tokenUri
     * Supports inline data URIs, multiple gateways, and fallbacks
     * @param tokenUri - tokenUri (ipfs://CID), full gateway URL, or data URI
     * @returns Parsed JSON data or null if not found
     */
    getJson(tokenUri: string | null): Promise<any | null>;
    /**
     * Get URL for accessing content via IPFS gateway
     * @param cidOrTokenUri - CID, tokenUri (ipfs://CID), or full gateway URL
     * @returns URL string
     */
    getUrl(cidOrTokenUri: string): string;
}
/**
 * Create IPFS storage instance
 */
export declare function createIPFSStorage(config: IPFSConfig): IPFSStorage;
/**
 * Get or create default IPFS storage instance (singleton)
 * Initializes from environment variables, defaults to Pinata
 */
export declare function getIPFSStorage(): IPFSStorage;
/**
 * Check if IPFS storage is initialized
 */
export declare function isIPFSStorageInitialized(): boolean;
/**
 * Reset default IPFS storage instance (useful for testing)
 */
export declare function resetIPFSStorage(): void;
//# sourceMappingURL=ipfs.d.ts.map