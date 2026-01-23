export interface ParsedEthrDid {
    /**
     * Decoded ETHR DID without URL encoding (e.g. did:ethr:11155111:0x1234...)
     */
    did: string;
    /**
     * DID method – always "ethr"
     */
    method: 'ethr';
    /**
     * Chain id component parsed as a number
     */
    chainId: number;
    /**
     * Account address component
     */
    account: `0x${string}`;
    /**
     * Encoded DID string suitable for use in URLs
     */
    encoded: string;
}
/**
 * Parse a did:ethr identifier.
 *
 * Accepts encoded or decoded strings and supports:
 *   did:ethr:chainId:0x..., did:ethr:0x...
 */
export declare function parseEthrDid(raw: string | undefined | null): ParsedEthrDid;
export interface BuildEthrDidOptions {
    /**
     * When true (default) the resulting DID is URI-encoded.
     */
    encode?: boolean;
}
/**
 * Build a did:ethr identifier from chain id and account address.
 */
export declare function buildEthrDid(chainId: number | string, account: `0x${string}`, options?: BuildEthrDidOptions): string;
//# sourceMappingURL=didEthr.d.ts.map